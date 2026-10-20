/**
 * The homepage hero: one message, the client experience one, on the simple
 * big-type layout.
 *
 * It started as a test of three messages crossed with two layouts (`control`,
 * the composer, and `bigtype`). Big type won the first read and became the only
 * layout, and the arms were renamed `<copy>-v2` when the page below the hero
 * changed. The second read ranked the client experience message first, so
 * Round 3 stops the test and ships that message to everyone, with a rewritten
 * body, as `clients-v3`. The other two messages are in git history.
 *
 * The arm machinery stays on purpose. Signups still carry `heroArm`, so the
 * shipped hero has a baseline of its own, and the new name keeps it from
 * pooling with Round 2's readout. A later round can add arms back here without
 * touching the middleware.
 *
 * Keys are semantic rather than lettered on purpose. The prototype's switcher
 * letters its layouts by list position while the URL keys them by their own
 * letter, and the test doc letters them a third way — so "Layout B" has meant
 * three different things already. A name that says what it is cannot drift.
 *
 * A message is its headline AND its body, tested as one unit: the two are
 * written to argue the same thing, and splitting them would be a third factor
 * this test has no traffic to read.
 */

/** The message. Only the one that won Round 2 ships. */
export const COPY_KEYS = ["clients"] as const;
export type CopyKey = (typeof COPY_KEYS)[number];

/** The page version. `v3` is big type with the Round 3 body copy. */
export const LAYOUT_KEYS = ["v3"] as const;
export type LayoutKey = (typeof LAYOUT_KEYS)[number];

/** `<copy>-<layout>`, e.g. "clients-v3". What the cookie and events carry. */
export type Arm = `${CopyKey}-${LayoutKey}`;

export const ARMS: Arm[] = COPY_KEYS.flatMap((copy) =>
  LAYOUT_KEYS.map((layout) => `${copy}-${layout}` as Arm),
);

/**
 * What renders for anyone the arm leaves out — logged-in visitors, and every
 * request while the kill switch is on. It is the shipped hero, so a visitor
 * outside the arm sees the same page as everyone else.
 */
export const FALLBACK_COPY: CopyKey = "clients";
export const FALLBACK_LAYOUT: LayoutKey = "v3";

export interface CopyVariant {
  key: CopyKey;
  /** The name this message goes by in the test doc and the readout. */
  label: string;
  h1: string;
  /**
   * An explicit lockup for a headline long enough that automatic balancing
   * splits it three ways. Each line still wraps on its own when the column is
   * too narrow to hold it.
   */
  h1Lines?: string[];
  body: string;
  /**
   * Where the big-type layout sets its app tiles into this headline: one after
   * `iconAfter`, one before `iconBefore`.
   */
  big: {
    /** A hand-set lockup, for a headline too long to balance well. */
    lines?: string[];
    iconAfter?: string;
    /** Set a second tile beside the `iconAfter` one, as a pair. */
    iconPair?: boolean;
    iconBefore?: string;
  };
}

export const COPY_VARIANTS: Record<CopyKey, CopyVariant> = {
  clients: {
    key: "clients",
    label: "Client experience",
    h1: "Deliver remarkable client experiences",
    big: {
      lines: ["Deliver remarkable", "client experiences"],
      iconAfter: "Deliver",
      iconPair: true,
    },
    // Opens on the client and walks their journey in order (onboard, sign,
    // collaborate, pay). "Customizable" keeps the point that the ready-made apps
    // can be changed, since visitors who miss it try to rebuild them with AI.
    body: "Let clients onboard, sign, collaborate, and pay in one branded client experience, with a CRM behind it for your team. Start with 30+ customizable apps, then use AI to build what's missing.",
  },
};

const isCopyKey = (value: string): value is CopyKey =>
  (COPY_KEYS as readonly string[]).includes(value);

const isLayoutKey = (value: string): value is LayoutKey =>
  (LAYOUT_KEYS as readonly string[]).includes(value);

/** Splits an arm, or null if it isn't one. Never trust a cookie or a URL. */
export function parseArm(
  value: string | undefined | null,
): { copy: CopyKey; layout: LayoutKey } | null {
  if (!value) return null;
  const [copy, layout] = value.split("-");
  if (!copy || !layout) return null;
  if (!isCopyKey(copy) || !isLayoutKey(layout)) return null;
  return { copy, layout };
}

/** The one arm that ships. */
const SHIPPED_ARM: Arm = `${FALLBACK_COPY}-${FALLBACK_LAYOUT}`;

/** Every message and page version from Rounds 1 and 2, all retired. */
const LEGACY_COPY = new Set(["firm", "builder", "clients"]);
const LEGACY_LAYOUTS = new Set(["control", "bigtype", "v2"]);

/**
 * The arm a held cookie should become. Any arm from Rounds 1 or 2 moves to the
 * shipped one, since its message or page no longer exists, and the rewritten
 * cookie means the visitor's next signup reports the hero they actually saw.
 */
export function migrateArm(value: string | undefined | null): Arm | null {
  if (!value) return null;
  if (parseArm(value)) return value as Arm;
  const [copy, layout] = value.split("-");
  if (LEGACY_COPY.has(copy) && LEGACY_LAYOUTS.has(layout)) return SHIPPED_ARM;
  return null;
}

/**
 * The prototype's letters, kept as aliases so the exploration links already
 * shared around keep resolving: hero-prototype-delta.vercel.app/?copy=a&layout=c
 * and the same query on this site land on the same arm.
 */
const COPY_ALIASES: Record<string, CopyKey> = {
  // Links to the retired messages land on the shipped one rather than failing.
  a: "clients",
  b: "clients",
  c: "clients",
  firm: "clients",
  builder: "clients",
};
const LAYOUT_ALIASES: Record<string, LayoutKey> = {
  // Every retired layout and page version resolves to the shipped one, so old
  // review links still land on the homepage as it now reads.
  b: "v3",
  c: "v3",
  control: "v3",
  bigtype: "v3",
  v2: "v3",
};

/**
 * An arm forced through the query string, for review. Accepts either the
 * semantic keys or the prototype's letters. Both params must resolve — half a
 * pick is a typo, and silently filling in the other half would show someone an
 * arm they did not ask for.
 */
export function armFromQuery(params: URLSearchParams): Arm | null {
  const rawCopy = params.get("copy");
  const rawLayout = params.get("layout");
  if (!rawCopy || !rawLayout) return null;
  const copy = isCopyKey(rawCopy) ? rawCopy : COPY_ALIASES[rawCopy];
  const layout = isLayoutKey(rawLayout) ? rawLayout : LAYOUT_ALIASES[rawLayout];
  if (!copy || !layout) return null;
  return `${copy}-${layout}`;
}

/** An even draw across the arms. With one arm it always returns it. */
export function randomArm(): Arm {
  return ARMS[Math.floor(Math.random() * ARMS.length)];
}

/** Where the assignment is kept. Written by middleware, read by both sides. */
export const HERO_COOKIE = "ab_hero";

/** The arm's name on the signup URL, where the product reads it. */
export const HERO_ARM_PARAM = "heroArm";

/**
 * The arm as the browser holds it, for code that runs at click time.
 *
 * Only ever call this from an event handler, never while rendering: the server
 * cannot read `document`, so a link whose href came from here would be built
 * without the arm on the server and with it on the client, which React reports
 * as a hydration mismatch. Anything rendered into markup takes the arm the
 * server already resolved and passes it to `withHeroArm`.
 */
export function readHeroArmCookie(): Arm | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${HERO_COOKIE}=([^;]*)`),
  );
  const value = match?.[1] && decodeURIComponent(match[1]);
  return parseArm(value) ? (value as Arm) : null;
}

/**
 * Adds the arm to a signup URL, so the product can report which hero a signup
 * came from. A separate parameter rather than `utm_content`: that slot already
 * carries campaign attribution, and overwriting it would trade the answer to
 * this test for the answer to every paid-channel question.
 */
export function withHeroArm(url: string, arm: Arm | null | undefined): string {
  if (!arm) return url;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}${HERO_ARM_PARAM}=${encodeURIComponent(arm)}`;
}
