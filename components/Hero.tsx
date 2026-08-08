"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, MapPin } from "lucide-react";
import { Container } from "./ui/Container";
import { Typed } from "./ui/Typed";
import { BootPanel } from "./BootPanel";
import { PipInstall } from "./PipInstall";
import { BRAND_ICONS, type BrandKey } from "./ui/Brand";
import { site } from "@/site.config";

function openPalette() {
  window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
}

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <Container as="header" className="relative pb-16 pt-24 sm:pt-28 lg:pb-24 lg:pt-32">
      <div className="grid grid-cols-4 gap-x-6 gap-y-12 md:grid-cols-12">
        <div className="col-span-4 md:col-span-7 lg:col-span-7">
          <div className="flex items-center gap-2 text-2xs text-dim">
            <MapPin size={12} className="text-accent" />
            <span>{site.location.toLowerCase()}</span>
            <span className="text-dimmer">·</span>
            <span>
              {site.role.toLowerCase()} @ {site.company}
            </span>
          </div>

          {/* Optical alignment: Instrument Serif carries left side-bearing, so a
              hair of negative indent lines the S up with the prompt above it. */}
          <h1 className="display -ml-[0.055em] mt-5 text-[clamp(3.25rem,11vw,8rem)] text-ink">
            <span className="block">Sudipto</span>
            <span className="flex flex-wrap items-baseline gap-x-4">
              <span>Ghosh</span>
              <span
                aria-hidden
                className="font-mono text-[0.15em] tracking-[0.2em] text-accent"
              >
                $_
              </span>
            </span>
          </h1>

          <p className="mt-6 max-w-[46ch] text-sm text-dim sm:text-[15px]">
            <Typed text={site.tagline} speed={22} onView={false} delay={900} caret />
          </p>

          <ul className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs">
            {site.socials.map((s, i) => {
              const Icon = BRAND_ICONS[s.key as BrandKey];
              return (
                <motion.li
                  key={s.key}
                  initial={reduce ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3 + i * 0.07, duration: 0.3 }}
                >
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex min-h-9 items-center gap-2 py-1 text-dim transition-colors hover:text-accent"
                  >
                    <Icon size={14} className="transition-transform group-hover:-translate-y-0.5" />
                    <span className="border-b border-transparent group-hover:border-accent-line">
                      {s.label}
                    </span>
                  </a>
                </motion.li>
              );
            })}
          </ul>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={openPalette}
              className="slab slab-hover flex items-center gap-2 px-4 py-2.5 text-xs text-ink"
            >
              <span className="text-accent">⌘</span>
              <span>K</span>
              <span className="mx-1 h-3 w-px bg-hair-strong" aria-hidden />
              <span className="text-dim">navigate everything</span>
            </button>
            <a
              href="#sudiviz"
              className="group flex items-center gap-2 px-1 py-2.5 text-xs text-dim transition-colors hover:text-accent"
            >
              <ArrowDown size={13} className="transition-transform group-hover:translate-y-0.5" />
              <span className="border-b border-hair group-hover:border-accent-line">
                see sudiviz
              </span>
            </a>
          </div>
        </div>

        <div className="col-span-4 md:col-span-5 md:col-start-8 md:mt-1">
          <BootPanel />
          <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-2xs text-dimmer">
            {site.stack.map((t) => (
              <li key={t} className="before:mr-1 before:text-accent/50 before:content-['·']">
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-4 -mt-4 md:col-span-7 lg:col-span-6">
          <PipInstall />
        </div>
      </div>
    </Container>
  );
}
