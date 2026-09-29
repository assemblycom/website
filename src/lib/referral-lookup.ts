import "server-only";

import { PORTAL_API_URL, PORTAL_ID } from "@/lib/portal-api";

const TIMEOUT_MS = 3_000;

/**
 * What the product's `GET /referral/{code}` says a referral code stands for.
 *
 * - growth-loops on: `referrerPortalId`, the workspace the referral credits.
 *   A user code resolves to that user's workspace; a workspace id to itself.
 * - growth-loops off: no `referrerPortalId`. The code is still a valid user
 *   referral, for the old program to credit.
 */
export interface ReferralLookup {
  referrerPortalId?: string;
}

/**
 * The referral behind a code, or undefined when it is unknown, belongs to a
 * deleted or archived user, or the lookup fails.
 *
 * Never cached: the answer turns on the referrer's growth-loops flag, which can
 * change under the same code at any time.
 */
export async function lookupReferral(
  code: string,
): Promise<ReferralLookup | undefined> {
  if (!PORTAL_ID.test(code)) return undefined;

  let body: unknown;
  try {
    const res = await fetch(`${PORTAL_API_URL}/referral/${code}`, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
    if (!res.ok) return undefined;
    body = await res.json();
  } catch {
    return undefined;
  }

  return { referrerPortalId: id(body, "referrerPortalId") };
}

// The response is only trusted as far as this check goes: a field that is
// missing, the wrong type or not shaped like an id reads as absent.
function id(value: unknown, key: string): string | undefined {
  const found = isRecord(value) ? value[key] : undefined;
  return typeof found === "string" && PORTAL_ID.test(found) ? found : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
