"use client";

// ─────────────────────────────────────────────────────────────────────────
// EDGE FADE SCROLLER — a horizontal scroller whose ends dissolve instead of
// being guillotined, and only on the side that actually has more to show.
//
// The card rail already does this for cards; the logo strip needs the same
// thing for marks, and a hard cut through a wordmark is the worse of the two
// cases — a card cut in half still reads as a card, where half of "DITTO"
// reads as a rendering fault.
//
// It is a separate, smaller component rather than a reuse of CardRail because
// the rail is the thing with arrows, drag-to-scroll and snap points, and a row
// of logos wants none of those. What the two share is the fade, so what is
// shared here are its two lengths — kept equal to the rail's on purpose, since
// two dissolving edges on one page that disagree about length read as a
// mistake rather than as a treatment.
//
// A CLIENT component, and it takes children rather than data, so a server
// component can still render what goes in it. The logo row's links pull case
// study records to name themselves for screen readers; handing that module to
// the browser to animate two gradients would be a poor trade.
// ─────────────────────────────────────────────────────────────────────────

import { useCallback, useEffect, useRef, useState } from "react";
import { fadeMask, fadeMaskStyle } from "@/components/ui/fade-mask";

// See card-rail, which runs the same pair. AHEAD is long because a whole item
// is cut there and the ramp has to read as the row carrying on past the frame;
// BEHIND is short because the left edge usually has nothing to dissolve and a
// long ramp there only dims content that is fully on screen.
const FADE_AHEAD = 82;
const FADE_BEHIND = 96;
// A step can land a pixel or two off, and a trackpad can leave a fractional
// scrollLeft, so the ends are judged with slack rather than exactly.
const END_SLACK = 2;

export function EdgeFadeScroller({
  children,
  className = "",
}: {
  children: React.ReactNode;
  /** Classes for the scroller itself — layout, gaps, breakpoint behaviour. */
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Both start true, so a row whose contents all fit never flashes a fade on
  // first paint and then drops it. sync() corrects it within the frame.
  const [atStart, setAtStart] = useState(true);
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
    // Resizing changes how much fits, so a row that scrolled at one width can
    // be whole at another and both fades have to go.
    const observer = new ResizeObserver(sync);
    observer.observe(el);
    return () => observer.disconnect();
  }, [sync]);

  const masks = [
    atStart ? null : fadeMask("to left", FADE_BEHIND),
    atEnd ? null : fadeMask("to right", FADE_AHEAD),
  ].filter((m): m is string => m !== null);

  return (
    <div style={masks.length ? fadeMaskStyle(masks) : undefined}>
      <div ref={ref} onScroll={sync} className={className}>
        {children}
      </div>
    </div>
  );
}
