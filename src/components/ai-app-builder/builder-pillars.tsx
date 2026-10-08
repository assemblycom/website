export interface Pillar {
  /**
   * The category this claim belongs to, in two words or fewer. Not shown: it
   * is what the row's id is slugged from, so a link to #pillar-crm keeps
   * working and the ids stay readable.
   */
  eyebrow: string;
  heading: string;
  body: string;
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
  /**
   * Drops the lift and the rounded corner, so the shot meets the card flat.
   *
   * For a screen whose own ground is the SAME white as the product's page and
   * whose subject is centred in it — there, a cast and a corner draw a frame
   * around a picture that is mostly empty page, and the frame becomes the
   * thing you see. The other three are screens with furniture up against their
   * edges, where the lift is what stops them merging into the card.
   */
  visualBare?: boolean;
  /**
   * Fades the shot out on its right rather than letting the card cut it off.
   * For a screen where one END of it is the claim — the branded nav slab — and
   * the pane beside it is only there to show the nav is attached to something.
   */
  fadeRight?: boolean;
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
 * The lift that keeps a product screen off the card it sits on — LIGHT ONLY.
 *
 * In light the two planes are seven points apart: the card is --surface
 * #f5f5f5 and the screens are --mock-window #fcfcfd (the CRM's is flat #fff).
 * Their hairline is --mock-line #e8e9ec, thirteen points under the card, so
 * the only thing separating a screen from its ground was a line quieter than
 * the step between two greys that already nearly match. Three of the four
 * mocks carry no shadow of their own at all. The result reads as one flat
 * panel with some furniture drawn on it rather than as a screen on a card.
 *
 * A SHADOW rather than a darker card or a heavier border, because the problem
 * is that the two fills are the same brightness, and no amount of edge fixes
 * that — an outline around two identical planes is still two identical planes.
 * A cast says one is in front.
 *
 * `drop-shadow` and not `box-shadow`: these are four different mocks with four
 * different silhouettes — rounded on two corners, cropped on the others, one
 * of them behind a fade mask — and a box-shadow would draw the rectangle of
 * the wrapper instead of the shape of the screen. drop-shadow follows the
 * alpha, so each one gets its own outline whatever shape it is.
 *
 * Two casts: a tight one that reads as the edge, and a wide soft one that
 * reads as height. One alone gives either a hard line or a grey cloud.
 *
 * DARK gets none, and must not. There --surface is #191919 and the screens are
 * near-black too, but dark separates them the way the rest of this site's dark
 * mode does — the surface above is lighter — and a black cast on a black
 * ground is invisible at best and a grey smear where it does catch.
 */
const SCREEN_LIFT =
  "[filter:drop-shadow(0_1px_1px_rgba(16,24,40,0.07))_drop-shadow(0_10px_22px_rgba(16,24,40,0.10))] [[data-theme=dark]_&]:[filter:none]";

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
      </div>

      {/* Held off the top and left and running off the bottom and the right, so
          the shot reads as a window onto a screen that continues past the
          frame. min-h rather than an aspect ratio: the two cards sit in one row
          and must end on the same line, so the taller copy decides the row and
          the shorter one's picture takes up the slack. */}
      {pillar.visualContained ? (
        /* Whole across its width, inside the card's own side padding — the
           cropping frame below is right for a screen that continues past the
           edge, and wrong for one that is a single object with a middle.
           But it still runs OFF the card's foot like its three siblings: no
           bottom padding here, and the screen leaves its own bottom edge open
           (see LoginScreen's `framed`), so it reads as a window onto something
           that carries on rather than as a picture parked in a box. The form
           itself is never cropped — the window ends exactly on the card's
           edge, so the mark, the field and the button are all still there. */
        <div
          className={`mt-7 min-h-[260px] flex-1 px-6 md:mt-8 md:min-h-[300px] md:px-8 ${SCREEN_LIFT}`}
        >
          {pillar.visual}
        </div>
      ) : (
        <div
          className={`relative mt-7 min-h-[260px] flex-1 md:mt-8 md:min-h-[300px] ${
            pillar.fadeRight
              ? // Dissolved into the card on the right rather than cut off by
                // it. A mask, not an overlay: it takes the screen's own pixels
                // to transparent so the card's --surface shows through, which
                // costs nothing in dark mode and cannot be the wrong colour in
                // either theme.
                // On THIS box, not on the shot inside it: the shot is laid out
                // at a fixed 760px and cropped by the card, so a mask there
                // puts its whole gradient off-screen past the card's edge. This
                // box is the card's own width, which is the width the fade has
                // to be measured against.
                // Full strength across the left two thirds, so the slab being
                // pointed at stays solid, then away over the last third — a
                // fade that starts at the halfway mark reads as a blur over the
                // whole shot rather than as an edge.
                "[mask-image:linear-gradient(to_right,#000_62%,rgba(0,0,0,0.55)_84%,transparent_100%)]"
              : ""
          }`}
        >
          {/* The lift is on THIS box and not the masked one outside it: a
              filter and a mask on one element make the browser build the
              filtered result first and then cut the shadow with the same ramp
              that fades the shot, so the branding card's cast disappeared
              exactly where the screen is still solid. */}
          <div
            className={`absolute left-6 top-0 overflow-hidden md:left-8 ${
              pillar.visualBare ? "" : `rounded-tl-xl ${SCREEN_LIFT}`
            } ${span === "wide" ? "right-0 h-[130%]" : "h-full"}`}
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

/** Matches vs-page's own ids, so the two regions slug a subject the same way. */
function pillarId(eyebrow: string) {
  return `pillar-${eyebrow
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;
}
