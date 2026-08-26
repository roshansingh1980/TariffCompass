import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";
import { TcLockup } from "@/components/brand/tc-lockup";
import { BackLink } from "@/components/back-link";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-32 sm:py-40">
      <BackLink fallbackHref="/" className="absolute top-6 left-6 sm:top-8 sm:left-8" />
      <TcLockup size="default" orientation="stacked" className="mb-10" />
      <div className="w-full max-w-sm text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Welcome back
        </h1>
        <p className="mt-3 text-[15px] text-muted-foreground">
          Log in to continue to your dashboard.
        </p>
      </div>

      <div className="mt-10 w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
