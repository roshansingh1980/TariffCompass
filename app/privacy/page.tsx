import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | TariffCompass",
  description: "What data TariffCompass collects, how it's used, and how to request deletion.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-6 py-20 sm:px-8 sm:py-28">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Privacy Policy
      </h1>
      <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
        Last updated August 26, 2026. Written in plain language — if anything is unclear, email{" "}
        <a
          href="mailto:support@tariffcompass.com"
          className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
        >
          support@tariffcompass.com
        </a>
        .
      </p>

      <div className="mt-12 flex flex-col gap-10">
        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-medium tracking-tight text-foreground">
            Account data we store
          </h2>
          <p className="text-[15.5px] leading-[1.75] text-foreground/90">
            When you create an account, we store your email address, an authentication identifier
            managed by our authentication provider (Supabase), and your subscription status. We
            use this to let you log in, keep your account secure, and know whether you have access
            to paid features.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-medium tracking-tight text-foreground">
            Business inputs we store
          </h2>
          <p className="text-[15.5px] leading-[1.75] text-foreground/90">
            The information you enter during onboarding — your trade scenario, province or state,
            product category, and product name — is saved to your account so your Results screen
            is there when you come back. This data is used only to generate your market comparison
            and, if you request one, your AI brief.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-medium tracking-tight text-foreground">
            Payments — handled by Stripe
          </h2>
          <p className="text-[15.5px] leading-[1.75] text-foreground/90">
            All payment processing is handled by Stripe. TariffCompass never sees or stores your
            full card number. Stripe shares back only what we need to manage your subscription —
            your subscription status and billing identifiers.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-medium tracking-tight text-foreground">
            AI briefs — generated using Anthropic
          </h2>
          <p className="text-[15.5px] leading-[1.75] text-foreground/90">
            If you generate an AI diversification brief, the business inputs and market comparison
            data relevant to your request are sent to Anthropic&apos;s Claude API to generate the
            brief text. We send only what&apos;s needed to produce your brief — no more than the
            business inputs already described above.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-medium tracking-tight text-foreground">
            We do not sell your data
          </h2>
          <p className="text-[15.5px] leading-[1.75] text-foreground/90">
            We do not sell your personal data or business inputs to third parties, and we do not
            use them for advertising.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-medium tracking-tight text-foreground">
            Requesting deletion
          </h2>
          <p className="text-[15.5px] leading-[1.75] text-foreground/90">
            To request deletion of your account and the data associated with it, email{" "}
            <a
              href="mailto:support@tariffcompass.com"
              className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
            >
              support@tariffcompass.com
            </a>{" "}
            from the address on your account. We&apos;ll confirm once your data has been removed.
          </p>
        </section>
      </div>
    </div>
  );
}
