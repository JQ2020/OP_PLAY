import { StarRating } from "./StarRating";

type RatingSummaryProps = {
  rating: number;
  totalReviews: number;
};

export function RatingSummary({ rating, totalReviews }: RatingSummaryProps) {
    // Mock distribution for now since we don't have it in DB efficiently
  const distribution = [70, 15, 5, 5, 5]; // Percentages for 5, 4, 3, 2, 1 stars

  return (
    <div className="flex gap-8 items-center">
      <div className="flex flex-col items-center gap-1">
        <span className="text-5xl font-medium text-ink">{rating.toFixed(1)}</span>
        <StarRating rating={rating} size={14} />
        <span className="text-xs text-ink-secondary mt-1">{totalReviews.toLocaleString()} reviews</span>
      </div>

      <div className="flex-1 flex flex-col gap-1 max-w-xs">
        {[5, 4, 3, 2, 1].map((star, i) => (
          <div key={star} className="flex items-center gap-3">
            <span className="text-xs font-medium text-ink-secondary w-2">{star}</span>
            <div className="h-2 flex-1 rounded-full bg-surface-variant overflow-hidden">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${distribution[i]}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
