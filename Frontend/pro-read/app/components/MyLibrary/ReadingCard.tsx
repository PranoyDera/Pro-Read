import { Bookmark } from "lucide-react";
import { Button } from "../ui/button";

export default function ReadingCard() {
  return (
    <div className="col-span-2 bg-[#1A1D22] rounded-lg flex">
      
      {/* Book Cover */}
      <div className="w-[230px] h-full bg-[#0C0E12] rounded-l-lg overflow-hidden">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyLTRSxBZh-mTfKIllLhx-QQIAIuJtBl6IwQa9C74kCh_9v6i0wELR1VZmNhuzXlwoUDtqoWWSGZLE6q-2XVyy69kKXPNHcTi2Fkumd-oSTWq-zfeR0gmHy4xXMQL0gj1mmWBct7Up8MxsoZT7uUiMWnYPb_pOEV4G0SP6kQ2iQNeiueCzbgG9RviQafC6ALODej7f1vzUR3jgQVdHT_RDN9ZI6vZjIsvPjsgR-KaeSM876tjqNFPtEKcCj5BGqOO7R64sEmYKGU59" // replace with dynamic
          alt="book"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between flex-1 p-6 gap-4">
        
        {/* Top Content */}
        <div className="w-75 space-y-2">
          <p 
          style={{ fontFamily: "Manrope, sans-serif" }}
          className="text-xs font-bold text-[#D1BCFF] uppercase">
            Primary Reading
          </p>

          <h2
            style={{ fontFamily: "Manrope, sans-serif" }}
            className="text-4xl font-bold"
          >
            The Architecture of Thought
          </h2>

          <p  style={{ fontFamily: "Manrope, sans-serif" }} className="text-sm text-gray-400">
            By Julian P. Vance
          </p>
        </div>

        {/* Progress */}
        <div className="space-y-2 w-75">
          <div className="flex justify-between text-xs">
            <span style={{ fontFamily: "Manrope, sans-serif" }} className="text-[#E1E2E7]">74% Completed</span>
            <span style={{ fontFamily: "Manrope, sans-serif" }} className="text-[#C1C1FF]">12 pages to go</span>
          </div>

          <div className="w-full h-1.5 bg-[#2A2E35] rounded-full">
            <div className="h-1.5 bg-[#BFAAFF] rounded-full w-[74%]" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-2">
          <Button className="bg-[#5D5FEF] transition px-4 py-3 rounded-md text-sm font-medium text-white h-12">
             Resume Reading
          </Button>

          <button className="w-12 h-12 flex items-center justify-center rounded-md bg-[#2A2E35]">
            <Bookmark className="w-6 h-12 text-gray-300" />
          </button>
        </div>
      </div>
    </div>
  );
}