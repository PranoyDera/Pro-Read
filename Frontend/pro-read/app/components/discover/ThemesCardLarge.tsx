// components/ThemeCardLarge.tsx
import React from "react";
import { Theme } from "./RisingThemes";

const ThemeCardLarge: React.FC<{ data: Theme }> = ({ data }) => {
  return (
    <div
      className="relative h-[420px] rounded-2xl overflow-hidden"
      style={{
        backgroundImage: `url(${data.image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-6 left-6 right-6">
        <span className="text-xs px-3 py-1 bg-white/10 rounded-full backdrop-blur">
          TRENDING NOW
        </span>

        <h3 className="text-2xl font-serif mt-3 mb-2">
          {data.title}
        </h3>

        <p className="text-gray-300 text-sm mb-4 max-w-md">
          {data.description}
        </p>

        <div className="flex gap-2 flex-wrap">
          {data.tags?.map((tag, i) => (
            <span
              key={i}
              className="text-xs px-3 py-1 bg-white/10 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeCardLarge;