import type { Metadata } from "next";
import { BuiltOnPage } from "@/components/built-on/built-on-page";
import { DEFAULT_BUILT_ON_FIRM, getBuiltOnFirm } from "@/lib/built-on-firms";
import { redirect } from "next/navigation";
import { IS_LIVE_SITE } from "@/lib/constants";
import { getCatalogueTemplates } from "@/lib/visible-templates";
import { PAGE_SEO, pageMetadata } from "@/lib/seo";

// The example apps are ordered by the catalogue's rank, which lives in
// Contentful rather than in the committed array. Re-resolved every few minutes
// so a reorder there lands without a deploy, the same cadence /templates uses.
export const revalidate = 300;

/**
 * Where the "Built on Assembly" badge sends a firm's client. The page is
 * personalized from `?w=` (the firm's workspace) and tagged with `?s=` (which
 * badge surface it came from), so it is a different document per visitor and
 * noindex: only the generic fallback would be worth indexing, and it is not the
 * page anyone is sent.
 */
export const metadata: Metadata = {
  ...pageMetadata(PAGE_SEO.builtOn),
  robots: { index: false, follow: false },
};

export default async function BuiltOn({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Held on staging while the badge that feeds this page is still being built.
  // Production promotes by fast-forwarding main, which takes every commit, so a
  // page that is not ready has to hold itself back. Same guard /about uses.
  // Delete these two lines and the page goes live with the next release.
  if (IS_LIVE_SITE) redirect("/");

  const params = await searchParams;
  const one = (key: string) => {
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };
  // One firm for now. `?w=` still resolves the others, and an id that matches
  // nothing still falls through to the generic page.
  const workspaceId = one("w") ?? DEFAULT_BUILT_ON_FIRM;
  return (
    <BuiltOnPage
      catalogue={await getCatalogueTemplates()}
      // A workspace we can't resolve, or one that opted out, gets the generic
      // page rather than a half-personalized one naming nobody.
      firm={getBuiltOnFirm(workspaceId)}
      workspaceId={workspaceId}
      surface={one("s")}
    />
  );
}
