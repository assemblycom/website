/**
 * The homepage hero test: three messages crossed with two layouts, six arms.
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

/** The message. */
export const COPY_KEYS = ["firm", "builder", "clients"] as const;
export type CopyKey = (typeof COPY_KEYS)[number];

/** The layout. `control` is the hero shipped today. */
export const LAYOUT_KEYS = ["control", "bigtype"] as const;
export type LayoutKey = (typeof LAYOUT_KEYS)[number];

/** `<copy>-<layout>`, e.g. "firm-bigtype". What the cookie and events carry. */
export type Arm = `${CopyKey}-${LayoutKey}`;

export const ARMS: Arm[] = COPY_KEYS.flatMap((copy) =>
  LAYOUT_KEYS.map((layout) => `${copy}-${layout}` as Arm),
);

/**
 * Served to anyone the test leaves out — logged-in visitors, and every request
 * when the kill switch is on. The layout the site ships today, carrying the
 * headline it ships today.
 */
export const UNENROLLED_ARM = "control" satisfies LayoutKey;

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
  firm: {
    key: "firm",
    label: "AI-native firm",
    h1: "Your firm rebuilt for the AI era",
    big: { iconAfter: "firm", iconPair: true, iconBefore: "for" },
    body: "Start with ready-to-go apps for client onboarding, document requests, proposals, payments, and project tracking. Then describe anything else your firm needs, and AI builds it in minutes.",
  },
  builder: {
    key: "builder",
    label: "Builder for real businesses",
    h1: "The AI app builder for real businesses, not weekend projects",
    h1Lines: [
      "The AI app builder for real",
      "businesses, not weekend projects",
    ],
    big: {
      // The comma is the one in `h1`. The prototype's lockup dropped it, which
      // would have made this message read differently in the two layouts — and
      // a message is supposed to be the same thing in both, or the layout read
      // is picking up a copy change.
      lines: [
        "The AI app builder",
        "for real businesses, not",
        "weekend projects",
      ],
      iconAfter: "real",
      iconPair: true,
      iconBefore: "projects",
    },
    body: "Every app ships with secure client logins, permissions and client-by-client data access built in. Your clients sign in once to a branded experience and see only what's theirs. No code, no hosting, no auth to wire up.",
  },
  clients: {
    key: "clients",
    label: "Client experience",
    h1: "Deliver remarkable client experiences",
    big: {
      lines: ["Deliver remarkable", "client experiences"],
      iconAfter: "Deliver",
      iconPair: true,
    },
    // "30+ ready-made apps", plural. The prototype carries the test doc's
    // singular verbatim so the preview and the spec cannot disagree; this is
    // the copy that goes in front of visitors, so it is corrected here.
    body: "Assembly comes with a CRM, a branded client experience, and 30+ ready-made apps that work together: proposals, intake, onboarding, project tracking, invoicing, and more. Tailor any of them with AI, or build what's missing.",
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

/**
 * The prototype's letters, kept as aliases so the exploration links already
 * shared around keep resolving: hero-prototype-delta.vercel.app/?copy=a&layout=c
 * and the same query on this site land on the same arm.
 */
const COPY_ALIASES: Record<string, CopyKey> = {
  a: "firm",
  b: "builder",
  c: "clients",
};
const LAYOUT_ALIASES: Record<string, LayoutKey> = {
  b: "control",
  c: "bigtype",
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

/** An even draw across the six arms. */
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
