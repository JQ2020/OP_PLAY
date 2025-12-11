"use client";

import type { App } from "@prisma/client";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { memo, useRef, useState } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { motion } from "framer-motion";

type AppCardProps = {
  app: App;
  index?: number;
};

export const AppCard = memo(function AppCard({ app, index = 0 }: AppCardProps) {
  const { ref, hasIntersected } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "50px",
    freezeOnceVisible: true,
  });

  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateXValue = ((y - centerY) / centerY) * -10;
    const rotateYValue = ((x - centerX) / centerX) * 10;

    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={hasIntersected ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: [0.25, 0.1, 0.25, 1]
      }}
    >
      <Link
        href={`/app/${app.id}`}
        className="group flex flex-col gap-2.5"
      >
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative aspect-square w-full overflow-hidden rounded-3xl border border-border-light shadow-sm transition-all duration-300 will-change-transform preserve-3d group-hover:shadow-glow shine-effect"
          style={{
            transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${rotateX || rotateY ? 1.05 : 1})`,
            transition: 'transform 0.1s ease-out, box-shadow 0.3s ease',
          }}
        >
          <div ref={ref} className="absolute inset-0">
            {hasIntersected && (
              <>
                <Image
                  src={app.iconUrl}
                  alt={`${app.title} icon`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  priority={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 glass-effect" />
              </>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-0.5 px-1">
          <h3 className="line-clamp-2 text-sm font-normal leading-snug text-ink transition-colors duration-200 group-hover:text-primary-blue">
            {app.title}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-ink-secondary">
            <span className="font-normal">{app.rating.toFixed(1)}</span>
            <Star className="h-3 w-3 fill-current transition-transform duration-200 group-hover:scale-110" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}, (prevProps, nextProps) => {
  return prevProps.app.id === nextProps.app.id &&
         prevProps.app.rating === nextProps.app.rating &&
         prevProps.app.title === nextProps.app.title &&
         prevProps.app.iconUrl === nextProps.app.iconUrl &&
         prevProps.index === nextProps.index;
});
