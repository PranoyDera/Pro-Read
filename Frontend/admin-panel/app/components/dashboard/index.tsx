"use client";

import React from "react";
import Link from "next/link";
import {
  BookOpen,
  Users,
  Eye,
  TrendingUp,
  AlertCircle,
  ArrowUpRight,
  Sparkles,
  ChevronRight,
  Clock,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/app/components/ui/card";

export default function DashboardComponent() {
  const stats = [
    {
      title: "Total Stories",
      value: "1,248",
      change: "+12.5%",
      isPositive: true,
      icon: BookOpen,
      desc: "vs last month",
      accent: "from-blue-600 to-indigo-700",
      iconBg: "bg-blue-50 text-blue-700 border-blue-200",
      changeColor: "text-blue-700",
    },
    {
      title: "Active Readers",
      value: "42.8k",
      change: "+18.2%",
      isPositive: true,
      icon: Users,
      desc: "monthly active",
      accent: "from-emerald-600 to-teal-700",
      iconBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      changeColor: "text-emerald-700",
    },
    {
      title: "Total Reads",
      value: "389.2k",
      change: "+24.0%",
      isPositive: true,
      icon: Eye,
      desc: "across all genres",
      accent: "from-amber-600 to-orange-700",
      iconBg: "bg-amber-50 text-amber-700 border-amber-200",
      changeColor: "text-amber-700",
    },
    {
      title: "Pending Reports",
      value: "7",
      change: "-3 resolved",
      isPositive: true,
      icon: AlertCircle,
      desc: "requires review",
      accent: "from-rose-600 to-red-700",
      iconBg: "bg-rose-50 text-rose-700 border-rose-200",
      changeColor: "text-rose-700",
    },
  ];

  const recentStories = [
    {
      id: 101,
      title: "The Whispering Shadows of Elysium",
      author: "Aria Sterling",
      genre: "High Fantasy",
      reads: "1,890",
      status: "Published",
      date: "Just now",
    },
    {
      id: 102,
      title: "Neon Horizon: Syndicate Protocols",
      author: "Marcus Vance",
      genre: "Cyberpunk",
      reads: "1,240",
      status: "Published",
      date: "2 hours ago",
    },
    {
      id: 103,
      title: "Echoes of the Ancient Library",
      author: "Julian Barnes",
      genre: "Dark Academia",
      reads: "3,410",
      status: "Published",
      date: "5 hours ago",
    },
    {
      id: 104,
      title: "Quantum Drift: Beyond the Event Horizon",
      author: "Elena Rostova",
      genre: "Sci-Fi",
      reads: "0",
      status: "Draft",
      date: "Yesterday",
    },
  ];

  return (
    <div className="w-full min-h-[calc(100vh-3.5rem)] bg-neutral-100/70 p-6 md:p-10 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-8 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
              Dashboard Overview
            </h1>
            <span className="flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full border border-neutral-300 bg-white text-neutral-800 font-mono shadow-2xs">
              <Sparkles className="w-3 h-3 text-neutral-900" /> Pro-Read Admin
            </span>
          </div>
          <p className="text-sm text-neutral-600 mt-1">
            Real-time platform insights, reading performance, and quick moderation actions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/story-management">
            <Button
              variant="default"
              size="sm"
              className="gap-2 bg-neutral-950 text-white hover:bg-neutral-800 shadow-sm cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              Manage Stories
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Grid: Sleek, Compact & Beautiful Light KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-6">
        {stats.map((stat, idx) => {
          const IconComponent = stat.icon;
          return (
            <Card
              key={idx}
              className="relative overflow-hidden py-0 gap-0 rounded-[5px] bg-white/95 border border-neutral-200/90 shadow-2xs hover:shadow-md hover:border-neutral-300/90 hover:-translate-y-0.5 transition-all duration-200 flex flex-row"
            >
              {/* Left Accent Gradient Bar */}
              <div className={`w-1 shrink-0 bg-gradient-to-b ${stat.accent}`} />

              <div className="p-4 flex-1 flex flex-col justify-between">
                {/* Header line: Title & Icon badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 truncate">
                    {stat.title}
                  </span>
                  <div className={`p-1.5 rounded-md border shrink-0 ${stat.iconBg}`}>
                    <IconComponent className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Metric value and trend pill */}
                <div className="flex items-baseline justify-between gap-2 mt-2">
                  <span className="text-2xl font-bold tracking-tight text-neutral-900 font-mono">
                    {stat.value}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-full bg-neutral-100/90 border border-neutral-200/60 ${stat.changeColor}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>

                {/* Subtitle / Context label */}
                <p className="text-[11px] text-neutral-500 mt-1 truncate">
                  {stat.desc}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Secondary section: Recent Stories & Quick Access Cards in Black */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Recent Platform Stories Card (Dark / Black Card) */}
        <div className="lg:col-span-2 rounded-xl border border-neutral-850 bg-neutral-950 text-white p-6 shadow-md">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-850">
            <div>
              <h2 className="text-base font-semibold text-white">Recent Stories</h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Latest publications and submissions across the platform
              </p>
            </div>
            <Link
              href="/story-management"
              className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 transition font-medium"
            >
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-neutral-850/90 mt-2">
            {recentStories.map((story) => (
              <div
                key={story.id}
                className="py-3.5 flex items-center justify-between gap-4 group"
              >
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-sm text-neutral-200 group-hover:text-white truncate">
                    {story.title}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1">
                    <span>by {story.author}</span>
                    <span>•</span>
                    <span className="text-neutral-400">{story.genre}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-neutral-400 hidden sm:inline">
                    {story.reads} reads
                  </span>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full border ${
                      story.status === "Published"
                        ? "border-neutral-700 bg-neutral-900 text-neutral-200"
                        : "border-neutral-800 bg-neutral-950 text-neutral-500"
                    }`}
                  >
                    {story.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Quick Links & Highlights */}
        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-neutral-850 bg-neutral-950 text-white p-6 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-400 font-medium">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Moderation Queue
              </div>
              <h3 className="text-lg font-semibold text-white mt-2">
                Story Management
              </h3>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Filter by genres, manage draft statuses, or block inappropriate content.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-850">
              <Link href="/story-management">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-between border-neutral-800 bg-neutral-900 text-neutral-200 hover:bg-neutral-800 hover:text-white cursor-pointer"
                >
                  <span>Open Story Management</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-neutral-850 bg-neutral-950 text-white p-6 shadow-md">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-400 font-medium">
              <Clock className="w-4 h-4 text-sky-400" />
              System Status
            </div>
            <div className="flex items-center gap-2 mt-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm font-medium text-neutral-200">
                All systems operational
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Next.js app running with active services.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
