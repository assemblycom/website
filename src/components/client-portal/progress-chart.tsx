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

// The week scale: rules at the column edges. The dated strip above them is
// gone — at this size the labels were the one piece of the snippet that had to
// be read rather than recognised, and the card is a likeness, not a schedule
// anybody reads a date off.
const RULES = [0, 20, 40, 60, 80, 100];

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
        {/* The group, as a TAG rather than a heading with a rule under it.
          Same type as before — sentence case, the set's scale, no mono and no
          caps — on a slightly darker ground with rounded corners, so it reads
          as the label on a band of work the way the board labels one. Inline,
          so the chip is the width of the word; the full-width heading plus
          hairline it replaces was a second horizontal line competing with the
          timeline's own. */}
        <div className="shrink-0">
          <span className="inline-block rounded-md bg-[var(--mock-ink)]/[0.08] px-2 py-1 text-[10.5px] leading-none text-[color:var(--mock-ink)]">
            Active
          </span>
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
                // Dashed, and fainter than the solid hairline it replaces.
                // A continuous rule behind a row of coloured bands read as
                // part of the chart; a dash is plainly a guide and sits
                // behind them. Drawn as a repeating gradient on the same 1px
                // span rather than as a border, because border-dashed has no
                // control over dash length.
                //
                // The colour stays --mock-ink, so it still flips with the
                // theme; only the alpha moved, and it moved on the element
                // rather than in the gradient so there is one number to tune.
                //
                // THE ALPHA IS IN THE GRADIENT, not on the element. Dimming
                // the whole span with `opacity` looked equivalent and was not:
                // a 1px line of short dashes is already being antialiased, and
                // a second multiply on top of that took what was left below
                // what a screen renders. Two passes at 0.055 and 0.13 both
                // came out invisible for this reason.
                //
                // 26% against the 8% of the solid rule it replaces. A dash
                // shows less of itself, and each dash has to survive the
                // antialiasing of a 1px column on a fractional-scaled display,
                // so matching the old number would have matched it only on
                // paper.
                //
                // IT HAS TO BE A repeating-linear-gradient. A plain
                // linear-gradient does not tile: the stops describe the whole
                // element once, so `transparent 2px 5px` holds transparent for
                // the rest of the span's height. That drew ONE 2px dash at the
                // very top of each rule and nothing below it, which is why the
                // rules read as missing however far the alpha was pushed — the
                // alpha was never the problem.
                //
                // THE PERIOD IS 5px, AND THAT IS THE LOAD-BEARING NUMBER. The
                // rules are drawn BEHIND the bars, so the only parts of them
                // anyone sees are the gaps between rows. At an 8px period a
                // gap that size could fall entirely in the transparent half
                // and show nothing at all, which is what made these look
                // missing rather than faint. Keep the period under the row
                // gap and every gap catches a dash.
                className="absolute inset-y-0 w-px bg-[repeating-linear-gradient(to_bottom,color-mix(in_srgb,var(--mock-ink)_26%,transparent)_0_2px,transparent_2px_5px)]"
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
                {/* OPTICALLY centred, not box-centred.
                  
                    Flex centring lines up the text's BOX, and with leading-none
                    that box puts the baseline on the disc's centre line — so
                    two capitals, which have no descender to balance them, sit
                    entirely in the top half. Measured here: the ink sat 2.8px
                    high in a 21px disc, which at this size is the difference
                    between an avatar and a mistake.
                  
                    Half the cap height back down, in em so it holds if the
                    type does. CSS cannot yet trim a line box to its caps
                    anywhere it matters (text-box-trim is Chrome-only), so the
                    nudge is the fix. */}
                <span className="flex size-[21px] shrink-0 items-center justify-center rounded-full bg-white text-[8px] leading-none text-[color:#101114]">
                  {/* The nudge is on the TEXT, not on the disc. On the disc it
                    moved the white circle down the bar along with its letters,
                    which is the same misalignment one level up. */}
                  <span className="block translate-y-[0.1em]">{initials}</span>
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
