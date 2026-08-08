"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { compact } from "@/lib/data";

/** Counts up once, when it scrolls into view. Odometer, not a fade. */
export function CountUp({
  value,
  short = false,
  suffix = "",
  duration = 1100,
}: {
  value: number;
  short?: boolean;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();
  /** null = "show the truth" — the server-rendered state, so crawlers and
      no-JS visitors get the real number instead of a zero. */
  const [n, setN] = useState<number | null>(null);
  const armed = useRef(false);

  // Only arm the count-up if the number is still below the fold on mount.
  // Anything already on screen keeps its value rather than flashing to zero.
  useEffect(() => {
    if (reduce || !ref.current) return;
    if (ref.current.getBoundingClientRect().top > window.innerHeight) {
      armed.current = true;
      setN(0);
    }
  }, [reduce]);

  useEffect(() => {
    if (!inView || !armed.current) return;

    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // ease-out-quart, so it lands rather than screeches
      setN(Math.round(value * (1 - Math.pow(1 - t, 4))));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    const safety = window.setTimeout(() => setN(value), duration * 2 + 1500);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(safety);
    };
  }, [inView, value, duration]);

  const shown = n ?? value;

  return (
    <span ref={ref} className="tabular">
      {short ? compact(shown) : shown.toLocaleString("en-GB")}
      {suffix}
    </span>
  );
}
