"use server";

import Anthropic from "@anthropic-ai/sdk";
import type { Attractiveness, CostFriction } from "@/lib/market-data";
import { createClient } from "@/lib/supabase/server";

export type BriefComparisonRow = {
  market: string;
  tariffRate: string;
  easeOfBusiness: number;
  costFriction: CostFriction;
  attractiveness: Attractiveness;
};

export type BriefInput = {
  scenarioLabel: string | null;
  country: string;
  province: string | null;
  usState: string | null;
  category: string | null;
  productName: string;
  tariffColumnLabel: string;
  comparisonRows: BriefComparisonRow[];
};

export type BriefResult = { brief: string } | { error: string } | { requiresUpgrade: true };

const SYSTEM_PROMPT = `You are a trade advisor writing a concise, professional brief for a
Canadian small or medium-sized business that is thinking about diversifying its export or
import markets in response to tariffs.

Using the business profile and market comparison data provided, write a "Diversification &
Funding Readiness Brief". Do not include a title line — the app already displays one above
your response. Start directly with the first heading below, using "## " before each heading:

## Summary
2-3 sentences on the business's overall situation and the single biggest opportunity or risk.

## Market Diversification Options
A short assessment of the strongest one or two alternative markets from the comparison data,
and why — reference the actual tariff, friction, and attractiveness figures given.

## Funding Readiness
A brief, honest note on what kind of government support (tariff relief, export financing,
working capital) is generally most relevant given their situation. Do not name specific
programs, dollar amounts, or guarantee eligibility — the app shows real programs elsewhere.

## Suggested Next Steps
3-4 concrete, practical next steps as a bullet list, each line starting with "- ".

Keep the tone calm, direct, and professional, like a knowledgeable advisor — not a sales
pitch. Do not fabricate statistics beyond what's given in the data. Do not use markdown bold
or italics. End with one short sentence noting this is general guidance, not financial or
legal advice. Keep the whole brief to roughly 300-450 words.`;

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
          `- ${r.market}: ${input.tariffColumnLabel} ${r.tariffRate}, ease of business ${r.easeOfBusiness.toFixed(1)}/10, cost/friction ${r.costFriction}, overall attractiveness ${r.attractiveness}`
      )
      .join("\n");

    const location = [
      input.country === "US" ? "United States" : "Canada",
      input.province,
      input.usState ? `primary U.S. market: ${input.usState}` : null,
    ]
      .filter(Boolean)
      .join(", ");

    const userPrompt = `Business profile:
- Scenario: ${input.scenarioLabel ?? "Not specified"}
- Based in: ${location || "Not specified"}
- Product category: ${input.category ?? "Not specified"}
- Specific product: ${input.productName || "Not specified"}

Market comparison data:
${rowsText}

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
