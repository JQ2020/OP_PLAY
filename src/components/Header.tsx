"use client";

import { Search, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import Image from "next/image";

export function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const searchQuery = e.currentTarget.value.trim();
      const params = new URLSearchParams(searchParams.toString());
      if (searchQuery) {
        params.set("q", searchQuery);
      } else {
        params.delete("q");
      }
      router.push(`/?${params.toString()}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-border-light bg-white dark:bg-surface px-6 transition-colors">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <div className="relative h-10 w-10 flex-shrink-0">
            <Image
              src="/oppo_market_icon.png"
              alt="OPPO Play"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="hidden text-[22px] font-normal tracking-tight text-muted lg:block">OPPO Play</span>
        </Link>
      </div>

      <div className="mx-4 flex flex-1 items-center justify-center">
        <div className="group relative w-full max-w-[720px]">
          <div className="flex items-center gap-4 rounded-lg bg-surface-variant px-6 py-2.5 transition-all focus-within:bg-white focus-within:shadow-md dark:focus-within:bg-surface-variant">
            <Search className="h-5 w-5 flex-shrink-0 text-ink-secondary" />
            <input
              key={searchParams.get("q") || ""}
              type="text"
              placeholder="Search for apps & games"
              className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-secondary"
              defaultValue={searchParams.get("q") || ""}
              onKeyDown={handleSearch}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Link
          href="/admin"
          className="hidden md:flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-ink-secondary transition-colors hover:bg-surface-variant"
        >
          Admin
        </Link>
        <button
          className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full transition-colors hover:bg-surface-variant active:scale-95"
          aria-label="Help"
        >
          <HelpCircle className="h-5 w-5 text-ink-secondary" />
        </button>
        <button
          className="ml-2 flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-[#ea4335] text-sm font-medium text-white transition-opacity hover:opacity-90 active:scale-95"
          aria-label="User account"
        >
          A
        </button>
      </div>
    </header>
  );
}
