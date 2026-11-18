"use client";

import { useEffect, useRef } from "react";

// The sign-up screen's rim glow (onboarding prototype): two stepped bars rising
// from each bottom corner, softened, with the brand palette flowing through
// them like clouds. The shape is blurred once; each frame only recolors it.
// The sign-up screen draws it in a wide 1600x1000 frame with the bars in the
// bottom fifth; here the frame has the panel's shape, and the bars rise
// a little higher so the color reads at card size without reaching the price.
const W = 600;
const H = 480;
const FAR = 2000;
const SCALE = 0.5;
const BAR_RADIUS = 100;
const FRAME_MS = 1000 / 30;
// Lavender, Soothing Pink, Warm Red, Technical Blue, Assembly Blue and the
// brand green, as a loop so the flowing color never hits an edge.
const LOOP = ["#C5B3FF", "#FFDAFC", "#FF9092", "#FFDAFC", "#7DA4FF", "#BCE7F4", "#D6F990"];
const LUT_SIZE = 600;
// The panel's own fill under the glow: the other plans' panel gray (--muted),
// so the top of the card reads as a panel rather than blending into the page.
const BASE = [0xf6, 0xf7, 0xf9];

function rise(x: number, y: number, rr: number, flip: boolean) {
  const q = rr * Math.SQRT1_2;
  const X = (v: number) => (flip ? W - v : v);
  const sw = flip ? 1 : 0;
  return `M${X(W + FAR)} ${y} L${X(x + rr)} ${y} A${rr} ${rr} 0 0 ${sw} ${X(x + rr - q)} ${y + rr - q} L${X(x + rr - q - FAR)} ${y + rr - q + FAR} L${X(W + FAR)} ${y + FAR} Z`;
}

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

export function PlanGlow({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const w = W * SCALE;
    const h = H * SCALE;
    const bars = [false, true].flatMap((f) => [
      { p: new Path2D(rise(W * 0.58, H * 0.66, BAR_RADIUS, f)), o: 0.6 },
      { p: new Path2D(rise(W * 0.72, H * 0.82, BAR_RADIUS, f)), o: 1 },
    ]);
    // The shape's softness at a tight and a wide blur; frames ease between them.
    const field = (blur: number) => {
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      const x = c.getContext("2d", { willReadFrequently: true })!;
      x.fillStyle = "#000";
      x.fillRect(0, 0, w, h);
      x.globalCompositeOperation = "lighten";
      x.filter = `blur(${blur}px)`;
      x.save();
      x.scale(SCALE, SCALE);
      bars.forEach((b) => {
        x.fillStyle = `rgba(255,255,255,${b.o})`;
        x.fill(b.p);
      });
      x.restore();
      const d = x.getImageData(0, 0, w, h).data;
      const a = new Float32Array(w * h);
      for (let i = 0; i < a.length; i++) a[i] = d[i * 4] / 255;
      return a;
    };
    const tight = field(10);
    const wide = field(18);
    const lut = buildLut();

    el.width = w;
    el.height = h;
    const out = el.getContext("2d")!;
    const img = out.createImageData(w, h);
    const d = img.data;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t0 = performance.now();

    const draw = () => {
      const t = still ? 0 : (performance.now() - t0) / 1000;
      const mix = (1 - Math.cos((t * 2 * Math.PI) / 10)) / 2;
      for (let y = 0, n = 0; y < h; y++) {
        const yy = y / h;
        for (let x = 0; x < w; x++, n++) {
          const a = tight[n] + (wide[n] - tight[n]) * mix;
          const i = n * 4;
          if (a < 0.004) {
            d[i] = BASE[0];
            d[i + 1] = BASE[1];
            d[i + 2] = BASE[2];
            d[i + 3] = 255;
            continue;
          }
          // Domain-warped waves, layered into each other, so the color drifts.
          const xx = x / w;
          const wx = xx * 2.2 + Math.sin(yy * 3.1 + t * 0.21) * 0.6;
          const wy = yy * 2.6 + Math.sin(xx * 2.7 - t * 0.17) * 0.5;
          const f =
            0.5 +
            0.25 * Math.sin(wx * 2.3 + t * 0.13 + Math.sin(wy * 1.9 - t * 0.11) * 1.4) +
            0.25 * Math.sin(wy * 2.1 - t * 0.09 + Math.sin(wx * 1.6 + t * 0.15) * 1.2);
          const li = ((Math.floor((f + t * 0.02) * LUT_SIZE) % LUT_SIZE) + LUT_SIZE) % LUT_SIZE * 3;
          const k = Math.min(1, a * 1.15);
          d[i] = BASE[0] + (lut[li] - BASE[0]) * k;
          d[i + 1] = BASE[1] + (lut[li + 1] - BASE[1]) * k;
          d[i + 2] = BASE[2] + (lut[li + 2] - BASE[2]) * k;
          d[i + 3] = 255;
        }
      }
      out.putImageData(img, 0, 0);
    };

    draw();
    if (still) return;
    // Only animate while the panel is on screen.
    let visible = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const loop = () => {
      draw();
      timer = setTimeout(loop, FRAME_MS);
    };
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !visible) {
        visible = true;
        loop();
      } else if (!entry.isIntersecting && visible) {
        visible = false;
        clearTimeout(timer);
      }
    });
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={className} />;
}
