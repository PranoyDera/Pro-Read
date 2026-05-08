// components/RisingThemes.tsx
import React from "react";
import ThemeCardLarge from "./ThemesCardLarge";
import ThemeCardSmall from "./ThemesCardSmall";

export interface Theme {
  title: string;
  subtitle: string;
  description?: string;
  image: string;
  tags?: string[];
}

interface Props {
  mainTheme: Theme;
  sideThemes: Theme[];
}

const RisingThemes: React.FC<Props> = ({ mainTheme, sideThemes }) => {
  return (
    <div className="text-white">
      <h2
        style={{ fontFamily: "Manrope, sans-serif" }}
        className="text-2xl mb-6 font-semibold"
      >
        Rising Themes
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {/* LEFT BIG */}
        <div className="md:col-span-2">
          <ThemeCardLarge data={mainTheme} />
        </div>

        {/* RIGHT STACK */}
        <div className="flex flex-col gap-6">
          {sideThemes.map((item, i) => (
            <ThemeCardSmall key={i} data={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RisingThemes;
