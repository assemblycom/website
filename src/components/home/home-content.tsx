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

      {/* Content region — framed by vertical rails aligned to the 1200px
          content column. The rails start below the hero and run down through
          the sections (the wide footer sits outside this wrapper). Drawn on top
          as thin lines in the column gutter so section fills never hide them. */}
      <div className="relative">
        <GridRails />

        {/* The "how it works" walkthrough comes first, then the three platform
            points (left-rail menu + visual). */}
        <div className="section-follow">
          {/* Fade-only (no rise): the ticker's own colored band made the
              translate read as the whole block sliding on load. */}
          {/* Opens the stats band, and drawn here rather than inside it so both
              ends land on the vertical rails — the band's own column is capped
              narrower than the rails and nudged off-centre, so a rule drawn there
              stopped short at both ends. */}
          <GridDivider />
          <Reveal variant="fade">
            <TrustTicker />
          </Reveal>
          {/* Closes the band, on the same rails. */}
          <GridDivider />
          <Reveal variant="fade">
            <HowItWorks />
          </Reveal>
          <GridDivider />
          <Reveal variant="fade">
            <ProductionGap />
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
