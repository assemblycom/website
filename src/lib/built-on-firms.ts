/**
 * A workspace, as /powered-by and /built-by draw it.
 *
 * Built by `getFirmBranding` in `firm-branding.ts` from the product's public
 * portal config. Every field except the id and the name is optional, because
 * a real workspace may have no logo of its own and no brand colour — see the
 * fallbacks in FirmMark.
 */
export interface BuiltOnFirm {
  /** The workspace's portal id, the `ref` the badge carries. */
  id: string;
  name: string;
  /**
   * The workspace's logo: the firm's upload, or the stand-in the logo finder
   * assigned it. Absent only when neither loads, and then the page draws the
   * initial.
   */
  logoUrl?: string;
  /**
   * The logo's pixel size, read on the server, so the page can decide how to
   * sit it in the square before the image has loaded. Always present together
   * with `logoUrl`.
   */
  logoWidth?: number;
  logoHeight?: number;
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
}
