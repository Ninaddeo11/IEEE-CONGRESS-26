export const EVENT = {
  name: 'IEEE Pune Section Student Congress 2026',
  tagline: "Don't find a job. Create one.",
  date: 'October 31, 2026',
  start: '2026-10-31T08:00:00+05:30',
  end: '2026-10-31T18:30:00+05:30',
  venue: 'Venue details to be announced',
  organizer: 'IEEE Pune Section',
} as const

export const tracks = [
  {
    slug: 'quantum-computing',
    title: 'Quantum Computing: What Every Student Must Know',
    description: 'India has a National Quantum Mission. IBM and Google are racing toward fault-tolerant quantum computers. Companies are already hiring quantum-aware talent. Cuts through the hype: what quantum actually is, what it means for your future, what to do now. No physics PhD required.',
  },
  {
    slug: 'data-science',
    title: 'Data Science & Analytics in Practice',
    description: 'Real datasets, real tools: Python, SQL, Power BI, Tableau. Extract insights that drive decisions. Domain-agnostic, relevant to management and CS students alike.',
  },
  {
    slug: 'product-thinking',
    title: 'Product Thinking & Building for Users',
    description: 'User research, wireframing, MVP mindset, and the gap between a technical solution and something people actually use. Bridges technology and business.',
  },
  {
    slug: 'leadership-brand',
    title: 'Student Leadership & Personal Brand',
    description: 'Leading a team when no one has to follow you. Building a presence that opens doors on LinkedIn, GitHub and in rooms where decisions get made. Leadership as a learnable skill.',
  },
  {
    slug: 'communication',
    title: 'Communication, Storytelling & Public Speaking',
    description: 'Speak so people listen, write so people read, tell a story that makes someone care. The most universally valuable skill and the one most students never formally learn.',
  },
] as const

export const workshops = [
  {
    slug: 'build-ai-agent',
    title: 'Build an AI Agent',
    description: 'Build a working AI agent with available tools and APIs; leave with a functioning prototype you built yourself.',
  },
  {
    slug: 'cyber-ctf',
    title: 'Cyber CTF Lab',
    description: 'Mentor-guided Capture The Flag: intro to ethical hacking, problem-solving under pressure, the security mindset.',
  },
  {
    slug: 'design-thinking',
    title: 'Design Thinking',
    description: 'Empathize, define, ideate, prototype, test on a real-world problem. No design background required.',
  },
] as const

export const agenda = [
  ['8:00 – 9:00 AM', 'Arrival, Registration & Breakfast', 'Welcome setup, informal networking, volunteer-managed check-in'],
  ['9:15 – 9:30 AM', 'Opening Ceremony', 'Lamp lighting, welcome address by IEEE Pune Section Execom, Congress vision'],
  ['9:30 – 10:15 AM', 'Keynote 1', 'Address by Mr. Praveen Shukla'],
  ['10:15 – 10:45 AM', 'Panel', '"Young Professionals as Future Entrepreneurs for Viksit Bharat @2047", moderated by Mr. Rakshit Jain'],
  ['11:00 AM – 12:30 PM', 'Parallel Tracks', '5 tracks simultaneously; students choose one'],
  ['12:45 – 1:30 PM', 'Lunch', ''],
  ['1:45 – 3:00 PM', 'Workshops', '3 hands-on workshops; students choose one'],
  ['3:15 – 4:00 PM', 'Student Forum', 'Students from different branches present their projects'],
  ['4:15 – 4:45 PM', 'Origin Stories', 'Top 5 founders speak about their startups'],
  ['4:45 – 5:30 PM', 'Keynote 2', 'Address by Dr. Rajiv Mitra'],
  ['5:30 – 5:45 PM', 'Closing Ceremony', 'Vote of thanks by Student Counsellor, VIT; address by Dr. Abhijit Khurape'],
  ['5:45 – 6:30 PM', 'High Tea & Cultural Night', ''],
] as const

export const speakers = [
  { name: 'Mr. Praveen Shukla', role: 'Keynote 1', bio: 'Opening keynote address.', initials: 'PS' },
  { name: 'Dr. Rajiv Mitra', role: 'Keynote 2', bio: 'Closing keynote address.', initials: 'RM' },
  { name: 'Mr. Rakshit Jain', role: 'Panel Moderator', bio: 'Moderating “Young Professionals as Future Entrepreneurs for Viksit Bharat @2047”.', initials: 'RJ' },
  { name: 'Dr. Abhijit Khurape', role: 'Closing Ceremony', bio: 'Address during the closing ceremony.', initials: 'AK' },
] as const

export const teamRoles = [
  'SAC Chair (overall coordination)',
  'Congress Student Chair & Vice-Chair',
  'Operations Head',
  'Technical Tracks Head',
  'Workshops Head',
  'Origin Stories Head',
  'Sponsorship Head',
  'Marketing & Design Head',
  'Volunteer Coordinator',
  'Cultural Night Lead',
] as const

export const faqItems = [
  ['Who should attend?', 'All students, from any stream, branch or year, including technology, engineering, management, arts and commerce, as well as young professionals.'],
  ['When and where is the congress?', 'The one-day in-person congress is on October 31, 2026. Venue details will be announced.'],
  ['Do I need prerequisites for the tracks?', 'No. The parallel tracks have no prerequisites, and each has a dedicated industry facilitator.'],
  ['Can I register for more than one track or workshop?', 'Choose one parallel track and one hands-on workshop when registering.'],
  ['What is Origin Stories?', 'Five founders aged from their teens to 23 share what they are building and why. It is not a competition: there are no judges or prizes.'],
] as const
