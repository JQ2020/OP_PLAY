"use client";

import { Star, StarHalf, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type StarRatingProps = {
  rating: number;
  size?: number;
  showCount?: boolean;
  count?: string;
  className?: string;
  animate?: boolean;
};

export function StarRating({
  rating,
  size = 16,
  showCount = false,
  count,
  className = "",
  animate = false
}: StarRatingProps) {
  const [hasAnimated, setHasAnimated] = useState(false);
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  const isHighRating = rating >= 4.5;

  useEffect(() => {
    if (animate && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [animate, hasAnimated]);

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="relative flex">
        {[...Array(fullStars)].map((_, i) => (
          <motion.div
            key={`full-${i}`}
            initial={animate ? { scale: 0, rotate: -180, opacity: 0 } : false}
            animate={animate ? { scale: 1, rotate: 0, opacity: 1 } : {}}
            transition={{
              duration: 0.4,
              delay: i * 0.1,
              ease: [0.34, 1.56, 0.64, 1]
            }}
          >
            <Star
              size={size}
              className="fill-current text-green-700"
              strokeWidth={0}
            />
          </motion.div>
        ))}
        {hasHalfStar && (
          <motion.div
            initial={animate ? { scale: 0, rotate: -180, opacity: 0 } : false}
            animate={animate ? { scale: 1, rotate: 0, opacity: 1 } : {}}
            transition={{
              duration: 0.4,
              delay: fullStars * 0.1,
              ease: [0.34, 1.56, 0.64, 1]
            }}
          >
            <StarHalf
              size={size}
              className="fill-current text-green-700"
              strokeWidth={0}
            />
          </motion.div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <motion.div
            key={`empty-${i}`}
            initial={animate ? { scale: 0, opacity: 0 } : false}
            animate={animate ? { scale: 1, opacity: 1 } : {}}
            transition={{
              duration: 0.3,
              delay: (fullStars + (hasHalfStar ? 1 : 0) + i) * 0.1
            }}
          >
            <Star
              size={size}
              className="fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
              strokeWidth={0}
            />
          </motion.div>
        ))}

        {isHighRating && animate && hasAnimated && (
          <motion.div
            className="absolute -right-1 -top-1"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: [0, 1.2, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Sparkles
              size={size * 0.6}
              className="text-yellow-500 fill-yellow-400"
            />
          </motion.div>
        )}
      </div>
      {showCount && count && (
        <motion.span
          className="text-xs text-gray-500 dark:text-gray-400 ml-1"
          initial={animate ? { opacity: 0, x: -10 } : false}
          animate={animate ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          ({count})
        </motion.span>
      )}
    </div>
  );
}
