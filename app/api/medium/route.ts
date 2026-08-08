import { NextResponse } from "next/server";
import { getPosts, REVALIDATE } from "@/lib/data";

/**
 * Medium's feed has no CORS headers, so the browser can't read it directly.
 * This proxies it, normalises it, and falls back to site.config on failure.
 * force-static keeps the route exportable for the GitHub Pages build.
 */
export const dynamic = "force-static";
export const revalidate = 21600;

export async function GET() {
  const { posts, live } = await getPosts(10);

  return NextResponse.json(
    { source: live ? "medium" : "fallback", count: posts.length, posts },
    {
      headers: {
        "Cache-Control": `public, s-maxage=${REVALIDATE}, stale-while-revalidate=86400`,
      },
    },
  );
}
