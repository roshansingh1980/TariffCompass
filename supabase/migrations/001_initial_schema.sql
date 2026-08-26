-- TariffCompass initial schema: profiles, companies, products
-- Tables only — no views, triggers, or seed data.

create extension if not exists "pgcrypto";

-- ============================================================
-- profiles
-- ============================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  company_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ============================================================
-- companies
-- ============================================================

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete cascade,
  name text not null,
  province text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists companies_user_id_idx on public.companies (user_id);

alter table public.companies enable row level security;

create policy "Users can view own companies"
  on public.companies for select
  using (auth.uid() = user_id);

create policy "Users can insert own companies"
  on public.companies for insert
  with check (auth.uid() = user_id);

create policy "Users can update own companies"
  on public.companies for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own companies"
  on public.companies for delete
  using (auth.uid() = user_id);

-- ============================================================
-- products
-- ============================================================

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies (id) on delete cascade,
  name text not null,
  hs_code text,
  category text,
  us_revenue_share numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_company_id_idx on public.products (company_id);

alter table public.products enable row level security;

create policy "Users can view own products"
  on public.products for select
  using (
    exists (
      select 1 from public.companies c
      where c.id = products.company_id
        and c.user_id = auth.uid()
    )
  );

create policy "Users can insert own products"
  on public.products for insert
  with check (
    exists (
      select 1 from public.companies c
      where c.id = products.company_id
        and c.user_id = auth.uid()
    )
  );

create policy "Users can update own products"
  on public.products for update
  using (
    exists (
      select 1 from public.companies c
      where c.id = products.company_id
        and c.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.companies c
      where c.id = products.company_id
        and c.user_id = auth.uid()
    )
  );

create policy "Users can delete own products"
  on public.products for delete
  using (
    exists (
      select 1 from public.companies c
      where c.id = products.company_id
        and c.user_id = auth.uid()
    )
  );
