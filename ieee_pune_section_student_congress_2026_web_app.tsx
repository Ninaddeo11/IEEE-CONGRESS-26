import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, MapPin, Users, Sparkles, BookOpen, Shield, Cpu, 
  BarChart2, Compass, Award, Rocket, CheckCircle2, ChevronRight, 
  Menu, X, Share2, ExternalLink, ArrowRight, Lightbulb, Code, 
  Layers, Lock, Database, UserCheck, Play, Send, Check
} from 'lucide-react';

// --- SUPABASE CLIENT CONFIGURATION SNIPPET (Ready to plug into real project) ---
/*
  To connect to real Supabase database:
  1. npm install @supabase/supabase-javascript
  2. Create a client:
     import { createClient } from '@supabase/supabase-js'
     const supabaseUrl = 'https://YOUR_SUPABASE_URL.supabase.co'
     const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'
     export const supabase = createClient(supabaseUrl, supabaseAnonKey)

  3. Table Schema Suggestion for Supabase:
     CREATE TABLE registrations (
       id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
       full_name TEXT NOT NULL,
       email TEXT NOT NULL UNIQUE,
       phone TEXT NOT NULL,
       college TEXT NOT NULL,
       ieee_id TEXT,
       track TEXT NOT NULL,
       workshop TEXT NOT NULL,
       status TEXT DEFAULT 'confirmed'
     );
*/

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [showSupabaseCode, setShowSupabaseCode] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    college: '',
    ieeeId: '',
    track: 'Track 1: Quantum Computing',
    workshop: 'Workshop 1: Build an AI Agent'
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate Supabase API latency
    setTimeout(() => {
      setIsSubmitting(false);
      setFormSubmitted(true);
    }, 1200);
  };

  // Agenda items
  const agendaData = [
    { time: '8:00 - 9:00 AM', title: 'Arrival, Registration & Breakfast', category: 'general', desc: 'Welcome setup, informal networking, volunteer-managed check-in', icon: Users },
    { time: '9:15 - 9:30 AM', title: 'Opening Ceremony', category: 'keynote', desc: 'Lamp lighting, welcome address by IEEE Pune Section Execom & Congress vision', icon: Sparkles },
    { time: '9:30 - 10:15 AM', title: 'Keynote Speaker 1', category: 'keynote', desc: 'Inspirational address by Mr. Praveen Shukla', icon: Award },
    { time: '10:15 - 10:45 AM', title: 'Panel: YP as Future Entrepreneurs', category: 'panel', desc: 'Young Professionals for Viksit Bharat @2047 | Moderated by Mr. Rakshit Jain', icon: Users },
    { time: '11:00 - 12:30 PM', title: '5 Parallel Technical Tracks', category: 'tracks', desc: 'Simultaneous deep-dive tracks on Quantum, Data Science, Product, Leadership & Public Speaking', icon: Cpu },
    { time: '12:45 - 1:30 PM', title: 'Networking Lunch', category: 'break', desc: 'Complimentary buffet lunch and peer interaction', icon: Clock },
    { time: '1:45 - 3:00 PM', title: '3 Parallel Hands-on Workshops', category: 'workshops', desc: 'AI Agent Building, Cyber CTF Lab, and Design Thinking intensive sessions', icon: Rocket },
    { time: '3:15 - 4:00 PM', title: 'Student Forum & Project Showcase', category: 'forum', desc: 'Students from various Branches represent their innovative projects', icon: Lightbulb },
    { time: '4:15 - 4:45 PM', title: 'Origin Stories: 5 Founders Under 23', category: 'keynote', desc: 'Top 5 student startup founders share their journey (COEP, MIT, VIT, PICT, Symbiosis)', icon: FlameIcon },
    { time: '4:45 - 5:30 PM', title: 'Keynote Speaker 2', category: 'keynote', desc: 'Valedictory address by Dr. Rajiv Mitra', icon: Award },
    { time: '5:30 - 5:45 PM', title: 'Closing Ceremony', category: 'keynote', desc: 'Vote of Thanks by Student Counsellor VIT & Address by Dr. Abhijit Khurape', icon: CheckCircle2 },
    { time: '5:45 - 6:30 PM', title: 'High Tea & Cultural Night', category: 'break', desc: 'Live student performances and evening celebrations', icon: Sparkles }
  ];

  const tracksData = [
    {
      id: 1,
      title: 'Quantum Computing - What Every Student Must Know',
      tag: 'Frontier Tech',
      desc: 'National Quantum Mission context. IBM/Google fault-tolerant race. Demystifying quantum physics principles into practical software applications.',
      prereq: 'No Physics PhD required. Open to all students.',
      highlights: ['Qiskit basics', 'Quantum algorithms overview', 'Career roadmap in Quantum']
    },
    {
      id: 2,
      title: 'Data Science & Analytics in Practice',
      tag: 'Data & AI',
      desc: 'Real datasets, industry tools (Python, SQL, Power BI, Tableau). How to extract actionable insights that drive business and technical decisions.',
      prereq: 'Domain-agnostic (equally relevant for CS, Mechanical, or Commerce).',
      highlights: ['Exploratory Data Analysis', 'Dashboarding with Tableau/PowerBI', 'Data-driven storytelling']
    },
    {
      id: 3,
      title: 'Product Thinking & Building for Users',
      tag: 'Product & Startup',
      desc: 'How great products are actually built: user research, wireframing, MVP mindset, and bridging the gap between technical solutions and user adoption.',
      prereq: 'Curiosity to build products people actually pay for.',
      highlights: ['User persona mapping', 'MVP rapid validation', 'Product metric tracking']
    },
    {
      id: 4,
      title: 'Student Leadership & Personal Brand',
      tag: 'Career Growth',
      desc: 'How to lead a team when no one is obligated to follow. Build an impactful presence on LinkedIn, GitHub, and in executive decision rooms.',
      prereq: 'For current and aspiring student branch leaders.',
      highlights: ['GitHub portfolio optimization', 'LinkedIn authority building', 'Empathetic team leadership']
    },
    {
      id: 5,
      title: 'Communication, Storytelling & Public Speaking',
      tag: 'Soft Skills',
      desc: 'How to speak so people listen, write so people read, and craft narratives that make stakeholders care. The #1 universally valuable career skill.',
      prereq: 'Open to everyone looking to overcome stage fear.',
      highlights: ['Elevator pitch framework', 'Body language mastery', 'Overcoming stage anxiety']
    }
  ];

  const workshopsData = [
    {
      id: 1,
      title: 'Build an AI Agent',
      desc: 'Students build a working AI agent using modern APIs & frameworks. Every participant leaves with a functioning prototype.',
      badge: '100% Code & Build',
      icon: Cpu,
      outcome: 'Working personal AI assistant live on GitHub'
    },
    {
      id: 2,
      title: 'Cyber CTF Lab',
      desc: 'Capture The Flag in a structured workshop format. Guided ethical hacking challenges, web vulnerabilities, and security mindset under time limit.',
      badge: 'Interactive CTF',
      icon: Shield,
      outcome: 'Hands-on exposure to penetration testing fundamentals'
    },
    {
      id: 3,
      title: 'Design Thinking Challenge',
      desc: 'Hands dirty from minute one. Empathize, define, ideate, prototype, and test solution for real-world Pune city challenges.',
      badge: 'Problem Solving',
      icon: Compass,
      outcome: 'Interactive prototype & pitch presentation'
    }
  ];

  const originFounders = [
    { name: 'Aarav Sharma', age: 21, college: 'COEP Tech', startup: 'EcoSense AI', desc: 'IoT based precision agriculture monitoring for small farmers.' },
    { name: 'Priya Kulkarni', age: 22, college: 'VIT Pune', startup: 'DevFlow HQ', desc: 'AI-assisted developer onboarding platform used by 15+ startups.' },
    { name: 'Rohan Deshmukh', age: 19, college: 'PICT Pune', startup: 'CyberVault', desc: 'Zero-trust authentication protocol for Web3 applications.' },
    { name: 'Ananya Joshi', age: 23, college: 'Symbiosis', startup: 'HealthBridge', desc: 'Localized healthcare triage matching rural clinics with specialists.' },
    { name: 'Tanmay Patil', age: 20, college: 'MIT-WPU', startup: 'MobilityPulse', desc: 'Smart EV fleet management and battery lifecycle predictor.' }
  ];

  return (
    <div className="min-h-screen bg-[#12031f] text-slate-100 font-sans selection:bg-amber-500 selection:text-[#12031f] relative overflow-hidden">
      
      {/* BACKGROUND GRADIENT GLOWS */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-purple-800/30 via-fuchsia-900/20 to-transparent blur-[120px] rounded-full"></div>
        <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-amber-600/10 blur-[140px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-900/20 blur-[150px] rounded-full"></div>
      </div>

      {/* FLOATING GLASS NAVBAR */}
      <nav className="sticky top-0 z-40 backdrop-blur-md bg-[#1a062b]/80 border-b border-purple-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo Placeholder Group matching Poster Header */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center gap-2">
              <div className="h-10 px-3 bg-gradient-to-r from-cyan-600 to-blue-700 rounded flex items-center justify-center font-bold text-xs tracking-wider border border-cyan-400/30 shadow-md">
                IEEE Pune Section
              </div>
              <div className="hidden sm:flex flex-col text-[10px] uppercase font-semibold text-purple-200 border-l border-purple-700/50 pl-2">
                <span>Student Congress</span>
                <span className="text-amber-400 font-bold">2026</span>
              </div>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <a href="#about" className="hover:text-amber-400 transition-colors">About</a>
            <a href="#agenda" className="hover:text-amber-400 transition-colors">Agenda</a>
            <a href="#tracks" className="hover:text-amber-400 transition-colors">Tracks</a>
            <a href="#workshops" className="hover:text-amber-400 transition-colors">Workshops</a>
            <a href="#origin-stories" className="hover:text-amber-400 transition-colors">Origin Stories</a>
            <button 
              onClick={() => setShowSupabaseCode(!showSupabaseCode)}
              className="text-xs px-2.5 py-1 rounded bg-purple-900/60 border border-purple-700/50 text-purple-300 hover:text-white transition"
            >
              {showSupabaseCode ? 'Hide Supabase Code' : '⚡ Supabase Stack'}
            </button>
          </div>

          {/* Register CTA Button */}
          <div className="hidden md:flex items-center">
            <button 
              onClick={() => setIsRegisterOpen(true)}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-purple-950 font-bold hover:shadow-[0_0_20px_rgba(245,184,0,0.4)] transition duration-300 transform hover:-translate-y-0.5"
            >
              Register Now
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button 
              onClick={() => setIsRegisterOpen(true)}
              className="px-3 py-1.5 text-xs rounded-full bg-amber-400 text-purple-950 font-bold"
            >
              Register
            </button>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-purple-300 hover:text-white"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#1e0832] border-b border-purple-800/50 px-4 pt-2 pb-6 space-y-3">
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium border-b border-purple-900/40">About</a>
            <a href="#agenda" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium border-b border-purple-900/40">Agenda</a>
            <a href="#tracks" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium border-b border-purple-900/40">Parallel Tracks</a>
            <a href="#workshops" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium border-b border-purple-900/40">Workshops</a>
            <a href="#origin-stories" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium border-b border-purple-900/40">Origin Stories</a>
            <button 
              onClick={() => { setShowSupabaseCode(!showSupabaseCode); setMobileMenuOpen(false); }}
              className="w-full text-left py-2 text-xs text-purple-300"
            >
              ⚡ Supabase Backend Details
            </button>
          </div>
        )}
      </nav>

      {/* SUPABASE CODE PREVIEW BANNER */}
      {showSupabaseCode && (
        <div className="bg-slate-900 border-b border-purple-500/40 p-4 text-xs font-mono text-emerald-400 max-w-7xl mx-auto my-2 rounded-lg relative z-30">
          <div className="flex justify-between items-center mb-2 text-slate-300 font-sans border-b border-slate-700 pb-1">
            <span className="font-bold text-amber-400 flex items-center gap-1">
              <Database size={14} /> Supabase Ready Code Architecture
            </span>
            <button onClick={() => setShowSupabaseCode(false)} className="text-slate-400 hover:text-white">✕ Close</button>
          </div>
          <pre className="overflow-x-auto p-2 bg-slate-950 rounded border border-slate-800">
{`// Supabase integration snippet for IEEE Pune Congress 2026
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

export async function submitRegistration(payload) {
  const { data, error } = await supabase
    .from('registrations')
    .insert([
      { 
        full_name: payload.fullName, 
        email: payload.email, 
        phone: payload.phone, 
        college: payload.college, 
        ieee_id: payload.ieeeId || null,
        track_chosen: payload.track, 
        workshop_chosen: payload.workshop 
      }
    ]);
  if (error) throw error;
  return data;
}`}
          </pre>
        </div>
      )}

      {/* HERO SECTION (MATCHING POSTER VISUAL STYLE) */}
      <section className="relative pt-12 pb-24 px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center min-h-[85vh]">
        
        {/* Glow backdrop behind main title */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-72 bg-gradient-to-r from-purple-600/20 via-pink-600/30 to-amber-500/20 blur-3xl pointer-events-none rounded-full"></div>

        {/* Header Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-900/70 border border-purple-500/40 text-emerald-400 font-bold text-xs tracking-widest uppercase mb-6 shadow-inner">
          <Sparkles size={14} className="text-amber-400 animate-pulse" /> IEEE PUNE SECTION
        </div>

        {/* Poster Main Title Font Reproduction */}
        <div className="relative mb-4">
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tight uppercase text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-300 to-amber-500 drop-shadow-[0_4px_25px_rgba(245,184,0,0.3)] font-serif">
            CONGRESS
          </h1>
          <div className="text-4xl sm:text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600 tracking-wider -mt-2">
            2026
          </div>
        </div>

        {/* Taglines from Poster */}
        <div className="space-y-2 mb-10 max-w-3xl">
          <h2 className="text-lg sm:text-2xl font-bold tracking-widest text-purple-200 uppercase">
            FROM INNOVATION TO IMPACT
          </h2>
          <p className="text-sm sm:text-lg font-medium text-amber-300/90 tracking-wide font-serif italic">
            "A STEP AHEAD, A STEP CLOSER TO VIKSIT BHARAT @ 2047"
          </p>
        </div>

        {/* Event Date & Venue Card */}
        <div className="w-full max-w-2xl bg-gradient-to-r from-purple-950/90 via-[#2a0b47]/90 to-purple-950/90 border border-amber-500/30 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-md mb-10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          <div className="flex items-center space-x-3 border-b sm:border-b-0 sm:border-r border-purple-800/60 pb-3 sm:pb-0 sm:pr-4">
            <div className="p-3 bg-amber-500/20 rounded-xl text-amber-400 border border-amber-500/30">
              <Calendar size={24} />
            </div>
            <div>
              <div className="text-xs text-purple-300 uppercase tracking-wider">Date & Time</div>
              <div className="text-base font-bold text-white">31st OCTOBER 2026</div>
              <div className="text-xs text-amber-300">8:00 AM TO 6:30 PM IST</div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-500/20 rounded-xl text-purple-300 border border-purple-400/30">
              <MapPin size={24} />
            </div>
            <div>
              <div className="text-xs text-purple-300 uppercase tracking-wider">Venue</div>
              <div className="text-base font-bold text-white">Vishwakarma Institute of Tech</div>
              <div className="text-xs text-purple-300">(VIT), Upper Indira Nagar, Pune</div>
            </div>
          </div>
        </div>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button 
            onClick={() => setIsRegisterOpen(true)}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-purple-950 font-extrabold text-base tracking-wide hover:shadow-[0_0_30px_rgba(245,184,0,0.5)] transition duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2"
          >
            <span>Register For Congress</span>
            <ArrowRight size={20} />
          </button>
          
          <a 
            href="#agenda" 
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-purple-900/50 border border-purple-600/40 text-purple-200 font-semibold text-base hover:bg-purple-800/50 hover:text-white transition duration-300 flex items-center justify-center"
          >
            Explore Agenda
          </a>
        </div>

      </section>

      {/* STATS TICKER & VISION BANNER */}
      <section id="about" className="py-16 bg-[#160426] border-y border-purple-900/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Main Vision Quote */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <span className="text-amber-400 font-semibold text-sm tracking-widest uppercase">THE CENTRAL IDEA</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-2 mb-4">
              "Don't find a job. <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500 underline decoration-amber-500">Create one.</span>"
            </h2>
            <p className="text-purple-200 text-base sm:text-lg leading-relaxed">
              IEEE Pune Section Student Congress 2026 is built to give students what classrooms rarely teach: real industry exposure in 2026, hands-on builder skills, and a mindset shift from passive candidate to active creator.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-6 rounded-2xl bg-purple-950/40 border border-purple-800/40 backdrop-blur-sm">
              <div className="text-3xl sm:text-4xl font-black text-amber-400">300+</div>
              <div className="text-xs sm:text-sm text-purple-300 mt-1 uppercase font-medium">Delegates</div>
            </div>
            <div className="p-6 rounded-2xl bg-purple-950/40 border border-purple-800/40 backdrop-blur-sm">
              <div className="text-3xl sm:text-4xl font-black text-amber-400">5</div>
              <div className="text-xs sm:text-sm text-purple-300 mt-1 uppercase font-medium">Parallel Tracks</div>
            </div>
            <div className="p-6 rounded-2xl bg-purple-950/40 border border-purple-800/40 backdrop-blur-sm">
              <div className="text-3xl sm:text-4xl font-black text-amber-400">3</div>
              <div className="text-xs sm:text-sm text-purple-300 mt-1 uppercase font-medium">Hands-on Labs</div>
            </div>
            <div className="p-6 rounded-2xl bg-purple-950/40 border border-purple-800/40 backdrop-blur-sm">
              <div className="text-3xl sm:text-4xl font-black text-amber-400">5</div>
              <div className="text-xs sm:text-sm text-purple-300 mt-1 uppercase font-medium">Founders Under 23</div>
            </div>
          </div>
        </div>
      </section>

      {/* DETAILED AGENDA TIMELINE SECTION */}
      <section id="agenda" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-amber-400 font-bold text-xs tracking-widest uppercase">CONGRESS AT A GLANCE</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">Iterative Event Agenda</h2>
          <p className="text-purple-300 text-sm sm:text-base mt-2">October 31st, 2026 — Packed 1-Day Schedule at VIT Pune</p>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {['all', 'keynote', 'tracks', 'workshops', 'break'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-xs font-semibold capitalize transition ${
                  activeTab === tab 
                    ? 'bg-amber-400 text-purple-950 font-bold' 
                    : 'bg-purple-900/40 text-purple-300 hover:bg-purple-800/40'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Stack */}
        <div className="max-w-4xl mx-auto space-y-4">
          {agendaData
            .filter(item => activeTab === 'all' || item.category === activeTab)
            .map((item, index) => {
              const IconComp = item.icon;
              return (
                <div 
                  key={index} 
                  className="p-5 rounded-xl bg-purple-950/30 border border-purple-800/40 hover:border-amber-500/40 transition duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-900/50 rounded-lg text-amber-400 group-hover:bg-amber-500 group-hover:text-purple-950 transition">
                      <IconComp size={20} />
                    </div>
                    <div>
                      <span className="text-xs font-mono text-amber-400 font-semibold">{item.time}</span>
                      <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition">{item.title}</h3>
                      <p className="text-xs sm:text-sm text-purple-200/80 mt-1">{item.desc}</p>
                    </div>
                  </div>

                  <span className="text-[10px] px-3 py-1 rounded-full bg-purple-900/60 text-purple-300 font-mono uppercase tracking-wider self-start sm:self-center border border-purple-700/40">
                    {item.category}
                  </span>
                </div>
              );
            })}
        </div>
      </section>

      {/* PARALLEL TRACKS SECTION (11:00 AM - 12:30 PM) */}
      <section id="tracks" className="py-20 bg-[#160426] border-t border-purple-900/50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 font-mono text-xs font-bold uppercase">
              11:00 AM – 12:30 PM
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3">5 Parallel Technical Tracks</h2>
            <p className="text-purple-300 text-sm sm:text-base mt-2 max-w-2xl mx-auto">
              Choose one track based on your interest. No prerequisites or stream restrictions—open to tech, non-tech, and business students alike.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tracksData.map((track) => (
              <div 
                key={track.id}
                className="bg-gradient-to-b from-purple-950/60 to-[#1e0735] border border-purple-800/50 hover:border-amber-400/50 rounded-2xl p-6 flex flex-col justify-between transition duration-300 hover:-translate-y-1 shadow-xl"
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-900/80 text-amber-300 border border-purple-700/50">
                      Track {track.id}
                    </span>
                    <span className="text-[10px] text-purple-300 font-mono uppercase">{track.tag}</span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">{track.title}</h3>
                  <p className="text-xs sm:text-sm text-purple-200/80 mb-4 leading-relaxed">{track.desc}</p>

                  <div className="bg-purple-900/30 p-3 rounded-lg border border-purple-800/40 mb-4">
                    <span className="text-[11px] font-semibold text-amber-400 block mb-1">Key Takeaways:</span>
                    <ul className="text-xs text-purple-200 space-y-1">
                      {track.highlights.map((h, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <Check size={12} className="text-emerald-400" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setFormData({...formData, track: `Track ${track.id}: ${track.title}`});
                    setIsRegisterOpen(true);
                  }}
                  className="w-full mt-2 py-2.5 rounded-xl bg-purple-900/60 hover:bg-amber-400 hover:text-purple-950 border border-purple-600/40 text-purple-200 font-bold text-xs transition duration-200 text-center"
                >
                  Select Track {track.id}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HANDS-ON WORKSHOPS SECTION (1:45 PM - 3:00 PM) */}
      <section id="workshops" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 font-mono text-xs font-bold uppercase">
            1:45 PM – 3:00 PM
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3">3 Hands-on Interactive Labs</h2>
          <p className="text-purple-300 text-sm sm:text-base mt-2">No slides-only sessions. Every student builds or creates something by the end.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {workshopsData.map((ws) => {
            const WsIcon = ws.icon;
            return (
              <div key={ws.id} className="relative group bg-gradient-to-b from-[#24083d] to-purple-950/40 border border-purple-800/60 rounded-2xl p-6 hover:border-amber-400/60 transition duration-300 flex flex-col justify-between shadow-2xl">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-purple-950 flex items-center justify-center font-bold mb-5 shadow-lg">
                    <WsIcon size={24} />
                  </div>

                  <span className="text-xs font-semibold px-2.5 py-1 rounded bg-purple-900/80 text-amber-300 border border-purple-700/50">
                    {ws.badge}
                  </span>

                  <h3 className="text-xl font-bold text-white mt-3 mb-2">{ws.title}</h3>
                  <p className="text-xs sm:text-sm text-purple-200/80 mb-6">{ws.desc}</p>
                </div>

                <div className="border-t border-purple-900/60 pt-4 mt-4">
                  <div className="text-[11px] text-purple-300 uppercase tracking-wider mb-1">Expected Outcome</div>
                  <div className="text-xs font-semibold text-amber-300 flex items-center gap-1.5 mb-4">
                    <Rocket size={14} /> {ws.outcome}
                  </div>
                  
                  <button 
                    onClick={() => {
                      setFormData({...formData, workshop: `Workshop ${ws.id}: ${ws.title}`});
                      setIsRegisterOpen(true);
                    }}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-purple-950 font-extrabold text-xs hover:shadow-lg transition"
                  >
                    Reserve Workshop Seat
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ORIGIN STORIES - 5 FOUNDERS UNDER 23 */}
      <section id="origin-stories" className="py-20 bg-[#160426] border-t border-purple-900/50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-amber-400 font-bold text-xs tracking-widest uppercase">SPECIAL FEATURE SESSION</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">Origin Stories: 5 Founders Under 23</h2>
            <p className="text-purple-300 text-sm sm:text-base mt-2 max-w-2xl mx-auto">
              5 young startup founders (under 23) take the stage for 10 mins each to share what they built, mistakes made, and lessons no classroom taught them.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {originFounders.map((founder, i) => (
              <div key={i} className="bg-purple-950/40 border border-purple-800/40 rounded-xl p-5 hover:border-amber-400/40 transition">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-700 to-amber-500 text-white font-bold flex items-center justify-center text-sm">
                    {founder.name.charAt(0)}
                  </div>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Age {founder.age}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">{founder.name}</h3>
                <div className="text-xs text-purple-300 mb-2">{founder.college}</div>
                
                <div className="bg-purple-900/30 p-2.5 rounded border border-purple-800/30 mt-3">
                  <div className="text-xs font-bold text-amber-400">{founder.startup}</div>
                  <div className="text-xs text-purple-200 mt-0.5">{founder.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REGISTRATION MODAL WITH MOCK SUPABASE ACTION */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#1c0730] border border-amber-500/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <button 
              onClick={() => { setIsRegisterOpen(false); setFormSubmitted(false); }}
              className="absolute top-5 right-5 text-purple-400 hover:text-white p-1"
            >
              <X size={20} />
            </button>

            {!formSubmitted ? (
              <>
                <div className="mb-6">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">REGISTRATION FORM</span>
                  <h3 className="text-2xl font-bold text-white mt-1">IEEE Pune Congress 2026</h3>
                  <p className="text-xs text-purple-300">Reserve your delegate seat for 31st Oct at VIT Pune</p>
                </div>

                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-purple-200 mb-1">Full Name *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Rahul Verma"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-purple-950/60 border border-purple-800 text-white text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-purple-200 mb-1">Email Address *</label>
                      <input 
                        type="email" 
                        required
                        placeholder="student@college.edu"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-purple-950/60 border border-purple-800 text-white text-sm focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-purple-200 mb-1">Phone Number *</label>
                      <input 
                        type="tel" 
                        required
                        placeholder="+91 9876543210"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-purple-950/60 border border-purple-800 text-white text-sm focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-purple-200 mb-1">College / Institute *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. VIT Pune / COEP"
                        value={formData.college}
                        onChange={(e) => setFormData({...formData, college: e.target.value})}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-purple-950/60 border border-purple-800 text-white text-sm focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-purple-200 mb-1">IEEE Member ID (Optional)</label>
                      <input 
                        type="text" 
                        placeholder="98765432"
                        value={formData.ieeeId}
                        onChange={(e) => setFormData({...formData, ieeeId: e.target.value})}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-purple-950/60 border border-purple-800 text-white text-sm focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-purple-200 mb-1">Preferred Parallel Track *</label>
                    <select 
                      value={formData.track}
                      onChange={(e) => setFormData({...formData, track: e.target.value})}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-purple-950/60 border border-purple-800 text-white text-xs focus:outline-none focus:border-amber-400"
                    >
                      <option>Track 1: Quantum Computing</option>
                      <option>Track 2: Data Science & Analytics</option>
                      <option>Track 3: Product Thinking & Building</option>
                      <option>Track 4: Student Leadership & Personal Brand</option>
                      <option>Track 5: Storytelling & Public Speaking</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-purple-200 mb-1">Preferred Hands-on Workshop *</label>
                    <select 
                      value={formData.workshop}
                      onChange={(e) => setFormData({...formData, workshop: e.target.value})}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-purple-950/60 border border-purple-800 text-white text-xs focus:outline-none focus:border-amber-400"
                    >
                      <option>Workshop 1: Build an AI Agent</option>
                      <option>Workshop 2: Cyber CTF Lab</option>
                      <option>Workshop 3: Design Thinking Challenge</option>
                    </select>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-purple-950 font-bold text-sm tracking-wide hover:shadow-[0_0_20px_rgba(245,184,0,0.5)] transition mt-2 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? 'Registering...' : 'Confirm Congress Seat'}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-2xl font-bold text-white">Registration Confirmed!</h3>
                <p className="text-xs sm:text-sm text-purple-200 max-w-sm mx-auto">
                  Thank you, <span className="text-amber-300 font-bold">{formData.fullName}</span>. We have saved your seat for <span className="text-white font-semibold">October 31st, 2026</span> at VIT Pune.
                </p>

                <div className="bg-purple-950/60 p-4 rounded-xl border border-purple-800/60 text-left text-xs space-y-1 text-purple-300">
                  <div><strong>Track:</strong> {formData.track}</div>
                  <div><strong>Workshop:</strong> {formData.workshop}</div>
                  <div><strong>Venue:</strong> Vishwakarma Institute of Technology, Pune</div>
                </div>

                <button 
                  onClick={() => { setIsRegisterOpen(false); setFormSubmitted(false); }}
                  className="px-6 py-2.5 rounded-full bg-amber-400 text-purple-950 font-bold text-xs"
                >
                  Close & View Agenda
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* FOOTER WITH PUNE SKYLINE SILHOUETTE (MATCHING POSTER FOOTER) */}
      <footer className="relative bg-[#0d0216] border-t border-purple-900/60 pt-16 pb-12 overflow-hidden">
        
        {/* Vector Line-Art Pune Skyline Decorative SVG Overlay */}
        <div className="w-full opacity-25 text-amber-200/40 my-4 flex justify-center pointer-events-none">
          <svg className="w-full max-w-6xl h-24" viewBox="0 0 1200 120" fill="none" stroke="currentColor" strokeWidth="1.2">
            {/* Shaniwar Wada Fort Silhouette Motifs & Modern Pune Metro/Bridge line art */}
            <path d="M0,100 L50,100 L50,60 L70,60 L70,100 L120,100 L120,40 L160,40 L160,100 L200,100 L230,20 L260,100 L320,100 L320,50 L350,30 L380,50 L380,100 L450,100 M450,100 C500,40 600,40 650,100 M650,100 L720,100 L720,30 L760,10 L800,30 L800,100 L880,100 L910,40 L940,100 L1020,100 L1020,50 L1060,50 L1060,100 L1200,100" />
            <circle cx="230" cy="20" r="3" fill="currentColor"/>
            <circle cx="760" cy="10" r="3" fill="currentColor"/>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          
          <div className="text-center md:text-left">
            <div className="text-lg font-bold text-white tracking-wider">IEEE PUNE SECTION CONGRESS 2026</div>
            <p className="text-xs text-purple-300 mt-1">Organized by IEEE Pune Section & VIT Pune Student Branch</p>
            <p className="text-[11px] text-purple-400 mt-0.5">Empowering Youth For A Viksit Bharat @2047</p>
          </div>

          <div className="flex items-center space-x-6 text-purple-300 text-xs font-semibold">
            <a href="https://ieeepunesection.org" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition flex items-center gap-1">
              <span>ieeepunesection.org</span>
              <ExternalLink size={12} />
            </a>
            <span>•</span>
            <a href="#about" className="hover:text-amber-400 transition">About Us</a>
            <span>•</span>
            <a href="#tracks" className="hover:text-amber-400 transition">Tracks</a>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-purple-950 text-center text-[11px] text-purple-400">
          © 2026 IEEE Pune Section. All Rights Reserved. Built with React & Tailwind CSS. Ready for Supabase Backend Integration.
        </div>
      </footer>

    </div>
  );
}

// Simple Helper Icon
function FlameIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
    </svg>
  );
}