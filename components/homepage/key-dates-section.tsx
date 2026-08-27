import { KEY_DATES, type KeyDate } from "@/lib/data/key-dates";

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function KeyDateRow({ entry }: { entry: KeyDate }) {
  return (
    <div className="flex flex-col gap-2 py-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className="text-sm font-medium tracking-tight text-foreground">
          {formatDate(entry.effectiveDate)}
        </span>
        <span className="text-[11px] text-muted-foreground/60">
          {entry.confidence === "official" ? "Official" : "Estimated"}
        </span>
      </div>
      <p className="text-[15px] font-medium tracking-tight text-foreground">{entry.title}</p>
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
        className="text-[11px] text-muted-foreground/60 underline-offset-2 hover:text-foreground hover:underline"
      >
        Source: {entry.sourceName}
      </a>
    </div>
  );
}

export function KeyDatesSection() {
  const todayIso = new Date().toISOString().slice(0, 10);
  const upcoming = KEY_DATES.filter((entry) => entry.effectiveDate >= todayIso).sort((a, b) =>
    a.effectiveDate.localeCompare(b.effectiveDate)
  );
  const recent = KEY_DATES.filter((entry) => entry.effectiveDate < todayIso).sort((a, b) =>
    b.effectiveDate.localeCompare(a.effectiveDate)
  );

  if (upcoming.length === 0) return null;

  return (
    <section className="w-full max-w-3xl px-6 pb-20">
      <div className="text-center">
        <h2 className="text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
          What&apos;s coming
        </h2>
        <p className="mt-3 text-[15px] text-muted-foreground">
          Upcoming tariff and trade measures that could affect your category.
        </p>
      </div>

      <div className="mt-8 divide-y divide-border/50 border-t border-border/50">
        {upcoming.map((entry) => (
          <KeyDateRow key={entry.id} entry={entry} />
        ))}
      </div>

      {recent.length > 0 && (
        <details className="mt-8 group">
          <summary className="cursor-pointer list-none text-center text-[13px] font-medium tracking-wide text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
            Recently in force ({recent.length})
          </summary>
          <div className="mt-4 divide-y divide-border/50 border-t border-border/50">
            {recent.map((entry) => (
              <KeyDateRow key={entry.id} entry={entry} />
            ))}
          </div>
        </details>
      )}
    </section>
  );
}
