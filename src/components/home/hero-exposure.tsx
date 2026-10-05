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

/**
 * How long to keep waiting for the Segment snippet before giving up. Ten
 * seconds is far past a normal load and short enough that a visitor who blocks
 * analytics outright isn't left with a timer running behind the page.
 */
const ANALYTICS_WAIT_MS = 10_000;

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

    // Private windows and blocked site data throw on access rather than
    // returning empty, and an exposure that can't be deduped is still better
    // recorded than dropped.
    try {
      if (sessionStorage.getItem(SESSION_KEY) === arm) {
        fired.current = true;
        return;
      }
    } catch {
      // Ignored: fall through and record it.
    }

    // The Segment snippet loads afterInteractive, so on a slow connection this
    // effect can run before `window.analytics` exists — and the track call is
    // optional-chained, so it would quietly do nothing. Marking the arm seen
    // first then blocked every later attempt for the rest of the tab, which
    // loses the exposure while the arm is still rendered: the denominator of
    // the whole test, undercounted by however many visitors are slow to load.
    // So the mark is written only once a dispatch has somewhere to go.
    let cancelled = false;

    const send = () => {
      fired.current = true;
      try {
        sessionStorage.setItem(SESSION_KEY, arm);
      } catch {
        // Ignored: the ref still dedupes within this mount.
      }
      trackHeroExperiment(HERO_EXPERIMENT_EVENTS.viewed, {
        arm,
        copy,
        layout,
        ...utmProps(),
      });
    };

    if (window.analytics) {
      send();
      return;
    }

    // Poll rather than hook the snippet: it defines window.analytics as a
    // queueing stub the moment it runs, so this clears on the first tick after
    // that and the queue holds the event until the real library lands. Capped,
    // because a visitor who blocks Segment never gets one and the interval
    // should not outlive the page.
    const interval = window.setInterval(() => {
      if (cancelled) return;
      if (window.analytics) {
        window.clearInterval(interval);
        send();
      }
    }, 200);
    const timeout = window.setTimeout(
      () => window.clearInterval(interval),
      ANALYTICS_WAIT_MS,
    );

    return () => {
      cancelled = true;
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [arm, copy, layout]);

  return null;
}
