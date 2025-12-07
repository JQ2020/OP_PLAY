import { Star, StarHalf } from "lucide-react";

type StarRatingProps = {
  rating: number;
  size?: number;
  showCount?: boolean;
  count?: string;
  className?: string;
};

export function StarRating({ rating, size = 16, showCount = false, count, className = "" }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} size={size} className="fill-current text-green-700" strokeWidth={0} />
        ))}
        {hasHalfStar && <StarHalf size={size} className="fill-current text-green-700" strokeWidth={0} />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} size={size} className="fill-gray-200 text-gray-200" strokeWidth={0} />
        ))}
      </div>
      {showCount && count && <span className="text-xs text-gray-500 ml-1">({count})</span>}
    </div>
  );
}
