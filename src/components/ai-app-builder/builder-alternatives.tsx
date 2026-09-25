import Link from "next/link";
import { GRID_LINE } from "@/components/ui/grid-lines";
import { Reveal } from "@/components/ui/reveal";

const COLUMNS = [
  "Build in-house",
  "Standalone AI app builders",
  "Assembly",
] as const;

/** Index of the Assembly column, which carries the wash. */
const OWN = 2;

const ROWS: { label: string; cells: [string, string, string] }[] = [
  {
    label: "Time to a working tool",
    cells: ["Months", "Minutes to a prototype", "Minutes to a working app"],
  },
  {
    label: "Ready for your clients or team on day one?",
    cells: [
      "Only after a full build and QA cycle",
      "No. You get a URL that still needs logins, hosting, and client data",
      "Yes. Client apps land in your branded client experience, team tools in your dashboard",
    ],
  },
  {
    label: "Logins and permissions",
    cells: [
      "You own the security surface",
      "You set them up yourself",
      "Built in and maintained by Assembly",
    ],
  },
  {
    label: "Client data",
    cells: [
      "You design and host the database",
      "Starts empty. You design a database for every app",
      "A shared CRM powers every app",
    ],
  },
  {
    label: "Maintenance",
    cells: [
      "Needs a developer on call",
      "Yours, after every change",
      "Assembly maintains the platform. You keep chatting to change the app",
    ],
  },
];

/**
 * The two options a buyer who already wants an app actually weighs, plus ours.
 *
 * Same construction as the competitor comparison pages: a real table above md,
 * the same rows stacked below it, and the Assembly column carrying the `--muted`
 * wash that marks our side everywhere else on the site. Three columns rather
 * than two, so it gets its own component instead of reusing that matrix.
 */
export function BuilderAlternatives() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 py-16 md:px-10 md:py-24">
      <Reveal>
        <h2 className="type-h2 text-balance">
          Three ways to get a custom app. One is ready to use.
        </h2>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Every option below can produce an app. Only one comes with the logins,
          client data, and client experience that let your clients or your team
          use it the same day.
        </p>

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
                    key={COLUMNS[i]}
                    className={`px-4 py-3 ${i === OWN ? "bg-muted" : ""}`}
                  >
                    <span
                      className={`block text-sm ${
                        i === OWN ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {COLUMNS[i]}
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

        <div className="mt-10 hidden overflow-x-auto md:block">
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
              <tr className={`border-b ${GRID_LINE}`}>
                <th scope="col" className="pb-5 pr-8">
                  <span className="sr-only">Capability</span>
                </th>
                {COLUMNS.map((column, i) => (
                  <th
                    key={column}
                    scope="col"
                    className={`px-6 pb-5 pt-5 text-sm font-normal ${
                      i === OWN
                        ? "rounded-t-lg bg-muted text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, r) => {
                const last = r === ROWS.length - 1;
                return (
                  <tr key={row.label} className={last ? "" : `border-b ${GRID_LINE}`}>
                    <th scope="row" className="py-6 pr-8 align-top font-normal">
                      <span className="block text-sm">{row.label}</span>
                    </th>
                    {row.cells.map((cell, i) => (
                      <td
                        key={COLUMNS[i]}
                        className={`px-6 py-6 align-top ${
                          i === OWN ? "bg-muted" : ""
                        } ${i === OWN && last ? "rounded-b-lg" : ""}`}
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
                );
              })}
            </tbody>
          </table>
        </div>

        {/* The outlined link the other sections on this page already use for a
            side route, rather than a loose sentence under the table. */}
        <Link
          href="/comparison"
          className="mt-8 inline-block rounded-lg border border-border px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
        >
          Compare against a specific tool
        </Link>
      </Reveal>
    </section>
  );
}
