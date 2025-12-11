"use client";

import { Search, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

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
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
              <path d="M3.60938 21.3969C3.29063 21.2219 3 20.7375 3 20.0156V3.98438C3 3.2625 3.29063 2.77812 3.60938 2.60312L12.7969 11.7906L3.60938 21.3969Z" fill="#2196F3"/>
              <path d="M16.3969 15.3906L12.7969 11.7906L16.3969 8.19062L21.3469 10.9562C22.7625 11.7531 22.7625 13.05 21.3469 13.8375L16.3969 15.3906Z" fill="#FFC107"/>
              <path d="M12.7969 11.7906L3.60938 2.60312C4.11562 2.07187 4.95937 2.01562 5.87812 2.53125L16.3969 8.19062L12.7969 11.7906Z" fill="#4CAF50"/>
              <path d="M12.7969 11.7906L16.3969 15.3906L5.87812 21.05C4.95937 21.5656 4.11562 21.5094 3.60938 20.9781L12.7969 11.7906Z" fill="#F44336"/>
            </svg>
          </div>
          <span className="hidden text-[22px] font-normal tracking-tight text-muted lg:block">OPPO Play</span>
        </Link>
      </div>

      <div className="mx-4 flex flex-1 items-center justify-center">
        <div className="group relative w-full max-w-[720px]">
          <div className="flex items-center gap-4 rounded-lg bg-surface-variant px-6 py-2.5 transition-all focus-within:bg-white dark:focus-within:bg-black focus-within:shadow-md">
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
