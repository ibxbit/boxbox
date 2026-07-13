import { redirect } from "next/navigation";

import { CLASSICS } from "@/lib/classics";
import { getSeasonRaces } from "@/lib/f1";

export const dynamic = "force-dynamic";

// Lucky-dip: jump to a random Grand Prix from any season since 1950.
export async function GET() {
  const year = 1950 + Math.floor(Math.random() * 77);
  const races = await getSeasonRaces(String(year));

  if (races.length > 0) {
    const r = races[Math.floor(Math.random() * races.length)];
    redirect(`/race/${r.season}/${r.round}`);
  }

  const c = CLASSICS[Math.floor(Math.random() * CLASSICS.length)];
  redirect(`/race/${c.season}/${c.round}`);
}
