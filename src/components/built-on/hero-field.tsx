"use client";

import { useEffect, useRef } from "react";

import { useTheme } from "@/components/theme/theme-provider";
import { saturationOf } from "@/lib/built-on-color";

/**
 * The drifting dot field behind the hero.
 *
 * A grid of small squares whose size and opacity are driven by a slow wave
 * field, so the pattern reads as one shape breathing rather than as individual
 * dots moving. Dithered rather than smooth on purpose: a soft colour wash behind
 * a headline is the thing every landing page does, and the grid keeps it
 * quieter while still carrying the firm's colour.
 *
 * Colour comes from the workspace. Without one it falls back to the middle of
 * Assembly's own aurora, so the page is never colourless.
 */

/** #4f6bf9, the aurora's mid stop. Used when the workspace has no brand colour. */
const ASSEMBLY_BLUE = "#4f6bf9";

/** Cell pitch. Roughly the advance width of the mono at GLYPH_SIZE. */
const SPACING = 15;
const GLYPH_SIZE = 12;

/**
 * The ramp, lightest to heaviest. Characters rather than dots: a dot field is
 * a texture, but a character field reads as something being drawn, which is the
 * point. Sloped and crossed forms in the middle give the shape its grain.
 */
const GLYPHS = [".", ":", "-", "/", "\\", "x", "A", "#"];
/** Seconds for one pass of the slower of the two waves. */
const PERIOD = 26;

/**
 * Empty bands at the top and bottom of the hero.
 *
 * The nav is sticky and passes over the hero as the page scrolls, so glyphs
 * that run to the top edge get sliced by it, and the field reads as cut off
 * rather than as fading out. The bottom band does the same job for the rule
 * that closes the hero.
 */
const TOP_CLEAR = 96;
const TOP_FADE = 130;
const BOTTOM_CLEAR = 24;
const BOTTOM_FADE = 90;

/**
 * The block the copy occupies, kept empty.
 *
 * A radial falloff was clearing a circle, which is the wrong shape for a column
 * of text: it left glyphs running under the sub-headline and around the button
 * while wasting the space beside the headline. This is the text column instead,
 * as a rounded box the field feathers away from.
 */
/** Half the copy column, in px, capped so narrow viewports still clear it. */
const COPY_HALF_WIDTH = 430;
/** How far down the hero the copy reaches, as a fraction of its height. */
const COPY_BOTTOM = 0.68;
/** The distance the field takes to come back to full strength outside it. */
const COPY_FEATHER = 150;

function toRgb(hex: string): [number, number, number] {
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

/**
 * The colour the glyphs are drawn in.
 *
 * A brand colour with no hue in it — black, white, a grey, which plenty of
 * firms pick — would make the field a grey haze, so the field takes Assembly's
 * blue instead and the tile keeps the firm's actual colour. The tile is
 * identity and has to be theirs; the field is atmosphere and only has to carry
 * colour.
 */
const MIN_FIELD_SATURATION = 0.12;

function fieldRgb(color: string | undefined, dark: boolean) {
  const usable =
    color && saturationOf(color) >= MIN_FIELD_SATURATION ? color : undefined;
  const raw = toRgb(usable || ASSEMBLY_BLUE);
  return dark
    ? (raw.map((c) => Math.round(c + (255 - c) * 0.45)) as [
        number,
        number,
        number,
      ])
    : raw;
}

export function HeroField({ color }: { color?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // A dark brand colour on the near-black ground is invisible, and half the
    // firms that pick one pick a navy or a forest. fieldRgb lifts it toward
    // white in dark mode, keeping the hue and giving it something to sit
    // against.
    const [r, g, b] = fieldRgb(color, theme === "dark");
    // Canvas does not resolve CSS variables, so the family is read off the
    // document rather than named again here. Written as a var() the whole
    // assignment is invalid and the context silently keeps 10px sans-serif,
    // which puts the glyphs off the grid at the wrong size.
    const mono =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--font-diatype-mono")
        .trim() || "ui-monospace, monospace";

    const still = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let width = 0;
    let height = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      if (!width || !height) return;
      // Set every frame: a resize resets the context state along with the
      // transform, and a font lost here silently falls back to sans, where the
      // glyphs stop lining up on the grid.
      ctx.font = `${GLYPH_SIZE}px ${mono}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const cx = width / 2;
      const halfW = Math.min(width * 0.46, COPY_HALF_WIDTH);
      const copyBottom = height * COPY_BOTTOM;

      for (let y = SPACING / 2; y < height; y += SPACING) {
        for (let x = SPACING / 2; x < width; x += SPACING) {
          // Two waves at unrelated angles and speeds. Their sum never repeats
          // on a short cycle, which is what stops the grid from pulsing.
          const wave =
            Math.sin(x * 0.011 + y * 0.007 - t * 0.55) +
            Math.sin(x * -0.006 + y * 0.013 + t * 0.37);

          // Distance outside the copy box: zero anywhere inside it, then
          // ramping back to full strength over COPY_FEATHER px.
          const dx = Math.max(0, Math.abs(x - cx) - halfW);
          const dy = Math.max(0, y - copyBottom);
          const falloff = Math.min(1, Math.hypot(dx, dy) / COPY_FEATHER);

          // Only the crests are drawn. A low cutoff filled the hero evenly and
          // read as paper texture; cutting most of the field away is what makes
          // the rest clump into a shape.
          const crest = ((wave + 2) / 4 - 0.52) / 0.48;
          if (crest <= 0) continue;
          const edge =
            Math.min(1, Math.max(0, (y - TOP_CLEAR) / TOP_FADE)) *
            Math.min(1, Math.max(0, (height - BOTTOM_CLEAR - y) / BOTTOM_FADE));

          const intensity = crest * falloff * edge;
          if (intensity < 0.06) continue;

          // The glyph is picked by intensity, so a cell climbing through the
          // wave steps up the ramp rather than only fading in. That stepping is
          // what makes the field read as characters resolving.
          const glyph =
            GLYPHS[
              Math.min(GLYPHS.length - 1, Math.floor(intensity * GLYPHS.length))
            ];
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${(0.28 + intensity * 0.62).toFixed(3)})`;
          ctx.fillText(glyph, x, y);
        }
      }
    };

    let raf = 0;
    const start = performance.now();
    const loop = (now: number) => {
      draw(((now - start) / 1000) * ((2 * Math.PI) / PERIOD));
      raf = requestAnimationFrame(loop);
    };

    resize();
    if (still) {
      draw(0);
    } else {
      raf = requestAnimationFrame(loop);
    }

    const onResize = () => {
      resize();
      if (still) draw(0);
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [color, theme]);

  // The glyphs and nothing else. A colour wash behind them was tried and read
  // as a glow rather than as a ground, which is exactly the effect the dithered
  // grid exists to avoid.
  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 size-full"
    />
  );
}
