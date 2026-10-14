// A progressive blur, not a fade: stacked backdrop blurs, each masked to a
// later band, so a cropped screen softens into its frame's edge without a
// colour wash over it.
const LAYERS = [
  { blur: 0.5, from: 0, to: 40 },
  { blur: 1, from: 20, to: 60 },
  { blur: 2, from: 40, to: 80 },
  { blur: 3, from: 60, to: 100 },
];

const EDGE = {
  bottom: { box: "inset-x-0 bottom-0 h-16", toward: "to bottom" },
  right: { box: "inset-y-0 right-0 w-12", toward: "to right" },
};

/** Blurs the cropped edge of a window. Place inside a `relative` box. */
export function FootBlur({
  edge = "bottom",
  className = "",
}: {
  edge?: keyof typeof EDGE;
  className?: string;
}) {
  const { box, toward } = EDGE[edge];
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute ${box} ${className}`}
    >
      {LAYERS.map(({ blur, from, to }) => {
        const mask = `linear-gradient(${toward}, transparent ${from}%, #000 ${to}%)`;
        return (
          <div
            key={blur}
            className="absolute inset-0"
            style={{
              backdropFilter: `blur(${blur}px)`,
              WebkitBackdropFilter: `blur(${blur}px)`,
              maskImage: mask,
              WebkitMaskImage: mask,
            }}
          />
        );
      })}
    </div>
  );
}
