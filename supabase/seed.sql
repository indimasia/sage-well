-- ============================================================
-- SageWell seed data. Run AFTER schema.sql, in Supabase SQL Editor.
-- Idempotent: skips if appointments already exist.
-- Seeds relative to your real demo accounts (created via the app).
-- ============================================================

do $$
declare
  dir_ids uuid[];
  real_ther uuid[];
  real_pat uuid[];
  first_ther uuid;
begin
  if (select count(*) from public.appointments) > 0 then
    raise notice 'appointments already exist — skipping seed';
    return;
  end if;

  -- ---- Directory therapists (filler, not login accounts) ----
  with ins as (
    insert into public.therapists (name, specialty, bio, years_experience, rating)
    values
      ('Dr. Ada Adeyemi',  'Anxiety & depression', 'Warm, evidence-based CBT for adults navigating anxiety and low mood.', 9,  4.9),
      ('Dr. Milo Hartley', 'Couples therapy',      'Gottman-method couples and relationship counselling.',                12, 4.8),
      ('Dr. Priya Nair',   'Trauma & PTSD',        'EMDR and somatic approaches to trauma recovery.',                     7,  4.9),
      ('Dr. Sofia Ramos',  'Adolescent therapy',   'Teens and family systems, ages 12–18.',                               6,  4.7),
      ('Dr. Leo Kimura',   'Mindfulness & stress', 'ACT and mindfulness for burnout, stress and life transitions.',       10, 4.8)
    returning id
  )
  select array_agg(id) into dir_ids from ins;

  -- ---- Filler patients (caseload, not login accounts) ----
  insert into public.patients (name, email) values
    ('Jordan Mills',   'jordan.m@example.com'),
    ('Riley Chen',     'riley.c@example.com'),
    ('Sam Okafor',     'sam.o@example.com'),
    ('Taylor Brooks',  'taylor.b@example.com'),
    ('Casey Nguyen',   'casey.n@example.com'),
    ('Devon Patel',    'devon.p@example.com');

  -- ---- Identify real login accounts (rows whose id is an auth user) ----
  select array_agg(id) into real_ther
    from public.therapists where id in (select id from auth.users);
  select array_agg(id) into real_pat
    from public.patients where id in (select id from auth.users);
  first_ther := (real_ther)[1];

  -- ---- Appointments for each real THERAPIST (dashboard data) ----
  -- Upcoming (future) with filler patients
  insert into public.appointments (therapist_id, patient_id, start_time, visit_type, status, reason)
  select t.id, p.id,
         now() + (p.rn * interval '1 day') + interval '3 hour',
         case when p.rn % 2 = 0 then 'video' else 'in_person' end,
         'upcoming',
         (array['Anxiety follow-up','Weekly check-in','Intake session','CBT session'])[1 + (p.rn % 4)]
  from unnest(coalesce(real_ther,'{}')) as t(id)
  cross join lateral (
    select id, row_number() over () as rn
    from public.patients
    where id <> all (coalesce(real_pat,'{}'))
    limit 4
  ) p;

  -- Completed (past) with filler patients
  insert into public.appointments (
    therapist_id, patient_id, start_time, started_at, ended_at,
    visit_type, status, reason
  )
  select t.id, p.id,
         now() - (p.rn * interval '2 day'),
         now() - (p.rn * interval '2 day'),
         now() - (p.rn * interval '2 day') + interval '50 minute',
         'video', 'completed',
         'Session recap'
  from unnest(coalesce(real_ther,'{}')) as t(id)
  cross join lateral (
    select id, row_number() over () as rn
    from public.patients
    where id <> all (coalesce(real_pat,'{}'))
    limit 3
  ) p;

  -- One cancelled (past)
  insert into public.appointments (therapist_id, patient_id, start_time, visit_type, status, reason)
  select t.id, (select id from public.patients where id <> all (coalesce(real_pat,'{}')) limit 1),
         now() - interval '5 day', 'video', 'cancelled', 'Client rescheduled'
  from unnest(coalesce(real_ther,'{}')) as t(id);

  -- ---- Appointments for each real PATIENT (portal data) ----
  insert into public.appointments (therapist_id, patient_id, start_time, visit_type, status, reason)
  select t.id, p.id,
         now() + (t.rn * interval '2 day') + interval '5 hour',
         case when t.rn % 2 = 0 then 'video' else 'in_person' end,
         'upcoming', 'Therapy session'
  from unnest(coalesce(real_pat,'{}')) as p(id)
  cross join lateral (
    select unnest as id, row_number() over () as rn
    from unnest(dir_ids) limit 3
  ) t;

  -- ---- Session notes for completed sessions ----
  insert into public.session_notes (appointment_id, therapist_id, subjective, objective, assessment, plan)
  select a.id, a.therapist_id,
         'Client reports improved sleep and fewer panic episodes this week.',
         'Calm affect, engaged, oriented x3. No acute risk.',
         'Generalised anxiety — responding well to CBT.',
         'Continue weekly CBT; introduce exposure hierarchy next session.'
  from public.appointments a
  where a.status = 'completed'
  on conflict (appointment_id) do nothing;

  -- ---- A message thread between a real patient and a real therapist ----
  if first_ther is not null and real_pat is not null then
    insert into public.threads (therapist_id, patient_id)
    select first_ther, p
    from unnest(real_pat) as p
    on conflict (therapist_id, patient_id) do nothing;

    insert into public.messages (thread_id, sender_id, body)
    select th.id, th.patient_id, 'Hi — looking forward to our next session.'
    from public.threads th;

    insert into public.messages (thread_id, sender_id, body)
    select th.id, th.therapist_id, 'Likewise. Remember the breathing exercise we practised.'
    from public.threads th;
  end if;

  raise notice 'seed complete';
end;
$$;
