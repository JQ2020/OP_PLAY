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
      className="group block rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-2xl shadow-sm">
        <Image
          src={app.iconUrl}
          alt={`${app.title} icon`}
          fill
          sizes="96px"
          className="object-cover"
          priority={false}
        />
      </div>
      <div className="mt-4 space-y-1">
        <h3 className="truncate text-sm font-semibold text-ink">
          {app.title}
        </h3>
        <p className="truncate text-xs text-muted">{app.developer}</p>
        <div className="flex items-center justify-between text-xs font-medium text-ink">
          <div className="flex items-center gap-1">
            <Star
              className="h-3 w-3 text-primary"
              strokeWidth={0}
              fill="currentColor"
            />
            <span>{app.rating.toFixed(1)}</span>
          </div>
          <span className="text-primary underline-offset-2 group-hover:underline">
            Install
          </span>
        </div>
      </div>
    </Link>
  );
}
