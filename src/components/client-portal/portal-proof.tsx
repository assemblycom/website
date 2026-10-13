import Link from "next/link";
import { CustomerLogo } from "@/components/customers/customer-logos";
import { GRID_LINE } from "@/components/ui/grid-lines";
import { Reveal } from "@/components/ui/reveal";

/**
 * The proof section, built for this page only. Nothing here is imported
 * anywhere else — the shared `Testimonials` block carries a single story with a
 * portrait and figures, which is a different object from this.
 *
 * Two shapes. Without `featured` it is three peers divided by the page's own
 * hairline, which is what the /solutions/* pages render. With `featured` it is
 * handoff v2's section 9: one lead story carrying a pull quote, its figures and
 * a link, then the three beneath it as subordinate cards.
 *
 * ONE THING TO KNOW BEFORE EDITING THE QUOTE SET. An earlier pass here
 * deliberately used only positive, published quotes, having found that the
 * firms' before-state lines ("bolted-on software, an afterthought") read as
 * complaints about Assembly when set as peers under a plain heading. Handoff
 * v2 puts two before-state quotes back in the subordinate cards — Capital One
 * on spreadsheets, Sargent on a portal that "feels very corporate" — and they
 * only stay readable because the featured story above them is unambiguously
 * positive and sets the frame as "what these firms left behind". If the
 * featured story is ever removed, these three go back to reading as
 * complaints; re-read them before changing the lead.
 */
/**
 * The lead story. Its figures are the handoff's three: the first two are the
 * story's own `stats` entries, and "Google Drive migration done in one week"
 * is lifted from the body of the same story rather than from its stats array,
 * which carries "100% improved intake" in that third slot.
 */
export const FEATURED = {
  slug: "collective-cpa",
  quote:
    "It let us flexibly build our own version of a client portal, uniting elements of their technology with existing external core applications.",
  name: "Kyle Pearson",
  role: "Founder @ Collective CPA and Advisors",
  href: "/customers/collective-cpa",
  stats: [
    "4x faster change management",
    "200+ tax clients migrated",
    "Google Drive migration done in one week",
  ],
  linkLabel: "Read Collective CPA's story",
};

const STORIES = [
  {
    slug: "capital-one-luxury-travel",
    quote:
      "Before Assembly, we were managing hotel partners through Google spreadsheets and long email chains.",
    name: "Phillip LaRue",
    role: "Senior Director of Luxury Travel @ Capital One",
    href: "/customers/capital-one-luxury-travel",
  },
  {
    slug: "sargent-cpa",
    quote:
      "On the client side it feels very corporate. It didn’t look friendly or seem inviting.",
    name: "Anthony Drozd",
    role: "Operations Manager @ Sargent CPAs",
    href: "/customers/sargent-cpa",
  },
  {
    slug: "heritage-law-partners",
    quote: "Having everything in one spot is huge.",
    name: "Eliana Emery",
    role: "Managing Attorney @ Heritage Law Partners",
    href: "/customers/heritage-law-partners",
  },
];

/**
 * Copy and the three firms are props, so a vertical page can run its own peers
 * through the same band. `specialty` and `stats` are what a vertical adds: on
 * /client-portal the three firms stand for the whole customer base, where a
 * vertical page has to say that these are firms like yours.
 *
 * `stats` reuses the site's stat chip — mono, uppercase, rounded-md on muted —
 * the same object the case-study pages and the customers strip already carry.
 */
export function PortalProof({
  heading = "Firms that stopped settling",
  body = "See how firms replaced rigid tools with a portal they built around their own workflow.",
  stories = STORIES,
  featured,
  linkLabel,
  visual,
}: {
  heading?: string;
  body?: string;
  stories?: {
    slug: string;
    quote: string;
    name: string;
    role: string;
    href: string;
    specialty?: string;
    stats?: string[];
  }[];
  /**
   * The lead story above the three. Pass `FEATURED` for handoff v2's shape;
   * omit it for the three-peer band the /solutions/* pages render. Opt-in
   * rather than defaulted for the same reason the social-proof band is: those
   * two pages pass their own `stories` but would inherit this.
   */
  featured?: typeof FEATURED;
  /** A named link per card, where the brief asks for one. */
  linkLabel?: string;
  /** The picture beside a single story. Ignored when there are three. */
  visual?: React.ReactNode;
} = {}) {
  // One story is not a third of a band — it is the band. The divided columns
  // exist to make three peers read as one set; with one firm there is no set,
  // so it runs as a single block on the measure the rest of the page uses.
  const single = stories.length === 1;
  return (
    <section className="mx-auto max-w-[1200px] px-6 py-16 md:px-10 md:py-24">
      <Reveal>
        <div className="text-center">
          <h2 className="type-h2 mx-auto max-w-3xl text-balance">{heading}</h2>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-muted-foreground">
            {body}
          </p>
        </div>

        {/* THE LEAD STORY. A block on the page's own measure rather than a
            card: it is the one thing in this section that is not in the grid
            below, and boxing it would have made it the first of four objects
            instead of the thing the other three sit under. */}
        {featured ? (
          <Link
            href={featured.href}
            className="group mt-12 flex flex-col items-center text-center"
          >
            <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-muted p-2.5 text-foreground/80 transition-colors group-hover:bg-background group-hover:text-foreground [[data-theme=dark]_&]:bg-white/[0.06] [[data-theme=dark]_&]:group-hover:bg-white/[0.12]">
              <CustomerLogo slug={featured.slug} fit />
            </span>
            <blockquote className="type-lead mt-6 max-w-3xl text-pretty text-foreground">
              &ldquo;{featured.quote}&rdquo;
            </blockquote>
            <div className="pt-6">
              <p className="text-sm text-foreground">{featured.name}</p>
              <p className="type-caption mt-0.5 text-muted-foreground">
                {featured.role}
              </p>
            </div>
            {/* The same stat chip the rest of the site uses. */}
            <ul className="mt-6 flex flex-wrap items-center justify-center gap-1.5">
              {featured.stats.map((stat) => (
                <li
                  key={stat}
                  className="rounded-md bg-muted px-3 py-1.5 font-mono text-[11px] uppercase leading-none tracking-wide text-muted-foreground [[data-theme=dark]_&]:bg-white/[0.06]"
                >
                  {stat}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-muted-foreground transition-colors group-hover:text-foreground">
              {featured.linkLabel}
            </p>
          </Link>
        ) : null}

        {/* Dividers between the columns rather than a border around each: the
            rule only appears from md, where the three actually sit side by
            side. Stacked below that, each card keeps its own top rule so the
            set still reads as divided. */}
        <div
          className={
            single
              ? "mt-12"
              : `grid md:grid-cols-3 ${featured ? "mt-14" : "mt-12"}`
          }
        >
          {stories.map((story, i) => (
            <Link
              key={story.href}
              href={story.href}
              className={
                single
                  ? "group mx-auto flex max-w-2xl flex-col items-center text-center"
                  : `group relative flex flex-col border-t px-0 py-8 md:border-l md:border-t-0 md:px-8 md:py-2 md:first:border-l-0 md:first:pl-0 md:last:pr-0 ${GRID_LINE}`
              }
            >
              {/* The hover fill, as a layer rather than the link's own
                  background. The first and last cards drop their outer padding
                  so the text lands on the rails, which left the fill hugging
                  the type with nothing to the left of it on the first card.
                  An inset layer is padded the same on every card whatever the
                  padding under it is doing, and it carries the page's grey
                  rather than a fourth tint of --muted. */}
              {!single ? (
                <span
                  aria-hidden
                  // Inside its own cell, so it stops at the hairline between
                  // the columns instead of painting over it — -inset-x-4 ran
                  // the fill across the divider and swallowed it. The first
                  // card is the exception: it has no divider on its left and
                  // drops its padding to land on the rail, so there the fill
                  // reaches out rather than hugging the type.
                  //
                  // Half-strength: at full --surface the fill was as dark as
                  // the trays elsewhere on the page, which on a card made of
                  // nothing but type read as the card being disabled.
                  //
                  // Square. The cell it fills is bounded by the grid's own
                  // hairlines, so a rounded fill pulled away from them at all
                  // four corners and read as a card laid on the grid rather
                  // than the column lighting up — the same reason the
                  // comparison table's wash runs to its frame.
                  className={`pointer-events-none absolute inset-y-0 right-0 -z-10 bg-[var(--surface)]/60 opacity-0 transition-opacity duration-200 group-hover:opacity-100 motion-reduce:transition-none ${
                    i === 0 ? "-left-4" : "left-0"
                  }`}
                />
              ) : null}
              {/* Same-size tile per firm. `fit` is what the logo component
                  builds for this: the mask contains inside whatever box the
                  parent gives it, so a wide wordmark and a tall crest both sit
                  in a 48px square at their own proportions. Free-standing, each
                  logo renders at its own declared width, and the three marks
                  were visibly different sizes across the row. */}
              {/* The tile goes white and the mark to full strength on hover.
                  At rest the tile is a grey square on a white card and the
                  mark sits back at 80%; once the hover fill comes in behind
                  it, that grey is the same value as the fill, so the tile
                  vanished and took the logo's contrast with it. */}
              <span
                className={`flex shrink-0 items-center justify-center rounded-lg bg-muted text-foreground/80 transition-colors group-hover:bg-background group-hover:text-foreground [[data-theme=dark]_&]:bg-white/[0.06] [[data-theme=dark]_&]:group-hover:bg-white/[0.12] ${
                  featured ? "size-9 p-2" : "size-12 p-2.5"
                }`}
              >
                <CustomerLogo slug={story.slug} fit />
              </span>
              {story.specialty ? (
                <p className="type-caption mt-4 text-muted-foreground">
                  {story.specialty}
                </p>
              ) : null}
              {story.stats?.length ? (
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {story.stats.map((stat) => (
                    <li
                      key={stat}
                      className="rounded-md bg-muted px-3 py-1.5 font-mono text-[11px] uppercase leading-none tracking-wide text-muted-foreground [[data-theme=dark]_&]:bg-white/[0.06]"
                    >
                      {stat}
                    </li>
                  ))}
                </ul>
              ) : null}
              {/* Subordinate under a lead: the pull quote above is the one
                  that carries the section, so these drop to the body size the
                  cards' own attribution uses rather than competing with it. */}
              <blockquote
                className={`mt-6 text-pretty ${single ? "type-lead text-foreground" : ""} ${
                  featured ? "text-sm text-muted-foreground" : "text-foreground"
                }`}
              >
                &ldquo;{story.quote}&rdquo;
              </blockquote>
              <div className={single ? "pt-6" : "mt-auto pt-6"}>
                <p className="text-sm text-foreground">{story.name}</p>
                <p className="type-caption mt-0.5 text-muted-foreground">
                  {story.role}
                </p>
                {linkLabel ? (
                  <p className="mt-3 text-sm text-muted-foreground transition-colors group-hover:text-foreground">
                    {linkLabel}
                  </p>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
        {single ? visual : null}
      </Reveal>
    </section>
  );
}
