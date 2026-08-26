import Stripe from "stripe";

if (typeof window !== "undefined") {
  throw new Error("lib/stripe/client.ts must only be imported on the server.");
}

let cachedClient: Stripe | null = null;

/**
 * Lazily constructs the Stripe client. Deferring construction (rather than
 * `new Stripe(...)` at module scope) means pages that merely import this
 * module — e.g. the header, via lib/stripe/actions.ts — don't crash at
 * build time before STRIPE_SECRET_KEY is configured.
 */
export function getStripeClient(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured.");
  }
  if (!cachedClient) {
    cachedClient = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return cachedClient;
}
