import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Container } from "./ui/Container";
import { SectionHead } from "./ui/Prompt";
import { shortDate } from "@/lib/data";
import { site, type BlogPost } from "@/site.config";

export function Blog({ posts, live }: { posts: BlogPost[]; live: boolean }) {
  return (
    <section className="relative py-16 lg:py-24">
      <Container>
        <SectionHead
          id="writing"
          index="04"
          path="writing"
          cmd="curl -s jsdevsg.medium.com/feed | head"
          title="writing"
          kicker={
            live
              ? "straight off the medium feed. he writes when something is worth writing down."
              : "medium timed out, so here are the ones worth reading anyway."
          }
        />

        <div className="mt-6 grid grid-cols-1 gap-px border border-hair bg-hair md:grid-cols-3">
          {posts.slice(0, 6).map((p, i) => (
            <article key={p.url} className="group flex flex-col bg-bg">
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-full flex-col"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-hair bg-panel">
                  {p.image ? (
                    <Image
                      src={p.image}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover opacity-70 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0"
                    />
                  ) : (
                    <div
                      aria-hidden
                      className="flex h-full items-center justify-center text-4xl text-dimmer"
                    >
                      {"</>"}
                    </div>
                  )}
                  <span className="absolute left-0 top-0 bg-bg/90 px-2 py-1 text-2xs text-dimmer">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <time dateTime={p.date} className="text-2xs text-dimmer">
                    {shortDate(p.date)}
                  </time>
                  <h3 className="mt-2 text-sm leading-snug text-ink transition-colors group-hover:text-accent">
                    {p.title}
                  </h3>
                  <p className="mt-2.5 line-clamp-2 text-2xs leading-relaxed text-dim">
                    {p.preview}
                  </p>
                  <span className="mt-auto flex items-center gap-1.5 pt-5 text-2xs text-dimmer transition-colors group-hover:text-accent">
                    read on medium
                    <ArrowUpRight size={11} />
                  </span>
                </div>
              </a>
            </article>
          ))}
        </div>

        <a
          href={site.blog.profile}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex min-h-9 items-center gap-2 py-1 text-2xs text-dim transition-colors hover:text-accent"
        >
          <span className="text-accent">$</span>
          open medium.com/@jsdevsg
          <ArrowUpRight size={11} />
        </a>
      </Container>
    </section>
  );
}
