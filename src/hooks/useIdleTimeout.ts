"use client";

import { useEffect, useRef } from "react";

export function useIdleTimeout(minutes: number, onTimeout: () => void) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const reset = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(onTimeout, minutes * 60 * 1000);
  };

  useEffect(() => {
    const events = ["click", "mousemove", "keydown", "scroll"];
    events.forEach((e) => window.addEventListener(e, reset));

    reset(); // start timer on load

    return () => {
      events.forEach((e) => window.removeEventListener(e, reset));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [minutes, onTimeout]);
}
