// ─────────────────────────────────────────────────────────────────────────
// SECURITY COMPLIANCE — a compact certified-&-compliant band: a single row of
// engraved seals, one per standard, split by hairline dividers (the page's
// guide rails frame the outer edges). No descriptions — the seals carry the
// credibility on their own (see the Security FAQ / Trust Center for detail).
// Add entries as the list grows.
// ─────────────────────────────────────────────────────────────────────────

interface Standard {
  title: string;
  seal: string;
}

/** The seals, for a caller drawing them outside this band. */
export const SECURITY_STANDARDS: Standard[] = [
  { title: "SOC 2 Type II", seal: "SOC 2" },
  { title: "HIPAA", seal: "HIPAA" },
  { title: "GDPR", seal: "GDPR" },
  { title: "CCPA", seal: "CCPA" },
];

// A minimal engraved-style seal — the outer circle plus a per-standard detail:
// SOC 2 / CCPA split by a divider (SOC 2's top half filled), HIPAA an inner
// circle, GDPR a ring of stars. Monotone.
// Seal geometry is one shared step so all four scale together. Everything inside
// a seal is sized proportionally (percentages, not fixed px) so the artwork holds
// at every breakpoint.
const SEAL_SIZE = "size-20 sm:size-24 md:size-28";
const SEAL_LABEL =
  "font-mono text-[10px] uppercase tracking-wide sm:text-[11px]";
// GDPR ring: 8 stars at 36% of the seal box from centre (the old fixed -40px on a
// 112px seal, expressed proportionally so it survives the smaller breakpoints).
const STAR_COUNT = 8;
const STAR_RADIUS_PCT = 36;

/**
 * Exported for the homepage's unified-platform panel, which lays the four
 * seals straight onto its photograph with none of the band around them.
 *
 * `size` replaces the band's own step for a caller drawing them smaller. It
 * is the only thing that changes: every detail inside a seal is placed as a
 * percentage of the box, so the artwork holds at whatever size it is given.
 */
export function Seal({
  label,
  size = SEAL_SIZE,
}: {
  label: string;
  size?: string;
}) {
  const isLine = label !== "HIPAA" && label !== "GDPR";

  // Divider badges — the circle is split into two halves by a full-bleed line;
  // SOC 2's top half is filled light gray.
  if (isLine) {
    // SOC 2 fills the top half; CCPA the bottom half.
    const fill = "bg-black/[0.04] [[data-theme=dark]_&]:bg-white/[0.12]";
    const topFill = label === "SOC 2" ? fill : "";
    const bottomFill = label === "CCPA" ? fill : "";
    return (
      <span
        className={`relative flex ${size} flex-col items-center overflow-hidden rounded-full border border-border text-muted-foreground [[data-theme=dark]_&]:border-[#4d4d4d]`}
      >
        <span
          className={`flex w-full flex-1 items-end justify-center pb-1 sm:pb-1.5 ${topFill}`}
        >
          <span className={`${SEAL_LABEL} [word-spacing:-0.32em]`}>
            {label}
          </span>
        </span>
        <span
          aria-hidden
          className="h-px w-full bg-border [[data-theme=dark]_&]:bg-[#4d4d4d]"
        />
        <span className={`w-full flex-1 ${bottomFill}`} />
      </span>
    );
  }

  // HIPAA (inner circle) and GDPR (ring of stars) — centered label. GDPR fills
  // the whole disc rather than insetting a second circle, so it stays visually
  // distinct from HIPAA while still reading as filled.
  const gdprFill =
    label === "GDPR"
      ? "bg-black/[0.03] [[data-theme=dark]_&]:bg-white/[0.08]"
      : "";
  return (
    <span
      className={`relative flex ${size} flex-col items-center justify-center overflow-hidden rounded-full border border-border text-muted-foreground [[data-theme=dark]_&]:border-[#4d4d4d] ${gdprFill}`}
    >
      {label === "HIPAA" && (
        // inset as a percentage, not fixed px, so the inner ring keeps the same
        // proportion as the seal shrinks.
        <span
          aria-hidden
          className="absolute inset-[9%] rounded-full border border-border/70 bg-black/[0.03] [[data-theme=dark]_&]:border-[#454545] [[data-theme=dark]_&]:bg-white/[0.05]"
        />
      )}
      {label === "GDPR" && (
        // Eight larger stars rather than twelve small ones: at this seal size a
        // denser ring read as speckle. Solid grey on the light disc rather than
        // the reverse — knocking them out of a disc that's only 3% black left
        // nothing to see, and outlining them to compensate turned each star
        // into a drawing of a star.
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 text-[8px] text-muted-foreground/60 [[data-theme=dark]_&]:text-muted-foreground/70 sm:text-[9px] md:text-[10px]"
        >
          {Array.from({ length: STAR_COUNT }).map((_, i) => {
            // Each star is placed by percentage of the seal box rather than a
            // fixed px offset, so the ring scales with the seal instead of
            // spilling outside it at smaller sizes.
            const angle = (i * 2 * Math.PI) / STAR_COUNT;
            return (
              <span
                key={i}
                className="absolute leading-none"
                style={{
                  left: `${50 + STAR_RADIUS_PCT * Math.sin(angle)}%`,
                  top: `${50 - STAR_RADIUS_PCT * Math.cos(angle)}%`,
                  transform: "translate(-50%,-50%)",
                }}
              >
                ★
              </span>
            );
          })}
        </span>
      )}
      <span className={`relative ${SEAL_LABEL}`}>{label}</span>
    </span>
  );
}

export function SecurityCompliance({
  omit,
  railAligned = false,
  framed = false,
  lineClass,
}: {
  /** Seal titles to leave out — a page may make a claim one of these outruns. */
  omit?: string[];
  /**
   * The band already has a rule under it, drawn by whatever frames it, so it
   * should not add its own on a phone.
   *
   * Two-up on a phone the grid's last row ends on nothing — the hairline bed
   * only shows BETWEEN cells — so the band normally closes itself there. A
   * page that boxes the band instead (see `bandClassName` on PortalTrust)
   * draws that rule one pixel lower, and the two together read as a doubled
   * line under the last two seals.
   */
  framed?: boolean;
  /**
   * The hairline colour between the cells, as background utilities.
   *
   * For a page drawing guide rails behind its content: every line on such a
   * page has to be the rails' own tone or the column a cell divider shares
   * with a rail changes weight where one takes over from the other. Unset,
   * the band keeps --border, which is what the pages without rails use.
   */
  lineClass?: string;
  /**
   * Lay the band out on SIXTHS of the measure rather than on its own equal
   * share of it.
   *
   * For a page that draws column rails behind its content. The band's cells
   * divide the measure by their own count, the rails divide it by six, and the
   * two rhythms meet at the band's top and bottom edges — hairlines inside it
   * at quarters, rails above and below it at sixths, out of step by enough to
   * read as a rendering fault rather than as a grid.
   *
   * On here the four seals take the middle four sixths and an empty cell
   * closes each end, so every vertical in the band stands on a rail and the
   * grid runs through the section unbroken. Only a page with those rails
   * passes it; /security and /client-portal have none and keep the band at
   * full width.
   */
  railAligned?: boolean;
} = {}) {
  const standards = omit?.length
    ? SECURITY_STANDARDS.filter((s) => !omit.includes(s.title))
    : SECURITY_STANDARDS;
  // Only the four-seal band divides into sixths cleanly (one empty cell each
  // end); a shorter list keeps its own equal share of the measure.
  const onRails = railAligned && standards.length === 4;
  // Written out rather than interpolated so Tailwind sees the whole class name.
  const columns = onRails
    ? "sm:grid-cols-6"
    : standards.length === 3
      ? "sm:grid-cols-3"
      : "sm:grid-cols-4";
  return (
    // px-0 once the rails are present (≥1200px) so the grid fills the full rail
    // width and the outer cells meet the guide rails — smaller viewports keep a
    // little edge padding.
    <section className="relative mx-auto max-w-[1200px] px-6 md:max-[1199px]:px-10 min-[1200px]:px-0">
      {/* gap-px over a border-colored bed draws a hairline between each cell;
          each cell repaints the page background over it. */}
      {/* Bleeds past the section's padding on a phone so the hairline between
          the two rows runs the full width of the screen instead of stopping
          short of both edges. */}
      <div
        // The bed shows through gap-px, so only the rules BETWEEN cells get
        // drawn — the outer edges get nothing. On a desktop that is right: the
        // section's own full-bleed rules close it top and bottom. On a phone
        // the grid runs two-up over two rows and the last row simply stopped,
        // leaving the block open at the foot with the rule above it still
        // there. A bottom border below sm closes it, bleeding to the screen
        // edges like the -mx-6 it sits in and like every other phone-only rule
        // on the site.
        className={`-mx-6 grid grid-cols-2 gap-px sm:mx-0 ${
          // ON THE RAILS THE GAPS DRAW NOTHING. A `gap-px` hairline starts ON
          // the column boundary and runs a pixel to its right, while the page's
          // guide rails are `w-px -translate-x-1/2` spans CENTRED on it — so the
          // two land half a pixel apart and paint about 1.4px of line between
          // them, which is the doubled vertical down this band. The overlay
          // below redraws them on the rails' own geometry instead. Under
          // 1200px the bed stays: there are no rails there to line up with.
          onRails ? "min-[1200px]:gap-0" : ""
        } ${columns} ${
          lineClass ?? "bg-border [[data-theme=dark]_&]:bg-[#383838]"
        } ${
          framed
            ? ""
            : "max-sm:border-b max-sm:border-border [[data-theme=dark]_&]:max-sm:border-[#383838]"
        }`}
      >
        {/* The end cells. Page ground, not the hairline bed, so each one reads
            as the measure carrying on rather than as a fifth empty seal.
            Hidden on a phone, where the band is two-up and has no rails to
            stand on. */}
        {onRails ? (
          <div aria-hidden className="hidden bg-background sm:block" />
        ) : null}
        {standards.map((s) => (
          <div
            key={s.title}
            // Cell padding scales with the seal — a fixed py-14 left the mobile
            // cells far taller than their contents needed.
            className="flex flex-col items-center bg-background px-4 py-9 text-center sm:px-6 sm:py-12 md:py-14"
          >
            <Seal label={s.seal} />
            <span className="mt-4 text-[13px] text-foreground sm:mt-5 sm:text-sm">
              {s.title}
            </span>
          </div>
        ))}
        {/* An odd count leaves the phone's two-up grid one cell short, and
            the empty slot showed the hairline bed through it — a grey block
            where a seal should be. This repaints it as page ground, so the
            gap reads as empty rather than filled. Phone only: from sm the
            columns match the count. */}
        {standards.length % 2 ? (
          <div aria-hidden className="bg-background sm:hidden" />
        ) : null}
        {onRails ? (
          <div aria-hidden className="hidden bg-background sm:block" />
        ) : null}
      </div>
      {/* THE BAND'S VERTICALS, DRAWN LIKE THE RAILS THEY SIT ON.
          Seven spans — both edges and the five boundaries between the six
          cells — each `w-px -translate-x-1/2` at a sixth of the measure, which
          is exactly how the page's rails are placed. Each one lands on the
          rail it continues, so a column is one line at one weight from the top
          of the page to the bottom of it, instead of the band's own edge
          sitting a half-pixel off the rail above and the pair reading as a
          doubled rule. Over the cells rather than behind them: the cells are
          opaque and would hide the rails otherwise. */}
      {onRails ? (
        <div
          aria-hidden
          // AT THE RAILS' OWN BREAKPOINT. The spans are sixths of this
          // section's box, which is the 1200 measure exactly only from 1200up,
          // where the section drops its padding. Below that the box is the
          // viewport and a span at 100% would land on the window's edge rather
          // than the band's — and there are no rails down there to line up
          // with anyway, so the gap bed draws the verticals instead.
          className="pointer-events-none absolute inset-y-0 left-0 right-0 hidden min-[1200px]:block"
        >
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <span
              key={i}
              style={{ left: `${(i / 6) * 100}%` }}
              className={`absolute inset-y-0 w-px -translate-x-1/2 ${
                lineClass ?? "bg-border [[data-theme=dark]_&]:bg-[#383838]"
              }`}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
