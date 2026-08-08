"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "./ui/Container";
import { SectionHead } from "./ui/Prompt";
import { site, type WorkTag } from "@/site.config";
import { cn } from "@/lib/cn";

const FILTERS: { id: WorkTag | "all"; label: string }[] = [
  { id: "all", label: "all" },
  { id: "infra", label: "infra" },
  { id: "ui", label: "ui" },
  { id: "data", label: "data" },
  { id: "oss", label: "oss" },
];

export function Work() {
  const [active, setActive] = useState<WorkTag | "all">("all");
  const rail = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const items = useMemo(
    () => (active === "all" ? site.work : site.work.filter((w) => w.tags.includes(active))),
    [active],
  );

  const nudge = (dir: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 520), behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section className="relative py-16 lg:py-24">
      <Container>
        <SectionHead
          id="work"
          index="01"
          path="work"
          cmd={`ls --tag=${active}`}
          title="work"
          kicker="six years of shipping. one of them paid for by a hackathon."
        />

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2" role="group" aria-label="filter work by discipline">
            {FILTERS.map((f) => {
              const on = active === f.id;
              const count =
                f.id === "all"
                  ? site.work.length
                  : site.work.filter((w) => w.tags.includes(f.id as WorkTag)).length;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setActive(f.id)}
                  aria-pressed={on}
                  className={cn(
                    "flex items-center gap-1.5 border px-3 py-1.5 text-2xs transition-colors",
                    on
                      ? "border-accent-line bg-accent-soft text-accent"
                      : "border-hair text-dim hover:border-hair-strong hover:text-ink",
                  )}
                >
                  <span>--{f.label}</span>
                  <span className={cn("tabular", on ? "text-accent/70" : "text-dimmer")}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="hidden items-center gap-1.5 sm:flex">
            <button
              type="button"
              onClick={() => nudge(-1)}
              aria-label="scroll work left"
              className="grid size-9 place-items-center border border-hair text-dim transition-colors hover:border-accent-line hover:text-accent"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              type="button"
              onClick={() => nudge(1)}
              aria-label="scroll work right"
              className="grid size-9 place-items-center border border-hair text-dim transition-colors hover:border-accent-line hover:text-accent"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Horizontal rail — stays horizontal on mobile, with snap points. */}
        <div
          ref={rail}
          tabIndex={0}
          role="region"
          aria-label="work timeline, scrolls horizontally"
          className="no-bar -mx-5 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:-mx-8 sm:px-8 lg:-mx-14 lg:px-14"
        >
          <AnimatePresence initial={false} mode="popLayout">
            {items.map((w, i) => (
              <motion.article
                key={w.id}
                layout={!reduce}
                initial={reduce ? false : { opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
                className="slab slab-hover flex w-[85vw] shrink-0 snap-start flex-col p-5 sm:w-[380px]"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="tabular text-2xs text-dimmer">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={cn(
                      "text-2xs uppercase tracking-[0.14em]",
                      w.period === "now" ? "text-accent" : "text-dimmer",
                    )}
                  >
                    {w.period === "now" ? "● now" : w.period}
                  </span>
                </div>

                <h3 className="display mt-3 text-[2rem] leading-none text-ink">{w.title}</h3>

                <p className="mt-2 text-2xs text-dim">
                  <span className="text-ink/80">{w.org}</span>
                  <span className="mx-1.5 text-dimmer">/</span>
                  <span>{w.role}</span>
                </p>

                <p className="mt-4 text-xs leading-relaxed text-dim">{w.summary}</p>

                <ul className="mt-4 space-y-1 text-2xs text-dimmer">
                  {w.bullets.map((b) => (
                    <li key={b} className="flex gap-2">
                      <span className="text-accent/60">↳</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
                  {w.tags.map((t) => (
                    <span
                      key={t}
                      className="border border-hair px-2 py-0.5 text-2xs text-dim"
                    >
                      {t}
                    </span>
                  ))}
                  <span className="ml-auto self-end text-2xs text-dimmer">{w.location}</span>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
          <div className="w-2 shrink-0" aria-hidden />
        </div>

        <p className="mt-1 text-2xs text-dimmer">
          drag, scroll, or arrow-key the rail · {items.length} of {site.work.length} shown
        </p>
      </Container>
    </section>
  );
}
