import { GRID_LINE } from "@/components/ui/grid-lines";

/**
 * A two-product checklist: features down the left, a tick or a cross under
 * each product. The shape the strongest comparison tables share (a soft card,
 * one quiet rule per row, narrow mark columns), and the same layout on a phone,
 * where both products stay side by side instead of hiding one behind a tab.
 */

/** A plain yes or no, or one with a word of qualification ("Enterprise"). */
export type ChecklistCell = boolean | { yes: boolean; note: string };

export interface ChecklistRow {
  label: string;
  assembly: ChecklistCell;
  competitor: ChecklistCell;
}

function Tick({ yes }: { yes: boolean }) {
  return (
    <svg
      role="img"
      aria-label={yes ? "Yes" : "No"}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={
        yes
          ? "size-[18px] shrink-0 text-foreground"
          : "size-4 shrink-0 text-muted-foreground/60"
      }
    >
      {yes ? (
        <path d="M20 6 9 17l-5-5" />
      ) : (
        <>
          <path d="M17 7 7 17" />
          <path d="m7 7 10 10" />
        </>
      )}
    </svg>
  );
}

function Cell({ value }: { value: ChecklistCell }) {
  // A qualified yes is its qualifier, set as a tag in place of the tick: the
  // tag already says "yes, on this plan", and a tick beside it said it twice.
  if (typeof value !== "boolean") {
    return (
      <div className="flex justify-center">
        {/* The site's own tag, the one /templates, /jobs and /customers set
            their categories in. A step smaller on a phone, where the column
            is narrow. */}
        <span className="whitespace-nowrap rounded-md bg-muted px-1.5 py-[3px] font-mono text-[10px] uppercase leading-none tracking-wide text-muted-foreground md:px-2 md:py-1 md:text-[11px] [[data-theme=dark]_&]:bg-white/[0.08]">
          <span className="sr-only">Yes, on </span>
          {value.note}
        </span>
      </div>
    );
  }
  return (
    <div className="flex justify-center">
      <Tick yes={value} />
    </div>
  );
}

export function CompareChecklist({
  rows,
  competitor,
  caption,
}: {
  rows: ChecklistRow[];
  competitor: string;
  caption: string;
}) {
  return (
    // Outlined, not filled: the gray is kept for the header bar alone, so the
    // column names read as a heading and the rows sit on the page.
    <div
      className={`mx-auto mt-10 max-w-[1000px] overflow-hidden rounded-2xl border md:mt-12 ${GRID_LINE}`}
    >
      <table className="w-full table-fixed text-left">
        <caption className="sr-only">{caption}</caption>
        <colgroup>
          <col />
          <col className="w-[84px] md:w-[180px]" />
          <col className="w-[84px] md:w-[180px]" />
        </colgroup>
        <thead className="bg-muted [[data-theme=dark]_&]:bg-white/[0.04]">
          <tr>
            <th
              scope="col"
              className="py-3.5 pl-4 text-sm font-normal text-muted-foreground md:py-4 md:pl-8"
            >
              Features
            </th>
            <th
              scope="col"
              className="py-3.5 text-center text-sm font-normal text-foreground md:py-4"
            >
              Assembly
            </th>
            <th
              scope="col"
              className="py-3.5 pr-2 text-center text-sm font-normal text-muted-foreground md:py-4 md:pr-4"
            >
              {competitor}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className={`border-t ${GRID_LINE}`}>
              <th
                scope="row"
                className="py-3.5 pl-4 pr-3 text-[15px] font-normal leading-snug text-foreground md:py-4 md:pl-8"
              >
                {row.label}
              </th>
              <td className="py-3.5 md:py-4">
                <Cell value={row.assembly} />
              </td>
              <td className="py-3.5 pr-2 md:py-4 md:pr-4">
                <Cell value={row.competitor} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
