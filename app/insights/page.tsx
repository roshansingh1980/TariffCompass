import type { Metadata } from "next";
import Link from "next/link";
import { INSIGHTS } from "@/lib/insights-data";

export const metadata: Metadata = {
  title: "Insights | TariffCompass",
  description:
    "Practical guides on U.S. tariffs, export market diversification, and Canadian government support programs for small and medium-sized businesses.",
};

export default function InsightsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-6 py-20 sm:px-8 sm:py-28">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Insights
      </h1>
      <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
        Practical guides on tariffs, export diversification, and government
        support programs for Canadian businesses.
      </p>

      <div className="mt-14 flex flex-col divide-y divide-border/50 border-t border-border/50">
        {INSIGHTS.map((article) => (
          <Link
            key={article.slug}
            href={`/insights/${article.slug}`}
            className="group flex flex-col gap-2 py-8 transition-colors duration-200"
          >
            <h2 className="text-lg font-medium tracking-tight text-foreground transition-colors duration-200 group-hover:text-foreground/70 sm:text-xl">
              {article.title}
            </h2>
            <p className="text-[14.5px] leading-relaxed text-muted-foreground">
              {article.dek}
            </p>
            <span className="mt-1 text-[13px] font-medium tracking-wide text-foreground/70">
              Read more &rarr;
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
