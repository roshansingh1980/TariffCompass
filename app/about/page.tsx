import type { Metadata } from "next";
import Link from "next/link";
import { BackLink } from "@/components/back-link";
import { AboutLiveExample } from "@/components/about/live-example";

export const metadata: Metadata = {
  title: "About TariffCompass — Helping Canadian Businesses Navigate Tariffs",
  description:
    "Learn how TariffCompass helps Canadian small and medium-sized businesses assess tariff exposure, diversify markets, and access government support.",
  alternates: { canonical: "/about" },
};

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-2.5 text-xl font-medium tracking-tight text-foreground">
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#C8102E]" />
      {children}
    </h2>
  );
}

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-6 py-20 sm:px-8 sm:py-28">
      <BackLink fallbackHref="/" />
      <h1 className="mt-8 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        About TariffCompass
      </h1>
      <p className="mt-3 font-serif text-base text-muted-foreground italic sm:text-lg">
        Navigate tariffs. Find your path.
      </p>
      <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
        A practical tool for Canadian businesses trying to make sense of tariffs — not a
        government service, and not a substitute for professional advice.
      </p>

      <div className="mt-12 flex flex-col gap-10">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
          <section className="flex flex-col gap-3">
            <SectionHeading>What TariffCompass is</SectionHeading>
            <p className="text-[15.5px] leading-[1.75] text-foreground/90">
              TariffCompass is an independent software tool that helps Canadian businesses
              understand their tariff exposure, compare alternative export and import markets, and
              find relevant government support programs — in minutes, not weeks of research.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <SectionHeading>Who it&apos;s for</SectionHeading>
            <p className="text-[15.5px] leading-[1.75] text-foreground/90">
              Canadian small and medium-sized businesses that export to or import from the United
              States or other markets, and the accountants, consultants, and advisors who support
              them. It&apos;s built for people who need a clear starting point, not a customs law
              textbook.
            </p>
          </section>
        </div>

        <figure className="border-y border-border/60 py-8 text-center">
          <blockquote className="font-serif text-2xl leading-snug font-medium tracking-tight text-foreground sm:text-3xl">
            &ldquo;in minutes, not weeks of research.&rdquo;
          </blockquote>
          <div className="mx-auto mt-5 h-[3px] w-12 bg-[#C8102E]" />
        </figure>

        <section className="flex flex-col gap-6">
          <SectionHeading>What it does</SectionHeading>
          <p className="text-[15.5px] leading-[1.75] text-foreground/90">
            You describe your business — your trade scenario, where you&apos;re based, and what
            you sell or import.
          </p>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium tracking-tight text-foreground">
                Market comparison
              </h3>
              <p className="text-[14.5px] leading-relaxed text-muted-foreground">
                TariffCompass shows a side-by-side comparison of markets: estimated tariff rates,
                ease of doing business, cost and friction, and an overall attractiveness rating.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium tracking-tight text-foreground">
                Government programs
              </h3>
              <p className="text-[14.5px] leading-relaxed text-muted-foreground">
                It also surfaces real Canadian government support programs that may be relevant.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium tracking-tight text-foreground">AI brief</h3>
              <p className="text-[14.5px] leading-relaxed text-muted-foreground">
                It can generate a short, personalized AI diversification brief you can share with a
                client or your own team.
              </p>
            </div>
          </div>

          <AboutLiveExample />
        </section>

        <section className="flex flex-col gap-3">
          <SectionHeading>What it does not do</SectionHeading>
          <p className="text-[15.5px] leading-[1.75] text-foreground/90">
            TariffCompass does not provide legal, tax, customs, or financial advice. It is not a
            customs broker, does not file paperwork on your behalf, and does not determine your
            actual duty liability, program eligibility, or legal obligations. It does not guarantee
            the accuracy of any tariff rate. Decisions with real financial consequences should be
            verified with official sources or a qualified professional first.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <SectionHeading>How data is collected and updated</SectionHeading>
          <p className="text-[15.5px] leading-[1.75] text-foreground/90">
            Market and tariff data is maintained as a structured dataset, not scraped or invented
            on the fly. Every figure carries a confidence label — official, estimated, or unknown
            — along with the source it&apos;s based on and when it was last reviewed. Data is
            reviewed and updated by hand against tracked government and industry sources; the
            review date shown against each figure reflects when that was last done.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <SectionHeading>Rates can be estimated</SectionHeading>
          <p className="text-[15.5px] leading-[1.75] text-foreground/90">
            Tariff treatment often depends on the exact product classification, its origin, and
            rules that can change with little notice. Where TariffCompass shows a figure as
            estimated, treat it as directional — a reason to look closer, not a confirmed number to
            act on directly.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <SectionHeading>Not a government tool</SectionHeading>
          <p className="text-[15.5px] leading-[1.75] text-foreground/90">
            TariffCompass is independently built and operated. It is not affiliated with, endorsed
            by, or acting on behalf of the Government of Canada, the Canada Border Services Agency
            (CBSA), Export Development Canada (EDC), the Business Development Bank of Canada
            (BDC), or any U.S. government agency. Where we reference their programs, we link to
            the official pages so you can confirm details directly. See our{" "}
            <Link
              href="/notices"
              className="underline decoration-border underline-offset-4 hover:decoration-foreground"
            >
              Notices
            </Link>{" "}
            page for the full statement.
          </p>
        </section>
      </div>
    </div>
  );
}
