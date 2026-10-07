// ─────────────────────────────────────────────────────────────────────────
// PROGRESS GANTT — the consultants card's artwork: engagements laid along a
// timeline, as a SNIPPET of the board rather than a picture of the screen.
//
// Its fourth form, and the first taken from the template itself. It was four
// bars per client, then a donut of each client's share of finished work, then a
// burn-up of one engagement against its plan. Each was a reasonable chart and
// none was what the product shows: the project tracker is a Gantt, and a
// marketing card for it should be recognisable to somebody who has used it.
//
// A SNIPPET, so it carries only what makes a Gantt legible — the week scale,
// the group it belongs to, the rules, and the bars. No sidebar, no month band,
// no toolbar. The other cards in this set are windows with chrome; this one is
// a detail lifted out of a screen, which is what lets it sit at a size where a
// whole Gantt would be unreadable.
//
// CUT OFF ON TWO EDGES, deliberately. The bars run past the right of the card
// and the stack runs past the bottom, because a Gantt's whole claim is that
// there is more of it than you are looking at — in both directions. A stack
// that ended inside the frame would be a bar chart lying on its side, and one
// that stopped halfway down the card would read as the picture having run out
// rather than the frame having.
// ─────────────────────────────────────────────────────────────────────────

// Start and width as percentages of the visible span, several running past 100.
// Staggered starts, descending: it is the shape the real board has — work
// picked up as it was sold — and it is what makes the stack read as a schedule
// rather than as a legend.
//
// NINE bars for a frame that shows about six. The last ones exist to be cut by
// the card's bottom edge; without them the stack ends in mid-air.
const BARS = [
  { name: "Warehouse Portal", initials: "NL", from: 4, width: 74 },
  { name: "SOC 2 Readiness", initials: "BF", from: 18, width: 70 },
  { name: "Content Localization", initials: "SM", from: 26, width: 62 },
  { name: "Clinical Data Migration", initials: "ML", from: 33, width: 72 },
  { name: "Series B Data Room", initials: "SR", from: 41, width: 58 },
  { name: "Catalog Launch", initials: "CC", from: 48, width: 66 },
  { name: "Developer Docs", initials: "TS", from: 55, width: 54 },
  { name: "Retirement Plan", initials: "PR", from: 61, width: 60 },
  { name: "Media Buying", initials: "AB", from: 68, width: 48 },
];

// FOUR HUES, from the template's own palette.
//
// This was two rungs of Haze first, on the argument that nine saturated blocks
// in one stack would make the card read as a palette and that staying on brand
// kept it ours. Both true, and both beside the point: on a Gantt the colour is
// how you follow a row across a timeline, so it is carrying information rather
// than decorating — and the product already answers this question. A mock that
// recolours the screen it is advertising is a worse likeness, however tidy.
//
// They are tokens, not hexes here, because they need a different value per
// theme — see --mock-gantt-1 in globals.css. Cycled, so no two neighbours
// share a colour.
const BAR_TONE = [
  "bg-[var(--mock-gantt-1)]",
  "bg-[var(--mock-gantt-2)]",
  "bg-[var(--mock-gantt-3)]",
  "bg-[var(--mock-gantt-4)]",
];

// The week scale. Rules at the column edges, dates in the middle of the columns
// they name — which is where a Gantt puts them, and why the dates are offset
// from the rules by half a column rather than sitting on them.
const RULES = [0, 20, 40, 60, 80, 100];
const WEEKS = ["Jul 7", "Jul 14", "Jul 21", "Jul 28", "Aug 4"];

export function ProgressMock() {
  return (
    <div aria-hidden className="h-full select-none overflow-hidden">
      {/* The timeline is WIDER THAN THE CARD — w-full with a 420px floor, the
          same trade the onboarding board makes. A Gantt squeezed into the
          card's ~300px either truncates every project name or shrinks the type
          below the set's scale, and both are worse than running off the edge:
          the bars are supposed to continue past the frame, so letting them
          actually do it costs nothing and buys the names their full width.
          
          560 rather than 420, which was only half an answer — at 420 the bars
          reached the card's edge and stopped there, so the timeline looked
          trimmed to fit rather than carrying on. The floor has to clear the
          frame by enough that the longest bar is plainly mid-stride when the
          card ends. */}
      <div className="flex h-full w-full min-w-[560px] flex-col">
        {/* The scale. Dates at 10/30/50/70/90 — the centre of each column the
          rules cut, so every label names the span under it rather than the line
          beside it. A relative strip rather than a flex row, because the labels
          have to agree with the rules below them to the pixel, and flex would
          space them by their own widths instead. */}
        <div className="relative h-[14px] shrink-0">
          {WEEKS.map((w, i) => (
            <span
              key={w}
              className="absolute top-0 -translate-x-1/2 whitespace-nowrap text-[9.5px] leading-none text-[color:var(--mock-ink-soft)]"
              style={{ left: `${10 + i * 20}%` }}
            >
              {w}
            </span>
          ))}
        </div>

        {/* The group. One word, and the only thing on the card set in ink rather
          than the soft tone — a Gantt is read as bands of work under a heading,
          and without it the bars are a drawing instead of a list of something. */}
        <div
          className={`mt-1.5 shrink-0 border-t pt-2 text-[10.5px] leading-none text-[color:var(--mock-ink)] ${"border-[var(--mock-line)]"}`}
        >
          Active
        </div>

        {/* The bars, and the rules behind them. flex-1 with min-h-0 so this takes
          whatever height the card has left and clips there — which is what puts
          the bottom crop on the card's edge rather than at a height guessed
          here. */}
        <div className="relative mt-2 min-h-0 flex-1 overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            {RULES.map((g) => (
              <span
                key={g}
                className="absolute inset-y-0 w-px bg-[var(--mock-ink)]/[0.08]"
                style={{ left: `${g}%` }}
              />
            ))}
          </div>

          <div className="relative flex flex-col gap-[9px]">
            {BARS.map(({ name, initials, from, width }, i) => (
              <span
                key={name}
                className={`flex h-[30px] shrink-0 items-center gap-2 rounded-[8px] pl-1.5 pr-3 ${
                  BAR_TONE[i % BAR_TONE.length]
                }`}
                // Percentages, so the stack keeps its shape at any card width — a
                // Gantt drawn in pixels would re-time itself on every breakpoint.
                // marginLeft rather than absolute positioning, so the rows still
                // stack themselves and the gap stays a gap.
                style={{ marginLeft: `${from}%`, width: `${width}%` }}
              >
                {/* The owner's initials, as the template puts them: on the bar
                  itself rather than in a column beside it, which is what keeps
                  the timeline the full width of the card. White disc, because it
                  has to read on both tones. */}
                <span className="flex size-[21px] shrink-0 items-center justify-center rounded-full bg-white text-[8px] leading-none text-[color:#101114]">
                  {initials}
                </span>
                <span className="truncate text-[10.5px] leading-none text-white">
                  {name}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
