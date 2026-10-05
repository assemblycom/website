import Link from "next/link";
import { GRID_LINE } from "@/components/ui/grid-lines";

const COLUMNS: { name: string; examples?: string }[] = [
  { name: "Build in-house" },
  // The brief names the tools a reader is actually weighing us against; the
  // second line keeps them out of a header that has to hold one line.
  { name: "Standalone AI app builders", examples: "Lovable, Base44, Replit" },
  { name: "Assembly's AI app builder" },
];

/** Index of the Assembly column, which carries the wash. */
const OWN = 2;

const COMPARISONS = [
  { label: "Assembly vs. Lovable", href: "/comparison/lovable" },
  { label: "Assembly vs. Base44", href: "/comparison/base44" },
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

// Pulls the table out past the section's padding so every rule ends on the
// page's vertical rail, then puts the same inset back on the outer cells so the
// text still clears the lines. Matches the claims block above.
const BLEED = "md:-mx-10";
const EDGE_L = "md:pl-10 lg:pl-12";
const EDGE_R = "md:pr-10 lg:pr-12";

/**
 * The two options a buyer who already wants an app actually weighs, plus ours.
 *
 * Same construction as the competitor comparison pages: a real table above md,
 * the same rows stacked below it, and the Assembly column carrying the `--muted`
 * wash that marks our side everywhere else on the site. Three columns rather
 * than two, so it gets its own component instead of reusing that matrix.
 *
 * The wash is square, not a rounded card: it runs to the rail like the rules do,
 * and a rounded fill inside a grid built entirely from lines read as a stray
 * object sitting on top of it.
 */
export function BuilderAlternatives() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 py-14 md:px-10 md:py-20">
      <h3 className="type-h3 text-balance">
        Three ways to get a custom app. One is ready to use
      </h3>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        All three produce an app. Only one is ready for your clients and your
        team on day one.
      </p>

      {/* Sits with the copy that sets the comparison up, not after the table:
          the side route belongs to the argument, not to the last row. */}
      <div className="mt-6 flex flex-wrap gap-2">
        {COMPARISONS.map((comparison) => (
          <Link
            key={comparison.href}
            href={comparison.href}
            className="inline-block rounded-lg border border-border px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
          >
            {comparison.label}
          </Link>
        ))}
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

      <div className={`mt-12 hidden md:block ${BLEED}`}>
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
                left open made the table read as a fragment. */}
            <tr className={`border-y ${GRID_LINE}`}>
              <th scope="col" className={`pb-4 pr-8 ${EDGE_L}`}>
                <span className="sr-only">Capability</span>
              </th>
              {COLUMNS.map((column, i) => (
                <th
                  key={column.name}
                  scope="col"
                  className={`px-6 pb-4 pt-4 text-sm font-normal ${
                    i === OWN
                      ? `bg-muted text-foreground ${EDGE_R}`
                      : "text-muted-foreground"
                  }`}
                >
                  {column.name}
                  {column.examples ? (
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {column.examples}
                    </span>
                  ) : null}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.label} className={`border-b ${GRID_LINE}`}>
                <th
                  scope="row"
                  className={`py-5 pr-8 align-top font-normal ${EDGE_L}`}
                >
                  <span className="block text-sm">{row.label}</span>
                </th>
                {row.cells.map((cell, i) => (
                  <td
                    key={COLUMNS[i].name}
                    className={`px-6 py-5 align-top ${
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
