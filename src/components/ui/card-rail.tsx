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

/** Matches the gap below, in px, so an arrow step lands a card on the edge. */
const GAP_PX = 16;
// A step can land a pixel or two off, and a trackpad can leave a fractional
// scrollLeft, so the ends are judged with a little slack rather than exactly.
const END_SLACK = 2;

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

  const sync = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= END_SLACK);
    setAtEnd(el.scrollLeft >= el.scrollWidth - el.clientWidth - END_SLACK);
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

  // ── Drag to scroll ────────────────────────────────────────────────────
  // Touch and trackpad already drag this rail natively; a mouse did not, so on
  // a desktop the arrows were the only way through it and the cards looked
  // draggable without being so. This adds the mouse case only — pointerType
  // "touch" is left alone, because intercepting it would replace the browser's
  // own momentum and rubber-banding with a worse version of both.
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const [dragging, setDragging] = useState(false);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || e.pointerType === "touch" || e.button !== 0) return;
    drag.current = { x: e.clientX, left: el.scrollLeft, moved: false };
    // Imperatively, not through the className below: smooth scrolling animates
    // towards each scrollLeft we assign, so the rail would lag the pointer and
    // never catch up — and a React state flip only lands a frame later, which
    // is exactly the frames the drag starts on.
    el.style.scrollBehavior = "auto";
    setDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    const d = drag.current;
    if (!el || !d) return;
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
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    // Back to the stylesheet's smooth, which the arrow buttons rely on.
    if (el) el.style.scrollBehavior = "";
    try {
      if (el?.hasPointerCapture(e.pointerId))
        el.releasePointerCapture(e.pointerId);
    } catch {}
    // Kept until the click that follows this release has been swallowed below.
    if (drag.current?.moved) requestAnimationFrame(() => (drag.current = null));
    else drag.current = null;
    setDragging(false);
  };

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
      <div className="-my-4 overflow-hidden py-4">
        <div
          ref={ref}
          onScroll={sync}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
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
          className={`flex snap-x snap-proximity gap-4 overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
            dragging ? "cursor-grabbing select-none" : "cursor-grab"
          }`}
        >
          {children}
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
// is dimmed on its way past.
//
// Eased and LONG, and both halves of that matter.
//
// Eased: two stops (#000 to 76%, then transparent at 99%) put a corner in the
// alpha curve at 76% and another at 99%. On a flat dark panel like the Build
// card's sidebar, a corner in the curve is a visible horizontal line, so the
// "fade" announced itself twice instead of smoothing. These stops approximate
// an ease-out — small alpha steps where the fade begins, larger ones once it
// is already moving — so no point along the run changes rate sharply enough
// to read as an edge. It finishes at 100% rather than 99%, since that last 1%
// was a hard cut of whatever alpha remained.
//
// Long: easing alone was not enough. A near-black panel dissolving over white
// is the highest-contrast thing this mask ever has to do, and compressed into
// the last quarter of the card even a smooth ramp reads as a grey band laid
// over the art. Starting at 20% spreads the same ramp over four fifths of the
// run, which is slow enough that no single stretch of it reads as a feature
// of the picture. The early stops are deliberately tiny — 1% of alpha by a
// third of the way down — so the content up there is not visibly dimmed to
// buy that length.
const PICTURE_FADE =
  "linear-gradient(to bottom, #000 0 20%, rgba(0,0,0,0.99) 31%, rgba(0,0,0,0.96) 40%, rgba(0,0,0,0.91) 48%, rgba(0,0,0,0.84) 56%, rgba(0,0,0,0.74) 63%, rgba(0,0,0,0.62) 70%, rgba(0,0,0,0.49) 77%, rgba(0,0,0,0.35) 84%, rgba(0,0,0,0.22) 90%, rgba(0,0,0,0.11) 95%, rgba(0,0,0,0.04) 98%, transparent 100%)";

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
  children: React.ReactNode;
}) {
  const copy = (
    <>
      {/* Index, dash and name are one line in one face and ONE colour —
            toning the index down made the kicker read as two labels. The em
            dash is the separator the blog's post meta line uses. */}
      {name ? (
        // PP Mori, sentence case. It was type-eyebrow — ABC Diatype Mono in
        // all caps — which on a card whose body is set in the page's own
        // face read as a label stuck on from another system.
        <p className="mb-2 flex min-w-0 items-baseline gap-2 text-sm text-muted-foreground">
          {index ? (
            <>
              <span className="shrink-0 tabular-nums">{index}</span>
              <span aria-hidden className="shrink-0">
                &mdash;
              </span>
            </>
          ) : null}
          <span className="truncate">{name}</span>
        </p>
      ) : null}
      <p className="text-pretty text-foreground">{caption}</p>
    </>
  );

  if (copyInside) {
    return (
      <div className="group/card w-[78%] shrink-0 snap-start sm:w-[62%] md:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2rem)/3)]">
        <div className="relative flex aspect-[3/4] w-full select-none flex-col overflow-hidden rounded-3xl bg-[var(--surface)]">
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
            style={{ WebkitMaskImage: PICTURE_FADE, maskImage: PICTURE_FADE }}
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
    <div className="group/card w-[78%] shrink-0 snap-start sm:w-[62%] md:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2rem)/3)]">
      <div className="relative aspect-[3/4] w-full select-none overflow-hidden rounded-3xl bg-[var(--surface)]">
        {children}
      </div>
      <div className="mt-4 px-1">{copy}</div>
    </div>
  );
}
