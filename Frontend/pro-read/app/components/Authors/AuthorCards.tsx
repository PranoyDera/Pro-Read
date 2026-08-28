"use client";

import React from "react";
import {
  IconStarFilled,
  IconUserCheck,
  IconUserPlus,
  IconBook,
  IconChevronRight,
  IconCircleCheck,
  IconBooks
} from "@tabler/icons-react";
import { Button } from "@/app/Components/ui/Button";
import { cn } from "@/lib/utils";
import type { Author } from "./index";

interface AuthorCardsProps {
  authors: Author[];
  followedAuthors: Record<string, boolean>;
  onSelectAuthor: (author: Author) => void;
  onToggleFollow: (authorId: string, e: React.MouseEvent) => void;
  searchQuery?: string;
  selectedGenreFilter?: string;
  onResetFilters?: () => void;
}

export const AuthorCards: React.FC<AuthorCardsProps> = ({
  authors,
  followedAuthors,
  onSelectAuthor,
  onToggleFollow,
  searchQuery = "",
  selectedGenreFilter = "All",
  onResetFilters
}) => {
  if (authors.length === 0) {
    return (
      <div className="text-center py-16 bg-[#0b1223]/50 rounded-xl border border-white/10">
        <IconBook className="w-12 h-12 text-slate-500 mx-auto mb-3 opacity-60" />
        <h4 className="text-lg font-medium text-white">No authors found</h4>
        <p className="text-slate-400 text-sm mt-1 max-w-sm mx-auto">
          No storytellers matched your search &quot;{searchQuery}&quot; or filter &quot;{selectedGenreFilter}&quot;.
        </p>
        {onResetFilters && (
          <Button
            onClick={onResetFilters}
            className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-4 py-2"
          >
            Reset Filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {authors.map((author) => {
        const isFollowed = followedAuthors[author.id] || false;

        return (
          <div key={author.id} className="w-full group/card">
            <div
              onClick={() => onSelectAuthor(author)}
              className={cn(
                "cursor-pointer overflow-hidden relative card h-[420px] rounded-[8px] shadow-xl w-full flex flex-col justify-between p-6 transition-all duration-300 border border-white/10 hover:border-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-500/10 bg-cover bg-center"
              )}
              style={{ backgroundImage: `url(${author.bannerImage})` }}
            >
              {/* Dark Overlay with smooth transition on hover */}
              <div className="absolute w-full h-full top-0 left-0 transition duration-300 bg-gradient-to-t from-slate-950 via-slate-950/80 to-black/40 group-hover/card:bg-black/85 group-hover/card:via-slate-950/90 opacity-90 group-hover/card:opacity-95"></div>

              {/* Top Row: Avatar, Info, Follow Button, Rating */}
              <div className="flex flex-row items-center justify-between z-10 w-full">
                <div className="flex flex-row items-center space-x-3">
                  <div className="relative">
                    <img
                      alt={author.name}
                      src={author.avatar}
                      className="h-12 w-12 rounded-full border-2 border-indigo-500/50 object-cover ring-2 ring-black/50 shadow-md"
                    />
                    {author.verified && (
                      <div className="absolute -bottom-0.5 -right-0.5 bg-[#0b1223] rounded-full">
                        <IconCircleCheck className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <p className="font-bold text-lg text-gray-50 relative z-10 group-hover/card:text-indigo-300 transition-colors tracking-tight font-sans">
                      {author.name}
                    </p>
                    <p className="text-xs text-indigo-300/80 font-medium tracking-wide font-sans">{author.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="bg-black/60 backdrop-blur-md border border-white/10 text-amber-300 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm tracking-wider">
                    <IconStarFilled className="w-3.5 h-3.5 text-amber-300" />
                    {author.stats.avgRating}
                  </span>
                </div>
              </div>

              {/* Middle Section: Bio & Genres */}
              <div className="text content relative z-10 my-auto pt-4">
                <p className="font-normal text-sm text-slate-300 relative z-10 line-clamp-3 leading-relaxed tracking-normal font-sans">
                  {author.bio}
                </p>

                {/* Genre Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {author.genres.map((genre) => (
                    <span
                      key={genre}
                      className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide bg-indigo-500/20 backdrop-blur-md border border-indigo-500/30 text-indigo-200"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Section: Stats & Action */}
              <div className="relative z-10 pt-3 border-t border-white/10">
                <div className="grid grid-cols-3 gap-2 text-center text-xs mb-3">
                  <div className="bg-white/5 backdrop-blur-sm p-2 rounded-lg border border-white/10">
                    <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Stories</p>
                    <p className="text-white font-extrabold mt-0.5 text-sm">{author.stats.totalStories}</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm p-2 rounded-lg border border-white/10">
                    <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Followers</p>
                    <p className="text-white font-extrabold mt-0.5 text-sm">{(author.stats.followersCount / 1000).toFixed(1)}k</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm p-2 rounded-lg border border-white/5">
                    <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Reads</p>
                    <p className="text-white font-extrabold mt-0.5 text-sm">{author.stats.totalReads}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Button
                    variant={isFollowed ? "outline" : "default"}
                    onClick={(e) => onToggleFollow(author.id, e)}
                    className={cn(
                      "h-8 px-3 text-xs font-semibold tracking-wide rounded-lg transition-all border",
                      isFollowed
                        ? "border-slate-700 bg-slate-800/80 text-slate-300 hover:border-red-500/50 hover:text-red-400"
                        : "bg-indigo-600 hover:bg-indigo-500 border-indigo-500 text-white shadow-sm"
                    )}
                  >
                    {isFollowed ? (
                      <>
                        <IconUserCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                        Following
                      </>
                    ) : (
                      <>
                        <IconUserPlus className="w-3.5 h-3.5 mr-1" />
                        Follow
                      </>
                    )}
                  </Button>

                  <span className="flex items-center gap-1 text-xs font-bold tracking-wide text-indigo-400 group-hover/card:text-indigo-300">
                    <IconBooks className="w-3.5 h-3.5" />
                    {author.stories.length} Stories
                    <IconChevronRight className="w-4 h-4 group-hover/card:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
