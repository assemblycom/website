import { CardRail, RailCard } from "@/components/ui/card-rail";
import { CTA } from "@/components/home/cta";
import { FAQ, type FAQEntry } from "@/components/home/faq";
import { Testimonials } from "@/components/home/testimonials";
import { FeatureMatrix } from "@/components/comparison/feature-matrix";
import { GRID_LINE, GridDivider, GridRails } from "@/components/ui/grid-lines";
import { PillarsTabs } from "@/components/comparison/pillars-tabs";
import { PortalPricing } from "@/components/client-portal/portal-pricing";
import { Reveal } from "@/components/ui/reveal";
import { VisualSlot } from "@/components/ui/visual-slot";
import { DEMO_URL, SIGNUP_URL } from "@/lib/constants";
import type { ComparisonRow } from "@/lib/comparisons";

interface Visual {
  label: string;
  description: string;
}

export interface VsPage {
  /** The competitor, as it is written everywhere on the page. */
  competitor: string;
  hero: {
    h1: string;
    /**
     * The brief's recommended subheader, and the hero's only lead paragraph.
     * The briefs also carry a body that restates it, which read as two stacked
     * paragraphs saying the same thing; the wedge it makes is what the whole
     * page below argues anyway.
     */
    sub: string;
    visual: Visual;
  };
  glance: {
    heading: string;
    sub: string;
    rows: ComparisonRow[];
  };
  pillarsHeading: string;
  pillars: {
    heading: string;
    /** Shown on the pillars control in place of `heading`. The headings are
     *  written as claims and are too long for a cell; same job `shortQuestion`
     *  does on an FAQ row. */
    tabLabel?: string;
    body: string;
    visual: Visual;
  }[];
  deepDives: {
    heading: string;
    body: string;
    visual: Visual;
  }[];
  betterFit: {
    heading: string;
    sub: string;
    items: { title: string; body: string }[];
  };
  /** Only the Lovable page runs pricing as its own section. */
  pricing?: {
    heading: string;
    /** One paragraph. PortalPricing takes a single lead under its heading. */
    body: string;
  };
  proof: {
    heading: string;
    sub: string;
  };
  faqs: FAQEntry[];
  cta: {
    heading: React.ReactNode;
  };
}

const RAIL = "mx-auto max-w-[1200px] px-6 md:px-10";

/**
 * The shape both hand-built comparison pages take.
 *
 * Separate from `comparison-body.tsx`, which renders the CMS pages: those are
 * read as articles in a single narrow column, while these two are designed
 * landing pages with pillars, deep dives and their own CTA. What they do share
 * is the capability matrix, which both import from `feature-matrix.tsx`.
 *
 * Every claim that is true only as of research day, or that legal still has to
 * clear, travels on the section that makes it rather than in a doc somewhere,
 * so a page cannot quietly outrun what was verified.
 */
export function VsComparisonPage({
  page,
  heroVisual,
}: {
  page: VsPage;
  /**
   * A built hero visual. When given, the hero splits: copy bottom-left, the
   * visual filling the right half. Without one, the centred hero and its
   * placeholder stay.
   */
  heroVisual?: React.ReactNode;
}) {
  return (
    <>
      {heroVisual ? (
        <SplitHero page={page} visual={heroVisual} />
      ) : (
        <section className="px-6 pb-16 pt-24 text-center md:pb-24 md:pt-32">
          <div className="mx-auto max-w-3xl">
            {/* The site's shared chip — mono, uppercase, rounded-md on the muted
              fill — the same one the stat chips and filter chips use, rather
              than a bare eyebrow line. */}
            <span className="inline-flex items-center rounded-md bg-muted px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-muted-foreground">
              Assembly vs {page.competitor}
            </span>
            <h1 className="type-display mt-4 text-balance">{page.hero.h1}</h1>
            {/* A narrower measure than the headline's, and balanced rather than
              pretty: at max-w-2xl the lead ran almost the full width of the
              h1 above it and dropped three words onto the second line, which
              read as an overflow instead of a pair of lines. */}
            <p className="type-lead mx-auto mt-6 max-w-lg text-balance text-muted-foreground">
              {page.hero.sub}
            </p>
            <div className="mx-auto mt-8 flex w-full max-w-xs flex-col items-stretch gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:items-center sm:justify-center">
              <a
                href={SIGNUP_URL}
                className="w-full rounded-lg border border-transparent bg-foreground px-5 py-3 text-center text-sm text-background transition-opacity hover:opacity-90 sm:w-auto sm:py-2.5"
              >
                Start building for free
              </a>
              <a
                href={DEMO_URL}
                className="w-full rounded-lg border border-foreground/20 bg-transparent px-5 py-3 text-center text-sm text-foreground transition-colors hover:bg-foreground/5 sm:w-auto sm:py-2.5 [[data-theme=dark]_&]:border-white/25"
              >
                Book a demo
              </a>
            </div>
          </div>
          <div className="mx-auto mt-14 max-w-[1200px] px-0 md:px-4">
            <VisualSlot
              className="text-left"
              label={page.hero.visual.label}
              description={page.hero.visual.description}
            />
          </div>
        </section>
      )}

      <div className="relative">
        <GridRails />
        <GridDivider fullBleed />

        {/* At a glance. The competitor keeps genuine marks on the rows it
            earns — a table that strawmans the other side costs more
            credibility than it buys. */}
        <section className={`${RAIL} py-16 md:py-24`}>
          <Reveal>
            <h2 className="type-h2 text-balance text-center">
              {page.glance.heading}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-balance text-center text-muted-foreground">
              {page.glance.sub}
            </p>
            {/* Bled to the rails, so the heading reads as its own band above
                the table the way the two headings below it do. */}
            <div
              className={`-mx-6 mt-12 hidden border-t md:-mx-10 md:block ${GRID_LINE}`}
            />
            <FeatureMatrix
              rows={page.glance.rows}
              competitor={page.competitor}
              caption={`Assembly compared with ${page.competitor}`}
              framed
            />
          </Reveal>
        </section>

        <GridDivider />

        {/* The three pillars as one tabbed panel — /ai-app-builder's
            how-it-works shape, on the same control. See PillarsTabs for why
            the contents rail that used to stand beside them went.

            Heading and control are ONE section with no rule between them. They
            were two, divided, which read as a title band and then a separate
            region that happened to follow it — and the rule put a full stop
            between a heading and the thing it introduces. Ranged left for the
            same reason /ai-app-builder ranges its how-it-works left: the
            control, the panel and all of the panel's copy start on that line,
            and a centred heading over them was the one thing that did not. */}
        <section className={`${RAIL} py-16 md:py-24`}>
          <h2 className="type-h2 text-balance">{page.pillarsHeading}</h2>
          <Reveal>
            <div className="mt-10 md:mt-12">
              <PillarsTabs pillars={page.pillars} />
            </div>
          </Reveal>
        </section>

        <GridDivider />

        <section className={`${RAIL} py-16 md:py-24`}>
          <Reveal>
            <div className="space-y-14">
              {page.deepDives.map((dive) => (
                <div
                  key={dive.heading}
                  className="grid gap-10 md:grid-cols-2 md:gap-16"
                >
                  <div className="md:self-start">
                    <h3 className="type-h3 text-balance leading-[1.2]">
                      {dive.heading}
                    </h3>
                    <p className="mt-4 max-w-md text-muted-foreground">
                      {dive.body}
                    </p>
                  </div>
                  <VisualSlot
                    ratio="4 / 3"
                    label={dive.visual.label}
                    description={dive.visual.description}
                  />
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        <GridDivider />

        {/* The honest boundary. Visually calmer than the pillars on purpose:
            it should read as a fair-minded aside, not another pitch. */}
        {/* The section carries its own bottom padding again. It used to hand
            that to the columns so the rules between them could run down to the
            section's rule; the cards have no rules to run. */}
        <section className={`${RAIL} py-16 md:py-24`}>
          <Reveal>
            <h2 className="type-h2 text-balance text-center">
              {page.betterFit.heading}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-balance text-center text-muted-foreground">
              {page.betterFit.sub}
            </p>
            {/* The site's card rail, which is what /client-portal runs for
                its build steps — so on a phone these three step sideways with
                arrows under them instead of stacking into three full-width
                panels and a screen and a half of scrolling. RailCard's default
                shape is already this one: a square --surface panel with the
                copy under it, which is why there is no bespoke card here any
                more. The panels are empty until the visuals land.

                From lg the rail fits all three and its arrows go quiet on
                their own, so the desktop row is unchanged. */}
            <div className="mt-12">
              <CardRail label={page.betterFit.heading}>
                {page.betterFit.items.map((item) => (
                  <RailCard
                    key={item.title}
                    name={item.title}
                    caption={item.body}
                  >
                    {null}
                  </RailCard>
                ))}
              </CardRail>
            </div>
          </Reveal>
        </section>

        {page.pricing && (
          <>
            <GridDivider />
            {/* /client-portal's pricing block, rendered as-is: the same four
                outlined cards, the same tiers, the same quiet button under the
                copy. Pricing is one object on this site, and a comparison page
                that drew its own version of it would be a second — which is
                what the first two attempts here were, one of them a hand-built
                card that came out nothing like the rest of the site.

                It brings its own section, padding and 1200px rail, matching
                the RAIL this page uses elsewhere. */}
            <PortalPricing
              heading={page.pricing.heading}
              body={page.pricing.body}
            />
          </>
        )}

        <GridDivider />

        <section className={`${RAIL} py-16 md:py-24`}>
          <h2 className="type-h2 text-balance text-center">
            {page.proof.heading}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-center text-muted-foreground">
            {page.proof.sub}
          </p>
        </section>

        <GridDivider />
        {/* The site's featured-story component, carrying its default (AdvertAI):
            an agency shipping to 200+ clients is the outcome a visitor stalled
            in a code-generation tool is trying to picture, and the quote is
            already public. */}
        <Testimonials />

        <GridDivider />
      </div>

      <div className="relative pb-10 md:pb-16">
        <GridRails />
        {/* The divided list, matching the other hand-built pages in this family
            (/ai-app-builder, /client-portal and the two vertical pages). The
            two-column card grid is the CMS pages' FAQ; these pages read as one
            set, so they take one FAQ. */}
        <FAQ
          heading="Frequently asked questions"
          items={page.faqs}
          variant="divided"
          dottedRules
          compactQuestions
        />
      </div>

      <div className="border-t border-border [[data-theme=dark]_&]:border-[#383838]" />

      {/* The short lead, the one /pricing, /templates, /customers and the
          embeds page already close on — not a third version of this sentence.
          The CTA's own default is the long form, which the homepage and the
          builder and portal pages still use. */}
      <CTA
        heading={page.cta.heading}
        subheading={
          <>
            Stop stitching together tools that were never meant to fit.
            {/* One sentence per line from sm up. The CTA's own default breaks
                at md, which left every width between 640 and 768 wrapping the
                pair into three ragged lines — 400px, then 192, then 72. The
                first sentence fits a 640px column on its own, so the break
                can start there. Below sm it wraps naturally. */}
            <br className="hidden sm:inline" /> Run and build everything in one
            place.
          </>
        }
      />
    </>
  );
}

/**
 * The hero as two halves: the claim set low on the left so it reads last,
 * after the eye has taken in the product on the right. Stacked, the copy leads
 * and the visual follows.
 */
function SplitHero({
  page,
  visual,
}: {
  page: VsPage;
  visual: React.ReactNode;
}) {
  return (
    // The site's hero container, so the copy starts on the same line as the
    // nav and the other product heroes.
    <section className="mx-auto grid max-w-[1400px] lg:min-h-[min(760px,calc(100svh-120px))] lg:grid-cols-2">
      <div className="flex flex-col justify-end px-6 pb-12 pt-24 md:px-10 md:pb-16 lg:pt-16">
        {/* No "Assembly vs <competitor>" line above the h1. The headline
            already names the competitor ("The client-facing alternative to
            Lovable"), the nav crumb and the page title both say it again, and
            a small grey restatement directly above it read as a label on the
            headline rather than as context for it. The centred hero below
            keeps its chip — that one carries a page with no other framing. */}
        <h1 className="type-display max-w-[17ch] text-balance">
          {page.hero.h1}
        </h1>
        <p className="type-lead mt-6 max-w-lg text-pretty text-muted-foreground">
          {page.hero.sub}
        </p>
        <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <a
            href={SIGNUP_URL}
            className="w-full rounded-lg border border-transparent bg-foreground px-5 py-3 text-center text-sm text-background transition-opacity hover:opacity-90 sm:w-auto sm:py-2.5"
          >
            Start building for free
          </a>
          <a
            href={DEMO_URL}
            className="w-full rounded-lg border border-foreground/20 bg-transparent px-5 py-3 text-center text-sm text-foreground transition-colors hover:bg-foreground/5 sm:w-auto sm:py-2.5 [[data-theme=dark]_&]:border-white/25"
          >
            Book a demo
          </a>
        </div>
      </div>
      {/* Inset on the page's own gutter and rounded, so the panel reads as a
          surface set on the page rather than half the page painted. */}
      <div className="flex px-6 pb-6 md:px-10 md:pb-10 lg:pl-0 lg:pt-6">
        <div className="min-h-[560px] w-full overflow-hidden rounded-[28px]">
          {visual}
        </div>
      </div>
    </section>
  );
}
