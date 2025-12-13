"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Loader2, Send, Smartphone, WifiOff, X, CheckCircle2, RefreshCw, Download, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/contexts/UserContext";
import { DownloadProgress } from "./DownloadProgress";
import type { Device, RemoteInstallTask } from "@/types/remote";

type InstallButtonProps = {
  appId: string;
  appTitle: string;
  onLoginClick?: () => void;
};

type ModalStep = "confirm" | "login" | "devices";

export function InstallButton({ appId, appTitle, onLoginClick }: InstallButtonProps) {
  const { user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<ModalStep>("confirm");
  const [devices, setDevices] = useState<Device[]>([]);
  const [loadingDevices, setLoadingDevices] = useState(false);
  const [sendingDeviceId, setSendingDeviceId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Map<string, RemoteInstallTask>>(new Map());
  const [error, setError] = useState<string | null>(null);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadDevices = useCallback(async () => {
    if (!user) return;

    setLoadingDevices(true);
    setError(null);
    try {
      const res = await fetch(`/api/devices?userId=${user.id}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load devices");
      const data = await res.json();
      setDevices(data.devices ?? []);
    } catch {
      setError("无法获取设备列表");
    } finally {
      setLoadingDevices(false);
    }
  }, [user]);

  const loadTasks = useCallback(async () => {
    try {
      const res = await fetch(`/api/install-requests?appId=${appId}&limit=10`, {
        cache: "no-store",
      });
      if (!res.ok) return;
      const data = await res.json();
      const taskMap = new Map<string, RemoteInstallTask>();
      (data.tasks ?? []).forEach((task: RemoteInstallTask) => {
        if (task.device?.id) {
          taskMap.set(task.device.id, task);
        }
      });
      setTasks(taskMap);
    } catch {
      // 静默失败
    }
  }, [appId]);

  // 打开弹窗时重置状态
  useEffect(() => {
    if (isModalOpen) {
      setModalStep("confirm");
    }
  }, [isModalOpen]);

  // 进入设备选择步骤时加载数据
  useEffect(() => {
    if (isModalOpen && modalStep === "devices") {
      loadDevices();
      loadTasks();
    }
  }, [isModalOpen, modalStep, loadDevices, loadTasks]);

  // 轮询进度更新
  useEffect(() => {
    if (!isModalOpen || modalStep !== "devices") {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
      return;
    }

    // 检查是否有活跃任务
    const hasActiveTasks = Array.from(tasks.values()).some(
      (t) => !["SUCCESS", "FAILED", "CANCELED"].includes(t.status)
    );

    if (hasActiveTasks) {
      pollIntervalRef.current = setInterval(loadTasks, 500);
    } else if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [isModalOpen, modalStep, tasks, loadTasks]);

  const handleSend = async (deviceId: string) => {
    setSendingDeviceId(deviceId);
    setError(null);
    try {
      const res = await fetch("/api/install-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appId, deviceId }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send");
      }

      const data = await res.json();
      if (data.task) {
        setTasks((prev) => {
          const next = new Map(prev);
          next.set(deviceId, data.task);
          return next;
        });
      }

      // 记录下载历史
      if (user) {
        await fetch("/api/downloads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, appId }),
        }).catch(() => {});
      }
    } catch {
      setError("下发失败，请重试");
    } finally {
      setSendingDeviceId(null);
    }
  };

  const getDeviceTask = (deviceId: string) => tasks.get(deviceId);

  const handleConfirm = () => {
    if (!user) {
      setModalStep("login");
    } else {
      setModalStep("devices");
    }
  };

  const handleLoginClick = () => {
    setIsModalOpen(false);
    onLoginClick?.();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="relative inline-flex w-full min-w-[140px] items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-primary/90 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        Install
      </button>

      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 z-50 bg-black/50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed left-1/2 top-1/2 z-50 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-surface"
            >
              {modalStep === "confirm" ? (
                <>
                  {/* Confirm Step Header */}
                  <div className="flex items-center justify-between border-b border-border-light px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Download className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-medium text-ink">确认安装</h2>
                    </div>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="rounded-full p-2 text-ink-secondary transition-colors hover:bg-surface-variant"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Confirm Step Content */}
                  <div className="p-5">
                    <p className="text-center text-ink">
                      确认要安装 <span className="font-medium">{appTitle}</span> 吗？
                    </p>
                    <p className="mt-2 text-center text-sm text-ink-secondary">
                      应用将被发送到您选择的设备上进行安装
                    </p>
                  </div>

                  {/* Confirm Step Footer */}
                  <div className="flex gap-3 border-t border-border-light px-5 py-4">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 rounded-lg py-2.5 text-sm font-medium text-ink-secondary transition-colors hover:bg-surface-variant"
                    >
                      取消
                    </button>
                    <button
                      onClick={handleConfirm}
                      className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90"
                    >
                      确认安装
                    </button>
                  </div>
                </>
              ) : modalStep === "login" ? (
                <>
                  {/* Login Required Step */}
                  <div className="flex items-center justify-between border-b border-border-light px-5 py-4">
                    <div className="flex items-center gap-2">
                      <LogIn className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-medium text-ink">需要登录</h2>
                    </div>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="rounded-full p-2 text-ink-secondary transition-colors hover:bg-surface-variant"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="p-5">
                    <div className="flex flex-col items-center gap-4 py-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <LogIn className="h-8 w-8 text-primary" />
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-ink">请先登录账号</p>
                        <p className="mt-1 text-sm text-ink-secondary">
                          登录后才能将应用发送到您的设备
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 border-t border-border-light px-5 py-4">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 rounded-lg py-2.5 text-sm font-medium text-ink-secondary transition-colors hover:bg-surface-variant"
                    >
                      取消
                    </button>
                    <button
                      onClick={handleLoginClick}
                      className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90"
                    >
                      去登录
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Devices Step Header */}
                  <div className="flex items-center justify-between border-b border-border-light px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-medium text-ink">选择设备</h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          loadDevices();
                          loadTasks();
                        }}
                        className="rounded-full p-2 text-ink-secondary transition-colors hover:bg-surface-variant"
                        title="刷新"
                      >
                        <RefreshCw size={18} />
                      </button>
                      <button
                        onClick={() => setIsModalOpen(false)}
                        className="rounded-full p-2 text-ink-secondary transition-colors hover:bg-surface-variant"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Devices Step Content */}
                  <div className="max-h-[60vh] overflow-y-auto p-5">
                    <p className="mb-4 text-sm text-ink-secondary">
                      将 <span className="font-medium text-ink">{appTitle}</span> 发送到你的设备
                    </p>

                    {error && (
                      <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-500/10">
                        {error}
                      </div>
                    )}

                    {/* Device List */}
                    <div className="space-y-3">
                      {loadingDevices ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                      ) : devices.length === 0 ? (
                        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border-light py-8 text-center">
                          <WifiOff className="h-8 w-8 text-ink-tertiary" />
                          <div>
                            <p className="font-medium text-ink">没有找到已绑定的设备</p>
                            <p className="mt-1 text-sm text-ink-secondary">
                              请在手机 App 中使用同一账号登录
                            </p>
                            <p className="mt-0.5 text-xs text-ink-tertiary">
                              当前账号: {user?.email}
                            </p>
                          </div>
                        </div>
                      ) : (
                        devices.map((device) => {
                          const task = getDeviceTask(device.id);
                          const isSending = sendingDeviceId === device.id;
                          const hasActiveTask =
                            task && !["SUCCESS", "FAILED", "CANCELED"].includes(task.status);
                          const isCompleted = task?.status === "SUCCESS";

                          return (
                            <div key={device.id} className="space-y-2">
                              {/* Device Info */}
                              <div className="flex items-center justify-between rounded-xl border border-border-light bg-surface-variant p-4">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white dark:bg-surface">
                                    <Smartphone className="h-5 w-5 text-primary" />
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium text-ink">
                                        {device.name}
                                      </span>
                                      <span
                                        className={`h-2 w-2 rounded-full ${
                                          device.isOnline ? "bg-green-500" : "bg-amber-500"
                                        }`}
                                      />
                                    </div>
                                    <p className="text-xs text-ink-secondary">
                                      {device.platform} · {device.osVersion ?? "Unknown OS"}
                                    </p>
                                  </div>
                                </div>

                                {isCompleted ? (
                                  <div className="flex items-center gap-1.5 text-sm font-medium text-green-600">
                                    <CheckCircle2 size={18} />
                                    已完成
                                  </div>
                                ) : hasActiveTask ? (
                                  <div className="flex items-center gap-1.5 text-sm font-medium text-blue-600">
                                    <Loader2 size={16} className="animate-spin" />
                                    {task.progress}%
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => handleSend(device.id)}
                                    disabled={isSending}
                                    className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
                                  >
                                    {isSending ? (
                                      <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                      <Send size={16} />
                                    )}
                                    发送
                                  </button>
                                )}
                              </div>

                              {/* Progress Display */}
                              {task && !isCompleted && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <DownloadProgress
                                    status={task.status}
                                    progress={task.progress}
                                    fileSize={task.fileSize}
                                    downloadSpeed={task.downloadSpeed}
                                    message={task.message}
                                    deviceName={device.name}
                                  />
                                </motion.div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Devices Step Footer */}
                  <div className="border-t border-border-light px-5 py-3">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="w-full rounded-lg py-2.5 text-sm font-medium text-ink-secondary transition-colors hover:bg-surface-variant"
                    >
                      关闭
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
