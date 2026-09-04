/**
 * Picking a readable tile colour from a firm's brand colour.
 *
 * The logo slot is painted in the colour the firm already uses for its client
 * sidebar, so the page looks like the portal the visitor just left. That colour
 * is chosen for a sidebar, though, not as a background for a white mark: a
 * bright lime or a pale blue leaves the logo unreadable.
 *
 * Rather than give up and switch to a neutral tile, the colour is walked down
 * its own hue until white reads against it. The result is still recognisably
 * the firm's colour, just the deeper end of it.
 */

/** WCAG AA for large text and graphics against white. */
const MIN_CONTRAST = 4.5;

/**
 * How far the tile must stand off the page behind it.
 *
 * Well under a text threshold on purpose: this is only asking that the square
 * be visible as a square. It exists because a firm's brand colour is quite
 * often black, and a black tile on the near-black dark theme disappears
 * entirely, ring and all.
 */
const MIN_GROUND_CONTRAST = 1.6;

/** The page behind the tile, per theme. */
export const PAGE_GROUND = { light: "#ffffff", dark: "#0a0a0a" } as const;

export function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const n = Number.parseInt(full.slice(0, 6), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex([r, g, b]: [number, number, number]) {
  return `#${[r, g, b].map((c) => Math.round(c).toString(16).padStart(2, "0")).join("")}`;
}

/** WCAG relative luminance. */
function luminance([r, g, b]: [number, number, number]) {
  const [R, G, B] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/** Contrast of white against the given colour. */
export function contrastWithWhite(rgb: [number, number, number]) {
  return 1.05 / (luminance(rgb) + 0.05);
}

function contrast(a: [number, number, number], b: [number, number, number]) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Saturation alone, for deciding whether a colour carries any hue at all. */
export function saturationOf(hex: string) {
  return rgbToHsl(hexToRgb(hex)).s;
}

function rgbToHsl([r, g, b]: [number, number, number]) {
  const [R, G, B] = [r / 255, g / 255, b / 255];
  const max = Math.max(R, G, B);
  const min = Math.min(R, G, B);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h =
    max === R
      ? ((G - B) / d + (G < B ? 6 : 0)) / 6
      : max === G
        ? ((B - R) / d + 2) / 6
        : ((R - G) / d + 4) / 6;
  return { h, s, l };
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  if (s === 0) {
    const v = Math.round(l * 255);
    return [v, v, v];
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const channel = (t: number) => {
    let x = t;
    if (x < 0) x += 1;
    if (x > 1) x -= 1;
    if (x < 1 / 6) return p + (q - p) * 6 * x;
    if (x < 1 / 2) return q;
    if (x < 2 / 3) return p + (q - p) * (2 / 3 - x) * 6;
    return p;
  };
  return [
    Math.round(channel(h + 1 / 3) * 255),
    Math.round(channel(h) * 255),
    Math.round(channel(h - 1 / 3) * 255),
  ];
}

/**
 * The firm's colour, moved along its own hue only as far as two constraints
 * require. A colour that already satisfies both comes back untouched.
 *
 *  1. White has to be readable on it, for the initial the tile falls back to.
 *     A pale brand (a lime, a soft blue) fails this, and gets darkened.
 *  2. The tile has to be visible against the page. A black or near-black brand
 *     passes the first test easily and then vanishes into the dark theme, so it
 *     gets lightened.
 *
 * The two only ever pull the same way at once in light mode, where the ground is
 * white and both want the colour darker. In dark mode the window between them is
 * wide, so there is always an answer.
 */
export function readableTileColor(brandColor: string, ground: string): string {
  const rgb = hexToRgb(brandColor);
  const groundRgb = hexToRgb(ground);
  const ok = (c: [number, number, number]) =>
    contrastWithWhite(c) >= MIN_CONTRAST &&
    contrast(c, groundRgb) >= MIN_GROUND_CONTRAST;

  if (ok(rgb)) return brandColor;

  const { h, s, l } = rgbToHsl(rgb);
  // Walked in small steps rather than solved for: the relationship between HSL
  // lightness and relative luminance is neither linear nor hue-independent (a
  // yellow at l=0.5 is far brighter than a blue at the same value).
  //
  // Outward from where the firm set it, nearest first, so the answer stays as
  // close to their colour as the constraints allow.
  for (let step = 0.02; step <= 1; step += 0.02) {
    for (const candidate of [l - step, l + step]) {
      if (candidate < 0.04 || candidate > 0.96) continue;
      const next = hslToRgb(h, s, candidate);
      if (ok(next)) return rgbToHex(next);
    }
  }
  // Unreachable for any real colour, but a tile is better than nothing.
  return rgbToHex(hslToRgb(h, s, 0.3));
}
