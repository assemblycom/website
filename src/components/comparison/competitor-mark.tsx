import type { ComparisonPage } from "@/lib/comparisons";

/**
 * A competitor's logo in a tile: one fixed square frame, the mark desaturated
 * inside it.
 *
 * Nine competitors mean nine sets of brand colours and nine aspect ratios, which
 * as raw <img> tags made the index grid read as a sticker sheet — a green tile, a
 * yellow circle, a blue gradient, each a different size. The frame gives them all
 * the same footprint and `grayscale` gives them all the same palette, the same
 * monotone treatment the studio cards take.
 *
 * The tile is white in BOTH themes rather than following `--background`. These
 * are other people's marks, drawn to sit on white, and several of them are dark
 * navy or near-black — on the dark theme's near-black ground they disappeared
 * entirely. A white chip on the dark surface reads as deliberate and keeps every
 * mark legible. Literal white, not `--color-white`, which the dark mock skins
 * remap.
 *
 * Note this is desaturation, not a knockout to a single ink. That would need an
 * alpha mask per competitor, the way `/images/customers/*-logo-mask.png` are made
 * for the customer stories; these CMS assets are opaque rasters and multi-colour
 * SVGs, so masking them would fill each tile as a solid block.
 */
export function CompetitorMark({
  page,
  size = "sm",
}: {
  page: ComparisonPage;
  /** `sm` for the index cards, `lg` for a page's own hero. */
  size?: "sm" | "lg";
}) {
  // The square icon mark where there is one — the full lockup shrinks to an
  // illegible smudge in a square. Two entries carry only the lockup.
  const mark = page.smallLogo ?? page.logo;
  if (!mark) return null;

  const tile = size === "lg" ? "size-12 rounded-lg" : "size-9 rounded-md";
  const glyph = size === "lg" ? "size-7" : "size-5";

  return (
    <div
      className={`flex shrink-0 items-center justify-center bg-[#ffffff] ring-1 ring-[rgba(16,24,40,0.1)] ${tile}`}
    >
      {/* A plain <img>: several of these are SVG, and next/image refuses SVG
          unless dangerouslyAllowSVG is on, which it is not. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={mark.url}
        alt=""
        aria-hidden
        className={`${glyph} object-contain grayscale`}
      />
    </div>
  );
}
