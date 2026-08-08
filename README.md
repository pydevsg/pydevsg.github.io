# sudipto.dev

Personal site for **Sudipto Ghosh** — Software Engineer II at J.P. Morgan Chase, London.
Terminal-brutalist, with a CRT you can feel and a `⌘K` palette that takes jokes.

Next.js 15 (App Router) · TypeScript · Tailwind v4 · Framer Motion · lucide-react.

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

`npm install && npm run dev` works identically if you'd rather not use pnpm.

[`ARCHITECTURE.md`](./ARCHITECTURE.md) covers how the system fits together and why
it's built this way. `graphify-out/` holds a queryable knowledge graph of the
codebase — open `graphify-out/graph.html`, or run
`.venv/bin/graphify query "<question>"`.

---

## Everything editable lives in one file

[`site.config.ts`](./site.config.ts) holds the name, taglines, socials, work rail,
featured project, events, gallery, blog fallbacks, joke commands and SEO copy.
You should not need to touch a component to change content.

### Swap the accent colour

The site ships in acid green and carries hot magenta as a one-click alternative
(bottom right of the footer). To change which one ships by default:

```ts
// site.config.ts
accent: "acid",      // → "magenta"
```

Visitor choices persist in `localStorage` and are restored before first paint, so
there's no flash. Both hex values live in one place, [`app/globals.css`](./app/globals.css):

```css
:root, [data-accent="acid"]   { --accent: #b8ff3a; … }
[data-accent="magenta"]       { --accent: #ff3aa5; … }
```

Everything downstream (`text-accent`, `border-accent-line`, focus rings, the OG
image, the favicon) reads from that variable.

### Add an event or talk

Append to `site.config.ts → events`. Order in the array is order on the page.

```ts
{
  id: "pycon-uk-2027",
  name: "PyCon UK 2027",
  talk: "sudiviz",
  place: "Manchester, UK",
  flag: "🇬🇧",
  when: "sep 2027",
  status: "upcoming",          // "upcoming" gets the accent pill + live spinner
  url: "https://pyconuk.org/",
  urlLabel: "pyconuk.org",     // optional link text
  note: "one line of context",
  photos: [                    // optional, 1–2 read best
    { src: "/talks/my-photo.png", alt: "describe it properly, it's the alt text" },
  ],
}
```

Photos go in `public/talks/`.

### Add gallery photos

1. Drop files into `public/gallery/` (portrait crops look best — frames are 4:5).
2. Point a tile at them in `site.config.ts → gallery.tiles`:

```ts
{ src: "/gallery/kraków-01.jpg", caption: "kraków, 2026", roll: "A" }
```

Tiles left as `src: null` render as numbered "unexposed" placeholder frames, so
the strip never looks broken. `roll` is just the contact-sheet letter prefix.

Prefer a bento wall to the filmstrip? One line:

```ts
gallery: { layout: "bento", … }
```

### Replace the sudiviz demo

The demo panel is an inline animated SVG ([`components/SudivizDemo.tsx`](./components/SudivizDemo.tsx))
so it inherits the accent colour and costs no network. To use a real recording:

```ts
featured: { demo: "/sudiviz-demo.gif", … }
```

---

## Live data

| Source | Endpoint | Fallback |
|---|---|---|
| Repo grid | `api.github.com/users/pydevsg/repos` | `site.config.ts → repoFallback` |
| Stars / forks | `api.github.com/repos/pydevsg/sudiviz` | `featured.fallback` |
| Downloads | `pypistats.org/api/packages/sudiviz/recent` | `featured.fallback` |
| Writing | `jsdevsg.medium.com/feed` via [`/api/medium`](./app/api/medium/route.ts) | `blog.fallback` |

Fetched server-side on a 6-hour revalidate, so no CORS proxy is needed in the
browser and nothing blocks first paint. Every call has an 8s timeout and falls
back to hardcoded content — a card never renders broken. `pypistats.org`
rate-limits aggressively; when it does, the UI says the downloads are cached
instead of pretending.

Set `GITHUB_TOKEN` in the environment to lift the anonymous GitHub rate limit
(60/hr → 5000/hr). Optional; unauthenticated works fine for one build every 6h.

Also exposed: `/api/stats`, `/rss.xml` (mirrors Medium), `/sitemap.xml`,
`/robots.txt`, plus a build-time OG image at `/opengraph-image`.

---

## Deploy

### Vercel (recommended)

```bash
vercel
```

Zero config. You get incremental revalidation of the GitHub/PyPI/Medium feeds
every 6 hours and optimised images from `next/image`.

### GitHub Pages (static)

```bash
STATIC_EXPORT=1 pnpm build   # → ./out
```

`output: export` plus unoptimised images. The route handlers are `force-static`,
so they're exported as flat files — feeds freeze at build time instead of
refreshing on their own. Schedule a daily rebuild if you go this route.

---

## Accessibility and motion

- `⌘K` (or `/`) opens the palette; `↑ ↓` move, `⏎` runs, `esc` closes. Full
  combobox/listbox semantics with `aria-activedescendant`.
- Focus rings are drawn in the active accent colour, never removed.
- `prefers-reduced-motion` removes the CRT scanlines, the rolling beam, the
  typing animation and the count-ups — content renders in its final state.
- Counters server-render their real values, so crawlers and no-JS visitors see
  numbers rather than zeros.

## Layout notes

- 12 columns (4 on mobile) with hairlines that fade in as you scroll.
- The grid is broken on purpose in three places: the filmstrip runs full-bleed
  past both gutters, the sudiviz backdrop bleeds behind the container, and the
  work rail scrolls out through the right margin.
- `assets/fonts/` holds the two TTFs used to render the OG image and favicon at
  build time. The site itself loads JetBrains Mono and Instrument Serif through
  `next/font`.
- The original placeholder page is kept in [`legacy/`](./legacy) for
  sentimental reasons.
