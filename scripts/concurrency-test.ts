import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL
const anonKey = process.env.SUPABASE_ANON_KEY
const trackSlug = process.env.TEST_TRACK_SLUG
const workshopSlug = process.env.TEST_WORKSHOP_SLUG

if (!url || !anonKey || !trackSlug || !workshopSlug) {
  throw new Error('Set SUPABASE_URL, SUPABASE_ANON_KEY, TEST_TRACK_SLUG and TEST_WORKSHOP_SLUG before running this test.')
}

const client = createClient(url, anonKey)
const anonymousClient = createClient(url, anonKey)

const { data: track, error: trackError } = await client
  .from('tracks')
  .select('id, capacity, registered_count, title')
  .eq('slug', trackSlug)
  .single()
if (trackError) throw new Error(`Cannot load test track: ${trackError.message}`)

const { data: workshop, error: workshopError } = await client
  .from('workshops')
  .select('id, capacity, registered_count, title')
  .eq('slug', workshopSlug)
  .single()
if (workshopError) throw new Error(`Cannot load test workshop: ${workshopError.message}`)

if (track.capacity - track.registered_count !== 5) {
  throw new Error(`Track must have exactly 5 seats left; currently ${track.capacity - track.registered_count}. No test registrations were sent.`)
}
if (workshop.capacity - workshop.registered_count < 5) {
  throw new Error('The selected test workshop needs at least five seats left. No test registrations were sent.')
}

const forbiddenSelect = await anonymousClient.from('registrations').select('id').limit(1)
if (!forbiddenSelect.error) throw new Error('Security check failed: anonymous registration SELECT unexpectedly succeeded.')
const forbiddenInsert = await anonymousClient.from('registrations').insert({})
if (!forbiddenInsert.error) throw new Error('Security check failed: anonymous registration INSERT unexpectedly succeeded.')

const calls = Array.from({ length: 80 }, (_, index) => client.rpc('register_student', {
  p_full_name: `Concurrency Test ${index}`,
  p_email: `congress-capacity-${Date.now()}-${index}@example.invalid`,
  p_phone: '9123456789',
  p_college: 'Concurrency Test College',
  p_stream: 'Computer Science',
  p_year: '1st',
  p_is_ieee_member: false,
  p_ieee_no: null,
  p_dietary: 'veg',
  p_track_id: track.id,
  p_workshop_id: workshop.id,
  p_consent: true,
}))

const results = await Promise.all(calls)
const rpcErrors = results.filter((result) => result.error)
if (rpcErrors.length) throw new Error(`RPC transport failure: ${rpcErrors[0].error?.message}`)
const responses = results.map((result) => result.data as { ok: boolean; code?: string })
const successful = responses.filter((result) => result.ok).length
const fullRejected = responses.filter((result) => result.code === 'TRACK_FULL').length

const { data: finalTrack, error: verifyError } = await client
  .from('tracks')
  .select('capacity, registered_count')
  .eq('id', track.id)
  .single()
if (verifyError) throw new Error(`Cannot verify final track count: ${verifyError.message}`)

console.log(`Track: ${track.title}`)
console.log(`Successful registrations: ${successful}`)
console.log(`TRACK_FULL rejections: ${fullRejected}`)
console.log(`Count after: ${finalTrack.registered_count}/${finalTrack.capacity}`)
console.log('Anonymous SELECT/INSERT: rejected')

if (successful !== 5 || fullRejected !== 75 || finalTrack.registered_count !== finalTrack.capacity) {
  throw new Error('Concurrency acceptance test failed. Inspect test data and database state before retrying.')
}
