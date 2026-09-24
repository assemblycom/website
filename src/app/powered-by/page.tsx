import type { Metadata } from "next";
import { BuiltOnPage } from "@/components/built-on/built-on-page";
import {
  DEFAULT_BUILT_ON_FIRM,
  getBuiltOnFirm,
  type BuiltOnFirm,
} from "@/lib/built-on-firms";
import { redirect } from "next/navigation";
import { IS_LIVE_SITE } from "@/lib/constants";
import { attributionFromSearchParams } from "@/lib/powered-by-attribution";
import { PAGE_SEO, pageMetadata } from "@/lib/seo";

/**
 * Where the "Powered by Assembly" badge sends a firm's client. The page is
 * personalized from `ref` (the firm's workspace) and carries the PRD's UTMs
 * through to signup, so it is a different document per visitor and noindex:
 * only the generic fallback would be worth indexing, and it is not the page
 * anyone is sent.
 */
export const metadata: Metadata = {
  ...pageMetadata(PAGE_SEO.poweredBy),
  robots: { index: false, follow: false },
};

export default async function PoweredBy({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Held on staging while the badge that feeds this page is still being built.
  // Production promotes by fast-forwarding main, which takes every commit, so a
  // page that is not ready has to hold itself back. Same guard /about uses.
  // Delete these two lines and the page goes live with the next release.
  if (IS_LIVE_SITE) redirect("/");

  const attribution = attributionFromSearchParams(await searchParams);

  return (
    <BuiltOnPage
      // A workspace we can neither look up nor name gets the generic page
      // rather than a half-personalized one naming nobody.
      firm={resolveFirm(attribution.ref, attribution.firm)}
      attribution={attribution}
    />
  );
}

/**
 * The firm to name. The workspace lookup wins; the badge's own `firm` param is
 * the fallback, so a lookup that misses still gets a named heading, just
 * without the firm's logo or colours.
 */
function resolveFirm(ref?: string, firmName?: string): BuiltOnFirm | undefined {
  // Staging only: a bare visit shows a stand-in firm so there is something to
  // look at. It is display alone — no `ref` is invented for signup.
  if (!ref && !firmName) return getBuiltOnFirm(DEFAULT_BUILT_ON_FIRM);
  const found = getBuiltOnFirm(ref);
  if (found) return found;
  return firmName ? { id: ref ?? "", name: firmName } : undefined;
}
