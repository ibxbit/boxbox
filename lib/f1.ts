// Data layer: Jolpica (Ergast successor) F1 API + presentation helpers.

const API_BASE = "https://api.jolpi.ca/ergast/f1";

export interface Race {
  season: string;
  round: string;
  raceName: string;
  date: string;
  url?: string;
  Circuit: {
    circuitName: string;
    url?: string;
    Location: { locality: string; country: string };
  };
}

export interface RaceResult {
  position: string;
  points: string;
  grid: string;
  laps: string;
  status: string;
  Driver: {
    givenName: string;
    familyName: string;
    nationality: string;
    code?: string;
  };
  Constructor: { name: string };
  Time?: { time: string };
  FastestLap?: { rank?: string; lap?: string; Time?: { time: string } };
}

async function fetchJson(url: string): Promise<unknown | null> {
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function getSeasonRaces(season: string): Promise<Race[]> {
  const data = (await fetchJson(`${API_BASE}/${season}/races/?limit=30`)) as {
    MRData?: { RaceTable?: { Races?: Race[] } };
  } | null;
  return data?.MRData?.RaceTable?.Races ?? [];
}

export async function getRaceResults(
  season: string,
  round: string
): Promise<{ race: Race | null; results: RaceResult[] }> {
  const data = (await fetchJson(`${API_BASE}/${season}/${round}/results/`)) as {
    MRData?: { RaceTable?: { Races?: (Race & { Results?: RaceResult[] })[] } };
  } | null;
  const race = data?.MRData?.RaceTable?.Races?.[0] ?? null;
  return { race, results: race?.Results ?? [] };
}

function wikiTitle(wikiUrlOrTitle: string): string | null {
  const rawTitle = wikiUrlOrTitle.split("/wiki/").pop();
  if (!rawTitle) return null;
  try {
    return decodeURIComponent(rawTitle);
  } catch {
    return rawTitle;
  }
}

interface MediaItem {
  title?: string;
  type?: string;
  srcset?: { src: string; scale: string }[];
}

// Track maps, flags, logos etc. — never what we want on a poster card.
// Circuit articles get a looser filter since every filename contains
// "circuit"; diagrams there are caught by the PNG penalty instead.
const NON_PHOTO_RACE = /flag|logo|map|diagram|location|icon|symbol|timeline|signature|helmet|emblem|circuit|layout/i;
const NON_PHOTO_CIRCUIT = /flag|logo|map|diagram|location|icon|symbol|timeline|signature|helmet|emblem|layout/i;

// Prefer actual racing photography: starts, cars battling, the winner.
// PNGs on these articles are almost always lap charts or track diagrams,
// so penalise them hard — anything below 0 is treated as "no photo".
function photoScore(title: string): number {
  let s = 0;
  if (/start|grid/i.test(title)) s += 3;
  if (/grand.?prix|_gp|f1/i.test(title)) s += 2;
  if (/winner|podium|leads|racing|battle|crash|pit/i.test(title)) s += 1;
  if (/\.png$/i.test(title)) s -= 3;
  return s;
}

// Best racing photo on a Wikipedia article, or null if it has none.
async function mediaPhoto(title: string, nonPhoto: RegExp): Promise<string | null> {
  const media = (await fetchJson(
    `https://en.wikipedia.org/api/rest_v1/page/media-list/${encodeURIComponent(title)}`
  )) as { items?: MediaItem[] } | null;

  const photos = (media?.items ?? []).filter(
    (i) =>
      i.type === "image" &&
      i.title &&
      /\.(jpe?g|png)$/i.test(i.title) &&
      !nonPhoto.test(i.title) &&
      i.srcset?.length
  );

  let best: MediaItem | null = null;
  let bestScore = -1;
  for (const p of photos) {
    const s = photoScore(p.title!);
    if (s > bestScore) {
      best = p;
      bestScore = s;
    }
  }

  if (!best || bestScore < 0) return null;

  // srcset URLs come straight from the API, so they are always valid.
  // Take the largest entry (~1280px); when only a small 1x thumb exists,
  // fall back to the original file for maximum resolution — next/image
  // downscales for cards, so everything stays sharp on retina screens.
  const srcset = best.srcset!;
  let src = srcset[srcset.length - 1].src;
  if (srcset.length === 1) {
    const m = src.match(/^(.*)\/thumb\/(.+?)\/\d+px-[^/]+$/);
    if (m) src = `${m[1]}/${m[2]}`;
  }
  return src.startsWith("//") ? `https:${src}` : src;
}

// Racing photo for a race: best photo on the race's article, then the
// circuit's article (aerials, cars on track), then the race page thumbnail
// (usually a track map) as a last resort. Accepts wiki URLs or titles.
export async function wikiThumb(
  wikiUrlOrTitle: string | null | undefined,
  width = 1280,
  circuitUrlOrTitle?: string | null
): Promise<string | null> {
  if (!wikiUrlOrTitle) return null;
  const title = wikiTitle(wikiUrlOrTitle);
  if (!title) return null;

  const racePhoto = await mediaPhoto(title, NON_PHOTO_RACE);
  if (racePhoto) return racePhoto;

  const circuitTitle = circuitUrlOrTitle ? wikiTitle(circuitUrlOrTitle) : null;
  if (circuitTitle) {
    const circuitPhoto = await mediaPhoto(circuitTitle, NON_PHOTO_CIRCUIT);
    if (circuitPhoto) return circuitPhoto;
  }

  return summaryThumb(title, width);
}

// Fallback: the page's summary thumbnail (often a track map, but better
// than nothing for articles without photos).
async function summaryThumb(title: string, width: number): Promise<string | null> {
  const data = (await fetchJson(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
  )) as {
    thumbnail?: { source?: string };
    originalimage?: { source?: string; width?: number };
  } | null;

  const thumb = data?.thumbnail?.source;
  if (!thumb) return null;

  const original = data?.originalimage;
  const isSvg = /\.svg$/i.test(original?.source ?? "");

  // Wikimedia only serves a fixed set of thumbnail width buckets; anything
  // else returns 400. Snap up to the nearest allowed bucket.
  const BUCKETS = [250, 330, 500, 960, 1280, 1920];
  const target = BUCKETS.find((b) => b >= width) ?? 1920;

  // Rasters can't be upscaled past the original — use the original file then.
  if (!isSvg && original?.source && (original.width ?? 0) <= target) {
    return original.source;
  }
  return thumb.replace(/\/\d+px-/, `/${target}px-`);
}

// Local poster images (public/image) cycled deterministically per race —
// every non-classic card gets one, no network lookup needed.
const SEASON_IMAGES = [
  "/image/f9.webp",
  "/image/f10.webp",
  "/image/f13.jpg",
  "/image/f14.jpg",
  "/image/f15.jpg",
];

export function localRaceImage(season: string, round: string): string {
  let h = 0;
  const key = `${season}#${round}`;
  for (let i = 0; i < key.length; i++) {
    h = (h * 33 + key.charCodeAt(i)) >>> 0;
  }
  return SEASON_IMAGES[h % SEASON_IMAGES.length];
}

// Deterministic pseudo "community score" (62-97%) until real user data exists.
export function communityScore(season: string, round: string): number {
  let h = 0;
  const key = `${season}-${round}`;
  for (let i = 0; i < key.length; i++) {
    h = (h * 31 + key.charCodeAt(i)) >>> 0;
  }
  return 62 + (h % 36);
}

export function scoreColor(score: number): string {
  if (score >= 85) return "text-emerald-400";
  if (score >= 72) return "text-amber-400";
  return "text-orange-500";
}

const FLAGS: Record<string, string> = {
  Bahrain: "🇧🇭", "Saudi Arabia": "🇸🇦", Australia: "🇦🇺", Japan: "🇯🇵",
  China: "🇨🇳", USA: "🇺🇸", "United States": "🇺🇸", Italy: "🇮🇹",
  Monaco: "🇲🇨", Canada: "🇨🇦", Spain: "🇪🇸", Austria: "🇦🇹",
  UK: "🇬🇧", "United Kingdom": "🇬🇧", Hungary: "🇭🇺", Belgium: "🇧🇪",
  Netherlands: "🇳🇱", Azerbaijan: "🇦🇿", Singapore: "🇸🇬", Mexico: "🇲🇽",
  Brazil: "🇧🇷", Qatar: "🇶🇦", UAE: "🇦🇪", Argentina: "🇦🇷",
  France: "🇫🇷", Germany: "🇩🇪", Portugal: "🇵🇹", Russia: "🇷🇺",
  Turkey: "🇹🇷", "South Africa": "🇿🇦", Korea: "🇰🇷", India: "🇮🇳",
  Malaysia: "🇲🇾", Sweden: "🇸🇪", Switzerland: "🇨🇭", Morocco: "🇲🇦",
  Vietnam: "🇻🇳",
};

export function countryFlag(country: string): string {
  return FLAGS[country] ?? "🏁";
}

// Poster gradients cycled deterministically per race — fallback when a race
// has no Wikipedia image (e.g. future rounds).
const GRADIENTS = [
  "from-rose-600 via-red-800 to-zinc-950",
  "from-indigo-600 via-violet-900 to-zinc-950",
  "from-cyan-600 via-sky-900 to-zinc-950",
  "from-emerald-600 via-teal-900 to-zinc-950",
  "from-amber-500 via-orange-800 to-zinc-950",
  "from-fuchsia-600 via-purple-900 to-zinc-950",
];

export function posterGradient(season: string, round: string): string {
  let h = 0;
  const key = `${round}:${season}`;
  for (let i = 0; i < key.length; i++) {
    h = (h * 33 + key.charCodeAt(i)) >>> 0;
  }
  return GRADIENTS[h % GRADIENTS.length];
}
