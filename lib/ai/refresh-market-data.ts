/**
 * AI-assisted freshness review for the market data in lib/data/market-data.ts.
 *
 * This is a server-only module — it is never imported by client code, and
 * it is not a Server Action, so it is not exposed as a callable endpoint on
 * its own. It's invoked only from the protected route at
 * app/api/refresh-data/route.ts.
 *
 * It never edits market-data.ts. It asks Claude — with live web search — to
 * compare the current dataset against the tracked sources and propose
 * changes. A human reviews the proposal and, only if they accept it, copies
 * the new value into market-data.ts by hand and records the outcome in
 * lib/data/refresh-log.ts. If Claude isn't confident a source supports a
 * precise new number, it must say so rather than guess — that's enforced by
 * the prompt below and by keeping this job entirely out of the write path.
 */

import Anthropic from "@anthropic-ai/sdk";
import { flattenMarketData } from "@/lib/data/market-data";
import { SOURCES } from "@/lib/data/sources";
import type { ProposedChange } from "@/lib/data/refresh-log";

export type RefreshResult =
  | { ok: true; summary: string; changes: ProposedChange[]; checkedAt: string }
  | { ok: false; error: string };

const SYSTEM_PROMPT = `You are a data-freshness reviewer for a Canadian tariff-comparison tool.

You will be given the tool's current structured market data (tariff rates,
confidence levels, and the source each row cites) and a registry of the
sources it tracks. Use web search to check whether any of the tracked
sources indicate the current data is stale or wrong.

Rules:
- Never invent a precise tariff rate. Only propose a specific new rate if
  you found it stated on one of the tracked sources (or a page it links to)
  and can cite that exact page.
- If you find evidence something has likely changed but can't confirm the
  precise new value, propose no numeric change — instead flag it with
  reviewNeeded: true and explain what you found in "reason".
  proposedValue in that case should repeat oldValue unchanged, and
  proposedConfidence should be "estimated" or "unknown" as appropriate —
  never upgrade a value to "official" confidence unless you can cite the
  exact official page stating that exact figure.
- If nothing appears to have changed for a row, do not include it in
  "changes" at all. An empty changes array is a valid, expected outcome.
- Do not fabricate source names or URLs — only cite sources from the
  registry provided, or a specific page you actually retrieved via web
  search this run.

Respond with ONLY a single JSON object (no prose, no markdown fences)
matching exactly this shape:
{
  "summary": "one or two sentence overview of what you checked and found",
  "changes": [
    {
      "category": string,
      "direction": "export" | "import",
      "marketKey": string,
      "field": "tariffRate" | "costFriction" | "attractiveness",
      "oldValue": string,
      "proposedValue": string,
      "proposedConfidence": "official" | "estimated" | "unknown",
      "reason": string,
      "sourceName": string,
      "sourceUrl": string,
      "reviewNeeded": boolean
    }
  ]
}`;

function buildUserPrompt(): string {
  const rows = flattenMarketData();
  const rowsText = rows
    .map(
      (r) =>
        `${r.category} | ${r.direction} | ${r.market.key} (${r.market.name}) | rate=${r.tariffRate} | confidence=${r.tariffConfidence} | source=${r.sourceName}`
    )
    .join("\n");

  const sourcesText = Object.values(SOURCES)
    .map((s) => `- ${s.name}: ${s.url} — used for: ${s.usedFor} (last checked ${s.lastChecked})`)
    .join("\n");

  return `Current market data rows (category | direction | market | rate | confidence | source):
${rowsText}

Tracked sources:
${sourcesText}

Review the tracked sources for anything that suggests the current data is
out of date — a new tariff measure, an expired exemption, a program that has
changed or closed. Propose changes only where you found real evidence.`;
}

function extractJson(text: string): unknown {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenced ? fenced[1] : trimmed;
  return JSON.parse(candidate);
}

export async function refreshMarketData(): Promise<RefreshResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "ANTHROPIC_API_KEY is not configured." };
  }

  try {
    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model: "claude-opus-5",
      max_tokens: 8192,
      system: SYSTEM_PROMPT,
      tools: [{ type: "web_search_20260209", name: "web_search", max_uses: 8 }],
      messages: [{ role: "user", content: buildUserPrompt() }],
    });

    const finalText = response.content
      .filter((block) => block.type === "text")
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("\n")
      .trim();

    if (!finalText) {
      return { ok: false, error: "The refresh run produced no text output." };
    }

    let parsed: { summary?: unknown; changes?: unknown };
    try {
      parsed = extractJson(finalText) as { summary?: unknown; changes?: unknown };
    } catch {
      return { ok: false, error: `Could not parse JSON from model output: ${finalText.slice(0, 500)}` };
    }

    const summary = typeof parsed.summary === "string" ? parsed.summary : "No summary provided.";
    const changes = Array.isArray(parsed.changes) ? (parsed.changes as ProposedChange[]) : [];

    return { ok: true, summary, changes, checkedAt: new Date().toISOString() };
  } catch (error) {
    console.error("Market data refresh failed:", error);
    return { ok: false, error: "Something went wrong running the refresh job." };
  }
}
