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
 * AU; exact, phrase and broad). Every ad group uses one final URL,
 * `/lp/portal?kw={keyword}`: Google fills in the matched keyword, and the page
 * sorts it into a group by the words it contains. ONLY THE H1 CHANGES. The
 * subhead, the sections, their order and the FAQ are the same for everyone.
 *
 * Groups, checked in order (first match wins), with the live keywords each
 * one catches (Nov 2026):
 *
 *   whitelabel  "white label", "branded": white label client portal, branded
 *               portal, branded customer portal
 *   build       "build", "create", "custom*" (not "customer"): client portal
 *               builder, create a portal, create your own client portal,
 *               custom / customizable client portal, customized portal
 *   documents   "document", "file", "upload": online document portal, document
 *               upload portal, customer file sharing portal
 *   secure      "secure", "security", "hipaa": secure client portal, hipaa
 *               client portal
 *   customer    "customer", "self service", "user": customer portal(s),
 *               customer portal software, best customer portal software, small
 *               business customer portal, customer onboarding portal, self
 *               service portal
 *   default     everything else: client portal(s), client portal software, best
 *               client portal software, portal software, online / web portal,
 *               simple / easy client portal
 *
 * The first URLs used group names (`?kw=whitelabel`, `builder`, `best`); those
 * still resolve, through the same patterns plus one alias for `best`.
 *
 * NOT INDEXED: noindex here AND listed in EXCLUDED in src/lib/sitemap-data.ts.
 * Do not block /lp in robots.ts: AdsBot has to crawl the page to rate it, and
 * Google has to read the noindex to honour it.
 */
export const metadata: Metadata = {
  ...pageMetadata(PAGE_SEO.lpPortal),
  robots: { index: false, follow: false },
};

type Group =
  | "default"
  | "customer"
  | "build"
  | "whitelabel"
  | "documents"
  | "secure";

// "Customer portal" breaks the house noun rule on purpose: J's call is that
// on paid LPs the searcher's own words win.
const HEADLINES: Record<Group, Omit<LpHeroMessage, "body">> = {
  default: {
    h1: "The client portal that grows with your firm",
    lines: ["The client portal that", "grows with your firm"],
    iconAfter: "portal",
    iconPair: true,
  },
  customer: {
    h1: "A customer portal with your name on it",
    lines: ["A customer portal", "with your name on it"],
    iconAfter: "portal",
    iconPair: true,
  },
  build: {
    h1: "Build your own client portal",
    lines: ["Build your own", "client portal"],
    iconAfter: "Build",
    iconPair: true,
  },
  whitelabel: {
    h1: "A white-label client portal for your firm",
    lines: ["A white-label client portal", "for your firm"],
    iconAfter: "portal",
    iconPair: true,
  },
  documents: {
    h1: "Collect client documents without the chasing",
    lines: ["Collect client documents", "without the chasing"],
    iconAfter: "documents",
    iconPair: true,
  },
  secure: {
    h1: "A secure client portal for sensitive work",
    lines: ["A secure client portal", "for sensitive work"],
    iconAfter: "portal",
    iconPair: true,
  },
};

/**
 * Checked in order; the first match wins. More specific intent comes first,
 * so "branded customer portal" is white label and "customer file sharing
 * portal" is documents. `custom` is matched as its own word stem (custom,
 * customizable, customized) so "customer" never lands in build.
 */
const GROUPS: { group: Group; pattern: RegExp }[] = [
  { group: "whitelabel", pattern: /white ?label|branded/ },
  { group: "build", pattern: /build|create|\bcustom(?!er)/ },
  { group: "documents", pattern: /document|file|upload/ },
  { group: "secure", pattern: /secur|hipaa/ },
  { group: "customer", pattern: /customer|self ?service|\buser|^best$/ },
];

function groupFor(kw: string | string[] | undefined): Group {
  const raw = Array.isArray(kw) ? kw[0] : kw;
  if (!raw) return "default";
  const text = raw.toLowerCase().replace(/[+_-]+/g, " ").trim();
  return GROUPS.find((g) => g.pattern.test(text))?.group ?? "default";
}

// Every visitor reads the same subhead: only the headline follows the keyword.
const HERO_BODY =
  "Assembly gives accountants, agencies, consultants, and law firms a branded client portal with a built-in CRM. Messages, files, contracts, and invoices are ready on day one. Need something else, like a project tracker? Describe it and Assembly builds it.";

const HERO_NOTE =
  "Start free. The free plan never expires. No credit card required.";

/**
 * Answers built from the /client-portal FAQ, which is already fact-checked.
 * No links in the answers: on a paid page every link is a way off the one
 * action the page is for. The order is the same for every visitor.
 */
const FAQS: FAQEntry[] = [
  {
    question: "What is Assembly?",
    answer:
      "Assembly is a client portal and CRM for service firms like accountants, agencies, consultants, and law firms. Clients get one branded place to message you, share files, sign, and pay. When you need more, Assembly's AI app builder adds custom apps to the same portal.",
  },
  {
    question: "What is the best customer portal software?",
    answer:
      "The one your customers actually use. Assembly gives each one a branded place to message you, share files, sign, and pay, with a CRM for your team and 30+ ready-made apps. Need something else? Describe it and Assembly builds it.",
  },
  {
    question: "Do my clients need to download anything?",
    answer:
      "No. Clients sign in from their browser with Google or a secure one-click email link, and each client sees only what you allow.",
  },
  {
    question: "Can I white-label the client portal?",
    answer:
      "Yes. Your logo and colors are on every plan. On Professional and up, clients sign in on your own domain with the Assembly badge removed, and every new app picks up your brand.",
  },
  {
    question: "How do I build my own client portal?",
    answer:
      "Sign up, add your logo, and invite a client. Messaging, files, forms, contracts, and billing are ready to go. For anything else, describe it: Assembly asks a few questions, shows you the plan, and builds it once you approve. No code.",
  },
  {
    question: "Can clients upload documents to the portal?",
    answer:
      "Yes. Send a document checklist and clients upload straight to it. Automatic reminders follow up on overdue requests, and each client only ever sees their own files.",
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
      "There is a free plan that never expires, with the CRM, the client portal, the AI app builder, and up to 3 apps. Paid plans add more clients, more apps, and your own domain. No credit card needed to start.",
  },
  {
    question: "What is the client portal not good for?",
    answer:
      "Public marketing websites. Assembly is for your team and your signed-in clients. Build a public site elsewhere and link to it from inside your portal.",
  },
];

export default async function LpPortalPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { kw } = await searchParams;
  const hero: LpHeroMessage = { ...HEADLINES[groupFor(kw)], body: HERO_BODY };

  // The same sections in the same order for every visitor.
  const sections: Record<"tour" | "brand" | "builder" | "trust", ReactNode> = {
    tour: (
      <div className="section-follow">
        <Reveal variant="fade">
          <ProductionGap
            eyebrow="Client portal + CRM"
            heading="One branded place for every client"
            body="Clients get one place to message you, share files, sign contracts, and pay invoices. Your team gets a built-in CRM behind it. Add any of 30+ ready-made apps, or build your own with Assembly's AI app builder."
          />
        </Reveal>
      </div>
    ),
    brand: (
      <PortalCustomizations
        id="customizations"
        heading="Your clients see your brand, not ours"
        body="Your logo and colors on every plan, and every new app picks them up automatically. Your own domain and no Assembly badge from Professional up."
      />
    ),
    builder: (
      <Reveal variant="fade">
        <HowItWorks
          eyebrow="Client portal builder"
          heading="Need something custom? Describe it."
          body="Describe a project tracker, an intake form, or an approval flow. Assembly asks a few questions and shows you a one-page plan. Once you approve, it builds the app, hidden from clients until you make it visible."
        />
      </Reveal>
    ),
    trust: (
      <PortalTrust
        heading="Each client sees only what you allow"
        body="SOC 2 Type II certified, encrypted in transit and at rest, with MFA on every plan. Sign-in and permissions are built and maintained by Assembly, not generated for each app."
      />
    ),
  };
  const order = ["tour", "brand", "builder", "templates", "trust"] as const;

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
        {order.map((s) => (
          <div key={s}>
            {s === "templates" ? (
              <PortalReadyMade
                heading="Start with 30+ ready-made apps"
                body="Onboarding wizards, document collectors, project trackers, and more. Each one is a working app: install it, use it as is, or describe what to change."
              />
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
          heading="How firms run client work on Assembly"
          body="Accounting, legal, and travel teams that gave clients one place to work with them."
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
        <PortalPricing
          heading="Start free. The free plan never expires."
          body="The free plan includes the CRM, the client portal, the AI app builder, and 3 apps, and can publish real apps your clients use. Paid plans add more clients, more apps, and your own domain. Monthly prices shown are billed annually."
        />
        <GridDivider />
      </div>

      <div className="relative pb-10 md:pb-16">
        <GridRails />
        <FAQ
          heading="Questions about Assembly's client portal"
          items={FAQS}
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
        subheading="Start free. The free plan never expires."
        composer={false}
        primaryCta={{ label: "Get started", href: SIGNUP_URL }}
        secondaryCta={{ label: "Book a demo", href: DEMO_URL }}
      />
    </>
  );
}
