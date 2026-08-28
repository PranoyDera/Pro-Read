import { useState } from "react";
import { ArrowRight, CheckCircle2, Mail, Sparkles, Users } from "lucide-react";

import { Button } from "@/app/Components/ui/Button";
import { Input } from "@/app/Components/ui/Input";
import { IconSparkles } from "@tabler/icons-react";

export default function JoinCircleSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <section className="relative mx-6 overflow-hidden rounded-3xl border border-indigo-500/20 bg-[radial-gradient(ellipse_at_top_right,#1e1b4b_0%,#090d1a_60%,#050814_100%)] px-6 py-14 shadow-[0_30px_90px_rgba(30,27,75,0.45)] md:px-12 lg:py-20">
      {/* Decorative Glowing Orbs & Grids */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-indigo-600/25 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-purple-600/20 blur-[100px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:24px_24px] opacity-60" />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-indigo-300 backdrop-blur-md">
          <IconSparkles className="size-3.5 text-indigo-400 animate-pulse" />
          <span>Exclusive Literary Community</span>
        </div>

        {/* Heading */}
        <h2 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
          Join the <span className="bg-gradient-to-r from-indigo-300 via-indigo-100 to-purple-300 bg-clip-text text-transparent">Reader’s Circle</span>
        </h2>

        {/* Subtitle */}
        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300 md:text-lg leading-relaxed">
          Unlock weekly handpicked stories, early access to new releases, and live author discussions with bibliophiles worldwide.
        </p>

        {/* Feature Pills */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs font-medium text-indigo-200">
          <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 backdrop-blur-sm">
            <CheckCircle2 className="size-3.5 text-indigo-400" /> Weekly Curated Digests
          </span>
          <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 backdrop-blur-sm">
            <CheckCircle2 className="size-3.5 text-indigo-400" /> Early Chapter Access
          </span>
          <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 backdrop-blur-sm">
            <CheckCircle2 className="size-3.5 text-indigo-400" /> Ad-free Experience
          </span>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="mx-auto mt-10 max-w-lg">
          {subscribed ? (
            <div className="flex items-center justify-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-950/40 p-4 text-emerald-300 backdrop-blur-md animate-in fade-in zoom-in duration-300">
              <CheckCircle2 className="size-5 text-emerald-400" />
              <span className="font-semibold text-sm">Welcome to the Circle! Check your inbox shortly.</span>
            </div>
          ) : (
            <div className="group relative flex flex-col gap-2.5 rounded-[8px] border border-white/15 bg-white/5 p-2 backdrop-blur-xl transition duration-300 focus-within:border-indigo-400/50 focus-within:shadow-[0_0_30px_rgba(99,102,241,0.25)] sm:flex-row">
              <div className="relative flex flex-1 items-center">
                <Mail className="absolute left-4 size-5 text-slate-400 transition-colors group-focus-within:text-indigo-300" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  required
                  className="h-12 w-full rounded-[8px] border border-white/15 bg-white/5 pl-12 pr-4 text-white placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-indigo-400"
                />
              </div>
              <Button
                type="submit"
                className="h-12 rounded-[8px] bg-gradient-to-r from-indigo-500 to-purple-600 px-7 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:from-indigo-600 hover:to-purple-700 hover:shadow-indigo-500/25 active:scale-[0.98]"
              >
                <span>Subscribe</span>
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </div>
          )}
        </form>

        {/* Subscriber Social Proof */}
        <div className="mt-8 flex items-center justify-center gap-3 text-xs text-slate-400">
          <div className="flex items-center -space-x-2">
            <div className="inline-block size-6 rounded-full border border-indigo-900 bg-indigo-600 text-[10px] font-bold leading-6 text-white text-center">A</div>
            <div className="inline-block size-6 rounded-full border border-indigo-900 bg-purple-600 text-[10px] font-bold leading-6 text-white text-center">M</div>
            <div className="inline-block size-6 rounded-full border border-indigo-900 bg-emerald-600 text-[10px] font-bold leading-6 text-white text-center">R</div>
          </div>
          <span className="flex items-center gap-1">
            <Users className="size-3.5 text-indigo-400" />
            Joined by over <strong className="text-white font-semibold">250,000+</strong> passionate readers
          </span>
        </div>
      </div>
    </section>
  );
}
