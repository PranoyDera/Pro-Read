import Image from "next/image";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardTitle } from "@/app/components/ui/card";

type CollectionCardProps = {
  title: string;
  imageSrc: string;
  imageAlt?: string;
  className?: string;
  titleClassName?: string;
};

export default function CollectionCard({
  title,
  imageSrc,
  imageAlt,
  className,
  titleClassName,
}: CollectionCardProps) {
  return (
    <Card
      className={cn(
        "relative isolate w-[320px] h-90 gap-0 rounded-md border border-white/8 bg-[#0a1020] p-0 text-white ring-0 transition duration-300 hover:-translate-y-1 hover:border-white/14 hover:shadow-[0_24px_60px_rgba(0,0,0,0.28)]",
        className
      )}
    >
      <Image
        src={imageSrc}
        alt={imageAlt ?? title}
        fill
        className="absolute inset-0 object-cover transition duration-500 group-hover/card:scale-[1.03]"
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,8,18,0.02)_22%,rgba(4,8,18,0.22)_54%,rgba(2,4,12,0.92)_100%)]" />

      <CardContent className="relative flex h-full items-end px-4 pb-7">
        <CardTitle
          className={cn(
            "max-w-[11ch] text-[25px] leading-[1.05] font-semibold text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.78)] sm:text-[27px] whitespace-nowrap",
            titleClassName
          )}
        >
          {title}
        </CardTitle>
      </CardContent>
    </Card>
  );
}
