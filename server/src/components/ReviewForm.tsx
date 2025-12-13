"use client";

import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { StarRatingInput } from "./StarRatingInput";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ReviewFormProps = {
  appId: string;
  appTitle: string;
  onSubmit: (review: { rating: number; content: string }) => Promise<void>;
  onClose: () => void;
  isOpen: boolean;
  editingReview?: { id: string; rating: number; content: string } | null;
};

export function ReviewForm({ appId, appTitle, onSubmit, onClose, isOpen, editingReview }: ReviewFormProps) {
  const { user, isLoggedIn } = useUser();
  const [rating, setRating] = useState(editingReview?.rating || 0);
  const [content, setContent] = useState(editingReview?.content || "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }
    if (!content.trim()) {
      setError("Please write a review");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await onSubmit({ rating, content: content.trim() });
      setRating(0);
      setContent("");
      onClose();
    } catch {
      setError("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-surface"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-medium text-ink">
                {editingReview ? "Edit review" : "Write a review"}
              </h2>
              <button
                onClick={onClose}
                className="rounded-full p-2 transition-colors hover:bg-surface-variant"
              >
                <X size={20} className="text-ink-secondary" />
              </button>
            </div>

            <p className="mb-4 text-sm text-ink-secondary">
              Reviewing <span className="font-medium text-ink">{appTitle}</span>
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="mb-3 block text-sm font-medium text-ink">
                  Your rating
                </label>
                <div className="flex justify-center">
                  <StarRatingInput value={rating} onChange={setRating} size={40} />
                </div>
                <p className="mt-2 text-center text-sm text-ink-secondary">
                  {rating === 0 && "Tap to rate"}
                  {rating === 1 && "Poor"}
                  {rating === 2 && "Fair"}
                  {rating === 3 && "Good"}
                  {rating === 4 && "Very good"}
                  {rating === 5 && "Excellent"}
                </p>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">
                  Your review
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Describe your experience (optional)"
                  rows={4}
                  className="w-full resize-none rounded-lg border border-border bg-white px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-primary dark:bg-surface-variant"
                />
                <p className="mt-1 text-right text-xs text-ink-secondary">
                  {content.length}/500
                </p>
              </div>

              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}

              <div className="flex items-center justify-between border-t border-border-light pt-4">
                <p className="text-xs text-ink-secondary">
                  Posting as <span className="font-medium">{user?.name}</span>
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg px-4 py-2.5 text-sm font-medium text-ink-secondary transition-colors hover:bg-surface-variant"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || rating === 0}
                    className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    {submitting ? "Posting..." : editingReview ? "Update" : "Post"}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
