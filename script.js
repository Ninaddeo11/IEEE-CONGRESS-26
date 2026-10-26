// --- DATA STRUCTURES ---

const agendaData = [
    { time: '8:00 - 9:00 AM', title: 'Arrival, Registration & Breakfast', category: 'general', desc: 'Welcome setup, informal networking, volunteer-managed check-in', icon: 'users' },
    { time: '9:15 - 9:30 AM', title: 'Opening Ceremony', category: 'keynote', desc: 'Lamp lighting, welcome address by IEEE Pune Section Execom & Congress vision', icon: 'sparkles' },
    { time: '9:30 - 10:15 AM', title: 'Keynote Speaker 1', category: 'keynote', desc: 'Inspirational address by Mr. Praveen Shukla', icon: 'award' },
    { time: '10:15 - 10:45 AM', title: 'Panel: YP as Future Entrepreneurs', category: 'panel', desc: 'Young Professionals for Viksit Bharat @2047 | Moderated by Mr. Rakshit Jain', icon: 'users' },
    { time: '11:00 - 12:30 PM', title: '5 Parallel Technical Tracks', category: 'tracks', desc: 'Simultaneous deep-dive tracks on Quantum, Data Science, Product, Leadership & Public Speaking', icon: 'cpu' },
    { time: '12:45 - 1:30 PM', title: 'Networking Lunch', category: 'break', desc: 'Complimentary buffet lunch and peer interaction', icon: 'clock' },
    { time: '1:45 - 3:00 PM', title: '3 Parallel Hands-on Workshops', category: 'workshops', desc: 'AI Agent Building, Cyber CTF Lab, and Design Thinking intensive sessions', icon: 'rocket' },
    { time: '3:15 - 4:00 PM', title: 'Student Forum & Project Showcase', category: 'forum', desc: 'Students from various Branches represent their innovative projects', icon: 'lightbulb' },
    { time: '4:15 - 4:45 PM', title: 'Origin Stories: 5 Founders Under 23', category: 'keynote', desc: 'Top 5 student startup founders share their journey (COEP, MIT, VIT, PICT, Symbiosis)', icon: 'award' },
    { time: '4:45 - 5:30 PM', title: 'Keynote Speaker 2', category: 'keynote', desc: 'Valedictory address by Dr. Rajiv Mitra', icon: 'award' },
    { time: '5:30 - 5:45 PM', title: 'Closing Ceremony', category: 'keynote', desc: 'Vote of Thanks by Student Counsellor VIT & Address by Dr. Abhijit Khurape', icon: 'check-circle-2' },
    { time: '5:45 - 6:30 PM', title: 'High Tea & Cultural Night', category: 'break', desc: 'Live student performances and evening celebrations', icon: 'sparkles' }
];

const tracksData = [
    { id: 1, title: 'Quantum Computing - What Every Student Must Know', tag: 'Frontier Tech', desc: 'National Quantum Mission context. IBM/Google fault-tolerant race.', highlights: ['Qiskit basics', 'Quantum algorithms overview', 'Career roadmap'] },
    { id: 2, title: 'Data Science & Analytics in Practice', tag: 'Data & AI', desc: 'Real datasets, industry tools (Python, SQL, Power BI, Tableau).', highlights: ['Exploratory Data Analysis', 'Dashboarding', 'Data storytelling'] },
    { id: 3, title: 'Product Thinking & Building for Users', tag: 'Product & Startup', desc: 'How great products are built: user research, MVP mindset, metrics.', highlights: ['User persona mapping', 'MVP rapid validation', 'Metric tracking'] },
    { id: 4, title: 'Student Leadership & Personal Brand', tag: 'Career Growth', desc: 'How to lead teams and build presence on LinkedIn and GitHub.', highlights: ['GitHub portfolio', 'LinkedIn authority', 'Empathetic leadership'] },
    { id: 5, title: 'Communication, Storytelling & Public Speaking', tag: 'Soft Skills', desc: 'Craft narratives that make stakeholders care. Overcome stage fear.', highlights: ['Elevator pitch framework', 'Body language mastery', 'Overcoming stage anxiety'] }
];

const workshopsData = [
    { id: 1, title: 'Build an AI Agent', desc: 'Students build a working AI agent using modern APIs & frameworks.', badge: '100% Code & Build', icon: 'cpu', outcome: 'Working AI assistant live on GitHub' },
    { id: 2, title: 'Cyber CTF Lab', desc: 'Capture The Flag in a structured format. Guided ethical hacking challenges.', badge: 'Interactive CTF', icon: 'shield', outcome: 'Penetration testing fundamentals exposure' },
    { id: 3, title: 'Design Thinking Challenge', desc: 'Empathize, define, ideate, prototype, and test solutions for real Pune city challenges.', badge: 'Problem Solving', icon: 'compass', outcome: 'Interactive prototype & pitch presentation' }
];

const originFounders = [
    { name: 'Aarav Sharma', age: 21, college: 'COEP Tech', startup: 'EcoSense AI', desc: 'IoT based precision agriculture monitoring for small farmers.' },
    { name: 'Priya Kulkarni', age: 22, college: 'VIT Pune', startup: 'DevFlow HQ', desc: 'AI-assisted developer onboarding platform used by 15+ startups.' },
    { name: 'Rohan Deshmukh', age: 19, college: 'PICT Pune', startup: 'CyberVault', desc: 'Zero-trust authentication protocol for Web3 applications.' },
    { name: 'Ananya Joshi', age: 23, college: 'Symbiosis', startup: 'HealthBridge', desc: 'Localized healthcare triage matching rural clinics with specialists.' },
    { name: 'Tanmay Patil', age: 20, college: 'MIT-WPU', startup: 'MobilityPulse', desc: 'Smart EV fleet management and battery lifecycle predictor.' }
];

// --- INITIALIZATION ---

document.addEventListener('DOMContentLoaded', () => {
    renderAgenda('all');
    renderTracks();
    renderWorkshops();
    renderFounders();
    populateDropdowns();
    setupEventListeners();

    if (window.lucide) lucide.createIcons();
});

// --- RENDER FUNCTIONS ---

function renderAgenda(filterCategory) {
    const container = document.getElementById('agenda-list-container');
    if (!container) return;
    container.innerHTML = '';

    const filtered = agendaData.filter(item => filterCategory === 'all' || item.category === filterCategory);

    filtered.forEach(item => {
        const el = document.createElement('div');
        el.className = 'p-5 rounded-xl bg-purple-950/30 border border-purple-800/40 hover:border-amber-500/40 transition duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group';
        el.setAttribute('data-category', item.category);
        el.innerHTML = `
      <div class="flex items-start gap-4">
        <div class="p-3 bg-purple-900/50 rounded-lg text-amber-400 group-hover:bg-amber-500 group-hover:text-purple-950 transition">
          <i data-lucide="${item.icon}"></i>
        </div>
        <div>
          <span class="text-xs font-mono text-amber-400 font-semibold">${item.time}</span>
          <h3 class="text-lg font-bold text-white group-hover:text-amber-300 transition">${item.title}</h3>
          <p class="text-xs sm:text-sm text-purple-200/80 mt-1">${item.desc}</p>
        </div>
      </div>
      <span class="text-[10px] px-3 py-1 rounded-full bg-purple-900/60 text-purple-300 font-mono uppercase tracking-wider self-start sm:self-center border border-purple-700/40">
        ${item.category}
      </span>
    `;
        container.appendChild(el);
    });

    if (window.lucide) lucide.createIcons();
}

function renderTracks() {
    const container = document.getElementById('tracks-container');
    if (!container) return;
    container.innerHTML = '';

    tracksData.forEach(track => {
        const el = document.createElement('div');
        el.className = 'bg-gradient-to-b from-purple-950/60 to-[#1e0735] border border-purple-800/50 hover:border-amber-400/50 rounded-2xl p-6 flex flex-col justify-between transition duration-300 hover:-translate-y-1 shadow-xl';

        const highlightsHTML = track.highlights.map(h => `
      <li class="flex items-center gap-1.5">
        <i data-lucide="check" class="w-3 h-3 text-emerald-400"></i>
        <span>${h}</span>
      </li>
    `).join('');

        el.innerHTML = `
      <div>
        <div class="flex justify-between items-center mb-4">
          <span class="text-xs font-bold px-3 py-1 rounded-full bg-purple-900/80 text-amber-300 border border-purple-700/50">Track ${track.id}</span>
          <span class="text-[10px] text-purple-300 font-mono uppercase">${track.tag}</span>
        </div>
        <h3 class="text-xl font-bold text-white mb-3 line-clamp-2">${track.title}</h3>
        <p class="text-xs sm:text-sm text-purple-200/80 mb-4 leading-relaxed">${track.desc}</p>
        <div class="bg-purple-900/30 p-3 rounded-lg border border-purple-800/40 mb-4">
          <span class="text-[11px] font-semibold text-amber-400 block mb-1">Key Takeaways:</span>
          <ul class="text-xs text-purple-200 space-y-1">${highlightsHTML}</ul>
        </div>
      </div>
      <button onclick="selectTrackAndOpenModal(${track.id})" class="w-full mt-2 py-2.5 rounded-xl bg-purple-900/60 hover:bg-amber-400 hover:text-purple-950 border border-purple-600/40 text-purple-200 font-bold text-xs transition duration-200 text-center">
        Select Track ${track.id}
      </button>
    `;
        container.appendChild(el);
    });
}

function renderWorkshops() {
    const container = document.getElementById('workshops-container');
    if (!container) return;
    container.innerHTML = '';

    workshopsData.forEach(ws => {
        const el = document.createElement('div');
        el.className = 'relative group bg-gradient-to-b from-[#24083d] to-purple-950/40 border border-purple-800/60 rounded-2xl p-6 hover:border-amber-400/60 transition duration-300 flex flex-col justify-between shadow-2xl';
        el.innerHTML = `
      <div>
        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-purple-950 flex items-center justify-center font-bold mb-5 shadow-lg">
          <i data-lucide="${ws.icon}"></i>
        </div>
        <span class="text-xs font-semibold px-2.5 py-1 rounded bg-purple-900/80 text-amber-300 border border-purple-700/50">${ws.badge}</span>
        <h3 class="text-xl font-bold text-white mt-3 mb-2">${ws.title}</h3>
        <p class="text-xs sm:text-sm text-purple-200/80 mb-6">${ws.desc}</p>
      </div>
      <div class="border-t border-purple-900/60 pt-4 mt-4">
        <div class="text-[11px] text-purple-300 uppercase tracking-wider mb-1">Expected Outcome</div>
        <div class="text-xs font-semibold text-amber-300 flex items-center gap-1.5 mb-4">
          <i data-lucide="rocket" class="w-3.5 h-3.5"></i> ${ws.outcome}
        </div>
        <button onclick="selectWorkshopAndOpenModal(${ws.id})" class="w-full py-2.5 rounded-full bg-white/10 border border-white/20 text-white font-bold text-xs tracking-wide hover:bg-white/20 hover:border-white/30 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] transition duration-300 transform hover:-translate-y-0.5">
          Reserve Workshop Seat
        </button>
      </div>
    `;
        container.appendChild(el);
    });
}

function renderFounders() {
    const container = document.getElementById('founders-container');
    if (!container) return;
    container.innerHTML = '';

    originFounders.forEach(founder => {
        const el = document.createElement('div');
        el.className = 'bg-purple-950/40 border border-purple-800/40 rounded-xl p-5 hover:border-amber-400/40 transition';
        el.innerHTML = `
      <div class="flex justify-between items-start mb-3">
        <div>
          <h3 class="font-bold text-white text-base">${founder.name}</h3>
          <span class="text-xs text-amber-400">${founder.startup}</span>
        </div>
        <span class="text-[10px] px-2 py-0.5 rounded bg-purple-900 text-purple-300 font-mono">
           Age ${founder.age} • ${founder.college}
        </span>
      </div>
      <p class="text-xs text-purple-200/80">${founder.desc}</p>
    `;
        container.appendChild(el);
    });
}

function populateDropdowns() {
    const trackSelect = document.getElementById('select-track');
    if (trackSelect) {
        trackSelect.innerHTML = tracksData.map(t => `<option value="Track ${t.id}: ${t.title}">Track ${t.id}: ${t.title}</option>`).join('');
    }

    const wsSelect = document.getElementById('select-workshop');
    if (wsSelect) {
        wsSelect.innerHTML = workshopsData.map(w => `<option value="Workshop ${w.id}: ${w.title}">Workshop ${w.id}: ${w.title}</option>`).join('');
    }
}

// --- EVENT LISTENERS & MODAL HANDLERS ---

function setupEventListeners() {
    // Mobile Nav Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu) mobileMenu.classList.add('hidden');
        });
    });

    // Supabase Banner Toggle
    const toggleSupabaseBtn = document.getElementById('toggle-supabase-btn');
    const closeSupabaseBtn = document.getElementById('close-supabase-btn');
    const supabaseBanner = document.getElementById('supabase-banner');

    if (toggleSupabaseBtn && supabaseBanner) {
        toggleSupabaseBtn.addEventListener('click', () => supabaseBanner.classList.toggle('hidden'));
    }
    if (closeSupabaseBtn && supabaseBanner) {
        closeSupabaseBtn.addEventListener('click', () => supabaseBanner.classList.add('hidden'));
    }

    // Registration Modal Open & Close
    document.querySelectorAll('.open-register-btn').forEach(btn => {
        btn.addEventListener('click', openRegistrationModal);
    });

    const closeModalBtn = document.getElementById('close-modal-btn');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeRegistrationModal);
    }

    // --- AGENDA FILTER TABS (Direct Click Binding) ---
    const agendaTabs = document.querySelectorAll('.agenda-tab');
    agendaTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            agendaTabs.forEach(b => {
                b.classList.remove('active', 'bg-amber-400', 'text-purple-950');
                b.classList.add('bg-purple-900/40', 'text-white');
            });

            tab.classList.remove('bg-purple-900/40', 'text-white');
            tab.classList.add('active', 'bg-amber-400', 'text-purple-950');

            const filterValue = tab.getAttribute('data-filter');
            renderAgenda(filterValue);
        });
    });

    // Form Submission
    const regForm = document.getElementById('registration-form');
    if (regForm) {
        regForm.addEventListener('submit', event => {
            handleFormSubmit(event).catch(error => {
                console.error('Registration submission failed:', error);
            });
        });
    }

    const closeSuccessBtn = document.getElementById('close-success-btn');
    if (closeSuccessBtn) {
        closeSuccessBtn.addEventListener('click', closeRegistrationModal);
    }
}

function openRegistrationModal() {
    const modal = document.getElementById('register-modal');
    const formView = document.getElementById('form-view');
    const successView = document.getElementById('success-view');
    if (modal) modal.classList.remove('hidden');
    if (formView) formView.classList.remove('hidden');
    if (successView) successView.classList.add('hidden');
}

function closeRegistrationModal() {
    const modal = document.getElementById('register-modal');
    if (modal) modal.classList.add('hidden');
}

function selectTrackAndOpenModal(trackId) {
    const track = tracksData.find(t => t.id === trackId);
    if (track) {
        const selectTrack = document.getElementById('select-track');
        if (selectTrack) selectTrack.value = `Track ${track.id}: ${track.title}`;
    }
    openRegistrationModal();
}

function selectWorkshopAndOpenModal(wsId) {
    const ws = workshopsData.find(w => w.id === wsId);
    if (ws) {
        const selectWs = document.getElementById('select-workshop');
        if (selectWs) selectWs.value = `Workshop ${ws.id}: ${ws.title}`;
    }
    openRegistrationModal();
}

async function handleFormSubmit(event) {
    event.preventDefault();
    const submitBtn = document.getElementById('submit-btn');
    const form = document.getElementById('registration-form');
    const errorMessage = document.getElementById('registration-error');
    const formView = document.getElementById('form-view');
    const successView = document.getElementById('success-view');
    const supabaseClient = window.supabaseClient;
    if (!submitBtn || !form || !errorMessage || !formView || !successView) return;

    errorMessage.textContent = '';
    errorMessage.classList.add('hidden');
    if (!supabaseClient) {
        errorMessage.textContent = 'Registration is not configured yet. Please try again later.';
        errorMessage.classList.remove('hidden');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Saving Registration...</span>';

    try {
        const { error } = await supabaseClient.from('registrations').insert({
            full_name: document.getElementById('input-fullname').value.trim(),
            email: document.getElementById('input-email').value.trim().toLowerCase(),
            phone: document.getElementById('input-phone').value.trim(),
            college: document.getElementById('input-college').value.trim(),
            ieee_id: document.getElementById('input-ieeeid').value.trim() || null,
            track: document.getElementById('select-track').value,
            workshop: document.getElementById('select-workshop').value
        });

        if (error) throw error;

        form.reset();
        formView.classList.add('hidden');
        successView.classList.remove('hidden');
    } catch (error) {
        console.error('Could not save registration:', error);
        errorMessage.textContent = error.code === '23505'
            ? 'This email address is already registered.'
            : 'We could not save your registration. Please try again later.';
        errorMessage.classList.remove('hidden');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Confirm Registration</span> <i data-lucide="check-circle-2" class="w-4 h-4"></i>`;
        if (window.lucide) lucide.createIcons();
    }
}
