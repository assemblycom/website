import Link from "next/link";
import { GRID_LINE } from "@/components/ui/grid-lines";

const COLUMNS: { name: string }[] = [
  { name: "Build in-house" },
  { name: "Standalone AI app builders" },
  { name: "Assembly's AI app builder" },
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
 * The wash is square, not a rounded card: it runs to the rail like the rules do,
 * and a rounded fill inside a grid built entirely from lines read as a stray
 * object sitting on top of it. The last row keeps its rule for the same reason —
 * the page closes this section on the table's own line rather than a
 * `GridDivider`, so dropping it left the block open at the foot.
 */
export function BuilderAlternatives() {
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

      {/* Below md, one option at a time under its capability. Three columns
          of free text will not fit a phone. */}
      <ul className="mt-10 space-y-7 md:hidden">
        {ROWS.map((row) => (
          <li key={row.label}>
            <p className="text-sm">{row.label}</p>
            <div
              className={`mt-3 divide-y overflow-hidden rounded-lg border ${GRID_LINE} divide-border [[data-theme=dark]_&]:divide-[#383838]`}
            >
              {row.cells.map((cell, i) => (
                <div
                  key={COLUMNS[i].name}
                  className={`px-4 py-3 ${i === OWN ? "bg-muted" : ""}`}
                >
                  <span className="block text-xs text-muted-foreground">
                    {COLUMNS[i].name}
                  </span>
                  <p
                    className={`mt-1 text-sm leading-relaxed ${
                      i === OWN ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {cell}
                  </p>
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>

      {/* The frame's two outer sides. The cells draw the rules between
          columns and rows, so the table had a top and a bottom and nothing
          down either flank — the banded last column in particular just
          stopped. The wrapper closes it, and the radius keeps the corners
          from being the only hard right angles in a page of rounded
          surfaces. */}
      <div
        className={`mt-12 hidden overflow-hidden rounded-xl border-x md:block ${GRID_LINE} ${BLEED}`}
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
            {/* Ruled top and bottom: every body row is bounded, and a header
                left open made the table read as a fragment. The row carries a
                half-strength `--muted` — the same token the Assembly column
                uses, at 50%, so the head reads as a band without inventing a
                tint and the own column still steps up from it at full strength
                in both themes. */}
            <tr className={`bg-muted/50 border-y ${GRID_LINE}`}>
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
                      : "text-muted-foreground"
                  }`}
                >
                  {column.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.label} className={`border-b ${GRID_LINE}`}>
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
                      i === OWN ? `bg-muted ${EDGE_R}` : ""
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
