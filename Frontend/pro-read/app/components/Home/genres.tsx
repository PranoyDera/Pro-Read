import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type GenreItem = {
  name: string;
  bgClass: string;
};

const genres: GenreItem[] = [
  { name: "Fantasy", bgClass: "from-[#2a1249] to-[#31155a] border-[#5d2aa0]/55" },
  { name: "Sci-Fi", bgClass: "from-[#0e2a66] to-[#102e72] border-[#2f5fc7]/55" },
  { name: "Mystery", bgClass: "from-[#083b3a] to-[#05524f] border-[#0f8f87]/55" },
  { name: "Romance", bgClass: "from-[#4f0f2e] to-[#6b153d] border-[#be2f74]/55" },
  { name: "Adventure", bgClass: "from-[#3a2b08] to-[#5c4211] border-[#b17a17]/55" },
];

export default function GenresSection() {
  return (
    <Card className="border-white/10 bg-[#050c1d]/85 py-0">
      <CardHeader className="border-b border-white/10 py-5">
        <CardTitle className="flex items-center gap-2 text-xl font-semibold text-slate-100">
          Explore Genres
        </CardTitle>
      </CardHeader>

      <CardContent className="py-5">
        <div className="overflow-x-auto hide-scrollbar">
          <div className="flex min-w-max gap-4">
            {genres.map((genre) => (
              <Card
                key={genre.name}
                className={`h-[132px] w-[180px] shrink-0 border bg-gradient-to-br py-0 text-white md:w-[220px] ${genre.bgClass}`}
              >
                <CardContent className="flex h-full items-center justify-center p-0">
                  <p className="[font-family:Georgia,Times,_serif] text-2xl font-semibold md:text-3xl">
                    {genre.name}
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
