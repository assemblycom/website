import type { Metadata } from "next";
import { CTA } from "@/components/home/cta";
import { FAQ } from "@/components/home/faq";
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
import { serializeJsonLd } from "@/lib/json-ld";

export const metadata: Metadata = pageMetadata(PAGE_SEO.aiAppBuilder);

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
          {/* The shape is the component's default now — this page was where
              the treatment was first drawn, and the rest of the site has since
              been moved onto it. All that is left here is `compactQuestions`,
              which is this page's own: its questions are written long for
              search, so the row shows the short form while the answer stays
              filed under the full wording. */}
          <FAQ
            heading="Frequently asked questions"
            items={BUILDER_FAQS}
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
