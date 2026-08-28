import { createCheckoutSession } from "@/lib/stripe/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PRICING } from "@/lib/pricing";

export function SubscribeButton({
  label = `Subscribe to Business — C$${PRICING.business.monthlyCad}/month`,
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <form action={createCheckoutSession}>
      <Button
        type="submit"
        size="lg"
        className={cn(
          "h-12 rounded-full px-9 text-[15px] font-medium tracking-tight shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.25)]",
          className
        )}
      >
        {label}
      </Button>
    </form>
  );
}
