"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import RaceCard from "@/components/RaceCard";
import { buttonVariants } from "@/components/ui/button";
import { countryFlag } from "@/lib/f1";
import {
  ACHIEVEMENTS,
  levelOf,
  readStats,
  xpOf,
  type Level,
  type Stats as GameStats,
} from "@/lib/gamification";

interface RatedRace {
  id: string;
  season: string;
  round: string;
  rating: number | null;
  review: string | null;
  title: string;
  country: string;
  image: string | null;
}

function readAll(): { user: string | null; races: RatedRace[]; watchlistCount: number } {
  const user = localStorage.getItem("boxbox-user");
  const byId = new Map<string, Partial<RatedRace>>();

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;
    const m = key.match(/^boxbox-(rating|review|meta)-(\d{4})-(\d{1,2})$/);
    if (!m) continue;
    const [, kind, season, round] = m;
    const id = `${season}-${round}`;
    const entry = byId.get(id) ?? { id, season, round };
    const value = localStorage.getItem(key) ?? "";
    if (kind === "rating") entry.rating = Number(value);
    if (kind === "review") entry.review = value;
    if (kind === "meta") {
      try {
        const meta = JSON.parse(value);
        entry.title = meta.title;
        entry.country = meta.country;
        entry.image = meta.image;
      } catch {
        // ignore corrupt meta
      }
    }
    byId.set(id, entry);
  }

  const races = [...byId.values()]
    .filter((e) => e.rating != null || e.review)
    .map((e) => ({
      id: e.id!,
      season: e.season!,
      round: e.round!,
      rating: e.rating ?? null,
      review: e.review ?? null,
      title: e.title ?? `Round ${e.round}, ${e.season}`,
      country: e.country ?? "",
      image: e.image ?? null,
    }))
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

  let watchlistCount = 0;
  try {
    const list = JSON.parse(localStorage.getItem("boxbox-watchlist") ?? "[]");
    if (Array.isArray(list)) watchlistCount = list.length;
  } catch {
    // ignore
  }

  return { user, races, watchlistCount };
}

export default function ProfilePage() {
  const [user, setUser] = useState<string | null>(null);
  const [races, setRaces] = useState<RatedRace[]>([]);
  const [watchlistCount, setWatchlistCount] = useState(0);
  const [stats, setStats] = useState<GameStats | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const data = readAll();
    setUser(data.user);
    setRaces(data.races);
    setWatchlistCount(data.watchlistCount);
    setStats(readStats());
    setLoaded(true);
  }, []);

  const rated = races.filter((r) => r.rating != null);
  const reviews = races.filter((r) => r.review);
  const avg =
    rated.length > 0
      ? (rated.reduce((s, r) => s + (r.rating ?? 0), 0) / rated.length).toFixed(1)
      : "—";

  if (!loaded) return null;

  const xp = stats ? xpOf(stats) : 0;
  const level = levelOf(xp);
  const earned = stats ? ACHIEVEMENTS.filter((a) => a.earned(stats)) : [];

  return (
    <div className="container mx-auto flex flex-col gap-10 px-4 pb-12 pt-24 md:pb-24 md:pt-32">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight md:text-5xl">
          {user ? `${user}'s Paddock` : "Your Paddock"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Everything you&apos;ve rated, reviewed and saved — stored on this device.
          {!user && (
            <>
              {" "}
              <Link href="/login" className="underline underline-offset-4 hover:text-foreground">
                Pick a username
              </Link>{" "}
              to put a name on it.
            </>
          )}
        </p>
      </div>

      {/* Career (XP + streak) */}
      <CareerCard level={level} streak={stats?.streak ?? 0} best={stats?.bestStreak ?? 0} />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Stat label="Day streak" value={stats?.streak ? `${stats.streak} 🔥` : 0} />
        <Stat label="Races rated" value={rated.length} />
        <Stat label="Reviews written" value={reviews.length} />
        <Stat label="Average rating" value={avg} />
        <Stat label="On watchlist" value={watchlistCount} />
        <Stat label="Cars built" value={stats?.cars ?? 0} />
      </div>

      {/* Achievements */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-xl font-black uppercase tracking-tight md:text-2xl">
            Achievements
          </h2>
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {earned.length} / {ACHIEVEMENTS.length} unlocked
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8">
          {ACHIEVEMENTS.map((a) => {
            const got = stats ? a.earned(stats) : false;
            return (
              <div
                key={a.id}
                className={`flex flex-col items-center gap-1 rounded-xl p-4 text-center ring-1 transition-all ${
                  got
                    ? "bg-card ring-border/50"
                    : "opacity-40 ring-border/30 grayscale"
                }`}
                title={got ? a.desc : `Locked — ${a.desc}`}
              >
                <span className="text-2xl">{a.emoji}</span>
                <span className="text-xs font-bold">{a.name}</span>
                <span className="text-[10px] leading-tight text-muted-foreground">
                  {a.desc}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {races.length === 0 ? (
        <div className="flex flex-col items-start gap-4 rounded-xl border bg-card p-8">
          <p className="text-sm text-muted-foreground">
            Nothing here yet — open any race and hit the rating bar to start your collection.
          </p>
          <Link href="/" className={buttonVariants({ variant: "outline" })}>
            Find a race to rate
          </Link>
        </div>
      ) : (
        <>
          {rated.length > 0 && (
            <section className="flex flex-col gap-4">
              <h2 className="text-xl font-black uppercase tracking-tight md:text-2xl">
                Your Ratings
              </h2>
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {rated.map((r) => (
                  <RaceCard
                    key={r.id}
                    season={r.season}
                    round={r.round}
                    title={r.title}
                    country={r.country}
                    image={r.image}
                    score={(r.rating ?? 0) * 10}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                The score badge on these cards is <em>your</em> rating, out of 100.
              </p>
            </section>
          )}

          {reviews.length > 0 && (
            <section className="flex flex-col gap-4">
              <h2 className="text-xl font-black uppercase tracking-tight md:text-2xl">
                Your Reviews
              </h2>
              <div className="flex flex-col gap-3">
                {reviews.map((r) => (
                  <Link
                    key={r.id}
                    href={`/race/${r.season}/${r.round}`}
                    className="group rounded-xl bg-card p-5 ring-1 ring-border/50 transition-all hover:ring-border"
                  >
                    <div className="mb-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <span className="text-sm font-bold group-hover:underline group-hover:underline-offset-4">
                        {countryFlag(r.country)} {r.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {r.season} · R{r.round}
                        {r.rating != null && ` · rated ${r.rating}/10`}
                      </span>
                    </div>
                    <p className="text-sm italic leading-relaxed text-muted-foreground">
                      &ldquo;{r.review}&rdquo;
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function CareerCard({ level, streak, best }: { level: Level; streak: number; best: number }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-card p-6 ring-1 ring-border/50 md:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Career level
          </div>
          <div className="text-2xl font-black uppercase tracking-tight md:text-3xl">
            {level.name}
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black tracking-tight">{level.xp} XP</div>
          <div className="text-xs text-muted-foreground">
            {level.nextXp !== null
              ? `${level.nextXp - level.xp} XP to ${level.nextName}`
              : "Maximum level reached"}
          </div>
        </div>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-700"
          style={{ width: `${Math.round(level.progress * 100)}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Earn XP by rating races (+25), writing reviews (+40), building cars in the Garage
        (+30), growing your watchlist (+5) and exploring race pages (+2). Your best streak so far is {best} day{best === 1 ? "" : "s"}
        {streak > 0 && ` — current streak ${streak} 🔥. Come back tomorrow to keep it going`}
        .
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-card p-5 ring-1 ring-border/50">
      <div className="text-3xl font-black tracking-tight">{value}</div>
      <div className="mt-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
