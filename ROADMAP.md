# TariffCompass — Phase 1 ARR Roadmap

_Last updated: 27 August 2026_

This roadmap is subordinate to [`BUSINESS_PLAN.md`](BUSINESS_PLAN.md).

## North-star objective

Reach **C$4,167 MRR / C$50,000 ARR as quickly as possible**.

The target customer set is deliberately narrow:

1. Canadian SMEs that import, export, or do both.
2. Accountants and fractional CFO/advisory firms serving trade-exposed SMEs.

Everything else is free audience, opportunistic use, or later-phase expansion.

## Commercial target

Working mix:

- 25 Business accounts × C$99/month = C$2,475 MRR
- 8 Advisor accounts × C$249/month = C$1,992 MRR
- Total = **C$4,467 MRR / C$53,604 ARR**

Do not optimize for registrations, feature count, traffic, or breadth ahead of paid conversion and retention.

---

## Phase 0 — Align the existing product to the commercial proposition

### Pricing and packaging

- [ ] Replace legacy C$29 positioning/gating with **Business C$99/month**.
- [ ] Add annual Business option at **C$999/year**.
- [ ] Define **Advisor C$249/month**; do not sell until a useful multi-client experience exists.
- [ ] Keep Free useful enough to demonstrate real value and build trust.
- [ ] Ensure Stripe checkout, billing portal, cancellation, and error UI are reliable.

### Positioning

- [ ] Homepage and metadata must speak to **Canadian businesses that buy or sell across borders**, not exporters only.
- [ ] Core message: what changed → does it affect me → what does it cost → what can I do.
- [ ] Preserve Canada as the fixed home country in Phase 1.
- [ ] Do not create separate importer/exporter products; trade direction remains an input to one product.

### Existing data debt that blocks selling

- [ ] Move `key_dates` homepage consumption fully to Postgres.
- [ ] Backfill `measure_type` where confidently known.
- [ ] Remove/clean vestigial `companies` / `products` writes before tariff-schema expansion.
- [ ] Restore CUSMA annotation as structured data rather than prose.
- [ ] Rebuild AI freshness review against Postgres if it can materially improve confidence without delaying launch.

---

## Phase 1A — Product-specific tariff exposure

This is the foundation for paid value.

### HS-level specificity

- [ ] Extend `tariff_rates` so HS code/product applicability is first-class rather than category-only.
- [ ] Add product-description search to help users find likely HS headings/codes.
- [ ] Do **not** present AI classification as authoritative; the user must confirm classification with a customs professional when needed.
- [ ] Preserve category fallback where HS-level coverage is unavailable and label it clearly.
- [ ] Every rate must carry source, retrieval/review date, effective date where known, and confidence.

### Canada–U.S. first

Prioritize the trade routes most likely to produce immediate Canadian SME pain and sales conversations.

- [ ] Canadian export exposure into the United States.
- [ ] Canadian import exposure from the United States.
- [ ] High-impact Canadian counter-tariff/surtax exposure on imports from relevant origins.
- [ ] Alternative destination/source comparisons only where supporting data is good enough to be useful.

### Financial impact

- [ ] Make estimated annual dollar exposure a primary result, not a secondary paywall detail.
- [ ] Show before/after exposure when a rate changed and historical data is available.
- [ ] Support simple margin/pricing scenarios where reliable.
- [ ] Clearly distinguish planning estimates from customs-duty determinations.

**Beta-1 demo bar:** a user can provide a product/HS code, direction, route and annual value and receive a sourced, dated, financially meaningful answer in minutes.

---

## Phase 1B — Trade-policy change engine and alerts

Recurring monitoring is the core subscription mechanism.

### Trade measure model

Evolve the data model toward:

- legal instrument/source;
- jurisdiction;
- measure type;
- announcement/effective/review dates;
- HS applicability;
- origin/destination applicability;
- exclusions/thresholds where material;
- base/preferential/additional rates; and
- change history.

Conceptual model:

**Trade Measure × Company Exposure = Impact**

### Sources/connectors

- [ ] USITC HTS data for base tariff structure.
- [ ] Federal Register / official U.S. instruments for Section 232 and similar actions.
- [ ] Canada Gazette / Finance Canada / CBSA / Global Affairs Canada sources for Canadian countermeasures, remission and trade-agreement information.
- [ ] Use official sources wherever practical; never fabricate a rate or date.

### Alerts

- [ ] Scheduled diff against saved profiles/products.
- [ ] `rate_changes` / measure-change history with before/after and source.
- [ ] Email/in-app alert: what changed, which saved product is affected, effective date, estimated dollar impact, source.
- [ ] Program deadline warnings only where dates are verified and relevant.

**Paid value principle:** the public can see that a tariff changed; a paying customer is told that it affects **their** products and approximately **how much**.

---

## Phase 1C — Response intelligence

Do not build a full trade-consulting platform. Give enough decision support to make the exposure actionable.

- [ ] Alternative sourcing/destination comparisons.
- [ ] FTA treatment indicators where reliable (CUSMA first, then CETA/CPTPP as justified by customer demand).
- [ ] Government programs worth reviewing; never assert eligibility unless a deterministic rule truly supports it.
- [ ] Suggested next questions/actions for broker/accountant/lawyer/management.
- [ ] AI brief should explain structured data rather than supply unsourced trade facts.

Defer deep customs-compliance workflow, supplier-document repositories and full origin-management systems unless paying customers specifically pull us there.

---

## Phase 1D — Advisor product

Build only after the single-business exposure/monitoring experience is convincing.

### Minimum Advisor product

- [ ] Multi-client workspace.
- [ ] Client profiles with saved trade exposures.
- [ ] **Client Exposure Radar** showing recent material changes across the book.
- [ ] Sort/filter by risk, change, estimated exposure and client.
- [ ] Client-ready PDF/report output.
- [ ] White-label/firm branding once report quality is dependable.
- [ ] Stripe Advisor billing at C$249/month.

### Advisor demo bar

An accountant should be able to see:

> “4 of my 37 monitored clients were affected by trade-policy changes this week; these two appear financially material.”

That is the professional “wow,” not merely white-label PDFs.

---

## Lightweight public authority layer — Beta 1

Keep this in Beta 1, but cap it at approximately **10–15% of build/content effort**.

### Keep/build

- [ ] `/insights` — short, quantitative, sourced analysis.
- [ ] `/updates` — dated change log with source and correction discipline.
- [ ] `/sources` — transparent source registry/methodology.
- [ ] Public tariff/trade summaries that render from the same data layer as paid analysis.
- [ ] Reusable tables/charts when inexpensive and genuinely citable.

### Content standard

Every substantive public piece should be:

- dated;
- source-linked;
- quantitative where possible;
- explicit about confidence/methodology;
- short enough to maintain; and
- useful to journalists, lawyers, researchers, policymakers and businesses.

### Do not build in Phase 1

- journalist dashboard;
- politician/policy dashboard;
- bespoke research workflow;
- publication CMS complexity;
- broad editorial calendar that competes with selling.

---

## Customer development and founder-led sales — run in parallel

Do not wait for a perfect platform.

### SME motion

- [ ] Build a list of Canadian manufacturers, wholesalers/distributors, import-dependent retailers and U.S.-exposed exporters.
- [ ] Run live exposure demos using one real product and approximate annual trade value.
- [ ] Track demo → trial → paid conversion and time-to-close.
- [ ] Ask what information made them willing/unwilling to pay C$99.

### Advisor motion

- [ ] Recruit initial accounting/fractional-CFO design partners once Client Exposure Radar is demonstrable.
- [ ] Ask advisors to run the tool across real client exposures.
- [ ] Track number of relevant clients per firm and portfolio-alert usefulness.
- [ ] Convert to C$249 when the multi-client experience creates clear recurring value.

### Legal/commercial readiness

- [ ] Complete legal review of tariff-figure liability, AI-generated decision support, terms/privacy, subscription/cancellation terms, sourcing/attribution and entity structure.
- [ ] Keep customs/legal/tax determinations outside the product unless properly supported.

---

## ARR operating dashboard

Track weekly:

- Business paying accounts;
- Advisor paying accounts;
- MRR;
- ARR;
- ARPA;
- founder demos completed;
- demo-to-paid conversion;
- days from first demo to payment;
- churn/cancellation;
- monitored products/profiles;
- material alerts delivered; and
- repeat usage following a tariff change.

Secondary public metrics until C$50K ARR:

- organic traffic;
- citations/backlinks;
- media/newsletter references; and
- source/insight-page usage.

---

## Explicitly deferred until after C$50K ARR unless customer pull is overwhelming

- full CBSA/customs audit workflow;
- supplier certificate repository;
- comprehensive rules-of-origin document management;
- dedicated lawyer workflows;
- bank portfolio analytics;
- association/government dashboards;
- institutional/API product;
- non-Canadian home-country support;
- complex enterprise permissions;
- large content operation;
- broad paid marketing; and
- fundraising/crowdfunding work that distracts from paying customers.

---

## Crowdfunding checkpoint

TariffCompass should preserve crowdfunding optionality because the product can be demonstrated simply to retail investors.

Do **not** optimize Phase 1 around fundraising. Revisit crowdfunding after meaningful customer proof, ideally at or around the C$50K ARR milestone.

A future campaign should be able to show:

- a real Canadian trade problem;
- a live product;
- paying customers;
- recurring revenue;
- credible source-backed public intelligence; and
- a one-screen demonstration of a tariff change and its financial effect.

---

## Standing decision rule

Before building anything, ask:

> **Does this materially improve our probability of reaching C$4,167 MRR quickly, while preserving the data foundation we will need if TariffCompass succeeds?**

If not, defer it.
