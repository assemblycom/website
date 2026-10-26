import Link from "next/link";
import { CustomerLogo } from "@/components/customers/customer-logos";
import { CapterraLogo, G2Logo } from "@/components/customers/review-marks";
import { getCaseStudyBySlug } from "@/lib/case-studies";
import { CAPTERRA_URL, G2_URL } from "@/lib/constants";

// The marks the handoff names, all of them firms the template pages are
// written for. Shared by every template page, so it is set here and not in
// the CMS. Durrick Designs was dropped from the handoff's six: its mark is
// a stacked script that reads as a smudge at this size.
const LOGO_SLUGS = [
  "advertai-marketing",
  "collective-cpa",
  "sargent-cpa",
  "heritage-law-partners",
  "valuenode-accounting",
];

// Current as of 2026-10-19. The line beside the badges is built from these, so
// the two can't disagree; re-check both against G2 and Capterra before quoting
// them anywhere new.
const RATINGS = [
  { href: G2_URL, label: "G2", score: "4.7", Mark: G2Logo },
  { href: CAPTERRA_URL, label: "Capterra", score: "4.8", Mark: CapterraLogo },
];

/**
 * The proof strip under the hero: the rating line on the left, the customer
 * marks on the right. On a phone the marks go and the ratings sit centred.
 * No heading, by design: the marks carry it.
 */
export function TemplateProof() {
  return (
    // No rules of its own: the page draws the grid's rules above and below
    // the strip, so they end on the rails like every other section's.
    // cursor-default: the caption is plain text, and the I-beam over it read
    // as something to select rather than a line to read past.
    <div className="flex cursor-default flex-wrap items-center justify-center gap-x-12 gap-y-6 md:justify-between">
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 text-center md:justify-start md:text-left">
        <div className="flex gap-2">
          {RATINGS.map(({ href, label, score, Mark }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Assembly on ${label}: ${score} out of 5`}
              // The whole chip answers the pointer, with the filter chips'
              // active fill, not just the mark inside it.
              className="inline-flex items-center gap-1.5 rounded-md bg-muted px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
            >
              {/* The stat-chip pattern: the value in full ink. */}
              <Mark className="h-4 w-4" /> <span className="text-foreground">{score}</span>
            </a>
          ))}
        </div>
        <p className="type-caption text-muted-foreground">
          Rated {RATINGS.map((r) => `${r.score} on ${r.label}`).join(" and ")}
        </p>
      </div>
      {/* Logos from md up only: on a phone the ratings carry the strip. */}
      <div className="hidden md:grid md:flex-1 md:grid-cols-5 md:gap-x-8">
        {LOGO_SLUGS.map((slug) => (
          <Link
            key={slug}
            href={`/customers/${slug}`}
            className="flex h-8 items-center justify-center text-foreground/45 transition-colors duration-200 hover:text-foreground"
          >
            {/* aria-hidden: some marks (Advertai's SVG) label themselves, and
                the sr-only name below already says who it is. */}
            <span aria-hidden className="flex h-full w-full max-w-[120px] items-center justify-center">
              <CustomerLogo slug={slug} fit />
            </span>
            {/* The marks are drawn (SVG or a CSS mask), so they carry no text of
                their own. Real text rather than an aria-label, so crawlers read
                the link as the customer's name too, not just its path. */}
            <span className="sr-only">{getCaseStudyBySlug(slug)?.company ?? "Customer"} logo</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
