"use client";

import { useState } from "react";
import Link from "next/link";
import { GRID_LINE } from "@/components/ui/grid-lines";
import { SegmentedTabs } from "@/components/ui/segmented-tabs";

// `tab` is the name at switcher width. The full names are written for a column
// head that has the table's width under it; as tabs, three of them at full
// length scroll off a 375px phone — and the one that scrolls off is ours, at
// the right-hand end. Short enough that all three sit on the screen at once,
// which is the whole reason to prefer a switcher to a list.
//
// The tab is the ONLY place the option is named on a phone. It carried the
// full name again on a line under the control, which said "Standalone" and
// then "Standalone AI app builders" one row apart — the switcher already
// names what you are looking at, and a caption repeating it is the thing the
// switcher replaced the card stack to avoid. `name` is still what the table
// heads its columns with from `md` up, where there is width for it.
const COLUMNS: { name: string; tab: string }[] = [
  { name: "Build in-house", tab: "In-house" },
  { name: "Standalone AI app builders", tab: "Standalone" },
  { name: "Assembly's AI app builder", tab: "Assembly" },
];

/** Index of the Assembly column, which carries the wash. */
const OWN = 2;

/**
 * The order the PHONE switcher lists the options in — ours first.
 *
 * The table from `md` up runs In-house → Standalone → Assembly, left to right,
 * because it shows all three at once and that order is the argument: here are
 * the two routes you might have taken, and here is the one that is ready. A
 * switcher shows one option at a time, so it has no left-to-right to argue
 * with; what it has is a first tab, which is both the one that opens and the
 * one a reader scanning the control sees first. Spending that on the route we
 * are arguing against put our answer at the far end of a row some phones have
 * to scroll.
 *
 * Indices into COLUMNS and ROWS[].cells, so the data stays in table order and
 * only the phone's reading order changes.
 */
const PHONE_ORDER = [OWN, 0, 1];

/** Prefix for the phone switcher's tab/panel id pair. */
const TABS_ID = "builder-alternatives";

/**
 * One named competitor, then the index — not two named peers. Pairing a named
 * route with "all of them" is a real hierarchy, so the pair can carry the
 * site's primary/secondary treatment honestly: filling one of two named peers
 * would have said Lovable is the comparison that matters and Base44 is the
 * afterthought.
 */
const COMPARISONS = [
  { label: "Assembly vs. Lovable", href: "/comparison/lovable", lead: true },
  { label: "All comparisons", href: "/comparison", lead: false },
] as const;

// Cells are cut to roughly one line at the table's column width — a comparison
// is scanned across, not read down, and a three-line answer stops the scan.
const ROWS: { label: string; cells: [string, string, string] }[] = [
  {
    label: "Time to a working tool",
    cells: ["Months", "Minutes to a prototype", "Minutes to a working app"],
  },
  {
    label: "Ready on day one?",
    cells: ["After a full build and QA", "No", "Yes"],
  },
  {
    label: "Logins and permissions",
    cells: ["You own the security", "You set them up", "Built in"],
  },
  {
    label: "Client data",
    cells: ["You build the database", "Empty for every app", "One shared CRM"],
  },
  {
    label: "Maintenance",
    cells: [
      "A developer on call",
      "Yours, after every change",
      "Handled by Assembly",
    ],
  },
];

// The table sits inside the section's own padding rather than being pulled out
// to the rails. Bled, its banded last column ran to the very edge of the page
// on both sides, which read as a table that had escaped the layout instead of
// one sitting in it — and it was the only block on the page doing that. The
// outer cells keep a little extra inset so their text clears the frame.
const BLEED = "";
const EDGE_L = "md:pl-2 lg:pl-3";
const EDGE_R = "md:pr-2 lg:pr-3";

/**
 * The two options a buyer who already wants an app actually weighs, plus ours.
 *
 * Same construction as the competitor comparison pages: a real table above md,
 * the same rows stacked below it, and the Assembly column carrying the `--muted`
 * wash that marks our side everywhere else on the site. Three columns rather
 * than two, so it gets its own component instead of reusing that matrix.
 *
 * Every column is divided by a hairline, so the table is ruled both ways and
 * our column is bounded like the rest rather than marked only by its wash —
 * `--muted` against white was on its own too soft an edge to say where it
 * starts. The capability column takes no rule: it opens on the page's left
 * rail, which is already a line.
 *
 * The table is framed and rounded, and the wash runs to that frame rather than
 * being a rounded card of its own floating inside it — the fill still reaches
 * the edge on every side, it is the frame that turns the corner. The foot stays
 * closed: the page ends this section on the table's own edge rather than a
 * `GridDivider`, and that edge is now the frame's bottom instead of the last
 * row's rule.
 */
export function BuilderAlternatives() {
  // Which option the phone switcher is showing, as an index into COLUMNS.
  // Opens on the first tab in PHONE_ORDER, which is ours.
  const [option, setOption] = useState(PHONE_ORDER[0]);

  return (
    <section className="mx-auto max-w-[1200px] px-6 py-14 md:px-10 md:py-20">
      {/* Same split the page's hero runs: the claim and its actions hold the
          left column, the detail is set against them on the right. Stacked
          below lg, the lede reads straight after the heading and the links
          close the block. The links share the left column rather than sitting
          alone under a one-line heading, which would leave the gutter empty. */}
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-x-16">
        <h3 className="type-h3 text-balance">
          Three ways to get a custom app. One is ready to use
        </h3>
        <p className="max-w-[34rem] text-pretty text-muted-foreground lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:pt-1">
          All three produce an app. Only one is ready for your clients and your
          team on day one.
        </p>

        {/* Sits with the copy that sets the comparison up, not after the table:
            the side route belongs to the argument, not to the last row. */}
        <div className="flex flex-wrap gap-2">
          {COMPARISONS.map((comparison) => (
            <Link
              key={comparison.href}
              href={comparison.href}
              // Primary/secondary fills, but at the side-route chip size the
              // templates section below uses (34px, not the hero's 42px). These
              // route sideways out of the argument; at full CTA size they
              // carried more weight than the hero's own buttons and sat taller
              // than the identical chip one section down.
              className={`inline-block rounded-lg px-4 py-1.5 text-center text-sm ${
                comparison.lead
                  ? "bg-foreground text-background transition-opacity hover:opacity-90"
                  : "border border-foreground/20 bg-transparent text-foreground transition-colors hover:bg-foreground/5 [[data-theme=dark]_&]:border-white/25"
              }`}
            >
              {comparison.label}
            </Link>
          ))}
        </div>
      </div>

      {/* A SWITCHER BELOW md, not three cards and not the table transposed.

          Two layouts were tried here first. Transposed — one box per
          capability, each holding all three answers — named the three options
          five times over, and the long labels ("Standalone AI app builders")
          against the short answers ("No") made the repetition most of what you
          saw. Grouped the other way, one card per option, fixed the repetition
          but left five screens of card to scroll past, and the two routes you
          are not buying take up two thirds of it.

          The switcher is the pricing page's "Compare plans" control, reused
          exactly: scrollable underline tabs over a single-column list of
          label-and-answer rows. One option is on screen at a time, so the
          section is one screen tall instead of five, and the comparison is
          made by tapping across rather than by scrolling. Reusing it also
          means the two comparison tables on the site behave the same way on a
          phone, which is the point of having a pattern at all.

          The table from `md` up is untouched; it can afford the across-read
          and is still the better object when the width exists. */}
      <div className="md:hidden">
        {/* The site's segmented control, not a row of underlined words.

            It started as the pricing table's underline tabs, which are the
            right pattern THERE — that control sits inside a long scrolling
            table and has five plan names to carry, so it has to be able to
            scroll. Here there are three short options above a five-row card,
            and underlined text at the top of a bordered box reads as a
            heading that happens to be in three parts rather than as something
            you can press.

            SegmentedTabs is the answer to both: a bordered track with a thumb
            that glides between cells is unmistakably a control, and it is the
            SAME control this page already runs one section up for Describe /
            Plan / Build. Two segmented controls on one page is the page
            having a pattern; a segmented control and a set of underline tabs
            doing the same job is the page having two.

            It also brings the semantics with it — `role="tablist"`, roving
            arrow-key focus, and the tab/panel id pair the panel below points
            back at — which the hand-rolled `aria-pressed` buttons did not
            have. */}
        <div className="mt-10">
          <SegmentedTabs
            label="Compare the three ways to get a custom app"
            idBase={TABS_ID}
            value={String(option)}
            onChange={(v) => setOption(Number(v))}
            options={PHONE_ORDER.map((ci) => ({
              value: String(ci),
              label: COLUMNS[ci].tab,
            }))}
          />
        </div>

        <div
          role="tabpanel"
          id={`${TABS_ID}-panel-${option}`}
          aria-labelledby={`${TABS_ID}-tab-${option}`}
          className={`mt-5 overflow-clip rounded-2xl border px-6 ${GRID_LINE}`}
        >
          <dl>
            {ROWS.map((row) => (
              <div
                key={row.label}
                // first:border-t-0 — the card's own top edge is the rule above
                // the first row now that the tabs have moved out of the box.
                className={`-mx-6 flex items-baseline justify-between gap-4 border-t px-6 py-3.5 first:border-t-0 ${GRID_LINE}`}
              >
                {/* ONE LINE, ALWAYS. The capability is the row's question and
                    it is the same question on every option — a two-line "Time
                    to a working / tool" against a one-line answer made the row
                    look broken rather than long. The answers take the wrapping
                    instead: they are the part that differs, they are ranged
                    right, and a two-line answer there reads as an answer that
                    needed two lines. */}
                <dt className="shrink-0 whitespace-nowrap pr-4 text-sm text-muted-foreground">
                  {row.label}
                </dt>
                {/* Ranged right, so the five answers line up on one edge and
                    the option can be read down a single column. */}
                <dd
                  className={`min-w-0 text-right text-sm leading-snug ${
                    option === OWN ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {row.cells[option]}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* The frame, all four sides, rounded and clipping the cells inside it.
          The cells draw the rules BETWEEN columns and rows; the frame draws
          the outside.

          A radius was tried here once before and taken out again, because the
          header row kept its own top rule and the last row its own bottom one
          while the frame curved away from them — the rule ran straight into
          the corner and read as broken. The fix is not to go square, it is to
          stop drawing those two rules twice: the frame IS the table's top and
          bottom now, so the head only rules below itself and the last row
          rules not at all. Nothing straight meets the curve. */}
      <div
        className={`mt-12 hidden overflow-hidden rounded-2xl border md:block ${GRID_LINE} ${BLEED}`}
      >
        <table className="w-full table-fixed border-collapse text-left">
          <caption className="sr-only">
            Building in-house, a standalone AI app builder, and Assembly
            compared
          </caption>
          <colgroup>
            <col className="w-[28%]" />
            <col className="w-[24%]" />
            <col className="w-[24%]" />
            <col className="w-[24%]" />
          </colgroup>
          <thead>
            {/* Ruled underneath only — the frame above it is the table's top
                edge, and a second rule there would be the one that collides
                with the rounded corner. The row carries a half-strength
                `--muted` — the same token the Assembly column uses, at 50%, so
                the head reads as a band without inventing a tint and the own
                column still steps up from it at full strength in both
                themes. */}
            <tr className={`border-b ${GRID_LINE}`}>
              {/* The band is on the three named columns, not the row. The
                  first cell heads nothing — it sits above the capability
                  labels — so tinting it made the band look like it started in
                  the wrong place, a quarter of the table wide before the first
                  word of it. */}
              <th scope="col" className={`pb-5 pr-8 ${EDGE_L}`}>
                <span className="sr-only">Capability</span>
              </th>
              {COLUMNS.map((column, i) => (
                <th
                  key={column.name}
                  scope="col"
                  className={`border-l px-6 pb-5 pt-5 text-sm font-normal ${GRID_LINE} ${
                    i === OWN
                      ? `bg-muted text-foreground ${EDGE_R}`
                      : "bg-muted/50 text-muted-foreground"
                  }`}
                >
                  {column.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.label} className={`border-b last:border-b-0 ${GRID_LINE}`}>
                <th
                  scope="row"
                  className={`py-6 pr-8 align-top font-normal ${EDGE_L}`}
                >
                  <span className="block text-sm">{row.label}</span>
                </th>
                {row.cells.map((cell, i) => (
                  <td
                    key={COLUMNS[i].name}
                    className={`border-l px-6 py-6 align-top ${GRID_LINE} ${
                      // The answer cells are a LIGHTER wash than the header
                      // above them: the column still reads as one block, but
                      // the title is what carries the tone and the answers sit
                      // back from it rather than matching it rung for rung.
                      // Half-strength --muted, which is the same value the two
                      // alternative columns' own headers use, so this is a tone
                      // the table already has rather than a fourth grey.
                      //
                      // Dark is untouched and deliberately so: there the cells
                      // step UP to --surface-2, because --muted is a quiet wash
                      // on white but on the near-black ground it barely
                      // separated from the two alternatives beside it. Lighten
                      // the light value, leave the dark one alone.
                      i === OWN
                        ? `bg-muted/50 ${EDGE_R} [[data-theme=dark]_&]:bg-[var(--surface-2)]`
                        : ""
                    }`}
                  >
                    {/* Our column in full-strength text. Set in the same
                        muted grey as the two alternatives, the answer
                        carried no more weight than what it is answering. */}
                    <p
                      className={`text-sm leading-relaxed ${
                        i === OWN ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {cell}
                    </p>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
