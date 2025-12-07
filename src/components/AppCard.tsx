import type { App } from "@prisma/client";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type AppCardProps = {
  app: App;
};

export function AppCard({ app }: AppCardProps) {
  return (
    <Link
      href={`/app/${app.id}`}
      className="group flex flex-col gap-2.5 transition-transform hover:scale-[1.02]"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-border-light shadow-sm transition-shadow group-hover:shadow-md">
        <Image
          src={app.iconUrl}
          alt={`${app.title} icon`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          priority={false}
        />
      </div>
      <div className="flex flex-col gap-0.5 px-1">
        <h3 className="line-clamp-2 text-sm font-normal leading-snug text-ink">
          {app.title}
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-ink-secondary">
          <span className="font-normal">{app.rating.toFixed(1)}</span>
          <Star className="h-3 w-3 fill-current" />
        </div>
      </div>
    </Link>
  );
}
