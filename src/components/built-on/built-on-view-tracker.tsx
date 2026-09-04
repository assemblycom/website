"use client";

import { useEffect, useRef } from "react";
import {
  BUILT_ON_EVENTS,
  trackBuiltOn,
  type BuiltOnEventProps,
} from "./built-on-events";

/** Reports the page view once per mount. Renders nothing. */
export function BuiltOnViewTracker(props: BuiltOnEventProps) {
  // React runs effects twice in development's strict mode, which would double
  // every view in the numbers people look at while building this.
  const sent = useRef(false);
  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    trackBuiltOn(BUILT_ON_EVENTS.viewed, props);
    // Fires on mount only: the page is one document per visitor, so a change in
    // these values means a new page, not a second view of this one.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
