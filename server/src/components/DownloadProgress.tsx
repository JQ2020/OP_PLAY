"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Download, Loader2, Package } from "lucide-react";
import type { InstallStatus } from "@/types/remote";

type DownloadProgressProps = {
  status: InstallStatus;
  progress: number;
  fileSize: string;
  downloadSpeed?: string | null;
  message?: string | null;
  deviceName: string;
};

const statusConfig: Record<
  InstallStatus,
  { icon: typeof Download; color: string; bgColor: string }
> = {
  QUEUED: { icon: Loader2, color: "text-amber-600", bgColor: "bg-amber-500" },
  DELIVERED: { icon: Download, color: "text-blue-600", bgColor: "bg-blue-500" },
  DOWNLOADING: { icon: Download, color: "text-blue-600", bgColor: "bg-blue-500" },
  INSTALLING: { icon: Package, color: "text-indigo-600", bgColor: "bg-indigo-500" },
  SUCCESS: { icon: CheckCircle2, color: "text-green-600", bgColor: "bg-green-500" },
  FAILED: { icon: Loader2, color: "text-red-600", bgColor: "bg-red-500" },
  CANCELED: { icon: Loader2, color: "text-gray-600", bgColor: "bg-gray-500" },
};

export function DownloadProgress({
  status,
  progress,
  fileSize,
  downloadSpeed,
  message,
  deviceName,
}: DownloadProgressProps) {
  const config = statusConfig[status];
  const Icon = config.icon;
  const isAnimating = ["QUEUED", "DOWNLOADING", "INSTALLING"].includes(status);
  const showProgress = ["DOWNLOADING", "INSTALLING", "SUCCESS"].includes(status);

  return (
    <div className="rounded-xl border border-border-light bg-white p-4 dark:bg-surface">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div
            animate={isAnimating ? { rotate: status === "QUEUED" ? 360 : 0 } : {}}
            transition={
              status === "QUEUED"
                ? { duration: 1, repeat: Infinity, ease: "linear" }
                : {}
            }
          >
            <Icon size={18} className={config.color} />
          </motion.div>
          <span className="text-sm font-medium text-ink">{deviceName}</span>
        </div>
        {showProgress && (
          <span className="text-sm font-medium text-ink">{progress}%</span>
        )}
      </div>

      {/* Progress Bar */}
      {showProgress && (
        <div className="mb-2 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
          <motion.div
            className={`h-full ${config.bgColor}`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
      )}

      {/* Status Info */}
      <div className="flex items-center justify-between text-xs text-ink-secondary">
        <span>{message || getStatusText(status)}</span>
        {status === "DOWNLOADING" && downloadSpeed && (
          <span className="font-medium">{downloadSpeed}</span>
        )}
      </div>
    </div>
  );
}

function getStatusText(status: InstallStatus): string {
  const texts: Record<InstallStatus, string> = {
    QUEUED: "等待下载...",
    DELIVERED: "已下发到设备",
    DOWNLOADING: "正在下载...",
    INSTALLING: "正在安装...",
    SUCCESS: "安装完成",
    FAILED: "安装失败",
    CANCELED: "已取消",
  };
  return texts[status];
}
