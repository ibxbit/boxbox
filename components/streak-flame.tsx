"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Flame } from "lucide-react";

import { readStreak, STREAK_EVENT } from "@/lib/gamification";

// Little flame + day count shown in the navbar once a streak exists.
// Links to the profile where the full streak/XP breakdown lives.
export function StreakFlame() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const update = () => setCount(readStreak().count);
    update();
    window.addEventListener(STREAK_EVENT, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(STREAK_EVENT, update);
      window.removeEventListener("storage", update);
    };
  }, []);

  if (count === 0) return null;

  return (
    <Link
      href="/profile"
      title={`${count}-day streak — visit or rate a race every day to keep it alive`}
      className="flex items-center gap-1 rounded-full bg-orange-500/10 px-2.5 py-1 text-xs font-black text-orange-500 transition-transform hover:scale-105"
    >
      <Flame className="size-3.5 fill-orange-500" />
      {count}
    </Link>
  );
}
