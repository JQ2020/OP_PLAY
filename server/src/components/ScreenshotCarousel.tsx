"use client";

import Image from "next/image";
import type { Screenshot } from "@prisma/client";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useRef, useState, useEffect } from "react";

type ScreenshotCarouselProps = {
  screenshots: Screenshot[];
  title: string;
};

export function ScreenshotCarousel({ screenshots, title }: ScreenshotCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [hasManuallyScrolled, setHasManuallyScrolled] = useState(false);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const x = useMotionValue(0);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      setHasManuallyScrolled(true);
      const container = e.currentTarget;
      const scrollAmount = 250;
      container.scrollBy({
        left: e.key === 'ArrowLeft' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const scrollToIndex = (index: number) => {
    const container = containerRef.current;
    if (!container) return;
    const itemWidth = container.scrollWidth / screenshots.length;
    container.scrollTo({
      left: itemWidth * index,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const itemWidth = container.scrollWidth / screenshots.length;
      const newIndex = Math.round(scrollLeft / itemWidth);
      setActiveIndex(newIndex);
    };

    const handleUserScroll = () => {
      setHasManuallyScrolled(true);
    };

    container.addEventListener('scroll', handleScroll);
    container.addEventListener('wheel', handleUserScroll);
    container.addEventListener('touchstart', handleUserScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      container.removeEventListener('wheel', handleUserScroll);
      container.removeEventListener('touchstart', handleUserScroll);
    };
  }, [screenshots.length]);

  useEffect(() => {
    if (screenshots.length <= 1 || isHovered || hasManuallyScrolled) {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
        autoPlayTimerRef.current = null;
      }
      return;
    }

    autoPlayTimerRef.current = setInterval(() => {
      setActiveIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % screenshots.length;
        scrollToIndex(nextIndex);
        return nextIndex;
      });
    }, 2000);

    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [screenshots.length, isHovered, hasManuallyScrolled]);

  return (
    <div className="space-y-4">
      <motion.div
        ref={containerRef}
        className="flex gap-4 overflow-x-auto pb-4 pt-2 pl-4 md:pl-6 scrollbar-hide cursor-grab active:cursor-grabbing"
        role="region"
        aria-label={`Screenshots for ${title}`}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        style={{ x }}
        onDragStart={() => setHasManuallyScrolled(true)}
      >
        {screenshots.map((screenshot, idx) => (
          <motion.div
            key={screenshot.id}
            role="img"
            aria-label={`Screenshot ${idx + 1} of ${screenshots.length}`}
            className="relative aspect-[9/16] h-64 flex-shrink-0 overflow-hidden rounded-xl border border-border-light shadow-sm transition-all sm:h-80"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: activeIndex === idx ? 1.05 : 1,
            }}
            transition={{
              opacity: { duration: 0.5, delay: idx * 0.1 },
              scale: { duration: 0.3 }
            }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              transition: { duration: 0.2 }
            }}
          >
            <Image
              src={screenshot.url}
              alt={`Screenshot ${idx + 1} for ${title}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 150px, 200px"
            />
            {activeIndex === idx && (
              <motion.div
                className="absolute inset-0 border-2 border-primary-blue rounded-xl pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.div>
        ))}
      </motion.div>

      {screenshots.length > 1 && (
        <div className="flex justify-center gap-2">
          {screenshots.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setHasManuallyScrolled(true);
                scrollToIndex(idx);
              }}
              className="group relative h-2 w-2 rounded-full transition-all"
              aria-label={`Go to screenshot ${idx + 1}`}
            >
              <motion.div
                className="h-full w-full rounded-full bg-border"
                animate={{
                  backgroundColor: activeIndex === idx
                    ? "rgb(26, 115, 232)"
                    : "rgb(218, 220, 224)",
                  scale: activeIndex === idx ? 1.5 : 1,
                }}
                transition={{ duration: 0.3 }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
