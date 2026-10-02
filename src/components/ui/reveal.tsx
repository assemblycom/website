"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

// The in-view check has to run before the browser paints, or content that is
// already on screen flashes hidden for a frame. useLayoutEffect does that, but
// React warns when it runs during SSR, so fall back to useEffect on the server
// (where the branch never actually runs).
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Scroll reveal — fades a section in as it enters the viewport so sections hand
 * off smoothly instead of snapping.
 *
 * Only sections you scroll TO animate. Anything already on screen when the page
 * loads is shown outright, with no transition: animating it meant every
 * navigation replayed an entrance for the top of the page, which read as a page
 * transition rather than as content arriving. `rise` also lifts it a touch; `fade` is
 * opacity-only for sections that contain a `position: sticky` child (a transform
 * ancestor — even translateY(0) — would break the sticky), e.g. How it works.
 * Reduced-motion shows content immediately. Reveals once, then disconnects.
 * Fixed trigger point (~90% of viewport height); no per-instance override.
 */
// Reveal once the element's top is within ~90% of the viewport height.
function isInView(el: HTMLElement) {
  return el.getBoundingClientRect().top < window.innerHeight * 0.9;
}

export function Reveal({
  children,
  variant = "rise",
  className = "",
  delayMs = 0,
  durationMs,
}: {
  children: React.ReactNode;
  // "rise-scale" also eases in a slight zoom — a more cinematic hand-off for
  // full-height feature sections (still native scroll, reveal-once).
  variant?: "rise" | "fade" | "rise-scale";
  className?: string;
  // Delays the entrance so sibling reveals can stagger (e.g. a title settling
  // before its image eases into focus just after).
  delayMs?: number;
  // Overrides the fade length — a longer value makes the entrance softer/slower
  // (e.g. the customers rail text, which should drift in, not snap).
  durationMs?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // "instant" is shown without a transition — on screen at load, or reduced
  // motion. "shown" is the animated entrance, reached only by scrolling.
  const [state, setState] = useState<"hidden" | "instant" | "shown">("hidden");

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ||
      isInView(el)
    ) {
      setState("instant");
    }
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || state !== "hidden") return;
    const inView = () => isInView(el);
    let done = false;
    let io: IntersectionObserver | undefined;
    const reveal = () => {
      if (done) return;
      done = true;
      setState("shown");
      io?.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
    // Scroll fallback — attached FIRST and unconditionally, so the reveal (and
    // thus visibility) is guaranteed even if IntersectionObserver is missing or
    // its constructor throws. Content can never get stuck hidden.
    const onScroll = () => {
      if (inView()) reveal();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) reveal();
        },
        { threshold: 0, rootMargin: "0px 0px -10% 0px" },
      );
      io.observe(el);
    }
    return () => {
      io?.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [state]);

  const hidden =
    variant === "fade"
      ? "opacity-0"
      : variant === "rise-scale"
        ? "translate-y-10 scale-[0.98] opacity-0"
        : "translate-y-8 opacity-0";
  const visible =
    variant === "fade"
      ? "opacity-100"
      : variant === "rise-scale"
        ? "translate-y-0 scale-100 opacity-100"
        : "translate-y-0 opacity-100";
  // The cinematic variant eases a touch longer so the zoom reads. An explicit
  // durationMs (inline) overrides either default.
  const duration = variant === "rise-scale" ? "duration-[1000ms]" : "duration-[800ms]";
  const style: React.CSSProperties = {};
  if (delayMs) style.transitionDelay = `${delayMs}ms`;
  if (durationMs) style.transitionDuration = `${durationMs}ms`;

  // No transition classes at all on the instant path, so nothing animates on
  // the way in and a later scroll cannot re-trigger it.
  const motion =
    state === "instant"
      ? ""
      : `transition-all ${duration} ease-[cubic-bezier(0.22,1,0.36,1)]`;

  return (
    <div
      ref={ref}
      style={state === "instant" || !Object.keys(style).length ? undefined : style}
      className={`${motion} ${state === "hidden" ? hidden : visible} ${className}`}
    >
      {children}
    </div>
  );
}
