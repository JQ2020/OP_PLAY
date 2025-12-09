"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppWindow, Baby, Gamepad2 } from "lucide-react";

const navItems = [
  { key: "apps", label: "Apps", href: "/", icon: AppWindow },
  { key: "games", label: "Games", href: "/games", icon: Gamepad2 },
  { key: "kids", label: "Kids", href: "/kids", icon: Baby },
];

export function Sidebar({ activeKey }: { activeKey?: string }) {
  const pathname = usePathname();
  const current = activeKey ?? pathname?.split("/")[1] ?? "apps";

  return (
    <aside className="hidden w-64 flex-col gap-1 overflow-y-auto border-r border-border-light bg-white dark:bg-surface py-2 lg:flex transition-colors">
      <nav className="flex flex-col">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = current === item.key || pathname === item.href;
          return (
            <Link
              key={item.key}
              href={item.href}
              className={`group relative mx-3 flex items-center gap-5 rounded-full px-6 py-3 text-sm font-medium transition-all ${
                isActive
                  ? "bg-[#e3f2fd] text-primary-blue dark:bg-primary-blue/20 dark:text-blue-300"
                  : "text-ink-secondary hover:bg-surface-variant hover:text-ink"
              }`}
            >
              <Icon
                className={`h-6 w-6 transition-colors ${
                  isActive ? "text-primary-blue" : "text-ink-secondary group-hover:text-ink"
                }`}
                strokeWidth={2}
              />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
