-- Append-only change history for trade measures. Runtime remains compatible
-- with the checked-in deterministic fixture until this migration is applied.
create table if not exists public.trade_measure_changes (
  id uuid primary key default gen_random_uuid(),
  trade_measure_id uuid not null references public.trade_measures (id) on delete cascade,
  event_type text not null check (event_type in ('announced', 'effective', 'amended', 'delayed', 'expired', 'rescinded')),
  event_date date,
  announced_date date,
  effective_from date,
  previous_state jsonb not null,
  new_state jsonb not null,
  source_id uuid references public.sources (id) on delete restrict,
  confidence text not null check (confidence in ('verified', 'provisional', 'limited')),
  applicability jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists trade_measure_changes_measure_date_idx
  on public.trade_measure_changes (trade_measure_id, event_date, created_at);

alter table public.trade_measure_changes enable row level security;
create policy "Anyone can view trade measure changes"
  on public.trade_measure_changes for select using (true);
grant select on public.trade_measure_changes to anon, authenticated;

insert into public.sources (
  id, name, url, covers, last_checked, jurisdiction, authority_tier,
  source_type, retrieved_at, legal_instrument_identifier, source_status_note
) values (
  '20260908-0000-4000-8000-000000000002',
  'Department of Finance Canada',
  'https://www.canada.ca/en/department-finance/news/2026/08/canada-announces-targeted-countermeasures-and-substantive-support-for-workers-and-businesses-in-response-to-us-tariffs.html',
  'Official announcement of Canadian counter-tariffs effective 2026-09-08',
  '2026-08-28', 'CA', 'official_announcement', 'government_announcement',
  '2026-08-28', null,
  'Official August 25, 2026 announcement of the countermeasures effective September 8, 2026.'
) on conflict (id) do update set
  name = excluded.name, url = excluded.url, covers = excluded.covers,
  last_checked = excluded.last_checked, jurisdiction = excluded.jurisdiction,
  authority_tier = excluded.authority_tier, source_type = excluded.source_type,
  retrieved_at = excluded.retrieved_at,
  legal_instrument_identifier = excluded.legal_instrument_identifier,
  source_status_note = excluded.source_status_note;

insert into public.trade_measure_sources (trade_measure_id, source_id)
values ('20260908-0000-4000-8000-000000000010', '20260908-0000-4000-8000-000000000002')
on conflict do nothing;

insert into public.trade_measure_changes (
  id, trade_measure_id, event_type, event_date, announced_date, effective_from,
  previous_state, new_state, source_id, confidence, applicability
) values (
  '20260908-0000-4000-8000-000000000020',
  '20260908-0000-4000-8000-000000000010',
  'announced', '2026-08-25', '2026-08-25', '2026-09-08',
  '{"kind":"none_recorded","description":"No verified additional counter-tariff recorded for this measure/applicability"}'::jsonb,
  '{"kind":"known_rate","rate":50,"rateKind":"additional_counter_tariff","description":"50% additional Canadian counter-tariff"}'::jsonb,
  '20260908-0000-4000-8000-000000000002', 'provisional',
  '{"hsCode":"851713","nationalTariffItem":"8517.13.00","originCountry":"us","destinationCountry":"CA"}'::jsonb
) on conflict (id) do nothing;
