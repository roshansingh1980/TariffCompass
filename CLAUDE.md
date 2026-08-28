## Git workflow

- After committing, always run `git push origin main` in the same turn. Do not leave commits sitting locally.
- Exception: only skip the push if Roshan explicitly says not to push, or if the work is an experiment he asked to keep local.
- After pushing, confirm `origin/main` matches local HEAD and report the SHA, so it can be matched against the Cloudflare Workers build.
- Never force push. If a push is rejected, stop and show the error rather than resolving it by rewriting history.
- Keep `.claude/` and `Logo.jpg` untracked.

## Canonical strategy

Read these before making product-scope, go-to-market or financing decisions:

1. `BUSINESS_PLAN.md` — authoritative commercial/product strategy.
2. `ROADMAP.md` — authoritative Phase 1 build sequence.
3. `PENDING.md` — **Beta/V1 launch-critical execution items only**.
4. `MARKETING_STRATEGY.md` — authoritative roadmap for acquiring the first **30 Business + 3 Advisor paying accounts**.
5. `CAPITAL_RAISING_STRATEGY.md` — authoritative financing, crowdfunding, valuation/dilution, post-raise financial plan, founder compensation and capital-allocation strategy.
6. `FUTURE.md` — post-launch/later-phase product backlog; do not pull items forward without explicit promotion or real customer evidence.
7. `SEO-Blueprint.md` — public authority/SEO layer.
8. `brand/BRAND.md` — brand system.

If another document or old comment conflicts with `BUSINESS_PLAN.md`, the business plan wins unless Roshan explicitly changes the strategy.

When deciding where a new task belongs:

> If it is necessary for a credible C$99 Business Beta/V1 launch, put it in `PENDING.md`. If it is specifically about acquiring the first 30 Business + 3 Advisor customers, put it in `MARKETING_STRATEGY.md`. If it concerns crowdfunding, financing, valuation, dilution, use of proceeds, founder compensation after financing, dividends or future capital rounds, put it in `CAPITAL_RAISING_STRATEGY.md`. Otherwise put it in `FUTURE.md`.

## North-star objective

Phase 1 exists to reach **C$2,500 MRR / C$30,000 ARR as quickly as possible**.

Before proposing or building a feature, ask:

> **Does this materially improve conversion, retention, willingness to pay, or the data reliability required to reach C$2,500 MRR quickly?**

If not, defer it unless Roshan explicitly asks otherwise.

Before proposing a marketing activity, ask:

> **Will this materially increase the probability of acquiring the next paying Business or Advisor customer at acceptable economics?**

If not, defer it.

Before proposing a financing decision, ask:

> **What specific growth constraint does new capital remove, what measurable outcome should the capital produce, and is the expected value creation greater than the dilution?**

## Phase 1 customers and pricing

Paid customer segment A:

- Canadian SMEs that import, export, or do both.
- One product, not separate importer/exporter product lines.
- Standard pricing: **TariffCompass Business C$99/month**.
- Founding offer: first 10 paying Business customers receive 50% off their first 12 months, then C$99/month automatically.

Paid customer segment B:

- Accountants and fractional CFO/advisory firms serving trade-exposed SMEs.
- Target pricing: **TariffCompass Advisor C$249/month** once the multi-client product creates credible recurring value.
- Founding offer: first 3 paying Advisor customers receive 50% off their first 12 months, then C$249/month automatically.
- Advisor product work belongs in `FUTURE.md` until the Business Beta/V1 is convincing or Roshan explicitly promotes it.

Do not broaden Phase 1 product work around journalists, politicians, lawyers, banks, associations or general consultants. They may use the public product for free and may become later/opportunistic customers.

## Product positioning

TariffCompass is **Canadian trade-impact intelligence**, not a generic tariff database and not a full customs-compliance suite.

Core user questions:

1. What changed?
2. Does it affect me or my clients?
3. What is the estimated financial impact?
4. What are the most relevant response options?

The paid value is company/client-specific relevance, financial impact and monitoring. Public tariff history and sourced aggregate information can remain free.

## Product decisions

- **Home country remains hardcoded to Canada in Phase 1.** There is no Canada/US home-country toggle. Do not reintroduce one unless the canonical strategy changes.
- Support both import and export scenarios as trade directions inside the same Canadian product.
- The six C$99 launch gates in `PENDING.md` outrank UI polish or broad market coverage.
- HS/product-level specificity, effective dates, sources, financial impact and alerts outrank UI polish or broad market coverage.
- AI explains structured data; it must not invent tariff rates, effective dates, legal instruments, program eligibility or legal conclusions.
- Unknown/NULL is preferable to false precision.
- Do not build AI HS classification as authoritative. Help users find likely codes/descriptions and require confirmation where classification matters.
- Do not drift into full customs-entry/audit workflow, supplier-certificate repositories or comprehensive origin-document management before the initial C$2,500 MRR milestone unless paying-customer demand strongly justifies it.
- The first professional “wow” is **Client Exposure Radar** across multiple clients, but this is future work unless explicitly promoted.

## Public authority layer

Keep `/insights`, `/updates`, `/sources` and selected public data surfaces useful and citable, but cap this at roughly **10–15% of Phase 1 effort**.

Public content should be short, quantitative, dated, source-linked and explicit about methodology/confidence.

Do not build dedicated newsroom, journalist, politician, policy, lawyer or institutional dashboards in Phase 1.

Standing principle:

> **Public information creates authority. Private relevance creates revenue.**

## Cloudflare

A scoped API token may be available in the `CLOUDFLARE_API_TOKEN` environment variable. Wrangler picks it up automatically — do not run `wrangler login`.

Permissions the token HAS:

- Workers Scripts: Edit
- Workers Observability: Read
- Zone: Read on `tariffcompass.ca`

Permissions it deliberately does NOT have — these stay manual and must not be attempted:

- DNS changes
- Cloudflare Access / Zero Trust policies
- Environment variables on the Worker
- Email Routing
- Billing, account settings, zone deletion

`wrangler whoami` may report “not authenticated” because the scoped token cannot read account user settings. Use deployment commands/status instead.

`tariffcompass.ca` may remain behind Cloudflare Access during pre-launch work. Do not work around Access; if a browser-only check is needed, ask Roshan to perform it.

## Crowdfunding

Crowdfunding is strategic optionality and is governed by `CAPITAL_RAISING_STRATEGY.md`, not the Beta/V1 product backlog.

Do not spend product time on investor features or campaign mechanics before meaningful paying-customer proof. The current preferred sequence is: build, launch, reach C$2,500 MRR, build toward 30 Business customers + 3 Advisor customers + 2–3 strong customer stories, then prepare/launch crowdfunding subject to the current capital strategy.
