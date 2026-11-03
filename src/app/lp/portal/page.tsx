import type { Metadata } from "next";
import { CTA } from "@/components/home/cta";
import { FAQ, type FAQEntry } from "@/components/home/faq";
import { HowItWorks } from "@/components/home/how-it-works";
import { ProductionGap } from "@/components/home/production-gap";
import { GridDivider, GridRails } from "@/components/ui/grid-lines";
import { Reveal } from "@/components/ui/reveal";
import { PortalSocialProof } from "@/components/client-portal/portal-social-proof";
import { PortalCustomizations } from "@/components/client-portal/portal-customizations";
import { PortalReadyMade } from "@/components/client-portal/portal-ready-made";
import { PortalTrust } from "@/components/client-portal/portal-trust";
import { PortalPricing } from "@/components/client-portal/portal-pricing";
import { BuilderCustomerQuotes } from "@/components/ai-app-builder/builder-customer-quotes";
import { LpHero, type LpHeroMessage } from "@/components/lp/lp-hero";
import { DEMO_URL, SIGNUP_URL } from "@/lib/constants";
import { PAGE_SEO, pageMetadata } from "@/lib/seo";

/**
 * Paid-only landing page for Google Ads on the client portal keywords.
 *
 * The homepage's shell (big-type hero, platform tour, builder walkthrough)
 * with the client portal page's proof (logos, white-label, templates, quotes,
 * security, pricing), written for three ad themes. Each ad group's final URL
 * carries `?kw=` so the headline restates what that ad promised:
 *
 *   ?kw=best        "best customer portal software"
 *   ?kw=whitelabel  "white label client portal"
 *   ?kw=builder     "client portal builder"
 *
 * No param, or one this map does not know, gets the default, which is written
 * to cover all three.
 *
 * NOT INDEXED: noindex here AND listed in EXCLUDED in src/lib/sitemap-data.ts.
 * Do not block /lp in robots.ts: AdsBot has to crawl the page to rate it, and
 * Google has to read the noindex to honour it.
 */
export const metadata: Metadata = {
  ...pageMetadata(PAGE_SEO.lpPortal),
  robots: { index: false, follow: false },
};

const HERO: Record<"default" | "best" | "whitelabel" | "builder", LpHeroMessage> = {
  default: {
    h1: "Client portal software you can build on",
    lines: ["Client portal software", "you can build on"],
    iconAfter: "software",
    iconPair: true,
    body: "Give clients one branded portal to message you, share files, sign, and pay. Start with 30+ ready-made apps, then use AI to build what's missing.",
  },
  best: {
    h1: "Client portal software clients actually use",
    lines: ["Client portal software", "clients actually use"],
    iconAfter: "software",
    iconPair: true,
    body: "One branded place for clients to message, share files, sign, and pay, with a CRM behind it for your team. Start with 30+ ready-made apps, then use AI to build the rest.",
  },
  whitelabel: {
    h1: "White-label client portal that looks like yours",
    lines: ["White-label client portal", "that looks like yours"],
    iconAfter: "portal",
    iconPair: true,
    body: "Your logo and colors on every plan. From Professional up, clients sign in on your own domain with no Assembly badge. Messaging, files, contracts, and billing included.",
  },
  builder: {
    h1: "Build your client portal with AI",
    lines: ["Build your", "client portal with AI"],
    iconAfter: "Build",
    iconPair: true,
    body: "Describe what you need. Assembly plans it, builds it, and ships a working app into your branded portal with logins and permissions handled.",
  },
};

const HERO_NOTE =
  "Free forever plan. No credit card required. Built for firms that serve clients.";

type Theme = keyof typeof HERO;

function themeFor(kw: string | string[] | undefined): Theme {
  const key = (Array.isArray(kw) ? kw[0] : kw)?.toLowerCase();
  // Own keys only: `in` also matches inherited names, so ?kw=constructor
  // would hand back a function and break the page.
  return key && Object.hasOwn(HERO, key) ? (key as Theme) : "default";
}

/**
 * The first question keeps the searcher's own words ("customer portal") on
 * purpose, once: the house term is "client portal", and the hero uses it, but
 * a question is matched to the query it answers.
 *
 * Six, answering the three ad themes first, then cost, safety and fit. No
 * links in the answers: on a paid page every link is a way off the one action
 * the page is for, and the sections above already carry the detail.
 */
const FAQS: FAQEntry[] = [
  {
    question: "What is the best customer portal software for service firms?",
    answer:
      "The one clients actually log in to and your firm never outgrows. Assembly pairs 30+ ready-made apps for messaging, files, contracts, and billing with an AI app builder: the essentials on day one, custom apps when you need them.",
  },
  {
    question: "Can I white-label the client portal?",
    answer:
      "Yes. Your logo and colors are on every plan. On Professional and up, clients sign in on your own domain with the Assembly badge removed, and every new app inherits your brand.",
  },
  {
    question: "How do I build a client portal without code?",
    answer:
      "Describe the app you want. Assembly shows a plan to approve or edit, then ships a working app into your portal with logins, permissions, and branding handled. Or start from one of 30+ templates and tell the builder what to change.",
  },
  {
    question: "What does the client portal cost?",
    answer:
      "There is a free forever plan with the CRM, the client portal, the app builder, and real, publishable apps. Paid plans add more clients, more apps, and your own domain. No credit card needed to start.",
  },
  {
    question: "Is my client portal secure?",
    answer:
      "Yes. Assembly is SOC 2 Type II certified and supports HIPAA, GDPR, and CCPA. Data is encrypted in transit and at rest, each client sees only their own data, and MFA is on every plan.",
  },
  {
    question: "What is the client portal not good for?",
    answer:
      "Public marketing websites. Assembly builds experiences for your team and your signed-in clients. Build a public site elsewhere and link to it from inside your portal.",
  },
];

export default async function LpPortalPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { kw } = await searchParams;
  const theme = themeFor(kw);
  const hero = HERO[theme];
  // The white-label ad group reorders the page as well as the headline: the
  // branding section moves up to sit straight under the logos, ahead of the
  // platform tour, and its FAQ answer leads. Everything else keeps the order
  // below, so the variants differ only in what comes first.
  const whiteLabelFirst = theme === "whitelabel";
  const faqs = whiteLabelFirst
    ? [FAQS[1], FAQS[0], ...FAQS.slice(2)]
    : FAQS;

  const tour = (
    <div className="section-follow">
      <Reveal variant="fade">
        <ProductionGap
          eyebrow="Client portal + CRM"
          heading="Everything your clients need, in one portal"
          body="A branded portal for clients, a CRM for your team, 30+ ready-made apps, and an AI builder for everything else."
        />
      </Reveal>
    </div>
  );
  const customizations = (
    <PortalCustomizations
      id="customizations"
      heading="White-label every detail, down to the apps"
      body="Your logo and colors on every plan, your own domain from Professional up, and apps shaped to how your firm works. Every new app inherits your brand."
    />
  );

  return (
    <>
      <LpHero message={hero} note={HERO_NOTE} />

      {/* Logos straight under the fold, as on /client-portal. */}
      <div className="mx-auto max-w-[1400px] px-6 pb-8 md:px-10">
        <PortalSocialProof />
      </div>

      <div className="relative">
        <GridRails />
        <GridDivider fullBleed />

        {whiteLabelFirst ? customizations : tour}
        <GridDivider />

        {whiteLabelFirst ? tour : customizations}
        <GridDivider />

        <Reveal variant="fade">
          <HowItWorks
            eyebrow="Client portal builder"
            heading="Build portal apps in four steps"
            body="Describe what you want, approve the plan, and publish. No code. The app goes live in your portal with sign-in, permissions, and branding already handled."
          />
        </Reveal>
        <GridDivider />

        <PortalReadyMade body="30+ ready-made app templates. Every one is a working app: install it, use it as is, or tell the builder what to change." />
        <GridDivider />

        <PortalTrust />
        <GridDivider />
      </div>

      <div className="relative">
        <GridRails />
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
              firm: "Heritage Law",
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
        <FAQ
          heading="Client portal questions, answered"
          items={faqs}
          variant="divided"
          dottedRules
          justifyAnswers
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
        planChips={false}
        subheading="Free forever plan. No credit card required."
        composer={false}
        primaryCta={{ label: "Get started", href: SIGNUP_URL }}
        secondaryCta={{ label: "Book a demo", href: DEMO_URL }}
      />
    </>
  );
}
