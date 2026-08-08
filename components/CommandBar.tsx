"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, CornerDownLeft, Hash, Mail, Palette, TerminalSquare } from "lucide-react";
import { SECTIONS } from "@/lib/sections";
import { site, type Accent } from "@/site.config";
import { applyAccent } from "./AccentToggle";
import { cn } from "@/lib/cn";

type Item = {
  id: string;
  label: string;
  hint: string;
  kind: "section" | "link" | "joke" | "action";
  run: () => void | string;
};

function scrollTo(id: string) {
  const el = id === "top" ? document.body : document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  // Move focus so keyboard users land where they navigated.
  if (el instanceof HTMLElement && id !== "top") {
    el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  }
}

export function CommandBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const [log, setLog] = useState<{ cmd: string; out: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const restoreFocus = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion();

  const items = useMemo<Item[]>(() => {
    const sections: Item[] = SECTIONS.map((s) => ({
      id: `go:${s.id}`,
      label: s.label,
      hint: s.hint,
      kind: "section",
      run: () => scrollTo(s.id),
    }));

    const links: Item[] = [
      ...site.socials.map((s) => ({
        id: `open:${s.key}`,
        label: `open ${s.label}`,
        hint: s.url.replace(/^https?:\/\/(www\.)?/, ""),
        kind: "link" as const,
        run: () => {
          window.open(s.url, "_blank", "noopener,noreferrer");
        },
      })),
      {
        id: "open:pip",
        label: "copy pip install sudiviz",
        hint: "straight to the clipboard",
        kind: "action",
        run: () => {
          void navigator.clipboard?.writeText(site.featured.install);
          return `copied → ${site.featured.install}`;
        },
      },
      {
        id: "mail",
        label: "email sudipto",
        hint: site.email,
        kind: "action",
        run: () => {
          void navigator.clipboard?.writeText(site.email);
          return `copied → ${site.email}`;
        },
      },
      {
        id: "accent",
        label: "toggle accent",
        hint: "acid green ⇄ hot magenta",
        kind: "action",
        run: () => {
          const next: Accent =
            document.documentElement.dataset.accent === "magenta" ? "acid" : "magenta";
          applyAccent(next);
          return `accent set → ${next}`;
        },
      },
    ];

    const jokes: Item[] = site.jokeCommands.map((j) => ({
      id: `joke:${j.cmd}`,
      label: j.cmd,
      hint: "run it",
      kind: "joke",
      run: () => j.out,
    }));

    return [...sections, ...links, ...jokes];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (i) => i.label.toLowerCase().includes(q) || i.hint.toLowerCase().includes(q),
    );
  }, [items, query]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setCursor(0);
    restoreFocus.current?.focus?.();
  }, []);

  const launch = useCallback(
    (item?: Item) => {
      if (!item) return;
      const out = item.run();
      if (typeof out === "string") {
        setLog((l) => [...l.slice(-3), { cmd: item.label, out }]);
        setQuery("");
        setCursor(0);
        return;
      }
      close();
    },
    [close],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        restoreFocus.current = document.activeElement as HTMLElement;
        setOpen((o) => !o);
        return;
      }
      if (e.key === "Escape" && open) {
        e.preventDefault();
        close();
        return;
      }
      // Bare "/" opens it too, the way every good tool does.
      const tag = (e.target as HTMLElement)?.tagName;
      if (e.key === "/" && !open && tag !== "INPUT" && tag !== "TEXTAREA") {
        e.preventDefault();
        restoreFocus.current = document.activeElement as HTMLElement;
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  useEffect(() => {
    if (open) {
      const id = window.setTimeout(() => inputRef.current?.focus(), 10);
      document.documentElement.style.overflow = "hidden";
      return () => {
        window.clearTimeout(id);
        document.documentElement.style.overflow = "";
      };
    }
  }, [open]);

  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-idx="${cursor}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [cursor]);

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => (filtered.length ? (c + 1) % filtered.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => (filtered.length ? (c - 1 + filtered.length) % filtered.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      launch(filtered[cursor]);
    } else if (e.key === "Tab") {
      // Nothing else is focusable in here; keep the ring inside the palette.
      e.preventDefault();
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          restoreFocus.current = document.activeElement as HTMLElement;
          setOpen(true);
        }}
        className="group fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 border border-hair-strong bg-panel/95 px-3.5 py-2 text-2xs text-dim backdrop-blur transition-colors hover:border-accent-line hover:text-ink sm:bottom-6 sm:left-auto sm:right-6 sm:translate-x-0"
      >
        <TerminalSquare size={13} className="text-accent" />
        <span className="hidden sm:inline">press</span>
        <kbd className="border border-hair-strong px-1.5 py-px font-mono text-ink/80 group-hover:border-accent-line">
          ⌘K
        </kbd>
        <span>to navigate</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[12vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.12 }}
          >
            <div
              className="absolute inset-0 bg-bg/85 backdrop-blur-[2px]"
              onClick={close}
              aria-hidden
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="command palette"
              initial={{ y: reduce ? 0 : -8, scale: reduce ? 1 : 0.99 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: reduce ? 0 : -8, opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.16, ease: [0.2, 0.8, 0.2, 1] }}
              className="relative w-full max-w-2xl border border-hair-strong bg-panel shadow-[0_40px_120px_rgba(0,0,0,0.8)]"
            >
              <div className="flex items-center gap-2 border-b border-hair px-4 py-3">
                <span className="text-accent">$</span>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setCursor(0);
                  }}
                  onKeyDown={onInputKey}
                  role="combobox"
                  aria-expanded
                  aria-controls="cmdk-list"
                  aria-activedescendant={filtered[cursor] ? `cmdk-${cursor}` : undefined}
                  aria-label="type a command or search sections"
                  placeholder="type a section, or try `sudo hire me`"
                  spellCheck={false}
                  autoComplete="off"
                  className="w-full bg-transparent text-sm text-ink placeholder:text-dimmer focus:outline-none"
                />
                <kbd className="hidden border border-hair px-1.5 text-2xs text-dimmer sm:block">
                  esc
                </kbd>
              </div>

              {log.length > 0 && (
                <div className="border-b border-hair bg-bg/60 px-4 py-2.5 text-2xs">
                  {log.map((l, i) => (
                    <div key={i} className="flex flex-wrap gap-x-2">
                      <span className="text-dimmer">$ {l.cmd}</span>
                      <span className="text-accent/90">{l.out}</span>
                    </div>
                  ))}
                </div>
              )}

              <ul
                id="cmdk-list"
                ref={listRef}
                role="listbox"
                aria-label="commands"
                className="no-bar max-h-[46vh] overflow-y-auto py-1.5"
              >
                {filtered.length === 0 && (
                  <li className="px-4 py-6 text-center text-2xs text-dimmer">
                    command not found: {query}
                  </li>
                )}
                {filtered.map((item, i) => (
                  <li key={item.id} role="none">
                    <button
                      type="button"
                      id={`cmdk-${i}`}
                      data-idx={i}
                      role="option"
                      aria-selected={i === cursor}
                      tabIndex={-1}
                      onMouseEnter={() => setCursor(i)}
                      onClick={() => launch(item)}
                      className={cn(
                        "flex w-full items-center gap-3 px-4 py-2 text-left text-xs",
                        i === cursor ? "bg-accent-soft text-ink" : "text-dim",
                      )}
                    >
                      <span className={cn(i === cursor ? "text-accent" : "text-dimmer")}>
                        {item.kind === "section" ? (
                          <Hash size={12} />
                        ) : item.kind === "link" ? (
                          <ArrowUpRight size={12} />
                        ) : item.kind === "joke" ? (
                          <TerminalSquare size={12} />
                        ) : item.id === "accent" ? (
                          <Palette size={12} />
                        ) : (
                          <Mail size={12} />
                        )}
                      </span>
                      <span className={cn("shrink-0", i === cursor && "text-accent")}>
                        {item.label}
                      </span>
                      <span className="ants h-px flex-1 opacity-40" aria-hidden />
                      <span className="hidden truncate text-2xs text-dimmer sm:block">
                        {item.hint}
                      </span>
                      {i === cursor && <CornerDownLeft size={12} className="text-accent" />}
                    </button>
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between border-t border-hair px-4 py-2 text-2xs text-dimmer">
                <span>↑↓ move · ⏎ run · esc close</span>
                <span className="hidden sm:inline">{site.motto}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
