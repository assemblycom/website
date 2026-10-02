import type { Metadata } from "next";
import { HeroV76 } from "@/components/home/hero-v76";
import { getVisibleTemplates } from "@/lib/visible-templates";
import { HowItWorks } from "@/components/home/how-it-works";
import { Testimonials } from "@/components/home/testimonials";
import { HomeFAQ } from "@/components/home/faq";
import { CTA } from "@/components/home/cta";
import { ProductionGap } from "@/components/home/production-gap";
import { WholeStack } from "@/components/home/whole-stack";
import { Reveal } from "@/components/ui/reveal";
import { GridDivider, GridRails } from "@/components/ui/grid-lines";

// Re-resolved against Contentful every few minutes rather than only at deploy.
// Prerendered once, an editor hiding a template in the CMS had no effect until
// somebody happened to ship — which is not what "the CMS is the catalogue" can
// mean in practice. Five minutes is short enough that a change lands while the
// person who made it is still looking, and long enough that crawlers aren't
// re-running the query on every hit.
// Only the canonical, deliberately: the layout already sets this page's title,
// description and card, and routing home through pageMetadata() would push its
// title through the "%s | Assembly" template and brand it twice.
//
// Written out rather than left to the layout's relative "./". Relative resolves
// against the route, and for the root route that came out as /index — a URL that
// does not exist, offered to crawlers as the canonical one.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export const revalidate = 300;

export default async function HomePage() {
  const templates = await getVisibleTemplates();
  return (
    <>
      {/* Upper half shares the hero's surface — the walkthrough sits on the
          same color as the hero (see .section-follow), so they read as one
          canvas. */}
      <HeroV76 templates={templates} />

      {/* Content region — framed by vertical rails aligned to the 1200px
          content column. The rails start below the hero and run down through
          the sections (the wide footer sits outside this wrapper). Drawn on top
          as thin lines in the column gutter so section fills never hide them. */}
      <div className="relative">
        <GridRails />

        {/* The "how it works" walkthrough comes first, then the three platform
            points (left-rail menu + visual). */}
        <div className="section-follow">
          {/* The stats band is out for now. TrustTicker is untouched in
              home/trust-ticker.tsx and drops back in here between two
              dividers, which is what its own rules used to be.

              Full bleed because this is the first rule under the hero: there
              are no rails above it for a capped one to land on, so it opens
              the region edge to edge the way the other pages do. */}
          <GridDivider fullBleed />
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
