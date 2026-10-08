// ─────────────────────────────────────────────────────────────────────────
// DOTTED RULE — the hairline the divided FAQ list is ruled with.
//
// Shared rather than page-local because a second place now wants it: the
// problem section's two halves, which stack into a ruled list on a phone and
// have to be the SAME rule the FAQ further down that page already draws. Two
// dotted hairlines a screen apart that disagree about pitch or weight read as
// a mistake, and this is the kind of value that drifts the moment it is
// re-typed from memory.
//
// Drawn as a gradient rather than a border. A finer dot than `border-dotted`,
// which at 1px sets its dots one pixel apart and reads as a broken hairline:
// 2px marks on a 5px pitch. The colour is mixed off `--foreground` rather than
// taken from `--border` (at `--border` the dots were pale enough that the rule
// read as empty space), and mixing keeps it theme-derived, so light and dark
// each resolve their own value without a second declaration.
//
// Every variant is WRITTEN OUT in full, including its prefix. Tailwind scans
// for literal class strings, so a `max-md:` joined onto one of these at
// runtime would never be seen and the class would not be generated. That is
// why the gradient appears four times below rather than once in a template —
// the duplication is the scanner's price, and keeping all four here is what
// stops it spreading across the components that use them.
// ─────────────────────────────────────────────────────────────────────────

/** Rules the top of a row. For a list whose rows carry their own rule. */
export const DOTTED_RULE_BEFORE =
  "before:bg-[repeating-linear-gradient(to_right,color-mix(in_oklab,var(--foreground)_32%,transparent)_0_2px,transparent_2px_5px)]";

/** Closes the list under its last row. */
export const DOTTED_RULE_AFTER =
  "after:bg-[repeating-linear-gradient(to_right,color-mix(in_oklab,var(--foreground)_32%,transparent)_0_2px,transparent_2px_5px)]";

/** As above, but only below `md` — for a block that is a list on a phone and
    a column on a desktop, where the rules would be drawing boxes around
    something the grid already separates. */
export const DOTTED_RULE_BEFORE_MOBILE =
  "max-md:before:bg-[repeating-linear-gradient(to_right,color-mix(in_oklab,var(--foreground)_32%,transparent)_0_2px,transparent_2px_5px)]";

export const DOTTED_RULE_AFTER_MOBILE =
  "max-md:after:bg-[repeating-linear-gradient(to_right,color-mix(in_oklab,var(--foreground)_32%,transparent)_0_2px,transparent_2px_5px)]";
