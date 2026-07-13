"use client";

import { useState } from "react";
import { ArrowDown01, Star } from "lucide-react";

import RaceCard from "@/components/RaceCard";
import { Button } from "@/components/ui/button";

export interface SeasonRaceLite {
  season: string;
  round: string;
  title: string;
  country: string;
  image: string;
  score: number;
}

// Client-side sortable grid: chronological or best-rated first.
export function SeasonGrid({ races }: { races: SeasonRaceLite[] }) {
  const [sort, setSort] = useState<"round" | "score">("round");

  const sorted = [...races].sort((a, b) =>
    sort === "round" ? Number(a.round) - Number(b.round) : b.score - a.score
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Sort
        </span>
        <Button
          size="sm"
          variant={sort === "round" ? "secondary" : "ghost"}
          onClick={() => setSort("round")}
        >
          <ArrowDown01 className="size-3.5" /> By round
        </Button>
        <Button
          size="sm"
          variant={sort === "score" ? "secondary" : "ghost"}
          onClick={() => setSort("score")}
        >
          <Star className="size-3.5" /> Best rated
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {sorted.map((r) => (
          <RaceCard
            key={r.round}
            season={r.season}
            round={r.round}
            title={r.title}
            country={r.country}
            image={r.image}
            score={r.score}
          />
        ))}
      </div>
    </div>
  );
}
