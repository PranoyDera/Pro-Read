import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { IconBook2 } from "@tabler/icons-react";

type CollectionCardProps = {
  title: string;
  imageSrc: string;
  imageAlt?: string;
  itemCount?: number;
  className?: string;
  titleClassName?: string;
};

export default function CollectionCard({
  title,
  imageSrc,
  imageAlt,
  itemCount = 12,
  className,
  titleClassName,
}: CollectionCardProps) {
  return (
    <div
      className={cn(
        "group relative isolate h-[320px] w-full overflow-hidden rounded-[8px] border border-white/10 bg-[#0b1329] shadow-xl transition-all duration-500 hover:-translate-y-1.5 hover:border-indigo-500/40 hover:shadow-[0_20px_50px_rgba(79,70,229,0.25)]",
        className
      )}
    >
      {/* Background Cover Image with Zoom Effect */}
      <Image
        src={imageSrc}
        alt={imageAlt ?? title}
        fill
        className="absolute inset-0 object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
      />

      {/* Multi-layered Gradient Overlays for Depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#060b18] via-[#060b18]/60 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-80" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-indigo-950/40 opacity-60" />

      {/* Top Glass Badge: Item Count */}
      <div className="absolute top-4 left-4 z-10">
        <div className="flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs font-medium text-indigo-200 backdrop-blur-md transition duration-300 group-hover:border-indigo-400/30 group-hover:bg-indigo-950/50">
          <IconBook2 className="size-3.5 text-indigo-400" />
          <span>{itemCount} Stories</span>
        </div>
      </div>

      {/* Card Body Content */}
      <div className="relative z-10 flex h-full flex-col justify-end p-6">
        <div className="space-y-2">
          {/* Subtitle Accent */}
          <span className="text-[11px] font-semibold tracking-widest text-indigo-400 uppercase">
            Curated Series
          </span>

          {/* Collection Title */}
          <h3
            className={cn(
              "text-2xl font-bold tracking-tight text-white drop-shadow-md sm:text-3xl transition duration-300 group-hover:text-indigo-100",
              titleClassName
            )}
          >
            {title}
          </h3>
        </div>

        {/* Explore Button CTA on Hover */}
        <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-indigo-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white">
          <span>Explore Collection</span>
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>

      {/* Subtle Inner Glow Border Effect on Hover */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl border border-indigo-400/0 transition-colors duration-500 group-hover:border-indigo-400/20" />
    </div>
  );
}
