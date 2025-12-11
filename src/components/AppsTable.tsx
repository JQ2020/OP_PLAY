"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";

type App = {
  id: string;
  title: string;
  developer: string;
  iconUrl: string;
  rating: number;
  downloads: string;
  category: string;
  isInstalled: boolean;
  size: string;
  version: string;
  updatedAt: Date;
};

type AppsTableProps = {
  apps: App[];
  categories: string[];
};

export function AppsTable({ apps, categories }: AppsTableProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const itemsPerPage = 10;

  const filteredApps = apps.filter((app) => {
    const matchesSearch =
      app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.developer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || app.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredApps.length / itemsPerPage);
  const paginatedApps = filteredApps.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = async (appId: string) => {
    if (!confirm("Are you sure you want to delete this app?")) return;

    try {
      const response = await fetch(`/api/admin/apps/${appId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert("Failed to delete app");
      }
    } catch (error) {
      console.error("Error deleting app:", error);
      alert("Failed to delete app");
    }
  };

  const handleEdit = (app: App) => {
    setSelectedApp(app);
    setIsEditModalOpen(true);
    setDropdownOpen(null);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-secondary" />
          <input
            type="text"
            placeholder="Search apps..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-lg border border-border bg-surface py-2.5 pl-10 pr-4 text-sm text-ink outline-none transition-colors focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-secondary" />
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="appearance-none rounded-lg border border-border bg-surface py-2.5 pl-9 pr-10 text-sm text-ink outline-none transition-colors focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-primary-blue px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-primary-blue/90 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add App</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-ink-secondary">
        <span>
          Showing {paginatedApps.length} of {filteredApps.length} apps
        </span>
        {(searchQuery || categoryFilter !== "all") && (
          <button
            onClick={() => {
              setSearchQuery("");
              setCategoryFilter("all");
              setCurrentPage(1);
            }}
            className="flex items-center gap-1 text-primary-blue hover:underline"
          >
            <X className="h-3 w-3" />
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface-variant">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-ink-secondary">
                  App
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-ink-secondary">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-ink-secondary">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-ink-secondary">
                  Downloads
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-ink-secondary">
                  Version
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-ink-secondary">
                  Size
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-ink-secondary">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedApps.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Search className="h-12 w-12 text-ink-tertiary" />
                      <p className="mt-4 text-sm font-medium text-ink">
                        No apps found
                      </p>
                      <p className="mt-1 text-sm text-ink-secondary">
                        Try adjusting your search or filters
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedApps.map((app) => (
                  <tr
                    key={app.id}
                    className="transition-colors hover:bg-surface-variant"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-border-light">
                          <Image
                            src={app.iconUrl}
                            alt={app.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-ink truncate">
                            {app.title}
                          </p>
                          <p className="text-xs text-ink-secondary truncate">
                            {app.developer}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-primary-blue/10 px-2.5 py-0.5 text-xs font-medium text-primary-blue">
                        {app.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium text-ink">
                          {app.rating.toFixed(1)}
                        </span>
                        <span className="text-xs text-amber-500">★</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-ink">{app.downloads}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-ink-secondary">
                        {app.version}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-ink-secondary">
                        {app.size}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="relative inline-block">
                        <button
                          onClick={() =>
                            setDropdownOpen(
                              dropdownOpen === app.id ? null : app.id
                            )
                          }
                          className="rounded-lg p-1 transition-colors hover:bg-surface-variant"
                        >
                          <MoreVertical className="h-5 w-5 text-ink-secondary" />
                        </button>

                        {dropdownOpen === app.id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setDropdownOpen(null)}
                            />
                            <div className="absolute right-0 z-20 mt-1 w-40 rounded-lg border border-border bg-surface py-1 shadow-lg">
                              <button
                                onClick={() => handleEdit(app)}
                                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-ink transition-colors hover:bg-surface-variant"
                              >
                                <Edit className="h-4 w-4" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(app.id)}
                                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-500 transition-colors hover:bg-surface-variant"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-6 py-4">
            <div className="text-sm text-ink-secondary">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded-lg border border-border bg-surface p-2 transition-colors hover:bg-surface-variant disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4 text-ink-secondary" />
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="rounded-lg border border-border bg-surface p-2 transition-colors hover:bg-surface-variant disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4 text-ink-secondary" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <AppModal
          mode="add"
          categories={categories}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => {
            setIsAddModalOpen(false);
            router.refresh();
          }}
        />
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedApp && (
        <AppModal
          mode="edit"
          app={selectedApp}
          categories={categories}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedApp(null);
          }}
          onSuccess={() => {
            setIsEditModalOpen(false);
            setSelectedApp(null);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}

function AppModal({
  mode,
  app,
  categories,
  onClose,
  onSuccess,
}: {
  mode: "add" | "edit";
  app?: App;
  categories: string[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    title: app?.title || "",
    developer: app?.developer || "",
    category: app?.category || categories[0] || "",
    rating: app?.rating || 4.5,
    downloads: app?.downloads || "1M+",
    size: app?.size || "50 MB",
    version: app?.version || "1.0.0",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url =
        mode === "add"
          ? "/api/admin/apps"
          : `/api/admin/apps/${app?.id}`;
      const method = mode === "add" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSuccess();
      } else {
        alert(`Failed to ${mode} app`);
      }
    } catch (error) {
      console.error(`Error ${mode}ing app:`, error);
      alert(`Failed to ${mode} app`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-surface p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-ink">
            {mode === "add" ? "Add New App" : "Edit App"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 transition-colors hover:bg-surface-variant"
          >
            <X className="h-5 w-5 text-ink-secondary" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20"
                placeholder="App name"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">
                Developer *
              </label>
              <input
                type="text"
                required
                value={formData.developer}
                onChange={(e) =>
                  setFormData({ ...formData, developer: e.target.value })
                }
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20"
                placeholder="Developer name"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">
                Category *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">
                Rating
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.rating}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    rating: parseFloat(e.target.value),
                  })
                }
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">
                Downloads
              </label>
              <input
                type="text"
                value={formData.downloads}
                onChange={(e) =>
                  setFormData({ ...formData, downloads: e.target.value })
                }
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20"
                placeholder="1M+"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">
                Size
              </label>
              <input
                type="text"
                value={formData.size}
                onChange={(e) =>
                  setFormData({ ...formData, size: e.target.value })
                }
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20"
                placeholder="50 MB"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">
                Version
              </label>
              <input
                type="text"
                value={formData.version}
                onChange={(e) =>
                  setFormData({ ...formData, version: e.target.value })
                }
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20"
                placeholder="1.0.0"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-surface-variant"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-primary-blue px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-primary-blue/90 disabled:opacity-50"
            >
              {loading ? "Saving..." : mode === "add" ? "Add App" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
