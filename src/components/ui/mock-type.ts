// ── THE MOCK TYPE SCALE ───────────────────────────────────────────────────
//
// One scale for every product screen drawn on this site, so a label in the CRM
// shot is the same size as the label beside it in the sign-in shot.
//
// The pillar mocks each carried their own numbers, picked as each was drawn.
// Measured across the four on /ai-app-builder there were NINE sizes in play —
// 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13.5 and 17 — with the same role set
// differently in each: a row label was 10.5 in the CRM and 12 in the portal
// nav, a soft sub-line was 9.5, 10 and 11 depending on which shot you were
// looking at, and a screen's heading was 13.5 in one and 17 in another. All
// four render 1:1 at the same place on the same page, so none of that was a
// drawing-scale difference; it just read as four different UIs.
//
// This is the treatment portal-build-cards.tsx already gives the /client-portal
// family — UI_PRIMARY / UI_SECONDARY / CARD_BODY, named once and read
// everywhere — which is why those cards look like one system. The values here
// are ITS values, so the two families agree rather than being two tidy scales
// that disagree with each other.
//
// Picking a step: ask what the thing IS, not how big it should look.

/**
 * A screen's own heading — the one line of a mock that names it.
 *
 * A mock's biggest type has to stay inside the mock's own range or it stops
 * being part of the screen. The sign-in's title was 17px, set from the ratio
 * the real product gives it; copied into a mock drawn at about half product
 * scale, that is a marketing headline that wandered into a screenshot.
 */
export const MOCK_TITLE = "text-[13.5px] leading-[1.3]";

/**
 * Prose inside a mock — a sentence someone typed or is meant to read, as
 * against a label they glance at. The composer's text, mostly.
 */
export const MOCK_BODY = "text-[12.5px] leading-[1.4]";

/**
 * The default. Row labels, names, button labels, field values, tabs — anything
 * that is the primary thing in its row.
 */
export const MOCK_PRIMARY = "text-[11.5px] leading-none";

/** MOCK_PRIMARY where the line sits above a second one and needs to breathe. */
export const MOCK_PRIMARY_STACKED = "text-[11.5px] leading-[1.3]";

/**
 * The quieter half of a pair: a sub-line under a name, a field's label above
 * its box, a column heading, a timestamp.
 */
export const MOCK_SECONDARY = "text-[10.5px] leading-none";

/** MOCK_SECONDARY where the text can wrap, or sits under a MOCK_PRIMARY line. */
export const MOCK_SECONDARY_STACKED = "text-[10.5px] leading-[1.35]";

/**
 * Smaller than a label and not read as words: avatar initials, a rule's "OR",
 * a chip that is really a mark.
 */
export const MOCK_MICRO = "text-[9.5px] leading-none";
