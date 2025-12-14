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
  { key: "for-kids", label: "For kids", description: "Safe picks first" },
  { key: "top", label: "Top charts", description: "By ratings" },
  { key: "learning", label: "Learning", description: "Education focus" },
  { key: "recent", label: "New", description: "Fresh uploads" },
];

export default async function KidsPage({ searchParams }: Props) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  const view =
    typeof params.view === "string" && viewChips.some((v) => v.key === params.view)
      ? params.view
      : "for-kids";

  const apps = await prisma.app.findMany({
    where: { OR: [{ category: "Kids" }, { category: "Education" }] },
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
    if (view === "learning")
      return searched.filter(
        (app) =>
          app.category === "Education" ||
          app.title.toLowerCase().includes("learn") ||
          app.description.toLowerCase().includes("learn"),
      );
    return [...searched].sort((a, b) => {
      const byCategory = Number(b.category === "Kids") - Number(a.category === "Kids");
      if (byCategory !== 0) return byCategory;
      return parseDownloads(b.downloads) - parseDownloads(a.downloads);
    });
  })();

  const buildHref = (nextView: string) => {
    const params = new URLSearchParams();
    if (nextView !== "for-kids") params.set("view", nextView);
    if (q) params.set("q", q);
    const query = params.toString();
    return query ? `/kids?${query}` : "/kids";
  };

  return (
    <main className="flex min-h-screen bg-white dark:bg-background transition-colors">
      <Sidebar activeKey="kids" />

      <section className="flex flex-1 flex-col gap-6 px-6 py-6 lg:px-10 lg:py-8">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-3xl font-normal text-ink">Kids</h1>
            <form
              className="flex w-full items-center gap-3 rounded-lg border border-border-light bg-surface-variant px-5 py-2.5 text-sm sm:w-96"
              action="/kids"
            >
              <Search className="h-5 w-5 text-ink-secondary" />
              <input
                type="text"
                placeholder="Search for kids apps"
                className="w-full bg-transparent text-ink outline-none placeholder:text-ink-secondary"
                name="q"
                defaultValue={q}
              />
              {view !== "for-kids" && <input type="hidden" name="view" value={view} />}
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
                href="/kids"
                className="rounded-lg border border-border bg-white dark:bg-surface px-5 py-2 text-sm font-medium text-ink-secondary hover:bg-surface-variant"
              >
                Clear
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-ink-secondary">
          <span>
            {sorted.length} app{sorted.length === 1 ? "" : "s"}
            {view !== "for-kids" && ` · ${viewChips.find((c) => c.key === view)?.description}`}
            {q && ` · search: "${q}"`}
          </span>
          <Link
            href="/?section=top-charts&category=Kids"
            className="text-primary hover:underline"
          >
            See Play picks
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-4 gap-x-2 gap-y-4 md:gap-x-4 md:gap-y-6 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {sorted.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
