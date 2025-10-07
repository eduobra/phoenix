"use client";

import React from "react";

type CharacterCounterProps = {
  charCount: number;
  maxChars?: number;
  warningThreshold?: number; // e.g. 0.9 = 90%
};

export default function CharacterCounter({
  charCount,
  maxChars = 10000,
  warningThreshold = 0.9,
}: CharacterCounterProps) {
  const isNearLimit = charCount >= maxChars * warningThreshold;
  const isAtLimit = charCount === maxChars;

  return (
    <div className="flex justify-between items-center px-3 pt-1">
      <span
        className={`text-xs ${
          isNearLimit ? "text-red-500" : "text-gray-400"
        }`}
      >
        {charCount}/{maxChars}
      </span>

      {isNearLimit && (
        <span className="text-xs text-red-500">
          {isAtLimit
            ? "Character limit reached."
            : "Approaching message limit..."}
        </span>
      )}
    </div>
  );
}
