"use client";

import { Check, Copy } from "lucide-react";
import { useCopy } from "@/lib/useCopy";
import { site } from "@/site.config";
import { cn } from "@/lib/cn";

/**
 * The whole block is the copy target — click anywhere, including the fake pip
 * output. Real command, real clipboard.
 */
export function PipInstall({ className }: { className?: string }) {
  const { copied, copy } = useCopy(site.featured.install);

  return (
    <button
      type="button"
      onClick={copy}
      /* No aria-label: the button's own text is a better accessible name than
         anything I'd invent, and it stays in sync with what's on screen. */
      className={cn(
        "slab slab-hover group block w-full cursor-copy px-4 py-3.5 text-left",
        copied && "border-accent-line",
        className,
      )}
    >
      <div className="flex items-center gap-2.5 text-sm">
        <span aria-hidden className="text-accent">
          $
        </span>
        <code className="text-ink">{site.featured.install}</code>
        <span
          className={cn(
            "ml-auto flex items-center gap-1.5 text-2xs",
            copied ? "text-accent" : "text-dimmer group-hover:text-accent",
          )}
        >
          {copied ? (
            <>
              <Check size={12} strokeWidth={2.5} /> copied
            </>
          ) : (
            <>
              <Copy size={12} /> click to copy
            </>
          )}
        </span>
      </div>

      <div className="mt-2 space-y-0.5 text-2xs text-dimmer" aria-hidden>
        <div>
          Collecting <span className="text-accent/80">sudiviz</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-accent/60">━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
          <span>42 kB · 1.2 MB/s</span>
        </div>
        <div>
          <span className="text-accent/80">Successfully installed</span> sudiviz
        </div>
        <div className="pt-0.5">
          # {site.featured.pitch.toLowerCase()}
        </div>
      </div>

      <span aria-live="polite" className="sr-only">
        {copied ? "copied" : ""}
      </span>
    </button>
  );
}
