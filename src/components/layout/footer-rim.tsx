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
const MAX_LIFT = 1.6;
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
// On the dark footer a long soft edge mixes each pastel with black and reads
// as a muddy haze, so the edge is cut shorter there and the colors stay clean.
const DARK_EDGE_START = 0.04;
const DARK_EDGE_SPAN = 0.9;
// The color drift is sized in screen pixels, at the scale it has under the
// prototype's sign-up form, so it reads the same on a phone and a desktop.
const WAVE_PX = 925;

function buildLut() {
  const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
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

function shapeField(W: number, Hl: number, lift: number, w: number, h: number, blurUnits: number) {
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

export function FooterRim({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = ref.current;
    const out = el?.getContext("2d");
    if (!el || !out) return;
    const lut = buildLut();
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t0 = performance.now();
    let W = MIN_W, Hl = H, w = 0, h = 0, boxW = 0, boxH = 0;
    let tight = new Float32Array(0), wide = new Float32Array(0);
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
      tight = shapeField(W, Hl, lift, w, h, BLUR_TIGHT);
      wide = shapeField(W, Hl, lift, w, h, BLUR_WIDE);
      img = out.createImageData(w, h);
      draw();
    };

    const draw = () => {
      if (!img) return;
      const d = img.data;
      const t = still ? 0 : (performance.now() - t0) / 1000;
      const mix = (1 - Math.cos((t * 2 * Math.PI) / BREATHE_S)) / 2;
      const dark = document.documentElement.dataset.theme === "dark";
      for (let y = 0, n = 0; y < h; y++) {
        // Measured up from the bottom, like the prototype's full screen.
        const yy = 1 - ((1 - y / h) * boxH) / WAVE_PX;
        for (let x = 0; x < w; x++, n++) {
          const a = tight[n] + (wide[n] - tight[n]) * mix;
          const i = n * 4;
          if (a < 0.004) {
            d[i + 3] = 0;
            continue;
          }
          const xx = ((x / w) * boxW) / (WAVE_PX * 1.6);
          const wx = xx * 2.2 + Math.sin(yy * 3.1 + t * 0.21) * 0.6;
          const wy = yy * 2.6 + Math.sin(xx * 2.7 - t * 0.17) * 0.5;
          const f =
            0.5 +
            0.25 * Math.sin(wx * 2.3 + t * 0.13 + Math.sin(wy * 1.9 - t * 0.11) * 1.4) +
            0.25 * Math.sin(wy * 2.1 - t * 0.09 + Math.sin(wx * 1.6 + t * 0.15) * 1.2);
          const li = (((Math.floor((f + t * 0.02) * LUT_SIZE) % LUT_SIZE) + LUT_SIZE) % LUT_SIZE) * 3;
          d[i] = lut[li];
          d[i + 1] = lut[li + 1];
          d[i + 2] = lut[li + 2];
          let k = Math.min(1, a * 1.15);
          if (dark) {
            const e = Math.min(1, Math.max(0, (k - DARK_EDGE_START) / DARK_EDGE_SPAN));
            k = e * e * (3 - 2 * e);
          }
          d[i + 3] = k * 255;
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
    const ro = new ResizeObserver(() => layout());
    ro.observe(el);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) resume();
    });
    io.observe(el);
    document.addEventListener("visibilitychange", resume);
    // Redraw on a theme switch, which matters when reduced motion holds a still frame.
    const mo = new MutationObserver(() => draw());
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    return () => {
      ro.disconnect();
      mo.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", resume);
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={`block h-full w-full ${className}`} />;
}
