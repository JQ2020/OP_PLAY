import { AdminLayout } from "@/components/AdminLayout";
import { prisma } from "@/lib/prisma";
import {
  Download,
  Circle,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type TaskStatus = "QUEUED" | "IN_PROGRESS" | "COMPLETED" | "FAILED";

const statusConfig: Record<
  TaskStatus,
  { label: string; color: string; bgColor: string; icon: typeof Circle }
> = {
  QUEUED: {
    label: "Queued",
    color: "text-gray-500",
    bgColor: "bg-gray-500/10",
    icon: Clock,
  },
  IN_PROGRESS: {
    label: "In Progress",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    icon: Loader2,
  },
  COMPLETED: {
    label: "Completed",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    icon: CheckCircle2,
  },
  FAILED: {
    label: "Failed",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    icon: XCircle,
  },
};

export default async function AdminTasksPage() {
  const tasks = await prisma.remoteInstallTask.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      app: {
        select: {
          id: true,
          title: true,
          developer: true,
          iconUrl: true,
        },
      },
      device: {
        select: {
          id: true,
          name: true,
          platform: true,
          isOnline: true,
        },
      },
    },
  });

  const stats = {
    total: tasks.length,
    queued: tasks.filter((t) => t.status === "QUEUED").length,
    inProgress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
    completed: tasks.filter((t) => t.status === "COMPLETED").length,
    failed: tasks.filter((t) => t.status === "FAILED").length,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-ink">Install Tasks</h2>
          <p className="mt-1 text-sm text-ink-secondary">
            Monitor remote installation tasks across all devices.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-5">
          <div className="rounded-xl border border-border bg-surface p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-ink-secondary">Total</p>
                <p className="mt-2 text-2xl font-semibold text-ink">
                  {stats.total}
                </p>
              </div>
              <Download className="h-5 w-5 text-ink-secondary" />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Queued</p>
                <p className="mt-2 text-2xl font-semibold text-gray-700">
                  {stats.queued}
                </p>
              </div>
              <Clock className="h-5 w-5 text-gray-500" />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">In Progress</p>
                <p className="mt-2 text-2xl font-semibold text-blue-700">
                  {stats.inProgress}
                </p>
              </div>
              <Loader2 className="h-5 w-5 text-blue-500" />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Completed</p>
                <p className="mt-2 text-2xl font-semibold text-green-700">
                  {stats.completed}
                </p>
              </div>
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Failed</p>
                <p className="mt-2 text-2xl font-semibold text-red-700">
                  {stats.failed}
                </p>
              </div>
              <XCircle className="h-5 w-5 text-red-500" />
            </div>
          </div>
        </div>

        {/* Tasks Table */}
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-surface-variant">
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-ink-secondary">
                    App
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-ink-secondary">
                    Device
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-ink-secondary">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-ink-secondary">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-ink-secondary">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-ink-secondary">
                    Updated
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {tasks.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Download className="h-12 w-12 text-ink-tertiary" />
                        <p className="mt-4 text-sm font-medium text-ink">
                          No install tasks yet
                        </p>
                        <p className="mt-1 text-sm text-ink-secondary">
                          Tasks will appear here when apps are installed remotely
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  tasks.map((task) => {
                    const config = statusConfig[task.status as TaskStatus] || statusConfig.QUEUED;
                    const StatusIcon = config.icon;

                    return (
                      <tr
                        key={task.id}
                        className="transition-colors hover:bg-surface-variant"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={task.app.iconUrl}
                              alt={task.app.title}
                              className="h-10 w-10 rounded-lg border border-border-light object-cover"
                            />
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-ink truncate">
                                {task.app.title}
                              </p>
                              <p className="text-xs text-ink-secondary truncate">
                                {task.app.developer}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Circle
                              className={`h-2 w-2 ${
                                task.device.isOnline
                                  ? "fill-green-500 text-green-500"
                                  : "fill-gray-400 text-gray-400"
                              }`}
                            />
                            <div>
                              <p className="text-sm font-medium text-ink">
                                {task.device.name}
                              </p>
                              <p className="text-xs text-ink-secondary">
                                {task.device.platform}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full ${config.bgColor} px-2.5 py-1 text-xs font-medium ${config.color}`}
                          >
                            <StatusIcon
                              className={`h-3.5 w-3.5 ${
                                task.status === "IN_PROGRESS" ? "animate-spin" : ""
                              }`}
                            />
                            {config.label}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="w-32">
                            <div className="mb-1 flex items-center justify-between text-xs">
                              <span className="text-ink-secondary">
                                {task.progress}%
                              </span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-variant">
                              <div
                                className={`h-full transition-all ${
                                  task.status === "COMPLETED"
                                    ? "bg-green-500"
                                    : task.status === "FAILED"
                                    ? "bg-red-500"
                                    : task.status === "IN_PROGRESS"
                                    ? "bg-blue-500"
                                    : "bg-gray-400"
                                }`}
                                style={{ width: `${task.progress}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className="text-sm text-ink-secondary">
                            {formatDistanceToNow(new Date(task.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span className="text-sm text-ink-secondary">
                            {formatDistanceToNow(new Date(task.updatedAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
