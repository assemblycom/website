import { VisualSlot } from "@/components/ui/visual-slot";

interface DeepDive {
  heading: string;
  body: string;
  visual: { label: string; description: string };
}

/**
 * The three deep dives, as a bento: one card across the top, two under it.
 *
 * They were three alternating copy/visual ROWS — heading and paragraph in one
 * half, the visual in the other, repeated down the page. Three of those is
 * most of a screen each and the same shape three times, so the section read as
 * a list of claims to be got through rather than as three things to look at,
 * and the visuals — which are the argument on a comparison page — sat in a
 * column of their own doing nothing until you scrolled level with them.
 *
 * As cards the visual is INSIDE the thing its copy names, which is the shape
 * /ai-app-builder's pillars already use (see builder-pillars.tsx) and the one
 * this site reaches for whenever a shot belongs to a claim. The bento is the
 * reason it is three and not a grid of equals: the first dive is the page's
 * strongest, and across the top it gets a frame wide enough to hold a wide
 * product shot without the other two being shrunk to make room.
 */
export function DeepDiveCards({ dives }: { dives: DeepDive[] }) {
  const [lead, ...rest] = dives;
  return (
    // TWO COLUMNS FROM `sm`, not `md`. These cards hold a shot and a short
    // paragraph, not a table, so they survive a narrow column — and the pair
    // going two-across at the same width the lead card stops being the only
    // full-width thing keeps the bento a bento at every width above a phone.
    <div className="grid gap-4 sm:grid-cols-2">
      {lead ? <DeepDiveCard dive={lead} wide /> : null}
      {rest.map((dive) => (
        <DeepDiveCard key={dive.heading} dive={dive} />
      ))}
    </div>
  );
}

// The pillar cards' own shape, read off builder-pillars.tsx: rounded-3xl on
// --surface, with the copy inset at the same scale. Not that component — it is
// built around shots that exist and the art direction they carry — but the
// same object, so a visitor crossing from /ai-app-builder to here meets one
// card rather than two that nearly match.
const CARD =
  "flex flex-col overflow-hidden rounded-3xl bg-[var(--surface)]";
const CARD_PAD = "px-5 pt-6 sm:px-6 sm:pt-7 md:px-8 md:pt-8";

function DeepDiveCard({ dive, wide = false }: { dive: DeepDive; wide?: boolean }) {
  return (
    <div className={`${CARD} ${wide ? "sm:col-span-2" : ""}`}>
      {/* A FLOOR UNDER THE COPY, ON A PHONE ONLY, so the three cards come out
          the same height. Stacked in one column they sit directly above each
          other, and one card 23px taller than its neighbours — the whole of
          it a second heading line, since every body is now one line of copy
          that wraps to two — reads as a card that got loose rather than as a
          heading that is longer. 8rem clears a two-line heading over a
          two-line body, which is the tallest any of the six is.

          A floor and not a fixed height: copy that outgrows it should push
          the card open rather than be clipped. From `sm` it goes entirely —
          the pair are grid siblings there and stretch to match on their own,
          and the lead card is the full width with nothing to match. */}
      <div className={`${CARD_PAD} min-h-32 sm:min-h-0`}>
        <h3 className="type-h4 text-balance leading-[1.25]">{dive.heading}</h3>
        {/* max-w-xl on the lead card too, though it has the width for more.
            The card is wide so its SHOT can be; a paragraph run to 1100px is
            a different reading job from the same words in the pair below, and
            the three should read as one set. */}
        <p className="mt-3 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground">
          {dive.body}
        </p>
      </div>
      {/* THE SHOT IS CROPPED BY THE CARD'S BOTTOM EDGE — inset left and right,
          flush and cut off at the foot, which is what the hero's card already
          does. A shot that stops short with a margin under it is a picture of
          a screen; one that runs out of the card is a window onto a screen
          that carries on, and it is the second that makes the card read as
          product rather than as an illustration of product.

          The window has the definite height and the frame is 140% of it, so
          the crop is the same share of the shot at every width. Sizing the
          frame by its own aspect ratio instead made the crop a function of
          the card's width: the pair lost half their shot on a desktop and, a
          few hundred pixels narrower, came up SHORTER than the window and
          floated with a gap under them. A percentage cannot do that.

          `ratio` is not passed for the same reason — with both the insets and
          the height definite, an aspect ratio has nothing left to decide. */}
      <div
        // ALL THREE WINDOWS ARE THE SAME HEIGHT ON A PHONE. The cards are a
        // stacked column there — the bento is a bento only from `sm` — so the
        // lead card is not leading anything, it is just the first of three,
        // and 60px more shot than the two under it read as one card being
        // bigger for no reason a reader can see. The lead's extra height is
        // worth having where it is actually wide; below that it is noise.
        //
        // 240 is the height, not a shrunk 300: a 287px-wide frame on a 375px
        // phone, which is close to square and leaves the three cards at about
        // 370px each, so more than one is on screen at a time.
        className={`relative mt-6 overflow-hidden ${
          wide
            ? "h-[240px] sm:h-[360px] md:h-[420px]"
            : "h-[240px] sm:h-[260px] md:h-[300px]"
        }`}
      >
        {/* The frame's bottom corners need no un-rounding: they are past the
            window's edge, so the crop has already taken them. */}
        <VisualSlot
          className="absolute inset-x-5 top-0 h-[140%] sm:inset-x-6 md:inset-x-8"
          label={dive.visual.label}
          description={dive.visual.description}
        />
      </div>
    </div>
  );
}
