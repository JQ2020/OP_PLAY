import { AppCard } from "@/components/AppCard";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { prisma } from "@/lib/prisma";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Home({ searchParams }: Props) {
  const { q } = await searchParams;
  const searchTerm = typeof q === "string" ? q : undefined;

  const apps = await prisma.app.findMany({
    where: searchTerm
      ? {
          OR: [
            { title: { contains: searchTerm } },
            { developer: { contains: searchTerm } },
          ],
        }
      : undefined,
    orderBy: { title: "asc" },
  });

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <div className="flex flex-1">
        <Sidebar activeKey="apps" />
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-8">
            
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {["For you", "Top charts", "Kids", "Categories", "Editors' Choice"].map(
                (chip, i) => (
                  <button
                    key={chip}
                    className={`whitespace-nowrap rounded-lg border px-4 py-1.5 text-sm font-medium transition-colors ${
                      i === 0
                        ? "border-[#01875f] bg-[#e8f0fe] text-[#01875f]"
                        : "border-[#dadce0] bg-white text-[#5f6368] hover:bg-gray-50"
                    }`}
                  >
                    {chip}
                  </button>
                ),
              )}
            </div>

            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-medium text-[#202124]">
                  {searchTerm ? `Results for "${searchTerm}"` : "Recommended for you"}
                </h2>
                {!searchTerm && (
                  <button className="text-sm font-medium text-[#01875f] hover:bg-[#f1f3f4] px-4 py-2 rounded-full transition-colors">
                    See all
                  </button>
                )}
              </div>
              
              {apps.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {apps.map((app) => (
                    <AppCard key={app.id} app={app} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-[#5f6368]">
                  <p className="text-lg">No results found.</p>
                  <p className="text-sm">Try adjusting your search terms.</p>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
