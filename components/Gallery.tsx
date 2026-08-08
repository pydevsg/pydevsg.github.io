import Image from "next/image";
import { Container } from "./ui/Container";
import { SectionHead } from "./ui/Prompt";
import { site, type GalleryTile } from "@/site.config";
import { cn } from "@/lib/cn";

function Frame({
  tile,
  n,
  className,
}: {
  tile: GalleryTile;
  n: number;
  className?: string;
}) {
  const id = `${tile.roll}${String(n).padStart(2, "0")}`;

  return (
    <figure
      className={cn(
        "group relative bg-panel transition-transform duration-200 hover:-rotate-[0.6deg] hover:scale-[1.015]",
        className,
      )}
    >
      <div className="relative h-full w-full overflow-hidden border border-hair">
        {tile.src ? (
          <Image
            src={tile.src}
            alt={tile.caption}
            fill
            sizes="(max-width: 640px) 70vw, 320px"
            className="object-cover opacity-85 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0"
          />
        ) : (
          <div
            aria-hidden
            className="flex h-full w-full flex-col items-center justify-center gap-1.5"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, rgba(237,234,224,0.045) 0 8px, transparent 8px 16px)",
            }}
          >
            <span className="text-lg text-dimmer/70">＋</span>
            <span className="text-2xs tracking-[0.14em] text-dimmer">unexposed</span>
          </div>
        )}

        {/* contact-sheet numbering, always on top of the frame */}
        <span className="absolute left-0 top-0 bg-bg/85 px-1.5 py-0.5 text-2xs tracking-widest text-accent/80">
          {id}
        </span>

        <figcaption className="absolute inset-x-0 bottom-0 translate-y-full bg-bg/90 px-2 py-1.5 text-2xs text-dim transition-transform duration-200 group-hover:translate-y-0">
          {tile.caption}
        </figcaption>
      </div>
    </figure>
  );
}

/** Perforations, so the strip reads as film and not as a row of divs. */
function Sprockets({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("h-3.5 w-full", className)}
      style={{
        backgroundImage:
          "repeating-linear-gradient(90deg, transparent 0 8px, rgba(237,234,224,0.13) 8px 20px, transparent 20px 28px)",
      }}
    />
  );
}

export function Gallery() {
  const { tiles, layout } = site.gallery;

  return (
    <section className="relative py-16 lg:py-24">
      <Container>
        <SectionHead
          id="gallery"
          index="06"
          path="gallery"
          cmd="ls -la gallery/ | wc -l"
          title="contact sheet"
          kicker="drop jpgs into public/gallery/ and point site.config.ts → gallery.tiles at them."
        />
      </Container>

      {layout === "bento" ? (
        <Container className="mt-6">
          <div className="grid auto-rows-[130px] grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {tiles.map((t, i) => (
              <Frame
                key={i}
                tile={t}
                n={i + 1}
                className={cn(
                  i % 7 === 0 && "col-span-2 row-span-2",
                  i % 5 === 3 && "row-span-2",
                  i % 6 === 2 && "col-span-2",
                )}
              />
            ))}
          </div>
        </Container>
      ) : (
        /* Full-bleed on purpose: the strip breaks the 12-column grid and runs
           off both edges of the viewport, the way a filmstrip should. */
        <div className="mt-6 border-y border-hair bg-panel/40 py-2.5">
          <Sprockets />
          <div className="no-bar flex snap-x gap-2.5 overflow-x-auto px-5 py-2.5 sm:px-8 lg:px-14">
            {tiles.map((t, i) => (
              <Frame
                key={i}
                tile={t}
                n={i + 1}
                className="aspect-[4/5] w-[62vw] shrink-0 snap-center sm:w-[240px] lg:w-[270px]"
              />
            ))}
            <div className="w-1 shrink-0" aria-hidden />
          </div>
          <Sprockets />
        </div>
      )}

      <Container>
        <p className="mt-3 text-2xs text-dimmer">
          {tiles.filter((t) => t.src).length} exposed · {tiles.length} frames · scroll sideways
        </p>
      </Container>
    </section>
  );
}
