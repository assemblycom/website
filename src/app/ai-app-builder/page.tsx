import type { Metadata } from "next";
import { CTA } from "@/components/home/cta";
import {
  Testimonials,
  type CustomerStory,
} from "@/components/home/testimonials";
import { FAQ, type FAQEntry } from "@/components/home/faq";
import {
  BuilderPillars,
  type Pillar,
} from "@/components/ai-app-builder/builder-pillars";
import { BuilderChapter } from "@/components/ai-app-builder/builder-chapter";
import { BuilderHowItWorks } from "@/components/ai-app-builder/builder-how-it-works";
import { BuilderAlternatives } from "@/components/ai-app-builder/builder-alternatives";
import { BuilderTemplates } from "@/components/ai-app-builder/builder-templates";
import { VisualSlot } from "@/components/ui/visual-slot";
import { GridDivider, GridRails } from "@/components/ui/grid-lines";
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
    body: "Describe it once. Client apps land in your client experience, team tools in your dashboard.",
    facts: [
      {
        label: "Collective CPA",
        value: "A live close-status dashboard in under an hour",
      },
      {
        label: "AdvertAI Marketing",
        value: "A complete Message Center their team lives in",
      },
    ],
    visual: {
      label: "Pillar 1 visual",
      description:
        "Two apps side by side that visibly came from one chat panel. Left: a client-facing onboarding checklist inside a branded client experience, its own accent colour and a client logo placeholder. Right: a team-only reporting dashboard in Assembly chrome. Small labels: Your clients, Your team.",
    },
  },
  {
    heading: "One CRM. Every app connects to it",
    body: "Contacts, companies, and custom fields come built in. Each client only sees what they're allowed to see.",
    facts: [],
    visual: {
      label: "Pillar 2 visual",
      description:
        "Lead with the CRM: a contact list in Assembly chrome with companies and a custom field visible. Then the same list feeding two client experiences side by side, Company A seeing its own data and Company B seeing something else.",
    },
  },
  {
    heading: "Secure logins, permissions, and billing come built in",
    body: "Built and maintained by Assembly. Nothing reaches your clients until you make it visible.",
    facts: [],
    visual: {
      label: "Pillar 3 visual",
      description:
        "A client sign-in screen next to a simple Who can see this control listing team roles and a client, both isolated on a clean background and carrying a small Part of Assembly mark, visually separate from the app content they protect. No MFA jargon in the art.",
    },
  },
  {
    heading: "Your clients already have a branded home. New apps land in it",
    body: "Your logo and colors, not ours. Every new app picks them up automatically.",
    facts: [
      {
        label: "Why customers choose Assembly",
        value: "Branding, the number 3 reason",
      },
      { label: "Raised in", value: "27% of sales calls" },
    ],
    visual: {
      label: "Pillar 4 visual",
      description:
        "The identical app rendered twice, side by side, once carrying one business's logo and accent colour and once another's. Same layout and components, only the branding changed. The sales-call stat sits beneath as a pull stat.",
    },
  },
];

/**
 * The brief's eight questions, in its order and its wording: this section
 * carries the page's search and AI-answer load, so the visible question has to
 * match the one the answer is written against. Long questions get a short form
 * for phones, where a wrapped question turns a tidy stack of rows into a ragged
 * one.
 */
const BUILDER_FAQS: FAQEntry[] = [
  {
    question: "Do I need to know how to code to use Assembly's AI app builder?",
    shortQuestion: "Do I need to know how to code?",
    answer:
      "No. Describe what you want in plain English, or start from a template. Assembly asks a few clarifying questions and shows a plan you approve or edit, and then it builds. Changes after launch happen the same way, by continuing the conversation, with no coding at any step.",
  },
  {
    question: "How much does Assembly's AI app builder cost?",
    shortQuestion: "How much does it cost?",
    answer:
      "Assembly has a free plan that never expires, and you can build and publish working apps on it. Paid plans add more apps and your own domain for the client experience. Full details are on Assembly's pricing page.",
    links: [{ label: "pricing page", href: "/pricing" }],
  },
  {
    question:
      "Is Assembly's AI app builder secure enough to handle client data?",
    shortQuestion: "Is it secure enough for client data?",
    answer:
      "Yes. Logins and permissions on Assembly are built and maintained by Assembly's team, not generated by the AI for each app. Clients sign in with Google or a secure one-click email link, and multi-factor authentication is available on every plan, with enforced MFA on Advanced plans. Each client sees only their own data. Full details are on Assembly's security page.",
    links: [{ label: "security page", href: "/security" }],
  },
  {
    question:
      "How is Assembly's AI app builder different from Lovable, Replit, and other AI app builders?",
    shortQuestion: "How is it different from other builders?",
    answer:
      "Most AI app builders generate a working prototype and stop there, leaving logins, hosting, and client data for the person building it to figure out. Assembly's AI app builder comes with that layer built in: logins for your team and your clients, permissions, a CRM, your branding, and a built-in billing option. What gets built is an app your business can use right away, for your clients or your team, rather than a prototype that still needs to be finished. See Assembly's comparison pages against Lovable and Base44 for a feature-by-feature breakdown.",
    links: [{ label: "comparison pages", href: "/comparison" }],
  },
  {
    question:
      "What happens if Assembly's AI app builder builds something wrong that my clients could see?",
    shortQuestion: "What if the builder gets it wrong?",
    answer:
      "Nothing reaches your clients until you've approved the plan and made the app visible to them. New apps stay hidden from clients by default while you test. If something needs fixing after launch, keep chatting with the app builder to change it.",
  },
  {
    question: "What is Assembly's AI app builder not good for building?",
    shortQuestion: "What is it not good for?",
    answer:
      "Public marketing websites. Assembly's AI app builder is built for apps people log into, meaning your team and your clients, not anonymous visitors on the open web. A public website is better built with a different tool and linked from inside your client experience.",
  },
  {
    question: "What is the best AI app builder for service businesses?",
    shortQuestion: "The best AI app builder for service businesses?",
    answer:
      "For a service business, the best AI app builder does more than generate a prototype: it comes with the pieces that make an app usable by a team or a paying client, meaning logins, permissions, branding, and a place for client data. Assembly is built for agencies, accounting and bookkeeping practices, law offices, and consultancies. Describe the app in plain English, or start from one of its templates, and Assembly builds a working app for your team or your clients with that layer already included.",
  },
  {
    question: "What's the best tool to vibe code an app for my clients?",
    shortQuestion: "Best tool to vibe code a client app?",
    answer:
      "General-purpose vibe coding tools like Lovable or Replit generate a working prototype at a separate URL that still has to be secured, hosted, and connected to client data before a customer can use it. Assembly's AI app builder is built for client-facing apps: describe the app in plain English, approve the plan, and it publishes into a branded client experience that comes with Assembly, with client logins and permissions already handled.",
  },
];

/**
 * The featured story the brief names for this page, in its approved wording.
 * The quote is already public and says "Assembly Studio", so it is left as is.
 */
const ADVERTAI_STORY: CustomerStory = {
  quote:
    "We've been able to build out apps in just a few weeks that I don't know if we could have done within five to ten years before Assembly Studio.",
  name: "Garrett Leonard",
  firm: "Founder, AdvertAI Marketing",
  image: "/images/customers/advertai-marketing.jpg",
  intro:
    "An 11-person web design agency. The founder built the Message Center his team works in all day, and retired five tools along the way.",
  stats: [
    { value: "5", label: "Tools retired" },
    { value: "Weeks, not years", label: "To build" },
    { value: "Built by the founder", label: "No developer hired" },
  ],
  href: "/customers/advertai-marketing",
  linkLabel: "Read AdvertAI's story",
};

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
          <p className="type-lead mx-auto mt-6 max-w-2xl text-balance text-muted-foreground">
            Describe what you want. Assembly builds a working app with logins,
            permissions, and your branding built in, for agencies, accountants,
            consultants, and other service businesses. Your clients log in at
            your own domain and see their files, messages, invoices, and the
            apps you built for them.
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

      {/* The argument, framed by the shared vertical rails so this page draws
          the same grid as home, security and customers. A rule closes each
          chapter, capped to the rails so both ends land on one. */}
      <div className="relative">
        <GridRails />
        {/* Full-bleed: this rule opens the region, so there is no rail yet at
            its ends for a capped one to land on. */}
        <GridDivider fullBleed />

        {/* Chapter 1 — the four claims. */}
        <BuilderChapter
          heading="What AI app builders promise. What Assembly proves"
          intro="Plenty of tools can generate something that looks like an app. Assembly builds one your clients and your team can actually use."
        />
        <BuilderPillars pillars={PILLARS} />

        <GridDivider />

        {/* Chapter 2 — the mechanism behind the claims, then the decision the
            reader is actually weighing. The two belong together: the comparison
            only lands once you know how a build works. */}
        <BuilderChapter heading="How it works" tightBottom />
        <BuilderHowItWorks />

        {/* Separates the mechanism from the comparison it sets up. */}
        <GridDivider />

        {/* No divider after this one: the table closes on its own rule, which
            already runs rail to rail, and a second line below it read as a
            doubled break. */}
        <BuilderAlternatives />

        {/* Chapter 3 — the reader now believes it works and wants a way in.
            The templates section carries its own heading, so no chapter title
            sits above it. */}
        <BuilderTemplates />

        <GridDivider />

        <Testimonials story={ADVERTAI_STORY} />

        <GridDivider />

        <FAQ
          heading="Frequently asked questions"
          items={BUILDER_FAQS}
          twoColumn
        />

        {/* Full-bleed: this rule closes the region, so the rails stop here and
            there is nothing at its ends for a capped one to land on. */}
        <GridDivider fullBleed />
      </div>

      <CTA
        heading={
          <>
            Your next app,
            <br />
            built this afternoon
          </>
        }
        subheading="Skip the five-figure custom build. Describe what your business needs, or start from a template."
        submitLabel="Start building for free"
        secondaryCta={{ label: "Book demo", href: DEMO_URL }}
        planChips={false}
      />
    </>
  );
}
