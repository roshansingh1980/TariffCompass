import type { MarketDataRow } from "@/lib/data/db-market-data";

export type ResponseSource = {
  name: string;
  url: string;
  authority: "official";
};

export type ResponseInvestigation = {
  title: string;
  detail: string;
  source?: ResponseSource;
  label: "fact to verify" | "suggested investigation" | "question for adviser";
};

export type PracticalResponseIntelligence = {
  coverage: "covered" | "limited";
  coverageNote: string;
  sourcingAlternatives: ResponseInvestigation[];
  tradeAgreementConsiderations: ResponseInvestigation[];
  governmentPrograms: ResponseInvestigation[];
  adviserQuestions: ResponseInvestigation[];
  managementActions: ResponseInvestigation[];
};

const CUSMA_SOURCE: ResponseSource = {
  name: "Global Affairs Canada — CUSMA implementation statement",
  url: "https://www.international.gc.ca/trade-commerce/trade-agreements-accords-commerciaux/agr-acc/cusma-aceum/implementation-mise_en_oeuvre.aspx?lang=eng",
  authority: "official",
};

const FINANCE_CANADA_SOURCE: ResponseSource = {
  name: "Department of Finance Canada — August 25, 2026 countermeasures announcement",
  url: "https://www.canada.ca/en/department-finance/news/2026/08/canada-announces-targeted-countermeasures-and-substantive-support-for-workers-and-businesses-in-response-to-us-tariffs.html",
  authority: "official",
};

function money(value: number | null, currency: string | null): string {
  if (value == null || !Number.isFinite(value)) return "the estimated annual exposure";
  return `${currency || "CAD"} ${Math.round(value).toLocaleString("en-CA")}`;
}

export function buildPracticalResponseIntelligence(input: {
  hsCode: string | null;
  productDescription: string | null;
  scenario: string | null;
  annualIncrementalExposure: number | null;
  currency: string | null;
  comparisonRows: readonly MarketDataRow[];
}): PracticalResponseIntelligence {
  const covered = input.hsCode?.replace(/\D/g, "") === "851713" && input.scenario === "import-us";
  if (!covered) {
    return {
      coverage: "limited",
      coverageNote: "TariffCompass does not yet have a verified practical-response playbook for this product and route. Review the sourced tariff result and confirm next steps with the appropriate trade professional.",
      sourcingAlternatives: [],
      tradeAgreementConsiderations: [],
      governmentPrograms: [],
      adviserQuestions: [],
      managementActions: [],
    };
  }

  const sourcingAlternatives = input.comparisonRows
    .filter((row) => row.market.key !== "us" && row.sourceUrl !== "#")
    .slice(0, 4)
    .map<ResponseInvestigation>((row) => ({
      title: row.market.name,
      detail: `${row.specificity === "hs" ? "HS-specific" : "Category-level"} comparison: ${row.tariffRate} displayed treatment; ${row.tariffConfidence} confidence. Treat this as a screening comparison, not a landed-cost conclusion.`,
      source: { name: row.sourceName, url: row.sourceUrl, authority: "official" },
      label: "fact to verify",
    }));

  return {
    coverage: "covered",
    coverageNote: "Narrow launch coverage for smartphones (HS 851713) imported from the United States. These are investigation paths, not customs, legal, program-eligibility, or sourcing recommendations.",
    sourcingAlternatives,
    tradeAgreementConsiderations: [{
      title: "Review CUSMA origin treatment separately from the counter-tariff",
      detail: "U.S. shipment origin alone does not establish CUSMA eligibility. Ask whether the goods satisfy the applicable CUSMA origin requirements and whether preferential base treatment changes any part of the analysis. The additional counter-tariff applicability must be reviewed separately.",
      source: CUSMA_SOURCE,
      label: "fact to verify",
    }],
    governmentPrograms: [{
      title: "BDC tariff-related programs",
      detail: "Potential financing support to review. Finance Canada announced broadened access to BDC tariff-related programs, including a lower minimum applicant revenue threshold. No eligibility or deadline has been determined for this business.",
      source: FINANCE_CANADA_SOURCE,
      label: "fact to verify",
    }],
    adviserQuestions: [
      { title: "Customs broker", detail: "Is HS 851713 correct for these smartphones, does the shipment meet the measure's origin condition, and are any exclusions or remission measures relevant?", label: "question for adviser" },
      { title: "Accountant or fractional CFO", detail: `What gross-margin, pricing, cash-flow, and working-capital effects follow from ${money(input.annualIncrementalExposure, input.currency)} of estimated annual incremental exposure?`, label: "question for adviser" },
      { title: "Legal counsel, if contracts make it relevant", detail: "Do supplier or customer contracts permit tariff pass-through, repricing, or renegotiation?", label: "question for adviser" },
    ],
    managementActions: [
      { title: "Validate the decision inputs", detail: "Confirm classification, origin evidence, shipment timing, annual purchase value, and current supplier terms before acting.", label: "suggested investigation" },
      { title: "Screen supply options", detail: "Ask current and alternative suppliers about production origin, lead times, minimum volumes, quality controls, and total switching cost.", label: "suggested investigation" },
      { title: "Model commercial responses", detail: "Review which purchase volumes can shift, which contracts permit repricing, and whether inventory should be accelerated or delayed around the effective date.", label: "suggested investigation" },
    ],
  };
}

