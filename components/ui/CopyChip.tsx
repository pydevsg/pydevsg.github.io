"use client";

import { Check, Copy } from "lucide-react";
import { useCopy } from "@/lib/useCopy";
import { cn } from "@/lib/cn";

/** Inline copy-to-clipboard target. Used for the email and the pip command. */
export function CopyChip({
  value,
  label,
  className,
  children,
}: {
  value: string;
  label: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const { copied, copy } = useCopy(value);

  return (
    <button
      type="button"
      onClick={copy}
      /* The accessible name has to contain the visible text, so the value leads. */
      aria-label={copied ? `${value} copied to clipboard` : `copy ${value} — ${label}`}
      className={cn(
        "group inline-flex items-center gap-2 text-left transition-colors",
        copied ? "text-accent" : "hover:text-accent",
        className,
      )}
    >
      {children ?? value}
      <span className="shrink-0 text-dim transition-colors group-hover:text-accent">
        {copied ? <Check size={13} strokeWidth={2.5} /> : <Copy size={13} strokeWidth={2} />}
      </span>
      <span aria-live="polite" className="sr-only">
        {copied ? "copied" : ""}
      </span>
    </button>
  );
}
