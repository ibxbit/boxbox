"use client";

import { useEffect } from "react";

import { type WatchRace } from "@/components/WatchlistButton";
import { bumpStreak, countVisit } from "@/lib/gamification";

// Invisible helper dropped on race pages — records the visit so the home
// page can show a "Recently Viewed" row, and keeps the daily streak alive.
export default function TrackVisit({ race }: { race: WatchRace }) {
  useEffect(() => {
    try {
      const KEY = "boxbox-recent";
      const list: WatchRace[] = JSON.parse(localStorage.getItem(KEY) ?? "[]");
      const rest = Array.isArray(list)
        ? list.filter((r) => !(r.season === race.season && r.round === race.round))
        : [];
      localStorage.setItem(KEY, JSON.stringify([race, ...rest].slice(0, 12)));
      window.dispatchEvent(new Event("boxbox-recent-changed"));
    } catch {
      // storage unavailable — nothing to do
    }
    bumpStreak();
    countVisit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [race.season, race.round]);

  return null;
}
