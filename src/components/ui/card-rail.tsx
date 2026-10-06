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

const ARROW =
  "flex size-11 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition-[color,border-color,opacity] hover:border-foreground/30 disabled:pointer-events-none disabled:opacity-30 [[data-theme=dark]_&]:border-white/15 [[data-theme=dark]_&]:hover:border-white/30";

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
  const [atEnd, setAtEnd] = useState(false);

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
          role="group"
          aria-label={label}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {children}
        </div>
      </div>

      {/* In their own row under the rail. They were tried on the rail's
          vertical centre at its right edge, which is where the reference puts
          them — but the reference's cards stop short of the column and ours
          run to it, so the arrow sat on top of the last card. */}
      <div className="mt-10 flex items-center justify-end gap-4">
        {lead ? <div className="mr-auto">{lead}</div> : null}
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
      </div>
    </div>
  );
}

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
  children,
}: {
  caption: string;
  /** Shown faint ahead of `name`, e.g. "Step 1". */
  index?: string;
  name?: string;
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
          <div className="shrink-0 p-6 md:p-7">{copy}</div>
          {/* The picture takes whatever height the copy leaves and runs off the
              card's bottom edge, so it reads as a window into the product
              rather than a framed thumbnail sitting in a box. */}
          <div className="relative min-h-0 flex-1">{children}</div>
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
