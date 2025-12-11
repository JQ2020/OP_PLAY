import { AdminLayout } from "@/components/AdminLayout";
import { prisma } from "@/lib/prisma";
import {
  AppWindow,
  Smartphone,
  Download,
  TrendingUp,
  Users,
  Activity,
} from "lucide-react";

async function getStats() {
  const [
    totalApps,
    totalDevices,
    totalInstallTasks,
    pendingTasks,
    recentApps,
    topApps,
  ] = await Promise.all([
    prisma.app.count(),
    prisma.device.count(),
    prisma.remoteInstallTask.count(),
    prisma.remoteInstallTask.count({
      where: { status: { in: ["QUEUED", "IN_PROGRESS"] } },
    }),
    prisma.app.findMany({
      take: 5,
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        developer: true,
        iconUrl: true,
        rating: true,
        downloads: true,
        updatedAt: true,
      },
    }),
    prisma.app.findMany({
      take: 5,
      orderBy: { rating: "desc" },
      select: {
        id: true,
        title: true,
        developer: true,
        iconUrl: true,
        rating: true,
        downloads: true,
      },
    }),
  ]);

  const onlineDevices = await prisma.device.count({
    where: { isOnline: true },
  });

  const categoryStats = await prisma.app.groupBy({
    by: ["category"],
    _count: { category: true },
  });

  return {
    totalApps,
    totalDevices,
    onlineDevices,
    totalInstallTasks,
    pendingTasks,
    recentApps,
    topApps,
    categoryStats: categoryStats
      .sort((a, b) => b._count.category - a._count.category)
      .slice(0, 5),
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const statCards = [
    {
      title: "Total Apps",
      value: stats.totalApps,
      icon: AppWindow,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      trend: "+12%",
    },
    {
      title: "Devices",
      value: stats.totalDevices,
      subtitle: `${stats.onlineDevices} online`,
      icon: Smartphone,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      trend: "+5%",
    },
    {
      title: "Install Tasks",
      value: stats.totalInstallTasks,
      subtitle: `${stats.pendingTasks} pending`,
      icon: Download,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      trend: "+23%",
    },
    {
      title: "Avg Rating",
      value: "4.5",
      subtitle: "across all apps",
      icon: TrendingUp,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      trend: "+0.3",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className="rounded-xl border border-border bg-surface p-6 transition-all hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-ink-secondary">
                      {stat.title}
                    </p>
                    <div className="mt-2 flex items-baseline gap-2">
                      <h3 className="text-3xl font-semibold text-ink">
                        {stat.value}
                      </h3>
                      <span className="text-sm font-medium text-green-500">
                        {stat.trend}
                      </span>
                    </div>
                    {stat.subtitle && (
                      <p className="mt-1 text-xs text-ink-tertiary">
                        {stat.subtitle}
                      </p>
                    )}
                  </div>
                  <div className={`rounded-lg ${stat.bgColor} p-3`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Category Distribution */}
          <div className="rounded-xl border border-border bg-surface p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-ink">
                Apps by Category
              </h3>
              <Activity className="h-5 w-5 text-ink-secondary" />
            </div>
            <div className="space-y-3">
              {stats.categoryStats.map((cat, index) => {
                const percentage = (
                  (cat._count.category / stats.totalApps) *
                  100
                ).toFixed(1);
                const colors = [
                  "bg-blue-500",
                  "bg-green-500",
                  "bg-purple-500",
                  "bg-amber-500",
                  "bg-pink-500",
                ];

                return (
                  <div key={cat.category}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="font-medium text-ink">
                        {cat.category}
                      </span>
                      <span className="text-ink-secondary">
                        {cat._count.category} apps ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-surface-variant">
                      <div
                        className={`h-full ${colors[index % colors.length]} transition-all`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-xl border border-border bg-surface p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-ink">
                Recent Activity
              </h3>
              <Users className="h-5 w-5 text-ink-secondary" />
            </div>
            <div className="space-y-4">
              {[
                {
                  action: "New app added",
                  details: stats.recentApps[0]?.title || "App",
                  time: "2 hours ago",
                  color: "bg-blue-500",
                },
                {
                  action: "Device connected",
                  details: "OPPO Find X5 Pro",
                  time: "3 hours ago",
                  color: "bg-green-500",
                },
                {
                  action: "Install completed",
                  details: stats.topApps[0]?.title || "App",
                  time: "5 hours ago",
                  color: "bg-purple-500",
                },
                {
                  action: "App updated",
                  details: stats.recentApps[1]?.title || "App",
                  time: "1 day ago",
                  color: "bg-amber-500",
                },
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div
                    className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${activity.color}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink">
                      {activity.action}
                    </p>
                    <p className="text-xs text-ink-secondary truncate">
                      {activity.details}
                    </p>
                  </div>
                  <span className="text-xs text-ink-tertiary whitespace-nowrap">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tables Row */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Recent Apps */}
          <div className="rounded-xl border border-border bg-surface p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-ink">Recently Added</h3>
              <a
                href="/admin/apps"
                className="text-sm font-medium text-primary-blue hover:underline"
              >
                View all
              </a>
            </div>
            <div className="space-y-3">
              {stats.recentApps.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center gap-3 rounded-lg border border-border-light p-3 transition-all hover:bg-surface-variant"
                >
                  <img
                    src={app.iconUrl}
                    alt={app.title}
                    className="h-12 w-12 rounded-lg border border-border-light object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink truncate">
                      {app.title}
                    </p>
                    <p className="text-xs text-ink-secondary truncate">
                      {app.developer}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-ink">
                        {app.rating}
                      </span>
                      <span className="text-xs text-amber-500">★</span>
                    </div>
                    <p className="text-xs text-ink-tertiary">{app.downloads}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Rated Apps */}
          <div className="rounded-xl border border-border bg-surface p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-ink">Top Rated</h3>
              <a
                href="/admin/apps"
                className="text-sm font-medium text-primary-blue hover:underline"
              >
                View all
              </a>
            </div>
            <div className="space-y-3">
              {stats.topApps.map((app, index) => (
                <div
                  key={app.id}
                  className="flex items-center gap-3 rounded-lg border border-border-light p-3 transition-all hover:bg-surface-variant"
                >
                  <div className="flex h-8 w-8 items-center justify-center text-sm font-semibold text-ink-secondary">
                    {index + 1}
                  </div>
                  <img
                    src={app.iconUrl}
                    alt={app.title}
                    className="h-12 w-12 rounded-lg border border-border-light object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink truncate">
                      {app.title}
                    </p>
                    <p className="text-xs text-ink-secondary truncate">
                      {app.developer}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-ink">
                        {app.rating}
                      </span>
                      <span className="text-xs text-amber-500">★</span>
                    </div>
                    <p className="text-xs text-ink-tertiary">{app.downloads}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
