-- ============================================================
-- SageWell schema — tables, RLS policies, auto-profile trigger
-- Run in Supabase → SQL Editor. Safe to re-run.
-- ============================================================

-- ---------- Tables ----------

-- id equals the auth user id for real therapist accounts (set by the
-- signup trigger); seeded directory therapists get a random uuid.
create table if not exists public.therapists (
  id uuid primary key default gen_random_uuid(),
  name text not null default '',
  specialty text not null default 'General practice',
  bio text not null default '',
  years_experience int not null default 1,
  rating numeric(2,1) not null default 5.0,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
  name text not null default '',
  email text not null default '',
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  therapist_id uuid not null references public.therapists (id) on delete cascade,
  patient_id uuid not null references public.patients (id) on delete cascade,
  start_time timestamptz not null,
  duration_min int not null default 50,
  visit_type text not null default 'video' check (visit_type in ('video','in_person')),
  status text not null default 'upcoming' check (status in ('upcoming','completed','cancelled')),
  reason text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.session_notes (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid not null unique references public.appointments (id) on delete cascade,
  therapist_id uuid not null references public.therapists (id) on delete cascade,
  subjective text not null default '',
  objective text not null default '',
  assessment text not null default '',
  plan text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.threads (
  id uuid primary key default gen_random_uuid(),
  therapist_id uuid not null references public.therapists (id) on delete cascade,
  patient_id uuid not null references public.patients (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (therapist_id, patient_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.threads (id) on delete cascade,
  sender_id uuid not null references auth.users (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

-- Per-user read cursor for a thread (drives unread badges).
create table if not exists public.thread_reads (
  thread_id uuid not null references public.threads (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  last_read_at timestamptz not null default now(),
  primary key (thread_id, user_id)
);

create index if not exists appointments_therapist_idx on public.appointments (therapist_id, start_time);
create index if not exists appointments_patient_idx on public.appointments (patient_id, start_time);
create index if not exists messages_thread_idx on public.messages (thread_id, created_at);

-- Stripe checkout session id, so a paid booking inserts exactly once.
alter table public.appointments
  add column if not exists stripe_session_id text unique;

-- thread_reads: each user manages only their own read cursor.
drop policy if exists thread_reads_all on public.thread_reads;
create policy thread_reads_all on public.thread_reads
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Realtime for live chat.
do $$ begin
  alter publication supabase_realtime add table public.messages;
exception when duplicate_object then null; end $$;

-- ---------- Auto-create a profile row when a user signs up ----------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  r text := coalesce(new.raw_user_meta_data ->> 'role', 'patient');
  dn text := coalesce(
    nullif(new.raw_user_meta_data ->> 'display_name', ''),
    split_part(new.email, '@', 1)
  );
begin
  if r = 'therapist' then
    insert into public.therapists (id, name)
    values (new.id, dn)
    on conflict (id) do nothing;
  else
    insert into public.patients (id, name, email)
    values (new.id, dn, new.email)
    on conflict (id) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill profiles for users that already exist.
insert into public.therapists (id, name)
select u.id,
       coalesce(nullif(u.raw_user_meta_data ->> 'display_name',''), split_part(u.email,'@',1))
from auth.users u
where coalesce(u.raw_user_meta_data ->> 'role','patient') = 'therapist'
on conflict (id) do nothing;

insert into public.patients (id, name, email)
select u.id,
       coalesce(nullif(u.raw_user_meta_data ->> 'display_name',''), split_part(u.email,'@',1)),
       u.email
from auth.users u
where coalesce(u.raw_user_meta_data ->> 'role','patient') <> 'therapist'
on conflict (id) do nothing;

-- ---------- Row Level Security ----------

alter table public.therapists    enable row level security;
alter table public.patients      enable row level security;
alter table public.appointments  enable row level security;
alter table public.session_notes enable row level security;
alter table public.threads       enable row level security;
alter table public.messages      enable row level security;
alter table public.thread_reads  enable row level security;

-- therapists: public directory read; owner writes own row
drop policy if exists therapists_read on public.therapists;
create policy therapists_read on public.therapists
  for select using (true);
drop policy if exists therapists_update_own on public.therapists;
create policy therapists_update_own on public.therapists
  for update using (id = auth.uid()) with check (id = auth.uid());

-- patients: self, or a therapist who shares an appointment or message thread
drop policy if exists patients_read on public.patients;
create policy patients_read on public.patients
  for select using (
    id = auth.uid()
    or exists (
      select 1 from public.appointments a
      where a.patient_id = patients.id and a.therapist_id = auth.uid()
    )
    or exists (
      select 1 from public.threads t
      where t.patient_id = patients.id and t.therapist_id = auth.uid()
    )
  );
drop policy if exists patients_update_own on public.patients;
create policy patients_update_own on public.patients
  for update using (id = auth.uid()) with check (id = auth.uid());

-- appointments: visible to the matching therapist or patient (the core RLS demo)
drop policy if exists appts_read on public.appointments;
create policy appts_read on public.appointments
  for select using (therapist_id = auth.uid() or patient_id = auth.uid());
drop policy if exists appts_insert on public.appointments;
create policy appts_insert on public.appointments
  for insert with check (patient_id = auth.uid());
drop policy if exists appts_update on public.appointments;
create policy appts_update on public.appointments
  for update using (therapist_id = auth.uid() or patient_id = auth.uid())
  with check (therapist_id = auth.uid() or patient_id = auth.uid());

-- session_notes: only the authoring therapist
drop policy if exists notes_all on public.session_notes;
create policy notes_all on public.session_notes
  for all using (therapist_id = auth.uid()) with check (therapist_id = auth.uid());

-- threads: participants only
drop policy if exists threads_read on public.threads;
create policy threads_read on public.threads
  for select using (therapist_id = auth.uid() or patient_id = auth.uid());
drop policy if exists threads_insert on public.threads;
create policy threads_insert on public.threads
  for insert with check (therapist_id = auth.uid() or patient_id = auth.uid());

-- messages: participants of the thread; sender must be self
drop policy if exists messages_read on public.messages;
create policy messages_read on public.messages
  for select using (
    exists (
      select 1 from public.threads t
      where t.id = messages.thread_id
        and (t.therapist_id = auth.uid() or t.patient_id = auth.uid())
    )
  );
drop policy if exists messages_insert on public.messages;
create policy messages_insert on public.messages
  for insert with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.threads t
      where t.id = messages.thread_id
        and (t.therapist_id = auth.uid() or t.patient_id = auth.uid())
    )
  );
