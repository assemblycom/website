import { GRID_LINE } from "@/components/ui/grid-lines";
import type { ComparisonRow } from "@/lib/comparisons";

/**
 * The two-product capability matrix, shared by the CMS-driven comparison pages
 * and the hand-built ones (Lovable, Base44) so the table is the same object in
 * both places.
 */

/**
 * The tick and cross in a matrix cell, each set in a disc so a row scans as a
 * verdict rather than as two hairlines of type. Both stay neutral — a green
 * tick against a red cross is louder than this site's palette goes anywhere
 * else — so the contrast is weight, not hue: a solid disc for what a product
 * does, a faint one for what it doesn't.
 */
function Mark({ value }: { value: boolean }) {
  const label = value ? "Included" : "Not included";
  return (
    <span
      role="img"
      aria-label={label}
      className={`flex h-5 w-5 items-center justify-center rounded-full ${
        value
          ? "bg-foreground text-background"
          : "bg-foreground/10 text-muted-foreground"
      }`}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        {value ? (
          <path d="M20 6 9 17l-5-5" />
        ) : (
          <>
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </>
        )}
      </svg>
    </span>
  );
}

/**
 * A mark sits centred in its column, the way a tick in a table always has. Prose
 * does not: centred, the free-text cells gave every column two ragged edges and
 * no line started where the one above it did, which was the hardest thing in the
 * table to read. So the glyphs centre and the sentences range left.
 */
function Cell({ value }: { value: ComparisonRow["assembly"] }) {
  if (typeof value === "boolean") {
    return (
      <div className="flex justify-center">
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
}: {
  rows: ComparisonRow[];
  competitor: string;
  caption: string;
}) {
  return (
    <>
      {/* Below md the same rows as a stack, one capability at a time.
          Three columns will not fit a phone: at 375px the label column alone
          took 240 of the 327 available, which left the Assembly column clipped
          in half and the competitor's off-screen entirely, behind a horizontal
          scroll with nothing to say it was there. Stacked, both sides of every
          row are on screen and nothing scrolls sideways. */}
      <ul className="mt-10 space-y-7 md:hidden">
        {rows.map((row) => (
          <li key={row.label}>
            <p className="type-body text-foreground">{row.label}</p>
            {row.detail && (
              <p className="type-caption mt-1 text-muted-foreground">
                {row.detail}
              </p>
            )}
            {/* The two sides in one outlined card, split by a hairline. The wash
                alone did not hold them together: only the Assembly row carried
                it, so it read as a loose grey bar floating over an unstyled row
                rather than as our side of a pair — and at --muted on white the
                bar was faint enough to look like a rendering artefact. The
                outline is what says "these two belong to the label above". */}
            <div
              className={`mt-3 divide-y overflow-hidden rounded-lg border ${GRID_LINE} divide-border [[data-theme=dark]_&]:divide-[#383838]`}
            >
              <StackedValue name="Assembly" value={row.assembly} own />
              <StackedValue name={competitor} value={row.competitor} />
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-10 hidden overflow-x-auto md:block">
        {/* table-fixed with declared columns, so the two product columns are the
            same width in every section. Auto layout sized each table to its own
            content, and scrolling the page stepped through five tables whose
            columns never lined up with each other. */}
        <table className="w-full table-fixed border-collapse text-left">
          <caption className="sr-only">{caption}</caption>
          <colgroup>
            <col className="w-[44%]" />
            <col className="w-[28%]" />
            <col className="w-[28%]" />
          </colgroup>
          <thead>
            <tr className={`border-b ${GRID_LINE}`}>
              <th scope="col" className="pb-3 pr-4">
                <span className="sr-only">Capability</span>
              </th>
              <th
                scope="col"
                className={`type-eyebrow rounded-t-lg px-4 pb-3 pt-3 text-center text-foreground ${OWN_COLUMN}`}
              >
                Assembly
              </th>
              <th
                scope="col"
                className="type-eyebrow px-4 pb-3 pt-3 text-center text-muted-foreground"
              >
                {competitor}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              // No rule under the last row: it would cut across the rounded foot
              // of the wash, and the section divider already closes the block.
              <tr
                key={row.label}
                className={i === rows.length - 1 ? "" : `border-b ${GRID_LINE}`}
              >
                <th scope="row" className="py-4 pr-4 font-normal align-top">
                  <span className="type-body block text-foreground">
                    {row.label}
                  </span>
                  {row.detail && (
                    <span className="type-caption mt-1 block text-muted-foreground">
                      {row.detail}
                    </span>
                  )}
                </th>
                {/* The wash closes on the last row, so the column reads as one
                  panel rather than as a fill that runs off the bottom. */}
                <td
                  className={`px-4 py-4 align-middle ${OWN_COLUMN} ${
                    i === rows.length - 1 ? "rounded-b-lg" : ""
                  }`}
                >
                  <Cell value={row.assembly} />
                </td>
                <td className="px-4 py-4 align-middle">
                  <Cell value={row.competitor} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

/**
 * One side of one capability, on a phone: who it is, then what they offer.
 *
 * The Assembly side keeps the wash it has in the table, so the highlight
 * survives the change of shape rather than being a desktop-only flourish.
 */
function StackedValue({
  name,
  value,
  own = false,
}: {
  name: string;
  value: ComparisonRow["assembly"];
  own?: boolean;
}) {
  return (
    <div
      className={`flex items-baseline gap-4 px-4 py-2.5 ${own ? OWN_COLUMN : ""}`}
    >
      <span
        className={`type-eyebrow w-24 shrink-0 ${
          own ? "text-foreground" : "text-muted-foreground"
        }`}
      >
        {name}
      </span>
      {/* A mark goes to the far edge of the row, not up against the name: the
          two names are the same width, so a mark next to them had a card's worth
          of empty space to its right and read as unplaced. At the edge the two
          marks line up under each other with the row's width between them and
          their labels, which is what makes the pair scannable. Prose still fills
          the row from the name onward — it needs the measure. */}
      {typeof value === "boolean" ? (
        <span className="ml-auto">
          <Mark value={value} />
        </span>
      ) : (
        <p className="type-caption min-w-0 flex-1 text-muted-foreground">
          {value}
        </p>
      )}
    </div>
  );
}
