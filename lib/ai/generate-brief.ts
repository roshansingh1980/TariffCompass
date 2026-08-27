"use server";

import Anthropic from "@anthropic-ai/sdk";
import type { Attractiveness, CostFriction, TariffConfidence } from "@/lib/data/db-market-data";
import { computeExposure } from "@/lib/exposure";
import { createClient } from "@/lib/supabase/server";

export type BriefComparisonRow = {
  market: string;
  tariffRate: string;
  tariffConfidence: TariffConfidence;
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
};

export type BriefResult = { brief: string } | { error: string } | { requiresUpgrade: true };

const SYSTEM_PROMPT = `You are a senior Canadian trade advisor writing a short Diversification / Funding Readiness Brief.
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

Do not invent tariff rates, program eligibility, legal conclusions, or financial guarantees.

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

Exposure figures

If an annual value shipped and a computed U.S. exposure range are provided below, state those actual
dollar figures directly in the Exposure section instead of instructing the reader to calculate their
own revenue concentration or margin impact — that math has already been done for them.
If no annual value was provided, keep giving that calculation as a next action instead.
Either way, always include an instruction to confirm the applicable rate and HS classification with a
customs broker before committing — the exposure figures are a planning range, not a duty determination.`;

export async function generateBrief(input: BriefInput): Promise<BriefResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Please log in to generate a brief." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_status")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.subscription_status !== "active") {
    return { requiresUpgrade: true };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { error: "AI brief generation isn't configured yet." };
  }

  try {
    const client = new Anthropic({ apiKey });

    const rowsText = input.comparisonRows
      .map(
        (r) =>
          `- ${r.market}: ${input.tariffColumnLabel} ${r.tariffRate} (confidence: ${r.tariffConfidence}), ease of business ${r.easeOfBusiness.toFixed(1)}/10, cost/friction ${r.costFriction}, overall attractiveness ${r.attractiveness}`
      )
      .join("\n");

    const homeCountry = input.country === "US" ? "United States" : "Canada";

    const usRow = input.comparisonRows.find((r) => r.market === "United States");
    const exposure =
      input.annualValue && input.annualValue > 0 && usRow
        ? computeExposure(input.annualValue, usRow.tariffRate)
        : null;

    const exposureText = exposure
      ? `\nEstimated U.S. exposure (already computed, state these figures directly): ${input.currency} ${exposure.lowAmount.toFixed(0)} at ${exposure.lowRate}%, ${input.currency} ${exposure.midAmount.toFixed(0)} at ${exposure.midRate}%, ${input.currency} ${exposure.highAmount.toFixed(0)} at ${exposure.highRate}%.`
      : "";

    const programsText =
      input.programs.length > 0
        ? input.programs.map((p) => `- ${p.name} (${p.href})`).join("\n")
        : "(none provided — do not name any government program in this brief)";

    const userPrompt = `Business profile:
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
${exposureText}

Available programs (reference only these, by exact name — introduce no others):
${programsText}

Write the brief now.`;

    const response = await client.messages.create({
      model: "claude-opus-5",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });

    const textBlock = response.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return { error: "The brief could not be generated. Please try again." };
    }

    return { brief: textBlock.text };
  } catch (error) {
    console.error("Failed to generate AI brief:", error);
    return { error: "Something went wrong generating your brief. Please try again." };
  }
}
