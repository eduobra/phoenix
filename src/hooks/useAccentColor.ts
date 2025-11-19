"use client";
import { useEffect, useState } from "react";

type AccentColor = "Blue" | "Violet" | "Slate Gray";

export function useAccentColor() {
  const [accent, setAccent] = useState<AccentColor>(
    (typeof window !== "undefined" && localStorage.getItem("accent")) as AccentColor || "Blue"
  );

  const updateAccent = (color: AccentColor) => {
    setAccent(color);
    if (typeof window !== "undefined") {
      localStorage.setItem("accent", color);
    }
  };

  const accentClass = {
    Blue: "bg-[#3B82F6] text-white hover:bg-[#2563EB]",
    Violet: "bg-[#7C3AED] text-white hover:bg-[#6D28D9]",
    "Slate Gray": "bg-[#64748B] text-white hover:bg-[#475569]",
  }[accent];

  return { accent, updateAccent, accentClass };
}
