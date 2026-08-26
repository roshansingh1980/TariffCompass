/**
 * Review log for the AI market-data refresh job (see lib/ai/refresh-market-data.ts).
 *
 * The refresh job never writes to market-data.ts directly — it only
 * *proposes* changes. A human reviews each proposal, and only once accepted
 * copies the new value (and its confidence/source/date) into market-data.ts
 * by hand, then records what happened here for history.
 *
 * This is a v1, file-based log — fine for the current single-maintainer
 * workflow. If review volume grows, replace this with a database table
 * without changing the shape below.
 */

export type ProposedChange = {
  category: string;
  direction: "export" | "import";
  marketKey: string;
  field: "tariffRate" | "costFriction" | "attractiveness";
  oldValue: string;
  proposedValue: string;
  proposedConfidence: "official" | "estimated" | "unknown";
  reason: string;
  sourceName: string;
  sourceUrl: string;
  /** True whenever the model wasn't confident enough to propose a precise replacement. */
  reviewNeeded: boolean;
};

export type RefreshLogEntry = {
  runAt: string;
  summary: string;
  changes: ProposedChange[];
  /** "applied" once a human has copied accepted changes into market-data.ts. */
  status: "proposed" | "applied" | "dismissed";
};

/**
 * Historical runs. Empty until the first refresh has been reviewed —
 * append an entry here (status: "applied" or "dismissed") after acting on
 * a proposal from POST /api/refresh-data, so there's a durable record of
 * what changed, why, and when.
 */
export const REFRESH_LOG: RefreshLogEntry[] = [];
