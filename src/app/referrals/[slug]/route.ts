import { NextResponse, type NextRequest } from "next/server";

import { referralLandingPath } from "@/lib/referral-link";

/**
 * The referral link the product hands out, for copy-link and the invite email
 * (which adds `?via=email`). Always redirects to /powered-by, never an error
 * page; see referral-link.ts for the params each kind of code carries.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const viaEmail = request.nextUrl.searchParams.get("via") === "email";

  // 307 and no-store: where a code leads depends on the referrer's
  // growth-loops flag, which can change under the same link.
  const response = NextResponse.redirect(
    new URL(await referralLandingPath(slug, viaEmail), request.url),
    307,
  );
  response.headers.set("Cache-Control", "no-store");
  return response;
}
