"use client";

import { useEffect, useState } from "react";

// The brand ambient background (ambient-backgrounds.vercel.app), redrawn for
// the footer's wide band: symbol bars with 45 degree ends, each lit from
// inside its edges. The bars are see-through, so the page ground shows inside
// them in either theme.

// Far enough outside the frame that a bar's off-screen edges never glow in view.
const FAR = 2000;

// Each glow state is rendered to a bitmap once. Live SVG filters had to be
// redrawn on every resize, and Chrome left parts of the band blank while a
// window was being dragged; an image only scales, so it always covers.
const RASTER_SCALE = 1;

// A bar whose body runs up and right from its corner: its bottom edge sits at
// y, and its 45 degree end climbs up and left from x.
const barAbove = (w: number, x: number, y: number) =>
  `M${x} ${y} L${x - FAR} ${y - FAR} L${w + FAR} ${y - FAR} L${w + FAR} ${y} Z`;

// A bar whose body runs down and right from its corner: its top edge sits at
// y, and its 45 degree end drops down and right from x.
const barBelow = (w: number, x: number, y: number) =>
  `M${x} ${y} L${w + FAR} ${y} L${w + FAR} ${y + FAR} L${x + FAR} ${y + FAR} Z`;

// A bar whose end is off-screen to the left, so only its top edge shows.
const barAcross = (w: number, y: number) =>
  `M${-FAR} ${y} L${w + FAR} ${y} L${w + FAR} ${y + FAR} L${-FAR} ${y + FAR} Z`;

type Layout = { w: number; h: number; bleed: number; bars: string[] };

// Desktop, laid out from the reference frame: one bar at the top left, two
// stepping down from the right, and one across the bottom. The reference's
// top-right bar sat right behind the Legal and blog links and was dropped.
// The drawing carries on 800 units past each side and stays centered; the
// band stops growing taller on large screens, so a wide screen shows more bars
// to the sides instead of zooming in, and the image's outer edges fade into
// the ground.
const DESKTOP_W = 1800;
const DESKTOP: Layout = {
  w: DESKTOP_W,
  h: 700,
  bleed: 800,
  bars: [
    barAbove(DESKTOP_W, 345, 256),
    barBelow(DESKTOP_W, 1400, 281),
    barBelow(DESKTOP_W, 560, 419),
    barAcross(DESKTOP_W, 562),
  ],
};

const DESKTOP_QUERY = "(min-width: 1024px)";

const EDGE_FADE =
  "linear-gradient(to right, transparent 0%, #000 18%, #000 82%, transparent 100%)";

// The generator's palette. Each state of the loop takes its own pair (edge
// first, inner glow second), so the cross-fade also shifts the color:
// mint, blue, lavender, blue, and back to mint.
const COLORS = { mint: "#5CE5C3", blue: "#7DA4FF", lavender: "#C6B6FF" };
const PAIRS = [
  [COLORS.mint, COLORS.blue],
  [COLORS.blue, COLORS.mint],
  [COLORS.lavender, COLORS.blue],
  [COLORS.blue, COLORS.lavender],
];
const GLOW_BLUR = 22;
const INNER_BLUR = GLOW_BLUR * 1.5;
const SPREAD = 10;
const INNER_OPACITY = 0.08;
// The glow's falloff is steepened (alpha raised to this power) so it stays
// bright at the bar edge and clears quickly inside. A plain Gaussian tail
// left a long pale haze across each bar and read as washed out.
const FALLOFF = 1.8;
// Lifts the edge back to full strength after the steeper curve.
const FALLOFF_LIFT = 1.3;

// Motion: the light drifts around inside the bars and the glow breathes
// deeper and back; the bars never move. The glow is drawn at a few points
// around the loop and those images cross-fade, which stays smooth where
// redrawing the blur every frame stuttered.
// The sweep stays small: neighbouring states sit close together, so the
// cross-fade never shows two glows side by side. Most of the visible motion
// comes from the breathing, which keeps every glow anchored on its bar edge.
type Motion = { sweep: number; breathe: number };
// The glow only breathes outward, from its resting width to wider. Breathing
// thinner than rest let the drift outrun the blur, and the bars turned into
// hard, solid stripes at that point in the loop.
const DESKTOP_MOTION: Motion = { sweep: 10, breathe: 0.6 };
// Phones loop faster so the motion reads on a small screen. Moving the glow
// further or breathing deeper instead pushed it past its own blur, and the
// bars turned into hard, solid stripes at points in the loop.
const LOOP_S_MOBILE = 6;
const LOOP_S = 8;
const PHASES = 4;
const statesFor = (m: Motion) =>
  Array.from({ length: PHASES }, (_, i) => {
    const w = (2 * Math.PI * i) / PHASES;
    const breathe = 1 + (m.breathe * (1 + Math.sin(w))) / 2;
    return {
      edge: PAIRS[i][0],
      inner: PAIRS[i][1],
      dx: m.sweep * Math.cos(w),
      dy: m.sweep * Math.sin(w),
      edgeBlur: GLOW_BLUR * breathe,
      innerBlur: INNER_BLUR * breathe,
    };
  });
type GlowState = ReturnType<typeof statesFor>[number];

// Two inner shadows, as in the generator: a tight edge color over a wider,
// fainter inner color. Nothing fills the bar itself.
function stateSvg(st: GlowState, layout: Layout) {
  const x0 = -layout.bleed;
  const imgW = layout.w + 2 * layout.bleed;
  const w = Math.round(imgW * RASTER_SCALE);
  const h = Math.round(layout.h * RASTER_SCALE);
  const paths = layout.bars
    .map((d) => `<path d="${d}" filter="url(#g)"/>`)
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x0} 0 ${imgW} ${layout.h}" width="${w}" height="${h}">
    <defs><filter id="g" filterUnits="userSpaceOnUse" x="${x0 - 100}" y="-100" width="${imgW + 200}" height="${layout.h + 200}" color-interpolation-filters="sRGB">
      <feMorphology in="SourceAlpha" operator="erode" radius="${SPREAD}" result="eroded"/>
      <feGaussianBlur in="eroded" stdDeviation="${st.innerBlur}" result="gInner"/>
      <feOffset in="gInner" dx="${st.dx * 1.5}" dy="${st.dy * 1.5}" result="bInner"/>
      <feComposite in="SourceAlpha" in2="bInner" operator="out" result="mInner"/>
      <feFlood flood-color="${st.inner}" flood-opacity="${INNER_OPACITY}"/>
      <feComposite in2="mInner" operator="in" result="sInner"/>
      <feGaussianBlur in="eroded" stdDeviation="${st.edgeBlur}" result="gEdge"/>
      <feOffset in="gEdge" dx="${st.dx}" dy="${st.dy}" result="bEdge"/>
      <feComposite in="SourceAlpha" in2="bEdge" operator="out" result="mEdgeSoft"/>
      <feComponentTransfer in="mEdgeSoft" result="mEdge"><feFuncA type="gamma" amplitude="${FALLOFF_LIFT}" exponent="${FALLOFF}"/></feComponentTransfer>
      <feFlood flood-color="${st.edge}"/>
      <feComposite in2="mEdge" operator="in" result="sEdge"/>
      <feMerge><feMergeNode in="sInner"/><feMergeNode in="sEdge"/></feMerge>
    </filter></defs>${paths}</svg>`;
}

// A fine mono grain, only where the glow is, so the plain ground stays clean.
// Every state gets the same pattern (fixed seed), so the cross-fade between
// them never shimmers.
const GRAIN_LEVELS = 5;
const GRAIN_SEED = 7;

function addGrain(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const image = ctx.getImageData(0, 0, w, h);
  const d = image.data;
  let seed = GRAIN_SEED;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  for (let i = 0; i < d.length; i += 4) {
    const n = (rand() - 0.5) * 2 * GRAIN_LEVELS;
    if (d[i + 3] === 0) continue;
    d[i] += n;
    d[i + 1] += n;
    d[i + 2] += n;
  }
  ctx.putImageData(image, 0, 0);
}

async function rasterize(svg: string) {
  const svgUrl = URL.createObjectURL(
    new Blob([svg], { type: "image/svg+xml" }),
  );
  try {
    const img = new Image();
    img.src = svgUrl;
    await img.decode();
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(img, 0, 0);
    if (ctx) addGrain(ctx, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve),
    );
    return blob ? URL.createObjectURL(blob) : null;
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}

// Each layer is fully shown at its own point in the loop and fades out by the
// neighbouring points. The first stays fully shown underneath: two half-faded
// layers alone let the ground through and the glow dipped mid-fade.
const FADE_STEP = 100 / PHASES;
// On a wide screen the glow stays inside the nav's rail (max 1600px, 2.5rem
// gutters) and fades out toward each rail edge, so it reads as part of the
// footer rather than a full-bleed strip. Up to that width the fade runs out
// to the screen edge instead: ending at the 2.5rem gutter read as extra
// padding on a standard desktop. Phones keep it edge to edge.
const RAIL_EDGE = "max(0px, (100% - 1600px) / 2 + 2.5rem)";
const RAIL_FADE_W = "10rem";
// Eased rather than linear: a straight ramp ended in a visible line where it
// met full strength, which read as a cut-off instead of a fade.
// Smoothstep sampled at 13 points: no visible step where it starts or ends.
const EASE_STOPS = Array.from({ length: 13 }, (_, i) => {
  const t = i / 12;
  return Math.round(t * t * (3 - 2 * t) * 1000) / 1000;
});
const railFade = (w: string) => {
  const left = EASE_STOPS.map(
    (a, i) =>
      `rgba(0,0,0,${a}) calc(${RAIL_EDGE} + ${w} * ${i / (EASE_STOPS.length - 1)})`,
  );
  const right = [...EASE_STOPS]
    .reverse()
    .map(
      (a, i) =>
        `rgba(0,0,0,${a}) calc(100% - ${RAIL_EDGE} - ${w} * ${1 - i / (EASE_STOPS.length - 1)})`,
    );
  return `linear-gradient(to right, ${[...left, ...right].join(", ")})`;
};
const RAIL_FADE = railFade(RAIL_FADE_W);

const FADE_KEYFRAMES = `@keyframes ambient-fade {
  0%, 100% { opacity: 1; }
  ${FADE_STEP}%, ${100 - FADE_STEP}% { opacity: 0; }
}
@media (min-width: 1024px) {
  .ambient-rail { mask-image: ${RAIL_FADE}; -webkit-mask-image: ${RAIL_FADE}; }
}`;

const TOP_BLUR_PX = 6;
const TOP_BLUR_MASK =
  "linear-gradient(to bottom, #000 0%, #000 30%, transparent 44%)";

export function AmbientBackground({ className = "" }: { className?: string }) {
  const [frames, setFrames] = useState<string[] | null>(null);
  const [desktop, setDesktop] = useState<boolean | null>(null);
  const layout = DESKTOP;
  const loop = desktop === false ? LOOP_S_MOBILE : LOOP_S;

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const sync = () => setDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Drawn once per mount: every screen size uses the same drawing, and the
  // breakpoint only changes the loop speed.
  useEffect(() => {
    let cancelled = false;
    let urls: string[] = [];
    Promise.all(
      statesFor(DESKTOP_MOTION).map((st) => rasterize(stateSvg(st, DESKTOP))),
    )
      .then((result) => {
        urls = result.filter((u): u is string => Boolean(u));
        if (cancelled) urls.forEach((u) => URL.revokeObjectURL(u));
        else if (urls.length === PHASES) setFrames(urls);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, []);

  return (
    <div
      aria-hidden
      className={`absolute inset-0 ambient-rail overflow-hidden ${className}`}
    >
      <style>{FADE_KEYFRAMES}</style>
      <div
        className="absolute left-1/2 top-0 h-full -translate-x-1/2"
        style={{
          aspectRatio: `${layout.w + 2 * layout.bleed} / ${layout.h}`,
          maskImage: EDGE_FADE,
          WebkitMaskImage: EDGE_FADE,
        }}
      >
        {frames?.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            src={src}
            alt=""
            // Reduced motion keeps the first state still and drops the rest.
            className={`absolute inset-0 h-full w-full motion-reduce:!animate-none ${i > 0 ? "motion-reduce:hidden" : ""}`}
            style={
              i === 0
                ? undefined
                : {
                    animation: `ambient-fade ${loop}s ease-in-out infinite`,
                    animationDelay: `${(-loop * i) / PHASES}s`,
                  }
            }
          />
        ))}
      </div>
      {/* Desktop only: the upper bars sit behind the link columns, so they are
          softened further there to keep the text easy to read. One blur with a
          smooth fade, so no seams show as the glow moves underneath. */}
      <div
        className="absolute inset-0 hidden lg:block"
        style={{
          backdropFilter: `blur(${TOP_BLUR_PX}px)`,
          WebkitBackdropFilter: `blur(${TOP_BLUR_PX}px)`,
          maskImage: TOP_BLUR_MASK,
          WebkitMaskImage: TOP_BLUR_MASK,
        }}
      />
    </div>
  );
}
