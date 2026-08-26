import type { Metadata } from "next";
import { SignupForm } from "@/components/auth/signup-form";
import { TcLockup } from "@/components/brand/tc-lockup";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-32 sm:py-40">
      <TcLockup size="default" orientation="stacked" className="mb-10" />
      <div className="w-full max-w-sm text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Create your account
        </h1>
        <p className="mt-3 text-[15px] text-muted-foreground">
          Start navigating tariffs for your business.
        </p>
      </div>

      <div className="mt-10 w-full max-w-sm">
        <SignupForm />
      </div>
    </div>
  );
}
