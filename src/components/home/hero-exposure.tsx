"use client";

import { useEffect, useRef } from "react";
import type { Arm, CopyKey, LayoutKey } from "@/lib/hero-variants";
import {
  HERO_EXPERIMENT_EVENTS,
  trackHeroExperiment,
  utmProps,
} from "./hero-experiment";

/**
 * Records that this visitor saw this arm — the denominator the whole test is
 * read against.
 *
 * Renders nothing. It sits inside the hero rather than in the page so that a
 * layout which ever stops rendering the hero also stops claiming an exposure.
 */

/** One exposure per tab, so a client-side nav back home doesn't count twice. */
const SESSION_KEY = "studio:hero-arm-seen";

export function HeroExposure({
  arm,
  copy,
  layout,
}: {
  arm: Arm;
  copy: CopyKey;
  layout: LayoutKey;
}) {
  // React runs effects twice in development's strict mode, and the session
  // guard below is storage that can be unavailable — so hold the ref as well.
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    // Private windows and blocked site data throw on access rather than
    // returning empty, and an exposure that can't be deduped is still better
    // recorded than dropped.
    try {
      if (sessionStorage.getItem(SESSION_KEY) === arm) return;
      sessionStorage.setItem(SESSION_KEY, arm);
    } catch {
      // Ignored: fall through and record it.
    }

    trackHeroExperiment(HERO_EXPERIMENT_EVENTS.viewed, {
      arm,
      copy,
      layout,
      ...utmProps(),
    });
  }, [arm, copy, layout]);

  return null;
}
