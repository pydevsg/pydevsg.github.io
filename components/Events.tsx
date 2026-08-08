import Image from "next/image";
import { ArrowUpRight, MapPin } from "lucide-react";
import { Container } from "./ui/Container";
import { SectionHead } from "./ui/Prompt";
import { Spinner } from "./ui/Spinner";
import { site } from "@/site.config";
import { cn } from "@/lib/cn";

export function Events() {
  return (
    <section className="relative py-16 lg:py-24">
      <Container>
        <SectionHead
          id="events"
          index="05"
          path="events"
          cmd="cat events.ts"
          title="talks"
          kicker="one config file. append to site.config.ts → events and it shows up here."
        />

        <ul className="mt-6 border border-hair">
          {site.events.map((e, i) => {
            const upcoming = e.status === "upcoming";
            const Wrapper = e.url ? "a" : "div";
            return (
              <li key={e.id} className={cn(i > 0 && "border-t border-hair")}>
                <Wrapper
                  {...(e.url
                    ? { href: e.url, target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className={cn(
                    "group grid grid-cols-4 items-start gap-x-6 gap-y-6 p-5 transition-colors md:grid-cols-12 lg:p-7",
                    e.url && "hover:bg-accent-soft/25",
                  )}
                >
                  <div className="col-span-4 md:col-span-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={cn(
                          "flex items-center gap-1.5 border px-2 py-0.5 text-2xs uppercase tracking-[0.12em]",
                          upcoming
                            ? "border-accent-line bg-accent-soft text-accent"
                            : "border-hair text-dimmer",
                        )}
                      >
                        {upcoming && <Spinner interval={140} className="text-accent" />}
                        {e.status}
                      </span>
                      <span className="tabular text-2xs text-dim">{e.when}</span>
                    </div>

                    <h3
                      className={cn(
                        "display mt-3 text-[clamp(2rem,4.5vw,2.75rem)] leading-none transition-colors",
                        e.url ? "text-ink group-hover:text-accent" : "text-ink",
                      )}
                    >
                      {e.name} <span aria-hidden>{e.flag}</span>
                    </h3>

                    <p className="mt-2 flex items-center gap-1.5 text-2xs text-dim">
                      <MapPin size={11} className="text-dimmer" />
                      {e.place}
                    </p>

                    <p className="mt-4 text-xs text-dim">
                      talk: <span className="text-accent">{e.talk}</span>
                    </p>
                    <p className="mt-1 text-2xs text-dimmer">{e.note}</p>

                    {e.url && (
                      <span className="mt-4 inline-flex items-center gap-1.5 text-2xs text-dim transition-colors group-hover:text-accent">
                        <span className="border-b border-hair group-hover:border-accent-line">
                          {e.urlLabel ?? "more"}
                        </span>
                        <ArrowUpRight
                          size={11}
                          className="transition-transform group-hover:-translate-y-0.5"
                        />
                      </span>
                    )}
                  </div>

                  {e.photos && e.photos.length > 0 && (
                    <div className="col-span-4 flex gap-2 md:col-span-6">
                      {e.photos.map((p, n) => (
                        <figure
                          key={p.src}
                          className="relative aspect-[4/3] flex-1 overflow-hidden border border-hair bg-panel"
                        >
                          <Image
                            src={p.src}
                            alt={p.alt}
                            fill
                            sizes="(max-width: 768px) 45vw, 22vw"
                            className="object-cover opacity-80 grayscale transition-all duration-300 group-hover:scale-[1.03] group-hover:opacity-100 group-hover:grayscale-0"
                          />
                          <span className="absolute left-0 top-0 bg-bg/85 px-1.5 py-0.5 text-2xs tracking-widest text-accent/80">
                            {String(n + 1).padStart(2, "0")}
                          </span>
                        </figure>
                      ))}
                    </div>
                  )}
                </Wrapper>
              </li>
            );
          })}
        </ul>

        <p className="mt-3 text-2xs text-dimmer">
          {site.events.length} talks · photos live in public/talks/
        </p>
      </Container>
    </section>
  );
}
