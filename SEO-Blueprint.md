# TariffCompass — Public Authority & SEO Blueprint

_Last updated: 27 August 2026_

This document is subordinate to [`BUSINESS_PLAN.md`](BUSINESS_PLAN.md). SEO and public publishing exist to support trust, citations, discovery and paid conversion. They are not a separate Phase 1 business and should consume no more than approximately **10–15% of Phase 1 effort**.

## 1. Objective

Make TariffCompass useful enough that Canadian businesses, journalists, lawyers, researchers, consultants, associations, policymakers and politicians can cite or link to its public tariff intelligence.

The commercial boundary is:

> **Public information creates authority. Private relevance creates revenue.**

It is acceptable to publish that a tariff changed, which categories/HS codes are affected at an aggregate level, and the official source. Paid value comes from telling a business or advisor that the change affects **their products or clients** and estimating the financial impact.

---

## 2. Priority search themes

### Core commercial/problem intent

1. Canada tariff calculator
2. Canadian tariff impact tool
3. US tariffs on Canadian goods
4. import tariffs Canada
5. export tariffs Canada
6. HS code tariff lookup Canada
7. Canada US tariff changes
8. Canadian business tariff exposure
9. tariff impact on Canadian small business
10. tariff change alerts Canada

### Import/export decision support

11. Canadian importer tariff exposure
12. Canadian exporter tariff exposure
13. landed cost tariff Canada
14. alternative sourcing countries Canada tariff
15. alternative export markets Canada
16. tariff cost impact calculator business

### Trade measures and agreements

17. Section 232 Canada tariffs
18. Canada counter tariffs
19. Canada surtax imports
20. CUSMA tariff rates
21. CETA tariffs Canada
22. CPTPP tariff Canada
23. tariff remission Canada

### Professional/advisor intent

24. tariff analysis for accountants
25. tariff exposure clients accounting firm
26. trade risk monitoring clients

### Public research/citation intent

27. Canadian sectors affected by tariffs
28. Canada tariff data 2026
29. latest Canada US tariff changes
30. tariff impact by industry Canada

Do not create thin pages merely to capture every keyword variant.

---

## 3. Public page positioning

### Homepage (`/`)

- **Title:** TariffCompass | Canadian Tariff & Trade Impact Intelligence
- **Meta description:** Understand how tariff and trade-policy changes affect Canadian businesses. Analyze import/export exposure, estimate financial impact, and monitor what changes.

### Dashboard (`/dashboard`)

- **Title:** Your Trade Exposure — TariffCompass
- **Meta description:** Review your import/export exposure, estimated financial impact, market options and monitored tariff changes.
- **Indexation:** `noindex, nofollow` because this is personalized/private.

### Login (`/login`)

- **Title:** Log In — TariffCompass
- **Indexation:** `noindex, nofollow`.

### Sign Up (`/signup`)

- **Title:** Sign Up — TariffCompass
- **Indexation:** `noindex, nofollow`.

### About (`/about`)

- **Title:** About TariffCompass | Canadian Trade-Impact Intelligence
- **Meta description:** TariffCompass turns tariffs and trade-policy changes into practical, source-backed intelligence for Canadian businesses and advisors.

### Insights (`/insights`)

- **Title:** Canadian Tariff & Trade Insights — TariffCompass
- **Meta description:** Short, data-driven analysis of Canadian tariff exposure, trade-policy changes, import/export risk and market responses.

### Updates (`/updates`)

- **Title:** Tariff & Trade Policy Updates — TariffCompass
- **Meta description:** Dated, source-backed updates to tariff and trade-policy information relevant to Canadian businesses.

### Sources (`/sources`)

- **Title:** TariffCompass Data Sources & Methodology
- **Meta description:** Review the official and supporting sources, update dates and methodology used by TariffCompass.

---

## 4. Public content standard

Every substantive public article/update should be:

- short enough to maintain;
- dated;
- source-linked;
- quantitative where possible;
- explicit about methodology;
- explicit about estimated/unknown values;
- corrected transparently when necessary; and
- written so a journalist, lawyer, policymaker or business owner can cite the underlying fact without relying on marketing language.

Where possible include a compact **Data / Methodology** box:

- source(s);
- data as-of date;
- affected HS codes/categories;
- assumptions;
- confidence/limitations; and
- suggested citation format.

Avoid unsourced opinion pieces, generic AI-written explainers and claims of exact aggregate economic impact unless the methodology supports them.

---

## 5. Beta-1 public content set

Build/publish only enough to establish usefulness and credibility.

### Insight 1 — current U.S. tariff action

**Working title:** What the Latest U.S. Tariff Change Means for Canadian Businesses

Include:

- what changed;
- effective date;
- affected product groups/HS codes where known;
- before/after treatment;
- representative financial-impact example; and
- official source.

### Insight 2 — importer impact

**Working title:** Which Canadian Imports Are Most Exposed to Current Counter-Tariffs?

Include:

- affected groups;
- applicable rates/measures;
- source and effective date;
- representative landed-cost effect; and
- limitations.

### Insight 3 — exporter impact

**Working title:** Which Canadian Export Sectors Face the Highest Current U.S. Tariff Risk?

Only rank sectors if the data supports a defensible methodology. Otherwise frame as “selected high-exposure sectors” rather than false precision.

### Insight 4 — practical calculation

**Working title:** How to Estimate Your Business’s Tariff Exposure

Use the same logic as the product and link into the free analysis workflow.

### Insight 5 — trade-policy timeline

**Working title:** Canada–U.S. Tariff Timeline: What Changed and When

Make this primarily structured/date-driven rather than editorial.

After these, publish only when there is a material new trade development or a strong search/citation opportunity.

---

## 6. Public data surfaces

Prefer reusable pages/components generated from the structured data layer rather than manually maintained prose.

Useful Phase 1 public surfaces may include:

- direction × market tariff summaries;
- selected category/HS exposure tables;
- tariff change timeline;
- key effective dates;
- source registry; and
- methodology/explanation pages.

Do not create hundreds of thin category × market pages solely for SEO.

---

## 7. Citation design

Where feasible, public research pages should show:

- article/data title;
- publication/update date;
- data-as-of date;
- official source links;
- author/publisher: TariffCompass;
- stable canonical URL; and
- a small suggested citation string.

Example:

> TariffCompass, “Canada–U.S. Tariff Timeline,” data as of 27 August 2026, tariffcompass.ca/…

The goal is to make citation friction low without pretending TariffCompass is the legal authority. Official instruments remain the primary legal sources.

---

## 8. Technical indexation requirements

1. Use Next.js metadata or `generateMetadata` on all public routes.
2. `noindex, nofollow` authenticated/transactional routes where appropriate.
3. `robots.txt` should allow public research/content and disallow private/API surfaces.
4. `sitemap.xml` should derive public URLs from the actual content/data layer.
5. Add canonical URLs to public pages.
6. Add Open Graph/Twitter metadata for public research pages.
7. Add `Organization` schema and `Article`/`Dataset` schema only where the page genuinely qualifies.
8. Verify Google Search Console and Bing Webmaster Tools when Cloudflare Access is lifted.
9. Submit sitemap after public launch.
10. Track crawl/indexation errors, but do not spend meaningful engineering time chasing low-value SEO warnings before revenue.

---

## 9. Metrics

Secondary until the initial C$2,500 MRR milestone:

- organic qualified visits;
- citations/backlinks;
- media/newsletter mentions;
- clicks from public insight → analysis/signup;
- branded search growth; and
- source/methodology page engagement.

Do not optimize for raw page views if they do not create trust, citations or commercial discovery.

---

## 10. Explicitly deferred

Until after the initial C$2,500 MRR milestone unless a clear opportunity appears:

- newsroom workflow;
- journalist dashboard;
- politician/policy dashboard;
- large editorial calendar;
- daily publishing operation;
- broad-topic trade-news coverage;
- custom public research portal; and
- expensive proprietary datasets purchased solely for content marketing.
