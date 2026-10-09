"use client";

import { useState } from "react";
import Link from "next/link";
import { GRID_LINE } from "@/components/ui/grid-lines";
import { SegmentedTabs } from "@/components/ui/segmented-tabs";
import {
  BUILDER_RAIL_HALO,
  BUILDER_RAIL_HALO_WIDE,
} from "./builder-grid-rails";

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
//
// The named row is held back until /comparison/lovable exists — it is built on
// the product-and-comparison branch, and linking it from here first would ship
// a 404. Restore it with that page.
const COMPARISONS = [
  { label: "All comparisons", href: "/comparison", lead: true },
] as const;

// Cells are cut to roughly one line at the table's column width — a comparison
// is scanned across, not read down, and a three-line answer stops the scan.
const ROWS: {
  label: string;
  /**
   * The label the PHONE list uses, when the full one leaves the answer beside
   * it too little room to stay on one line.
   *
   * The phone row is `label — answer` on a single 325px line, and the label is
   * `whitespace-nowrap` (see the `dt`), so it takes what it needs and the
   * answer wraps into what is left. Shortening the label is therefore the way
   * to buy the answer a line — and it is the right half to cut, because the
   * label is the same question on all three tabs while the answers are the
   * whole point of the row.
   */
  shortLabel?: string;
  cells: [string, string, string];
}[] = [
  {
    label: "Time to a working tool",
    // "Minutes to a working app" needs 163px and the full label left it 149,
    // so our answer — the one the row exists to make — was the only one
    // wrapping to two lines. The short label leaves 204, which fits all three.
    //
    // "working" is what goes, and it is the one word here that can: the
    // answers carry the distinction themselves ("a prototype" against "a
    // working app"), so the row still reads prototype-versus-working without
    // the label saying it first.
    shortLabel: "Time to a tool",
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
      {/* THE HEADER TAKES THE PAGE GROUND AND THE WIDE HALO.
          Everything else in this region is an opaque card or table, so the
          rails pass behind it and are interrupted. This block is heading,
          lede and one chip — mostly open page — so six rails ran at full
          strength straight through the title and the sentence beside it,
          which is the one place on the page they land ON type rather than
          around it.

          The wide halo and not the card one: this is the full 1200px measure,
          like the FAQ, and a short fade along an edge that long still reads as
          a boundary. See BUILDER_RAIL_HALO_WIDE in builder-grid-rails. */}
      <div
        className={`relative grid gap-6 bg-background ${BUILDER_RAIL_HALO_WIDE} lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-x-16`}
      >
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
      {/* ONE OBJECT, control and all.

          The control used to float above the card with a gap, which read as a
          filter sitting next to a table rather than as the table's own head —
          two things, when what is on screen is one. Inside the card the
          switcher is the thead: the rule under it is the same hairline that
          separates every row below, so the card reads top to bottom as one
          table whose first row happens to be the control that chooses the
          column.

          UNDERLINE TABS, not the filled segmented track.

          This ran SegmentedTabs' default skin, on the argument that underlined
          text at the head of a bordered box reads as a heading in three parts
          rather than as something pressable. The track did fix that, and
          overshot: a solid black thumb at the top of a five-row card is the
          heaviest object in it by some way, so the first thing the eye lands
          on is the control, and the rows it is there to switch — which are the
          actual comparison — come second. A control at the head of a table is
          furniture, and furniture should not win.

          The underline carries the same three words with a rule under the live
          one. It reads as a head because that is what it is, and the rule lands
          on the card's own first hairline (`-mb-px` in the variant), so the
          control and the table's first rule are one line. It is also the
          pattern the feature-comparison table already uses for exactly this
          job, which is the reason it is a variant on the shared control rather
          than a third set of buttons: the tablist semantics, the roving
          arrow-key focus and the tab/panel id pair the rows below point back
          at are the same ones either skin brings.

          The table from `md` up is untouched; it can afford the across-read
          and is still the better object when the width exists. */}
      <div
        className={`mt-10 overflow-clip rounded-2xl border bg-background md:hidden ${GRID_LINE} ${BUILDER_RAIL_HALO}`}
      >
        {/* px-4 to line the labels up with the cells below them, and NO bottom
            padding: the first row's own `border-t` is the seam between the head
            and the body, and the active label's rule hangs a pixel into it (see
            the variant). Any padding here would separate the two and leave the
            underline floating above the line it is supposed to be part of. The
            filled track wanted an all-round p-2 to keep its own hairline off
            the card's; there is no second hairline here to keep clear of. */}
        {/* FILLED, like a thead. The head sat on the card's own --background,
            the same ground as the five rows under it, so the one thing marking
            it as the head was the active tab's rule — and a head that is only
            a rule reads as the first row of the table rather than as the bar
            that chooses what the table shows. --muted is the site's own
            quiet fill and a token, so it steps the right way in both themes:
            a shade up from the card in light, a shade down in dark. It stops
            exactly on the seam (no bottom padding, as above), so the band ends
            on the first hairline instead of floating over it. */}
        <div className="bg-muted px-4 pt-2">
          <SegmentedTabs
            variant="underline"
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

        <dl
          role="tabpanel"
          id={`${TABS_ID}-panel-${option}`}
          aria-labelledby={`${TABS_ID}-tab-${option}`}
        >
          {ROWS.map((row) => (
            <div
              key={row.label}
              // Every row rules above itself, the first one included: that
              // first rule is the seam between the head and the body, which is
              // what makes the control read as part of the table.
              className={`flex items-baseline justify-between gap-4 border-t px-4 py-3.5 ${GRID_LINE}`}
            >
              {/* ONE LINE, ALWAYS. The capability is the row's question and
                  it is the same question on every option — a two-line "Time
                  to a working / tool" against a one-line answer made the row
                  look broken rather than long. The answers take the wrapping
                  instead: they are the part that differs, they are ranged
                  right, and a two-line answer there reads as an answer that
                  needed two lines. */}
              <dt className="shrink-0 whitespace-nowrap pr-4 text-sm text-muted-foreground">
                {row.shortLabel ?? row.label}
              </dt>
              {/* Ranged right, so the five answers line up on one edge and
                  the option can be read down a single column.

                  FULL-STRENGTH INK ON EVERY TAB, ours included. The answers
                  used to drop to muted on the two alternative tabs, to keep
                  our column the strongest thing in the section. On the phone
                  there is no column: one option is on screen at a time, so
                  the only thing the muting compared our answers against was
                  nothing, and it read as the other two tabs being disabled
                  rather than as ours being emphasised. The answer is the
                  content either way — the `dt` stays muted, so the row still
                  reads question-then-answer. */}
              <dd className="min-w-0 text-right text-sm leading-snug text-foreground">
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
      {/* AN OPAQUE GROUND, so the page grid does not run through the table.
            /ai-app-builder draws vertical rails behind its content (see
            builder-grid-rails). They are meant to cross open page, not
            components: this table's cells carry no background of their own —
            only the Assembly column is tinted — so the rails were visible
            straight through the other three, reading as extra column rules at
            positions the table does not have. --background rather than a card
            tone: the table is drawn ON the page here, not raised off it, so
            the ground it needs is the page's own. */}
        <div
        className={`mt-12 hidden overflow-hidden rounded-2xl border bg-background md:block ${GRID_LINE} ${BUILDER_RAIL_HALO} ${BLEED}`}
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
                  // ONE TONE FOR THE WHOLE COLUMN, via --builder-own-col.
                  // The token is theme-scoped and the two themes mark the
                  // column differently on purpose — a brand tint in light, a
                  // lifted surface in dark. See globals.css for why a grey
                  // fill is wrong in light specifically.
                  //
                  // NO BRAND CAP. A 3px lime-to-blue rule ran across the
                  // column's head for a while; against a light column it was
                  // invisible, and against a dark one it was a stripe that
                  // said nothing the column's own tone was not already
                  // saying. The colour belongs IN the column, not on a line
                  // above it.
                  className={`border-l px-6 pb-5 pt-5 text-sm font-normal ${GRID_LINE} ${
                    i === OWN
                      ? `bg-[var(--builder-own-col)] text-foreground ${EDGE_R}`
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
                      // THE SAME TONE AS THE HEADER, not a lighter one.
                      //
                      // The cells used to sit back from their own header —
                      // --muted/50 under --muted in light — so the column was
                      // two washes rather than one object, and the half-rung
                      // between them was most of what made it read as a faint
                      // tint. A panel laid on the table is one surface from
                      // its cap to its foot; the header is already carried by
                      // its full-strength ink and the brand line above it.
                      // --builder-own-col-CELL, the answers' own token.
                      //
                      // This was still --surface-2 after the column moved to
                      // --builder-own-col: the header took the new tone and
                      // the five cells under it kept the old grey, so in
                      // light the column was a brand tint with a grey body
                      // hanging off it. One token family now, header and
                      // cells, and in dark the cells sit one notch above the
                      // header — see globals.css.
                      i === OWN
                        ? `bg-[var(--builder-own-col-cell)] ${EDGE_R}`
                        : ""
                    }`}
                  >
                    {/* EVERY ANSWER IN FULL-STRENGTH INK, not just ours.
                        The two alternative columns were set in muted grey so
                        our column won on weight as well as on wash. But all
                        three cells are answers to the same question, and
                        greying two of them made them read as unavailable
                        rather than as the routes being compared — the reader
                        has to actually read "Months" and "You own the
                        security" for our column to mean anything.

                        Our column is still marked, by the wash it carries on
                        both the header and the cells (and, in the header, by
                        the muted/50 the other two take there). That is the
                        site's own way of marking our side; weight was a
                        second, louder statement of the same thing. */}
                    <p className="text-sm leading-relaxed text-foreground">
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
