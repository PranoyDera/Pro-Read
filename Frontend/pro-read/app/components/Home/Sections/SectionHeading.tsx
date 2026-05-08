import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
  icon?: React.ReactNode;
};

export default function SectionHeading({
  title,
  description,
  actionLabel,
  actionHref = "#",
  className,
  icon,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 md:flex-row md:items-end md:justify-between",
        className
      )}
    >
      <div className="space-y-1">
        <h2 className="flex items-center gap-2 [font-family:'Times New Roman',_serif] text-[34px] leading-none font-semibold tracking-tight text-white md:text-[38px]">
          {icon}
          <span>{title}</span>
        </h2>
        {description ? (
          <p className="text-sm text-slate-400">{description}</p>
        ) : null}
      </div>

      {actionLabel ? (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-1 text-sm font-medium text-indigo-300 transition hover:text-indigo-200"
        >
          <span>{actionLabel}</span>
          <ChevronRight className="size-4" />
        </Link>
      ) : null}
    </div>
  );
}
