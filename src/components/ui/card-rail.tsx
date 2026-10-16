"use client";

// ─────────────────────────────────────────────────────────────────────────
// CARD RAIL — a horizontal row of cards that steps with arrows and snaps.
//
// Shared rather than page-local: this is the first rail on the site, and the
// next page that wants one should get this exact interaction rather than a
// second version of it.
//
// Built on native scroll-snap, not a carousel library. The browser already
// does momentum, touch dragging, trackpad flicks, keyboard scrolling and
// reduced-motion for free; the arrows only call scrollBy. That also means it
// works before hydration — the cards are real, scrollable content on first
// paint, where a transform-based track would be stuck on frame one.
// ─────────────────────────────────────────────────────────────────────────

import { useCallback, useEffect, useRef, useState } from "react";
import { fadeMask, fadeMaskStyle } from "@/components/ui/fade-mask";

/** Matches the gap below, in px, so an arrow step lands a card on the edge. */
const GAP_PX = 16;
// A step can land a pixel or two off, and a trackpad can leave a fractional
// scrollLeft, so the ends are judged with a little slack rather than exactly.
const END_SLACK = 2;

// ── How a released drag is thrown ────────────────────────────────────────
// How far back the release velocity is read. Short enough that the last
// flick is what counts rather than the whole gesture, long enough to span
// several pointer events on a slow mouse — two or three frames is noise, and
// a velocity read off noise throws the rail somewhere nobody asked for.
const VELOCITY_WINDOW_MS = 90;
// How long the rail would coast at its release speed, in ms. This is the one
// number that decides how far a flick carries: the projection is simply
// velocity × this. 220 lands a brisk flick two or three cards on and an
// ordinary push one, which is the range the gesture can actually aim at.
const FLING_MS = 220;
// Below this (px/ms) a release is a release and not a throw — the rail
// settles onto the nearest card instead of being projected anywhere. Set by
// what a hand does when it means to stop: letting go of a stationary pointer
// still registers a pixel or two of travel.
const FLING_MIN_V = 0.08;

/**
 * Pointer speed at the moment of release, px/ms, positive when moving right.
 *
 * Measured across the whole surviving trail rather than between the last two
 * events: pointer events do not arrive evenly, so a single pair can be a
 * 2ms gap that reports a speed the hand never reached.
 */
function releaseVelocity(trail: { t: number; x: number }[], endT: number) {
  const first = trail[0];
  const last = trail[trail.length - 1];
  if (!first || !last) return 0;
  // A pointer held still before release emits nothing, so the gap between the
  // last move and the release is real evidence of having stopped — count it.
  const dt = Math.max(endT, last.t) - first.t;
  if (dt <= 0) return 0;
  return (last.x - first.x) / dt;
}

/**
 * Lands the rail on a card, carrying it on by whatever the release was worth.
 *
 * The stride is read off the DOM exactly as the arrow step reads it, so the
 * throw and the arrows always agree about where the cards are — a projection
 * computed from the breakpoint instead would drift the moment a card width
 * changed in one place and not the other.
 */
function throwTo(el: HTMLElement, velocity: number) {
  const card = el.firstElementChild as HTMLElement | null;
  const stride = (card?.offsetWidth ?? el.clientWidth) + GAP_PX;
  if (stride <= 0) return;
  // The pointer and the scroll run opposite ways: dragging RIGHT (positive
  // velocity) pulls earlier cards back into view, which is scrollLeft going
  // DOWN. Same inversion as `scrollLeft = left - dx` in the move handler.
  const coast = Math.abs(velocity) < FLING_MIN_V ? 0 : velocity * FLING_MS;
  const projected = el.scrollLeft - coast;
  // Clamped AFTER rounding: the last card's snap position is short of a whole
  // stride whenever the track does not divide evenly, and the rail should
  // rest against its end rather than at the multiple just before it.
  const max = el.scrollWidth - el.clientWidth;
  const landed = Math.min(
    Math.max(Math.round(projected / stride) * stride, 0),
    max,
  );
  el.scrollTo({
    left: landed,
    // The landing is still a landing under reduced motion — it just arrives
    // rather than travels. Dropping it entirely would leave the rail resting
    // mid-card, which is the thing this exists to prevent.
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth",
  });
}

function Chevron({ direction }: { direction: "prev" | "next" }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={direction === "prev" ? "m14.5 5-7 7 7 7" : "m9.5 5 7 7-7 7"} />
    </svg>
  );
}

// Squared off, not round. The rails, cards and tables on these pages are all
// built from straight edges and a soft radius; two circles under them read as
// buttons borrowed from somewhere else. rounded-xl is the radius the site's
// own square controls use.
const ARROW =
  "flex size-11 shrink-0 items-center justify-center rounded-xl border border-border text-foreground transition-[color,border-color,opacity] hover:border-foreground/30 disabled:pointer-events-none disabled:opacity-30 [[data-theme=dark]_&]:border-white/15 [[data-theme=dark]_&]:hover:border-white/30";

/**
 * How wide one card is.
 *
 * A fraction of the SCROLLER — 78% on a phone so the next card peeks and the
 * row reads as continuing — and it never shrinks, because shrinking is what a
 * flex row does to cards that do not fit.
 *
 * The desktop widths are exactly a two- and three-column track: two cards plus
 * one 1rem gap at md, three plus two gaps at lg. So a set of three IS a grid
 * from lg without being laid out as one — every card is across the column, the
 * scroller has nothing left to scroll, and the arrows, the drag and the grab
 * cursor all stand down on their own (see `steppable`).
 *
 * This used to be a real `layout="grid"` branch for sets that fit, taken
 * because a rail of three on a desktop offered a drag that moved nothing. The
 * objection was right but the cut was too high up: a grid that fits across a
 * desktop is a single stacked column on a phone, so /client-portal's three
 * steps became three full-height cards to scroll past rather than a row to
 * swipe. Standing the affordances down by measurement answers the same
 * objection at every width instead of at one.
 */
// Where the fade at each end of the rail leaves full opacity, as a percentage
// of the rail's width. The two ends are not the same problem, so they do not
// share a length.
//
// AHEAD is the right edge, and it is the one doing real work: a whole card and
// its caption are cut there, mid-word, and that needs a ramp long enough to
// read as the row carrying on past the frame. One value for both ends was
// tried twice and failed in both directions — 88% everywhere reached past the
// cut and dimmed the first letter of every caption line on the card that is
// fully on screen, and 96% everywhere fixed that but left about thirteen
// pixels on a phone, which is not a fade, just a slightly blurred guillotine.
//
// BEHIND — the left edge — is GONE, and the reason it had to go is the same
// reason it was short: snap-start parks the current card's own left edge ON
// the rail's edge. So the behind ramp never had a cut to dissolve. What it
// had instead was the in-focus card, and at 96% on a 327px phone rail it
// spent its whole 13px run dimming that card's left edge and the first
// letters of its caption — every snap point, on the one card the reader is
// actually looking at. The case it was for, a free scroll resting between two
// snap points, is transient and rare, and a hard edge there is a fairer price
// than a permanently unwell front card.
const FADE_AHEAD = 82;

// Below Tailwind's `sm`, where RAIL_W is 78% and the peeking card is a sliver.
const PHONE_MAX = 640;

// THE PHONE FROSTS THE CUT INSTEAD OF BLEACHING IT.
//
// An alpha ramp dissolves the peeking card towards the page, which on this
// page means dissolving a near-black photograph towards white across ~56px of
// visible sliver. However long the run and however eased the curve, the middle
// of it is a grey wash laid over a picture — the fade announces itself as a
// smear rather than reading as the row carrying on.
//
// A blur has no colour of its own. The card keeps its own ink and its own
// tone and simply goes out of focus towards the edge, which is the same thing
// a camera does and reads as depth rather than as damage. It also works in
// both themes untouched, for the same reason the mask did: there is no second
// value to tune, because nothing is being painted.
//
// The ramp is on the OVERLAY'S mask, so the blur strength eases in rather than
// starting at full force on a hard line — an abrupt backdrop-filter boundary
// is its own visible edge. A little alpha rides along at the very end so the
// last few pixels still give out instead of stopping dead against the gutter.
const BLUR_EDGE = "w-[84px]";
const BLUR_RAMP =
  "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.12) 28%, rgba(0,0,0,0.4) 55%, rgba(0,0,0,0.72) 76%, rgba(0,0,0,0.92) 90%, #000 100%)";

// Tailwind's `lg`, which is where RAIL_W below switches to
// `calc((100%-2rem)/3)`: three cards and the two 1rem gaps between them come
// to exactly 100%, so at a snap point the third card's right edge lands ON the
// rail's edge and NOTHING IS CUT THERE.
//
// Which means the ahead fade has no cut to dissolve from lg up — it just dims
// the last fifth of a card that is fully on screen, caption and all, so the
// third card reads as blurred rather than as the row carrying on. Below lg the
// cards are 78%, 62% and 50% of the rail and the next one genuinely peeks, so
// the fade is doing its job there and stays.
const WHOLE_TRACK_MIN = 1024;

// The LEADING edge's ramp, and it runs only at the very end of the rail.
//
// `snap-start` parks the current card's own left edge ON the rail's edge, so
// at every snap point there is nothing cut there and a ramp would only dim
// the card the reader is looking at — which is why the leading fade was
// removed from this component once already. The notes above FADE_AHEAD have
// the history.
//
// The LAST scroll position is the exception, and the one case that reasoning
// missed. The track does not divide evenly into the rail, so the end of the
// scroll is not a snap point: the row stops with the final card flush right
// and whatever precedes it guillotined mid-caption on the left. That is a cut
// with no card behind it, which is exactly what a ramp is for.
//
// Short, because it has one card's overhang to dissolve rather than a whole
// peeking card, and because it never coincides with a snap point — the
// objection that retired the old leading fade cannot apply here.
const FADE_BEHIND = 12;

const RAIL_W =
  "w-[78%] shrink-0 snap-start sm:w-[62%] md:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2rem)/3)]";

export function CardRail({
  label,
  children,
  lead,
}: {
  /** Names the rail for screen readers, e.g. "How building works". */
  label: string;
  children: React.ReactNode;
  /** Sits at the foot opposite the arrows — usually the section's CTA. */
  lead?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  // Starts true, so a rail whose cards all fit never flashes a pair of arrows
  // on first paint and then drops them. sync() runs on mount and corrects it
  // within the frame for a rail that really does step.
  const [atEnd, setAtEnd] = useState(true);
  // Whether the rail is running its three-column track (see RAIL_W). Starts
  // false so the server render and first paint carry the fade, which is the
  // right answer at every width below lg and is corrected within the frame.
  const [wholeTrack, setWholeTrack] = useState(false);
  // Same shape as wholeTrack: starts false so the server render carries the
  // wide-screen ramp, and sync() corrects it within the frame.
  const [phone, setPhone] = useState(false);

  const sync = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= END_SLACK);
    setAtEnd(el.scrollLeft >= el.scrollWidth - el.clientWidth - END_SLACK);
    setWholeTrack(
      window.matchMedia(`(min-width: ${WHOLE_TRACK_MIN}px)`).matches,
    );
    setPhone(window.matchMedia(`(max-width: ${PHONE_MAX - 0.02}px)`).matches);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    sync();
    // Resizing changes how many cards fit, so a rail that was steppable at one
    // width can be whole at another and both arrows have to go quiet.
    const observer = new ResizeObserver(sync);
    observer.observe(el);
    return () => observer.disconnect();
  }, [sync]);

  // Both ends at once means the whole set is on screen already.
  const steppable = !(atStart && atEnd);

  // ── The cut at each end ───────────────────────────────────────────────
  // The peeking card is the rail's whole claim that there is more, so it has
  // to stay — ending the cards short of the column instead would be a tidier
  // edge that says nothing. But a hard clip cuts the next card's caption
  // mid-word, and a guillotined line reads as a layout fault rather than as
  // copy carrying on past the frame.
  //
  // So the clip dissolves instead, on the site's own curve. AHEAD ONLY — the
  // trailing edge is where a card and its caption are genuinely cut, and the
  // leading edge is where the in-focus card begins. See FADE_AHEAD.
  //
  // At the end of the rail there is nothing further ahead to suggest, so the
  // ramp goes and the last card meets the column cleanly. A set that fits gets
  // no mask at all, which is what leaves the three-step row reading as a plain
  // row.
  const edgeMasks = wholeTrack
    ? []
    : atEnd
      ? // At the end there is nothing ahead to suggest, but the leading edge
        // is now mid-card. See FADE_BEHIND.
        atStart
        ? []
        : [fadeMask("to left", 100 - FADE_BEHIND)]
      : phone
        ? // The frosted edge replaces it below sm — see BLUR_RAMP. Running
          // both would put the wash back over the blur.
          []
        : [fadeMask("to right", FADE_AHEAD)];
  // Whether the frosted edge is the thing covering the trailing cut.
  const blurAhead = phone && !wholeTrack && !atEnd;

  // ── Drag to scroll ────────────────────────────────────────────────────
  // Touch and trackpad already drag this rail natively; a mouse did not, so on
  // a desktop the arrows were the only way through it and the cards looked
  // draggable without being so. This adds the mouse case only — pointerType
  // "touch" is left alone, because intercepting it would replace the browser's
  // own momentum and rubber-banding with a worse version of both.
  //
  // ── Releasing it THROWS the rail ──────────────────────────────────────
  // The drag used to stop dead where the pointer let go, leaving the rail
  // resting wherever that happened to be — usually mid-card, because a hand
  // does not release on a boundary. snap-proximity would tidy it only if the
  // rest point was already close to one. So a rail you dragged looked like a
  // rail you had broken: two half cards and no column.
  //
  // It now carries on the way every touch surface does. The pointer's speed
  // at the moment of release is projected forward, and the rail lands on the
  // card nearest that projection — so a flick crosses several cards, a push
  // crosses one, and a slow drag just settles onto whichever card it was
  // already nearest. Every release ends on a card either way.
  //
  // WHY NOT snap-mandatory, which also always lands on a card: mandatory
  // governs every scroll the element sees, including a vertical page scroll
  // that merely passes over it, which it then grabs and pulls back. See the
  // scroller's own comment. Doing the landing here keeps it bound to the one
  // gesture that should cause it.
  //
  // Touch still never reaches any of this (see the pointerType check): the
  // browser's own momentum is better than this, and the two would fight.
  const drag = useRef<{
    x: number;
    left: number;
    moved: boolean;
    /** Recent pointer positions, newest last, for the release velocity. */
    trail: { t: number; x: number }[];
  } | null>(null);
  const [dragging, setDragging] = useState(false);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || e.pointerType === "touch" || e.button !== 0) return;
    // Nothing to drag when the whole set is already across the column — at a
    // width where the rail has become a complete row, a grab that moves
    // nothing is worse than no grab at all. See `steppable`.
    if (!steppable) return;
    drag.current = {
      x: e.clientX,
      left: el.scrollLeft,
      moved: false,
      trail: [{ t: e.timeStamp, x: e.clientX }],
    };
    // Imperatively, not through the className below: smooth scrolling animates
    // towards each scrollLeft we assign, so the rail would lag the pointer and
    // never catch up — and a React state flip only lands a frame later, which
    // is exactly the frames the drag starts on.
    el.style.scrollBehavior = "auto";
    // AND SNAP COMES OFF FOR THE DURATION. This is what made the drag feel
    // stuck: snapping is applied to any scroll the element comes to rest at,
    // and every scrollLeft we assign mid-drag IS a rest. So while the pointer
    // was still inside the current card's proximity the browser pulled each
    // assignment straight back to the card it came from, and the rail did not
    // move at all until the pointer crossed the halfway line, at which point
    // it jumped a whole card. A 55px drag measured 0px of travel.
    //
    // With snap off the rail tracks the pointer exactly, and the landing is
    // handled on release by throwTo, which aims at a card anyway. The
    // reference rail does the same thing — mid-drag its style attribute reads
    // `scroll-snap-type: none` with the real value stashed beside it.
    el.style.scrollSnapType = "none";
    setDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    const d = drag.current;
    if (!el || !d) return;
    // NO BUTTON HELD, NO DRAG. A press that wanders off the rail vertically
    // and is released outside it, before the 4px threshold has started
    // capture, never sends this element its pointerup — so the drag stayed
    // live and the rail scrolled under a hovering mouse when it came back.
    if (e.buttons === 0) {
      endDrag(e);
      return;
    }
    const dx = e.clientX - d.x;
    // Capture only once the pointer has travelled far enough to be a drag
    // rather than a click, so a plain click on a card still reaches the card.
    if (!d.moved && Math.abs(dx) < 4) return;
    if (!d.moved) {
      d.moved = true;
      // Capture keeps the drag alive when the pointer leaves the rail. It
      // throws if the pointer is no longer active, which the drag itself does
      // not depend on — so losing it is not a reason to drop the scroll.
      try {
        el.setPointerCapture(e.pointerId);
      } catch {}
    }
    el.scrollLeft = d.left - dx;

    // Only the last VELOCITY_WINDOW of travel decides the throw, so a drag
    // that wandered around the rail and then stopped is read as stopped
    // rather than as the average of everywhere it has been.
    d.trail.push({ t: e.timeStamp, x: e.clientX });
    const cutoff = e.timeStamp - VELOCITY_WINDOW_MS;
    while (d.trail.length > 2 && d.trail[0].t < cutoff) d.trail.shift();
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    const d = drag.current;
    // Back to the stylesheet's smooth, which the arrow buttons rely on — and
    // which the throw below is animated by. Snap comes back at the same time:
    // throwTo only ever aims at a snap position, so proximity has nothing left
    // to correct and cannot pull the landing somewhere else.
    if (el) {
      el.style.scrollBehavior = "";
      el.style.scrollSnapType = "";
    }
    try {
      if (el?.hasPointerCapture(e.pointerId))
        el.releasePointerCapture(e.pointerId);
    } catch {}
    if (el && d?.moved) throwTo(el, releaseVelocity(d.trail, e.timeStamp));
    // Kept until the click that follows this release has been swallowed below.
    if (d?.moved) requestAnimationFrame(() => (drag.current = null));
    else drag.current = null;
    setDragging(false);
  };

  // THE BROWSER'S OWN DRAG IS NOT THIS ONE, and it has to be called off.
  //
  // An <img> is natively draggable, so a mousedown that lands on a card's
  // artwork and then moves starts an HTML5 drag — the picture lifts out under
  // a translucent ghost and follows the cursor, and the rail stays put.
  // Grabbing a photo to scroll the rail is the most natural place to grab it,
  // so the one gesture this component exists to serve was the one that broke
  // it, and only on the cards that happen to carry an image.
  //
  // select-none below does not cover this: it governs TEXT selection, and a
  // native image drag is a separate mechanism that fires regardless. It is
  // also applied off `dragging`, a state flip that lands a frame after the
  // pointer went down — by which time dragstart has already fired.
  //
  // Suppressed unconditionally rather than behind `steppable`: dragging a
  // marketing card's photograph out of the page is not a gesture worth
  // preserving at any width, and leaving it live below the breakpoint would
  // mean the same grab behaved differently either side of it.
  const onDragStart = (e: React.DragEvent) => e.preventDefault();

  // A drag that ends on top of a card would otherwise fire that card's click.
  const onClickCapture = (e: React.MouseEvent) => {
    if (!drag.current?.moved) return;
    e.preventDefault();
    e.stopPropagation();
  };

  // One card plus its gap, read off the DOM rather than recomputed from the
  // breakpoint, so the step stays right wherever the card widths are set.
  const step = (direction: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const by = (card?.offsetWidth ?? el.clientWidth) + GAP_PX;
    el.scrollBy({ left: by * direction, behavior: "smooth" });
  };

  return (
    <div>
      {/* Clipped at the section's measure, not bled past it. The scroller used
          to run 40px wider on each side so a card's shadow and focus ring were
          not cut — but that also let the next card show in the gutter, where
          the page's vertical rule sliced it in half and it read as a mistake
          rather than as a peek.

          The reference solves both at once: an overflow-hidden viewport with
          vertical padding cancelled by a negative margin, so the clip is
          horizontal only and shadows still breathe above and below. The arrow
          is what says there is more. */}
      {/* The positioning context is THIS box, not the whole rail: the arrows
          sit below the viewport inside the same component, and anchored to
          the rail the frosted edge reached down over the "next" button and
          blurred the one control the reader needs. */}
      {/* FULL-BLEED BELOW sm, so the frosted edge reaches the screen.
          Clipped at the measure, the peeking card stopped 24px short of the
          viewport and the page's gutter showed as a white strip beside it —
          with an alpha fade that strip was the end of the fade and read as
          nothing, but a blurred card simply stops there, and the gap reads as
          a margin error. Bled to the edge, the picture runs off the screen
          the way it runs off the tray in the section above.
          The scroller below pads itself back to the measure so the cards
          still line up with the heading. */}
      <div className="relative max-sm:-mx-6">
        {/* THE FROSTED EDGE, over the viewport rather than inside the
          scroller: it has to stay put while the cards move under it, and
          anything inside the scroller would scroll away with them.
          pointer-events-none so it never eats a drag or a tap on the card
          beneath it. */}
        {blurAhead ? (
          <div
            aria-hidden
            className={`pointer-events-none absolute inset-y-0 right-0 z-10 ${BLUR_EDGE} backdrop-blur-[5px]`}
            style={{ WebkitMaskImage: BLUR_RAMP, maskImage: BLUR_RAMP }}
          />
        ) : null}
        <div
          className="-my-4 overflow-hidden py-4"
          style={edgeMasks.length ? fadeMaskStyle(edgeMasks) : undefined}
        >
          <div
            ref={ref}
            onScroll={sync}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onDragStart={onDragStart}
            onClickCapture={onClickCapture}
            role="group"
            aria-label={label}
            // overflow-y-hidden is load-bearing, not tidying: `overflow-x: auto`
            // against a visible y makes the browser compute y to auto too, so
            // this was a vertical scroll container as well as a horizontal one,
            // and a page scroll that landed on it could be swallowed by it.
            //
            // snap-proximity, not mandatory: mandatory means the browser must
            // always come to rest on a snap point, so it re-snaps during a
            // vertical scroll that merely passes over the rail — which is the
            // scroll getting caught and pulled back. Proximity snaps when you
            // are already near a card and leaves the scroll alone otherwise.
            //
            // While dragging, the cursor becomes the grabbing hand and text
            // selection is off — a drag across two cards would otherwise select
            // their captions. Smooth scrolling is turned off for the drag too,
            // but imperatively in onPointerDown; see there for why.
            // max-sm:px-6 / scroll-px-6 pay back the bleed above: the track
            // starts and ends on the section's measure, and snap-start parks
            // a card there rather than against the screen edge, so only the
            // cards either side of the current one run off.
            className={`flex snap-x snap-proximity gap-4 overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] max-sm:scroll-px-6 max-sm:px-6 [&::-webkit-scrollbar]:hidden ${
              !steppable
                ? ""
                : dragging
                  ? "cursor-grabbing select-none"
                  : "cursor-grab"
            }`}
          >
            {children}
          </div>
        </div>
      </div>

      {/* In their own row under the rail. They were tried on the rail's
          vertical centre at its right edge, which is where the reference puts
          them — but the reference's cards stop short of the column and ours
          run to it, so the arrow sat on top of the last card.

          The row goes entirely when there is nothing to step through and no
          lead to carry: at the start AND the end at once means every card is
          already on screen, and two permanently disabled arrows under a
          complete set are a control that only ever says no. A rail of three on
          a desktop is the case that brought this up, but it is true of any of
          them at a width where they all fit. */}
      {steppable || lead ? (
        <div className="mt-10 flex items-center justify-end gap-4">
          {lead ? <div className="mr-auto">{lead}</div> : null}
          {steppable ? (
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => step(-1)}
                disabled={atStart}
                aria-label="Previous"
                className={ARROW}
              >
                <Chevron direction="prev" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                disabled={atEnd}
                aria-label="Next"
                className={ARROW}
              >
                <Chevron direction="next" />
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

// Where the cropped picture gives out. Opaque for most of its run, then away
// to nothing — the whole fade happens inside the overflow, so no row that fits
// is dimmed on its way past. The curve itself lives in fadeMask; see there for
// why it is eased and why it is long.
//
// It starts early and finishes well short of the bottom. These scenes are
// drawn at a fixed size and centred in the box, so the last thing in one — the
// plan window's rounded foot, the composer's control row — stops short of the
// box's own bottom edge. A ramp that only reaches nothing AT that edge leaves
// the art's own floor sitting at half alpha: faint, but still a rounded corner
// and a hairline drawn on the card with nothing below them. Ending at 78% puts
// that floor inside the part of the ramp that is already nothing, so the
// picture gives out into the card instead of stopping on it.
const PICTURE_FADE = fadeMask("to bottom", 8, 78);

// How far "fit" raises a scene off the centre of the space under the copy.
// Dead centre of that space reads low, because the space is itself the bottom
// two thirds of the card; a small nudge up is enough to settle it without
// walking into the caption.
const PICTURE_NUDGE = "-1rem";

// The same move for "below", which starts at the top of the space the copy
// leaves rather than centred in it. That start sat low — the caption is three
// lines on the Build card and only two on the others, so the scene began
// wherever the longest caption ended and left a band of empty card above it.
// Raising it closes that band; the overflow at the foot is cropped and faded
// either way, so the scene loses nothing by starting higher.
const PICTURE_NUDGE_BELOW = "-2.25rem";

/**
 * One card in the rail: a 3:4 picture with its caption beneath, the shape the
 * reference rails settle on. Three across from lg, two from md, one on a
 * phone, so a card is never narrower than its contents can be drawn.
 */
export function RailCard({
  caption,
  index,
  name,
  copyInside = false,
  tallOnPhone = false,
  picture = "fit",
  children,
}: {
  caption: string;
  /** Shown faint ahead of `name`, e.g. "Step 1". */
  index?: string;
  name?: string;
  /**
   * Where the picture sits inside a `copyInside` card. Which one a card wants
   * follows from how tall its scene is against the space the caption leaves —
   * there is no single offset that serves all three, which is why this is a
   * choice rather than a constant.
   *
   * "fit" (the default) centres the scene in the space under the copy, less a
   * small nudge up. For a scene that fits that space, which is most of them.
   *
   * "center" lays the picture over the WHOLE card, so the scene lands on the
   * card's own centre line. For a scene short enough that it still clears the
   * caption there — the composer, which otherwise reads as sitting low because
   * the space under the copy is the bottom two thirds of the card.
   *
   * "below" starts the scene under the caption and lets it run off the card's
   * bottom edge. For a scene drawn LARGER than the card: centred, it reaches
   * up over the caption, and it is a window onto something bigger anyway, so
   * cropping it at the foot is the point rather than a failure.
   *
   * All three fade out at the bottom.
   */
  picture?: "fit" | "center" | "below";
  /**
   * Puts the heading and caption inside the card, above the picture, which is
   * then cropped by the card's own bottom edge. The default keeps them under
   * the card, which is what /client-portal's build rail runs.
   *
   * It is the same card either way — only where the copy sits changes, so the
   * two rails stay one component rather than becoming two drawings of one
   * thing.
   */
  copyInside?: boolean;
  /**
   * 4:5 below sm instead of square, for a rail whose pictures are photos or
   * a single small UI that reads short in a square on a phone.
   */
  tallOnPhone?: boolean;
  children: React.ReactNode;
}) {
  const copy = (
    <>
      {/* The KICKER carries the ink and the caption sits back, which is the
            reverse of the usual eyebrow.

            Called deliberately. The conventional reading is that the kicker is
            an index and the sentence is the content, so the sentence should
            lead — but these cards now carry photographs and a lime gradient
            above the type, and against that much weight the step name at
            --muted-foreground was the faintest thing in the column. Leading on
            it also makes the three cards scan as a sequence first and as three
            paragraphs second, which is what a numbered rail is for.

            ONE SIZE with the caption too, not just one face. The kicker used
            to be text-sm against the caption's 16px, which was right while it
            was a quiet eyebrow — small and grey, the caption leading. Now that
            the ink has moved to it, a line that is both darker AND smaller
            than the one under it reads as two different kinds of type rather
            than as one block. Same size, and colour is the only thing telling
            them apart.

            Index and name are one line in one face and ONE colour — toning the
            index down made the kicker read as two labels.

            "Step 1: Describe", with a colon. It was an em dash, borrowed from
            the blog's post meta line, where the two halves are peers; here
            they are not. The number names the step and the word says what it
            is, which is a label and its value — and a dash set with space
            either side left the two reading as separate items on one row. */}
      {name ? (
        // PP Mori, sentence case. It was type-eyebrow — ABC Diatype Mono in
        // all caps — which on a card whose body is set in the page's own
        // face read as a label stuck on from another system.
        <p className="mb-2 flex min-w-0 items-baseline gap-1.5 text-foreground">
          {/* No tabular-nums any more: the index is spelled out ("Step Two"),
              and lining figures do nothing for words. */}
          {index ? <span className="shrink-0">{index}:</span> : null}
          <span className="min-w-0 text-pretty">{name}</span>
        </p>
      ) : null}
      <p className="text-pretty text-muted-foreground">{caption}</p>
    </>
  );

  if (copyInside) {
    return (
      <div className={`group/card ${RAIL_W}`}>
        {/* SQUARE UNTIL THE RAIL GOES THREE-UP, three-quarters from there.

                The card is 78% of the rail below sm, so its width grows with the
                viewport while the ratio holds — at 375px it is a reasonable
                255x340, but by 600px it is 400x533, which is two thirds of a
                phone screen for one card in a rail you are meant to swipe
                through. The ratio was set for the desktop rail, where three
                cards share the row and none of them can run away with it.

                Square takes a quarter off the height across that whole range
                without touching the desktop proportion. The mocks inside are
                absolutely positioned and the card clips, so they crop further
                from the foot — which is what they already do, and what says the
                screen continues.

                THE BREAK IS AT lg, NOT sm, and the arithmetic is why. The card
                is 62% of the rail at sm and half of it at md; at 820px that is
                a 362px card, which at 3/4 is 483px tall — the exact height it
                has on a 1280px desktop, on a viewport two thirds as tall. The
                ratio is only earned once three cards share the row and the
                page is wide enough to carry them, which is lg. Below that the
                card is as wide as a desktop card with none of the height to
                spend, so it stays square. */}

        <div className="relative flex aspect-square w-full select-none flex-col overflow-hidden rounded-3xl bg-[var(--surface)] lg:aspect-[3/4]">
          <div className="relative z-10 shrink-0 px-6 pb-4 pt-6 md:px-7 md:pt-7">
            {copy}
          </div>
          {/* The picture runs the card's full width at its own 340x453 ratio
              and crops on the card's bottom edge, so it reads as a window onto
              something larger.
              
              The ratio box is what makes that work. These mocks are drawn at a
              fixed design size and scaled to fit whatever box they are given;
              handed the short, wide space the copy leaves over, they fit to its
              height and came out a third of the card wide, floating in the
              middle of it. Given a box of their own proportions pinned to the
              card's width, they scale by width instead and the overflow is the
              crop. */}
          {/* Every scene used to be pinned to the top of the space the copy
              leaves, and the whole 340x453 box then overflowed only downwards
              — so a short scene was pushed onto the card's bottom edge with
              the entire gap above it, and a tall one lost its last row off the
              end. `picture` is what replaced that one behaviour; see the prop
              for which card wants which. */}
          <div
            className={
              picture === "center"
                ? "absolute inset-0"
                : "relative min-h-0 flex-1"
            }
            // The crop dissolves into the card instead of stopping on its
            // edge mid-row — the same move the mocks already make on their
            // right edge when they bleed. A mask, not a gradient overlay, so
            // it fades to whatever the card's ground is and needs no second
            // value for dark.
            //
            // "fit" ONLY, because it is the only one with anything to dissolve:
            // its scene is taller than the space the copy leaves and runs past
            // it top and bottom.
            //
            // "below" is drawn LARGER than the card and is meant to be cut by
            // its edge, and it is the one scene with a near-black panel running
            // the full height — so the ramp came out as a grey wash in the
            // shape of that panel, reading as the artwork being wrong rather
            // than as the picture running on past the frame.
            //
            // "center" has a short scene laid over the whole card with room to
            // spare on every side. There is no crop there to hide, so a fade
            // only took the bottom off a composer that was sitting complete in
            // the middle of the card.
            style={
              picture === "fit"
                ? { WebkitMaskImage: PICTURE_FADE, maskImage: PICTURE_FADE }
                : undefined
            }
          >
            <div
              className={`absolute inset-x-0 aspect-[340/453] ${
                picture === "fit" ? "top-1/2 -translate-y-1/2" : "top-0"
              }`}
              style={
                picture === "fit"
                  ? { marginTop: PICTURE_NUDGE }
                  : picture === "below"
                    ? { marginTop: PICTURE_NUDGE_BELOW }
                    : undefined
              }
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`group/card ${RAIL_W}`}>
      {/* Same ratio ladder as the copyInside card above, and for the same
          reason — see the note there. This is the variant /client-portal's
          journey rail runs, and it is where the tall card actually showed:
          with the copy UNDER the card, a 483px picture on a tablet pushed its
          own caption most of a screen down the page. */}
      <div
        className={`relative w-full select-none overflow-hidden rounded-3xl bg-[var(--surface)] lg:aspect-[3/4] ${
          tallOnPhone ? "aspect-[4/5] sm:aspect-square" : "aspect-square"
        }`}
      >
        {children}
      </div>
      <div className="mt-4 px-1">{copy}</div>
    </div>
  );
}
