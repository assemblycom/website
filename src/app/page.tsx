import { BuilderGridRails } from "@/components/ai-app-builder/builder-grid-rails";
import type { Metadata } from "next";
import { HeroV76 } from "@/components/home/hero-v76";
import {
  HomeContentV2,
  HomeProofBand,
} from "@/components/home/home-content-v2";
import { HeroPhoto } from "@/components/home/v3/hero-photo";
import { VersionSwitcher } from "@/components/proto/version-switcher";
import { PROTO_HERO_BODY } from "@/components/proto/hero-copy";
import { getVisibleTemplates } from "@/lib/visible-templates";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  // Nothing here should ever be indexed: this is an exploration of the
  // homepage, served from its own deployment, and two pages making the same
  // claims would compete with the real one.
  robots: { index: false, follow: false },
};

/**
 * The homepage, in the versions this prototype is comparing.
 *
 * ONE PAGE, THREE HEROES. Every version renders the same body — the Round 4
 * sections below the fold — and differs only in what sits above them: `?v=1`
 * the hero as it ships today, `?v=2` the Round 4 split hero, `?v=3` the
 * full-bleed photo hero. V2 is the default, since it is what the prototype
 * is for.
 *
 * That is the shape the real test needs, and it is the reason this page no
 * longer reaches for `HomeContent`. If the versions differed below the fold
 * as well, a difference between them would have several causes and the
 * hero would not be one you could name — and polishing the sections for one
 * version would silently leave the others behind. The sections are shared
 * markup, so a change to them is a change to all three at once.
 *
 * `HomeContent` is still the live page's own body, rendered by `/` and by
 * `/hero-variant/<arm>` in production. It is deliberately untouched here:
 * this page is a prototype and has no business changing what ships.
 *
 * The hero A/B machinery is off here (HERO_TEST_ENABLED=0), so `/` renders
 * this page directly instead of rewriting to an arm.
 */
export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ v?: string }>;
}) {
  const { v } = await searchParams;
  const active = v === "1" || v === "3" ? v : "2";
  // Only V1's hero asks for these, and it is a page-level await either way:
  // fetching once up here keeps the three branches to the one thing that
  // actually differs between them.
  const templates = await getVisibleTemplates();
  return (
    <>
      <HomeContentV2
        // Every hero hands the rails on at full strength: V2 draws them behind
        // itself, V1 lays them over its empty foot, and V3's logo band fades
        // them in under the photograph (below).
        heroRails
        openingRule={active !== "1"}
        hero={
          active === "1" ? (
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
          ) : active === "3" ? (
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
      <VersionSwitcher active={active} />
    </>
  );
}
