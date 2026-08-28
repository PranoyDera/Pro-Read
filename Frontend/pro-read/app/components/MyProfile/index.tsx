"use client";
import React from "react";

// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
import {
  Bell,
  Shield,
  BookOpen,
  Cloud,
  Trophy,
  MessageSquare,
  Clock,
  PenSquare,
  BookMarked,
} from "lucide-react";
import { Button } from "../ui/Button";
import { Card, CardContent } from "../ui/Card";
import { Zap } from "lucide-react";

export default function MyProfileComponent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#020617] to-black text-white p-6">
      {/* HEADER */}
      {/* HERO HEADER */}
      <div className="relative mb-10 overflow-hidden w-full">
        {/* CONTENT */}
        <div className="relative flex items-center justify-between px-8 py-7">
          {/* LEFT SIDE */}
          <div className="flex items-center gap-6 w-full">
            {/* AVATAR */}
            <div className="relative">
              {/* border glow */}
              <div className="absolute -inset-0.5 rounded-full bg-linear-to-b from-[#111417] to-[#D1BCFF] blur-xs" />

              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLaPN92MmTucR1lgG98fe3mUpwJ7YWZ4gE6oooQDsU4nL_yaNdz0PdQZ7vnS0BbRNOAiv1dMAjfBMHvZdRotK0NCx8gKH08QHacf80PXIqPkW0ZBNblAkNBypYR3Bsz7RUoKeHdu5eVYw6y2v2XQewRSR5wFpe5FuJevQ5I4Wem8aCNRoQaEcXiK1_bdIcmP91-f_AmcE_vRu3YYXx7Oxv23rb9WrKY2Iy0v6PCQA1vlpotKbHgiJrheNgD7OvO_Yr7KdcXxIrd7tQ"
                alt="Profile avatar"
                className="relative h-36 w-40 rounded-full border border-white/10 object-cover bg-black"
              />
            </div>

            {/* USER INFO */}
            <div className="flex flex-col justify-start items-start w-full">
              <h1
                style={{ fontFamily: '"Noto Serif", sans-serif' }}
                className="text-[48px] leading-none font-semibold tracking-[-1.5px] text-[#E1E2E7]"
              >
                Julian Barnes
              </h1>

              <p
                style={{ fontFamily: "Manrope, sans-serif" }}
                className="mt-2 text-[15px] text-[#C7C4D7]"
              >
                Bibliophile since 2018 • Premium Member
              </p>

              <div className="mt-4 flex items-center justify-between gap-6 w-full">
                {/* TAGS */}
                <div className="flex items-center gap-3">
                  <span
                    style={{ fontFamily: "Manrope, sans-serif" }}
                    className="rounded-full bg-white/10 px-4 py-1.5 text-xs text-slate-300 backdrop-blur-sm"
                  >
                    Philosophical Fiction
                  </span>

                  <span
                    style={{ fontFamily: "Manrope, sans-serif" }}
                    className="rounded-full bg-white/10 px-4 py-1.5 text-xs font-light text-slate-300 backdrop-blur-sm"
                  >
                    Modern History
                  </span>
                </div>

                {/* EDIT BUTTON */}
                <Button className="h-9 rounded-sm bg-white/10 px-5 text-sm font-medium text-slate-200 shadow-inner hover:bg-white/15">
                  ✎ Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* STATS */}
      <div className="flex gap-4 mb-10 w-full mr-4">
        {/* MAIN CARD */}
        <Card className="relative flex flex-col w-full bg-linear-to-br from-[#121826] to-[#0d111c] rounded-md overflow-hidden h-[75%]">
          {/* LEFT GLOW LINE */}
          <div className="absolute left-0 top-0 h-full w-1 bg-[#c4b5fd]" />
          <CardContent className="relative p-7 h-full flex flex-col justify-between">
            <div>
              <p
                style={{ fontFamily: "Manrope, sans-serif" }}
                className="text-[12px] tracking-[0.10em] uppercase text-[#C7C4D7]"
              >
                Reading Velocity
              </p>

              <h2
                style={{ fontFamily: '"Noto Sans", sans-serif' }}
                className="text-6xl font-semibold text-[#d9d2ff] leading-none mt-3"
              >
                84
              </h2>

              <p
                style={{ fontFamily: "Manrope, sans-serif" }}
                className="text-[#E1E2E7] text-lg mt-2"
              >
                Books Read this year
              </p>
            </div>

            {/* PROGRESS */}
            <div className="mt-8">
              <div className="h-[2px] w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-[78%] bg-[#c4b5fd]" />
              </div>

              <p
                style={{ fontFamily: "Manrope, sans-serif" }}
                className="text-[11px] text-[#7f8497] mt-3"
              >
                16 books to reach your annual goal of 100
              </p>
            </div>
          </CardContent>
        </Card>

        {/* RIGHT SIDE */}
        <div className="flex gap-4">
          {/* STREAK */}
          <Card className="bg-linear-to-br from-[#121826] to-[#0d111c] rounded-md w-62.5 h-[70%]">
            <CardContent className="p-6">
              <div className="text-[#c4b5fd] text-lg mb-4">
                <Zap />
              </div>

              <h3
                style={{ fontFamily: '"Noto Sans", sans-serif' }}
                className="text-4xl font-semibold text-[#C7C4D7]"
              >
                42
              </h3>

              <p
                style={{ fontFamily: "Manrope, sans-serif" }}
                className="text-[11px] tracking-[0.18em] uppercase text-[#8c90a3] mt-1"
              >
                Day Streak
              </p>
            </CardContent>
          </Card>

          {/* HOURS */}
          <Card className="bg-linear-to-br from-[#121826] to-[#0d111c] rounded-md w-62.5 h-[70%]">
            <CardContent className="p-6">
              <div className="text-[#C7C4D7] text-lg mb-4">
                <Clock />
              </div>

              <h3
                style={{ fontFamily: '"Noto Sans", sans-serif' }}
                className="text-4xl font-semibold text-[#C7C4D7]"
              >
                312
              </h3>

              <p
                style={{ fontFamily: "Manrope, sans-serif" }}
                className="text-[11px] tracking-[0.18em] uppercase text-[#8c90a3] mt-1"
              >
                Hours Immersed
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ACHIEVEMENTS */}
      <div className="mb-10">
        <div className="flex justify-between items-center w-full">
        <h3 
        style={{ fontFamily: '"Noto Sans", sans-serif' }}
        className="text-2xl font-semibold text-[#E1E2E7] mb-5">
          Unlocked Achievements
        </h3>
        <p 
        style={{ fontFamily: "Manrope, sans-serif" }}
        className="text-[#C1C1FF] text-sm font-extralight">
          View more badges
        </p>
        </div>

        <div className="grid grid-cols-5 gap-5">
          {[
            {
              icon: BookOpen,
              title: "The Polymath",
              subtitle: "5 Genres Mastered",
              active: true,
            },
            {
              icon: PenSquare,
              title: "Ink Addict",
              subtitle: "30 Day Streak",
              active: true,
            },
            {
              icon: Trophy,
              title: "Top 1% Reader",
              subtitle: "Community Elite",
              active: true,
            },
            {
              icon: BookMarked,
              title: "The Finisher",
              subtitle: "100 Books Read",
              active: false,
            },
            {
              icon: MessageSquare,
              title: "Curator",
              subtitle: "10 Reviews Posted",
              active: false,
            },
          ].map((item, i) => (
            <div
              key={i}
              className="
          relative overflow-hidden
          rounded-2xl
          border border-white/10
          bg-gradient-to-b from-white/[0.08] to-white/[0.03]
          backdrop-blur-xl
          p-6
          min-h-[165px]
          transition-all duration-300
          hover:border-white/20
          hover:-translate-y-1
        "
            >
              {/* subtle glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.14),transparent_55%)] pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center text-center">
                <div
                  className={`
              mb-5 flex h-16 w-16 items-center justify-center
              rounded-full border
              ${
                item.active
                  ? "border-indigo-400/40 bg-indigo-500/15 text-indigo-300 shadow-[0_0_30px_rgba(99,102,241,0.18)]"
                  : "border-white/10 bg-white/[0.04] text-gray-400"
              }
            `}
                >
                  <item.icon className="h-7 w-7" />
                </div>

                <h4 className="text-[15px] font-semibold text-white">
                  {item.title}
                </h4>

                <p className="mt-1 text-xs text-gray-400">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* SETTINGS */}
      <div>
        <h3  
        style={{ fontFamily: '"Noto Sans", sans-serif' }}
        className="text-2xl font-semibold text-[#E1E2E7] mb-5"
        >
          Curatorial Settings
        </h3>

        <div className="space-y-3">
          <SettingItem
            icon={Bell}
            title="Notifications"
            desc="Manage alerts & preferences"
          />
          <SettingItem
            icon={Shield}
            title="Privacy & Security"
            desc="Account settings & password"
          />
          <SettingItem
            icon={BookOpen}
            title="Reading Interface"
            desc="Customize your experience"
          />
          <SettingItem
            icon={Cloud}
            title="Sync & Storage"
            desc="Manage backups"
          />
        </div>
      </div>

      {/* FOOTER QUOTE */}
      <div className="mt-16 text-center text-[#C7C4D7] text-2xl italic">
        “A reader lives a thousand lives before he dies. The man who never reads
        lives only one.”
        <p className="mt-2 text-xs not-italic">– George R.R. Martin</p>
      </div>
    </div>
  );
}

type SettingItemProps = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
};

function SettingItem({ icon: Icon, title, desc }: SettingItemProps) {
  return (
    <div className="flex items-center justify-between bg-white/5 rounded-md p-6 hover:bg-white/10 transition cursor-pointer">
      <div className="flex items-center gap-4">
        <Icon className="w-5 h-5 text-indigo-400" />
        <div>
          <p 
          style={{ fontFamily: "Manrope, sans-serif" }}
          className="text-base font-bold text-[#E1E2E7]">
            {title}
          </p>
          <p 
          style={{ fontFamily: "Manrope, sans-serif" }}
          className="text-xs text-[#C7C4D7]">{desc}</p>
        </div>
      </div>
      <span className="text-gray-400">{">"}</span>
    </div>
  );
}
