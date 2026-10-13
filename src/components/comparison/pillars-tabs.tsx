"use client";

import { useState } from "react";
import { SegmentedTabs } from "@/components/ui/segmented-tabs";
import { VisualSlot } from "@/components/ui/visual-slot";

export interface Pillar {
  heading: string;
  /** Shown on the control in place of `heading`, which is written to be read
   *  as a claim and is too long for a cell. Same job as `shortQuestion` on an
   *  FAQ row. Falls back to the heading. */
  tabLabel?: string;
  body: string;
  visual: { label: string; description: string };
}

/**
 * The three pillars as one panel with a segmented control over it — the shape
 * /ai-app-builder's how-it-works section uses, on the same control and the
 * same --surface panel at the same radius.
 *
 * They used to be three full-height blocks stacked down the page with the
 * blog's contents rail sticky beside them. That rail is built for a long read
 * where the reader wants to know how much is left; three pillars are not a
 * long read, so it was an index of something that did not need indexing, and
 * it cost the region a 13rem column on every desktop width. Tabbed, the three
 * occupy one panel, the comparison is a thing you flip between rather than
 * scroll past, and the argument is the same length on a phone as on a desktop.
 */
export function PillarsTabs({ pillars }: { pillars: Pillar[] }) {
  const [active, setActive] = useState(0);
  const current = pillars[active] ?? pillars[0];

  return (
    <>
      <SegmentedTabs
        label="Which pillar"
        idBase="pillar"
        value={String(active)}
        onChange={(v) => setActive(Number(v))}
        options={pillars.map((p, i) => ({
          value: String(i),
          label: p.tabLabel ?? p.heading,
        }))}
      />

      <div
        role="tabpanel"
        id={`pillar-panel-${active}`}
        aria-labelledby={`pillar-tab-${active}`}
        className="mt-6 overflow-hidden rounded-3xl bg-[var(--surface)]"
      >
        {/* Keyed on the pillar so the contents REMOUNT and play the site's own
            fade rather than swapping hard — the builder panel's trick, and
            keyed inside the box for the same reason: a remounting frame would
            flash its background through the fade. */}
        <div key={active} className="animate-fade-in">
          <div className="px-6 pt-7 md:px-10 md:pt-9">
            <h3 className="type-h4 text-balance leading-[1.25]">
              {current.heading}
            </h3>
            <p className="mt-2 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground">
              {current.body}
            </p>
          </div>

          {/* The builder panel's slot box, number for number: an aspect below
              sm, then a FIXED height — 360 at sm, 400 at md — capped at 620
              wide and centred, running to the panel's foot.

              The height is the point. Left to VisualSlot's own 16/9 at the
              full width of a 1200px panel, the frame came out ~630px tall and
              the panel towered over the one on /ai-app-builder that it is
              meant to match. A fixed height also means the panel does not
              resize as you tab between pillars, which is why that page sets
              one height for all three of its steps. */}
          <div className="relative mx-auto mt-6 aspect-[6/5] w-full max-w-[620px] sm:aspect-auto sm:h-[360px] md:mt-8 md:h-[400px]">
            <VisualSlot
              className="h-full w-full"
              label={current.visual.label}
              description={current.visual.description}
            />
          </div>
        </div>
      </div>
    </>
  );
}
