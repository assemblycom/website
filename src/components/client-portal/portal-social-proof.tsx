import Link from "next/link";
import { CustomerLogo } from "@/components/customers/customer-logos";
import { PortalStatTicker } from "@/components/client-portal/portal-stat-ticker";
import { Reveal } from "@/components/ui/reveal";

/**
 * Passive credibility band: who already runs on Assembly, stated once before
 * the argument starts. No CTA of its own beyond the quiet link out to the
 * stories.
 */
// Eight of the case-study wordmarks, picked to read across the verticals the
// subheader names rather than as one sector's roster.
const LOGO_SLUGS = [
  "collective-cpa",
  "advertai-marketing",
  "orca-accounting",
  "heritage-law-partners",
  "ditto-by-dbc",
  "valuenode-accounting",
  "metta-health",
  "sargent-cpa",
];

export function PortalSocialProof() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 py-16 md:px-10 md:py-20">
      <Reveal>
        {/* The strip opens the band, above the claim it backs up. */}
        <div className="mb-12 border-b border-border pb-5 [[data-theme=dark]_&]:border-[#383838]">
          <PortalStatTicker />
        </div>

        {/* Two-tone heading: the claim at full strength, the qualifier stepped
            back into the same sentence, so the pair reads as one line rather
            than a heading with a subtitle parked under it. */}
        <h2 className="type-h2 max-w-[680px] text-balance">
          Trusted by 1,000+ professional service firms.{" "}
          <span className="text-muted-foreground">
            Agencies, accountants, and consultants run their client
            relationships on Assembly.
          </span>
        </h2>

        <Link
          href="/customers"
          className="mt-6 inline-block rounded-lg border border-border px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
        >
          See customer stories
        </Link>

        {/* Each logo gets its own card rather than a column between hairlines:
            the tiles carry the page tone and the gaps between them show the
            muted surface underneath, so the row reads as eight cards. */}
        <div className="mt-12 grid grid-cols-2 gap-1 rounded-2xl bg-muted p-1 sm:grid-cols-4 lg:grid-cols-8 [[data-theme=dark]_&]:bg-white/[0.04]">
          {LOGO_SLUGS.map((slug) => (
            <div
              key={slug}
              className="flex aspect-square items-center justify-center rounded-xl bg-background p-5"
            >
              {/* Held back from full strength so the row reads as a roster
                  rather than eight marks competing with the heading. */}
              <div className="flex h-7 w-full max-w-[110px] items-center justify-center text-foreground/60">
                <CustomerLogo slug={slug} fit />
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
