import Link from "next/link";
import { notFound } from "next/navigation";

import { SeasonGrid } from "@/components/season-grid";
import { CLASSICS } from "@/lib/classics";
import { communityScore, getSeasonRaces, localRaceImage } from "@/lib/f1";

export default async function SeasonPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;
  if (!/^\d{4}$/.test(year)) notFound();

  const races = await getSeasonRaces(year);
  const racesLite = races.map((r) => {
    const classic = CLASSICS.find((c) => c.season === r.season && c.round === r.round);
    return {
      season: r.season,
      round: r.round,
      title: r.raceName,
      country: r.Circuit.Location.country,
      image: classic?.image ?? localRaceImage(r.season, r.round),
      score: classic?.score ?? communityScore(r.season, r.round),
    };
  });

  return (
    <div className="container mx-auto flex flex-col gap-6 px-4 pb-12 pt-24 md:pb-24 md:pt-32">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight md:text-5xl">
            {year} Season
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {races.length > 0 ? `${races.length} Grands Prix` : "One year of racing"} — sort
            by rating to find the bangers first.
          </p>
        </div>
        <Link
          href="/discover"
          className="shrink-0 pb-1 text-xs font-black uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
        >
          All seasons →
        </Link>
      </div>
      {races.length === 0 ? (
        <p className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
          Couldn&apos;t load races for {year}. The API may be busy — try again in a moment.
        </p>
      ) : (
        <SeasonGrid races={racesLite} />
      )}
    </div>
  );
}
