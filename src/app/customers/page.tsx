import type { Metadata } from "next";
import { CustomersFeatured } from "@/components/customers/customers-featured";
import { CustomersHub } from "@/components/customers/customers-hub";
import { CustomersCta } from "@/components/customers/customers-cta";
import { GRID_LINE, GridDivider, GridRails } from "@/components/ui/grid-lines";
import { CAPTERRA_URL, G2_URL } from "@/lib/constants";
import { PAGE_SEO, pageMetadata } from "@/lib/seo";
import { CapterraLogo, G2Logo } from "@/components/customers/review-marks";

export const metadata: Metadata = pageMetadata(PAGE_SEO.customers);

export default function CustomersPage() {
  return (
    <>
      {/* Hero — a centered title with the review-score tags beneath it, then the
          three flagship customer stories as cards. */}
      <section className="px-6 pb-16 pt-24 text-center md:px-10 md:pb-24 md:pt-32">
        <div className="mx-auto max-w-3xl">
          <h1 className="type-display text-balance">
            Made for <span className="whitespace-nowrap">tech-enabled</span> service
            firms
          </h1>
          <p className="type-lead mx-auto mt-6 max-w-2xl text-pretty text-muted-foreground">
            Trusted by professional service firms with 1M+ clients and counting.
          </p>

          {/* Review-score strip. G2 4.7 and Capterra 4.8, current as of
              2026-10-19; the template pages' proof strip quotes the same. */}
          <div className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-2.5">
            <a
              href={G2_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Assembly on G2: 4.7 out of 5"
              className="inline-flex items-center gap-1.5 rounded-md bg-muted px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
            >
              <G2Logo className="h-4 w-4" /> 4.7 rating
            </a>
            <a
              href={CAPTERRA_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Assembly on Capterra: 4.8 out of 5"
              className="inline-flex items-center gap-1.5 rounded-md bg-muted px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
            >
              <CapterraLogo className="h-4 w-4" /> 4.8 rating
            </a>
          </div>
        </div>

      </section>

      {/* Content region — framed by vertical guide rails aligned to the 1200px
          column, with a full-bleed divider under the header. */}
      <div className="relative">
        <GridRails />

        {/* Full-bleed divider under the header — the boundary into the content.
            Desktop only: on a narrow screen the hero and the cards below already
            read as separate blocks, and the line just added a seam. */}
        <div className={`hidden border-t md:block ${GRID_LINE}`} />

        {/* Flagship stories — capped to the rail width with inner padding so the
            cards sit inset from the guide lines. */}
        <section className="mx-auto max-w-[1200px] px-6 pb-12 pt-12 md:px-10 md:pb-16 md:pt-16">
          <CustomersFeatured />
        </section>

        <GridDivider />

        {/* Story table — no side padding, so the row dividers run full-bleed on
            mobile and sit flush to the guide rails on desktop. Each row keeps its
            own content inset (px-6 / md:px-8). */}
        <section className="mx-auto max-w-[1200px] pb-16 pt-16 md:pb-24 md:pt-20">
          <CustomersHub />
        </section>
      </div>

      {/* Final CTA — the site's shared parallax chip-field panel, mirroring the
          templates + security pages. */}
      {/* Full-bleed divider before the CTA — spans edge to edge. */}
      <div className="border-t border-border [[data-theme=dark]_&]:border-[#383838]" />

      <CustomersCta />
    </>
  );
}
