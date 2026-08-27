"use client";

import { useState, useTransition, type ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SubscribeButton } from "@/components/billing/subscribe-button";
import { generateBrief, type BriefInput } from "@/lib/ai/generate-brief";
import { savePendingWizardState, type PendingWizardState } from "@/lib/pending-wizard";

export function GenerateBriefSection({
  input,
  isLoggedIn,
  isSubscribed,
  wizardSelections,
}: {
  input: BriefInput;
  isLoggedIn: boolean;
  isSubscribed: boolean;
  wizardSelections: PendingWizardState;
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

      {!isLoggedIn && (
        <div className="mt-8 rounded-3xl border border-border/60 p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] sm:p-10">
          <p className="text-lg font-medium tracking-tight text-foreground">
            Create a free account to generate your brief
          </p>
          <p className="mt-2 text-muted-foreground">
            Your answers stay exactly as they are — signing up just lets us generate and save your
            brief.
          </p>
          <Button
            size="lg"
            render={<Link href="/signup" />}
            nativeButton={false}
            onClick={() => savePendingWizardState(wizardSelections)}
            className="mt-6 h-12 rounded-full px-9 text-[15px] font-medium tracking-tight shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.25)]"
          >
            Create a free account
          </Button>
        </div>
      )}

      {isLoggedIn && !brief && !requiresUpgrade && (
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

      {isLoggedIn && requiresUpgrade && (
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
          <p className="mb-6 text-sm text-muted-foreground/80">
            Prepared for: {input.productName || input.category || "your business"}
            {input.scenarioLabel ? ` — ${input.scenarioLabel}` : ""} —{" "}
            {new Date().toLocaleDateString("en-CA", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <BriefContent text={brief} />
          <p className="mt-8 border-t border-border/50 pt-6 text-xs text-muted-foreground/70">
            This brief is a starting point for a funding or client conversation. It is not a
            determination of program eligibility, and not legal, tax, or financial advice.
            Confirm program details and figures with official sources before acting.
          </p>
        </div>
      )}
    </div>
  );
}

function renderInline(line: string): ReactNode {
  const parts = line.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
  if (parts.length === 1) return line;
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-medium text-foreground">
        {part.slice(2, -2)}
      </strong>
    ) : part.startsWith("*") && part.endsWith("*") ? (
      <em key={i} className="not-italic text-muted-foreground/80">
        {part.slice(1, -1)}
      </em>
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
