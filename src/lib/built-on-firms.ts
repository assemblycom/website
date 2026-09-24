/**
 * Stand-in workspace records for /powered-by.
 *
 * This array is the data contract. The real page will ask the product for one
 * workspace by the `ref` in the URL and get back exactly this shape; nothing in
 * the page changes when that swap happens. Every field except the id and the
 * name is optional, because a real workspace may have no logo, no brand colour,
 * or may have asked to be left out — see the fallbacks in the page.
 */
export interface BuiltOnFirm {
  /** Stands in for the workspace id carried by `ref`. */
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
}

export const BUILT_ON_FIRMS: BuiltOnFirm[] = [
  {
    id: "northbank",
    name: "Northbank Advisory",
    brandColor: "#1f5c4a",
  },
  {
    // An uploaded logo, which gets the light tile rather than the brand colour:
    // the file's own pixels cannot be read, and most uploads are dark glyphs or
    // bake in a white square, so a brand colour behind either one hides it.
    id: "calderwood",
    name: "Calderwood Legal",
    logoUrl: "/images/logo-mark.svg",
    brandColor: "#2c3e7a",
  },
  {
    // Wider than the slot can render legibly, so the logo is dropped and the
    // initial takes the square back — in the firm's own colours.
    id: "calderwoodwide",
    name: "Calderwood Wide",
    logoUrl: "/images/logo-full.svg",
    brandColor: "#2c3e7a",
    sidebarTextColor: "#ffffff",
  },
  {
    // No logo and no brand colour: the bare minimum a workspace can carry.
    id: "meridian",
    name: "Meridian Property Group",
  },
  {
    // Black, which a lot of firms pick. It is fine in light mode and vanishes
    // into the dark theme, so the tile lifts it just far enough to be a square.
    id: "harlow",
    name: "Harlow & Reed",
    brandColor: "#000000",
    sidebarTextColor: "#ffffff",
  },
  {
    // A brand colour far too light for a white mark. The tile walks it down its
    // own hue until it reads, rather than dropping the colour.
    id: "brightleaf",
    name: "Brightleaf Studio",
    brandColor: "#d9ed92",
    sidebarTextColor: "#101114",
  },
  {
    // Opted out. Resolves, but renders as the generic page.
    id: "harlowkane",
    name: "Harlow Kane",
    brandColor: "#6b4f2a",
    optedOut: true,
  },
];

/** The firm the page shows when no `ref` or `firm` is given. */
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
