/**
 * Review log for the AI market-data refresh job (see lib/ai/refresh-market-data.ts).
 *
 * The refresh job never writes to market-data.ts directly — it only
 * *proposes* changes. A human reviews each proposal, and only once accepted
 * copies the new value (and its confidence/source/date) into market-data.ts
 * by hand, then records what happened here for history.
 *
 * This is a v1, file-based log — fine for the current single-maintainer
 * workflow. If review volume grows, replace this with a database table
 * without changing the shape below.
 */

export type ProposedChange = {
  category: string;
  direction: "export" | "import";
  marketKey: string;
  field: "tariffRate" | "costFriction" | "attractiveness";
  oldValue: string;
  proposedValue: string;
  proposedConfidence: "official" | "estimated" | "unknown";
  reason: string;
  sourceName: string;
  sourceUrl: string;
  /** True whenever the model wasn't confident enough to propose a precise replacement. */
  reviewNeeded: boolean;
};

export type RefreshLogEntry = {
  runAt: string;
  summary: string;
  changes: ProposedChange[];
  /** "applied" once a human has copied accepted changes into market-data.ts. */
  status: "proposed" | "applied" | "dismissed";
};

/**
 * Historical runs. Append an entry here (status: "applied" or "dismissed")
 * after acting on a proposal from POST /api/refresh-data, so there's a
 * durable record of what changed, why, and when.
 */
export const REFRESH_LOG: RefreshLogEntry[] = [
  {
    runAt: "2026-08-26T09:12:17.658Z",
    summary:
      "The 2026-08-26 AI refresh run flagged that U.S. Section 338 (50% duty on a broad range of Canadian goods, effective Aug. 2026) and Canada's matching counter-tariffs (15/25/50%, effective Sept. 8, 2026) had made most U.S.-facing export/import rows stale. Re-checked against fetchable sources (CFIB's tariff tracker and a Thomson Reuters Section 338 explainer — the Government of Canada Finance and Trade Commissioner Service pages the run originally cited returned 403 on direct fetch) and hand-applied category-level updates where those sources gave a clean rate; left several as an explicit range or 'reviewNeeded' note where coverage was HS-code-dependent rather than category-wide.",
    status: "applied",
    changes: [
      {
        category: "Steel & Metals",
        direction: "export",
        marketKey: "us",
        field: "tariffRate",
        oldValue: "25%",
        proposedValue: "15–50%",
        proposedConfidence: "estimated",
        reason:
          "Section 232 derivative steel/aluminum products dropped from 25% to 15% (10% if ≥85% U.S.-sourced) effective June 8, 2026; base/primary steel rate not clearly restated in fetchable sources.",
        sourceName: "CFIB — Canada-U.S. Tariffs Tracker",
        sourceUrl: "https://www.cfib-fcei.ca/en/site/us-tariffs",
        reviewNeeded: true,
      },
      {
        category: "Steel & Metals",
        direction: "import",
        marketKey: "us",
        field: "tariffRate",
        oldValue: "0% (CUSMA)",
        proposedValue: "25%",
        proposedConfidence: "estimated",
        reason:
          "Canada's Sept. 8, 2026 counter-tariffs keep a confirmed 25% surtax on selected U.S. steel and aluminum products.",
        sourceName: "CFIB — Canada-U.S. Tariffs Tracker",
        sourceUrl: "https://www.cfib-fcei.ca/en/site/us-tariffs",
        reviewNeeded: false,
      },
      {
        category: "Auto parts",
        direction: "export",
        marketKey: "us",
        field: "tariffRate",
        oldValue: "2.5%",
        proposedValue: "50%",
        proposedConfidence: "estimated",
        reason:
          "Section 338 proclamation adds 50% on covered motor-vehicle-sector goods effective Aug. 2026, no CUSMA exemption; exact part-level coverage not independently confirmed.",
        sourceName: "CFIB — Canada-U.S. Tariffs Tracker",
        sourceUrl: "https://www.cfib-fcei.ca/en/site/us-tariffs",
        reviewNeeded: true,
      },
      {
        category: "Electronics",
        direction: "export",
        marketKey: "us",
        field: "tariffRate",
        oldValue: "0–2.6%",
        proposedValue: "50%",
        proposedConfidence: "estimated",
        reason: "Electronics/telecom equipment named in the Section 338 annex at 50%, effective Aug. 2026.",
        sourceName: "CFIB — Canada-U.S. Tariffs Tracker",
        sourceUrl: "https://www.cfib-fcei.ca/en/site/us-tariffs",
        reviewNeeded: false,
      },
      {
        category: "Electronics",
        direction: "import",
        marketKey: "us",
        field: "tariffRate",
        oldValue: "0%",
        proposedValue: "Unknown",
        proposedConfidence: "unknown",
        reason:
          "Unconfirmed reporting suggested electronics may be covered by Canada's counter-tariffs, but no category-level rate could be independently confirmed — downgraded rather than guessed.",
        sourceName: "CFIB — Canada-U.S. Tariffs Tracker",
        sourceUrl: "https://www.cfib-fcei.ca/en/site/us-tariffs",
        reviewNeeded: true,
      },
      {
        category: "Furniture",
        direction: "export",
        marketKey: "us",
        field: "tariffRate",
        oldValue: "0–3%",
        proposedValue: "50%",
        proposedConfidence: "estimated",
        reason: "Furniture/home goods named in the Section 338 annex at 50%, effective Aug. 2026.",
        sourceName: "Thomson Reuters Tax & Accounting — Section 338 tariffs on Canada",
        sourceUrl: "https://tax.thomsonreuters.com/blog/section-338-tariffs-on-canada-what-businesses-may-be-missing-beyond-the-headline-categories/",
        reviewNeeded: false,
      },
      {
        category: "Apparel & Textiles",
        direction: "export",
        marketKey: "us",
        field: "tariffRate",
        oldValue: "8–16%",
        proposedValue: "50%",
        proposedConfidence: "estimated",
        reason: "Clothing/footwear/luggage named in the Section 338 annex at 50%, effective Aug. 2026.",
        sourceName: "CFIB — Canada-U.S. Tariffs Tracker",
        sourceUrl: "https://www.cfib-fcei.ca/en/site/us-tariffs",
        reviewNeeded: false,
      },
      {
        category: "Agri-food",
        direction: "export",
        marketKey: "us",
        field: "tariffRate",
        oldValue: "0–15%",
        proposedValue: "0–15% (dairy 50%)",
        proposedConfidence: "estimated",
        reason:
          "Dairy (milk/cream/whey) singled out for a 50% Section 338 duty effective Aug. 2026; seeds also named. Rest of the broad Agri-food category not confirmed as covered, so the prior range is kept for everything else.",
        sourceName: "CFIB — Canada-U.S. Tariffs Tracker",
        sourceUrl: "https://www.cfib-fcei.ca/en/site/us-tariffs",
        reviewNeeded: true,
      },
      {
        category: "Machinery",
        direction: "export",
        marketKey: "us",
        field: "tariffRate",
        oldValue: "0–2%",
        proposedValue: "15–50%",
        proposedConfidence: "estimated",
        reason:
          "Section 232 derivative machinery (ag/HVAC/industrial equipment) at 15%; a separate Section 338 annex applies 50% to \"machinery and manufacturing inputs\" — coverage is HS-code specific.",
        sourceName: "CFIB — Canada-U.S. Tariffs Tracker",
        sourceUrl: "https://www.cfib-fcei.ca/en/site/us-tariffs",
        reviewNeeded: true,
      },
    ],
  },
  {
    runAt: "2026-08-26T18:40:00.000Z",
    summary:
      "Phase 1 'worth C$99' review of the 14 US export/import rows across Steel & Metals, Auto parts, Agri-food, Apparel & Textiles, Machinery, Electronics, and Furniture. Attempted to verify each against a primary Government of Canada/U.S. source directly; canada.ca, gazette.gc.ca, federalregister.gov, cbp.gov, and congress.gov all blocked automated fetch (403s or a redirect wall — see sources.ts's trailing comment for the full list), so no row was raised to 'official'. Real corrections were still made using secondary sources that WERE fetchable and gave specific, well-corroborated detail: (1) Auto parts export/us was citing the wrong mechanism entirely — Section 338's Motor Vehicle Annex explicitly excludes finished vehicles and auto parts, which actually remain under the older Section 232 25% regime with a USMCA self-certification exemption most Canadian auto-parts trade already qualifies for; (2) Steel & Metals import/us's 25% counter-tariff surtax increases to 50% (matching the U.S. rate) effective Sept. 8, 2026; (3) Steel & Metals export/us's Section 232 structure was corrected to the actual tiered 10%-50% full-customs-value basis; (4) Electronics import/us moved from 'unknown' to 'estimated' now that the sector is confirmed on Canada's Sept. 8 counter-tariff list, with the rate expressed as the full 15/25/50% range since the specific tier wasn't confirmed. Furniture, Apparel & Textiles, Machinery, and the dairy portion of Agri-food (export/us) were already accurate — only their rationale text was tightened to cite the specific proclamation number and HTS heading (11048/9903.03.14 Motor Vehicle Annex, 11047/9903.03.13 Dairy Annex) now that those were identified.",
    status: "applied",
    changes: [
      {
        category: "Steel & Metals",
        direction: "export",
        marketKey: "us",
        field: "tariffRate",
        oldValue: "15–50%",
        proposedValue: "10–50%",
        proposedConfidence: "estimated",
        reason:
          "Section 232 steel/aluminum/copper duties were restructured April 2, 2026 into tiered 10%-50% rates on full customs value, not the flat 15%/10% previously recorded; a narrower 15% carve-out exists only for certain industrial/electrical grid equipment through 2027.",
        sourceName: "EDC — U.S. Steel and Aluminum Tariffs: What Exporters Need to Know",
        sourceUrl: "https://www.edc.ca/en/article/us-steel-and-aluminum-tariffs.html",
        reviewNeeded: true,
      },
      {
        category: "Steel & Metals",
        direction: "import",
        marketKey: "us",
        field: "tariffRate",
        oldValue: "25%",
        proposedValue: "50%",
        proposedConfidence: "estimated",
        reason:
          "Canada's existing 25% counter-tariff on U.S. steel/aluminum increases to 50% (matching the U.S. rate) effective September 8, 2026.",
        sourceName: "GHY — Canada to Impose New Counter-Tariffs on U.S. Goods (Sept 2026)",
        sourceUrl: "https://www.ghy.com/trade-compliance/canada-counter-tariffs-us-goods-september-2026/",
        reviewNeeded: false,
      },
      {
        category: "Auto parts",
        direction: "export",
        marketKey: "us",
        field: "tariffRate",
        oldValue: "50%",
        proposedValue: "0–25%",
        proposedConfidence: "estimated",
        reason:
          "Auto parts are explicitly excluded from Section 338's Motor Vehicle Annex despite its name; they remain under the separate, older Section 232 25% regime, with a USMCA self-certification exemption most Canada-U.S. auto-parts trade already claims.",
        sourceName: "Dutiable — Section 232 Covered Auto Parts (2026)",
        sourceUrl: "https://dutiable.io/blog/section-232-covered-auto-parts-2026-list-explained",
        reviewNeeded: true,
      },
      {
        category: "Auto parts",
        direction: "export",
        marketKey: "us",
        field: "costFriction",
        oldValue: "High",
        proposedValue: "Medium",
        proposedConfidence: "estimated",
        reason:
          "Follows from the Section 232 (not 338) correction above — most qualifying trade faces compliance/self-certification friction, not a blanket 50% duty.",
        sourceName: "Dutiable — Section 232 Covered Auto Parts (2026)",
        sourceUrl: "https://dutiable.io/blog/section-232-covered-auto-parts-2026-list-explained",
        reviewNeeded: true,
      },
      {
        category: "Auto parts",
        direction: "export",
        marketKey: "us",
        field: "attractiveness",
        oldValue: "Challenging",
        proposedValue: "Good",
        proposedConfidence: "estimated",
        reason:
          "Roughly 85% of Canada-U.S. auto-sector trade claimed the USMCA exemption as of early 2026, producing a low blended effective rate rather than the flat 50% previously assumed under the (incorrect) Section 338 mechanism.",
        sourceName: "Dutiable — Section 232 Covered Auto Parts (2026)",
        sourceUrl: "https://dutiable.io/blog/section-232-covered-auto-parts-2026-list-explained",
        reviewNeeded: true,
      },
      {
        category: "Electronics",
        direction: "import",
        marketKey: "us",
        field: "tariffRate",
        oldValue: "Unknown",
        proposedValue: "15–50%",
        proposedConfidence: "estimated",
        reason:
          "Electronics is now confirmed as a named sector on Canada's Sept. 8, 2026 counter-tariff list (three tiers: 15%/25%/50%); the specific tier for a given HS line remains unconfirmed, so the full range is used rather than a guessed single figure.",
        sourceName: "GHY — Canada to Impose New Counter-Tariffs on U.S. Goods (Sept 2026)",
        sourceUrl: "https://www.ghy.com/trade-compliance/canada-counter-tariffs-us-goods-september-2026/",
        reviewNeeded: true,
      },
    ],
  },
];
