# TariffCompass — Pending

_Last updated: 27 August 2026_

Canonical strategy: [`BUSINESS_PLAN.md`](BUSINESS_PLAN.md)  
Canonical build sequence: [`ROADMAP.md`](ROADMAP.md)

## Phase 1 objective

Reach **C$2,500 MRR / C$30,000 ARR as quickly as possible** with a product that is clearly worth **C$99/month** to Canadian trade-exposed SMEs.

Paid segments:

1. **Canadian trade-exposed SMEs** — importers, exporters, or both — at **C$99/month**.
2. **Accountants and fractional CFO/advisory firms** at **C$249/month**, once a useful multi-client experience exists.

Everyone else — journalists, lawyers, consultants, policymakers, politicians, associations, researchers and the general public — is a free audience in Phase 1 unless an opportunistic sale is unusually easy.

Standing principles:

> **Public information creates authority. Private relevance creates revenue.**

> **Does this materially improve our probability of reaching C$2,500 MRR quickly, while preserving the data foundation we will need if the product succeeds?**

If not, defer it.

---

# C$99 launch gates — must close before broad paid launch

These six items are the primary pre-launch product checklist. They are the minimum bar for TariffCompass to be defensible at C$99/month.

## 1. HS/product-specific analysis

- [ ] Move the paid experience beyond broad category ranges such as “Steel & Metals: 10–50%.”
- [ ] Make HS code/product applicability first-class wherever reliable data exists.
- [ ] Add product-description search or another practical way for SMEs to find likely HS headings/codes.
- [ ] Preserve category-level fallback only where HS-level coverage is unavailable and label it clearly.
- [ ] Do not present AI classification as authoritative; users must confirm classification with a customs professional where needed.

**Launch bar:** a user can enter a real product/HS code and receive a materially more specific answer than a category-level range.

## 2. Source + effective date + confidence

- [ ] Every material tariff/trade-policy fact shown to the user carries an authoritative source where practical.
- [ ] Show effective date where known.
- [ ] Show retrieval/review date.
- [ ] Show confidence explicitly: official / official-source-human-read / estimated / unknown, or the final adopted equivalent.
- [ ] Never fabricate a rate, date, legal instrument or confidence level.

**Launch bar:** a paying user can see where the number came from, when it applies, and how much confidence TariffCompass has in it.

## 3. Financial impact

- [ ] Annual import/export value must convert into estimated dollar exposure.
- [ ] Make dollar exposure a primary result, not a buried secondary detail.
- [ ] Support the relevant currency cleanly.
- [ ] Clearly distinguish planning estimates from customs-duty determinations.
- [ ] Add simple margin/pricing implications where reliable and useful without turning the product into a full finance model.

**Launch bar:** the user immediately understands approximately how much money is at risk.

## 4. Before/after change intelligence

- [ ] Where a tariff or trade measure changed, show the prior treatment and current treatment.
- [ ] Show the effective date of the change.
- [ ] Link the change to the source/legal instrument.
- [ ] Preserve historical rate/measure context rather than simply overwriting the current value.
- [ ] Distinguish announced, effective, delayed, amended and expired measures where material.

**Launch bar:** TariffCompass can answer “what changed, from what to what, and when?” for the high-priority measures it covers.

## 5. Saved-product monitoring + useful alerting

- [ ] Paying users can save products/trade exposures for monitoring.
- [ ] Scheduled change detection compares saved exposures against tariff/trade-policy updates.
- [ ] Create reliable change history (`rate_changes` or final equivalent) with before/after values and source.
- [ ] Alert must say: what changed, which saved product is affected, effective date, estimated financial impact, and source.
- [ ] Email and/or in-app alerting must be useful enough to justify recurring subscription value.

**Launch bar:** TariffCompass is not merely a one-time calculator; it watches a customer’s saved exposure and tells them when something material changes.

## 6. Practical response intelligence

- [ ] Provide useful alternative destination/source comparisons where supporting data is reliable.
- [ ] Surface relevant FTA implications, with CUSMA first and CETA/CPTPP only where data quality justifies it.
- [ ] Surface relevant government programs and verified deadlines worth reviewing; never assert eligibility without deterministic support.
- [ ] Give clear next actions and questions to take to a customs broker, accountant, lawyer or management team where appropriate.
- [ ] AI may explain structured intelligence but must not introduce unsourced tariff facts or regulated conclusions.

**Launch bar:** after seeing the exposure, the user has a credible answer to “what should I investigate next?”

---

# Launch-readiness dependencies

These are supporting blockers that enable or protect the six launch gates.

## Data and schema debt

- [ ] Restore CUSMA annotation as structured data rather than prose.
- [ ] Complete `key_dates` homepage cutover to Postgres.
- [ ] Clean vestigial `companies` / `products` writes before tariff-schema expansion.
- [ ] Backfill `measure_type` where confidently known.
- [ ] Populate `effective_from` through official-source ingestion where possible.
- [ ] Improve current category-level rows that are estimated/unknown before making strong tariff-determination claims.
- [ ] “Other / Custom” still lacks meaningful tariff data; keep it clearly labelled until solved.
- [ ] Fix import-category ranges that are too broad or uninformative to support paid value.
- [ ] Rebuild AI freshness review against Postgres only if it materially improves trust without delaying launch.

## Billing and subscription reliability

- [x] Replace legacy C$29 repository pricing/copy with Business C$99/month.
- [x] Add Business/Advisor tier and founding-pricing state to the account model.
- [ ] Ensure Stripe checkout, billing portal, cancellation and inline checkout error UI are reliable.
- [ ] Build a simple internal weekly revenue tracker around actual billed MRR; show normalized MRR separately when useful.

### Manual external billing actions for Roshan

- [ ] In Stripe, create or select the recurring **TariffCompass Business C$99/month CAD** Price. Do not guess its Price ID.
- [ ] Update production Worker environment variable **`STRIPE_PRICE_ID`** to that Price ID.
- [ ] Configure and test the first-10 Business founding offer: 50% off for 12 months, then C$99/month.
- [ ] Before Advisor checkout launches, configure C$249/month CAD billing plus the first-3 Advisor offer: 50% off for 12 months, then C$249/month.
- [ ] Apply `supabase/migrations/20260828052639_add_subscription_tier_and_founding_pricing.sql` through the normal migration deployment workflow before production code writes the new fields.
- [ ] Run a live end-to-end checkout and billing-portal test. Confirm the exact amount in Stripe Checkout before payment.

## Legal/commercial readiness

Still required before broad public paid acquisition.

### Entity structure

- [ ] Decide whether TariffCompass sits under Adithana Capital Ltd. or a separate operating company.
- [ ] Confirm the operating entity on Stripe before taking material live payments.
- [ ] Review liability separation and grant/funding eligibility implications.

### Published figures and decision support

- [ ] Review exposure if a user relies on a displayed rate and loses money.
- [ ] Confirm whether confidence labels, source citations and “planning estimate” language sufficiently limit risk.
- [ ] Review whether AI-generated recommended actions cross into regulated customs, legal, tax or financial advice.
- [ ] Confirm appropriate customs-broker/lawyer/accountant verification language.

### Terms/privacy/subscription

- [ ] Review Terms, Privacy and Notices.
- [ ] Review auto-renewal, cancellation and refund requirements.
- [ ] Review PIPEDA obligations for stored business/client profiles.
- [ ] Review future white-label Advisor output and liability allocation before launch of that feature.

### Data sourcing

- [ ] Confirm OGL-Canada attribution.
- [ ] Confirm programmatic-access terms for planned official data sources.
- [ ] Prefer official sources wherever practical.

---

# Go-to-market — run in parallel with launch work

Do not wait for a perfect platform before beginning founder-led customer development, but do not charge broadly until the six C$99 launch gates are credible.

## SME motion

- [ ] Build the first prospect list of Canadian manufacturers, distributors/wholesalers, import-dependent retailers and U.S.-exposed exporters.
- [ ] Demo using one real product/HS code and approximate annual trade value.
- [ ] Track demo-to-paid conversion and time-to-payment.
- [ ] Ask every early customer what specific output made C$99 feel trivial, acceptable or too high.
- [ ] Personally interview early paying customers and capture product, pricing, retention and testimonial insights.

## Advisor motion

Advisor work is secondary until the Business product is convincingly worth C$99.

- [ ] Identify accounting firms and fractional CFO firms with commercial SME client books.
- [ ] Recruit initial design partners when a useful multi-client view is demonstrable.
- [ ] Measure how many clients per firm are genuinely trade exposed.
- [ ] Convert to C$249/month only when portfolio monitoring creates clear recurring value.

Crowdfunding-readiness milestone at standard pricing:

- 30 Business × C$99 = C$2,970 normalized MRR
- 3 Advisor × C$249 = C$747 normalized MRR
- Total = **C$3,717 normalized MRR / C$44,604 normalized ARR**
- plus approximately **2–3 strong customer stories/testimonials**

Actual billed MRR will be lower while founding discounts apply and must be reported separately.

---

# Public authority layer — lightweight Beta 1

Keep this at roughly 10–15% of Phase 1 effort.

- [ ] Retain `/insights`, `/updates`, and `/sources`.
- [ ] Publish short, quantitative, source-driven pieces using the same structured data as the product.
- [ ] Every substantive public data claim should be dated, sourced and explicit about confidence/methodology.
- [ ] Prefer reusable public tables/charts only when maintenance cost is low.
- [ ] Track citations/backlinks as a secondary metric, not a Phase 1 KPI.

Do not build dedicated journalist, lawyer, politician or policy dashboards in Phase 1.

---

# Early operating rule

Until C$2,500 MRR is reached:

- no founder dividends;
- keep costs lean;
- recycle available operating cash and gross profit into measurable customer acquisition and product/data reliability;
- prioritize direct founder-led sales before scaling broad paid marketing;
- scale ads only where CAC and conversion are measurable.

---

# Open decisions

Only decisions that materially affect launch remain here.

- [ ] Entity structure — lawyer.
- [ ] Exact free-vs-paid gating at C$99 after the six launch gates are implemented.
- [ ] Exact Business saved-profile / HS-code limit.
- [ ] Timing for lifting Cloudflare Access after legal, billing and product readiness.

Advisor-specific decisions such as client limits and white-label timing can wait until the Business product is launched and Advisor work is pulled forward by real demand.

---

# Explicitly deferred until after the initial C$2,500 MRR milestone unless customer pull is overwhelming

- full customs-entry/audit workflow;
- supplier certificate repositories;
- comprehensive origin-document management;
- full CUSMA/CETA/CPTPP qualification engines beyond what is required for useful response intelligence;
- dedicated lawyer workflows;
- bank portfolio analytics;
- association/government dashboards;
- institutional API product;
- non-Canadian home countries;
- complex enterprise permissions;
- large content/editorial operation;
- full Advisor Client Exposure Radar if it delays Business launch;
- broad paid marketing before conversion is understood;
- crowdfunding execution.

---

# Crowdfunding

TariffCompass has strong future crowdfunding characteristics: a visible Canadian problem, a product that can be explained on one page, an intuitive live demo and potential national relevance.

Do not execute crowdfunding during the first ARR push. Sequence:

**close six C$99 launch gates → launch → C$2,500 MRR → 30 Business + 3 Advisor customers + 2–3 credible customer stories → crowdfunding preparation.**

Current planning assumption: possible **C$300,000 raise at approximately a C$3 million valuation**, subject to later review.

---

# Standing rules

- Never invent a tariff rate, effective date, legal instrument or program deadline.
- NULL/unknown is preferable to false precision.
- Public history can be free; company/client-specific relevance and monitoring are the paid value.
- AI explains structured intelligence; it does not create tariff facts.
- Canada remains the fixed home country in Phase 1.
- Never force push.
- Strategy changes belong in `BUSINESS_PLAN.md` first, then `ROADMAP.md` and `PENDING.md` should be reconciled to it.
