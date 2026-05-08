import { curatedCollections } from "../../home-data";
import SectionHeading from "../SectionHeading";
import CollectionCard from "./components/CollectionCard";

export default function CollectionSection() {
  return (
    <section className="space-y-6 p-6">
      <SectionHeading
        title="Curated Collections"
        description="Thematic journeys handpicked by our editors."
        actionLabel="View all collections"
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {curatedCollections.map((collection) => (
          <CollectionCard
            key={collection.title}
            title={collection.title}
            imageSrc={collection.imageSrc}
            imageAlt={collection.imageAlt}
            titleClassName={collection.titleClassName}
          />
        ))}
      </div>
    </section>
  );
}
