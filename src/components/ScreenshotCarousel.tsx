import Image from "next/image";
import type { Screenshot } from "@prisma/client";

type ScreenshotCarouselProps = {
  screenshots: Screenshot[];
  title: string;
};

export function ScreenshotCarousel({ screenshots, title }: ScreenshotCarouselProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 pt-2 scrollbar-hide">
      {screenshots.map((screenshot) => (
        <div
          key={screenshot.id}
          className="relative aspect-[9/16] h-64 flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 shadow-sm sm:h-80"
        >
          <Image
            src={screenshot.url}
            alt={`Screenshot for ${title}`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 150px, 200px"
          />
        </div>
      ))}
    </div>
  );
}
