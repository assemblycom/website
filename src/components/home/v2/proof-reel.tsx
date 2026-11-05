"use client";

import Link from "next/link";
import { useState } from "react";
import { CustomerLogo } from "@/components/customers/customer-logos";

// ─────────────────────────────────────────────────────────────────────────
// PROOF REEL — the marks themselves, and the one line of payoff under them.
//
// Every logo here has a case study behind it, and at rest nothing on the row
// said so: eight muted wordmarks read as decoration, and a visitor who never
// moused over one never learned there was anywhere to go.
//
// ONE SHARED CAPTION, not a label per mark. Nine captions would have to live
// somewhere at rest — under the marks, where they turn the reel into a table,
// or inside a tooltip, which is a second object to draw. A single reserved
// line under the row costs one line of page and is empty until the pointer
// lands, so the quiet state stays quiet and the hover state says the thing
// worth saying: who it is, and what it got.
//
// The caption is the customer's own headline figure rather than their name —
// the name is already legible in the mark above it, and "2x faster partner
// onboarding" is the reason to click.
// ─────────────────────────────────────────────────────────────────────────

export interface ReelItem {
  slug: string;
  company: string;
  /** The customer's headline figure, e.g. "2x faster partner onboarding". */
  result: string;
}

export function ProofReel({ items }: { items: ReelItem[] }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const active = items.find((i) => i.slug === hovered) ?? null;

  return (
    <div>
      <ul
        // Seven across, not eight. Heritage Law's mark is a fine-lined tree
        // over two lines of letter-spaced small caps — detail that survives on
        // a case-study page and turns to grey mush at 120x28, worst of all on
        // the dark ground.
        // ONE LINE ON A PHONE, scrolled rather than wrapped. Two across and
        // four rows deep, the reel stopped being a reel: it read as a list of
        // customers you were meant to go through, and it pushed the section
        // below it most of a screen down. A row that runs off the edge says
        // "there are more of these" in the space of one line, which is the
        // only thing eight logos have to say.
        //
        // The scrollbar is hidden and the ends are inset by the page gutter,
        // so the first mark starts on the measure and the last one has room
        // to clear it.
        // SEVEN ACROSS FROM md, not from lg. Four columns and seven marks is
        // a row of four over a row of three, which reads as a grid that ran
        // out rather than as a reel — and the ragged second row is the first
        // thing the eye lands on. A tighter gutter is what buys the seventh
        // column at this width; it opens back up at lg.
        className="-mx-6 flex snap-x snap-mandatory items-center gap-2 overflow-x-auto px-6 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-4 sm:gap-x-4 sm:gap-y-2 sm:overflow-visible sm:px-0 md:grid-cols-7 md:gap-x-2 lg:gap-x-4 [&::-webkit-scrollbar]:hidden"
        onMouseLeave={() => setHovered(null)}
      >
        {items.map((item) => (
          <li
            key={item.slug}
            className="flex shrink-0 snap-start items-center justify-center sm:shrink"
          >
            <Link
              href={`/customers/${item.slug}`}
              onMouseEnter={() => setHovered(item.slug)}
              onFocus={() => setHovered(item.slug)}
              onBlur={() => setHovered(null)}
              aria-label={`${item.company}: ${item.result}. Read the story`}
              // THE MARK CHANGES COLOUR; NOTHING IS DRAWN BEHIND IT. There
              // was a soft plate on the whole cell, and at 132x56 it is a
              // grey square appearing beside seven marks that have no boxes
              // — the plate became the thing you noticed rather than the
              // logo under it. The row already dims every other mark while
              // one is hovered, so the mark under the pointer goes to full
              // ink against neighbours at a fifth of it: a bigger change
              // than the plate was, and it happens to the logo itself.
              className={`flex h-14 w-[132px] items-center justify-center px-3 transition-colors duration-200 sm:w-full ${
                hovered === item.slug
                  ? "text-foreground"
                  : hovered
                    ? "text-foreground/20"
                    : "text-foreground/40"
              }`}
            >
              {/* The wrapper has to carry a width as well as a height: a
                  `fit` logo ignores its own aspect ratio and takes its box from
                  the parent, so an auto-width flex row collapsed every masked
                  wordmark to nothing while the two inline SVGs — which have a
                  viewBox to size from — rendered fine. */}
              <span
                aria-hidden
                className="flex h-7 w-full max-w-[120px] items-center justify-center"
              >
                <CustomerLogo
                  slug={item.slug}
                  fit
                  surface="var(--background)"
                />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* NOT ON A PHONE. There is no pointer to cross the marks there, and
          the row is a scroller — the line only ever appeared on a tap that
          was already navigating away, and the customer name plus its figure
          wrapped to two ragged lines in a space reserved for one. The marks
          link straight through on a phone and each link carries the same
          words in its own label.
          
          HEIGHT RESERVED, CONTENT NOT. The line is always in the layout, so
          the industries row below never moves when the pointer crosses the
          reel; only its contents fade in. `aria-hidden` because each link
          already carries the same words in its own label, and a live region
          announcing a figure on every mouse move is noise. */}
      <p
        aria-hidden
        className={`mt-5 hidden h-5 items-center justify-center gap-2 text-sm text-muted-foreground transition-opacity duration-200 sm:flex ${
          active ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="text-foreground">{active?.company}</span>
        <span aria-hidden className="text-border">
          /
        </span>
        <span>{active?.result}</span>
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className="size-3 opacity-60"
        >
          <path d="M6 3.5 10.5 8 6 12.5" />
        </svg>
      </p>
    </div>
  );
}
