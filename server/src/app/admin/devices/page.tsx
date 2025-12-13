import { AdminLayout } from "@/components/AdminLayout";
import { prisma } from "@/lib/prisma";
import {
  Smartphone,
  Circle,
  MoreVertical,
  Clock,
  Cpu,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default async function AdminDevicesPage() {
  const devices = await prisma.device.findMany({
    orderBy: { lastSeen: "desc" },
    include: {
      _count: {
        select: { installTasks: true },
      },
    },
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-ink">Device Management</h2>
            <p className="mt-1 text-sm text-ink-secondary">
              Monitor connected devices and their installation activity.
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Circle className="h-3 w-3 fill-green-500 text-green-500" />
              <span className="text-ink-secondary">
                {devices.filter((d) => d.isOnline).length} Online
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Circle className="h-3 w-3 fill-gray-400 text-gray-400" />
              <span className="text-ink-secondary">
                {devices.filter((d) => !d.isOnline).length} Offline
              </span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-surface p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-ink-secondary">
                  Total Devices
                </p>
                <p className="mt-2 text-3xl font-semibold text-ink">
                  {devices.length}
                </p>
              </div>
              <div className="rounded-lg bg-blue-500/10 p-3">
                <Smartphone className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-ink-secondary">
                  Active Now
                </p>
                <p className="mt-2 text-3xl font-semibold text-ink">
                  {devices.filter((d) => d.isOnline).length}
                </p>
              </div>
              <div className="rounded-lg bg-green-500/10 p-3">
                <Circle className="h-6 w-6 fill-green-500 text-green-500" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-ink-secondary">
                  Total Installs
                </p>
                <p className="mt-2 text-3xl font-semibold text-ink">
                  {devices.reduce((sum, d) => sum + d._count.installTasks, 0)}
                </p>
              </div>
              <div className="rounded-lg bg-purple-500/10 p-3">
                <Cpu className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Devices Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {devices.map((device) => (
            <div
              key={device.id}
              className="group rounded-xl border border-border bg-surface p-6 transition-all hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`rounded-lg p-3 ${
                      device.isOnline
                        ? "bg-green-500/10"
                        : "bg-gray-500/10"
                    }`}
                  >
                    <Smartphone
                      className={`h-6 w-6 ${
                        device.isOnline
                          ? "text-green-500"
                          : "text-gray-500"
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-ink">{device.name}</h3>
                    <div className="mt-1 flex items-center gap-1.5">
                      <Circle
                        className={`h-2 w-2 ${
                          device.isOnline
                            ? "fill-green-500 text-green-500"
                            : "fill-gray-400 text-gray-400"
                        }`}
                      />
                      <span className="text-xs text-ink-secondary">
                        {device.isOnline ? "Online" : "Offline"}
                      </span>
                    </div>
                  </div>
                </div>

                <button className="rounded-lg p-1 opacity-0 transition-all hover:bg-surface-variant group-hover:opacity-100">
                  <MoreVertical className="h-5 w-5 text-ink-secondary" />
                </button>
              </div>

              <div className="mt-4 space-y-2 border-t border-border-light pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink-secondary">Platform</span>
                  <span className="font-medium text-ink">{device.platform}</span>
                </div>
                {device.osVersion && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-ink-secondary">OS Version</span>
                    <span className="font-medium text-ink">
                      {device.osVersion}
                    </span>
                  </div>
                )}
                {device.appVersion && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-ink-secondary">App Version</span>
                    <span className="font-medium text-ink">
                      {device.appVersion}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink-secondary">Installs</span>
                  <span className="font-medium text-ink">
                    {device._count.installTasks}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-ink-tertiary">
                  <Clock className="h-3 w-3" />
                  <span>
                    Last seen{" "}
                    {formatDistanceToNow(new Date(device.lastSeen), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {devices.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-24 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-surface-variant">
              <Smartphone className="h-10 w-10 text-ink-tertiary" />
            </div>
            <p className="text-lg font-medium text-ink">No devices connected</p>
            <p className="mt-2 max-w-md text-sm text-ink-secondary">
              Devices will appear here once they connect to the system.
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
