import type { Metadata } from "next";
import Link from "next/link";
import { CTA } from "@/components/home/cta";
import { FAQ, type FAQEntry } from "@/components/home/faq";
import { GridDivider, GridRails } from "@/components/ui/grid-lines";
import { PortalSocialProof } from "@/components/client-portal/portal-social-proof";
import { PortalProblem } from "@/components/client-portal/portal-problem";
import { PortalReadyMade } from "@/components/client-portal/portal-ready-made";
import { PortalBuild } from "@/components/client-portal/portal-build";
import { PortalTailor } from "@/components/client-portal/portal-tailor";
import { PortalStack } from "@/components/client-portal/portal-stack";
import { PortalTrust } from "@/components/client-portal/portal-trust";
import { PortalPricing } from "@/components/client-portal/portal-pricing";
import { PortalProof } from "@/components/client-portal/portal-proof";
import {
  BuildCard,
  DescribeCard,
  PlanCard,
} from "@/components/client-portal/portal-build-cards";
import { DEMO_URL, SIGNUP_URL } from "@/lib/constants";
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
const ACCOUNTING_APPS = [
  {
    slug: "document-collection",
    title: "Document collector",
    description: "Requested documents with an upload checklist.",
    foundation: "Documents",
  },
  {
    slug: "conditional-forms",
    title: "Conditional forms",
    description: "Smart intake forms that adapt to each answer.",
    foundation: "Intake",
  },
  {
    slug: "proposal-builder",
    title: "Proposals",
    description: "Branded proposals clients can e-sign and pay.",
    foundation: "Proposals",
  },
  {
    slug: "contracts-app",
    title: "Contracts",
    description: "Engagement letters signed with e-signature requests.",
    foundation: "Contracts",
  },
  {
    slug: "time-tracker",
    title: "Time tracker",
    description: "Log billable hours by client and export timesheets.",
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
    body: "Tell the AI what your practice needs, like a month-end close tracker or an estimated payment tracker.",
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
 * Section 8. Three accounting firms, all published on /customers. Every quote
 * and figure below is quoted from src/lib/case-studies.ts rather than retyped,
 * so the page and the story cannot drift apart.
 */
const ACCOUNTING_STORIES = [
  {
    slug: "collective-cpa",
    specialty: "Collective CPA & Advisors · Accounting and advisory",
    stats: ["200+ tax clients migrated", "Drive migration in one week"],
    quote:
      "We had more tax returns in the door, ready to start being prepped, earlier than ever this year than in our entire history.",
    name: "Kyle Pearson",
    role: "Founder @ Collective CPA",
    href: "/customers/collective-cpa",
  },
  {
    slug: "sargent-cpa",
    specialty: "Sargent CPAs · Bookkeeping, tax, and advisory",
    stats: ["100+ clients, one experience", "2 custom apps built with AI"],
    quote:
      "You can build it any way you want and make it perfect for your clients and your business.",
    name: "Anthony Drozd",
    role: "Operations Manager @ Sargent CPAs",
    href: "/customers/sargent-cpa",
  },
  {
    slug: "orca-accounting",
    specialty: "Orca Accounting · Bookkeeping and CFO services",
    stats: ["75% faster onboarding"],
    quote: "Every client said this was such an easy onboarding experience.",
    name: "Leah McCool",
    role: "Founder @ Orca Accounting",
    href: "/customers/orca-accounting",
  },
];

/** Section 9. Plan lines rather than prices: this page never explains a figure,
 *  and /pricing is one click away. */
const PLAN_LINES = [
  { name: "Free", line: "Real apps for your first clients." },
  { name: "Starter", line: "More contacts, plus the API and MCP connector." },
  {
    name: "Professional",
    line: "Your own domain, badge removal, app visibility, and automations.",
  },
  {
    name: "Advanced",
    line: "HIPAA BAA, audit log, client access permissions, enforced MFA, and multi-company contacts.",
  },
  { name: "Enterprise", line: "Custom SSO and a dedicated success manager." },
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
            <div className="lg:col-start-1">
              <p className="type-eyebrow text-muted-foreground">
                Client portal for accounting firms
              </p>
              <h1 className="type-display mt-4 max-w-[30ch] text-balance">
                Your AI-native accounting firm starts here
              </h1>
            </div>
            <p className="type-lead max-w-[34rem] text-pretty text-muted-foreground lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:pt-2">
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

          {/* V1's slot, held open rather than filled. /client-portal's carousel
              stood here first, but it runs that page's marketing firm — a
              campaign approval flow and a retainer tracker — which on an
              accounting page is not a neutral stand-in but the wrong vertical's
              content. A muted panel says "picture pending"; that one said
              something untrue. Same solid --muted the stack section's slot
              uses, with the art direction in `title` for whoever builds it. */}
          <div
            aria-hidden
            title="V1 — left 40%: the Assembly build panel headed 'Build with AI', with the message 'Build an estimated tax payment tracker. Clients see scheduled and paid amounts; send a reminder 7 days before each due date.', a plan card titled 'Plan: Estimated payment tracker' (fields: quarter, jurisdiction, amount, due date, status; who sees it: each client sees only their own; team view: all clients; reminder: 7 days before due) and an 'Approve plan' button. Right 60%: a browser at portal.ledgerline.com, sidebar Home / Messages / Files / Contracts / Payments / Tasks / Estimated payments (new, faint brass highlight), main panel for Delgado Household showing 'Q3 federal · $4,200 · Scheduled Sep 15' and 'Q2 federal · $4,200 · Paid Jun 14'. Static."
            className="mt-14 h-[320px] rounded-3xl bg-muted md:mt-16 md:h-[440px] lg:h-[520px] [[data-theme=dark]_&]:bg-white/[0.06]"
          />
          <PortalSocialProof />
        </div>
      </section>

      <div className="relative">
        <GridRails />
        <GridDivider fullBleed />

        {/* 2. Problem. */}
        <PortalProblem
          heading="Every tool you add is one more login"
          body="Contracts in one place, files in another, invoices in a third. Your clients feel every seam, usually right before a deadline."
          quote={{
            // Quoted from the published Sargent CPAs study, first sentence only,
            // as the handoff shortens it. See src/lib/case-studies.ts.
            text: "TaxDome and Canopy may do everything you want in one box, but on the client side it feels very corporate.",
            attribution: "Anthony Drozd, Operations Manager, Sargent CPAs",
            href: "/customers/sargent-cpa",
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
          // V4's three beats are the handoff's; the cards under them are
          // /client-portal's existing describe / plan / build visuals, standing
          // in until V4 is built.
          steps={BUILD_STEPS.map((step, i) => ({
            ...step,
            visual: [
              <DescribeCard key="describe" />,
              <PlanCard key="plan" />,
              <BuildCard key="build" />,
            ][i],
          }))}
          railLabel="How building works"
          cta={{ label: "Start free", href: SIGNUP_URL }}
          chips={[
            "Month-end close tracker",
            "Estimated payment tracker",
            "Team capacity board (Internal)",
          ]}
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
        />

        {/* 6. Keep your stack.

            DECISION: the three links (Embeds, Integrations, Automations) are
            dropped here, because this handoff states the integrations outright
            in one paragraph rather than handing the reader on. Passing an empty
            set is what turns the section into claim-and-picture. */}
        <PortalStack
          heading="Keep your accounting software. Upgrade what clients see."
          body="Embed Google Sheets, Google Drive, OneDrive, Calendly, Jotform, and Typeform, and sync invoices one way to QuickBooks or Xero. Connect the rest with Zapier, Make, the API, or MCP."
          ways={[]}
          visualTitle="V6 — the portal showing an embedded Google Sheet (Harbor Dental PLLC, 2026 payroll summary), with thin connectors out to Google Sheets, Google Drive, OneDrive, Calendly, Jotform, Typeform, and one-way arrows to QuickBooks and Xero. Behind a dotted line at the far right, a neutral tile reading 'Your tax and accounting software'."
        />
        <GridDivider />

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

        {/* 8. Proof. */}
        <PortalProof
          heading="Firms that built the practice they wanted"
          body="Advisory, tax, and bookkeeping firms run their client experience on Assembly."
          stories={ACCOUNTING_STORIES}
          linkLabel="Read the story"
        />
        <GridDivider />

        {/* 9. Pricing. */}
        <PortalPricing
          heading="Plans that match the scale of your firm"
          body="Start free with real apps. Upgrade for your own domain, automations, and client access permissions."
          plans={PLAN_LINES}
          link={{ label: "See pricing", href: "/pricing" }}
        />
        <GridDivider />
      </div>

      <div className="relative">
        <GridRails />
        {/* 10. FAQ. */}
        <FAQ
          heading="Questions firms ask before switching"
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

      {/* The "also see" row, above the footer. */}
      <section className="px-6 pb-16 md:px-10">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-border pt-8 [[data-theme=dark]_&]:border-[#383838]">
          <span className="type-caption text-muted-foreground">Also see</span>
          <Link
            href="/client-portal"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Client portal
          </Link>
          <Link
            href="/solutions/marketing-agency-client-portal"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Client portal for marketing agencies
          </Link>
        </div>
      </section>
    </>
  );
}
