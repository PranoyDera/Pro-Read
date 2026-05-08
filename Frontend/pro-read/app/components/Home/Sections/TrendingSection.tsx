import { TrendingUp } from "lucide-react";

import { trendingStories } from "../home-data";
import SectionHeading from "./SectionHeading";
import TrendingStoryCard from "./components/TrendingStoryCard";

export default function TrendingSection() {
  return (
    <section className="space-y-6 p-6">
      <SectionHeading
        title="Trending in the Sanctuary"
        icon={<TrendingUp className="mt-1 size-5 text-indigo-300" />}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {trendingStories.map((story) => (
          <TrendingStoryCard
            key={story.title}
            title={story.title}
            author={story.author}
            duration={story.duration}
            rating={story.rating}
            badge={story.badge}
            accent={story.accent}
            coverImageSrc={story.coverImageSrc}
            coverImageAlt={story.coverImageAlt}
            coverOverlayClassName={story.coverOverlayClassName}
          />
        ))}
      </div>
    </section>
  );
}
