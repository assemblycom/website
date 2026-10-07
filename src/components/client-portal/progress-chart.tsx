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

// The site's stat chip, with two deliberate departures from the version on the
// customers strip and the case-study pages.
//
// PP MORI, not the mono face. The mono is right where a chip sits in a wall of
// body copy and needs to read as data; here the chip is the only type under a
// chart, with nothing to distinguish itself from, and the mono just made it
// look like a different component had wandered in.
//
// AND A BORDER. bg-muted is #f6f7f9 against a card that is near-white, so the
// chip was a word floating on a shape nobody could see — it needs an edge to be
// a chip at all. The hairline is the same --border every other box on the page
// draws itself with, so the shape arrives from the palette rather than being
// invented to solve this.
const STAT =
  "inline-flex items-center gap-1.5 rounded-md border border-border bg-muted px-2.5 py-1.5 text-[11px] uppercase tracking-wide [[data-theme=dark]_&]:bg-white/[0.08]";

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

// Weekends, as the bands the reference hatches. Day 0 is a Monday, so every
// fifth and sixth day is the pair — drawn as plain low-opacity blocks rather
// than a hatch: at this size a diagonal pattern turns to mush, and the band is
// only there to explain why the line goes flat.
const WEEKENDS = [5, 12, 19].map((d) => ({
  from: x(d),
  to: x(Math.min(d + 2, DAYS - 1)),
}));

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
          {WEEKENDS.map(({ from, to }) => (
            <rect
              key={from}
              x={from}
              y={0}
              width={to - from}
              height={100}
              className="fill-[var(--mock-ink)]/[0.045]"
            />
          ))}

          {/* Today. Everything right of it is forecast, which is why the solid
              lines stop here and only the dashed one carries on. */}
          <line
            x1={x(TODAY)}
            y1="0"
            x2={x(TODAY)}
            y2="100"
            className="stroke-[var(--mock-ink)]/20"
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

      {/* Two readings as STAT CHIPS — the site's own, not a pair invented
          here: mono, uppercase, rounded-md on bg-muted, the figure in
          foreground and its label in muted-foreground. The same shape the
          case-study pages and the customers strip already use, which is what
          CLAUDE.md asks for and what stops this card inventing a third way of
          drawing a number.

          The icons went with the change. A warning glyph and a calendar sat in
          front of these as plain text; inside a chip they would be a mark
          competing with the figure for the left edge, and the chip's own shape
          is what sets a stat apart from a sentence.

          Order matters: the one that is wrong, then how long there is to fix
          it. */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className={STAT}>
          <span className="text-foreground">5</span>
          <span className="text-muted-foreground">behind pace</span>
        </span>
        <span className={STAT}>
          <span className="text-foreground">13</span>
          <span className="text-muted-foreground">weekdays left</span>
        </span>
      </div>
    </div>
  );
}
