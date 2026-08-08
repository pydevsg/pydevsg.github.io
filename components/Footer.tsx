import { ArrowUpRight } from "lucide-react";
import { Container } from "./ui/Container";
import { PromptLine } from "./ui/Prompt";
import { CopyChip } from "./ui/CopyChip";
import { AccentToggle } from "./AccentToggle";
import { BRAND_ICONS, type BrandKey } from "./ui/Brand";
import { site } from "@/site.config";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="relative scroll-mt-20 border-t border-hair pt-16 pb-28">
      <Container>
        <PromptLine path="contact" cmd="mail -s 'hello' sudipto" />

        <div className="mt-6 grid grid-cols-4 gap-x-6 gap-y-10 md:grid-cols-12">
          <div className="col-span-4 md:col-span-7">
            <h2 className="display text-[clamp(2.5rem,8vw,5rem)] text-ink">
              say something
            </h2>
            <CopyChip
              value={site.email}
              label="email address"
              className="mt-4 text-sm text-dim sm:text-base"
            >
              <span className="border-b border-hair pb-0.5">{site.email}</span>
            </CopyChip>
            <p className="mt-3 max-w-[44ch] text-2xs text-dimmer">
              click the address to copy it. replies are faster than a cold start.
            </p>
          </div>

          <nav className="col-span-4 md:col-span-4 md:col-start-9" aria-label="social links">
            <ul className="space-y-px">
              {site.socials.map((s) => {
                const Icon = BRAND_ICONS[s.key as BrandKey];
                return (
                  <li key={s.key}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 border border-hair px-4 py-2.5 text-xs text-dim transition-colors hover:border-accent-line hover:text-ink"
                    >
                      <Icon size={13} className="shrink-0 text-dimmer group-hover:text-accent" />
                      <span>{s.label}</span>
                      <span className="ants h-px flex-1 opacity-40" aria-hidden />
                      <span className="text-2xs text-dimmer">{s.handle}</span>
                      <ArrowUpRight
                        size={12}
                        className="shrink-0 text-dimmer transition-transform group-hover:-translate-y-0.5 group-hover:text-accent"
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-hair pt-5 text-2xs text-dimmer">
          <p>
            © {year} {site.domain} · built while shipping
          </p>
          <div className="flex items-center gap-4">
            {/* Konami hint, quiet enough to be a reward rather than an instruction. */}
            <span className="hidden sm:inline" title="↑↑↓↓←→←→BA">
              ↑↑↓↓←→←→ba
            </span>
            <span className="hidden sm:inline">·</span>
            <span>accent</span>
            <AccentToggle />
          </div>
        </div>
      </Container>
    </footer>
  );
}
