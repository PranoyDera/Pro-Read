import CollectionSection from "./Sections/CollectionSection";
import FeaturedHero from "./FeaturedHero/FeaturedHero";
import HomeFooter from "./Footer/HomeFooter";
import HomeTopBar from "./Topbar/HomeTopBar";
import JoinCircleSection from "./Sections/JoinCircleSection";
import StaffPicksSection from "./Sections/StaffPicksSection";
import TrendingSection from "./Sections/TrendingSection";

function HomeComponent() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_65%_0%,rgba(59,74,144,0.22),transparent_28%),linear-gradient(180deg,#090f1e_0%,#070c18_100%)] text-white">
      <HomeTopBar />

      <main className="space-y-14 py-0">
        <FeaturedHero />
          <CollectionSection />
          <TrendingSection />
          <StaffPicksSection />
          <JoinCircleSection />
          <HomeFooter />
      </main>
    </div>
  );
}

export default HomeComponent;
