"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { TooltipProvider } from "@/app/components/ui/tooltip";
import {
  SidebarProvider,
  SidebarInset,
} from "@/app/components/ui/sidebar";
import { AppSidebar } from "@/app/components/layout/app-sidebar";
import { getAdminAuthToken, clearAdminAuthToken } from "@/app/service/config";
import { ADMIN_AUTH_TOKEN_EVENT } from "@/app/consts/common";

export function AdminLayoutShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const checkToken = () => {
      const token = getAdminAuthToken();
      if (!token) {
        setIsAuthenticated(false);
        if (!isLoginPage) {
          clearAdminAuthToken();
          router.replace("/login");
        }
      } else {
        setIsAuthenticated(true);
        if (isLoginPage) {
          router.replace("/");
        }
      }
    };

    checkToken();

    window.addEventListener(ADMIN_AUTH_TOKEN_EVENT, checkToken);
    window.addEventListener("storage", checkToken);

    return () => {
      window.removeEventListener(ADMIN_AUTH_TOKEN_EVENT, checkToken);
      window.removeEventListener("storage", checkToken);
    };
  }, [isLoginPage, router, pathname]);

  if (isLoginPage) {
    return (
      <main className="min-h-full flex-1 w-full flex flex-col">
        {children}
      </main>
    );
  }

  // Prevent flash of protected layout while checking token
  if (isAuthenticated === false || isAuthenticated === null) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-neutral-100 text-neutral-600">
        <div className="flex items-center gap-2.5 text-sm font-medium">
          <span className="w-4 h-4 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
          <span>Authenticating session...</span>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <SidebarInset className="bg-neutral-100 text-neutral-900 flex flex-col flex-1 min-w-0">
          {/* Top Navbar */}
          <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between gap-2 border-b border-neutral-200/80 bg-white/80 backdrop-blur-md px-4 sm:px-6 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <span className="font-semibold text-neutral-900">Pro-Read</span>
                <span>/</span>
                <span className="text-neutral-600 font-medium">Admin Console</span>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
