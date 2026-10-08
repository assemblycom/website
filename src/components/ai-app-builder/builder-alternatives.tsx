"use client";

import { useState } from "react";
import Link from "next/link";
import { GRID_LINE } from "@/components/ui/grid-lines";

// `tab` is the name at switcher width. The full names are written for a column
// head that has the table's width under it; as tabs, three of them at full
// length scroll off a 375px phone — and the one that scrolls off is ours, at
// the right-hand end. Short enough that all three sit on the screen at once,
// which is the whole reason to prefer a switcher to a list. They can afford to
// be terse because the full name is printed under them.
const COLUMNS: { name: string; tab: string }[] = [
  { name: "Build in-house", tab: "In-house" },
  { name: "Standalone AI app builders", tab: "Standalone" },
  { name: "Assembly's AI app builder", tab: "Assembly" },
];

/** Index of the Assembly column, which carries the wash. */
const OWN = 2;

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
  // Which option the phone switcher is showing. Opens on the first, so the
  // three read in the order the heading sets them up in — the two routes you
  // might have taken, then ours.
  const [option, setOption] = useState(0);

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
      <div className={`mt-10 overflow-clip rounded-2xl border px-6 pb-2 md:hidden ${GRID_LINE}`}>
        {/* The tabs run full-bleed to the card's edges (-mx-6 against the
            card's px-6) so the underline that marks the active option is a rule
            across the card, the way it is on the pricing table. */}
        {/* overflow-y-hidden: overflow-x-auto alone also makes this a vertical
            scroll container, and the -mb-px underline trick lets it scroll up
            by a pixel-high strip. */}
        <div className="-mx-6 flex gap-6 overflow-x-auto overflow-y-hidden border-b px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {COLUMNS.map((column, ci) => (
            <button
              key={column.name}
              type="button"
              aria-pressed={option === ci}
              onClick={() => setOption(ci)}
              className={`-mb-px shrink-0 border-b pb-3 pt-5 text-base font-medium transition-colors ${
                option === ci
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground"
              }`}
            >
              {column.tab}
            </button>
          ))}
        </div>

        {/* The full name under the tabs: the tab is short enough to fit three
            of them, so the option still gets said once in the words the table
            uses. */}
        <p className="pb-1 pt-6 text-sm font-medium text-foreground">
          {COLUMNS[option].name}
        </p>

        <dl>
          {ROWS.map((row) => (
            <div
              key={row.label}
              className={`-mx-6 flex items-baseline justify-between gap-4 border-t px-6 py-3.5 ${GRID_LINE}`}
            >
              <dt className="pr-4 text-sm text-muted-foreground">
                {row.label}
              </dt>
              {/* Ranged right, so the five answers line up on one edge and the
                  option can be read down a single column. */}
              <dd
                className={`shrink-0 text-right text-sm leading-snug ${
                  option === OWN ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {row.cells[option]}
              </dd>
            </div>
          ))}
        </dl>
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
