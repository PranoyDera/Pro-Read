import { Button } from "../ui/button";

export default function LibraryHeader() {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-5xl font-bold">Your Library</h1>
        <p 
        style={{ fontFamily: "Manrope, sans-serif" }}
        className="text-lg text-[#C7C4D7]">
          Manage your intellectual sanctuary and curated collection.
        </p>
      </div>

      <div className="flex gap-3 rounded-full bg-[#191C1F] p-2">
        <Button style={{ fontFamily: "Manrope, sans-serif" }} className="px-3 py-1 bg-[#191C1F] rounded-full text-white">Recent</Button>
        <Button style={{ fontFamily: "Manrope, sans-serif" }} className="px-3 py-1 bg-[#191C1F] rounded-full text-white">Title</Button>
        <Button style={{ fontFamily: "Manrope, sans-serif" }} className="px-3 py-1 bg-[#191C1F] rounded-full text-white">Author</Button>
      </div>
    </div>
  );
}