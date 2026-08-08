import { getPosts, REVALIDATE } from "@/lib/data";
import { site } from "@/site.config";

/** /rss.xml mirrors the Medium feed so readers can subscribe to the domain. */
export const dynamic = "force-static";
export const revalidate = 21600;

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function GET() {
  const { posts } = await getPosts(20);

  const items = posts
    .map((p) => {
      const date = new Date(p.date);
      const pub = Number.isNaN(date.getTime()) ? "" : date.toUTCString();
      return `    <item>
      <title>${esc(p.title)}</title>
      <link>${esc(p.url)}</link>
      <guid isPermaLink="true">${esc(p.url)}</guid>
      <description>${esc(p.preview)}</description>
      ${pub ? `<pubDate>${pub}</pubDate>` : ""}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(site.name)} — writing</title>
    <link>${site.url}</link>
    <atom:link href="${site.url}/rss.xml" rel="self" type="application/rss+xml" />
    <description>${esc(site.seo.description)}</description>
    <language>en-gb</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": `public, s-maxage=${REVALIDATE}, stale-while-revalidate=86400`,
    },
  });
}
