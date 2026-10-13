import { PORTAL_ID, PORTAL_SIGNUP_URL } from "@/lib/portal-api";

/**
 * The tracking contract for /powered-by and /built-by, as the growth-loops PRD
 * writes it down. The badge in the product builds these params and this page
 * forwards them to signup untouched, so the workspace that sent a visitor is
 * the one that gets credited for them.
 *
 *   /powered-by?utm_source=assembly&utm_medium=powered_by&utm_campaign=badge
 *              &utm_content=client_login&ref=<workspace id>&firm=<firm name>
 *
 * /referrals links land here too (see referral-link.ts), with
 * `utm_medium=referral` and the two referral params, `first` and `referred`.
 */

/**
 * Where a visit came from, carried as `utm_content`. The first five are the
 * PRD's badge placements, set by the product. `share` is /built-by: a link a
 * firm posts on purpose rather than a badge a client clicks, so it gets a value
 * of its own instead of borrowing a placement.
 */
export const POWERED_BY_CONTENT = [
  "client_login",
  "client_signup",
  "invoice",
  "email_footer",
  "landing_page",
  "share",
] as const;
export type PoweredByContent = (typeof POWERED_BY_CONTENT)[number];

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
] as const;
type UtmKey = (typeof UTM_KEYS)[number];

export interface PoweredByAttribution {
  /** The referring workspace id. Decides who is credited. */
  ref?: string;
  /**
   * The firm's name as the badge wrote it. Forwarded to signup, never shown:
   * anyone can write it, so the page names only a firm the lookup found.
   */
  firm?: string;
  /** The referrer's first name, from a /referrals link. Signup shows it. */
  first?: string;
  /** The referral code, from a /referrals link on the old program. */
  referred?: string;
  utm: Partial<Record<UtmKey, string>>;
}

/** The PRD's constant badge params. Only /built-by supplies them itself. */
const BADGE_UTM = {
  utm_source: "assembly",
  utm_medium: "powered_by",
  utm_campaign: "badge",
} as const;

// Forwarded, never drawn, so this is a sanity bound and not a layout one. It
// matches the longest company name the product accepts at registration.
const MAX_FIRM_LENGTH = 100;
// Matches referral-link.ts, which drops a longer first name from the slug.
const MAX_FIRST_NAME_LENGTH = 50;

type SearchParams = Record<string, string | string[] | undefined>;

function first(params: SearchParams, key: string): string | undefined {
  const value = params[key];
  const one = Array.isArray(value) ? value[0] : value;
  const trimmed = one?.trim();
  return trimmed ? trimmed : undefined;
}

/**
 * What a badge click carried, read off /powered-by's query string.
 *
 * Forwarded as it arrived rather than filled in with the badge defaults: a
 * visit without them did not come from a badge, and saying it did would put
 * someone else's traffic in the loop's numbers.
 */
export function attributionFromSearchParams(
  params: SearchParams,
): PoweredByAttribution {
  const utm: PoweredByAttribution["utm"] = {};
  for (const key of UTM_KEYS) {
    const value = first(params, key);
    if (value) utm[key] = value;
  }
  const firm = first(params, "firm");
  const firstName = first(params, "first");
  const referred = first(params, "referred");
  return {
    ref: first(params, "ref"),
    firm: firm && firm.length <= MAX_FIRM_LENGTH ? firm : undefined,
    first:
      firstName && firstName.length <= MAX_FIRST_NAME_LENGTH
        ? firstName
        : undefined,
    referred: referred && PORTAL_ID.test(referred) ? referred : undefined,
    utm,
  };
}

/**
 * The attribution a /built-by link stands for. It has no query string, by
 * design, so the server supplies what a badge would have.
 */
export function shareAttribution(ref: string): PoweredByAttribution {
  return {
    ref,
    utm: { ...BADGE_UTM, utm_content: "share" satisfies PoweredByContent },
  };
}

/** Signup, with everything the visit carried. */
export function signupHref({
  ref,
  firm,
  first,
  referred,
  utm,
}: PoweredByAttribution): string {
  const params = new URLSearchParams();
  for (const key of UTM_KEYS) {
    const value = utm[key];
    if (value) params.set(key, value);
  }
  if (ref) params.set("ref", ref);
  if (firm) params.set("firm", firm);
  if (first) params.set("first", first);
  if (referred) params.set("referred", referred);
  const query = params.toString();
  // PORTAL_SIGNUP_URL already carries `?referrer=`, which the app needs to
  // create the workspace on the current pricing model.
  return query ? `${PORTAL_SIGNUP_URL}&${query}` : PORTAL_SIGNUP_URL;
}
