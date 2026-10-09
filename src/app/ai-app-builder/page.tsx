import type { Metadata } from "next";
import { CTA } from "@/components/home/cta";
import { FAQ, type FAQEntry } from "@/components/home/faq";
import {
  BuilderPillars,
  type Pillar,
} from "@/components/ai-app-builder/builder-pillars";
import {
  BuilderGridRails,
  BUILDER_GRID_LINE,
  BUILDER_RAIL_HALO_WIDE,
} from "@/components/ai-app-builder/builder-grid-rails";
import { BuilderCustomerQuotes } from "@/components/ai-app-builder/builder-customer-quotes";
import { BuilderChapter } from "@/components/ai-app-builder/builder-chapter";
import { AddAppMock } from "@/components/ai-app-builder/add-app-mock";
import { BrandedLoginScreen } from "@/components/comparison/branded-login-hero-visual";
import { TeamCrmVisual } from "@/components/home/team-crm-visual";
import {
  BrandedPortalVisual,
  PORTAL_STOCK_CORE,
} from "@/components/ai-app-builder/branded-portal-visual";
import { BuilderHowItWorks } from "@/components/ai-app-builder/builder-how-it-works";
import { BuilderAlternatives } from "@/components/ai-app-builder/builder-alternatives";
import { BuilderTemplates } from "@/components/ai-app-builder/builder-templates";
import { BuilderPrompt } from "@/components/ai-app-builder/builder-prompt";
import { BuilderGlow } from "@/components/ai-app-builder/builder-glow";
import { GridDivider } from "@/components/ui/grid-lines";
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
    // "Build … in one place" → "Client apps and internal tools, one place".
    // The verb goes because the whole page is about building and the section
    // above this one says so twice; "one place" is the claim and it stays.
    heading: "Client apps and internal tools, one place",
    // 15 words to 13, same two beats: you describe it once, and WHICH of the
    // two places it lands in is decided for you. "your client experience" →
    // "clients" is the same destination said shorter — the apps reach the
    // client — and keeps the pairing with "your dashboard" it is contrasted
    // against.
    body: "Describe it once. Client apps go to clients, team tools to your dashboard.",
    // The Add App screen — the ONE PLACE the heading names. It was the built
    // app sitting in a client's sidebar, which shows where an app lands; that
    // is true, and it is also what the two cards further down this row already
    // show. The claim here is about where every app starts, and the product's
    // answer is a single box that takes a sentence and decides from the
    // sentence whether what comes back is a client app or a team tool.
    visual: <AddAppMock />,
    // Flat against the card: no cast, no rounded corner. This screen's ground
    // is the product's own page white and its subject sits in the middle of
    // it, so a lift and a corner were drawing a frame around mostly-empty
    // page — the frame read louder than the box it was framing. The other
    // three keep theirs; their screens have furniture on every edge.
    visualBare: true,
    // Dissolved into the card at its foot. The shot ends mid-way through a row
    // of app cards, and a hard cut there reads as half-drawn cards rather than
    // as a window onto a page that carries on. 84%, so the ramp covers about
    // the last row and nothing above it.
    fadeBottom: 84,
  },
  {
    eyebrow: "CRM",
    // Two sentences to one phrase. "One CRM. Every app connects to it" said
    // the same thing twice — one CRM, and everything joins it — so the second
    // half is folded in as "behind every app".
    heading: "One CRM behind every app",
    // 12 words to 10. The dash clause becomes its own short sentence and the
    // list drops its "and"; "each client sees only what you allow" loses
    // "each", which the plural already carries. The claim is unchanged: three
    // kinds of record, and per-client visibility you control.
    body: "Contacts, companies, custom fields. Clients see only what you allow.",
    // The home page's CRM shot: contacts, companies and a custom field.
    visual: <TeamCrmVisual />,
    // 490, not the tall card's default 860. The table's Name column is flex-1
    // against four fixed ones, so every pixel of layout width lands on Name —
    // at 860 it took 526 of them and pushed Company clean past the card's
    // crop, which left a shot of a contact list with no company in it under a
    // heading about companies.
    //
    // The number is set by the NARROWEST card this row draws, not the widest:
    // 360 is set from BOTH ends now, and it can be because the table's
    // columns are fixed with a spacer at the end (see TeamCrmVisual) rather
    // than Name being flex-1. While Name was flexible these two were the same
    // number and could not both be satisfied:
    //
    //   - it has to be WIDER than the widest card this row draws (~331px of
    //     mock visible at the 1200 container) or the screen stops short of the
    //     card's right edge and leaves a strip of card showing;
    //   - and the Company column has to land inside the NARROWEST (271px at a
    //     1024 viewport), or the shot is a contact list with no company in it
    //     under a heading about companies.
    //
    // The spacer takes the difference. The type does not scale with this.
    visualWidth: 360,
    // Dissolved on the right rather than cut off by the card. A hard crop
    // through a table's rows reads as the picture being clipped; a ramp reads
    // as the table carrying on past what the card can show, which is what is
    // actually true. It starts at 88% and not the default 62 because this
    // shot's subject runs ACROSS the measure — at 62 the company column would
    // be read through the middle of the gradient.
    //
    // Outlined, not cast — the same call as the Apps card beside it. These two
    // sit in one row and a shadow under one with a drawn edge on the other is
    // the row telling you they are different kinds of thing.
    visualBare: true,
    fadeRight: true,
    // Contained and centred on a phone. At 327px the card is barely narrower
    // than the 360px shot, so the crop had nothing to show for itself — a few
    // pixels of overhang and a ramp running through the Company column — where
    // on a desktop the same crop is a real window onto a wider table.
    containOnPhone: true,
    // 74, not 88. At 88 the ramp had 12% of the card to get from solid to
    // nothing — short enough that it read as a soft cut rather than as the
    // table carrying on past the edge. 74 spends a quarter of the width on
    // the dissolve, which is what makes the shot meet the card's ground
    // instead of stopping against it. The Company column still clears it:
    // the ramp is barely on at 74 and does not bite until past the logos.
    fadeFrom: 74,
  },
  {
    eyebrow: "Security",
    // The "and" goes; the list reads as a list without it. "Secure" stays —
    // it is the word doing the work, and the three nouns alone would be a
    // feature list rather than a claim about them.
    heading: "Secure logins, permissions, billing built in",
    // 11 words to 10, and the second sentence turns round to lead on the
    // client: "Nothing reaches clients until…" → "Clients see nothing
    // until…". Same gate, same hand on it.
    body: "Maintained by Assembly. Clients see nothing until you make it visible.",
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
    // NO BRAND WASH. This card carried the page's periwinkle-to-lime ramp
    // behind the sign-in, on the grounds that it is the one shot here that
    // floats whole in its card rather than being cropped by it, so it is the
    // one with a ground to put something on.
    //
    // In dark that ground never came off. Laid over a near-black surface the
    // ramp has to run at about half its light-mode alpha or the body copy on
    // top of it stops being readable, and at that strength periwinkle and lime
    // both resolve towards the same olive-grey — a card tinted rather than
    // coloured. Brightening it is a straight trade against the copy sitting in
    // the top quarter (measured: the band under the body text goes from 3.0:1
    // to 2.0:1), so the wash cannot be both legible and worth having here.
    //
    // The card takes --surface like the other three instead. The sign-in holds
    // its own against a neutral ground via `fadeFoot` below, which is what
    // keeps its foot from cutting off flat.
    //
    // `.pillar-brand-wash` and the `brandWash` prop are left in place — this
    // is the only caller, so turning it back on is one word.
    brandWash: false,
    // A BOTTOM FADE IN DARK, and only in dark.
    //
    // The objection to one was that the screen's last visible object is the
    // Magic link button, a solid near-black slab in light, and a ramp across a
    // slab reads as the button being blurred rather than as the screen giving
    // out. That still holds in light, and light does not need the ramp anyway:
    // --surface and the screen's --mock-window are a point apart there, so the
    // foot already gives out on its own.
    //
    // Dark is the other case on both counts. The card is #191919 and the
    // screen #212121, so the hard cut at the card's edge is a visible step
    // running flat across the full width; and the Magic link button is no
    // longer a slab here — it took the Continue-with-Google surface in dark, so
    // there is something low-contrast for the ramp to give out into, which is
    // exactly what it was missing. See `fadeFoot` and --mock-foot-fade.
    fadeFoot: true,
  },
  {
    eyebrow: "Branding",
    // "in your clients' branded home" → "already branded". Where it lands is
    // the picture's job — the shot under this heading IS the client's home —
    // so the words keep the part the picture cannot say: that it arrives
    // carrying your brand rather than being dressed afterwards.
    heading: "New apps land already branded",
    // 13 words to 11. The second sentence becomes a clause on the first, and
    // "picks them up automatically" drops the adverb, which the present tense
    // already implies.
    body: "Your logo and colors, not ours — every app picks them up.",
    // The CLIENT's nav, in the firm's colour, with the apps the firm has added
    // listed under the stock rows. It was the home page's branded-portal shot,
    // which is the team's dashboard — CRM, Team, Customize, and a table of six
    // clients' time entries — so a card about where the client's apps land was
    // showing a screen no client ever opens.
    // PORTAL_STOCK_CORE: Home, Messages, Files — no Billing. This card's nav
    // only has to establish "a portal with the usual rows in it" before the
    // added app, and a fourth stock row is one more thing between the top of
    // the nav and the row the claim is about. /solutions' agency hero keeps
    // the full set.
    visual: (
      <BrandedPortalVisual
        quietPane
        appHeader={false}
        stock={PORTAL_STOCK_CORE}
      />
    ),
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
    shortQuestion: "What if Assembly's AI app builder builds something wrong?",
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
      {/* RANGED TO THE TOP ON A PHONE, centred from `md`. Centring in a
          viewport-tall section is right on a desktop, where the claim lands on
          the optical middle of a wide screen. On a phone the same rule put a
          third of the screen above the headline before anything was said, and
          pushed the composer — the one thing on this page you can actually use
          — most of the way down the first screen. The glow below is unchanged:
          it is drawn to the section's foot, which has not moved. */}
      <section className="relative flex min-h-[calc(100svh-5rem)] items-start overflow-hidden pb-20 pt-10 md:items-center md:pb-28 md:pt-20">
        {/* The horizon arc behind the headline. It clips to this section and
            fades out before its bottom edge, so the region below still opens
            on the page's own ground. `overflow-hidden` above is what crops the
            ellipses into an arc — without it they are four circles. */}
        <BuilderGlow />
{/* `builder-hero-lift` takes the block off the centre line on a big
            screen — see globals.css, where the two gates and the reason they
            are on HEIGHT and not just width are written out. */}
        <div className="relative z-10 mx-auto w-full max-w-[1400px] builder-hero-lift px-6 md:px-10">
          {/* Centred, with the composer under the claim rather than a split
              header and a picture beside it. This page's subject IS the box
              you type into, so the hero puts it on the centre line and lets
              the headline sit over it — the layout every builder's own front
              door uses. The other product pages keep the split header, because
              their subject is a portal rather than a prompt. */}
          <div className="mx-auto max-w-3xl text-center">
            {/* pretty, NOT balance, and on a phone that is the whole
                difference between a clean break and a bad one. Balanced, the
                36px setting came out "The AI app / builder made for / service
                businesses" — it split "AI app builder", the one phrase on the
                page that is a name rather than a description, and it did so
                to buy an even rag. Left to wrap, the same words fall "The AI
                app builder / made for service / businesses": the name is
                intact and the three lines step down, 292/274/177.
                Measured at 360, 375, 390, 414 and 430; from 600px up the two
                settings are identical, so nothing above the fold on a desktop
                changes. */}
            <h1 className="type-display mx-auto max-w-[18ch] text-pretty">
              The AI app builder made for service businesses
            </h1>
            {/* One line of claim, no audience list. It used to end "for
                agencies, accountants, consultants, and other service
                businesses" — which is the headline's own last three words
                spelled out, so the hero made the same point twice in a row and
                spent half the lede doing it. The verticals are named further
                down, where they are the subject rather than a restatement.
                The own-domain point is carried by the branding pillar. */}
            {/* Three lines on a phone, now two. The cut is the tail — "and
                your branding built in." became ", branding." — because the
                threshold is hard: at 36px/16px in a 327px measure the lede
                wraps to two lines at 91 characters and three at 92, and the
                sentence was 107. Every content word survives it; what goes is
                a conjunction, a "your", and a "built in" that "with" was
                already saying. The list ends unconjoined on purpose, which is
                the ordinary way a clipped feature list is set.

                text-balance, not text-pretty, and the headline above it is the
                reason. pretty only protects the LAST line from running short,
                so it filled line one and left the tail on its own under it —
                a long line over a stub. balance evens the two. (The headline
                itself wants the opposite; see the note on it above.) */}
            <p className="type-lead mx-auto mt-5 max-w-[38rem] text-balance text-muted-foreground">
              Describe what you want. Assembly builds a working app with logins,
              permissions, and branding.
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
      {/* `isolate` and a ground, both for the rails: see builder-grid-rails.
          The layer sits at a negative z so that section and card backgrounds
          paint over it, and a negative z only resolves against a stacking
          context that has a background of its own to sit above. Without these
          two the rails either draw on top of every component (z-0) or vanish
          behind the page (-z, no isolate). */}
      <div className="relative isolate bg-background">
        {/* The column grid, in place of the two framing rails this region used
            to draw. See builder-grid-rails: a backdrop bounded to this wrapper
            rather than an overlay, so it starts and ends with the chapters.
            The wrapper stays `relative` because the dividers below still cap
            to the measure. */}
        <BuilderGridRails />
        {/* NO RULE OPENING THE REGION. There was a full-bleed one here, from
            when the region's only grid was two framing rails and a rule was
            the single thing marking where the chapters began. The rails now
            begin at this exact line and run the full width of the measure, so
            the opening was being stated twice — and the horizontal version
            crossed the hero's glow edge-to-edge, which is the one place on the
            page with nothing to rule off. The closing rule stays: it is the
            seam between the chapters and the CTA. */}

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

        <GridDivider lineClass={BUILDER_GRID_LINE} />

        {/* Chapter 2 — the mechanism behind the claims, then the decision the
            reader is actually weighing. The two belong together: the comparison
            only lands once you know how a build works. */}
        {/* Split, so this title ranges left like the chapter above it and like
            the control and panel below it. Centred, it was the one thing in
            the region that did not start on the page's left line. */}
        <BuilderChapter heading="How it works" tightBottom split />
        <BuilderHowItWorks />

        {/* Separates the mechanism from the comparison it sets up. */}
        <GridDivider lineClass={BUILDER_GRID_LINE} />

        <BuilderAlternatives />

        {/* The table used to close on its own rule, which ran rail to rail, so
            a divider here was a doubled break. It sits inside the section's
            padding now and closes on its own frame, so the region below it was
            left opening on nothing. */}
        <GridDivider lineClass={BUILDER_GRID_LINE} />

        {/* Chapter 3 — the reader now believes it works and wants a way in.
            The templates section carries its own heading, so no chapter title
            sits above it. */}
        <BuilderTemplates />

        <GridDivider lineClass={BUILDER_GRID_LINE} />

        <BuilderCustomerQuotes />

        <GridDivider lineClass={BUILDER_GRID_LINE} />

        {/* The divided variant, as on /security: the heading holds a sticky
            left column and the questions run down the right as a hairline list.
            The two-column card grid set these eight long questions as eight
            ragged two-line pills; one flat column lets each sit on its own rule
            without the wording being shortened. */}
        {/* THE FAQ TAKES THE PAGE GROUND AND THE RAIL HALO.
            Every other block in this region is an opaque card or table, so the
            rails pass behind it and are interrupted — that interruption is the
            effect. The FAQ is the one block with no fill of its own: its rows
            are transparent and separated by dotted rules, so six rails ran
            straight down through nine questions and crossed every rule, which
            put a grid over the one part of the region that is plain reading.

            `bg-background` makes it an opaque block like the rest, and the
            halo gives that block the same soft edge the cards have instead of
            a hard start and stop. See BUILDER_RAIL_HALO in builder-grid-rails.
            The wrapper is here rather than in the shared FAQ because it is
            this page's rails it answers to, not anything the FAQ owns. */}
        <div className={`relative bg-background ${BUILDER_RAIL_HALO_WIDE}`}>
          <FAQ
            heading="Frequently asked questions"
            items={BUILDER_FAQS}
            variant="divided"
            dottedRules
            compactQuestions
          />
        </div>

        {/* Full-bleed: the seam between the chapters and the CTA. It no
            longer closes the RAILS — the CTA is inside the region now, so the
            grid carries on behind it and the rule is a rule rather than an
            ending. Nothing capped lands on it, hence full-bleed. */}
        <GridDivider fullBleed lineClass={BUILDER_GRID_LINE} />

        {/* INSIDE THE REGION, so the rails run behind it. The CTA is the one
            block on the page with nothing in it but centred type and two
            buttons, which is exactly the width of empty page the grid is
            there to give a floor to — it was the last screen before the
            footer and the only one with no structure behind it. It carries no
            ground of its own, so the rails show straight through; the mask on
            the layer takes them out before the footer. */}
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
              {/* "what your business needs" → "what you need". The reader is
                  the business; naming it again was the sentence restating its
                  own audience. 15 words to 13, both offers intact: skip the
                  custom build, and start either from a description or from a
                  template. */}
              Skip the five-figure custom build.
              <br className="hidden md:inline" /> Describe what you need, or
              start from a template.
            </>
          }
          // The page opens on a composer; closing on a second one asks the same
          // question twice. Two buttons instead, the pair the hero opens with.
          composer={false}
          primaryCta={{ label: "Start building for free", href: SIGNUP_URL }}
          secondaryCta={{ label: "Book demo", href: DEMO_URL }}
          planChips={false}
          // No fill of its own, so the rails show through. See the prop.
          transparent
        />
      </div>
    </>
  );
}
