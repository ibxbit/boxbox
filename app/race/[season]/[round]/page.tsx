import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BookOpen, Star } from "lucide-react";

import RateWidget from "@/components/RateWidget";
import TrackVisit from "@/components/TrackVisit";
import WatchlistButton from "@/components/WatchlistButton";
import { HighlightSection, HighlightSkeleton } from "@/components/highlight-section";
import { InfoTip } from "@/components/info-tip";
import { Badge } from "@/components/ui/badge";
import { CLASSICS } from "@/lib/classics";
import {
  communityScore,
  countryFlag,
  getRaceResults,
  getSeasonRaces,
  localRaceImage,
} from "@/lib/f1";

const MEDALS = ["🥇", "🥈", "🥉"];

export default async function RacePage({
  params,
}: {
  params: Promise<{ season: string; round: string }>;
}) {
  const { season, round } = await params;
  if (!/^\d{4}$/.test(season) || !/^\d{1,2}$/.test(round)) notFound();

  let { race, results } = await getRaceResults(season, round);
  if (!race) {
    // No results yet (future or very recent race) — the race itself may still
    // exist on the season calendar, so don't 404 on it.
    race = (await getSeasonRaces(season)).find((r) => r.round === round) ?? null;
    results = [];
  }
  if (!race) notFound();

  const classic = CLASSICS.find((c) => c.season === season && c.round === round);
  const image = classic?.image ?? localRaceImage(season, round);
  const score = classic?.score ?? communityScore(season, round);
  const podium = results.slice(0, 3);
  const winner = results[0];
  const { country, locality } = race.Circuit.Location;

  // "Race in numbers" facts
  const pole = results.find((r) => r.grid === "1");
  const finishers = results.filter(
    (r) => r.status === "Finished" || /\+\d+ Laps?/i.test(r.status)
  ).length;
  const dnfs = results.length - finishers;
  const margin = results[1]?.Time?.time ?? null;
  const fastest = results.find((r) => r.FastestLap?.rank === "1");

  return (
    <div className="pb-16">
      <TrackVisit race={{ season, round, title: race.raceName, country, image }} />
      {/* Banner */}
      <div className="relative h-[250px] w-full overflow-hidden md:h-[350px]">
        <Image
          src={image}
          alt={`${race.raceName} banner`}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent" />
      </div>

      <div className="container mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="relative z-10 -mt-20 flex flex-col gap-6 border-b pb-8 md:-mt-32 md:flex-row md:items-end md:gap-8">
          {/* Poster */}
          <div className="relative aspect-[3/4] w-40 shrink-0 overflow-hidden rounded-xl bg-muted ring-1 ring-border shadow-xl md:w-56">
            <Image
              src={image}
              alt={race.raceName}
              fill
              sizes="(max-width: 768px) 160px, 224px"
              className="object-cover"
              priority
            />
          </div>

          {/* Header Info */}
          <div className="flex flex-1 flex-col gap-2 pb-2 md:pb-4">
            <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
              {race.raceName}{" "}
              <InfoTip
                className="ml-1"
                text={`A “Grand Prix” is a single race of the Formula 1 World Championship, usually named after the country that hosts it — it's not a separate tournament. The ${race.raceName} is round ${race.round} of the ${race.season} season, and points scored here count towards the ${race.season} world title.`}
              />
            </h1>
            <p className="font-medium text-muted-foreground">
              {race.Circuit.circuitName} — {locality}, {country}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1.5 font-medium">
                <Star className="h-3.5 w-3.5 fill-current text-yellow-500" />
                {score}%
                <InfoTip
                  className="ml-0.5"
                  text="The community score — the average fan rating for how exciting this race was. Add your own rating in the sidebar and be part of it."
                />
              </Badge>
              <Badge variant="secondary">
                ROUND {race.round}
                <InfoTip
                  className="ml-0.5"
                  text={`The ${race.season} championship is a series of races: round 1, round 2, and so on. This was race number ${race.round} of the ${race.season} calendar.`}
                />
              </Badge>
              <Badge variant="outline" className="uppercase text-muted-foreground">
                {race.date}
              </Badge>
              <Badge variant="outline" className="uppercase text-muted-foreground">
                {race.season} season
              </Badge>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="mt-8 grid grid-cols-1 gap-12 md:grid-cols-[200px_1fr] lg:grid-cols-[250px_1fr]">
          {/* Sidebar */}
          <div className="space-y-8">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Circuit
                <InfoTip
                  className="ml-1.5"
                  text="The racetrack this Grand Prix is held on. Most circuits host the same Grand Prix every year — Monaco at Monte Carlo, the British GP at Silverstone, and so on."
                />
              </h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="font-normal">
                  {countryFlag(country)} {country}
                </Badge>
                <Badge variant="secondary" className="font-normal">
                  {locality}
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Details
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-1">
                <InfoItem label="Date" value={race.date} />
                <InfoItem
                  label="Winner"
                  value={
                    winner ? `${winner.Driver.givenName} ${winner.Driver.familyName}` : null
                  }
                />
                <InfoItem label="Team" value={winner?.Constructor.name} />
                <InfoItem label="Laps" value={winner?.laps} />
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                More
              </h3>
              <Link
                href={`/season/${season}`}
                className="group inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <span className="group-hover:underline group-hover:decoration-dashed group-hover:underline-offset-4">
                  All races of the {season} season
                </span>
              </Link>
              <Link
                href="/rules"
                className="group inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <BookOpen className="size-3.5" />
                <span className="group-hover:underline group-hover:decoration-dashed group-hover:underline-offset-4">
                  New to F1? Learn how it works
                </span>
              </Link>
            </div>

            <div className="space-y-4 border-t pt-4">
              <WatchlistButton
                race={{ season, round, title: race.raceName, country, image }}
              />
              <RateWidget
                raceId={`${season}-${round}`}
                meta={{ season, round, title: race.raceName, country, image }}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="min-w-0 space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">Synopsis</h2>
            <p className="max-w-none text-sm leading-relaxed text-muted-foreground md:text-base">
              {classic
                ? classic.blurb
                : `Round ${race.round} of the ${race.season} Formula 1 World Championship, held at ${race.Circuit.circuitName} in ${locality}, ${country}.`}
            </p>

            {podium.length > 0 && (
              <div className="grid grid-cols-3 gap-3 pt-2">
                {podium.map((r, i) => (
                  <div
                    key={r.position}
                    className="rounded-xl bg-card p-4 text-center ring-1 ring-border/50"
                  >
                    <div className="text-2xl">{MEDALS[i]}</div>
                    <div className="mt-1 truncate text-sm font-bold">
                      {r.Driver.givenName} {r.Driver.familyName}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      {r.Constructor.name}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <h2 className="pt-2 text-xl font-semibold tracking-tight">
              Highlights
              <InfoTip
                className="ml-1.5"
                text="The best moments of this Grand Prix, straight from YouTube — usually the official FORMULA 1 channel. If nothing shows up, footage of this race is rare."
              />
            </h2>
            <Suspense fallback={<HighlightSkeleton />}>
              <HighlightSection season={season} raceName={race.raceName} />
            </Suspense>

            {results.length > 0 && (
              <>
                <h2 className="pt-2 text-xl font-semibold tracking-tight">
                  The Race in Numbers
                </h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <FactCard
                    label="Pole position"
                    value={
                      pole ? `${pole.Driver.givenName} ${pole.Driver.familyName}` : "—"
                    }
                    hint="The driver who qualified fastest and started 1st."
                  />
                  <FactCard
                    label="Finishers"
                    value={`${finishers} / ${results.length}`}
                    hint="Cars that made it to the chequered flag out of everyone who started."
                  />
                  <FactCard
                    label="Retirements"
                    value={dnfs}
                    hint="DNF — “did not finish”. Crashes, engine failures and other dramas."
                  />
                  <FactCard
                    label="Winning margin"
                    value={margin ?? "—"}
                    hint="The gap between 1st and 2nd at the flag. Smaller = closer race."
                  />
                  <FactCard
                    label="Fastest lap"
                    value={
                      fastest
                        ? `${fastest.FastestLap?.Time?.time ?? ""} · ${fastest.Driver.familyName}`
                        : "—"
                    }
                    hint="The single quickest lap anyone set during the race."
                  />
                  <FactCard
                    label="Race distance"
                    value={winner?.laps ? `${winner.laps} laps` : "—"}
                    hint="How many laps of the circuit the winner completed."
                  />
                </div>
              </>
            )}

            <h2 className="pt-2 text-xl font-semibold tracking-tight">Race Result</h2>
            {results.length === 0 ? (
              <p className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
                No results available for this race (it may not have happened yet).
              </p>
            ) : (
              <div className="overflow-x-auto rounded-xl ring-1 ring-border/50">
                <table className="w-full text-sm">
                  <thead className="bg-card text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2">Pos</th>
                      <th className="px-3 py-2">Driver</th>
                      <th className="px-3 py-2">
                        <span className="inline-flex items-center gap-1">
                          Team
                          <InfoTip text="The constructor (team) that builds and runs the car — like Ferrari, McLaren or Red Bull. Two drivers race for each team." />
                        </span>
                      </th>
                      <th className="px-3 py-2">
                        <span className="inline-flex items-center gap-1">
                          Grid
                          <InfoTip text="The starting position for the race, decided by qualifying the day before. Starting 1st is called pole position." />
                        </span>
                      </th>
                      <th className="px-3 py-2">Time / Status</th>
                      <th className="px-3 py-2 text-right">
                        <span className="inline-flex items-center gap-1">
                          <InfoTip text="World Championship points earned in this race. Points add up over the season to decide the Drivers' and Constructors' champions." />
                          Pts
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r) => (
                      <tr key={r.position} className="border-t">
                        <td className="px-3 py-2 font-mono font-bold">{r.position}</td>
                        <td className="px-3 py-2 font-semibold">
                          {r.Driver.givenName} {r.Driver.familyName}
                          {r.Driver.code && (
                            <span className="ml-1.5 font-mono text-xs text-muted-foreground">
                              {r.Driver.code}
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-muted-foreground">{r.Constructor.name}</td>
                        <td className="px-3 py-2 font-mono text-muted-foreground">{r.grid}</td>
                        <td className="px-3 py-2 font-mono text-xs">
                          {r.Time?.time ?? r.status}
                        </td>
                        <td className="px-3 py-2 text-right font-mono">{r.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-1">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

function FactCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: React.ReactNode;
  hint: string;
}) {
  return (
    <div className="rounded-xl bg-card p-4 ring-1 ring-border/50">
      <div className="truncate text-lg font-black tracking-tight">{value}</div>
      <div className="mt-0.5 flex items-center gap-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {label}
        <InfoTip text={hint} />
      </div>
    </div>
  );
}
