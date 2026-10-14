"use client";

import { useState, type ReactNode } from "react";
import { PANEL_BG } from "@/components/comparison/brand-panel";
import { FootBlur } from "@/components/ui/foot-blur";

// No shadow. The card sits on a gradient panel that is already doing the
// lifting — the white against the colour is the separation — and a 60px drop
// under it pooled into a grey smudge on the panel's pale foot, which read as a
// dirty mark on the artwork rather than as depth.
// Both views share one grid cell rather than being absolutely positioned, so
// the stack is as tall as the taller of them and no taller. See the slot.
// A faint inset edge instead: where the panel's gradient runs pale at its
// foot, a white card with no edge of its own melted into it.
const CARD =
  "[grid-area:1/1] overflow-hidden rounded-[28px] max-lg:rounded-b-none bg-background shadow-[inset_0_0_0_1px_rgba(16,24,40,0.05),inset_0_1px_3px_rgba(16,24,40,0.05)] transition-opacity duration-500 motion-reduce:transition-none";

/**
 * The right half of a comparison page's split hero: a brand panel, a two-way
 * switch, and one card that crossfades between the two views.
 */
export function SplitHeroPanel({
  label,
  views,
  blurFoot = false,
}: {
  /** What the switch chooses between, for screen readers. */
  label: string;
  /** Blurs the foot of the cropped window below lg. */
  blurFoot?: boolean;
  views: { label: string; content: ReactNode }[];
}) {
  const [view, setView] = useState(0);

  return (
    <div
      className="flex h-full flex-col items-center justify-center gap-6 px-6 pt-8 max-lg:justify-start lg:py-14"
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
      {/* Below lg the window runs off the panel's foot: no bottom padding, no
          rounded bottom, no fade. The panel's edge cuts the screen, which
          reads as a screen carrying on past it and keeps the hero short. */}
      {/* The blur sits beside the clipped window, not in it: inside a rounded,
          overflow-clipped box Chrome drops the blur's mask and draws it at
          full strength from a hard edge. */}
      <div className="relative w-full max-w-[400px]">
        <div className="relative h-[300px] w-full overflow-hidden rounded-[28px] max-lg:rounded-b-none lg:h-auto lg:aspect-[4/5]">
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
        {blurFoot && <FootBlur className="lg:hidden" />}
      </div>
    </div>
  );
}
