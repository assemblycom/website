import type { Metadata } from "next";
import { HomeContent } from "@/components/home/home-content";
import { HomeContentV2 } from "@/components/home/home-content-v2";
import { HeroPhoto } from "@/components/home/v3/hero-photo";
import { VersionSwitcher } from "@/components/proto/version-switcher";

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
 * `?v=1` is the page as it ships today (Round 3), kept untouched as the
 * baseline. `?v=2` is the Round 4 exploration, and `?v=3` is V2 with a
 * full-bleed photo hero. V2 is the default, since it is
 * what the prototype is for; V1 is a click away for comparison.
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
  return (
    <>
      {active === "1" ? (
        <HomeContent />
      ) : active === "3" ? (
        <HomeContentV2 hero={<HeroPhoto />} />
      ) : (
        <HomeContentV2 />
      )}
      <VersionSwitcher active={active} />
    </>
  );
}
