"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Typed } from "./ui/Typed";
import { Spinner } from "./ui/Spinner";
import { site } from "@/site.config";
import { cn } from "@/lib/cn";

type Unit = {
  name: string;
  detail: string;
  state: "ok" | "running" | "queued";
};

/**
 * The boot sequence, evolved: instead of generic build steps it reports the
 * things that are actually in production, systemd-style. The last unit is the
 * joke — it never leaves the queue.
 */
const UNITS: Unit[] = [
  { name: "subscriptions-mgmt.service", detail: "10M+ subscriptions", state: "ok" },
  { name: "aisearch.service", detail: "100K+ users · −85% retrieval", state: "ok" },
  { name: "eks-multi-region.target", detail: "london · failover armed", state: "ok" },
  { name: "sudiviz.timer", detail: "13K+ downloads", state: "ok" },
  { name: "integration-tests.job", detail: "flaky, allegedly", state: "running" },
  { name: "gta-vi.deploy", detail: "blocked on rockstar", state: "queued" },
];

const TAG = {
  ok: { label: "  ok  ", cls: "text-accent" },
  running: { label: " run  ", cls: "text-ink/70" },
  queued: { label: "queued", cls: "text-dimmer" },
} as const;

export function BootPanel() {
  const reduce = useReducedMotion();
  const [pct, setPct] = useState(reduce ? 87 : 0);
  const [revealed, setRevealed] = useState(reduce ? UNITS.length : 0);
  const [state, setState] = useState(0);

  // Progress stalls at 87%. It is never finishing, and that's the point.
  useEffect(() => {
    if (reduce) return;
    let frame = 0;
    const start = performance.now() + 500;
    const tick = (now: number) => {
      const t = Math.max(0, Math.min(1, (now - start) / 2400));
      setPct(Math.round(87 * (1 - Math.pow(1 - t, 2))));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduce]);

  useEffect(() => {
    if (reduce) return;
    const timers = UNITS.map((_, i) =>
      window.setTimeout(() => setRevealed(i + 1), 700 + i * 260),
    );
    return () => timers.forEach(window.clearTimeout);
  }, [reduce]);

  // Cycle the "hopefully" pill, same gag as the old placeholder.
  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(
      () => setState((s) => (s + 1) % site.sublineStates.length),
      2400,
    );
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <div className="slab border-hair bg-panel/70">
      <div className="flex items-center gap-2 border-b border-hair px-3 py-2">
        <span className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-[#FF5F57]" />
          <span className="size-2.5 rounded-full bg-[#FEBC2E]" />
          <span className="size-2.5 rounded-full bg-[#28C840]" />
        </span>
        <span className="mx-auto text-2xs text-dimmer">{site.domain} — zsh</span>
        <span className="text-2xs text-dimmer">⌘K</span>
      </div>

      <div className="space-y-2.5 px-3.5 py-3.5 sm:px-4">
        <div className="flex items-baseline gap-2 text-xs">
          <span className="text-accent">$</span>
          <Typed text="sudipto --status --verbose" speed={38} onView={false} />
        </div>

        <div className="flex items-center gap-2 text-2xs">
          <span className="text-accent">●</span>
          <span className="text-ink/90">portfolio.v2</span>
          <span className="text-dimmer">{`// ${site.location.toLowerCase()}`}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="w-16 shrink-0 text-2xs text-dimmer">booting</span>
          <div className="h-[3px] flex-1 bg-hair">
            <div
              className="h-full bg-accent transition-[width] duration-100"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="tabular w-9 shrink-0 text-right text-2xs text-dim">{pct}%</span>
        </div>

        <ul className="space-y-1 pt-1 text-2xs">
          {UNITS.map((u, i) => (
            <motion.li
              key={u.name}
              initial={reduce ? false : { opacity: 0, x: -4 }}
              animate={i < revealed ? { opacity: 1, x: 0 } : { opacity: 0, x: -4 }}
              transition={{ duration: 0.18 }}
              className="flex items-center gap-2"
            >
              <span className="text-dimmer">[</span>
              <span className={cn("shrink-0 whitespace-pre", TAG[u.state].cls)}>
                {TAG[u.state].label}
              </span>
              <span className="text-dimmer">]</span>
              <span className="truncate text-ink/70">{u.name}</span>
              <span className="ants h-px min-w-4 flex-1 opacity-50" aria-hidden />
              <span className="hidden shrink-0 text-dimmer sm:block">{u.detail}</span>
              {u.state === "running" && <Spinner className="shrink-0" />}
            </motion.li>
          ))}
        </ul>

        <div className="flex flex-wrap items-center gap-2 border-t border-hair pt-2.5 text-2xs">
          <span className="text-accent">→</span>
          <span className="text-dim">{site.subline}</span>
          <span className="border border-accent-line bg-accent-soft px-1.5 py-px uppercase tracking-[0.14em] text-accent">
            {site.sublineStates[state]}
          </span>
        </div>
      </div>
    </div>
  );
}
