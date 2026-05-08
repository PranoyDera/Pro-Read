import Link from "next/link";
import { AtSign, Dribbble, Facebook } from "lucide-react";

const footerColumns = [
  {
    heading: "Navigation",
    links: ["Home", "Trending", "Collections", "Categories"],
  },
  {
    heading: "Community",
    links: ["The Circle", "Events", "Forum", "Awards"],
  },
  {
    heading: "Legal",
    links: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
  },
  {
    heading: "Support",
    links: ["Help Center", "Contact Us", "Status"],
  },
];

export default function HomeFooter() {
  return (
    <footer className="border-t border-white/6 pt-8 mx-6">
      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
        {footerColumns.map((column) => (
          <div key={column.heading} className="space-y-3">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-slate-500 uppercase">
              {column.heading}
            </p>
            <div className="space-y-2">
              {column.links.map((link) => (
                <Link
                  key={link}
                  href="#"
                  className="block text-sm text-slate-400 transition hover:text-white"
                >
                  {link}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-col gap-4 border-t border-white/6 pt-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
        <p>&copy; 2024 Pro-Read Platform. All rights reserved.</p>
        <div className="flex items-center gap-3">
          {[Facebook, AtSign, Dribbble].map((Icon, index) => (
            <Link
              key={index}
              href="#"
              className="inline-flex size-9 items-center justify-center rounded-full border border-white/8 bg-white/[0.03] text-slate-300 transition hover:bg-white/8 hover:text-white"
            >
              <Icon className="size-4" />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
