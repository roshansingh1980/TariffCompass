# TariffCompass

**Trade-impact intelligence for Canadian businesses and the advisors who serve them.**

TariffCompass helps Canadian businesses that import, export, or do both understand what tariff and trade-policy changes affect them, estimate the financial impact, compare response options, and monitor future changes.

The immediate commercial objective is **C$50,000 ARR as quickly as possible**. Phase 1 is deliberately narrow: sell to trade-exposed Canadian SMEs and to accountants/fractional CFO-advisory firms that manage multiple SME clients.

See [`BUSINESS_PLAN.md`](BUSINESS_PLAN.md) for the canonical strategy and [`ROADMAP.md`](ROADMAP.md) for the ARR-first build sequence.

## Phase 1 customers

### TariffCompass Business — C$99/month

For Canadian SMEs that buy or sell across borders.

Core value:

- import and export tariff exposure;
- HS/product-level analysis where reliable data exists;
- estimated dollar impact;
- trade-policy change monitoring;
- alerts;
- market/sourcing response options; and
- relevant government-support information.

Recommended annual option: **C$999/year**.

### TariffCompass Advisor — C$249/month

For accountants and fractional CFO/advisory firms.

Core value:

- multi-client workspace;
- Client Exposure Radar;
- alerts across client portfolios;
- client-ready reports; and
- white-label output when sufficiently robust.

## Public authority layer

Public information remains free by design. TariffCompass should publish concise, dated, source-backed tariff intelligence that journalists, lawyers, researchers, policymakers, consultants, businesses, and the public can cite.

The operating principle is:

> **Public information creates authority. Private relevance creates revenue.**

The public layer should stay lightweight in Phase 1 and should not distract from the C$50K ARR objective.

## Product rule

Before approving a feature, ask:

> **Does this materially improve our probability of reaching C$4,167 MRR quickly, while preserving the data foundation we will need if the product succeeds?**

If not, defer it.

## Stack

- [Next.js 15](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com) on [Base UI](https://base-ui.com)
- [Supabase](https://supabase.com) — Postgres, Auth, Row Level Security
- [Stripe](https://stripe.com) — subscription billing
- [Anthropic API](https://www.anthropic.com) — AI-generated decision brief
- [Cloudflare Workers](https://workers.cloudflare.com) via [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare) — deployment

## Folder structure

```text
app/          Routes, layouts, and global styles
components/   Reusable UI, dashboard, onboarding, billing
lib/          Supabase, Stripe, AI, tariff/market data access
supabase/     SQL migrations for Postgres
types/        Shared TypeScript types
brand/        Canonical brand assets/documentation
```

## Current product

- **Onboarding wizard** (`/dashboard`) — import/export scenario, location, product category, exposure and market comparison
- **Anonymous use** — visitors can explore without database persistence; saving requires an account
- **Auth** — Supabase email/password
- **Billing** — Stripe subscription infrastructure; pricing/product gating must now be aligned to the C$99 Business and C$249 Advisor strategy
- **AI brief** — personalized explanation generated only from supplied structured data
- **Public content** — `/insights`, `/updates`, `/sources`, `/about`
- **Tariff data layer** — Postgres-backed rate/source data with planned HS-level and effective-date expansion

## Getting started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Environment variables are required for Supabase, Stripe, Anthropic, and Cloudflare deployment.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — run production build
- `npm run lint` — ESLint
- `npm run test` — test suite
- `npm run test:watch` — watch tests
- `npm run cf:build` — Cloudflare build
- `npm run cf:preview` — Cloudflare preview
- `npm run cf:deploy` — deploy to Cloudflare Workers
- `npm run cf:typegen` — Cloudflare environment types

## Deployment

Production domain: `tariffcompass.ca`.

The site remains behind Cloudflare Access while pre-launch work is completed. Do not broaden scope merely because the public site is not yet launched.
