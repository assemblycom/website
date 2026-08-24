/**
 * Serialize a JSON-LD graph for embedding in a <script type="application/ld+json">.
 *
 * The HTML parser scans a script element's contents for the literal "</script"
 * and ends the element there, before any JSON is parsed. JSON.stringify has no
 * reason to care — the sequence is perfectly legal inside a JSON string — so a
 * CMS-authored title carrying it would close the element early, and the rest of
 * that title would be parsed as markup, script tags included. Blog fields come
 * from Ghost, which makes that stored XSS rather than a theoretical one.
 *
 * Escaping "<" is the fix: "<" is still valid JSON and parses back to
 * exactly the same string, so the schema a crawler reads is unchanged, but it
 * can no longer terminate the element. U+2028 and U+2029 are escaped for a
 * related reason — legal in JSON, not legal unescaped in a JavaScript string —
 * and written here as escapes rather than as themselves, since raw they are
 * line terminators to a JS parser and would break this file.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
