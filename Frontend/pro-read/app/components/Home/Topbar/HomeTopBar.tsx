import { Bell, Menu, Search } from "lucide-react";

import { Button } from "@/app/Components/ui/Button";
import { Input } from "@/app/Components/ui/Input";
import AuthEntry from "../../Auth/AuthEntry";

export default function HomeTopBar() {
  return (
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

        {/* <Button className="h-10 cursor-pointer rounded-md bg-indigo-500 px-5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(99,102,241,0.35)] hover:bg-indigo-400">
          Login
        </Button> */}
        <AuthEntry/>
        </div>
      </div>
    </header>
  );
}
