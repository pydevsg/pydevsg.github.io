import { Hero } from "@/components/Hero";
import { Work } from "@/components/Work";
import { Sudiviz } from "@/components/Sudiviz";
import { Projects } from "@/components/Projects";
import { Blog } from "@/components/Blog";
import { Events } from "@/components/Events";
import { Gallery } from "@/components/Gallery";
import { About } from "@/components/About";
import { Footer } from "@/components/Footer";
import { getPosts, getRepos, getSudiviz } from "@/lib/data";

/** 6h — must be a literal for Next's static analysis. Mirrors lib/data REVALIDATE. */
export const revalidate = 21600;

export default async function Page() {
  // One round trip each, in parallel, all of them fall back rather than throw.
  const [{ repos, live: reposLive }, sudiviz, { posts, live: postsLive }] = await Promise.all([
    getRepos(),
    getSudiviz(),
    getPosts(6),
  ]);

  return (
    <main>
      <Hero />
      <Work />
      <Sudiviz stats={sudiviz} />
      <Projects repos={repos} live={reposLive} />
      <Blog posts={posts} live={postsLive} />
      <Events />
      <Gallery />
      <About />
      <Footer />
    </main>
  );
}
