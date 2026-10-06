"use client";

import { useEffect, useRef, useState } from "react";
import { GRID_LINE } from "@/components/ui/grid-lines";

export interface Pillar {
  heading: string;
  body: string;
  /**
   * The two or three facts that back the claim, shown as label/value rows under
   * the visual rather than as a paragraph in the column of copy. A cleared
   * first-party number belongs here; prose does not.
   */
  facts: { label: string; value: string }[];
  /** The product shot that backs the claim. */
  visual: React.ReactNode;
}

/**
 * The four message pillars as one section: claims stacked in a left column, the
 * visual and its facts pinned beside them on the right.
 *
 * The lines are the structure. A rule sits above every claim, the first
 * included, and each is pulled out past the section's padding so its left end
 * lands on the page's own vertical rail; its right end meets the vertical rule
 * between the columns, which runs the height of the block. No full-width rule
 * opens the block: the claims' own top rule is the one that belongs here, and a
 * second line running past the vertical read as a stray.
 *
 * Laid out with flex rather than grid on purpose: a rule that spans both
 * columns and a right column that spans every row cannot share a CSS grid, and
 * trying it placed the pinned column in its own row above the first claim.
 *
 * Below md there is no pinned column: each claim carries its own visual and
 * facts underneath it, in reading order.
 */
export function BuilderPillars({ pillars }: { pillars: Pillar[] }) {
  const [active, setActive] = useState(0);
  const items = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Whichever claim's middle is nearest the middle of the viewport is the one
    // being read, so that is the one the pinned column shows.
    //
    // Measured on scroll rather than watched with an IntersectionObserver. The
    // observer sorted the intersecting entries by ratio inside a -40%/-40%
    // band, which is only a fifth of the viewport: a claim taller than that
    // band never fills it, so two neighbours could report near-identical
    // ratios and the winner flipped on a few pixels of scroll. It also only
    // fired on threshold crossings, so between two of them the picture sat on
    // the previous claim while you were already reading the next one — the
    // image and the words visibly out of step. Distance from the centre line
    // is a total order, so there is always exactly one answer.
    let frame = 0;
    const pick = () => {
      frame = 0;
      const middle = window.innerHeight / 2;
      let best = 0;
      let bestDistance = Infinity;
      items.current.forEach((el, i) => {
        if (!el) return;
        const { top, height } = el.getBoundingClientRect();
        const distance = Math.abs(top + height / 2 - middle);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = i;
        }
      });
      setActive(best);
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(pick);
    };
    pick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pillars.length]);

  const current = pillars[active] ?? pillars[0];

  return (
    <section className="mx-auto max-w-[1200px] px-6 md:px-10">
      {/* Opens the block edge to edge, both ends on a rail. The claims' own
          rules below it stop at the vertical guide between the columns. */}
      <div className={`-mx-6 border-t md:-mx-10 ${GRID_LINE}`} />

      <div className="md:flex md:items-stretch">
        <div className="md:flex-1">
          {pillars.map((pillar, i) => (
            <div
              key={pillar.heading}
              ref={(el) => {
                items.current[i] = el;
              }}
              // Pulled out past the section's padding so the rule's left end
              // lands on the page's own vertical rail; the padding then holds
              // the copy clear of both lines.
              // Asymmetric on purpose: the claim sits close to the rule that
              // opens it and well clear of the one that closes it.
              className={`-mx-6 px-6 pb-16 pt-10 md:mx-0 md:-ml-10 md:pb-32 md:pl-10 md:pr-6 md:pt-14 lg:pl-12 lg:pr-8 ${
                i > 0 ? "md:border-t" : ""
              } ${GRID_LINE}`}
            >
              <h3 className="type-h3 text-balance leading-[1.2]">
                {pillar.heading}
              </h3>
              <p className="mt-4 max-w-md text-muted-foreground">
                {pillar.body}
              </p>
              {/* Phone: the visual and its facts belong to their own claim, in
                  reading order. */}
              <div className="md:hidden">
                <div className="relative mt-8 aspect-[16/9.6] overflow-hidden rounded-2xl bg-[var(--surface)] p-4">
                  <div className="h-full overflow-hidden rounded-xl">
                    {pillar.visual}
                  </div>
                </div>
                <FactList facts={pillar.facts} />
              </div>
            </div>
          ))}
        </div>

        {/* The pinned column. A flex child stretches by default, so its left
            border is the vertical guide the claims' rules terminate on. */}
        <div
          className={`hidden md:block md:-mr-10 md:w-[56%] md:border-l md:pl-6 md:pr-10 lg:pl-8 lg:pr-12 ${GRID_LINE}`}
        >
          {/* pt-14 matches the claims' own md:pt-14, so the shot's top edge
              starts on the same line as the first claim's heading rather than
              24px below it. */}
          <div className="sticky top-24 pb-20 pt-14">
            {/* All four are mounted and cross-faded, so the one coming in is
                already laid out and nothing reflows mid-switch. 300ms, not
                500: at half a second the outgoing shot was still fading while
                the next claim was being read.

                16:9.6, the shape the product shots are drawn at. A square
                frame left a third of itself empty under the widest of them and
                squeezed the CRM's columns until the names truncated — these
                are screens, and screens are wider than they are tall. */}
            <div className="relative aspect-[16/9.6] overflow-hidden rounded-2xl bg-[var(--surface)]">
              {pillars.map((pillar, i) => (
                <div
                  key={pillar.heading}
                  aria-hidden={i !== active}
                  // Inset, not inset-0. Every one of these shots paints its own
                  // white ground, so filling the frame hid the frame — the grey
                  // showed only in the gaps the shot happened not to reach, and
                  // read as a stray band rather than as the tray it is. Held
                  // off every edge, the shot sits ON the grey the way the
                  // product shots elsewhere on the site do.
                  className={`absolute inset-5 overflow-hidden rounded-xl transition-opacity duration-300 motion-reduce:transition-none md:inset-6 ${
                    i === active ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {pillar.visual}
                </div>
              ))}
            </div>
            {/* The facts sit under the visual, the way a spec list does: label
                left, value right, a hairline between rows. They change with the
                claim being read, so the two halves always agree. */}
            <FactList facts={current.facts} />
          </div>
        </div>
      </div>
    </section>
  );
}

function FactList({ facts }: { facts?: Pillar["facts"] }) {
  if (!facts?.length) return null;
  return (
    <dl
      className={`mt-8 divide-y ${GRID_LINE} divide-border [[data-theme=dark]_&]:divide-[#383838]`}
    >
      {facts.map((fact) => (
        <div
          key={fact.label}
          className="flex items-baseline justify-between gap-6 py-3 first:pt-0"
        >
          <dt className="text-sm text-muted-foreground">{fact.label}</dt>
          <dd className="text-right text-sm text-foreground">{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}
