"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useActiveHeading } from "@/components/ui/use-active-heading";

/** Anything with an anchor and a label. Structural, so both callers fit it. */
export interface TocHeading {
  id: string;
  text: string;
}

// The nav is 56px tall at rest but settles to 48px once scrolled, and the bar
// only ever shows while scrolled — so it pins to the settled height. Pinning to
// the taller one left an 8px strip between the two that the article scrolled
// through. A heading has to clear both bars before it counts as the current one.
const HEADER_HEIGHT = 48;
const BAR_HEIGHT = 48;

/**
 * The contents rail for a phone. There's no room for a list beside the body, so
 * the sections collapse into one line that names where you are — a position
 * indicator rather than the map the desktop rail is, so the current section
 * tracks scroll.
 *
 * It does not open. A dropdown holding the whole list was a scrolling list
 * inside a scrolling document, and the line already does the job the reader
 * needs on a phone: telling them where they are.
 *
 * It rides above the page rather than sitting in it: nothing to say until the
 * reader is in the body, so it arrives when the body reaches the header and
 * leaves at the end of it.
 *
 * Shared by the blog posts and the legal pages. `bodySelector` is how it finds
 * the region it belongs to — the only thing that differed between the two, and
 * the reason this was a blog-only component until now.
 */
export function TocMobile({
  headings,
  bodySelector,
  id = "toc-mobile",
}: {
  headings: TocHeading[];
  /** CSS selector for the body region this bar tracks, e.g. ".post-body". */
  bodySelector: string;
  /** Distinct per page, so two bars could never share an id. */
  id?: string;
}) {
  const [shown, setShown] = useState(false);
  // Which section is being read — shared with the desktop rail, see the hook.
  const [activeId] = useActiveHeading(headings);

  useEffect(() => {
    // Whether the bar belongs on screen at all: it has nothing to say until the
    // reader is inside the body, and nothing once they are past it.
    const update = () => {
      const body = document.querySelector(bodySelector);
      if (!body) return;
      const { top, bottom } = body.getBoundingClientRect();
      const inArticle =
        top <= HEADER_HEIGHT && bottom > HEADER_HEIGHT + BAR_HEIGHT;
      setShown(inArticle);
    };

    // Measured on the event rather than on the next frame: a dozen rects is
    // cheap, and a frame-scheduled read goes stale wherever frames stop —
    // a backgrounded tab, an embedded preview — leaving the bar behind the page.
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [bodySelector]);

  // Tells the nav that a bar is drawn directly under it. The nav's own chrome is
  // a blur that fades out over the content below, which has nothing to fade into
  // when an opaque bar starts where it ends — so on these pages, and only while
  // the bar is actually shown, the nav fills instead. Set on <html> because the
  // nav is a sibling of this component's page, not an ancestor.
  useEffect(() => {
    if (!shown) return;
    const root = document.documentElement;
    root.dataset.tocBar = "true";
    return () => {
      delete root.dataset.tocBar;
    };
  }, [shown]);

  const active = headings.find((heading) => heading.id === activeId);

  return (
    <div
      className={cn(
        // Fixed rather than in flow: in flow it held a slot in the article from
        // the first screen, which put a bar and a gap above copy nobody had
        // started reading.
        "fixed inset-x-0 z-40 lg:hidden",
        // A hairline lighter than the site's border token in both themes: this
        // one runs the full width directly under the nav, where the shared
        // border reads as a rule drawn across the page rather than the edge of a
        // bar. #383838 on the near-black ground was the loudest of the two.
        "border-b border-border/60 bg-background [[data-theme=dark]_&]:border-white/[0.08]",
        // The bar's surface carries on above itself, tucked under the nav, so
        // the seam stays opaque through the nav's own height transition.
        "before:absolute before:inset-x-0 before:bottom-full before:h-3 before:bg-background",
        "transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none",
        shown ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
      )}
      id={id}
      style={{ top: HEADER_HEIGHT }}
      aria-hidden={!shown}
      // Out of reach while it is out of sight, so a tap near the top of the
      // page hits the article and not a bar that isn't drawn.
      inert={!shown || undefined}
    >
      {/* Not a control: no chevron, nothing to press. Just the label.
          px-5, the nav's own gutter at every width this bar is drawn at, so the
          label starts on the same line as the wordmark above it. */}
      <p className="flex h-12 w-full items-center px-5 text-sm text-foreground">
        <span className="truncate">{active?.text ?? "On this page"}</span>
      </p>
    </div>
  );
}
