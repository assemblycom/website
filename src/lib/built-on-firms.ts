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
   * The firm's own uploaded logo. Absent when the workspace only carries a
   * stand-in (a generated letter, or Assembly's own mark), so the page draws
   * the initial rather than presenting our logo as theirs.
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
