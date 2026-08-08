import { NextResponse } from "next/server";
import { getRepos, getSudiviz, REVALIDATE } from "@/lib/data";

/** GitHub repos + sudiviz download counts in one call, cached for 6h. */
export const dynamic = "force-static";
export const revalidate = 21600;

export async function GET() {
  const [{ repos, live }, sudiviz] = await Promise.all([getRepos(), getSudiviz()]);

  return NextResponse.json(
    { sudiviz, repos, source: live ? "github" : "fallback" },
    {
      headers: {
        "Cache-Control": `public, s-maxage=${REVALIDATE}, stale-while-revalidate=86400`,
      },
    },
  );
}
