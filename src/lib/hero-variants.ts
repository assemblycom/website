/**
 * The homepage hero test: three messages on the simple big-type layout.
 *
 * It started as three messages crossed with two layouts. The composer layout
 * (`control`) lost to big type in the interim read, so it was dropped and the
 * arm names kept, which lets the copy comparison keep collecting data.
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

/** The layout. Only big type remains; see the note above. */
export const LAYOUT_KEYS = ["bigtype"] as const;
export type LayoutKey = (typeof LAYOUT_KEYS)[number];

/** `<copy>-<layout>`, e.g. "firm-bigtype". What the cookie and events carry. */
export type Arm = `${CopyKey}-${LayoutKey}`;

export const ARMS: Arm[] = COPY_KEYS.flatMap((copy) =>
  LAYOUT_KEYS.map((layout) => `${copy}-${layout}` as Arm),
);

/**
 * What renders for anyone the test leaves out — logged-in visitors, and every
 * request while the kill switch is on.
 *
 * A test message on the shipped layout, NOT the headline the site used to
 * carry. "The platform firms run on and build on" is retired: the three
 * messages below replace it outright, and a visitor outside the test should see
 * the site as it now reads rather than a headline nothing else still uses.
 *
 * The cost of that is deliberate and worth naming: there is no holdout. No arm
 * and no fallback reproduces the old page, so the test can say which message
 * and which layout win against each other, and cannot say whether any of them
 * beats what came before.
 */
export const FALLBACK_COPY: CopyKey = "firm";
export const FALLBACK_LAYOUT: LayoutKey = "bigtype";

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
    h1: "Become an AI-native business",
    // Breaks before the compound rather than after it. Left to balance itself
    // this came out "Become an AI-native" / "business", which leaves a single
    // word on the second line and splits the phrase that carries the message.
    h1Lines: ["Become an", "AI-native business"],
    // Re-anchored with the headline. These are matched by `indexOf`, so the
    // previous anchors ("firm", "for") would simply not be found in the new
    // wording and the big-type arm would have rendered with no app tiles at
    // all — silently, since a tile that isn't located is dropped. Same count
    // and rhythm as before: a pair early, a single before the last word.
    big: {
      // Hand-set, because the automatic measure breaks "AI-native" at its own
      // hyphen — the 16ch cap lands mid-compound at every width, and a split
      // hyphenated word at display size reads as a mistake.
      lines: ["Become", "an AI-native business"],
      iconAfter: "Become",
      iconPair: true,
      iconBefore: "business",
    },
    body: "Start with customizable apps for client intake, proposals, payments, project tracking, and more. Describe anything else, and AI builds it.",
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
    body: "Built apps with secure client logins, permissions, and per-client personalization. Ready to use with clients from day one. No code, no hosting, no auth to wire up.",
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
    body: "Assembly comes with a CRM, a branded client experience, and 30+ apps for intake, proposals, payments, project tracking, and more. Tailor any of them with AI, or build what's missing.",
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
 * The arm a held cookie should become. A visitor assigned to a retired
 * `<copy>-control` arm keeps their message and moves to big type, rather than
 * being redrawn onto a message they were never shown.
 */
export function migrateArm(value: string | undefined | null): Arm | null {
  if (!value) return null;
  const [copy, layout] = value.split("-");
  if (layout === "control" && isCopyKey(copy)) return `${copy}-bigtype`;
  return parseArm(value) ? (value as Arm) : null;
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
  // The retired composer layout resolves to big type, so old review links
  // still land on their message.
  b: "bigtype",
  c: "bigtype",
  control: "bigtype",
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

/** An even draw across the arms. */
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
