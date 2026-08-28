"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/app/Components/ui/Dropdown-menu";

type DropdownItem = {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
};

type AppDropdownProps = {
  label?: string;
  items: DropdownItem[];
  selectedLabel?: string;
  placeholder?: string;
  className?:string;
};

export default function AppDropdown({
  label,
  items,
  selectedLabel,
  placeholder = "Select",
  className
}: AppDropdownProps) {
  return (
    <div>
      {label && (
        <label 
        style={{ fontFamily: "Manrope, sans-serif" }}
        className="text-xs text-white/60">{label}</label>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={`
              w-full flex justify-between items-center
              bg-transparent border-b border-white/20
              text-sm text-white/70
              py-2 mt-1
              outline-none
              hover:text-white
              focus:border-purple-400
              transition
              ${className}
            `}
          >
            <span>
              {selectedLabel || (
                <span className="text-white/40">{placeholder}</span>
              )}
            </span>

            <span className="text-white/40">▾</span>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          className="
            w-56 rounded-sm p-2
            bg-[#0B1020]/90 backdrop-blur-xl
            border border-white/10
          "
        >
          {items.map((item, i) => (
            <DropdownMenuItem
              key={i}
              onClick={item.onClick}
              className="
                flex items-center gap-2 px-3 py-2 rounded-lg
                text-sm text-white/70
                hover:text-white hover:bg-white/10
                cursor-pointer transition
              "
            >
              {item.icon}
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}