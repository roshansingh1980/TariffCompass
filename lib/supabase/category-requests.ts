"use server";

import { createClient } from "@supabase/supabase-js";

export type SubmitCategoryRequestResult = { error: string } | { success: true };

/**
 * Logs a request for a product category we don't have market data for yet.
 * Public by design — reachable by anonymous visitors, since that's exactly
 * who hits this screen. Uses the plain anon-key client (no session
 * required); RLS on category_requests grants insert to anon/authenticated
 * and nothing else, so this is safe to call from any visitor state.
 */
export async function submitCategoryRequest(
  email: string,
  productDescription: string
): Promise<SubmitCategoryRequestResult> {
  const trimmedEmail = email.trim();
  const trimmedDescription = productDescription.trim();

  if (!trimmedEmail) {
    return { error: "Enter your email so we can let you know when this is ready." };
  }
  if (!trimmedDescription) {
    return { error: "Describe your product so we know what to prioritize." };
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { error } = await supabase.from("category_requests").insert({
    email: trimmedEmail,
    product_description: trimmedDescription,
  });

  if (error) {
    console.error("Failed to submit category request:", error);
    return { error: "Something went wrong submitting your request. Please try again." };
  }
  return { success: true };
}
