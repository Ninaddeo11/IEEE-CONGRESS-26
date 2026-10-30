-- Run once in the Supabase SQL Editor if the table was created with the old
-- workshop list ('Workshop 2: Cyber CTF Lab'). Without it, every registration
-- for Android Programming is rejected by the check constraint.
alter table public.registrations drop constraint if exists registrations_workshop_check;
alter table public.registrations add constraint registrations_workshop_check
    check (workshop in (
        'Workshop 1: Build an AI Agent',
        'Workshop 2: Android Programming',
        'Workshop 3: Design Thinking Challenge'
    ));
