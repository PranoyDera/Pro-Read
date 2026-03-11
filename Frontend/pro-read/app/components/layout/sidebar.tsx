import Link from "next/link";
import type { ComponentType } from "react";
import {
  BookOpen,
  Bookmark,
  Compass,
  Home,
  Search,
  Settings,
  UserRound,
} from "lucide-react";

import { Button } from "@/app/components/ui/button";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  active?: boolean;
};

const topNavItems: NavItem[] = [
  { label: "Home", href: "/", icon: Home, active: true },
  { label: "Discover", href: "#", icon: Compass },
  { label: "Search", href: "#", icon: Search },
  { label: "Library", href: "#", icon: Bookmark },
  { label: "Profile", href: "/myProfile", icon: UserRound },
];

function NavButton({ item }: { item: NavItem }) {
  const Icon = item.icon;

  return (
    <Button
      asChild
      variant="ghost"
      className={cn(
        "h-12 w-full justify-start rounded-xl px-4 text-base text-slate-300 hover:bg-white/10 hover:text-white",
        item.active && "bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/25"
      )}
    >
      <Link href={item.href}>
        <Icon className="size-5" />
        <span>{item.label}</span>
      </Link>
    </Button>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden h-full w-64 shrink-0 border-r border-white/10 bg-[#020916] px-4 py-6 md:flex md:flex-col">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-500/80 shadow-[0_0_25px_rgba(99,102,241,0.6)]">
          <BookOpen className="size-4 text-white" />
        </div>
        <p className="[font-family:Georgia,Times,_serif] text-3xl font-semibold text-slate-100">
          Pro-Read
        </p>
      </div>

      <nav className="space-y-2">
        {topNavItems.map((item) => (
          <NavButton key={item.label} item={item} />
        ))}
      </nav>

      <div className="mt-auto pt-6">
        <Button
          asChild
          variant="ghost"
          className="h-11 w-full justify-start rounded-xl px-4 text-base text-slate-300 hover:bg-white/10 hover:text-white"
        >
          <Link href="#">
            <Settings className="size-5" />
            <span>Settings</span>
          </Link>
        </Button>
      </div>
    </aside>
  );
}
