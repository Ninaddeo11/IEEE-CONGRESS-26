create table if not exists public.registrations (
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz not null default now(),
    full_name text not null check (char_length(btrim(full_name)) between 1 and 150),
    email text not null check (char_length(email) between 3 and 320 and position('@' in email) > 1),
    phone text not null check (char_length(phone) between 5 and 40),
    college text not null check (char_length(btrim(college)) between 1 and 200),
    ieee_id text check (ieee_id is null or char_length(ieee_id) <= 40),
    track text not null check (track in (
        'Track 1: Quantum Computing - What Every Student Must Know',
        'Track 2: Data Science & Analytics in Practice',
        'Track 3: Product Thinking & Building for Users',
        'Track 4: Student Leadership & Personal Brand',
        'Track 5: Communication, Storytelling & Public Speaking'
    )),
    workshop text not null check (workshop in (
        'Workshop 1: Build an AI Agent',
        'Workshop 2: Cyber CTF Lab',
        'Workshop 3: Design Thinking Challenge'
    )),
    status text not null default 'confirmed' check (status in ('confirmed', 'cancelled'))
);

create unique index if not exists registrations_email_lower_unique
    on public.registrations (lower(email));

alter table public.registrations enable row level security;

revoke all on table public.registrations from public, anon, authenticated;
grant select on table public.registrations to authenticated;
grant insert (full_name, email, phone, college, ieee_id, track, workshop)
    on table public.registrations to anon, authenticated;

drop policy if exists "Anyone can submit a registration" on public.registrations;
create policy "Anyone can submit a registration"
    on public.registrations for insert to anon, authenticated
    with check (true);

drop policy if exists "Admins can view registrations" on public.registrations;
create policy "Admins can view registrations"
    on public.registrations for select to authenticated
    using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
