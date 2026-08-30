import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { PublicContainer } from "@/components/public/public-container";
import { KEY_DATES } from "@/lib/data/key-dates";

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function firstSentence(text: string): string {
  const match = text.match(/^.*?[.!?](?:\s|$)/);
  return match ? match[0].trim() : text;
}

export function TradeChangesSection() {
  const todayIso = new Date().toISOString().slice(0, 10);
  // Nearest upcoming entry plus the two most recent already-in-force
  // entries — the same three-item mix the approved reference calls for,
  // pulled from the real dated measure calendar rather than invented.
  const upcoming = [...KEY_DATES].filter((e) => e.effectiveDate >= todayIso).sort((a, b) => a.effectiveDate.localeCompare(b.effectiveDate));
  const past = [...KEY_DATES].filter((e) => e.effectiveDate < todayIso).sort((a, b) => b.effectiveDate.localeCompare(a.effectiveDate));
  const entries = [...upcoming.slice(0, 1), ...past.slice(0, 2)].slice(0, 3);

  if (entries.length === 0) return null;

  return (
    <section className="w-full py-14 sm:py-16">
      <PublicContainer>
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Trade changes worth knowing
          </h2>
          <Link
            href="/updates"
            className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-[#C8102E] hover:underline"
          >
            View all developments
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {entries.map((entry) => {
            const isUpcoming = entry.effectiveDate >= todayIso;
            return (
              <div key={entry.id} className="flex flex-col rounded-2xl border border-border/60 bg-background p-5">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={
                      "rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide uppercase " +
                      (isUpcoming ? "bg-amber-500/10 text-amber-700" : "bg-emerald-500/10 text-emerald-700")
                    }
                  >
                    {isUpcoming ? "Upcoming" : "In force"}
                  </span>
                  <span className="text-xs text-muted-foreground">{formatDate(entry.effectiveDate)}</span>
                </div>
                <p className="mt-3 text-[15px] font-semibold tracking-tight text-foreground">{entry.title}</p>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {firstSentence(entry.description)}
                </p>
                <a
                  href={entry.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1 border-t border-border/50 pt-3 text-xs font-medium text-muted-foreground hover:text-foreground hover:underline"
                >
                  Source: {entry.sourceName} · {entry.confidence === "official" ? "Official" : "Estimated"}
                  <ArrowUpRight className="size-3" />
                </a>
              </div>
            );
          })}
        </div>
      </PublicContainer>
    </section>
  );
}
