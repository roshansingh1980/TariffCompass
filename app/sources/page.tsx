import type { Metadata } from "next";
import { ArrowRight, BadgeCheck, Calendar, FileCheck2, Gavel, Landmark, Megaphone, Newspaper, ShieldCheck, Sparkles } from "lucide-react";
import { getUsedSourceRegistry, type SourceRegistryEntry } from "@/lib/data/source-registry";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getDashboardShellAuth } from "@/lib/dashboard/shell-auth";
import { PublicContainer } from "@/components/public/public-container";

export const metadata: Metadata = {
  title: "Sources & Methodology | TariffCompass",
  description: "Where TariffCompass gets its information, how a policy decision becomes a structured record, and how that flows into your analysis.",
  // Always the bare path, regardless of ?view=app — see app/updates/page.tsx.
  alternates: { canonical: "/sources" },
};

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

const TRUST_COMMITMENTS = [
  {
    heading: "Official sources first",
    body: "We prioritize government and intergovernmental authorities. A small number of trade-compliance publishers are used only to corroborate practical detail beyond what a government page states directly — never as the source of record for a rate.",
  },
  {
    heading: "Structured provenance",
    body: "Covered trade measures link to a named source, its authority level, and a retrieval date — see \"Why we trust this\" on any covered measure.",
  },
  {
    heading: "Reviewed effective dates",
    body: "Dates come from the source itself, not an estimate, wherever a measure is covered by structured provenance.",
  },
  {
    heading: "Clear confidence labels",
    body: "Every rate is labelled official, estimated, or unknown. Unknown is preferred over false precision.",
  },
  {
    heading: "News is not a source of record",
    body: "A news report can prompt us to go look for the underlying government action. It is never treated as the tariff determination itself.",
  },
];

const FLOW_STEPS = [
  { icon: Landmark, label: "Political / policy decision", body: "Direction set by a government or governing body." },
  { icon: Megaphone, label: "Official announcement", body: "Published through an official government channel." },
  { icon: Gavel, label: "Legal / regulatory instrument", body: "An order, regulation, notice, or schedule with legal effect." },
  { icon: FileCheck2, label: "Agency implementation", body: "Authorities publish guidance and operational detail." },
  { icon: BadgeCheck, label: "TariffCompass verification", body: "We verify the measure and link it to its source." },
  { icon: Sparkles, label: "Business-facing intelligence", body: "Applicability, exposure, alerts, and AI briefs." },
];

const HOW_WE_USE_SOURCES = [
  { heading: "Monitored measures", body: "New and updated measures are tracked from official channels." },
  { heading: "Applicability & coverage", body: "Scope, affected goods, and route are extracted from the source." },
  { heading: "Exposure estimates", body: "Structured measures are combined with your entered trade value to estimate impact." },
  { heading: "Alerts", body: "Saved exposures are checked against covered structured changes." },
  { heading: "AI briefs", body: "The AI explains structured data. It does not create tariff facts." },
];

const FAQS = [
  {
    q: "Is TariffCompass a legal or customs-compliance service?",
    a: "No. TariffCompass is a trade-impact navigation and decision-support platform — not a customs broker, a filing service, or legal, tax, or financial advice.",
  },
  {
    q: "How current are effective dates?",
    a: "Dates come directly from the source for covered structured measures. Official dates can be announced, amended, or delayed — TariffCompass records the current known state, not a guarantee of what happens next.",
  },
  {
    q: "How does the AI brief use source data?",
    a: "The AI may explain the structured data already shown on the page. It cannot invent or override a tariff rate, effective date, applicability, or confidence level.",
  },
  {
    q: "Can I keep a copy with sources attached?",
    a: "Yes — the market comparison page's Print / Download uses your browser's native print-to-PDF, which includes the source citations already shown on screen.",
  },
];

function groupRegistry(registry: SourceRegistryEntry[]) {
  const isGovernment = (name: string) =>
    /government of canada|cbsa|usitc|u\.s\. harmonized tariff|finance canada|canexport|regional tariff response|trade commissioner/i.test(name);
  return {
    government: registry.filter((s) => isGovernment(s.name)),
    supporting: registry.filter((s) => !isGovernment(s.name)),
  };
}

async function SourcesContent() {
  let registry: SourceRegistryEntry[];
  let loadError = false;
  try {
    registry = await getUsedSourceRegistry();
  } catch (error) {
    console.error("Failed to load source registry:", error);
    loadError = true;
    registry = [];
  }

  const { government, supporting } = groupRegistry(registry);
  const lastReviewed = registry.reduce((latest, s) => (s.lastChecked > latest ? s.lastChecked : latest), registry[0]?.lastChecked ?? "");

  return (
    <PublicContainer className="flex-1 py-16 sm:py-20">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-start">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Sources &amp; Methodology</h1>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            TariffCompass tracks trade-policy measures from named sources and shows how a
            government decision becomes the number shown in your analysis.
          </p>
        </div>
        <div className="rounded-2xl border border-border/60 p-5">
          <p className="text-sm font-semibold text-foreground">Our trust commitments</p>
          <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {TRUST_COMMITMENTS.map((item) => (
              <li key={item.heading} className="flex items-start gap-2">
                <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#C8102E]" />
                <div>
                  <p className="text-[13px] font-medium text-foreground">{item.heading}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Policy-to-business flow */}
      <section className="mt-12">
        <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Typical policy-to-business flow</p>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Not every measure passes through every stage identically — this is the common path, not a guarantee.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {FLOW_STEPS.map(({ icon: Icon, label, body }, i) => (
            <div key={label} className="relative rounded-xl border border-border/60 p-4">
              <span className="flex size-8 items-center justify-center rounded-lg bg-[#C8102E]/[0.08] text-[#C8102E]">
                <Icon aria-hidden="true" className="size-4" />
              </span>
              <p className="mt-2.5 text-xs font-semibold tracking-tight text-foreground">
                {i + 1}. {label}
              </p>
              <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Source authority model */}
      <section className="mt-12 rounded-2xl border border-border/60 p-5 sm:p-6">
        <p className="text-sm font-semibold text-foreground">How we weigh a source</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Where a trade measure carries structured provenance, its source is one of three kinds:
        </p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-foreground/[0.02] p-4">
            <p className="text-xs font-semibold text-foreground">Legal / operative</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Orders, regulations, and tariff schedules with legal effect.</p>
          </div>
          <div className="rounded-xl bg-foreground/[0.02] p-4">
            <p className="text-xs font-semibold text-foreground">Administrative / implementation</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Agency guidance and notices, e.g. CBSA Customs Notices, USITC HTS revisions.</p>
          </div>
          <div className="rounded-xl bg-foreground/[0.02] p-4">
            <p className="text-xs font-semibold text-foreground">Official announcement</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Government statements, e.g. Department of Finance Canada releases.</p>
          </div>
        </div>
        <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Newspaper aria-hidden="true" className="size-3.5 shrink-0" />
          News and media are supplemental discovery/context only — never the source of record for a determination.
        </p>
      </section>

      {/* Source library + how sources flow into the product */}
      <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        <section>
          <div className="flex items-baseline justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-foreground">Official source library</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Every source actually cited by TariffCompass&apos;s data — computed from what the app cites, not a separately maintained list.
              </p>
            </div>
          </div>

          {loadError ? (
            <div className="mt-6 rounded-2xl border border-destructive/30 bg-destructive/[0.03] p-6 text-center">
              <p className="text-sm font-medium text-destructive">Couldn&apos;t load the source list right now — try refreshing the page.</p>
            </div>
          ) : (
            <div className="mt-4 flex flex-col gap-6">
              {government.length > 0 && (
                <SourceGroup title="Government and intergovernmental sources" sources={government} />
              )}
              {supporting.length > 0 && (
                <SourceGroup title="Trade-compliance and program resources" sources={supporting} />
              )}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-border/70 bg-foreground/[0.015] p-5">
          <p className="text-sm font-semibold text-foreground">How sources flow into the product</p>
          <ul className="mt-4 flex flex-col gap-4">
            {HOW_WE_USE_SOURCES.map((item) => (
              <li key={item.heading}>
                <p className="text-[13px] font-medium text-foreground">{item.heading}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{item.body}</p>
              </li>
            ))}
          </ul>
          {lastReviewed && (
            <p className="mt-5 flex items-center gap-1.5 border-t border-border/50 pt-4 text-xs text-muted-foreground">
              <Calendar aria-hidden="true" className="size-3.5 shrink-0" />
              Most recently reviewed source: {formatDate(lastReviewed)}. Cadence varies by source — some are checked on a fixed schedule, others when an event is expected.
            </p>
          )}
        </section>
      </div>

      {/* FAQ */}
      <section className="mt-12">
        <p className="text-sm font-semibold text-foreground">Questions &amp; disclosures</p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {FAQS.map((faq) => (
            <details key={faq.q} className="rounded-xl border border-border/60 p-4">
              <summary className="cursor-pointer text-sm font-medium text-foreground">{faq.q}</summary>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      <a href="/support" className="mt-8 inline-flex items-center gap-1 text-sm font-medium text-[#C8102E] hover:underline">
        Have a question about a specific source? Contact support
        <ArrowRight className="size-3.5" />
      </a>
    </PublicContainer>
  );
}

function SourceGroup({ title, sources }: { title: string; sources: SourceRegistryEntry[] }) {
  return (
    <div>
      <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">{title}</p>
      <div className="mt-2 flex flex-col divide-y divide-border/50 rounded-xl border border-border/60">
        {sources.map((source) => (
          <div key={source.url} className="flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{source.name}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{source.covers}</p>
            </div>
            <div className="flex shrink-0 items-center gap-3 text-xs">
              <span className="text-muted-foreground">Checked {formatDate(source.lastChecked)}</span>
              <a href={source.url} target="_blank" rel="noopener noreferrer" className="font-medium text-foreground underline-offset-2 hover:underline">
                Visit
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function SourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { view } = await searchParams;
  if (view !== "app") return <SourcesContent />;

  const { isLoggedIn, isSubscribed, userEmail } = await getDashboardShellAuth();
  return (
    <DashboardShell isLoggedIn={isLoggedIn} isSubscribed={isSubscribed} userEmail={userEmail}>
      <SourcesContent />
    </DashboardShell>
  );
}
