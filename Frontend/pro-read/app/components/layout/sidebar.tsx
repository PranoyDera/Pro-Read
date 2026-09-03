"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import type { ComponentType } from "react";
import {
  Bookmark,
  Compass,
  Crown,
  Flame,
  GraduationCap,
  Home,
  Mail,
  PenSquare,
  Star,
  Users,
} from "lucide-react";

import type { AuthUser } from "@/app/Service/AuthService";
import { Button } from "@/app/Components/ui/Button";
import { USER_ALLOWED_ROUTES } from "@/app/Constants/Common";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
};

type NavGroup = {
  label?: string;
  items: NavItem[];
};

const getNavGroups = (): NavGroup[] => [
  {
    items: [
      { label: "Home", href: "/home", icon: Home },
      { label: "Create Story", href: "/createStory", icon: PenSquare },
      { label: "Authors", href: "/authors", icon: GraduationCap },
      { label: "Discover", href: "/discover", icon: Compass },
      { label: "My Library", href: "/myLibrary", icon: Bookmark },
      { label: "History", href: "/history", icon: Flame },
    ],
  },
  {
    label: "Community",
    items: [
      { label: "The Circle", href: "#", icon: Users },
      { label: "Challenges", href: "#", icon: Star },
    ],
  },
];

type SidebarLinkProps = {
  item: NavItem;
  isAuthenticated: boolean;
  onProtectedRouteClick: () => void;
};

function SidebarLink({
  item,
  isAuthenticated,
  onProtectedRouteClick,
}: SidebarLinkProps) {
  const router = useRouter();
  const pathname = router.pathname;

  const isAllowed =
    item.href === "#" || isAuthenticated || USER_ALLOWED_ROUTES.has(item.href);

  const isActive =
    item.href !== "#" &&
    (pathname === item.href ||
      (item.href === "/home" &&
        (pathname === "/" || pathname === "/home")));

  const Icon = item.icon;

  return (
    <Button
      asChild
      variant="ghost"
      className={cn(
        "group relative h-12 w-full justify-start gap-3 border-0 px-3.5 text-sm font-medium transition-all duration-200",
        isActive
          ? [
              // Active container
              "-mx-4 w-[calc(100%+1rem)]",
              "rounded-r-full rounded-l-none",
              "bg-[#181d2e]",
              "pl-7 pr-5",
              "text-[#b9b6ff]",
              "hover:bg-[#181d2e]",

              // Left purple indicator
              "before:absolute before:left-0 before:top-0 before:h-full before:w-1.5",
              "before:bg-[#6864ff]",
            ]
          : [
              "rounded-[5px]",
              "text-slate-300",
              "hover:bg-white/5 hover:text-white",
            ]
      )}
    >
      <Link
        href={item.href}
        onClick={(event) => {
          if (!isAllowed) {
            event.preventDefault();
            onProtectedRouteClick();
          }
        }}
        className="flex w-full items-center gap-3"
      >
        {/* Active icon circle */}
        <span
          className={cn(
            "flex shrink-0 items-center justify-center transition-all duration-200",
            isActive
              ? "h-9 w-9 rounded-full bg-[#b8b5ff] text-[#25235c]"
              : "h-9 w-9 text-slate-400 group-hover:text-white"
          )}
        >
          <Icon
            className={cn(
              "transition-all duration-200",
              isActive ? "size-5" : "size-[18px]"
            )}
          />
        </span>

        <span
          className={cn(
            "truncate transition-colors",
            isActive ? "text-[15px] font-medium text-[#b9b6ff]" : ""
          )}
        >
          {item.label}
        </span>
      </Link>
    </Button>
  );
}

function SidebarGroup({
  group,
  isAuthenticated,
  onProtectedRouteClick,
}: {
  group: NavGroup;
  isAuthenticated: boolean;
  onProtectedRouteClick: () => void;
}) {
  return (
    <div className="space-y-3">
      {group.label ? (
        <p className="px-3 text-[10px] font-semibold tracking-[0.28em] text-slate-500 uppercase">
          {group.label}
        </p>
      ) : null}

      <div className="space-y-1.5">
        {group.items.map((item) => (
          <SidebarLink
            key={item.label}
            item={item}
            isAuthenticated={isAuthenticated}
            onProtectedRouteClick={onProtectedRouteClick}
          />
        ))}
      </div>
    </div>
  );
}

function SidebarProfile({
  currentUser,
  isAuthenticated,
  onProtectedRouteClick,
}: {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  onProtectedRouteClick: () => void;
}) {
  const router = useRouter();
  const isAllowed = isAuthenticated || USER_ALLOWED_ROUTES.has("/myProfile");
  const userInitial =
    currentUser?.name?.trim().charAt(0).toUpperCase() || "P";

  return (
    <div
      onClick={() => {
        if (isAllowed) {
          void router.push("/myProfile");
        } else {
          onProtectedRouteClick();
        }
      }}
      className={cn(
        "rounded-[5px] border border-white/8 bg-white/[0.03] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] cursor-pointer"
      )}
    >
      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          {currentUser?.profile_pic && currentUser.profile_pic.trim() !== "" ? (
            <img
              src={currentUser.profile_pic}
              alt={currentUser?.name || "Profile avatar"}
              className="relative h-12 w-12 rounded-full border border-white/10 object-cover bg-[#121826]"
              onError={(e) => {
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
            style={{ display: currentUser?.profile_pic && currentUser.profile_pic.trim() !== "" ? "none" : "flex" }}
            className="relative h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-900 text-lg font-bold uppercase text-white shadow-[0_0_15px_rgba(99,102,241,0.25)] select-none"
          >
            {userInitial}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">
            {currentUser?.name || "Your profile"}
          </p>
          <p className="truncate text-xs text-slate-400">
            {currentUser?.email || "Sign in to see your account"}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between rounded-xl border border-white/8 bg-black/20 px-3 py-2 text-xs text-slate-300">
        <div className="flex min-w-0 items-center gap-2">
          <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" />
          <span className="truncate">
            {currentUser?.email || "Profile details"}
          </span>
        </div>
        <Crown className="h-3.5 w-3.5 shrink-0 text-amber-300" />
      </div>
    </div>
  );
}

type SidebarProps = {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  onProtectedRouteClick: () => void;
};

export function Sidebar({
  currentUser,
  isAuthenticated,
  onProtectedRouteClick,
}: SidebarProps) {
  return (
    <aside className="sticky top-0 hidden h-screen w-[252px] shrink-0 border-r border-white/6 bg-[#0b1223] px-4 py-5 lg:flex lg:flex-col">
      <div className="flex items-center gap-2.5 px-2 pb-7">
        {/* logo */}
      </div>

      <div className="space-y-7">
        {getNavGroups().map((group, index) => (
          <SidebarGroup
            key={group.label ?? `group-${index}`}
            group={group}
            isAuthenticated={isAuthenticated}
            onProtectedRouteClick={onProtectedRouteClick}
          />
        ))}
      </div>

      <div className="mt-auto space-y-3 pt-6">
        {/* existing Reading Room button */}

        <SidebarProfile
          currentUser={currentUser}
          isAuthenticated={isAuthenticated}
          onProtectedRouteClick={onProtectedRouteClick}
        />
      </div>
    </aside>
  );
}
