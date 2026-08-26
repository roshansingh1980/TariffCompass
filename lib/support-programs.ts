/**
 * Real Government of Canada / Crown corporation programs relevant to
 * businesses navigating tariffs. Verified against official sources —
 * do not add programs without confirming an official government page.
 *
 * `importCaveat` is shown only for import scenarios, since these programs
 * are (accurately) aimed primarily at exporters. Nothing here should be
 * read as an eligibility check — it's a starting point for the user's
 * own research.
 */

export type SupportProgram = {
  name: string;
  description: string;
  whoItsFor: string;
  href: string;
  /** Shown only when the user's scenario is an import scenario. */
  importCaveat?: string;
};

export const SUPPORT_PROGRAMS: SupportProgram[] = [
  {
    name: "Regional Tariff Response Initiative (RTRI)",
    description:
      "Government of Canada funding delivered through regional development agencies to help tariff-impacted businesses adapt, diversify markets, and strengthen supply chains.",
    whoItsFor:
      "Small and medium-sized businesses affected by tariffs or trade disruption, including in the steel and manufacturing sectors.",
    href: "https://ised-isde.canada.ca/site/ised/en/regional-tariff-response-initiative",
  },
  {
    name: "CanExport SMEs",
    description:
      "Cost-shares eligible export marketing and market-entry expenses for Canadian small and medium-sized businesses, up to $50,000 per project.",
    whoItsFor: "Canadian SMEs with a clear plan to export goods or services to a new international market.",
    href: "https://www.tradecommissioner.gc.ca/en/our-solutions/funding-financing-international-business/canexport-smes.html",
    importCaveat: "Funds outbound export activity only — it doesn't apply if you're solely importing.",
  },
  {
    name: "BDC Pivot to Grow Loan",
    description:
      "Financing from $250,000 up to $5 million to help established exporters manage cash flow and adapt operations in response to U.S. tariffs.",
    whoItsFor:
      "Companies with at least 3 years of operating history and at least 15% of sales from U.S. exports.",
    href: "https://www.bdc.ca/en/financing/pivot-grow-loan",
    importCaveat: "Aimed at businesses exporting to the U.S. — not designed for import-only operations.",
  },
  {
    name: "EDC Trade Impact Program",
    description:
      "Financing, working capital support, trade credit insurance, and foreign exchange solutions to help exporters manage tariff-related pressures.",
    whoItsFor:
      "Canadian exporters and companies that supply exporters, particularly in sectors like steel, aluminum, and agri-food.",
    href: "https://www.edc.ca/en/campaign/trade-support-canadian-companies.html",
    importCaveat: "Focused on exporters and their suppliers — generally not applicable if you're only importing.",
  },
];
