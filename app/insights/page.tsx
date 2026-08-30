import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Banknote, Globe2, Landmark, ScaleIcon, ShieldCheck, Sparkles } from "lucide-react";
import { INSIGHTS, type InsightArticle } from "@/lib/insights-data";
import { getUsedSourceRegistry } from "@/lib/data/source-registry";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getDashboardShellAuth } from "@/lib/dashboard/shell-auth";
import { PublicContainer } from "@/components/public/public-container";

export const metadata: Metadata = {
  title: "Insights | TariffCompass",
  description:
    "Practical guides on U.S. tariffs, export market diversification, and Canadian government support programs for small and medium-sized businesses.",
  alternates: { canonical: "/insights" },
};

/**
 * Topic labels are derived from each article's own real title/dek for
 * display grouping only — lib/insights-data.ts has no category field, and
 * no read-time, publish-date, or popularity metadata exists at all. Those
 * are omitted entirely rather than fabricated (see PENDING.md's own
 * standing rule against inventing facts).
 */
const TOPIC_BY_SLUG: Record<string, string> = {
  "how-us-tariffs-are-affecting-canadian-small-businesses": "Tariffs & Risk",
  "alternative-export-markets-beyond-the-us": "Export Diversification",
  "canadian-government-tariff-relief-programs-guide": "Government Programs",
  "how-to-calculate-your-business-tariff-exposure": "Finance & Planning",
  "export-vs-import-tariff-risk-profile": "Tariffs & Risk",
};

const TOPIC_ICON: Record<string, typeof Globe2> = {
  "Tariffs & Risk": ShieldCheck,
  "Export Diversification": Globe2,
  "Government Programs": Landmark,
  "Finance & Planning": Banknote,
};

function topicFor(article: InsightArticle): string {
  return TOPIC_BY_SLUG[article.slug] ?? "Tariffs & Risk";
}

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}

async function InsightsContent() {
  const topics = Array.from(new Set(INSIGHTS.map(topicFor)));
  let lastReviewed: string | null = null;
  try {
    const registry = await getUsedSourceRegistry();
    lastReviewed = registry.reduce((latest, s) => (s.lastChecked > latest ? s.lastChecked : latest), registry[0]?.lastChecked ?? "") || null;
  } catch {
    lastReviewed = null;
  }

  return (
    <PublicContainer className="flex-1 py-16 sm:py-20">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Insights</h1>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            Actionable guides on tariffs, export diversification, and government support programs
            for Canadian businesses.
          </p>
        </div>
      </div>

      {/* Topic labels — grouping only, not a live filter (no client JS needed for 5 articles). */}
      <div className="mt-6 flex flex-wrap gap-2">
        {topics.map((topic) => {
          const Icon = TOPIC_ICON[topic] ?? ScaleIcon;
          return (
            <span key={topic} className="inline-flex items-center gap-1.5 rounded-full border border-border/60 px-3.5 py-1.5 text-xs font-medium text-muted-foreground">
              <Icon aria-hidden="true" className="size-3.5" />
              {topic}
            </span>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        {/* Article list */}
        <div className="flex flex-col gap-3">
          {INSIGHTS.map((article) => {
            const topic = topicFor(article);
            const Icon = TOPIC_ICON[topic] ?? ScaleIcon;
            return (
              <Link
                key={article.slug}
                href={`/insights/${article.slug}`}
                className="group flex items-start gap-4 rounded-2xl border border-border/60 p-5 transition-colors duration-200 hover:border-foreground/25 hover:bg-foreground/[0.015]"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#C8102E]/[0.08] text-[#C8102E]">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold tracking-wide text-[#C8102E] uppercase">{topic}</p>
                  <h2 className="mt-1 text-lg font-medium tracking-tight text-foreground sm:text-xl">{article.title}</h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{article.dek}</p>
                  <span className="mt-2 inline-flex items-center gap-1 text-[13px] font-medium tracking-wide text-foreground/70 group-hover:text-foreground">
                    Read more <ArrowRight className="size-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Right rail */}
        <div className="flex flex-col gap-5">
          <div className="rounded-2xl border border-border/60 p-5">
            <p className="text-sm font-semibold text-foreground">Featured Insights</p>
            <p className="mt-1 text-xs text-muted-foreground">Every guide currently published — there&apos;s no ranking to show yet.</p>
            <ol className="mt-4 flex flex-col gap-3">
              {INSIGHTS.map((article, i) => (
                <li key={article.slug}>
                  <Link href={`/insights/${article.slug}`} className="flex items-start gap-3 text-sm hover:text-foreground">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-foreground/[0.06] text-[11px] font-semibold text-muted-foreground">
                      {i + 1}
                    </span>
                    <span className="text-foreground/90">{article.title}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl border border-[#C8102E]/25 bg-[#C8102E]/[0.04] p-5">
            <Sparkles aria-hidden="true" className="size-5 text-[#C8102E]" />
            <p className="mt-3 text-lg font-semibold tracking-tight text-foreground">Generate your AI Diversification Brief</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Get a personalized brief with alternative markets, sourcing ideas, and practical next
              steps based on your own exposure.
            </p>
            <Link
              href="/dashboard"
              className="mt-4 inline-flex h-11 items-center justify-center gap-1.5 rounded-full bg-[#C8102E] px-6 text-sm font-medium text-white hover:bg-[#B00E29]"
            >
              Generate brief <ArrowRight className="size-4" />
            </Link>
            <p className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <ShieldCheck aria-hidden="true" className="size-3.5 shrink-0" />
              Built on official sources — the AI explains structured data, it doesn&apos;t invent it.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom trust strip */}
      <div className="mt-12 rounded-2xl border border-border/60 p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-[1.4fr_1.6fr_auto] sm:items-center">
          <div>
            <p className="text-sm font-semibold text-foreground">Our commitment</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              We prioritize official sources and document what each material fact traces back to,
              so you can see where an insight came from.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span>Official sources prioritized</span>
            <span>Confidence always shown</span>
            <span>News is context, not the record</span>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            {lastReviewed && <p className="text-xs text-muted-foreground">Sources last reviewed {formatDate(lastReviewed)}</p>}
            <Link href="/sources" className="inline-flex items-center gap-1 text-sm font-medium text-[#C8102E] hover:underline">
              Learn about our Sources &amp; Methodology <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </PublicContainer>
  );
}

export default async function InsightsPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { view } = await searchParams;
  const content = <InsightsContent />;
  if (view !== "app") return content;

  const shellAuth = await getDashboardShellAuth();
  return <DashboardShell {...shellAuth}>{content}</DashboardShell>;
}
