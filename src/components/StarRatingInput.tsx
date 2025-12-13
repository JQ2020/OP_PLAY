"use client";

import { useState } from "react";
import { Star } from "lucide-react";

type StarRatingInputProps = {
  value: number;
  onChange: (value: number) => void;
  size?: number;
};

export function StarRatingInput({ value, onChange, size = 32 }: StarRatingInputProps) {
  const [hoverValue, setHoverValue] = useState(0);

  const displayValue = hoverValue || value;

  return (
    <div className="flex gap-1" onMouseLeave={() => setHoverValue(0)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHoverValue(star)}
          className="transition-transform hover:scale-110 active:scale-95"
        >
          <Star
            size={size}
            className={`transition-colors ${
              star <= displayValue
                ? "fill-amber-400 text-amber-400"
                : "fill-transparent text-gray-300 dark:text-gray-600"
            }`}
          />
        </button>
      ))}
    </div>
  );
}
