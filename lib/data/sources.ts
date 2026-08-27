/**
 * Source registry for TariffCompass market data.
 *
 * Every URL here was fetched and confirmed live during the most recent
 * data review (see `lastChecked`) — see the refresh log for verification
 * history. This file is the single place `market-data.ts` and the AI
 * refresh job point to when citing where a figure should be verified.
 */

export type Source = {
  key: string;
  name: string;
  url: string;
  usedFor: string;
  lastChecked: string;
};

export const SOURCES = {
  cbsaTariff: {
    key: "cbsaTariff",
    name: "CBSA Customs Tariff",
    url: "https://www.cbsa-asfc.gc.ca/trade-commerce/tariff-tarif/menu-eng.html",
    usedFor: "Canada's import duty schedule — the authority for tariffs Canada charges on goods entering from any origin.",
    lastChecked: "2026-08-26",
  },
  usHts: {
    key: "usHts",
    name: "U.S. Harmonized Tariff Schedule (USITC)",
    url: "https://hts.usitc.gov/",
    usedFor: "The U.S. tariff schedule — the authority for duty rates on Canadian-origin goods entering the United States.",
    lastChecked: "2026-08-26",
  },
  cusma: {
    key: "cusma",
    name: "Canada–United States–Mexico Agreement (CUSMA)",
    url: "https://www.international.gc.ca/trade-commerce/trade-agreements-accords-commerciaux/agr-acc/cusma-aceum/index.aspx?lang=eng",
    usedFor: "Preferential tariff framework for trade with the U.S. and Mexico.",
    lastChecked: "2026-08-26",
  },
  ceta: {
    key: "ceta",
    name: "Canada–EU Comprehensive Economic and Trade Agreement (CETA)",
    url: "https://www.international.gc.ca/trade-commerce/trade-agreements-accords-commerciaux/agr-acc/ceta-aecg/index.aspx?lang=eng",
    usedFor: "Preferential tariff framework for trade with the European Union.",
    lastChecked: "2026-08-26",
  },
  cptpp: {
    key: "cptpp",
    name: "Comprehensive and Progressive Agreement for Trans-Pacific Partnership (CPTPP)",
    url: "https://www.international.gc.ca/trade-commerce/trade-agreements-accords-commerciaux/agr-acc/cptpp-ptpgp/index.aspx?lang=eng",
    usedFor: "Preferential tariff framework for trade with Japan, Vietnam, Australia, Mexico, and other CPTPP members.",
    lastChecked: "2026-08-26",
  },
  cuktca: {
    key: "cuktca",
    name: "Canada–United Kingdom Trade Continuity Agreement (Canada-UK TCA)",
    url: "https://www.international.gc.ca/trade-commerce/trade-agreements-accords-commerciaux/agr-acc/cuktca-acccru/index.aspx?lang=eng",
    usedFor: "Preferential tariff framework for trade with the United Kingdom.",
    lastChecked: "2026-08-26",
  },
  canadaTradeAgreements: {
    key: "canadaTradeAgreements",
    name: "Government of Canada — Trade and Investment Agreements",
    url: "https://international.canada.ca/en/services/business/trade/agreements-negotiations/investment-agreements",
    usedFor: "Index of Canada's in-force free trade agreements, including bilateral deals such as Canada–Korea (CKFTA).",
    lastChecked: "2026-08-26",
  },
  canexport: {
    key: "canexport",
    name: "CanExport SMEs",
    url: "https://www.tradecommissioner.gc.ca/en/our-solutions/funding-financing-international-business/canexport-smes.html",
    usedFor: "Cost-shared funding for SME export market development.",
    lastChecked: "2026-08-26",
  },
  rtri: {
    key: "rtri",
    name: "Regional Tariff Response Initiative (RTRI)",
    url: "https://ised-isde.canada.ca/site/ised/en/regional-tariff-response-initiative",
    usedFor: "Federal funding for tariff-impacted businesses, delivered through regional development agencies.",
    lastChecked: "2026-08-26",
  },
  cfibTariffTracker: {
    key: "cfibTariffTracker",
    name: "CFIB — Canada-U.S. Tariffs Tracker",
    url: "https://www.cfib-fcei.ca/en/site/us-tariffs",
    usedFor: "Plain-language tracker of current U.S. Section 232/338 tariffs and Canada's counter-tariffs, organized by category and rate.",
    lastChecked: "2026-08-26",
  },
  section338ThomsonReuters: {
    key: "section338ThomsonReuters",
    name: "Thomson Reuters Tax & Accounting — Section 338 tariffs on Canada",
    url: "https://tax.thomsonreuters.com/blog/section-338-tariffs-on-canada-what-businesses-may-be-missing-beyond-the-headline-categories/",
    usedFor: "Detail on Section 338 Annex II product coverage beyond the headline dairy/alcohol/motor-vehicle categories.",
    lastChecked: "2026-08-26",
  },
  edc: {
    key: "edc",
    name: "EDC Trade Impact Program",
    url: "https://www.edc.ca/en/campaign/trade-support-canadian-companies.html",
    usedFor: "Export financing, working capital, and trade credit insurance for exporters affected by tariffs.",
    lastChecked: "2026-08-26",
  },
  bdc: {
    key: "bdc",
    name: "BDC Pivot to Grow Loan",
    url: "https://www.bdc.ca/en/financing/pivot-grow-loan",
    usedFor: "Financing for established exporters adapting operations in response to U.S. tariffs.",
    lastChecked: "2026-08-26",
  },
  edcSteelAluminumTariffs: {
    key: "edcSteelAluminumTariffs",
    name: "EDC — U.S. Steel and Aluminum Tariffs: What Exporters Need to Know",
    url: "https://www.edc.ca/en/article/us-steel-and-aluminum-tariffs.html",
    usedFor: "Export Development Canada's summary of the Section 232 steel/aluminum/copper tariff tiers (10%-50%) and the sub-15%-metal-content de minimis exemption.",
    lastChecked: "2026-08-26",
  },
  dutiableAutoParts232: {
    key: "dutiableAutoParts232",
    name: "Dutiable — Section 232 Covered Auto Parts (2026)",
    url: "https://dutiable.io/blog/section-232-covered-auto-parts-2026-list-explained",
    usedFor: "Explains the Section 232 25% auto-parts tariff and the USMCA rules-of-origin exemption path that keeps most Canada-U.S. auto trade at a low effective rate.",
    lastChecked: "2026-08-26",
  },
  ghyCounterTariffsSept2026: {
    key: "ghyCounterTariffsSept2026",
    name: "GHY — Canada to Impose New Counter-Tariffs on U.S. Goods (Sept 2026)",
    url: "https://www.ghy.com/trade-compliance/canada-counter-tariffs-us-goods-september-2026/",
    usedFor: "Summary of the sectors and duty tiers (15%/25%/50%) in Canada's September 8, 2026 counter-tariff list on U.S. goods.",
    lastChecked: "2026-08-26",
  },
} as const satisfies Record<string, Source>;

export type SourceKey = keyof typeof SOURCES;

/**
 * Government pages and trade-agreement portals attempted this review that
 * could not be confirmed and were deliberately left out of the registry
 * rather than guessed:
 * - www.tariff-tarif.gc.ca (does not resolve — DNS failure)
 * - www.tradecommissioner.gc.ca/en/trade-agreements.html (403 on fetch;
 *   may still be a real page, just not fetchable by this tool)
 * - canada.ca/en/department-finance/news/2026/08/list-of-products-from-
 *   the-united-states-subject-to-counter-tariffs-effective-september-8-2026
 *   (Department of Finance's own counter-tariff list — 403 on fetch both
 *   attempts; likely bot-blocked, not necessarily wrong. This is the
 *   primary source for the Sept 8, 2026 counter-tariffs and should be the
 *   first thing re-checked by a human, or a future refresh with different
 *   fetch access.)
 * - tradecommissioner.gc.ca's US-tariffs FAQ page (403 on fetch) and
 *   ghy.com's Section 338 explainer (404 — URL likely stale) — both cited
 *   by the 2026-08-26 AI refresh run but not independently re-confirmed
 *   here; the CFIB tracker and Thomson Reuters post above were used
 *   instead since they were actually fetchable.
 * Both international.gc.ca and its replacement, international.canada.ca,
 * currently resolve — the former appears to still serve the trade-agreement
 * subpages directly rather than redirecting, so URLs above use it, but a
 * future refresh should re-check whether that migration has completed.
 *
 * 2026-08-26 review (Steel & Metals / Auto parts / Agri-food / Apparel /
 * Machinery / Electronics / Furniture, US export+import rows): every
 * primary government page attempted was blocked from direct fetch —
 * - canada.ca's Sept 8, 2026 counter-tariff list (403, same as the prior
 *   review's attempt above)
 * - federalregister.gov's Section 338 Proclamation 11048 (Motor Vehicle
 *   Annex, https://www.federalregister.gov/documents/2026/07/23/2026-14997/)
 *   and Proclamation 11047 (Dairy Annex, .../2026/07/23/2026-14992/) —
 *   both redirect to an "unblock.federalregister.gov" wall
 * - cbp.gov's Section 232 auto-parts FAQ and congress.gov's CRS report on
 *   Section 232 automotive tariffs — both 403
 * These proclamation numbers, HTS headings (9903.03.13, 9903.03.14), and
 * canada.ca's list are corroborated by multiple independent secondary
 * professional-services sources (see the new entries above) and are the
 * correct citations for a human — or a future refresh with different fetch
 * access — to check directly; no `tariffConfidence` was raised to
 * "official" on the strength of secondary corroboration alone.
 */
