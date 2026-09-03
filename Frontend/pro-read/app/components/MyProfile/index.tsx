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
  Camera,
  Trash2,
  CheckCircle2,
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
    coverPic?: string | null;
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
  const [isUploadingCover, setIsUploadingCover] = useState<boolean>(false);
  const [coverError, setCoverError] = useState<string | null>(null);
  const coverInputRef = React.useRef<HTMLInputElement>(null);

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
          coverPic: updatedUser.coverPic ?? updatedUser.cover_pic ?? prev.user.coverPic,
          birthDate: updatedUser.birthDate ?? updatedUser.birth_date ?? prev.user.birthDate,
        },
      };
    });
  };

  const handleCoverFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setCoverError("Please select a valid image (PNG, JPG, WebP, etc.)");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setCoverError("Cover image must be under 10MB");
      return;
    }

    try {
      setIsUploadingCover(true);
      setCoverError(null);

      const formData = new FormData();
      formData.append("coverPic", file);

      const res = await axiosInstance.post(API_ENDPOINTS.user.uploadCover, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.coverPic) {
        setProfile((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            user: {
              ...prev.user,
              coverPic: res.data.coverPic,
            },
          };
        });
      }
    } catch (err: any) {
      console.error("Failed to upload cover picture:", err);
      setCoverError(err?.response?.data?.message || err?.message || "Failed to upload cover photo.");
    } finally {
      setIsUploadingCover(false);
      if (coverInputRef.current) {
        coverInputRef.current.value = "";
      }
    }
  };

  const handleRemoveCover = async () => {
    try {
      setIsUploadingCover(true);
      setCoverError(null);
      await axiosInstance.put(API_ENDPOINTS.user.update, { coverPic: null });
      setProfile((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          user: {
            ...prev.user,
            coverPic: null,
          },
        };
      });
    } catch (err: any) {
      console.error("Failed to remove cover photo:", err);
      setCoverError(err?.response?.data?.message || err?.message || "Failed to remove cover photo.");
    } finally {
      setIsUploadingCover(false);
    }
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

      {/* COVER PHOTO & PROFILE HEADER */}
      <div className="relative mb-12 w-full rounded-2xl overflow-hidden border border-white/10 bg-[#0b1223] shadow-2xl">
        {/* HIDDEN FILE INPUT FOR COVER UPLOAD */}
        <input
          id="cover-photo-upload-input"
          ref={coverInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleCoverFileSelected}
        />

        {/* COVER PHOTO SECTION */}
        <div className="relative h-56 sm:h-72 lg:h-80 w-full overflow-hidden group bg-gradient-to-r from-slate-950 via-indigo-950 to-purple-950">
          {user?.coverPic && user.coverPic.trim() !== "" ? (
            <img
              src={user.coverPic}
              alt={`${user?.name || "User"}'s Cover`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-[#0b1223] via-indigo-950/70 to-[#0b1223] flex items-center justify-center">
              <div className="absolute -top-16 -left-16 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
              <div className="text-center text-slate-500/80 pointer-events-none">
                <Camera className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p className="text-xs font-medium tracking-wide">Add a cover photo to personalize your profile</p>
              </div>
            </div>
          )}

          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b1223] via-[#0b1223]/40 to-transparent pointer-events-none" />

          {/* Upload loading indicator */}
          {isUploadingCover && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-30 flex flex-col items-center justify-center space-y-2">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
              <span className="text-sm font-medium text-slate-200">Updating cover photo...</span>
            </div>
          )}

          {/* Cover Action Buttons (Facebook-style bottom right) */}
          <div className="absolute bottom-4 right-4 z-40 flex items-center gap-2 pointer-events-auto">
            {coverError && (
              <span className="bg-red-500/20 border border-red-500/40 text-red-300 text-xs px-3 py-1.5 rounded-lg backdrop-blur-md">
                {coverError}
              </span>
            )}

            {user?.coverPic && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveCover();
                }}
                disabled={isUploadingCover}
                className="bg-black/70 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/40 text-slate-300 border border-white/15 backdrop-blur-md text-xs h-9 px-3 rounded-lg transition cursor-pointer flex items-center justify-center pointer-events-auto"
                title="Remove Cover Photo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                coverInputRef.current?.click();
              }}
              disabled={isUploadingCover}
              className="inline-flex items-center gap-2 bg-black/80 hover:bg-black active:scale-95 text-white border border-white/20 backdrop-blur-md text-xs font-semibold h-9 px-4 rounded-lg shadow-xl transition cursor-pointer select-none pointer-events-auto"
            >
              <Camera className="w-4 h-4 text-indigo-400" />
              <span>{user?.coverPic ? "Edit Cover Photo" : "Add Cover Photo"}</span>
            </button>
          </div>
        </div>

        {/* PROFILE INFO & AVATAR ROW (Overlapping Cover Photo) */}
        <div className="px-6 sm:px-8 pb-8 pt-0 -mt-16 sm:-mt-20 relative z-20 pointer-events-auto">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-6 border-b border-white/10">
            {/* Left: Avatar & User Metadata */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 w-full md:w-auto">
              {/* AVATAR */}
              <div className="relative shrink-0">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-b from-indigo-500/40 to-purple-600/40 blur-xs" />

                {user?.profilePic && user.profilePic.trim() !== "" ? (
                  <img
                    src={user.profilePic}
                    alt={user?.name || "Profile avatar"}
                    className="relative h-32 w-32 sm:h-36 sm:w-36 rounded-full ring-4 ring-[#0b1223] border border-white/15 object-cover bg-[#121826] shadow-2xl"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = "none";
                      const fallback = target.nextElementSibling as HTMLElement | null;
                      if (fallback) fallback.style.display = "flex";
                    }}
                  />
                ) : null}

                <div
                  style={{ display: user?.profilePic && user.profilePic.trim() !== "" ? "none" : "flex" }}
                  className="relative h-32 w-32 sm:h-36 sm:w-36 items-center justify-center rounded-full ring-4 ring-[#0b1223] border border-white/15 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-900 text-5xl font-bold uppercase text-white shadow-[0_0_30px_rgba(99,102,241,0.25)] select-none"
                >
                  {user?.name?.trim() ? user.name.trim().charAt(0) : "U"}
                </div>
              </div>

              {/* USER INFO */}
              <div className="space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1
                    style={{ fontFamily: '"Noto Serif", sans-serif' }}
                    className="text-3xl sm:text-4xl font-bold tracking-tight text-white"
                  >
                    {user?.name || "Julian Barnes"}
                  </h1>
                  {user?.isVerified && (
                    <span className="inline-flex items-center gap-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs px-2.5 py-0.5 rounded-full font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                      Verified
                    </span>
                  )}
                </div>

                <p
                  style={{ fontFamily: "Manrope, sans-serif" }}
                  className="text-sm text-indigo-200/90 font-medium"
                >
                  {user?.tagline || "Bibliophile since 2024 • Premium Member"}
                </p>

                {/* TAGS */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {tags.map((tag, idx) => (
                    <span
                      key={idx}
                      style={{ fontFamily: "Manrope, sans-serif" }}
                      className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300 backdrop-blur-sm border border-white/5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3 w-full md:w-auto pt-2 md:pt-0">
              <Button
                onClick={() => setIsEditModalOpen(true)}
                className="h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-5 text-sm font-semibold shadow-lg shadow-indigo-600/20 cursor-pointer transition flex items-center gap-2"
              >
                <IconEdit className="w-4 h-4" />
                <span>Edit Profile</span>
              </Button>
            </div>
          </div>

          {/* BIO SNIPPET */}
          {user?.bio && (
            <div className="mt-4 bg-white/[0.02] border border-white/5 p-4 rounded-xl">
              <p className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-1">About</p>
              <p className="text-sm text-slate-200 leading-relaxed">{user.bio}</p>
            </div>
          )}
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
