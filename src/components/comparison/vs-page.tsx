import { CTA } from "@/components/home/cta";
import { FAQ, type FAQEntry } from "@/components/home/faq";
import { Testimonials } from "@/components/home/testimonials";
import { FeatureMatrix } from "@/components/comparison/feature-matrix";
import { GridDivider, GridRails } from "@/components/ui/grid-lines";
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
    sub?: string;
    body: string;
    /** A fact-check or legal flag the page must not outrun. */
    note?: string;
    visual: Visual;
  }[];
  deepDives: {
    heading: string;
    body: string;
    note?: string;
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
    sub: string;
    body: string;
    visual: Visual;
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
export function VsComparisonPage({ page }: { page: VsPage }) {
  return (
    <>
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
              className="rounded-lg bg-foreground px-5 py-2.5 text-center text-sm text-background transition-opacity hover:opacity-90"
            >
              Start building for free
            </a>
            <a
              href={DEMO_URL}
              className="rounded-lg border border-foreground/20 bg-transparent px-5 py-2.5 text-center text-sm text-foreground transition-colors hover:bg-foreground/5"
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

      <div className="relative">
        <GridRails />
        <GridDivider fullBleed />

        {/* At a glance. The competitor keeps genuine marks on the rows it
            earns — a table that strawmans the other side costs more
            credibility than it buys. */}
        <section className={`${RAIL} py-16 md:py-24`}>
          <Reveal>
            <h2 className="type-h2 text-balance">{page.glance.heading}</h2>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              {page.glance.sub}
            </p>
            <FeatureMatrix
              rows={page.glance.rows}
              competitor={page.competitor}
              caption={`Assembly compared with ${page.competitor}`}
            />
          </Reveal>
        </section>

        <GridDivider />

        <section className={`${RAIL} pb-4 pt-16 md:pt-24`}>
          <h2 className="type-h2 text-balance">{page.pillarsHeading}</h2>
        </section>

        {page.pillars.map((pillar, i) => (
          <div key={pillar.heading}>
            {i > 0 && <GridDivider />}
            <section className={`${RAIL} py-16 md:py-20`}>
              <Reveal>
                <div className="grid gap-10 md:grid-cols-2 md:gap-16">
                  <div className="md:self-start">
                    <h3 className="type-h3 text-balance leading-[1.2]">
                      {pillar.heading}
                    </h3>
                    {pillar.sub && (
                      <p className="mt-4 max-w-md text-muted-foreground">
                        {pillar.sub}
                      </p>
                    )}
                    <p className="mt-4 max-w-md text-muted-foreground">
                      {pillar.body}
                    </p>
                    {pillar.note && <Note>{pillar.note}</Note>}
                  </div>
                  <VisualSlot
                    ratio="4 / 3"
                    label={pillar.visual.label}
                    description={pillar.visual.description}
                  />
                </div>
              </Reveal>
            </section>
          </div>
        ))}

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
                    {dive.note && <Note>{dive.note}</Note>}
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
        <section className={`${RAIL} py-16 md:py-24`}>
          <Reveal>
            <h2 className="type-h2 text-balance">{page.betterFit.heading}</h2>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              {page.betterFit.sub}
            </p>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {page.betterFit.items.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-border p-5"
                >
                  <p className="text-sm">{item.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {page.pricing && (
          <>
            <GridDivider />
            <section className={`${RAIL} py-16 md:py-24`}>
              <Reveal>
                <div className="grid gap-10 md:grid-cols-2 md:gap-16">
                  <div className="md:self-start">
                    <h2 className="type-h2 text-balance">
                      {page.pricing.heading}
                    </h2>
                    <p className="mt-4 max-w-md text-muted-foreground">
                      {page.pricing.sub}
                    </p>
                    <p className="mt-4 max-w-md text-muted-foreground">
                      {page.pricing.body}
                    </p>
                  </div>
                  <VisualSlot
                    ratio="4 / 3"
                    label={page.pricing.visual.label}
                    description={page.pricing.visual.description}
                  />
                </div>
              </Reveal>
            </section>
          </>
        )}

        <GridDivider />

        <section className={`${RAIL} pb-4 pt-16 md:pt-24`}>
          <h2 className="type-h2 text-balance">{page.proof.heading}</h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            {page.proof.sub}
          </p>
        </section>
        {/* The site's featured-story component, carrying its default (AdvertAI):
            an agency shipping to 200+ clients is the outcome a visitor stalled
            in a code-generation tool is trying to picture, and the quote is
            already public. */}
        <Testimonials />

        <GridDivider />
      </div>

      <div className="relative pb-10 md:pb-16">
        <GridRails />
        <FAQ
          heading="Frequently asked questions"
          items={page.faqs}
          twoColumn
        />
      </div>

      <div className="border-t border-border [[data-theme=dark]_&]:border-[#383838]" />

      <CTA heading={page.cta.heading} />
    </>
  );
}

/** A fact-check or legal flag, kept beside the claim it qualifies. */
function Note({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-5 max-w-md rounded-lg bg-muted p-4 text-sm leading-relaxed text-muted-foreground">
      {children}
    </p>
  );
}
