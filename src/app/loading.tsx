import { AppCardSkeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-background transition-colors">
      {/* Header Skeleton */}
      <div className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-border-light bg-white dark:bg-surface px-6">
        <div className="h-10 w-40 animate-pulse rounded-lg bg-surface-variant" />
        <div className="h-10 flex-1 max-w-[720px] mx-4 animate-pulse rounded-lg bg-surface-variant" />
        <div className="flex gap-2">
          <div className="h-10 w-10 animate-pulse rounded-full bg-surface-variant" />
          <div className="h-10 w-10 animate-pulse rounded-full bg-surface-variant" />
          <div className="h-8 w-8 animate-pulse rounded-full bg-surface-variant" />
        </div>
      </div>

      <div className="flex flex-1">
        {/* Sidebar Skeleton */}
        <aside className="hidden lg:block w-64 border-r border-border-light bg-white dark:bg-surface p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 animate-pulse rounded-lg bg-surface-variant" />
            ))}
          </div>
        </aside>

        {/* Main Content Skeleton */}
        <main className="flex-1 overflow-y-auto bg-white dark:bg-background px-6 py-6 lg:px-10 lg:py-8">
          <div className="mx-auto max-w-[1400px] flex flex-col gap-6">
            {/* Section Chips Skeleton */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-9 w-24 flex-shrink-0 animate-pulse rounded-lg bg-surface-variant"
                />
              ))}
            </div>

            {/* Category Filters Skeleton */}
            <div className="flex flex-wrap items-center gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-7 w-28 animate-pulse rounded-full bg-surface-variant"
                />
              ))}
            </div>

            {/* Banner Skeleton */}
            <div className="h-32 animate-pulse rounded-2xl bg-surface-variant" />

            {/* App Grid Skeleton */}
            <section>
              <div className="mb-5 flex items-center justify-between">
                <div className="h-7 w-48 animate-pulse rounded bg-surface-variant" />
                <div className="h-10 w-10 animate-pulse rounded-full bg-surface-variant" />
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {Array.from({ length: 12 }).map((_, i) => (
                  <AppCardSkeleton key={i} />
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
