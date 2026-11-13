// ─────────────────────────────────────────────────────────────────────────
// PLAN MARKS — one icon per pricing plan, drawn in the brand iconography
// (the Core Set in components/home/app-marks.tsx): a solid square with a
// frosted glass sheet laid over it, offset, and solid dots on the sheet.
// Geometry and blur are the brand export's own: a 135-unit sheet with 21-unit
// corners, the solid square offset ~23.5 units down and right (blur: see
// SHEET_BLUR).
//
// Abstract on purpose (Ana's direction, Nov 2026): every plan is the same
// square tile — the Core Set's CRM geometry, solid square behind a glass sheet —
// carrying rounded dots in ink, and the count climbs with the tier like the
// faces of a die: 1, 3, 5, 7, 9. Advanced's seven are the exact dots of the
// brand export it was drawn from.
// ─────────────────────────────────────────────────────────────────────────

import type { MarkGlyphDef } from "@/components/home/app-marks";

// Twice the export's 13.57. Blur is relative to scale, so at the 20px these
// marks render the export's value came to under a pixel and the glass read as
// flat white; doubled, the frost over the tinted square shows at that size.
const SHEET_BLUR = 27.1352;

/** A clockwise rounded rectangle. Clockwise throughout, so subpaths union. */
function rr(x: number, y: number, w: number, h: number, r: number) {
  return `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`;
}

const solid = (d: string, blur = 0) => ({ role: "solid" as const, blur, d });
const sheet = (d: string) => ({ role: "sheet" as const, blur: SHEET_BLUR, d });

/** One rounded dot, 23 units square with a 10-unit radius, centred on (cx, cy). */
const dot = (cx: number, cy: number) => rr(cx - 11.5, cy - 11.5, 23, 23, 10);

/** The tile every plan mark shares: the export's solid square and glass sheet. */
const tile = (dots: [number, number][]): MarkGlyphDef => ({
  viewBox: "0 0 159 159",
  layers: [
    solid(rr(23.876, 23.497, 135, 135, 21), 0),
    sheet(rr(0, 0, 135.099, 135, 21)),
    // The dots stay off-black (#101010, the brand's) whatever the tint: on the
    // white glass a pastel dot washed out.
    { ...solid(dots.map(([x, y]) => dot(x, y)).join(""), 0), fill: "#101010" },
  ],
});

// Columns and rows on the sheet: left, centre, right.
const L = 34.09;
const C = 67.5;
const R = 101;

export const PLAN_MARKS: Record<string, MarkGlyphDef> = {
  Free: tile([[C, C]]),
  Starter: tile([[L, L], [C, C], [R, R]]),
  Professional: tile([[L, L], [R, L], [C, C], [L, R], [R, R]]),
  // The brand export's seven, at its own coordinates.
  Advanced: tile([
    [34.09, 47.43],
    [34.09, 86.36],
    [66.94, 29.97],
    [66.94, 105.03],
    [67.55, 66.53],
    [101.01, 47.43],
    [101.01, 86.36],
  ]),
  Enterprise: tile([
    [L, L], [C, L], [R, L],
    [L, C], [C, C], [R, C],
    [L, R], [C, R], [R, R],
  ]),
};
