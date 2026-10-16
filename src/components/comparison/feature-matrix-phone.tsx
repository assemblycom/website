"use client";

import { useId, useState } from "react";
import { GRID_LINE } from "@/components/ui/grid-lines";
import { Mark } from "@/components/comparison/mark";
import { SegmentedTabs } from "@/components/ui/segmented-tabs";
import type { ComparisonRow } from "@/lib/comparisons";


/**
 * The capability matrix on a phone: one product at a time, chosen by the
 * control at the head of the card.
 *
 * This is /ai-app-builder's alternatives table, reused — the two comparison
 * tables on this site now behave the same way on a phone, which is the point
 * of having a pattern. It replaces a stack that printed BOTH products under
 * every capability: ten capabilities became twenty rows, the section ran for
 * several screens, and the comparison had to be held in the head because the
 * two answers were never both in view with their label.
 *
 * ONE OBJECT, control and all: the switcher sits inside the card as its head,
 * and the rule under it is the same hairline that separates the rows, so the
 * card reads top to bottom as one table whose first row chooses the column.
 */
export function FeatureMatrixPhone({
  rows,
  competitor,
}: {
  rows: ComparisonRow[];
  competitor: string;
}) {
  // 0 is Assembly, 1 the competitor — ours first, since it is the answer the
  // page is for and the one a reader arrives wanting.
  const [option, setOption] = useState(0);
  const own = option === 0;
  // Unique per matrix: a comparison page renders one per feature section, and
  // a shared id sent each tab's aria-controls to the first section's panel.
  const TABS_ID = `matrix-phone-${useId().replace(/:/g, "")}`;

  return (
    <div
      className={`mt-10 overflow-clip rounded-2xl border bg-background md:hidden ${GRID_LINE}`}
    >
      {/* UNDERLINE TABS IN A FILLED HEAD — /ai-app-builder's alternatives
          table exactly (see builder-alternatives.tsx), which is the whole
          point of the two tables sharing a pattern. This ran the default
          filled track, and a solid black thumb at the top of a ten-row card
          is the heaviest object in it: the eye lands on the control rather
          than on the rows it is there to switch. A control at the head of a
          table is furniture, and furniture should not win.

          px-4 lines the labels up with the cells below, and there is NO
          bottom padding: the first row's own `border-t` is the seam between
          head and body, and the active label's rule hangs a pixel into it
          (see the variant). Padding here would lift the underline off the
          line it is meant to be part of. --muted fills the band so the head
          reads as a thead rather than as the table's first row — a token, so
          it steps up from the card in light and down in dark. */}
      <div className="bg-muted px-4 pt-2">
        <SegmentedTabs
          variant="underline"
          label={`Assembly compared with ${competitor}`}
          idBase={TABS_ID}
          value={String(option)}
          onChange={(v) => setOption(Number(v))}
          options={[
            { value: "0", label: "Assembly" },
            { value: "1", label: competitor },
          ]}
        />
      </div>

      <dl
        role="tabpanel"
        id={`${TABS_ID}-panel-${option}`}
        aria-labelledby={`${TABS_ID}-tab-${option}`}
      >
        {rows.map((row) => {
          const value = own ? row.assembly : row.competitor;
          return (
            <div
              key={row.label}
              // Every row rules above itself, the first one included: that
              // first rule is the seam between the head and the body.
              className={`flex items-baseline justify-between gap-4 border-t px-4 py-3.5 ${GRID_LINE}`}
            >
              {/* Capped at 45% and allowed to wrap. The builder's version of
                  this row keeps its label on one line, which works there
                  because its labels are two or three words; ours run to
                  "Ready for clients on day one" and "Code ownership and
                  export", and held on one line they took two thirds of a
                  375px row — which left the answer a column four words wide
                  breaking "Yes — in / your / branded / portal". The label
                  wrapping to two lines is the lesser of the two. */}
              <dt className="min-w-0 max-w-[45%] pr-4 text-sm text-muted-foreground">
                {row.label}
              </dt>
              {/* Ranged right, so the answers line up on one edge and the
                  option can be read down a single column. Our own side takes
                  the ink; the competitor's sits back. */}
              <dd
                className={`min-w-0 text-right text-sm leading-snug ${
                  own ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {typeof value === "boolean" ? (
                  <span className="inline-flex justify-end">
                    <Mark value={value} />
                  </span>
                ) : (
                  value
                )}
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
