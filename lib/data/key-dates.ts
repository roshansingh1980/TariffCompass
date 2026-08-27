/**
 * Calendar of dated tariff/trade measures shown on the homepage's "What's
 * coming" section. Every entry maps to a source already cited (and fetched)
 * elsewhere in this codebase — see lib/data/source-registry.ts — and to only
 * the categories lib/data/db-market-data.ts itself already attributes to
 * that exact measure. No new research went into this file; it restructures
 * what the app already knows into a chronological view.
 *
 * Shape mirrors the Postgres `key_dates` table columns 1:1 (effective_date,
 * title, description, affected_categories, source, confidence, last_checked)
 * so this can move over later without reshaping. That table exists
 * (migration 006) but isn't queried yet — this file is still the source of
 * truth the homepage reads from.
 */

export type KeyDateConfidence = "official" | "estimated";

export type KeyDate = {
  id: string;
  effectiveDate: string; // ISO yyyy-mm-dd
  title: string;
  description: string;
  affectedCategories: string[]; // matches lib/onboarding-data.ts's CATEGORIES
  sourceName: string;
  sourceUrl: string;
  confidence: KeyDateConfidence;
  lastChecked: string; // ISO yyyy-mm-dd
};

export const KEY_DATES: KeyDate[] = [
  {
    id: "counter-tariffs-sept-2026",
    effectiveDate: "2026-09-08",
    title: "Canada's counter-tariffs on U.S. goods take effect",
    description:
      "Canada's surtax on selected U.S.-origin goods increases across three duty tiers (15%/25%/50%). Steel & Metals' existing 25% surtax rises to 50%; Electronics moves from unresolved to a confirmed but still-estimated range.",
    affectedCategories: ["Steel & Metals", "Electronics"],
    sourceName: "GHY — Canada to Impose New Counter-Tariffs on U.S. Goods (Sept 2026)",
    sourceUrl: "https://www.ghy.com/trade-compliance/canada-counter-tariffs-us-goods-september-2026/",
    confidence: "estimated",
    lastChecked: "2026-08-26",
  },
  {
    id: "section-338-motor-vehicle-annex",
    effectiveDate: "2026-08-22",
    title: "U.S. Section 338 — Motor Vehicle Annex takes effect",
    description:
      "Proclamation 11048 adds a flat 50% duty on a broad list of Canadian goods — despite its name, mostly non-vehicle categories like furniture, textiles, and electronics — with no CUSMA exemption for covered lines.",
    affectedCategories: ["Furniture", "Apparel & Textiles", "Electronics", "Machinery", "Agri-food"],
    sourceName: "Thomson Reuters Tax & Accounting — Section 338 tariffs on Canada",
    sourceUrl:
      "https://tax.thomsonreuters.com/blog/section-338-tariffs-on-canada-what-businesses-may-be-missing-beyond-the-headline-categories/",
    confidence: "estimated",
    lastChecked: "2026-08-26",
  },
  {
    id: "section-338-dairy-annex",
    effectiveDate: "2026-08-22",
    title: "U.S. Section 338 — Dairy Annex takes effect",
    description:
      "Proclamation 11047 puts Canadian dairy, casein, and related products at a flat 50% duty, separate from the broader Motor Vehicle Annex.",
    affectedCategories: ["Agri-food"],
    sourceName: "Thomson Reuters Tax & Accounting — Section 338 tariffs on Canada",
    sourceUrl:
      "https://tax.thomsonreuters.com/blog/section-338-tariffs-on-canada-what-businesses-may-be-missing-beyond-the-headline-categories/",
    confidence: "estimated",
    lastChecked: "2026-08-26",
  },
  {
    id: "section-232-grid-equipment-carveout",
    effectiveDate: "2026-06-08",
    title: "Section 232 carve-out for industrial/electrical grid equipment",
    description:
      "A narrower 15% rate applies to certain industrial and electrical grid equipment through 2027, inside the broader Section 232 steel/aluminum/copper regime.",
    affectedCategories: ["Steel & Metals"],
    sourceName: "EDC — U.S. Steel and Aluminum Tariffs: What Exporters Need to Know",
    sourceUrl: "https://www.edc.ca/en/article/us-steel-and-aluminum-tariffs.html",
    confidence: "estimated",
    lastChecked: "2026-08-26",
  },
  {
    id: "section-232-restructuring",
    effectiveDate: "2026-04-02",
    title: "Section 232 steel/aluminum/copper tariffs restructured",
    description:
      "Duties move to tiered rates of 10%–50% assessed on full customs value (not just metal content), with goods under 15% subject-metal content exempt as de minimis.",
    affectedCategories: ["Steel & Metals"],
    sourceName: "EDC — U.S. Steel and Aluminum Tariffs: What Exporters Need to Know",
    sourceUrl: "https://www.edc.ca/en/article/us-steel-and-aluminum-tariffs.html",
    confidence: "estimated",
    lastChecked: "2026-08-26",
  },
];
