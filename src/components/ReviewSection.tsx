"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Review } from "@prisma/client";
import { ReviewList } from "./ReviewList";
import { ReviewForm } from "./ReviewForm";
import { RatingSummary } from "./RatingSummary";
import { useUser } from "@/contexts/UserContext";
import { PenLine, ArrowRight } from "lucide-react";
import Link from "next/link";

type ReviewSectionProps = {
  appId: string;
  appTitle: string;
  appCategory: string;
  reviews: Review[];
  rating: number;
  totalReviews: number;
  showAllReviews: boolean;
};

export function ReviewSection({
  appId,
  appTitle,
  appCategory,
  reviews: initialReviews,
  rating,
  totalReviews,
  showAllReviews,
}: ReviewSectionProps) {
  const { user, isLoggedIn } = useUser();
  const router = useRouter();
  const [reviews, setReviews] = useState(initialReviews);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  const userReview = reviews.find((r) => r.userName === user?.name);

  const handleSubmit = useCallback(
    async (data: { rating: number; content: string }) => {
      if (!user) return;

      if (editingReview) {
        const res = await fetch(`/api/reviews/${editingReview.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to update review");
        const updated = await res.json();
        setReviews((prev) =>
          prev.map((r) => (r.id === editingReview.id ? { ...r, ...updated } : r))
        );
        setEditingReview(null);
      } else {
        const res = await fetch("/api/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            appId,
            userName: user.name,
            userId: user.id,
            userImage: user.avatar,
            ...data,
          }),
        });
        if (!res.ok) throw new Error("Failed to create review");
        const newReview = await res.json();
        setReviews((prev) => [newReview, ...prev]);
      }

      router.refresh();
    },
    [appId, user, editingReview, router]
  );

  const handleDelete = useCallback(
    async (reviewId: string) => {
      const res = await fetch(`/api/reviews/${reviewId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete review");
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      router.refresh();
    },
    [router]
  );

  const handleEdit = useCallback((review: Review) => {
    setEditingReview(review);
    setShowForm(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setShowForm(false);
    setEditingReview(null);
  }, []);

  return (
    <section className="border-b border-border-light px-4 py-6 md:px-6" id="reviews">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-normal text-ink">Ratings and reviews</h2>
        <Link
          href={`/?section=top-charts&category=${encodeURIComponent(appCategory)}`}
          className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-surface-variant"
        >
          <ArrowRight size={20} className="text-ink-secondary" />
        </Link>
      </div>

      <div className="mb-8">
        <RatingSummary rating={rating} totalReviews={totalReviews} />
      </div>

      {isLoggedIn && !userReview && (
        <button
          onClick={() => setShowForm(true)}
          className="mb-6 flex items-center gap-2 rounded-lg border border-primary px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
        >
          <PenLine size={18} />
          Write a review
        </button>
      )}

      {isLoggedIn && userReview && (
        <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <p className="mb-2 text-sm font-medium text-ink">Your review</p>
          <ReviewList
            reviews={[userReview]}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      )}

      <ReviewList
        reviews={reviews.filter((r) => r.id !== userReview?.id)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <div className="mt-6">
        <Link
          href={`/app/${appId}?reviews=all#reviews`}
          className="text-sm font-medium text-primary hover:underline"
        >
          {showAllReviews ? "Show less" : "See all reviews"}
        </Link>
      </div>

      <ReviewForm
        appId={appId}
        appTitle={appTitle}
        isOpen={showForm}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        editingReview={
          editingReview
            ? { id: editingReview.id, rating: editingReview.rating, content: editingReview.content }
            : null
        }
      />
    </section>
  );
}
