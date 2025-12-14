"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppWindow, Gamepad2, Baby, Download } from "lucide-react";

export function MobileNav() {
  const pathname = usePathname();

  const items = [
    { href: "/", icon: AppWindow, label: "Apps" },
    { href: "/games", icon: Gamepad2, label: "Games" },
    { href: "/kids", icon: Baby, label: "Kids" },
    { href: "/download", icon: Download, label: "Get App" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border-light bg-white dark:bg-surface lg:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 rounded-lg px-4 py-2 transition-colors min-w-[64px] ${
                isActive
                  ? "text-primary-blue"
                  : "text-ink-secondary"
              }`}
            >
              <Icon
                className="h-6 w-6"
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={`text-[10px] font-medium ${isActive ? 'font-semibold' : ''}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
