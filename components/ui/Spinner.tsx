"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

const FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

/**
 * A braille spinner that spins forever and resolves never. Load-bearing joke:
 * on hover it implies work is happening. It isn't.
 */
export function Spinner({
  className,
  running = true,
  interval = 90,
}: {
  className?: string;
  running?: boolean;
  interval?: number;
}) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (!running || reduce) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % FRAMES.length), interval);
    return () => window.clearInterval(id);
  }, [running, reduce, interval]);

  return (
    <span aria-hidden className={cn("inline-block w-[1ch] text-accent", className)}>
      {FRAMES[i]}
    </span>
  );
}
