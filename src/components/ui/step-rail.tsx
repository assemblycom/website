"use client";

import { useEffect, useRef, useState } from "react";

export interface RailStep {
  name: string;
  body: string;
}

// How long each step holds before the rail moves on. Long enough to read the
// lines under it without the row feeling like it is racing.
const STEP_MS = 4000;

/**
 * A sequence of steps as one rail: each opens on its own rule, and the rule of
 * the current step fills left to right before handing off to the next, looping.
 *
 * The rules read as a single line across the row, which is why the steps are not
 * boxed — a bordered grid inside a page already built from rules reads as a
 * stray object sitting on top of it.
 *
 * The sweep only runs while the row is on screen: a progress bar advancing where
 * nobody is looking is wasted work, and it would be mid-cycle and meaningless by
 * the time it scrolled into view.
 */
export function StepRail({
  steps,
  className = "",
}: {
  steps: RailStep[];
  className?: string;
}) {
  const [active, setActive] = useState(0);
  const [running, setRunning] = useState(false);
  const row = useRef<HTMLOListElement | null>(null);
  const bars = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const el = row.current;
    if (!el) return;
    const onScreen = () => {
      const r = el.getBoundingClientRect();
      return r.bottom > 0 && r.top < window.innerHeight;
    };
    // Checked on mount and on scroll as well as through the observer: the
    // observer is the efficient path, but it does not fire in every context
    // (a background or prerendered tab, say), and the rail must never be left
    // sitting dead on screen.
    const sync = () => setRunning(onScreen());
    sync();
    window.addEventListener("scroll", sync, { passive: true });
    let observer: IntersectionObserver | undefined;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(([entry]) =>
        setRunning(entry.isIntersecting),
      );
      observer.observe(el);
    }
    return () => {
      observer?.disconnect();
      window.removeEventListener("scroll", sync);
    };
  }, []);

  useEffect(() => {
    // Someone who asked for less motion still gets the sequence, just without a
    // bar sweeping across it: the rail settles on the first step and stays.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!running || reduced.matches) return;
    const id = setInterval(
      () => setActive((i) => (i + 1) % steps.length),
      STEP_MS,
    );
    return () => clearInterval(id);
  }, [running, steps.length]);

  useEffect(() => {
    // Driven with the Web Animations API rather than a CSS transition: the bar
    // has to restart from empty every time it becomes current, and a transition
    // whose value and target land in the same commit just snaps to full.
    const bar = bars.current[active];
    if (!bar) return;
    bars.current.forEach((b) => b?.getAnimations().forEach((a) => a.cancel()));
    if (!running) return;
    const anim = bar.animate(
      [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }],
      { duration: STEP_MS, easing: "linear", fill: "forwards" },
    );
    return () => anim.cancel();
  }, [active, running]);

  return (
    <ol ref={row} className={`grid gap-8 md:grid-cols-4 md:gap-6 ${className}`}>
      {steps.map((step, i) => (
        <li key={step.name}>
          <div className="relative h-0.5 w-full overflow-hidden rounded-full bg-border [[data-theme=dark]_&]:bg-[#383838]">
            <div
              ref={(el) => {
                bars.current[i] = el;
              }}
              className="absolute inset-y-0 left-0 w-full origin-left bg-foreground"
              // Empty unless it is the current step; the sweep itself is run
              // above. The first step stays filled when the rail is paused, so
              // a still frame still reads as step one.
              style={{
                transform: !running && i === 0 ? "scaleX(1)" : "scaleX(0)",
              }}
            />
          </div>
          <span className="type-eyebrow mt-4 block text-muted-foreground">
            Step {i + 1}
          </span>
          <p className="mt-2 text-sm">{step.name}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {step.body}
          </p>
        </li>
      ))}
    </ol>
  );
}
