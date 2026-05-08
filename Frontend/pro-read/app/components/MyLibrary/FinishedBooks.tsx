import { ArrowRight } from "lucide-react";
import BookCard from "./BookCard";
import { Button } from "../ui/button";

const finishedBooks = [
  {
    title: "History of Logic",
    author: "Prof. A. Sterling",
    cover: "https://lh3.googleusercontent.com/aida-public/AB6AXuA2EJVagAmNk4d8xA-10X30wpnrRA7aRmusExLlcqIcZD69dqLWmGp5vbVAClY_31VgmEBUpEIyRWuTpoRVg4jpG-nozzCf19JFGV0zObJqvLPlcUlyF4B81SBLUOX1lbURogM0J7SecZViH37h5pv85UiCNF3KD_U3FfrHW5rIo-WAUSWNj6YGrB1imzWiUjsphXPM6_XFG8SMNN3gbuSfITVlcoe2pfIgcVAoEcbmczd9WvmIu6Vryd3K5ESd3RXLIuyGyUwvFmW_",
    genre: "Philosophy",
  },
  {
    title: "Winter Solstice",
    author: "Lia K. Chen",
    cover: "https://lh3.googleusercontent.com/aida-public/AB6AXuAfhkvEb1CTf1PuUMpPW-pClvo_tG-OMJ-ldrfQ0chtDT87aOHQIgPQCHCzVaxHWUmoOXMaYS0gNQDppWXL59E2NIYCK-bKkW2AvT0nP1QeIPWdhOLIg_lA9hUT7Qt4WXZE8ZU8uSWkR0MQ_mJiQ8lCNcgZM13RtbfmtxMlzeDYExtnREGEceUgw6rDM-KYBzg2J17MRh6W5OdJtuvWZnJyFEJ7DbWTsoUXjTRz3b3_iDWoBLhLesjjTyO3d2lx5Q4ful3Ym5C_jw8S",
    genre: "Essays",
  },
  {
    title: "The Lost Botanist",
    author: "Oliver Green",
    cover: "https://lh3.googleusercontent.com/aida-public/AB6AXuDu_IQZt-SYcpk1WCjh20roQVZrTVQ_LuN63q9O-a1zSwIkW6PU4E35n6EIAoTA5Oz1Ek6c26NUcwbbfM0gmoLHUbXgQXmEfFYyuMxPZfepTFMO7Xntz_b8ar0_iD3vO2gcPGo49Kg3keH1cEGzodzzrqUPU1507wRvknVQlhpJEK7sWWOwLUwaidIzn5TQ-bBnmdIGgfNgXXS8TO7BMmg-wmtXJEyD_znDS7iuZHclsdJgrBZSylcWaS2KqJIlNDRpocQ1wDam_QpS",
    genre: "Science",
  },
  {
    title: "Midnight Verses",
    author: "S. T. Coleridge",
    cover: "https://lh3.googleusercontent.com/aida-public/AB6AXuCNA80_QqBBL5p5IavAXVC2Uqgee_bkJeBHnTa1_9p69INxr34miIMaySOtB9hbQWi6mw2DpqstsqLoFGVjjq0Xqah0Dq0oZeWI3A0Zm-C33SHcnhTmi59T1h-MTnJjFw_rFPIYVrXLlFmrcq4Jib5dc-Ddt-9V2t-wadlKbzyYBT6NGjLv7XT69uEF20IP2lIxsare4AylVnYsJWKJjpg7LqT_91sga0Hjbbwg9C_FKJrT9H3Jmy0Kz7dHoIK9njQkWgM-KeTwYhTR",
    genre: "Poetry",
  },
  {
    title: "Urban Theory",
    author: "Dr. Felix Ward",
    cover: "https://lh3.googleusercontent.com/aida-public/AB6AXuCDhAjSTHyIRXIyNA8sFacbD2pG1_syjJ_rGmg4CFNgseVgkht1RF2sZboNE0e2Tjr4WOsKBAd6g7xO5pKRze4RfGv-5Z7nY2bEIV8oo8MdVEM2enkqPxksbr3XWBTF7M9aJWVWB7c6Ds2nCeUGisOZqD0WZ3LVlOS8FU7ZZN6eA6qviriHtyYfy9msfkFEhL15KzTCX0JkPy56KViHtIiTD8C3wk2gta856bDHuBTj3wLFfLhf9oogZ1PcDlJZ5gHksSumt8vQ7ZX2",
    genre: "Society",
  },
];

export default function FinishedBooks() {
  return (
    <div className="w-full text-white">
      
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 
          style={{ fontFamily: "Manrope, sans-serif" }}
          className="text-2xl font-bold">
            Completed Masterpieces
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            Triumphs of intellect and literary exploration.
          </p>
        </div>

        <Button 
        style={{ fontFamily: "Manrope, sans-serif" }}
        className="text-sm bg-inherit text-[#C1C1FF] flex">
          View All <ArrowRight/>
        </Button>
      </div>

      {/* Grid instead of flex */}
      <div className="grid grid-cols-5 gap-6">
        {finishedBooks.map((book, i) => (
          <BookCard key={i} {...book} />
        ))}
      </div>
    </div>
  );
}