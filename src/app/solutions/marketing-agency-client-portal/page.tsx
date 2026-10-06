import type { Metadata } from "next";
import { GridDivider, GridRails } from "@/components/ui/grid-lines";
import { PortalHeroCarousel } from "@/components/client-portal/portal-hero-carousel";
import { PortalSocialProof } from "@/components/client-portal/portal-social-proof";
import { PortalProblem } from "@/components/client-portal/portal-problem";
import { PortalReadyMade } from "@/components/client-portal/portal-ready-made";
import { PortalBuild } from "@/components/client-portal/portal-build";
import { PortalTailor } from "@/components/client-portal/portal-tailor";
import { PortalStack } from "@/components/client-portal/portal-stack";
import { PortalTrust } from "@/components/client-portal/portal-trust";
import { PortalProof } from "@/components/client-portal/portal-proof";
import { PortalPricing } from "@/components/client-portal/portal-pricing";
import { CTA } from "@/components/home/cta";
import { FAQ, type FAQEntry } from "@/components/home/faq";
import { serializeJsonLd } from "@/lib/json-ld";
import { DEMO_URL, SIGNUP_URL } from "@/lib/constants";
import { PAGE_SEO, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  PAGE_SEO.marketingAgencyClientPortal,
);

/**
 * The agency cut of /client-portal, built the same way its accounting sibling
 * is: the same components, this vertical's copy passed in. See
 * src/app/solutions/accounting-client-portal/page.tsx for the pattern.
 *
 * All eleven sections are here.
 *
 * The visuals V1-V8 are not built. Every slot holds its shape and draws
 * nothing, with its art direction in `title` — never /client-portal's picture,
 * which runs that page's own firm.
 */

/** Section 3. All five resolve from the committed templates. */
const AGENCY_APPS = [
  {
    slug: "design-approvals",
    title: "Design approvals",
    description: "Creative sign-off, round by round.",
    foundation: "Approvals",
  },
  {
    slug: "content-approval-flow",
    title: "Content approval flow",
    description: "Posts and campaigns with status history.",
    foundation: "Content",
  },
  {
    slug: "proposal-builder",
    title: "Proposals",
    description: "Branded proposals clients can e-sign.",
    foundation: "Proposals",
  },
  {
    slug: "client-project-tracker",
    title: "Client project tracker",
    description: "Milestones and live progress for every engagement.",
    foundation: "Projects",
  },
  {
    slug: "time-tracker",
    title: "Time tracker",
    description: "Log billable hours by client and export timesheets.",
    // Marked "(Internal)" in the handoff; carried as the site's mono chip
    // rather than as words inside the title, same as the accounting page.
    foundation: "Internal",
  },
];

/**
 * Section 10. Seven questions, each naming the thing an agency is weighing —
 * including the three where another tool wins, which is the point of asking
 * them here rather than leaving them to a sales call.
 */
const AGENCY_FAQS: FAQEntry[] = [
  {
    question: "Will my clients actually log in?",
    answer:
      "They sign in with Google or a one-click email link, and can reply to messages straight from email.",
  },
  {
    question: "Is an app I build just a prototype?",
    answer:
      "No. It runs inside your client experience with logins, permissions, and your built-in CRM from the day you publish it.",
  },
  {
    question: "Why not build it myself with another AI builder?",
    shortQuestion: "Why not another AI builder?",
    answer:
      "You can, but you would set up logins, per-client data, and hosting yourself. On Assembly those come with the platform, along with ready-made apps for billing and files.",
  },
  {
    question: "Does Assembly replace my reporting tool?",
    answer:
      "Embed Looker Studio, Databox, or Power BI and add your commentary in a report app. Dedicated reporting tools have more native data integrations, and many agencies use both.",
  },
  {
    question: "Can clients review video frame by frame?",
    answer:
      "Not natively. Embed Loom or YouTube for walkthroughs, and keep a dedicated video review tool for frame-accurate comments.",
  },
  {
    question: "Can I put the client portal on my agency's domain?",
    shortQuestion: "Can I use my own domain?",
    answer:
      "Yes, on Professional and above, which also removes the Assembly badge. Your logo and colors work on every plan.",
  },
  {
    question: "Is Assembly a white label client portal?",
    answer:
      "Yes. Clients see your logo and colors, and every app you build carries your brand. Your own domain comes with Professional.",
  },
];

// Built from the same entries the accordion renders, so the questions a crawler
// reads can never drift from the ones on the page.
const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: AGENCY_FAQS.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })),
};

export default function MarketingAgencyClientPortalPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(FAQ_SCHEMA) }}
      />
      {/* 1. Hero. Same split header as the accounting page. The CTAs are the
          other way round here, per the handoff: an agency is a faster,
          self-serve sale than a firm, so the free start leads. */}
      <section className="pb-16 pt-24 md:pb-24 md:pt-32">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-x-16">
            <h1 className="type-display max-w-[30ch] text-balance lg:col-start-1">
              Turn your agency&rsquo;s know-how into AI-built apps
            </h1>
            <p className="type-lead max-w-[34rem] text-pretty text-muted-foreground lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:pt-2">
              Assembly gives your agency a branded client portal for reports,
              approvals, invoices, and files. Use AI to build what sets your
              agency apart, from analytics dashboards to design review apps.
            </p>
            <div>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <a
                  href={SIGNUP_URL}
                  className="w-full rounded-lg bg-foreground px-5 py-3 text-center text-sm text-background transition-opacity hover:opacity-90 sm:w-auto sm:py-2.5"
                >
                  Get started free
                </a>
                <a
                  href={DEMO_URL}
                  className="w-full rounded-lg border border-foreground/20 bg-transparent px-5 py-3 text-center text-sm text-foreground transition-colors hover:bg-foreground/5 sm:w-auto sm:py-2.5"
                >
                  Book a demo
                </a>
              </div>
            </div>
          </div>

          {/* V1's slot, filled by the portal carousel rather than held open.
              The panel's portal is Brandmages — a marketing agency — so unlike
              on the accounting page this is the right vertical rather than a
              neutral stand-in, and it is given the agency set: the four apps
              the lead above it actually names (AI-built, design approvals, the
              engagement dashboard, document collection) instead of the general
              portal four. See AGENCY_ITEMS in portal-hero-carousel.tsx.

              The V1 art direction below is kept so it is not lost with the
              placeholder that carried it: V1 — the agency hero shot. */}
          <PortalHeroCarousel set="agency" />
          <PortalSocialProof />
        </div>
      </section>

      <div className="relative">
        <GridRails />
        <GridDivider fullBleed />

        {/* 2. Problem. */}
        <PortalProblem
          heading="Stop scattering your deliverables across tools"
          body="Feedback in one app, files in another, reports in a third, invoices by email. Clients ask where things stand because they can't see it."
          sides={[]}
          quote={{
            // Quoted from the published Advertai study. See case-studies.ts.
            text: "We were dealing with scattered emails and no good way to share information with clients.",
            attribution: "Garrett Leonard, Founder, Advertai Marketing",
            href: "/customers/advertai-marketing",
          }}
          screens={
            <div
              aria-hidden
              title="V2 — the agency problem shot. Art direction pending."
              className="h-[300px] md:h-[400px]"
            />
          }
        />
        <GridDivider />

        {/* 3. Ready-made apps. */}
        <PortalReadyMade
          id="ready-made-apps"
          heading="Ready-made apps for how agencies deliver"
          body="Start with 30+ working apps, from design approvals to proposals clients sign and pay. Install one, then reshape it by describing the change."
          picks={AGENCY_APPS}
          link={{ label: "Browse all templates", href: "/templates" }}
        />
        <GridDivider />

        {/* 4. Build. No rail here: this handoff states the mechanism in one
            paragraph rather than stepping through it, so the section is claim,
            paragraph, actions and the picture. */}
        <PortalBuild
          heading="Retire a subscription. Build the app instead."
          body="Describe what you want. The builder asks a few questions, shows a one-page plan, and builds after you approve. Every app connects to your built-in CRM, so it already knows each client."
          steps={[]}
          cta={{ label: "Get started free", href: SIGNUP_URL }}
          // OPEN: the handoff leaves this target to the web lead — /ai-app-builder
          // if it is live, otherwise /blog/assembly-studio. /ai-app-builder is
          // new in this same PR, so the two ship together or not at all.
          link={{
            label: "See how the app builder works",
            href: "/ai-app-builder",
          }}
          visual={
            <div
              aria-hidden
              title="V4 — the agency build shot. Art direction pending."
              className="mt-12 h-[400px] rounded-3xl bg-[var(--surface)] md:h-[500px]"
            />
          }
        />
        <GridDivider />

        {/* 5. Tailor. One picture, as in the handoff — not /client-portal's
            four cards, which are that page's own apps and its own argument. */}
        <PortalTailor
          heading="Every client gets their own branded view"
          body="Custom fields decide which apps each client sees, so your top tier can book strategy sessions while everyone gets the monthly report. Every app you build carries your logo and colors."
          visual={
            <div
              aria-hidden
              title="V5 — the agency tailor shot. Art direction pending."
              className="mt-12 h-[400px] rounded-3xl bg-[var(--surface)] md:mt-14 md:h-[500px]"
            />
          }
        />

        {/* 6. Keep your stack. The three links drop out here the same way they
            do on the accounting page: this copy names the tools outright
            rather than handing the reader on to three destinations. */}
        <PortalStack
          heading="Your stack plugs in behind your brand"
          body="Embed Figma, Canva, Looker Studio, ClickUp, and Calendly so clients see them inside your client experience. Connect the rest with Zapier, Make, the API, or MCP."
          ways={[]}
          visualTitle="V6 — the agency stack shot. Art direction pending."
        />


        {/* 7. Trust. No rows here: this handoff makes the security case in its
            paragraph rather than in drawers a reader opens, so the right column
            carries the picture instead. The seal band keeps all four marks —
            unlike the accounting page, this copy claims the HIPAA BAA. */}
        <PortalTrust
          heading="Every app you build ships with guardrails"
          body="Logins, permissions, and who sees what come from the platform, so each client sees only their own data. SOC 2 Type II, with a HIPAA BAA on the Advanced plan."
          claims={[]}
          link={{ label: "Read about security", href: "/security" }}
          visual={
            <div
              aria-hidden
              title="V7 — the agency trust shot. Art direction pending."
              className="h-[300px] rounded-3xl bg-[var(--surface)] md:h-[400px]"
            />
          }
        />
        <GridDivider />
      </div>

      <div className="relative">
        <GridRails />

        {/* 8. Proof. One firm, not three: this handoff tells a single story at
            length, so the band runs as one block rather than three columns.

            No picture slot here. The section closes on the quote — the logo,
            the claim and the words are the proof, and an empty panel under
            them only pushed the one thing this section has to say further up
            the page. V8 can take the slot back when it exists. */}
        <PortalProof
          heading="Five tools replaced. Five apps built."
          body="Advertai Marketing, an 11-person agency, built its own message center, design feedback app, and SEO dashboard on Assembly, and is retiring Markup.io, Bright Local, and Keyword.com."
          stories={[
            {
              slug: "advertai-marketing",
              // Quoted from the published Advertai study. See case-studies.ts.
              quote:
                "We've heard how professional everything feels, and how it's really unique compared to any other experience they've had.",
              name: "Garrett Leonard",
              role: "Founder @ Advertai Marketing",
              href: "/customers/advertai-marketing",
            },
          ]}
        />
        <GridDivider />

        {/* 9. Pricing. The site's priced cards, unchanged — this handoff names
            no plan set of its own, and pricing is one object across the site. */}
        <PortalPricing
          heading="Start free. No per-client charges."
          body="The free plan includes 5 active contacts and 3 apps. Your own domain and badge removal start on Professional."
          link={{ label: "See pricing", href: "/pricing" }}
        />
        <GridDivider />
      </div>

      <div className="relative">
        <GridRails />
        {/* 10. FAQ. */}
        <FAQ
          heading={"What agencies ask before moving\u00A0clients"}
          items={AGENCY_FAQS}
          variant="divided"
          dottedRules
          compactQuestions
        />
        <GridDivider fullBleed />
      </div>

      {/* 11. Final CTA. The pair of buttons the page opened on, in the same
          order; no composer, for the reason the accounting page gives. */}
      <CTA
        heading={<>Make your client experience the pitch</>}
        subheading="Start free and build your first app today."
        composer={false}
        planChips={false}
        primaryCta={{ label: "Get started free", href: SIGNUP_URL }}
        secondaryCta={{ label: "Book a demo", href: DEMO_URL }}
      />
    </>
  );
}
