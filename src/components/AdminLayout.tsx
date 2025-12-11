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
} from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { key: "dashboard", label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { key: "apps", label: "Apps", href: "/admin/apps", icon: AppWindow },
  { key: "devices", label: "Devices", href: "/admin/devices", icon: Smartphone },
  { key: "tasks", label: "Install Tasks", href: "/admin/tasks", icon: Download },
  { key: "settings", label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
              <svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
                <rect x="0" y="0" width="512" height="512" rx="100" fill="#1DB954"/>
                <circle cx="130" cy="150" r="40" fill="#FFFFFF"/>
                <circle cx="382" cy="150" r="40" fill="#FFFFFF"/>
                <circle cx="130" cy="340" r="40" fill="#FFFFFF"/>
                <circle cx="382" cy="340" r="40" fill="#FFFFFF"/>
                <path d="M 150 300 Q 256 400 362 300" stroke="#FFFFFF" strokeWidth="35" fill="none" strokeLinecap="round"/>
              </svg>
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
              <p className="text-xs text-ink-secondary truncate">admin@oppo.com</p>
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
