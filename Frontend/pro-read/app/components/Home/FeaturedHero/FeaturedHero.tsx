"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Play, BookOpen } from "lucide-react";

import { Button } from "@/app/Components/ui/Button";
import { featuredStory as fallbackFeaturedStory } from "../home-data";
import { getFeaturedStory, StoryItem } from "@/app/Service/StoryService";

const stripHtml = (html?: string | null): string => {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
};

export default function FeaturedHero() {
  const router = useRouter();
  const [featured, setFeatured] = useState<StoryItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const loadFeatured = async () => {
      try {
        const story = await getFeaturedStory();
        if (isMounted) {
          setFeatured(story);
        }
      } catch (err) {
        console.error("Failed to load featured story:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadFeatured();

    return () => {
      isMounted = false;
    };
  }, []);

  const defaultBg =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuASD68jX8EfeviU3FU6S_qXqk6VQgiyi5s7VTq9UKp7vHHbOKOg-uL3TbPpHtCFNCx95nhzbySatU8J1ihpiKcWb0p1gykuGrmSPfM1MQlQLRBWuxxwote1NvX-yTy5mGjF8CmT0nsnRNbsEoxnCx1ivSdoGIPsbSmSN94XpLIIkcOBbgtC25TaP1msZ3I4petJOX80iCo-0k5zBnbI4smi1T8wSQPL3sG4upgijblhSEEvo7MFjg0yFcj1FGqqpY8kkQIgkucjAWXo";

  const coverUrl = featured?.cover_pic || defaultBg;
  const eyebrow = featured ? (featured.genre ? `${featured.genre.toUpperCase()} • FEATURED` : "FEATURED STORY") : fallbackFeaturedStory.eyebrow;

  // Split title if long enough, else fallback
  const titleParts: [string, string?] = (() => {
    if (featured?.title) {
      const words = featured.title.trim().split(" ");
      if (words.length > 2) {
        const mid = Math.ceil(words.length / 2);
        return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
      }
      if (words.length === 2) {
        return [words[0], words[1]];
      }
      return [featured.title, undefined];
    }
    return [fallbackFeaturedStory.title[0], fallbackFeaturedStory.title[1]];
  })();

  const rawDesc = featured ? stripHtml(featured.description) : fallbackFeaturedStory.description;
  const description =
    rawDesc.length > 260 ? `${rawDesc.slice(0, 260).trim()}...` : rawDesc;

  const handleStartReading = () => {
    if (featured?.id) {
      router.push(`/readStory/${featured.id}`);
    }
  };

  return (
    <section className="relative h-[calc(100vh-70px)] min-h-[440px] w-full overflow-hidden border border-white/6 bg-[#091122] shadow-[0_30px_80px_rgba(0,0,0,0.38)]">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat md:bg-[center_bottom] transition-all duration-700"
        style={{
          backgroundImage: `url('${coverUrl}')`,
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,8,18,0.96)_0%,rgba(6,11,22,0.88)_33%,rgba(8,13,24,0.48)_62%,rgba(8,13,24,0.2)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,10,21,0.2)_0%,rgba(7,10,20,0)_42%,rgba(4,8,18,0.18)_64%,rgba(3,6,14,0.82)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(180deg,transparent,rgba(3,6,14,0.95))]" />

      <div className="relative min-h-[422px] px-6 py-10 md:px-10 md:py-14 lg:px-12">
        <div className="relative z-10 max-w-[620px] space-y-6 pt-8 md:pt-12 animate-in fade-in duration-300">
          <span className="inline-flex rounded-full border border-indigo-400/28 bg-indigo-500/10 px-3 py-1 text-[10px] font-semibold tracking-[0.2em] text-indigo-200 uppercase">
            {eyebrow}
          </span>

          <h1 className="[font-family:Georgia,Times,_serif] text-[48px] leading-[0.96] font-semibold tracking-tight text-white md:text-[68px]">
            <span className="drop-shadow-[0_3px_12px_rgba(0,0,0,0.25)]">
              {titleParts[0]}
            </span>
            {titleParts[1] && (
              <>
                <br />
                <span className="text-indigo-400 italic drop-shadow-[0_3px_12px_rgba(0,0,0,0.25)]">
                  {titleParts[1]}
                </span>
              </>
            )}
          </h1>

          <p className="max-w-[540px] text-base leading-7 text-slate-200/88 md:text-[16px]">
            {description}
          </p>

          <div className="flex flex-wrap gap-4 pt-1">
            <Button
              onClick={handleStartReading}
              className="cursor-pointer h-14 rounded-md bg-indigo-500 px-8 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(99,102,241,0.32)] hover:bg-indigo-400 transition-all flex items-center gap-2"
            >
              <Play className="size-4 fill-current" />
              <span>Start Reading</span>
            </Button>
            <Button
              variant="outline"
              onClick={handleStartReading}
              className="cursor-pointer h-14 rounded-md border-white/14 bg-white/10 px-7 text-sm font-semibold text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:bg-white/14 transition-all"
            >
              <BookOpen className="size-4" />
              <span>Story Overview</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
