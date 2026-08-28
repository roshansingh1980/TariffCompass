-- Simple subscription packaging and founding-pricing state.
-- Stripe remains the billing authority. Founding fields are populated only
-- after the corresponding discount has actually been applied in Stripe.

alter table public.profiles
  add column if not exists subscription_tier text,
  add column if not exists founding_pricing boolean not null default false,
  add column if not exists founding_pricing_started_at timestamptz,
  add column if not exists founding_pricing_expires_at timestamptz,
  add column if not exists standard_monthly_price_cad numeric(8, 2);

alter table public.profiles
  add constraint profiles_subscription_tier_check
    check (subscription_tier is null or subscription_tier in ('business', 'advisor')),
  add constraint profiles_founding_pricing_dates_check
    check (
      founding_pricing = false
      or (
        founding_pricing_started_at is not null
        and founding_pricing_expires_at is not null
        and founding_pricing_expires_at > founding_pricing_started_at
      )
    );
