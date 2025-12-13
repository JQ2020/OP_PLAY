"use client";

import type { Review } from "@prisma/client";
import { StarRating } from "./StarRating";
import { ThumbsUp, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";

type ReviewListProps = {
  reviews: Review[];
  currentUserName?: string;
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: string) => Promise<void>;
};

function formatDate(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

export function ReviewList({ reviews, onEdit, onDelete }: ReviewListProps) {
  const { user } = useUser();

  return (
    <div className="flex flex-col gap-6">
      {reviews.map((review) => (
        <ReviewItem
          key={review.id}
          review={review}
          isOwner={user?.name === review.userName}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

type ReviewItemProps = {
  review: Review;
  isOwner: boolean;
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: string) => Promise<void>;
};

function ReviewItem({ review, isOwner, onEdit, onDelete }: ReviewItemProps) {
  const [helpfulCount, setHelpfulCount] = useState(Math.floor(Math.random() * 50));
  const [isHelpful, setIsHelpful] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleHelpful = () => {
    if (isHelpful) {
      setHelpfulCount((c) => c - 1);
    } else {
      setHelpfulCount((c) => c + 1);
    }
    setIsHelpful(!isHelpful);
  };

  const handleDelete = async () => {
    if (!onDelete || deleting) return;
    setDeleting(true);
    try {
      await onDelete(review.id);
    } finally {
      setDeleting(false);
      setMenuOpen(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {review.userImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={review.userImage}
              alt={review.userName}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
              <span className="text-xs font-bold">{review.userName.charAt(0)}</span>
            </div>
          )}
          <span className="text-sm font-medium text-ink">{review.userName}</span>
        </div>

        {isOwner && (onEdit || onDelete) && (
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-full p-2 transition-colors hover:bg-surface-variant"
            >
              <MoreVertical size={16} className="text-ink-secondary" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-10 z-10 w-36 rounded-lg border border-border-light bg-white py-1 shadow-lg dark:bg-surface">
                {onEdit && (
                  <button
                    onClick={() => {
                      onEdit(review);
                      setMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-ink transition-colors hover:bg-surface-variant"
                  >
                    <Edit2 size={14} />
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-500 transition-colors hover:bg-surface-variant disabled:opacity-50"
                  >
                    <Trash2 size={14} />
                    {deleting ? "Deleting..." : "Delete"}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <StarRating rating={review.rating} size={12} />
        <span className="text-xs text-ink-secondary">{formatDate(review.createdAt)}</span>
      </div>

      <p className="text-sm leading-relaxed text-ink-secondary">{review.content}</p>

      <div className="mt-1 flex items-center gap-4">
        <button
          onClick={handleHelpful}
          className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs transition-colors ${
            isHelpful
              ? "bg-primary/10 text-primary"
              : "text-ink-secondary hover:bg-surface-variant"
          }`}
        >
          <ThumbsUp size={14} className={isHelpful ? "fill-current" : ""} />
          <span>Helpful ({helpfulCount})</span>
        </button>
      </div>
    </div>
  );
}
