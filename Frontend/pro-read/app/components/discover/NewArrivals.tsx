// components/NewArrivals.tsx
import React from "react";
import ArrivalItem, { Arrival } from "./Arrivaltems";

interface Props {
  items: Arrival[];
}

const NewArrivals: React.FC<Props> = ({ items }) => {
  return (
    <div className="text-white">
      <h2 className="text-2xl font-serif mb-8">New Arrivals</h2>

      <div className="space-y-12">
        {items.map((item, index) => (
          <ArrivalItem
            key={index}
            data={item}
            reverse={index % 2 !== 0} // alternate layout
          />
        ))}
      </div>
    </div>
  );
};

export default NewArrivals;