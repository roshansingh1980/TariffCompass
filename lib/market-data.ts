/**
 * Illustrative placeholder data for the Results screen.
 * Numbers are representative examples, not verified tariff or trade advice.
 */

export type CostFriction = "Low" | "Medium" | "High";
export type Attractiveness = "Excellent" | "Good" | "Fair" | "Challenging";

export type Market = {
  key: string;
  name: string;
  /** Ease of doing business, out of 10. A market-level property, constant across categories. */
  easeOfBusiness: number;
};

export const MARKETS: Market[] = [
  { key: "us", name: "United States", easeOfBusiness: 8.4 },
  { key: "eu", name: "European Union", easeOfBusiness: 7.6 },
  { key: "uk", name: "United Kingdom", easeOfBusiness: 7.9 },
  { key: "japan", name: "Japan", easeOfBusiness: 7.2 },
  { key: "mexico-cptpp", name: "Mexico / CPTPP", easeOfBusiness: 6.8 },
];

export type CategoryMarketProfile = {
  tariffRate: string;
  costFriction: CostFriction;
  attractiveness: Attractiveness;
};

type CategoryTariffTable = Record<string, CategoryMarketProfile>;

const DEFAULT_CATEGORY_DATA: CategoryTariffTable = {
  us: { tariffRate: "Varies", costFriction: "Medium", attractiveness: "Good" },
  eu: { tariffRate: "Varies", costFriction: "Medium", attractiveness: "Good" },
  uk: { tariffRate: "Varies", costFriction: "Medium", attractiveness: "Good" },
  japan: { tariffRate: "Varies", costFriction: "Medium", attractiveness: "Fair" },
  "mexico-cptpp": { tariffRate: "Varies", costFriction: "Medium", attractiveness: "Good" },
};

export const CATEGORY_TARIFF_DATA: Record<string, CategoryTariffTable> = {
  "Auto parts": {
    us: { tariffRate: "2.5%", costFriction: "Low", attractiveness: "Excellent" },
    eu: { tariffRate: "4.0%", costFriction: "Medium", attractiveness: "Good" },
    uk: { tariffRate: "2.0%", costFriction: "Medium", attractiveness: "Good" },
    japan: { tariffRate: "0%", costFriction: "High", attractiveness: "Fair" },
    "mexico-cptpp": { tariffRate: "0%", costFriction: "Medium", attractiveness: "Good" },
  },
  Electronics: {
    us: { tariffRate: "0–2.6%", costFriction: "Low", attractiveness: "Excellent" },
    eu: { tariffRate: "3.7%", costFriction: "Medium", attractiveness: "Good" },
    uk: { tariffRate: "2.5%", costFriction: "Medium", attractiveness: "Good" },
    japan: { tariffRate: "0%", costFriction: "Medium", attractiveness: "Good" },
    "mexico-cptpp": { tariffRate: "0%", costFriction: "Low", attractiveness: "Excellent" },
  },
  Furniture: {
    us: { tariffRate: "0–3%", costFriction: "Low", attractiveness: "Excellent" },
    eu: { tariffRate: "2.7%", costFriction: "Medium", attractiveness: "Good" },
    uk: { tariffRate: "0–2%", costFriction: "Medium", attractiveness: "Good" },
    japan: { tariffRate: "0%", costFriction: "High", attractiveness: "Fair" },
    "mexico-cptpp": { tariffRate: "0%", costFriction: "Medium", attractiveness: "Good" },
  },
  "Apparel & Textiles": {
    us: { tariffRate: "8–16%", costFriction: "Medium", attractiveness: "Good" },
    eu: { tariffRate: "8–12%", costFriction: "Medium", attractiveness: "Good" },
    uk: { tariffRate: "8–12%", costFriction: "Medium", attractiveness: "Good" },
    japan: { tariffRate: "5–10%", costFriction: "High", attractiveness: "Fair" },
    "mexico-cptpp": { tariffRate: "0%", costFriction: "Low", attractiveness: "Excellent" },
  },
  "Steel & Metals": {
    us: { tariffRate: "25%", costFriction: "High", attractiveness: "Challenging" },
    eu: { tariffRate: "0–15%", costFriction: "High", attractiveness: "Fair" },
    uk: { tariffRate: "0–15%", costFriction: "Medium", attractiveness: "Fair" },
    japan: { tariffRate: "0–4.7%", costFriction: "Medium", attractiveness: "Good" },
    "mexico-cptpp": { tariffRate: "0%", costFriction: "Medium", attractiveness: "Good" },
  },
  "Agri-food": {
    us: { tariffRate: "0–15%", costFriction: "Medium", attractiveness: "Good" },
    eu: { tariffRate: "10–20%", costFriction: "High", attractiveness: "Fair" },
    uk: { tariffRate: "5–15%", costFriction: "Medium", attractiveness: "Good" },
    japan: { tariffRate: "10–20%", costFriction: "High", attractiveness: "Fair" },
    "mexico-cptpp": { tariffRate: "0%", costFriction: "Low", attractiveness: "Excellent" },
  },
  Machinery: {
    us: { tariffRate: "0–2%", costFriction: "Low", attractiveness: "Excellent" },
    eu: { tariffRate: "1.7%", costFriction: "Medium", attractiveness: "Good" },
    uk: { tariffRate: "0–2%", costFriction: "Medium", attractiveness: "Good" },
    japan: { tariffRate: "0%", costFriction: "Medium", attractiveness: "Good" },
    "mexico-cptpp": { tariffRate: "0%", costFriction: "Low", attractiveness: "Excellent" },
  },
  Chemicals: {
    us: { tariffRate: "0–5%", costFriction: "Medium", attractiveness: "Good" },
    eu: { tariffRate: "4–6%", costFriction: "Medium", attractiveness: "Good" },
    uk: { tariffRate: "0–5%", costFriction: "Medium", attractiveness: "Good" },
    japan: { tariffRate: "0–3%", costFriction: "Medium", attractiveness: "Good" },
    "mexico-cptpp": { tariffRate: "0%", costFriction: "Low", attractiveness: "Excellent" },
  },
  "Other / Custom": DEFAULT_CATEGORY_DATA,
};

export function getCategoryTariffData(category: string | null): CategoryTariffTable {
  if (!category) return DEFAULT_CATEGORY_DATA;
  return CATEGORY_TARIFF_DATA[category] ?? DEFAULT_CATEGORY_DATA;
}
