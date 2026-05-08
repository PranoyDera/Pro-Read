type BookCardProps = {
  title: string;
  author: string;
  cover: string;
  genre?: string;
};

export default function BookCard({
  title,
  author,
  cover,
  genre,
}: BookCardProps) {
  return (
    <div className="w-full cursor-pointer group">
      
      <div className="relative h-60 w-full rounded-2xl overflow-hidden">
        {/* Image */}
        <img
          src={cover}
          alt={title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />

        {/* Content */}
        <div className="absolute bottom-4 left-4 right-4">
          
          {/* Genre pill */}
          {genre && (
            <span className="inline-block text-[10px] px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-purple-200 uppercase tracking-wider mb-2">
              {genre}
            </span>
          )}

          {/* Title */}
          <h3
            className="text-white text-xl leading-tight"
            style={{ fontFamily: "Noto Serif, serif" }}
          >
            {title}
          </h3>

          {/* Author */}
          <p className="text-sm text-gray-300 mt-1">
            {author}
          </p>
        </div>
      </div>
    </div>
  );
}