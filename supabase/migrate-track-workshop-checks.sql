-- Run once in the Supabase SQL Editor. The live table's check constraints do not
-- match the track/workshop values the website sends, so every registration is
-- rejected (error 23514). This renames rows saved under the old names, then
-- resets both lists to match script.js.
alter table public.registrations drop constraint if exists registrations_track_check;
alter table public.registrations drop constraint if exists registrations_workshop_check;

update public.registrations
set track = 'Track 5: Communication, Storytelling & Public Speaking'
where track = 'Track 5: Storytelling & Public Speaking';

update public.registrations
set workshop = 'Workshop 2: Android Programming'
where workshop = 'Workshop 2: Cyber CTF Lab';

alter table public.registrations add constraint registrations_track_check
    check (track in (
        'Track 1: Quantum Computing - What Every Student Must Know',
        'Track 2: Data Science & Analytics in Practice',
        'Track 3: Product Thinking & Building for Users',
        'Track 4: Student Leadership & Personal Brand',
        'Track 5: Communication, Storytelling & Public Speaking'
    ));

alter table public.registrations add constraint registrations_workshop_check
    check (workshop in (
        'Workshop 1: Build an AI Agent',
        'Workshop 2: Android Programming',
        'Workshop 3: Design Thinking Challenge'
    ));
