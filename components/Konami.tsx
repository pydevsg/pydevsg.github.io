"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const CODE = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
];

/** Tiny stand-ins for the services he actually runs: compute, storage, functions, containers. */
const GLYPHS = [
  // EC2-ish cube
  "M12 2 3 7v10l9 5 9-5V7l-9-5Zm0 2.3 6.5 3.6L12 11.5 5.5 7.9 12 4.3Z",
  // S3-ish bucket
  "M4 6h16l-1.6 14H5.6L4 6Zm2.2 2 1.2 10h9.2l1.2-10H6.2Z",
  // Lambda
  "M7 20 12 4l5 16h-2.2l-3-9.6L8.9 20H7Z",
  // EKS-ish hexagon
  "M12 3l7.8 4.5v9L12 21l-7.8-4.5v-9L12 3Z",
];

type Piece = {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  spin: number;
  glyph: string;
  drift: number;
};

function makePieces(): Piece[] {
  return Array.from({ length: 44 }, (_, id) => ({
    id,
    x: Math.random() * 100,
    delay: Math.random() * 0.7,
    duration: 2.6 + Math.random() * 2,
    size: 10 + Math.random() * 16,
    spin: (Math.random() > 0.5 ? 1 : -1) * (180 + Math.random() * 540),
    glyph: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
    drift: (Math.random() - 0.5) * 220,
  }));
}

/** ↑↑↓↓←→←→BA — a small shower of the services he keeps online. */
export function Konami() {
  const [pieces, setPieces] = useState<Piece[] | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    let i = 0;
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      i = key === CODE[i] ? i + 1 : key === CODE[0] ? 1 : 0;
      if (i === CODE.length) {
        i = 0;
        setPieces(makePieces());
        window.setTimeout(() => setPieces(null), 5200);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!pieces || reduce) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[80] overflow-hidden">
      {pieces.map((p) => (
        <motion.svg
          key={p.id}
          viewBox="0 0 24 24"
          width={p.size}
          height={p.size}
          className="absolute top-0 text-accent"
          style={{ left: `${p.x}%` }}
          initial={{ y: "-12vh", rotate: 0, opacity: 0 }}
          animate={{ y: "108vh", x: p.drift, rotate: p.spin, opacity: [0, 1, 1, 0.2] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: [0.3, 0.1, 0.6, 1],
            opacity: { times: [0, 0.08, 0.75, 1], duration: p.duration, delay: p.delay },
          }}
        >
          <path d={p.glyph} fill="currentColor" />
        </motion.svg>
      ))}
    </div>
  );
}
