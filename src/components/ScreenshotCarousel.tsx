"use client";

import Image from "next/image";
import type { Screenshot } from "@prisma/client";

type ScreenshotCarouselProps = {
  screenshots: Screenshot[];
  title: string;
};

export function ScreenshotCarousel({ screenshots, title }: ScreenshotCarouselProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      const container = e.currentTarget;
      const scrollAmount = 250;
      container.scrollBy({
        left: e.key === 'ArrowLeft' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div
      className="flex gap-4 overflow-x-auto pb-4 pt-2 scrollbar-hide"
      role="region"
      aria-label={`Screenshots for ${title}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {screenshots.map((screenshot, idx) => (
        <div
          key={screenshot.id}
          role="img"
          aria-label={`Screenshot ${idx + 1} of ${screenshots.length}`}
          className="relative aspect-[9/16] h-64 flex-shrink-0 overflow-hidden rounded-xl border border-border-light shadow-sm transition-all hover:shadow-md sm:h-80"
        >
          <Image
            src={screenshot.url}
            alt={`Screenshot ${idx + 1} for ${title}`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 150px, 200px"
          />
        </div>
      ))}
    </div>
  );
}
