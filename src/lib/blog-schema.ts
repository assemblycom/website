import { SITE_NAME, SITE_URL } from "@/lib/constants";
import type { GhostPost } from "@/lib/ghost";

/**
 * Article structured data for a blog post.
 *
 * Every value is the one the page already renders or declares — the headline is
 * the <h1>, the description is the same excerpt the meta description carries,
 * the dates are Ghost's. Schema that disagrees with the page it sits on is worse
 * than none: Google treats the mismatch as a reason to distrust both.
 */

/** Raster, not the SVG the favicon uses: Google won't take SVG for a logo. */
export const PUBLISHER_LOGO = `${SITE_URL}/logo.png`;

/**
 * The publisher, shared with the site-wide Organization in the root layout.
 * Both describe the same organization at the same url, so a second, different
 * logo there would be a contradiction rather than a second opinion.
 */
export const PUBLISHER = {
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: { "@type": "ImageObject", url: PUBLISHER_LOGO },
} as const;

export function articleSchema(post: GhostPost) {
  const url = `${SITE_URL}/blog/${post.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: post.title,
    description: post.excerpt,
    // Omitted rather than emitted empty when a post has no feature image. An
    // empty string is a broken image URL as far as a validator is concerned,
    // and an absent optional field is not an error at all.
    ...(post.image ? { image: post.image } : {}),
    datePublished: post.date,
    // Ghost's updated_at, already falling back to published_at upstream, so a
    // post nobody has edited still carries a date rather than an empty field.
    dateModified: post.updatedAt,
    author: {
      "@type": "Person",
      name: post.author,
      // Only the Content API knows author slugs; posts read off the RSS
      // fallback have a name and no page to point at.
      ...(post.authorSlug
        ? { url: `${SITE_URL}/blog/author/${post.authorSlug}` }
        : {}),
    },
    publisher: PUBLISHER,
  };
}
