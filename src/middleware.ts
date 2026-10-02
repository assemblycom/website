import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth-script";
import {
  armFromQuery,
  HERO_COOKIE,
  parseArm,
  randomArm,
  type Arm,
} from "@/lib/hero-variants";

/**
 * Assigns the homepage hero arm (see src/lib/hero-variants.ts).
 *
 * Assignment happens here, ahead of the render, so the arm reaches the hero as
 * a prop from the server. The alternative — letting the hero read the cookie
 * once it has mounted — paints the shipped hero and then swaps it, which puts a
 * layout shift on the one element the test is trying to measure.
 *
 * The rewrite gives each arm a path of its own rather than branching inside
 * `/`. That costs nothing today (the root layout's `cookies()` call already
 * makes every route dynamic) and is the shape that caches per arm for free if
 * that ever changes.
 */

/** Ninety days. Long enough that the test window cannot outlive an assignment. */
const COOKIE_MAX_AGE = 60 * 60 * 24 * 90;

/**
 * Collapses everyone onto the shipped hero without a deploy. Set
 * HERO_TEST_ENABLED to "0" in the Vercel project to stop the test; anything
 * else (including unset) runs it.
 */
const enabled = process.env.HERO_TEST_ENABLED !== "0";

/**
 * `/hero-variant/<arm>` is the rewrite target and never a destination: a
 * visitor who types it gets sent home, so the test cannot leak a second URL for
 * the homepage into shares or search results.
 */
function isDirectVariantHit(pathname: string) {
  return pathname.startsWith("/hero-variant");
}

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  if (isDirectVariantHit(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Logged in: the test is for new visitors, and an existing customer's visit
  // says nothing about which message wins a signup. They keep today's hero and
  // are never enrolled, so no cookie is written and no exposure is recorded.
  if (request.cookies.has(SESSION_COOKIE)) {
    return NextResponse.next();
  }

  if (!enabled) {
    return NextResponse.next();
  }

  // Reviewing a specific arm, via ?copy=&layout=. Writes the cookie too, so
  // clicking around the site afterwards stays in the arm being looked at.
  const forced = armFromQuery(searchParams);
  const existing = parseArm(request.cookies.get(HERO_COOKIE)?.value)
    ? (request.cookies.get(HERO_COOKIE)!.value as Arm)
    : null;

  const arm: Arm = forced ?? existing ?? randomArm();

  const response = NextResponse.rewrite(
    new URL(`/hero-variant/${arm}`, request.url),
  );

  // Written on every enrolled request rather than only on the first: it is what
  // refreshes the ninety days, and it repairs a cookie that was tampered with
  // or left over from an arm that no longer exists.
  if (arm !== existing) {
    response.cookies.set(HERO_COOKIE, arm, {
      maxAge: COOKIE_MAX_AGE,
      path: "/",
      sameSite: "lax",
      // Readable by the client: the hero stamps the arm onto its exposure
      // event and onto the signup hand-off.
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
    });
  }

  return response;
}

export const config = {
  // The homepage and the rewrite target, nothing else. Every other route is
  // untouched by the test and should not pay for middleware at all.
  matcher: ["/", "/hero-variant/:path*"],
};
