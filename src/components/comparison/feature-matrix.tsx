import { FeatureMatrixPhone } from "@/components/comparison/feature-matrix-phone";
import { GRID_LINE } from "@/components/ui/grid-lines";
import { Mark } from "@/components/comparison/mark";
import type { ComparisonRow } from "@/lib/comparisons";

/**
 * The two-product capability matrix, shared by the CMS-driven comparison pages
 * and the hand-built ones (Lovable, Base44) so the table is the same object in
 * both places.
 */

/**
 * A mark sits centred in its column, the way a tick in a table always has. Prose
 * does not: centred, the free-text cells gave every column two ragged edges and
 * no line started where the one above it did, which was the hardest thing in the
 * table to read. So the glyphs centre and the sentences range left.
 */
function Cell({ value }: { value: ComparisonRow["assembly"] }) {
  if (typeof value === "boolean") {
    // Every cell in a row tops out so their first lines share a baseline. The
    // disc is shorter than a line box, so it takes the difference as an offset
    // to sit on that line rather than above it.
    return (
      <div className="flex justify-center pt-0.5">
        <Mark value={value} />
      </div>
    );
  }
  return <p className="type-caption text-muted-foreground">{value}</p>;
}

// The Assembly column carries a wash the length of the table so the page's own
// side reads as the answer and the competitor's as the reference. `--muted` is
// the site's existing surface step rather than a tint invented for this table,
// so it flips with the theme like every other surface.
const OWN_COLUMN = "bg-muted";

/**
 * A feature matrix: the capability, then what each side offers.
 *
 * A real <table>, so the row/column relationship survives a screen reader and
 * the header stays associated with its cells. Its own horizontal scroll
 * container, because the free-text cells ("Hundreds of triggers and actions")
 * make some of these wider than a phone.
 */
export function FeatureMatrix({
  rows,
  competitor,
  caption,
  framed = false,
}: {
  rows: ComparisonRow[];
  competitor: string;
  caption: string;
  /**
   * Draws the table as its own outlined block instead of letting it run to the
   * page's vertical guides. Bled to the rails, the row rules landed on the
   * guides and the table stopped being an object — it read as page furniture
   * ruled by the grid, and the first column's text sat right on the left guide
   * with nothing between them. Framed, it is a panel with an edge of its own
   * and a margin inside that edge. Off for the CMS pages, whose band is
   * narrower than the rails and which never had the problem.
   */
  framed?: boolean;
}) {
  // The frame's own gutter. Only the outer cells carry it; the middle column
  // keeps the padding it already had.
  const edgeL = framed ? "pl-8" : "";
  const edgeR = framed ? "pr-8" : "";
  return (
    <>
      <FeatureMatrixPhone rows={rows} competitor={competitor} />

      <div className="mt-10 hidden overflow-x-auto md:block">
        {/* table-fixed with declared columns, so the two product columns are the
            same width in every section. Auto layout sized each table to its own
            content, and scrolling the page stepped through five tables whose
            columns never lined up with each other. */}
        {/* Framed, the frame is drawn by the body cells rather than by a box
            around the whole table, so the header strip stays OUTSIDE it: the
            blank top-left cell was the one thing the box enclosed that had
            nothing in it, and a rule running round an empty corner read as a
            mistake. Cell-drawn borders need `separate`, since a collapsed
            table resolves radii away. */}
        <table
          className={`w-full table-fixed text-left ${
            framed ? "border-separate border-spacing-0" : "border-collapse"
          }`}
        >
          <caption className="sr-only">{caption}</caption>
          {/* The label column holds two or three words; at 44% it was the
              widest column in the table and spent most of itself on white
              space, while the two columns doing the actual comparing wrapped
              every other cell to a second line. 30/35/35 gives the prose the
              room and leaves the labels more than they need. */}
          <colgroup>
            <col className="w-[30%]" />
            <col className="w-[35%]" />
            <col className="w-[35%]" />
          </colgroup>
          <thead>
            <tr className={framed ? "" : `border-b ${GRID_LINE}`}>
              <th scope="col" className={`pb-5 pr-8 ${edgeL}`}>
                <span className="sr-only">Capability</span>
              </th>
              <th
                scope="col"
                className={`rounded-t-lg px-6 pb-5 pt-5 text-center text-sm font-normal text-foreground ${OWN_COLUMN}`}
              >
                Assembly
              </th>
              <th
                scope="col"
                className={`pb-5 pl-6 pt-5 text-center text-sm font-normal text-muted-foreground ${edgeR || "pr-6"}`}
              >
                {competitor}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const first = i === 0;
              const last = i === rows.length - 1;
              // Framed: every body cell carries the row rule, and the outer
              // cells carry the frame's sides, so the box closes around the
              // rows alone. Unframed: the rule stays on the row, and the last
              // one goes without — it would cut across the rounded foot of the
              // wash, and the section divider already closes the block.
              const edge = framed
                ? `${GRID_LINE} border-b ${first ? "border-t" : ""}`
                : "";
              return (
                <tr
                  key={row.label}
                  className={framed || last ? "" : `border-b ${GRID_LINE}`}
                >
                  <th
                    scope="row"
                    className={`py-6 pr-8 align-top font-normal ${edgeL} ${edge} ${
                      framed
                        ? `border-l ${first ? "rounded-tl-xl" : ""} ${
                            last ? "rounded-bl-xl" : ""
                          }`
                        : ""
                    }`}
                  >
                    <span className="type-body block text-foreground">
                      {row.label}
                    </span>
                    {row.detail && (
                      <span className="type-caption mt-1 block text-muted-foreground">
                        {row.detail}
                      </span>
                    )}
                  </th>
                  {/* Unframed the wash closes on the last row, so the column
                  reads as one panel rather than as a fill that runs off the
                  bottom. Framed, the frame's own bottom edge closes it, and a
                  radius here would curl the wash away from a square corner. */}
                  <td
                    className={`px-6 py-6 align-top ${OWN_COLUMN} ${edge} ${
                      !framed && last ? "rounded-b-lg" : ""
                    }`}
                  >
                    <Cell value={row.assembly} />
                  </td>
                  <td
                    className={`py-6 pl-6 align-top ${edgeR || "pr-6"} ${edge} ${
                      framed
                        ? `border-r ${first ? "rounded-tr-xl" : ""} ${
                            last ? "rounded-br-xl" : ""
                          }`
                        : ""
                    }`}
                  >
                    <Cell value={row.competitor} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
