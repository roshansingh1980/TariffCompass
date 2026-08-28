# TariffCompass — Pending

_Last updated: 27 August 2026_

Canonical strategy: [`BUSINESS_PLAN.md`](BUSINESS_PLAN.md)  
Canonical build sequence: [`ROADMAP.md`](ROADMAP.md)

## Adopted strategy

The Phase 1 objective is **C$50,000 ARR as quickly as possible**.

Paid segments:

1. **Canadian trade-exposed SMEs** — importers, exporters, or both — at **C$99/month**, with a recommended **C$999/year** option.
2. **Accountants and fractional CFO/advisory firms** at **C$249/month**, once a useful multi-client experience and Client Exposure Radar are live.

Everyone else — journalists, lawyers, consultants, policymakers, politicians, associations, researchers and the general public — is a free audience in Phase 1 unless an opportunistic sale is unusually easy.

Public information is intended to be strong enough to cite, but the public authority layer is capped at roughly 10–15% of Phase 1 effort.

Standing principle:

> **Public information creates authority. Private relevance creates revenue.**

Standing product rule:

> **Does this materially improve our probability of reaching C$4,167 MRR quickly, while preserving the data foundation we will need if the product succeeds?**

If not, defer it.

---

## Immediate commercial decisions to implement

- [ ] Replace legacy C$29 product pricing/gating with Business C$99/month.
- [ ] Add C$999/year Business option.
- [ ] Define Advisor C$249/month billing/product entitlement but do not sell it before the multi-client value is credible.
- [ ] Update homepage/about/pricing copy from exporter-led positioning to “Canadian businesses that buy or sell across borders.”
- [ ] Ensure import and export use cases appear as one product, not separate product lines.
- [ ] Build an internal ARR dashboard or at minimum a reliable weekly tracking sheet around C$4,167 MRR.

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

Working ARR mix:

- 25 Business × C$99 = C$2,475 MRR
- 8 Advisor × C$249 = C$1,992 MRR
- Total = **C$4,467 MRR / C$53,604 ARR**

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

## Explicitly deferred until after C$50K ARR unless customer pull changes the decision

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

Do not execute a crowdfunding campaign during the first ARR push. Revisit after meaningful paying-customer proof, ideally at or near C$50K ARR. At that point crowdfunding may serve both financing and distribution.

---

## Standing rules

- Never invent a tariff rate, effective date, legal instrument or program deadline.
- NULL/unknown is preferable to false precision.
- Public history can be free; company/client-specific relevance and monitoring are the paid value.
- AI explains structured intelligence; it does not create tariff facts.
- Canada remains the fixed home country in Phase 1.
- Never force push.
- Strategy changes belong in BUSINESS_PLAN.md first, then ROADMAP/PENDING should be reconciled to it.
