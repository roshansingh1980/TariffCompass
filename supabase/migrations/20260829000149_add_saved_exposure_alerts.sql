alter table public.saved_profiles
  add column if not exists product_description text,
  add column if not exists monitoring_active boolean not null default true;

create index if not exists saved_profiles_active_monitoring_idx
  on public.saved_profiles (user_id, monitoring_active)
  where monitoring_active = true;

create table if not exists public.trade_exposure_alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  saved_profile_id uuid not null references public.saved_profiles (id) on delete cascade,
  trade_measure_id uuid not null references public.trade_measures (id) on delete cascade,
  change_event_id uuid not null references public.trade_measure_changes (id) on delete cascade,
  alert_type text not null check (alert_type in ('trade_measure_change')),
  severity text not null check (severity in ('material', 'informational')),
  payload jsonb not null,
  created_at timestamptz not null default now(),
  read_at timestamptz,
  dismissed_at timestamptz,
  unique (saved_profile_id, change_event_id)
);

create index if not exists trade_exposure_alerts_user_created_idx
  on public.trade_exposure_alerts (user_id, created_at desc);

alter table public.trade_exposure_alerts enable row level security;

create policy "Users can view own exposure alerts"
  on public.trade_exposure_alerts for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert own exposure alerts"
  on public.trade_exposure_alerts for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1 from public.saved_profiles
      where saved_profiles.id = saved_profile_id
        and saved_profiles.user_id = (select auth.uid())
    )
  );

create policy "Users can update own exposure alert state"
  on public.trade_exposure_alerts for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

grant select, insert on public.trade_exposure_alerts to authenticated;
grant update (read_at, dismissed_at) on public.trade_exposure_alerts to authenticated;
grant select, insert, update, delete on public.saved_profiles to authenticated;
