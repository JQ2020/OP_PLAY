import { AppCard } from "@/components/AppCard";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { StarRating } from "@/components/StarRating";
import { prisma } from "@/lib/prisma";
import {
  ArrowRight,
  Gamepad2,
  LayoutGrid,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

type SectionKey = "for-you" | "top-charts" | "categories" | "editors";

const sectionChips: { key: SectionKey | "kids"; label: string; href?: string }[] = [
  { key: "for-you", label: "For you", href: "/" },
  { key: "top-charts", label: "Top charts", href: "/?section=top-charts" },
  { key: "kids", label: "Kids", href: "/kids" },
  { key: "categories", label: "Categories", href: "/?section=categories" },
  { key: "editors", label: "Editors' Choice", href: "/?section=editors" },
];

const sortOptions = [
  { key: "downloads", label: "Top free" },
  { key: "rating", label: "Top rated" },
  { key: "recent", label: "New & updated" },
];

const parseDownloads = (value: string) => {
  const match = value.match(/([\d.]+)\s*([BMK])/i);
  if (!match) return 0;
  const amount = parseFloat(match[1]);
  const unit = match[2].toUpperCase();
  if (unit === "B") return amount * 1_000_000_000;
  if (unit === "M") return amount * 1_000_000;
  return amount * 1_000;
};

const sortByDownloads = <T extends { downloads: string; rating: number }>(apps: T[]) =>
  [...apps].sort(
    (a, b) =>
      parseDownloads(b.downloads) - parseDownloads(a.downloads) ||
      b.rating - a.rating,
  );

export default async function Home({ searchParams }: Props) {
  const params = await searchParams;
  const { q, section, category, sort } = params;
  const searchTerm = typeof q === "string" ? q : undefined;
  const activeSection: SectionKey = section === "top-charts" || section === "categories" || section === "editors" ? section : "for-you";
  const categoryFilter = typeof category === "string" ? category : undefined;
  const sortParam = typeof sort === "string" ? sort : "downloads";

  const allApps = await prisma.app.findMany({ orderBy: { title: "asc" } });
  const filteredApps = categoryFilter
    ? allApps.filter((app) => app.category === categoryFilter)
    : allApps;

  const categoryCounts = allApps.reduce<Record<string, number>>((acc, app) => {
    acc[app.category] = (acc[app.category] ?? 0) + 1;
    return acc;
  }, {});

  const buildSectionHref = (key: SectionKey | "kids") => {
    if (key === "kids") return "/kids";
    const params = new URLSearchParams();
    if (key !== "for-you") params.set("section", key);
    if (categoryFilter) params.set("category", categoryFilter);
    if (key === "top-charts" && sortParam) params.set("sort", sortParam);
    const query = params.toString();
    return query ? `/?${query}` : "/";
  };

  const buildSortHref = (sortKey: string) => {
    const params = new URLSearchParams();
    params.set("section", "top-charts");
    params.set("sort", sortKey);
    if (categoryFilter) params.set("category", categoryFilter);
    const query = params.toString();
    return `/?${query}`;
  };

  let content;

  if (searchTerm) {
    const searchLower = searchTerm.toLowerCase();
    const apps = filteredApps.filter(
      (app) =>
        app.title.toLowerCase().includes(searchLower) ||
        app.developer.toLowerCase().includes(searchLower) ||
        app.category.toLowerCase().includes(searchLower),
    );

    content = (
      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-normal text-ink">
              Results for &ldquo;{searchTerm}&rdquo;
              {categoryFilter ? ` · ${categoryFilter}` : ""}
            </h2>
            <p className="mt-1 text-sm text-ink-secondary">
              Showing matches across titles, developers, and categories.
            </p>
          </div>
          {categoryFilter && (
            <Link
              href="/"
              className="rounded-full border border-border px-4 py-1.5 text-xs font-medium text-ink-secondary hover:bg-surface-variant"
            >
              Clear filter
            </Link>
          )}
        </div>
        {apps.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {apps.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-ink-secondary">
            <p className="text-base font-medium">No results found</p>
            <p className="mt-1 text-sm">
              Try adjusting your search terms or clearing filters
            </p>
          </div>
        )}
      </section>
    );
  } else if (activeSection === "top-charts") {
    const topCharts = (() => {
      if (sortParam === "rating") {
        return [...filteredApps].sort((a, b) => b.rating - a.rating);
      }
      if (sortParam === "recent") {
        return [...filteredApps].sort(
          (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime(),
        );
      }
      return sortByDownloads(filteredApps);
    });

    const sortedCharts = topCharts().slice(0, 12);

    content = (
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-normal text-ink">
              Top charts
              {categoryFilter ? ` · ${categoryFilter}` : ""}
            </h2>
            <p className="mt-1 text-sm text-ink-secondary">
              Tap a pill to switch between downloads, ratings, or fresh updates.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {sortOptions.map((option) => (
              <Link
                key={option.key}
                href={buildSortHref(option.key)}
                className={`rounded-lg border px-5 py-2 text-sm font-medium transition-all ${
                  sortParam === option.key
                    ? "border-primary-blue bg-[#e3f2fd] text-primary-blue shadow-sm"
                    : "border-border bg-white text-ink-secondary hover:bg-surface-variant"
                }`}
              >
                {option.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {sortedCharts.map((app, index) => (
            <Link
              key={app.id}
              href={`/app/${app.id}`}
              className="group flex items-center gap-4 rounded-xl border border-border-light bg-white p-4 transition-all hover:shadow-md"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center text-sm font-medium text-ink-secondary">
                {index + 1}
              </div>
              <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-2xl border border-border-light shadow-sm">
                <Image
                  src={app.iconUrl}
                  alt={`${app.title} icon`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col gap-0.5">
                <span className="text-sm font-normal text-ink">
                  {app.title}
                </span>
                <span className="text-xs text-ink-secondary">{app.developer}</span>
                <div className="flex items-center gap-1.5 text-xs text-ink-secondary">
                  <span>{app.rating.toFixed(1)}</span>
                  <StarRating rating={app.rating} size={12} className="!gap-0" />
                  <span className="text-ink-tertiary">· {app.downloads}</span>
                </div>
              </div>
              <ArrowRight size={20} className="text-ink-tertiary" />
            </Link>
          ))}
        </div>
      </section>
    );
  } else if (activeSection === "categories") {
    const categories = Object.entries(categoryCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    content = (
      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-normal text-ink">
              Browse by category
            </h2>
            <p className="mt-1 text-sm text-ink-secondary">
              Jump into a shelf and we'll tailor the feed around it.
            </p>
          </div>
          <Link
            href="/?section=for-you"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-primary hover:bg-surface-variant"
          >
            <Sparkles size={16} />
            Back to picks
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((item) => (
            <Link
              key={item.name}
              href={`/?category=${encodeURIComponent(item.name)}`}
              className="flex items-center gap-4 rounded-xl border border-border-light bg-white p-4 transition-all hover:border-primary-blue hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e3f2fd] text-primary-blue">
                <LayoutGrid size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-ink">
                  {item.name}
                </span>
                <span className="text-xs text-ink-secondary">
                  {item.count} apps
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    );
  } else if (activeSection === "editors") {
    const editorsChoice = filteredApps
      .filter((app) => app.rating >= 4.7 || app.downloads.includes("B"))
      .slice(0, 12);

    content = (
      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-normal text-ink">
              Editors' Choice
            </h2>
            <p className="mt-1 text-sm text-ink-secondary">
              Premium picks with stellar reviews and steady updates.
            </p>
          </div>
          <Link
            href="/?section=top-charts&sort=rating"
            className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-primary hover:bg-surface-variant"
          >
            <TrendingUp size={16} />
            View charts
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {editorsChoice.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      </section>
    );
  } else {
    const recommendedApps = sortByDownloads(filteredApps).slice(0, 6);
    const topRatedApps = [...filteredApps]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6);
    const newApps = [...filteredApps]
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, 6);
    const gamesSpotlight = filteredApps
      .filter((app) => app.category === "Games")
      .slice(0, 6);

    content = (
      <div className="flex flex-col gap-10">
        <section className="rounded-2xl bg-gradient-to-r from-[#e3f2fd] via-white to-[#e8f5e9] p-8 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Sparkles className="h-6 w-6 text-primary" />
              <div>
                <p className="text-sm font-medium text-ink-secondary">
                  Hand picked for you
                </p>
                <h2 className="text-2xl font-normal text-ink">
                  Discover apps you'll actually use
                </h2>
              </div>
            </div>
            <Link
              href="/?section=top-charts"
              className="inline-flex items-center gap-2 rounded-lg border border-primary px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-surface-variant"
            >
              Browse charts
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        <section>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-normal text-ink">
              Recommended for you
              {categoryFilter ? ` · ${categoryFilter}` : ""}
            </h2>
            <Link
              href="/?section=top-charts&sort=downloads"
              className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-surface-variant"
            >
              <ArrowRight size={20} className="text-ink-secondary" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {recommendedApps.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        </section>

        <section>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-normal text-ink">Top rated</h2>
            <Link
              href="/?section=top-charts&sort=rating"
              className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-surface-variant"
            >
              <ArrowRight size={20} className="text-ink-secondary" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {topRatedApps.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        </section>

        <section>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-normal text-ink">New & updated</h2>
            <Link
              href="/?section=top-charts&sort=recent"
              className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-surface-variant"
            >
              <ArrowRight size={20} className="text-ink-secondary" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {newApps.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        </section>

        {gamesSpotlight.length > 0 && (
          <section>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="flex items-center gap-3 text-xl font-normal text-ink">
                <Gamepad2 className="h-6 w-6 text-primary" />
                Games spotlight
              </h2>
              <Link
                href="/games?sort=top"
                className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-surface-variant"
              >
                <ArrowRight size={20} className="text-ink-secondary" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {gamesSpotlight.map((app) => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <div className="flex flex-1">
        <Sidebar activeKey="apps" />
        <main className="flex-1 overflow-y-auto bg-white px-6 py-6 lg:px-10 lg:py-8">
          <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {sectionChips.map((chip) => (
                <Link
                  key={chip.key}
                  href={chip.href ?? buildSectionHref(chip.key)}
                  className={`whitespace-nowrap rounded-lg border px-5 py-2 text-sm font-medium transition-all ${
                    activeSection === chip.key
                      ? "border-primary-blue bg-[#e3f2fd] text-primary-blue shadow-sm"
                      : "border-border bg-white text-ink-secondary hover:bg-surface-variant"
                  }`}
                >
                  {chip.label}
                </Link>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {["Productivity", "Games", "Entertainment", "Health & Fitness", "Education"].map(
                (item) => (
                  <Link
                    key={item}
                    href={`/?category=${encodeURIComponent(item)}`}
                    className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-all ${
                      categoryFilter === item
                        ? "border-primary-blue bg-[#e3f2fd] text-primary-blue"
                        : "border-border-light bg-white text-ink-secondary hover:bg-surface-variant"
                    }`}
                  >
                    {item}
                  </Link>
                ),
              )}
              {categoryFilter && (
                <Link
                  href="/"
                  className="rounded-full border border-border-light px-4 py-1.5 text-xs font-medium text-ink-secondary hover:bg-surface-variant"
                >
                  Clear
                </Link>
              )}
            </div>

            {content}
          </div>
        </main>
      </div>
    </div>
  );
}
