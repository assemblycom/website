import Link from "next/link";
import { QUIET_BUTTON } from "@/components/ui/quiet-button";
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
 * Handoff v2 gives this section a heading, a lead, four stat cells and a link
 * out to the stories. All four are OPT-IN rather than defaulted, which is the
 * opposite of how the rest of this family works.
 *
 * The reason: both /solutions/* pages render this component bare, with no
 * props at all, and their briefs ask for a plain row of marks under the hero.
 * Every other component here can default to /client-portal's copy because
 * those pages override each prop; this one they do not, so a default would
 * silently put a stats band on two pages that never asked for one.
 *
 * The stat cells reuse the site's stat chip — mono, uppercase, rounded-md on
 * muted — the same object the case-study pages and the customers review strip
 * already carry, rather than a fourth idea about small labelled numbers.
 */
export function PortalSocialProof({
  heading,
  body,
  stats,
  link,
}: {
  heading?: string;
  body?: string;
  /** The four figures. Each is one chip. */
  stats?: string[];
  link?: { label: string; href: string };
} = {}) {
  return (
    <div>
      {heading || body || stats?.length ? (
        <div className="px-6 pt-16 text-center md:px-10 md:pt-24">
          {heading ? (
            <h2 className="type-h2 mx-auto max-w-3xl text-balance">
              {heading}
            </h2>
          ) : null}
          {body ? (
            <p className="mx-auto mt-4 max-w-2xl text-balance text-muted-foreground">
              {body}
            </p>
          ) : null}
          {stats?.length ? (
            <ul className="mt-8 flex flex-wrap items-center justify-center gap-1.5">
              {stats.map((stat) => (
                <li
                  key={stat}
                  className="rounded-md bg-muted px-3 py-1.5 font-mono text-[11px] uppercase leading-none tracking-wide text-muted-foreground [[data-theme=dark]_&]:bg-white/[0.06]"
                >
                  {stat}
                </li>
              ))}
            </ul>
          ) : null}
          {link ? (
            <Link href={link.href} className={`mt-6 ${QUIET_BUTTON}`}>
              {link.label}
            </Link>
          ) : null}
        </div>
      ) : null}
      <LogoRow />
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
