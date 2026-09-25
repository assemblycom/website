import type { Metadata } from "next";
import { CTA } from "@/components/home/cta";
import { Testimonials } from "@/components/home/testimonials";
import { FAQ, type FAQEntry } from "@/components/home/faq";
import { GridDivider, GridRails } from "@/components/ui/grid-lines";
import {
  BuilderPillars,
  type Pillar,
} from "@/components/ai-app-builder/builder-pillars";
import { BuilderHowItWorks } from "@/components/ai-app-builder/builder-how-it-works";
import { BuilderAlternatives } from "@/components/ai-app-builder/builder-alternatives";
import { BuilderTemplates } from "@/components/ai-app-builder/builder-templates";
import { VisualSlot } from "@/components/ui/visual-slot";
import { DEMO_URL, SIGNUP_URL } from "@/lib/constants";
import { PAGE_SEO, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(PAGE_SEO.aiAppBuilder);

/**
 * The four claims a visitor with no Assembly workspace can believe, in the
 * brief's order: client-facing first because that is where Assembly is uniquely
 * good, CRM second, the hard parts third, brand last (table stakes on its own,
 * differentiated only by the fact that it propagates to every new app).
 */
const PILLARS: Pillar[] = [
  {
    heading: "Build client-facing apps and internal tools, all in one place",
    body: "Describe an onboarding flow for your clients or a reporting dashboard for your team. Assembly builds it, and each lands where it belongs: client apps in your branded client experience, team tools in your dashboard.",
    facts: [
      { label: "Collective CPA", value: "Live team dashboard in under an hour" },
      { label: "AdvertAI Marketing", value: "A Message Center their team lives in" },
    ],
    visual: {
      label: "Pillar 1 visual",
      description:
        "Two apps side by side that visibly came from one chat panel. Left: a client-facing onboarding checklist inside a branded client experience, its own accent colour and a client logo placeholder. Right: a team-only reporting dashboard in Assembly chrome. Small labels: Your clients, Your team.",
    },
  },
  {
    heading: "One CRM. Every app connects to it",
    body: "Assembly includes a full CRM: contacts, companies, and custom fields. Every app you build connects to it automatically, and each client only sees what they're allowed to see.",
    facts: [
      { label: "What it holds", value: "Contacts, companies, custom fields" },
      { label: "What each client sees", value: "Only their own records" },
    ],
    visual: {
      label: "Pillar 2 visual",
      description:
        "Lead with the CRM: a contact list in Assembly chrome with companies and a custom field visible. Then the same list feeding two client experiences side by side, Company A seeing its own data and Company B seeing something else.",
    },
  },
  {
    heading: "Secure logins, permissions, and billing come built in",
    body: "Every app comes with secure logins for your team and your clients, control over who sees what, and a built-in billing option if you need it. You approve a plan before anything is built, nothing reaches clients until you make it visible, and our team helps if a build stalls.",
    facts: [
      { label: "Clients sign in with", value: "Google or a one-click email link" },
      { label: "Multi-factor auth", value: "Every plan, enforced on Advanced" },
    ],
    visual: {
      label: "Pillar 3 visual",
      description:
        "A client sign-in screen next to a simple Who can see this control listing team roles and a client, both isolated on a clean background and carrying a small Part of Assembly mark, visually separate from the app content they protect. No MFA jargon in the art.",
    },
  },
  {
    heading: "Your clients already have a branded home. New apps land in it",
    body: "Your clients see your logo and colors. Every new app picks up your branding automatically, so nothing looks bolted on.",
    facts: [
      { label: "Why firms pick Assembly", value: "Branding, the number 3 reason" },
      { label: "Raised in", value: "27% of 2,926 sales calls" },
    ],
    visual: {
      label: "Pillar 4 visual",
      description:
        "The identical app rendered twice, side by side, once carrying one business's logo and accent colour and once another's. Same layout and components, only the branding changed. The sales-call stat sits beneath as a pull stat.",
    },
  },
];

/**
 * Five earnest objections first, then the three "best / compare" search
 * questions, so the page answers a reader before it answers a query.
 */
const BUILDER_FAQS: FAQEntry[] = [
  {
    question: "What if the builder gets it wrong?",
    answer:
      "Nothing reaches your clients until you've approved the plan and made the app visible to them. New apps stay hidden from clients by default while you test. If something needs fixing after launch, keep chatting with the app builder to change it — nothing is frozen at publish.",
  },
  {
    question: "Do I need to know how to code?",
    answer:
      "No. Describe what you want in plain English, or start from a template. Assembly asks a few clarifying questions and shows a plan you approve or edit, then it builds. Changes after launch happen the same way, by continuing the conversation, with no coding at any step.",
  },
  {
    question: "How much does it cost?",
    answer:
      "Assembly has a free plan that never expires, and you can build and publish working apps on it. Paid plans add more apps and your own domain for the client experience. Full details are on the pricing page.",
    links: [{ label: "pricing page", href: "/pricing" }],
  },
  {
    question: "Is it secure enough for client data?",
    answer:
      "Yes. Logins and permissions on Assembly are built and maintained by Assembly's team, not generated by the AI for each app. Clients sign in with Google or a secure one-click email link, and multi-factor authentication is available on every plan, with enforced MFA on Advanced plans. Each client sees only their own data. Full details are on the security page.",
    links: [{ label: "security page", href: "/security" }],
  },
  {
    question: "What is it not good for?",
    answer:
      "Public marketing websites. Assembly's AI app builder is built for apps people log into, meaning your team and your clients, not anonymous visitors on the open web. A public website is better built with a different tool and linked from inside your client experience.",
  },
  {
    question: "The best AI app builder for service businesses?",
    answer:
      "For a service business, the best AI app builder does more than generate a prototype: it comes with the pieces that make an app usable by a team or a paying client, meaning logins, permissions, branding, and a place for client data. Assembly is built for agencies, accounting and bookkeeping practices, law offices, and consultancies. Describe the app in plain English, or start from one of its templates, and Assembly builds a working app for your team or your clients with that layer already included.",
  },
  {
    question: "Best tool to vibe code a client app?",
    answer:
      "General-purpose vibe coding tools generate a working prototype at a separate URL that still has to be secured, hosted, and connected to client data before a customer can use it. Assembly's AI app builder is built for client-facing apps: describe the app in plain English, approve the plan, and it publishes into a branded client experience that comes with Assembly, with client logins and permissions already handled.",
  },
  {
    question: "How is it different from other builders?",
    answer:
      "Most AI app builders generate a working prototype and stop there, leaving logins, hosting, and client data for the person building it to figure out. Assembly comes with that layer built in: logins for your team and your clients, permissions, a CRM, your branding, and a built-in billing option. What gets built is an app your business can use right away, rather than a prototype that still needs to be finished.",
    links: [{ label: "comparison pages", href: "/comparison" }],
  },
];

export default function AiAppBuilderPage() {
  return (
    <>
      {/* Hero — explainer first, no input box. The page's one live composer sits
          in the closing CTA, so a visitor is invited to type only after reading
          the argument. */}
      <section className="px-6 pb-16 pt-24 text-center md:pb-24 md:pt-32">
        <div className="mx-auto max-w-3xl">
          <h1 className="type-display text-balance">
            The AI app builder made for service businesses
          </h1>
          <p className="type-lead mx-auto mt-6 max-w-2xl text-pretty text-muted-foreground">
            Describe an app in plain English. Assembly builds a working app for
            your team or your clients, with secure logins, permissions, and your
            branding built in.
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
              Book demo
            </a>
          </div>
        </div>

        <div className="mx-auto mt-14 max-w-[1200px] px-0 md:px-4">
          <VisualSlot
            className="text-left"
            ratio="16 / 9"
            label="Hero shot"
            description="Split frame, real product chrome. Back layer: a chat build panel mid-conversation — a prompt for a document collection app for year-end tax docs, one clarifying question, and a Plan card about to be approved. Front layer, overlapping: the same app open twice, once in the team's dashboard and once in a client's branded client experience, with a placeholder logo and its own accent colour. A thin publish line connects the two. No robot or circuit imagery."
          />
        </div>
      </section>

      {/* Content region — pillars through customer proof, framed by the shared
          vertical rails so the rules line up with every other page. */}
      <div className="relative">
        <GridRails />
        <GridDivider fullBleed />

        {/* The pillars open with their own band, padded top and bottom like
            every other section. It used to carry pb-4, which put its lead one
            line above the first pillar's heading — four paragraphs of grey text
            in a row before the argument had started. */}
        <section className="mx-auto max-w-[1200px] px-6 py-16 text-center md:px-10 md:py-24">
          <h2 className="type-h2 mx-auto max-w-3xl text-balance">
            Build the app. Everything around it comes included
          </h2>
        </section>

        {/* No divider above: the first claim's own rule opens the block, and it
            stops at the vertical rule rather than running the full width. No
            wrapper padding either — the claims carry their own, and padding
            here left the vertical rule ending short of the divider below. */}
        <BuilderPillars pillars={PILLARS} />

        <GridDivider />
        <BuilderHowItWorks />

        <GridDivider />
        <BuilderAlternatives />

        <GridDivider />
        <BuilderTemplates />

        <GridDivider />
        <Testimonials />

        <GridDivider />
      </div>

      <div className="relative pb-10 md:pb-16">
        <GridRails />
        <FAQ heading="Frequently asked questions" items={BUILDER_FAQS} twoColumn />
      </div>

      <div className="border-t border-border [[data-theme=dark]_&]:border-[#383838]" />

      <CTA
        heading={
          <>
            Your next app,
            <br />
            built this afternoon
          </>
        }
      />
    </>
  );
}
