import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Checks the signature Ghost puts on a custom integration's webhook.
 *
 * Ghost can't add a header of our choosing the way Contentful can. When the
 * webhook has a secret, it signs every delivery instead:
 *
 *   X-Ghost-Signature: sha256=<hex HMAC-SHA256(secret, body + t)>, t=<ms>
 *
 * The HMAC covers the raw body followed directly by the timestamp, with no
 * separator. Getting that wrong fails every request, so it is tested in
 * ghost-webhook.test.mjs.
 *
 * A signature older than MAX_AGE_MS is refused, so a captured request can't be
 * replayed forever. Ghost signs and sends the request the moment the event
 * happens, so five minutes leaves plenty of slack for clock drift.
 */

export const GHOST_SIGNATURE_HEADER = "x-ghost-signature";

const MAX_AGE_MS = 5 * 60 * 1000;

export function verifyGhostSignature(
  body: string,
  header: string | null,
  secret: string | undefined,
  now: number = Date.now(),
): boolean {
  if (!secret || !header) return false;

  const match = /^sha256=([0-9a-f]{64}), t=(\d+)$/.exec(header.trim());
  if (!match) return false;
  const [, given, ts] = match;

  if (Math.abs(now - Number(ts)) > MAX_AGE_MS) return false;

  const expected = createHmac("sha256", secret)
    .update(`${body}${ts}`)
    .digest("hex");
  return timingSafeEqual(Buffer.from(given), Buffer.from(expected));
}
