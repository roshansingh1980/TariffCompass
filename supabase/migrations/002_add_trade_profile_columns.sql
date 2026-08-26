-- Add trade-profile fields captured during onboarding (pre-authentication).
-- These live on companies since they describe the business's overall trade
-- situation, not any single product. All nullable — not every session
-- provides every field (e.g. us_state is optional).

alter table public.companies
  add column if not exists scenario text,
  add column if not exists country text,
  add column if not exists us_state text;
