import { useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from './supabase'
import type { CapacityOption } from './types'

export function useAvailability(kind: 'tracks' | 'workshops') {
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: [kind],
    enabled: Boolean(supabase),
    queryFn: async () => {
      if (!supabase) return [] as CapacityOption[]
      const { data, error } = await supabase.from(kind).select('*').order('sort_order')
      if (error) throw error
      return data
    },
    staleTime: 15_000,
  })

  useEffect(() => {
    const client = supabase
    if (!client) return
    const channel = client
      .channel(`${kind}-availability`)
      .on('postgres_changes', { event: '*', schema: 'public', table: kind }, () => {
        void queryClient.invalidateQueries({ queryKey: [kind] })
      })
      .subscribe()
    return () => { void client.removeChannel(channel) }
  }, [kind, queryClient])

  return query
}

export function useCountdown() {
  const target = new Date('2026-10-31T08:00:00+05:30').getTime()
  const now = Date.now()
  const remaining = Math.max(target - now, 0)
  return {
    days: Math.floor(remaining / 86_400_000),
    hours: Math.floor((remaining / 3_600_000) % 24),
    minutes: Math.floor((remaining / 60_000) % 60),
    seconds: Math.floor((remaining / 1_000) % 60),
  }
}
