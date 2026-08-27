-- Moves rate/source/key-date/program data out of code-resident files into
-- Postgres. Public read (anyone, including anonymous visitors, needs this
-- data on the Results screen and homepage); writes are service-role only —
-- no insert/update/delete policy exists for anon/authenticated, and the
-- service role bypasses RLS entirely, so no such policy is needed for it.
--
-- measure_type and effective_from are both nullable and intentionally left
-- NULL wherever the mapping is genuinely ambiguous (a single rate string
-- blending two overlapping trade actions) or unknown (no legal effective
-- date exists in the source code, only a review/authored date) — see the
-- seed script for exactly which rows get which value and why.

create table if not exists public.sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  url text not null,
  covers text not null,
  last_checked date not null
);

alter table public.sources enable row level security;
create policy "Anyone can view sources" on public.sources for select using (true);

create table if not exists public.tariff_rates (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  hs_code text,
  origin_country text not null,
  destination_country text not null,
  rate_min numeric,
  rate_max numeric,
  measure_type text,
  confidence text not null,
  source_id uuid references public.sources (id),
  effective_from date,
  effective_to date,
  reviewed_at date not null
);

create index if not exists tariff_rates_category_idx on public.tariff_rates (category);
create index if not exists tariff_rates_origin_destination_idx
  on public.tariff_rates (origin_country, destination_country);

alter table public.tariff_rates enable row level security;
create policy "Anyone can view tariff rates" on public.tariff_rates for select using (true);

create table if not exists public.key_dates (
  id uuid primary key default gen_random_uuid(),
  effective_date date not null,
  title text not null,
  description text not null,
  affected_categories text[] not null default '{}',
  source_id uuid references public.sources (id),
  confidence text not null,
  last_checked date not null
);

create index if not exists key_dates_effective_date_idx on public.key_dates (effective_date);

alter table public.key_dates enable row level security;
create policy "Anyone can view key dates" on public.key_dates for select using (true);

-- opens_at/closes_at/intake_status are added now (all nullable, always NULL
-- at seed time) so this table doesn't need a second migration later — see
-- the "program deadline schema" task. Nothing populates or surfaces them yet.
create table if not exists public.support_programs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  who_its_for text not null,
  href text not null,
  import_caveat text,
  opens_at date,
  closes_at date,
  intake_status text,
  last_checked date not null
);

alter table public.support_programs enable row level security;
create policy "Anyone can view support programs" on public.support_programs for select using (true);
