import type { Metadata } from "next";
import { AdOptOut } from "@/components/legal/ad-opt-out";
import { LegalPage } from "@/components/legal/legal-page";
import { DO_NOT_SELL } from "@/lib/legal-do-not-sell";
import { PAGE_SEO, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(PAGE_SEO.doNotSell);

export default function DoNotSellPage() {
  return (
    <LegalPage document={DO_NOT_SELL}>
      <AdOptOut />
    </LegalPage>
  );
}
