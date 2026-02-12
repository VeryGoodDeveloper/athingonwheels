"use client";

import { useState, useRef, useEffect } from "react";

interface ExpandableDescriptionProps {
  description: string;
}

export default function ExpandableDescription({ description }: ExpandableDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsExpansion, setNeedsExpansion] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (textRef.current) {
      // Check if text is more than 3 lines (approx 4.5em with 1.5 line-height)
      const lineHeight = parseFloat(getComputedStyle(textRef.current).lineHeight);
      const height = textRef.current.scrollHeight;
      const lines = height / lineHeight;
      
      setNeedsExpansion(lines > 3);
    }
  }, [description]);

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-gray-700/30 shadow-2xl">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold text-white">Description</h2>
        {needsExpansion && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors"
          >
            {isExpanded ? "Show less" : "Read more"}
          </button>
        )}
      </div>
      <p
        ref={textRef}
        className={`text-gray-200 leading-relaxed whitespace-pre-line text-sm ${
          !isExpanded && needsExpansion ? "line-clamp-3" : ""
        }`}
      >
        {description}
      </p>
    </div>
  );
}
