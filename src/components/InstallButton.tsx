"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { markAppInstalled } from "@/app/actions";

type InstallButtonProps = {
  appId: string;
  isInstalled?: boolean;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function InstallButton({ appId, isInstalled = false }: InstallButtonProps) {
  const [status, setStatus] = useState<"idle" | "pending" | "installed">(
    isInstalled ? "installed" : "idle",
  );
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (status === "installed") return;

    setStatus("pending");
    startTransition(async () => {
      await Promise.allSettled([markAppInstalled(appId), delay(2000)]);
      setStatus("installed");
    });
  };

  const isLoading = status === "pending" || isPending;

  const base =
    "inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 border";

  const variants: Record<typeof status, string> = {
    idle: "bg-primary text-white border-transparent shadow-card hover:bg-primary/90 focus-visible:outline-primary",
    pending:
      "bg-primary text-white border-transparent shadow-card hover:bg-primary/90 focus-visible:outline-primary",
    installed:
      "bg-transparent text-primary border border-primary hover:bg-primary/5 focus-visible:outline-primary",
  };

  const label = status === "installed" ? "Open" : status === "pending" ? "Pending..." : "Install";

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${base} ${variants[status]}`}
      disabled={isLoading}
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      {label}
    </button>
  );
}
