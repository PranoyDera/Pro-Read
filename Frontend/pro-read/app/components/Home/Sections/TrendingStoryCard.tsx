import Image from "next/image";
import { Clock3, Star } from "lucide-react";

import { cn } from "@/lib/utils";

type TrendingStoryCardProps = {
  title: string;
  author: string;
  duration: string;
  rating: string;
  coverImageSrc: string;
  coverImageAlt?: string;
  badge?: string;
  accent?: string;
  coverOverlayClassName?: string;
  className?: string;
};

export default function TrendingStoryCard({
  title,
  author,
  duration,
  rating,
  coverImageSrc,
  coverImageAlt,
  badge,
  accent,
  coverOverlayClassName,
  className,
}: TrendingStoryCardProps) {
  return (
    <article
      className={cn(
        "group space-y-3 rounded-[24px] p-2.5 transition duration-300 hover:-translate-y-1",
        className
      )}
    >
      <div className="relative aspect-[0.74] overflow-hidden rounded-[20px] border border-white/8 bg-[#121721] shadow-[0_18px_36px_rgba(0,0,0,0.24)]">
        <Image
          src={coverImageSrc}
          alt={coverImageAlt ?? title}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.04]"
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
        />

        <div
          className={cn(
            "absolute inset-0 bg-[linear-gradient(180deg,rgba(4,8,18,0.02)_24%,rgba(4,8,18,0.1)_52%,rgba(2,4,12,0.48)_100%)]",
            coverOverlayClassName
          )}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_34%)] opacity-80" />

        {badge ? (
          <span className="absolute top-3 right-3 rounded-full border border-white/10 bg-[#0a0d16]/90 px-2 py-0.5 text-[10px] font-bold tracking-[0.18em] text-white uppercase backdrop-blur-sm">
            {badge}
          </span>
        ) : null}
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-semibold text-white">{title}</h3>
        <p className="text-sm text-slate-400">by {author}</p>
      </div>

      <div className="flex items-center gap-4 text-xs text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          <Clock3 className="size-3.5" />
          {duration}
        </span>
        <span className={cn("inline-flex items-center gap-1.5", accent)}>
          <Star className="size-3.5 fill-current" />
          {rating}
        </span>
      </div>
    </article>
  );
}
