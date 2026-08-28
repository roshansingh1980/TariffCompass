-- Curated launch slice from Finance Canada's authoritative list, updated
-- 2026-08-26 and reviewed 2026-08-28. These future-effective records must be
-- treated as upcoming until effective_from. The application fixture remains
-- the production runtime source until this migration is explicitly applied.

alter table public.tariff_rates
  add column if not exists national_tariff_item text;

insert into public.sources (id, name, url, covers, last_checked)
values (
  '20260908-0000-4000-8000-000000000001',
  'Department of Finance Canada',
  'https://www.canada.ca/en/department-finance/programs/international-trade-finance-policy/canadas-response-us-tariffs/complete-list-us-products-subject-to-counter-tariffs.html',
  'Authoritative product list for Canadian counter-tariffs effective 2026-09-08. CBSA administration details and a corresponding legal instrument were not available when reviewed.',
  '2026-08-28'
)
on conflict (id) do update set
  name = excluded.name,
  url = excluded.url,
  covers = excluded.covers,
  last_checked = excluded.last_checked;

insert into public.tariff_rates (
  id, category, hs_code, national_tariff_item, origin_country,
  destination_country, rate_min, rate_max, measure_type, confidence,
  source_id, effective_from, effective_to, reviewed_at
)
values
  ('20260908-0000-4000-8000-000000000101', 'Steel & Metals', '730810', '7308.10.00', 'us', 'CA', 50, 50, 'counter_tariff', 'official', '20260908-0000-4000-8000-000000000001', '2026-09-08', null, '2026-08-28'),
  ('20260908-0000-4000-8000-000000000102', 'Steel & Metals', '730820', '7308.20.00', 'us', 'CA', 50, 50, 'counter_tariff', 'official', '20260908-0000-4000-8000-000000000001', '2026-09-08', null, '2026-08-28'),
  ('20260908-0000-4000-8000-000000000103', 'Steel & Metals', '730830', '7308.30.00', 'us', 'CA', 50, 50, 'counter_tariff', 'official', '20260908-0000-4000-8000-000000000001', '2026-09-08', null, '2026-08-28'),
  ('20260908-0000-4000-8000-000000000104', 'Steel & Metals', '730840', '7308.40.00', 'us', 'CA', 50, 50, 'counter_tariff', 'official', '20260908-0000-4000-8000-000000000001', '2026-09-08', null, '2026-08-28'),
  ('20260908-0000-4000-8000-000000000105', 'Steel & Metals', '730890', '7308.90.00', 'us', 'CA', 50, 50, 'counter_tariff', 'official', '20260908-0000-4000-8000-000000000001', '2026-09-08', null, '2026-08-28'),
  ('20260908-0000-4000-8000-000000000106', 'Machinery', '842542', '8425.42.00', 'us', 'CA', 25, 25, 'counter_tariff', 'official', '20260908-0000-4000-8000-000000000001', '2026-09-08', null, '2026-08-28'),
  ('20260908-0000-4000-8000-000000000107', 'Machinery', '842620', '8426.20.00', 'us', 'CA', 25, 25, 'counter_tariff', 'official', '20260908-0000-4000-8000-000000000001', '2026-09-08', null, '2026-08-28'),
  ('20260908-0000-4000-8000-000000000108', 'Machinery', '842870', '8428.70.00', 'us', 'CA', 15, 15, 'counter_tariff', 'official', '20260908-0000-4000-8000-000000000001', '2026-09-08', null, '2026-08-28'),
  ('20260908-0000-4000-8000-000000000109', 'Machinery', '843320', '8433.20.00', 'us', 'CA', 15, 15, 'counter_tariff', 'official', '20260908-0000-4000-8000-000000000001', '2026-09-08', null, '2026-08-28'),
  ('20260908-0000-4000-8000-000000000110', 'Machinery', '845020', '8450.20.00', 'us', 'CA', 25, 25, 'counter_tariff', 'official', '20260908-0000-4000-8000-000000000001', '2026-09-08', null, '2026-08-28'),
  ('20260908-0000-4000-8000-000000000111', 'Electronics', '851713', '8517.13.00', 'us', 'CA', 50, 50, 'counter_tariff', 'official', '20260908-0000-4000-8000-000000000001', '2026-09-08', null, '2026-08-28'),
  ('20260908-0000-4000-8000-000000000112', 'Electronics', '851762', '8517.62.00', 'us', 'CA', 50, 50, 'counter_tariff', 'official', '20260908-0000-4000-8000-000000000001', '2026-09-08', null, '2026-08-28')
on conflict (id) do update set
  category = excluded.category,
  hs_code = excluded.hs_code,
  national_tariff_item = excluded.national_tariff_item,
  origin_country = excluded.origin_country,
  destination_country = excluded.destination_country,
  rate_min = excluded.rate_min,
  rate_max = excluded.rate_max,
  measure_type = excluded.measure_type,
  confidence = excluded.confidence,
  source_id = excluded.source_id,
  effective_from = excluded.effective_from,
  effective_to = excluded.effective_to,
  reviewed_at = excluded.reviewed_at;
