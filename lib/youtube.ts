// Server-side YouTube highlight lookup — scrapes the search results page
// (no API key needed) and picks the best matching highlights video.

export interface HighlightVideo {
  id: string;
  title: string;
  channel: string;
}

function decodeTitle(raw: string): string {
  try {
    return JSON.parse(`"${raw}"`);
  } catch {
    return raw;
  }
}

// How strongly the title names THIS race: full race name > country adjective
// > its stem ("Brazilian" → "Brazil"). 0 means it's a different Grand Prix.
function nameMatch(title: string, raceName: string): number {
  const t = title.toLowerCase();
  const full = raceName.toLowerCase();
  if (t.includes(full)) return 4;
  const token = full.replace(/\s*grand prix\s*/, " ").trim();
  if (token && t.includes(token)) return 3;
  const stem = token.replace(/(ian|ish|ese)$/, "");
  if (stem.length >= 4 && t.includes(stem)) return 2;
  return 0;
}

// A candidate must mention the season year AND this race's name (so we never
// embed a different Grand Prix), then official F1 uploads and titles with
// "highlights" win.
function score(v: HighlightVideo, season: string, raceName: string): number {
  if (!v.title.includes(season)) return -1;
  const nm = nameMatch(v.title, raceName);
  if (nm === 0) return -1;
  let s = nm;
  if (/highlight/i.test(v.title)) s += 2;
  if (v.channel === "FORMULA 1") s += 3;
  return s;
}

export function youtubeSearchUrl(query: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

export async function findRaceHighlight(
  season: string,
  raceName: string
): Promise<HighlightVideo | null> {
  const query = `F1 ${season} ${raceName} race highlights`;
  try {
    const res = await fetch(youtubeSearchUrl(query), {
      headers: { "accept-language": "en-US,en", "user-agent": "Mozilla/5.0" },
      next: { revalidate: 60 * 60 * 24 * 7 },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const html = await res.text();

    const candidates: HighlightVideo[] = [];
    let idx = 0;
    while (candidates.length < 10) {
      const at = html.indexOf('"videoRenderer":{"videoId":"', idx);
      if (at === -1) break;
      const chunk = html.slice(at, at + 3000);
      const id = chunk.match(/"videoId":"([\w-]{11})"/)?.[1];
      const title = chunk.match(/"title":\{"runs":\[\{"text":"((?:[^"\\]|\\.)*)"/)?.[1];
      const channel = chunk.match(/"ownerText":\{"runs":\[\{"text":"((?:[^"\\]|\\.)*)"/)?.[1];
      if (id && title) {
        candidates.push({ id, title: decodeTitle(title), channel: channel ? decodeTitle(channel) : "" });
      }
      idx = at + 30;
    }

    let best: HighlightVideo | null = null;
    let bestScore = 2; // require at least 3 — a solid name + year match
    for (const v of candidates) {
      const s = score(v, season, raceName);
      if (s > bestScore) {
        best = v;
        bestScore = s;
      }
    }
    return best;
  } catch {
    return null;
  }
}
