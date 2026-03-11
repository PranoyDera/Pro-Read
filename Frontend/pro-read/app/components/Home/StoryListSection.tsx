import { Clock3, Sparkles } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export type ContinueReadingStory = {
  title: string;
  author: string;
  minutes: string;
};

export default function ContinueReadingSection({
  stories,
}: {
  stories: ContinueReadingStory[];
}) {
  return (
    <Card className="border-white/10 bg-[#050c1d]/85 backdrop-blur py-0">
      <CardHeader className="border-b border-white/10 py-5">
        <CardTitle className="flex items-center gap-2 text-xl font-semibold text-slate-100">
          <Sparkles className="size-5 text-indigo-300" />
          Continue Reading
        </CardTitle>
        <CardDescription className="text-slate-400">
          Curated picks from your reading shelf.
        </CardDescription>
      </CardHeader>
      <CardContent className="py-5">
        <div className="overflow-x-auto pb-2 hide-scrollbar">
          <div className="flex min-w-max gap-3">
            {stories.map((story) => (
              <Card
                key={story.title}
                className="w-[280px] shrink-0 border border-white/10 bg-slate-900/60 py-0 transition hover:border-indigo-300/40 hover:bg-slate-900"
              >
                <CardHeader className="py-4">
                  <CardTitle className="text-lg font-semibold text-slate-100">
                    {story.title}
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    by {story.author}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-4">
                  <p className="flex items-center gap-2 text-xs text-slate-300">
                    <Clock3 className="size-3.5" />
                    {story.minutes}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
