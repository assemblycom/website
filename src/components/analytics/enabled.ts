/**
 * Whether this build may feed the real analytics stream.
 *
 * Production only, and keyed off VERCEL_ENV at BUILD time — the same way the
 * noindex header and robots.txt are — so a staging or preview build cannot send
 * events even if its environment scope happens to carry the keys. Scoping the
 * keys is what used to decide this, which meant adding a key to the wrong scope
 * silently put test sessions into real reporting.
 *
 * Not NEXT_PUBLIC_: this is read where the scripts are rendered, on the server,
 * so the snippets never reach the browser at all rather than loading and then
 * declining to send.
 */
export const ANALYTICS_ENABLED = process.env.VERCEL_ENV === "production";
