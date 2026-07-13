"use client";

import { useEffect, useState } from "react";

import RaceCard from "@/components/RaceCard";
import { type WatchRace } from "@/components/WatchlistButton";

const HEADING_CLASS = "text-3xl font-black uppercase tracking-tight md:text-5xl";

// Renders a row of race cards backed by a localStorage list (watchlist,
// recently viewed…). Client-only; hides itself while the list is empty.
export function StoredRacesRow({
  storageKey,
  title,
  subtitle,
  limit,
}: {
  storageKey: string;
  title: string;
  subtitle: string;
  limit?: number;
}) {
  const [races, setRaces] = useState<WatchRace[]>([]);

  useEffect(() => {
    const load = () => {
      try {
        const list = JSON.parse(localStorage.getItem(storageKey) ?? "[]");
        setRaces(Array.isArray(list) ? list : []);
      } catch {
        setRaces([]);
      }
    };
    load();
    window.addEventListener(`${storageKey}-changed`, load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener(`${storageKey}-changed`, load);
      window.removeEventListener("storage", load);
    };
  }, [storageKey]);

  if (races.length === 0) return null;

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className={HEADING_CLASS}>{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {(limit ? races.slice(0, limit) : races).map((r) => (
          <RaceCard
            key={`${r.season}-${r.round}`}
            season={r.season}
            round={r.round}
            title={r.title}
            country={r.country}
            image={r.image}
          />
        ))}
      </div>
    </section>
  );
}
