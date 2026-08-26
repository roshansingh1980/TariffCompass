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
} as const satisfies Record<string, Source>;

export type SourceKey = keyof typeof SOURCES;

/**
 * Government pages and trade-agreement portals attempted this review that
 * could not be confirmed and were deliberately left out of the registry
 * rather than guessed:
 * - www.tariff-tarif.gc.ca (does not resolve — DNS failure)
 * - www.tradecommissioner.gc.ca/en/trade-agreements.html (403 on fetch;
 *   may still be a real page, just not fetchable by this tool)
 * Both international.gc.ca and its replacement, international.canada.ca,
 * currently resolve — the former appears to still serve the trade-agreement
 * subpages directly rather than redirecting, so URLs above use it, but a
 * future refresh should re-check whether that migration has completed.
 */
