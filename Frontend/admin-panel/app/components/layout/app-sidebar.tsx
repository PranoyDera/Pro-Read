"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Settings,
  ShieldAlert,
  Sparkles,
  LogOut,
  Trophy,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/app/components/ui/sidebar";
import { authService } from "@/app/service/auth-service";

const navItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Story Management",
    url: "/story-management",
    icon: BookOpen,
  },
  {
    title: "User Management",
    url: "/user-management",
    icon: Users,
  },
  {
    title: "Achievements",
    url: "/achivement-management",
    icon: Trophy,
  },
];

const secondaryNavItems = [
  {
    title: "Content Moderation",
    url: "/content-moderation",
    icon: ShieldAlert,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="none" className="border-r border-neutral-300 bg-white text-neutral-900">
      {/* Sidebar Header / Brand - matching h-14 height and border line of the page navbar */}
      <SidebarHeader className="flex h-14 shrink-0 items-center justify-center border-b border-neutral-200/80 px-4 bg-white">
        <Link href="/" className="flex items-center gap-3 w-full">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 border border-neutral-800 text-white shadow-xs">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-neutral-950 tracking-tight leading-none">Pro-Read</span>
            <span className="text-[11px] text-neutral-600 font-mono font-medium mt-1 leading-none">Admin Portal</span>
          </div>
        </Link>
      </SidebarHeader>

      {/* Main Navigation Content */}
      <SidebarContent className="px-2 py-4 bg-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 px-2 mb-1">
            Platform
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive =
                  item.url === "/" ? pathname === "/" : pathname.startsWith(item.url);
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      render={<Link href={item.url} />}
                      isActive={isActive}
                      tooltip={item.title}
                      className={`h-9 rounded-md transition-colors ${
                        isActive
                          ? "bg-neutral-100 text-neutral-950 font-semibold shadow-2xs hover:bg-neutral-100 hover:text-neutral-950 data-active:bg-neutral-100 data-active:text-neutral-950"
                          : "text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100/80"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? "text-neutral-950 stroke-[2.25]" : "text-neutral-600"}`} />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 px-2 mb-1">
            Administration
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNavItems.map((item) => {
                const isActive = item.url !== "#" && pathname.startsWith(item.url);
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      render={<Link href={item.url} />}
                      isActive={isActive}
                      tooltip={item.title}
                      className={`h-9 rounded-md transition-colors ${
                        isActive
                          ? "bg-neutral-100 text-neutral-950 font-semibold shadow-2xs hover:bg-neutral-100 hover:text-neutral-950 data-active:bg-neutral-100 data-active:text-neutral-950"
                          : "text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100/80"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? "text-neutral-950 stroke-[2.25]" : "text-neutral-600"}`} />
                      <span className="flex-1 text-left">{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter className="border-t border-neutral-250 p-3 bg-neutral-50/70">
        <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-neutral-300 shadow-2xs">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-7 h-7 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-xs font-semibold text-white">
              A
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-neutral-950 truncate">Admin User</span>
              <span className="text-[10px] text-neutral-600 truncate">admin@proread.com</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              authService.logout();
              window.location.href = "/login";
            }}
            className="p-1.5 rounded text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 transition cursor-pointer"
            title="Log out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
