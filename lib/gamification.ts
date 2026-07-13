// Client-side gamification: daily streak, XP levels and achievements.
// Everything derives from localStorage so it works without a backend.

export interface Streak {
  count: number;
  best: number;
  last: string; // YYYY-MM-DD (local)
}

const STREAK_KEY = "boxbox-streak";
const VISITS_KEY = "boxbox-visits";
export const STREAK_EVENT = "boxbox-streak-changed";

function dayString(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function readStreak(): Streak {
  try {
    const raw = JSON.parse(localStorage.getItem(STREAK_KEY) ?? "null");
    if (raw && typeof raw.count === "number" && typeof raw.last === "string") {
      const today = dayString(new Date());
      const yesterday = dayString(new Date(Date.now() - 86400000));
      // A streak is only "alive" if the last active day was today or yesterday.
      const count = raw.last === today || raw.last === yesterday ? raw.count : 0;
      return { count, best: raw.best ?? raw.count, last: raw.last };
    }
  } catch {
    // fall through
  }
  return { count: 0, best: 0, last: "" };
}

// Call on any meaningful action (visiting or rating a race). At most one
// bump per calendar day; missing a day resets the streak to 1.
export function bumpStreak(): void {
  try {
    const today = dayString(new Date());
    const prev = readStreak();
    if (prev.last === today) return;
    const yesterday = dayString(new Date(Date.now() - 86400000));
    const count = prev.last === yesterday ? prev.count + 1 : 1;
    const next: Streak = { count, best: Math.max(prev.best, count), last: today };
    localStorage.setItem(STREAK_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(STREAK_EVENT));
  } catch {
    // storage unavailable
  }
}

export function countVisit(): void {
  try {
    const n = Number(localStorage.getItem(VISITS_KEY) ?? "0");
    localStorage.setItem(VISITS_KEY, String((Number.isFinite(n) ? n : 0) + 1));
  } catch {
    // storage unavailable
  }
}

export interface Stats {
  visits: number;
  ratings: number[]; // every rating value given
  reviewCount: number;
  watchlist: number;
  cars: number; // cars built in the Garage
  seasons: string[]; // distinct seasons with a rating
  earliestSeason: number | null;
  streak: number;
  bestStreak: number;
}

export function readStats(): Stats {
  const ratings: number[] = [];
  const seasons = new Set<string>();
  let reviewCount = 0;
  let earliestSeason: number | null = null;

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;
    const m = key.match(/^boxbox-(rating|review)-(\d{4})-(\d{1,2})$/);
    if (!m) continue;
    const [, kind, season] = m;
    if (kind === "review") {
      reviewCount++;
      continue;
    }
    const value = Number(localStorage.getItem(key));
    if (!Number.isFinite(value)) continue;
    ratings.push(value);
    seasons.add(season);
    const y = Number(season);
    if (earliestSeason === null || y < earliestSeason) earliestSeason = y;
  }

  let watchlist = 0;
  try {
    const list = JSON.parse(localStorage.getItem("boxbox-watchlist") ?? "[]");
    if (Array.isArray(list)) watchlist = list.length;
  } catch {
    // ignore
  }

  let cars = 0;
  try {
    const list = JSON.parse(localStorage.getItem("boxbox-garage") ?? "[]");
    if (Array.isArray(list)) cars = list.length;
  } catch {
    // ignore
  }

  const visits = Number(localStorage.getItem(VISITS_KEY) ?? "0");
  const streak = readStreak();

  return {
    visits: Number.isFinite(visits) ? visits : 0,
    ratings,
    reviewCount,
    watchlist,
    cars,
    seasons: [...seasons],
    earliestSeason,
    streak: streak.count,
    bestStreak: streak.best,
  };
}

// ----- XP & levels ---------------------------------------------------------

export function xpOf(s: Stats): number {
  return (
    s.ratings.length * 25 +
    s.reviewCount * 40 +
    s.watchlist * 5 +
    s.cars * 30 +
    s.visits * 2 +
    s.bestStreak * 15
  );
}

export const LEVELS = [
  { name: "Rookie", xp: 0 },
  { name: "Backmarker", xp: 50 },
  { name: "Midfield Runner", xp: 150 },
  { name: "Points Scorer", xp: 300 },
  { name: "Podium Finisher", xp: 600 },
  { name: "Race Winner", xp: 1000 },
  { name: "Pole Sitter", xp: 1500 },
  { name: "World Champion", xp: 2200 },
  { name: "Paddock Legend", xp: 3000 },
] as const;

export interface Level {
  index: number;
  name: string;
  xp: number;
  nextName: string | null;
  nextXp: number | null;
  progress: number; // 0..1 towards next level
}

export function levelOf(xp: number): Level {
  let index = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].xp) index = i;
  }
  const next = LEVELS[index + 1] ?? null;
  const floor = LEVELS[index].xp;
  return {
    index,
    name: LEVELS[index].name,
    xp,
    nextName: next?.name ?? null,
    nextXp: next?.xp ?? null,
    progress: next ? Math.min(1, (xp - floor) / (next.xp - floor)) : 1,
  };
}

// ----- Achievements --------------------------------------------------------

export interface Achievement {
  id: string;
  name: string;
  desc: string;
  emoji: string;
  earned: (s: Stats) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: "lights-out", name: "Lights Out", desc: "Open your first race page", emoji: "🚦", earned: (s) => s.visits >= 1 },
  { id: "first-lap", name: "First Lap", desc: "Rate your first race", emoji: "⭐", earned: (s) => s.ratings.length >= 1 },
  { id: "hat-trick", name: "Hat Trick", desc: "Rate 3 races", emoji: "🎩", earned: (s) => s.ratings.length >= 3 },
  { id: "full-grid", name: "Full Grid", desc: "Rate 20 races", emoji: "🏁", earned: (s) => s.ratings.length >= 20 },
  { id: "pundit", name: "Pundit", desc: "Write your first review", emoji: "🎙️", earned: (s) => s.reviewCount >= 1 },
  { id: "columnist", name: "Columnist", desc: "Write 5 reviews", emoji: "📰", earned: (s) => s.reviewCount >= 5 },
  { id: "historian", name: "Historian", desc: "Rate a race from before 1980", emoji: "📜", earned: (s) => s.earliestSeason !== null && s.earliestSeason < 1980 },
  { id: "globetrotter", name: "Globetrotter", desc: "Rate races from 5 different seasons", emoji: "🌍", earned: (s) => s.seasons.length >= 5 },
  { id: "perfect-ten", name: "Perfect Ten", desc: "Give a race 10/10", emoji: "💯", earned: (s) => s.ratings.includes(10) },
  { id: "harsh-steward", name: "Harsh Steward", desc: "Give a race 2/10 or lower", emoji: "🧑‍⚖️", earned: (s) => s.ratings.some((r) => r <= 2) },
  { id: "collector", name: "Collector", desc: "Keep 5 races on your watchlist", emoji: "🔖", earned: (s) => s.watchlist >= 5 },
  { id: "constructor", name: "Constructor", desc: "Build your first car in the Garage", emoji: "🔧", earned: (s) => s.cars >= 1 },
  { id: "race-team", name: "Race Team", desc: "Build 3 cars in the Garage", emoji: "🏎️", earned: (s) => s.cars >= 3 },
  { id: "on-a-roll", name: "On a Roll", desc: "Reach a 3-day streak", emoji: "🔥", earned: (s) => s.bestStreak >= 3 },
  { id: "race-week", name: "Race Week", desc: "Reach a 7-day streak", emoji: "🗓️", earned: (s) => s.bestStreak >= 7 },
  { id: "season-veteran", name: "Season Veteran", desc: "Reach a 30-day streak", emoji: "🏆", earned: (s) => s.bestStreak >= 30 },
];
