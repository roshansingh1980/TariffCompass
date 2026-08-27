/**
 * Structured market comparison data for the Results screen and AI Brief.
 *
 * This is a v1 maintainable dataset, not a full official tariff database.
 * Every tariff figure below was authored from general trade-policy knowledge
 * (FTA coverage, known Section 232-style measures, Canada's supply-managed
 * tariff-rate quotas) — none were fetched from a live, line-item government
 * source this review, so every rate is marked `tariffConfidence: "estimated"`
 * except the deliberately unresolved defaults, marked "unknown". Nothing
 * here should be labeled "official" until it has actually been checked
 * against the source it cites — see `sources.ts` and `refresh-log.ts`.
 *
 * Authoring shape: each product category defines one profile per market per
 * trade direction. `flattenMarketData()` below expands that into the fully
 * structured `MarketDataRow[]` the rest of the app consumes, deriving the
 * source citation from the market + direction (Canada's own CBSA tariff for
 * imports, the relevant FTA/HTS page for exports) so it isn't repeated by
 * hand on every cell.
 */

import { SOURCES, type SourceKey } from "@/lib/data/sources";

export type TariffConfidence = "official" | "estimated" | "unknown";
export type CostFriction = "Low" | "Medium" | "High";
export type Attractiveness = "Excellent" | "Good" | "Fair" | "Challenging";
export type TradeDirection = "export" | "import";

export type Market = {
  key: string;
  name: string;
  /** Ease of doing business, out of 10. A market-level property, constant across categories/direction. */
  easeOfBusiness: number;
};

/** As authored per category/direction/market — see flattenMarketData for the derived, fully-sourced row. */
type MarketProfile = {
  tariffRate: string;
  tariffConfidence: TariffConfidence;
  costFriction: CostFriction;
  attractiveness: Attractiveness;
  /** Short, specific reason for this figure — shown in the UI as a rationale tooltip/line. */
  rationale: string;
  /**
   * Per-cell overrides — used when a specific, dated event (a tariff action,
   * not the general FTA/MFN baseline) drives this figure, so the citation
   * and date need to point at that event rather than the category default.
   */
  sourceName?: string;
  sourceUrl?: string;
  lastUpdated?: string;
};

export type MarketDataRow = {
  market: Market;
  direction: TradeDirection;
  category: string;
  tariffRate: string;
  tariffConfidence: TariffConfidence;
  costFriction: CostFriction;
  attractiveness: Attractiveness;
  rationale: string;
  sourceName: string;
  sourceUrl: string;
  lastUpdated: string;
};

/** Kept for existing call sites that only need the profile, not the full sourced row. */
export type MarketComparisonRow = {
  market: Market;
  profile: Pick<MarketDataRow, "tariffRate" | "costFriction" | "attractiveness">;
};

const EASE_OF_BUSINESS: Record<string, number> = {
  us: 8.4,
  eu: 7.6,
  uk: 7.9,
  japan: 7.2,
  mexico: 6.8,
  "south-korea": 7.8,
  vietnam: 6.2,
  australia: 8.1,
};

function market(key: keyof typeof EASE_OF_BUSINESS, name: string): Market {
  return { key, name, easeOfBusiness: EASE_OF_BUSINESS[key] };
}

const US = market("us", "United States");
const EU = market("eu", "European Union");
const UK = market("uk", "United Kingdom");
const JAPAN = market("japan", "Japan");
const MEXICO = market("mexico", "Mexico");
const SOUTH_KOREA = market("south-korea", "South Korea");
const VIETNAM = market("vietnam", "Vietnam");
const AUSTRALIA = market("australia", "Australia");

/** CPTPP members among our fifth-market options — used to pick the right export source. */
const CPTPP_MARKET_KEYS = new Set(["japan", "mexico", "vietnam", "australia"]);

function sourceFor(marketKey: string, direction: TradeDirection): SourceKey {
  if (direction === "import") return "cbsaTariff";
  if (marketKey === "us") return "usHts";
  if (marketKey === "eu") return "ceta";
  if (marketKey === "uk") return "cuktca";
  if (CPTPP_MARKET_KEYS.has(marketKey)) return "cptpp";
  return "canadaTradeAgreements"; // e.g. South Korea via CKFTA
}

type DirectionProfiles = {
  us: MarketProfile;
  eu: MarketProfile;
  uk: MarketProfile;
  japan: MarketProfile;
  fifth: MarketProfile;
};

type CategoryData = {
  /** The 5th comparison market, chosen per category for relevance (e.g. Mexico for auto supply chains). */
  fifthMarket: Market;
  /** Selling into each market: the tariff/friction the destination imposes on Canadian-origin goods. */
  export: DirectionProfiles;
  /** Sourcing from each market: the duty/friction Canada applies on goods imported from it. */
  import: DirectionProfiles;
  /** When this category's figures were last authored/reviewed. */
  lastUpdated: string;
};

const UNKNOWN_PROFILE: MarketProfile = {
  tariffRate: "Unknown",
  tariffConfidence: "unknown",
  costFriction: "Medium",
  attractiveness: "Fair",
  rationale: "No category-specific figure authored yet for this product type — treat as unresolved, not zero.",
};

const DEFAULT_CATEGORY: CategoryData = {
  fifthMarket: MEXICO,
  export: {
    us: UNKNOWN_PROFILE,
    eu: UNKNOWN_PROFILE,
    uk: UNKNOWN_PROFILE,
    japan: UNKNOWN_PROFILE,
    fifth: UNKNOWN_PROFILE,
  },
  import: {
    us: UNKNOWN_PROFILE,
    eu: UNKNOWN_PROFILE,
    uk: UNKNOWN_PROFILE,
    japan: UNKNOWN_PROFILE,
    fifth: UNKNOWN_PROFILE,
  },
  lastUpdated: "2026-08-26",
};

const CATEGORY_DATA: Record<string, CategoryData> = {
  "Auto parts": {
    fifthMarket: MEXICO,
    lastUpdated: "2026-08-26",
    export: {
      us: {
        tariffRate: "0–25%",
        tariffConfidence: "estimated",
        costFriction: "Medium",
        attractiveness: "Good",
        rationale: "Auto parts are covered by Section 232 (25% ad valorem), not Section 338 — the August 2026 Section 338 \"Motor Vehicle\" proclamation (its Annex is named for the sector but its HTS list is mostly agricultural/consumer goods) explicitly excludes finished vehicles and auto parts, which remain under the older, separate Section 232 regime. Parts that meet USMCA rules of origin and are self-certified enter free of the 25%; non-qualifying content pays the full 25%. As of early 2026 roughly 85% of Canada–U.S. auto-sector trade claimed the USMCA exemption, producing a low blended effective rate — confirm your specific part's qualification status.",
        sourceName: "Dutiable — Section 232 Covered Auto Parts (2026)",
        sourceUrl: "https://dutiable.io/blog/section-232-covered-auto-parts-2026-list-explained",
        lastUpdated: "2026-08-26",
      },
      eu: {
        tariffRate: "4.0%",
        tariffConfidence: "estimated",
        costFriction: "Medium",
        attractiveness: "Good",
        rationale: "CETA reduces most auto parts tariffs; figure reflects goods not fully meeting rules of origin.",
      },
      uk: {
        tariffRate: "2.0%",
        tariffConfidence: "estimated",
        costFriction: "Medium",
        attractiveness: "Good",
        rationale: "Canada-UK TCA carries over CETA-level treatment for most auto parts.",
      },
      japan: {
        tariffRate: "0%",
        tariffConfidence: "estimated",
        costFriction: "High",
        attractiveness: "Fair",
        rationale: "CPTPP eliminates tariffs on originating auto parts; friction reflects Japan's own qualification standards.",
      },
      fifth: {
        tariffRate: "0%",
        tariffConfidence: "estimated",
        costFriction: "Low",
        attractiveness: "Excellent",
        rationale: "CUSMA eliminates tariffs on originating auto parts moving within North America.",
      },
    },
    import: {
      us: {
        tariffRate: "0% (CUSMA)",
        tariffConfidence: "estimated",
        costFriction: "Low",
        attractiveness: "Excellent",
        rationale: "Duty-free for CUSMA-originating auto parts; non-qualifying goods face the MFN rate instead.",
      },
      eu: {
        tariffRate: "0% (CETA)",
        tariffConfidence: "estimated",
        costFriction: "Medium",
        attractiveness: "Good",
        rationale: "Duty-free for CETA-originating auto parts meeting rules of origin.",
      },
      uk: {
        tariffRate: "0% (CUKTCA)",
        tariffConfidence: "estimated",
        costFriction: "Medium",
        attractiveness: "Good",
        rationale: "Duty-free for CUKTCA-originating auto parts.",
      },
      japan: {
        tariffRate: "0% (CPTPP)",
        tariffConfidence: "estimated",
        costFriction: "Medium",
        attractiveness: "Good",
        rationale: "Duty-free for CPTPP-originating auto parts.",
      },
      fifth: {
        tariffRate: "0% (CUSMA)",
        tariffConfidence: "estimated",
        costFriction: "Low",
        attractiveness: "Excellent",
        rationale: "Duty-free for CUSMA-originating auto parts from Mexico.",
      },
    },
  },

  Electronics: {
    fifthMarket: SOUTH_KOREA,
    lastUpdated: "2026-08-26",
    export: {
      us: {
        tariffRate: "50%",
        tariffConfidence: "estimated",
        costFriction: "High",
        attractiveness: "Challenging",
        rationale: "Electrical equipment, telecommunications equipment, and printed circuit boards are named in Proclamation 11048's Motor Vehicle Annex (HTS 9903.03.14) — despite its name, the broadest of the three August 2026 Section 338 proclamations — at a flat 50% duty, on top of the prior near-zero MFN/ITA-style rate. Confirm your specific HS line against the published annex.",
        sourceName: "CFIB — Canada-U.S. Tariffs Tracker",
        sourceUrl: "https://www.cfib-fcei.ca/en/site/us-tariffs",
        lastUpdated: "2026-08-26",
      },
      eu: {
        tariffRate: "3.7%",
        tariffConfidence: "estimated",
        costFriction: "Medium",
        attractiveness: "Good",
        rationale: "CETA reduces most electronics tariffs; figure reflects goods not fully meeting rules of origin.",
      },
      uk: {
        tariffRate: "2.5%",
        tariffConfidence: "estimated",
        costFriction: "Medium",
        attractiveness: "Good",
        rationale: "Canada-UK TCA carries over CETA-level treatment for most electronics.",
      },
      japan: {
        tariffRate: "0%",
        tariffConfidence: "estimated",
        costFriction: "Medium",
        attractiveness: "Good",
        rationale: "CPTPP eliminates tariffs on most originating electronics.",
      },
      fifth: {
        tariffRate: "0% (CKFTA)",
        tariffConfidence: "estimated",
        costFriction: "Medium",
        attractiveness: "Good",
        rationale: "Canada–Korea FTA eliminates tariffs on most originating electronics.",
      },
    },
    import: {
      us: {
        tariffRate: "15–50%",
        tariffConfidence: "estimated",
        costFriction: "Medium",
        attractiveness: "Fair",
        rationale: "Electronics is confirmed as one of the sectors named in Canada's September 8, 2026 counter-tariff list on U.S. goods, which sets three duty tiers (15%, 25%, 50%) by specific tariff item — do not assume the prior 0% still holds. Which tier applies to a given HS line has not been independently confirmed this review; treat the full range as the caution band until checked against the official tariff-item list.",
        sourceName: "GHY — Canada to Impose New Counter-Tariffs on U.S. Goods (Sept 2026)",
        sourceUrl: "https://www.ghy.com/trade-compliance/canada-counter-tariffs-us-goods-september-2026/",
        lastUpdated: "2026-08-26",
      },
      eu: {
        tariffRate: "0%",
        tariffConfidence: "estimated",
        costFriction: "Medium",
        attractiveness: "Good",
        rationale: "Most electronics import duty-free into Canada.",
      },
      uk: {
        tariffRate: "0%",
        tariffConfidence: "estimated",
        costFriction: "Medium",
        attractiveness: "Good",
        rationale: "Most electronics import duty-free into Canada.",
      },
      japan: {
        tariffRate: "0%",
        tariffConfidence: "estimated",
        costFriction: "Low",
        attractiveness: "Excellent",
        rationale: "Most electronics import duty-free into Canada.",
      },
      fifth: {
        tariffRate: "0% (CKFTA)",
        tariffConfidence: "estimated",
        costFriction: "Low",
        attractiveness: "Excellent",
        rationale: "Most electronics import duty-free into Canada.",
      },
    },
  },

  Furniture: {
    fifthMarket: MEXICO,
    lastUpdated: "2026-08-26",
    export: {
      us: {
        tariffRate: "50%",
        tariffConfidence: "estimated",
        costFriction: "High",
        attractiveness: "Challenging",
        rationale: "Furniture is named in Proclamation 11048's Motor Vehicle Annex (HTS 9903.03.14) — despite its name, the broadest of the three August 2026 Section 338 proclamations, reaching many non-vehicle goods — at a flat 50% duty, with no CUSMA exemption. A sharp jump from the prior near-zero MFN treatment.",
        sourceName: "Thomson Reuters Tax & Accounting — Section 338 tariffs on Canada",
        sourceUrl: "https://tax.thomsonreuters.com/blog/section-338-tariffs-on-canada-what-businesses-may-be-missing-beyond-the-headline-categories/",
        lastUpdated: "2026-08-26",
      },
      eu: {
        tariffRate: "2.7%",
        tariffConfidence: "estimated",
        costFriction: "Medium",
        attractiveness: "Good",
        rationale: "CETA reduces most furniture tariffs; figure reflects goods not fully meeting rules of origin.",
      },
      uk: {
        tariffRate: "0–2%",
        tariffConfidence: "estimated",
        costFriction: "Medium",
        attractiveness: "Good",
        rationale: "Canada-UK TCA carries over CETA-level treatment for most furniture.",
      },
      japan: {
        tariffRate: "0%",
        tariffConfidence: "estimated",
        costFriction: "High",
        attractiveness: "Fair",
        rationale: "CPTPP eliminates tariffs on originating furniture; friction reflects packaging/logistics distance.",
      },
      fifth: {
        tariffRate: "0%",
        tariffConfidence: "estimated",
        costFriction: "Medium",
        attractiveness: "Good",
        rationale: "CUSMA eliminates tariffs on originating furniture.",
      },
    },
    import: {
      us: {
        tariffRate: "0%",
        tariffConfidence: "estimated",
        costFriction: "Low",
        attractiveness: "Excellent",
        rationale: "Most furniture imports duty-free under CUSMA/MFN treatment.",
      },
      eu: {
        tariffRate: "0%",
        tariffConfidence: "estimated",
        costFriction: "Medium",
        attractiveness: "Good",
        rationale: "Most furniture imports duty-free under CETA.",
      },
      uk: {
        tariffRate: "0%",
        tariffConfidence: "estimated",
        costFriction: "Medium",
        attractiveness: "Good",
        rationale: "Most furniture imports duty-free under CUKTCA.",
      },
      japan: {
        tariffRate: "0%",
        tariffConfidence: "estimated",
        costFriction: "High",
        attractiveness: "Fair",
        rationale: "Most furniture imports duty-free under CPTPP.",
      },
      fifth: {
        tariffRate: "0%",
        tariffConfidence: "estimated",
        costFriction: "Low",
        attractiveness: "Good",
        rationale: "Most furniture imports duty-free under CUSMA.",
      },
    },
  },

  "Apparel & Textiles": {
    fifthMarket: VIETNAM,
    lastUpdated: "2026-08-26",
    export: {
      us: {
        tariffRate: "50%",
        tariffConfidence: "estimated",
        costFriction: "High",
        attractiveness: "Challenging",
        rationale: "Textiles, apparel, footwear, and luggage are named in Proclamation 11048's Motor Vehicle Annex (HTS 9903.03.14) — despite its name, the broadest of the three August 2026 Section 338 proclamations — at a flat 50% duty, with no CUSMA exemption. This supersedes the prior fiber-content-dependent MFN/CUSMA range for covered lines.",
        sourceName: "CFIB — Canada-U.S. Tariffs Tracker",
        sourceUrl: "https://www.cfib-fcei.ca/en/site/us-tariffs",
        lastUpdated: "2026-08-26",
      },
      eu: {
        tariffRate: "8–12%",
        tariffConfidence: "estimated",
        costFriction: "Medium",
        attractiveness: "Good",
        rationale: "CETA preference requires meeting rules of origin; goods that don't qualify face the higher MFN range shown.",
      },
      uk: {
        tariffRate: "8–12%",
        tariffConfidence: "estimated",
        costFriction: "Medium",
        attractiveness: "Good",
        rationale: "Canada-UK TCA carries over CETA-level treatment and the same origin requirements.",
      },
      japan: {
        tariffRate: "5–10%",
        tariffConfidence: "estimated",
        costFriction: "High",
        attractiveness: "Fair",
        rationale: "CPTPP preference is origin-dependent; range reflects goods not fully qualifying.",
      },
      fifth: {
        tariffRate: "0% (CPTPP)",
        tariffConfidence: "estimated",
        costFriction: "Medium",
        attractiveness: "Good",
        rationale: "CPTPP eliminates tariffs on originating apparel moving to Vietnam.",
      },
    },
    import: {
      us: {
        tariffRate: "0–18%",
        tariffConfidence: "estimated",
        costFriction: "Medium",
        attractiveness: "Good",
        rationale: "Duty-free if CUSMA yarn-forward rules are met; non-qualifying goods fall back to the higher MFN range.",
      },
      eu: {
        tariffRate: "0–12%",
        tariffConfidence: "estimated",
        costFriction: "Medium",
        attractiveness: "Good",
        rationale: "Duty-free if CETA rules of origin are met; otherwise the higher MFN range applies.",
      },
      uk: {
        tariffRate: "0–12%",
        tariffConfidence: "estimated",
        costFriction: "Medium",
        attractiveness: "Good",
        rationale: "Duty-free if CUKTCA rules of origin are met; otherwise the higher MFN range applies.",
      },
      japan: {
        tariffRate: "0–9%",
        tariffConfidence: "estimated",
        costFriction: "High",
        attractiveness: "Fair",
        rationale: "Duty-free if CPTPP rules of origin are met; otherwise the higher MFN range applies.",
      },
      fifth: {
        tariffRate: "0–18%",
        tariffConfidence: "estimated",
        costFriction: "Medium",
        attractiveness: "Excellent",
        rationale: "Vietnam apparel imports fall back to MFN rates outside CPTPP-qualifying content.",
      },
    },
  },

  "Steel & Metals": {
    fifthMarket: SOUTH_KOREA,
    lastUpdated: "2026-08-26",
    export: {
      us: {
        tariffRate: "10–50%",
        tariffConfidence: "estimated",
        costFriction: "High",
        attractiveness: "Challenging",
        rationale: "Section 232 steel/aluminum/copper duties were restructured April 2, 2026 into tiered rates of 10%–50% assessed on the product's full customs value (not just metal content), with goods under 15% subject-metal content exempt as de minimis. A June 1, 2026 proclamation (effective June 8) added a narrower 15% rate for certain industrial and electrical grid equipment through 2027. Which tier applies depends on HS classification — confirm your specific line.",
        sourceName: "EDC — U.S. Steel and Aluminum Tariffs: What Exporters Need to Know",
        sourceUrl: "https://www.edc.ca/en/article/us-steel-and-aluminum-tariffs.html",
        lastUpdated: "2026-08-26",
      },
      eu: {
        tariffRate: "0–15%",
        tariffConfidence: "estimated",
        costFriction: "High",
        attractiveness: "Fair",
        rationale: "CETA preference plus EU steel safeguard measures on top of MFN rates for some product forms.",
      },
      uk: {
        tariffRate: "0–15%",
        tariffConfidence: "estimated",
        costFriction: "Medium",
        attractiveness: "Fair",
        rationale: "Canada-UK TCA carries over CETA-level treatment; range reflects product form and origin qualification.",
      },
      japan: {
        tariffRate: "0–4.7%",
        tariffConfidence: "estimated",
        costFriction: "Medium",
        attractiveness: "Good",
        rationale: "CPTPP preference for most steel/metal products; range reflects HS classification.",
      },
      fifth: {
        tariffRate: "0–13%",
        tariffConfidence: "estimated",
        costFriction: "Medium",
        attractiveness: "Fair",
        rationale: "Canada–Korea FTA preference; range reflects product form and any safeguard measures.",
      },
    },
    import: {
      us: {
        tariffRate: "50%",
        tariffConfidence: "estimated",
        costFriction: "High",
        attractiveness: "Challenging",
        rationale: "Canada's existing 25% counter-tariff surtax on selected U.S. steel and aluminum products increases to 50% (matching the U.S. rate) effective September 8, 2026, layered on top of the regular Customs Tariff — this supersedes the prior CUSMA duty-free treatment for covered lines; confirm against the official tariff-item list for your specific product.",
        sourceName: "GHY — Canada to Impose New Counter-Tariffs on U.S. Goods (Sept 2026)",
        sourceUrl: "https://www.ghy.com/trade-compliance/canada-counter-tariffs-us-goods-september-2026/",
        lastUpdated: "2026-08-26",
      },
      eu: {
        tariffRate: "0% (CETA)",
        tariffConfidence: "estimated",
        costFriction: "Medium",
        attractiveness: "Good",
        rationale: "Duty-free for CETA-originating steel/metals meeting rules of origin.",
      },
      uk: {
        tariffRate: "0% (CUKTCA)",
        tariffConfidence: "estimated",
        costFriction: "Medium",
        attractiveness: "Good",
        rationale: "Duty-free for CUKTCA-originating steel/metals.",
      },
      japan: {
        tariffRate: "0–4.7%",
        tariffConfidence: "estimated",
        costFriction: "Medium",
        attractiveness: "Good",
        rationale: "CPTPP preference for most steel/metal imports; range reflects HS classification.",
      },
      fifth: {
        tariffRate: "0–8%",
        tariffConfidence: "estimated",
        costFriction: "High",
        attractiveness: "Fair",
        rationale: "Reflects the kind of anti-dumping/safeguard duties Canada has historically applied to select imported steel products.",
      },
    },
  },

  "Agri-food": {
    fifthMarket: AUSTRALIA,
    lastUpdated: "2026-08-26",
    export: {
      us: {
        tariffRate: "0–15% (dairy 50%)",
        tariffConfidence: "estimated",
        costFriction: "High",
        attractiveness: "Challenging",
        rationale: "Proclamation 11047's Dairy Annex (HTS 9903.03.13) puts dairy, casein, and related products at a flat 50% duty effective August 2026, and seeds/plants/honey are separately named in the broader Motor Vehicle Annex (HTS 9903.03.14). Most other agri-food lines still fall under the prior CUSMA/MFN range shown, but that range should not be assumed for dairy, seed, or plant exports specifically.",
        sourceName: "CFIB — Canada-U.S. Tariffs Tracker",
        sourceUrl: "https://www.cfib-fcei.ca/en/site/us-tariffs",
        lastUpdated: "2026-08-26",
      },
      eu: {
        tariffRate: "10–20%",
        tariffConfidence: "estimated",
        costFriction: "High",
        attractiveness: "Fair",
        rationale: "EU agricultural tariffs and sanitary/phytosanitary requirements remain significant even under CETA.",
      },
      uk: {
        tariffRate: "5–15%",
        tariffConfidence: "estimated",
        costFriction: "Medium",
        attractiveness: "Good",
        rationale: "Canada-UK TCA carries over most CETA agri-food preferences.",
      },
      japan: {
        tariffRate: "10–20%",
        tariffConfidence: "estimated",
        costFriction: "High",
        attractiveness: "Fair",
        rationale: "Japan maintains meaningful agricultural tariffs even under CPTPP for many product lines.",
      },
      fifth: {
        tariffRate: "0–5% (CPTPP)",
        tariffConfidence: "estimated",
        costFriction: "Medium",
        attractiveness: "Good",
        rationale: "CPTPP substantially reduces agri-food tariffs into Australia for most product lines.",
      },
    },
    import: {
      us: {
        tariffRate: "0–298%",
        tariffConfidence: "estimated",
        costFriction: "High",
        attractiveness: "Challenging",
        rationale: "Canada's supply-managed goods (dairy, poultry, eggs) carry very high over-quota tariffs under its tariff-rate quota system, regardless of origin.",
      },
      eu: {
        tariffRate: "0–298%",
        tariffConfidence: "estimated",
        costFriction: "High",
        attractiveness: "Challenging",
        rationale: "Same Canadian TRQ system applies regardless of the exporting country.",
      },
      uk: {
        tariffRate: "0–298%",
        tariffConfidence: "estimated",
        costFriction: "High",
        attractiveness: "Challenging",
        rationale: "Same Canadian TRQ system applies regardless of the exporting country.",
      },
      japan: {
        tariffRate: "0–298%",
        tariffConfidence: "estimated",
        costFriction: "High",
        attractiveness: "Challenging",
        rationale: "Same Canadian TRQ system applies regardless of the exporting country.",
      },
      fifth: {
        tariffRate: "0–298%",
        tariffConfidence: "estimated",
        costFriction: "High",
        attractiveness: "Challenging",
        rationale: "Same Canadian TRQ system applies regardless of the exporting country.",
      },
    },
  },

  Machinery: {
    fifthMarket: MEXICO,
    lastUpdated: "2026-08-26",
    export: {
      us: {
        tariffRate: "15–50%",
        tariffConfidence: "estimated",
        costFriction: "High",
        attractiveness: "Challenging",
        rationale: "Two overlapping U.S. actions now apply: Section 232 derivative machinery (agricultural equipment, HVAC, industrial equipment like bulldozers/forklifts) sits at 15% (10% if ≥85% U.S.-sourced), while machinery, electrical equipment, and printed circuit boards are separately named in Proclamation 11048's Motor Vehicle Annex (HTS 9903.03.14) at 50%. Which regime covers a given product is HS-code specific — do not treat either single figure as universal.",
        sourceName: "CFIB — Canada-U.S. Tariffs Tracker",
        sourceUrl: "https://www.cfib-fcei.ca/en/site/us-tariffs",
        lastUpdated: "2026-08-26",
      },
      eu: {
        tariffRate: "1.7%",
        tariffConfidence: "estimated",
        costFriction: "Medium",
        attractiveness: "Good",
        rationale: "CETA reduces most machinery tariffs; figure reflects goods not fully meeting rules of origin.",
      },
      uk: {
        tariffRate: "0–2%",
        tariffConfidence: "estimated",
        costFriction: "Medium",
        attractiveness: "Good",
        rationale: "Canada-UK TCA carries over CETA-level treatment for most machinery.",
      },
      japan: {
        tariffRate: "0%",
        tariffConfidence: "estimated",
        costFriction: "Medium",
        attractiveness: "Good",
        rationale: "CPTPP eliminates tariffs on most originating machinery.",
      },
      fifth: {
        tariffRate: "0%",
        tariffConfidence: "estimated",
        costFriction: "Low",
        attractiveness: "Excellent",
        rationale: "CUSMA eliminates tariffs on originating machinery.",
      },
    },
    import: {
      us: {
        tariffRate: "0%",
        tariffConfidence: "estimated",
        costFriction: "Low",
        attractiveness: "Excellent",
        rationale: "Most machinery imports duty-free under CUSMA/MFN treatment.",
      },
      eu: {
        tariffRate: "0%",
        tariffConfidence: "estimated",
        costFriction: "Medium",
        attractiveness: "Good",
        rationale: "Most machinery imports duty-free under CETA.",
      },
      uk: {
        tariffRate: "0%",
        tariffConfidence: "estimated",
        costFriction: "Medium",
        attractiveness: "Good",
        rationale: "Most machinery imports duty-free under CUKTCA.",
      },
      japan: {
        tariffRate: "0%",
        tariffConfidence: "estimated",
        costFriction: "Medium",
        attractiveness: "Good",
        rationale: "Most machinery imports duty-free under CPTPP.",
      },
      fifth: {
        tariffRate: "0%",
        tariffConfidence: "estimated",
        costFriction: "Low",
        attractiveness: "Excellent",
        rationale: "Most machinery imports duty-free under CUSMA.",
      },
    },
  },

  Chemicals: {
    fifthMarket: SOUTH_KOREA,
    lastUpdated: "2026-08-26",
    export: {
      us: {
        tariffRate: "0–5%",
        tariffConfidence: "estimated",
        costFriction: "Medium",
        attractiveness: "Good",
        rationale: "Most chemicals enter duty-free or low-tariff; range reflects HS classification and regulatory category.",
      },
      eu: {
        tariffRate: "4–6%",
        tariffConfidence: "estimated",
        costFriction: "Medium",
        attractiveness: "Good",
        rationale: "CETA reduces most chemical tariffs; figure reflects goods not fully meeting rules of origin.",
      },
      uk: {
        tariffRate: "0–5%",
        tariffConfidence: "estimated",
        costFriction: "Medium",
        attractiveness: "Good",
        rationale: "Canada-UK TCA carries over CETA-level treatment for most chemicals.",
      },
      japan: {
        tariffRate: "0–3%",
        tariffConfidence: "estimated",
        costFriction: "Medium",
        attractiveness: "Good",
        rationale: "CPTPP eliminates or reduces tariffs on most originating chemicals.",
      },
      fifth: {
        tariffRate: "0% (CKFTA)",
        tariffConfidence: "estimated",
        costFriction: "Medium",
        attractiveness: "Good",
        rationale: "Canada–Korea FTA eliminates tariffs on most originating chemicals.",
      },
    },
    import: {
      us: {
        tariffRate: "0%",
        tariffConfidence: "estimated",
        costFriction: "Medium",
        attractiveness: "Good",
        rationale: "Most chemicals import duty-free under CUSMA/MFN treatment.",
      },
      eu: {
        tariffRate: "0%",
        tariffConfidence: "estimated",
        costFriction: "Medium",
        attractiveness: "Good",
        rationale: "Most chemicals import duty-free under CETA.",
      },
      uk: {
        tariffRate: "0%",
        tariffConfidence: "estimated",
        costFriction: "Medium",
        attractiveness: "Good",
        rationale: "Most chemicals import duty-free under CUKTCA.",
      },
      japan: {
        tariffRate: "0%",
        tariffConfidence: "estimated",
        costFriction: "Medium",
        attractiveness: "Good",
        rationale: "Most chemicals import duty-free under CPTPP.",
      },
      fifth: {
        tariffRate: "0% (CKFTA)",
        tariffConfidence: "estimated",
        costFriction: "Medium",
        attractiveness: "Good",
        rationale: "Most chemicals import duty-free under the Canada–Korea FTA.",
      },
    },
  },

  "Other / Custom": DEFAULT_CATEGORY,
};

export function resolveScenarioDirection(scenario: string | null): TradeDirection {
  return scenario === "import-us" || scenario === "import-other" ? "import" : "export";
}

function toRow(
  category: string,
  direction: TradeDirection,
  targetMarket: Market,
  profile: MarketProfile,
  categoryLastUpdated: string
): MarketDataRow {
  const sourceKey = sourceFor(targetMarket.key, direction);
  const defaultSource = SOURCES[sourceKey];
  return {
    market: targetMarket,
    direction,
    category,
    tariffRate: profile.tariffRate,
    tariffConfidence: profile.tariffConfidence,
    costFriction: profile.costFriction,
    attractiveness: profile.attractiveness,
    rationale: profile.rationale,
    sourceName: profile.sourceName ?? defaultSource.name,
    sourceUrl: profile.sourceUrl ?? defaultSource.url,
    lastUpdated: profile.lastUpdated ?? categoryLastUpdated,
  };
}

/** The full structured dataset — every category, direction, and market as one flat array. */
export function flattenMarketData(): MarketDataRow[] {
  const rows: MarketDataRow[] = [];
  for (const [category, data] of Object.entries(CATEGORY_DATA)) {
    for (const direction of ["export", "import"] as const) {
      const profiles = data[direction];
      rows.push(toRow(category, direction, US, profiles.us, data.lastUpdated));
      rows.push(toRow(category, direction, EU, profiles.eu, data.lastUpdated));
      rows.push(toRow(category, direction, UK, profiles.uk, data.lastUpdated));
      rows.push(toRow(category, direction, JAPAN, profiles.japan, data.lastUpdated));
      rows.push(toRow(category, direction, data.fifthMarket, profiles.fifth, data.lastUpdated));
    }
  }
  return rows;
}

/** The 5-row comparison set for one category + scenario, as shown on the Results screen. */
export function getMarketDataRows(category: string | null, scenario: string | null): MarketDataRow[] {
  const data = (category && CATEGORY_DATA[category]) || DEFAULT_CATEGORY;
  const direction = resolveScenarioDirection(scenario);
  const profiles = data[direction];

  return [
    toRow(category ?? "Other / Custom", direction, US, profiles.us, data.lastUpdated),
    toRow(category ?? "Other / Custom", direction, EU, profiles.eu, data.lastUpdated),
    toRow(category ?? "Other / Custom", direction, UK, profiles.uk, data.lastUpdated),
    toRow(category ?? "Other / Custom", direction, JAPAN, profiles.japan, data.lastUpdated),
    toRow(category ?? "Other / Custom", direction, data.fifthMarket, profiles.fifth, data.lastUpdated),
  ];
}

/** Backwards-compatible shape for call sites that only need market + basic profile. */
export function getMarketComparison(
  category: string | null,
  scenario: string | null
): MarketComparisonRow[] {
  return getMarketDataRows(category, scenario).map((row) => ({
    market: row.market,
    profile: {
      tariffRate: row.tariffRate,
      costFriction: row.costFriction,
      attractiveness: row.attractiveness,
    },
  }));
}

export type RiskStatus = "Elevated" | "Watch" | "Stable" | "Uncertain";

/**
 * A simple, deterministic read of a market's current risk from data already
 * on the row — no historical trend, no separate scoring model. "Uncertain"
 * means the tariff figure itself is unresolved; otherwise the classification
 * follows how costly/friction-heavy the market already looks (attractiveness
 * and cost/friction are themselves derived from the tariff rate and category
 * context when the row was authored — see the rationale for the specific
 * reasoning behind any one figure).
 */
export function getRiskStatus(row: MarketDataRow): RiskStatus {
  if (row.tariffConfidence === "unknown") return "Uncertain";
  if (row.attractiveness === "Challenging" || row.costFriction === "High") return "Elevated";
  if (row.attractiveness === "Fair" || row.costFriction === "Medium") return "Watch";
  return "Stable";
}

export type DataStatus = "Current" | "Estimated" | "Review needed";

/** Plain-language read of `tariffConfidence` for the Results screen's per-row status line. */
export function getDataStatus(row: MarketDataRow): DataStatus {
  if (row.tariffConfidence === "unknown") return "Review needed";
  if (row.tariffConfidence === "official") return "Current";
  return "Estimated";
}

export type UsTradeSummary = {
  attractiveness: Attractiveness;
  risk: RiskStatus;
};

export type UsHeatmapSummary = {
  export: UsTradeSummary;
  import: UsTradeSummary;
};

function mostCommon<T extends string>(values: T[]): T {
  const counts = new Map<T, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  let best = values[0];
  let bestCount = 0;
  for (const [value, count] of counts) {
    if (count > bestCount) {
      best = value;
      bestCount = count;
    }
  }
  return best;
}

/**
 * Homepage-only aggregate: the most common Attractiveness/Risk reading for
 * the U.S. market across every product category, one per trade direction.
 * Not a new scoring model — a plain mode over the same per-category rows
 * the Results screen already shows, so the homepage never has to invent a
 * number or ask the visitor to pick a category first.
 */
export function getUsHeatmapSummary(): UsHeatmapSummary {
  const categories = Object.keys(CATEGORY_DATA);
  const summarize = (scenario: string): UsTradeSummary => {
    const rows = categories
      .map((category) => getMarketDataRows(category, scenario).find((row) => row.market.key === "us"))
      .filter((row): row is MarketDataRow => Boolean(row));
    return {
      attractiveness: mostCommon(rows.map((row) => row.attractiveness)),
      risk: mostCommon(rows.map(getRiskStatus)),
    };
  };

  return {
    export: summarize("export-us"),
    import: summarize("import-us"),
  };
}
