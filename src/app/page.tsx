import type { Metadata } from "next";
import { HeroV76 } from "@/components/home/hero-v76";
import {
  HomeContentV2,
  HomeProofBand,
} from "@/components/home/home-content-v2";
import { HeroPhoto } from "@/components/home/v3/hero-photo";
import { VersionSwitcher } from "@/components/proto/version-switcher";
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
        hero={
          active === "1" ? (
            // NO LOGO REEL UNDER THIS ONE. The reel is drawn to ride up under
            // the split hero's tile; this hero ends on its buttons, so the
            // marks had nothing to sit against and their deep bottom inset
            // left a screen of white between them and the first section.
            //
            // ROOM EITHER SIDE. This hero is built to open a page that then
            // runs a coloured numbers band under it, and it sets its spacing
            // against both: it slides up under the transparent nav, and its
            // foot is sized for a band that closes it. Dropped on this page it
            // has neither — the headline sat just under the nav links and the
            // first section started right off the buttons. The padding is here
            // rather than in the hero because it is this page's arrangement
            // that asks for it, and the hero still ships as it is.
            <div className="pb-10 pt-8 md:pb-16 md:pt-14">
              <HeroV76 templates={templates} />
            </div>
          ) : active === "3" ? (
            <>
              <HeroPhoto />
              <HomeProofBand />
            </>
          ) : undefined
        }
      />
      <VersionSwitcher active={active} />
    </>
  );
}
