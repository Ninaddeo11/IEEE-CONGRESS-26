create extension if not exists pgcrypto with schema public;

create table public.tracks (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text not null,
  capacity integer not null default 60 check (capacity >= 0),
  registered_count integer not null default 0 check (registered_count >= 0),
  sort_order integer not null default 0,
  constraint tracks_not_overbooked check (registered_count <= capacity)
);

create table public.workshops (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text not null,
  capacity integer not null default 100 check (capacity >= 0),
  registered_count integer not null default 0 check (registered_count >= 0),
  sort_order integer not null default 0,
  constraint workshops_not_overbooked check (registered_count <= capacity)
);

create table public.registrations (
  id uuid primary key default gen_random_uuid(),
  ticket_code text unique not null,
  full_name text not null,
  email text not null,
  phone text not null,
  college text not null,
  stream text not null,
  year_of_study text not null check (year_of_study in ('1st', '2nd', '3rd', '4th', 'PG', 'Working professional')),
  is_ieee_member boolean not null default false,
  ieee_membership_no text,
  dietary text check (dietary is null or dietary in ('veg', 'non-veg', 'jain')),
  consent boolean not null default false check (consent),
  track_id uuid not null references public.tracks(id),
  workshop_id uuid not null references public.workshops(id),
  checked_in boolean not null default false,
  created_at timestamptz not null default now()
);

create unique index registrations_email_unique on public.registrations (lower(email));
create index registrations_track_id_idx on public.registrations (track_id);
create index registrations_workshop_id_idx on public.registrations (workshop_id);

create table public.admins (
  user_id uuid primary key references auth.users(id)
);

alter table public.tracks enable row level security;
alter table public.workshops enable row level security;
alter table public.registrations enable row level security;
alter table public.admins enable row level security;

create policy "public read tracks" on public.tracks
  for select to anon, authenticated using (true);
create policy "public read workshops" on public.workshops
  for select to anon, authenticated using (true);
create policy "admin update tracks" on public.tracks
  for update to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));
create policy "admin update workshops" on public.workshops
  for update to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));
create policy "admin self check" on public.admins
  for select to authenticated using (auth.uid() = user_id);
create policy "admin read registrations" on public.registrations
  for select to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()));
create policy "admin update registrations" on public.registrations
  for update to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

revoke all on public.registrations from anon, authenticated;
grant select, update (checked_in) on public.registrations to authenticated;
grant select on public.tracks, public.workshops to anon, authenticated;
revoke insert, delete on public.tracks, public.workshops from anon, authenticated;
grant update (capacity) on public.tracks, public.workshops to authenticated;
grant select on public.admins to authenticated;

create or replace function public.register_student(
  p_full_name text,
  p_email text,
  p_phone text,
  p_college text,
  p_stream text,
  p_year text,
  p_is_ieee_member boolean,
  p_ieee_no text,
  p_dietary text,
  p_track_id uuid,
  p_workshop_id uuid,
  p_consent boolean
) returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_track public.tracks%rowtype;
  v_workshop public.workshops%rowtype;
  v_ticket text;
begin
  if coalesce(length(trim(p_full_name)), 0) < 2
     or length(p_full_name) > 120
     or coalesce(length(trim(p_email)), 0) > 254
     or coalesce(trim(p_email), '') !~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
     or coalesce(p_phone, '') !~ '^[6-9][0-9]{9}$'
     or coalesce(length(trim(p_college)), 0) < 2
     or length(p_college) > 160
     or coalesce(length(trim(p_stream)), 0) < 2
     or length(p_stream) > 120
     or coalesce(p_year, '') not in ('1st', '2nd', '3rd', '4th', 'PG', 'Working professional')
     or coalesce(p_dietary, '') not in ('veg', 'non-veg', 'jain')
     or p_consent is distinct from true then
    return jsonb_build_object('ok', false, 'code', 'INVALID_INPUT',
      'message', 'Please check your details and try again.');
  end if;

  if exists (
    select 1 from public.registrations r
    where lower(r.email) = lower(trim(p_email))
  ) then
    return jsonb_build_object('ok', false, 'code', 'DUPLICATE_EMAIL',
      'message', 'This email is already registered.');
  end if;

  select * into v_track
    from public.tracks
    where id = p_track_id
    for update;
  if not found then
    return jsonb_build_object('ok', false, 'code', 'INVALID_TRACK',
      'message', 'Selected track not found.');
  end if;
  if v_track.registered_count >= v_track.capacity then
    return jsonb_build_object('ok', false, 'code', 'TRACK_FULL',
      'message', 'Registration for ' || v_track.title || ' is full. Please choose another track.');
  end if;

  select * into v_workshop
    from public.workshops
    where id = p_workshop_id
    for update;
  if not found then
    return jsonb_build_object('ok', false, 'code', 'INVALID_WORKSHOP',
      'message', 'Selected workshop not found.');
  end if;
  if v_workshop.registered_count >= v_workshop.capacity then
    return jsonb_build_object('ok', false, 'code', 'WORKSHOP_FULL',
      'message', 'Registration for ' || v_workshop.title || ' is full. Please choose another workshop.');
  end if;

  v_ticket := 'IEEE26-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10));

  insert into public.registrations (
    ticket_code, full_name, email, phone, college, stream, year_of_study,
    is_ieee_member, ieee_membership_no, dietary, consent, track_id, workshop_id
  ) values (
    v_ticket, trim(p_full_name), lower(trim(p_email)), p_phone, trim(p_college),
    trim(p_stream), p_year, coalesce(p_is_ieee_member, false), nullif(trim(p_ieee_no), ''),
    p_dietary, p_consent, p_track_id, p_workshop_id
  );

  update public.tracks
    set registered_count = registered_count + 1
    where id = p_track_id;
  update public.workshops
    set registered_count = registered_count + 1
    where id = p_workshop_id;

  return jsonb_build_object('ok', true, 'ticket_code', v_ticket,
    'track', v_track.title, 'workshop', v_workshop.title);
exception
  when unique_violation then
    return jsonb_build_object('ok', false, 'code', 'DUPLICATE_EMAIL',
      'message', 'This email is already registered.');
end;
$$;

revoke all on function public.register_student(
  text, text, text, text, text, text, boolean, text, text, uuid, uuid, boolean
) from public;
grant execute on function public.register_student(
  text, text, text, text, text, text, boolean, text, text, uuid, uuid, boolean
) to anon, authenticated;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'tracks'
  ) then
    alter publication supabase_realtime add table public.tracks;
  end if;
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'workshops'
  ) then
    alter publication supabase_realtime add table public.workshops;
  end if;
end;
$$;
