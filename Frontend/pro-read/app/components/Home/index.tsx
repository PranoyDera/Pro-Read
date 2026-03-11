import FeaturedHero from "./FeaturedHero";
import ContinueReadingSection, {
  ContinueReadingStory,
} from "./StoryListSection";
import GenresSection from "./genres";


const continueReading: ContinueReadingStory[] = [
  { title: "Moonlit Oath", author: "Elara Finch", minutes: "9 min left" },
  { title: "Ashes of Winter", author: "Noah Glass", minutes: "16 min left" },
  { title: "The River Archive", author: "Ira Bloom", minutes: "11 min left" },
  { title: "The Glass Orchard", author: "Reed Nolan", minutes: "7 min left" },
  { title: "Wanderers of Dawn", author: "Mina Kade", minutes: "13 min left" },
  { title: "Letters from Halcyon", author: "Ari Sol", minutes: "18 min left" },
];

function HomeComponent() {
  return (
    <section className="min-h-full px-4 py-6 md:px-8 md:py-8">
      <div className="space-y-6 pb-12">
        <FeaturedHero />

        <ContinueReadingSection stories={continueReading} />

        <GenresSection />
      </div>
    </section>
  );
}

export default HomeComponent;
