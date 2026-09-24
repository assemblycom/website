"use client";

import { useState } from "react";

import { useTheme } from "@/components/theme/theme-provider";
import { PAGE_GROUND, readableTileColor } from "@/lib/built-on-color";
import type { BuiltOnFirm } from "@/lib/built-on-firms";

/**
 * The firm's logo, above the headline. A square slot rather than a lockup: the
 * headline already names the firm, so the mark only has to say whose portal the
 * visitor just came from.
 *
 * What fills the square depends on what goes in it, because the two cases can
 * be reasoned about to different depths.
 *
 * An initial is drawn by us, so we know both sides: the tile is the firm's
 * client sidebar colour and the letter their sidebar text colour, the pairing
 * they already chose in the product. readableTileColor is only a safety net
 * over it, nudging the colour along its own hue if white would be unreadable
 * or if the tile would vanish into the page. Most workspaces pass untouched.
 *
 * A logo is an image whose pixels we cannot read, so the same reasoning is not
 * available — and measuring the uploads says it would not help: nearly all of
 * them bake an opaque background into the file, most often white, and the rest
 * are dark glyphs on transparency. Both want a light ground, and a brand colour
 * behind either one either fights the baked-in square or swallows the glyph.
 * So a logo gets a fixed light tile in both themes, and the firm's colour
 * carries the page from the hero field instead.
 *
 * Every upload is then contained, at one inset, whatever its proportions. A
 * near-square one used to fill the tile edge to edge on the reasoning that
 * cropping a few percent off a mark costs nothing — but a transparent glyph
 * sized that way runs into the rounded corners and reads as a logo too big for
 * its square rather than as a mark sitting in one. Filling bought only the
 * upload that bakes in a dark background, which is now a dark square inset in a
 * light tile; a baked-in white one, far the commoner case, melts into the tile
 * it sits on and is invisible either way.
 */

/**
 * Past this, drop the logo and show the initial instead.
 *
 * The tile leaves 36px of width, so a 3:1 mark renders 12px tall and a 17:1
 * one barely two — a smudge the visitor cannot read as anything, let alone as
 * the firm they just left. An initial in the firm's own colours says less, but
 * it says it legibly, which is the whole job of this square.
 */
const MAX_LOGO_RATIO = 3;
type Fit = "contain" | "initial";

/** Whether an upload of these proportions can be shown at all. */
function fitFor(width: number, height: number): Fit {
  const ratio = height ? width / height : 0;
  if (!ratio || ratio > MAX_LOGO_RATIO || ratio < 1 / MAX_LOGO_RATIO) {
    return "initial";
  }
  return "contain";
}

export function FirmMark({ firm }: { firm: BuiltOnFirm }) {
  // The fit is known before anything loads: the lookup measured the upload on
  // the server, so the square renders in its final state on the first paint.
  // Only a load failure can change it afterwards.
  const [failed, setFailed] = useState(false);
  const { theme } = useTheme();
  const ground = PAGE_GROUND[theme === "dark" ? "dark" : "light"];
  const showsLogo =
    Boolean(firm.logoUrl && firm.logoWidth && firm.logoHeight) &&
    !failed &&
    fitFor(firm.logoWidth ?? 0, firm.logoHeight ?? 0) === "contain";
  const tile =
    firm.brandColor && !showsLogo
      ? readableTileColor(firm.brandColor, ground)
      : undefined;

  return (
    <div
      className={`mx-auto flex size-14 items-center justify-center overflow-hidden rounded-xl text-lg ring-1 ring-foreground/10 ${
        tile ? "" : showsLogo ? "bg-white" : "bg-muted text-muted-foreground"
      }`}
      style={
        tile
          ? {
              backgroundColor: tile,
              color: firm.sidebarTextColor || "#ffffff",
            }
          : undefined
      }
      aria-label={firm.name}
    >
      {firm.logoUrl && showsLogo ? (
        // A plain img, not next/image: the source is a workspace upload, and
        // optimising it would put our image pipeline in front of every firm's
        // logo. An upload that fails to load falls back to the initial rather
        // than leaving the square empty.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={firm.logoUrl}
          width={firm.logoWidth}
          height={firm.logoHeight}
          alt=""
          // The server renders this img, so an upload can fail before React
          // hydrates and onError never fires. A complete image with no pixels
          // is one that already failed.
          ref={(node) => {
            if (node?.complete && !node.naturalWidth) setFailed(true);
          }}
          onError={() => setFailed(true)}
          className="size-full object-contain p-2.5"
        />
      ) : (
        // Uppercased rather than shown as typed: plenty of workspace names are
        // lowercase or machine-generated, and a lone lowercase letter reads as
        // a typo instead of a mark.
        firm.name.trim().charAt(0).toUpperCase()
      )}
    </div>
  );
}
