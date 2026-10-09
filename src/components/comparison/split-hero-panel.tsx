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

const CARD =
  "absolute inset-0 overflow-hidden rounded-[28px] bg-background shadow-[0_2px_4px_rgba(16,24,40,0.06),0_30px_60px_-30px_rgba(16,24,40,0.35)] transition-opacity duration-500 motion-reduce:transition-none";

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
      <div
        className="flex items-center gap-1"
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
            className={`rounded-full px-4 py-2 text-sm transition-colors duration-300 ${
              i === view
                ? "bg-background text-foreground shadow-[0_1px_2px_rgba(16,24,40,0.08)]"
                : "text-foreground/80 hover:bg-white/30 [[data-theme=dark]_&]:text-black/70"
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* A fixed height on a phone, where the card's width alone left too
          little room for the card's contents. */}
      <div className="relative h-[480px] w-full max-w-[400px] lg:aspect-[4/5] lg:h-auto">
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
  );
}
