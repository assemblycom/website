import { NextResponse, type NextRequest } from "next/server";

import { SIGNUP_URL } from "@/lib/constants";
import { getFirmName } from "@/lib/firm-branding";
import {
  referralAttribution,
  signupHref,
  type ReferralContent,
} from "@/lib/powered-by-attribution";
import { lookupReferral } from "@/lib/referral-lookup";

/**
 * The referral link the product hands out, `/referrals/{firstName}_{code}`, for
 * both copy-link and the invite email.
 *
 * It carries no tracking params, so this resolves the code and forwards to
 * signup with the Loop 2 attribution the PRD writes down, plus the referrer's
 * first name off the front of the link as `first`, which signup reads to say
 * who sent the visitor.
 *
 * A route rather than a page: there is nothing to render, only somewhere to
 * send the visitor. Every path ends at signup, never at an error page, because
 * whoever clicked meant to sign up whether or not the code still resolves.
 */

/**
 * How long the visitor waits for the redirect, across both lookups. Past it,
 * the optional firm name is dropped rather than waited on; `ref` and the UTMs,
 * which are what credit the referrer, still go through.
 */
const DEADLINE_MS = 3_000;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const deadline = Date.now() + DEADLINE_MS;
  const { slug } = await params;
  const content: ReferralContent =
    request.nextUrl.searchParams.get("via") === "email"
      ? "email_invite"
      : "link";

  const destination = await referralSignupUrl(
    parseSlug(slug),
    content,
    deadline,
  );

  // Temporary, and not cached anywhere: where a code leads depends on the
  // referrer's growth-loops flag, which can change under the same link.
  const response = NextResponse.redirect(destination, 307);
  response.headers.set("Cache-Control", "no-store");
  return response;
}

// A first name longer than this is not one the product wrote into a link.
const MAX_FIRST_NAME_LENGTH = 50;

interface ReferralSlug {
  first?: string;
  code: string;
}

/**
 * The first name is everything before the first `_`, the code everything
 * after. User codes are shortids, which contain `_` themselves
 * (`Usman_h6L_2vXvg`), so splitting on the last one would cut real codes in
 * half.
 */
function parseSlug(slug: string): ReferralSlug {
  const split = slug.indexOf("_");
  if (split === -1) return { code: slug };
  const first = slug.slice(0, split).trim();
  return {
    first: first && first.length <= MAX_FIRST_NAME_LENGTH ? first : undefined,
    code: slug.slice(split + 1),
  };
}

async function referralSignupUrl(
  { first, code }: ReferralSlug,
  content: ReferralContent,
  deadline: number,
): Promise<string> {
  const referral = await lookupReferral(code);

  if (!referral) return SIGNUP_URL;

  if (referral.referrerPortalId) {
    const ref = referral.referrerPortalId;
    const firm = await beforeDeadline(getFirmName(ref), deadline);
    return signupHref(referralAttribution({ ref, firm, first, content }));
  }

  // growth-loops is off for this referrer, so the old program credits the
  // user, through the param signup has always read.
  return `${SIGNUP_URL}&${new URLSearchParams({ referred: code })}`;
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
