import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { GHOST_CACHE_TAG } from "@/lib/ghost";
import {
  GHOST_SIGNATURE_HEADER,
  verifyGhostSignature,
} from "@/lib/ghost-webhook";

// Called by a Ghost webhook when a blog post is published, updated or
// unpublished, so the change shows within seconds rather than when the hourly
// cache refresh comes round. The Ghost counterpart of /api/revalidate-contentful.
// "max" serves the old copy to the next visitor while the fresh one loads, so a
// burst of saves never stampedes Ghost.
//
// Every Ghost read on the site carries the tag, including the featured post in
// the nav, so this marks every page stale, not just /blog. That is cheap: each
// page refetches from the shared data cache on its next visit, and Ghost is
// asked once.
//
// Ghost signs the request with the webhook's secret (see ghost-webhook.ts).
// Without GHOST_REVALIDATE_SECRET set, the route refuses everything: an open
// endpoint would let the internet run up our Ghost calls.

export async function POST(request: Request) {
  // The signature covers the raw body, so read it as text, never re-serialised.
  const body = await request.text();
  const valid = verifyGhostSignature(
    body,
    request.headers.get(GHOST_SIGNATURE_HEADER),
    process.env.GHOST_REVALIDATE_SECRET,
  );
  if (!valid) {
    return NextResponse.json({ revalidated: false }, { status: 401 });
  }
  revalidateTag(GHOST_CACHE_TAG, "max");
  return NextResponse.json({ revalidated: true });
}
