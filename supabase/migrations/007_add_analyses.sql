-- Saved-analysis history: one row per time a logged-in user reaches Results
-- with a valid annual value entered, capturing the computed exposure and a
-- snapshot of the rate data behind it at that moment. Distinct from
-- `saved_profiles` (a named preset of inputs) — this is an append-only log
-- of computed outputs over time, the basis for a future "has this changed
-- since you last checked" comparison. That comparison job and any related
-- notification are explicitly out of scope here — this migration only adds
-- the table and RLS; nothing in the app writes to it yet beyond a single
-- insert per qualifying Results visit.

create table if not exists public.analyses (
  id uuid primary key default gen_random_uuid(),
  saved_profile_id uuid references public.saved_profiles (id) on delete set null,
  user_id uuid not null references public.profiles (id) on delete cascade,
  category text,
  hs_code text,
  annual_value numeric,
  currency text,
  destination_country text,
  computed_rate_min numeric,
  computed_rate_max numeric,
  exposure_low numeric,
  exposure_mid numeric,
  exposure_high numeric,
  rate_snapshot jsonb,
  created_at timestamptz not null default now()
);

create index if not exists analyses_user_id_idx on public.analyses (user_id);
create index if not exists analyses_saved_profile_id_idx on public.analyses (saved_profile_id);

alter table public.analyses enable row level security;

create policy "Users can view own analyses"
  on public.analyses for select
  using (auth.uid() = user_id);

create policy "Users can insert own analyses"
  on public.analyses for insert
  with check (auth.uid() = user_id);
