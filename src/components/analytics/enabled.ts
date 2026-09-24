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
