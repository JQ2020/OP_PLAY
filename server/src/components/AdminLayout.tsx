"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  AppWindow,
  Smartphone,
  Download,
  Settings,
  Menu,
  X,
  Users,
  Package,
  Lock,
  KeyRound,
  ShieldAlert,
} from "lucide-react";
import { useState, useEffect } from "react";
import { ThemeToggle } from "./ThemeToggle";
import Image from "next/image";
import { useUser } from "@/contexts/UserContext";

const navItems = [
  { key: "dashboard", label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { key: "apps", label: "Apps", href: "/admin/apps", icon: AppWindow },
  { key: "apk", label: "APK Manager", href: "/admin/apk", icon: Package },
  { key: "users", label: "Users", href: "/admin/users", icon: Users },
  { key: "devices", label: "Devices", href: "/admin/devices", icon: Smartphone },
  { key: "tasks", label: "Install Tasks", href: "/admin/tasks", icon: Download },
  { key: "settings", label: "Settings", href: "/admin/settings", icon: Settings },
];

const ADMIN_PASSWORD = "oppo";
const AUTH_KEY = "op_admin_auth";

function LoginRequiredGate() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-surface border border-border-light p-8 shadow-lg text-center">
        <div className="mb-4 mx-auto rounded-full bg-[#e3f2fd] dark:bg-primary-blue/20 p-4 w-fit">
          <Users className="h-10 w-10 text-primary-blue" />
        </div>
        <h1 className="text-2xl font-bold text-ink mb-2">
          请先登录账号
        </h1>
        <p className="text-ink-secondary text-sm mb-6">
          管理后台仅对已登录用户开放，请先登录您的账号
        </p>
        <a
          href="/"
          className="inline-block w-full rounded-xl bg-primary-blue py-3.5 text-sm font-semibold text-white transition-all hover:bg-primary-blue/90 active:scale-[0.98]"
        >
          去首页登录
        </a>
      </div>
    </div>
  );
}

function PasswordGate({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, "authenticated");
      onSuccess();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setPassword("");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div
        className={`w-full max-w-md rounded-2xl bg-white dark:bg-surface border border-border-light p-8 shadow-lg ${
          shake ? "animate-[shake_0.5s_ease-in-out]" : ""
        }`}
      >
        <div className="flex flex-col items-center text-center mb-8">
          <div className="mb-4 rounded-full bg-[#e3f2fd] dark:bg-primary-blue/20 p-4">
            <ShieldAlert className="h-10 w-10 text-primary-blue" />
          </div>
          <h1 className="text-2xl font-bold text-ink mb-2">
            管理员验证
          </h1>
          <p className="text-ink-secondary text-sm">
            请输入管理密码以访问后台
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-tertiary" />
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="请输入密码..."
              className="w-full rounded-xl bg-surface-variant border border-border pl-12 pr-4 py-3.5 text-ink placeholder:text-ink-tertiary focus:border-primary-blue focus:outline-none focus:ring-2 focus:ring-primary-blue/20"
              autoFocus
            />
          </div>

          {error && (
            <p className="text-center text-sm text-red-500 dark:text-red-400">
              密码错误，请重试
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-primary-blue py-3.5 text-sm font-semibold text-white transition-all hover:bg-primary-blue/90 active:scale-[0.98]"
          >
            <Lock className="inline-block mr-2 h-4 w-4" />
            进入后台
          </button>
        </form>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
          20%, 40%, 60%, 80% { transform: translateX(8px); }
        }
      `}</style>
    </div>
  );
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const { isLoggedIn, isLoading } = useUser();

  useEffect(() => {
    const auth = sessionStorage.getItem(AUTH_KEY);
    setIsAuthenticated(auth === "authenticated");
    setAuthChecked(true);
  }, []);

  if (isLoading || !authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-blue border-t-transparent" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LoginRequiredGate />;
  }

  if (!isAuthenticated) {
    return <PasswordGate onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-surface transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between border-b border-border px-6">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="relative h-8 w-8 flex-shrink-0">
              <Image
                src="/oppo_market_icon.png"
                alt="OP Play"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-lg font-medium text-ink">Admin Console</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5 text-ink-secondary" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href ||
                (item.href !== "/admin" && pathname?.startsWith(item.href));

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary-blue/10 text-primary-blue"
                      : "text-ink-secondary hover:bg-surface-variant hover:text-ink"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 transition-colors ${
                      isActive ? "text-primary-blue" : "text-ink-secondary group-hover:text-ink"
                    }`}
                    strokeWidth={2}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-blue text-white text-sm font-medium">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink truncate">Admin User</p>
              <p className="text-xs text-ink-secondary truncate">admin@op.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-surface px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="h-6 w-6 text-ink-secondary" />
            </button>
            <div className="hidden lg:block">
              <h1 className="text-xl font-semibold text-ink">
                {navItems.find((item) => {
                  if (item.href === "/admin") return pathname === "/admin";
                  return pathname?.startsWith(item.href);
                })?.label || "Dashboard"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/"
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-ink-secondary transition-colors hover:bg-surface-variant"
            >
              View Store
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-background p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
