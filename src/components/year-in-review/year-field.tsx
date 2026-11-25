"use client";

import { useEffect, useRef } from "react";

// One square per cell of a dense grid: the year drawn as activity, quiet on the
// left and busier to the right, so the artwork carries the growth the piece is
// about. Sizes are CSS pixels.
const CELL = 9;
const PITCH = 13;
// How far the cursor's light reaches, and how fast it follows the pointer.
const GLOW_RADIUS = 140;
const FOLLOW = 0.12;
// The fade at the field's edges, so it dissolves into the page instead of
// ending on a hard line.
const EDGE_FADE = 96;
// After this long without the pointer, the light drifts on its own.
const IDLE_MS = 2200;

function parseColor(value: string): [number, number, number] {
  const hex = value.trim().replace("#", "");
  const full =
    hex.length === 3
      ? hex
          .split("")
          .map((c) => c + c)
          .join("")
      : hex;
  const n = parseInt(full, 16);
  return Number.isNaN(n)
    ? [16, 17, 20]
    : [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

// A cheap deterministic hash, so the field looks the same on every visit.
function hash(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

/**
 * The hero's artwork: a faint field of squares behind the title that lights up
 * around the cursor. Ink only, read from --foreground, so it follows the theme.
 */
export function YearField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let activity = new Float32Array(0);
    let ink: [number, number, number] = [16, 17, 20];
    const pointer = { x: 0, y: 0, tx: 0, ty: 0, lastMove: -Infinity };
    let frame = 0;
    let visible = true;

    const readInk = () => {
      ink = parseColor(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--foreground",
        ),
      );
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(width / PITCH);
      rows = Math.ceil(height / PITCH);
      activity = new Float32Array(cols * rows);
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const progress = Math.pow(x / Math.max(cols - 1, 1), 1.4);
          const r = hash(x, y);
          // Most cells stay empty; more of them switch on as the year goes on.
          activity[y * cols + x] =
            r < 0.25 + progress * 0.55 ? 0.25 + hash(y, x) * 0.75 : 0;
        }
      }
      if (pointer.lastMove === -Infinity) {
        pointer.x = pointer.tx = width * 0.5;
        pointer.y = pointer.ty = height * 0.5;
      }
    };

    const draw = (time: number) => {
      // Idle: the light wanders a slow loop across the field.
      if (time - pointer.lastMove > IDLE_MS) {
        const t = time / 1000;
        pointer.tx = width * (0.5 + 0.38 * Math.sin(t * 0.21));
        pointer.ty = height * (0.5 + 0.32 * Math.sin(t * 0.37 + 1.3));
      }
      pointer.x += (pointer.tx - pointer.x) * FOLLOW;
      pointer.y += (pointer.ty - pointer.y) * FOLLOW;

      ctx.clearRect(0, 0, width, height);
      const [r, g, b] = ink;
      const cx = width / 2;
      const cy = height / 2;
      const sigma2 = 2 * GLOW_RADIUS * GLOW_RADIUS;
      const textX = 2 * (width * 0.24) ** 2;
      const textY = 2 * (height * 0.26) ** 2;

      for (let y = 0; y < rows; y++) {
        const py = y * PITCH + (PITCH - CELL) / 2;
        for (let x = 0; x < cols; x++) {
          const a = activity[y * cols + x];
          const px = x * PITCH + (PITCH - CELL) / 2;
          const dx = px - pointer.x;
          const dy = py - pointer.y;
          const glow = Math.exp(-(dx * dx + dy * dy) / sigma2);
          let alpha = a * 0.07 + glow * (0.05 + a * 0.5);
          if (alpha < 0.008) continue;
          const edge = Math.min(px, py, width - px - CELL, height - py - CELL);
          alpha *= Math.min(Math.max(edge / EDGE_FADE, 0), 1);
          // Quieter behind the title so the words stay the first thing read.
          alpha *=
            1 -
            0.6 * Math.exp(-((px - cx) ** 2) / textX - (py - cy) ** 2 / textY);
          ctx.fillStyle = `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
          ctx.fillRect(px, py, CELL, CELL);
        }
      }
    };

    const loop = (time: number) => {
      draw(time);
      if (visible) frame = requestAnimationFrame(loop);
    };

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
      pointer.tx = x;
      pointer.ty = y;
      pointer.lastMove = performance.now();
    };

    readInk();
    resize();

    // The site's theme toggle flips data-theme on <html>.
    const themeObserver = new MutationObserver(() => {
      readInk();
      if (reduceMotion) draw(0);
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (reduceMotion) draw(0);
    });
    resizeObserver.observe(canvas);

    if (reduceMotion) {
      draw(0);
      return () => {
        themeObserver.disconnect();
        resizeObserver.disconnect();
      };
    }

    // Only animate while the hero is on screen.
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(frame);
      if (visible) frame = requestAnimationFrame(loop);
    });
    visibility.observe(canvas);
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      visibility.disconnect();
      themeObserver.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 size-full"
    />
  );
}
