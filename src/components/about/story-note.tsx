"use client";

import { useEffect, useId, useRef, useState } from "react";

/**
 * An annotated phrase in the story: a dotted-underlined run of text plus a small
 * marker, which opens a panel with the aside or the source behind the claim.
 *
 * The claim stays in the sentence and the qualification moves out of it, so the
 * prose can say "more than 1,000 firms" without a parenthetical explaining what
 * counts as a firm. Nothing load-bearing goes in a note — a reader who never
 * opens one has still read the whole argument.
 *
 * Only the marker is the anchor, not the phrase: a `position: relative` wrapper
 * around the phrase would have to be inline-block, and an inline-block phrase
 * can't break across lines.
 */
export function StoryNote({
  children,
  note,
  media,
}: {
  /** The phrase in the sentence that carries the underline. */
  children: React.ReactNode;
  /** The aside itself. Short — a panel, not a sidebar. */
  note: React.ReactNode;
  /**
   * Optional art above the text. Must be inline-level markup (an `<img>`, or
   * `NoteImagePlaceholder`): the panel lives inside a paragraph, so a block
   * element here would be invalid HTML and break hydration.
   */
  media?: React.ReactNode;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  // Which edge the panel hangs from, decided when it opens so a marker near the
  // right edge of the column doesn't push the panel off screen.
  const [align, setAlign] = useState<"left" | "right">("left");
  const anchorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onPointer = (e: PointerEvent) => {
      if (!anchorRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    // Capture phase, so opening a second note closes the first rather than
    // leaving two panels on the page.
    document.addEventListener("pointerdown", onPointer, true);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer, true);
    };
  }, [open]);

  const toggle = () => {
    if (!open && anchorRef.current) {
      const { left } = anchorRef.current.getBoundingClientRect();
      setAlign(left + PANEL_WIDTH > window.innerWidth - EDGE_GUTTER ? "right" : "left");
    }
    setOpen((v) => !v);
  };

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        className="cursor-pointer text-left underline decoration-foreground/25 decoration-dotted decoration-1 underline-offset-[3px] transition-colors hover:decoration-foreground/50 hover:text-foreground"
      >
        {children}
      </button>
      <span ref={anchorRef} className="relative inline-block">
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          aria-controls={open ? id : undefined}
          aria-label="Show the note on this"
          className={`ml-1 inline-flex h-4 w-4 translate-y-[-0.35em] items-center justify-center rounded-[3px] text-[11px] leading-none transition-colors ${
            open
              ? "bg-foreground/20 text-foreground"
              : "bg-foreground/10 text-muted-foreground hover:bg-foreground/[0.16] hover:text-foreground"
          }`}
        >
          *
        </button>

        {open && (
          // The site's popover surface, lifted from the select menu rather than
          // restyled into a second one that looks almost like it.
          <span
            id={id}
            role="note"
            style={{ width: PANEL_WIDTH }}
            className={`absolute top-full z-30 mt-2 block max-w-[78vw] animate-fade-in rounded-lg border border-border bg-background p-4 text-left shadow-[0_16px_44px_-26px_rgba(20,20,40,0.35)] [[data-theme=dark]_&]:border-[#383838] [[data-theme=dark]_&]:bg-[#1c1c1c] ${
              align === "right" ? "right-0" : "left-0"
            }`}
          >
            {media && (
              <span className="mb-3 block overflow-hidden rounded-md [&_img]:block [&_img]:w-full">
                {media}
              </span>
            )}
            <span className="type-caption block text-pretty text-muted-foreground [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4">
              {note}
            </span>
          </span>
        )}
      </span>
    </>
  );
}

const PANEL_WIDTH = 340;
// Keeps the panel off the viewport edge when it flips.
const EDGE_GUTTER = 24;

/**
 * Stands in for art in a note until there is real art. A span, not a div — see
 * the `media` prop.
 */
export function NoteImagePlaceholder() {
  return (
    <span
      aria-hidden
      className="block aspect-[16/9] w-full rounded-md bg-foreground/[0.07]"
    />
  );
}
