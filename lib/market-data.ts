/**
 * Illustrative placeholder data for the Results screen.
 * Numbers are representative examples grounded in general, publicly known
 * trade patterns (e.g. CUSMA/CETA/CPTPP tariff elimination, Canada's dairy
 * supply-management tariff-rate quotas, US Section 232 steel tariffs) —
 * they are not verified figures and do not constitute tariff or trade advice.
 */

export type CostFriction = "Low" | "Medium" | "High";
export type Attractiveness = "Excellent" | "Good" | "Fair" | "Challenging";
export type TradeDirection = "export" | "import";

export type Market = {
  key: string;
  name: string;
  /** Ease of doing business, out of 10. A market-level property, constant across categories/direction. */
  easeOfBusiness: number;
};

export type MarketProfile = {
  tariffRate: string;
  costFriction: CostFriction;
  attractiveness: Attractiveness;
};

export type MarketComparisonRow = {
  market: Market;
  profile: MarketProfile;
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
};

const DEFAULT_CATEGORY: CategoryData = {
  fifthMarket: MEXICO,
  export: {
    us: { tariffRate: "Varies", costFriction: "Medium", attractiveness: "Good" },
    eu: { tariffRate: "Varies", costFriction: "Medium", attractiveness: "Good" },
    uk: { tariffRate: "Varies", costFriction: "Medium", attractiveness: "Good" },
    japan: { tariffRate: "Varies", costFriction: "Medium", attractiveness: "Fair" },
    fifth: { tariffRate: "Varies", costFriction: "Medium", attractiveness: "Good" },
  },
  import: {
    us: { tariffRate: "Varies", costFriction: "Medium", attractiveness: "Good" },
    eu: { tariffRate: "Varies", costFriction: "Medium", attractiveness: "Good" },
    uk: { tariffRate: "Varies", costFriction: "Medium", attractiveness: "Good" },
    japan: { tariffRate: "Varies", costFriction: "Medium", attractiveness: "Fair" },
    fifth: { tariffRate: "Varies", costFriction: "Medium", attractiveness: "Good" },
  },
};

const CATEGORY_DATA: Record<string, CategoryData> = {
  "Auto parts": {
    fifthMarket: MEXICO,
    export: {
      us: { tariffRate: "2.5%", costFriction: "Low", attractiveness: "Excellent" },
      eu: { tariffRate: "4.0%", costFriction: "Medium", attractiveness: "Good" },
      uk: { tariffRate: "2.0%", costFriction: "Medium", attractiveness: "Good" },
      japan: { tariffRate: "0%", costFriction: "High", attractiveness: "Fair" },
      fifth: { tariffRate: "0%", costFriction: "Low", attractiveness: "Excellent" },
    },
    import: {
      us: { tariffRate: "0% (CUSMA)", costFriction: "Low", attractiveness: "Excellent" },
      eu: { tariffRate: "0% (CETA)", costFriction: "Medium", attractiveness: "Good" },
      uk: { tariffRate: "0% (CUKTCA)", costFriction: "Medium", attractiveness: "Good" },
      japan: { tariffRate: "0% (CPTPP)", costFriction: "Medium", attractiveness: "Good" },
      fifth: { tariffRate: "0% (CUSMA)", costFriction: "Low", attractiveness: "Excellent" },
    },
  },
  Electronics: {
    fifthMarket: SOUTH_KOREA,
    export: {
      us: { tariffRate: "0–2.6%", costFriction: "Low", attractiveness: "Excellent" },
      eu: { tariffRate: "3.7%", costFriction: "Medium", attractiveness: "Good" },
      uk: { tariffRate: "2.5%", costFriction: "Medium", attractiveness: "Good" },
      japan: { tariffRate: "0%", costFriction: "Medium", attractiveness: "Good" },
      fifth: { tariffRate: "0% (CKFTA)", costFriction: "Medium", attractiveness: "Good" },
    },
    import: {
      us: { tariffRate: "0%", costFriction: "Low", attractiveness: "Excellent" },
      eu: { tariffRate: "0%", costFriction: "Medium", attractiveness: "Good" },
      uk: { tariffRate: "0%", costFriction: "Medium", attractiveness: "Good" },
      japan: { tariffRate: "0%", costFriction: "Low", attractiveness: "Excellent" },
      fifth: { tariffRate: "0% (CKFTA)", costFriction: "Low", attractiveness: "Excellent" },
    },
  },
  Furniture: {
    fifthMarket: MEXICO,
    export: {
      us: { tariffRate: "0–3%", costFriction: "Low", attractiveness: "Excellent" },
      eu: { tariffRate: "2.7%", costFriction: "Medium", attractiveness: "Good" },
      uk: { tariffRate: "0–2%", costFriction: "Medium", attractiveness: "Good" },
      japan: { tariffRate: "0%", costFriction: "High", attractiveness: "Fair" },
      fifth: { tariffRate: "0%", costFriction: "Medium", attractiveness: "Good" },
    },
    import: {
      us: { tariffRate: "0%", costFriction: "Low", attractiveness: "Excellent" },
      eu: { tariffRate: "0%", costFriction: "Medium", attractiveness: "Good" },
      uk: { tariffRate: "0%", costFriction: "Medium", attractiveness: "Good" },
      japan: { tariffRate: "0%", costFriction: "High", attractiveness: "Fair" },
      fifth: { tariffRate: "0%", costFriction: "Low", attractiveness: "Good" },
    },
  },
  "Apparel & Textiles": {
    fifthMarket: VIETNAM,
    export: {
      us: { tariffRate: "8–16%", costFriction: "Medium", attractiveness: "Good" },
      eu: { tariffRate: "8–12%", costFriction: "Medium", attractiveness: "Good" },
      uk: { tariffRate: "8–12%", costFriction: "Medium", attractiveness: "Good" },
      japan: { tariffRate: "5–10%", costFriction: "High", attractiveness: "Fair" },
      fifth: { tariffRate: "0% (CPTPP)", costFriction: "Medium", attractiveness: "Good" },
    },
    import: {
      us: { tariffRate: "0–18%", costFriction: "Medium", attractiveness: "Good" },
      eu: { tariffRate: "0–12%", costFriction: "Medium", attractiveness: "Good" },
      uk: { tariffRate: "0–12%", costFriction: "Medium", attractiveness: "Good" },
      japan: { tariffRate: "0–9%", costFriction: "High", attractiveness: "Fair" },
      fifth: { tariffRate: "0–18%", costFriction: "Medium", attractiveness: "Excellent" },
    },
  },
  "Steel & Metals": {
    fifthMarket: SOUTH_KOREA,
    export: {
      us: { tariffRate: "25%", costFriction: "High", attractiveness: "Challenging" },
      eu: { tariffRate: "0–15%", costFriction: "High", attractiveness: "Fair" },
      uk: { tariffRate: "0–15%", costFriction: "Medium", attractiveness: "Fair" },
      japan: { tariffRate: "0–4.7%", costFriction: "Medium", attractiveness: "Good" },
      fifth: { tariffRate: "0–13%", costFriction: "Medium", attractiveness: "Fair" },
    },
    import: {
      us: { tariffRate: "0% (CUSMA)", costFriction: "Low", attractiveness: "Good" },
      eu: { tariffRate: "0% (CETA)", costFriction: "Medium", attractiveness: "Good" },
      uk: { tariffRate: "0% (CUKTCA)", costFriction: "Medium", attractiveness: "Good" },
      japan: { tariffRate: "0–4.7%", costFriction: "Medium", attractiveness: "Good" },
      fifth: { tariffRate: "0–8%", costFriction: "High", attractiveness: "Fair" },
    },
  },
  "Agri-food": {
    fifthMarket: AUSTRALIA,
    export: {
      us: { tariffRate: "0–15%", costFriction: "Medium", attractiveness: "Good" },
      eu: { tariffRate: "10–20%", costFriction: "High", attractiveness: "Fair" },
      uk: { tariffRate: "5–15%", costFriction: "Medium", attractiveness: "Good" },
      japan: { tariffRate: "10–20%", costFriction: "High", attractiveness: "Fair" },
      fifth: { tariffRate: "0–5% (CPTPP)", costFriction: "Medium", attractiveness: "Good" },
    },
    import: {
      us: { tariffRate: "0–298%", costFriction: "High", attractiveness: "Challenging" },
      eu: { tariffRate: "0–298%", costFriction: "High", attractiveness: "Challenging" },
      uk: { tariffRate: "0–298%", costFriction: "High", attractiveness: "Challenging" },
      japan: { tariffRate: "0–298%", costFriction: "High", attractiveness: "Challenging" },
      fifth: { tariffRate: "0–298%", costFriction: "High", attractiveness: "Challenging" },
    },
  },
  Machinery: {
    fifthMarket: MEXICO,
    export: {
      us: { tariffRate: "0–2%", costFriction: "Low", attractiveness: "Excellent" },
      eu: { tariffRate: "1.7%", costFriction: "Medium", attractiveness: "Good" },
      uk: { tariffRate: "0–2%", costFriction: "Medium", attractiveness: "Good" },
      japan: { tariffRate: "0%", costFriction: "Medium", attractiveness: "Good" },
      fifth: { tariffRate: "0%", costFriction: "Low", attractiveness: "Excellent" },
    },
    import: {
      us: { tariffRate: "0%", costFriction: "Low", attractiveness: "Excellent" },
      eu: { tariffRate: "0%", costFriction: "Medium", attractiveness: "Good" },
      uk: { tariffRate: "0%", costFriction: "Medium", attractiveness: "Good" },
      japan: { tariffRate: "0%", costFriction: "Medium", attractiveness: "Good" },
      fifth: { tariffRate: "0%", costFriction: "Low", attractiveness: "Excellent" },
    },
  },
  Chemicals: {
    fifthMarket: SOUTH_KOREA,
    export: {
      us: { tariffRate: "0–5%", costFriction: "Medium", attractiveness: "Good" },
      eu: { tariffRate: "4–6%", costFriction: "Medium", attractiveness: "Good" },
      uk: { tariffRate: "0–5%", costFriction: "Medium", attractiveness: "Good" },
      japan: { tariffRate: "0–3%", costFriction: "Medium", attractiveness: "Good" },
      fifth: { tariffRate: "0% (CKFTA)", costFriction: "Medium", attractiveness: "Good" },
    },
    import: {
      us: { tariffRate: "0%", costFriction: "Medium", attractiveness: "Good" },
      eu: { tariffRate: "0%", costFriction: "Medium", attractiveness: "Good" },
      uk: { tariffRate: "0%", costFriction: "Medium", attractiveness: "Good" },
      japan: { tariffRate: "0%", costFriction: "Medium", attractiveness: "Good" },
      fifth: { tariffRate: "0% (CKFTA)", costFriction: "Medium", attractiveness: "Good" },
    },
  },
  "Other / Custom": DEFAULT_CATEGORY,
};

// Notes on the import-direction figures above:
// - Apparel: duty-free treatment depends on meeting the FTA's rules of origin (e.g. yarn-forward);
//   goods that don't qualify fall back to higher MFN tariffs, hence the wide ranges shown.
// - Steel & Metals (fifth market): reflects the kind of anti-dumping/safeguard duties Canada has
//   historically applied to select imported steel products outside its FTA network.
// - Agri-food: Canada's supply-managed goods (dairy, poultry, eggs) face low in-quota tariffs but
//   very high over-quota tariffs under its tariff-rate quota system, regardless of trading partner.

export function resolveScenarioDirection(scenario: string | null): TradeDirection {
  return scenario === "import-us" || scenario === "import-other" ? "import" : "export";
}

export function getMarketComparison(
  category: string | null,
  scenario: string | null
): MarketComparisonRow[] {
  const data = (category && CATEGORY_DATA[category]) || DEFAULT_CATEGORY;
  const direction = resolveScenarioDirection(scenario);
  const profiles = data[direction];

  return [
    { market: US, profile: profiles.us },
    { market: EU, profile: profiles.eu },
    { market: UK, profile: profiles.uk },
    { market: JAPAN, profile: profiles.japan },
    { market: data.fifthMarket, profile: profiles.fifth },
  ];
}
