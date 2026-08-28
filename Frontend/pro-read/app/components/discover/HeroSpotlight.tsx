// components/HeroSpotlight.tsx
import { Play } from "lucide-react";
import React from "react";
import { Button } from "../ui/Button";

interface HeroProps {
  title: string;
  description: string;
  image: string;
  author: string;
  genre: string;
  published: string;
}

const HeroSpotlight: React.FC<HeroProps> = ({
  title,
  description,
  image,
  author,
  genre,
  published,
}) => {
  return (
    <div
      className="relative rounded-2xl overflow-hidden p-10 shadow-xl w-250 h-100"
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* DARK GRADIENT OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0b0f19]/95 via-[#0b0f19]/80 to-transparent z-0" />

      {/* EXTRA TEAL GLOW */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,rgba(16,185,129,0.25),transparent_40%)] z-0" />

      {/* CONTENT */}
      <div className="relative z-10 max-w-lg h-full">
        <p 
        style={{ fontFamily: "Manrope, sans-serif" }}
        className="text-[#D1BCFF] font-bold tracking-widest text-sm mb-3">
          CURATED MONTHLY SPOTLIGHT
        </p>

        <h1 
        style={{ fontFamily: '"Noto Serif", serif' }}
        className="text-[#E1E2E7] font-bold text-4xl md:text-5xl font-serif leading-tight mb-4">
          {title}
        </h1>

        <p 
        style={{ fontFamily: "Manrope, sans-serif" }}
        className="text-gray-300 mb-6">{description}</p>

        <div className="flex gap-4">
          <Button className="cursor-pointer h-14 rounded-md bg-indigo-500 px-8 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(99,102,241,0.32)] hover:bg-indigo-400">
            <Play className="size-4 fill-current" />
            Read now
          </Button>
          <Button
            variant="outline"
            className="cursor-pointer h-14 rounded-md border-white/14 bg-white/10 px-7 text-sm font-semibold text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:bg-white/14"
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSpotlight;
