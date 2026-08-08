import Image from "next/image";
import { ArrowUpRight, GitFork, Star } from "lucide-react";
import { Container } from "./ui/Container";
import { PromptLine } from "./ui/Prompt";
import { CountUp } from "./CountUp";
import { SudivizDemo } from "./SudivizDemo";
import { PipInstall } from "./PipInstall";
import { site } from "@/site.config";
import type { Sudiviz as SudivizStats } from "@/lib/data";

/** `# comment` above `$ command`, the way you'd actually paste it. */
function CommandRow({ comment, cmd }: { comment: string; cmd: string }) {
  return (
    <li className="group px-6 py-3 transition-colors hover:bg-accent-soft/40 lg:px-9">
      <p className="text-2xs text-dimmer">
        <span className="text-dim/60"># </span>
        {comment}
      </p>
      <div className="mt-0.5 flex items-baseline gap-2">
        <span className="text-accent">$</span>
        <code className="text-xs text-ink transition-colors group-hover:text-accent">{cmd}</code>
      </div>
    </li>
  );
}

export function Sudiviz({ stats }: { stats: SudivizStats }) {
  const f = site.featured;

  return (
    <section id="sudiviz" className="relative isolate scroll-mt-20 py-16 lg:py-24">
      {/* The graph itself, shot off the projectors at the AWS talk, run
          full-bleed behind the slab so the section glows from underneath. */}
      {f.backdrop && (
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <Image
            src={f.backdrop}
            alt=""
            fill
            sizes="100vw"
            priority={false}
            className="scale-110 object-cover opacity-[0.38] saturate-[0.4]"
            style={{
              maskImage:
                "radial-gradient(115% 85% at 55% 45%, #000 5%, rgba(0,0,0,0.5) 50%, transparent 82%)",
              WebkitMaskImage:
                "radial-gradient(115% 85% at 55% 45%, #000 5%, rgba(0,0,0,0.5) 50%, transparent 82%)",
            }}
          />
          <div className="absolute inset-0 bg-bg/45" />
        </div>
      )}

      <Container>
        <PromptLine path="projects" cmd="cat sudiviz/README.md" />

        {/* Hero slab: hard border, zero radius, its own visual weight. */}
        <div className="relative mt-4 overflow-hidden border border-hair-strong bg-bg/80">
          <div className="relative grid grid-cols-4 md:grid-cols-12">
            <div className="col-span-4 border-hair p-6 md:col-span-6 md:border-r lg:p-9">
              <div className="flex flex-wrap items-center gap-2 text-2xs">
                <span className="border border-accent-line bg-accent-soft px-2 py-1 uppercase tracking-[0.12em] text-accent">
                  {f.badge}
                </span>
              </div>

              <h2 className="display mt-6 text-[clamp(3rem,10vw,6.5rem)] text-ink">{f.name}</h2>

              <p className="accent-glow mt-2 text-sm sm:text-base">{f.pitch}</p>

              <p className="mt-5 max-w-[52ch] text-xs leading-relaxed text-dim sm:text-[13.5px]">
                {f.blurb}
              </p>

              <dl className="mt-8 grid grid-cols-2 gap-px border border-hair bg-hair sm:grid-cols-4">
                <div className="bg-bg px-3 py-3">
                  <dd className="display text-2xl text-accent">
                    <CountUp value={stats.allTime} short suffix="+" />
                  </dd>
                  <dt className="mt-0.5 text-2xs text-dimmer">downloads</dt>
                </div>
                <div className="bg-bg px-3 py-3">
                  <dd className="display text-2xl text-ink">
                    <CountUp value={stats.lastMonth} />
                  </dd>
                  <dt className="mt-0.5 text-2xs text-dimmer">last 30 days</dt>
                </div>
                <div className="bg-bg px-3 py-3">
                  <dd className="display flex items-center gap-1.5 text-2xl text-ink">
                    <Star size={14} className="text-accent" />
                    <CountUp value={stats.stars} />
                  </dd>
                  <dt className="mt-0.5 text-2xs text-dimmer">stars</dt>
                </div>
                <div className="bg-bg px-3 py-3">
                  <dd className="display flex items-center gap-1.5 text-2xl text-ink">
                    <GitFork size={14} className="text-accent" />
                    <CountUp value={stats.forks} />
                  </dd>
                  <dt className="mt-0.5 text-2xs text-dimmer">forks</dt>
                </div>
              </dl>

              <p className="mt-2 text-2xs text-dimmer">
                {stats.githubLive && stats.pypiLive
                  ? "live from pypistats + github · cached 6h"
                  : stats.githubLive
                    ? "stars live from github · downloads cached (pypistats rate limit)"
                    : "cached numbers — upstream apis were unreachable"}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-4">
                <a
                  href={f.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="slab slab-hover flex items-center gap-2 px-4 py-2.5 text-xs text-ink"
                >
                  source on github
                  <ArrowUpRight size={13} className="text-accent" />
                </a>
                <a
                  href={f.pypi}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-9 items-center gap-1.5 px-1 text-xs text-dim transition-colors hover:text-accent"
                >
                  <span className="border-b border-hair hover:border-accent-line">pypi</span>
                  <ArrowUpRight size={12} />
                </a>
              </div>
            </div>

            <div className="col-span-4 flex flex-col md:col-span-6">
              <div className="relative aspect-[560/320] w-full border-b border-hair bg-bg">
                {f.demo ? (
                  <Image
                    src={f.demo}
                    alt="sudiviz mapping a live AWS account"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    unoptimized={f.demo.endsWith(".gif")}
                  />
                ) : (
                  <SudivizDemo />
                )}
              </div>

              <ul className="divide-y divide-hair">
                {f.features.map((c) => (
                  <CommandRow key={c.cmd} comment={c.comment} cmd={c.cmd} />
                ))}
              </ul>
            </div>

            {/* MCP server — the agentic half, given its own bay across the slab. */}
            <div className="col-span-4 border-t border-hair p-6 md:col-span-7 md:border-r lg:p-9">
              <div className="flex flex-wrap items-baseline gap-3">
                <h3 className="display text-[2rem] leading-none text-ink">{f.mcp.title}</h3>
                <span className="border border-hair px-2 py-0.5 text-2xs uppercase tracking-[0.12em] text-accent">
                  {f.mcp.tag}
                </span>
              </div>

              <p className="mt-4 max-w-[58ch] text-xs leading-relaxed text-dim">{f.mcp.blurb}</p>

              <div className="mt-5 flex flex-wrap gap-1.5">
                {f.mcp.clients.map((c) => (
                  <span key={c} className="border border-hair px-2 py-0.5 text-2xs text-dim">
                    {c}
                  </span>
                ))}
              </div>

              <div className="mt-6 border border-hair bg-bg/70">
                <div className="border-b border-hair px-4 py-2.5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-accent">$</span>
                    <code className="text-xs text-ink">{f.mcp.install}</code>
                  </div>
                </div>
                <ul className="divide-y divide-hair">
                  {f.mcp.commands.map((c) => (
                    <li key={c.cmd} className="px-4 py-2.5">
                      <p className="text-2xs text-dimmer">
                        <span className="text-dim/60"># </span>
                        {c.comment}
                      </p>
                      <div className="mt-0.5 flex items-baseline gap-2">
                        <span className="text-accent">$</span>
                        <code className="text-xs text-ink">{c.cmd}</code>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="col-span-4 flex flex-col justify-end border-t border-hair p-6 md:col-span-5 lg:p-9">
              <p className="mb-3 text-2xs text-dimmer">everything, in one extra:</p>
              <PipInstall />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
