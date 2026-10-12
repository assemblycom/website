"use client";

import { useState, type ReactNode } from "react";

// The site's two brand hues softened toward white, under a fine grain, so
// the panel reads as lit material rather than a flat swatch.
const PERIWINKLE = "#7DA4FF";
const LIME = "#D9ED92";
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.18 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;
const PANEL_BG = [
  GRAIN,
  `radial-gradient(60% 70% at 85% 10%, ${PERIWINKLE} 0%, transparent 70%)`,
  `radial-gradient(70% 70% at 15% 95%, ${LIME} 0%, transparent 70%)`,
  `linear-gradient(160deg in oklab, color-mix(in oklab, ${PERIWINKLE} 70%, white), color-mix(in oklab, ${LIME} 70%, white))`,
].join(", ");

// No shadow. The card sits on a gradient panel that is already doing the
// lifting — the white against the colour is the separation — and a 60px drop
// under it pooled into a grey smudge on the panel's pale foot, which read as a
// dirty mark on the artwork rather than as depth.
// Both views share one grid cell rather than being absolutely positioned, so
// the stack is as tall as the taller of them and no taller. See the slot.
const CARD =
  "[grid-area:1/1] overflow-hidden rounded-[28px] bg-background transition-opacity duration-500 motion-reduce:transition-none";

/**
 * The right half of a comparison page's split hero: a brand panel, a two-way
 * switch, and one card that crossfades between the two views.
 */
export function SplitHeroPanel({
  label,
  views,
}: {
  /** What the switch chooses between, for screen readers. */
  label: string;
  views: { label: string; content: ReactNode }[];
}) {
  const [view, setView] = useState(0);

  return (
    <div
      className="flex h-full flex-col items-center justify-center gap-6 px-6 py-10 md:py-14"
      style={{ background: PANEL_BG }}
    >
      {/* A track around the pair, so the control reads as a switch with two
          positions rather than as one lit pill beside a loose word. The outline
          is what draws the second position: unframed, the inactive label had no
          edge of its own and the thing looked like a button with a caption.

          White-alpha rather than --border: the panel is a fixed gradient that
          does not flip with the theme (the labels already hardcode a dark-mode
          ink for the same reason), so a token that flips would go dark on a
          surface that stayed light. */}
      <div
        className="flex items-center gap-1 rounded-full border border-white/55 bg-white/15 p-1"
        role="tablist"
        aria-label={label}
      >
        {views.map((v, i) => (
          <button
            key={v.label}
            type="button"
            role="tab"
            aria-selected={i === view}
            onClick={() => setView(i)}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors duration-300 ${
              i === view
                ? "bg-background text-foreground shadow-[0_1px_2px_rgba(16,24,40,0.08)]"
                : "text-foreground/70 hover:bg-white/30 [[data-theme=dark]_&]:text-black/60"
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* On a phone the card is a FIXED window and the screen inside it
          crops on the bottom edge, which is what /client-portal's hero does
          (a 760px mock inside a shorter box, clipped). Sized to its contents
          it was 449px on this page and 381 on the other — honest, but still
          most of a phone screen spent on a mock, below the copy and the
          buttons the reader came for.

          360 shows the whole top of either screen and cuts the foot, so the
          card reads as a window onto something that continues rather than as
          a shrunken picture of the whole thing. Nothing is compressed: the
          inner stack keeps its natural height and the box clips it.

          From lg the aspect ratio governs again and the stack fills it, as
          before — there the panel is a column of the hero and its proportion
          is the design. */}
      <div className="relative h-[360px] w-full max-w-[400px] overflow-hidden rounded-[28px] lg:h-auto lg:aspect-[4/5]">
        <div className="absolute inset-x-0 top-0 grid lg:bottom-0">
          {views.map((v, i) => (
            <div
              key={v.label}
              aria-hidden={view !== i}
              className={`${CARD} ${view === i ? "opacity-100" : "pointer-events-none opacity-0"}`}
            >
              {v.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
