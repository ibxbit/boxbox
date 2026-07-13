"use client";

import { useEffect, useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";

import { Button } from "@/components/ui/button";

export interface WatchRace {
  season: string;
  round: string;
  title: string;
  country: string;
  image: string;
}

const KEY = "boxbox-watchlist";

export function readWatchlist(): WatchRace[] {
  try {
    const list = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export default function WatchlistButton({ race }: { race: WatchRace }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(readWatchlist().some((r) => r.season === race.season && r.round === race.round));
  }, [race.season, race.round]);

  function toggle() {
    const list = readWatchlist();
    const exists = list.some((r) => r.season === race.season && r.round === race.round);
    const next = exists
      ? list.filter((r) => !(r.season === race.season && r.round === race.round))
      : [...list, race];
    localStorage.setItem(KEY, JSON.stringify(next));
    setSaved(!exists);
    window.dispatchEvent(new Event("boxbox-watchlist-changed"));
  }

  return (
    <Button variant={saved ? "secondary" : "outline"} className="w-full" onClick={toggle}>
      {saved ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
      {saved ? "On your watchlist" : "Add to watchlist"}
    </Button>
  );
}
