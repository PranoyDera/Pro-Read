import { Play, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

export default function FeaturedHero() {
  return (
    <Card
      className="min-h-[460px] border-white/10 bg-transparent py-0 shadow-[0_32px_70px_rgba(0,0,0,0.45)]"
      style={{
        backgroundImage:
          "linear-gradient(90deg, rgba(2,6,17,0.95) 35%, rgba(2,6,17,0.6) 68%, rgba(37,56,107,0.2) 100%), url('https://images.unsplash.com/photo-1511884642898-4c92249e20b6?auto=format&fit=crop&w=1800&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <CardContent className="flex h-full items-center px-7 py-8 md:px-12 md:py-12">
        <div className="max-w-3xl space-y-6">
          <Button
            variant="secondary"
            className="h-8 rounded-full border border-indigo-400/50 bg-indigo-500/15 px-4 text-xs font-semibold tracking-wider text-indigo-200 uppercase hover:bg-indigo-500/25"
          >
            Featured Title
          </Button>

          <h1 className="[font-family:Georgia,Times,_serif] text-5xl leading-[1.07] font-semibold text-white md:text-7xl">
            The Celestial Weaver
          </h1>

          <p className="max-w-2xl text-lg leading-relaxed text-slate-200/90">
            In a world where stars are spun from the dreams of mortals, a young
            apprentice discovers a thread that threatens to unravel the fabric
            of the universe itself.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              className="h-12 rounded-xl bg-indigo-500 px-7 text-base font-semibold text-white hover:bg-indigo-400"
            >
              <Play className="size-5 fill-current" />
              Start Reading
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 rounded-xl border-white/20 bg-slate-900/55 px-6 text-base font-semibold text-slate-100 hover:bg-slate-800/80"
            >
              <Plus className="size-5" />
              Add to Library
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}