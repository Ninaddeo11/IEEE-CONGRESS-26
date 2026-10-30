window.supabaseClient = window.supabase?.createClient
    ? window.supabase.createClient(
        'https://njlowyjrqxryzondenri.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qbG93eWpycXhyeXpvbmRlbnJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMwMjA4NTksImV4cCI6MjEwODU5Njg1OX0.7cIt41jrIqAOmOdyohdRDemNXdexE1L-FZnBQ87rYM0'
    )
    : null;
