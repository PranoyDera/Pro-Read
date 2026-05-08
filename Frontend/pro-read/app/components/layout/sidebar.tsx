"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import type { ComponentType } from "react";
import {
  BookOpenText,
  Bookmark,
  Compass,
  Crown,
  Flame,
  Home,
  LibraryBig,
  Mail,
  Settings,
  Star,
  Users,
} from "lucide-react";

import type { AuthUser } from "@/app/api/apiUrl";
import { Button } from "@/app/components/ui/button";
import { USER_ALLOWED_ROUTES } from "@/app/constants/common";
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

const navGroups: NavGroup[] = [
  {
    items: [
      { label: "Home", href: "/home", icon: Home },
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
        "h-11 w-full justify-start rounded-xl border px-3.5 text-sm font-medium text-slate-300 transition",
        isActive
          ? "border-indigo-400/50 bg-indigo-500/12 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:bg-indigo-500/18"
          : "border-transparent hover:border-white/10 hover:bg-white/5 hover:text-white"
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
      >
        <Icon className="size-4.5" />
        <span>{item.label}</span>
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
        "rounded-2xl border border-white/8 bg-white/[0.03] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] cursor-pointer"
      )}
    >
      <div className="flex items-center gap-3">
        {currentUser?.profile_pic ? (
          <img
            src={currentUser.profile_pic}
            alt={currentUser.name || "Profile avatar"}
            className="h-12 w-12 rounded-2xl object-cover ring-1 ring-white/10"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/80 to-cyan-400/70 text-sm font-semibold text-white ring-1 ring-white/10">
            {userInitial}
          </div>
        )}

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
        {navGroups.map((group, index) => (
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
