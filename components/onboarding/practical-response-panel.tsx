import { ArrowUpRight } from "lucide-react";
import type { PracticalResponseIntelligence, ResponseInvestigation } from "@/lib/response-intelligence";

function ResponseList({ title, items }: { title: string; items: readonly ResponseInvestigation[] }) {
  if (items.length === 0) return null;
  return (
    <section className="border-t border-border/60 pt-5 first:border-0 first:pt-0">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <article key={`${title}-${item.title}`} className="rounded-xl bg-foreground/[0.025] p-4">
            <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">{item.label}</p>
            <h4 className="mt-1.5 text-sm font-semibold text-foreground">{item.title}</h4>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
            {item.source && (
              <a href={item.source.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-foreground underline underline-offset-2">
                {item.source.name}<ArrowUpRight className="size-3" />
              </a>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

export function PracticalResponsePanel({ intelligence }: { intelligence: PracticalResponseIntelligence }) {
  return (
    <section className="mt-8 rounded-2xl border border-border/70 bg-background p-5 text-left sm:p-6" aria-labelledby="practical-response-heading">
      <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Respond</p>
      <h2 id="practical-response-heading" className="mt-1 text-2xl font-semibold tracking-tight text-foreground">What should I investigate next?</h2>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">{intelligence.coverageNote}</p>
      {intelligence.coverage === "limited" ? (
        <p className="mt-5 rounded-xl bg-foreground/[0.025] p-4 text-sm text-muted-foreground">No product-specific response recommendations are available for this route yet.</p>
      ) : (
        <div className="mt-6 space-y-5">
          <ResponseList title="A. Potential sourcing alternatives to review" items={intelligence.sourcingAlternatives} />
          <ResponseList title="B. Trade-agreement considerations" items={intelligence.tradeAgreementConsiderations} />
          <ResponseList title="C. Government support / programs" items={intelligence.governmentPrograms} />
          <ResponseList title="D. Questions for professional advisers" items={intelligence.adviserQuestions} />
          <ResponseList title="E. Immediate management actions" items={intelligence.managementActions} />
        </div>
      )}
    </section>
  );
}

