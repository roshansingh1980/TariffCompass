-- Canonical policy-event model. tariff_rates remains the current/base
-- comparison model; additional policy measures and HS applicability live here.

alter table public.sources add column if not exists jurisdiction text;
alter table public.sources add column if not exists authority_tier text;
alter table public.sources add column if not exists source_type text;
alter table public.sources add column if not exists retrieved_at date;
alter table public.sources add column if not exists legal_instrument_identifier text;
alter table public.sources add column if not exists source_status_note text;

alter table public.sources drop constraint if exists sources_authority_tier_check;
alter table public.sources add constraint sources_authority_tier_check
  check (authority_tier is null or authority_tier in ('legal', 'administrative', 'official_announcement'));

create table if not exists public.trade_measures (
  id uuid primary key default gen_random_uuid(),
  jurisdiction text not null,
  title text not null,
  short_name text not null,
  measure_type text not null,
  announcement_date date,
  effective_from date,
  effective_to date,
  origin_country text,
  destination_country text,
  applicability_note text,
  confidence text not null check (confidence in ('verified', 'provisional', 'limited')),
  reviewed_at date not null,
  created_at timestamptz not null default now(),
  check (effective_to is null or effective_from is null or effective_to >= effective_from)
);

create table if not exists public.trade_measure_sources (
  trade_measure_id uuid not null references public.trade_measures (id) on delete cascade,
  source_id uuid not null references public.sources (id) on delete restrict,
  primary key (trade_measure_id, source_id)
);

create table if not exists public.trade_measure_applicability (
  id uuid primary key default gen_random_uuid(),
  trade_measure_id uuid not null references public.trade_measures (id) on delete cascade,
  hs_code text not null check (hs_code ~ '^[0-9]{6}$'),
  national_tariff_item text,
  product_description text not null,
  additional_rate numeric check (additional_rate is null or additional_rate >= 0),
  created_at timestamptz not null default now(),
  unique (trade_measure_id, hs_code, national_tariff_item)
);

create index if not exists trade_measures_effective_dates_idx
  on public.trade_measures (effective_from, effective_to);
create index if not exists trade_measure_applicability_hs_idx
  on public.trade_measure_applicability (hs_code, trade_measure_id);

alter table public.trade_measures enable row level security;
alter table public.trade_measure_sources enable row level security;
alter table public.trade_measure_applicability enable row level security;

create policy "Anyone can view trade measures" on public.trade_measures for select using (true);
create policy "Anyone can view trade measure sources" on public.trade_measure_sources for select using (true);
create policy "Anyone can view trade measure applicability" on public.trade_measure_applicability for select using (true);

grant select on public.trade_measures, public.trade_measure_sources,
  public.trade_measure_applicability to anon, authenticated;

insert into public.sources (
  id, name, url, covers, last_checked, jurisdiction, authority_tier,
  source_type, retrieved_at, legal_instrument_identifier, source_status_note
) values (
  '20260908-0000-4000-8000-000000000001',
  'Department of Finance Canada',
  'https://www.canada.ca/en/department-finance/programs/international-trade-finance-policy/canadas-response-us-tariffs/complete-list-us-products-subject-to-counter-tariffs.html',
  'Canadian counter-tariffs effective 2026-09-08',
  '2026-08-28', 'CA', 'official_announcement', 'government_announcement',
  '2026-08-28', null,
  'CBSA implementation guidance and an operative legal instrument had not been verified when this source was reviewed.'
) on conflict (id) do update set
  name = excluded.name, url = excluded.url, covers = excluded.covers,
  last_checked = excluded.last_checked, jurisdiction = excluded.jurisdiction,
  authority_tier = excluded.authority_tier, source_type = excluded.source_type,
  retrieved_at = excluded.retrieved_at,
  legal_instrument_identifier = excluded.legal_instrument_identifier,
  source_status_note = excluded.source_status_note;

insert into public.trade_measures (
  id, jurisdiction, title, short_name, measure_type, announcement_date,
  effective_from, effective_to, origin_country, destination_country,
  applicability_note, confidence, reviewed_at
) values (
  '20260908-0000-4000-8000-000000000010', 'CA',
  'Canadian counter-tariffs on selected U.S.-origin products effective September 8, 2026',
  'September 2026 Canadian counter-tariffs', 'counter_tariff', '2026-08-25',
  '2026-09-08', null, 'us', 'CA',
  'Applies to qualifying U.S.-origin goods imported into Canada. Confirm classification, origin and final treatment with a customs professional.',
  'provisional', '2026-08-28'
) on conflict (id) do update set
  title = excluded.title, short_name = excluded.short_name,
  announcement_date = excluded.announcement_date, effective_from = excluded.effective_from,
  effective_to = excluded.effective_to, applicability_note = excluded.applicability_note,
  confidence = excluded.confidence, reviewed_at = excluded.reviewed_at;

insert into public.trade_measure_sources (trade_measure_id, source_id)
values ('20260908-0000-4000-8000-000000000010', '20260908-0000-4000-8000-000000000001')
on conflict do nothing;

insert into public.trade_measure_applicability
  (id, trade_measure_id, hs_code, national_tariff_item, product_description, additional_rate)
values
  ('20260908-0000-4000-8000-000000000101', '20260908-0000-4000-8000-000000000010', '730810', '7308.10.00', 'Bridges and bridge sections of iron or steel', 50),
  ('20260908-0000-4000-8000-000000000102', '20260908-0000-4000-8000-000000000010', '730820', '7308.20.00', 'Towers and lattice masts of iron or steel', 50),
  ('20260908-0000-4000-8000-000000000103', '20260908-0000-4000-8000-000000000010', '730830', '7308.30.00', 'Iron or steel doors, windows, frames and thresholds', 50),
  ('20260908-0000-4000-8000-000000000104', '20260908-0000-4000-8000-000000000010', '730840', '7308.40.00', 'Iron or steel scaffolding, shuttering and propping equipment', 50),
  ('20260908-0000-4000-8000-000000000105', '20260908-0000-4000-8000-000000000010', '730890', '7308.90.00', 'Other iron or steel structures and parts', 50),
  ('20260908-0000-4000-8000-000000000106', '20260908-0000-4000-8000-000000000010', '842542', '8425.42.00', 'Hydraulic jacks and vehicle hoists', 25),
  ('20260908-0000-4000-8000-000000000107', '20260908-0000-4000-8000-000000000010', '842620', '8426.20.00', 'Tower cranes', 25),
  ('20260908-0000-4000-8000-000000000108', '20260908-0000-4000-8000-000000000010', '842870', '8428.70.00', 'Industrial robots', 15),
  ('20260908-0000-4000-8000-000000000109', '20260908-0000-4000-8000-000000000010', '843320', '8433.20.00', 'Other mowers, including tractor-mounted cutter bars', 15),
  ('20260908-0000-4000-8000-000000000110', '20260908-0000-4000-8000-000000000010', '845020', '8450.20.00', 'Washing machines with dry-linen capacity over 10 kg', 25),
  ('20260908-0000-4000-8000-000000000111', '20260908-0000-4000-8000-000000000010', '851713', '8517.13.00', 'Smartphones', 50),
  ('20260908-0000-4000-8000-000000000112', '20260908-0000-4000-8000-000000000010', '851762', '8517.62.00', 'Data reception, conversion, transmission, switching and routing apparatus', 50)
on conflict (id) do update set
  trade_measure_id = excluded.trade_measure_id, hs_code = excluded.hs_code,
  national_tariff_item = excluded.national_tariff_item,
  product_description = excluded.product_description,
  additional_rate = excluded.additional_rate;

-- Remove the transitional duplicate policy rows created by the prior migration.
-- Base/current tariff treatment remains in tariff_rates.
delete from public.tariff_rates
where id::text like '20260908-0000-4000-8000-0000000001__';
