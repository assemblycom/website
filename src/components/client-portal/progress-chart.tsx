// ─────────────────────────────────────────────────────────────────────────
// PROGRESS CHART — the consultants card's artwork: one engagement's
// milestones burning up against the pace they were planned at.
//
// It has been three things. Four bars, one per client, which needed the names
// inside the tracks because the shortest bar could not hold "Northwind Group".
// Then a donut of each client's share of the finished work, which answered
// "whose" but not "when" — and "when" is the question a progress dashboard is
// asked. A burn-up answers both axes at once: how much is done, and whether it
// is arriving fast enough, which is the only reading that can be WRONG and
// therefore the only one worth putting on a dashboard.
//
// No longer a client component. The donut carried a hover tooltip; a line
// chart's equivalent would be a point readout, which at this size is a label
// per week on a mock nobody studies. The variance is stated in the footer
// instead, once, in words.
// ─────────────────────────────────────────────────────────────────────────

// Milestones closed at the end of each weekday, over the engagement's month.
//
// It flattens in the middle and climbs again, because a plan that advances by
// the same amount every day is the one shape real work never has — and a mock
// of a progress chart that cannot show a stall is a picture of a straight line.
//
// It also runs BELOW the plan, and that is the whole chart. The first version
// ended at 16 against a plan of 15.6 for the same day — fractionally ahead —
// while the footer read "8 milestones behind", which was the count still open
// mistaken for a variance. A chart whose shape contradicts its own caption is
// worse than no chart: the reader believes the words, looks at the picture, and
// stops believing both. These numbers are five short of the plan on the day,
// which is what the footer now says.
const DONE = [0, 1, 2, 3, 4, 6, 6, 6, 7, 8, 9, 10, 10, 11];

// Where the plan said it would be. Ends at the full scope, which is what makes
// the gap at the right-hand edge mean something.
const PLANNED = 24;
const DAYS = 21;

const TODAY = DONE.length - 1;

// ── Geometry ─────────────────────────────────────────────────────────────
// A 0-100 box in both directions, flipped on y so 0 is the floor. The chart is
// drawn with preserveAspectRatio="none" so it stretches to whatever the card
// gives it — a fixed aspect would letterbox inside a flexible card, and the
// only things that must not stretch are the strokes, which vector-effect keeps
// at a constant width.
const x = (day: number) => (day / (DAYS - 1)) * 100;
const y = (n: number) => 100 - (n / PLANNED) * 100;

const line = (points: [number, number][]) =>
  points
    .map(
      ([d, n], i) => `${i ? "L" : "M"} ${x(d).toFixed(2)} ${y(n).toFixed(2)}`,
    )
    .join(" ");

const ACTUAL = line(DONE.map((n, d) => [d, n] as [number, number]));
const IDEAL = line([
  [0, 0],
  [DAYS - 1, PLANNED],
]);

// GRIDLINES, not bands. The weekends were solid low-opacity blocks — three grey
// slabs standing behind a thin line, which is the wrong weight ratio for a
// chart: the furniture was heavier than the data. A burn-up is normally drawn
// as a filled line over hairline rules, and that is what this is now. The weeks
// still divide the month; they just do it with a rule instead of a wall.
const GRID = [5, 10, 15, 20].map(x);

// The area under the line — the other half of the usual treatment. Same colour
// as the stroke, fading out before it reaches the floor, so the line reads as
// the top of a quantity rather than as a wire, and the chart stops looking like
// two strokes on an empty box.
const AREA = `${ACTUAL} L ${x(TODAY).toFixed(2)} 100 L 0 100 Z`;

export function ProgressMock() {
  return (
    <div
      aria-hidden
      className="flex h-full select-none flex-col justify-center"
    >
      {/* No title row. It read "Meridian Corp" with a Current pill beside it —
          an engagement name and its state, directly under the card's own
          heading, which made the card open on two headers in forty pixels. The
          card says what this is; the chart only has to show it. */}
      <div className="relative min-h-[132px] flex-1">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="size-full overflow-visible"
        >
          {/* No ceiling rule. A hairline ran the full width at the top, marking
              full scope, so the gap between it and where the solid line stops
              would read as the work left. It was the topmost and widest mark on
              a small chart, which made the card look framed rather than drawn —
              and the dashed plan already arrives at that height on the right, so
              the ceiling was being stated twice and the second time louder. */}
          <defs>
            {/* 0.28 at the line and gone by the floor. Stronger and the fill
                competes with the stroke that bounds it; weaker and it is a
                smudge. */}
            <linearGradient id="burnup-fill" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="var(--mock-accent-bg)"
                stopOpacity="0.28"
              />
              <stop
                offset="100%"
                stopColor="var(--mock-accent-bg)"
                stopOpacity="0"
              />
            </linearGradient>
          </defs>

          {GRID.map((gx) => (
            <line
              key={gx}
              x1={gx}
              y1="0"
              x2={gx}
              y2="100"
              className="stroke-[var(--mock-ink)]/[0.08]"
              vectorEffect="non-scaling-stroke"
              strokeWidth={1}
            />
          ))}

          <path d={AREA} fill="url(#burnup-fill)" stroke="none" />

          {/* Today. Everything right of it is forecast, which is why the solid
              line stops here and only the dashed one carries on.
          
              Drawn at the SAME weight as the gridlines. It was ink/20 against
              their 0.08 — two and a half times heavier, which made it the
              darkest mark on a chart whose darkest mark should be the data. It
              does not need the weight: the line ends on it, and a dot sits
              where they meet. Where "now" is, is already stated by the thing
              that stops there. */}
          <line
            x1={x(TODAY)}
            y1="0"
            x2={x(TODAY)}
            y2="100"
            className="stroke-[var(--mock-ink)]/[0.08]"
            vectorEffect="non-scaling-stroke"
            strokeWidth={1}
          />

          {/* The plan, dashed, running the whole month to full scope. */}
          <path
            d={IDEAL}
            fill="none"
            className="stroke-[var(--mock-ink)]/35"
            strokeDasharray="3 3"
            strokeWidth={1.25}
            vectorEffect="non-scaling-stroke"
          />

          {/* What actually closed. Haze, the brand blue, and the only saturated
              mark on the card — it is the series the whole chart is about. */}
          <path
            d={ACTUAL}
            fill="none"
            className="stroke-[var(--mock-accent-bg)]"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* The head of the line, as an HTML dot laid over the chart rather than
            a <circle> inside it. preserveAspectRatio="none" stretches the
            viewBox unevenly to fill the card, which is right for the lines and
            fatal for a circle — it would arrive as an ellipse, and a different
            ellipse at every card width. Positioned in the same percentages the
            path is drawn from, so it tracks the data rather than being placed
            by eye. */}
        <span
          className="pointer-events-none absolute size-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--mock-accent-bg)] ring-[2.5px] ring-[var(--mock-window)]"
          style={{ left: `${x(TODAY)}%`, top: `${y(DONE[TODAY] ?? 0)}%` }}
        />
      </div>

      <div className="mt-2 flex items-center justify-between text-[10px] leading-none text-[color:var(--mock-ink-soft)]">
        <span>Aug 15</span>
        <span>Sep 15</span>
      </div>
    </div>
  );
}
