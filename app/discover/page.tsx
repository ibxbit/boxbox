import Link from "next/link";
import { Dices } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";

export const metadata = { title: "Discover — BOXBOX" };

const DECADES = [2020, 2010, 2000, 1990, 1980, 1970, 1960, 1950];

export default function DiscoverPage() {
  return (
    <div className="container mx-auto flex flex-col gap-10 px-4 pb-12 pt-24 md:pb-24 md:pt-32">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight md:text-5xl">
            Discover 76 Seasons
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Every Formula 1 World Championship since 1950. A season is one year of racing —
            pick one to see all of its Grands Prix.
          </p>
        </div>
        <Link href="/random" className={buttonVariants({ variant: "outline" })}>
          <Dices className="size-4" /> Random race
        </Link>
      </div>

      {DECADES.map((decade) => {
        const years: number[] = [];
        for (let y = Math.min(decade + 9, 2026); y >= decade; y--) years.push(y);
        return (
          <section key={decade} className="flex flex-col gap-3">
            <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground">
              {decade}s
            </h2>
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-10">
              {years.map((y) => (
                <Link
                  key={y}
                  href={`/season/${y}`}
                  className="rounded-xl bg-card py-4 text-center font-mono text-sm font-bold ring-1 ring-border/50 transition-all duration-300 hover:-translate-y-0.5 hover:ring-border"
                >
                  {y}
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
