"use client";

// ─────────────────────────────────────────────────────────────────────────
// PROGRESS DONUT — the consultants card's artwork, and the second interactive
// piece in the mock set.
//
// Its own file for the same reason ApprovalCovers has one: the screens in
// segment-mock.tsx are stills rendered on the server, and making that whole
// file a client component so one chart could hold a hover would hand every
// other mock a bundle it has no use for.
//
// WHY it holds state: the legend it replaces was four names and four dots
// under the chart — a key you had to read before you could read the picture.
// A tooltip answers the same question at the moment you ask it, about the one
// share you are pointing at, and gives back the space four legend rows took.
// ─────────────────────────────────────────────────────────────────────────

import { useState } from "react";

// It was four bars, one per engagement, each filled to its share. The names had
// to sit inside the tracks at full width, because with the bar's width carrying
// the value the shortest row could not hold "Northwind Group" — which is the
// tell that the form was wrong for the data: a label that cannot live where its
// value is drawn is a label in the wrong chart.
//
// A ring states a share of a whole in the one way a row of bars cannot: four
// lengths have to be compared to each other and then silently summed, while
// four arcs of one circle are already the sum.
const ENGAGEMENTS = [
  { client: "Meridian Corp", done: 6, total: 6 },
  { client: "Oakwood LLC", done: 5, total: 6 },
  { client: "Bloom Studios", done: 3, total: 6 },
  { client: "Northwind Group", done: 2, total: 6 },
];

const DONE = ENGAGEMENTS.reduce((n, e) => n + e.done, 0);
const PLANNED = ENGAGEMENTS.reduce((n, e) => n + e.total, 0);

// ── Colour ───────────────────────────────────────────────────────────────
//
// ONE opaque colour, with the rung carried as element opacity — not four
// tokens.
//
// The ramp tokens were used first, fill and stroke set to the same rung. In
// dark that drew a ghost outline on every segment: --mock-accent-bg-2/3/4 are
// translucent there, so the stroke and the fill each laid down their own alpha
// and the band where they overlap came out denser than the rest of the shape.
// Any shape that is both filled and stroked in a see-through colour has this
// problem; it is not a rounding bug.
//
// `opacity` on the element fixes it outright, because it composites the element
// ONCE after fill and stroke are painted — paint opaque, then fade the result.
// Which also means the ramp can be opacity rather than four values: Haze at
// 100/72/46/28 against the card is what --mock-accent-bg-2/3/4 already resolve
// to in dark, and over a near-white card in light it lands within a point or
// two of #a4bfff / #c4d6ff / #dfe8ff, which is what those tokens hold there.
// One colour, one ladder, and the same ladder in both themes.
//
// Strongest first, the way the brand's charts separate a series by tint rather
// than by hue. ENGAGEMENTS is ordered by completeness, so the index is the rank.
// It was briefly a green/amber/red traffic light, which said far too much: how
// far through a piece of work a client is is a MAGNITUDE, and recolouring that
// scale as good, warning and bad turns the chart into a judgement about four
// named clients that nothing on the card supports.
const RUNG = [1, 0.72, 0.46, 0.28];

// What a segment fades to while another is hovered. Multiplied by its rung, so
// the ladder is preserved while dimmed rather than being flattened to one tone.
const DIMMED = 0.35;

// ── Geometry ─────────────────────────────────────────────────────────────
//
// The segments are FILLED PATHS, not dashed circles, because of their corners.
//
// A stroked circle can only end three ways — butt, round or square — and the
// reference ends each arc with a SMALL radius, which is none of them. Round
// caps put the radius at half the band (5.5 units here), which is a lozenge;
// butt is a hard corner.
//
// Rounded by stroking the sector in its own colour: a path stroked with a round
// join grows by half the stroke width in every direction and rounds every
// corner by that much, so the sector is inset by the corner radius first and
// then stroked by twice it, landing back at the intended size with four rounded
// corners. Cheaper and more exact than eight hand-written arc commands, and the
// radius is one constant instead of four.
const DONUT_R_OUT = 43.5;
const DONUT_R_IN = 32.5;

// 2 units against an 11-unit band: enough to take the hard point off the
// corner, not enough to read as a cap.
const DONUT_CORNER = 2;

// 3 degrees. A 7-degree parting made the ring read as four pieces arranged in a
// circle; the reference's is a hairline, just enough to say the band is divided.
const DONUT_GAP_DEG = 3;

// -90 so the ring starts at twelve o'clock; svg angles start at three.
const point = (r: number, deg: number) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return `${(50 + r * Math.cos(a)).toFixed(3)} ${(50 + r * Math.sin(a)).toFixed(3)}`;
};

const sector = (from: number, to: number) => {
  const ro = DONUT_R_OUT - DONUT_CORNER;
  const ri = DONUT_R_IN + DONUT_CORNER;
  // The ends are inset by the corner radius too, measured as an angle at each
  // radius — the same arc length subtends a wider angle on the inner edge, so
  // one shared inset would leave the inner corners sitting proud of the outer.
  const io = ((DONUT_CORNER / ro) * 180) / Math.PI;
  const ii = ((DONUT_CORNER / ri) * 180) / Math.PI;
  const large = to - from > 180 ? 1 : 0;
  return [
    `M ${point(ro, from + io)}`,
    `A ${ro} ${ro} 0 ${large} 1 ${point(ro, to - io)}`,
    `L ${point(ri, to - ii)}`,
    `A ${ri} ${ri} 0 ${large} 0 ${point(ri, from + ii)}`,
    "Z",
  ].join(" ");
};

// Each arc's share is of the work ALREADY DONE, not of its own engagement — the
// ring has to add up to one thing, and "who the finished milestones belong to"
// is the question four slices of one circle can answer.
//
// Computed at MODULE SCOPE. ENGAGEMENTS never changes, so there is nothing to
// do per render — and the running total this needs is a reassignment the
// compiler will not allow across a render anyway.
const ARCS = (() => {
  const sweepable = 360 - DONUT_GAP_DEG * ENGAGEMENTS.length;
  let cursor = 0;
  return ENGAGEMENTS.map(({ client, done, total }) => {
    const sweep = (done / DONE) * sweepable + DONUT_GAP_DEG;
    const arc = {
      client,
      done,
      total,
      share: Math.round((done / DONE) * 100),
      d: sector(cursor + DONUT_GAP_DEG / 2, cursor + sweep - DONUT_GAP_DEG / 2),
    };
    cursor += sweep;
    return arc;
  });
})();

export function ProgressMock() {
  // null is the resting state, and the chart must be readable in it — this is a
  // marketing mock, so most people will never point at it and a few will only
  // ever see it in a screenshot.
  const [active, setActive] = useState<number | null>(null);
  const hot = active === null ? null : ARCS[active];

  return (
    <div
      aria-hidden
      className="flex h-full select-none flex-col items-center justify-center"
    >
      <div className="relative">
        <svg viewBox="0 0 100 100" className="size-[248px]">
          {ARCS.map(({ client, d }, i) => (
            <path
              key={client}
              d={d}
              className="cursor-pointer fill-[var(--mock-accent-bg)] stroke-[var(--mock-accent-bg)]"
              strokeWidth={DONUT_CORNER * 2}
              strokeLinejoin="round"
              strokeLinecap="round"
              // The rung and the dimming multiplied into one value — see RUNG.
              // An attribute rather than a class: the number is computed, and a
              // utility would have to exist for every product of the two.
              opacity={
                (RUNG[i] ?? 1) * (active !== null && active !== i ? DIMMED : 1)
              }
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
            />
          ))}
        </svg>

        {/* The resting reading, in the hole the ring leaves: how much of all the
            planned work is done. A donut with an empty middle on a card this
            size reads as a shape rather than as a chart.

            It fades while a tooltip is up so the two never state different
            numbers at once — the middle is the whole book, the tooltip is one
            client, and side by side they look like a contradiction.

            pointer-events-none throughout, so nothing in the middle can steal
            the hover from the band it is explaining. */}
        {hot ? null : (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[36px] leading-none text-[color:var(--mock-ink)]">
              {DONE}
            </span>
            <span className="mt-2 text-[10.5px] leading-none text-[color:var(--mock-ink-soft)]">
              of {PLANNED} done
            </span>
          </div>
        )}

        {/* The tooltip, in the reference's shape: a swatch and a label on the
            left, the figure on the right, on its own small card.

            ABOVE the ring rather than beside the cursor. A tooltip that tracks
            the pointer around a circle spends most of its time leaving the
            card — the widest name here is most of the chart's own width — and
            a mock cannot afford a label that clips. Fixed at the top it is
            always whole, always in the same place, and the dimmed ring already
            says which share it belongs to.

            MOUNTED ON HOVER, not faded in. A transition would be the nicer
            move, but these mocks get reviewed in a preview pane that runs with
            document.visibilityState === "hidden", where transitions never
            advance and the tooltip would sit at its starting opacity forever —
            invisible in the one place it gets looked at. Conditional rendering
            shows up everywhere. The centre figure swaps the same way and for
            the same reason, so the two are never both on screen stating
            different numbers.

            pointer-events-none so crossing it never ends the hover that raised
            it. */}
        {hot ? (
          <div className="pointer-events-none absolute -top-2 left-1/2 w-max -translate-x-1/2 -translate-y-full rounded-[6px] border bg-[var(--mock-window)] px-2.5 py-2 shadow-[0_4px_16px_-6px_rgba(16,24,40,0.28)] border-[var(--mock-line)]">
            <span className="flex items-center gap-2 whitespace-nowrap">
              <span
                className="size-[7px] shrink-0 rounded-full bg-[var(--mock-accent-bg)]"
                style={{ opacity: RUNG[active ?? 0] ?? 1 }}
              />
              <span className="text-[10px] leading-none text-[color:var(--mock-ink)]">
                {hot.client}
              </span>
              <span className="ml-2 text-[10px] leading-none text-[color:var(--mock-ink)]">
                {hot.done} of {hot.total}
              </span>
            </span>
            <span className="mt-1.5 block text-[9px] leading-none text-[color:var(--mock-ink-soft)]">
              {hot.share}% of milestones done
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
