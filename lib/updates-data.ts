export type UpdateEntry = {
  date: string;
  title: string;
  body: string[];
};

export const UPDATES: UpdateEntry[] = [
  {
    date: "2026-08-27",
    title: "Correction: primary government tariff sources are not blocked",
    body: [
      "Our August 26 entry below said we checked primary Government of Canada and U.S. sources directly and couldn't load them because they block automated access. That was wrong, and we want to say so plainly rather than quietly fix the wording.",
      "We re-checked five primary sources — the U.S. Harmonized Tariff Schedule, the CBSA Customs Tariff, the U.S. Federal Register (where Section 232 and Section 338 measures and their effective dates are actually published), Canada's open data portal, and the Canada Gazette — using a request that identifies itself as TariffCompass rather than a generic script. Every one of them responded normally. The only genuine block we found was on the U.S. International Trade Commission's main corporate website (www.usitc.gov) — a different host from the one the tariff data itself lives on (hts.usitc.gov), which was open the whole time, including a working JSON search endpoint.",
      "So the earlier claim was simply incorrect: it wasn't that these sources block automated access in general — our first attempt likely just wasn't identifying itself properly, or hit the one host that does block. It doesn't mean every rate can be pulled from a clean, structured feed today — some of what these sources publish is legal text or scanned tables rather than a database field, which is a real, separate limitation we're still working through — but access itself was never the barrier we said it was.",
      "We're leaving the original entry below exactly as written rather than editing it, because the record of what we got wrong is part of what this log is for.",
    ],
  },
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
