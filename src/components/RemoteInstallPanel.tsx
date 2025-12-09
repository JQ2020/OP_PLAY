"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Download,
  Loader2,
  RefreshCw,
  Send,
  Smartphone,
  WifiOff,
} from "lucide-react";
import type { Device, InstallStatus, RemoteInstallTask } from "@/types/remote";
import clsx from "clsx";

type Props = {
  appId: string;
  appTitle: string;
};

const statusCopy: Record<InstallStatus, string> = {
  QUEUED: "Queued",
  DELIVERED: "Delivered",
  DOWNLOADING: "Downloading",
  INSTALLING: "Installing",
  SUCCESS: "Installed",
  FAILED: "Failed",
  CANCELED: "Canceled",
};

const statusTone: Record<InstallStatus, string> = {
  QUEUED: "bg-amber-50 text-amber-700 border-amber-100",
  DELIVERED: "bg-blue-50 text-blue-700 border-blue-100",
  DOWNLOADING: "bg-blue-50 text-blue-700 border-blue-100",
  INSTALLING: "bg-indigo-50 text-indigo-700 border-indigo-100",
  SUCCESS: "bg-emerald-50 text-emerald-700 border-emerald-100",
  FAILED: "bg-rose-50 text-rose-700 border-rose-100",
  CANCELED: "bg-slate-50 text-slate-700 border-slate-200",
};

const formatAgo = (value?: string | null) => {
  if (!value) return "Unknown";
  const ts = new Date(value).getTime();
  if (Number.isNaN(ts)) return "Unknown";
  const diff = Date.now() - ts;
  if (diff < 60_000) return "Just now";
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const uniqueTasks = (tasks: RemoteInstallTask[]) => {
  const seen = new Set<string>();
  return tasks.filter((task) => {
    if (seen.has(task.id)) return false;
    seen.add(task.id);
    return true;
  });
};

export function RemoteInstallPanel({ appId, appTitle }: Props) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [tasks, setTasks] = useState<RemoteInstallTask[]>([]);
  const [loadingDeviceId, setLoadingDeviceId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDevices = useCallback(async () => {
    try {
      const res = await fetch("/api/devices", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load devices");
      const data = await res.json();
      setDevices(data.devices ?? []);
    } catch (err) {
      console.error(err);
      setError("无法获取设备列表，请确认服务器已启动。");
    }
  }, []);

  const loadTasks = useCallback(async () => {
    try {
      const res = await fetch(`/api/install-requests?appId=${appId}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to load tasks");
      const data = await res.json();
      setTasks(data.tasks ?? []);
    } catch (err) {
      console.error(err);
      setError("无法获取安装任务，请稍后重试。");
    }
  }, [appId]);

  const refreshAll = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    await Promise.all([loadDevices(), loadTasks()]);
    setRefreshing(false);
  }, [loadDevices, loadTasks]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  useEffect(() => {
    const interval = setInterval(loadTasks, 8000);
    return () => clearInterval(interval);
  }, [loadTasks]);

  const handleSend = async (deviceId: string) => {
    setLoadingDeviceId(deviceId);
    setError(null);
    try {
      const res = await fetch("/api/install-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appId, deviceId }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send install request");
      }
      if (data.task) {
        setTasks((prev) => uniqueTasks([data.task, ...prev]));
      }
    } catch (err) {
      console.error(err);
      setError("下发指令失败，请检查服务器或网络。");
    } finally {
      setLoadingDeviceId(null);
    }
  };

  const recentTasks = useMemo(
    () => uniqueTasks(tasks).slice(0, 6),
    [tasks],
  );

  return (
    <div className="rounded-2xl border border-border-light bg-surfaceContainer p-5 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-ink">
            <Smartphone className="h-4 w-4 text-primary" />
            发送到你的设备
          </div>
          <p className="mt-1 text-xs text-ink-secondary">
            选择设备，网页会创建一条远程安装任务，手机 App 收到指令后自行下载并安装。
          </p>
        </div>
        <button
          onClick={refreshAll}
          className="inline-flex h-9 items-center gap-2 rounded-full border border-border-light px-3 text-xs font-medium text-ink-secondary transition hover:bg-white"
        >
          {refreshing ? (
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          ) : (
            <RefreshCw className="h-4 w-4 text-ink-secondary" />
          )}
          刷新
        </button>
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-700">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {devices.length === 0 ? (
          <div className="col-span-2 flex items-center gap-3 rounded-xl border border-dashed border-border-light bg-white px-4 py-5 text-sm text-ink-secondary">
            <WifiOff className="h-5 w-5 text-ink-tertiary" />
            还没有注册的设备。请在手机 App 登录同一账号后调用 /api/devices 注册，并保持长连接或推送 token。
          </div>
        ) : (
          devices.map((device) => (
            <div
              key={device.id}
              className="flex items-center justify-between rounded-xl border border-border-light bg-white p-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface">
                  <Smartphone className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-ink">
                      {device.name}
                    </span>
                    <span className="rounded-full bg-surface-variant px-2 py-0.5 text-[11px] font-medium text-ink-secondary">
                      {device.platform}
                    </span>
                    <span
                      className={clsx(
                        "h-2 w-2 rounded-full",
                        device.isOnline ? "bg-emerald-500" : "bg-amber-500",
                      )}
                      aria-label={device.isOnline ? "online" : "offline"}
                    />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-ink-secondary">
                    <span>{device.osVersion ?? "OS ?"}</span>
                    <span>·</span>
                    <span>Last seen {formatAgo(device.lastSeen)}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleSend(device.id)}
                disabled={loadingDeviceId === device.id}
                className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-white shadow-card transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loadingDeviceId === device.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                下发下载
              </button>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 border-t border-border-light pt-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-ink">
          <Download className="h-4 w-4 text-primary" />
          最近的远程安装
        </div>
        {recentTasks.length === 0 ? (
          <div className="flex items-center gap-2 rounded-xl border border-dashed border-border-light px-4 py-4 text-xs text-ink-secondary">
            <Clock className="h-4 w-4 text-ink-tertiary" />
            暂无安装记录，点击上方按钮即可创建一条远程安装任务。
          </div>
        ) : (
          <div className="space-y-3">
            {recentTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between rounded-xl border border-border-light bg-white px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-2xl border border-border-light bg-surface">
                    {task.app?.iconUrl ? (
                      <Image
                        src={task.app.iconUrl}
                        alt={task.app.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-ink-secondary">
                        {task.app?.title?.[0] ?? "A"}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-ink">
                        {task.app?.title ?? appTitle}
                      </span>
                      <span className="text-xs text-ink-secondary">
                        · {task.device?.name ?? task.deviceId}
                      </span>
                    </div>
                    <div className="text-xs text-ink-secondary">
                      {formatAgo(task.updatedAt)} ·{" "}
                      {task.message ?? statusCopy[task.status]}
                    </div>
                  </div>
                </div>
                <div
                  className={clsx(
                    "flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium",
                    statusTone[task.status],
                  )}
                >
                  {task.status === "SUCCESS" ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Clock className="h-4 w-4" />
                  )}
                  <span>
                    {statusCopy[task.status]}
                    {task.progress != null && task.progress > 0
                      ? ` · ${task.progress}%`
                      : ""}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
