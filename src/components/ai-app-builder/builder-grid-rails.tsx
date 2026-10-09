// ─────────────────────────────────────────────────────────────────────────
// COLUMN RAILS — /ai-app-builder only, for now.
//
// The shared <GridRails> draws TWO lines: the left and right edges of the
// 1200px content column, as an overlay at z-30 so section fills cannot cover
// them. That is a frame. This is a GRID — the column boundaries drawn all the
// way across, so the page reads as laid out on something rather than as
// bounded by something.
//
// The reference (giga.ai) was read rather than guessed at, and three things in
// it are the whole effect:
//
//   1. ALPHA, NOT A SOLID TONE. Theirs is rgba(232,237,239,0.1) — a cool
//      near-white at a tenth. A line that faint cannot be specified as a hex,
//      because the thing it has to stay faint against changes: it crosses the
//      page ground, then a card, then a card's inner panel. At 10% it takes
//      whatever is under it and lifts it slightly, which is what keeps it from
//      ever being the brightest thing in a quiet section.
//   2. BEHIND THE CONTENT, not over it (theirs sits at z-index 0 under
//      everything). An overlay grid draws its lines across cards and
//      screenshots; a backdrop grid is interrupted by them, which is what
//      makes it read as the surface the page is built on.
//   3. FIXED TO THE VIEWPORT. Theirs is `position: fixed`, so the rails hold
//      still while the content scrolls past. That is the "guiding" part: the
//      grid is a property of the page, not of any one section, so sections do
//      not each get their own set that starts and stops.
//
// WHAT IS NOT COPIED: their spacing. Theirs is six columns inside a 120px
// gutter at a 1024 viewport — 130.5px apart. This site's grid is already
// decided (a 1200px measure inside px-6/md:px-10), so the rails land on that
// measure's own sixths instead. Borrowing their rhythm would have put lines in
// places nothing on this page lines up with.
// ─────────────────────────────────────────────────────────────────────────

/**
 * The rails' colour, as BORDER utilities, for the horizontal rules that cross
 * them on this page.
 *
 * The shared GRID_LINE is a solid tone (#eeeff1 / #262626) chosen when the
 * grid was two framing rails. Over #0a0a0a the alpha rail below resolves to
 * about #1d1d1d, so a #262626 rule running through it read as the brighter
 * line of the two and the horizontals became the grid instead of the
 * verticals. Same values, stated the same way, so a rule and a rail crossing
 * are one weight.
 *
 * Solid vs alpha still matters where they MEET — two 8.5% lines crossing
 * compound to about 16% at the intersection. At this strength that is a
 * pixel going from #1d1d1d to #242424, which is under the threshold the old
 * solid-colour note in grid-lines.tsx was written to avoid.
 */
export const BUILDER_GRID_LINE =
  "border-[rgba(16,17,20,0.055)] [[data-theme=dark]_&]:border-[rgba(232,237,239,0.085)]";

/**
 * The soft edge a card gives the rails passing behind it.
 *
 * The rails are a BACKDROP — they run the height of the region and every
 * opaque card on the page cuts them. That interruption is the effect (it is
 * what makes the grid read as the surface the page is built on), but the CUT
 * was a hard one: a rail ran at full strength straight into a card's top edge
 * and stopped on a single scanline, and in the gap between two rows of cards
 * it left a stub with a square end top and bottom. Six of those per gap read
 * as tick marks, not as a grid showing through.
 *
 * A blurred box-shadow in the PAGE GROUND, drawn just outside the card, takes
 * the rail down to nothing over about 7px before the card's edge instead. Same
 * idea as the top fade on the layer itself: the line arrives and leaves rather
 * than switching on and off.
 *
 * `var(--background)` and not a hex, so this is the page's own ground in
 * whichever theme is rendering and there is no second value to keep in step.
 * It is invisible on its own account for the same reason — a halo of the
 * ground, on the ground.
 *
 * 3px of spread before 26px of blur: the spread clears the rail off the card's
 * immediate edge, the blur does the fading, and the rail is gone about 13px
 * out. That is deliberately more than the 12px gaps inside these grids, so a
 * rail crossing the gap BETWEEN two cards is taken from both sides and
 * disappears rather than surviving as a stub down the middle. It was 14px,
 * which left a visible thread in those gaps.
 */
export const BUILDER_RAIL_HALO = "shadow-[0_0_26px_3px_var(--background)]";

/**
 * The same halo, for a block whose edge is the FULL MEASURE rather than a
 * card's.
 *
 * 14px is judged against a 390px card: the rail leaves over a distance that is
 * a small fraction of the edge it is crossing, so it reads as soft. The FAQ is
 * one block 1200px wide, and its top edge cuts all six rails on the same
 * scanline — at 14px that is a 1200px-long horizontal seam with six lines
 * stopping dead on it, which is the hard cut again at a bigger size.
 *
 * 96px of blur over 10px of spread gives the rails about 48px to leave in, so
 * the seam is a long gradient rather than a line. 44px was tried first and
 * still read as an edge: the fade has to be long relative to the 1200px it
 * runs along, not just long in absolute terms, or the eye reads the whole
 * width of it at once and finds a boundary. Nothing else on the page needs
 * this: every other block is a card.
 */
export const BUILDER_RAIL_HALO_WIDE =
  "shadow-[0_0_96px_10px_var(--background)]";

/** The six interior boundaries plus both edges: sevenths of nothing, sixths of the measure. */
const COLUMNS = [0, 1, 2, 3, 4, 5, 6];

export function BuilderGridRails() {
  return (
    <div
      aria-hidden
      // ABSOLUTE AND BOUNDED, not fixed to the viewport.
      //
      // This was `fixed inset-0`, which is the one thing the reference does
      // NOT do and the reason ours read as a permanent overlay: a fixed layer
      // is the full screen at all times, so the lines sat over the hero, the
      // CTA and the footer alike and never moved while the page scrolled past
      // them. Theirs is `position: absolute` on a layer that starts below the
      // hero and ends with the content (measured: page y 985 → 10375 on
      // /omni-channel), so the grid belongs to a REGION and scrolls with it.
      // That is what makes it appear and disappear rather than always be on.
      //
      // `inset-0` against the region wrapper in page.tsx, so the rails run
      // exactly between the two full-bleed rules that open and close the
      // chapters — and nowhere else on the page.
      //
      // A NEGATIVE z, and the region wrapper carries `isolate` + a background
      // to make it work. This is the one piece of the reference that cannot be
      // approximated.
      //
      // At z-0 the layer is a POSITIONED element in the stacking context, and
      // CSS paints positioned descendants (step 8) above the block-level
      // backgrounds of non-positioned elements (step 4). So the rails drew on
      // top of every static section and card no matter what background it had
      // or how late it came in the DOM — the comparison table was given an
      // opaque white ground and the lines went straight over it anyway.
      //
      // A negative index moves the layer to step 3, below those block
      // backgrounds, which is why giga.ai uses `z-index: -1`. On its own that
      // would hide the rails completely: they would fall behind the nearest
      // ancestor background, which here is the page. The wrapper in page.tsx
      // therefore takes `isolate` — making it the stacking context the
      // negative index resolves against — and its own `bg-background`, so the
      // rails sit above the page ground and below everything drawn on it.
      // The reference does exactly this: `relative isolate bg-black`.
      //
      // Hidden below the measure. The rails are the 1200px column's own
      // divisions, and under that width the column is the viewport with a
      // 24px gutter — six lines across a phone is a cage, not a guide.
      //
      // FADED IN AT THE TOP. The region opens straight out of the hero's
      // glow, so six rails switching on at full strength on one scanline read
      // as an edge — the thing the opening rule was removed for. The mask
      // takes the layer from nothing to full over the chapter's own top
      // padding, so the grid arrives with the first heading rather than
      // before it.
      //
      // A MASK, NOT A GRADIENT FILL. A gradient to a background colour would
      // be a themed colour hardcoded in a component, and would have to be
      // written twice and kept in step. Masking fades the layer's alpha
      // instead, so whatever the wrapper's `bg-background` resolves to in the
      // current theme is what the rails fade into — one declaration, correct
      // in both.
      className="pointer-events-none absolute inset-0 -z-10 hidden [mask-image:linear-gradient(to_bottom,transparent_0,#000_200px)] min-[1200px]:block"
    >
            {/* NO HORIZONTAL PADDING. The rails and the horizontal rules have to
          share one box or the grid does not close at its corners: GridDivider
          caps itself to `max-w-[1200px]` with no inset, so when this layer
          carried the section's own `px-6 md:px-10` the outer rails sat 40px
          inside the rules' ends and every rule ran past them into nothing.
          Same 1200 for both, so the ends meet. */}
      <div className="mx-auto h-full w-full max-w-[1200px]">
        <div className="relative h-full">
          {COLUMNS.map((i) => (
            <span
              key={i}
              // Percentages, not pixels. The reference writes an inline `left`
              // in px per rail and recomputes on resize; the measure here is
              // capped, so sixths of it hold at every width the rails are
              // shown at and nothing has to run on the client.
              style={{ left: `${(i / 6) * 100}%` }}
              // The alpha pair. Light is the page's own ink at 5.5%, dark the
              // reference's cool near-white a touch under its 10% — our ground
              // is #0a0a0a where theirs is a shade lighter, so the same alpha
              // read a step hotter here.
              //
              // -translate-x-1/2 so the last rail at 100% sits ON the measure's
              // right edge rather than one pixel outside it.
              className="absolute top-0 h-full w-px -translate-x-1/2 bg-[rgba(16,17,20,0.055)] [[data-theme=dark]_&]:bg-[rgba(232,237,239,0.085)]"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
