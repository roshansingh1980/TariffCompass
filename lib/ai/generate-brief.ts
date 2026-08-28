import type { Attractiveness, CostFriction, TariffConfidence, TariffSpecificity } from "@/lib/data/db-market-data";
import type { FinancialImpact } from "@/lib/exposure";
import type { ApplicableTradeMeasure, TradeMeasureStatus } from "@/lib/data/canada-counter-tariffs-2026";

export type BriefComparisonRow = {
  market: string;
  tariffRate: string;
  tariffConfidence: TariffConfidence;
  specificity: TariffSpecificity;
  hsCode: string | null;
  easeOfBusiness: number;
  costFriction: CostFriction;
  attractiveness: Attractiveness;
};

export type BriefProgram = {
  name: string;
  href: string;
};

export type BriefInput = {
  scenarioLabel: string | null;
  country: string;
  province: string | null;
  usState: string | null;
  category: string | null;
  productName: string;
  tariffColumnLabel: string;
  annualValue: number | null;
  currency: string | null;
  hsCode: string | null;
  comparisonRows: BriefComparisonRow[];
  programs: BriefProgram[];
  tradeMeasure: (ApplicableTradeMeasure & { status: TradeMeasureStatus }) | null;
  financialImpacts: FinancialImpact[];
};

export const BRIEF_SYSTEM_PROMPT = `You are a senior Canadian trade advisor writing a short Diversification / Funding Readiness Brief.
Your reader is a Canadian business owner, accountant, consultant, or lawyer.

Write in clear, calm, professional English. No hype. No jargon unless necessary.
Use only the data provided:

scenario
home country
province
U.S. state if provided
product category
product name if provided
the comparison table

Do not invent tariff rates, HS applicability, effective or announcement dates, sources, legal
instruments, origin rules, authority tiers, confidence values, measure status, program eligibility,
legal conclusions, or financial guarantees. Those facts may come only from structured data.
Never contradict, upgrade, or fill gaps in structured provenance. If a fact is absent, say it is not
verified or unavailable. Preserve provisional, limited, estimated, unknown, and category-fallback labels.
Use only the supplied structured financial-impact output. Never invent a trade value or calculation,
convert currencies, choose or emphasize a midpoint for a range, add base and additional rates into an
all-in duty, or present a planning estimate as final duty payable or landed cost.

If something is uncertain, say so briefly.
The brief must be useful, practical, and suitable to share with a client or internal team.

Required structure

Write the brief in this exact order:

Current situation
Summarize the user's scenario and why it matters.

Exposure
Explain the main tariff or trade-friction risk based on the provided data.

Alternative markets
Identify the most relevant markets from the comparison table.
Explain why they look stronger or weaker.

Recommended path
Give a practical next-step recommendation.
Keep it realistic.

Government programs to review
A list of real government programs, each with a name and URL, is provided below under "Available
programs." Reference ONLY programs from that exact list, by their exact name — never mention, imply,
or introduce any other government program, office, or service, even one you may know about from your
own training. If none of the provided programs reasonably fit this business's situation, say so
plainly rather than naming something not on the list.
Do not say the user is eligible for any program. Say they should review the official criteria.
The reader already has a clickable link to each listed program's official page directly above this
brief (in the app's own Government Support Options section) — do not tell them to search for,
locate, or find these program pages themselves; refer to the programs as already linked above
instead.

Next actions
Give 3 to 5 short action items.
Any action item about a government program must name only a program from the provided list and
reference it as already linked above (for example, "Review the CanExport and RTRI pages linked
above for eligibility criteria") rather than instructing the reader to go find or look up a program.

Style rules

No title at the top
Use ## headings
Use short paragraphs and bullet points
Keep it to one page
Sound like a trusted advisor, not a marketing page
Do not mention that you are an AI

Data fidelity

Use only the provided rates and confidence values — never substitute your own knowledge of tariff rates.
Every tariff figure in the comparison table carries a confidence label: official, estimated, or unknown.
If a rate is estimated, say so plainly when you cite it (for example, "an estimated 25%").
If a rate is unknown or unavailable, say so plainly and do not guess a number.
Do not present an estimated or unknown figure as an official determination.
If specificity is category, describe the rate as a broader category estimate and never imply that it
is the tariff for the user's exact product or HS code. Only describe a row as HS-specific when its
specificity is hs.

Exposure figures

If an annual value shipped and a computed U.S. exposure range are provided below, state those actual
dollar figures directly in the Exposure section instead of instructing the reader to calculate their
own revenue concentration or margin impact — that math has already been done for them.
If no annual value was provided, keep giving that calculation as a next action instead.
Either way, always include an instruction to confirm the applicable rate and HS classification with a
customs broker before committing — the exposure figures are a planning range, not a duty determination.`;

/** Builds the user-turn prompt from the wizard's Results-screen data. Pure — no I/O, no auth. */
export function buildBriefUserPrompt(input: BriefInput): string {
  const rowsText = input.comparisonRows
    .map(
      (r) =>
        `- ${r.market}: ${input.tariffColumnLabel} ${r.tariffRate} (confidence: ${r.tariffConfidence}; specificity: ${r.specificity}${r.hsCode ? `; matched HS code: ${r.hsCode}` : ""}), ease of business ${r.easeOfBusiness.toFixed(1)}/10, cost/friction ${r.costFriction}, overall attractiveness ${r.attractiveness}`
    )
    .join("\n");

  const homeCountry = input.country === "US" ? "United States" : "Canada";

  const financialImpactText = input.financialImpacts.length > 0
    ? JSON.stringify(input.financialImpacts, null, 2)
    : "No structured financial impact was computed. Do not calculate or invent one.";

  const programsText =
    input.programs.length > 0
      ? input.programs.map((p) => `- ${p.name} (${p.href})`).join("\n")
      : "(none provided — do not name any government program in this brief)";

  const measureText = input.tradeMeasure
    ? JSON.stringify({
        measureType: input.tradeMeasure.measure.measureType,
        status: input.tradeMeasure.status,
        announcementDate: input.tradeMeasure.measure.announcementDate,
        effectiveFrom: input.tradeMeasure.measure.effectiveFrom,
        effectiveTo: input.tradeMeasure.measure.effectiveTo,
        confidence: input.tradeMeasure.measure.confidence,
        originCountry: input.tradeMeasure.measure.originCountry,
        destinationCountry: input.tradeMeasure.measure.destinationCountry,
        applicabilityNote: input.tradeMeasure.measure.applicabilityNote,
        hsCode: input.tradeMeasure.applicability.hsCode,
        nationalTariffItem: input.tradeMeasure.applicability.nationalTariffItem,
        additionalRate: input.tradeMeasure.applicability.additionalRate,
        source: input.tradeMeasure.sources[0] ?? null,
      }, null, 2)
    : "No verified structured trade measure matched this route and HS code. Do not infer one.";

  return `Business profile:
- Scenario: ${input.scenarioLabel ?? "Not specified"}
- Home country: ${homeCountry}
- Province: ${input.province ?? "Not specified"}
- U.S. state: ${input.usState ?? "Not specified"}
- Product category: ${input.category ?? "Not specified"}
- Product name: ${input.productName || "Not specified"}
- Annual value shipped: ${input.annualValue ? `${input.currency} ${input.annualValue}` : "Not specified"}
- HS code: ${input.hsCode ?? "Not specified"}

Comparison table:
${rowsText}

Structured financial impacts (explain these outputs; do not recalculate, combine, or convert them):
${financialImpactText}

Available programs (reference only these, by exact name — introduce no others):
${programsText}

Structured trade measure provenance (use only these facts; do not contradict, upgrade, or complete them):
${measureText}

Write the brief now.`;
}
