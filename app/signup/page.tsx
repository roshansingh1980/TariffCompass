import type { Metadata } from "next";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-32 sm:py-40">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Create your account
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Start navigating tariffs for your business.
        </p>
      </div>

      <div className="mt-12 w-full max-w-sm">
        <SignupForm />
      </div>
    </div>
  );
}
