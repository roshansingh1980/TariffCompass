-- TariffCompass matches tariff coverage at the internationally harmonized
-- six-digit HS level. Remove punctuation from existing populated values
-- without truncating more-specific national codes or inventing/backfilling
-- codes, then index the exact route-aware lookup used by the application.
-- Category fallback rows retain NULL hs_code values.

update public.tariff_rates
set hs_code = regexp_replace(hs_code, '[^0-9]', '', 'g')
where hs_code is not null
  and length(regexp_replace(hs_code, '[^0-9]', '', 'g')) >= 6
  and hs_code is distinct from regexp_replace(hs_code, '[^0-9]', '', 'g');

create index if not exists tariff_rates_hs_route_idx
  on public.tariff_rates (hs_code, origin_country, destination_country)
  where hs_code is not null;
