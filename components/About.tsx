import { CircleDot, Guitar, Trophy } from "lucide-react";
import { Container } from "./ui/Container";
import { SectionHead } from "./ui/Prompt";
import { site } from "@/site.config";

const ICONS = { trophy: Trophy, ball: CircleDot, guitar: Guitar } as const;

export function About() {
  return (
    <section className="relative py-16 lg:py-24">
      <Container>
        <SectionHead
          id="about"
          index="07"
          path="about"
          cmd="man sudipto | tail -12"
          title={site.about.line}
        />

        <div className="mt-8 grid grid-cols-4 gap-x-6 gap-y-8 md:grid-cols-12">
          <p className="col-span-4 max-w-[62ch] text-[15px] leading-relaxed text-dim md:col-span-7">
            {site.about.body}
          </p>

          <ul className="col-span-4 space-y-px md:col-span-4 md:col-start-9">
            {site.about.interests.map((it) => {
              const Icon = ICONS[it.icon as keyof typeof ICONS];
              return (
                <li
                  key={it.label}
                  className="group flex items-center gap-3 border border-hair px-4 py-3 transition-colors hover:border-accent-line"
                >
                  <Icon size={14} className="shrink-0 text-accent" />
                  <span className="text-xs text-ink">{it.label}</span>
                  <span className="ants h-px flex-1 opacity-40" aria-hidden />
                  <span className="text-2xs text-dimmer">{it.note}</span>
                </li>
              );
            })}
          </ul>

          <div className="col-span-4 md:col-span-7">
            <div className="flex flex-wrap gap-2">
              {site.certs.map((c) => (
                <span
                  key={c.short}
                  title={c.label}
                  className="border border-hair px-2.5 py-1 text-2xs text-dim"
                >
                  {c.short}
                </span>
              ))}
              <span className="border border-hair px-2.5 py-1 text-2xs text-dim">
                gsoc-mentor ×3
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
