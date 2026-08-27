import { SubscribeButton } from "@/components/billing/subscribe-button";
import { cn } from "@/lib/utils";

/**
 * First sentence of a real string, never an invented summary. Falls back to
 * the whole string if there's no sentence-ending punctuation to split on.
 */
export function firstSentence(text: string): string {
  const match = text.match(/^.*?[.!?](?:\s|$)/);
  return match ? match[0].trim() : text;
}

/**
 * The one masking treatment used everywhere paid content is gated: the
 * section heading and a real first line always show, then a fade and an
 * upgrade prompt — never a blank or fully blurred box. Used by the risk
 * dialog's friction/risk breakdowns, government program descriptions, and
 * the AI brief upsell.
 */
export function MaskedSection({
  heading,
  preview,
  ctaLabel = "Unlock with TariffCompass — C$29/month",
  className,
}: {
  heading: string;
  preview: string;
  ctaLabel?: string;
  className?: string;
}) {
  return (
    <section className={cn("flex flex-col gap-2", className)}>
      <h3 className="text-sm font-medium tracking-wide text-foreground">{heading}</h3>
      <div className="relative">
        <p className="text-[14.5px] leading-relaxed text-muted-foreground">{preview}</p>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-background to-transparent"
        />
      </div>
      <SubscribeButton label={ctaLabel} className="mt-1 h-9 self-start rounded-full px-5 text-xs" />
    </section>
  );
}
