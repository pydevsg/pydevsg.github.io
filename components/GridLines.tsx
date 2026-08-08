"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Container } from "./ui/Container";

/**
 * The 12-column grid the layout is actually built on, made visible.
 * Invisible at rest, fades up as you scroll so the structure reveals itself.
 * 4 columns on mobile — 12 hairlines on a phone is soup.
 */
export function GridLines() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.04, 0.9, 1], [0, 1, 1, 0.35]);

  return (
    <motion.div
      aria-hidden
      style={{ opacity }}
      className="pointer-events-none fixed inset-0 z-0 select-none"
    >
      <Container className="h-full">
        <div className="grid h-full grid-cols-4 border-r border-hair md:grid-cols-12">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className={
                i > 3
                  ? "hidden border-l border-hair md:block"
                  : "border-l border-hair"
              }
            />
          ))}
        </div>
      </Container>
    </motion.div>
  );
}
