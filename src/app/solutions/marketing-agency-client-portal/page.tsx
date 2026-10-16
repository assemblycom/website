import type { Metadata } from "next";
import { GridDivider, GridRails } from "@/components/ui/grid-lines";
import { AgencyHeroVisual } from "@/components/solutions/agency-hero-visual";
import { AgencyLoginsVisual } from "@/components/solutions/agency-logins-visual";
import { AgencyViewsVisual } from "@/components/solutions/agency-views-visual";
import {
  BuildCard,
  DescribeCard,
  PlanCard,
} from "@/components/client-portal/portal-build-cards";
import { PortalSocialProof } from "@/components/client-portal/portal-social-proof";
import { PortalProblem } from "@/components/client-portal/portal-problem";
import { PortalReadyMade } from "@/components/client-portal/portal-ready-made";
import { PortalBuild } from "@/components/client-portal/portal-build";
import { PortalTailor } from "@/components/client-portal/portal-tailor";
import { PortalStack } from "@/components/client-portal/portal-stack";
import { PortalTrust } from "@/components/client-portal/portal-trust";
import { PortalPricing } from "@/components/client-portal/portal-pricing";
import {
  IconTemplateApprovals,
  IconTemplateMessages,
  IconTemplateProjects,
  IconTemplateProposals,
  IconTemplateTimeTracker,
} from "@/components/templates/template-icons";
import { Testimonials } from "@/components/home/testimonials";
import { CTA } from "@/components/home/cta";
import { FAQ, type FAQEntry } from "@/components/home/faq";
import { serializeJsonLd } from "@/lib/json-ld";
import { DEMO_URL, SIGNUP_URL } from "@/lib/constants";
import { PAGE_SEO, pageMetadata } from "@/lib/seo";
import { unbreakable } from "@/components/ui/unbreakable";

/** Both hero leads, so the phone's and the desktop's cannot drift apart. */
const HERO_LEAD =
  "type-lead max-w-[34rem] text-pretty text-muted-foreground lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:pt-2";

/** Section 4's rail. Two-line captions, like the accounting page's. */
const BUILD_STEPS = [
  {
    name: "Describe it",
    body: "Tell the AI what you need, like a project tracker or a campaign report.",
  },
  {
    name: "Answer a few questions",
    body: "It asks one to three questions so the app fits how your agency works.",
  },
  {
    name: "Approve and it appears",
    body: "The app shows up in your client experience with logins, permissions, and your branding in place.",
  },
];

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
const AGENCY_TRUST_CLAIMS: FAQEntry[] = [
  {
    question: "Sign-in",
    answer: "Clients use Google or a secure one-click email link.",
  },
  {
    question: "MFA",
    answer: "Available on every plan, and enforced on Advanced.",
  },
  {
    question: "Audit log",
    answer: "Sign-ins, files, billing, and signatures, on Advanced.",
  },
  {
    question: "AI and client data",
    answer:
      "Apps built with AI use the same logins and permissions as every other app in the portal.",
  },
];

const AGENCY_APPS = [
  {
    slug: "design-approvals",
    title: "Design approvals",
    description: "Creative sign-off, round by round.",
    foundation: "Approvals",
    icon: <IconTemplateApprovals className="w-[30px]" />,
  },
  {
    slug: "content-approval-flow",
    title: "Content approval flow",
    description: "Posts and campaigns with status history.",
    foundation: "Content",
    icon: <IconTemplateMessages className="w-[26px]" />,
  },
  {
    slug: "proposal-builder",
    title: "Proposals",
    description: "Branded proposals clients can e-sign.",
    foundation: "Proposals",
    icon: <IconTemplateProposals className="w-[26px]" />,
  },
  {
    slug: "client-project-tracker",
    title: "Client project tracker",
    description: "Milestones and live progress for every engagement.",
    foundation: "Projects",
    icon: <IconTemplateProjects className="w-[22px]" />,
  },
  {
    slug: "time-tracker",
    title: "Time tracker",
    description: "Log billable hours by client and export timesheets.",
    icon: <IconTemplateTimeTracker className="w-[26px]" />,
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
            {/* unbreakable, so "know-how" and "AI-built" stay whole: balancing
                was splitting the first at its hyphen and leaving the line on
                "know-", which reads as a typo in a headline. The helper the
                post titles and the comparison headings already use. */}
            <h1 className="type-display max-w-[30ch] text-balance lg:col-start-1">
              {unbreakable(
                "Turn your agency\u2019s know-how into AI-built apps",
              )}
            </h1>
            {/* Two leads, one measure — the pair the accounting page already
                runs, for the same reason. The desktop sentence takes five
                lines on a 390px screen and pushes both buttons below the fold
                on this page's most important screen; the phone gets the same
                argument, portal plus AI for what sets the agency apart,
                without the two enumerations the sections below make anyway.

                Two paragraphs rather than one clamped, because a clamp cuts
                mid-sentence and cannot be read for sense. The classes are
                shared so the two cannot drift apart. */}
            <p className={`${HERO_LEAD} md:hidden`}>
              A branded client portal for your agency&rsquo;s work &mdash; and
              AI to build what sets you apart.
            </p>
            <p className={`hidden ${HERO_LEAD} md:block`}>
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

          {/* V1's slot. NOT the portal carousel the other two pages run: that
              panel, its four app names and its "Your own app / Select a
              template" control are the same hero /client-portal opens on, so
              this page opened on a picture a visitor had already seen. This is
              the agency's own portal, open on the app its lead names first.

              The V1 art direction below is kept so it is not lost with the
              placeholder that carried it: V1 — the agency hero shot. */}
          {/* The page's own measure, like the accounting page's hero panel
              beside it: capped at 980 the tray read as short next to a shot
              that runs 1320, however tall it was. The grey carries on all four
              sides of the screen rather than hugging it as a 16px border —
              with 24px of padding and no bottom at all it was an outline drawn
              on the shot rather than the ground the shot sits on. */}
          <div className="mt-12 overflow-hidden rounded-3xl bg-[var(--surface)] p-6 pb-0 md:mt-16 md:p-12 md:pb-0">
            {/* Narrower than the tray and centred in it, running to the tray's
                bottom edge: the grey is the ground on three sides and the
                screen gives out on the fourth.

                The window is shorter than the screen inside it, which is the
                crop: the nav, the round and the decision are all above its
                foot and the thread carries on past it. The heights carry the
                48px the bottom padding used to hold, so the tray is the same
                size it was.

                The heights are set so this tray finishes the same height as
                the accounting page's hero tray — 385px on a phone, 439px from
                md — since the two solutions pages are the same page with a
                different vertical and a hero that is 130px taller on one of
                them reads as a different template. They are the window only,
                so each one is the target MINUS this tray's top padding (24,
                then 48); there is no bottom padding to subtract. The accounting
                tray is content-sized and so drifts a little between these two
                widths, where this one is fixed — they are matched at the two
                breakpoints the page actually declares, not at every width. */}
            <div className="relative mx-auto h-[361px] max-w-[1040px] overflow-hidden rounded-t-xl md:h-[391px]">
              <div className="absolute inset-x-0 top-0 h-[860px]">
                <AgencyHeroVisual />
              </div>
            </div>
          </div>

          <PortalSocialProof />
        </div>
      </section>

      <div className="relative">
        <GridRails />
        <GridDivider fullBleed />

        {/* 2. Problem. */}
        <PortalProblem
          // Picture and quote as one row, same as the accounting page.
          split
          heading="Stop scattering your deliverables across tools"
          body="Feedback in one app, files in another, reports in a third, invoices by email. Clients ask where things stand because they can't see it."
          sides={[]}
          quote={{
            // Quoted from the published Advertai study. See case-studies.ts.
            text: "We were dealing with scattered emails and no good way to share information with clients.",
            attribution: "Garrett Leonard, Founder, Advertai Marketing",
            href: "/customers/advertai-marketing",
            logoSlug: "advertai-marketing",
          }}
          // The accounting page's picture, with the agency's own tools: a
          // stack of sign-ins over a photograph, same component and the same
          // heights. The photograph is a creative at work, in the same warm
          // light as the accounting desk.
          trayImage="/images/mocks/sign-in-bg.jpg"
          screens={
            <div className="h-[340px] md:h-[480px]">
              <AgencyLoginsVisual />
            </div>
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
          body="Describe what you want. The builder asks a few questions, shows a one-page plan, and builds after you approve. Every app knows your clients from the built-in CRM."
          // The accounting page's three-step rail, and the three steps this
          // body names in order: describe, answer and see the plan, approve.
          // The rail's default scenes are an agency's — Brandmages building a
          // client project tracker — so they need no vertical of their own.
          steps={BUILD_STEPS.map((step, i) => ({
            ...step,
            visual: [
              <DescribeCard key="d" />,
              <PlanCard key="p" />,
              <BuildCard key="b" />,
            ][i],
          }))}
          railLabel="How building works"
          cta={{ label: "Get started free", href: SIGNUP_URL }}
          // OPEN: the handoff leaves this target to the web lead — /ai-app-builder
          // if it is live, otherwise /blog/assembly-studio. /ai-app-builder is
          // new in this same PR, so the two ship together or not at all.
          link={{
            label: "See how the app builder works",
            href: "/ai-app-builder",
          }}
        />
        <GridDivider />

        {/* 5. Tailor. One picture, as in the handoff — not /client-portal's
            four cards, which are that page's own apps and its own argument. */}
        <PortalTailor
          heading="Every client gets their own branded view"
          body="Custom fields decide which apps each client sees — your top tier books strategy sessions, everyone gets the monthly report. Every app carries your logo and colors."
          // Heading left, lead right, the picture below: the two tiers the
          // lead names, in the agency's own portal. See agency-views-visual.
          split
          visual={<AgencyViewsVisual />}
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
          // The same four rows the accounting page opens, in this page's
          // words: the right column is where this section makes its case, and
          // a held-open picture made the heading's claim the only thing on it.
          // HIPAA is a BAA on Advanced here rather than a mark in the seal
          // band, which is what the body above already says.
          claims={AGENCY_TRUST_CLAIMS}
          link={{ label: "Read about security", href: "/security" }}
        />
        <GridDivider />
      </div>

      <div className="relative">
        <GridRails />

        {/* 8. Proof. The site's featured-story component, which is how the
            comparison pages present this — heading and lead in their own
            centred block, then the story itself. PortalProof's single-story
            column was a fourth way of showing a customer quote on a site that
            had already settled on this one.

            The story is Advertai either way; this keeps the page's own quote
            and picks up the portrait, the stats and the link that the handoff
            had no slot for. */}
        <section className="mx-auto max-w-[1200px] px-6 pt-16 md:px-10 md:pt-24">
          <h2 className="type-h2 text-balance text-center">
            Five tools replaced. Five apps built.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-center text-muted-foreground">
            Advertai Marketing, an 11-person agency, built its own message
            center, design feedback app, and SEO dashboard on Assembly, and is
            retiring Markup.io, Bright Local, and Keyword.com.
          </p>
        </section>
        <Testimonials
          story={{
            // Quoted from the published Advertai study. See case-studies.ts.
            quote:
              "We've heard how professional everything feels, and how it's really unique compared to any other experience they've had.",
            name: "Garrett Leonard",
            firm: "Advertai Marketing",
            image: "/images/customers/advertai-marketing.jpg",
            stats: [
              { value: "5 weeks", label: "Development to launch" },
              { value: "200+ clients", label: "Using applications" },
              { value: "5+ tools", label: "Consolidated and saved" },
            ],
            href: "/customers/advertai-marketing",
          }}
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
