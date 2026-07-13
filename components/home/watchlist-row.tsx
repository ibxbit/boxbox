"use client";

import { StoredRacesRow } from "@/components/home/stored-races-row";

export function WatchlistRow() {
  return (
    <StoredRacesRow
      storageKey="boxbox-watchlist"
      title="Your Watchlist"
      subtitle="Races you saved to watch later — stored on this device."
    />
  );
}
