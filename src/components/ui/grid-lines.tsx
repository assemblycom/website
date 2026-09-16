// The page grid: vertical rails framing the 1200px content column, plus the
// horizontal rules that terminate on them. Shared so every page draws the same
// grid — the home page, security, pricing, and customers all frame their content
// regions with it, and a rule on one page lines up with a rule on another.
//
// --border reads too faint over the near-black dark ground, so the lines get a
// stronger tint in dark mode (light already reads well). A SOLID colour, not
// white/opacity: where a horizontal rule crosses a vertical rail a translucent
// line would compound and the intersection would read brighter than the rest.
export const GRID_LINE = "border-border [[data-theme=dark]_&]:border-[#383838]";

// Vertical rails, drawn as an overlay on top of the content so section fills
// never hide them. Shown once the viewport reaches the 1200px content width, so
// the rules have rails to meet at the corners; below that (tablet/mobile) they'd
// hug the screen edges, so they hide.
//
// Put this inside a `relative` wrapper around the sections it should frame.
export function GridRails({
  /**
   * Ramps the rails up from nothing over the first `fadeTop` px of the region.
   *
   * For a region that opens under a hero with no rule between them: at full
   * strength from the first pixel, the two lines just appear, and the eye reads
   * that as an edge. Off by default, so every page that already frames its
   * content keeps the rails it has.
   */
  fadeTop,
}: {
  fadeTop?: number;
} = {}) {
  const mask = fadeTop
    ? `linear-gradient(to bottom, transparent 0, #000 ${fadeTop}px)`
    : undefined;
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-30 hidden justify-center min-[1200px]:flex"
    >
      <div
        className={`h-full w-full max-w-[1200px] border-x ${GRID_LINE}`}
        style={mask ? { maskImage: mask, WebkitMaskImage: mask } : undefined}
      />
    </div>
  );
}

// Horizontal rule between sections, capped to the rail width so both ends land
// exactly on a rail. Desktop only — on mobile there are no rails for it to meet.
export function GridDivider({
  /**
   * Runs the rule the full width of the viewport instead of stopping at the
   * rails. For a join the rails do not reach — above the first section, where
   * there is nothing yet for a 1200px rule to meet at its ends.
   */
  fullBleed = false,
  /**
   * Keeps the rule on phones too, bleeding to the screen edges the way the
   * trust ticker's own mobile rules do. Off by default: most pages stack into
   * one column on a phone with enough air between sections to read as separate,
   * and a line across that reads as a lid rather than a join. A page whose
   * sections sit closer together needs the join drawn.
   */
  onMobile = false,
}: {
  fullBleed?: boolean;
  onMobile?: boolean;
} = {}) {
  // Below 1200px the cap is wider than the viewport, so the capped rule bleeds
  // to the edges on a phone by itself — dropping `hidden` is the whole change.
  const visibility = onMobile ? "block" : "hidden md:block";
  return (
    <div
      className={
        fullBleed
          ? `border-t ${visibility} ${GRID_LINE}`
          : `mx-auto max-w-[1200px] border-t ${visibility} ${GRID_LINE}`
      }
    />
  );
}
