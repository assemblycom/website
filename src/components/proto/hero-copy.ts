/**
 * The hero's supporting line, for the three versions this prototype compares.
 *
 * SHORTER THAN THE LIVE ONE, and only here. The shipped record
 * (COPY_VARIANTS in src/lib/hero-variants.ts) is what the hero A/B test
 * serves in production and what the live homepage reads, so it is left
 * exactly as it is — this page overrides the line instead.
 *
 * All three versions take it, not just the two new heroes. The page's whole
 * premise is that the versions make identical claims and differ only in how
 * the hero is arranged, so a copy change that reached two of them would put
 * a second variable inside the comparison.
 */
export const PROTO_HERO_BODY =
  "Let clients onboard, sign, collaborate, and pay in a branded client portal, with a CRM for your team. Start with 30+ apps, then use AI to build what's missing.";
