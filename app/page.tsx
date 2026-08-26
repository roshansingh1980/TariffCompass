import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
        TariffCompass
      </h1>
      <p className="mt-5 max-w-md text-lg text-muted-foreground">
        Navigate tariffs. Find your path.
      </p>
      <Button size="lg" className="mt-10 h-11 px-8 text-base">
        Get Started
      </Button>
    </div>
  );
}
