"use client";

import { useState, useTransition } from "react";
import { Loader2, Check } from "lucide-react";
import { markAppInstalled } from "@/app/actions";
import { motion, AnimatePresence } from "framer-motion";

type InstallButtonProps = {
  appId: string;
  isInstalled?: boolean;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function InstallButton({ appId, isInstalled = false }: InstallButtonProps) {
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "installed">(
    isInstalled ? "installed" : "idle",
  );
  const [isPending, startTransition] = useTransition();
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (status === "installed") return;

    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rippleId = Date.now();
    setRipples(prev => [...prev, { x, y, id: rippleId }]);

    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== rippleId));
    }, 600);

    setStatus("pending");
    startTransition(async () => {
      await Promise.allSettled([markAppInstalled(appId), delay(2000)]);
      setStatus("success");
      await delay(800);
      setStatus("installed");
    });
  };

  const isLoading = status === "pending" || isPending;

  const base =
    "relative inline-flex w-full min-w-[140px] items-center justify-center gap-2 rounded-lg px-6 py-2.5 text-sm font-medium transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 overflow-hidden";

  const variants: Record<typeof status, string> = {
    idle: "bg-primary text-white shadow-sm hover:shadow-md hover:bg-primary/90 focus-visible:outline-primary",
    pending:
      "bg-primary text-white shadow-sm hover:shadow-md hover:bg-primary/90 focus-visible:outline-primary",
    success:
      "bg-green-600 text-white shadow-md focus-visible:outline-green-600",
    installed:
      "border border-border-light bg-surface-variant text-ink hover:bg-border-light focus-visible:outline-ink",
  };

  const label = status === "installed"
    ? "Open"
    : status === "success"
    ? "Installed"
    : status === "pending"
    ? "Installing..."
    : "Install";

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${base} ${variants[status]}`}
      disabled={isLoading || status === "success"}
    >
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 animate-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 10,
            height: 10,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}

      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="loading"
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            exit={{ scale: 0, rotate: 360 }}
            transition={{ duration: 0.3 }}
          >
            <Loader2 className="h-4 w-4 animate-spin" />
          </motion.div>
        )}
        {status === "success" && (
          <motion.div
            key="success"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.5, times: [0, 0.6, 1] }}
          >
            <Check className="h-4 w-4" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.span
        key={label}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {label}
      </motion.span>
    </button>
  );
}
