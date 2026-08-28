# TariffCompass — Pending

_Last updated: 27 August 2026_

Canonical strategy: [`BUSINESS_PLAN.md`](BUSINESS_PLAN.md)  
Canonical build sequence: [`ROADMAP.md`](ROADMAP.md)

## Adopted strategy

The Phase 1 objective is **C$2,500 MRR / C$30,000 ARR as quickly as possible**.

Paid segments:

1. **Canadian trade-exposed SMEs** — importers, exporters, or both — at **C$99/month**.
2. **Accountants and fractional CFO/advisory firms** at **C$249/month**, once a useful multi-client experience and Client Exposure Radar are live.

Everyone else — journalists, lawyers, consultants, policymakers, politicians, associations, researchers and the general public — is a free audience in Phase 1 unless an opportunistic sale is unusually easy.

Public information is intended to be strong enough to cite, but the public authority layer is capped at roughly 10–15% of Phase 1 effort.

Standing principle:

> **Public information creates authority. Private relevance creates revenue.**

Standing product rule:

> **Does this materially improve our probability of reaching C$2,500 MRR quickly, while preserving the data foundation we will need if the product succeeds?**

If not, defer it.

---

## Immediate commercial decisions to implement

- [x] Replace legacy C$29 product pricing/gating with Business C$99/month in repository code and copy.
- [x] Define Business/Advisor account tiers and founding-pricing state without building the Advisor workspace.
- [x] Update homepage metadata and primary copy from exporter-led positioning to Canadian import/export trade-impact intelligence.
- [x] Ensure import and export use cases remain one product, not separate product lines.
- [ ] Build a reliable weekly revenue tracker around actual billed C$2,500 MRR; show normalized MRR separately if useful.

### Manual external billing actions for Roshan

- [ ] In Stripe, create or select the recurring **TariffCompass Business C$99/month CAD** Price. Do not guess its Price ID.
- [ ] Update the existing production Worker environment variable **`STRIPE_PRICE_ID`** to that Price ID. This is the exact reference used by `lib/stripe/actions.ts`.
- [ ] Configure a Stripe discount for the first 10 paying Business customers: 50% off for 12 months, then automatic renewal at C$99/month. Decide and test the cohort-allocation procedure before advertising it as active.
- [ ] Before Advisor checkout is launched, configure C$249/month CAD billing plus a first-3-customer discount of 50% for 12 months, then automatic renewal at C$249/month. No Advisor Price ID is assumed in the repository yet.
- [ ] Apply `supabase/migrations/20260828052639_add_subscription_tier_and_founding_pricing.sql` through the normal migration deployment workflow before deploying code that writes the new profile fields.
- [ ] Run a live end-to-end checkout and billing-portal test after the Stripe and Worker environment changes. Confirm the amount in Stripe Checkout before payment.

---

## Immediate product priorities

Follow ROADMAP.md. Highest priorities are:

- [ ] HS/product-level specificity where reliable.
- [ ] Source/effective-date confidence on every material tariff fact.
- [ ] Estimated dollar exposure as a primary result.
- [ ] Saved-product change monitoring and alerts.
- [ ] Simple response intelligence: alternative markets/sourcing, FTA implications, government programs, next actions.
- [ ] Multi-client Client Exposure Radar for accountants/fractional CFOs.

Do not broaden into full customs-compliance workflow unless paying customers pull us there.

---

## Public authority layer — Beta 1

Keep lightweight and source-driven.

- [ ] Retain `/insights`, `/updates`, and `/sources`.
- [ ] Publish short, quantitative pieces based on the same structured data used by the product.
- [ ] Every public data claim should be dated, sourced and explicit about confidence/methodology.
- [ ] Prefer reusable charts/tables only when maintenance cost is low.
- [ ] Track citations/backlinks as a secondary metric, not a Phase 1 KPI.

Good examples:

- which sectors are most exposed to a new U.S. tariff action;
- what changed in a specific Section 232 measure;
- which Canadian import categories are most affected by a countermeasure;
- a representative SME impact example using sourced assumptions.

Do not build dedicated journalist, lawyer, politician or policy dashboards in Phase 1.

---

## Founder-led sales

### SME motion

- [ ] Build a first prospect list of Canadian manufacturers, distributors/wholesalers, import-dependent retailers and U.S.-exposed exporters.
- [ ] Demo with one real product/HS code and approximate annual trade value.
- [ ] Track demo-to-paid conversion and time-to-payment.
- [ ] Ask specifically whether C$99/month feels trivial, acceptable or too high relative to the exposure shown.

### Advisor motion

- [ ] Identify accounting firms and fractional CFO firms with commercial SME client books.
- [ ] Recruit design partners once Client Exposure Radar is demonstrable.
- [ ] Measure how many clients per firm are genuinely trade exposed.
- [ ] Convert to C$249/month when portfolio monitoring has recurring value.

Crowdfunding-readiness mix at standard pricing:

- 30 Business × C$99 = C$2,970 normalized MRR
- 3 Advisor × C$249 = C$747 normalized MRR
- Total = **C$3,717 normalized MRR / C$44,604 normalized ARR**, plus approximately 2–3 strong customer stories

Actual billed MRR will be lower while founding discounts apply and must be reported separately.

---

## Early operating rule

Until C$2,500 MRR is reached: no founder dividends; keep costs lean; recycle available operating cash and gross profit into measurable customer acquisition and product/data reliability; and track CAC and conversion rather than spending blindly.

---

## Legal review

Still required before broad public launch and live paid acquisition.

### Entity structure

- [ ] Should TariffCompass sit under Adithana Capital Ltd. or a separate operating company?
- [ ] Confirm the entity on Stripe before taking material live payments.
- [ ] Consider liability separation and grant/funding eligibility.

### Published figures and decision support

- [ ] Exposure if a user relies on a displayed rate and loses money.
- [ ] Whether confidence labels, source citations and “planning estimate” language sufficiently limit risk.
- [ ] Whether AI-generated recommended actions cross into regulated customs, legal, tax or financial advice.
- [ ] Appropriate broker/lawyer/accountant verification language.

### Terms/privacy/subscription

- [ ] Review Terms, Privacy and Notices.
- [ ] Review auto-renewal, cancellation and refund requirements.
- [ ] Review PIPEDA obligations for stored business/client profiles.
- [ ] Review white-label Advisor output and resulting liability allocation.

### Data sourcing

- [ ] Confirm OGL-Canada attribution.
- [ ] Confirm programmatic-access terms for planned official data sources.
- [ ] Prefer official sources wherever practical.

---

## Data debt

- [ ] CUSMA annotation lost in migration; restore as structured data.
- [ ] `key_dates` homepage still needs complete Postgres cutover.
- [ ] Vestigial `companies` / `products` writes should be cleaned before tariff-schema expansion.
- [ ] Stripe checkout error handling needs robust inline UI.
- [ ] `effective_from` remains missing on many rows until official-instrument ingestion is complete.
- [ ] `measure_type` remains incomplete.
- [ ] Current category-level rows are largely estimated/unknown; this must improve before strong tariff-determination claims.
- [ ] “Other / Custom” still lacks meaningful tariff data.
- [ ] Some import-category ranges are too broad or uninformative to support paid value.

---

## Open decisions

- [ ] Entity structure — lawyer.
- [ ] Exact free-vs-paid gating after C$99 repricing.
- [ ] Exact Business saved-profile/HS-code limits.
- [ ] Exact Advisor client-profile limit at C$249.
- [ ] Whether white-label output is required for the first Advisor sale or can follow Client Exposure Radar.
- [ ] Timing for lifting Cloudflare Access after legal/commercial readiness.

---

## Explicitly deferred until after the initial C$2,500 MRR milestone unless customer pull changes the decision

- full customs-entry/audit workflow;
- supplier certificate repositories;
- comprehensive origin-document management;
- dedicated lawyer workflows;
- bank portfolio analytics;
- association/government dashboards;
- institutional API product;
- non-Canadian home countries;
- large content/editorial operation;
- broad paid marketing;
- crowdfunding execution.

---

## Crowdfunding

TariffCompass has strong future crowdfunding characteristics: a visible Canadian problem, a product that can be explained on one page, an intuitive live demo and potential national relevance.

Do not execute a crowdfunding campaign during the first ARR push. Sequence: build → launch → C$2,500 MRR → 30 Business + 3 Advisor customers + 2–3 credible customer stories → crowdfunding preparation. The current planning assumption is a possible C$300,000 raise at approximately a C$3 million valuation, subject to later review.

---

## Standing rules

- Never invent a tariff rate, effective date, legal instrument or program deadline.
- NULL/unknown is preferable to false precision.
- Public history can be free; company/client-specific relevance and monitoring are the paid value.
- AI explains structured intelligence; it does not create tariff facts.
- Canada remains the fixed home country in Phase 1.
- Never force push.
- Strategy changes belong in BUSINESS_PLAN.md first, then ROADMAP/PENDING should be reconciled to it.
