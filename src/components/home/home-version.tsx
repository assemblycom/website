import { BuilderGridRails } from "@/components/ai-app-builder/builder-grid-rails";
import { HeroV76 } from "@/components/home/hero-v76";
import {
  HomeContentV2,
  HomeProofBand,
} from "@/components/home/home-content-v2";
import { HeroPhoto } from "@/components/home/v3/hero-photo";
import { PROTO_HERO_BODY } from "@/components/proto/hero-copy";
import type { LayoutKey } from "@/lib/hero-variants";
import { getVisibleTemplates } from "@/lib/visible-templates";

/**
 * The Round 4 homepage in one of its three test versions. Every version
 * renders the same body below the fold and differs only in the hero, so a
 * difference in the readout is a difference in the hero: `type` the big-type
 * hero (V1), `ui` the product UI hero (V2), `photo` the photography hero (V3).
 */
export async function HomeVersion({ layout }: { layout: LayoutKey }) {
  const templates = await getVisibleTemplates();
  return (
    <>
      <HomeContentV2
        // Every hero hands the rails on at full strength: V2 draws them behind
        // itself, V1 lays them over its empty foot, and V3's logo band fades
        // them in under the photograph (below).
        heroRails
        openingRule={layout !== "type"}
        hero={
          layout === "type" ? (
            // NO LOGO REEL UNDER THIS ONE. The reel is drawn to ride up under
            // the split hero's tile; this hero ends on its buttons, so the
            // marks had nothing to sit against and their deep bottom inset
            // left a screen of white between them and the first section.
            //
            // ROOM VIA THE HERO'S OWN PROP, not a wrapper. This hero renders
            // the nav bar itself and then pulls its section up underneath it,
            // so padding it from out here moved the NAV down the page and left
            // a band of white above the logo. `roomy` opens the space inside
            // the hero, below the bar, which is where it was wanted.
            <>
              <HeroV76
                templates={templates}
                roomy
                // The same G2 line V2 and V3 carry, so the three versions differ
                // in their hero's arrangement and not in what is in it.
                rating
                body={PROTO_HERO_BODY}
                // On a phone the lockup wraps, and both marks went with the
                // first line — two tiles crowded after "Deliver" with
                // "remarkable" alone underneath. One moves to the end of the
                // wrapped word, so each line carries a mark. Desktop, where
                // the line does not wrap, is unchanged.
                iconSplitAfter="remarkable"
              />
              {/* Rails over the hero's empty foot, fading in under the buttons
                  and running on into the content region with no seam. Sized
                  to the gap under the buttons: from `wide` the hero has a
                  fixed floor and the gap is ~125px; below it the hero is a
                  full screen tall and the gap grows with the window. Hung off a zero-height marker rather
                  than a wrapper: the hero renders the sticky nav, and a
                  wrapper would stop it sticking at the hero's end. An
                  overlay, since the hero's ground is opaque and would hide a
                  backdrop. */}
              <div
                aria-hidden
                className="pointer-events-none relative z-[1] h-0"
              >
                <div className="absolute inset-x-0 bottom-0 isolate h-[max(120px,calc(50svh-250px))] [mask-image:linear-gradient(to_bottom,transparent,#000_45%)] wide:h-[120px]">
                  <BuilderGridRails fadeTop={false} fadeBottom={false} />
                </div>
              </div>
            </>
          ) : layout === "photo" ? (
            <>
              <HeroPhoto />
              {/* A beat under the photograph before the marks — see
                  `headroom`. The split hero's reel rides up under its tile;
                  this one has a picture's edge to clear instead. */}
              <HomeProofBand headroom rails="fadeIn" />
            </>
          ) : undefined
        }
      />
    </>
  );
}
