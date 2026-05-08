import CuratedInbox from "./CuratedInbox";
import HeroSpotlight from "./HeroSpotlight";
import MonthlyPicks from "./MonthlyPicks";
import NewArrivals from "./NewArrivals";
import RisingThemes from "./RisingThemes";

export default function DiscoverComponent() {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-white px-6 py-10">
      <div className="space-y-16">
        <HeroSpotlight
          title="The Architect of Shadows"
          description="An immersive journey through the forgotten corridors of Neo-Victorian London. Discover why critics call it the most influential gothic mystery of the decade."
          image="https://lh3.googleusercontent.com/aida-public/AB6AXuAH7sVwJ9Fesw-_rd7gCJAh_tuMV4MCcThZQKRhfLon9t3yl9Qy7GMl0_7VmBB3UfKvPCs8cW3Ca4W4SfgkMfpv8ozfV1SIbswmIRMThH02LMI2xO9QS3gRrfdordisycBaxxg5YcB7GyjNRLVwh0VS28vyGaKlVCKzZktCbArrBYMTUGpqh8FSMicCLFd7KOlb-z_OrDHjRwSOxvvZISuYQ6ssr2YKFGBBa_UBTJ2kFq2WQmV3iBk2d6pTVpO2OBLuK25DS_n0e0d5"
          author="O.T.G.H Sard"
          genre="Dark Fiction"
          published="June 2024"
        />
        <MonthlyPicks />
        <RisingThemes
          mainTheme={{
            title: "The Sound of Silence",
            description:
              "Explore a curated selection of contemporary literature focused on ecological harmony and rural isolation.",
            image:
              "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
            tags: ["Biophilia", "Wilderness Therapy", "Modern Pastoral"],
            subtitle: "",
          }}
          sideThemes={[
            {
              title: "Forgotten Classics",
              subtitle: "REDISCOVERED MASTERPIECES",
              image:
                "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
            },
            {
              title: "Tech Ethics",
              subtitle: "HUMANITY IN THE MACHINE AGE",
              image:
                "https://images.unsplash.com/photo-1518779578993-ec3579fee39f",
            },
          ]}
        />
        <NewArrivals
          items={[
            {
              title: "Quantum Orchards",
              category: "Science Fiction",
              published: "Published Yesterday",
              description:
                "A groundbreaking exploration of multi-dimensional gardening and the ethics of time-bound crops.",
              author: "Silas Thorne",
              image:
                "https://images.unsplash.com/photo-1492724441997-5dc865305da7",
            },
            {
              title: "Letters to a Younger Ghost",
              category: "Memoir",
              published: "Just Added",
              description:
                "A poignant collection of unsent correspondence spanning fifty years of quiet rebellion.",
              author: "Helena Rostova",
              image:
                "https://images.unsplash.com/photo-1519681393784-d120267933ba",
            },
          ]}
        />
        <CuratedInbox/>
      </div>
    </div>
  );
}
