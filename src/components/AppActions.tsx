"use client";

import { useEffect, useState } from "react";
import { BookmarkCheck, BookmarkPlus, MoreVertical, Share2 } from "lucide-react";
import { usePathname } from "next/navigation";

type AppActionsProps = {
  appTitle: string;
  developer: string;
};

export function AppActions({ appTitle, developer }: AppActionsProps) {
  const [shareLabel, setShareLabel] = useState("Share");
  const [saved, setSaved] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({
          title: appTitle,
          text: `${appTitle} · ${developer}`,
          url,
        });
        setShareLabel("Shared!");
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setShareLabel("Link copied");
      } else {
        setShareLabel("Link ready");
        window.open(url, "_blank");
      }
    } catch (error) {
      console.error("Share failed", error);
      setShareLabel("Try again");
    } finally {
      setTimeout(() => setShareLabel("Share"), 1800);
    }
  };

  const toggleSave = () => {
    setSaved((prev) => !prev);
  };

  return (
    <div className="relative flex items-center gap-3 text-green-700">
      <button
        className="flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors hover:bg-green-50"
        onClick={handleShare}
        type="button"
      >
        <Share2 size={18} />
        <span>{shareLabel}</span>
      </button>
      <button
        className="flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors hover:bg-green-50"
        onClick={toggleSave}
        type="button"
      >
        {saved ? <BookmarkCheck size={18} /> : <BookmarkPlus size={18} />}
        <span>{saved ? "Saved" : "Wishlist"}</span>
      </button>
      <div className="relative">
        <button
          className="flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors hover:bg-green-50"
          onClick={() => setIsMenuOpen((open) => !open)}
          type="button"
        >
          <MoreVertical size={18} />
          <span>More</span>
        </button>
        {isMenuOpen && (
          <div className="absolute right-0 top-11 z-10 w-48 rounded-2xl border border-gray-200 bg-white p-2 shadow-card">
            <a
              href="https://support.google.com/googleplay/answer/9037938"
              target="_blank"
              rel="noreferrer"
              className="block rounded-lg px-3 py-2 text-sm text-[#202124] hover:bg-gray-50"
            >
              Data safety help
            </a>
            <a
              href="https://support.google.com/googleplay/answer/4600002"
              target="_blank"
              rel="noreferrer"
              className="block rounded-lg px-3 py-2 text-sm text-[#202124] hover:bg-gray-50"
            >
              Report an issue
            </a>
            <a
              href="https://support.google.com/googleplay/workflow/9813244"
              target="_blank"
              rel="noreferrer"
              className="block rounded-lg px-3 py-2 text-sm text-[#202124] hover:bg-gray-50"
            >
              Add to wishlist guide
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
