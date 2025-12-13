"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, Send, Smartphone, WifiOff, X, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/contexts/UserContext";
import type { Device } from "@/types/remote";

type InstallButtonProps = {
  appId: string;
  appTitle: string;
};

export function InstallButton({ appId, appTitle }: InstallButtonProps) {
  const { user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loadingDevices, setLoadingDevices] = useState(false);
  const [sendingDeviceId, setSendingDeviceId] = useState<string | null>(null);
  const [sentDevices, setSentDevices] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const loadDevices = useCallback(async () => {
    setLoadingDevices(true);
    setError(null);
    try {
      const res = await fetch("/api/devices", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load devices");
      const data = await res.json();
      setDevices(data.devices ?? []);
    } catch {
      setError("无法获取设备列表");
    } finally {
      setLoadingDevices(false);
    }
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      loadDevices();
      setSentDevices(new Set());
    }
  }, [isModalOpen, loadDevices]);

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

      // Record download history
      if (user) {
        await fetch("/api/downloads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, appId }),
        }).catch(() => {});
      }

      setSentDevices((prev) => new Set(prev).add(deviceId));
    } catch {
      setError("下发失败，请重试");
    } finally {
      setSendingDeviceId(null);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpenModal}
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
              className="fixed left-1/2 top-1/2 z-50 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl dark:bg-surface"
            >
              {/* Header */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-medium text-ink">选择设备</h2>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full p-2 text-ink-secondary transition-colors hover:bg-surface-variant"
                >
                  <X size={20} />
                </button>
              </div>

              <p className="mb-4 text-sm text-ink-secondary">
                将 <span className="font-medium text-ink">{appTitle}</span> 发送到你的设备进行安装
              </p>

              {error && (
                <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-500/10">
                  {error}
                </div>
              )}

              {/* Device List */}
              <div className="max-h-[300px] space-y-3 overflow-y-auto">
                {loadingDevices ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : devices.length === 0 ? (
                  <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border-light py-8 text-center">
                    <WifiOff className="h-8 w-8 text-ink-tertiary" />
                    <div>
                      <p className="font-medium text-ink">没有可用设备</p>
                      <p className="mt-1 text-sm text-ink-secondary">
                        请先在手机 App 中登录并注册设备
                      </p>
                    </div>
                  </div>
                ) : (
                  devices.map((device) => {
                    const isSent = sentDevices.has(device.id);
                    const isSending = sendingDeviceId === device.id;

                    return (
                      <div
                        key={device.id}
                        className="flex items-center justify-between rounded-xl border border-border-light bg-surface-variant p-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white dark:bg-surface">
                            <Smartphone className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-ink">{device.name}</span>
                              <span
                                className={`h-2 w-2 rounded-full ${device.isOnline ? "bg-green-500" : "bg-amber-500"}`}
                              />
                            </div>
                            <p className="text-xs text-ink-secondary">
                              {device.platform} · {device.osVersion ?? "Unknown OS"}
                            </p>
                          </div>
                        </div>

                        {isSent ? (
                          <div className="flex items-center gap-1.5 text-sm font-medium text-green-600">
                            <CheckCircle2 size={18} />
                            已发送
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
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-ink-secondary transition-colors hover:bg-surface-variant"
                >
                  关闭
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
