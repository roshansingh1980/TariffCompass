# TariffCompass — Advisor Demo Storyboard

_Last updated: 28 August 2026_

This document is the canonical story-driven demo specification for the TariffCompass Advisor plan.

The flagship Advisor persona is **Sarah**, an illustrative partner at a regional Ontario accounting/advisory firm serving Canadian SMEs. The story must make the **C$249–250/month** value proposition understandable in roughly two minutes.

The Advisor story is structurally different from the Business/Bob story:

- Bob asks: **What changed and what does it cost my business?**
- Sarah asks: **Which of my clients need attention, and why?**

The Advisor product should therefore be built around portfolio-level relevance, not simply a larger version of the Business dashboard.

---

# Persona

## Sarah — Partner, regional accounting/advisory firm

Illustrative profile:

- Based in Ontario
- Advises roughly 40 SME clients
- Around 12–15 have material import/export exposure
- Provides recurring accounting, forecasting, cash-flow, budgeting and advisory support
- Is **not** a customs broker and should not be positioned as one
- Wants to know which clients may be financially affected by tariff/trade-policy changes before those clients call her in a panic

Sarah's recurring problem is not lack of information. It is lack of **portfolio relevance**.

She may see a tariff headline, but she does not immediately know:

- which clients are affected
- which products/HS codes are implicated
- whether the measure is already effective or merely announced
- how large the financial exposure may be
- which client conversations should happen first
- when a customs broker, lawyer, lender or other specialist should be brought in

TariffCompass Advisor should turn that uncertainty into a prioritized client action queue.

---

# Core Advisor promise

> **TariffCompass tells Sarah which of her clients need attention, what changed, what the approximate financial impact is, and where the underlying information came from.**

The product does not replace Sarah's professional judgment and does not turn her into a customs broker. It gives her trade intelligence that strengthens the advisory work she already performs.

---

# Two-minute story

## Scene 1 — Meet Sarah

Headline:

> **Sarah advises 40 Canadian businesses. She cannot manually monitor trade-policy risk for every client.**

Show:

- 40 total clients
- 14 trade-exposed clients
- industries such as auto parts, food, machinery, retail/distribution
- recurring advisory responsibilities: forecasting, margin review, financing, management planning

Narrative:

A trade-policy announcement can affect several clients at once, but the article itself does not tell Sarah which clients need a call.

---

## Scene 2 — The problem

Headline:

> **Sarah does not need another tariff newsletter. She needs to know which clients are affected.**

Without TariffCompass, Sarah or her staff may need to:

- read government announcements and news
- identify the operative legal/administrative source
- determine relevant HS/product coverage
- connect that change to client imports/exports
- estimate financial impact
- decide which clients warrant attention

That is repetitive research across multiple clients.

---

## Scene 3 — Sarah's client portfolio in TariffCompass

Show the Advisor intake / portfolio concept.

Each trade-exposed client can have saved exposures such as:

- client name
- product / HS code
- import/export direction
- origin/destination market
- approximate annual trade value
- currency

Example client set:

1. **ABC Manufacturing** — auto parts exports to U.S.
2. **Coastal Foods** — food imports into Canada
3. **Northstar Equipment** — machinery imports and U.S. exports

The portfolio does not need every accounting client. Sarah adds only the clients for whom trade exposure is relevant.

---

## Scene 4 — Client Exposure Radar

This is the core Advisor “wow” screen.

Headline:

> **Which of my clients need me today?**

Illustrative dashboard summary:

- 40 total clients
- 14 trade-exposed clients monitored
- 3 clients requiring attention
- 1 new material trade-policy change this week
- C$680,000 estimated aggregate exposure across affected client profiles

Example table:

| Client | Exposure | Change | Estimated impact | Priority |
| --- | --- | --- | ---: | --- |
| ABC Manufacturing | Auto parts / U.S. export | Relevant tariff change | C$285,000 | High |
| Coastal Foods | Food / Canada import | New or amended measure | C$74,000 | High |
| Northstar Equipment | Machinery | Review/effective date approaching | — | Watch |

All numbers used in an actual demo must be either clearly illustrative or derived from real, sourced TariffCompass data.

The core value is prioritization: Sarah immediately knows where to spend advisory time.

---

## Scene 5 — Drill into one client

Sarah clicks **ABC Manufacturing**.

Show:

- saved product / HS code
- trade route
- annual value
- previous treatment
- current treatment
- effective date
- estimated annual exposure
- source / legal instrument
- confidence / review status

Narrative:

Sarah can now understand the issue before contacting the client.

The screen should answer:

> **What changed, which client exposure is affected, approximately how much money is involved, and what source supports the result?**

---

## Scene 6 — Client-ready advisory output

Sarah should be able to produce a concise client-ready output summarizing:

- what changed
- effective date
- affected product/trade route
- approximate financial exposure
- official source(s)
- practical questions/next steps
- clear statement that customs classification/rate treatment should be confirmed with the appropriate specialist where required

The initial version may be a shareable/exportable TariffCompass report. White-labeling can be included if it is required to make the Advisor price defensible, but the product should not overbuild document design before the portfolio radar itself is valuable.

The message to the client is not:

> “TariffCompass has given us customs advice.”

It is:

> “We identified a trade-policy change that may materially affect your forecast/margins. Here is the sourced exposure analysis and what we should investigate next.”

---

## Scene 7 — Sources & Methodology

Sarah can inspect the same provenance system used in the Business product.

Show:

**Official source → trade measure → HS/product applicability → effective date → confidence → client exposure match → Advisor alert/report**

This matters particularly for professional users because Sarah may need to explain where the information came from internally or to a client.

The Advisor product should preserve source, effective date, retrieval/review date and confidence at client-level output.

---

## Scene 8 — Why Sarah pays C$249–250/month

Headline:

> **One proactive client conversation can justify the subscription.**

If Sarah monitors 15 trade-exposed clients, C$249/month is roughly C$16.60 per monitored client per month.

The Advisor value is:

- portfolio-wide monitoring
- prioritized client exposure radar
- client-level financial impact
- authoritative provenance
- proactive advisory opportunities
- less repeated research across clients
- client-ready outputs

Closing message:

> **TariffCompass helps Sarah know which clients need attention before tariff uncertainty turns into a surprise.**

CTA:

**Monitor your trade-exposed client portfolio — C$249/month**

Founding offer, if active:

**First 3 Advisor customers: 50% off for the first 12 months, then standard pricing.**

---

# Advisor dashboard product implications

The Advisor dashboard should not be a cloned Business dashboard with more saved profiles.

It should be organized around a **client portfolio**.

## Top summary

Prioritize:

- total clients
- trade-exposed clients monitored
- clients requiring attention
- new material changes
- estimated aggregate exposure across affected clients

## Client Exposure Radar

Primary list/table should show:

- client
- highest-priority saved exposure
- current risk/attention status
- recent change
- estimated impact
- next relevant date
- last reviewed / source confidence

## Client detail

Each client can contain multiple saved trade exposures, each with:

- product / HS code
- direction
- origin/destination
- annual trade value
- current treatment
- before/after history
- alerts
- upcoming dates
- sources/provenance
- response intelligence

## Action queue

A professional user needs a short queue such as:

- Call client
- Review pricing/margin forecast
- Confirm classification/treatment with customs broker
- Review sourcing/destination alternative
- Review financing/cash-flow implication
- Monitor upcoming effective/review date

Do not turn this into a full practice-management/CRM system before the Advisor product proves demand.

---

# What makes C$249 defensible

The Advisor tier is not priced because it contains more software buttons.

It is priced because one account can monitor many client businesses and generate multiple advisory opportunities.

The minimum defensible Advisor feature set is:

1. Multi-client workspace
2. Client Exposure Radar / portfolio prioritization
3. Multiple saved exposures per relevant client
4. Client-level alerts and before/after change intelligence
5. Financial exposure estimates
6. Source provenance and methodology
7. Client-ready report/share output

Potential additions such as seats, white-labeling, bulk import, APIs and institutional analytics should not delay the first Advisor validation unless early accountants explicitly require them to pay.

---

# Demo integrity rules

- Sarah and the client portfolio are illustrative personas unless explicitly presented otherwise.
- Do not fabricate tariff rates, legal instruments, effective dates or official-source claims.
- Illustrative client financial values must be clearly labelled illustrative unless generated from real sourced product data.
- Do not imply TariffCompass or the accountant provides regulated customs/legal advice.
- The demo should make the professional-advice boundary explicit without undermining usefulness.
- Official sources drive tariff determinations; news/media remain supplemental discovery/context.

---

# Delivery formats

Use the same progression as the Business/Bob demo:

1. **Scrollable web story / guided Advisor walkthrough**
2. Reusable founder-led sales deck
3. Only after narrative/product stabilization, a concise 60–120 second video

Do not create multiple accountant personas before Sarah's story is tested with real prospects.

---

# Success test

The Advisor story works if an accountant/fractional CFO can finish it and say:

> **“I can see why I would pay C$249/month: instead of reacting to tariff headlines client by client, TariffCompass tells me which clients need attention, what may have changed financially, and gives me sourced intelligence to start the conversation.”**

The commercial test is still willingness to pay and retain, not whether prospects say the demo is interesting.
