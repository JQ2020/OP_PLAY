"use client";

import { useEffect, useState } from "react";
import { BookmarkCheck, BookmarkPlus, Loader2, MoreVertical, Share2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { useUser } from "@/contexts/UserContext";

type AppActionsProps = {
  appId: string;
  appTitle: string;
  developer: string;
};

export function AppActions({ appId, appTitle, developer }: AppActionsProps) {
  const { user, isLoggedIn } = useUser();
  const [shareLabel, setShareLabel] = useState("Share");
  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isLoggedIn || !user) {
      setSaved(false);
      return;
    }
    fetch(`/api/wishlist/check?userId=${user.id}&appId=${appId}`)
      .then((res) => res.json())
      .then((data) => setSaved(data.inWishlist))
      .catch(() => {});
  }, [isLoggedIn, user, appId]);

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

  const toggleSave = async () => {
    if (!isLoggedIn || !user) return;
    setIsLoading(true);
    try {
      if (saved) {
        await fetch("/api/wishlist", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, appId }),
        });
        setSaved(false);
      } else {
        await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, appId }),
        });
        setSaved(true);
      }
    } catch (error) {
      console.error("Wishlist toggle failed", error);
    } finally {
      setIsLoading(false);
    }
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
        className="flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors hover:bg-green-50 disabled:opacity-50"
        onClick={toggleSave}
        disabled={isLoading || !isLoggedIn}
        title={!isLoggedIn ? "Login to add to wishlist" : undefined}
        type="button"
      >
        {isLoading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : saved ? (
          <BookmarkCheck size={18} />
        ) : (
          <BookmarkPlus size={18} />
        )}
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
          <div className="absolute right-0 top-11 z-10 w-48 rounded-2xl border border-gray-200 dark:border-border-light bg-white dark:bg-surface p-2 shadow-card">
            <a
              href="https://support.google.com/googleplay/answer/9037938"
              target="_blank"
              rel="noreferrer"
              className="block rounded-lg px-3 py-2 text-sm text-[#202124] dark:text-ink hover:bg-gray-50 dark:hover:bg-surface-variant"
            >
              Data safety help
            </a>
            <a
              href="https://support.google.com/googleplay/answer/4600002"
              target="_blank"
              rel="noreferrer"
              className="block rounded-lg px-3 py-2 text-sm text-[#202124] dark:text-ink hover:bg-gray-50 dark:hover:bg-surface-variant"
            >
              Report an issue
            </a>
            <a
              href="https://support.google.com/googleplay/workflow/9813244"
              target="_blank"
              rel="noreferrer"
              className="block rounded-lg px-3 py-2 text-sm text-[#202124] dark:text-ink hover:bg-gray-50 dark:hover:bg-surface-variant"
            >
              Add to wishlist guide
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
