import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const ICON_POOL = [
  "/icons/app1.jpg",
  "/icons/app2.jpg",
  "/icons/app3.jpg",
  "/icons/app4.jpg",
  "/icons/app5.jpg",
  "/icons/app6.jpg",
  "/icons/app7.jpg",
  "/icons/app8.jpg",
  "/icons/app9.jpg",
  "/icons/app10.jpg",
  "/icons/app11.jpg",
  "/icons/app12.jpg",
];

async function createApp(formData: FormData) {
  "use server";

  const title = (formData.get("title") as string)?.trim();
  const developer = (formData.get("developer") as string)?.trim();
  const category = (formData.get("category") as string)?.trim() || "Apps";

  if (!title || !developer) {
    throw new Error("Title and Developer are required");
  }

  const iconIndex =
    (title.length + developer.length + category.length) % ICON_POOL.length;
  const iconUrl = ICON_POOL[iconIndex];

  const description = `${title} by ${developer}. Added via admin console.`;

  const app = await prisma.app.create({
    data: {
      title,
      developer,
      category,
      rating: 4.5,
      downloads: "1M+",
      description,
      iconUrl,
      isInstalled: false,
    },
  });

  revalidatePath("/");
  revalidatePath("/games");
  revalidatePath("/kids");
  revalidatePath(`/app/${app.id}`);
  redirect(`/app/${app.id}`);
}

export default function AdminAddPage() {
  return (
    <main className="min-h-screen bg-surface px-6 py-12 text-ink">
      <div className="mx-auto w-full max-w-2xl rounded-2xl bg-surfaceContainer p-8 shadow-card">
        <h1 className="text-2xl font-semibold">Admin · Add App</h1>
        <p className="mt-2 text-sm text-muted">
          Quick form to insert a new app record into the database.
        </p>

        <form action={createApp} className="mt-6 space-y-5">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-ink">
              Title
            </label>
            <input
              id="title"
              name="title"
              required
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-ink shadow-inner outline-none focus:border-primary"
              placeholder="Enter app title"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="developer" className="text-sm font-medium text-ink">
              Developer
            </label>
            <input
              id="developer"
              name="developer"
              required
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-ink shadow-inner outline-none focus:border-primary"
              placeholder="Enter developer name"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium text-ink">
              Category
            </label>
            <select
              id="category"
              name="category"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-ink shadow-inner outline-none focus:border-primary"
              defaultValue="Apps"
            >
              <option>Apps</option>
              <option>Games</option>
              <option>Kids</option>
              <option>Social</option>
              <option>Productivity</option>
            </select>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-2xl bg-primary px-4 py-3 text-sm font-medium text-white shadow-card transition hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Create &amp; View
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
