import { AppCard } from "@/components/AppCard";
import { Sidebar } from "@/components/Sidebar";
import { prisma } from "@/lib/prisma";
import { Search } from "lucide-react";

export default async function KidsPage() {
  const apps = await prisma.app.findMany({
    where: { category: "Kids" },
    orderBy: { title: "asc" },
  });

  return (
    <main className="flex min-h-screen bg-surface text-ink">
      <Sidebar activeKey="kids" />

      <section className="flex flex-1 flex-col gap-6 px-8 py-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-semibold text-ink">Kids</h1>
            <div className="flex w-full items-center gap-3 rounded-full border border-gray-200 bg-white px-4 py-3 text-sm text-muted shadow-sm sm:w-96">
              <Search className="h-4 w-4 text-muted" strokeWidth={0} fill="currentColor" />
              <input
                type="text"
                placeholder="Search for kids apps"
                className="w-full bg-transparent text-ink outline-none placeholder:text-muted"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {["For kids", "Top charts", "Teacher approved", "Categories"].map((chip) => (
              <span
                key={chip}
                className={`rounded-full border border-gray-200 px-4 py-2 text-sm ${
                  chip === "For kids" ? "bg-primary text-white border-primary" : "bg-white text-muted"
                }`}
              >
                {chip}
              </span>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {apps.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
