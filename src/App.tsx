import { Component, type ErrorInfo, type FormEvent, type ReactNode, useEffect, useMemo, useState } from 'react'
import { Link, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { QRCodeSVG } from 'qrcode.react'
import {
  ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronDown, CircleAlert, Clock3, Download,
  Instagram, Linkedin, MapPin, Menu, Radio, ShieldCheck, Ticket, X,
} from 'lucide-react'
import { agenda, EVENT, faqItems, speakers, teamRoles, tracks, workshops } from './data'
import { useAvailability, useCountdown } from './hooks'
import { supabase } from './supabase'
import type { CapacityOption, RegistrationResult } from './types'

const registrationSchema = z.object({
  full_name: z.string().trim().min(2, 'Enter your full name.').max(120),
  email: z.string().trim().email('Enter a valid email address.').max(254),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number.'),
  college: z.string().trim().min(2, 'Enter your college or organisation.').max(160),
  stream: z.string().trim().min(2, 'Enter your stream or branch.').max(120),
  year_of_study: z.enum(['1st', '2nd', '3rd', '4th', 'PG', 'Working professional']),
  is_ieee_member: z.enum(['yes', 'no']),
  ieee_membership_no: z.string().max(80).optional(),
  track_id: z.string().min(1, 'Choose one track.'),
  workshop_id: z.string().min(1, 'Choose one workshop.'),
  dietary: z.enum(['veg', 'non-veg', 'jain']),
  consent: z.boolean().refine((value) => value, 'Consent is required to register.'),
})

type RegistrationValues = z.infer<typeof registrationSchema>
type TicketInfo = { ticket_code: string; name: string; track: string; workshop: string }
const savedFormKey = 'ieee-congress-registration-draft'
const ticketKey = 'ieee-congress-ticket'

function SiteErrorBoundary({ children }: { children: ReactNode }) {
  const [hasError, setHasError] = useState(false)
  if (hasError) {
    return <main className="container error-page"><CircleAlert /><h1>Something went wrong</h1><p>We couldn’t load this page. Please refresh and try again.</p><button className="button button-primary" onClick={() => window.location.reload()}>Refresh page</button></main>
  }
  return <ErrorCatcher onError={() => setHasError(true)}>{children}</ErrorCatcher>
}

class ErrorCatcher extends Component<{ children: ReactNode; onError: () => void }> {
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Application render error', error, info.componentStack)
    this.props.onError()
  }
  render() { return this.props.children }
}

function Header() {
  const [open, setOpen] = useState(false)
  const items = [['About', '/#about'], ['Agenda', '/agenda'], ['Tracks', '/tracks'], ['Workshops', '/workshops'], ['Speakers', '/speakers']]
  return <header className="site-header">
    <div className="header-inner">
      <Link className="brand" to="/" aria-label="IEEE Pune Section Student Congress home" onClick={() => setOpen(false)}>
        <span className="brand-mark">IEEE</span><span className="brand-divider" /><span className="brand-name">Pune Section<br />Student Congress</span>
      </Link>
      <nav className={open ? 'main-nav nav-open' : 'main-nav'} aria-label="Main navigation">
        {items.map(([label, href]) => <Link key={label} to={href} onClick={() => setOpen(false)}>{label}</Link>)}
        <Link className="button button-nav" to="/register" onClick={() => setOpen(false)}>Register <ArrowUpRight size={15} /></Link>
      </nav>
      <button className="menu-toggle" type="button" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} onClick={() => setOpen(!open)}>
        {open ? <X /> : <Menu />}
      </button>
    </div>
  </header>
}

function Footer() {
  return <footer className="site-footer">
    <div className="container footer-main">
      <div><span className="eyebrow">IEEE PUNE SECTION</span><h2>Build what comes next.</h2><p>{EVENT.name}<br />October 31, 2026 · Pune, India</p></div>
      <div className="footer-links"><Link to="/agenda">Agenda</Link><Link to="/tracks">Tracks</Link><Link to="/workshops">Workshops</Link><Link to="/team">Team</Link><Link to="/faq">FAQ</Link><Link to="/contact">Contact</Link><Link to="/admin">Admin</Link></div>
      <div className="footer-social"><a href="https://www.ieeepune.org" aria-label="IEEE Pune Section website" target="_blank" rel="noreferrer"><ArrowUpRight /></a><a href="https://www.linkedin.com/company/ieee-pune-section" aria-label="IEEE Pune Section on LinkedIn" target="_blank" rel="noreferrer"><Linkedin /></a><a href="https://instagram.com/ieeepune" aria-label="IEEE Pune Section on Instagram" target="_blank" rel="noreferrer"><Instagram /></a></div>
    </div>
    <div className="container footer-bottom"><span>© 2026 IEEE Pune Section Student Congress</span><span>Don't find a job. Create one.</span></div>
  </footer>
}

function Shell({ children }: { children: ReactNode }) {
  return <><Header /><SiteErrorBoundary>{children}</SiteErrorBoundary><Footer /></>
}

function PageIntro({ eyebrow, title, text }: { eyebrow: string; title: ReactNode; text?: string }) {
  return <section className="page-intro container"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1>{text && <p>{text}</p>}</section>
}

function Countdown() {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const timer = window.setInterval(() => setTick((current) => current + 1), 1000)
    return () => window.clearInterval(timer)
  }, [])
  const countdown = useCountdown()
  void tick
  return <div className="countdown" aria-label="Countdown to congress">
    {[['Days', countdown.days], ['Hours', countdown.hours], ['Minutes', countdown.minutes], ['Seconds', countdown.seconds]].map(([label, value]) =>
      <div className="countdown-cell" key={label}><strong>{String(value).padStart(2, '0')}</strong><span>{label}</span></div>)}
  </div>
}

function HomePage() {
  return <>
    <section className="hero">
      <div className="hero-grid" aria-hidden="true" />
      <div className="container hero-content">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }}>
          <div className="hero-meta"><span className="live-dot" /> ONE DAY. ONE BIG SHIFT.</div>
          <h1>Don't find a job.<br /><em>Create one.</em></h1>
          <p className="hero-subtitle">A congress for the ones who would rather build the future than wait for it.</p>
          <div className="hero-actions"><Link className="button button-primary" to="/register">Register Now <ArrowRight size={17} /></Link><Link className="button button-outline" to="/agenda">Explore the agenda <ArrowDown size={16} /></Link></div>
          <div className="hero-facts"><span><Clock3 size={16} /> October 31, 2026</span><span><MapPin size={16} /> Pune, India · Venue TBA</span><span><Ticket size={16} /> 300 students & young professionals</span></div>
        </motion.div>
        <div className="hero-countdown"><div><span className="eyebrow">COUNTING DOWN TO CONGRESS</span><Countdown /></div><span className="hero-countdown-caption">8:00 AM IST · Saturday</span></div>
      </div>
      <a className="scroll-cue" href="#about" aria-label="Scroll to learn about the congress"><span /> SCROLL TO BUILD</a>
    </section>
    <section className="section container about-home" id="about">
      <div className="section-heading"><span className="eyebrow">THE WHY</span><h2>From waiting to<br /><em>building.</em></h2></div>
      <div className="about-copy"><p className="lead">To create a generation of students who don't wait to be chosen, but choose to build.</p><p>The IEEE Pune Section is one of the most active and largest sections in IEEE Region 10 (Asia Pacific), with a strong network of student branches across Pune's leading engineering colleges. It is at the forefront of technical education, professional development and community building across Maharashtra.</p><p>The Student Congress is IEEE Pune Section's flagship annual gathering, bringing together students, industry leaders and startup founders. Open to all students, any stream, branch or year — tech, non-tech, engineering, management, arts and commerce.</p><div className="mission-grid">{['Real exposure to what industry looks like in 2026.', 'Hands-on skills you can use immediately.', 'The mindset of a builder, not just a job seeker.'].map((item, i) => <article className="mission-card" key={item}><span>0{i + 1}</span><h3>{item}</h3></article>)}</div></div>
    </section>
    <section className="feature-band"><div className="container feature-grid"><div><span className="eyebrow">A DAY MADE TO MOVE YOU FORWARD</span><h2>Learn. Build.<br /><em>Make your move.</em></h2><Link to="/agenda" className="text-link">See the full agenda <ArrowRight size={16} /></Link></div><div className="feature-points"><article><strong>01</strong><div><h3>Keynotes & real-world conversations</h3><p>Industry voices, entrepreneurial thinking, and honest stories from people making things happen.</p></div></article><article><strong>02</strong><div><h3>Five parallel tracks</h3><p>Explore quantum computing, data, product, leadership or communication. No prerequisites.</p></div></article><article><strong>03</strong><div><h3>Three hands-on workshops</h3><p>Build an AI agent, work through a Cyber CTF, or take on a real problem with design thinking.</p></div></article></div></div></section>
    <section className="section container"><div className="section-topline"><span className="eyebrow">THE PEOPLE & THE IDEAS</span><Link className="text-link" to="/speakers">Meet the speakers <ArrowRight size={16} /></Link></div><div className="speaker-preview"><article><span className="speaker-initial">PS</span><span className="eyebrow">KEYNOTE 1</span><h3>Mr. Praveen Shukla</h3></article><article><span className="speaker-initial">RJ</span><span className="eyebrow">PANEL MODERATOR</span><h3>Mr. Rakshit Jain</h3></article><article><span className="speaker-initial">FOUNDERS</span><span className="eyebrow">ORIGIN STORIES</span><h3>Five founders under 23</h3></article><article className="speaker-preview-cta"><span className="eyebrow">OCTOBER 31, 2026</span><h3>Be in the room.</h3><Link className="text-link" to="/register">Register now <ArrowRight size={16} /></Link></article></div></section>
    <section className="sponsor-band"><div className="container sponsor-content"><span className="eyebrow">IN GOOD COMPANY</span><p>Sponsor announcements coming soon</p><Link to="/contact">Interested in partnering? <ArrowUpRight size={14} /></Link></div></section>
  </>
}

function SeatBadge({ item }: { item?: CapacityOption }) {
  if (!supabase || !item) return <span className="seat-badge seat-unavailable"><Radio size={14} /> Availability soon</span>
  const remaining = Math.max(item.capacity - item.registered_count, 0)
  const full = remaining === 0
  const filling = remaining <= 10
  return <span className={`seat-badge ${full ? 'seat-full' : filling ? 'seat-filling' : 'seat-available'}`} aria-live="polite">
    {full ? <><X size={14} /> Registration Full</> : <><Radio size={14} /> {filling ? 'Filling fast · ' : ''}{remaining} seats left</>}
  </span>
}

function AvailabilityMessage() {
  return !supabase ? <div className="notice"><CircleAlert size={18} /><span>Live seat availability and registration will be available once the event database is configured.</span></div> : null
}

function AvailabilityCards({ kind }: { kind: 'tracks' | 'workshops' }) {
  const content = kind === 'tracks' ? tracks : workshops
  const { data, isLoading, error } = useAvailability(kind)
  const title = kind === 'tracks' ? 'Parallel tracks' : 'Hands-on workshops'
  const capacityItems = data ?? []
  const isFull = (slug: string) => {
    const item = capacityItems.find((option) => option.slug === slug)
    return Boolean(item && item.registered_count >= item.capacity)
  }
  if (isLoading) return <div className="card-grid">{content.map((item) => <div className="skeleton-card" key={item.slug} aria-label="Loading option" />)}</div>
  return <>
    {error && <div className="notice notice-error"><CircleAlert size={18} />Could not load live availability. Please try again later.</div>}
    <AvailabilityMessage />
    {kind === 'tracks' && capacityItems.length > 0 && capacityItems.every((item) => item.registered_count >= item.capacity) && <div className="notice notice-error">All tracks are full.</div>}
    <div className="card-grid">{content.map((item, index) => {
      const cap = capacityItems.find((option) => option.slug === item.slug)
      const full = isFull(item.slug)
      return <motion.article className={`option-card ${full ? 'option-card-full' : ''}`} key={item.slug} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .055 }}>
        <div className="option-card-top"><span className="eyebrow">{kind === 'tracks' ? `TRACK 0${index + 1}` : `WORKSHOP 0${index + 1}`}</span><SeatBadge item={cap} /></div>
        <h2>{item.title}</h2><p>{item.description}</p>
        {kind === 'tracks' && <Link className="text-link" to={`/tracks/${item.slug}`}>Track details <ArrowRight size={15} /></Link>}
        {full && <span className="full-tag">Registration full</span>}
      </motion.article>
    })}</div>
    <p className="options-note"><Clock3 size={15} /> {title} · {kind === 'tracks' ? '11:00 AM – 12:30 PM · Choose one' : '1:45 – 3:00 PM · Choose one in advance'}</p>
  </>
}

function TracksPage() {
  return <><PageIntro eyebrow="LEARN & DISCOVER · 11:00 AM – 12:30 PM" title={<>Five tracks.<br /><em>One direction: forward.</em></>} text="Choose one parallel track. Each is led by an industry facilitator, and none require prerequisites." /><section className="container section content-section"><AvailabilityCards kind="tracks" /></section></>
}

function TrackDetailPage() {
  const { slug } = useParams()
  const item = tracks.find((track) => track.slug === slug)
  const { data } = useAvailability('tracks')
  const cap = data?.find((option) => option.slug === slug)
  if (!item) return <NotFoundPage />
  return <><PageIntro eyebrow="PARALLEL TRACK · 11:00 AM – 12:30 PM" title={item.title} text={item.description} /><section className="container detail-panel"><SeatBadge item={cap} /><p>No prerequisites. Students choose one track during registration.</p><Link to="/register" className="button button-primary">Choose this track <ArrowRight size={17} /></Link></section></>
}

function WorkshopsPage() {
  return <><PageIntro eyebrow="HANDS-ON · 1:45 – 3:00 PM" title={<>Build something<br /><em>you can take home.</em></>} text="Three hands-on workshops. Choose one in advance when you register." /><section className="container section content-section"><AvailabilityCards kind="workshops" /></section></>
}

function AgendaPage() {
  return <><PageIntro eyebrow="SATURDAY · OCTOBER 31, 2026" title={<>One day to<br /><em>make your move.</em></>} text="Learn & Discover · A day of keynotes, conversations, hands-on sessions and community." /><section className="container section content-section agenda-section"><div className="agenda-header"><span className="eyebrow">TIME (IST)</span><span className="eyebrow">SESSION</span><span className="eyebrow">DETAILS</span></div>{agenda.map(([time, title, detail]) => <article className="agenda-row" key={time}><time>{time}</time><h2>{title}</h2><p>{detail || '—'}</p></article>)}</section></>
}

function OriginStoriesPage() {
  const sources = ['COEP', 'MIT', 'VIT', 'PICT', 'Symbiosis incubators', 'Atal Innovation Mission', 'NASSCOM 10,000 Startups', 'YourStory Under 25']
  return <><PageIntro eyebrow="FIVE FOUNDERS · TEENS TO 23" title={<>Origin<br /><em>Stories.</em></>} text="What are you building, and why? Five young founders share the honest, unfinished stories behind their startups." /><section className="container section origin-section"><div className="origin-format"><span className="eyebrow">THE FORMAT</span><h2>Not a competition.<br />A conversation.</h2><p>Each founder covers the problem they saw, what they built, what no classroom taught them, and what they wish someone had told them before starting. Presentations and open audience Q&A, hosted by the Congress emcee.</p><div className="origin-stat"><strong>5</strong><span>founders sharing what they're building</span></div></div><div className="origin-placeholders">{Array.from({ length: 5 }, (_, index) => <article key={index}><span className="placeholder-avatar">0{index + 1}</span><div><span className="eyebrow">FOUNDER SPOTLIGHT</span><h3>Founder announcement coming soon</h3><p>Founder details will be shared closer to the congress.</p></div></article>)}</div><div className="scouting"><span className="eyebrow">FOUNDER SCOUTING NETWORK</span><p>{sources.map((source) => <span key={source}>{source}</span>)}</p></div></section></>
}

function SpeakersPage() {
  return <><PageIntro eyebrow="THE VOICES" title={<>People who<br /><em>make things move.</em></>} text="Speaker details and biographies will be updated as they are confirmed." /><section className="container section speaker-grid">{speakers.map((speaker) => <article className="speaker-card" key={speaker.name}><div className="speaker-photo-placeholder" aria-hidden="true">{speaker.initials}</div><span className="eyebrow">{speaker.role}</span><h2>{speaker.name}</h2><p>{speaker.bio}</p><span className="speaker-photo-note">Photo / full bio to be supplied</span></article>)}</section></>
}

function TeamPage() {
  return <><PageIntro eyebrow="ORGANIZING TEAM" title={<>Built by students,<br /><em>for students.</em></>} text="Meet the team bringing the IEEE Pune Section Student Congress 2026 to life. Names will be shared soon." /><section className="container section team-grid">{teamRoles.map((role, index) => <article className="team-role" key={role}><span>{String(index + 1).padStart(2, '0')}</span><div><h2>{role}</h2><p>Team member name to be announced</p></div><ArrowUpRight size={18} /></article>)}</section></>
}

function FAQPage() {
  return <><PageIntro eyebrow="QUESTIONS, ANSWERED" title={<>Good questions.<br /><em>Clear answers.</em></>} /><section className="container section faq-list">{faqItems.map(([question, answer]) => <details key={question}><summary>{question}<ChevronDown size={18} /></summary><p>{answer}</p></details>)}</section></>
}

function ContactPage() {
  return <><PageIntro eyebrow="GET IN TOUCH" title={<>Let's make<br /><em>something happen.</em></>} text="For congress questions, partnerships, sponsorships, or founder nominations, contact IEEE Pune Section." /><section className="container contact-panel"><span className="eyebrow">IEEE PUNE SECTION</span><p>Contact details will be announced by the organizing team.</p><a className="button button-outline" href="https://www.ieeepune.org" target="_blank" rel="noreferrer">Visit IEEE Pune Section <ArrowUpRight size={16} /></a></section></>
}

function FieldError({ children }: { children?: ReactNode }) {
  return children ? <span className="field-error" role="alert">{children}</span> : null
}

function OptionPicker({ label, options, value, onChange, error, kind, unavailable }: {
  label: string
  options: readonly { slug: string; title: string }[]
  value: string
  onChange: (value: string) => void
  error?: string
  kind: 'tracks' | 'workshops'
  unavailable: CapacityOption[]
}) {
  return <fieldset className="form-field form-choice"><legend>{label} <span aria-hidden="true">*</span></legend><div className="choice-grid">{options.map((option, index) => {
    const item = unavailable.find((candidate) => candidate.slug === option.slug)
    const full = Boolean(item && item.registered_count >= item.capacity)
    const disabled = !supabase || !item || full
    const id = `${kind}-${option.slug}`
    return <label className={`choice-card ${value === item?.id ? 'choice-selected' : ''} ${disabled ? 'choice-disabled' : ''}`} htmlFor={id} key={option.slug}>
      <input id={id} type="radio" name={kind} value={item?.id ?? ''} checked={value === item?.id && Boolean(item)} disabled={disabled} onChange={() => item && onChange(item.id)} />
      <span className="choice-index">0{index + 1}</span><strong>{option.title}</strong>
      <SeatBadge item={item} />
    </label>
  })}</div><FieldError>{error}</FieldError></fieldset>
}

function RegistrationPage() {
  const navigate = useNavigate()
  const trackQuery = useAvailability('tracks')
  const workshopQuery = useAvailability('workshops')
  const [banner, setBanner] = useState('')
  const [saving, setSaving] = useState(false)
  const form = useForm<RegistrationValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      full_name: '', email: '', phone: '', college: '', stream: '',
      year_of_study: '1st', is_ieee_member: 'no', ieee_membership_no: '',
      track_id: '', workshop_id: '', dietary: 'veg', consent: false,
      ...readSavedForm(),
    },
  })
  const { register, handleSubmit, watch, setValue, setError, clearErrors, formState: { errors } } = form
  const ieeeMember = watch('is_ieee_member')
  const selectedTrack = watch('track_id')
  const tracksFull = Boolean(trackQuery.data?.length && trackQuery.data.every((track) => track.registered_count >= track.capacity))
  const anyWorkshopAvailable = Boolean(workshopQuery.data?.some((option) => option.registered_count < option.capacity))
  useEffect(() => {
    const subscription = watch((values) => {
      const { consent, ...persisted } = values
      void consent
      try { sessionStorage.setItem(savedFormKey, JSON.stringify(persisted)) }
      catch (error) { console.error('Unable to preserve registration draft', error) }
    })
    return () => subscription.unsubscribe()
  }, [watch])

  async function submit(values: RegistrationValues) {
    setBanner('')
    clearErrors('email')
    if (!supabase) {
      setBanner('Registration is not configured yet. Please try again later.')
      return
    }
    setSaving(true)
    const { data, error } = await supabase.rpc('register_student', {
      p_full_name: values.full_name,
      p_email: values.email,
      p_phone: values.phone,
      p_college: values.college,
      p_stream: values.stream,
      p_year: values.year_of_study,
      p_is_ieee_member: values.is_ieee_member === 'yes',
      p_ieee_no: values.is_ieee_member === 'yes' ? values.ieee_membership_no?.trim() ?? null : null,
      p_dietary: values.dietary,
      p_track_id: values.track_id,
      p_workshop_id: values.workshop_id,
      p_consent: values.consent,
    })
    setSaving(false)
    if (error) {
      console.error('Registration RPC failed', error)
      setBanner('We could not complete your registration due to a connection issue. Your details are saved; please retry.')
      return
    }
    const result = data as RegistrationResult
    if (!result.ok) {
      if (result.code === 'DUPLICATE_EMAIL') setError('email', { message: 'This email is already registered.' })
      else if (result.code === 'TRACK_FULL') {
        setBanner(result.message ?? 'This track is full. Please choose another track.')
        setValue('track_id', '')
        await trackQuery.refetch()
      } else if (result.code === 'WORKSHOP_FULL') {
        setBanner(result.message ?? 'This workshop is full. Please choose another workshop.')
        setValue('workshop_id', '')
        await workshopQuery.refetch()
      } else {
        setBanner(result.message ?? 'Please check your details and try again.')
      }
      return
    }
    if (!result.ticket_code || !result.track || !result.workshop) {
      setBanner('The registration response was incomplete. Please contact the organizing team before submitting again.')
      return
    }
    const ticket: TicketInfo = { ticket_code: result.ticket_code, name: values.full_name, track: result.track, workshop: result.workshop }
    sessionStorage.setItem(ticketKey, JSON.stringify(ticket))
    sessionStorage.removeItem(savedFormKey)
    navigate('/register/success')
  }

  return <><PageIntro eyebrow="SAVE YOUR SEAT" title={<>Register to<br /><em>build what's next.</em></>} text="Choose one parallel track and one hands-on workshop. Availability is limited and updated live." /><section className="container registration-section">
    {!supabase && <AvailabilityMessage />}
    {trackQuery.error && <div className="notice notice-error">Track availability could not be loaded. Refresh or try again shortly.</div>}
    {workshopQuery.error && <div className="notice notice-error">Workshop availability could not be loaded. Refresh or try again shortly.</div>}
    {banner && <div className="notice notice-error" role="alert"><CircleAlert size={18} />{banner}</div>}
    {tracksFull && <div className="notice notice-error">All tracks are full. Registration is closed.</div>}
    {!anyWorkshopAvailable && workshopQuery.data?.length ? <div className="notice notice-error">All workshops are full. Registration is closed.</div> : null}
    <form className="registration-form" onSubmit={handleSubmit(submit)} noValidate>
      <div className="form-section-heading"><span className="eyebrow">01 / YOUR DETAILS</span><p>Fields marked * are required.</p></div>
      <div className="form-grid">
        <label className="form-field"><span>Full name *</span><input autoComplete="name" {...register('full_name')} placeholder="Your name" /><FieldError>{errors.full_name?.message}</FieldError></label>
        <label className="form-field"><span>Email *</span><input type="email" autoComplete="email" {...register('email')} placeholder="you@example.com" /><FieldError>{errors.email?.message}</FieldError></label>
        <label className="form-field"><span>Phone (10-digit Indian mobile) *</span><input type="tel" autoComplete="tel-national" inputMode="numeric" {...register('phone')} placeholder="9876543210" /><FieldError>{errors.phone?.message}</FieldError></label>
        <label className="form-field"><span>College / organisation *</span><input autoComplete="organization" {...register('college')} placeholder="College or organisation" /><FieldError>{errors.college?.message}</FieldError></label>
        <label className="form-field"><span>Stream / branch *</span><input {...register('stream')} placeholder="e.g. Computer Science, Arts, Commerce" /><FieldError>{errors.stream?.message}</FieldError></label>
        <label className="form-field"><span>Year of study *</span><select {...register('year_of_study')}><option value="1st">1st year</option><option value="2nd">2nd year</option><option value="3rd">3rd year</option><option value="4th">4th year</option><option value="PG">Postgraduate</option><option value="Working professional">Working professional</option></select><FieldError>{errors.year_of_study?.message}</FieldError></label>
      </div>
      <fieldset className="form-field member-field"><legend>IEEE member? *</legend><div className="inline-options"><label><input type="radio" value="yes" {...register('is_ieee_member')} /> Yes</label><label><input type="radio" value="no" {...register('is_ieee_member')} /> No</label></div>      {ieeeMember === 'yes' && <label className="form-field member-no"><span>IEEE membership number (optional)</span><input {...register('ieee_membership_no')} /><FieldError>{errors.ieee_membership_no?.message}</FieldError></label>}</fieldset>
      <div className="form-section-heading"><span className="eyebrow">02 / CHOOSE YOUR SESSIONS</span><p>One selection for each session.</p></div>
      <OptionPicker label="Parallel track" kind="tracks" options={tracks} value={selectedTrack} unavailable={trackQuery.data ?? []} onChange={(value) => setValue('track_id', value, { shouldValidate: true })} error={errors.track_id?.message} />
      <OptionPicker label="Hands-on workshop" kind="workshops" options={workshops} value={watch('workshop_id')} unavailable={workshopQuery.data ?? []} onChange={(value) => setValue('workshop_id', value, { shouldValidate: true })} error={errors.workshop_id?.message} />
      <div className="form-grid form-grid-small"><label className="form-field"><span>Dietary preference *</span><select {...register('dietary')}><option value="veg">Vegetarian</option><option value="non-veg">Non-vegetarian</option><option value="jain">Jain</option></select></label></div>
      <label className="consent"><input type="checkbox" {...register('consent')} /><span>I agree to the use of my details for congress registration and event communications. *</span></label><FieldError>{errors.consent?.message}</FieldError>
      <div className="registration-submit"><button className="button button-primary" type="submit" disabled={saving || tracksFull || !anyWorkshopAvailable || !supabase || !trackQuery.data?.length || !workshopQuery.data?.length}>{saving ? 'Submitting…' : 'Complete registration'} <ArrowRight size={17} /></button><span><ShieldCheck size={15} /> Your personal details are not publicly visible.</span></div>
    </form>
  </section></>
}

function readSavedForm(): Partial<RegistrationValues> {
  try {
    const value = sessionStorage.getItem(savedFormKey)
    return value ? JSON.parse(value) as Partial<RegistrationValues> : {}
  } catch (error) {
    console.error('Unable to restore registration draft', error)
    return {}
  }
}

function downloadCalendar(ticket: TicketInfo) {
  const now = new Date()
  const format = (date: Date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const start = '20261031T023000Z'
  const end = '20261031T130000Z'
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//IEEE Pune Section//Congress 2026//EN', 'BEGIN:VEVENT', `UID:${ticket.ticket_code}@ieeepune.org`, `DTSTAMP:${format(now)}`, `DTSTART:${start}`, `DTEND:${end}`, `SUMMARY:${EVENT.name}`, `DESCRIPTION:${EVENT.tagline} Track: ${ticket.track}. Workshop: ${ticket.workshop}.`, 'LOCATION:Pune, India (venue to be announced)', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n')
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }))
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = 'ieee-pune-congress-2026.ics'
  anchor.click()
  URL.revokeObjectURL(url)
}

function RegistrationSuccessPage() {
  const ticket = useMemo((): TicketInfo | null => {
    try { return JSON.parse(sessionStorage.getItem(ticketKey) ?? 'null') as TicketInfo | null }
    catch (error) { console.error('Unable to read registration ticket', error); return null }
  }, [])
  if (!ticket) return <main className="container success-wrap"><div className="success-card"><CircleAlert /><h1>No ticket found</h1><p>Complete the registration form first to see your ticket details.</p><Link className="button button-primary" to="/register">Go to registration</Link></div></main>
  return <main className="container success-wrap"><div className="success-card"><span className="success-icon"><Check /></span><span className="eyebrow">YOU'RE IN</span><h1>Thank you, {ticket.name}.</h1><p>Your registration for the IEEE Pune Section Student Congress 2026 is confirmed.</p><div className="ticket-code"><span className="eyebrow">YOUR TICKET CODE</span><strong>{ticket.ticket_code}</strong></div><div className="ticket-details"><div><span>Track</span><strong>{ticket.track}</strong></div><div><span>Workshop</span><strong>{ticket.workshop}</strong></div><div><span>Date</span><strong>October 31, 2026</strong></div></div>  <div className="ticket-qr"><QRCodeSVG value={ticket.ticket_code} size={148} includeMargin aria-label={`QR code for ticket ${ticket.ticket_code}`} /><span>Keep this ticket code for event check-in.</span></div><button className="button button-primary" onClick={() => downloadCalendar(ticket)}>Add to calendar <Download size={16} /></button></div></main>
}

type AdminRegistration = {
  id: string; ticket_code: string; full_name: string; email: string; phone: string
  college: string; stream: string; year_of_study: string; checked_in: boolean; created_at: string
  track_id: string; workshop_id: string
}

function AdminPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [session, setSession] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<AdminRegistration[]>([])
  const [trackRows, setTrackRows] = useState<CapacityOption[]>([])
  const [workshopRows, setWorkshopRows] = useState<CapacityOption[]>([])
  const [filter, setFilter] = useState('')
  const [filterSession, setFilterSession] = useState('all')

  useEffect(() => {
    if (!supabase) return
    let active = true
    void supabase.auth.getSession().then(({ data, error }) => {
      if (error) { setMessage(error.message); return }
      if (active && data.session) void loadDashboard()
    })
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, authSession) => {
      if (authSession && active) void loadDashboard()
      if (!authSession && active) setSession(false)
    })
    return () => { active = false; authListener.subscription.unsubscribe() }
  }, [])

  async function loadDashboard() {
    if (!supabase) return
    setLoading(true)
    setMessage('')
    const { data: admin, error: adminError } = await supabase.from('admins').select('user_id').limit(1)
    if (adminError || !admin?.length) {
      setLoading(false)
      setMessage(adminError?.message ?? 'This account is not listed as an event administrator.')
      await supabase.auth.signOut()
      return
    }
    const [registrationResult, trackResult, workshopResult] = await Promise.all([
      supabase.from('registrations').select('*').order('created_at', { ascending: false }),
      supabase.from('tracks').select('*').order('sort_order'),
      supabase.from('workshops').select('*').order('sort_order'),
    ])
    setLoading(false)
    const error = registrationResult.error ?? trackResult.error ?? workshopResult.error
    if (error) { setMessage(`Dashboard data could not be loaded: ${error.message}`); return }
    setRows(registrationResult.data ?? [])
    setTrackRows(trackResult.data ?? [])
    setWorkshopRows(workshopResult.data ?? [])
    setSession(true)
  }

  async function signIn(event: FormEvent) {
    event.preventDefault()
    if (!supabase) { setMessage('Configure Supabase environment variables to use the admin portal.'); return }
    setLoading(true)
    setMessage('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) setMessage(error.message)
    else await loadDashboard()
  }

  async function signOut() {
    if (!supabase) return
    const { error } = await supabase.auth.signOut()
    if (error) setMessage(`Sign out failed: ${error.message}`)
    setSession(false)
  }

  async function updateCapacity(kind: 'tracks' | 'workshops', row: CapacityOption, capacity: number) {
    if (!supabase) return
    const result = kind === 'tracks'
      ? await supabase.from('tracks').update({ capacity }).eq('id', row.id)
      : await supabase.from('workshops').update({ capacity }).eq('id', row.id)
    const { error } = result
    if (error) { setMessage(`Capacity update failed: ${error.message}`); return }
    await loadDashboard()
  }

  async function toggleCheckin(row: AdminRegistration) {
    if (!supabase) return
    const { error } = await supabase.from('registrations').update({ checked_in: !row.checked_in }).eq('id', row.id)
    if (error) { setMessage(`Check-in update failed: ${error.message}`); return }
    setRows((current) => current.map((item) => item.id === row.id ? { ...item, checked_in: !item.checked_in } : item))
  }

  const trackById = new Map(trackRows.map((item) => [item.id, item.title]))
  const workshopById = new Map(workshopRows.map((item) => [item.id, item.title]))
  const filteredRows = rows.filter((row) => {
    const searchable = `${row.full_name} ${row.email} ${row.ticket_code} ${row.college}`.toLowerCase()
    const selected = filterSession === 'all' || (filterSession === 'checked-in' ? row.checked_in : !row.checked_in)
    return searchable.includes(filter.toLowerCase()) && selected
  })

  function exportCsv() {
    const headers = ['Ticket', 'Name', 'Email', 'Phone', 'College', 'Stream', 'Year', 'Track', 'Workshop', 'Checked in']
    const csvCell = (value: string | boolean) => `"${String(value).replace(/"/g, '""')}"`
    const lines = [headers, ...filteredRows.map((row) => [row.ticket_code, row.full_name, row.email, row.phone, row.college, row.stream, row.year_of_study, trackById.get(row.track_id) ?? '', workshopById.get(row.workshop_id) ?? '', row.checked_in])].map((line) => line.map(csvCell).join(','))
    const url = URL.createObjectURL(new Blob([lines.join('\r\n')], { type: 'text/csv;charset=utf-8' }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'ieee-congress-registrations.csv'
    anchor.click()
    URL.revokeObjectURL(url)
  }

  if (!supabase) return <><PageIntro eyebrow="ADMINISTRATOR PORTAL" title={<>Congress<br /><em>dashboard.</em></>} /><section className="container admin-section"><div className="notice notice-error"><CircleAlert size={18} />Admin access requires Supabase configuration.</div></section></>
  if (!session) return <><PageIntro eyebrow="ADMINISTRATOR PORTAL" title={<>Congress<br /><em>dashboard.</em></>} /><section className="container admin-section"><form className="admin-login" onSubmit={signIn}><span className="eyebrow">SIGN IN</span><label className="form-field"><span>Email</span><input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" /></label><label className="form-field"><span>Password</span><input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" /></label>{message && <p className="field-error" role="alert">{message}</p>}<button className="button button-primary" disabled={loading}>{loading ? 'Please wait…' : 'Sign in'} <ArrowRight size={16} /></button></form></section></>

  return <><PageIntro eyebrow="ADMINISTRATOR PORTAL" title={<>Congress<br /><em>dashboard.</em></>} text={`${rows.length} registrations currently recorded.`} /><section className="container admin-section">
    <div className="admin-heading"><div><span className="eyebrow">REGISTRATION OVERVIEW</span><h2>{rows.length} total registrations</h2></div><button className="button button-outline" onClick={signOut}>Sign out</button></div>
    {message && <div className="notice notice-error">{message}</div>}
    {loading && <p>Loading dashboard…</p>}
    <div className="admin-capacity"><CapacityEditor title="Track capacity" items={trackRows} onSave={(item, capacity) => updateCapacity('tracks', item, capacity)} /><CapacityEditor title="Workshop capacity" items={workshopRows} onSave={(item, capacity) => updateCapacity('workshops', item, capacity)} /></div>
    <div className="admin-table-tools"><input aria-label="Search registrations" placeholder="Search name, email, ticket…" value={filter} onChange={(event) => setFilter(event.target.value)} /><select aria-label="Filter check-ins" value={filterSession} onChange={(event) => setFilterSession(event.target.value)}><option value="all">All registrations</option><option value="checked-in">Checked in</option><option value="not-checked-in">Not checked in</option></select><button className="button button-outline" onClick={exportCsv}><Download size={16} /> Export CSV</button></div>
    <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Ticket</th><th>Name / email</th><th>Track</th><th>Workshop</th><th>Check-in</th></tr></thead><tbody>{filteredRows.map((row) => <tr key={row.id}><td>{row.ticket_code}</td><td>{row.full_name}<small>{row.email}</small></td><td>{trackById.get(row.track_id) ?? '—'}</td><td>{workshopById.get(row.workshop_id) ?? '—'}</td><td><button className={`checkin-toggle ${row.checked_in ? 'checked-in' : ''}`} onClick={() => void toggleCheckin(row)} aria-label={`${row.checked_in ? 'Undo check-in for' : 'Check in'} ${row.full_name}`}>{row.checked_in ? 'Checked in' : 'Check in'}</button></td></tr>)}{filteredRows.length === 0 && <tr><td colSpan={5}>No registrations match this search.</td></tr>}</tbody></table></div>
  </section></>
}

function CapacityEditor({ title, items, onSave }: { title: string; items: CapacityOption[]; onSave: (item: CapacityOption, capacity: number) => void }) {
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  return <div className="capacity-editor"><h3>{title}</h3>{items.map((item) => {
    const value = drafts[item.id] ?? String(item.capacity)
    const fill = item.capacity > 0 ? Math.min(item.registered_count / item.capacity * 100, 100) : 0
    return <div className="capacity-row" key={item.id}><div className="capacity-label"><span>{item.title}</span><strong>{item.registered_count} / {item.capacity}</strong></div><div className="capacity-bar"><span style={{ width: `${fill}%` }} /></div><div className="capacity-actions"><input aria-label={`Capacity for ${item.title}`} type="number" min={item.registered_count} value={value} onChange={(event) => setDrafts((current) => ({ ...current, [item.id]: event.target.value }))} /><button className="button button-small" onClick={() => { const capacity = Number(value); if (Number.isInteger(capacity) && capacity >= item.registered_count) onSave(item, capacity) }}>Save</button></div></div>
  })}</div>
}

function NotFoundPage() {
  return <main className="container not-found"><span className="eyebrow">404 / PAGE NOT FOUND</span><h1>This page is off the map.</h1><Link className="button button-primary" to="/">Back to the congress <ArrowRight size={16} /></Link></main>
}

function App() {
  return <Routes>
    <Route path="/" element={<Shell><HomePage /></Shell>} />
    <Route path="/agenda" element={<Shell><AgendaPage /></Shell>} />
    <Route path="/tracks" element={<Shell><TracksPage /></Shell>} />
    <Route path="/tracks/:slug" element={<Shell><TrackDetailPage /></Shell>} />
    <Route path="/workshops" element={<Shell><WorkshopsPage /></Shell>} />
    <Route path="/origin-stories" element={<Shell><OriginStoriesPage /></Shell>} />
    <Route path="/speakers" element={<Shell><SpeakersPage /></Shell>} />
    <Route path="/team" element={<Shell><TeamPage /></Shell>} />
    <Route path="/register" element={<Shell><RegistrationPage /></Shell>} />
    <Route path="/register/success" element={<Shell><RegistrationSuccessPage /></Shell>} />
    <Route path="/faq" element={<Shell><FAQPage /></Shell>} />
    <Route path="/contact" element={<Shell><ContactPage /></Shell>} />
    <Route path="/admin" element={<Shell><AdminPage /></Shell>} />
    <Route path="*" element={<Shell><NotFoundPage /></Shell>} />
  </Routes>
}

export default App
