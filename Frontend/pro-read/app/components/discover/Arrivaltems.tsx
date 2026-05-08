// components/ArrivalItem.tsx
import React from "react";

export interface Arrival {
  title: string;
  category: string;
  published: string;
  description: string;
  author: string;
  image: string;
}

const ArrivalItem: React.FC<{
  data: Arrival;
  reverse?: boolean;
}> = ({ data, reverse }) => {
  return (
    <div
      className={`grid md:grid-cols-2 gap-8 items-center ${
        reverse ? "md:flex-row-reverse" : ""
      }`}
    >
      {/* IMAGE */}
      <div
        className={`${
          reverse ? "order-2 md:order-2" : "order-1"
        }`}
      >
        <div
          className="h-[180px] md:h-[200px] rounded-xl overflow-hidden"
          style={{
            backgroundImage: `url(${data.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </div>

      {/* TEXT */}
      <div
        className={`${
          reverse ? "order-1 md:order-1" : "order-2"
        }`}
      >
        <div className="flex gap-6 text-xs text-gray-400 tracking-widest uppercase mb-2">
          <span>{data.category}</span>
          <span>{data.published}</span>
        </div>

        <h3 className="text-2xl font-serif mb-3">
          {data.title}
        </h3>

        <p className="text-gray-300 text-sm mb-4 max-w-lg">
          {data.description}
        </p>

        <div className="flex items-center gap-4 text-sm">
          <button className="text-blue-400 hover:underline flex items-center gap-1">
            READ EXCERPT →
          </button>
          <span className="text-gray-400">By {data.author}</span>
        </div>
      </div>
    </div>
  );
};

export default ArrivalItem;