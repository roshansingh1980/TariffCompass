create table public.trade_exposure_alert_deliveries (
  id uuid primary key default gen_random_uuid(),
  alert_id uuid not null unique references public.trade_exposure_alerts (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'sending', 'sent', 'failed', 'skipped')),
  attempt_count integer not null default 0 check (attempt_count >= 0),
  attempted_at timestamptz,
  emailed_at timestamptz,
  error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index trade_exposure_alert_deliveries_retry_idx
  on public.trade_exposure_alert_deliveries (status, attempt_count, created_at)
  where emailed_at is null;

alter table public.trade_exposure_alert_deliveries enable row level security;

-- Delivery metadata is operational server-only state. The service role bypasses
-- RLS; no anon/authenticated policy or table grant is intentionally created.
revoke all on public.trade_exposure_alert_deliveries from anon, authenticated;
