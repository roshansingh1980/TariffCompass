# TariffCompass — Pending

Last updated: 27 August 2026. Repo at `a3ce8a6` (plus whatever has landed since).

---

## Strategy in one paragraph

Two objectives. **Monetisation** comes from two buyers: affected businesses (exporters/importers) who pay for change alerts on their codes, a dated exposure record they can hand to a bank or broker, and program deadline warnings; and professionals (accountants, bankers, consultants) who pay more for white-label PDF export, a multi-client portfolio view, and a defensible paper trail. **Brand** comes from being the free, citable public source for Canadian tariff data — used by agencies, journalists, politicians and the public, monetised not at all. Public data, private monitoring. That boundary must hold: if change history ever becomes public, the alert product dies.

Current pricing: Free / C$29 per month. The professional tier (~C$199) is not built and must not be sold until white-label export and multi-client view exist.

---

## Next week — outreach

The whole point of everything below. Nobody outside this project has used the tool.

- [ ] Book the lawyer. All blocking decisions are made ($29, gating split, Adithana Capital Ltd.)
- [ ] Ask the lawyer: does the AI brief's specific business guidance cross into regulated advice, and do current disclaimers cover it? Bring `/updates`, a generated brief, and `/notices`
- [ ] Ask the lawyer whether TariffCompass belongs under Adithana Capital Ltd. or a separate operating company — mixing a capital/advisory vehicle with a product publishing tariff figures may be the wrong liability shape, and it affects grant eligibility
- [ ] Meetings with an accountant, a banker, and a lawyer
- [ ] Five exporters, five accountants — the validation round
- [ ] One call with PacifiCan, one with an NRC IRAP advisor (free, informal, tells you whether you're fundable)

**Meeting materials to write:**
- [ ] One-page PDF leave-behind
- [ ] Three email drafts (accountant / banker / lawyer — the banker's ask is different: portfolio exposure across their borrower book, not the single-client tool)
- [ ] Follow-up text, short
- [ ] Demo script — Steel & Metals / BC / export to US is the strongest path

**Sequence:** short email asking for 20 minutes → they agree → send PDF as pre-read with the invite → text if no reply in three days → demo live → grant Cloudflare Access afterward with a specific ask ("run it for one client this week, tell me what broke"). Do not give early access before the first meeting — you lose the reaction, which is the whole point.

---

## Pre-meeting build candidates — the professional tier

The accountant/banker meeting hinges on three features. None of them exist today. The question "would you pay for this?" is unanswerable if they can't see it working, and a mock is worse than nothing — people react badly to being shown something that isn't real, even when told so. A thin real version beats a polished mock.

Estimated three to four days total for thin versions of all three. Thin means thin: ship the shape, not the finish.

- [ ] **White-label PDF export** — hardest of the three, still small. The brief already streams as text; this is a PDF renderer plus a firm name and logo in the header. ~1-2 days. Trap: spending three days on typography. A plainly-set document with their name on it does the whole job.
- [ ] **Multi-client view** — easiest, and most of the data exists. `saved_profiles` holds every input; `analyses` holds computed exposure with rate snapshots. This is a client name column plus a table view: client, category, exposure, last updated. No new logic. ~1 day. A list, not a dashboard with charts.
- [ ] **Defensible paper trail** — mostly built already. Sources, dates, confidence labels, corrections log, and `analyses` capturing a rate snapshot per run all exist. What's missing is surfacing it: a "sources as of" block on the PDF and a visible timestamp. Hours, not days.

**Hard limit: four days.** Then the meetings happen regardless of state. This project has a pattern of the next feature always feeling necessary before talking to anyone.

**Anything not shipped is described as planned, never implied to exist.**

---

## In flight

- [ ] Canada/US toggle removal + `country-context` investigation (sent; stop and report if the context genuinely controls something)
- [ ] Footer line "A Canadian tool for a Canadian problem."
- [ ] Doc/dead-file audit — report first, approve before deleting. Scope is docs and orphans only; no refactoring of working code before the meetings
- [ ] Delete the `/api/debug-source-check` route and redeploy (verification came back all-200 from the Worker runtime)

---

## Build queue

**Broken navigation**
- [ ] **[PRE-MEETING]** Sidebar shell consistency — sidebar links to `/updates` and `/sources`, but those render with the marketing top nav, so a sidebar click drops you out with no way back. Rule: any page reachable from the sidebar renders inside it. Complication: both are also public pages anonymous visitors reach from search. `/updates` is specifically on the lawyer's demo list — a dead-end there is a bad live moment

**Landing page**
- [ ] **[V2]** Heatmap rebuilt as a real grid — 8 categories down, five columns across, direction and market dropdowns. **Plan first**, resolving: market coverage varies by category (8 distinct markets, only 5 per category); Cost/Friction rating is free but its reasoning is paid; colour scale must carry text labels (zero axe violations currently, don't break it)
- [ ] **[V2]** Direction × market summary pages (~16, not 144 — thin pages hurt SEO). Sitemap derived, not hardcoded
- [ ] **[V2]** Asymmetric layout: heatmap 2/3 left, timeline 1/3 right. After the grid. Truncate timeline descriptions to first sentence, keep category chips

**Product**
- [ ] **[V2]** `/for-advisors` page — one page for accountants, bankers, consultants. White-label and multi-client labelled PLANNED, not available. The live demo of the actual features is the pitch; this page doesn't change whether the meetings land
- [ ] **[V2]** Wizard collapse to a single page, live-updating results below. **Plan first** — touches `sessionStorage` persistence, the anonymous→signup handoff, and the debounced `analyses` write

**Official data ingestion** — the foundation everything else sits on

Production verification passed: all five sources return 200 from the Cloudflare Worker runtime.

- [ ] **[V2]** Federal Register API connector first — documented, stable, and it fills `effective_from`, which alerts depend on
- [ ] **[V2]** USITC HTS connector for base MFN rates (note: `reststop/search` is undocumented/internal, could break without warning)
- [ ] **[V2]** Canada Gazette Part II RSS for counter-tariff and remission orders
- [ ] **[V2]** Three-tier data model: *official* (HTS base rates), *official source, human-read* (232/338 and counter-tariffs — the rate exists only in proclamation prose, so a person extracts it), *estimated* (everything else)
- [ ] **[V2]** Curated category → HS code mapping. Neither API supplies this
- [ ] **[V2]** `open.canada.ca` respects `Crawl-delay: 20`. OGL-Canada requires attribution; US federal sources are public domain and don't. Attribution treatment must differ by source

**Paid features — none exist yet, and they are what makes $29 worth paying**
- [ ] **[V2]** Change detection job + weekly digest email (needs `effective_from`)
- [ ] **[PRE-MEETING]** Exportable dated exposure record — overlaps with the paper-trail item above; this is the SME-facing version of the same underlying capability
- [ ] **[V2]** Program deadline warnings (schema exists, all NULL, needs research)
- [ ] **[PRE-MEETING]** White-label PDF export → unlocks the professional tier (same item as above, tracked here as the backlog entry)
- [ ] **[PRE-MEETING]** Multi-client portfolio view (same item as above, tracked here as the backlog entry)

---

## Data debt

- [ ] CUSMA annotation lost in migration — "0% (CUSMA)" now renders "0%". That parenthetical was the highest-value fact on screen for a Canadian exporter. Needs a column and a restore
- [ ] `key_dates` seeded in Postgres but the homepage still reads `lib/data/key-dates.ts`. Two sources of truth
- [ ] `companies` / `products` not dropped (3 and 6 rows). `saveOnboardingSelections` still writes there. Removal plan proposed, not approved
- [ ] `lib/stripe/actions.ts` has no try/catch and no inline error UI. Root error boundary catches it, but a proper fix needs the billing forms rebuilt around `useActionState`
- [ ] `effective_from` NULL on all 90 rows — by design until the Federal Register connector lands
- [ ] `measure_type` NULL on 12 of 90 rows
- [ ] Not one row is marked "official". All 90 are estimated or unknown
- [ ] "Other / Custom" produces nothing — 10 rows, all null. Interstitial shipped, but the category still has no data
- [ ] Agri-food imports read 0–298% identically from all five origins. Behind the paywall and worth nothing
- [ ] Four of nine categories return 0–0% on every import row

---

## Open decisions

- [ ] Entity structure — Adithana Capital Ltd. or a separate operating company (lawyer)
- [ ] Whether to rebuild the AI freshness-review pipeline against Postgres (deleted as migration collateral; it was a differentiator)
- [ ] Which brand doc is authoritative — `claude/brand-identity.md` or `brand/BRAND.md`. Two will drift
- [ ] When to lift Cloudflare Access — after legal review, deliberately, not by accident
- [ ] Submit sitemap to Google Search Console (can verify by DNS now; indexing starts the moment Access lifts)

---

## Standing rules

- Never invent a tariff rate, effective date, or key-date entry. Every figure traces to a source in the codebase or the database
- No placeholder dates in the database. NULL is honest; a placeholder is indistinguishable from real data in three months
- Never force push
- Push after every commit — six commits once sat locally and cost a full review cycle
- Cloudflare token is scoped: Workers Scripts Edit, Workers Observability Read, Zone Read. DNS, Access policies, env vars and email routing stay manual. `wrangler whoami` reporting "not authenticated" is expected; use `wrangler deployments list`
- When something specified looks wrong on screen, trust the screen over the spec
