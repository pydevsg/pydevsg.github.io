import { site, type BlogPost, type Repo } from "@/site.config";

/** 6 hours. Every remote read shares it. */
export const REVALIDATE = 60 * 60 * 6;

const GH_HEADERS: HeadersInit = {
  Accept: "application/vnd.github+json",
  "User-Agent": "sudipto.dev",
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};

async function json<T>(url: string, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(url, {
      ...init,
      next: { revalidate: REVALIDATE },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/* ─── GitHub repos ────────────────────────────────────────────────────────── */

type GhRepo = {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  html_url: string;
  fork: boolean;
  archived: boolean;
  pushed_at: string;
};

export async function getRepos(): Promise<{ repos: Repo[]; live: boolean }> {
  const raw = await json<GhRepo[]>(
    `https://api.github.com/users/${site.handle}/repos?sort=updated&per_page=100`,
    { headers: GH_HEADERS },
  );

  if (!Array.isArray(raw) || raw.length === 0) {
    return { repos: site.repoFallback, live: false };
  }

  const mapped: Repo[] = raw
    .filter((r) => !r.fork && !r.archived && r.description && r.name !== site.handle)
    .map((r) => ({
      name: r.name,
      description: r.description!.trim(),
      language: r.language,
      stars: r.stargazers_count,
      url: r.html_url,
      updated: r.pushed_at,
    }));

  if (mapped.length === 0) return { repos: site.repoFallback, live: false };

  const pinned = site.pinnedRepos
    .map((name) => mapped.find((r) => r.name.toLowerCase() === name.toLowerCase()))
    .filter((r): r is Repo => Boolean(r));

  const rest = mapped
    .filter((r) => !pinned.includes(r))
    .sort((a, b) => b.stars - a.stars || b.updated.localeCompare(a.updated));

  return { repos: [...pinned, ...rest], live: true };
}

/* ─── sudiviz: stars + PyPI downloads ─────────────────────────────────────── */

export type Sudiviz = {
  stars: number;
  forks: number;
  lastMonth: number;
  lastWeek: number;
  allTime: number;
  /** Tracked per source — pypistats rate-limits far more eagerly than GitHub. */
  githubLive: boolean;
  pypiLive: boolean;
  live: boolean;
};

export async function getSudiviz(): Promise<Sudiviz> {
  const [repo, pypi] = await Promise.all([
    json<{ stargazers_count: number; forks_count: number }>(
      `https://api.github.com/repos/${site.featured.repo}`,
      { headers: GH_HEADERS },
    ),
    json<{ data: { last_day: number; last_week: number; last_month: number } }>(
      "https://pypistats.org/api/packages/sudiviz/recent",
      { headers: { "User-Agent": "sudipto.dev" } },
    ),
  ]);

  const fb = site.featured.fallback;
  return {
    stars: repo?.stargazers_count ?? fb.stars,
    forks: repo?.forks_count ?? fb.forks,
    lastMonth: pypi?.data?.last_month ?? fb.lastMonth,
    lastWeek: pypi?.data?.last_week ?? fb.lastWeek,
    allTime: site.featured.downloadsAllTime,
    githubLive: Boolean(repo),
    pypiLive: Boolean(pypi),
    live: Boolean(repo || pypi),
  };
}

/* ─── Medium RSS ──────────────────────────────────────────────────────────── */

function firstImage(html: string): string | null {
  const m = html.match(/<img[^>]+src="([^"]+)"/i);
  return m ? m[1] : null;
}

function preview(html: string, title: string): string {
  const text = html
    .replace(/<figure[\s\S]*?<\/figure>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  // Medium repeats the title as the first line of the body.
  const body = text.startsWith(title) ? text.slice(title.length).trim() : text;
  const cut = body.slice(0, 132);
  return cut.length < body.length ? `${cut.replace(/\s\S*$/, "")}…` : cut;
}

export async function getPosts(limit = 6): Promise<{ posts: BlogPost[]; live: boolean }> {
  try {
    const res = await fetch(site.blog.feed, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; sudipto.dev/1.0)" },
      next: { revalidate: REVALIDATE },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(String(res.status));

    const { default: Parser } = await import("rss-parser");
    const feed = await new Parser({
      customFields: { item: [["content:encoded", "encoded"]] },
    }).parseString(await res.text());

    const posts: BlogPost[] = (feed.items ?? []).slice(0, limit).map((item) => {
      const html = String((item as { encoded?: string }).encoded ?? item.content ?? "");
      const title = (item.title ?? "untitled").trim();
      return {
        title,
        date: item.isoDate ?? item.pubDate ?? "",
        url: (item.link ?? site.blog.profile).split("?")[0],
        preview: preview(html, title) || "read on medium →",
        image: firstImage(html),
      };
    });

    if (posts.length === 0) throw new Error("empty feed");
    return { posts, live: true };
  } catch {
    return { posts: site.blog.fallback.slice(0, limit), live: false };
  }
}

/* ─── formatting ──────────────────────────────────────────────────────────── */

export function compact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(n);
}

export function shortDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d
    .toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    .toLowerCase();
}
