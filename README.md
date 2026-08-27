# TariffCompass

Understand your tariffs in minutes, not weeks of research.

TariffCompass helps Canadian small and medium-sized businesses understand
their tariff exposure, compare export/import markets, and find relevant
government support programs — with an optional AI-generated diversification
brief for subscribers.

## Stack

- [Next.js 15](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com) on [Base UI](https://base-ui.com)
- [Supabase](https://supabase.com) — Postgres, Auth, Row Level Security
- [Stripe](https://stripe.com) — subscription billing
- [Anthropic API](https://www.anthropic.com) — AI diversification brief generation
- [Cloudflare Workers](https://workers.cloudflare.com) via [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare) — deployment

## Folder structure

```
app/          Routes, layouts, and global styles (App Router)
components/   Reusable UI — site header/footer, dashboard shell, onboarding
              wizard steps, billing, shadcn primitives in components/ui
lib/          Shared utilities — Supabase clients, Stripe helpers, tariff/
              market data access, onboarding data
supabase/     SQL migrations for the Postgres schema
types/        Shared TypeScript types (Supabase-generated + hand-written)
```

## What's here

- **Onboarding wizard** (`/dashboard`) — scenario, location, product category,
  and exposure steps, producing a market comparison with tariff rates,
  cost/friction ratings, and relevant government support programs
- **Anonymous use** — visitors complete the full wizard and see their market
  comparison with nothing written to the database; answers are held in
  `sessionStorage` and only persisted once they sign up. Saving a profile
  requires a free account; the dollar exposure figures and the AI brief
  require a subscription
- **Auth** — Supabase email/password
- **Billing** — Stripe Checkout + Billing Portal, C$29/month subscription
  gating estimated dollar exposure, full program details, and the AI brief
- **AI diversification brief** — streamed, personalized brief generated from
  a user's wizard inputs via the Anthropic API
- **Public content** — `/insights` (articles), `/updates` (a dated change
  log for tariff data), `/sources` (citation registry), `/about`

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it. You'll need
a `.env.local` with Supabase, Stripe, and Anthropic credentials — see
`lib/supabase/`, `lib/stripe/`, and `lib/ai/` for the environment variables
each expects.

## Scripts

- `npm run dev` — start the development server
- `npm run build` — create a production build
- `npm run start` — run the production build
- `npm run lint` — run ESLint
- `npm run test` — run the test suite once
- `npm run test:watch` — run the test suite in watch mode
- `npm run cf:build` — build for Cloudflare Workers
- `npm run cf:preview` — build and preview locally against the Workers runtime
- `npm run cf:deploy` — build and deploy to Cloudflare Workers
- `npm run cf:typegen` — generate Cloudflare environment types

## Deployment

Deployed to Cloudflare Workers at `tariffcompass.ca` via
[`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare):

```bash
npm run cf:deploy
```
