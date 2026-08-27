import { KEY_DATES, type KeyDate } from "@/lib/data/key-dates";
import { cn } from "@/lib/utils";

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function KeyDateRow({ entry, isPast }: { entry: KeyDate; isPast: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span
          className={cn(
            "text-sm font-medium tracking-tight",
            isPast ? "text-muted-foreground" : "text-foreground"
          )}
        >
          {formatDate(entry.effectiveDate)}
        </span>
        <span className="text-[11px] text-muted-foreground">
          {entry.confidence === "official" ? "Official" : "Estimated"}
        </span>
      </div>
      <p
        className={cn(
          "text-[15px] font-medium tracking-tight",
          isPast ? "text-muted-foreground" : "text-foreground"
        )}
      >
        {entry.title}
      </p>
      <p className="text-sm leading-relaxed text-muted-foreground">{entry.description}</p>
      <div className="mt-1 flex flex-wrap items-center gap-1.5">
        {entry.affectedCategories.map((category) => (
          <span
            key={category}
            className="rounded-full border border-border/50 px-2.5 py-1 text-[11px] text-muted-foreground"
          >
            {category}
          </span>
        ))}
      </div>
      <a
        href={entry.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[11px] text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
      >
        Source: {entry.sourceName}
      </a>
    </div>
  );
}

type TimelineRow = { kind: "today" } | { kind: "entry"; entry: KeyDate; isPast: boolean };

function buildTimeline(entries: KeyDate[], todayIso: string): TimelineRow[] {
  const sorted = [...entries].sort((a, b) => a.effectiveDate.localeCompare(b.effectiveDate));
  const rows: TimelineRow[] = [];
  let todayInserted = false;

  for (const entry of sorted) {
    if (!todayInserted && entry.effectiveDate >= todayIso) {
      rows.push({ kind: "today" });
      todayInserted = true;
    }
    rows.push({ kind: "entry", entry, isPast: entry.effectiveDate < todayIso });
  }
  if (!todayInserted) rows.push({ kind: "today" });

  return rows;
}

export function KeyDatesSection() {
  if (KEY_DATES.length === 0) return null;

  const todayIso = new Date().toISOString().slice(0, 10);
  const rows = buildTimeline(KEY_DATES, todayIso);

  return (
    <section className="w-full max-w-2xl px-6 pb-20">
      <div className="text-center">
        <h2 className="text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
          What&apos;s coming
        </h2>
        <p className="mt-3 text-[15px] text-muted-foreground">
          A timeline of tariff and trade measures that could affect your category.
        </p>
      </div>

      <div className="relative mt-12 ml-3 border-l-2 border-border/60 pl-8">
        {rows.map((row) =>
          row.kind === "today" ? (
            <div key="today" className="relative pb-10">
              <span className="absolute -left-[39px] top-0.5 size-3.5 rounded-full border-2 border-background bg-[#C8102E]" />
              <p className="text-xs font-semibold tracking-wide text-[#C8102E] uppercase">Today</p>
            </div>
          ) : (
            <div key={row.entry.id} className="relative pb-10 last:pb-0">
              <span
                className={cn(
                  "absolute -left-[37px] top-1 size-2.5 rounded-full",
                  row.isPast ? "border-2 border-border bg-background" : "bg-foreground"
                )}
              />
              <KeyDateRow entry={row.entry} isPast={row.isPast} />
            </div>
          )
        )}
      </div>
    </section>
  );
}
