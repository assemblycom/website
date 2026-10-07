import { HeroV76, type HeroVariantProps } from "@/components/home/hero-v76";
import { getVisibleTemplates } from "@/lib/visible-templates";
import { HowItWorks } from "@/components/home/how-it-works";
import { TrustTicker } from "@/components/home/trust-ticker";
import { Testimonials } from "@/components/home/testimonials";
import { HomeFAQ } from "@/components/home/faq";
import { CTA } from "@/components/home/cta";
import { ProductionGap } from "@/components/home/production-gap";
import { WholeStack } from "@/components/home/whole-stack";
import { Reveal } from "@/components/ui/reveal";
import { GridDivider, GridRails } from "@/components/ui/grid-lines";

/**
 * The homepage, rendered by two routes: `/` for anyone the hero test leaves
 * out, and `/hero-variant/<arm>` for everyone it enrolls (see src/middleware.ts).
 *
 * One component rather than two pages so the only thing that can differ
 * between arms is the hero itself. Everything below it — the numbers band
 * included, which sits directly under the fold and so affects whether anyone
 * scrolls at all — is the same markup in every arm, which is what makes a
 * difference between arms attributable to the hero.
 */
export async function HomeContent({ variant }: { variant?: HeroVariantProps }) {
  const templates = await getVisibleTemplates();
  return (
    <>
      {/* Upper half shares the hero's surface — the walkthrough sits on the
          same color as the hero (see .section-follow), so they read as one
          canvas. */}
      <HeroV76 templates={templates} variant={variant} />

      {/* The numbers band sits OUTSIDE the rails wrapper below, so the rails do
          not run past it. It carries its own pair of side lines, level with the
          figures (see trust-ticker.tsx); with the rails drawn as well, the two
          verticals at each end bracketed a strip of empty page and the outer
          figures read as padded away from the edge of their own band.

          Both its rules are full bleed for the same reason: there are no rails
          across this band for a capped rule to land on.

          Fade-only (no rise): the ticker's own colored band made the translate
          read as the whole block sliding on load. */}
      <div className="section-follow">
        <GridDivider fullBleed />
        <Reveal variant="fade">
          <TrustTicker />
        </Reveal>
        <GridDivider fullBleed />
      </div>

      {/* Content region — framed by vertical rails aligned to the 1200px
          content column. The rails start below the numbers band and run down
          through the sections (the wide footer sits outside this wrapper).
          Drawn on top as thin lines in the column gutter so section fills never
          hide them. */}
      <div className="relative">
        <GridRails />

        {/* The platform overview comes first, then the app builder deep dive:
            visitors see what's included before what they can build. */}
        <div className="section-follow">
          <Reveal variant="fade">
            <ProductionGap />
          </Reveal>
          <GridDivider />
          <Reveal variant="fade">
            <HowItWorks />
          </Reveal>
        </div>

        <GridDivider />

        {/* The lower half stays on the light hero surface too, so the whole page
            reads as one continuous light canvas until the dark CTA + footer.
            Order: testimonials → whole stack → FAQ. */}
        <div className="section-follow relative z-10">
          <Reveal variant="fade">
            <Testimonials />
          </Reveal>
          <GridDivider />
          <Reveal variant="fade">
            <WholeStack />
          </Reveal>
          <GridDivider />
          <Reveal variant="fade">
            <HomeFAQ />
          </Reveal>
        </div>

        <GridDivider />

        <div className="relative z-20">
          <CTA />
        </div>
      </div>
    </>
  );
}
