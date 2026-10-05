import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomeContent } from "@/components/home/home-content";
import { ARMS, parseArm, type Arm } from "@/lib/hero-variants";

/**
 * The homepage, once more per hero-test arm.
 *
 * This is a rewrite target, not a destination: middleware sends `/` here and
 * the visitor's address bar still reads "/". Typing this URL directly is
 * redirected home, also in middleware, so the test cannot leak a second URL for
 * the homepage into a share or a search result.
 *
 * It exists as a route of its own so the arm is resolved on the server and
 * arrives as a prop. The alternative — letting the hero read the cookie after
 * it mounts — paints the control hero and then swaps it, which is a layout
 * shift on the single element the test is measuring.
 *
 * It is NOT currently a caching win, though the shape is the one that would
 * give you one. The root layout awaits `cookies()` to stamp `data-authed`,
 * which opts every route in the app out of static rendering: `/` is already
 * server-rendered per request today, and so is this. Should that ever change,
 * Next keys its cache by path and these six become six cache entries with no
 * further work.
 */

// Inert while the root layout stays dynamic, and kept deliberately: it matches
// the `revalidate` on `/`, so the two cannot drift into different answers if
// the layout's cookie read is ever lifted.
export const revalidate = 300;

export function generateStaticParams() {
  return ARMS.map((arm) => ({ arm }));
}

/**
 * Canonical to `/`, and deliberately WITHOUT `robots: { index: false }`.
 *
 * The usual rule for an unlisted page is noindex plus an entry in
 * src/lib/sitemap-data.ts, and it does not hold here. Metadata is resolved for
 * the route that renders, not the URL that was asked for — so a noindex on this
 * page is served on `/` to every enrolled visitor, Googlebot among them, and
 * would deindex the homepage. It was written that way first and caught on the
 * rendered output; the header is in the PR.
 *
 * Nothing is lost by dropping it. These URLs are unreachable: middleware
 * redirects a direct hit to `/`, so no crawler can land on one to index it. The
 * sitemap exclusion stays as the second line of defence.
 */
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HeroVariantPage({
  params,
}: {
  params: Promise<{ arm: string }>;
}) {
  const { arm } = await params;
  const parsed = parseArm(arm);
  // An arm that no longer exists is a 404 rather than a silent fallback to the
  // shipped hero: middleware only ever rewrites to a current arm, so reaching
  // here with anything else means the two have drifted, and a page that
  // quietly serves the control would hide that while diluting the test.
  if (!parsed) notFound();

  return (
    <HomeContent
      variant={{ arm: arm as Arm, copy: parsed.copy, layout: parsed.layout }}
    />
  );
}
