"use client";

import { useEffect, useRef, useState } from "react";
import { GRID_LINE } from "@/components/ui/grid-lines";
import { VisualSlot } from "@/components/ui/visual-slot";

export interface Pillar {
  heading: string;
  body: string;
  /**
   * The two or three facts that back the claim, shown as label/value rows under
   * the visual rather than as a paragraph in the column of copy. A cleared
   * first-party number belongs here; prose does not.
   */
  facts: { label: string; value: string }[];
  visual: { label: string; description: string };
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
    // Whichever claim is nearest the middle of the viewport is the one being
    // read, so that is the one the pinned column shows.
    const observer = new IntersectionObserver(
      (entries) => {
        const inView = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!inView) return;
        const i = items.current.indexOf(inView.target as HTMLDivElement);
        if (i !== -1) setActive(i);
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: [0, 0.5, 1] },
    );
    const observed = items.current.filter((el) => el !== null);
    observed.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pillars.length]);

  const current = pillars[active] ?? pillars[0];

  return (
    <section className="mx-auto max-w-[1200px] px-6 md:px-10">
      <div className="md:flex md:items-stretch">
        <div className="md:flex-1">
          {pillars.map((pillar, i) => (
            <div
              key={pillar.heading}
              ref={(el) => {
                items.current[i] = el;
              }}
              // The negative margin puts the rule's left end on the rail, and
              // the matching padding puts the copy back where it belongs.
              className={`-mx-6 border-t px-6 py-12 md:mx-0 md:-ml-10 md:py-40 md:pl-10 md:pr-8 lg:pr-12 ${GRID_LINE}`}
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
                <VisualSlot
                  className="mt-8"
                  label={pillar.visual.label}
                  description={pillar.visual.description}
                  ratio="1 / 1"
                />
                <FactList facts={pillar.facts} />
              </div>
            </div>
          ))}
        </div>

        {/* The pinned column. A flex child stretches by default, so its left
            border is the vertical guide for the whole block. */}
        <div
          className={`hidden md:block md:w-1/2 md:border-l md:pl-8 lg:pl-12 ${GRID_LINE}`}
        >
          <div className="sticky top-24 py-40">
            <div className="relative" style={{ aspectRatio: "1 / 1" }}>
              {pillars.map((pillar, i) => (
                <VisualSlot
                  key={pillar.heading}
                  label={pillar.visual.label}
                  description={pillar.visual.description}
                  ratio="1 / 1"
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    i === active ? "opacity-100" : "opacity-0"
                  }`}
                />
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
