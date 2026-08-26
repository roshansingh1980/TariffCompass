"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login } from "@/lib/supabase/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, undefined);

  return (
    <form action={formAction}>
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="h-12 rounded-xl border-border/60 px-4 text-base"
        />
      </div>

      <div className="mt-5 flex flex-col gap-2">
        <label htmlFor="password" className="text-sm font-medium text-foreground">
          Password
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          minLength={6}
          className="h-12 rounded-xl border-border/60 px-4 text-base"
        />
      </div>

      {state?.error && <p className="mt-4 text-sm text-destructive">{state.error}</p>}

      <Button
        type="submit"
        disabled={isPending}
        className="mt-7 h-12 w-full rounded-xl text-[15px] font-medium tracking-tight shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-200 hover:bg-primary/90 hover:shadow-md"
      >
        {isPending ? "Logging in…" : "Log in"}
      </Button>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}
