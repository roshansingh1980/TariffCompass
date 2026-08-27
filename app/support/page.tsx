import type { Metadata } from "next";
import Link from "next/link";
import { BackLink } from "@/components/back-link";

export const metadata: Metadata = {
  title: "Support | TariffCompass",
  description:
    "Get help using TariffCompass — how the free and paid plans work, how billing and cancellation work, and how to reach support.",
  alternates: { canonical: "/support" },
};

export default function SupportPage() {
  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-6 py-20 sm:px-8 sm:py-28">
      <BackLink fallbackHref="/" />
      <h1 className="mt-8 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Support
      </h1>
      <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
        How TariffCompass works, how billing works, and how to reach us.
      </p>

      <div className="mt-12 flex flex-col gap-10">
        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-medium tracking-tight text-foreground">
            How to use TariffCompass
          </h2>
          <p className="text-[15.5px] leading-[1.75] text-foreground/90">
            No account needed to start. Go to the dashboard and walk through four short steps:
            tell us your scenario (exporting or importing, U.S. or elsewhere), where your business
            is based, what product category you sell or import, and roughly how much you ship.
            TariffCompass then shows a market comparison — ease of doing business, overall
            attractiveness, and current risk for each market — along with government support
            programs that may be relevant.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-medium tracking-tight text-foreground">Free vs. paid</h2>
          <p className="text-[15.5px] leading-[1.75] text-foreground/90">
            Anyone can complete the wizard and see their Results screen for free, with no account
            required — market names, ease of doing business scores, overall attractiveness and
            risk ratings, the export tariff rate range for every market, each rate&apos;s data
            status and source, and the names of relevant government support programs.
          </p>
          <p className="text-[15.5px] leading-[1.75] text-foreground/90">
            A free account (no payment) lets you save profiles and reopen them later.
          </p>
          <p className="text-[15.5px] leading-[1.75] text-foreground/90">
            A paid subscription unlocks your estimated dollar exposure, the cost/friction detail
            for every market, the full risk breakdown behind each rating, full government support
            program descriptions and links, and the ability to generate an AI diversification
            brief.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-medium tracking-tight text-foreground">
            How billing works
          </h2>
          <p className="text-[15.5px] leading-[1.75] text-foreground/90">
            The paid plan is C$29/month, billed monthly through Stripe. Stripe handles all payment
            details directly — TariffCompass never sees or stores your card number. Your
            subscription renews automatically each month until you cancel.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-medium tracking-tight text-foreground">How to cancel</h2>
          <p className="text-[15.5px] leading-[1.75] text-foreground/90">
            Click <span className="font-medium text-foreground">Manage billing</span> in the
            header while logged in. This opens Stripe&apos;s secure billing portal, where you can
            cancel your subscription at any time. Your access continues until the end of the
            billing period you&apos;ve already paid for.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-medium tracking-tight text-foreground">Contact support</h2>
          <p className="text-[15.5px] leading-[1.75] text-foreground/90">
            Have a question or run into a problem? Email us at{" "}
            <a
              href="mailto:support@tariffcompass.ca"
              className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
            >
              support@tariffcompass.ca
            </a>{" "}
            and we&apos;ll get back to you.
          </p>
        </section>

        <section className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-foreground/[0.02] p-6">
          <h2 className="text-base font-medium tracking-tight text-foreground">
            A note on accuracy
          </h2>
          <p className="text-[14px] leading-relaxed text-muted-foreground">
            Tariff rates and market figures shown in TariffCompass are estimates intended for
            general guidance, not confirmed official determinations. Always verify specific rates
            and program eligibility with official government sources or a qualified customs, tax,
            or trade professional before making business decisions. See our{" "}
            <Link href="/notices" className="underline decoration-border underline-offset-4 hover:decoration-foreground">
              Notices
            </Link>{" "}
            page for more detail.
          </p>
        </section>
      </div>
    </div>
  );
}
