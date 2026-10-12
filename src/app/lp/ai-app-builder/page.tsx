import type { Metadata } from "next";
import { CTA } from "@/components/home/cta";
import {
  PLAN_CHIP,
  PLAN_CHIPS,
  SECONDARY_CTA,
} from "@/components/home/cta-styles";
import { FAQ, type FAQEntry } from "@/components/home/faq";
import { BuilderPillars } from "@/components/ai-app-builder/builder-pillars";
import {
  BUILDER_FAQS,
  PILLARS,
} from "@/components/ai-app-builder/builder-content";
import {
  BuilderGridRails,
  BUILDER_GRID_LINE,
  BUILDER_RAIL_HALO_WIDE,
} from "@/components/ai-app-builder/builder-grid-rails";
import { BuilderCustomerQuotes } from "@/components/ai-app-builder/builder-customer-quotes";
import { BuilderChapter } from "@/components/ai-app-builder/builder-chapter";
import { BuilderHowItWorks } from "@/components/ai-app-builder/builder-how-it-works";
import { BuilderAlternatives } from "@/components/ai-app-builder/builder-alternatives";
import { BuilderTemplates } from "@/components/ai-app-builder/builder-templates";
import { BuilderPrompt } from "@/components/ai-app-builder/builder-prompt";
import { BuilderGlow } from "@/components/ai-app-builder/builder-glow";
import { GridDivider } from "@/components/ui/grid-lines";
import { DEMO_URL, SIGNUP_URL } from "@/lib/constants";
import { PAGE_SEO, pageMetadata } from "@/lib/seo";

/**
 * GOOGLE ADS LANDING PAGE for the AI app builder.
 *
 * The same page as /ai-app-builder, built from the same sections, with the
 * copy pointed at business searches ("AI app builder for business", "build
 * business apps with AI", "no-code app builder") so the ad's keyword and the
 * headline it lands on match. Differences from the organic page:
 *
 * - Noindex, and listed in EXCLUDED in src/lib/sitemap-data.ts. It duplicates
 *   /ai-app-builder, and ad traffic arrives directly. AdsBot ignores the
 *   robots meta, so the ad can still be approved and scored.
 * - The nav is cut down to the account actions (RootShell sends /lp/* to
 *   StudioNav's `landing` mode), so a paid click has fewer ways off the page.
 *   The footer stays, since Google Ads wants the privacy policy reachable.
 * - The demo and the plan facts sit under the composer, above the fold.
 * - No FAQ schema: nothing here is meant to be a search result.
 *
 * gclid, gbraid, wbraid and UTMs ride through to signup via the site-wide
 * SignupAttributionLinks, so nothing on this page has to forward them.
 */
export const metadata: Metadata = {
  ...pageMetadata(PAGE_SEO.aiAppBuilderLanding),
  robots: { index: false, follow: false },
};

// The facts a paid visitor weighs before typing: what it costs and whether it
// is safe for client data. SOC 2 Type II is the security page's own claim.
const HERO_CHIPS = [...PLAN_CHIPS, "SOC 2 Type II"];

// Led by what a business can build, which is the question an ad click is
// asking, then the organic page's first six — the two after those are written
// for search answers and add nothing for someone who is already here.
const LANDING_FAQS: FAQEntry[] = [
  {
    question: "What kinds of business apps can I build with Assembly?",
    shortQuestion: "What kinds of business apps can I build?",
    answer:
      "Apps your clients and your team log into: client onboarding, document collection, approval flows, project trackers, proposal builders, time trackers, dashboards, and internal tools. Describe the app or start from a template, and Assembly builds it with logins, permissions, and your branding already in place.",
  },
  ...BUILDER_FAQS.slice(0, 6),
];

export default function AiAppBuilderLandingPage() {
  return (
    <>
      {/* The organic page's hero, same layout and glow: claim, lead, the
          composer. The one addition is the row under the box, which puts the
          demo and the plan facts above the fold. */}
      <section className="relative flex min-h-[calc(100svh-5rem)] items-start overflow-hidden pb-20 pt-10 md:items-center md:pb-28 md:pt-20">
        <BuilderGlow />
        <div className="relative z-10 mx-auto w-full max-w-[1400px] builder-hero-lift px-6 md:px-10">
          <div className="mx-auto max-w-3xl text-center">
            {/* "for business" held together with a no-break space: wrapped
                freely, the desktop measure left "business" alone on line two.
                It is the half of the headline the ad's keyword is matched on. */}
            <h1 className="type-display mx-auto max-w-[18ch] text-pretty">
              The AI app builder for{"\u00a0"}business
            </h1>
            <p className="type-lead mx-auto mt-5 max-w-[38rem] text-balance text-muted-foreground">
              Describe the app your business needs. Assembly builds a secure,
              working app for your clients and team, with logins, permissions,
              and branding built in.
            </p>
          </div>

          <BuilderPrompt placeholder="Describe the app your business needs…" />

          {/* Same order and classes as the CTA's secondary action and plan
              chips: an outline button under the box, then the facts. */}
          <div className="mt-4 flex justify-center">
            <a href={DEMO_URL} className={SECONDARY_CTA}>
              Book a demo
            </a>
          </div>
          <ul className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
            {HERO_CHIPS.map((label) => (
              <li key={label} className={PLAN_CHIP}>
                {label}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* From here down, the organic page's region: same rails, same chapters,
          same dividers. See src/app/ai-app-builder/page.tsx for why each piece
          is drawn the way it is. */}
      <div className="relative isolate bg-background">
        <BuilderGridRails />

        <BuilderChapter
          heading="Business apps your clients and team can use today"
          intro="Most AI app builders stop at a prototype. Assembly builds the parts a business needs in from the start: secure logins, permissions, a CRM, and your branding."
          split
        />
        <BuilderPillars pillars={PILLARS} />

        <GridDivider lineClass={BUILDER_GRID_LINE} />

        <BuilderChapter heading="How it works" tightBottom split />
        <BuilderHowItWorks />

        <GridDivider lineClass={BUILDER_GRID_LINE} />

        <BuilderAlternatives />

        <GridDivider lineClass={BUILDER_GRID_LINE} />

        <BuilderTemplates />

        <GridDivider lineClass={BUILDER_GRID_LINE} />

        <BuilderCustomerQuotes />

        <GridDivider lineClass={BUILDER_GRID_LINE} />

        <div className={`relative bg-background ${BUILDER_RAIL_HALO_WIDE}`}>
          <FAQ
            heading="Frequently asked questions"
            items={LANDING_FAQS}
            compactQuestions
          />
        </div>

        <GridDivider fullBleed lineClass={BUILDER_GRID_LINE} />

        <CTA
          heading={
            <>
              Build your first
              <br />
              business app today
            </>
          }
          subheading={
            <>
              Free to start, no credit card required.
              <br className="hidden md:inline" /> Describe what you need, or
              start from a template.
            </>
          }
          composer={false}
          primaryCta={{ label: "Start building for free", href: SIGNUP_URL }}
          secondaryCta={{ label: "Book a demo", href: DEMO_URL }}
          planChips={false}
          transparent
        />
      </div>
    </>
  );
}
