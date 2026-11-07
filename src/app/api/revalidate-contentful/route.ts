import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { CONTENTFUL_CACHE_TAG } from "@/lib/contentful";

// Called by a Contentful webhook when a catalogue entry or asset is published,
// unpublished or deleted, so the change shows within seconds rather than when
// the hourly cache refresh comes round. "max" serves the old copy to the next
// visitor while the fresh one loads, so a burst of publishes never stampedes
// Contentful.
//
// The shared secret keeps anyone else from forcing refreshes. Without it set,
// the route refuses everything: an open endpoint would let the internet run up
// our Contentful calls.

const SECRET_HEADER = "x-revalidate-secret";

function hasValidSecret(request: Request): boolean {
  const expected = process.env.CONTENTFUL_REVALIDATE_SECRET;
  const given = request.headers.get(SECRET_HEADER);
  if (!expected || !given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  if (!hasValidSecret(request)) {
    return NextResponse.json({ revalidated: false }, { status: 401 });
  }
  revalidateTag(CONTENTFUL_CACHE_TAG, "max");
  return NextResponse.json({ revalidated: true });
}
