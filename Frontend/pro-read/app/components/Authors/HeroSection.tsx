"use client";

import React from "react";
import {
  IconSparkles,
  IconFeather,
  IconBook,
  IconStarFilled,
  IconFlame,
  IconAward,
  IconCircleCheck,
  IconChevronRight
} from "@tabler/icons-react";
import type { Author } from "./index";

interface HeroSectionProps {
  totalAuthors: number;
  featuredAuthor: Author;
  onSelectAuthor: (author: Author) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  totalAuthors,
  featuredAuthor,
  onSelectAuthor
}) => {
  return (
    <div className="relative rounded-[8px] overflow-hidden p-6 sm:p-10 border border-white/10 bg-gradient-to-r from-[#0d1527]/90 via-[#101b33]/80 to-[#0b1223]/90 shadow-2xl">
      {/* Background Decorative Glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold tracking-wide uppercase">
            <IconSparkles className="w-3.5 h-3.5 text-indigo-400" />
            Pro-Read Creator Network
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-sans text-white tracking-tight leading-tight">
            Master Storytellers & Authors
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Explore visionary authors, dive into their written sagas, and uncover exclusive stories, lore, and worldbuilding.
          </p>

          {/* Stat Highlights */}
          <div className="flex flex-wrap gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
              <IconFeather className="w-4 h-4 text-indigo-400" />
              <span>
                <strong>{totalAuthors}+</strong> Authors
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
              <IconBook className="w-4 h-4 text-cyan-400" />
              <span>
                <strong>16+</strong> Published Stories
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
              <IconStarFilled className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>
                <strong>4.9</strong> Avg Rating
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
              <IconFlame className="w-4 h-4 text-orange-400" />
              <span>
                <strong>2.4M+</strong> Total Reads
              </span>
            </div>
          </div>
        </div>

        {/* Featured Author Card Banner */}
        <div
          onClick={() => onSelectAuthor(featuredAuthor)}
          className="w-full lg:w-80 cursor-pointer group relative rounded-xl overflow-hidden border border-white/15 bg-slate-900/80 p-4 shadow-xl hover:border-indigo-400/50 transition-all duration-300 hover:shadow-indigo-500/10"
        >
          <div className="absolute top-2 right-2 z-10 bg-indigo-600/90 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1 shadow-md">
            <IconAward className="w-3 h-3" /> Spotlight
          </div>
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              {featuredAuthor.avatar && featuredAuthor.avatar.trim() !== "" ? (
                <img
                  src={featuredAuthor.avatar}
                  alt={featuredAuthor.name}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-indigo-400/60 shadow-md bg-[#121826]"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = "none";
                    const fallback = target.nextElementSibling as HTMLElement | null;
                    if (fallback) fallback.style.display = "flex";
                  }}
                />
              ) : null}
              <div
                style={{ display: featuredAuthor.avatar && featuredAuthor.avatar.trim() !== "" ? "none" : "flex" }}
                className="w-14 h-14 rounded-full items-center justify-center ring-2 ring-indigo-400/60 shadow-md bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-900 text-xl font-bold uppercase text-white select-none border border-white/15"
              >
                {featuredAuthor.name?.trim() ? featuredAuthor.name.trim().charAt(0) : "A"}
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <h4 className="text-white font-semibold text-base truncate group-hover:text-indigo-300 transition-colors">
                  {featuredAuthor.name}
                </h4>
                {featuredAuthor.verified && (
                  <IconCircleCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                )}
              </div>
              <p className="text-xs text-indigo-200/80">{featuredAuthor.role}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {featuredAuthor.stats.totalStories} Stories • {featuredAuthor.stats.totalReads} Reads
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-300 italic mt-3 line-clamp-2 bg-white/5 p-2 rounded-lg border border-white/5">
            &quot;{featuredAuthor.bio}&quot;
          </p>
          <div className="mt-3 flex items-center justify-between text-xs text-indigo-400 font-semibold group-hover:translate-x-1 transition-transform">
            <span>View Stories by {featuredAuthor.name.split(" ")[0]}</span>
            <IconChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
