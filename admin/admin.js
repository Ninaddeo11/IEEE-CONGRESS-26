const PAGE_SIZE = 50;
let currentPage = 0;
let supabaseClient;

document.addEventListener('DOMContentLoaded', async () => {
    supabaseClient = window.supabaseClient;
    if (!supabaseClient) {
        showLoginError('Admin login is not configured.');
        return;
    }

    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('signout-button').addEventListener('click', signOut);
    document.getElementById('refresh-button').addEventListener('click', () => loadRegistrations());
    document.getElementById('previous-page').addEventListener('click', () => {
        if (currentPage > 0) loadRegistrations(currentPage - 1);
    });
    document.getElementById('next-page').addEventListener('click', () => loadRegistrations(currentPage + 1));

    const { data: { session }, error } = await supabaseClient.auth.getSession();
    if (error) {
        showLoginError('Could not check the current session. Please reload and try again.');
        return;
    }
    if (session) await showRegistrations(session.user);
});

async function handleLogin(event) {
    event.preventDefault();
    const button = document.getElementById('login-button');
    button.disabled = true;
    button.textContent = 'Signing in...';
    showLoginError('');

    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value
    });

    button.disabled = false;
    button.textContent = 'Sign in';
    if (error) {
        showLoginError('Sign-in failed. Check your email and password.');
        return;
    }
    await showRegistrations(data.user);
}

async function showRegistrations(user) {
    if (user.app_metadata?.role !== 'admin') {
        showLoginError('This account is not authorized to view registrations.');
        const { error } = await supabaseClient.auth.signOut();
        if (error) console.error('Could not clear unauthorized session:', error);
        return;
    }

    document.getElementById('login-panel').classList.add('hidden');
    document.getElementById('registrations-panel').classList.remove('hidden');
    await loadRegistrations(0);
}

async function loadRegistrations(page = currentPage) {
    const status = document.getElementById('page-status');
    const errorMessage = document.getElementById('data-error');
    const body = document.getElementById('registrations-body');
    const previousButton = document.getElementById('previous-page');
    const nextButton = document.getElementById('next-page');
    const start = page * PAGE_SIZE;

    currentPage = page;
    status.textContent = 'Loading registrations...';
    errorMessage.textContent = '';
    errorMessage.classList.add('hidden');
    body.replaceChildren();

    const { data, error } = await supabaseClient
        .from('registrations')
        .select('created_at, full_name, email, phone, college, ieee_id, track, workshop')
        .order('created_at', { ascending: false })
        .range(start, start + PAGE_SIZE);

    if (error) {
        console.error('Could not load registrations:', error);
        status.textContent = '';
        errorMessage.textContent = 'Could not load registrations. Check the Supabase table and admin access policies.';
        errorMessage.classList.remove('hidden');
        return;
    }

    const hasNextPage = data.length > PAGE_SIZE;
    const rows = data.slice(0, PAGE_SIZE);
    for (const registration of rows) {
        const row = document.createElement('tr');
        const values = [
            formatDate(registration.created_at),
            registration.full_name,
            registration.email,
            registration.phone,
            registration.college,
            registration.ieee_id || '—',
            registration.track,
            registration.workshop
        ];
        for (const value of values) {
            const cell = document.createElement('td');
            cell.className = 'whitespace-nowrap px-4 py-3 text-purple-100';
            cell.textContent = value;
            row.appendChild(cell);
        }
        body.appendChild(row);
    }

    status.textContent = rows.length
        ? `${rows.length} registration${rows.length === 1 ? '' : 's'} on this page`
        : page === 0 ? 'No registrations yet.' : 'No registrations on this page.';
    document.getElementById('page-number').textContent = `Page ${page + 1}`;
    previousButton.disabled = page === 0;
    nextButton.disabled = !hasNextPage;
}

async function signOut() {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
        console.error('Could not sign out:', error);
        document.getElementById('data-error').textContent = 'Sign out failed. Please try again.';
        document.getElementById('data-error').classList.remove('hidden');
        return;
    }
    window.location.reload();
}

function showLoginError(message) {
    const error = document.getElementById('login-error');
    error.textContent = message;
    error.classList.toggle('hidden', !message);
}

function formatDate(value) {
    return new Intl.DateTimeFormat(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short'
    }).format(new Date(value));
}
