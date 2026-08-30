"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ExposureAlertsResult } from "@/lib/supabase/exposure-alerts";

/**
 * Compact, collapsed-by-default summary of the same alert data the
 * dedicated /dashboard/alerts page shows in full — reused here, not
 * duplicated, so a wizard/results screen doesn't permanently sit under a
 * full alert card. Renders nothing if there's nothing to say.
 */
export function AlertStrip({ result }: { result: ExposureAlertsResult }) {
  const [expanded, setExpanded] = useState(false);
  if (!result.available || result.alerts.length === 0) return null;

  const count = result.alerts.length;
  const headline =
    count === 1
      ? `1 material change affects a saved exposure.`
      : `${count} material changes affect your saved exposures.`;

  return (
    <div className="w-full max-w-3xl rounded-xl border border-amber-500/30 bg-amber-500/[0.06]">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="flex w-full items-center gap-2.5 px-4 py-3 text-left text-sm"
      >
        <TriangleAlert aria-hidden="true" className="size-4 shrink-0 text-amber-700" />
        <span className="flex-1 font-medium text-foreground">{headline}</span>
        <Link
          href="/dashboard/alerts"
          onClick={(e) => e.stopPropagation()}
          className="shrink-0 text-xs font-medium text-[#C8102E] underline-offset-2 hover:underline"
        >
          View details
        </Link>
        <ChevronDown aria-hidden="true" className={cn("size-4 shrink-0 text-muted-foreground transition-transform", expanded && "rotate-180")} />
      </button>
      {expanded && (
        <ul className="flex flex-col gap-1.5 border-t border-amber-500/20 px-4 py-3 text-xs text-muted-foreground">
          {result.alerts.map((alert) => (
            <li key={alert.id} className="truncate">
              {alert.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
