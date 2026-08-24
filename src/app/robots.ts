import type { MetadataRoute } from "next";
import { PROPOSAL_CREATOR_PATH, PROPOSAL_PATH, SITE_URL } from "@/lib/constants";

// Anything that is not the production alias — previews, and the staging host —
// is kept OUT of the index by the X-Robots-Tag: noindex, nofollow header that
// next.config.ts bakes into those builds. Keyed off VERCEL_ENV at BUILD time, so
// a staging artifact cannot be promoted into production carrying it.
//
// robots.txt deliberately does NOT also disallow them. Disallow and noindex
// pull against each other: a crawler that is refused the page never reads the
// header telling it not to index the page, and a blocked URL can still be
// listed from links alone — url only, no description, and no way to remove it.
// Letting the crawl through is what lets the header be seen and obeyed. No
// sitemap line here either, though: allowing a crawl is not the same as
// advertising these hosts.
const isProduction = process.env.VERCEL_ENV === "production";

export default function robots(): MetadataRoute.Robots {
  if (!isProduction) {
    return { rules: { userAgent: "*", allow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        // Personalized proposals and the internal tool that makes them: sent to
        // one person, never listed. Both routes are noindex in their own
        // metadata too, so a link that gets shared onward still isn't
        // indexable.
        PROPOSAL_PATH,
        PROPOSAL_CREATOR_PATH,
        // Route handlers, not pages. Nothing under here renders anything a
        // crawler can use.
        "/api/",
      ],
    },
    // The index only. It names every child sitemap, so listing them here as
    // well is the same set of URLs submitted twice — and the docs sitemap is in
    // the index too, which is the one place it belongs.
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
