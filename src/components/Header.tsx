"use client";

import { Search, HelpCircle, Bell } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
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
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between bg-white px-4 py-2 shadow-sm">
      <div className="flex flex-1 items-center gap-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-medium text-ink">
           <div className="relative h-8 w-8">
             <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
               <path d="M3.60938 21.3969C3.29063 21.2219 3 20.7375 3 20.0156V3.98438C3 3.2625 3.29063 2.77812 3.60938 2.60312L12.7969 11.7906L3.60938 21.3969Z" fill="#2196F3"/>
               <path d="M16.3969 15.3906L12.7969 11.7906L16.3969 8.19062L21.3469 10.9562C22.7625 11.7531 22.7625 13.05 21.3469 13.8375L16.3969 15.3906Z" fill="#FFC107"/>
               <path d="M12.7969 11.7906L3.60938 2.60312C4.11562 2.07187 4.95937 2.01562 5.87812 2.53125L16.3969 8.19062L12.7969 11.7906Z" fill="#4CAF50"/>
               <path d="M12.7969 11.7906L16.3969 15.3906L5.87812 21.05C4.95937 21.5656 4.11562 21.5094 3.60938 20.9781L12.7969 11.7906Z" fill="#F44336"/>
             </svg>
           </div>
           <span className="hidden text-[22px] text-[#5f6368] sm:block">Google Play</span>
        </Link>
      </div>

      <div className="flex flex-[2] items-center justify-center">
         <div className="flex w-full max-w-[720px] items-center gap-3 rounded-full bg-[#f1f3f4] px-4 py-3 transition-shadow focus-within:shadow-md">
            <Search className="h-5 w-5 text-[#5f6368]" />
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-transparent text-base outline-none placeholder:text-[#5f6368]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
         </div>
      </div>

      <div className="flex flex-1 items-center justify-end gap-2 sm:gap-4">
        <button className="rounded-full p-2 hover:bg-gray-100">
          <HelpCircle className="h-6 w-6 text-[#5f6368]" />
        </button>
        <button className="rounded-full p-2 hover:bg-gray-100">
          <Bell className="h-6 w-6 text-[#5f6368]" />
        </button>
        <button className="ml-1 rounded-full p-1 hover:bg-gray-100">
           <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-sm font-medium text-white">
             K
           </div>
        </button>
      </div>
    </header>
  );
}
