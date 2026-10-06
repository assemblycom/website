import { FROZEN_SOLUTIONS } from "./solutions.frozen";

/**
 * The industry landing pages. They came out of Contentful — where they were
 * filed under a "solutions/" slug prefix the route dropped — and now live in
 * solutions.frozen.ts, imagery and all. One of the eight is noIndex, which the
 * frozen copy carries the way the CMS did.
 *
 * Eight, not nine: /solutions/accounting-client-portal is a hand-built page of
 * its own now, so its CMS copy came out of the frozen set.
 *
 * This replaces solutions.fallback.ts, which held the same copy as a floor for
 * a CMS outage. There is no CMS read left to fall back from.
 */
export async function getSolutions() {
  return FROZEN_SOLUTIONS;
}

export async function getSolution(slug: string) {
  return FROZEN_SOLUTIONS.find((page) => page.slug === slug) ?? null;
}
