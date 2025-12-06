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
      className="group flex flex-col gap-3 rounded-xl p-4 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-[20%] shadow-[0_1px_2px_rgba(60,64,67,0.3),0_1px_3px_1px_rgba(60,64,67,0.15)] transition-shadow group-hover:shadow-md">
        <Image
          src={app.iconUrl}
          alt={`${app.title} icon`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          priority={false}
        />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="line-clamp-2 text-[13px] font-medium leading-tight text-[#202124] group-hover:underline">
          {app.title}
        </h3>
        <div className="flex items-center gap-1 text-xs text-[#5f6368]">
          <span>{app.rating.toFixed(1)}</span>
          <Star className="h-3 w-3 fill-current text-[#5f6368]" />
        </div>
      </div>
    </Link>
  );
}
