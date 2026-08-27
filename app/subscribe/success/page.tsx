import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getStripeClient } from "@/lib/stripe/client";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function SubscribeSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  if (!sessionId) redirect("/dashboard");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const stripe = getStripeClient();
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["subscription"],
  });

  const isComplete = session.status === "complete";
  const subscription =
    session.subscription && typeof session.subscription === "object"
      ? session.subscription
      : null;

  if (isComplete && subscription) {
    const customerId =
      typeof session.customer === "string" ? session.customer : session.customer?.id;

    await supabase.from("profiles").upsert(
      {
        id: user.id,
        stripe_customer_id: customerId ?? null,
        stripe_subscription_id: subscription.id,
        subscription_status: subscription.status,
      },
      { onConflict: "id" }
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-32 text-center sm:py-40">
      <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        {isComplete ? "You're subscribed" : "Payment not completed"}
      </h1>
      <p className="mt-4 max-w-sm text-lg text-muted-foreground">
        {isComplete
          ? "Your C$29/month plan is active. You can now generate AI diversification briefs."
          : "We couldn't confirm your payment. If you were charged, contact support — otherwise you can try again from your dashboard."}
      </p>
      <Button
        size="lg"
        render={<Link href="/dashboard" />}
        nativeButton={false}
        className="mt-10 h-12 rounded-full px-9 text-[15px] font-medium tracking-tight shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.25)]"
      >
        Continue to Dashboard
      </Button>
    </div>
  );
}
