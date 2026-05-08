// components/ThemeCardSmall.tsx
import React from "react";
import { Theme } from "./RisingThemes";

const ThemeCardSmall: React.FC<{ data: Theme }> = ({ data }) => {
  return (
    <div
      className="relative h-[200px] rounded-2xl overflow-hidden"
      style={{
        backgroundImage: `url(${data.image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-4 left-4 right-4">
        <h4 className="font-serif text-lg">{data.title}</h4>
        <p className="text-xs text-gray-400 uppercase tracking-widest">
          {data.subtitle}
        </p>
      </div>
    </div>
  );
};

export default ThemeCardSmall;