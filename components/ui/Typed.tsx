"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

type Props = {
  text: string;
  /** ms per character */
  speed?: number;
  /** ms before the first character lands */
  delay?: number;
  className?: string;
  /** keep a blinking block caret after the last character */
  caret?: boolean;
  /** start typing only once scrolled into view */
  onView?: boolean;
  onDone?: () => void;
};

/**
 * Real per-character reveal — the text is written out, not faded in.
 * An invisible copy reserves the final box so nothing reflows mid-type, and the
 * full string goes to screen readers immediately.
 */
export function Typed({
  text,
  speed = 26,
  delay = 0,
  className,
  caret = false,
  onView = true,
  onDone,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  const reduce = useReducedMotion();
  const [count, setCount] = useState(0);
  const done = count >= text.length;
  const active = onView ? inView : true;

  useEffect(() => {
    if (reduce) {
      setCount(text.length);
      return;
    }
    if (!active) return;

    let frame = 0;
    let i = 0;
    let last = 0;
    let started = false;
    const start = performance.now() + delay;

    const tick = (now: number) => {
      if (now < start) {
        frame = requestAnimationFrame(tick);
        return;
      }
      if (!started) {
        started = true;
        last = now;
      }
      // Jitter, so it reads like fingers rather than a metronome.
      const step = speed * (0.72 + Math.random() * 0.62);
      if (now - last >= step) {
        last = now;
        i += 1;
        setCount(i);
      }
      if (i < text.length) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    // Safety net: if rAF is starved (background tab, throttled renderer) the
    // text must still end up on screen. Never leave a caret with no sentence.
    const safety = window.setTimeout(
      () => setCount(text.length),
      delay + text.length * speed * 2.5 + 2000,
    );

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(safety);
    };
  }, [active, delay, reduce, speed, text.length]);

  useEffect(() => {
    if (done) onDone?.();
  }, [done, onDone]);

  return (
    <span ref={ref} className={cn("relative inline-block", className)}>
      <span aria-hidden className="invisible">
        {text}
      </span>
      <span aria-hidden className="absolute inset-0">
        {text.slice(0, count)}
        {caret && (
          <span
            className={cn(
              "ml-px inline-block w-[0.5em] translate-y-[0.08em] bg-accent align-baseline",
              done && "animate-blink",
            )}
            style={{ height: "0.9em" }}
          />
        )}
      </span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
