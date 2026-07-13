"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { bumpStreak } from "@/lib/gamification";

export interface RaceMeta {
  season: string;
  round: string;
  title: string;
  country: string;
  image: string;
}

export default function RateWidget({ raceId, meta }: { raceId: string; meta?: RaceMeta }) {
  const [rating, setRating] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [review, setReview] = useState("");
  const [savedReview, setSavedReview] = useState<string | null>(null);

  // Remember what this race looks like so the profile page can render it.
  function saveMeta() {
    if (meta) localStorage.setItem(`boxbox-meta-${raceId}`, JSON.stringify(meta));
  }

  useEffect(() => {
    const r = localStorage.getItem(`boxbox-rating-${raceId}`);
    if (r) setRating(Number(r));
    const rev = localStorage.getItem(`boxbox-review-${raceId}`);
    if (rev) setSavedReview(rev);
  }, [raceId]);

  function rate(value: number) {
    setRating(value);
    localStorage.setItem(`boxbox-rating-${raceId}`, String(value));
    saveMeta();
    bumpStreak();
  }

  function saveReview() {
    const text = review.trim();
    if (!text) return;
    localStorage.setItem(`boxbox-review-${raceId}`, text);
    setSavedReview(text);
    setReview("");
    saveMeta();
    bumpStreak();
  }

  const shown = hover ?? rating ?? 0;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Your Rating
      </h3>
      <div className="flex gap-1" onMouseLeave={() => setHover(null)}>
        {Array.from({ length: 10 }, (_, i) => i + 1).map((v) => (
          <button
            key={v}
            onClick={() => rate(v)}
            onMouseEnter={() => setHover(v)}
            aria-label={`Rate ${v} out of 10`}
            className={`h-8 min-w-0 flex-1 rounded-sm transition ${
              v <= shown ? "bg-primary" : "bg-muted hover:bg-primary/40"
            }`}
          />
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        {rating ? `You rated this race ${rating}/10` : "Was it a banger or a snoozer?"}
      </p>

      {savedReview && (
        <blockquote className="rounded-lg border p-3 text-sm italic">
          &ldquo;{savedReview}&rdquo;
          <span className="mt-1 block text-xs not-italic text-muted-foreground">— you</span>
        </blockquote>
      )}
      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder={savedReview ? "Update your review…" : "Write a review…"}
        rows={3}
        className="w-full resize-none rounded-lg border bg-background p-3 text-sm outline-none transition-colors focus:border-ring"
      />
      <Button size="sm" onClick={saveReview} disabled={!review.trim()}>
        Post review
      </Button>
    </div>
  );
}
