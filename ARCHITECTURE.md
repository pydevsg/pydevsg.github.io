# Architecture — sudipto.dev

Personal site for Sudipto Ghosh. This document is the context handoff: what the
system is, how the pieces fit, which decisions are deliberate, and what state the
work is in. `README.md` covers day-to-day editing; this covers the shape.

A machine-generated knowledge graph of the same codebase lives in `graphify-out/`
(221 nodes, 411 edges, 11 communities, built with `graphify extract . --code-only`).
Open `graphify-out/graph.html` in a browser, or query it:

```bash
.venv/bin/graphify query "how does accent switching work?"
.venv/bin/graphify path "Site" "CommandBar()"
.venv/bin/graphify explain "cn()"
.venv/bin/graphify update .   # after code changes; local AST, no API cost
```

---

## 1. Stack

| Layer      | Choice                                    | Why |
| ---------- | ----------------------------------------- | --- |
| Framework  | Next.js 15, App Router, React 19          | Server components let remote data render at build/revalidate time, so nothing loads client-side |
| Language   | TypeScript 5.9, strict                    | `site.config.ts` is the schema; the compiler enforces content shape |
| Styling    | Tailwind CSS v4 (CSS-first `@theme`)       | Design tokens live in CSS variables, so the accent can swap at runtime with no re-render |
| Motion     | Framer Motion 12                          | Scroll-triggered reveals and layout transitions |
| Icons      | lucide-react + two hand-rolled brand SVGs | X and Medium aren't in lucide, see `components/ui/Brand.tsx` |
| Feed parse | rss-parser (dynamic import)               | Only pulled into the bundle on the server path that needs it |

Package manager is pnpm (`packageManager` field pins `pnpm@10.15.0`). npm works too.

---

## 2. Directory map

```
site.config.ts          ← single source of truth for ALL content
app/
  layout.tsx            root shell: fonts, metadata, JSON-LD, CRT, GridLines, CommandBar, Konami
  page.tsx              server component: fetches in parallel, composes 9 sections
  globals.css           design system: accent tokens, @theme, utilities, CRT, reduced-motion
  opengraph-image.tsx   1200×630 OG card via ImageResponse (fonts read off disk)
  icon.tsx              favicon via ImageResponse
  sitemap.ts robots.ts  SEO
  rss.xml/route.ts      mirrors Medium posts onto this domain
  api/medium/route.ts   normalised Medium feed as JSON
  api/stats/route.ts    GitHub + PyPI aggregate
components/             one file per page section + chrome (CRT, GridLines, CommandBar, Konami)
components/ui/          primitives: Container, Typed, Prompt, Spinner, CopyChip, Brand
lib/
  data.ts               all remote reads + formatting helpers
  cn.ts                 class joiner (the most-connected node in the graph)
  sections.ts           nav section registry, consumed by CommandBar
  lang.ts               language → GitHub colour
  useCopy.ts            copy-to-clipboard hook with transient confirmation
public/talks/           four talk photos, used by both Events and Gallery
legacy/                 the previous static site (index.html/style.css/script.js), archived
```

`app/globals.css` is skipped by graphify (no tree-sitter CSS grammar), so the
design system is documented in section 4 rather than discoverable in the graph.

---

## 3. Data flow

Everything remote is read **on the server** with a shared 6-hour revalidate
window and a hard fallback. No section can fail to render.

```
Page() ──Promise.all──┬── getRepos()   → api.github.com/users/pydevsg/repos
                      ├── getSudiviz() → api.github.com/repos/pydevsg/sudiviz
                      │                  pypistats.org/api/packages/sudiviz/recent
                      └── getPosts(6)  → medium.com feed → rss-parser
```

Three rules hold throughout `lib/data.ts`:

1. **Every fetch is wrapped.** `json<T>()` returns `null` on non-2xx, network
   error, or an 8-second timeout. Callers substitute `site.*.fallback`.
2. **Liveness is reported, not assumed.** Each loader returns a `live` flag and
   the UI prints `cached` instead of pretending. `getSudiviz()` splits this into
   `githubLive` and `pypiLive` because pypistats rate-limits far more eagerly
   than GitHub — losing download counts shouldn't mark the stars stale.
3. **`revalidate` is a literal.** Next's static analysis can't follow an
   imported constant, so `21600` is written out in `page.tsx` and each route,
   with `REVALIDATE` in `lib/data.ts` as the documented mirror.

`GITHUB_TOKEN` is optional; set it only to raise the unauthenticated rate limit.

---

## 4. Design system

Terminal-brutalist with a subtle CRT layer. Everything is a token in
`app/globals.css`; components consume tokens, never raw hex.

**Accent.** `--accent`, `--accent-soft`, `--accent-line` are redefined under
`[data-accent="acid"]` / `[data-accent="magenta"]` on `<html>`. Tailwind's
`@theme` maps `--color-accent` to `var(--accent)`, so switching the attribute
recolours the entire site with zero React re-render. `layout.tsx` inlines a
blocking script that reads `localStorage` before first paint to prevent a flash
of the wrong accent.

**Contrast.** `--color-dim` (`#9a9a90`) and `--color-dimmer` (`#82827a`) both
clear 4.5:1 against `#0b0d0e`. Hierarchy is carried by hue and weight rather
than by making small type unreadable — this is what took accessibility from 93
to 100.

**Utilities.** `display` (Instrument Serif headings), `hairline`, `slab` /
`slab-hover` (1px border, zero radius, 2px lift), `accent-glow`, `ants`
(marching-dash underline for in-progress items), `.tabular`, `.no-bar`.

**CRT.** Three fixed layers at z-59/60/61: scanlines at 4% opacity with a
flicker keyframe, a radial vignette, and a slow-scanning beam.

**Reduced motion.** A single `@media (prefers-reduced-motion: reduce)` block
hides all three CRT layers and collapses every animation and transition to
0.001ms. This also makes headless screenshots deterministic — capture with
Chrome's `--force-prefers-reduced-motion` and animations land in their final
state instead of mid-flight.

**Grid.** 12 columns via `components/GridLines.tsx`, fading in on scroll. Cheap
to reason about, and the one deliberate grid break (the hero name, nudged
`-ml-[0.055em]` for optical alignment against the prompt above it) reads as
intent because the grid is visible.

---

## 5. Conventions worth preserving

- **All content lives in `site.config.ts`.** Components take props or read
  `site`; none of them hardcode copy. Arrays are typed (`WorkItem`, `EventItem`,
  `GalleryTile`, `BlogPost`, `Repo`) rather than `as const`, because `as const`
  produces readonly tuples that won't satisfy mutable component props.
- **Tone:** lowercase, dry, self-aware. Terminal comments (`# …`) and prompt
  lines (`$ …`) are part of the voice, not decoration.
- **Animations must be self-healing.** `Typed` and `CountUp` each carry a safety
  `setTimeout` that forces the final state if `requestAnimationFrame` is starved
  (background tab, throttled renderer). `CountUp` renders its final value during
  SSR and only animates from zero once it scrolls into view, so the number is
  never absent from the HTML.
- **Interactive targets are ≥24px.** Accent swatches, rail arrows, hero social
  links, and expand buttons all carry padding purely to satisfy this.
- **Accessible names come from visible text** where possible. `PipInstall`
  deliberately has no `aria-label` (it caused a `label-content-name-mismatch`
  failure) — the `$` prompt is `aria-hidden` and the button's own content forms
  the name.
- **`ImageResponse` is not a browser.** Satori ignores
  `repeating-linear-gradient`, so the OG card's gridlines are explicit `<div>`s
  and its fonts are read off disk as buffers.

---

## 6. What changed in this build

The repo previously served a single static "under construction" page
(`index.html` + `style.css` + `script.js`, terminal/zsh aesthetic). Those three
files are preserved in `legacy/`.

Built from scratch on top of that aesthetic:

- **Scaffold** — Next.js 15 App Router, TypeScript strict, Tailwind v4 via
  `@tailwindcss/postcss`, ESLint 9 flat config.
- **Design system** — accent tokens, CRT overlay, 12-column gridlines, JetBrains
  Mono + Instrument Serif via `next/font`.
- **Nine sections** — Hero (boot sequence + per-character typing), Work
  (chip-filtered horizontal rail), Sudiviz (featured, with live stats), Projects
  (GitHub grid), Blog (Medium), Events (talks with photo strips), Gallery
  (filmstrip), About, Footer.
- **Chrome** — Cmd+K command palette, accent toggle, Konami-code confetti.
- **Data layer** — GitHub, PyPI, Medium, each with fallbacks and liveness flags.
- **SEO** — dynamic OG image, favicon, sitemap, robots, `/rss.xml`, JSON-LD.

Content revisions applied after the first pass:

- Hero name optically aligned (`-ml-[0.055em]`) instead of hard-flush left.
- Install command is `pip install 'sudiviz[all]'`.
- EuroSciPy 2026 and the AWS London talk are both **past**, not upcoming.
- AWS talk links to the [Builder Center recap](https://builder.aws.com/content/3HNHXzMNJGaWzA3g1SoscvXJb4I/sudiviz-x-ray-vision-for-cloud-infra-or-aws-waug-recap).
- Four talk photos added under `public/talks/`, surfaced in Events **and**
  Gallery; `sudiviz-graph-wide.png` doubles as the masked full-bleed backdrop
  behind the featured section.
- sudiviz commands replaced with the current surface: `diagnose`, `explain`
  (Bedrock), `graph --output web --open`, `fix --apply`.
- MCP server block added (`pip install 'sudiviz[mcp]'`, `sudiviz-mcp`, clients:
  Claude Desktop, Claude Code, Cursor).

---

## 7. Verification state

- `next build` clean; `eslint .` and `tsc --noEmit` clean.
- Lighthouse **100 / 100 / 100 / 100** (performance, accessibility, best
  practices, SEO) against the production build.
- Visually confirmed at desktop and mobile widths, in both accents, via
  Puppeteer element screenshots with `--force-prefers-reduced-motion`.
- `puppeteer-core` and `lighthouse` were installed transiently and are
  deliberately **not** in `package.json`.

---

## 8. Open items

- `git` — none of this is committed yet. `legacy/` moves are staged; everything
  else is untracked.
- Gallery has six `src: null` placeholders (roll B and C) rendering as
  "unexposed" frames. Drop files into `public/gallery/` and fill in the paths.
- `site.featured.demo` is `null`, so `SudivizDemo.tsx` (an animated SVG) stands
  in. Point `demo` at a real recording to replace it.
- Deployment target isn't decided. `STATIC_EXPORT=1 next build` emits a plain
  `out/` for GitHub Pages, but that freezes the feeds at build time and drops the
  API routes. A Node host (Vercel and friends) keeps the 6-hour revalidate.
