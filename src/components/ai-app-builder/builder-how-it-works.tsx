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
const STEPS: {
  value: string;
  step: string;
  name: string;
  body: string;
  visual: React.ReactNode;
  /** Runs the scene to the panel's right edge instead of centring it. */
  flush?: boolean;
  /**
   * Takes the wide box (see PANEL_SCENE_WIDE) rather than the shared 560.
   *
   * For the steps whose scene is a whole PRODUCT SCREEN — a nav beside a pane
   * of real content — as against Describe's composer, which is one object and
   * is drawn at the size a composer is. A screen fitted into 560 is a screen
   * read through a letterbox.
   */
  wide?: boolean;
  /**
   * The slot's shape BELOW `sm`, matching this step's phone design box in
   * portal-build-cards. MockFit fits the whole box, so a slot of a different
   * shape leaves bare panel on whichever axis is slacker — the aspect is how
   * the slot says which box is coming. Plan's scene is a conversation and
   * reflows much taller than the other two at 360px wide, so it is the one
   * step that does not take 6:5.
   */
  phoneAspect: string;
}[] = [
  {
    value: "describe",
    step: "Step One",
    name: "Describe",
    body: "Say what you want, or start from a template.",
    visual: <DescribeCard plain />,
    // 360x300
    phoneAspect: "aspect-[6/5]",
  },
  {
    value: "plan",
    step: "Step Two",
    name: "Plan",
    body: "Approve or edit the plan before anything is built.",
    visual: <PlanCard plain />,
    // 360x300, the shared phone box: below `sm` this step is the
    // requirements card alone — see RequirementsPane.
    phoneAspect: "aspect-[6/5]",
  },
  {
    value: "build",
    step: "Step Three",
    name: "Build",
    body: "Client apps land in your client experience, team tools in your dashboard.",
    visual: <BuildCard plain />,
    // 360x300, like Describe: this scene crops rather than reflowing.
    phoneAspect: "aspect-[6/5]",
    wide: true,
    // The only step that runs to the panel's right edge. Its scene is a whole
    // portal screen that already bleeds off its own frame, so letting it reach
    // the panel edge continues the crop the mock is drawn with — the panel
    // opens onto a screen that carries on past it. The other two are discrete
    // objects, a composer and a checklist, with a beginning and an end on both
    // sides; pushed against an edge they read as having slipped off-centre
    // rather than as continuing, so they stay centred.
    flush: true,
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
          // .surface-ground and NOT .surface-lit: the ground ramp without the
          // ring. The pillar cards above take both, because at card size an
          // outline reads as an edge catching light. Around a panel this big
          // it reads as an outline drawn around the section — a box the
          // section did not ask for — so this one takes the lift and leaves
          // the hairline. Light is unaffected; see globals.css.
          className="surface-ground mt-6 overflow-hidden rounded-3xl bg-[var(--surface)]"
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

            {/* Capped and centred, and running to the panel's foot like every
                other screen on this page.

                HEIGHT is what sizes these, not width: the scenes are portrait
                (340x453) and MockFit fits the whole design box, so a wider slot
                alone changes nothing — it only adds ground either side. The cap
                keeps a 1200px panel from blowing them up past the size their
                type was set for.

                Alignment is per step (see `flush`): Build takes ml-auto, so
                the slot's right edge IS the panel's right edge and all the
                slack collects on the left under the copy. Describe and Plan
                keep mx-auto.

                620x400 exactly matches the scene the `plain` cards draw at, so
                the fit is 1:1 — no slack in either axis, which is what keeps
                the right edge flush AND takes 80px of empty panel off the
                height. Any slot WIDER than the scene's own ratio goes
                height-bound and re-centres the scene horizontally, putting the
                gap back; any slot taller leaves dead panel under it. The two
                numbers have to stay in step with PANEL_SCENE.

                The flush step is the exception, and takes 900 at `lg` and
                1040 at 1152 to match PANEL_SCENE_WIDE — its scene is a portal screen drawn to
                the wider box, so the slot has to widen with it or the screen is
                fitted back down into 560. Below lg both boxes are 560 and this
                reads as one number again. The HEIGHT is shared by all three,
                which is what keeps the panel from resizing as you tab. */}
            <div
              // AN ASPECT BELOW `sm`, a fixed height above it. The slot's
              // shape has to match the scene's design box or MockFit fits on
              // the tighter axis and leaves the other one bare — which is what
              // a 327x360 slot did to a 620x400 scene. 6:5 is the phone box
              // (360x300, see PANEL_SCENE_RESPONSIVE), so the fit comes out
              // the same on both axes at ANY phone width and the panel has no
              // dead ground in it. From `sm` the fixed height returns, because
              // there all three steps share one panel that must not resize as
              // you tab between them.
              className={`relative mt-6 w-full ${current.phoneAspect} sm:aspect-auto sm:h-[360px] md:mt-8 md:h-[400px] ${
                current.wide
                  ? // Steps with PANEL_SCENE_WIDE exactly — the slot and the
                    // design box are one decision, and a slot that lags the box
                    // fits the mock DOWN and shrinks its type.
                    "max-w-[620px] lg:max-w-[900px] lgx:max-w-[1040px]"
                  : "max-w-[620px]"
              } ${current.flush ? "ml-auto" : "mx-auto"}`}
            >
              {current.visual}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
