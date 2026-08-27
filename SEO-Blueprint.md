# TariffCompass — SEO Blueprint

> Note: this blueprint was drafted fresh for this request. No prior SEO
> planning session exists in this project's history, so nothing here should
> be read as "content we already agreed on" — it's a first draft based on
> the product as built (onboarding flow, market comparison, real government
> programs, AI diversification brief) and is meant to be reviewed and
> revised before use.

---

## 1. Target Keywords (26)

**Core problem / commercial intent**
1. Canada tariff calculator
2. tariff impact assessment tool
3. US tariffs on Canadian goods
4. Canada US trade war impact
5. import tariff Canada calculator
6. HS code tariff lookup Canada

**Diversification / strategy**
7. export market diversification Canada
8. how to diversify export markets
9. alternative export markets for Canadian exporters
10. trade diversification strategy small business
11. export to Europe from Canada
12. export to Japan from Canada
13. ease of doing business by country

**Audience**
14. Canadian small business tariffs
15. Canadian businesses affected by tariffs
16. Canadian SME funding readiness

**Sector-specific**
17. steel tariff Canada exporters
18. agri-food export tariffs Canada
19. auto parts tariff Canada

**Trade agreements**
20. CUSMA tariff rates
21. Canadian export markets 2026

**Government funding programs**
22. tariff relief programs Canada
23. government funding for exporters Canada
24. CanExport SMEs
25. Regional Tariff Response Initiative
26. EDC Trade Impact Program

---

## 2. Page Titles & Meta Descriptions

### Homepage (`/`)
- **Title:** TariffCompass | Canadian Export Tariff & Market Diversification Tool
- **Meta description:** Compare markets, understand tariff exposure, and find Canadian government support in minutes. TariffCompass helps Canadian businesses navigate tariffs with confidence.

### Dashboard (`/dashboard`)
- **Title:** Your Dashboard — TariffCompass
- **Meta description:** Review your market comparison, tariff exposure, and personalized diversification brief.
- **Indexation note:** this route is behind authentication and shows personalized data — set `robots: noindex, nofollow` rather than optimizing it for search.

### Login (`/login`)
- **Title:** Log In — TariffCompass
- **Meta description:** Log in to your TariffCompass account to access your market comparison and diversification brief.

### Sign Up (`/signup`)
- **Title:** Sign Up — TariffCompass | Navigate Tariffs with Confidence
- **Meta description:** Create a free TariffCompass account to compare export and import markets, assess tariff exposure, and find funding support for your Canadian business.

### About (`/about` — built)
- **Title:** About TariffCompass — Helping Canadian Businesses Navigate Tariffs
- **Meta description:** Learn how TariffCompass helps Canadian small and medium-sized businesses assess tariff exposure, diversify markets, and access government support.

---

## 3. First 5 Insights Posts

### Post 1
- **Title:** How U.S. Tariffs Are Affecting Canadian Small Businesses in 2026
- **Meta description:** A clear breakdown of how current U.S. tariffs are impacting Canadian exporters by sector, and what small businesses can do to respond.
- **H1:** How U.S. Tariffs Are Affecting Canadian Small Businesses in 2026
- **H2s:**
  - Which Sectors Are Most Exposed
  - Steel, Aluminum, and Auto Parts Under Pressure
  - What This Means for Small and Medium-Sized Exporters
  - Practical Steps to Reduce Your Exposure

### Post 2
- **Title:** 5 Alternative Export Markets for Canadian Businesses Beyond the U.S.
- **Meta description:** Explore five promising export markets — from the EU to Japan — for Canadian businesses looking to reduce reliance on the U.S. market.
- **H1:** 5 Alternative Export Markets for Canadian Businesses Beyond the U.S.
- **H2s:**
  - Why Market Diversification Matters Now
  - European Union: Tariff-Free Access Under CETA
  - United Kingdom: A Familiar Regulatory Environment
  - Japan and CPTPP: Low Tariffs, High Standards
  - Australia: An Underrated Opportunity

### Post 3
- **Title:** A Complete Guide to Canadian Government Tariff Relief Programs
- **Meta description:** Everything Canadian businesses need to know about RTRI, CanExport, BDC Pivot to Grow, and the EDC Trade Impact Program.
- **H1:** A Complete Guide to Canadian Government Tariff Relief Programs
- **H2s:**
  - Regional Tariff Response Initiative (RTRI)
  - CanExport SMEs: Funding for Market Expansion
  - BDC Pivot to Grow Loan
  - EDC Trade Impact Program
  - How to Know Which Program Fits Your Business

### Post 4
- **Title:** How to Calculate Your Business's Tariff Exposure (Step-by-Step)
- **Meta description:** Learn how to assess your tariff exposure by product category, market, and trade direction — and why it matters for your bottom line.
- **H1:** How to Calculate Your Business's Tariff Exposure (Step-by-Step)
- **H2s:**
  - Start With Your HS Code and Product Category
  - Understand Export vs. Import Tariff Exposure
  - Factor in Ease of Doing Business and Friction Costs
  - Using Data to Make a Diversification Decision

### Post 5
- **Title:** Export vs. Import: Understanding Your Business's Tariff Risk Profile
- **Meta description:** Whether you export to the U.S. or import from abroad, tariffs affect your business differently. Here's how to think about your risk profile.
- **H1:** Export vs. Import: Understanding Your Business's Tariff Risk Profile
- **H2s:**
  - Why Direction of Trade Changes Your Risk
  - Export Risk: Losing Access to Your Biggest Market
  - Import Risk: Rising Costs on Sourced Goods
  - Building a Resilient Trade Strategy for Either Direction

---

## 4. Indexation Setup Steps

1. **Per-page metadata** — use Next.js App Router's `metadata` export (or `generateMetadata`) on every public route (`/`, `/about`, `/insights`, `/insights/[slug]`) with the titles/descriptions above.
2. **Noindex authenticated routes** — set `robots: { index: false, follow: false }` on `/dashboard`, `/login`, and `/signup` metadata so personalized or transactional pages don't compete for search rankings.
3. **`robots.txt`** — allow crawling of `/`, `/about`, `/insights/*`; disallow `/dashboard` and any future API routes.
4. **`sitemap.xml`** — add `app/sitemap.ts` listing all public marketing and insights URLs (exclude authenticated routes); regenerate automatically as insights posts are added.
5. **Canonical URLs** — set a canonical `<link>` on every public page to avoid duplicate-content issues from query params or trailing slashes.
6. **Open Graph & Twitter meta tags** — add `og:title`, `og:description`, `og:image`, and `twitter:card` to the homepage, About page, and each insights post for clean social-share previews.
7. **Structured data** — add `Organization` schema on the homepage and `Article` schema on each insights post for richer search results.
8. **Search Console verification** — verify the domain in Google Search Console (DNS TXT record) and Bing Webmaster Tools once the production domain is live.
9. **Submit the sitemap** — submit `sitemap.xml` in both Search Console and Bing Webmaster Tools after verification.
10. **Monitor post-launch** — check Search Console weekly for crawl errors, indexation coverage, and any pages flagged as "discovered but not indexed."
