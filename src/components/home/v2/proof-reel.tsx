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

/**
 * One mark, as it appears in both the phone's reel and the desktop grid.
 *
 * THE MARK CHANGES COLOUR; NOTHING IS DRAWN BEHIND IT. There was a soft plate
 * on the whole cell, and at 132x56 it is a grey square appearing beside seven
 * marks that have no boxes — the plate became the thing you noticed rather
 * than the logo under it. The row already dims every other mark while one is
 * hovered, so the mark under the pointer goes to full ink against neighbours
 * at a fifth of it: a bigger change than the plate was, and it happens to the
 * logo itself.
 */
function Mark({
  item,
  hovered,
  setHovered,
  duplicate = false,
}: {
  item: ReelItem;
  hovered: string | null;
  setHovered: (slug: string | null) => void;
  /** The reel's second copy: present for the eye, absent for everything else. */
  duplicate?: boolean;
}) {
  return (
    <Link
      href={`/customers/${item.slug}`}
      onMouseEnter={() => setHovered(item.slug)}
      onFocus={() => setHovered(item.slug)}
      onBlur={() => setHovered(null)}
      aria-label={`${item.company}: ${item.result}. Read the story`}
      {...(duplicate ? { "aria-hidden": true, tabIndex: -1 } : null)}
      // OPACITY, NOT AN INK ALPHA. The marks were `text-foreground/40`, which
      // is 40% ink — fine for a wordmark drawn as one flat mask, wrong for the
      // two that are real SVGs: their shapes overlap, and two 40% shapes
      // compound to 64% where they cross, so Capital One's swoosh came out a
      // good deal darker than every mask beside it. Fading the whole element
      // instead means the mark is composited first and dimmed after, so every
      // logo in the row lands on the same tone whatever it is made of.
      className={`flex h-14 w-[132px] shrink-0 items-center justify-center px-3 text-foreground transition-opacity duration-200 sm:w-full ${
        hovered === item.slug
          ? "opacity-100"
          : hovered
            ? "opacity-20"
            : "opacity-40"
      }`}
    >
      {/* The wrapper has to carry a width as well as a height: a `fit` logo
          ignores its own aspect ratio and takes its box from the parent, so an
          auto-width flex row collapsed every masked wordmark to nothing while
          the two inline SVGs — which have a viewBox to size from — rendered
          fine. */}
      <span
        aria-hidden
        className="flex h-7 w-full max-w-[120px] items-center justify-center"
      >
        <CustomerLogo slug={item.slug} fit surface="var(--background)" />
      </span>
    </Link>
  );
}

export function ProofReel({ items }: { items: ReelItem[] }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const active = items.find((i) => i.slug === hovered) ?? null;

  return (
    <div>
      {/* ── The phone's reel ──────────────────────────────────────────── */}
      {/* IT RUNS ITSELF. The row was a snap scroller: one line of marks with
          the rest off the edge, which says "there are more of these" only to
          someone who thinks to push it sideways. Most people do not, so on a
          phone the reel was three logos and a cut edge. Running, it shows
          every customer without being asked, and the cut edge becomes the
          point rather than a loss.

          The site's own marquee — `w-max` + `animate-marquee` over a track
          drawn twice, as the hero's logo row does it. The second copy is what
          makes the loop seamless (the keyframe travels exactly -50%); it is
          `aria-hidden` and out of the tab order, so a screen reader and a
          keyboard meet each customer once.

          The marks are not interactive here: the row is moving, so a tap
          would land on whatever happened to be under the finger. They are
          still links, and `motion-reduce` stops the row for anyone who has
          asked for less movement — which hands back a plain, readable line. */}
      {/* With reduced motion the row stops, so it scrolls by hand instead:
          otherwise the marks past the edge would be unreachable on a phone. */}
      <div className="-mx-6 overflow-hidden motion-reduce:overflow-x-auto sm:hidden">
        <div className="flex w-max animate-marquee items-center gap-2 motion-reduce:animate-none">
          {[0, 1].map((copy) =>
            items.map((item) => (
              <Mark
                key={`${copy}-${item.slug}`}
                item={item}
                // No hover state on the phone's reel: a tap sticks as a hover
                // there and left one moving logo lit. Every mark stays grey.
                hovered={null}
                setHovered={() => {}}
                duplicate={copy === 1}
              />
            )),
          )}
        </div>
      </div>

      {/* ── The grid, from sm ─────────────────────────────────────────── */}
      <ul
        // Seven across, not eight. Heritage Law's mark is a fine-lined tree
        // over two lines of letter-spaced small caps — detail that survives on
        // a case-study page and turns to grey mush at 120x28, worst of all on
        // the dark ground.
        // SEVEN ACROSS FROM md, not from lg. Four columns and seven marks is
        // a row of four over a row of three, which reads as a grid that ran
        // out rather than as a reel — and the ragged second row is the first
        // thing the eye lands on. A tighter gutter is what buys the seventh
        // column at this width; it opens back up at lg.
        className="hidden sm:grid sm:grid-cols-4 sm:items-center sm:gap-x-4 sm:gap-y-2 md:grid-cols-7 md:gap-x-2 lg:gap-x-4"
        onMouseLeave={() => setHovered(null)}
      >
        {items.map((item) => (
          <li key={item.slug} className="flex items-center justify-center">
            <Mark item={item} hovered={hovered} setHovered={setHovered} />
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
      {/* ON A PLATE, not loose on the page. Set as bare text the line read as
          a caption the row had always had and that happened to be blank most
          of the time; given a ground it reads as something the hover PUT
          there. Squared-off rather than a true pill: `rounded-lg` is the
          radius every other small plate on the site uses, and a capsule here
          would be a shape this page has nowhere else.

          The height stays reserved on the row and the plate fades inside it,
          so the industries row below never moves when the pointer crosses the
          reel. h-8 is the plate's own height, which is what that row now has
          to reserve. */}
      <p
        aria-hidden
        className="mt-5 hidden h-8 items-center justify-center sm:flex"
      >
        <span
          className={`inline-flex items-center gap-2 rounded-lg bg-muted px-3 py-1.5 text-sm text-muted-foreground transition-opacity duration-200 [[data-theme=dark]_&]:bg-white/[0.06] ${
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
        </span>
      </p>
    </div>
  );
}
