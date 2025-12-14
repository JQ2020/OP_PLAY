"use client";

import { Search, HelpCircle, Download } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import Image from "next/image";
import { UserMenu } from "./UserMenu";

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
      <div className="flex items-center gap-4 lg:gap-8">
        <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <div className="relative h-10 w-10 flex-shrink-0">
            <Image
              src="/oppo_market_icon.png"
              alt="OP Play"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="hidden text-[22px] font-normal tracking-tight text-muted lg:block">OP Play</span>
        </Link>
      </div>

      <div className="mx-2 flex flex-1 items-center justify-center md:mx-4">
        <div className="group relative w-full max-w-[280px] sm:max-w-[400px] md:max-w-[720px]">
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
        <Link
          href="/download"
          className="hidden md:flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-all hover:bg-primary/90"
        >
          <Download className="h-4 w-4" />
          Get App
        </Link>
        <ThemeToggle />
        <Link
          href="/admin"
          className="hidden md:flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-ink-secondary transition-colors hover:bg-surface-variant"
        >
          Admin
        </Link>
        <button
          className="hidden md:flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full transition-colors hover:bg-surface-variant active:scale-95"
          aria-label="Help"
        >
          <HelpCircle className="h-5 w-5 text-ink-secondary" />
        </button>
        <UserMenu />
      </div>
    </header>
  );
}
