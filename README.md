# TariffCompass

Navigate tariffs. Find your path.

This is the technical foundation for TariffCompass — a clean Next.js base with no product features yet.

## Stack

- [Next.js 15](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)

## Folder structure

```
app/         Routes, layouts, and global styles
components/  Reusable UI (site header/footer, shadcn primitives in components/ui)
lib/         Shared utilities
types/       Shared TypeScript types
```

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it.

## Scripts

- `npm run dev` — start the development server
- `npm run build` — create a production build
- `npm run start` — run the production build
- `npm run lint` — run ESLint

## Deployment (Cloudflare Pages)

This project uses standard Next.js APIs and is compatible with Cloudflare's
[`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare) adapter. When ready to deploy:

```bash
npm install --save-dev @opennextjs/cloudflare
npx opennextjs-cloudflare build
npx opennextjs-cloudflare deploy
```

## Roadmap

Authentication and the database layer will be wired up with [Supabase](https://supabase.com) in a later phase.
No product features, auth, or dashboard exist yet by design — this repo is the clean base only.
