import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { BRIEF_SYSTEM_PROMPT, buildBriefUserPrompt, type BriefInput } from "@/lib/ai/generate-brief";

/**
 * Streams the AI brief as newline-delimited JSON events instead of a single
 * blocking response, so the client can render text as it arrives rather than
 * showing a static "Generating…" spinner for the full 25-30s completion.
 * Each line is `{"type":"text","text":"..."}` or a terminal
 * `{"type":"error","error":"..."}`. Auth/subscription/config failures are
 * plain JSON error responses (no stream opened yet), same as the request
 * this replaced.
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "Please log in to generate a brief." }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_status")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.subscription_status !== "active") {
    return Response.json({ requiresUpgrade: true }, { status: 403 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "AI brief generation isn't configured yet." }, { status: 500 });
  }

  let input: BriefInput;
  try {
    input = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const userPrompt = buildBriefUserPrompt(input);
  const client = new Anthropic({ apiKey, timeout: 60_000 });
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: { type: "text"; text: string } | { type: "error"; error: string }) => {
        controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));
      };
      try {
        const anthropicStream = client.messages.stream({
          model: "claude-opus-5",
          max_tokens: 4096,
          system: BRIEF_SYSTEM_PROMPT,
          messages: [{ role: "user", content: userPrompt }],
        });
        anthropicStream.on("text", (text) => send({ type: "text", text }));
        await anthropicStream.finalMessage();
      } catch (error) {
        console.error("Failed to stream AI brief:", error);
        send({ type: "error", error: "Something went wrong generating your brief. Please try again." });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
