"use client";

import { useState, useTransition, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { SubscribeButton } from "@/components/billing/subscribe-button";
import { generateBrief, type BriefInput } from "@/lib/ai/generate-brief";

export function GenerateBriefSection({
  input,
  isSubscribed,
}: {
  input: BriefInput;
  isSubscribed: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [brief, setBrief] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [requiresUpgrade, setRequiresUpgrade] = useState(!isSubscribed);

  const handleGenerate = () => {
    setError(null);
    setRequiresUpgrade(false);
    startTransition(async () => {
      const result = await generateBrief(input);
      if ("requiresUpgrade" in result) {
        setRequiresUpgrade(true);
      } else if ("error" in result) {
        setError(result.error);
      } else {
        setBrief(result.brief);
      }
    });
  };

  return (
    <div className="mt-28">
      <h2 className="text-3xl font-semibold tracking-tight text-foreground">
        AI Diversification Brief
      </h2>
      <p className="mt-3 text-lg text-muted-foreground">
        A short, personalized brief generated from your results.
      </p>

      {!brief && !requiresUpgrade && (
        <Button
          type="button"
          onClick={handleGenerate}
          disabled={isPending}
          size="lg"
          className="mt-8 h-12 rounded-full px-9 text-[15px] font-medium tracking-tight shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.25)]"
        >
          {isPending ? "Generating…" : "Generate Brief"}
        </Button>
      )}

      {requiresUpgrade && (
        <div className="mt-8 rounded-3xl border border-border/60 p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] sm:p-10">
          <p className="text-lg font-medium tracking-tight text-foreground">
            Upgrade to generate your AI brief
          </p>
          <p className="mt-2 text-muted-foreground">
            AI-generated diversification briefs are available on the C$99/month plan.
          </p>
          <div className="mt-6">
            <SubscribeButton />
          </div>
        </div>
      )}

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      {brief && (
        <div className="mt-8 rounded-3xl border border-border/60 p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] sm:p-10">
          <BriefContent text={brief} />
        </div>
      )}
    </div>
  );
}

function renderInline(line: string): ReactNode {
  const parts = line.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  if (parts.length === 1) return line;
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-medium text-foreground">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

function BriefContent({ text }: { text: string }) {
  const blocks: ReactNode[] = [];
  let listItems: string[] = [];
  let key = 0;

  const flushList = () => {
    if (listItems.length === 0) return;
    blocks.push(
      <ul key={`list-${key++}`} className="list-disc space-y-1.5 pl-5 text-foreground">
        {listItems.map((item, i) => (
          <li key={i}>{renderInline(item)}</li>
        ))}
      </ul>
    );
    listItems = [];
  };

  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;

    const headingMatch = line.match(/^#{1,6}\s+(.*)/);
    const bulletMatch = line.match(/^(?:[-*]|\d+\.)\s+(.*)/);

    if (headingMatch) {
      flushList();
      blocks.push(
        <h3
          key={`h-${key++}`}
          className="text-lg font-semibold tracking-tight text-foreground first:mt-0"
        >
          {renderInline(headingMatch[1])}
        </h3>
      );
    } else if (bulletMatch) {
      listItems.push(bulletMatch[1]);
    } else {
      flushList();
      blocks.push(
        <p key={`p-${key++}`} className="text-[15px] leading-relaxed text-muted-foreground">
          {renderInline(line)}
        </p>
      );
    }
  }
  flushList();

  return <div className="space-y-4">{blocks}</div>;
}
