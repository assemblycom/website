import type { PageSeo } from "@/lib/seo";

/**
 * How the blog archive is cut into pages, and where those pages live.
 *
 * Its own module because the URLs are now the state: the page component slices
 * the posts, the browser links between the slices, and sitemap-blog.xml lists
 * them. All three have to agree on the same count and the same paths.
 */

// The archive runs to hundreds of posts, so the grid pages rather than showing
// every card at once. Twelve made 31 pages of a 370-post archive, which put the
// paginator to work for anyone browsing rather than searching; sixty is five
// pages, which is a run you can actually walk.
export const POSTS_PER_PAGE = 60;

/** A tag's shelf. */
export function tagPath(slug: string): string {
  return `/blog/tag/${slug}`;
}

/**
 * A page of an archive. Page one is the bare route, so /blog and /blog?page=1
 * are never two URLs for the same list.
 *
 * ?page= rather than /blog/page/2 — the changelog at /updates already pages this
 * way, and one shape across the site beats two.
 */
export function pagePath(base: string, page: number): string {
  return page === 1 ? base : `${base}?page=${page}`;
}

/**
 * The page a ?page= param asks for, clamped into the archive.
 *
 * An unknown, missing or out-of-range page lands on the first rather than on an
 * empty grid — the same answer /updates gives.
 */
export function pageFromParam(
  requested: string | undefined,
  total: number,
): number {
  const asked = Number(requested);
  return Number.isInteger(asked) && asked >= 1 && asked <= total ? asked : 1;
}

/** How many pages a list of that length comes to. Always at least one. */
export function pageCount(items: number): number {
  return Math.max(1, Math.ceil(items / POSTS_PER_PAGE));
}

/**
 * The same page's SEO, told which page of the archive it is.
 *
 * Both halves matter. The canonical has to point at the page itself: pointing
 * every page at /blog tells Google the other six are copies of it, and their
 * posts drop out of the index. The title has to differ for the same reason
 * Search Console reports duplicate titles as a fault.
 */
export function pagedSeo(seo: PageSeo, page: number): PageSeo {
  if (page === 1) return seo;
  return {
    ...seo,
    title: `${seo.title}, page ${page}`,
    path: pagePath(seo.path, page),
  };
}
