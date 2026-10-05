import "server-only";

import { getFirmName } from "@/lib/firm-branding";
import {
  PORTAL_API_URL,
  PORTAL_ID,
  PORTAL_SIGNUP_URL,
} from "@/lib/portal-api";

/**
 * Where a referral link, `/referrals/{firstName}_{code}`, sends the visitor.
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

export async function referralSignupUrl(
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
  if (!referral) return signupWith(utm);

  const ref = referral.referrerPortalId;
  if (!ref) return signupWith({ ...utm, referred: code });

  return signupWith({
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

/** Signup with these params added. Empty ones are left out. */
function signupWith(params: Record<string, string | undefined>): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) query.set(key, value);
  }
  // PORTAL_SIGNUP_URL already has a query string (`?referrer=`), so this appends.
  return `${PORTAL_SIGNUP_URL}&${query}`;
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
