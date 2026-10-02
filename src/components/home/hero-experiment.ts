"use client";

import {
  parseArm,
  readHeroArmCookie,
  type Arm,
  type CopyKey,
  type LayoutKey,
} from "@/lib/hero-variants";

/**
 * What the homepage hero test reports (see src/lib/hero-variants.ts).
 *
 * Segment is already on every page (see SegmentScript in the root layout) and
 * auto-fires a generic page view; these are the test's own, named in Segment's
 * Object Action convention.
 *
 * Exposure is recorded explicitly rather than read off the page view. The arm
 * is assigned in middleware, so a page view counts every request that reached
 * the route — prefetches and crawlers included — and using it as the
 * denominator would dilute all six arms by an amount that differs per arm.
 *
 * The signup itself is deliberately not here. It happens in the product, after
 * the visitor leaves this site, so the product reports it from the `heroArm` it
 * receives on the signup URL.
 */
export const HERO_EXPERIMENT_EVENTS = {
  viewed: "Hero Variant Viewed",
  ctaClicked: "Hero CTA Clicked",
} as const;

export interface HeroExperimentProps {
  /** `<copy>-<layout>`, the arm as the cookie holds it. */
  arm: Arm;
  /** Broken out as well so a readout can group on one factor without parsing. */
  copy: CopyKey;
  layout: LayoutKey;
  /**
   * Where the visit came from. Campaign traffic converts differently from
   * organic, so the arms have to be checked for balance across sources before
   * any difference between them means anything.
   */
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

export function trackHeroExperiment(
  event: (typeof HERO_EXPERIMENT_EVENTS)[keyof typeof HERO_EXPERIMENT_EVENTS],
  props: HeroExperimentProps & Record<string, unknown>,
) {
  // Optional chaining rather than a guard: Segment is absent in development and
  // wherever the visitor blocks it, and a missing tracker must never break the
  // page or, worse, the CTA.
  window.analytics?.track(event, { ...props });
}

/**
 * Reports a click on one of the hero's own calls to action, resolving the arm
 * from the cookie at click time.
 *
 * Click time rather than a prop because the two layouts reach signup by
 * different routes — the big-type arm through a plain link, the control arm
 * through the shared composer, which is also used by the page-bottom CTA and
 * so cannot take the hero's arm as its own. Reading here keeps one definition
 * for both, and it reports nothing off an arm, which is what makes it safe to
 * call from a component that is not always in the test.
 */
export function trackHeroCta(cta: string) {
  const arm = readHeroArmCookie();
  if (!arm) return;
  const parsed = parseArm(arm);
  if (!parsed) return;
  trackHeroExperiment(HERO_EXPERIMENT_EVENTS.ctaClicked, {
    arm,
    copy: parsed.copy,
    layout: parsed.layout,
    cta,
    ...utmProps(),
  });
}

/** The campaign params a visit arrived with, if any. */
export function utmProps(): Pick<
  HeroExperimentProps,
  "utm_source" | "utm_medium" | "utm_campaign"
> {
  const params = new URLSearchParams(window.location.search);
  const read = (key: string) => params.get(key)?.trim() || undefined;
  return {
    utm_source: read("utm_source"),
    utm_medium: read("utm_medium"),
    utm_campaign: read("utm_campaign"),
  };
}
