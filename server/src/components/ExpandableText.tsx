"use client";

import { useState } from "react";

type ExpandableTextProps = {
  text: string;
};

export function ExpandableText({ text }: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <p
        className={`text-sm text-gray-600 leading-relaxed whitespace-pre-line ${
          expanded ? "" : "line-clamp-4"
        }`}
      >
        {text}
      </p>
      <button
        type="button"
        className="self-start text-sm font-medium text-green-700 hover:underline"
        onClick={() => setExpanded((prev) => !prev)}
      >
        {expanded ? "Show less" : "Read more"}
      </button>
    </div>
  );
}
