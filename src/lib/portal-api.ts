import { APP_URL, IS_LIVE_SITE, SIGNUP_REFERRER } from "@/lib/constants";

/** The product's public API, which the firm pages and /referrals read from. */
export const PORTAL_API_URL =
  process.env.PORTAL_API_URL ??
  (IS_LIVE_SITE
    ? "https://app-api.assembly.com"
    : "https://app-api.assembly-staging.com");

/**
 * Signup on the dashboard that goes with `PORTAL_API_URL`. The firm and
 * referral pages look ids up on that API and forward them to signup, so the two
 * have to be the same environment: a staging `ref` means nothing to production.
 */
export const PORTAL_SIGNUP_URL = `${
  IS_LIVE_SITE ? APP_URL : "https://dashboard.assembly-staging.com"
}/signup?referrer=${SIGNUP_REFERRER}`;

/**
 * Portal ids are shortids, and so are user ids. Anything else can't be one, and
 * is not put into a request path.
 */
export const PORTAL_ID = /^[A-Za-z0-9_-]{1,64}$/;
