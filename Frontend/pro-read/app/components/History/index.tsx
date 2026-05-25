"use client";

import Image from "next/image";
import { BookOpen, Clock3, Flame, ChevronRight, Sparkles } from "lucide-react";

type HistoryItem = {
  id: number;
  date: string;
  title: string;
  author: string;
  description: string;
  progress: number;
  pages: number;
  duration: string;
  cover: string;
  genre: string;
};

const historyData: HistoryItem[] = [
  {
    id: 1,
    date: "October 2025 · Week 42",
    title: "The Architecture of Silence",
    author: "Julian Sterling",
    description:
      "Philosophical fiction exploring memory, solitude and forgotten cities.",
    progress: 74,
    pages: 412,
    duration: "18h 12m",
    cover:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC9zILgjxjlUxF8VFLQGElLWd3rDRyjdgSFwDJBYOQIy2FqwDIgPj0CS2J7zrL1OOfyAnfmFxdbsifbkd4NU2s4PYd-VBnxEKDClvHdkHmmQ1JCA0vcVUWlWwGWBu27k82aYbBMP1HG-4VMBNmYU89U9841sY7CXfB5sf4fEXdnkx0_BzxE9Q7Mi_NSsUh1EoCGhh5GUWmkhqVAsKi7cPhlGDLaePZZL4bHMJ-037afw4W7qA5RDWdTTnHnjxY7InRgmkjoRbMiD0C0",
    genre: "Midnight Session",
  },
  {
    id: 2,
    date: "October 2025 · Week 41",
    title: "Ethereal Mechanics",
    author: "Dr. Aislynn Roe",
    description:
      "A surreal science chronicle weaving cosmic physics with human emotion.",
    progress: 52,
    pages: 329,
    duration: "9h 38m",
    cover:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCRQFmc2EpnN-kMjEAWqJ8D5MFVgrPmMA6VcauE7KXTykO-zQg1JBiV8NAJ4k5H3Zdm88vQr_CZ5T7Y7vvZqCq4aaMBLDOQFU68j_oPPbWUourhaFSKqvbzviDfUJAzVR1u5SCg0haiPLBtXGhwxRUHlnVCLAzfmMekzUBA4FyNa2-XKw_uob9DfmBf35-DP8A-mlrRd7YVv8O2d9afNISMs7O73-LJ0U8d0k1BT0B4GXK5U-JDj8Wov_95KLbXjwTll7FcNFsdWYXF",
    genre: "Commute Reflection",
  },
  {
    id: 3,
    date: "October 2025 · Week 40",
    title: "The Midnight Archive",
    author: "Evangeline Holt",
    description:
      "An atmospheric mystery hidden beneath a forgotten underground library.",
    progress: 100,
    pages: 504,
    duration: "23h 21m",
    cover:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAgpanRUIJIU3F5w0sTqHcvQbSdxyX6RNnyeJltLZKKryCILK5fcMd0KTclX6Mv1RTKzDvEvq0DZSKY70jRbTnd5Vs3Dp7dGQ66A-pHR2REj8hghaiUaGLyU4z8DRbVK2IACphjWxeipQvojf7GNlG0cWNqgPOPURxeTkp6zp7iTsnbb4FBv1u5kFIkBA_gXHE2rfZ-jscrR8d1hTIkBW1mznHsJ36CLKiBKSJH9sU3rfQDoolT8J2CQM2DQSambnZc6njXv8tiIt_v",
    genre: "Deep Focus",
  },
];

function SectionHeading() {
  return (
    <div className="mb-14">
      <p className="text-[11px] uppercase tracking-[0.35em] text-indigo-300/70">
        The Curator
      </p>

      <h1
        style={{ fontFamily: '"Noto Sans", sans-serif' }}
        className="mt-5 text-5xl font-semibold leading-tight text-white"
      >
        Your Literary Journey
      </h1>

      <p
        style={{ fontFamily: "Manrope, sans-serif" }}
        className="mt-4 max-w-2xl text-sm leading-7 text-slate-400"
      >
        Tracing the threads of thought through the volumes you’ve explored. A
        chronological tapestry of your intellectual pursuits.
      </p>
    </div>
  );
}

function TimelineDot() {
  return (
    <div className="absolute left-[-42px] top-8 z-10 flex h-5 w-5 items-center justify-center rounded-full border border-indigo-400/40 bg-[#0B1020] shadow-[0_0_20px_rgba(99,102,241,0.45)]">
      <div className="h-2 w-2 rounded-full bg-indigo-300" />
    </div>
  );
}

function ReadingProgress({ value }: { value: number }) {
  return (
    <div className="mt-5">
      <div className="h-[3px] w-full overflow-hidden rounded-full bg-white/10">
        <div
          style={{ width: `${value}%` }}
          className="h-full rounded-full bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400"
        />
      </div>
    </div>
  );
}

function HistoryCard({ item }: { item: HistoryItem }) {
  return (
    <div className="relative pl-10">
      <TimelineDot />

      <div className="group relative overflow-hidden rounded-md bg-[#0b1019] px-7 py-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_20px_60px_rgba(0,0,0,0.55)] transition-all duration-300 hover:border-[#31456d]">
        {/* SUBTLE GLOW */}
        <div className="absolute -left-16 top-1/2 h-52 w-52 -translate-y-1/2 rounded-full bg-blue-500/5 blur-3xl" />

        <div className="relative flex items-center justify-between gap-8">
          {/* LEFT CONTENT */}
          <div className="flex-1">
            {/* META */}
            <div className="mb-5 flex items-center gap-4">
              <span
                style={{ fontFamily: "Manrope, sans-serif" }}
                className="text-[12px] font-medium uppercase tracking-[0.16em] text-[#C7C4D7]"
              >
                {item.date}
              </span>

              <div className="h-2.5 w-px bg-white/10" />

              <span
                style={{ fontFamily: "Manrope, sans-serif" }}
                className="text-[12px] font-extralight tracking-[0.16em] text-[#C7C4D7]"
              >
                {item.genre}
              </span>
            </div>

            {/* TITLE */}
            <h2
              style={{ fontFamily: '"Noto Serif", serif' }}
              className="text-[44px] font-semibold leading-none tracking-[-0.03em] text-[#f3f4f6]"
            >
              {item.title}
            </h2>

            {/* AUTHOR */}
            <p
              style={{ fontFamily: "Manrope, sans-serif" }}
              className="mt-3 text-[21px] text-[#9ea6b5]"
            >
              {item.author}
              <span className="mx-2 text-[#596273]">•</span>
              <span>Philosophy</span>
            </p>

            {/* STATS */}
            <div className="mt-10 flex items-center gap-14">
              <div>
                <p
                  style={{ fontFamily: "Manrope, sans-serif" }}
                  className="text-[9px] uppercase tracking-[0.18em] text-[#5d6779]"
                >
                  Progress
                </p>

                <p
                  style={{ fontFamily: "Manrope, sans-serif" }}
                  className="mt-2 text-[18px] font-medium text-[#C1C1FF]"
                >
                  Read {item.pages} pages
                </p>
              </div>

              <div>
                <p
                  style={{ fontFamily: "Manrope, sans-serif" }}
                  className="text-[9px] uppercase tracking-[0.18em] text-[#5d6779]"
                >
                  Checkpoint
                </p>

                <p
                  style={{ fontFamily: "Manrope, sans-serif" }}
                  className="mt-2 text-[18px] font-medium text-[#C1C1FF]"
                >
                  Finished Chapter 12
                </p>
              </div>

              <div>
                <p
                  style={{ fontFamily: "Manrope, sans-serif" }}
                  className="text-[9px] uppercase tracking-[0.18em] text-[#5d6779]"
                >
                  Time Spent
                </p>

                <p
                  style={{ fontFamily: "Manrope, sans-serif" }}
                  className="mt-2 text-[18px] font-medium text-[#C1C1FF]"
                >
                  {item.duration}
                </p>
              </div>
            </div>

            {/* PROGRESS */}
            <div className="mt-10 h-[2px] w-full overflow-hidden rounded-full bg-white/5">
              <div
                style={{ width: `${item.progress}%` }}
                className="h-full rounded-full bg-gradient-to-r from-[#d8deff] via-[#9bb1ff] to-[#6680ff]"
              />
            </div>
          </div>

          {/* RIGHT BOOK */}
          <div className="relative shrink-0">
            <div className="relative overflow-hidden rounded-md bg-black">
              <Image
                src={item.cover}
                alt={item.title}
                width={170}
                height={230}
                className="rounded-md h-[180px] w-[120px] w- object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function VelocityCard() {
  return (
    <div className="rounded-md bg-white/[0.03] p-6 backdrop-blur-xl w-[70%]">
      <p 
      style={{ fontFamily: "Manrope, sans-serif" }}
      className="text-[12px] font-thin tracking-[2px] text-[#C7C4D7]/60">
        Reading Velocity
      </p>

      <div className="mt-5 flex items-end gap-2">
        <span 
        style={{ fontFamily: "Manrope, sans-serif" }}
        className="text-5xl font-bold text-white">244</span>
        <span 
        style={{ fontFamily: "Manrope, sans-serif" }}
        className="mb-1 text-sm font-light text-[#C7C4D7]">Pages this week</span>
      </div>

      <div className="flex scale-y-[-1] items-end gap-2 mt-8">
        {[
          { h: "h-8", active: false },
          { h: "h-16", active: false },
          { h: "h-11", active: false },
          { h: "h-22", active: true },
          { h: "h-14", active: false },
          { h: "h-9", active: false },
          { h: "h-14", active: false },
        ].map((bar, index) => (
          <div
            key={index}
            className={`
        relative w-[12px] overflow-hidden rounded-full
        ${bar.h}
        ${
          bar.active
            ? "bg-[#C7C4D7] shadow-[0_0_18px_rgba(193,193,255,0.45)]"
            : "bg-[#323539]"
        }
      `}
          >
            {/* shine */}
            {!bar.active && (
              <div className="absolute inset-x-0 top-0 h-[35%] rounded-full bg-[#C7C4D7]/40" />
            )}
          </div>
        ))}
      </div>

    <div className="flex w-full">
      <p 
      style={{ fontFamily: "Manrope, sans-serif" }}
      className="mt-6 text-[12px] font-thin text-[#C7C4D7]/40 ml-auto">
        Activiy Peaked on Wednesday
      </p>
      </div>
    </div>
  );
}

function AchievementCard() {
  return (
    <div className="relative overflow-hidden rounded-md bg-linear-to-br from-indigo-500/15 to-purple-500/10 p-6 w-[30%]">
      <div className="absolute -right-7.5 -top-7.5 h-28 w-28 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="relative flex flex-col justify-center items-center">
        <div className="flex h-14 w-14 items-center justify-center text-center">
          <BookOpen className="size-6 text-indigo-200" />
        </div>

        <div>
        <h3 className="mt-6 text-xl font-semibold text-white text-center">
          Scholar Milestone
        </h3>
        </div>

        <div>
        <p className="mt-3 text-sm leading-7 text-slate-300 text-center">
          You’ve completed 12 volumes in your metaphysical fiction collection.
        </p>
        </div>

        <button className="mt-8 flex items-center gap-2 text-sm text-indigo-200 transition hover:text-white">
          VIEW BADGE
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}

export default function HistoryPage() {
  return (
    <main className="min-h-screen bg-[#070B14] text-white">
      {/* background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[10%] top-[15%] h-[320px] w-[320px] rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="absolute bottom-[10%] right-[15%] h-[280px] w-[280px] rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-16">
        <SectionHeading />

        {/* timeline */}
        <div className="relative ml-5 border-l border-white/10 pl-8">
          <div className="space-y-14">
            {historyData.map((item) => (
              <HistoryCard key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* bottom cards */}
        <div className="mt-20 ml-4 flex gap-6 md:flex-col-2">
          <VelocityCard />
          <AchievementCard />
        </div>
      </div>
    </main>
  );
}
