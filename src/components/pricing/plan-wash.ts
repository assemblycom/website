// ─────────────────────────────────────────────────────────────────────────
// PLAN WASH — the aurora bloom behind a pricing card's top edge.
//
// Lives here rather than inline because two places draw it now: the full
// table on /pricing, and the four-card block the product pages run
// (/client-portal and the two vertical pages). They were one look described
// twice, which is exactly how the recommended plan ends up a different blue
// on two pages.
//
// Every card carries a wash, so the set reads as one object; only the
// recommended plan's is brand blue, the rest take a neutral at the same
// lengths. Drawn on a -z-10 layer inside an isolated, clipped card.
//
// The strings are whole Tailwind arbitrary values on purpose — Tailwind scans
// source for complete class names, so they cannot be assembled from parts.
// ─────────────────────────────────────────────────────────────────────────

/**
 * The recommended plan. Held back and kept short: at full #7DA4FF running
 * 180px it was a solid blue slab over the price and most of the perk list,
 * which made the card look like a different product rather than the same card
 * with a mark on it. Starting at 45% and gone by 120px, it reads as a wash
 * behind the plan name and nothing below it.
 */
export const PLAN_WASH_BRAND =
  "[background:linear-gradient(to_bottom,rgba(125,164,255,0.45),transparent_120px)] [[data-theme=dark]_&]:[background:linear-gradient(to_bottom,rgba(125,164,255,0.22),transparent_120px)]";

/**
 * Every other plan. Palette tokens, not hand-mixed grays: light takes --muted,
 * its surface tone on white. Dark has no token between --muted (a hair off the
 * card, so it barely showed) and --border (a bright band across the top), so it
 * takes the hairline tone held back to just over half — derived from the scale
 * rather than a new gray, and matching the brand wash's 170px fade.
 */
export const PLAN_WASH_NEUTRAL =
  "[background:linear-gradient(to_bottom,var(--muted),transparent_120px)] [[data-theme=dark]_&]:[background:linear-gradient(to_bottom,color-mix(in_srgb,var(--border)_55%,transparent),transparent_120px)]";

/**
 * /pricing only. Its cards are a subgrid that runs taller than the card block's,
 * so the wash is given a longer fade there; applied after the base strings
 * above, which it overrides from lg up.
 */
export const PLAN_WASH_BRAND_LG =
  "lg:[background:linear-gradient(to_bottom,rgba(125,164,255,0.45),transparent_160px)]";
export const PLAN_WASH_NEUTRAL_LG =
  "lg:[background:linear-gradient(to_bottom,var(--muted),transparent_160px)]";

/**
 * The recommended card's own edge: brand blue at the top, gone by the middle,
 * so it fades out with the wash instead of ringing the card in blue. Defined
 * in globals.css as `.plan-edge-brand` — a masked gradient border, which a
 * utility class cannot express — and dark only, since on white the neutral
 * hairline is already right. The card keeps its ordinary border underneath.
 */
export const PLAN_EDGE_BRAND = "plan-edge-brand";
