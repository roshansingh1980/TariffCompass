"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { linkGhostUserData } from "@/lib/supabase/link-ghost-user";

export type AuthActionState = { error?: string; message?: string } | undefined;

/**
 * Never hand a raw error (or an unexpected shape of one) to the client.
 * Only ever returns a short, human string — either the auth provider's own
 * message when it looks like real prose, or a generic fallback otherwise.
 */
function toHumanAuthError(error: unknown, fallback: string): string {
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string" && message.trim().length > 0 && message.length < 200) {
      return message;
    }
  }
  return fallback;
}

export async function login(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  let userId: string;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      return {
        error: toHumanAuthError(
          error,
          "We couldn't log you in. Check your email and password and try again."
        ),
      };
    }
    userId = data.user.id;
  } catch (err) {
    console.error("Login failed unexpectedly:", err);
    return { error: "Something went wrong logging you in. Please try again in a moment." };
  }

  await linkGhostUserData(userId);
  redirect("/dashboard");
}

export async function signup(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  let userId: string;
  let hasSession: boolean;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error || !data.user) {
      return {
        error: toHumanAuthError(
          error,
          "We couldn't create your account. Please check your details and try again."
        ),
      };
    }
    userId = data.user.id;
    hasSession = Boolean(data.session);
  } catch (err) {
    console.error("Signup failed unexpectedly:", err);
    return { error: "Something went wrong creating your account. Please try again in a moment." };
  }

  if (!hasSession) {
    return { message: "Check your email to confirm your account, then log in." };
  }

  await linkGhostUserData(userId);
  redirect("/dashboard");
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
