import type { Metadata } from "next";
import { CTA } from "@/components/home/cta";
import { FAQ, type FAQEntry } from "@/components/home/faq";
import { GridDivider, GridRails } from "@/components/ui/grid-lines";
import { PortalSocialProof } from "@/components/client-portal/portal-social-proof";
import { PortalHeroCarousel } from "@/components/client-portal/portal-hero-carousel";
import {
  IconTemplateApprovals,
  IconTemplateDocuments,
  IconTemplateOnboarding,
  IconTemplateProposals,
  IconTemplateTimeTracker,
} from "@/components/templates/template-icons";
import { PortalProblem } from "@/components/client-portal/portal-problem";
import { PortalReadyMade } from "@/components/client-portal/portal-ready-made";
import { PortalBuild } from "@/components/client-portal/portal-build";
import {
  BuildCard,
  DescribeCard,
  PlanCard,
} from "@/components/client-portal/portal-build-cards";
import { PortalTailor } from "@/components/client-portal/portal-tailor";
import { AccountingLoginsVisual } from "@/components/solutions/accounting-logins-visual";
import { AccountingViewsVisual } from "@/components/solutions/accounting-views-visual";
import { PortalStack } from "@/components/client-portal/portal-stack";
import { PortalTrust } from "@/components/client-portal/portal-trust";
import { PortalPricing } from "@/components/client-portal/portal-pricing";
import { BuilderCustomerQuotes } from "@/components/ai-app-builder/builder-customer-quotes";
import { DEMO_URL, SIGNUP_URL } from "@/lib/constants";
import { PANEL_BG } from "@/components/comparison/brand-panel";
import { PAGE_SEO, pageMetadata } from "@/lib/seo";
import { serializeJsonLd } from "@/lib/json-ld";

export const metadata: Metadata = pageMetadata(PAGE_SEO.accountingClientPortal);

/**
 * The accounting cut of /client-portal, on the slug the CMS solutions page used
 * to serve. It runs the same eleven sections as that page through the same
 * components, with this vertical's copy passed in — so a change to the shape of
 * a section reaches both, and only the words differ.
 *
 * Four calls were made here rather than asked, each marked at the line it
 * affects: the build section runs three steps rather than five, the stack
 * section drops its three links, "in plain English" is not reintroduced, and
 * the headings balance rather than breaking where the handoff marks a slash.
 *
 * The visuals V1–V9 in the handoff are not built yet. Every section below
 * carries /client-portal's picture in the meantime, which is the same product
 * in neutral branding rather than Ledgerline's; the sections that have no
 * stand-in carry a titled slot. None of them is wrong, all of them are generic.
 */

/** Section 3. Four resolve from the committed templates; contracts-app is served
 *  from Contentful, which is why it is absent from src/lib/templates.ts. */
/**
 * The hero lead's classes, shared by the phone sentence and the desktop one so
 * swapping breakpoints cannot leave the two set differently.
 */
const HERO_LEAD =
  "type-lead max-w-[34rem] text-pretty text-muted-foreground lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:pt-2";

const ACCOUNTING_APPS = [
  {
    slug: "document-collection",
    title: "Document collector",
    description: "Requested documents with an upload checklist.",
    foundation: "Documents",
    icon: <IconTemplateDocuments className="w-[32px]" />,
  },
  {
    slug: "conditional-forms",
    title: "Conditional forms",
    description: "Smart intake forms that adapt to each answer.",
    foundation: "Intake",
    icon: <IconTemplateOnboarding className="w-[26px]" />,
  },
  {
    slug: "proposal-builder",
    title: "Proposals",
    description: "Branded proposals clients can e-sign and pay.",
    foundation: "Proposals",
    icon: <IconTemplateProposals className="w-[26px]" />,
  },
  {
    slug: "contracts-app",
    title: "Contracts",
    description: "Engagement letters signed with e-signature requests.",
    foundation: "Contracts",
    icon: <IconTemplateApprovals className="w-[30px]" />,
  },
  {
    slug: "time-tracker",
    title: "Time tracker",
    description: "Log billable hours by client and export timesheets.",
    icon: <IconTemplateTimeTracker className="w-[26px]" />,
    // The handoff marks this one "(Internal)". Carried as the site's own mono
    // chip, the object the filters and tags already are, rather than as words
    // inside the title.
    foundation: "Internal",
  },
];

/**
 * Section 4. Three steps, not /client-portal's five.
 *
 * DECISION, not instruction: the handoff gives three. Its fourth and fifth
 * beats on that page — Iterate, and "built by Assembly, never by the AI" — are
 * not dropped so much as moved: section 7 below states the security one as its
 * whole argument, so running it here too would make the page say it twice.
 */
const BUILD_STEPS = [
  {
    name: "Describe it",
    // Two lines, like the other two: the rail's feet stop lining up the moment
    // one caption is deeper than the rest. Shortened at the lead-in rather than
    // at the examples, so both trackers survive — with the chips gone from this
    // section they are the only place the page names what gets built.
    body: "Tell the AI what you need, like a month-end close or estimated payment tracker.",
  },
  {
    name: "Answer a few questions",
    body: "It asks one to three questions so the app fits how your firm works.",
  },
  {
    name: "Approve and it appears",
    body: "The app shows up in your client experience with logins, permissions, and your branding in place.",
  },
];

/** Section 7. Four rows, in the handoff's order. */
const TRUST_CLAIMS: FAQEntry[] = [
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

/**
 * Section 9. /client-portal's priced cards, with this handoff's fifth plan
 * added. Names, prices and perks are the live /pricing figures — the perks are
 * that page's wording cut to what the handoff names for each plan, so the two
 * pages cannot say different things about the same tier.
 *
 * Enterprise is not here: it carries no price and two perks, and as a fifth
 * card it cost the other four a fifth of their width each. It runs as the row
 * under the grid instead.
 *
 * THE BILLING TERM IS IN THE SECTION'S LEAD, not on each card. "per month,
 * billed annually" is one fact stated three times in a row of four cards, and
 * at the cadence's size it was the longest line in each of them — on Advanced
 * it wrapped, which put that card's price and its strapline on a different
 * rhythm from the three beside it. Said once above the grid it is the same
 * promise and reads as a condition on all the prices, which is what it is.
 */
const ACCOUNTING_TIERS = [
  {
    name: "Free",
    price: "$0",
    cadence: "Free forever",
    perksLabel: "Includes:",
    perks: ["5 active contacts", "3 apps"],
    cta: "Get started",
    href: SIGNUP_URL,
  },
  {
    name: "Starter",
    price: "$29",
    cadence: "per month",
    perksLabel: "Everything in Free, plus:",
    perks: ["50 active contacts", "API and MCP connector"],
    cta: "Get started",
    href: SIGNUP_URL,
  },
  {
    name: "Professional",
    price: "$99",
    cadence: "per month",
    perksLabel: "Everything in Starter, plus:",
    perks: [
      "Custom domain",
      "Assembly badge removed",
      "App visibility",
      "Automation builder",
    ],
    cta: "Get started",
    href: SIGNUP_URL,
    recommended: true,
  },
  {
    name: "Advanced",
    price: "$499",
    cadence: "per month",
    perksLabel: "Everything in Professional, plus:",
    perks: [
      "HIPAA BAA",
      "Audit log",
      "Client access permissions",
      "Enforced MFA",
      "Multi-company contacts",
    ],
    cta: "Book a demo",
    href: DEMO_URL,
  },
];

/**
 * Section 10. Written long for search, each naming the firm type it answers for.
 *
 * NOTE for review: A9 is the HIPAA boundary. It is worded so that apps built
 * with the builder are explicitly not covered, which is the line legal has to
 * sign off before this ships.
 */
const ACCOUNTING_FAQS: FAQEntry[] = [
  {
    question: "Do I have to replace my tax or accounting software?",
    shortQuestion: "Do I replace my tax software?",
    answer:
      "No. Assembly is what your clients see and use. Keep the software you prepare returns and keep books with, and sync invoices one way to QuickBooks or Xero.",
  },
  {
    question: "Can we roll out before our busy season?",
    answer:
      "Yes, in small groups. Set up your branding and welcome message, invite a few clients first, then expand.",
  },
  {
    question: "I'm not technical. Can I build apps?",
    answer:
      // DECISION: the handoff says "in plain English" here. This PR removed that
      // phrase from all fifteen places it appeared on the site, so it is not
      // reintroduced on a new page; the sentence means the same without it.
      "Yes. Describe what you want. The builder asks one to three questions, shows a one-page plan, and builds only after you approve.",
  },
  {
    question: "What does Assembly's AI do for my firm?",
    answer:
      "It builds the apps you describe, like an estimated payment tracker or a month-end close tracker, inside your client experience and connected to your client list.",
  },
  {
    question: "Does Assembly's AI prepare returns or give tax advice?",
    shortQuestion: "Does the AI prepare returns?",
    answer:
      "No. Your team prepares returns and gives advice. Assembly's AI builds the apps your firm describes.",
  },
  {
    question: "Does Assembly include tax organizers?",
    answer:
      "Practice-management suites have deeper tax organizers and IRS tools. Assembly fits when you want your own intake flow and a client experience you control; many firms use both.",
  },
  {
    question: "Can more than one person sign an engagement letter?",
    shortQuestion: "Can two people sign a letter?",
    answer:
      "Not today. Contracts support e-signature on PDFs with a full audit trail, one signer per contract.",
  },
  {
    question: "Can I bring my existing client list?",
    answer:
      "Yes. Import your client list from a CSV in Contacts, or add clients as you go.",
  },
  {
    question: "Is the client portal HIPAA compliant for healthcare clients?",
    shortQuestion: "Is the portal HIPAA compliant?",
    answer:
      "Assembly supports HIPAA with a BAA on the Advanced plan. Ready-made apps like messages, files, and contracts can handle PHI if they don't use AI. Apps built with the app builder aren't covered.",
  },
  {
    question: "Can I put the client portal on my firm's own domain?",
    shortQuestion: "Can I use my own domain?",
    answer:
      "Yes, on Professional and above, with the Assembly badge removed. Your logo and colors are included on every plan.",
  },
  {
    question: "Is Assembly a secure client portal for CPA firms?",
    shortQuestion: "Is it secure for CPA firms?",
    answer:
      "Yes. Logins, permissions, and who sees what are built and maintained by Assembly, and each client sees only what they're allowed to see.",
  },
  {
    question: "Is there a client portal for bookkeepers?",
    shortQuestion: "Is there one for bookkeepers?",
    answer:
      "Yes. Bookkeeping firms use Assembly for monthly document requests, recurring invoices, and messages in one branded place, and can build apps like a month-end close tracker.",
  },
];

// Built from the same entries the accordion renders, so the questions a crawler
// reads can never drift from the ones on the page.
const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: ACCOUNTING_FAQS.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })),
};

export default function AccountingClientPortalPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(FAQ_SCHEMA) }}
      />

      {/* 1. Hero. Same split header as /client-portal and /ai-app-builder, with
          the eyebrow this page's handoff asks for above the headline.

          DECISION: the handoff marks a line break in every heading with a
          slash. These balance instead. A hard <br /> set for a desktop measure
          breaks badly at 390px, and text-balance lands the same break at the
          widths the slash was written for. */}
      <section className="pb-16 pt-24 md:pb-24 md:pt-32">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-x-16">
            <h1 className="type-display max-w-[30ch] text-balance lg:col-start-1">
              Your AI-native accounting firm starts here
            </h1>
            {/* Two leads, one measure. The desktop sentence runs to three
                lines on a 390px screen, which puts the buttons below the fold
                on the page's most important screen; the phone gets the same
                argument — ready-made apps, and AI for the next one — without
                the enumeration, which the sections below make anyway.

                Rendered as two paragraphs rather than one clamped, because a
                clamp cuts mid-sentence and cannot be read for sense. The
                classes are shared so the two cannot drift apart. */}
            <p
              className={`${HERO_LEAD} md:hidden`}
              // Phone only: see the pair above.
            >
              A branded client portal with ready-made apps — and AI to build
              whatever your practice needs next.
            </p>
            <p className={`hidden ${HERO_LEAD} md:block`}>
              Assembly gives your firm a branded client portal with ready-made
              apps for files, e-signatures, invoices, and messages. Describe the
              next app your practice needs, and AI builds it.
            </p>
            <div>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <a
                  href={DEMO_URL}
                  className="w-full rounded-lg bg-foreground px-5 py-3 text-center text-sm text-background transition-opacity hover:opacity-90 sm:w-auto sm:py-2.5"
                >
                  Book a demo
                </a>
                <a
                  href={SIGNUP_URL}
                  className="w-full rounded-lg border border-foreground/20 bg-transparent px-5 py-3 text-center text-sm text-foreground transition-colors hover:bg-foreground/5 sm:w-auto sm:py-2.5"
                >
                  Start free
                </a>
              </div>
            </div>
          </div>

          {/* V1's slot, now filled by the portal carousel rather than held
              open. It stood here once before and was taken out again, because
              it runs a marketing firm's content — Brandmages in the sidebar, a
              content approval flow among the four apps — which on an
              accounting page is the wrong vertical rather than a neutral
              stand-in. That is still true of one of its four screens, so this
              wants either an accounting set or the real V1 art before the page
              ships; a picture of the right SHAPE beats an empty panel in the
              meantime, which is the call made here.

              The V1 art direction is kept below so it is not lost with the
              placeholder that carried it. */}
          {/* No ramp at the foot of the shot. Every other screen on this page
              ends on a straight crop against its card's edge; the hero was the
              one that faded out, which read as the picture going soft rather
              than as the frame ending. See footDissolve. */}
          <PortalHeroCarousel footDissolve={false} />
          {/* V1 — left 40%: the Assembly build panel headed "Build with AI",
              with the message "Build an estimated tax payment tracker. Clients
              see scheduled and paid amounts; send a reminder 7 days before each
              due date.", a plan card titled "Plan: Estimated payment tracker"
              (fields: quarter, jurisdiction, amount, due date, status; who sees
              it: each client sees only their own; team view: all clients;
              reminder: 7 days before due) and an "Approve plan" button. Right
              60%: a browser at portal.ledgerline.com, sidebar Home / Messages /
              Files / Contracts / Payments / Tasks / Estimated payments (new,
              faint brass highlight), main panel for Delgado Household showing
              "Q3 federal · $4,200 · Scheduled Sep 15" and "Q2 federal · $4,200
              · Paid Jun 14". Static. */}
          <PortalSocialProof />
        </div>
      </section>

      <div className="relative">
        <GridRails />
        <GridDivider fullBleed />

        {/* 2. Problem. */}
        <PortalProblem
          // Picture and quote as one row rather than the quote under the
          // picture — this page's slot is a single screen, not the two-screen
          // comparison the stacked layout was shaped for.
          split
          heading="Every tool you add is one more login"
          body="Contracts in one place, files in another, invoices in a third. Your clients feel every seam, usually right before a deadline."
          // The two captions ("Almost fits" / "Fits") are /client-portal's, and
          // this handoff has none — the section is heading, body, picture,
          // quote, link. They were inherited by leaving the default in place.
          sides={[]}
          // V2 — the pile of sign-ins the heading is about. It replaces a
          // titled empty div: the slot was held open while the handoff's
          // visuals were unbuilt, so the section rendered as a heading, a
          // sentence, a quote and a grey rectangle.
          //
          // The handoff pairs those sign-ins with one Ledgerline portal
          // answering them. That half is not drawn, because this page runs the
          // section `split` and the answer would land at thumbnail size beside
          // them — see accounting-logins-visual.tsx.
          // The grained brand gradient behind the tiles, as the marketing
          // agency page runs this section. It was a desk-drawer photograph.
          trayBackground={PANEL_BG}
          screens={
            <div className="h-[340px] md:h-[480px]">
              <AccountingLoginsVisual />
            </div>
          }
          quote={{
            // Quoted from the published Sargent CPAs study, first sentence only,
            // as the handoff shortens it. See src/lib/case-studies.ts.
            text: "TaxDome and Canopy may do everything you want in one box, but on the client side it feels very corporate.",
            attribution: "Anthony Drozd, Operations Manager, Sargent CPAs",
            href: "/customers/sargent-cpa",
            logoSlug: "sargent-cpa",
          }}
          link={{ label: "See how firms fix it", href: "#ready-made-apps" }}
        />
        <GridDivider />

        {/* 3. Ready-made apps. The id is what section 2's jump link lands on. */}
        <PortalReadyMade
          id="ready-made-apps"
          heading="Ready-made apps for the busy season"
          body="Collect documents, send engagement letters, and track hours from day one. Start from 30+ working apps, then reshape any of them by describing the change."
          picks={ACCOUNTING_APPS}
          link={{ label: "Browse all templates", href: "/templates" }}
        />
        <GridDivider />

        {/* 4. Build with AI. */}
        <PortalBuild
          heading="AI builds what your practice software never shipped"
          body="Describe what you want. Assembly shows a plan and builds after you approve."
          // V4's three beats. The cards hold their shape and draw nothing:
          // /client-portal's describe / plan / build visuals stood here first,
          // but they run that page's firm building a project tracker, which is
          // neither this vertical nor these three steps. The rail's own panel
          // supplies the grey; each step's art direction rides in `title`.
          // The rail's own three scenes, which carry their own grounds — the
          // photograph behind Describe, paper behind Plan, haze behind Build —
          // so the cards stop being three grey rectangles.
          //
          // The three scenes run as Ledgerline building a month-end close
          // tracker (`vertical="accounting"`), not /client-portal's agency
          // project tracker.
          steps={BUILD_STEPS.map((step, i) => ({
            ...step,
            visual: [
              <DescribeCard key="d" vertical="accounting" />,
              <PlanCard key="p" vertical="accounting" />,
              <BuildCard key="b" vertical="accounting" />,
            ][i],
          }))}
          railLabel="How building works"
          cta={{ label: "Start free", href: SIGNUP_URL }}
          // OPEN: the handoff leaves this target to the web lead — /ai-app-builder
          // if it is live, otherwise /blog/assembly-studio. /ai-app-builder is new
          // in this same PR, so the two ship together or not at all.
          link={{
            label: "See how the app builder works",
            href: "/ai-app-builder",
          }}
        />
        <GridDivider />

        {/* 5. Tailor. */}
        <PortalTailor
          heading="One firm, a different view for every client"
          body="Clients can belong to several entities and switch between them with one login. Custom fields decide which apps each client sees."
          // V5 — two client sidebars, the entity switcher open on one of them,
          // and a locked folder on the other. It replaces the component's own
          // four cards, which were /client-portal's agency: four different apps
          // under a heading about one portal seen two ways, with Brandmages
          // down every nav. See accounting-views-visual.tsx.
          visual={<AccountingViewsVisual />}
        />

        {/* 6. Keep your stack.

            DECISION: the three links (Embeds, Integrations, Automations) are
            dropped here, because this handoff states the integrations outright
            in one paragraph rather than handing the reader on. Passing an empty
            set is what turns the section into claim-and-picture. */}
        <PortalStack
          heading="Keep your accounting software. Upgrade what clients see."
          body="Embed Google Sheets, Drive, OneDrive, Calendly, Jotform, and Typeform. Push invoices to QuickBooks or Xero, and connect the rest with Zapier, Make, the API, or MCP."
          ways={[]}
          visualTitle="V6 — the portal showing an embedded Google Sheet (Harbor Dental PLLC, 2026 payroll summary), with thin connectors out to Google Sheets, Google Drive, OneDrive, Calendly, Jotform, Typeform, and one-way arrows to QuickBooks and Xero. Behind a dotted line at the far right, a neutral tile reading 'Your tax and accounting software'."
        />

        {/* 7. Trust. The seal band drops the HIPAA mark, per the handoff's V8:
            this page states the HIPAA boundary in the FAQ rather than claiming
            it as a certification beside the other three. */}
        <PortalTrust
          heading="Every app you build starts protected"
          body="Logins, permissions, and who sees what are built and maintained by Assembly, so a new app never starts a new security project."
          claims={TRUST_CLAIMS}
          link={{ label: "Read about security", href: "/security" }}
          omitSeals={["HIPAA"]}
        />
        <GridDivider />
      </div>

      <div className="relative">
        <GridRails />

        {/* 8. Proof. The builder page's row, not PortalProof's columns — the
            same component /ai-app-builder and /client-portal both run, so the
            three pages present testimony one way rather than three.

            Sargent CPAs is not in the set. Its quote was here, but this row
            draws a 72px portrait per card and Sargent has only a logo mask in
            /public/images/customers; a transparent logo in an object-cover
            square sits visibly apart from two photographs. /client-portal left
            it out of its own row for exactly this reason. ValueNode takes the
            third slot — an accounting firm, photographed, and its quote is the
            consolidation argument this page opens on. */}
        {/* Logos, not portraits, for all three: this page sells to firms, so
            the firm is the name to recognise. Same white tile and fixed ink as
            the Sargent quote above, so each mark holds its contrast in both
            themes. `image` stays as the fallback. */}
        <BuilderCustomerQuotes
          heading="Firms that built the practice they wanted"
          body="Advisory, tax, and bookkeeping firms run their client experience on Assembly."
          quotes={[
            {
              quote:
                "We had more tax returns in the door, ready to start being prepped, earlier than ever this year than in our entire history.",
              name: "Kyle Pearson",
              firm: "Collective CPA",
              logoSlug: "collective-cpa",
              image: "/images/customers/collective-cpa.jpg",
              href: "/customers/collective-cpa",
            },
            {
              quote:
                "The client feedback has been overwhelmingly positive. My clients love the platform, and I love using it. The Tasks app and the entire process have been fantastic for our practice.",
              name: "Leah McCool",
              firm: "Orca Accounting",
              logoSlug: "orca-accounting",
              image: "/images/customers/orca-accounting.jpg",
              href: "/customers/orca-accounting",
            },
            {
              // Verbatim, cut at the full stop — the same convention the other
              // two follow. See src/lib/case-studies.ts.
              quote:
                "It saves me so much time — just knowing exactly where to find things, and having everything streamlined in one secure place.",
              name: "Dr. Najlaa Kallousa",
              firm: "ValueNode Accounting",
              logoSlug: "valuenode-accounting",
              image: "/images/customers/valuenode-accounting.jpg",
              href: "/customers/valuenode-accounting",
            },
          ]}
        />
        <GridDivider />

        {/* 9. Pricing. */}
        <PortalPricing
          heading="Plans that match the scale of your firm"
          body="Start free with real apps. Upgrade for your own domain, automations, and client access permissions. Monthly prices shown are billed annually."
          tiers={ACCOUNTING_TIERS}
          aside={{
            name: "Enterprise",
            line: "Custom SSO and a dedicated success manager.",
            cta: { label: "Talk to us", href: DEMO_URL },
          }}
          link={{ label: "See pricing", href: "/pricing" }}
        />
        <GridDivider />
      </div>

      <div className="relative">
        <GridRails />
        {/* 10. FAQ. */}
        <FAQ
          // A non-breaking space ties "before" to "switching" so the pair wraps
          // together, rather than a hard <br /> that would break badly narrower.
          heading={"Questions firms ask before\u00A0switching"}
          items={ACCOUNTING_FAQS}
          variant="divided"
          dottedRules
          compactQuestions
        />
        <GridDivider fullBleed />
      </div>

      {/* 11. Final CTA. No composer: this page closes on the pair of buttons it
          opened on, and a prompt box here would ask a question the page has
          already answered three sections earlier. */}
      <CTA
        heading={<>Your firm, one client experience</>}
        subheading="Start with a small group of clients this season. Expand when you're ready."
        composer={false}
        planChips={false}
        primaryCta={{ label: "Book a demo", href: DEMO_URL }}
        secondaryCta={{ label: "Start free", href: SIGNUP_URL }}
      />
    </>
  );
}
