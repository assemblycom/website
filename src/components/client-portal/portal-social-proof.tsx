import Link from "next/link";
import { CustomerLogo } from "@/components/customers/customer-logos";
import { EdgeFadeScroller } from "@/components/ui/edge-fade-scroller";
import { getCaseStudyBySlug } from "@/lib/case-studies";

/**
 * Who already runs on Assembly, as a plain row of marks under the hero's
 * product shot. No heading: the marks carry it, the way the row under a
 * product demo does on most product pages.
 */
// Picked to read across the verticals the hero names rather than as one
// sector's roster.
//
// ONE row at every width. It used to run two across on a phone and three on a
// tablet, which turned a roster of six into a three-row block — a logo wall,
// which is a heavier and different claim from a line of marks under a product
// shot.
//
// On a phone the row SCROLLS rather than dropping marks. Six across 375px is
// about 48px a mark, and these are wordmarks, not glyphs — "Metta Health" and
// "SARGENT CPAS" stop being readable long before they stop fitting. Showing
// only the first three fixed the legibility and quietly shortened the roster,
// which is the one thing this row exists to state. At 38% of the scroller each
// mark is legible, the fourth peeks, and the whole six are there to be reached.
//
// From sm it is a plain grid and there is nothing to scroll; the sixth drops
// out at lg, where the row runs five across and it would only pad the line.
//
// Capital One leads, and the roster stays at SIX. The row is one line at every
// width by design (sm:grid-cols-6, lg:grid-cols-5), so a seventh mark would
// wrap it into the logo wall the note above exists to prevent. Sargent CPAs
// came off to make room: it was already the sixth, the one hidden from lg, so
// it is the mark the widest layout was not showing anyway — and of the six it
// is the least known, which is the whole basis on which a mark earns its place
// in a row this short.
const LOGO_SLUGS = [
  "capital-one-luxury-travel",
  "collective-cpa",
  "advertai-marketing",
  "ditto-by-dbc",
  "metta-health",
  "orca-accounting",
];
const DESKTOP_COUNT = 5;

/**
 * Handoff v2 gives this section a heading, four figures and a link out to the
 * stories. The heading is the only one of the three that ships, and it is
 * OPT-IN rather than defaulted — the opposite of how the rest of this family
 * works.
 *
 * The reason for opt-in: both /solutions/* pages render this component bare,
 * with no props at all, and their briefs ask for a plain row of marks under
 * the hero. Every other component here can default to /client-portal's copy
 * because those pages override each prop; this one they do not, so a default
 * would silently put a heading on two pages that never asked for one.
 *
 * A LINE AND THE MARKS. Nothing else. This went through a centred stack of
 * five objects, then a bordered panel with a tinted feature cell carrying the
 * figures, then the same panel with the figures alone — each one still a
 * frame around a claim that does not need framing. The section's whole job is
 * "real firms run on this": the line names the number, the marks are the
 * proof, and a border, a divider or a button around them is furniture.
 *
 * THE FIGURES AND THE LINK ARE NOT SHOWN. The figures are the homepage's
 * stats band in small type, saying beside a grid of marks what the marks
 * already say; "1,250+" is the only one this page needs and the line carries
 * it. The link went with them — this sits directly under the hero, which is
 * too early to send a reader off the page, and /customers is in the nav.
 */
export function PortalSocialProof({
  heading,
}: {
  heading?: string;
} = {}) {
  if (!heading) return <LogoRow />;

  return (
    // NO HORIZONTAL PADDING OF ITS OWN. This renders inside the hero's
    // container, which already pads; adding px-6 here took another 24px off
    // each side and left the scrolling row 279px on a 375px screen, so two
    // marks and a sliver fitted where three nearly do. The bare LogoRow below
    // still carries its own, because the two /solutions/* pages place it
    // differently and that row has always been drawn to its own measure.
    <div className="pt-16 md:pt-24">
      <p className="text-center text-[15px] leading-snug text-muted-foreground">
        {heading}
      </p>

      {/* ONE SCROLLING ROW ON A PHONE, a grid from sm.

          Stacked two-up, six marks made a three-row block on a 375px screen —
          a logo wall, which is a heavier and different claim than a line of
          marks under a hero. One row keeps it a line, and it scrolls rather
          than dropping marks: six across 375px is about 48px each, and these
          are wordmarks, not glyphs — "Metta Health" stops being readable long
          before it stops fitting. At 38% of the scroller each mark is
          legible, the fourth peeks, and all six are there to be reached. The
          same treatment the bare row below uses, for the same reasons.

          From sm there is nothing to scroll and it becomes three across, so
          the six read as a block. Plain cells on the page's own ground: no
          border, no dividers, no tint, with the gap doing the separating —
          wider down than across, so the two rows stay two rows rather than
          reading as one twelve-mark field. */}
      <EdgeFadeScroller className="mt-10 flex gap-x-6 overflow-x-auto overflow-y-hidden overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-3 sm:gap-x-12 sm:gap-y-10 sm:overflow-visible md:mt-12">
        {LOGO_SLUGS.map((slug) => (
          <Link
            key={slug}
            href={`/customers/${slug}`}
            aria-label={`Read the ${getCaseStudyBySlug(slug)?.company ?? ""} case study`}
            className="flex h-8 w-[38%] shrink-0 items-center justify-center text-foreground/45 transition-colors duration-200 hover:text-foreground sm:w-auto"
          >
            <span className="flex h-full w-full max-w-[132px] items-center justify-center">
              <CustomerLogo slug={slug} fit />
            </span>
          </Link>
        ))}
      </EdgeFadeScroller>
    </div>
  );
}

function LogoRow() {
  return (
    // The ends dissolve instead of cutting. On a phone the row scrolls and the
    // mark at the right edge was being sliced down its middle — on a wordmark
    // that reads as a broken asset rather than as a row continuing. From sm
    // there is nothing to scroll, the scroller reports both ends at once, and
    // no mask is applied at all.
    <EdgeFadeScroller className="flex gap-x-6 overflow-x-auto overflow-y-hidden overscroll-x-contain px-6 pt-10 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-6 sm:overflow-visible md:px-10 md:pt-14 lg:grid-cols-5">
      {LOGO_SLUGS.map((slug, i) => (
        // Every mark has a story behind it, so the mark is the link to it. A
        // wordmark alone says nothing to a screen reader, hence the name.
        <Link
          key={slug}
          href={`/customers/${slug}`}
          aria-label={`Read the ${getCaseStudyBySlug(slug)?.company ?? ""} case study`}
          className={`flex h-8 w-[38%] shrink-0 items-center justify-center text-foreground/45 sm:w-auto transition-colors duration-200 hover:text-foreground ${
            i >= DESKTOP_COUNT ? "lg:hidden" : ""
          }`}
        >
          <div className="flex h-full w-full max-w-[140px] items-center justify-center">
            <CustomerLogo slug={slug} fit />
          </div>
        </Link>
      ))}
    </EdgeFadeScroller>
  );
}
