import type { Review } from "@prisma/client";
import { StarRating } from "./StarRating";

type ReviewListProps = {
  reviews: Review[];
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function ReviewList({ reviews }: ReviewListProps) {
  return (
    <div className="flex flex-col gap-6">
      {reviews.map((review) => (
        <div key={review.id} className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            {review.userImage ? (
                // eslint-disable-next-line @next/next/no-img-element
              <img
                src={review.userImage}
                alt={review.userName}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-700">
                  <span className="text-xs font-bold">{review.userName.charAt(0)}</span>
              </div>
            )}
            <span className="text-sm font-medium text-ink">{review.userName}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <StarRating rating={review.rating} size={12} />
            <span className="text-xs text-ink-secondary">{formatDate(review.createdAt)}</span>
          </div>

          <p className="text-sm text-ink-secondary leading-relaxed">{review.content}</p>
        </div>
      ))}
    </div>
  );
}
