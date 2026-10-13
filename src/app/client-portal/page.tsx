import type { Metadata } from "next";
import { CTA } from "@/components/home/cta";
import { FAQ, type FAQEntry } from "@/components/home/faq";
import { GridDivider, GridRails } from "@/components/ui/grid-lines";
import { PortalSocialProof } from "@/components/client-portal/portal-social-proof";
import { PortalProblem } from "@/components/client-portal/portal-problem";
import { PortalJourney } from "@/components/client-portal/portal-journey";
import { PortalCustomizations } from "@/components/client-portal/portal-customizations";
import { PortalFrictionless } from "@/components/client-portal/portal-frictionless";
import { PortalStack } from "@/components/client-portal/portal-stack";
import { PortalTrust } from "@/components/client-portal/portal-trust";
import { PortalPricing } from "@/components/client-portal/portal-pricing";
import { BuilderCustomerQuotes } from "@/components/ai-app-builder/builder-customer-quotes";
import { BuilderHeroVisual } from "@/components/ai-app-builder/builder-hero-visual";
import { DEMO_URL, SIGNUP_URL } from "@/lib/constants";
import { PAGE_SEO, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(PAGE_SEO.clientPortal);

/**
 * Handoff v2's eight, verbatim. Every question carries "client portal" in full
 * rather than the shortened forms this page shipped with ("Can I build my own
 * apps into it?"): the handoff writes them long on purpose, because the
 * question text is what the page is filed under in search, and "it" matches
 * nothing. None of the eight wraps at the list's measure, so none carries a
 * `shortQuestion`; add one here if a future edit lengthens a question past a
 * single row rather than shortening the question itself.
 */
const PORTAL_FAQS: FAQEntry[] = [
  {
    question: "What is a client portal?",
    answer:
      "A secure, branded hub where clients message you, pay invoices, sign contracts, share files, and track work. Assembly gives you those as ready-made apps, then lets you build custom apps into the same portal.",
  },
  {
    question: "Can I build my own apps into the client portal?",
    answer:
      "Yes. Describe the app in plain English. Assembly shows a plan to approve or edit, then ships a real app into your portal with logins, permissions, and branding handled. Change it later by chatting.",
    links: [{ label: "Describe the app in plain English", href: "/ai-app-builder" }],
  },
  {
    question: "Do I need to code to customize the client portal?",
    answer:
      "No. You describe what you want, review a plan, and publish. You can also start from one of 30+ templates, each a working app, and tell the builder what to change.",
    links: [{ label: "30+ templates", href: "/templates" }],
  },
  {
    question: "Can I white-label the client portal?",
    answer:
      "Yes. Your logo and colors are on every plan. On Professional and up, clients sign in on your own domain with the Assembly badge removed, and every new app inherits your brand.",
  },
  {
    question: "Is my client portal secure?",
    answer:
      "Yes. Assembly is SOC 2 Type II certified and supports HIPAA, GDPR, and CCPA. Data is encrypted in transit and at rest, each client sees only their own data, and MFA is on every plan.",
    links: [{ label: "SOC 2 Type II certified", href: "/security" }],
  },
  {
    question: "Does Assembly offer a HIPAA-compliant client portal?",
    answer:
      "Yes, with a BAA on the Advanced plan. Ready-made apps that do not use AI can handle PHI; apps built with the AI app builder are not covered. Talk to us to map what fits.",
    links: [{ label: "Talk to us", href: DEMO_URL }],
  },
  {
    question: "What is the best client portal software for service firms?",
    answer:
      "The one clients actually log in to and your firm never settles for. Assembly pairs ready-made apps with an AI app builder: essentials on day one, custom apps when you need them.",
  },
  {
    question: "What is the client portal not good for?",
    answer:
      "Public marketing websites. Assembly builds experiences for your team and your signed-in clients. Build a public site elsewhere and link to it from inside your portal.",
  },
];

/**
 * Collective CPA leads here rather than AdvertAI (which leads the builder and
 * comparison pages): the quote is this page's thesis in a customer's own words,
 * and accounting is the slower-converting, safety-first segment this page most
 * needs to reach. Already public on /customers, so nothing waits on approval.
 */
export default function ClientPortalPage() {
  return (
    <>
      {/* Hero — the category the visitor searched for, and the thesis, in one
          breath. "Build on" is the one phrase no legacy portal (no builder) and
          no code-generation tool (no portal) can claim. Same split header as
          the AI app builder page: stacked, the detail follows the headline and
          the actions close the block. */}
      <section className="pb-16 pt-24 md:pb-24 md:pt-32">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          {/* CENTRED on a phone, ranged left from md.
          
              The split header is a two-column idea: headline on the left, the
              detail beside it, each holding its own edge. Below lg there are no
              columns left to hold — the three blocks stack — and a stacked
              left-ranged hero on a 375px screen is three different ragged right
              edges down one side of the screen, with the buttons (which are
              full width here) squared off under them. Centred, the stack reads
              as one block and the buttons stop looking like the only thing that
              was laid out.
              
              The max-widths go with it: mx-auto on a measure narrower than the
              column is what actually centres the text, rather than centring
              only the glyphs inside a left-hugging box. */}
          <div className="grid gap-8 text-center md:text-left lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-x-16">
            <h1 className="type-display mx-auto max-w-[16ch] text-balance md:mx-0">
              The client portal you can build on
            </h1>
            <p className="type-lead mx-auto max-w-[34rem] text-pretty text-muted-foreground md:mx-0 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:pt-2">
              Everything your clients need from you, in one place. Tailor your
              white-label portal with AI to fit perfectly to your firm.
            </p>
            <div>
              {/* Stacked and full width on phones, side by side from md.
                  Sized to their own text, the pair stacked into two different
                  widths with a ragged right edge, and each sat under the 44px
                  tap target. Full width only on true phones: from sm there is
                  room for the pair side by side at their own size, and holding
                  them full width to md left two very wide buttons on a tablet.
                  Matches the pricing billing toggle's shape (w-full, then
                  w-auto at a breakpoint). */}
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center md:justify-start">
                <a
                  href={SIGNUP_URL}
                  className="w-full rounded-lg bg-foreground px-5 py-3 text-center text-sm text-background transition-opacity hover:opacity-90 sm:w-auto sm:py-2.5"
                >
                  Get started
                </a>
                <a
                  href={DEMO_URL}
                  className="w-full rounded-lg border border-foreground/20 bg-transparent px-5 py-3 text-center text-sm text-foreground transition-colors hover:bg-foreground/5 sm:w-auto sm:py-2.5"
                >
                  Book a demo
                </a>
              </div>
              {/* The handoff's hero support line. Under the buttons rather
                  than above them: it qualifies the first one ("free forever",
                  "no card"), and a reassurance read before there is anything
                  to be reassured about is just a claim. */}
              <p className="type-caption mt-4 text-muted-foreground">
                Free forever plan. No credit card required.
              </p>
            </div>
          </div>

          {/* The build demo, swapped in from /ai-app-builder. Its two cards
              are this page's two claims side by side — describe the work only
              your firm does, and watch it land live for the team and the
              client — which is the half of the headline the carousel of
              finished screens was not showing. */}
          <BuilderHeroVisual />
          {/* Credibility right under the product shot, before the argument
              starts. Section 2 of the handoff: the figures and the roster are
              one claim, so the band and the logo row are one component.

              The four figures are the homepage stats band's, which is what
              the handoff specifies. NOTE: /customers states "1M+ clients"
              against this band's "250K+". The handoff flags the conflict for
              Vivienne and is explicit that this page must not introduce a
              third figure, so it carries the homepage's until that is
              settled. */}
          <PortalSocialProof
            heading="Trusted by 1,250+ professional service firms"
            body="Agencies, accountants, and consultants run their client relationships on Assembly."
            stats={[
              "1,250+ businesses powered",
              "10,000+ apps created",
              "250K+ clients managed",
              "$100M+ payments processed",
            ]}
            link={{ label: "See customer stories", href: "/customers" }}
          />
        </div>
      </section>

      <div className="relative">
        <GridRails />
        <GridDivider fullBleed />

        {/* Section 3. The quote carries the problem now — the handoff
            removed this section's bullets, so the two captions above the tray
            are gone with them and the jump link points at section 5, which
            is where the page answers it. */}
        <PortalProblem
          body="Stop bending your workflow to fit someone else's product."
          quote={{
            text: "It felt like bolted-on software, an afterthought.",
            attribution:
              "Eliana Emery, Managing Attorney, Heritage Law Partners, on the portals built into legal practice management software",
            href: "/customers/heritage-law-partners",
          }}
          link={{
            label: "See how firms build their own",
            href: "#customizations",
          }}
        />
        <GridDivider />

        {/* Section 4, and the page's centre of gravity. It absorbs what the
            template rail used to say here: the handoff carries "30+ ready-made
            app templates" and the Browse templates link as this section's
            second support line rather than as a section of its own. */}
        <PortalJourney />
        <GridDivider />

        {/* Section 5, and the target of the jump link above.

            THREE SECTIONS CAME OFF THE PAGE HERE, all absorbed into this one
            and the one above, per the handoff's "argument, in order":

            - PortalReadyMade (the template rail) — now section 4's second
              support line and its Browse templates link.
            - PortalBuild (Describe / Plan / Build) — the handoff puts the
              build mechanics on /ai-app-builder and keeps one sentence of
              them in this section's second card.
            - PortalTailor (the segment grid) — its per-client point is this
              section's support line, and the handoff lists the segment
              example tiles as out of scope outright.

            All three components are still used by the two /solutions/* pages
            and were left alone. */}
        <PortalCustomizations id="customizations" />
        <GridDivider />

        {/* Section 6. */}
        <PortalFrictionless />
        <GridDivider />

        {/* Section 7. The handoff sets "Every app connects to the same
            client records" as a support line of its own; it reads as an
            orphan under the three rows, so it stays in the lead paragraph
            where this page already had it. */}
        <PortalStack />

        <PortalTrust />
        <GridDivider />
      </div>

      <div className="relative">
        <GridRails />
        {/* The same quotes row /ai-app-builder runs, rather than this page's
            own proof band. One component, two pages.

            THE QUOTES ARE ALL POSITIVE, and that is load-bearing. Handoff v2's
            section 9 sets two before-state lines (Capital One on spreadsheets,
            Sargent on a portal that "feels very corporate") as small cards
            under a featured story, where the lead frames them as what those
            firms left behind. This row has no lead — four equal cards, each
            read on its own — so the same lines would read as complaints about
            Assembly, which is the fault the quotes component's own notes
            record and avoid.

            Sargent is not here for a second reason: it has no portrait in
            /public/images/customers, and its quote is already on this page in
            the customizations section, where it is making a point this row
            would only repeat. */}
        <BuilderCustomerQuotes
          heading="Firms that stopped settling"
          body="See how firms replaced rigid tools with a portal they built around their own workflow."
          quotes={[
            {
              quote:
                "It let us flexibly build our own version of a client portal, uniting elements of their technology with existing external core applications.",
              name: "Kyle Pearson",
              firm: "Collective CPA",
              image: "/images/customers/collective-cpa.jpg",
              href: "/customers/collective-cpa",
            },
            {
              quote:
                "Every client said this was such an easy onboarding experience. The first step of working together feels effortless, and that creates a powerful first impression.",
              name: "Leah McCool",
              firm: "Orca Accounting",
              image: "/images/customers/orca-accounting.jpg",
              href: "/customers/orca-accounting",
            },
            {
              quote:
                "Our portal really improves our client satisfaction with our firm and definitely saves time. Having everything in one spot is huge.",
              name: "Eliana Emery",
              firm: "Heritage Law Partners",
              image: "/images/customers/heritage-law-partners.jpg",
              href: "/customers/heritage-law-partners",
            },
            {
              quote:
                "What excites me is how our partner data collected in Assembly flows directly into our internal quality control processes.",
              name: "Phillip LaRue",
              firm: "Capital One",
              image: "/images/customers/capital-one-hero.jpg",
              href: "/customers/capital-one-luxury-travel",
            },
          ]}
        />
        <GridDivider />
        <PortalPricing />
        <GridDivider />
      </div>

      <div className="relative pb-10 md:pb-16">
        <GridRails />
        {/* Divided with dotted rules, as on the AI app builder page — and the
            same treatment the stack accordion further up this page already
            uses, so the two lists on one page read as one control. No short
            forms needed: every question here already sets on one line. */}
        <FAQ
          heading="Client portal questions, answered"
          items={PORTAL_FAQS}
          variant="divided"
          dottedRules
        />
      </div>

      <div className="border-t border-border [[data-theme=dark]_&]:border-[#383838]" />

      <CTA
        heading={
          <>
            Build the client portal
            <br />
            only your firm could
          </>
        }
        // The chips are off, but the point they made is back as the
        // handoff's one-line body: v2 closes on "Free forever plan. No credit
        // card required.", the same line the hero opens on.
        planChips={false}
        subheading="Free forever plan. No credit card required."
        // TWO BUTTONS, not a second prompt box. This page opens on a composer
        // in its hero, and a page that both opens and closes on the same
        // control asks the visitor the same question twice — the second time
        // after they have read the whole argument, which is the moment to give
        // them a door rather than a blank field. The two vertical pages and
        // the builder page already close this way, so the set agrees.
        //
        // promptPicker goes with it: there is no composer left for an Ideas
        // menu to sit on.
        composer={false}
        primaryCta={{ label: "Get started", href: SIGNUP_URL }}
        secondaryCta={{ label: "Book a demo", href: DEMO_URL }}
      />
    </>
  );
}
