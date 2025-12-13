import Image from "next/image";
import { notFound } from "next/navigation";
import { InstallButton } from "@/components/InstallButton";
import { prisma } from "@/lib/prisma";
import { ArrowRight, ShieldCheck, Share2 } from "lucide-react";
import { ScreenshotCarousel } from "@/components/ScreenshotCarousel";
import { ReviewSection } from "@/components/ReviewSection";
import Link from "next/link";
import { StarRating } from "@/components/StarRating";
import { AppActions } from "@/components/AppActions";
import { ExpandableText } from "@/components/ExpandableText";
import { RemoteInstallPanel } from "@/components/RemoteInstallPanel";

type AppPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function AppPage({ params, searchParams }: AppPageProps) {
  const { id } = await params;
  const query = await searchParams;
  const showAllReviews = query.reviews === "all";

  const app = await prisma.app.findUnique({
    where: { id },
    include: {
      screenshots: true,
      reviews: {
        orderBy: { createdAt: "desc" },
        take: showAllReviews ? 12 : 3,
      },
      _count: {
        select: { reviews: true }
      }
    },
  });

  if (!app) {
    notFound();
  }

  const reviewCount = app._count.reviews;

  const similarApps = await prisma.app.findMany({
    where: {
      category: app.category,
      id: { not: app.id },
    },
    take: 6,
  });

  return (
    <div className="min-h-screen bg-white dark:bg-background transition-colors">
      <main className="mx-auto max-w-[1200px] pb-24">
        {/* Header Section */}
        <div className="flex flex-col gap-6 border-b border-border-light px-4 py-6 md:px-6 md:py-8 md:flex-row md:items-start md:gap-8">
          {/* Icon */}
          <div className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-3xl border border-border-light shadow-sm">
            <Image
              src={app.iconUrl}
              alt={`${app.title} icon`}
              fill
              className="object-cover"
              priority
              unoptimized
            />
          </div>

          {/* Title & Info */}
          <div className="flex flex-1 flex-col gap-2">
            <h1 className="text-3xl font-normal tracking-tight text-ink">
              {app.title}
            </h1>
            <Link
              href={`/?q=${encodeURIComponent(app.developer)}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              {app.developer}
            </Link>

            {/* Badges/Stats for Desktop */}
            <div className="mt-2 hidden items-center gap-8 md:flex">
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1 text-sm font-normal text-ink">
                  {app.rating.toFixed(1)}
                  <StarRating rating={app.rating} size={14} className="!gap-0" />
                </div>
                <span className="text-xs text-ink-secondary">{reviewCount.toLocaleString()} reviews</span>
              </div>
              <div className="h-10 w-[1px] bg-divider"></div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-sm font-normal text-ink">{app.downloads}</span>
                <span className="text-xs text-ink-secondary">Downloads</span>
              </div>
              <div className="h-10 w-[1px] bg-divider"></div>
              <div className="flex flex-col items-center gap-1">
                <div className="flex h-6 w-6 items-center justify-center rounded border border-border bg-surface-variant text-xs font-medium text-ink">
                  E
                </div>
                <span className="text-xs text-ink-secondary">Rated for 3+</span>
              </div>
            </div>

            {/* Install Button Area */}
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <InstallButton appId={app.id} isInstalled={app.isInstalled} />
              <AppActions appId={app.id} appTitle={app.title} developer={app.developer} />
            </div>
          </div>
        </div>

        {/* Mobile Stats (Scrollable) */}
        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto border-b border-border-light px-4 py-4 scrollbar-hide md:hidden">
          <div className="flex min-w-[70px] flex-col items-center gap-1">
            <div className="flex items-center gap-1 text-sm font-normal text-ink">
              {app.rating.toFixed(1)} <StarRating rating={app.rating} size={12} className="!gap-0" />
            </div>
            <span className="text-xs text-ink-secondary">{reviewCount} reviews</span>
          </div>
          <div className="h-8 w-[1px] flex-shrink-0 bg-divider"></div>
          <div className="flex min-w-[70px] flex-col items-center gap-1">
            <span className="text-sm font-normal text-ink">{app.downloads}</span>
            <span className="text-xs text-ink-secondary">Downloads</span>
          </div>
          <div className="h-8 w-[1px] flex-shrink-0 bg-divider"></div>
          <div className="flex min-w-[70px] flex-col items-center gap-1">
            <div className="flex h-6 w-6 items-center justify-center rounded border border-border bg-surface-variant text-xs font-medium text-ink">
              E
            </div>
            <span className="text-xs text-ink-secondary">Rated for 3+</span>
          </div>
        </div>

        {/* Remote install */}
        <section className="border-b border-border-light px-4 py-6 md:px-6" id="remote">
          <RemoteInstallPanel appId={app.id} appTitle={app.title} />
        </section>

        {/* Screenshots */}
        <section className="py-4" id="screenshots">
          <ScreenshotCarousel screenshots={app.screenshots} title={app.title} />
        </section>

        {/* About this app */}
        <section className="border-b border-border-light px-4 py-6 md:px-6" id="about">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-normal text-ink">About this app</h2>
            <Link
              href={`/?category=${encodeURIComponent(app.category)}`}
              className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-surface-variant"
            >
              <ArrowRight size={20} className="text-ink-secondary" />
            </Link>
          </div>
          <ExpandableText text={app.description} />

          <div className="mt-6 flex flex-wrap gap-2">
            <div className="rounded-lg border border-border-light bg-surface-variant px-3 py-1.5 text-xs text-ink-secondary">
              <span className="font-medium">Category:</span> {app.category}
            </div>
            <div className="rounded-lg border border-border-light bg-surface-variant px-3 py-1.5 text-xs text-ink-secondary">
              <span className="font-medium">Version:</span> {app.version}
            </div>
            <div className="rounded-lg border border-border-light bg-surface-variant px-3 py-1.5 text-xs text-ink-secondary">
              <span className="font-medium">Size:</span> {app.size}
            </div>
          </div>
        </section>

        {/* Data Safety */}
        <section className="border-b border-border-light px-4 py-6 md:px-6" id="data-safety">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-normal text-ink">Data safety</h2>
            <Link
              href="https://support.google.com/googleplay/answer/10892069"
              target="_blank"
              className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-surface-variant"
            >
              <ArrowRight size={20} className="text-ink-secondary" />
            </Link>
          </div>
          <p className="mb-4 text-sm text-ink-secondary">
            Safety starts with understanding how developers collect and share your data. Data privacy and security practices may vary based on your use, region, and age. The developer provided this information and may update it over time.
          </p>

          <div className="flex flex-col gap-4 rounded-xl border border-border-light bg-surface-variant p-5">
            <div className="flex items-start gap-4">
              <Share2 className="mt-0.5 h-5 w-5 text-ink-secondary" />
              <div className="text-sm">
                <div className="font-medium text-ink">No data shared with third parties</div>
                <div className="mt-1 text-xs text-ink-secondary">
                  The developer says this app doesn&apos;t share data with other companies or organizations.
                </div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <ShieldCheck className="mt-0.5 h-5 w-5 text-ink-secondary" />
              <div className="text-sm">
                <div className="font-medium text-ink">Data is encrypted in transit</div>
              </div>
            </div>
          </div>
        </section>

        {/* Ratings & Reviews */}
        <ReviewSection
          appId={app.id}
          appTitle={app.title}
          appCategory={app.category}
          reviews={app.reviews}
          rating={app.rating}
          totalReviews={reviewCount}
          showAllReviews={showAllReviews}
        />

        {/* Similar Apps */}
        {similarApps.length > 0 && (
          <section className="px-4 py-6 md:px-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-normal text-ink">Similar apps</h2>
              <Link
                href={`/?section=top-charts&category=${encodeURIComponent(app.category)}`}
                className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-surface-variant"
              >
                <ArrowRight size={20} className="text-ink-secondary" />
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {similarApps.map((similar) => (
                <Link
                  key={similar.id}
                  href={`/app/${similar.id}`}
                  className="flex w-28 flex-shrink-0 flex-col gap-2"
                >
                  <div className="relative h-28 w-28 overflow-hidden rounded-3xl border border-border-light shadow-sm">
                    <Image src={similar.iconUrl} alt={similar.title} fill className="object-cover" unoptimized />
                  </div>
                  <span className="line-clamp-2 text-xs font-normal text-ink">{similar.title}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-ink-secondary">{similar.rating.toFixed(1)}</span>
                    <StarRating rating={1} size={10} className="!gap-0" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </main>
    </div>
  );
}
