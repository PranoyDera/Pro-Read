"use client";

import { useEffect, useState } from "react";
import { Bell, LogOut, Menu, Search } from "lucide-react";

import { Button } from "@/app/Components/ui/Button";
import { Input } from "@/app/Components/ui/Input";
import ActionModal from "@/app/Components/ui/ConfirmationModal";
import { clearAuthToken, getAuthToken } from "@/app/api/api";
import { AUTH_TOKEN_EVENT } from "@/app/Constants/Common";
import AuthEntry from "../../Auth/AuthEntry";

export default function HomeTopBar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    const syncAuthState = () => {
      setIsAuthenticated(Boolean(getAuthToken()));
    };

    syncAuthState();
    window.addEventListener(AUTH_TOKEN_EVENT, syncAuthState);
    window.addEventListener("storage", syncAuthState);

    return () => {
      window.removeEventListener(AUTH_TOKEN_EVENT, syncAuthState);
      window.removeEventListener("storage", syncAuthState);
    };
  }, []);

  const handleLogout = () => {
    clearAuthToken();
    setIsLogoutModalOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-white/6 bg-[#0b1020]/90 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3 px-4 py-3 md:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full border border-white/10 bg-white/5 text-slate-200 lg:hidden"
          >
            <Menu className="size-4.5" />
          </Button>

          <div className="relative max-w-xl flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search for stories, authors, or genres..."
              className="h-11 rounded-full border-white/8 bg-white/6 pl-10 text-sm text-slate-100 placeholder:text-slate-500"
            />
          </div>

          <div className="flex gap-2 items-center">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-slate-300 hover:bg-white/6 hover:text-white"
            >
              <Bell className="size-6" />
            </Button>

            {isAuthenticated ? (
              <Button
                onClick={() => setIsLogoutModalOpen(true)}
                variant="outline"
                className="h-10 rounded-[5px] border-rose-500/30 bg-rose-500/10 px-4 text-sm font-semibold text-rose-300 hover:bg-rose-500/20 hover:text-rose-200 hover:border-rose-500/50"
              >
                <LogOut className="size-4" />
                Logout
              </Button>
            ) : (
              <AuthEntry />
            )}
          </div>
        </div>
      </header>

      <ActionModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="Confirm Logout"
        description="Are you sure you want to log out? You will need to log back in to access protected content and your saved stories."
        confirmText="Logout"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleLogout}
      />
    </>
  );
}

