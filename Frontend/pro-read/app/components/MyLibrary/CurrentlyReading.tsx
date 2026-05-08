import ActivityPanel from "./ActivityPanel";
import ReadingCard from "./ReadingCard";

export default function CurrentlyReading() {
  return (
    <>
      <div className="flex w-full justify-between items-center">
        <h1
          style={{ fontFamily: "Manrope, sans-serif" }}
          className="text-2xl font-bold"
        >
          Currently Reading
        </h1>
        <p style={{ fontFamily: "Manrope, sans-serif" }} className="text-sm text-[#C1C1FF]">
          3 Active Sessions
        </p>
      </div>
      <div className="grid grid-cols-3 gap-6">
        <ReadingCard />
        <ActivityPanel />
      </div>
    </>
  );
}
