import "server-only";

import { getFirmName } from "@/lib/firm-branding";
import { PORTAL_API_URL, PORTAL_ID } from "@/lib/portal-api";

/**
 * Where a referral link, `/referrals/{firstName}_{code}`, sends the visitor:
 * /powered-by, which says what Assembly is before asking for a signup. Old
 * links travel well past the invite they were made for (one sits in a
 * third-party review of client portals), and a reader there knows nothing
 * about us yet. /powered-by forwards every param below to signup unchanged, so
 * the referrer is credited exactly as when the link went straight there.
 *
 * Every visit gets the PRD's Loop 2 UTMs, so every referral click is tracked.
 * On top of them:
 *
 * - growth-loops on: `ref` and `firm` for the referring workspace, and the
 *   referrer's first name as `first` so signup can say who sent them.
 * - growth-loops off: `referred`, which the old program reads.
 * - unknown code, or the lookup fails: nothing more.
 */

/** The longest the visitor waits. Past it, the optional firm name is dropped. */
const DEADLINE_MS = 3_000;
const MAX_FIRST_NAME_LENGTH = 50;

export async function referralLandingPath(
  slug: string,
  viaEmail: boolean,
): Promise<string> {
  const deadline = Date.now() + DEADLINE_MS;
  const { firstName, code } = parseSlug(slug);
  const utm = {
    utm_source: "assembly",
    utm_medium: "referral",
    utm_campaign: "referral",
    utm_content: viaEmail ? "email_invite" : "link",
  };

  const referral = await lookupReferral(code);
  if (!referral) return poweredByWith(utm);

  const ref = referral.referrerPortalId;
  if (!ref) return poweredByWith({ ...utm, referred: code });

  return poweredByWith({
    ...utm,
    ref,
    firm: await beforeDeadline(getFirmName(ref), deadline),
    first: firstName,
  });
}

/**
 * Splits on the first `_`, not the last: user codes contain `_` themselves
 * (`Usman_h6L_2vXvg` is `Usman` + `h6L_2vXvg`).
 */
function parseSlug(slug: string): { firstName?: string; code: string } {
  const split = slug.indexOf("_");
  if (split === -1) return { code: slug };

  const firstName = slug.slice(0, split).trim();
  return {
    firstName:
      firstName.length <= MAX_FIRST_NAME_LENGTH ? firstName : undefined,
    code: slug.slice(split + 1),
  };
}

/**
 * The product's `GET /referral/{code}`. A 200 means the code is a live
 * referral; `referrerPortalId` is only there when growth-loops is on for the
 * referrer. Undefined means unknown, deleted, or the lookup failed.
 *
 * Never cached, since the flag can change under the same code.
 */
async function lookupReferral(
  code: string,
): Promise<{ referrerPortalId?: string } | undefined> {
  if (!PORTAL_ID.test(code)) return undefined;
  try {
    const res = await fetch(`${PORTAL_API_URL}/referral/${code}`, {
      signal: AbortSignal.timeout(DEADLINE_MS),
      cache: "no-store",
    });
    if (!res.ok) return undefined;
    const body: unknown = await res.json();
    const id = isRecord(body) ? body.referrerPortalId : undefined;
    return {
      referrerPortalId:
        typeof id === "string" && PORTAL_ID.test(id) ? id : undefined,
    };
  } catch {
    return undefined;
  }
}

/** /powered-by with these params. Empty ones are left out. */
function poweredByWith(params: Record<string, string | undefined>): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) query.set(key, value);
  }
  return `/powered-by?${query}`;
}

/** The promise's value, or undefined if it hasn't settled by the deadline. */
async function beforeDeadline<T>(
  promise: Promise<T>,
  deadline: number,
): Promise<T | undefined> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const expired = new Promise<undefined>((resolve) => {
    timer = setTimeout(() => resolve(undefined), deadline - Date.now());
  });
  try {
    return await Promise.race([promise, expired]);
  } finally {
    clearTimeout(timer);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
