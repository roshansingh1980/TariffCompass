# TariffCompass — Pending

_Last updated: 28 August 2026_

This file contains **only work required for a successful TariffCompass Beta/V1 launch and the immediate Advisor validation needed to accelerate the C$2,500 MRR objective**.

- Canonical strategy: [`BUSINESS_PLAN.md`](BUSINESS_PLAN.md)
- Canonical build sequence: [`ROADMAP.md`](ROADMAP.md)
- Canonical acquisition roadmap: [`MARKETING_STRATEGY.md`](MARKETING_STRATEGY.md)
- Canonical Business story-driven demo: [`DEMO_STORYBOARD.md`](DEMO_STORYBOARD.md)
- Canonical Advisor story-driven demo: [`ADVISOR_DEMO_STORYBOARD.md`](ADVISOR_DEMO_STORYBOARD.md)
- Post-launch / later-phase backlog: [`FUTURE.md`](FUTURE.md)

## Beta/V1 objective

Launch a product that is clearly defensible at **C$99/month** for Canadian businesses that import, export, or do both, then drive toward **C$2,500 MRR / C$30,000 ARR** as quickly as possible. Validate the **C$249–250/month Advisor plan** with a very small founding cohort only where it accelerates that objective.

Before adding anything to this file, ask:

> **Is this necessary to make the C$99 Business product clearly worth paying for, or to prove the C$249 Advisor channel with the first 3 accountants?**

If not, put it in `FUTURE.md`.

---

# Six C$99 launch gates

These are the primary product requirements. Broad paid launch does not happen until all six are credible.

## 1. HS/product-specific analysis

- [ ] Move the paid experience beyond broad category ranges such as “Steel & Metals: 10–50%.”
- [x] Make HS code/product applicability first-class in product input, route-aware tariff querying, saved profiles, analysis snapshots and AI brief inputs.
- [x] Add lightweight product-description search against the official USITC HTS endpoint, returning possible matches without blocking the wizard when that service is unavailable.
- [x] Prefer verified matching HS rows where present; preserve category-level fallback where coverage is unavailable and label every result’s specificity clearly.
- [x] Do not present TariffCompass or AI classification as authoritative; require confirmation with a customs professional.
- [x] Populate and verify enough sourced HS-specific tariff rows for a real launch demonstration. The first production-capable slice covers 12 unambiguous Canadian tariff items for qualifying U.S.-origin imports, with an upcoming September 8, 2026 counter-tariff panel and smartphone demo path. Coverage remains intentionally narrow; other HS codes still use labelled category fallback.

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

# Billing and subscription

## Business launch

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

## Advisor founding validation

- [ ] Create/select the recurring **TariffCompass Advisor C$249–250/month CAD** Stripe Price only when the first Advisor workflow is credible enough to sell.
- [ ] Configure the first-3 Advisor founding offer: **50% off for 12 months, then standard pricing**.
- [ ] Verify the founding Advisor cohort cannot accidentally exceed 3 customers.
- [ ] Do not let Advisor billing implementation delay the Business C$99 launch.

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

Full bilingual content parity — historical Insights/Updates, long-form support, full methodology library, full Advisor UI and deep French SEO — belongs in `FUTURE.md` unless required by an early paying Advisor.

---

# Legal/commercial launch review

Complete only the review needed to safely launch the Business product and support a small Advisor founding cohort.

## Entity and billing party

- [ ] Incorporate a dedicated TariffCompass operating company and transfer/assign the relevant TariffCompass ownership, IP, contracts, billing relationships and operating assets into that operating company, with **Adithana Capital Ltd. as the holding company/shareholder**, subject to legal and tax advice on the exact implementation.
- [ ] Form/register the operating company as a **software/SaaS business**, with **NAICS 513211 — Software publishers (except video game publishers)** as the intended classification, subject to lawyer/accountant confirmation.
- [ ] **Preferred operating-company name: Adithana Software Inc.** Keep this as the current naming choice for legal/incorporation planning, subject to corporate-name and trademark clearance before filing.
- [ ] Confirm the operating entity on Stripe before taking material live payments.

## Product liability / decision-support boundary

- [ ] Review liability if a user relies on a displayed tariff/rate and loses money.
- [ ] Confirm whether source citations, confidence labels and “planning estimate” language are adequate.
- [ ] Review whether AI-generated response suggestions cross into regulated customs, legal, tax or financial advice.
- [ ] Confirm appropriate customs-broker/lawyer/accountant verification language.
- [ ] Confirm the Advisor product can provide sourced intelligence to accountants without implying the accountant or TariffCompass is providing customs/legal advice beyond their professional scope.

## Terms/privacy/subscription

- [ ] Review Terms, Privacy and Notices for launch in both English and the French core launch experience where required.
- [ ] Review auto-renewal, cancellation and refund requirements.
- [ ] Review PIPEDA obligations for stored Business profiles and Advisor client-profile data.
- [ ] Confirm OGL-Canada attribution and launch-critical official-source usage terms.

Deep white-label/institutional liability work belongs in `FUTURE.md` unless required for the first 3 Advisor customers.

---

# Sources & Methodology trust page — Beta/V1

Build a lightweight but high-signal public page that demonstrates **where TariffCompass gets its information, how authoritative each source is, how often it is monitored, and how source material becomes customer-facing intelligence**. This is a trust/conversion feature, not a decorative publishing project.

## Source hierarchy

- [ ] Define and publish **Tier 1 — legal/operative sources** used to establish or confirm the measure itself. Examples may include Canada Gazette/orders/regulations, Canada Customs Tariff, U.S. legal instruments and official tariff schedules.
- [ ] Define and publish **Tier 2 — administrative/implementation sources** used to understand how measures are administered in practice. Examples may include CBSA Customs Notices, USITC HTS revisions and relevant U.S. customs/implementation material.
- [ ] Define and publish **Tier 3 — official announcement/context sources** such as Department of Finance Canada, Global Affairs Canada, USTR, White House and similar government announcements where they are useful for detecting or explaining a development.
- [ ] Treat news/media as **supplemental discovery/context only**. A media report may trigger investigation, but TariffCompass should not publish a tariff determination solely because a news article says a change occurred.

## Monitoring map

- [ ] Inventory the critical Canadian and U.S. source families needed for launch coverage.
- [ ] For each source family, record: jurisdiction, authority tier, what TariffCompass extracts from it, monitoring method, monitoring frequency, last checked/retrieved time, and where the resulting information appears in the product.
- [ ] Adopt an honest cadence label such as **intraday / daily / weekly / event-driven manual review** rather than implying real-time monitoring where it does not exist.
- [ ] Highlight the most critical source families visually rather than presenting every URL with equal importance.

## Visual provenance flow

- [ ] Create a simple visual/process map showing the core pipeline:

  **Official source detected → trade measure identified → affected HS codes/products mapped → origin/destination/applicability logic checked → effective date recorded → confidence assigned → customer exposure matched → displayed as analysis/alert/citation**

- [ ] Prefer a source-network/process visualization over a purely geographic map. Geography may support the design, but the main purpose is to explain provenance and decision logic.
- [ ] Show Canada and U.S. source families feeding a central **TariffCompass intelligence layer**, then customer outputs such as exposure analysis, before/after changes, alerts, source citations and public updates/insights.

## Customer-facing provenance

- [ ] Wherever a material tariff fact appears in the paid product, expose the relevant source, effective date, retrieval/review date and confidence level without forcing the user to visit the methodology page.
- [ ] The methodology page should explain the system; each result should still carry its own provenance.
- [ ] Make the page suitable for use during founder-led demos and prospect outreach as evidence that TariffCompass is a sourced trade-intelligence system, not simply an AI interface.

**Launch bar:** a prospect can look at the page and understand within roughly one minute **which official sources TariffCompass relies on, how frequently they are checked, how changes are validated, and how those changes become the specific results and alerts they receive.**

---

# Story-driven Business flagship demo — Beta/V1

Use [`DEMO_STORYBOARD.md`](DEMO_STORYBOARD.md) as the canonical narrative and product-demo specification.

The flagship Business persona is **Bob**, an illustrative Ontario auto-parts manufacturer with most of his exports going to the U.S. and smaller exposure to Europe and Japan. The story must make the C$99/month value proposition understandable in roughly two minutes.

## Build the first delivery format

- [ ] Build a **scrollable web story / guided product walkthrough** before investing in a polished video.
- [ ] Keep the experience simple enough to update as Beta product screens and data change.
- [ ] Reuse accurate live product surfaces where practical; do not build a separate complex demo application.
- [ ] Make the story usable in founder-led sales calls and shareable as a public website page.

## Story requirements

- [ ] Scene 1 — establish Bob's business, Ontario location, annual exports and U.S./Europe/Japan revenue exposure.
- [ ] Scene 2 — explain the real problem: Bob does not need more news; he needs to know which trade changes affect his products, when they apply and how much money is at risk.
- [ ] Scene 3 — show Bob entering product description / HS code, trade route and annual value, then saving the exposure for monitoring.
- [ ] Scene 4 — show a **personalized saved-exposure dashboard** with monitored trade value, product/HS exposure, current treatment, estimated dollar exposure, alerts and upcoming dates.
- [ ] Scene 5 — show one real before/after trade-policy change affecting a saved exposure, with source and effective date. If auto parts does not provide a compelling current sourced example, change the product example rather than fabricate a tariff event.
- [ ] Scene 6 — move into the **Sources & Methodology** page and visually show how official-source data became Bob's result.
- [ ] Scene 7 — show credible response intelligence: alternative markets/sourcing, FTA implications, verified programs/deadlines and questions to investigate with professional advisers.
- [ ] Scene 8 — close the commercial story: **C$99/month buys ongoing monitoring of Bob's specific products, markets and financial exposure.**

## Dashboard implication

- [ ] Organize the paid Business dashboard around **saved trade exposures**, not around a generic analytics homepage and not as a separate dashboard per HS code.
- [ ] Prioritize: total monitored trade value, estimated exposure, saved products/routes, recent relevant changes, upcoming dates, alerts/action queue, source confidence and practical response intelligence.
- [ ] Keep dashboard scope disciplined; do not turn this into a broad BI suite before C$2,500 MRR.

## Demo integrity

- [ ] Label the persona/trade split as illustrative where needed.
- [ ] Any tariff rate, HS applicability, legal instrument, effective date or program deadline presented as fact must be real and sourced from TariffCompass data.
- [ ] Clearly distinguish estimated/planning exposure from a final customs-duty determination.
- [ ] Never fabricate a dramatic tariff event for storytelling purposes.

## Reuse after validation

- [ ] Once the web story converts well in founder demos, reuse the same narrative for a concise sales deck.
- [ ] Only after the product flow and narrative stabilize, record a **60–120 second video** using the proven story.
- [ ] Preserve the story as a future reusable asset for customer onboarding, advisor demos, public presentations and potential investor/crowdfunding materials.

**Launch bar:** a prospect should finish the walkthrough understanding **“TariffCompass watches my products and markets, tells me what changed, shows what it could cost me, proves where the information came from, and helps me decide what to investigate next — that is why it costs C$99/month.”**

---

# Story-driven Advisor flagship demo — founding validation

Use [`ADVISOR_DEMO_STORYBOARD.md`](ADVISOR_DEMO_STORYBOARD.md) as the canonical Advisor narrative and product-demo specification.

The flagship Advisor persona is **Sarah**, an illustrative partner at a regional Ontario accounting/advisory firm serving roughly 40 SMEs, of which approximately 12–15 have meaningful cross-border trade exposure.

The core Advisor question is:

> **Which of my clients need attention, and why?**

The Advisor story must make the C$249–250/month value proposition understandable in roughly two minutes without turning TariffCompass into accounting practice-management software.

## Advisor workflow requirements

- [ ] Build a lightweight **multi-client workspace** for the first Advisor validation cohort.
- [ ] Allow Sarah to maintain saved trade exposures for relevant clients: client, product/HS code, direction, origin/destination, annual value and currency.
- [ ] Build a **Client Exposure Radar** showing which monitored clients require attention, what changed, estimated impact, next relevant date and priority.
- [ ] Allow drill-down from portfolio → client → saved exposure → before/after change → source/effective date/confidence.
- [ ] Add an Advisor action queue focused on client conversations and professional follow-up, not CRM tasks.
- [ ] Provide a concise client-ready share/export output containing the sourced change, estimated financial exposure and practical questions/next steps.
- [ ] White-labeling is optional for the first 3 Advisors unless they explicitly require it to pay; portfolio relevance is the primary C$249 value.

## Advisor story requirements

- [ ] Scene 1 — establish Sarah's firm, client count and trade-exposed client subset.
- [ ] Scene 2 — show the pain: tariff headlines do not tell Sarah which clients need a call.
- [ ] Scene 3 — show Sarah's monitored client portfolio and saved exposures.
- [ ] Scene 4 — show the **Client Exposure Radar** with 2–3 clients requiring attention and one clearly prioritized issue.
- [ ] Scene 5 — drill into one client and show what changed, effective date, approximate exposure and official source.
- [ ] Scene 6 — show a client-ready advisory output that supports a proactive conversation without claiming customs/legal advice.
- [ ] Scene 7 — show Sources & Methodology / provenance for professional trust.
- [ ] Scene 8 — close the commercial story: **C$249–250/month buys portfolio-wide relevance and prioritization across Sarah's trade-exposed clients.**

## Advisor demo integrity

- [ ] Sarah and her client portfolio are illustrative unless explicitly stated otherwise.
- [ ] Do not fabricate tariff rates, legal instruments, effective dates or official-source claims.
- [ ] Clearly label illustrative client financial values unless derived from real sourced TariffCompass data.
- [ ] Do not imply TariffCompass or Sarah is providing regulated customs/legal advice outside professional scope.
- [ ] Keep the Advisor demo focused on trade intelligence, financial exposure and client prioritization.

**Advisor validation bar:** an accountant/fractional CFO should finish the walkthrough understanding **“TariffCompass tells me which clients need attention, what may have changed financially, and gives me sourced intelligence to start the right conversation — that is why I would pay C$249/month.”**

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
- [ ] Use the flagship Bob walkthrough as the default narrative for Business demos, adapting the live product/HS example when a prospect's own situation is stronger.
- [ ] Build a focused list of accountants/fractional CFOs with meaningful SME client books for the first **3 Advisor founding customers**.
- [ ] Use the flagship Sarah walkthrough as the default Advisor narrative.
- [ ] Prepare one strong live Business demo using a real product/HS code and approximate annual trade value.
- [ ] Prepare one strong Advisor demo showing portfolio → affected client → sourced financial exposure.
- [ ] Start founder-led Business demos as soon as the six gates are credible.
- [ ] Start Advisor founding-customer demos only when the portfolio radar and client drill-down are credible enough to justify C$249–250/month.
- [ ] Track demo → paid conversion and time-to-payment separately for Business and Advisor.
- [ ] Ask every early Business customer what specific output made C$99 feel trivial, acceptable or too high.
- [ ] Ask every early Advisor what specific portfolio insight made C$249 feel trivial, acceptable or too high.
- [ ] Personally interview early paying customers and capture product, pricing, retention and testimonial insights.

Initial operating objective after launch: **drive to C$2,500 MRR as quickly as possible.**

---

# Launch rules

- Never invent a tariff rate, effective date, legal instrument or program deadline.
- NULL/unknown is preferable to false precision.
- Public tariff history can be free; company/client-specific relevance, financial impact and monitoring are the paid value.
- **Official sources drive tariff determinations; media is supplemental discovery/context only.**
- AI explains structured intelligence; it does not create tariff facts.
- Canada remains the fixed home country for Beta/V1.
- V1 includes French-ready architecture and the complete core Business buying/analysis/monitoring journey in French; full content parity is future work.
- Advisor V1 is limited to what is necessary to prove the first 3 paying Advisor customers: multi-client workspace, Client Exposure Radar, client drill-down, alerts/provenance and client-ready output.
- Do not add institutional, crowdfunding, broad publishing, accounting CRM/practice-management, or deep customs-compliance work to `PENDING.md` unless explicitly promoted from `FUTURE.md`.
- Never force push.
