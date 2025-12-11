"use client";

import type { App } from "@prisma/client";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

type AppCardProps = {
  app: App;
};

export const AppCard = memo(function AppCard({ app }: AppCardProps) {
  const { ref, hasIntersected } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "50px",
    freezeOnceVisible: true,
  });

  return (
    <Link
      href={`/app/${app.id}`}
      className="group flex flex-col gap-2.5 transition-all duration-200 hover:scale-[1.02]"
    >
      <div
        ref={ref}
        className="relative aspect-square w-full overflow-hidden rounded-3xl border border-border-light shadow-sm transition-all duration-300 group-hover:shadow-lg group-hover:border-primary-blue/30"
      >
        {hasIntersected && (
          <>
            <Image
              src={app.iconUrl}
              alt={`${app.title} icon`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              priority={false}
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </>
        )}
      </div>
      <div className="flex flex-col gap-0.5 px-1">
        <h3 className="line-clamp-2 text-sm font-normal leading-snug text-ink transition-colors group-hover:text-primary-blue">
          {app.title}
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-ink-secondary">
          <span className="font-normal">{app.rating.toFixed(1)}</span>
          <Star className="h-3 w-3 fill-current" />
        </div>
      </div>
    </Link>
  );
}, (prevProps, nextProps) => {
  // Custom comparison - only re-render if app data changes
  return prevProps.app.id === nextProps.app.id &&
         prevProps.app.rating === nextProps.app.rating &&
         prevProps.app.title === nextProps.app.title &&
         prevProps.app.iconUrl === nextProps.app.iconUrl;
});
