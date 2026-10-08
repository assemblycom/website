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
import { IntakeAppMock } from "@/components/client-portal/segment-mock";
import { BrandedLoginScreen } from "@/components/comparison/branded-login-hero-visual";
import { TeamCrmVisual } from "@/components/home/team-crm-visual";
import { BrandedPortalVisual } from "@/components/ai-app-builder/branded-portal-visual";
import { BuilderHowItWorks } from "@/components/ai-app-builder/builder-how-it-works";
import { BuilderAlternatives } from "@/components/ai-app-builder/builder-alternatives";
import { BuilderTemplates } from "@/components/ai-app-builder/builder-templates";
import { BuilderPrompt } from "@/components/ai-app-builder/builder-prompt";
import { BuilderGlow } from "@/components/ai-app-builder/builder-glow";
import { GridDivider, GridRails } from "@/components/ui/grid-lines";
import { DEMO_URL, SIGNUP_URL } from "@/lib/constants";
import { PAGE_SEO, pageMetadata } from "@/lib/seo";
import { serializeJsonLd } from "@/lib/json-ld";

export const metadata: Metadata = pageMetadata(PAGE_SEO.aiAppBuilder);

/**
 * The four claims a visitor with no Assembly workspace can believe, in the
 * brief's order: client-facing first because that is where Assembly is uniquely
 * good, CRM second, the hard parts third, brand last (table stakes on its own,
 * differentiated only by the fact that it propagates to every new app).
 */
const PILLARS: Pillar[] = [
  {
    eyebrow: "Apps",
    heading: "Build client apps and internal tools in one place",
    body: "Describe it once. Client apps land in your client experience, team tools in your dashboard.",
    // The built app sitting in the client's own sidebar, which is the claim.
    // A landscape screen like the other three: the build rail's portrait cards
    // are the wrong shape for this frame, and they already run below.
    visual: <IntakeAppMock />,
  },
  {
    eyebrow: "CRM",
    heading: "One CRM. Every app connects to it",
    body: "Contacts, companies, and custom fields come built in. Each client only sees what they're allowed to see.",
    // The home page's CRM shot: contacts, companies and a custom field.
    visual: <TeamCrmVisual />,
  },
  {
    eyebrow: "Security",
    heading: "Secure logins, permissions, and billing built in",
    body: "Built and maintained by Assembly. Nothing reaches your clients until you make it visible.",
    // The firm's own sign-in: their mark, their domain, no platform badge.
    // The claim leads on secure LOGINS, and this is the first thing a client
    // meets. It was the onboarding screen, which carried an "Access: client
    // only" control a few hundred pixels in — a picture of permissions, with
    // nothing in it about signing in at all.
    visual: <BrandedLoginScreen />,
    // Whole, not cropped. A sign-in is one object with a middle — the mark,
    // the title, the field, the button — and cropping it on the card's edges
    // cut off the half of it the claim is about.
    visualContained: true,
  },
  {
    eyebrow: "Branding",
    heading: "New apps land in your clients' branded home",
    body: "Your logo and colors, not ours. Every new app picks them up automatically.",
    // The CLIENT's nav, in the firm's colour, with the apps the firm has added
    // listed under the stock rows. It was the home page's branded-portal shot,
    // which is the team's dashboard — CRM, Team, Customize, and a table of six
    // clients' time entries — so a card about where the client's apps land was
    // showing a screen no client ever opens.
    visual: <BrandedPortalVisual quietPane appHeader={false} />,
    // The firm's branded nav IS this claim; the app pane beside it only shows
    // the nav is attached to a real screen. So the pane dissolves into the card
    // on the right instead of being cut off by it, and the slab is what the eye
    // lands on.
    fadeRight: true,
  },
];

/**
 * The brief's eight questions, in its order and its wording: this section
 * carries the page's search and AI-answer load, so `question` keeps the brief's
 * full wording — that is what the FAQ schema below publishes and what the answer
 * is written against.
 *
 * The two that would wrap to a second line carry a `shortQuestion` for the row
 * label only. Both still name Assembly's AI app builder rather than "it", and
 * both still ask the same thing; only the trailing generalisation is dropped,
 * which the answer itself restates.
 */
const BUILDER_FAQS: FAQEntry[] = [
  {
    question: "Do I need to know how to code to use Assembly's AI app builder?",
    answer:
      "No. Describe what you want, or start from a template. Assembly asks a few clarifying questions and shows a plan you approve or edit, and then it builds. Changes after launch happen the same way, by continuing the conversation, with no coding at any step.",
  },
  {
    question: "How much does Assembly's AI app builder cost?",
    answer:
      "Assembly has a free plan that never expires, and you can build and publish working apps on it. Paid plans add more apps and your own domain for the client experience. Full details are on Assembly's pricing page.",
    links: [{ label: "pricing page", href: "/pricing" }],
  },
  {
    question:
      "Is Assembly's AI app builder secure enough to handle client data?",
    answer:
      "Yes. Logins and permissions on Assembly are built and maintained by Assembly's team, not generated by the AI for each app. Clients sign in with Google or a secure one-click email link, and multi-factor authentication is available on every plan, with enforced MFA on Advanced plans. Each client sees only their own data. Full details are on Assembly's security page.",
    links: [{ label: "security page", href: "/security" }],
  },
  {
    question:
      "How is Assembly's AI app builder different from Lovable, Replit, and other AI app builders?",
    shortQuestion:
      "How is Assembly's AI app builder different from Lovable and Replit?",
    answer:
      "Most AI app builders generate a working prototype and stop there, leaving logins, hosting, and client data for the person building it to figure out. Assembly's AI app builder comes with that layer built in: logins for your team and your clients, permissions, a CRM, your branding, and a built-in billing option. What gets built is an app your business can use right away, for your clients or your team, rather than a prototype that still needs to be finished. See Assembly's comparison pages against Lovable and Base44 for a feature-by-feature breakdown.",
    links: [{ label: "comparison pages", href: "/comparison" }],
  },
  {
    question:
      "What happens if Assembly's AI app builder builds something wrong that my clients could see?",
    shortQuestion:
      "What if Assembly's AI app builder builds something wrong?",
    answer:
      "Nothing reaches your clients until you've approved the plan and made the app visible to them. New apps stay hidden from clients by default while you test. If something needs fixing after launch, keep chatting with the app builder to change it.",
  },
  {
    question: "What is Assembly's AI app builder not good for building?",
    answer:
      "Public marketing websites. Assembly's AI app builder is built for apps people log into, meaning your team and your clients, not anonymous visitors on the open web. A public website is better built with a different tool and linked from inside your client experience.",
  },
  {
    question: "What is the best AI app builder for service businesses?",
    answer:
      "For a service business, the best AI app builder does more than generate a prototype: it comes with the pieces that make an app usable by a team or a paying client, meaning logins, permissions, branding, and a place for client data. Assembly is built for agencies, accounting and bookkeeping practices, law offices, and consultancies. Describe the app, or start from one of its templates, and Assembly builds a working app for your team or your clients with that layer already included.",
  },
  {
    question: "What's the best tool to vibe code an app for my clients?",
    answer:
      "General-purpose vibe coding tools like Lovable or Replit generate a working prototype at a separate URL that still has to be secured, hosted, and connected to client data before a customer can use it. Assembly's AI app builder is built for client-facing apps: describe the app, approve the plan, and it publishes into a branded client experience that comes with Assembly, with client logins and permissions already handled.",
  },
];

/**
 * The featured story the brief names for this page.
 *
 * NOTE: the quote is a tightened paraphrase, not Garrett's published wording.
 * He said "We’ve been able to build out apps in just a few weeks that I don’t
 * know if we could have done within five to ten years before Assembly"
 * (case-studies.ts). It is shortened here on the site owner’s instruction;
 * since it sits in quotation marks under his name, it wants his sign-off
 * before this ships.
 *
 * The homepage carries a third wording of the same sentence (testimonials.tsx),
 * so one customer is currently quoted three ways across the site.
 */
const ADVERTAI_STORY: CustomerStory = {
  quote:
    "We’ve built apps in a few weeks that I don’t think we could have done in 5 to 10 years before Assembly.",
  name: "Garrett Leonard",
  firm: "Advertai Marketing",
  image: "/images/customers/advertai-marketing.jpg",
  intro:
    "An 11-person web design agency. The founder built the Message Center his team works in all day, and retired five tools along the way.",
  stats: [
    { value: "5", label: "Tools retired" },
    { value: "Weeks, not years", label: "To build" },
    { value: "Built by the founder", label: "No developer hired" },
  ],
  href: "/customers/advertai-marketing",
  linkLabel: "Read Advertai's story",
};

// Built from the same entries the accordion renders, so the questions a crawler
// reads can never drift from the ones on the page.
const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: BUILDER_FAQS.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })),
};

export default function AiAppBuilderPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(FAQ_SCHEMA) }}
      />
      {/* Hero — explainer first, no input box. The page's one live composer sits
          in the closing CTA, so a visitor is invited to type only after reading
          the argument. Claim on the left with its actions, detail set against
          it on the right; on a phone they stack. */}
      {/* Holds the viewport on its own. The hero is three things — a claim, a
          line under it and the box you type into — and with the next section's
          heading showing beneath them the page opened on two competing titles.
          Min-height rather than more padding, so it fills whatever screen it
          lands on instead of being tuned for one; svh rather than vh, because
          on mobile vh is the tallest the viewport ever gets and the browser
          chrome then eats the bottom of it. 5rem is the sticky nav above. */}
      <section className="relative flex min-h-[calc(100svh-5rem)] items-center overflow-hidden pb-20 pt-16 md:pb-28 md:pt-20">
        {/* The horizon arc behind the headline. It clips to this section and
            fades out before its bottom edge, so the region below still opens
            on the page's own ground. `overflow-hidden` above is what crops the
            ellipses into an arc — without it they are four circles. */}
        <BuilderGlow />
        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 md:px-10">
          {/* Centred, with the composer under the claim rather than a split
              header and a picture beside it. This page's subject IS the box
              you type into, so the hero puts it on the centre line and lets
              the headline sit over it — the layout every builder's own front
              door uses. The other product pages keep the split header, because
              their subject is a portal rather than a prompt. */}
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="type-display mx-auto max-w-[18ch] text-balance">
              The AI app builder made for service businesses
            </h1>
            {/* One line of claim, no audience list. It used to end "for
                agencies, accountants, consultants, and other service
                businesses" — which is the headline's own last three words
                spelled out, so the hero made the same point twice in a row and
                spent half the lede doing it. The verticals are named further
                down, where they are the subject rather than a restatement.
                The own-domain point is carried by the branding pillar. */}
            {/* text-balance, not text-pretty, and the headline above it is the
                reason. pretty only protects the LAST line from running short,
                so it filled line one and left "and your branding built in." on
                its own under it — a long line over a stub, directly beneath a
                headline that is itself balanced. balance evens the two. */}
            <p className="type-lead mx-auto mt-5 max-w-[38rem] text-balance text-muted-foreground">
              Describe what you want. Assembly builds a working app with logins,
              permissions, and your branding built in.
            </p>
          </div>

          <BuilderPrompt />

          {/* No button row under the box. "Start building for free" IS the
              arrow inside the composer — repeating it immediately underneath
              asked the same question twice — and the demo is carried by the
              nav's own Book a demo, which is on every page including this
              one. */}


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
          heading="What AI app builders promise. What Assembly proves."
          intro="Plenty of tools can generate something that looks like an app. Assembly builds one your clients and your team can actually use."
          // The hero's split, not a centred block: this chapter heads the
          // bento below it, and a centred title over a left-ranged grid of
          // cards read as two different pages meeting.
          split
        />
        <BuilderPillars pillars={PILLARS} />

        <GridDivider />

        {/* Chapter 2 — the mechanism behind the claims, then the decision the
            reader is actually weighing. The two belong together: the comparison
            only lands once you know how a build works. */}
        {/* Split, so this title ranges left like the chapter above it and like
            the control and panel below it. Centred, it was the one thing in
            the region that did not start on the page's left line. */}
        <BuilderChapter heading="How it works" tightBottom split />
        <BuilderHowItWorks />

        {/* Separates the mechanism from the comparison it sets up. */}
        <GridDivider />

        <BuilderAlternatives />

        {/* The table used to close on its own rule, which ran rail to rail, so
            a divider here was a doubled break. It sits inside the section's
            padding now and closes on its own frame, so the region below it was
            left opening on nothing. */}
        <GridDivider />

        {/* Chapter 3 — the reader now believes it works and wants a way in.
            The templates section carries its own heading, so no chapter title
            sits above it. */}
        <BuilderTemplates />

        <GridDivider />

        <Testimonials story={ADVERTAI_STORY} />

        <GridDivider />

        {/* The divided variant, as on /security: the heading holds a sticky
            left column and the questions run down the right as a hairline list.
            The two-column card grid set these eight long questions as eight
            ragged two-line pills; one flat column lets each sit on its own rule
            without the wording being shortened. */}
        <FAQ
          heading="Frequently asked questions"
          items={BUILDER_FAQS}
          variant="divided"
          dottedRules
          compactQuestions
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
        // Broken at the sentence, the same place the CTA's own default lead
        // breaks. Left to wrap it set eight words on line one and "a template."
        // on line two — `text-pretty` only rescues a single-word last line. The
        // break is md-up: below that the measure is narrow enough that the two
        // sentences wrap into a block on their own.
        subheading={
          <>
            Skip the five-figure custom build.
            <br className="hidden md:inline" />{" "}
            Describe what your business needs, or start from a template.
          </>
        }
        // The page opens on a composer; closing on a second one asks the same
        // question twice. Two buttons instead, the pair the hero opens with.
        composer={false}
        primaryCta={{ label: "Start building for free", href: SIGNUP_URL }}
        secondaryCta={{ label: "Book demo", href: DEMO_URL }}
        planChips={false}
      />
    </>
  );
}
