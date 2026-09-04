"use client";

import { useTheme } from "@/components/theme/theme-provider";
import { PAGE_GROUND, readableTileColor } from "@/lib/built-on-color";
import type { BuiltOnFirm } from "@/lib/built-on-firms";

/**
 * The firm's logo, above the headline. A square slot rather than a lockup: the
 * headline already names the firm, so the mark only has to say whose portal the
 * visitor just came from.
 *
 * The tile is the firm's client sidebar colour, and the initial is drawn in
 * their sidebar text colour, so the pairing is the one they already chose in
 * the product rather than one guessed here.
 *
 * readableTileColor is only a safety net over that pairing: it nudges the
 * colour along its own hue if white would be unreadable on it, or if the tile
 * would disappear into the page (a black brand on the dark theme). Most
 * workspaces come through untouched.
 */
export function FirmMark({ firm }: { firm: BuiltOnFirm }) {
  const { theme } = useTheme();
  const ground = PAGE_GROUND[theme === "dark" ? "dark" : "light"];
  const tile = firm.brandColor
    ? readableTileColor(firm.brandColor, ground)
    : undefined;

  return (
    <div
      className={`mx-auto flex size-14 items-center justify-center overflow-hidden rounded-xl text-lg ring-1 ring-foreground/10 ${
        tile ? "" : "bg-muted text-muted-foreground"
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
      {firm.logoUrl ? (
        // A plain img, not next/image: the source is a workspace upload on a
        // host this site cannot know at build time.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={firm.logoUrl}
          alt=""
          className="size-full object-contain p-2"
        />
      ) : (
        firm.name.charAt(0)
      )}
    </div>
  );
}
