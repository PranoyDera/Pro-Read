import { curatedCollections } from "../home-data";
import SectionHeading from "./SectionHeading";
import CollectionCard from "./CollectionCard";

export default function CollectionSection() {
  return (
    <section className="space-y-6 p-6">
      <SectionHeading
        title="Curated Collections"
        description="Thematic journeys handpicked by our editors."
        actionLabel="View all collections"
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 justify-items-center sm:justify-items-stretch">
        {curatedCollections.map((collection, index) => (
          <CollectionCard
            key={collection.title}
            title={collection.title}
            imageSrc={collection.imageSrc}
            imageAlt={collection.imageAlt}
            titleClassName={collection.titleClassName}
            itemCount={[14, 8, 19][index % 3]}
            className="w-full max-w-[380px] sm:max-w-none"
          />
        ))}
      </div>
    </section>
  );
}
