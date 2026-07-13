import RaceCard from "@/components/RaceCard";
import { TopTenCarousel } from "@/components/home/top-ten-carousel";
import { RecentRow } from "@/components/home/recent-row";
import { WatchlistRow } from "@/components/home/watchlist-row";
import { InfoTip } from "@/components/info-tip";
import { CLASSICS } from "@/lib/classics";
import { getSeasonRaces, localRaceImage } from "@/lib/f1";

const FEATURED_HEADING_CLASS = "text-3xl font-black uppercase tracking-tight md:text-5xl";

export default async function Home() {
  const season = "2026";
  const races = await getSeasonRaces(season);

  return (
    <div className="container mx-auto flex flex-col gap-12 px-4 pb-12 pt-24 md:gap-16 md:pb-24 md:pt-32">
      <TopTenCarousel races={CLASSICS} />

      <RecentRow />

      <WatchlistRow />

      <section className="flex flex-col gap-4">
        <div>
          <h2 className={FEATURED_HEADING_CLASS}>
            This Season{" "}
            <InfoTip
              className="ml-1"
              text={`The ${season} FIA Formula 1 World Championship — one championship made up of ~24 races (“Grands Prix”), each in a different country. Drivers score points at every round; the most points at the end of the year wins the title.`}
            />
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Every Grand Prix on the {season} calendar — click one for results, ratings and
            reviews.
          </p>
        </div>
        {races.length === 0 ? (
          <p className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
            Couldn&apos;t load the live {season} calendar right now — try again in a moment.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {races.map((r) => (
              <RaceCard
                key={r.round}
                season={r.season}
                round={r.round}
                title={r.raceName}
                country={r.Circuit.Location.country}
                image={localRaceImage(r.season, r.round)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
