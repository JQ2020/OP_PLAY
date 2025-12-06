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
    <aside className="flex h-screen w-[260px] flex-col gap-8 border-r border-gray-200 bg-background px-6 py-6 shadow-card">
      <div className="text-xl font-semibold text-ink">Google Play</div>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = current === item.key || pathname === item.href;
          return (
            <Link
              key={item.key}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition hover:bg-green-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                isActive ? "bg-green-100 text-[#01875f]" : "text-muted"
              }`}
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                  isActive ? "bg-white text-[#01875f]" : "bg-surface text-muted"
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={0} fill="currentColor" />
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
