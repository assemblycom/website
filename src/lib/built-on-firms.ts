import { TEMPLATES, type Template } from "./templates";

/**
 * The industries the product actually records.
 *
 * Onboarding asks every firm what it does and stores the answer on
 * PORTAL_ONBOARDING as `industry`, normalized to one of these six or to
 * "other" (see NormalizeIndustry and PortalOnboardingIndustryType* in core).
 * The product already leans on it elsewhere: recommended resources rank their
 * content per industry off the same value.
 *
 * Each maps to a tag in the site's own template catalogue, and to the phrase
 * the section heading uses. Anything unrecognised, "other" included, falls
 * through to the generic set.
 */
const INDUSTRIES: Record<string, { tag: string; phrase: string }> = {
  accounting_and_bookkeeping: {
    tag: "Accounting",
    phrase: "an accounting firm",
  },
  legal: { tag: "Legal", phrase: "a law firm" },
  marketing: { tag: "Marketing", phrase: "a marketing agency" },
  consulting: { tag: "Consulting", phrase: "a consultancy" },
  technology: { tag: "Technology", phrase: "a technology company" },
  real_estate: { tag: "Real estate", phrase: "a property firm" },
};

export function industryPhrase(industry?: string) {
  return industry ? INDUSTRIES[industry]?.phrase : undefined;
}

/**
 * Stand-in workspace records for /built-on.
 *
 * This array is the data contract. The real page will ask the product for one
 * workspace by the `?w=` in the URL and get back exactly this shape; nothing in
 * the page changes when that swap happens. Every field except the id and the
 * name is optional, because a real workspace may have no logo, no brand colour,
 * or may have asked to be left out — see the fallbacks in the page.
 */
export interface BuiltOnFirm {
  /** Stands in for the workspace id carried by `?w=`. */
  id: string;
  name: string;
  /**
   * The uploaded logo. Real ones are usually wide wordmarks rather than square
   * marks, so the slot contains them rather than cropping.
   */
  logoUrl?: string;
  /**
   * The firm's client sidebar background. In the product this is
   * PORTAL_CONFIG's `brand.clientSidebarBackgroundColor` (Go:
   * Brand.ClientSidebarBackgroundColor) — the colour a firm picks under client
   * branding, and the one its clients have been looking at. Fills the logo
   * slot. A workspace without one gets a neutral slot.
   */
  brandColor?: string;
  /**
   * Its companion, `brand.clientSidebarTextColor`: what the firm already chose
   * to put ON that colour. Used for the initial, so the pairing on this page is
   * theirs rather than one guessed here. Falls back to white.
   */
  sidebarTextColor?: string;
  /**
   * The firm asked not to be named (support request, or a paid plan that turned
   * the badge off). The page falls back to the generic version rather than
   * showing a half-personalized one.
   */
  optedOut?: boolean;
  /**
   * What the firm told onboarding it does: PORTAL_ONBOARDING's `industry`, one
   * of the six presets or "other". Drives both the section heading and which
   * four apps are shown.
   */
  industry?: string;
}

export const BUILT_ON_FIRMS: BuiltOnFirm[] = [
  {
    id: "northbank",
    name: "Northbank Advisory",
    brandColor: "#1f5c4a",
    industry: "accounting_and_bookkeeping",
  },
  {
    // The wide-wordmark case: a real uploaded logo on the brand colour.
    id: "calderwood",
    name: "Calderwood Legal",
    logoUrl: "/images/logo-full.svg",
    brandColor: "#2c3e7a",
    industry: "legal",
  },
  {
    // No logo and no brand colour: the bare minimum a workspace can carry.
    id: "meridian",
    name: "Meridian Property Group",
    industry: "real_estate",
  },
  {
    // Black, which a lot of firms pick. It is fine in light mode and vanishes
    // into the dark theme, so the tile lifts it just far enough to be a square.
    id: "harlow",
    name: "Harlow & Reed",
    brandColor: "#000000",
    sidebarTextColor: "#ffffff",
    industry: "consulting",
  },
  {
    // A brand colour far too light for a white mark. The tile walks it down its
    // own hue until it reads, rather than dropping the colour.
    id: "brightleaf",
    name: "Brightleaf Studio",
    brandColor: "#d9ed92",
    sidebarTextColor: "#101114",
    industry: "marketing",
  },
  {
    // Opted out. Resolves, but renders as the generic page.
    id: "harlowkane",
    name: "Harlow Kane",
    brandColor: "#6b4f2a",
    optedOut: true,
    industry: "consulting",
  },
];

/** The firm the page shows when no `?w=` is given. */
export const DEFAULT_BUILT_ON_FIRM = "northbank";

/**
 * The workspace to personalize with, or undefined for the generic page.
 *
 * An id that resolves to nothing and an id whose workspace opted out are the
 * same answer on purpose: the page has no firm to name either way.
 */
export function getBuiltOnFirm(
  id: string | undefined,
): BuiltOnFirm | undefined {
  if (!id) return undefined;
  const firm = BUILT_ON_FIRMS.find((f) => f.id === id);
  return firm?.optedOut ? undefined : firm;
}

/**
 * The four apps shown for a firm.
 *
 * Chosen by industry rather than picked by hand: every template in the
 * catalogue already carries the two to four industries it most naturally
 * serves, so the firm's own onboarding answer selects them.
 *
 * Ranked by how SPECIFIC each one is to that industry, narrowest first. Sorting
 * by "featured" instead put the same four broad templates in front of every
 * firm — an accountant and a lawyer saw an identical page, which defeats the
 * point of personalizing it. A template tagged for three industries says more
 * about a law firm than one tagged for all of them, so the case status page
 * beats the project tracker. Ties break on the catalogue's own rank.
 *
 * A firm with no industry (or "other") gets the most popular apps instead: the
 * catalogue in rank order, which is the order the product's own Add-an-App
 * picker puts them in. That is a real ordering the team maintains, where
 * `featured` is a boolean that is true for nearly every template and so says
 * almost nothing.
 *
 * Drawn from the whole catalogue rather than the /templates gallery listing.
 * These are illustrations that open a detail panel, not links into the
 * catalogue, and the same choice is already made on the proposal page.
 */
export function getBuiltOnExamples(
  firm?: BuiltOnFirm,
  /**
   * The Contentful-resolved catalogue. Rank only exists there, so without it
   * this falls back to the committed array and its hand-ordered sequence.
   */
  catalogue: Template[] = TEMPLATES,
): Template[] {
  const byRank = (a: Template, b: Template) =>
    (a.rank ?? Infinity) - (b.rank ?? Infinity);

  // The CMS catalogue also carries the product's CORE apps — Google Sheets and
  // the rest — which rank near the top and are not things a firm built. The
  // committed list is the curated template set, so it decides what is eligible
  // and the CMS only supplies the ordering.
  const eligible = catalogue.filter((t) =>
    TEMPLATES.some((known) => known.slug === t.slug),
  );

  const tag = firm?.industry ? INDUSTRIES[firm.industry]?.tag : undefined;
  const matched = tag
    ? eligible
        .filter((t) => t.industries?.includes(tag))
        .sort(
          (a, b) =>
            (a.industries?.length ?? 9) - (b.industries?.length ?? 9) ||
            byRank(a, b),
        )
    : [];

  const popular = [...eligible]
    .sort(byRank)
    .filter((t) => !matched.some((m) => m.slug === t.slug));

  return [...matched, ...popular].slice(0, 4);
}
