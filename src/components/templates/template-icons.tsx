/**
 * Art for the template rail's slots.
 *
 * The rail's slot is a recess waiting for a template shot. Until those exist a
 * row can carry a mark instead, which is better than a blank square for the
 * handful of templates that have one drawn.
 *
 * Each is a Figma export with its wrapper stripped. Figma writes background
 * blur as a `foreignObject` carrying a `backdrop-filter` and a clip path —
 * three extra nodes per shape that render nothing useful inline and drag an
 * HTML document into an SVG. The shapes are what carry the drawing.
 *
 * Two tones, and NEITHER of them themes. The slot in the rail turns into the
 * icon's plate when it carries one (see template-rail), so the artwork is drawn
 * straight onto it — one square, not a square inside a square.
 *
 * Two tones, and neither of them themes. An app's icon is the app's own
 * artwork — the same reasoning the Brandmages mark follows elsewhere in these
 * mocks: it is their file, not our chrome, so it looks the same wherever it is
 * put. The slot behind it carries the theme; the mark does not.
 *
 * That is also the bug this replaces. The shape behind was `currentColor`, so
 * it inherited the row's ink and flipped to near-white in dark — which turned
 * the drawing inside out, pale card behind and dark card in front, the reverse
 * of what the file draws. Both shapes are fixed now: near-black behind, white
 * in front, which reads on the slot in either theme because the slot is a mid
 * grey in both (#e9e9e9 light, #242424 dark). */
export function IconTemplatePayments({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 218 139" className={className} fill="none" aria-hidden>
      <path
        d="M169.487 0C179.985 0.000212183 190.697 8.2203 193.413 18.3601L212.841 90.864C215.558 101.004 209.251 109.224 198.754 109.224H72.2262C61.7286 109.224 51.0158 101.004 48.2988 90.864L28.8715 18.3601C26.1545 8.22017 32.462 0 42.9597 0H169.487Z"
        fill="#15171c"
      />
      <path
        d="M169.254 47.629C166.892 38.8171 157.583 31.6729 148.46 31.6719L16.5184 31.6604C7.39552 31.6597 1.91418 38.8026 4.2752 47.6146L24.316 122.408C26.6772 131.22 35.987 138.365 45.1101 138.366L177.052 138.377C186.174 138.378 191.656 131.234 189.294 122.422L169.254 47.629ZM155.191 93.8902C155.841 96.3163 154.332 98.2829 151.82 98.2827L127.994 98.2807C125.482 98.2804 122.918 96.3135 122.268 93.8874L117.516 76.1517C116.866 73.7254 118.376 71.759 120.888 71.7592L144.714 71.7613C147.226 71.7616 149.789 73.7283 150.439 76.1546L155.191 93.8902Z"
        fill="#ffffff"
      />
    </svg>
  );
}
