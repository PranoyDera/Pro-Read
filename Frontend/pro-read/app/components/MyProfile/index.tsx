"use client";
import React from 'react'

// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
import {
  Bell,
  Shield,
  BookOpen,
  Cloud,
  Trophy,
  MessageSquare,
} from "lucide-react";
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

export default function MyProfileComponent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#020617] to-black text-white p-6">
      
      {/* HEADER */}
     {/* HERO HEADER */}
<div className="relative mb-10 rounded-xl overflow-hidden">

  {/* BACKGROUND GRADIENT */}
  <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#0f172a] to-[#020617]" />

  {/* subtle glow accents */}
  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-[2px] bg-gradient-to-r from-blue-400 to-pink-400" />
  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-[2px] bg-gradient-to-r from-pink-400 to-blue-400" />

  {/* CONTENT */}
  <div className="relative flex items-center justify-between px-8 py-10">

    {/* LEFT */}
    <div className="flex items-center gap-6">
      
      {/* AVATAR WITH GLOW */}
      <div className="relative">
        <div className="absolute inset-0 rounded-full blur-xl bg-indigo-500/30"></div>
        <img
          src="/avatar.png"
          alt="Profile avatar"
          className="relative w-20 h-20 rounded-full border border-white/10"
        />
      </div>

      {/* TEXT */}
      <div>
        <h1 className="text-4xl font-semibold font-serif tracking-wide">
          Julian Barnes
        </h1>

        <p className="text-gray-400 text-sm mt-1">
          Bibliophile since 2018 • Premium Member
        </p>

        {/* TAGS */}
        <div className="flex gap-2 mt-3">
          <span className="px-3 py-1 text-xs rounded-full bg-white/10 text-gray-300">
            Philosophical Fiction
          </span>
          <span className="px-3 py-1 text-xs rounded-full bg-white/10 text-gray-300">
            Modern History
          </span>
        </div>
      </div>
    </div>

    {/* RIGHT BUTTON */}
    <Button className="bg-white/10 border border-white/20 hover:bg-white/20 text-white">
      ✏ Edit Profile
    </Button>
  </div>
</div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6">
            <p className="text-gray-400 text-sm">Books Read</p>
            <h3 className="text-3xl font-bold mt-2">84</h3>
            <p className="text-xs text-gray-500">This year</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6">
            <p className="text-gray-400 text-sm">Avg Rating</p>
            <h3 className="text-3xl font-bold mt-2">4.2</h3>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6">
            <p className="text-gray-400 text-sm">Pages Read</p>
            <h3 className="text-3xl font-bold mt-2">312</h3>
          </CardContent>
        </Card>
      </div>

      {/* ACHIEVEMENTS */}
      <div className="mb-10">
        <h3 className="text-lg font-semibold mb-4">
          Unlocked Achievements
        </h3>

        <div className="grid grid-cols-5 gap-4">
          {[
            { icon: BookOpen, label: "First Read" },
            { icon: MessageSquare, label: "Reviewer" },
            { icon: Trophy, label: "Top Reader" },
            { icon: Cloud, label: "Explorer" },
            { icon: Bell, label: "Consistent" },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center hover:bg-white/10 transition"
            >
              <item.icon className="w-6 h-6 mb-2 text-indigo-400" />
              <p className="text-xs text-gray-300 text-center">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* SETTINGS */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Customization Settings
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
      <div className="mt-16 text-center text-gray-500 italic text-sm">
        “A reader lives a thousand lives before he dies. The man who never reads lives only one.”
        <p className="mt-2 text-xs">– George R.R. Martin</p>
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
    <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition cursor-pointer">
      <div className="flex items-center gap-4">
        <Icon className="w-5 h-5 text-indigo-400" />
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-gray-400">{desc}</p>
        </div>
      </div>
      <span className="text-gray-400">{">"}</span>
    </div>
  );
}
