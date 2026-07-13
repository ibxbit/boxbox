import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { communityScore, countryFlag, posterGradient } from "@/lib/f1";
import { cn } from "@/lib/utils";

interface Props {
  season: string;
  round: string;
  title: string;
  country: string;
  score?: number;
  image?: string | null;
  className?: string;
}

export default function RaceCard({
  season,
  round,
  title,
  country,
  score,
  image,
  className,
}: Props) {
  const pct = score ?? communityScore(season, round);
  const metadata = `${season} • R${round}`;

  return (
    <Link
      href={`/race/${season}/${round}`}
      className={cn(
        "group relative block overflow-hidden rounded-xl bg-muted ring-1 ring-border/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-border",
        className,
      )}
      prefetch={false}
    >
      <AspectRatio ratio={3 / 4}>
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
          />
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center bg-linear-to-br ${posterGradient(season, round)}`}
          >
            <span className="text-5xl drop-shadow">{countryFlag(country)}</span>
          </div>
        )}
      </AspectRatio>

      <div className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-background/60 px-1.5 py-0.5 text-xs font-medium text-foreground backdrop-blur-md transition-opacity group-hover:opacity-100">
        <Star className="size-3 fill-primary text-primary" />
        <span className="tracking-tight">{pct}%</span>
      </div>

      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/90 via-black/40 to-transparent p-4 pt-16">
        <h3 className="line-clamp-1 text-sm font-bold text-white transition-colors">{title}</h3>
        <p className="line-clamp-1 mt-0.5 text-xs font-medium text-white/80">{metadata}</p>
      </div>
    </Link>
  );
}
