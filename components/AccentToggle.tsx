"use client";

import { useEffect, useState } from "react";
import type { Accent } from "@/site.config";
import { site } from "@/site.config";
import { cn } from "@/lib/cn";

export const ACCENT_KEY = "sudipto:accent";

export function applyAccent(a: Accent) {
  document.documentElement.dataset.accent = a;
  try {
    localStorage.setItem(ACCENT_KEY, a);
  } catch {
    /* private mode — the choice just won't persist */
  }
}

/** Two swatches. Ships in acid; magenta is one click away. */
export function AccentToggle({ className }: { className?: string }) {
  const [accent, setAccent] = useState<Accent>(site.accent);

  useEffect(() => {
    const current = document.documentElement.dataset.accent as Accent | undefined;
    if (current) setAccent(current);
  }, []);

  const set = (a: Accent) => {
    setAccent(a);
    applyAccent(a);
  };

  return (
    <div
      className={cn("flex items-center gap-1.5", className)}
      role="group"
      aria-label="accent colour"
    >
      {(["acid", "magenta"] as const).map((a) => (
        <button
          key={a}
          type="button"
          onClick={() => set(a)}
          aria-pressed={accent === a}
          aria-label={`${a} accent`}
          title={`${a} accent`}
          className="grid size-7 place-items-center"
        >
          <span
            aria-hidden
            className={cn(
              "size-3.5 border transition-transform",
              accent === a ? "border-ink/60 scale-110" : "border-hair-strong",
            )}
            style={{ background: a === "acid" ? "#B8FF3A" : "#FF3AA5" }}
          />
        </button>
      ))}
    </div>
  );
}
