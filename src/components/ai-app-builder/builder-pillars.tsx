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
  /**
   * Dissolves a `visualContained` shot into the card at its foot, IN DARK ONLY.
   *
   * `fadeBottom` is for the cropped shots and is an inline mask computed per
   * pillar, which means one ramp for both themes. This one is a class whose
   * ramp is a theme-scoped token (`--mock-foot-fade`), because the problem it
   * solves only exists in dark: there the card is #191919 and a contained
   * screen's ground is #212121, so the screen's bottom edge is an eight-point
   * step running flat across the card. In light the same two grounds are a
   * point apart and the foot already gives out on its own, so the token is
   * `none` there and the card renders exactly as it did.
   */
  fadeFootDark?: boolean;
  /**
   * CONTAINED AND CENTRED ON A PHONE, cropped from `sm` up.
   *
   * The cropped shots are a window onto a screen that carries on, which is
   * right when the card has enough width for the crop to read as one. At 327px
   * it stops reading: the shot is barely wider than the card, so the "window"
   * is a few pixels of overhang and a ramp eating the last column. This flag
   * says the shot should instead sit inside the card's own inset on a phone —
   * both top corners closed, both side edges visible, no right-hand ramp — and
   * go back to the crop at `sm`.
   *
   * It is per pillar because it is a fact about the artwork: a table reads
   * fine contained, and the Add App shot does not (its composer is drawn at a
   * fixed 400px and is MEANT to run off the edge).
   */
  containOnPhone?: boolean;
  /**
   * Lays the brand wash behind this pillar's screen — see .pillar-brand-wash.
   *
   * It paints the whole card, copy and all — a page with a gradient on it, an
   * app window lying on the page. That is the treatment the product itself
   * uses behind a signed-in screen, and this is the one pillar whose shot is a
   * whole screen floating in the card rather than a window cropped by it. A
   * cropped shot runs off two edges and leaves no ground to speak of, so the
   * wash would read as a stain beside the picture instead of under it.
   */
  brandWash?: boolean;
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
  "pillar-card relative flex flex-col overflow-hidden rounded-3xl bg-[var(--surface)]";
/** The mocks' own hairline, so a screen's drawn edge matches the lines in it. */
const CARD_PAD = "px-5 pt-6 sm:px-6 sm:pt-7 md:px-8 md:pt-8";

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
      // The wash goes on the CARD, not on the visual box inside it. On the box
      // it only ever showed in the gutters either side of the screen — a
      // coloured bar down one edge rather than a ground — because the screen
      // fills that box. The card is the surface the whole thing sits on, copy
      // included, which is what the treatment is: a page with a gradient on it
      // and an app window lying on the page.
      className={`${CARD} ${pillar.brandWash ? "pillar-brand-wash" : ""} ${
        span === "wide" ? "lg:col-span-2" : ""
      }`}
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
        // NO `edgeFade` HERE. A contained shot's only ramp is its foot, and
        // that one is theme-scoped rather than breakpoint-scoped, so it comes
        // from .mock-foot-fade instead. The two cannot both be on: each would
        // be driving `mask-image` on the same element, and the second would
        // replace the first rather than compose with it. A contained pillar
        // that ever needs an edge ramp has to be folded into that same token,
        // not given a second mask.
        <div
          className={`mt-5 min-h-[268px] flex-1 px-6 sm:mt-7 sm:min-h-[280px] sm:px-10 md:mt-8 md:min-h-[300px] md:px-16 ${
            pillar.fadeFootDark ? "mock-foot-fade" : ""
          }`}
        >
          {pillar.visual}
        </div>
      ) : (
        <div
          className={`pillar-edge-fade relative mt-5 min-h-[268px] flex-1 sm:mt-7 sm:min-h-[280px] md:mt-8 md:min-h-[300px] ${
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
            className={`absolute top-0 overflow-hidden ${
              pillar.containOnPhone
                ? // Inset on BOTH sides, so the shot is centred by its own
                  // margins and its right edge is visible — hence both top
                  // corners rounded, and 180deg on the lit edge since the foot
                  // is now the only edge left open. From `sm` the fixed width
                  // and the left-hand inset return and it crops as before.
                  // THREE STATES, not two. Contained on a phone; from `sm` to
                  // `lg` the bento has not split into columns yet, so this
                  // card is the full width of the page and the shot runs to
                  // its right edge (right-0) rather than stopping at its own
                  // 360 and leaving two thirds of the card empty; at `lg` the
                  // card becomes a third of the row and the fixed width comes
                  // back, which is the number it was drawn for.
                  "inset-x-5 w-auto rounded-t-xl [--lit-angle:180deg] sm:left-6 sm:right-0 sm:w-auto sm:rounded-tr-none sm:[--lit-angle:135deg] md:left-8 lg:right-auto lg:w-[var(--shot-w)]"
                : "left-5 rounded-tl-xl sm:left-6 md:left-8"
            } ${
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
                : ({
                    // A VAR, not `width`. An inline width beats any class, so
                    // `containOnPhone`'s `w-auto` could never win against it.
                    "--shot-w": `${pillar.visualWidth ?? (span === "tall" ? 860 : 760)}px`,
                    ...(pillar.containOnPhone
                      ? undefined
                      : { width: "var(--shot-w)" }),
                  } as React.CSSProperties)
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

  const right = pillar.fadeRight ? ramp("right", pillar.fadeFrom ?? 62) : null;
  const bottom =
    pillar.fadeBottom !== undefined ? ramp("bottom", pillar.fadeBottom) : null;

  const all = [right, bottom].filter(Boolean) as string[];
  // The phone set drops the RIGHT ramp for a shot that is contained there —
  // its right edge is inside the card on a phone, so there is nothing running
  // off to dissolve and the ramp would only be fading the last column of a
  // picture that ends where you can see it — and gains a FOOT one in its
  // place.
  //
  // The foot ramp is what the containment costs. Cropped on three sides, a
  // hard cut at the bottom reads as a window; closed on both sides with two
  // rounded corners, the same cut reads as a card whose last row has been
  // sliced. The shot is still taller than the box it sits in (the CRM table is
  // five 48px rows in a 268px box), so something has to happen at the foot,
  // and a dissolve is the one that says "there is more of this" rather than
  // "this is broken". 76, so the ramp is the last quarter only.
  const phone = (
    pillar.containOnPhone ? [bottom ?? ramp("bottom", 76)] : [right, bottom]
  ).filter(Boolean) as string[];

  if (!all.length && !phone.length) return undefined;

  // Tokens rather than `maskImage`, so .pillar-edge-fade can serve a different
  // set below `sm` — see that rule. `none` is mask-image's initial value, so a
  // phone set that came out empty correctly means "no mask".
  return {
    "--pillar-fade": all.length ? all.join(", ") : "none",
    "--pillar-fade-phone": phone.length ? phone.join(", ") : "none",
  } as React.CSSProperties;
}

/** Matches vs-page's own ids, so the two regions slug a subject the same way. */
function pillarId(eyebrow: string) {
  return `pillar-${eyebrow
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;
}
