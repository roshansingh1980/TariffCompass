import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackLink } from "@/components/back-link";
import { INSIGHTS, getInsightBySlug } from "@/lib/insights-data";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return INSIGHTS.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getInsightBySlug(slug);
  if (!article) return {};
  return {
    title: `${article.title} | TariffCompass`,
    description: article.metaDescription,
    alternates: { canonical: `/insights/${article.slug}` },
  };
}

export default async function InsightArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getInsightBySlug(slug);
  if (!article) notFound();

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-6 py-20 sm:px-8 sm:py-28">
      <BackLink fallbackHref="/insights" label="Insights" />

      <h1 className="mt-8 text-3xl leading-tight font-semibold tracking-tight text-foreground sm:text-4xl">
        {article.title}
      </h1>
      <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
        {article.dek}
      </p>

      <div className="mt-12 flex flex-col gap-12">
        <p className="text-[15.5px] leading-[1.75] text-foreground/90">
          {article.intro}
        </p>

        {article.sections.map((section) => (
          <section key={section.heading} className="flex flex-col gap-4">
            <h2 className="text-xl font-medium tracking-tight text-foreground">
              {section.heading}
            </h2>
            {section.paragraphs.map((paragraph, i) => (
              <p
                key={i}
                className="text-[15.5px] leading-[1.75] text-foreground/90"
              >
                {paragraph}
              </p>
            ))}
            {section.list && (
              <ul className="flex flex-col gap-2.5 pl-1">
                {section.list.map((item, i) => (
                  <li
                    key={i}
                    className="flex gap-2.5 text-[15.5px] leading-[1.65] text-foreground/90"
                  >
                    <span className="mt-2.5 size-1 shrink-0 rounded-full bg-foreground/40" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
            {section.link && (
              <a
                href={section.link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit items-center gap-1.5 text-[14px] font-medium tracking-wide text-foreground underline decoration-border underline-offset-4 transition-colors duration-200 hover:decoration-foreground"
              >
                {section.link.label}
                <ArrowUpRight className="size-3.5" />
              </a>
            )}
          </section>
        ))}
      </div>

      <div className="mt-16 flex flex-col items-center gap-4 rounded-3xl border border-border/60 bg-foreground/[0.02] p-8 text-center shadow-[0_1px_3px_rgba(0,0,0,0.04)] sm:p-10">
        <p className="text-[15px] font-medium tracking-tight text-foreground">
          See your own tariff exposure and compare markets in minutes.
        </p>
        <Button
          render={<Link href="/dashboard" />}
          nativeButton={false}
          className="h-11 rounded-full px-7 text-[14.5px] font-medium tracking-tight shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90"
        >
          Try TariffCompass
        </Button>
      </div>
    </div>
  );
}
