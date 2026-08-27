export type UpdateEntry = {
  date: string;
  title: string;
  body: string[];
};

export const UPDATES: UpdateEntry[] = [
  {
    date: "2026-08-26",
    title: "Data reviewed following Section 338 and Canada's counter-tariffs",
    body: [
      "We reviewed the Steel & Metals, Auto parts, Agri-food, Apparel & Textiles, Machinery, Electronics, and Furniture data on the Results screen following the U.S. Section 338 tariff proclamations (effective August 2026) and Canada's matching counter-tariffs on U.S. goods (effective September 8, 2026).",
      "A few figures were corrected outright: Auto parts exports to the U.S. were incorrectly attributed to Section 338, which explicitly excludes auto parts and finished vehicles — that row now reflects the separate, older Section 232 regime and its USMCA exemption. Steel & Metals import rates were updated to reflect Canada's counter-tariff increase to 50%, and Electronics imports moved from an unresolved \"unknown\" status to a confirmed but still-estimated range.",
      "Every one of these rows remains marked as an estimate, not an official determination — we checked several primary Government of Canada and U.S. sources directly and were unable to load them (they block automated access), so figures are corroborated through multiple independent trade-compliance sources rather than a government page we could read ourselves. Where we couldn't confirm a number with real confidence, we left it unchanged rather than guess.",
      "See the Results screen for the current source and \"last updated\" date on each row.",
    ],
  },
];
