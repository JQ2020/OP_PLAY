import { AdminLayout } from "@/components/AdminLayout";
import { AppsTable } from "@/components/AppsTable";
import { prisma } from "@/lib/prisma";

export default async function AdminAppsPage() {
  const apps = await prisma.app.findMany({
    orderBy: { updatedAt: "desc" },
  });

  const categories = Array.from(
    new Set(apps.map((app) => app.category))
  ).sort();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-ink">Apps Management</h2>
          <p className="mt-1 text-sm text-ink-secondary">
            Manage your app catalog, edit details, and monitor performance.
          </p>
        </div>

        <AppsTable apps={apps} categories={categories} />
      </div>
    </AdminLayout>
  );
}
