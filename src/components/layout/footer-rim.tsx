"use client";

import { useEffect, useRef } from "react";

// The sign-up rim glow from the onboarding prototype: two stepped bars rising
// from each bottom corner, blurred, with the brand palette flowing through them.
// Pixels are written with alpha rather than blended onto white, so the same
// canvas sits on the light and the dark footer.

// Drawn in logical units: the band is the bottom 450 units of the prototype's
// 1000-unit-tall screen. A box narrower than MIN_W units is scaled down evenly
// to fit its width rather than squeezed, so a phone gets the desktop corners in
// miniature, never two sides overlapping into one flat band.
const H = 450;
const MIN_W = 1400;
// On those narrow boxes the bars rise up to this much taller, so the glow still
// fills the band instead of shrinking to a thin line along the bottom.
const MAX_LIFT = 2.4;
const BARS = [
  // Inner edge as a share of the width, top (in the 450-unit band), opacity.
  { x: 0.631, y: 250, o: 0.6 },
  { x: 0.731, y: 350, o: 1 },
];
const RADIUS = 170;
const FAR = 4000;
// The bars' inner sides slope at this angle below horizontal. The prototype's
// 45 degrees met in a deep V in the middle of a wide footer; a gentler slope
// lets the two halves meet higher, so the dip stays shallow.
const SIDE_ANGLE = (24 * Math.PI) / 180;
// Blur widths in logical units; frames ease between the two so the glow breathes.
const BLUR_TIGHT = 36;
const BLUR_WIDE = 64;
// Every brand color but Off-white, ordered so each neighbor blends cleanly
// (warm through yellow and green into the blues), and the loop closes
// Technical Blue back into Lavender.
const LOOP = [
  "#C5B3FF", // Lavender
  "#FFDAFC", // Soothing Pink
  "#FF9092", // Warm Red
  "#D6F990", // Vibrant Yellow
  "#5BE4C2", // Bright Green
  "#BCE7F4", // Assembly Blue
  "#7DA4FF", // Technical Blue
];
const LUT_SIZE = 600;
const CANVAS_SCALE = 0.25;
const FRAME_MS = 1000 / 30;
const BREATHE_S = 10;
// The color drift is sized in screen pixels, at the scale it has under the
// prototype's sign-up form. Below WAVE_REF_W it shrinks with the width: at a
// fixed size a phone only spans a slice of it and the band went one flat color.
const WAVE_PX = 925;
const WAVE_REF_W = 1024;
const GRAIN_URL = `url("data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>",
)}")`;
const DARK_STRENGTH_BOOST = 1.8;
const RESIZE_SETTLE_MS = 150;

function buildLut() {
  const hex = (c: string) =>
    [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const lut = new Float32Array(LUT_SIZE * 3);
  for (let i = 0; i < LUT_SIZE; i++) {
    const v = (i / LUT_SIZE) * LOOP.length;
    const k = Math.floor(v);
    const t = v - k;
    const e = t * t * (3 - 2 * t);
    const a = hex(LOOP[k % LOOP.length]);
    const b = hex(LOOP[(k + 1) % LOOP.length]);
    for (let j = 0; j < 3; j++) lut[i * 3 + j] = a[j] + (b[j] - a[j]) * e;
  }
  return lut;
}

// One bar: flat top running out past the edge, a rounded inner corner, then a
// side falling away below the box at SIDE_ANGLE.
function barPath(W: number, x: number, y: number, r: number, flip: boolean) {
  const sin = Math.sin(SIDE_ANGLE);
  const cos = Math.cos(SIDE_ANGLE);
  const ex = x + r - r * sin;
  const ey = y + r - r * cos;
  const X = (v: number) => (flip ? W - v : v);
  const sweep = flip ? 1 : 0;
  return new Path2D(
    `M${X(W + FAR)} ${y} L${X(x + r)} ${y} A${r} ${r} 0 0 ${sweep} ${X(ex)} ${ey} L${X(ex - cos * FAR)} ${ey + sin * FAR} L${X(W + FAR)} ${ey + sin * FAR} Z`,
  );
}

function shapeField(
  W: number,
  Hl: number,
  lift: number,
  w: number,
  h: number,
  blurUnits: number,
) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) return new Float32Array(w * h);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = "lighten";
  ctx.filter = `blur(${blurUnits * (h / Hl)}px)`;
  ctx.save();
  ctx.scale(w / W, h / Hl);
  for (const flip of [false, true]) {
    for (const b of BARS) {
      ctx.fillStyle = `rgba(255,255,255,${b.o})`;
      ctx.fill(barPath(W, b.x * W, Hl - (H - b.y) * lift, RADIUS, flip));
    }
  }
  ctx.restore();
  const d = ctx.getImageData(0, 0, w, h).data;
  const a = new Float32Array(w * h);
  for (let i = 0; i < a.length; i++) a[i] = d[i * 4] / 255;
  return a;
}

// Soft light is not quite neutral on the page's near-white and near-black, so
// the grain is masked to the glow's widest shape and never greys the ground.
function maskGrain(
  el: HTMLDivElement | null,
  field: Float32Array,
  w: number,
  h: number,
) {
  if (!el) return;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) return;
  const img = ctx.createImageData(w, h);
  for (let n = 0; n < field.length; n++)
    img.data[n * 4 + 3] = Math.min(1, field[n] * 1.15) * 255;
  ctx.putImageData(img, 0, 0);
  const mask = `url(${c.toDataURL()})`;
  el.style.maskImage = mask;
  el.style.webkitMaskImage = mask;
  el.style.maskSize = "100% 100%";
  el.style.webkitMaskSize = "100% 100%";
}

export function FooterRim({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const grainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const out = el?.getContext("2d");
    if (!el || !out) return;
    const lut = buildLut();
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t0 = performance.now();
    let W = MIN_W,
      Hl = H,
      w = 0,
      h = 0,
      boxW = 0,
      boxH = 0;
    let tight = new Float32Array(0),
      wide = new Float32Array(0);
    let img: ImageData | null = null;
    let visible = false;
    let timer = 0;

    // The canvas follows its box's aspect at every width, so nothing is
    // cropped or stretched, and a resize redraws the same composition.
    const layout = () => {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const unit = Math.max(H / r.height, MIN_W / r.width);
      boxW = r.width;
      boxH = r.height;
      W = r.width * unit;
      Hl = r.height * unit;
      const lift = Math.min(MAX_LIFT, Hl / H);
      w = Math.max(1, Math.round(r.width * CANVAS_SCALE));
      h = Math.max(1, Math.round(r.height * CANVAS_SCALE));
      el.width = w;
      el.height = h;
      // The blur grows with the lift: at the desktop width on a phone's scale
      // it was a few pixels, and the two bars showed as hard steps.
      const soften = Math.sqrt(lift);
      tight = shapeField(W, Hl, lift, w, h, BLUR_TIGHT * soften);
      wide = shapeField(W, Hl, lift, w, h, BLUR_WIDE * soften);
      maskGrain(grainRef.current, wide, w, h);
      img = out.createImageData(w, h);
      draw();
    };

    const draw = () => {
      if (!img) return;
      const d = img.data;
      const t = still ? 0 : (performance.now() - t0) / 1000;
      const mix = (1 - Math.cos((t * 2 * Math.PI) / BREATHE_S)) / 2;
      const dark = document.documentElement.dataset.theme === "dark";
      const wave = WAVE_PX * Math.sqrt(Math.min(1, boxW / WAVE_REF_W));
      for (let y = 0, n = 0; y < h; y++) {
        // Measured up from the bottom, like the prototype's full screen.
        const yy = 1 - ((1 - y / h) * boxH) / wave;
        for (let x = 0; x < w; x++, n++) {
          const a = tight[n] + (wide[n] - tight[n]) * mix;
          const i = n * 4;
          if (a < 0.004) {
            d[i + 3] = 0;
            continue;
          }
          const xx = ((x / w) * boxW) / (wave * 1.6);
          const wx = xx * 2.2 + Math.sin(yy * 3.1 + t * 0.21) * 0.6;
          const wy = yy * 2.6 + Math.sin(xx * 2.7 - t * 0.17) * 0.5;
          const f =
            0.5 +
            0.25 *
              Math.sin(
                wx * 2.3 + t * 0.13 + Math.sin(wy * 1.9 - t * 0.11) * 1.4,
              ) +
            0.25 *
              Math.sin(
                wy * 2.1 - t * 0.09 + Math.sin(wx * 1.6 + t * 0.15) * 1.2,
              );
          const li =
            (((Math.floor((f + t * 0.02) * LUT_SIZE) % LUT_SIZE) + LUT_SIZE) %
              LUT_SIZE) *
            3;
          const k = Math.min(1, a * 1.15);
          d[i] = lut[li];
          d[i + 1] = lut[li + 1];
          d[i + 2] = lut[li + 2];
          // On white a pale color nearly vanishes and only the strong ones
          // show, which is what gives the light glow its pattern. On black
          // every color showed at full strength, so dark weights each one by
          // how far it stands from white and lets the pale ones sink into the
          // black the same way.
          const strength = dark
            ? Math.min(
                1,
                ((255 - Math.min(lut[li], lut[li + 1], lut[li + 2])) / 255) *
                  DARK_STRENGTH_BOOST,
              )
            : 1;
          d[i + 3] = k * strength * 255;
        }
      }
      out.putImageData(img, 0, 0);
    };

    // Only animates while on screen and the tab is visible.
    const tick = () => {
      timer = 0;
      if (!visible || document.hidden || still) return;
      draw();
      timer = window.setTimeout(tick, FRAME_MS);
    };
    const resume = () => {
      if (!timer) tick();
    };

    layout();
    // Rebuilding the shape is slow enough that doing it on every step of a
    // window drag dropped frames, and the browser filled the newly exposed
    // edge with a bare strip until it caught up. The canvas is stretched to its
    // box, so the last frame covers the new width while dragging and the shape
    // is rebuilt once the size settles.
    let pending = 0;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(pending);
      pending = window.setTimeout(layout, RESIZE_SETTLE_MS);
    });
    ro.observe(el);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) resume();
    });
    io.observe(el);
    document.addEventListener("visibilitychange", resume);
    // Redraw on a theme switch, which matters when reduced motion holds a still frame.
    const mo = new MutationObserver(() => draw());
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      ro.disconnect();
      mo.disconnect();
      window.clearTimeout(pending);
      io.disconnect();
      document.removeEventListener("visibilitychange", resume);
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <canvas
        ref={ref}
        aria-hidden
        className={`block h-full w-full ${className}`}
      />
      {/* The identity's mono grain. Soft light leaves pure white and pure black
          as they are, so the grain sits only on the glow, in either theme. */}
      <div
        ref={grainRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-25 mix-blend-soft-light"
        style={{ backgroundImage: GRAIN_URL }}
      />
    </>
  );
}
