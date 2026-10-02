import type { Metadata } from "next";
import { HomeContent } from "@/components/home/home-content";

// Re-resolved against Contentful every few minutes rather than only at deploy.
// Prerendered once, an editor hiding a template in the CMS had no effect until
// somebody happened to ship — which is not what "the CMS is the catalogue" can
// mean in practice. Five minutes is short enough that a change lands while the
// person who made it is still looking, and long enough that crawlers aren't
// re-running the query on every hit.
// Only the canonical, deliberately: the layout already sets this page's title,
// description and card, and routing home through pageMetadata() would push its
// title through the "%s | Assembly" template and brand it twice.
//
// Written out rather than left to the layout's relative "./". Relative resolves
// against the route, and for the root route that came out as /index — a URL that
// does not exist, offered to crawlers as the canonical one.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export const revalidate = 300;

/**
 * The homepage as served to anyone the hero test leaves out: logged-in
 * visitors, and everyone while the kill switch is on. Enrolled visitors are
 * rewritten to /hero-variant/<arm> by middleware and never reach this route,
 * though the URL in their address bar still reads "/".
 *
 * No `variant`, so the hero renders exactly as it did before the test.
 */
export default function HomePage() {
  return <HomeContent />;
}
