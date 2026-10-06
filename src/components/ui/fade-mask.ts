// ─────────────────────────────────────────────────────────────────────────
// FADE MASK — the one curve every cropped picture on the site dissolves on.
//
// A mask, never a gradient overlay: it fades to whatever ground it is sitting
// on, so light and dark need no second value and nothing is painted over the
// art.
//
// Eased and LONG, and both halves of that matter.
//
// Eased: a two-stop ramp (#000 to 68%, transparent at 97%) puts a corner in
// the alpha curve at each end. On a flat panel — the Build card's near-black
// sidebar is the worst case — a corner reads as a line, so the "fade"
// announced itself twice instead of smoothing. These stops approximate an
// ease-in-out: barely any alpha lost where the fade begins, the bulk of it
// through the middle, and a long flat tail into nothing. No stretch of the run
// changes rate sharply enough to read as an edge.
//
// Long: easing alone was not enough. A dark panel dissolving over a light card
// is the highest-contrast thing this mask ever does, and compressed into the
// last quarter it reads as a grey band laid over the picture rather than as
// the picture giving out. Spread over most of the run it is slow enough that
// no part of it reads as a feature.
//
// `start` is where the ramp leaves full opacity. The early stops are
// deliberately tiny — a percent or two of alpha across the first third of the
// run — so content up there is not visibly dimmed to buy that length.
// ─────────────────────────────────────────────────────────────────────────

/** Alpha at each tenth of the run, after `start`. An eased-in-out curve. */
const CURVE = [
  [0.08, 0.995],
  [0.17, 0.98],
  [0.26, 0.95],
  [0.35, 0.9],
  [0.44, 0.82],
  [0.53, 0.72],
  [0.62, 0.6],
  [0.7, 0.47],
  [0.78, 0.34],
  [0.85, 0.22],
  [0.91, 0.12],
  [0.96, 0.05],
  [1, 0],
] as const;

export type FadeDirection = "to right" | "to bottom" | "to left" | "to top";

/**
 * The ramp as a `mask-image` value.
 *
 * @param direction which edge the picture gives out at.
 * @param start percentage of the run that stays fully opaque.
 * @param end percentage the ramp has finished by. Short of 100 where the art
 *   itself stops before the box does, so its last edge lands in nothing rather
 *   than in the tail of the ramp — a rounded corner at 20% alpha is still a
 *   visible corner, which is what "the bottom doesn't blend" looks like.
 */
export function fadeMask(direction: FadeDirection, start: number, end = 100) {
  const span = end - start;
  const stops = CURVE.map(
    ([t, alpha]) =>
      `rgba(0,0,0,${alpha}) ${(start + t * span).toFixed(2)}%`,
  ).join(", ");
  return `linear-gradient(${direction}, #000 0 ${start}%, ${stops}${
    end < 100 ? ", transparent 100%" : ""
  })`;
}

/** Both edges at once, for a picture that is cropped on two sides. */
export function fadeMaskStyle(
  masks: string[],
): React.CSSProperties & Record<string, string> {
  const value = masks.join(", ");
  return {
    WebkitMaskImage: value,
    maskImage: value,
    // Each layer keeps its own alpha and the result is their intersection, so
    // a corner cropped on two edges fades once rather than twice as dark.
    WebkitMaskComposite: "source-in",
    maskComposite: "intersect",
  };
}
