## Git workflow

- After committing, always run `git push origin main` in the same turn. Do not leave commits sitting locally.
- Exception: only skip the push if Roshan explicitly says not to push, or if the work is an experiment he asked to keep local.
- After pushing, confirm `origin/main` matches local HEAD and report the SHA, so it can be matched against the Cloudflare Workers build.
- Never force push. If a push is rejected, stop and show the error rather than resolving it by rewriting history.
- Keep `.claude/` and `Logo.jpg` untracked.

## Canonical strategy

Read these before making product-scope decisions:

1. `BUSINESS_PLAN.md` — authoritative commercial/product strategy.
2. `ROADMAP.md` — authoritative Phase 1 build sequence.
3. `PENDING.md` — unresolved commercial, legal and execution items.
4. `SEO-Blueprint.md` — public authority/SEO layer.
5. `brand/BRAND.md` — brand system.

If another document or old comment conflicts with `BUSINESS_PLAN.md`, the business plan wins unless Roshan explicitly changes the strategy.

## North-star objective

Phase 1 exists to reach **C$50,000 ARR / approximately C$4,167 MRR as quickly as possible**.

Before proposing or building a feature, ask:

> **Does this materially improve our probability of reaching C$4,167 MRR quickly, while preserving the data foundation we will need if TariffCompass succeeds?**

If not, defer it unless Roshan explicitly asks otherwise.

## Phase 1 customers and pricing

Paid customer segment A:

- Canadian SMEs that import, export, or do both.
- One product, not separate importer/exporter product lines.
- Target pricing: **TariffCompass Business C$99/month**, recommended annual option **C$999/year**.

Paid customer segment B:

- Accountants and fractional CFO/advisory firms serving trade-exposed SMEs.
- Target pricing: **TariffCompass Advisor C$249/month** once the multi-client product creates credible recurring value.

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
- HS/product-level specificity, effective dates, sources, financial impact and alerts outrank UI polish or broad market coverage.
- AI explains structured data; it must not invent tariff rates, effective dates, legal instruments, program eligibility or legal conclusions.
- Unknown/NULL is preferable to false precision.
- Do not build AI HS classification as authoritative. Help users find likely codes/descriptions and require confirmation where classification matters.
- Do not drift into full customs-entry/audit workflow, supplier-certificate repositories or comprehensive origin-document management before C$50K ARR unless paying-customer demand strongly justifies it.
- The first professional “wow” is **Client Exposure Radar** across multiple clients, not merely a white-label PDF.

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

Crowdfunding is strategic optionality, not a Phase 1 build objective.

Do not spend product time on investor features or campaign mechanics before meaningful paying-customer proof. Revisit fundraising/crowdfunding after commercial traction, ideally around the C$50K ARR milestone.
