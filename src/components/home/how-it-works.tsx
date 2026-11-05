"use client";

import { memo, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  DescribeVisual,
  BuildAppVisual,
  BrandPortalVisual,
  BuildStepVisual,
} from "@/components/home/abstract-step-visuals";

// ─────────────────────────────────────────────────────────────────────────
// HOW IT WORKS — four tabs across the top (title + description each), one full
// width visual below that crossfades to the active tab. Each tab carries a
// progress bar along its top edge that fills over the dwell time, so you can
// anticipate when the visual is about to switch (Intercom-style). It auto
// advances and loops; click a tab to jump, hover to pause. Progress is painted
// imperatively (refs) so the loop never re-renders the visuals.
//
// Tabs are titles-only; the per-step `body` copy is kept in the data but not
// rendered (drop it back under each title if the visuals ever need support).
// ─────────────────────────────────────────────────────────────────────────

interface Step {
  id: string;
  title: string;
  body: string;
  // Static visuals — each step renders a single settled frame (no inner
  // animation). The top tab progress bar is what advances between steps.
  Visual: React.ComponentType;
  // Optional per-step dwell — the Plan and Build steps carry richer sequences
  // (question pick, modal fill) that need longer than the default to read.
  dwellMs?: number;
}

// Memoized so a step switch (setActive) never re-renders these heavy visual
// trees — the crossfade stays a pure GPU opacity transition with no frame drop.
const DescribeStep = memo(DescribeVisual);
const PlanStep = memo(BuildAppVisual);
const BuildStep = memo(BrandPortalVisual);
const IterateStep = memo(BuildStepVisual);

const STEPS: Step[] = [
  {
    id: "describe",
    title: "Describe",
    body: "Say what you want in plain language, or start with an app template.",
    Visual: DescribeStep,
  },
  {
    id: "plan",
    title: "Plan",
    body: "A few product questions, then a plan you approve before anything's built.",
    Visual: PlanStep,
    dwellMs: 9000,
  },
  {
    id: "build",
    title: "Publish",
    body: "A real app deploys to your workspace, ready for your clients.",
    Visual: BuildStep,
    dwellMs: 9500,
  },
  {
    id: "iterate",
    title: "Iterate",
    body: "Keep chatting to change anything, before or after launch.",
    Visual: IterateStep,
    dwellMs: 9000,
  },
];

// How long each step holds before auto-advancing. Long and unhurried so the
// bar and the visual's own animation read as one slow, deliberate beat rather
// than two things racing.
const DWELL_MS = 7_000;

export function HowItWorks({
  /**
   * The visual panel's height, as the whole responsive chain.
   *
   * The cards crop themselves at whatever this is (`max-h-full` on .mock-ui),
   * so it is a crop, not a scale — lowering it shows less of the screen rather
   * than shrinking it. The default is what the shipped page uses; a page that
   * opens on its own tall hero wants less of the viewport spent here.
   *
   * It is one prop rather than a phone override because the default chain ends
   * in `sm:h-auto`, which sizes to the content — fine for a panel with a screen
   * in it, and a collapse to nothing for one without.
   */
  visualHeightClass = "h-[420px] sm:h-auto md:h-[560px]",
  stepImages,
  stepUi,
  manual = false,
}: {
  visualHeightClass?: string;
  /**
   * Steps change only when someone clicks one: no clock, and no progress rail
   * filling along the active tab.
   *
   * The tour sells itself on a page where this section is the product demo.
   * On a page that already opens with a hero carrying its own product shot,
   * a second thing moving on its own competes for the same attention, and
   * the rail reads as a loading bar rather than as a timer — it is a dark
   * line creeping across the foot of a tab, directly over a photograph.
   *
   * Off by default, so the shipped homepage keeps its tour.
   */
  manual?: boolean;
  /**
   * A photograph per step, keyed by step id, shown INSTEAD of that step's
   * built visual — the blue panel with a picture in it rather than a mock.
   *
   * For a page whose step screens are being redone: the section keeps its
   * shape, its tour and its timing, and the panel holds something while the
   * screens are away. Unset, every step renders its own visual as before.
   */
  stepImages?: Record<string, { src: string; alt: string }>;
  /**
   * A piece of product UI per step, drawn ON TOP of that step's photograph.
   *
   * The photograph says who the step is for; the UI says what the step
   * actually is, which a picture of someone holding a phone cannot. The
   * product pages already draw these screens, so this takes their scenes
   * rather than redrawing them — see `portal-build-cards`.
   */
  stepUi?: Record<string, React.ReactNode>;
} = {}) {
  const [active, setActive] = useState(0);

  // Kept in refs so the rAF loop reads them without re-subscribing, and so the
  // progress bars can be painted directly (no per-frame React render).
  const activeRef = useRef(0);
  const progressRef = useRef(0);
  const fillRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  // The loop only advances while the section is actually on screen (see the rAF
  // effect) — kept in a ref so the loop reads it without re-subscribing.
  const onScreenRef = useRef(true);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  const paint = () => {
    fillRefs.current.forEach((el, idx) => {
      if (!el) return;
      const w = idx === activeRef.current ? progressRef.current : 0;
      el.style.transform = `scaleX(${w})`;
    });
  };

  // Jump to a step and restart its dwell.
  const activate = (i: number) => {
    activeRef.current = i;
    progressRef.current = 0;
    paint();
    setActive(i);
  };

  useEffect(() => {
    if (manual) return; // click-only; no clock to run and no rail to paint
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return; // no auto-advance; tabs still switch on click

    // Only run the clock while the section is on screen. Browsers throttle rAF
    // for offscreen/backgrounded frames, so a loop that assumes ~16ms frames
    // desynced after you scrolled away and back — the bar would stall or jump.
    const sectionEl = sectionRef.current;
    let io: IntersectionObserver | undefined;
    if (sectionEl && "IntersectionObserver" in window) {
      io = new IntersectionObserver(
        ([entry]) => {
          onScreenRef.current = entry.isIntersecting;
        },
        { threshold: 0 },
      );
      io.observe(sectionEl);
    }

    let raf = 0;
    let last = 0;
    const tick = (ts: number) => {
      // Runs continuously while on screen — never pauses on hover. Off-screen /
      // background frames are skipped so the bar can't desync (the scroll bug).
      const running = onScreenRef.current && !document.hidden;
      if (!running) {
        // Drop the clock so we resume with a fresh delta instead of counting the
        // whole time we were paused/offscreen in a single leap.
        last = 0;
      } else {
        if (!last) last = ts;
        // Clamp the delta so one long throttled gap can never jump the bar.
        const dt = Math.min(ts - last, 64);
        last = ts;
        progressRef.current +=
          dt / (STEPS[activeRef.current].dwellMs ?? DWELL_MS);
        if (progressRef.current >= 1) {
          progressRef.current = 0;
          // Advance activeRef in the same frame as setActive. The [active] effect
          // that syncs activeRef only runs after React commits, so painting with
          // the stale ref would flash the just-finished tab's bar refilling for a
          // frame before the next tab takes over.
          const next = (activeRef.current + 1) % STEPS.length;
          activeRef.current = next;
          setActive(next);
        }
      }
      paint();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io?.disconnect();
    };
  }, [manual]);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="pb-16 pt-16 md:pb-24 md:pt-24"
    >
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        {/* Header, aligned to the block below: eyebrow on top, then heading
            (left) and supporting copy (right) sharing a row so the copy lines
            up with the heading, not the eyebrow. */}
        <div className="mx-auto max-w-[1100px]">
          <p className="type-eyebrow text-muted-foreground">App builder</p>
          <div className="mt-4 grid gap-y-5 md:grid-cols-2 md:items-start md:gap-x-12">
            <h2 className="type-h2 max-w-lg text-balance text-foreground">
              Go from idea to a working app in four steps
            </h2>
            <p className="type-lead max-w-lg text-pretty text-muted-foreground">
              Describe what you want, approve the plan, and publish. Your app
              goes live in your workspace with sign-in, permissions, and
              branding already handled. Then keep refining it by chat.
            </p>
          </div>
        </div>

        {/* Outlined frame: a tab bar divided into steps, then the visual.
            The active step reads from its top progress fill (which also lets
            you anticipate the switch) plus its darker label — no filled pill.
            Capped so the landscape visual keeps a good height. */}
        {/* Flex column so mobile can lead with the visual: stacked, the four tab
            rows are a tall list to scroll past before you see anything, so the
            visual comes first (right under the intro) and the steps read as its
            legend. sm+ keeps tabs-then-visual, where they're one 4-across row. */}
        {/* 20px, so the blue panel inside it (12px, inset 8px) is concentric with
            it rather than a third unrelated curve. */}
        <div // AN OPAQUE GROUND. The panel stated a fill for dark
          // (`bg-white/[0.04]`) and none at all for light, so in light it was a
          // bordered card with nothing in it. On a plain page that is
          // invisible — the card and the page are the same colour — but on a
          // page drawing a column grid behind its content the rails ran
          // straight through the tab bar and the empty half of the panel, and
          // the card read as tracing paper laid over the grid.
          //
          // `bg-background` rather than a hex, so it is the page's own ground
          // in whichever theme is rendering, and the dark fill stays stacked on
          // top of it exactly as before.
          className="mx-auto mt-10 flex max-w-[1100px] flex-col overflow-hidden rounded-[20px] border border-border bg-background [[data-theme=dark]_&]:border-white/15 [[data-theme=dark]_&]:bg-white/[0.04] md:mt-12"
        >
          {/* Tabs — divided by hairlines; each carries a progress track on its
              top edge that fills over the dwell on the active tab. */}
          <div
            role="tablist"
            aria-label="How it works steps"
            className="order-3 grid grid-cols-1 divide-y divide-border [[data-theme=dark]_&]:divide-white/15 sm:order-none sm:grid-cols-4 sm:divide-x sm:divide-y-0"
          >
            {STEPS.map((step, i) => (
              <button
                key={step.id}
                type="button"
                role="tab"
                aria-selected={active === i}
                onClick={() => activate(i)}
                // Stacked on a phone the tabs are a list, and a list reads down
                // its left edge; centring only makes sense once they're a row.
                // Keyboard focus tints the tab rather than ringing it. Any box
                // here read as a stray border: the tabs are square inside a
                // rounded, overflow-hidden shell, so an outline either had its
                // corner sliced by the shell or floated free of the segments.
                // Focus fills the cell rather than ringing it: these are segments of
                // one strip, so a box around a single cell fights the dividers
                // that define it and notches at the strip's rounded corner. A
                // deeper version of the hover fill is the strip's own language.
                // THE ACTIVE TAB IS FILLED when there is no rail to mark it.
                // With the tour running, the bar creeping along the active tab
                // says which one is on; take it away and the only difference
                // left is the label's tone, which is too quiet to find at a
                // glance. The fill is the strip's own hover tint a step
                // deeper, so it is the same language rather than a new one.
                className={`group relative cursor-pointer px-5 py-4 text-left outline-none transition-colors hover:bg-foreground/[0.03] focus-visible:shadow-[inset_0_-2px_0_0_rgba(0,0,0,0.45)] sm:text-center [[data-theme=dark]_&]:focus-visible:shadow-[inset_0_-2px_0_0_rgba(255,255,255,0.45)] ${
                  manual && active === i
                    ? "bg-foreground/[0.05] [[data-theme=dark]_&]:bg-white/[0.07]"
                    : ""
                }`}
              >
                {/* Progress track (fills over the dwell on the active tab).
                    Not drawn at all when the steps are click-only — there is
                    no dwell for it to measure. */}
                {!manual && (
                  <span
                    aria-hidden
                    // INSIDE THE TAB, not straddling its edge. At -bottom-px the
                    // bar sat ON the rule between the strip and the panel, so
                    // over a photograph it had a dark edge immediately under it
                    // and read as part of the picture rather than as a bar
                    // filling. Held off that rule, it always has the strip's own
                    // ground behind it and the rule as a line under it. Two
                    // pixels rather than one for the same reason: a hairline is
                    // a border, and this is the one thing here that moves.
                    className="absolute inset-x-0 bottom-0 z-10 h-0.5 overflow-hidden"
                  >
                    <span
                      ref={(el) => {
                        fillRefs.current[i] = el;
                      }}
                      className="block h-full origin-left bg-foreground"
                      style={{ transform: "scaleX(0)" }}
                    />
                  </span>
                )}

                <span className="flex items-center justify-start gap-2 sm:justify-center">
                  <span
                    className={`text-[15px] transition-colors ${
                      active === i
                        ? "text-foreground"
                        : "text-muted-foreground group-hover:text-foreground"
                    }`}
                  >
                    {step.title}
                  </span>
                  {/* Stacked, the list already reads in order, so the index is
                      restating what the position says. */}
                  <span
                    className={`hidden text-[11px] tabular-nums [font-family:var(--font-diatype-mono)] sm:inline ${
                      active === i
                        ? "text-muted-foreground"
                        : "text-muted-foreground/50"
                    }`}
                  >
                    [{i + 1}]
                  </span>
                </span>
              </button>
            ))}
          </div>

          {/* Divider between the tabs and the visual. */}
          <div className="order-2 border-t border-border [[data-theme=dark]_&]:border-white/15 sm:order-none" />

          {/* Visual — crossfades to the active step. Fixed height so the panel
              never resizes between tabs (each step's card fills or centers). */}
          {/* Phone height is capped: unbounded, the cell grew to the tallest
              step's card (~1.8x the panel's own width) and the section became a
              long scroll past a decorative frame. The cards crop themselves at
              the cut instead (max-h-full on .mock-ui). */}
          {/* grid-rows-1 (1fr, not auto): with an auto row the cell still sized
              to the tallest card, so h-full/max-h-full below resolved against
              that instead of the capped panel. */}
          <div
            className={`relative order-1 grid ${visualHeightClass} grid-cols-1 grid-rows-1 overflow-hidden sm:order-none font-sans`}
          >
            {STEPS.map((step, i) => (
              <div
                key={step.id}
                aria-hidden={active !== i}
                // All four steps sit in the same grid cell, so the hidden ones
                // lie on top of the visible one. pointer-events-none on the
                // wrapper alone isn't enough: the mocks inside each step opt
                // back in with pointer-events-auto to take their own hovers, and
                // a descendant that re-enables hit-testing does so even under a
                // disabled ancestor. So an invisible step kept swallowing every
                // hover meant for the step actually on screen. Force the whole
                // subtree off instead.
                className={`col-start-1 row-start-1 h-full w-full min-w-0 transform-gpu transition-opacity duration-700 ease-out [will-change:opacity] motion-reduce:transition-none ${
                  active === i
                    ? "opacity-100"
                    : "pointer-events-none opacity-0 [&_*]:pointer-events-none!"
                }`}
              >
                {stepImages?.[step.id] ? (
                  // FULL BLEED, AND NO BLUE. A step's own visual sits inside
                  // BluePanel — a blue ground with the screen floating on it,
                  // which is the right frame for a drawn mock and the wrong
                  // one for a photograph: the blue becomes a mat around
                  // someone else's picture. The photograph is the panel here,
                  // filling the cell edge to edge. The section's own wrapper
                  // is `overflow-hidden rounded-[20px]`, so the corners are
                  // clipped for it and it needs no radius of its own.
                  <div className="relative h-full w-full">
                    <Image
                      src={stepImages[step.id].src}
                      alt={stepImages[step.id].alt}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 100vw, 60vw"
                    />
                    {stepUi?.[step.id] ? (
                      <>
                        {/* The photographs are mid-tone and busy, and the
                            product's own UI is near-white — dropped straight
                            on, the screen's edges dissolve into the picture.
                            This settles the photograph far enough for the
                            white to read as a surface above it, without
                            turning the picture grey. */}
                        <div
                          aria-hidden
                          className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(16,24,40,0.34),rgba(16,24,40,0.46))]"
                        />
                        {/* MockFit measures the frame it is given, so the UI
                            gets its own inset box rather than the full cell:
                            the inset is the air that makes the screen read as
                            placed on the photograph rather than cropped by it. */}
                        {/* KEYED ON WHETHER THIS STEP IS THE OPEN ONE, so the
                            screen REMOUNTS when you tab to it and whatever it
                            animates on entry plays then rather than on page
                            load, behind three other steps. The scenes settle
                            and stay — nothing here loops — so without this a
                            visitor who tabs to a step arrives after its one
                            performance is over. Only this branch: a step
                            rendering its own built visual is untouched. */}
                        <div
                          key={`${step.id}-${active === i}`}
                          className="absolute inset-4 sm:inset-6 md:inset-10"
                        >
                          {stepUi[step.id]}
                        </div>
                      </>
                    ) : null}
                  </div>
                ) : (
                  <step.Visual />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
