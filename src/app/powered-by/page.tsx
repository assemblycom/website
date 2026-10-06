import type { Metadata } from "next";
import { BuiltOnPage } from "@/components/built-on/built-on-page";
import { getFirmBranding } from "@/lib/firm-branding";
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
  const attribution = attributionFromSearchParams(await searchParams);

  return (
    <BuiltOnPage
      // Only a firm the workspace lookup vouches for is named. The heading says
      // that firm runs on Assembly, and the `firm` param is anyone's to write,
      // so a lookup that misses gets the generic page. The param still travels
      // to signup with the rest of the attribution.
      firm={await getFirmBranding(attribution.ref)}
      attribution={attribution}
    />
  );
}
