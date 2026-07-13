"use client";

import { StoredRacesRow } from "@/components/home/stored-races-row";

export function RecentRow() {
  return (
    <StoredRacesRow
      storageKey="boxbox-recent"
      title="Recently Viewed"
      subtitle="Pick up where you left off."
      limit={6}
    />
  );
}
