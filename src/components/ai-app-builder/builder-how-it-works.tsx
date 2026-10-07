"use client";

import { useState } from "react";
import { Reveal } from "@/components/ui/reveal";
import { SegmentedTabs } from "@/components/ui/segmented-tabs";
import {
  BuildCard,
  DescribeCard,
  PlanCard,
} from "@/components/client-portal/portal-build-cards";

/**
 * How it works, as a segmented control over one large panel.
 *
 * It was three cards across, which showed all three beats at once but gave
 * each of them a third of the measure — so every scene was drawn at 340px,
 * small enough that the composer, the plan list and the portal shot were all
 * reading as thumbnails of themselves. One panel at a time means one scene at
 * roughly 520px, which is the size these mocks were drawn for.
 *
 * The trade is real and worth naming: Describe → Plan → Build is a SEQUENCE,
 * and a sequence behind tabs is two thirds hidden on arrival. The control
 * carries the step numbers for exactly that reason — "Step 1 Describe" reads
 * as an arc even while only one panel is open, where bare category names
 * ("Describe", "Plan", "Build") would read as three alternatives.
 */
// Spelled out, matching the rail on /client-portal — the two run the same
// three beats and a reader moving between the pages should not meet "Step 2"
// on one and "Step Two" on the other.
const STEPS = [
  {
    value: "describe",
    step: "Step One",
    name: "Describe",
    body: "Say what you want, or start from a template.",
    visual: <DescribeCard />,
  },
  {
    value: "plan",
    step: "Step Two",
    name: "Plan",
    body: "Approve or edit the plan before anything is built.",
    visual: <PlanCard />,
  },
  {
    value: "build",
    step: "Step Three",
    name: "Build",
    body: "Client apps land in your client experience, team tools in your dashboard.",
    visual: <BuildCard />,
  },
];

export function BuilderHowItWorks() {
  const [active, setActive] = useState(STEPS[0].value);
  const current = STEPS.find((s) => s.value === active) ?? STEPS[0];

  // Tight on top. The chapter above sets `tightBottom`, which takes ITS bottom
  // padding to zero precisely so this section's own top padding is the only
  // gap — at py-14/20 that was still 56/80px of empty page between a two-word
  // title and the control it introduces. The bottom keeps the full step, since
  // what follows is a different chapter.
  return (
    <section className="mx-auto max-w-[1200px] px-6 pb-14 pt-6 md:px-10 md:pb-20 md:pt-8">
      <Reveal>
        {/* Ranged left, with the chapter heading above it — see the `split`
            on that BuilderChapter. The whole region reads left: the pillars
            above, the panel below and its copy all start on the same line, and
            a centred control between them was the one thing that did not. */}
        <SegmentedTabs
          label="How building works"
          idBase="how-it-works"
          value={active}
          onChange={setActive}
          options={STEPS.map((s) => ({
            value: s.value,
            label: (
              <>
                <span className="hidden sm:inline">{s.step}:&nbsp;</span>
                {s.name}
              </>
            ),
          }))}
        />

        <div
          role="tabpanel"
          id={`how-it-works-panel-${current.value}`}
          aria-labelledby={`how-it-works-tab-${current.value}`}
          className="mt-6 overflow-hidden rounded-3xl bg-[var(--surface)]"
        >
          {/* Keyed on the step so the contents REMOUNT on switch and play the
              site's own fade rather than swapping hard. Keyed here and not on
              the panel itself so the panel's own box stays put — a remounting
              frame would flash its background through the fade. */}
          <div key={current.value} className="animate-fade-in">
            <div className="px-6 pt-7 md:px-10 md:pt-9">
              <h3 className="type-h4 leading-[1.25]">{current.name}</h3>
              <p className="mt-2 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground">
                {current.body}
              </p>
            </div>

            {/* Capped and centred. The scenes are MockFit covers, so they scale
                to whatever width they are given — uncapped in a 1200px panel
                they would blow up past the size their type was drawn at. 520px
                is about the size these were designed for. Running to the
                panel's foot, like every other screen on this page.

                HEIGHT is what sizes these, not width: the scenes are portrait
                (340x453) and MockFit fits the whole design box, so a wider slot
                alone changes nothing — it only adds grey either side. The slot
                is tall enough to draw them at about the size they were designed
                at, and the cap keeps a 1200px panel from blowing them up past
                the size their type was set for. */}
            <div className="relative mx-auto mt-6 h-[380px] w-full max-w-[560px] md:mt-8 md:h-[480px]">
              {current.visual}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
