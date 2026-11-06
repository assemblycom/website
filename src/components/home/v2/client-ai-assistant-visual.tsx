"use client";

import { useEffect, useRef } from "react";
import { GRAIN } from "@/components/comparison/brand-panel";
import { MOCK_FIGURE, MOCK_PRIMARY } from "@/components/ui/mock-type";

const LINE = "border-[var(--mock-line)]";
const INK = "text-[color:var(--mock-ink)]";

/**
 * The mesh's colour points: each one is a colour, the centre of its slow loop
 * (0 to 1 across the orb), how wide the loop is and its pace. Clear blues, white, and BRAND_AURORA's lime.
 */
const MESH = [
  { rgb: [31, 111, 255], at: [0.3, 0.3], r: 0.22, speed: 0.31 },
  { rgb: [74, 155, 255], at: [0.7, 0.35], r: 0.2, speed: 0.23 },
  { rgb: [26, 85, 224], at: [0.6, 0.7], r: 0.24, speed: 0.27 },
  { rgb: [255, 255, 255], at: [0.35, 0.65], r: 0.18, speed: 0.37 },
  { rgb: [198, 232, 79], at: [0.55, 0.85], r: 0.16, speed: 0.19 },
] as const;
// How soft each colour's reach is, as a share of the orb. Larger melts more.
const MESH_SOFTNESS = 0.17;
// Speed of the flow; 1 is the original pace.
const MESH_TEMPO = 1.7;
// Where the loop starts, in seconds, so the first frame after a reload is
// already a good arrangement rather than the lime parked over the blues.
const MESH_PHASE = 12;
// How far each pixel is pushed from grey after mixing (1 is no change).
const MESH_VIVID = 1.35;
// The canvas is drawn small and scaled up: the gradient has no detail to lose,
// and it keeps the per-frame work to a few thousand pixels.
const MESH_RES = 48;

/**
 * The assistant's mark: a liquid mesh gradient on a small canvas. Five colour
 * points loop slowly on their own paths and are blended by distance every
 * frame, so the colours melt into each other continuously instead of reading
 * as separate shapes. A radial mask feathers the edge
 * and the comparison panels' grain sits on top. Reduced motion draws one still
 * frame; it stops drawing while off screen.
 */
function AssistantOrb() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    canvas.width = MESH_RES;
    canvas.height = MESH_RES;
    const image = ctx.createImageData(MESH_RES, MESH_RES);
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sigma = 2 * MESH_SOFTNESS * MESH_SOFTNESS;

    const draw = (time: number) => {
      const t = (time / 1000) * MESH_TEMPO + MESH_PHASE;
      const points = MESH.map((p, i) => [
        p.at[0] + Math.cos(t * p.speed + i * 1.7) * p.r,
        p.at[1] + Math.sin(t * p.speed * 1.3 + i * 2.3) * p.r,
      ]);
      const data = image.data;
      for (let y = 0; y < MESH_RES; y++) {
        for (let x = 0; x < MESH_RES; x++) {
          const u = x / (MESH_RES - 1);
          const v = y / (MESH_RES - 1);
          let r = 0;
          let g = 0;
          let b = 0;
          let total = 0;
          for (let i = 0; i < MESH.length; i++) {
            const dx = u - points[i][0];
            const dy = v - points[i][1];
            const w = Math.exp(-(dx * dx + dy * dy) / sigma);
            r += MESH[i].rgb[0] * w;
            g += MESH[i].rgb[1] * w;
            b += MESH[i].rgb[2] * w;
            total += w;
          }
          const o = (y * MESH_RES + x) * 4;
          // Push each pixel away from its own grey so a blend of blue and
          // lime stays a colour instead of averaging to a muddy olive.
          r /= total;
          g /= total;
          b /= total;
          const grey = (r + g + b) / 3;
          data[o] = grey + (r - grey) * MESH_VIVID;
          data[o + 1] = grey + (g - grey) * MESH_VIVID;
          data[o + 2] = grey + (b - grey) * MESH_VIVID;
          data[o + 3] = 255;
        }
      }
      ctx.putImageData(image, 0, 0);
    };

    if (still) {
      draw(0);
      return;
    }

    let frame = 0;
    let visible = true;
    const loop = (time: number) => {
      draw(time);
      frame = visible ? requestAnimationFrame(loop) : 0;
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !frame) frame = requestAnimationFrame(loop);
    });
    observer.observe(canvas);
    frame = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    <span
      aria-hidden
      className="relative block size-11 overflow-hidden rounded-full [mask-image:radial-gradient(circle,#000_52%,transparent_72%)] md:size-14"
    >
      <canvas ref={ref} className="absolute inset-0 size-full" />
      <span
        className="absolute inset-0 mix-blend-overlay"
        style={{ backgroundImage: GRAIN, backgroundSize: "60px 60px" }}
      />
    </span>
  );
}

// `short` is the phone's wording, where the full line wrapped to two.
const SUGGESTIONS: { text: string; short?: string }[] = [
  {
    text: "What forms or contracts do I have open?",
    short: "What contracts do I have open?",
  },
  { text: "Where can I find my latest files?" },
  { text: "How do I get in touch with my team?" },
];

/**
 * The client's side of the AI Assistant: what a client sees when they open it
 * in their portal, before they have asked anything. Drawn as the pane inside
 * the portal window, so the firm's branded nav sits beside it.
 *
 * Fills the frame it is given, with the orb, the question and the suggestions
 * centred in it.
 * The third suggestion steps aside on a phone, where the window is too short
 * to hold the orb and all three.
 */
export function ClientAssistantPane() {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <AssistantOrb />
        {/* 15 on a phone, the site's body step: 18 crowded a 244px screen. */}
        <p
          className={`mt-3 ${MOCK_FIGURE} ${INK} max-md:text-[15px] md:mt-4 [[data-theme=dark]_&]:text-white/85`}
        >
          How can we help?
        </p>
        <div className="mt-4 flex w-full max-w-[340px] flex-col gap-2 md:mt-5">
          {SUGGESTIONS.map((question, i) => (
            <span
              key={question.text}
              className={`rounded-md border ${LINE} px-3.5 py-2.5 text-left max-md:truncate transition-colors duration-150 bg-[var(--mock-well-soft)] hover:bg-[var(--mock-well)] [[data-theme=dark]_&]:bg-[var(--mock-well-soft)] [[data-theme=dark]_&]:hover:bg-[var(--mock-well-2)] ${MOCK_PRIMARY} ${INK} [[data-theme=dark]_&]:text-white/75 ${
                i === SUGGESTIONS.length - 1 ? "hidden md:block" : ""
              }`}
            >
              {question.short ? (
                <>
                  <span className="md:hidden">{question.short}</span>
                  <span className="max-md:hidden">{question.text}</span>
                </>
              ) : (
                question.text
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
