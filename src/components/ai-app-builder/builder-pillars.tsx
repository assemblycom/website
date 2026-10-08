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
   * Drops the CAST and draws the screen's own edge instead: the rounded
   * top-left corner it already had, plus a hairline down its left and across
   * its top.
   *
   * For a screen whose ground is the same white as the product's page and
   * whose subject is centred in it. A drop shadow there is a cloud under a
   * mostly-empty page and reads as the picture being lifted off the card
   * rather than as a screen; a line says the same thing exactly, with an edge
   * you can see. The other three keep the cast — their screens have furniture
   * against every edge, where a hairline would be lost in it.
   */
  visualBare?: boolean;
  /**
   * Fades the shot out on its right rather than letting the card cut it off.
   * For a screen where one END of it is the claim — the branded nav slab — and
   * the pane beside it is only there to show the nav is attached to something.
   */
  fadeRight?: boolean;
  /**
   * Where the right-edge fade's solid part ENDS, as a percent of the card.
   *
   * The default 62 is drawn for the branding card, whose subject is a slab on
   * the left and whose right half is only there to show the slab is attached
   * to something — a fade over most of it loses nothing. A card whose subject
   * runs ACROSS the measure (a table with a column near the right) needs the
   * ramp to wait: at 62 the company column would be read through the middle
   * of the gradient. Per pillar, because it is a fact about the artwork.
   */
  fadeFrom?: number;
  /**
   * Dissolves the shot into the card at its FOOT, the way `fadeRight` does on
   * its right edge, with the same meaning: the screen carries on past what the
   * card can show. The number is where the solid part ends, as a percent of
   * the visual's height.
   *
   * A hard cut is right for a screen whose bottom edge lands on a row boundary
   * — it reads as a crop. It is wrong for one that ends mid-object, where the
   * eye reads a half-drawn card rather than a window.
   */
  fadeBottom?: number;
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
/** The mocks' own hairline, so a screen's drawn edge matches the lines in it. */
const CARD_PAD = "px-6 pt-7 md:px-8 md:pt-8";

/**
 * NO CAST on any of the four shots.
 *
 * They used to carry one in light — two drop-shadows, a tight one for the edge
 * and a wide soft one for height — because --surface and --mock-window are
 * seven points apart and their hairline was quieter than the step between
 * them, so a screen read as furniture drawn on the card rather than as a screen
 * on it.
 *
 * The set answered that a different way instead: the shots lost their chrome
 * and now meet the card flat, two of them dissolving into it through a mask.
 * A cast under a shot that has no edge is a cloud with nothing casting it —
 * and with two of the four already flat, the remaining two read as the odd
 * ones rather than as the lifted ones. The separation is the hairline's job
 * now, which is what `visualBare` draws.
 */

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
          className="mt-7 min-h-[260px] flex-1 px-10 md:mt-8 md:min-h-[300px] md:px-16"
          style={edgeFade(pillar)}
        >
          {pillar.visual}
        </div>
      ) : (
        <div
          className={`relative mt-7 min-h-[260px] flex-1 md:mt-8 md:min-h-[300px] ${
            ""
            // The ramps live in `edgeFade` below, on THIS box and not on the
            // shot inside it: the shot is laid out at a fixed width and
            // cropped by the card, so a mask there puts its whole gradient
            // off-screen past the card's edge. This box is the card's own
            // size, which is what the fade has to be measured against.
          }`}
          style={edgeFade(pillar)}
        >
          {/* The hairline is on THIS box, inside the masked one: a shot that
              dissolves into the card wants its edge to go with it, and an
              edge drawn outside the mask would survive the fade as a line
              around nothing. */}
          <div
            className={`absolute left-6 top-0 overflow-hidden rounded-tl-xl md:left-8 ${
              // The hairline is a LIT edge now (see .mock-lit-edge): brightest
              // along the top where the light would land, the plain line by
              // the middle, gone before the right and the foot — which are the
              // two edges this frame leaves open. 135deg is what runs it
              // diagonally so neither open edge gets a line down it.
              //
              // In light it is the same hairline as before; only dark lights
              // up, which is where a near-black screen on a near-black card
              // had no edge of its own.
              pillar.visualBare ? "mock-lit-edge [--lit-angle:135deg]" : ""
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

/**
 * The right-edge and bottom-edge ramps, as a mask.
 *
 * A mask and not an overlay: it takes the shot's own pixels to transparent so
 * the card's --surface shows through, which costs nothing in dark mode and
 * cannot be the wrong colour in either theme.
 *
 * The midpoint of each ramp sits at the same proportion of what is left as the
 * original single ramp used (62 → 84), so moving the start gives a shorter
 * ramp rather than a differently shaped one.
 *
 * Two edges compose with `intersect`: each gradient is its own mask layer and
 * a pixel survives only where BOTH are opaque, which is what makes a corner
 * fade on both axes instead of one ramp cancelling the other.
 */
function edgeFade(pillar: Pillar): React.CSSProperties | undefined {
  const ramp = (dir: "right" | "bottom", from: number) =>
    `linear-gradient(to ${dir}, #000 ${from}%, rgba(0,0,0,0.55) ${
      from + (100 - from) * 0.58
    }%, transparent 100%)`;

  const layers: string[] = [];
  if (pillar.fadeRight) layers.push(ramp("right", pillar.fadeFrom ?? 62));
  if (pillar.fadeBottom !== undefined)
    layers.push(ramp("bottom", pillar.fadeBottom));
  if (!layers.length) return undefined;

  const mask = layers.join(", ");
  return {
    WebkitMaskImage: mask,
    maskImage: mask,
    ...(layers.length > 1
      ? {
          WebkitMaskComposite: "source-in",
          maskComposite: "intersect",
        }
      : {}),
  } as React.CSSProperties;
}

/** Matches vs-page's own ids, so the two regions slug a subject the same way. */
function pillarId(eyebrow: string) {
  return `pillar-${eyebrow
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;
}
