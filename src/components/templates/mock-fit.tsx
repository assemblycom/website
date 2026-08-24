"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface Props {
  className?: string;
  /** Never scale past 1:1 — matches .template-mock-fit--cap. */
  cap?: boolean;
  children: ReactNode;
}

const DEFAULT_DESIGN_SIZE = 288;

// Per-template design size. A few covers carry no large focal element, so at the
// shared 288px size every part of them lands at the small end of the type scale
// and the frame reads as mostly empty; drawing them smaller scales them up in
// the same frame. Shared by every surface that frames a cover at size (the
// gallery cards and the proposal page) — the home hero sizes these itself.
export const MOCK_DESIGN_SIZE: Record<string, string> = {
  "client-ai-assistant": "[--template-mock-w:240px] [--template-mock-h:240px]",
  "new-client-intake": "[--template-mock-w:240px] [--template-mock-h:240px]",
  "client-discussion-forum":
    "[--template-mock-w:240px] [--template-mock-h:240px]",
  "internal-communications-app":
    "[--template-mock-w:240px] [--template-mock-h:240px]",
  // A single row on a plotted ground, with nothing else in the square: at the
  // shared size the row's fixed type landed at the small end of the scale and
  // the filename — the point of the cover — read smaller than the caption under
  // the card. Only one step down, not the 240 the others take: the row spans the
  // full box, so a smaller box narrows it, and at 240 the filename truncated.
  "internal-resource-library":
    "[--template-mock-w:264px] [--template-mock-h:264px]",
  // The wizard is a single narrow bar in an otherwise empty square, so it takes
  // the largest step. The request queue's segmented control is the same case.
  "client-onboarding-wizard": "[--template-mock-w:224px] [--template-mock-h:224px]",
  "service-request-intake": "[--template-mock-w:224px] [--template-mock-h:224px]",
};

/**
 * Frame that scales a fixed-design-size widget mock into whatever width it is
 * given.
 *
 * The scale is also expressed in CSS (see .template-mock-fit), but that version
 * divides two lengths via tan(atan2(100cqw, …)), and Safari won't resolve a
 * container-query unit inside those functions — on iOS the mock came out a
 * fraction of its card. Measuring here sets the ratio outright, so the CSS is
 * only the pre-hydration fallback.
 */
export function MockFit({ className = "", cap = false, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const apply = () => {
      // clientWidth is the content box, the same box 100cqw resolves against.
      const width = el.clientWidth;
      if (!width) return;
      const cs = getComputedStyle(el);
      const declaredW =
        parseFloat(cs.getPropertyValue("--template-mock-w")) ||
        DEFAULT_DESIGN_SIZE;
      const declaredH = parseFloat(cs.getPropertyValue("--template-mock-h"));

      // Measure what the cover ACTUALLY occupies, not what its design says it
      // should. The two diverge exactly when this is worth fixing: a fallback
      // face while the webfont loads, or a browser setting the same type a
      // little taller, grows the cover past its declared box and the frame's
      // hidden overflow slices the lettering. Fitting the declared box cannot
      // see that, because the declared box is the thing that was wrong.
      //
      // offset*/scroll* are pre-transform layout values, so reading them back
      // while a scale is applied is safe, and scaling changes no layout — there
      // is no feedback loop between this measurement and the scale it sets.
      // Fits the DECLARED design box, not what the cover actually draws.
      //
      // Greptile is right that this cannot catch type rendering taller than the
      // design assumed: .template-mock-fit > * gives the mock a fixed width and
      // height from the design vars, so overflowing content changes neither
      // offsetHeight nor scrollHeight — both keep reporting the number that was
      // wrong. Measuring the drawn extent instead was tried and is worse: these
      // covers deliberately contain elements far outside the box and clipped by
      // it, and the odometer cover's digit strip — ten rows tall by design —
      // measured 1044px against a declared 210 and shrank that cover to a fifth
      // of its size. Left as the declared box until the covers themselves can
      // say which parts are meant to be measured.
      const naturalW = declaredW;
      const naturalH = declaredH || 0;

      let scale = width / naturalW;

      // Only when the frame has a height of its own. A frame sized by its
      // content measures 0 here (the mock inside is absolutely positioned and
      // contributes nothing), and dividing by that would scale the cover away.
      const height = el.clientHeight;
      if (naturalH > 0 && height > 0) {
        scale = Math.min(scale, height / naturalH);
      }

      el.style.setProperty(
        "--template-mock-scale",
        String(cap ? Math.min(1, scale) : scale),
      );
    };

    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(el);
    // The frame's size does not change when a webfont swaps in, so the observer
    // never hears about it — but the cover's height does. Without this the
    // measurement taken against the fallback face is the one that sticks.
    const fonts = document.fonts;
    fonts?.ready.then(apply).catch(() => {});
    fonts?.addEventListener("loadingdone", apply);
    return () => {
      observer.disconnect();
      fonts?.removeEventListener("loadingdone", apply);
    };
  }, [cap]);

  return (
    <div ref={ref} className={`template-mock-fit ${className}`}>
      {children}
    </div>
  );
}
