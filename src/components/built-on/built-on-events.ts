"use client";

/**
 * The two things /powered-by and /built-by report.
 *
 * Segment is already on every page (see SegmentScript in the root layout), and
 * it auto-fires a generic page view; these are the badge-specific ones, named in
 * Segment's Object Action convention.
 *
 * Signup completion is deliberately not here. It happens in the product, after
 * the visitor leaves this site, so the product fires it from the attribution it
 * receives on the signup URL.
 */
export const BUILT_ON_EVENTS = {
  viewed: "Built On Page Viewed",
  ctaClicked: "Built On CTA Clicked",
} as const;

export interface BuiltOnEventProps {
  /** The `ref` as it arrived, kept even when it resolved to nothing. */
  ref?: string;
  /**
   * The `utm_content`: which badge placement sent them (client_login, invoice,
   * email_footer…), or `share` from /built-by.
   */
  utm_content?: string;
  /**
   * False when the page fell back to generic. Without this you cannot tell a
   * badge that converts badly from one whose workspace never resolved.
   */
  personalized: boolean;
  /** The firm named on the page, or null on the generic version. */
  firm: string | null;
}

export function trackBuiltOn(
  event: (typeof BUILT_ON_EVENTS)[keyof typeof BUILT_ON_EVENTS],
  props: BuiltOnEventProps,
) {
  // Optional chaining rather than a guard: Segment is absent in development and
  // wherever the visitor blocks it, and a missing tracker must never break the
  // page or, worse, the CTA.
  window.analytics?.track(event, { ...props });
}
