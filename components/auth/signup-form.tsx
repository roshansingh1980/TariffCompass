"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signup } from "@/lib/supabase/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SignupForm() {
  const [state, formAction, isPending] = useActionState(signup, undefined);

  if (state?.message) {
    return (
      <div className="rounded-2xl border border-border/50 bg-background p-8 text-center shadow-[0_1px_3px_rgba(0,0,0,0.04)] sm:p-10">
        <p className="text-[15px] text-foreground">{state.message}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-2xl border border-border/50 bg-background p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] sm:p-10">
        <form action={formAction}>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-[13px] font-medium tracking-wide text-foreground"
            >
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="h-11 rounded-lg border-border/50 px-3.5 text-[15px] shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
            />
          </div>

          <div className="mt-5 flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-[13px] font-medium tracking-wide text-foreground"
            >
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              className="h-11 rounded-lg border-border/50 px-3.5 text-[15px] shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
            />
          </div>

          {typeof state?.error === "string" && state.error.length > 0 && (
            <p className="mt-4 text-sm text-destructive">{state.error}</p>
          )}

          <Button
            type="submit"
            disabled={isPending}
            className="mt-7 h-11 w-full rounded-lg text-[15px] font-medium tracking-tight shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all duration-200 hover:bg-primary/90 hover:shadow-md active:scale-[0.99]"
          >
            {isPending ? "Creating account…" : "Create account"}
          </Button>
        </form>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
