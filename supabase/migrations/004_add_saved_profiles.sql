-- Saved profiles: named scenario/location/category presets a logged-in user
-- can save and reopen. Distinct from `companies` (one business per user) —
-- a user can have many saved profiles.

create table if not exists public.saved_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  scenario text,
  country text,
  province text,
  us_state text,
  category text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists saved_profiles_user_id_idx on public.saved_profiles (user_id);

alter table public.saved_profiles enable row level security;

create policy "Users can view own saved profiles"
  on public.saved_profiles for select
  using (auth.uid() = user_id);

create policy "Users can insert own saved profiles"
  on public.saved_profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update own saved profiles"
  on public.saved_profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own saved profiles"
  on public.saved_profiles for delete
  using (auth.uid() = user_id);
