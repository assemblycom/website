"use client";

/**
 * The two-up switch that sits ON a picture rather than on the page.
 *
 * Extracted from builder-hero-visual.tsx, which is where it was drawn and
 * which still renders it — /client-portal's comparison tray wanted the same
 * object and the site's rule is to reuse the pattern rather than invent a
 * second one. Nothing about the markup changed in the move.
 *
 * HOW IT DIFFERS FROM `SegmentedTabs`, and why both exist. SegmentedTabs is
 * the control for a page's own ground: a filled track, a dark gliding thumb,
 * tablist semantics because it selects between panels. This one is for a
 * control laid over artwork — the track is a hairline with NO FILL, so the
 * picture reads through it, and the thumb is the light one. On a tray or a
 * card, a filled track reads as a second panel sitting on the first.
 *
 * `aria-pressed` rather than a tablist: these switch what one picture shows,
 * not which of two panels is mounted, so there is no tab/panel pair to name.
 */
export function ViewToggle({
  options,
  view,
  onSelect,
  label,
  onPaper = false,
}: {
  options: readonly string[];
  view: number;
  onSelect: (i: number) => void;
  /** Names the group for a screen reader, e.g. "Which portal to show". */
  label?: string;
  /**
   * The control is sitting on a PAPER card while the page is in dark mode.
   *
   * Every other caller puts this on a surface that follows the theme, so its
   * dark treatment — a white hairline track and a white-wash thumb — is keyed
   * off `[data-theme="dark"]` and is right. The builder hero's cards are
   * near-white in BOTH themes, so in dark those same classes paint a white
   * ring and a white thumb onto white paper and the control disappears.
   *
   * With this set the dark variants are simply not emitted, and the base
   * classes — which read --border/--background/--foreground — are left to
   * resolve against whatever ladder the card scopes onto its subtree.
   *
   * A prop rather than a second component: this is the same object in the
   * same role, on a different ground. Forking it would be the variation the
   * file's own note argues against.
   */
  onPaper?: boolean;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className={`flex items-center gap-0.5 rounded-full border border-border p-1 ${
        onPaper ? "" : "[[data-theme=dark]_&]:border-white/15"
      }`}
    >
      {options.map((option, i) => (
        <button
          key={option}
          type="button"
          onClick={() => onSelect(i)}
          aria-pressed={i === view}
          className={`whitespace-nowrap rounded-full border px-3.5 py-1 text-sm transition-colors duration-300 ${
            i === view
              ? // No border on the thumb in DARK: the track already carries one
                // 4px outside it, so the pair read as two concentric rings
                // around one small control. The fill is what marks the thumb
                // there — lifted to 8% so it still reads once the ring is
                // gone. Light keeps its border, because a white thumb on a
                // near-white card has nothing else to separate it.
                `border-border bg-background text-foreground ${
                  onPaper
                    ? ""
                    : "[[data-theme=dark]_&]:border-transparent [[data-theme=dark]_&]:bg-white/[0.08]"
                }`
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
