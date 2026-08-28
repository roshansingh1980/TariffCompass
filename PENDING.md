# TariffCompass — Pending

_Last updated: 27 August 2026_

This file contains **only work required for a successful TariffCompass Business Beta/V1 launch**.

- Canonical strategy: [`BUSINESS_PLAN.md`](BUSINESS_PLAN.md)
- Canonical build sequence: [`ROADMAP.md`](ROADMAP.md)
- Canonical acquisition roadmap: [`MARKETING_STRATEGY.md`](MARKETING_STRATEGY.md)
- Post-launch / later-phase backlog: [`FUTURE.md`](FUTURE.md)

## Beta/V1 objective

Launch a product that is clearly defensible at **C$99/month** for Canadian businesses that import, export, or do both, then drive toward **C$2,500 MRR / C$30,000 ARR** as quickly as possible.

Before adding anything to this file, ask:

> **Is this necessary for a credible C$99 Business launch?**

If not, put it in `FUTURE.md`.

---

# Six C$99 launch gates

These are the primary product requirements. Broad paid launch does not happen until all six are credible.

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
- [ ] Show confidence explicitly using the final adopted confidence model.
- [ ] Never fabricate a rate, date, legal instrument or confidence level.

**Launch bar:** a paying user can see where the number came from, when it applies, and how much confidence TariffCompass has in it.

## 3. Financial impact

- [ ] Convert annual import/export value into estimated dollar exposure.
- [ ] Make dollar exposure a primary result, not a buried secondary detail.
- [ ] Support relevant currency cleanly.
- [ ] Clearly distinguish planning estimates from customs-duty determinations.
- [ ] Add only simple margin/pricing implications that are reliable and clearly useful.

**Launch bar:** the user immediately understands approximately how much money is at risk.

## 4. Before/after change intelligence

- [ ] Where a tariff/trade measure changed, show prior treatment and current treatment.
- [ ] Show the effective date of the change.
- [ ] Link the change to the source/legal instrument.
- [ ] Preserve historical rate/measure context rather than overwriting the current value.
- [ ] Distinguish announced, effective, delayed, amended and expired measures where material.

**Launch bar:** TariffCompass can answer “what changed, from what to what, and when?” for the high-priority measures it covers.

## 5. Saved-product monitoring + useful alerting

- [ ] Paying users can save products/trade exposures for monitoring.
- [ ] Scheduled change detection compares saved exposures against tariff/trade-policy updates.
- [ ] Create reliable change history (`rate_changes` or final equivalent) with before/after values and source.
- [ ] Alerts identify what changed, which saved product is affected, effective date, estimated financial impact and source.
- [ ] Email and/or in-app alerting must be useful enough to justify recurring subscription value.

**Launch bar:** TariffCompass watches a customer’s saved exposure and tells them when something material changes; it is not merely a one-time calculator.

## 6. Practical response intelligence

- [ ] Provide useful alternative destination/source comparisons where supporting data is reliable.
- [ ] Surface relevant FTA implications needed for a credible response, with CUSMA prioritized.
- [ ] Surface relevant government programs and verified deadlines worth reviewing; never assert eligibility without deterministic support.
- [ ] Give clear next actions/questions for a customs broker, accountant, lawyer or management team where appropriate.
- [ ] AI may explain structured intelligence but must not introduce unsourced tariff facts or regulated conclusions.

**Launch bar:** after seeing the exposure, the user has a credible answer to “what should I investigate next?”

---

# Product/data dependencies required to close the six gates

Only fix data debt that materially blocks the launch gates.

- [ ] Restore CUSMA annotation as structured data where needed for the launch experience.
- [ ] Backfill `measure_type` where confidently known for covered launch measures.
- [ ] Populate `effective_from` through official-source ingestion for covered high-priority measures.
- [ ] Improve/remove category-level rows that are too broad, estimated or uninformative to support paid claims.
- [ ] Keep “Other / Custom” clearly labelled as unsupported/limited until meaningful data exists.
- [ ] Clean vestigial `companies` / `products` writes if they interfere with the HS/trade-exposure schema.
- [ ] Complete `key_dates` Postgres cutover if required to avoid conflicting/stale launch data.

Do not rebuild unrelated data systems before launch.

---

# Billing and subscription — Business launch only

Completed:

- [x] Repository pricing/copy aligned to **Business C$99/month**.
- [x] Subscription tier/founding-pricing fields added to the account model.

Still required:

- [ ] Ensure Stripe checkout, billing portal, cancellation and inline checkout error UI are reliable.
- [ ] Apply `supabase/migrations/20260828052639_add_subscription_tier_and_founding_pricing.sql` in production.
- [ ] Create/select the live recurring **TariffCompass Business C$99/month CAD** Stripe Price.
- [ ] Update production Worker environment variable **`STRIPE_PRICE_ID`** to the live C$99 Price ID.
- [ ] Configure and test the first-10 Business founding offer: **50% off for 12 months, then C$99/month**.
- [ ] Verify the founding cohort cannot accidentally exceed 10 customers.
- [ ] Run a real end-to-end live checkout and billing-portal test; confirm the amount before payment.

Advisor Stripe pricing and the first-3 Advisor offer are in `FUTURE.md` and must not delay Business launch.

---

# French / bilingual core journey — V1 required

TariffCompass should launch as a credible Canadian product with a French-capable core experience, but V1 does **not** require full bilingual parity across every historical/public page.

- [ ] Implement locale/i18n architecture cleanly enough that French is not a future retrofit.
- [ ] Provide an obvious **EN / FR** language switcher.
- [ ] Translate the homepage and primary value proposition.
- [ ] Translate Business pricing, founding-offer and subscription copy.
- [ ] Translate signup/login and core transactional account messages.
- [ ] Translate the core Business analysis journey: scenario/intake → product/HS input → exposure/results → response intelligence.
- [ ] Translate core monitoring/alert copy and customer-facing alert emails used at launch.
- [ ] Translate launch-critical disclaimers, Notices and essential legal/billing copy.
- [ ] Use proper Canadian French trade/customs terminology; do not rely on unreviewed literal machine translation for tariff/legal concepts.
- [ ] Ensure core French metadata and primary public-page SEO basics are correct.

**Launch bar:** a French-speaking Canadian SME can discover TariffCompass, understand the offer, complete the core Business workflow, interpret the result, subscribe and receive the essential monitoring experience without being forced back into English.

Full bilingual content parity — historical Insights/Updates, long-form support, full methodology library, future Advisor UI and deep French SEO — belongs in `FUTURE.md`.

---

# Legal/commercial launch review

Complete only the review needed to safely launch the Business product.

## Entity and billing party

- [ ] Incorporate a dedicated TariffCompass operating company and transfer/assign the relevant TariffCompass ownership, IP, contracts, billing relationships and operating assets into that operating company, with **Adithana Capital Ltd. as the holding company/shareholder**, subject to legal and tax advice on the exact implementation.
- [ ] Confirm the operating entity on Stripe before taking material live payments.

## Product liability / decision-support boundary

- [ ] Review liability if a user relies on a displayed tariff/rate and loses money.
- [ ] Confirm whether source citations, confidence labels and “planning estimate” language are adequate.
- [ ] Review whether AI-generated response suggestions cross into regulated customs, legal, tax or financial advice.
- [ ] Confirm appropriate customs-broker/lawyer/accountant verification language.

## Terms/privacy/subscription

- [ ] Review Terms, Privacy and Notices for launch in both English and the French core launch experience where required.
- [ ] Review auto-renewal, cancellation and refund requirements.
- [ ] Review PIPEDA obligations for stored Business profiles.
- [ ] Confirm OGL-Canada attribution and launch-critical official-source usage terms.

White-label/Advisor-specific liability work belongs in `FUTURE.md`.

---

# Beta/V1 UX and production readiness

- [ ] Finalize free-vs-paid gating so free proves value and C$99 clearly buys private relevance, financial exposure and monitoring.
- [ ] Finalize the Business saved-profile / HS-code limit.
- [ ] Confirm homepage/product copy reflects Canadian businesses that import, export, or do both.
- [ ] Confirm the EN/FR switch and core bilingual journey work on desktop and mobile.
- [ ] Confirm `/insights`, `/updates`, and `/sources` are credible and not stale; no large publishing build is required.
- [ ] Run end-to-end QA across anonymous analysis → signup/login → paid checkout → saved profile → monitoring/alert → billing portal/cancellation in English and the French core journey.
- [ ] Run TypeScript, lint, tests and production build.
- [ ] Smoke-test production after deployment.
- [ ] Lift Cloudflare Access only after product, billing and legal launch checks are complete.

---

# Founder-led launch / first customers

Run this in parallel with final launch work. The detailed acquisition roadmap lives in `MARKETING_STRATEGY.md`.

- [ ] Build the first prospect list of Canadian manufacturers, distributors/wholesalers, import-dependent retailers and U.S.-exposed exporters.
- [ ] Include a deliberate Quebec/French-speaking prospect subset so the V1 French journey is tested by real users.
- [ ] Prepare one strong live demo using a real product/HS code and approximate annual trade value.
- [ ] Start founder-led demos as soon as the six gates are credible.
- [ ] Track demo → paid conversion and time-to-payment.
- [ ] Ask every early customer what specific output made C$99 feel trivial, acceptable or too high.
- [ ] Personally interview early paying customers and capture product, pricing, retention and testimonial insights.

Initial operating objective after launch: **drive to C$2,500 MRR as quickly as possible.**

---

# Launch rules

- Never invent a tariff rate, effective date, legal instrument or program deadline.
- NULL/unknown is preferable to false precision.
- Public tariff history can be free; company-specific relevance, financial impact and monitoring are the paid value.
- AI explains structured intelligence; it does not create tariff facts.
- Canada remains the fixed home country for Beta/V1.
- V1 includes French-ready architecture and the complete core Business buying/analysis/monitoring journey in French; full content parity is future work.
- Do not add Advisor, institutional, crowdfunding, broad publishing or deep customs-compliance work to `PENDING.md` unless Roshan explicitly promotes it from `FUTURE.md`.
- Never force push.