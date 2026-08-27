-- Exposure calculator fields on saved_profiles: optional annual shipped
-- value, its currency, and an optional 6-digit HS code the user already
-- knows. Format validation (6 digits) happens app-side, same as the rest
-- of this schema — no CHECK constraint here.

alter table public.saved_profiles
  add column if not exists annual_value numeric,
  add column if not exists currency text,
  add column if not exists hs_code text;
