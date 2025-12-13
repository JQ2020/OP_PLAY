import { AppCard } from "@/components/AppCard";
import { Sidebar } from "@/components/Sidebar";
import { prisma } from "@/lib/prisma";
import { Search } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const parseDownloads = (value: string) => {
  const match = value.match(/([\d.]+)\s*([BMK])/i);
  if (!match) return 0;
  const amount = parseFloat(match[1]);
  const unit = match[2].toUpperCase();
  if (unit === "B") return amount * 1_000_000_000;
  if (unit === "M") return amount * 1_000_000;
  return amount * 1_000;
};

const viewChips = [
  { key: "for-you", label: "For you", description: "Personalized order" },
  { key: "top", label: "Top charts", description: "By ratings" },
  { key: "recent", label: "New & updated", description: "Fresh updates" },
  { key: "installed", label: "Installed", description: "On this device" },
];

export default async function GamesPage({ searchParams }: Props) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  const view =
    typeof params.view === "string" && viewChips.some((v) => v.key === params.view)
      ? params.view
      : "for-you";

  const apps = await prisma.app.findMany({
    where: { category: "Games" },
    orderBy: { title: "asc" },
  });

  const searched = q
    ? apps.filter(
        (app) =>
          app.title.toLowerCase().includes(q.toLowerCase()) ||
          app.developer.toLowerCase().includes(q.toLowerCase()),
      )
    : apps;

  const sorted = (() => {
    if (view === "top") return [...searched].sort((a, b) => b.rating - a.rating);
    if (view === "recent")
      return [...searched].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    return [...searched].sort(
      (a, b) =>
        parseDownloads(b.downloads) - parseDownloads(a.downloads) || b.rating - a.rating,
    );
  })();

  const visible = view === "installed" ? sorted.filter((app) => app.isInstalled) : sorted;

  const buildHref = (nextView: string) => {
    const params = new URLSearchParams();
    if (nextView !== "for-you") params.set("view", nextView);
    if (q) params.set("q", q);
    const query = params.toString();
    return query ? `/games?${query}` : "/games";
  };

  return (
    <main className="flex min-h-screen bg-white dark:bg-background transition-colors">
      <Sidebar activeKey="games" />

      <section className="flex flex-1 flex-col gap-6 px-6 py-6 lg:px-10 lg:py-8">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-3xl font-normal text-ink">Games</h1>
            <form
              className="flex w-full items-center gap-3 rounded-lg border border-border-light bg-surface-variant px-5 py-2.5 text-sm sm:w-96"
              action="/games"
            >
              <Search className="h-5 w-5 text-ink-secondary" />
              <input
                type="text"
                placeholder="Search for games"
                className="w-full bg-transparent text-ink outline-none placeholder:text-ink-secondary"
                name="q"
                defaultValue={q}
              />
              {view !== "for-you" && <input type="hidden" name="view" value={view} />}
            </form>
          </div>
          <div className="flex flex-wrap gap-2">
            {viewChips.map((chip) => (
              <Link
                key={chip.key}
                href={buildHref(chip.key)}
                className={`rounded-lg border px-5 py-2 text-sm font-medium transition-all ${
                  view === chip.key
                    ? "border-primary-blue bg-[#e3f2fd] text-primary-blue dark:bg-primary-blue/20 dark:text-blue-300 shadow-sm"
                    : "border-border bg-white dark:bg-surface text-ink-secondary hover:bg-surface-variant"
                }`}
              >
                {chip.label}
              </Link>
            ))}
            {q && (
              <Link
                href="/games"
                className="rounded-lg border border-border bg-white dark:bg-surface px-5 py-2 text-sm font-medium text-ink-secondary hover:bg-surface-variant"
              >
                Clear
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-ink-secondary">
          <span>
            {visible.length} game{visible.length === 1 ? "" : "s"}
            {view !== "for-you" && ` · ${viewChips.find((c) => c.key === view)?.description}`}
            {q && ` · search: "${q}"`}
          </span>
          <Link
            href="/?section=top-charts&category=Games"
            className="text-primary hover:underline"
          >
            View Play charts
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {visible.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
