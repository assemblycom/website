import { cn } from "@/lib/utils";

export interface DataRow {
  label: string;
  values: string[];
}

// The highlighted column is a faint wash the full height of the table, so the
// eye lands on it first without the other columns turning into noise.
const HIGHLIGHT = "bg-foreground/[0.04] [[data-theme=dark]_&]:bg-white/[0.05]";

/**
 * A comparison table: labels down the left, one column per period, and one
 * column washed to mark the one the reader came for. Set at the article's
 * reading size, with figures right-aligned in tabular digits so they line up.
 */
export function DataTable({
  columns,
  rows,
  highlight,
  notes,
}: {
  columns: string[];
  rows: DataRow[];
  /** Index into `columns` of the column to wash. */
  highlight?: number;
  notes?: string[];
}) {
  return (
    <div>
      <table className="type-body w-full border-collapse text-left md:text-base">
        <thead>
          <tr className="border-b border-border">
            <th className="py-4 pr-3" />
            {columns.map((column, i) => (
              <th
                key={column}
                scope="col"
                className={cn(
                  "px-2 py-4 text-right font-normal sm:px-5",
                  i === highlight
                    ? cn(HIGHLIGHT, "text-foreground")
                    : "text-muted-foreground",
                )}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr
              key={row.label}
              className={cn(r < rows.length - 1 && "border-b border-border")}
            >
              <th
                scope="row"
                className="text-pretty py-4 pr-3 font-normal text-foreground"
              >
                {row.label}
              </th>
              {row.values.map((value, i) => (
                <td
                  key={columns[i]}
                  className={cn(
                    "whitespace-nowrap px-2 py-4 text-right tabular-nums sm:px-5",
                    i === highlight
                      ? cn(HIGHLIGHT, "text-foreground")
                      : "text-muted-foreground",
                  )}
                >
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {notes?.map((note) => (
        <p
          key={note}
          className="type-caption mt-4 text-pretty text-muted-foreground"
        >
          {note}
        </p>
      ))}
    </div>
  );
}
