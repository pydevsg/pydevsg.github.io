import { cn } from "@/lib/cn";
import { Typed } from "./Typed";

/**
 * ANSI-ish prompt line that introduces every section:
 *   ~/sudipto/work $ ls --tags
 */
export function PromptLine({
  path,
  cmd,
  className,
  typed = true,
}: {
  path: string;
  cmd: string;
  className?: string;
  typed?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-baseline gap-x-2 font-mono text-2xs sm:text-xs",
        className,
      )}
    >
      <span className="text-dimmer">~/sudipto/</span>
      <span className="-ml-2 text-dim">{path}</span>
      <span className="text-accent">$</span>
      {typed ? (
        <Typed text={cmd} speed={22} className="text-ink/80" caret />
      ) : (
        <span className="text-ink/80">{cmd}</span>
      )}
    </div>
  );
}

export function SectionHead({
  index,
  path,
  cmd,
  title,
  kicker,
  id,
}: {
  index: string;
  path: string;
  cmd: string;
  title: string;
  kicker?: string;
  id?: string;
}) {
  return (
    <header id={id} className="scroll-mt-24">
      <PromptLine path={path} cmd={cmd} />
      <div className="mt-3 flex items-end justify-between gap-6 border-b border-hair pb-3">
        <h2 className="display text-[clamp(2.25rem,7vw,4.5rem)] text-ink">
          {title}
          <span className="ml-2 align-super font-mono text-2xs tracking-widest text-dimmer">
            {index}
          </span>
        </h2>
        {kicker && (
          <p className="hidden max-w-[26ch] pb-2 text-right text-2xs leading-relaxed text-dim sm:block">
            {kicker}
          </p>
        )}
      </div>
    </header>
  );
}
