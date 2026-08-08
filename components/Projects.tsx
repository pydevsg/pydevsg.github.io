"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Pin, Star } from "lucide-react";
import { Container } from "./ui/Container";
import { SectionHead } from "./ui/Prompt";
import { langColor } from "@/lib/lang";
import { site, type Repo } from "@/site.config";
import { cn } from "@/lib/cn";

const FIRST_PAGE = 9;

export function Projects({ repos, live }: { repos: Repo[]; live: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const reduce = useReducedMotion();
  const shown = expanded ? repos : repos.slice(0, FIRST_PAGE);
  const pinned = new Set(site.pinnedRepos.map((n) => n.toLowerCase()));

  return (
    <section className="relative py-16 lg:py-24">
      <Container>
        <SectionHead
          id="projects"
          index="03"
          path="projects"
          cmd={`gh repo list ${site.handle} --no-forks`}
          title="other things"
          kicker={
            live
              ? "fetched live from the github api, cached for six hours."
              : "github rate-limited us, so these are the cached ones."
          }
        />

        <div className="mt-6 grid grid-cols-1 gap-px border border-hair bg-hair sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence initial={false}>
            {shown.map((r, i) => (
              <motion.a
                key={r.name}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                layout={!reduce}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduce ? undefined : { opacity: 0 }}
                transition={{ duration: 0.2, delay: reduce ? 0 : Math.min(i, 8) * 0.015 }}
                className="group relative flex min-h-[164px] flex-col bg-bg p-5 transition-colors hover:bg-panel"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="flex items-center gap-2 text-sm text-ink transition-colors group-hover:text-accent">
                    {pinned.has(r.name.toLowerCase()) && (
                      <Pin size={11} className="shrink-0 rotate-45 text-accent" aria-label="pinned" />
                    )}
                    {r.name}
                  </h3>
                  <ArrowUpRight
                    size={14}
                    className="shrink-0 text-dimmer transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                  />
                </div>

                <p className="mt-2.5 line-clamp-3 text-2xs leading-relaxed text-dim">
                  {r.description}
                </p>

                <div className="mt-auto flex items-center gap-4 pt-5 text-2xs text-dimmer">
                  {r.language && (
                    <span className="flex items-center gap-1.5">
                      <span
                        className="size-2 rounded-full"
                        style={{ background: langColor(r.language) }}
                        aria-hidden
                      />
                      {r.language}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Star size={10} className={cn(r.stars > 0 && "text-accent")} />
                    <span className="tabular">{r.stars}</span>
                  </span>
                </div>
              </motion.a>
            ))}
          </AnimatePresence>
        </div>

        {repos.length > FIRST_PAGE && (
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            aria-expanded={expanded}
            className="mt-3 flex min-h-9 items-center gap-2 py-1 text-2xs text-dim transition-colors hover:text-accent"
          >
            <span className="text-accent">$</span>
            {expanded
              ? "gh repo list --limit 9"
              : `gh repo list --limit ${repos.length}  # ${repos.length - FIRST_PAGE} more`}
          </button>
        )}
      </Container>
    </section>
  );
}
