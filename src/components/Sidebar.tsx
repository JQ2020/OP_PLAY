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
    <aside className="hidden w-[256px] flex-col gap-2 overflow-y-auto py-2 pl-4 lg:flex">
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = current === item.key || pathname === item.href;
          return (
            <Link
              key={item.key}
              href={item.href}
              className={`flex items-center gap-4 rounded-l-full px-6 py-3 text-sm font-medium transition-colors hover:bg-gray-50 ${
                isActive
                  ? "bg-[#e8f0fe] text-[#01875f] hover:bg-[#e8f0fe]"
                  : "text-[#5f6368]"
              }`}
            >
              <Icon
                className={`h-6 w-6 ${isActive ? "fill-[#01875f]" : ""}`}
                strokeWidth={isActive ? 2 : 2}
              />
              <span className="text-[15px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
