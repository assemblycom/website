import type { Metadata } from "next";
import type { ReactNode } from "react";
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
 * Paid-only landing page for the Google Ads "Portal" ad groups (US/CA, UK and
 * AU; exact, phrase and broad). Each keyword's final URL carries `?kw=` so the
 * headline, the section that follows the logos and the first FAQ answer all
 * restate what that search was for. The themes, and the keywords that point at
 * each (from the live ad groups, Nov 2026):
 *
 *   (none)      client portal(s), client portal software, best client portal
 *               software, portal software, online portal, web portal, simple
 *               client portal, easy client portal
 *   customer    customer portal(s), customer portal software, best customer
 *               portal software, small business customer portal, self service
 *               portal, customer onboarding portal
 *   build       client portal builder, create a portal, create your own client
 *               portal, custom client portal, customizable client portal,
 *               customized portal
 *   whitelabel  white label client portal, branded portal, branded customer
 *               portal
 *   documents   online document portal, document upload portal, customer file
 *               sharing portal
 *   secure      secure client portal, hipaa client portal
 *
 * `best` and `builder` are kept as aliases for the first URLs handed out.
 * Anything else falls back to the default.
 *
 * NOT INDEXED: noindex here AND listed in EXCLUDED in src/lib/sitemap-data.ts.
 * Do not block /lp in robots.ts: AdsBot has to crawl the page to rate it, and
 * Google has to read the noindex to honour it.
 */
export const metadata: Metadata = {
  ...pageMetadata(PAGE_SEO.lpPortal),
  robots: { index: false, follow: false },
};

type Theme =
  | "default"
  | "customer"
  | "build"
  | "whitelabel"
  | "documents"
  | "secure";

type Lead = "tour" | "brand" | "builder" | "trust";

interface ThemeCopy {
  hero: LpHeroMessage;
  /** The section set straight under the logos. */
  lead: Lead;
  /** The FAQ question to open the list with. */
  faq: string;
}

const THEMES: Record<Theme, ThemeCopy> = {
  default: {
    hero: {
      h1: "A client portal you can set up today",
      lines: ["A client portal", "you can set up today"],
      iconAfter: "portal",
      iconPair: true,
      body: "Messages, files, forms, contracts, and invoices in one place under your brand. Clients sign in with a link and see only their own work. Need a project tracker too? Describe it and Assembly builds it in.",
    },
    lead: "tour",
    faq: "What is a client portal?",
  },
  customer: {
    hero: {
      h1: "A customer portal with your name on it",
      lines: ["A customer portal", "with your name on it"],
      iconAfter: "portal",
      iconPair: true,
      body: "Give every customer one place to message you, send files, sign, and pay. They sign in with a link, no password to forget, and see only their own account.",
    },
    lead: "tour",
    faq: "What is a client portal?",
  },
  build: {
    hero: {
      h1: "Build your own client portal",
      lines: ["Build your own", "client portal"],
      iconAfter: "Build",
      iconPair: true,
      body: "Start with messaging, files, forms, and billing. Then describe what else your firm needs, like an intake form or a project tracker. Assembly shows you the plan and builds it in.",
    },
    lead: "builder",
    faq: "How do I build my own client portal?",
  },
  whitelabel: {
    hero: {
      h1: "A white-label client portal under your brand",
      lines: ["A white-label client portal", "under your brand"],
      iconAfter: "portal",
      iconPair: true,
      body: "Your logo and colors on every plan. From Professional up, clients sign in on your own domain with no Assembly badge.",
    },
    lead: "brand",
    faq: "Can I white-label the client portal?",
  },
  documents: {
    hero: {
      h1: "Collect client documents without the chasing",
      lines: ["Collect client documents", "without the chasing"],
      iconAfter: "documents",
      iconPair: true,
      body: "Send a checklist, clients upload to one secure portal, and reminders go out on their own. Messages, contracts, and invoices sit right next to the files.",
    },
    lead: "tour",
    faq: "Can clients upload documents to the portal?",
  },
  secure: {
    hero: {
      h1: "A secure client portal for sensitive work",
      lines: ["A secure client portal", "for sensitive work"],
      iconAfter: "portal",
      iconPair: true,
      body: "SOC 2 Type II certified, encrypted in transit and at rest, with MFA on every plan. Each client sees only their own files. HIPAA with a BAA on Advanced.",
    },
    lead: "trust",
    faq: "Is my client portal secure?",
  },
};

const ALIASES: Record<string, Theme> = {
  customer: "customer",
  best: "customer",
  build: "build",
  builder: "build",
  whitelabel: "whitelabel",
  documents: "documents",
  secure: "secure",
};

function themeFor(kw: string | string[] | undefined): Theme {
  const key = (Array.isArray(kw) ? kw[0] : kw)?.toLowerCase();
  // Own keys only: `in` also matches inherited names, so ?kw=constructor
  // would hand back a function and break the page.
  return key && Object.hasOwn(ALIASES, key) ? ALIASES[key] : "default";
}

const HERO_NOTE = "Free forever plan. No credit card required.";

/**
 * Answers built from the /client-portal FAQ, which is already fact-checked.
 * No links in the answers: on a paid page every link is a way off the one
 * action the page is for. The theme's own question is moved to the top.
 */
const FAQS: FAQEntry[] = [
  {
    question: "What is a client portal?",
    answer:
      "One secure, branded place where clients message you, share files, sign contracts, and pay invoices. Assembly gives you all of that on day one, plus a CRM for your team and an AI builder for anything else your firm needs.",
  },
  {
    question: "Can I white-label the client portal?",
    answer:
      "Yes. Your logo and colors are on every plan. On Professional and up, clients sign in on your own domain with the Assembly badge removed, and every new app picks up your brand.",
  },
  {
    question: "How do I build my own client portal?",
    answer:
      "Sign up, add your logo, and invite a client. Messaging, files, forms, contracts, and billing are ready to go. For anything else, describe it: Assembly asks a few questions, shows you the plan, and builds it in once you approve. No code.",
  },
  {
    question: "Can clients upload documents to the portal?",
    answer:
      "Yes. Send a document checklist and clients upload straight to it. Automatic reminders follow up on anything missing, and each client only ever sees their own files.",
  },
  {
    question: "Is my client portal secure?",
    answer:
      "Yes. Assembly is SOC 2 Type II certified and supports HIPAA, GDPR, and CCPA. Data is encrypted in transit and at rest, each client sees only their own data, and MFA is on every plan.",
  },
  {
    question: "Does Assembly offer a HIPAA-compliant client portal?",
    answer:
      "Yes, with a BAA on the Advanced plan. Ready-made apps that do not use AI can handle PHI. Apps built with the AI app builder are not covered.",
  },
  {
    question: "What does the client portal cost?",
    answer:
      "There is a free forever plan with the CRM, the client portal, the app builder, and up to 3 apps. Paid plans add more clients, more apps, and your own domain. No credit card needed to start.",
  },
  {
    question: "What is the client portal not good for?",
    answer:
      "Public marketing websites. Assembly is for your team and your signed-in clients. Build a public site elsewhere and link to it from inside your portal.",
  },
];

function faqsFor(first: string): FAQEntry[] {
  const lead = FAQS.find((f) => f.question === first);
  return lead ? [lead, ...FAQS.filter((f) => f !== lead)] : FAQS;
}

export default async function LpPortalPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { kw } = await searchParams;
  const theme = THEMES[themeFor(kw)];

  // Four sections that every variant shows. The theme picks which one sits
  // straight under the logos; the rest keep this order, so variants differ
  // only in what comes first.
  const sections: Record<Lead, ReactNode> = {
    tour: (
      <div className="section-follow">
        <Reveal variant="fade">
          <ProductionGap
            eyebrow="Client portal + CRM"
            heading="One branded place for every client"
            body="Messages, files, forms, contracts, and invoices for your clients. A CRM for your team. 30+ ready-made apps, and an AI builder for anything else."
          />
        </Reveal>
      </div>
    ),
    brand: (
      <PortalCustomizations
        id="customizations"
        heading="Make it look like your firm built it"
        body="Your logo and colors on every plan. Your own domain and no Assembly badge from Professional up. Every app you add picks up your brand."
      />
    ),
    builder: (
      <Reveal variant="fade">
        <HowItWorks
          eyebrow="Client portal builder"
          heading="Need something custom? Describe it."
          body="Describe a project tracker, an intake form, or an approval flow. Assembly asks a few questions, shows you the plan, and publishes it in your portal once you approve."
        />
      </Reveal>
    ),
    trust: <PortalTrust />,
  };
  const order: Lead[] = [
    theme.lead,
    ...(["tour", "brand", "builder", "trust"] as Lead[]).filter(
      (s) => s !== theme.lead,
    ),
  ];
  // Templates sit after the builder walkthrough on every variant.
  const withTemplates = order.flatMap((s) =>
    s === "builder" ? [s, "templates" as const] : [s],
  );

  return (
    <>
      <LpHero message={theme.hero} note={HERO_NOTE} />

      {/* Logos straight under the fold, as on /client-portal. */}
      <div className="mx-auto max-w-[1400px] px-6 pb-8 md:px-10">
        <PortalSocialProof />
      </div>

      <div className="relative">
        <GridRails />
        <GridDivider fullBleed />
        {withTemplates.map((s) => (
          <div key={s}>
            {s === "templates" ? (
              <PortalReadyMade body="30+ ready-made apps, from onboarding wizards to document collectors. Install one as is, or tell the builder what to change." />
            ) : (
              sections[s]
            )}
            <GridDivider />
          </div>
        ))}
      </div>

      <div className="relative">
        <GridRails />
        <BuilderCustomerQuotes
          heading="Firms that stopped settling"
          body="How firms gave their clients one place to work with them."
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
          items={faqsFor(theme.faq)}
          variant="divided"
          dottedRules
          justifyAnswers
        />
      </div>

      <div className="border-t border-border [[data-theme=dark]_&]:border-[#383838]" />

      <CTA
        heading={
          <>
            Give clients one place
            <br />
            to work with you
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
