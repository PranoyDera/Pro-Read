import Image from "next/image";

import { staffPicks } from "../home-data";
import SectionHeading from "./SectionHeading";

function MiniBook({
  imageSrc,
  imageAlt,
  title,
}: {
  imageSrc: string;
  imageAlt?: string;
  title: string;
}) {
  return (
    <div className="shrink-0 rounded-[10px] bg-[#f4f3ef] p-2 shadow-[0_14px_32px_rgba(0,0,0,0.18)]">
      <div className="relative aspect-[0.72] w-[66px] overflow-hidden rounded-[6px] border border-black/10 bg-[#d9dedb] sm:w-[78px]">
        <Image
          src={imageSrc}
          alt={imageAlt ?? title}
          fill
          className="object-cover"
          sizes="96px"
        />
      </div>
    </div>
  );
}

export default function StaffPicksSection() {
  return (
    <section className="space-y-6 border border-white/6 bg-[#10182a]/70 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.18)] md:p-8">
      <SectionHeading title="Staff Picks" />

      <div className="grid gap-4 xl:grid-cols-2">
        {staffPicks.map((pick) => (
          <article
            key={pick.title}
            className="flex items-start gap-4 rounded-[18px] border border-white/8 bg-[#141d31] p-4 transition duration-300 hover:border-white/12 hover:bg-[#172238] sm:gap-5 sm:p-5"
          >
            <MiniBook
              imageSrc={pick.coverImageSrc}
              imageAlt={pick.coverImageAlt}
              title={pick.title}
            />

            <div className="min-w-0 flex-1 space-y-3 pt-1">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h3 className="max-w-[14ch] text-xl leading-[1.2] font-semibold text-white">
                  {pick.title}
                </h3>
                <span className="rounded-[10px] bg-[#20295a] px-3 py-1.5 text-[10px] font-semibold tracking-[0.12em] text-[#6e7dff] uppercase">
                  {pick.badge}
                </span>
              </div>

              <p className="max-w-[34ch] text-sm leading-6 text-slate-300/90 italic">
                {pick.summary}
              </p>

              <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                <span className="flex size-4 items-center justify-center rounded-full bg-slate-500/70" />
                <span>{pick.editor}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
