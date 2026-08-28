"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getStripeClient } from "@/lib/stripe/client";
import { createClient } from "@/lib/supabase/server";
import { PRICING } from "@/lib/pricing";

const BUSINESS_PRICE_ENV = "STRIPE_PRICE_ID";

async function getOrigin(): Promise<string> {
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  return `${protocol}://${host}`;
}

export async function createCheckoutSession(): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .maybeSingle();

  let customerId = profile?.stripe_customer_id ?? undefined;
  const stripe = getStripeClient();
  const businessPriceId = process.env[BUSINESS_PRICE_ENV];

  if (!businessPriceId) {
    throw new Error(`${BUSINESS_PRICE_ENV} is not configured.`);
  }

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { supabase_user_id: user.id },
    });
    customerId = customer.id;
    await supabase
      .from("profiles")
      .upsert({ id: user.id, stripe_customer_id: customerId }, { onConflict: "id" });
  }

  const origin = await getOrigin();

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: businessPriceId, quantity: 1 }],
    metadata: {
      subscription_tier: "business",
      standard_monthly_price_cad: String(PRICING.business.monthlyCad),
    },
    subscription_data: {
      metadata: {
        subscription_tier: "business",
        standard_monthly_price_cad: String(PRICING.business.monthlyCad),
      },
    },
    success_url: `${origin}/subscribe/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/dashboard`,
  });

  if (!session.url) {
    throw new Error("Failed to create checkout session");
  }

  redirect(session.url);
}

export async function createBillingPortalSession(): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.stripe_customer_id) redirect("/dashboard");

  const stripe = getStripeClient();
  const origin = await getOrigin();
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${origin}/dashboard`,
  });

  redirect(portalSession.url);
}
