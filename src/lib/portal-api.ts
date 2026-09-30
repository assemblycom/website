import { IS_LIVE_SITE } from "@/lib/constants";

/** The product's public API, which the firm pages and /referrals read from. */
export const PORTAL_API_URL =
  process.env.PORTAL_API_URL ??
  (IS_LIVE_SITE
    ? "https://app-api.assembly.com"
    : "https://app-api.assembly-staging.com");

/**
 * Portal ids are shortids, and so are user ids. Anything else can't be one, and
 * is not put into a request path.
 */
export const PORTAL_ID = /^[A-Za-z0-9_-]{1,64}$/;
