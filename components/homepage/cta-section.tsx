import Link from "next/link";
import { Button } from "@/components/ui/button";

const BUTTON_CLASSNAME =
  "h-12 rounded-full px-10 text-[15px] font-medium tracking-tight shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.25)]";

export function CtaSection({
  isLoggedIn,
  savedProfileCount,
}: {
  isLoggedIn: boolean;
  savedProfileCount: number;
}) {
  return (
    <div className="flex w-full flex-col items-center gap-4 px-6 pb-36 text-center">
      <Button
        size="lg"
        render={<Link href="/dashboard" />}
        nativeButton={false}
        className={BUTTON_CLASSNAME}
      >
        {isLoggedIn ? "Open dashboard" : "See your market comparison — free, no account needed"}
      </Button>

      {isLoggedIn && savedProfileCount > 0 && (
        <Link
          href="/dashboard"
          className="text-sm font-medium tracking-wide text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          {savedProfileCount === 1
            ? "You have 1 saved profile — resume where you left off"
            : `You have ${savedProfileCount} saved profiles — resume where you left off`}
        </Link>
      )}
    </div>
  );
}
