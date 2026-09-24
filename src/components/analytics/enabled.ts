/**
 * Where the real analytics stream may be fed from.
 *
 * Decided at RUNTIME, from the host the browser is actually on, rather than from
 * VERCEL_ENV at build time. Every build-time value is baked into the artifact —
 * that is what makes promoting a staging build onto the production alias so
 * hazardous here, and it is why CLAUDE.md forbids it. Gating analytics on one
 * would have added a silent failure to that list: a promoted artifact would
 * serve the live site with no analytics at all, and nothing about the page would
 * say so. The hostname is the one signal that survives being promoted.
 *
 * A literal, not SITE_URL: SITE_URL is resolved at build time too, so a staging
 * artifact carries the staging host and would compare itself against that.
 *
 * Only the apex — www redirects to it with a 301, so it never serves a page.
 */
export const ANALYTICS_HOST = "assembly.com";

/**
 * Guard for an injected snippet. The script tag is still emitted off-production,
 * but its body never runs, so no request reaches Segment or GTM and no event is
 * recorded. Inlined into the snippet rather than checked in React, so it holds
 * even for a page served from an artifact built somewhere else entirely.
 */
export function onProductionHost(body: string): string {
  return `if(location.hostname===${JSON.stringify(ANALYTICS_HOST)}){${body}}`;
}

/**
 * Set by the /legal/do-not-sell-or-share page when a visitor opts out of the
 * sale or sharing of their personal information. A plain first-party cookie, so
 * the check below can read it before anything else on the page runs.
 */
export const AD_OPT_OUT_COOKIE = "assembly_ad_opt_out";

/** Roughly a year. Chrome caps cookie lifetimes at 400 days regardless. */
const AD_OPT_OUT_MAX_AGE = 60 * 60 * 24 * 365;

/**
 * True when this browser may load advertising tags: no Global Privacy Control
 * signal and no opt-out cookie. The Privacy Policy (sections 10 and 11) promises
 * both are honoured, so anything carrying ad pixels or hashed-email conversion
 * events has to go through `whenAdTrackingAllowed`.
 */
const AD_TRACKING_ALLOWED = `!navigator.globalPrivacyControl&&document.cookie.split("; ").indexOf(${JSON.stringify(`${AD_OPT_OUT_COOKIE}=1`)})<0`;

/**
 * `onProductionHost`, plus the opt-out check. For Google Tag Manager, which
 * carries the Google, Meta and LinkedIn tags. Inlined into the snippet for the
 * same reason as the host check: it holds before React has run.
 */
export function whenAdTrackingAllowed(body: string): string {
  return onProductionHost(`if(${AD_TRACKING_ALLOWED}){${body}}`);
}

/** Client-side reading of the same two signals, for the opt-out page. */
export function readAdOptOut(): { gpc: boolean; optedOut: boolean } {
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
  return {
    gpc: nav.globalPrivacyControl === true,
    optedOut: document.cookie.split("; ").includes(`${AD_OPT_OUT_COOKIE}=1`),
  };
}

export function setAdOptOut(optedOut: boolean) {
  document.cookie = optedOut
    ? `${AD_OPT_OUT_COOKIE}=1; Max-Age=${AD_OPT_OUT_MAX_AGE}; Path=/; SameSite=Lax; Secure`
    : `${AD_OPT_OUT_COOKIE}=; Max-Age=0; Path=/; SameSite=Lax; Secure`;
}
