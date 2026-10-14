// The site's two brand hues softened toward white, under a fine grain, so
// the panel reads as lit material rather than a flat swatch.
export const PERIWINKLE = "#7DA4FF";
const LIME = "#D9ED92";
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.18 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;
export const PANEL_BG = [
  GRAIN,
  `radial-gradient(60% 70% at 85% 10%, ${PERIWINKLE} 0%, transparent 70%)`,
  `radial-gradient(70% 70% at 15% 95%, ${LIME} 0%, transparent 70%)`,
  `linear-gradient(160deg in oklab, color-mix(in oklab, ${PERIWINKLE} 70%, white), color-mix(in oklab, ${LIME} 70%, white))`,
].join(", ");
