-- Category requests: captured whenever a visitor selects "Other / Custom"
-- on the product step, where no real market data exists yet. This turns
-- that dead-end screen into a research queue instead of five blank rows.
-- Reachable by anonymous visitors (the whole point — they never had an
-- account to begin with), so RLS grants insert to both anon and
-- authenticated; nobody but the service role can read it back.

create table if not exists public.category_requests (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  product_description text not null,
  created_at timestamptz not null default now()
);

alter table public.category_requests enable row level security;

create policy "Anyone can submit a category request"
  on public.category_requests for insert
  to anon, authenticated
  with check (true);
