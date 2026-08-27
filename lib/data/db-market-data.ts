/**
 * Postgres-backed replacement for the old code-resident lib/data/market-data.ts.
 * Rate/source data now lives in the `tariff_rates`/`sources` tables (public
 * read, seeded from the original file — see supabase/migrations/006 and the
 * migration verification diff). Market metadata (names, ease-of-business
 * scores, which market is a category's "fifth" comparison market) was never
 * part of that migration's scope and stays here as small, static config.
 *
 * Uses a plain anon-key Supabase client (not the SSR browser/server
 * variants) since these tables are public-read (RLS: `for select using
 * (true)`) and need no session/cookies at all — this lets the exact same
 * functions run from both client components (Results) and server
 * components (the homepage heatmap) without a client/server split.
 */

import { createClient } from "@supabase/supabase-js";
import { OTHER_CATEGORY } from "@/lib/onboarding-data";

function getAnonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export type TariffConfidence = "official" | "estimated" | "unknown";
export type CostFriction = "Low" | "Medium" | "High";
export type Attractiveness = "Excellent" | "Good" | "Fair" | "Challenging";
export type TradeDirection = "export" | "import";

export type Market = {
  key: string;
  name: string;
  easeOfBusiness: number;
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

function market(key: string, name: string): Market {
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

const FIFTH_MARKET_BY_CATEGORY: Record<string, Market> = {
  "Auto parts": MEXICO,
  Electronics: SOUTH_KOREA,
  Furniture: MEXICO,
  "Apparel & Textiles": VIETNAM,
  "Steel & Metals": SOUTH_KOREA,
  "Agri-food": AUSTRALIA,
  Machinery: MEXICO,
  Chemicals: SOUTH_KOREA,
};

export function resolveScenarioDirection(scenario: string | null): TradeDirection {
  return scenario === "import-us" || scenario === "import-other" ? "import" : "export";
}

function formatRateDisplay(min: number | null, max: number | null): string {
  if (min == null || max == null) return "Unknown";
  if (min === max) return `${min}%`;
  return `${min}–${max}%`;
}

type DbTariffRow = {
  origin_country: string;
  destination_country: string;
  rate_min: number | null;
  rate_max: number | null;
  confidence: TariffConfidence;
  cost_friction: CostFriction;
  attractiveness: Attractiveness;
  rationale: string;
  reviewed_at: string;
  sources: { name: string; url: string } | null;
};

function rowFromDb(dbRow: DbTariffRow, targetMarket: Market, direction: TradeDirection, category: string): MarketDataRow {
  return {
    market: targetMarket,
    direction,
    category,
    tariffRate: formatRateDisplay(dbRow.rate_min, dbRow.rate_max),
    tariffConfidence: dbRow.confidence,
    costFriction: dbRow.cost_friction,
    attractiveness: dbRow.attractiveness,
    rationale: dbRow.rationale,
    sourceName: dbRow.sources?.name ?? "Unknown source",
    sourceUrl: dbRow.sources?.url ?? "#",
    lastUpdated: dbRow.reviewed_at,
  };
}

/** The 5-row comparison set for one category + scenario, as shown on the Results screen. */
export async function getMarketDataRows(
  category: string | null,
  scenario: string | null
): Promise<MarketDataRow[]> {
  const cat = category ?? OTHER_CATEGORY;
  const direction = resolveScenarioDirection(scenario);
  const fifth = FIFTH_MARKET_BY_CATEGORY[cat] ?? MEXICO;
  const markets = [US, EU, UK, JAPAN, fifth];
  const marketKeys = markets.map((m) => m.key);
  const varyingColumn = direction === "export" ? "destination_country" : "origin_country";
  const fixedColumn = direction === "export" ? "origin_country" : "destination_country";

  const supabase = getAnonClient();
  const { data, error } = await supabase
    .from("tariff_rates")
    .select(
      "origin_country, destination_country, rate_min, rate_max, confidence, cost_friction, attractiveness, rationale, reviewed_at, sources(name, url)"
    )
    .eq("category", cat)
    .eq(fixedColumn, "CA")
    .in(varyingColumn, marketKeys);

  if (error) throw error;

  return markets.map((m) => {
    const dbRow = (data as unknown as DbTariffRow[]).find((d) => d[varyingColumn] === m.key);
    if (!dbRow) {
      throw new Error(`Missing rate data for ${cat} / ${direction} / ${m.key}`);
    }
    return rowFromDb(dbRow, m, direction, cat);
  });
}

export type RiskStatus = "Elevated" | "Watch" | "Stable" | "Uncertain";

export function getRiskStatus(row: MarketDataRow): RiskStatus {
  if (row.tariffConfidence === "unknown") return "Uncertain";
  if (row.attractiveness === "Challenging" || row.costFriction === "High") return "Elevated";
  if (row.attractiveness === "Fair" || row.costFriction === "Medium") return "Watch";
  return "Stable";
}

export type DataStatus = "Current" | "Estimated" | "Review needed";

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

/** Homepage-only aggregate: the most common Attractiveness/Risk reading for the U.S. market across every category. */
export async function getUsHeatmapSummary(): Promise<UsHeatmapSummary> {
  const supabase = getAnonClient();

  const summarize = async (direction: TradeDirection): Promise<UsTradeSummary> => {
    const fixedColumn = direction === "export" ? "origin_country" : "destination_country";
    const varyingColumn = direction === "export" ? "destination_country" : "origin_country";
    const { data, error } = await supabase
      .from("tariff_rates")
      .select("confidence, cost_friction, attractiveness")
      .eq(fixedColumn, "CA")
      .eq(varyingColumn, "us");
    if (error) throw error;

    const rows = data as unknown as Pick<DbTariffRow, "confidence" | "cost_friction" | "attractiveness">[];
    const risks = rows.map((r) => {
      if (r.confidence === "unknown") return "Uncertain" as RiskStatus;
      if (r.attractiveness === "Challenging" || r.cost_friction === "High") return "Elevated" as RiskStatus;
      if (r.attractiveness === "Fair" || r.cost_friction === "Medium") return "Watch" as RiskStatus;
      return "Stable" as RiskStatus;
    });

    return {
      attractiveness: mostCommon(rows.map((r) => r.attractiveness)),
      risk: mostCommon(risks),
    };
  };

  const [exportSummary, importSummary] = await Promise.all([summarize("export"), summarize("import")]);
  return { export: exportSummary, import: importSummary };
}
