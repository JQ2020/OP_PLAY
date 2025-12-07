import Image from "next/image";
import { notFound } from "next/navigation";
import { InstallButton } from "@/components/InstallButton";
import { prisma } from "@/lib/prisma";
import { ArrowRight, ShieldCheck, Share2 } from "lucide-react";
import { ScreenshotCarousel } from "@/components/ScreenshotCarousel";
import { ReviewList } from "@/components/ReviewList";
import { RatingSummary } from "@/components/RatingSummary";
import Link from "next/link";
import { StarRating } from "@/components/StarRating";
import { AppActions } from "@/components/AppActions";
import { ExpandableText } from "@/components/ExpandableText";

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
    },
  });

  if (!app) {
    notFound();
  }

  const reviewCount = await prisma.review.count({ where: { appId: id } });

  const similarApps = await prisma.app.findMany({
    where: {
      category: app.category,
      id: { not: app.id },
    },
    take: 6,
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Header (Sticky) could go here */}
      
      <main className="mx-auto max-w-[1100px] pb-20">
        {/* Header Section */}
        <div className="flex flex-col gap-6 px-6 py-8 md:flex-row md:items-start md:gap-12">
          {/* Icon */}
          <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl shadow-sm sm:h-36 sm:w-36 md:rounded-3xl">
            <Image
              src={app.iconUrl}
              alt={`${app.title} icon`}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Title & Info */}
          <div className="flex flex-1 flex-col gap-1">
            <h1 className="text-3xl font-medium text-[#202124] sm:text-4xl lg:text-5xl tracking-tight">
              {app.title}
            </h1>
            <Link
              href={`/?q=${encodeURIComponent(app.developer)}`}
              className="text-green-700 font-medium hover:underline text-base"
            >
              {app.developer}
            </Link>
            
            {/* Badges/Stats for Desktop */}
            <div className="mt-4 hidden items-center gap-6 md:flex">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1 font-medium">
                  <span>{app.rating.toFixed(1)}</span>
                  <StarRating rating={app.rating} size={14} className="!gap-0" />
                </div>
                <span className="text-xs text-gray-500">{reviewCount} reviews</span>
              </div>
              <div className="h-8 w-[1px] bg-gray-300"></div>
              <div className="flex flex-col gap-0.5">
                <span className="font-medium">{app.downloads}</span>
                <span className="text-xs text-gray-500">Downloads</span>
              </div>
              <div className="h-8 w-[1px] bg-gray-300"></div>
              <div className="flex flex-col gap-0.5">
                <span className="font-medium text-xs bg-gray-100 px-1 py-0.5 rounded">E</span>
                <span className="text-xs text-gray-500">Everyone</span>
              </div>
            </div>

            {/* Install Button Area */}
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="w-full sm:w-auto min-w-[200px]">
                <InstallButton appId={app.id} isInstalled={app.isInstalled} />
              </div>
              <AppActions appTitle={app.title} developer={app.developer} />
            </div>
          </div>
        </div>

        {/* Mobile Stats (Scrollable) */}
        <div className="flex items-center gap-8 overflow-x-auto px-6 pb-6 scrollbar-hide md:hidden">
          <div className="flex flex-col items-center gap-1 min-w-[60px]">
            <span className="flex items-center gap-1 font-medium text-sm">
              {app.rating.toFixed(1)} <StarRating rating={app.rating} size={12} className="!gap-0" />
            </span>
            <span className="text-[10px] text-gray-500">{reviewCount} reviews</span>
          </div>
          <div className="h-6 w-[1px] bg-gray-200 flex-shrink-0"></div>
          <div className="flex flex-col items-center gap-1 min-w-[60px]">
             <span className="font-medium text-sm">{app.downloads}</span>
             <span className="text-[10px] text-gray-500">Downloads</span>
          </div>
           <div className="h-6 w-[1px] bg-gray-200 flex-shrink-0"></div>
          <div className="flex flex-col items-center gap-1 min-w-[60px]">
             <span className="font-medium text-sm bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">E</span>
             <span className="text-[10px] text-gray-500">Everyone</span>
          </div>
        </div>

        {/* Screenshots */}
        <section className="px-6 py-4" id="screenshots">
          <ScreenshotCarousel screenshots={app.screenshots} title={app.title} />
        </section>

        {/* About this app */}
        <section className="px-6 py-4" id="about">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-medium text-[#202124]">About this app</h2>
            <Link
              href={`/?category=${encodeURIComponent(app.category)}`}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowRight size={20} className="text-gray-500" />
            </Link>
          </div>
          <ExpandableText text={app.description} />
          
          <div className="mt-6 flex flex-wrap gap-3">
             <div className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600">
               Category: {app.category}
             </div>
             <div className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600">
               Version: {app.version}
             </div>
             <div className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600">
               Size: {app.size}
             </div>
          </div>
        </section>

        {/* Data Safety */}
        <section className="px-6 py-4" id="data-safety">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-medium text-[#202124]">Data safety</h2>
            <Link
              href="https://support.google.com/googleplay/answer/10892069"
              target="_blank"
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowRight size={20} className="text-gray-500" />
            </Link>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Safety starts with understanding how developers collect and share your data. Data privacy and security practices may vary based on your use, region, and age. The developer provided this information and may update it over time.
          </p>
          
          <div className="rounded-xl border border-gray-200 p-4 flex flex-col gap-3">
             <div className="flex items-start gap-3">
                <Share2 className="w-5 h-5 text-gray-500 mt-0.5" />
                <div className="text-sm">
                   <div className="font-medium text-gray-900">No data shared with third parties</div>
                   <div className="text-gray-500 text-xs mt-0.5">The developer says this app doesn&apos;t share data with other companies or organizations.</div>
                </div>
             </div>
             <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-gray-500 mt-0.5" />
                <div className="text-sm">
                   <div className="font-medium text-gray-900">Data is encrypted in transit</div>
                </div>
             </div>
          </div>
        </section>

        {/* Ratings & Reviews */}
        <section className="px-6 py-6" id="reviews">
           <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-[#202124]">Ratings and reviews</h2>
            <Link
              href={`/?section=top-charts&category=${encodeURIComponent(app.category)}`}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowRight size={20} className="text-gray-500" />
            </Link>
          </div>
          
          <div className="mb-8">
            <RatingSummary rating={app.rating} totalReviews={reviewCount} />
          </div>

          <ReviewList reviews={app.reviews} />
          
          <div className="mt-6">
            <Link
              href={`/app/${app.id}?reviews=all#reviews`}
              className="text-green-700 text-sm font-medium hover:underline"
            >
              See all reviews
            </Link>
          </div>
        </section>

        {/* Similar Apps */}
        {similarApps.length > 0 && (
          <section className="px-6 py-6 border-t border-gray-100">
             <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-[#202124]">Similar apps</h2>
              <Link
                href={`/?section=top-charts&category=${encodeURIComponent(app.category)}`}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ArrowRight size={20} className="text-gray-500" />
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {similarApps.map(similar => (
                <Link key={similar.id} href={`/app/${similar.id}`} className="flex flex-col gap-2 w-28 flex-shrink-0">
                  <div className="relative h-28 w-28 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                    <Image src={similar.iconUrl} alt={similar.title} fill className="object-cover" />
                  </div>
                  <span className="text-xs font-medium text-gray-800 line-clamp-2">{similar.title}</span>
                  <div className="flex items-center gap-1">
                     <span className="text-xs text-gray-500">{similar.rating.toFixed(1)}</span>
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
