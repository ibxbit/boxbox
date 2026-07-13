import { ExternalLink, Play } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { findRaceHighlight, youtubeSearchUrl } from "@/lib/youtube";

// Async server component — streamed in via <Suspense> so the YouTube lookup
// never blocks the rest of the race page.
export async function HighlightSection({
  season,
  raceName,
}: {
  season: string;
  raceName: string;
}) {
  const video = await findRaceHighlight(season, raceName);
  const searchUrl = youtubeSearchUrl(`F1 ${season} ${raceName} highlights`);

  if (!video) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-xl border bg-card p-6">
        <p className="text-sm text-muted-foreground">
          No official highlights found for this race — footage of older Grands Prix is
          often limited. Try a manual search, or dig into the numbers below.
        </p>
        <a
          href={searchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          <Play className="size-4" /> Search YouTube
          <ExternalLink className="size-3 opacity-60" />
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="overflow-hidden rounded-xl bg-black ring-1 ring-border/50">
        <iframe
          className="aspect-video w-full"
          src={`https://www.youtube-nocookie.com/embed/${video.id}`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        ▶ {video.title} — {video.channel || "YouTube"}
      </p>
    </div>
  );
}

export function HighlightSkeleton() {
  return (
    <div className="aspect-video w-full animate-pulse rounded-xl bg-muted ring-1 ring-border/50" />
  );
}
