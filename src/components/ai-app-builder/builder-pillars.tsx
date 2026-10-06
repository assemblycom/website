import Link from "next/link";

export interface Pillar {
  /**
   * The category this claim belongs to, in two words or fewer. Not shown: it
   * is what the row's id is slugged from, so a link to #pillar-crm keeps
   * working and the ids stay readable.
   */
  eyebrow: string;
  heading: string;
  body: string;
  /** Where the claim is shown in full. One per card, under the copy. */
  cta: { label: string; href: string };
  /** The product shot that backs the claim. */
  visual: React.ReactNode;
  /**
   * The width the shot is laid out at inside a card narrower than it, in px.
   * Only the cards that crop on the right use it — see FeatureCard. A sign-in
   * screen wants a different measure from a CRM table, so it is per pillar
   * rather than per card size.
   */
  visualWidth?: number;
  /**
   * Shows the shot WHOLE inside the card rather than cropping it on the card's
   * edges. For a screen that is one object with a middle — a sign-in form —
   * where a crop takes away the thing you are meant to be looking at.
   */
  visualContained?: boolean;
}

/**
 * The four message pillars as a bento: the first two featured with their
 * screens, the rest as plain cards underneath.
 *
 * They were four full-width rows, each a claim across the measure with its shot
 * at the full width below it. Four of those in a column is four pages of the
 * same shape, and the section gave its last two claims — security and branding,
 * which are the table-stakes ones — exactly as much room as its first two,
 * which are the ones that are actually Assembly's.
 *
 * The bento says which is which by how much space it gives them, not by which
 * of them gets a picture: apps takes two thirds of the top row and CRM the
 * remaining third, then security and branding share the row below, half each.
 * All four crop their screen on the card's own edge.
 *
 * Order is the array's order, and it is the brief's: client-facing apps first
 * because that is where Assembly is uniquely good, CRM second, then the two
 * that are table stakes. Swapping two pillars in the data swaps which ones get
 * a picture, so the order is load-bearing here in a way it was not before.
 */
export function BuilderPillars({ pillars }: { pillars: Pillar[] }) {
  const [wide, tall, ...plain] = pillars;
  return (
    <section className="mx-auto max-w-[1200px] px-6 pb-16 md:px-10 md:pb-24">
      {/* No heading of its own: the chapter above it is this section's header
          ("What AI app builders promise. What Assembly proves"), so the cards
          open directly under it. */}
      <div className="grid gap-4 lg:grid-cols-3">
        {wide ? <FeatureCard pillar={wide} span="wide" /> : null}
        {tall ? <FeatureCard pillar={tall} span="tall" /> : null}
        {plain.length ? (
          // Their own row, halved, rather than thirds of the grid above: two
          // cards across a three-column track would leave one of them a third
          // of the page for no reason, and these two are peers.
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-3">
            {plain.map((pillar) => (
              <FeatureCard key={pillar.heading} pillar={pillar} span="half" />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

const CARD =
  "relative flex flex-col overflow-hidden rounded-3xl bg-[var(--surface)]";
const CARD_PAD = "px-6 pt-7 md:px-8 md:pt-8";

/**
 * One of the two cards that carry a screen: copy at the top, the shot below it
 * running off the card's bottom edge.
 *
 * They crop differently because the cards are different widths and these mocks
 * are the home page's own responsive components, not fixed-size art.
 *
 * - "wide" takes two thirds of the row, which is near enough the width its mock
 *   is drawn for, so the shot is laid out at the card's own width and only the
 *   foot is cropped.
 * - "tall" takes one third — about 380px — and "half" about 590px. Their mocks
 *   carry real breakpoint rules that collapse down there: squeezed, the CRM's
 *   columns collide and the contact name runs over the company. So each is
 *   given a fixed width to lay out in and cropped on the right as well as the
 *   foot — the same picture at the size it was drawn, seen through a narrower
 *   window, which is what the crop is claiming anyway.
 */
function FeatureCard({
  pillar,
  span,
}: {
  pillar: Pillar;
  span: "wide" | "tall" | "half";
}) {
  return (
    <div
      id={pillarId(pillar.eyebrow)}
      className={`${CARD} ${span === "wide" ? "lg:col-span-2" : ""}`}
    >
      <div className={CARD_PAD}>
        <h3 className="type-h4 text-balance leading-[1.25]">
          {pillar.heading}
        </h3>
        <p className="mt-3 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground">
          {pillar.body}
        </p>
        <CardLink cta={pillar.cta} />
      </div>

      {/* Held off the top and left and running off the bottom and the right, so
          the shot reads as a window onto a screen that continues past the
          frame. min-h rather than an aspect ratio: the two cards sit in one row
          and must end on the same line, so the taller copy decides the row and
          the shorter one's picture takes up the slack. */}
      {pillar.visualContained ? (
        /* Whole, inside the card's own padding. The cropping frame below is
           the default and is right for a screen that continues past the edge;
           it is wrong for one that is a single object with a middle. */
        <div className="mt-7 min-h-[260px] flex-1 px-6 pb-6 md:mt-8 md:min-h-[300px] md:px-8 md:pb-8">
          {pillar.visual}
        </div>
      ) : (
        <div className="relative mt-7 min-h-[260px] flex-1 md:mt-8 md:min-h-[300px]">
          <div
            className={`absolute left-6 top-0 overflow-hidden rounded-tl-xl md:left-8 ${
              span === "wide" ? "right-0 h-[130%]" : "h-full"
            }`}
            style={
              span === "wide"
                ? undefined
                : { width: pillar.visualWidth ?? (span === "tall" ? 860 : 760) }
            }
          >
            {pillar.visual}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * The way on from a card: a ruled label with an arrow, not a button.
 *
 * It was the page's own outlined secondary button, which is sized for a hero —
 * at px-5 py-2.5 behind a --foreground/20 rule it was the heaviest object on a
 * card whose heading is 20px, and four of them down the section read as the
 * point rather than as the way to the point. A rule under the words carries
 * the same affordance at a fraction of the weight, and each claim still ends
 * somewhere instead of asking the reader to carry four of them to the single
 * action at the foot of the page.
 *
 * The rule is the element's own bottom border rather than an underline, so it
 * runs under the arrow as well as the words and sits clear of the descenders.
 * The arrow steps right on hover — the one bit of movement here, and it is the
 * direction the link goes. self-start because the card is a flex column: a
 * stretched flex item would run the rule the whole width of the card.
 */
function CardLink({ cta }: { cta: Pillar["cta"] }) {
  return (
    <Link
      href={cta.href}
      className="group mt-7 inline-flex items-center gap-2 self-start border-b border-foreground pb-1.5 text-sm text-foreground"
    >
      {cta.label}
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className="size-4 transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:transition-none"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 12h15m-6-6 6 6-6 6" />
      </svg>
    </Link>
  );
}

/** Matches vs-page's own ids, so the two regions slug a subject the same way. */
function pillarId(eyebrow: string) {
  return `pillar-${eyebrow
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;
}
