import Link from "next/link";
import { CustomerLogo } from "@/components/customers/customer-logos";
import { getCaseStudyBySlug } from "@/lib/case-studies";

/**
 * Who already runs on Assembly, as a plain row of marks under the hero's
 * product shot. No heading: the marks carry it, the way the row under a
 * product demo does on most product pages.
 */
// Picked to read across the verticals the hero names rather than as one
// sector's roster. Six so a phone and a tablet both fill whole rows; the
// sixth drops out where the row runs five across.
const LOGO_SLUGS = [
  "collective-cpa",
  "advertai-marketing",
  "ditto-by-dbc",
  "metta-health",
  "orca-accounting",
  "sargent-cpa",
];
const DESKTOP_COUNT = 5;

export function PortalSocialProof() {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-8 px-6 pt-10 sm:grid-cols-3 md:px-10 md:pt-14 lg:grid-cols-5">
      {LOGO_SLUGS.map((slug, i) => (
        // Every mark has a story behind it, so the mark is the link to it. A
        // wordmark alone says nothing to a screen reader, hence the name.
        <Link
          key={slug}
          href={`/customers/${slug}`}
          aria-label={`Read the ${getCaseStudyBySlug(slug)?.company ?? ""} case study`}
          className={`flex h-8 items-center justify-center text-foreground/45 transition-colors duration-200 hover:text-foreground ${
            i >= DESKTOP_COUNT ? "lg:hidden" : ""
          }`}
        >
          <div className="flex h-full w-full max-w-[140px] items-center justify-center">
            <CustomerLogo slug={slug} fit />
          </div>
        </Link>
      ))}
    </div>
  );
}
