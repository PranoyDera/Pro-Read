"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Star,
  Eye,
  Heart,
  Sparkles,
  Clock,
  Bookmark
} from "lucide-react";
import { Button } from "@/app/Components/ui/Button";
import { cn } from "@/lib/utils";
import type { Story } from "./index";
import { IconSparkleHighlight, IconWand } from "@tabler/icons-react";

export interface StoryCardProps {
  story: Story;
  isBookmarked?: boolean;
  onToggleBookmark?: (storyId: string, e: React.MouseEvent) => void;
  onSelectPreview?: (story: Story) => void;
  className?: string;
}

export const StoryCard: React.FC<StoryCardProps> = ({
  story,
  isBookmarked = false,
  onToggleBookmark,
  onSelectPreview,
  className
}) => {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className={cn(
        "group rounded-[8px] border border-white/10 bg-[#0b1223] overflow-hidden shadow-lg hover:border-indigo-500/40 transition-all flex flex-col sm:flex-row",
        className
      )}
    >
      {/* Story Book Cover */}
      <div className="sm:w-48 h-56 sm:h-auto relative overflow-hidden shrink-0 bg-gradient-to-br from-indigo-950/80 via-slate-900 to-purple-950/70 flex items-center justify-center">
        {story.coverImage && story.coverImage.trim() !== "" ? (
          <img
            src={story.coverImage}
            alt={story.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              const target = e.currentTarget;
              target.style.display = "none";
            }}
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/80 via-transparent to-transparent pointer-events-none" />
        <span className="absolute top-3 left-3 bg-indigo-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md tracking-wider uppercase shadow-md z-10">
          {story.genre}
        </span>

        {story.isEditorChoice && (
          <span className="absolute bottom-3 left-3 bg-amber-500/90 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-md z-10">
            <IconWand className="w-3 h-3 fill-slate-950" /> Editor&apos;s Choice
          </span>
        )}
      </div>

      {/* Story Content & Metadata */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-[18px] font-bold text-white group-hover:text-indigo-300 transition-colors font-inter leading-snug">
                {story.title}
              </h3>
              <p className="text-xs text-indigo-300/80 font-medium mt-1">{story.subtitle}</p>
            </div>

            {onToggleBookmark && (
              <button
                onClick={(e) => onToggleBookmark(story.id, e)}
                className="text-slate-400 hover:text-amber-300 transition-colors p-1"
                title={isBookmarked ? "Remove from Library" : "Bookmark Story"}
              >
                <Bookmark
                  className={cn(
                    "w-4 h-4",
                    isBookmarked && "text-amber-300 fill-amber-300"
                  )}
                />
              </button>
            )}
          </div>

          <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
            {story.excerpt}
          </p>
        </div>

        {/* Story Stats Footer */}
        <div className="space-y-3 pt-3 border-t border-white/5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              {story.readingTime}
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              {story.rating}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              {story.likes}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              {(story.views / 1000).toFixed(1)}k
            </span>
          </div>

          {/* Action Buttons */}
          {onSelectPreview && (
            <div className="flex items-center gap-2">
              <Button
                onClick={() => onSelectPreview(story)}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs h-9 font-semibold rounded-[5px] shadow-sm flex items-center justify-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5" />
                Read Story
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default StoryCard;
