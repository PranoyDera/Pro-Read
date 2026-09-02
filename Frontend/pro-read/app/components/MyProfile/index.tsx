"use client";
import React, { useEffect, useState } from "react";

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
  Zap,
  Loader2,
} from "lucide-react";
import { Button } from "../ui/Button";
import { Card, CardContent } from "../ui/Card";
import axiosInstance from "@/app/api/api";
import { API_ENDPOINTS } from "@/app/Constants/Common";

import EditProfileModal from "./EditProfileModal";
import { IconEdit } from "@tabler/icons-react";

type ProfileData = {
  user: {
    id: number;
    name: string;
    email: string;
    phoneNumber?: string;
    gender?: string;
    profilePic?: string | null;
    role: string;
    isVerified?: boolean;
    bio?: string;
    reason?: string;
    birthDate?: string;
    createdAt?: string;
    updatedAt?: string;
    tagline?: string;
  };
  tags: string[];
  readingStats: {
    booksReadThisYear: number;
    annualGoal: number;
    booksRemaining: number;
    dayStreak: number;
    hoursImmersed: number;
    reviewsCount: number;
    genresCount: number;
  };
  unlockedAchievements: Array<{
    id: number | string;
    code: string;
    title: string;
    subtitle: string;
    icon: string;
    unlocked_at?: string;
    active?: boolean;
  }>;
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen,
  PenSquare,
  Trophy,
  BookMarked,
  MessageSquare,
};

export default function MyProfileComponent() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get<ProfileData>(API_ENDPOINTS.user.profile);
      setProfile(response.data);
    } catch (err: any) {
      console.error("Failed to load user profile:", err);
      setError(err?.message || err?.response?.data?.message || "Failed to load profile data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleProfileUpdated = (updatedUser: any) => {
    setProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        user: {
          ...prev.user,
          ...updatedUser,
          phoneNumber: updatedUser.phoneNumber ?? updatedUser.phone_number ?? prev.user.phoneNumber,
          profilePic: updatedUser.profilePic ?? updatedUser.profile_pic ?? prev.user.profilePic,
          birthDate: updatedUser.birthDate ?? updatedUser.birth_date ?? prev.user.birthDate,
        },
      };
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#020617] to-black text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#020617] to-black text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-8 max-w-md">
          <h2 className="text-xl font-semibold text-red-400 mb-2">Authentication Error</h2>
          <p className="text-sm text-slate-300 mb-6">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm transition"
          >
            Please Log In Again
          </Button>
        </div>
      </div>
    );
  }

  const user = profile?.user;
  const stats = profile?.readingStats || {
    booksReadThisYear: 0,
    annualGoal: 100,
    booksRemaining: 100,
    dayStreak: 0,
    hoursImmersed: 0,
    reviewsCount: 0,
    genresCount: 0,
  };
  const tags = profile?.tags && profile.tags.length > 0 ? profile.tags : ["Philosophical Fiction", "Modern History"];

  const progressPercentage = Math.min(100, Math.round((stats.booksReadThisYear / (stats.annualGoal || 100)) * 100));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#020617] to-black text-white p-6">
      {/* EDIT PROFILE MODAL */}
      {user && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          userData={user}
          onProfileUpdated={handleProfileUpdated}
        />
      )}

      {/* HEADER */}
      {/* HERO HEADER */}
      <div className="relative mb-10 overflow-hidden w-full">
        {/* CONTENT */}
        <div className="relative flex items-center justify-between px-8 py-7">
          {/* LEFT SIDE */}
          <div className="flex items-center gap-6 w-full">
            {/* AVATAR */}
            <div className="relative shrink-0">
              {/* border glow */}
              <div className="absolute -inset-0.5 rounded-full bg-gradient-to-b from-[#111417] to-[#D1BCFF] blur-xs" />

              {user?.profilePic && user.profilePic.trim() !== "" ? (
                <img
                  src={user.profilePic}
                  alt={user?.name || "Profile avatar"}
                  className="relative h-36 w-36 rounded-full border border-white/10 object-cover bg-[#121826]"
                  onError={(e) => {
                    // If image fails to load, hide img element and fallback to initial letter
                    const target = e.currentTarget;
                    target.style.display = "none";
                    const fallback = target.nextElementSibling as HTMLElement | null;
                    if (fallback) {
                      fallback.style.display = "flex";
                    }
                  }}
                />
              ) : null}

              <div
                style={{ display: user?.profilePic && user.profilePic.trim() !== "" ? "none" : "flex" }}
                className="relative h-36 w-36 items-center justify-center rounded-full border border-white/15 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-900 text-5xl font-bold uppercase text-white shadow-[0_0_30px_rgba(99,102,241,0.25)] select-none"
              >
                {user?.name?.trim() ? user.name.trim().charAt(0) : "U"}
              </div>
            </div>

            {/* USER INFO */}
            <div className="flex flex-col justify-start items-start w-full">
              <h1
                style={{ fontFamily: '"Noto Serif", sans-serif' }}
                className="text-[48px] leading-none font-semibold tracking-[-1.5px] text-[#E1E2E7]"
              >
                {user?.name || "Julian Barnes"}
              </h1>

              <p
                style={{ fontFamily: "Manrope, sans-serif" }}
                className="mt-2 text-[15px] text-[#C7C4D7]"
              >
                {user?.tagline || "Bibliophile since 2024 • Premium Member"}
              </p>

              <div className="mt-4 flex items-center justify-between gap-6 w-full">
                {/* TAGS */}
                <div className="flex items-center gap-3">
                  {tags.map((tag, idx) => (
                    <span
                      key={idx}
                      style={{ fontFamily: "Manrope, sans-serif" }}
                      className="rounded-full bg-white/10 px-4 py-1.5 text-xs text-slate-300 backdrop-blur-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* EDIT BUTTON */}
                <Button
                  onClick={() => setIsEditModalOpen(true)}
                  className="h-9 rounded-[5px] bg-white/10 px-5 text-sm font-medium text-slate-200 shadow-inner hover:bg-white/15 cursor-pointer transition flex items-center gap-1.5"
                >
                  <IconEdit/> Edit Profile
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
                {stats.booksReadThisYear}
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
                <div
                  className="h-full bg-[#c4b5fd] transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>

              <p
                style={{ fontFamily: "Manrope, sans-serif" }}
                className="text-[11px] text-[#7f8497] mt-3"
              >
                {stats.booksRemaining > 0
                  ? `${stats.booksRemaining} books to reach your annual goal of ${stats.annualGoal}`
                  : `Goal of ${stats.annualGoal} books reached!`}
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
                {stats.dayStreak}
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
                {stats.hoursImmersed}
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
            className="text-2xl font-semibold text-[#E1E2E7] mb-5"
          >
            Unlocked Achievements
          </h3>
          <p
            style={{ fontFamily: "Manrope, sans-serif" }}
            className="text-[#C1C1FF] text-sm font-extralight"
          >
            View more badges
          </p>
        </div>

        <div className="grid grid-cols-5 gap-5">
          {(profile?.unlockedAchievements && profile.unlockedAchievements.length > 0
            ? profile.unlockedAchievements
            : [
                {
                  id: 1,
                  code: "polymath",
                  title: "The Polymath",
                  subtitle: "5 Genres Mastered",
                  icon: "BookOpen",
                  active: true,
                },
                {
                  id: 2,
                  code: "ink_addict",
                  title: "Ink Addict",
                  subtitle: "30 Day Streak",
                  icon: "PenSquare",
                  active: true,
                },
                {
                  id: 3,
                  code: "top_1_percent",
                  title: "Top 1% Reader",
                  subtitle: "Community Elite",
                  icon: "Trophy",
                  active: true,
                },
                {
                  id: 4,
                  code: "finisher",
                  title: "The Finisher",
                  subtitle: "100 Books Read",
                  icon: "BookMarked",
                  active: false,
                },
                {
                  id: 5,
                  code: "curator",
                  title: "Curator",
                  subtitle: "10 Reviews Posted",
                  icon: "MessageSquare",
                  active: false,
                },
              ]
          ).map((item, i) => {
            const IconComponent = iconMap[item.icon] || BookOpen;
            const isActive = item.active !== false;

            return (
              <div
                key={item.id || i}
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
                isActive
                  ? "border-indigo-400/40 bg-indigo-500/15 text-indigo-300 shadow-[0_0_30px_rgba(99,102,241,0.18)]"
                  : "border-white/10 bg-white/[0.04] text-gray-400"
              }
            `}
                >
                  <IconComponent className="h-7 w-7" />
                </div>

                <h4 className="text-[15px] font-semibold text-white">
                  {item.title}
                </h4>

                <p className="mt-1 text-xs text-gray-400">{item.subtitle}</p>
              </div>
            </div>
          );
        })}
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
