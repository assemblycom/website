import type { Metadata } from "next";
import { VsComparisonPage, type VsPage } from "@/components/comparison/vs-page";
import {
  BrandPillarVisual,
  ClientExperiencePillarVisual,
  FullExperienceVisual,
  PlanVisual,
} from "@/components/comparison/product-visuals";
import {
  CreditsVisual,
  GrowthToolingVisual,
  HostedMvpVisual,
  PlatformLayerVisual,
  PublicStoreVisual,
} from "@/components/comparison/story-visuals";
import { BrandedLoginHeroVisual } from "@/components/comparison/branded-login-hero-visual";
import { PAGE_SEO, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(PAGE_SEO.vsBase44);

/**
 * For the visitor who shipped a fast hosted app and then noticed a platform's
 * logo on their own client's login screen. The wedge is the first screen, so it
 * leads.
 *
 * Two things this page must not outrun. Base44's login-splash branding gap is
 * documented on Base44's own feedback board and is current, not permanent, so
 * it is re-verified before every refresh. And Base44's SOC 2 Type II and ISO
 * 27001 are stated on its own security page, so they are treated as fact here,
 * not as claims.
 */
const PAGE: VsPage = {
  competitor: "Base44",
  hero: {
    h1: "The client-ready alternative to Base44",
    sub: "Base44 ships a fast hosted app. Assembly ships apps into a client experience branded as yours, ready for team and clients.",
    visual: {
      label: "Hero shot",
      description:
        "Split frame. The wedge beat is a branded login screen. Left: a generic hosted-app login carrying a small neutral platform-logo placeholder in the splash position — a placeholder, never Base44's actual mark. Right: the Assembly client sign-in fully carrying the customer's logo, accent colour and custom domain in the address bar, with no Assembly badge. Caption cue between them: First screen your client sees.",
    },
  },
  glance: {
    heading: "Two ways to ship an app. One is meant for clients.",
    sub: "Base44 is fast and all-in-one. Here is what changes when clients are involved.",
    rows: [
      {
        label: "Best for",
        assembly: "Firms whose clients log in",
        competitor: "Founders shipping an MVP",
      },
      {
        label: "Branding on login",
        assembly: "Yours; no badge on Professional",
        competitor: "Base44 logo, even on your domain",
      },
      {
        label: "Client experience",
        assembly: "Branded, included",
        competitor: "You assemble it",
      },
      {
        label: "Client data",
        assembly: "One shared CRM",
        competitor: "Empty database per app",
      },
      {
        label: "Team and client split",
        assembly: "Held by the platform",
        competitor: "You configure roles",
      },
      {
        label: "Pricing model",
        assembly: "Build credits only",
        competitor: "Two types, no rollover",
      },
      {
        label: "Your data",
        assembly: "Yours; never trains AI",
        competitor: "Frontend code only",
      },
      {
        label: "Beyond the app",
        assembly: "CRM, billing, messaging, files",
        competitor: "Added separately",
      },
      {
        label: "Compliance",
        assembly: "SOC 2 Type II; HIPAA on Advanced",
        competitor: "SOC 2 Type II, ISO 27001",
      },
    ],
  },
  pillarsHeading: "Why teams choose Assembly over Base44",
  pillars: [
    {
      heading: "Your brand, from the very first screen",
      tabLabel: "Your brand",
      body: "Full white-labeling on the Professional plan — a top-three reason customers choose Assembly, raised in 27% of 2,926 sales calls.",
      // EDITORIAL, not rendered: "The Base44 login-splash claim is current as of
      // September 2026 and sourced to Base44's own feedback board. Base44
      // shipped platform-wide custom login pages in June 2026 and could close
      // the gap, so re-verify before every refresh of this page."
      visual: {
        art: <BrandPillarVisual />,
        wide: true,
        label: "Pillar 1 visual",
        description:
          "Split composition. Left: a login screen with a neutral platform-logo placeholder in the splash position. Right: the Assembly client sign-in carrying the customer's logo and colours, on a custom domain, no badge. Beneath, the 27% of sales calls figure as a pull stat.",
      },
    },
    {
      heading: "A real client experience, included",
      tabLabel: "Client experience",
      body: "Base44 builds the app; you assemble the experience. Assembly's comes branded, each client seeing only their own view.",
      visual: {
        art: <ClientExperiencePillarVisual />,
        wide: true,
        label: "Pillar 2 visual",
        description:
          "The branded client experience with a left sidebar listing the native apps (Messaging, Files, Contracts, Billing) alongside two custom-built ones, all under the customer's brand. A smaller second frame shows the same workspace from the team side. Labels: Your clients, Your team.",
      },
    },
    {
      heading: "One credit meter, not two",
      tabLabel: "Credits",
      body: "Base44 meters building and usage separately, neither rolling over. Assembly's roll over a month, and a live app is $5.",
      // EDITORIAL, not rendered: "Confirm the exact figures against the live
      // pricing page before publish: paid plans include 200 build credits a
      // month and Free includes 50, unused credits roll over one additional
      // month, extra credits are $0.60 each, extra apps are $5 a month. The
      // rollover policy changed recently."
      visual: {
        art: <CreditsVisual />,
        label: "Pillar 3 visual",
        description:
          "Two credit meters on the left labelled message credits and integration credits, both draining. One meter on the right labelled build credits, with a stable, full live apps bar beside it. Simple and diagrammatic.",
      },
    },
  ],
  deepDivesHeading: "What you don't have to build",
  deepDives: [
    {
      heading: "Built for clients, not just builders",
      body: "Team tools land in your dashboard, client apps in your branded experience.",
      visual: {
        art: <PlanVisual />,
        label: "Deep dive, the plan",
        description:
          "The chat build panel with a readable Plan card covering what it builds, what data it uses and who sees it, with Approve and Edit. Then the same app shown on the team side and inside the branded client experience.",
      },
    },
    {
      heading: "The stack Base44 makes you build is already assembled",
      body: "A built-in CRM, a client login and ready-made business apps.",
      visual: {
        art: <FullExperienceVisual orbit />,
        label: "Deep dive, the platform",
        description:
          "The Assembly workspace sidebar showing built apps alongside the native ones, with one branded client experience wrapping them. A thin strip beneath shows integration logos flowing into the workspace, generic placeholders unless brand use is cleared.",
      },
    },
    {
      heading: "Security you don't generate",
      body: "Logins and permissions are platform infrastructure, not generated.",
      // EDITORIAL, not rendered: "Confirm Base44's current certifications at its
      // Trust Center before any comparative security claim ships."
      visual: {
        art: <PlatformLayerVisual />,
        label: "Deep dive, isolation",
        description:
          "A centre platform layer bar (logins, permissions, hosting, data scoping) with several app cards branching off it, each sandboxed with its own small database icon. Compliance marks as small badges beneath.",
      },
    },
  ],
  betterFit: {
    heading: "When Base44 is the better fit",
    sub: "We would rather tell you than waste your time.",
    items: [
      {
        title: "The fastest hosted MVP",
        body: "No clients and no brand requirements yet, just an idea to validate.",
        visual: <HostedMvpVisual />,
      },
      {
        title: "Post-launch growth tooling",
        body: "SEO and AI social tooling for a public, marketed product.",
        visual: <GrowthToolingVisual />,
      },
      {
        title: "A public web app or store",
        body: "Anything anonymous visitors use, rather than clients who sign in.",
        visual: <PublicStoreVisual />,
      },
    ],
  },
  proof: {
    heading: "Built on Assembly and ready for clients in weeks",
    sub: "An 11-person agency shipped apps to 200+ clients in five weeks.",
  },
  faqs: [
    {
      question: "Is Assembly a Base44 alternative?",
      answer:
        "Yes. Assembly is an AI app builder for service businesses that need client-facing apps. Where Base44 ships a fast hosted app with its own branding on the login, Assembly ships apps into a client experience that is fully yours, with a built-in CRM and a maintained team and client boundary.",
    },
    {
      question: "Can I white-label Base44?",
      answer:
        "Base44 removes front-end platform branding on paid tiers, but users report the login splash still shows the Base44 logo even on custom domains. Assembly applies your logo and colors to every app, and on Professional and up your clients sign in on your own domain with the Assembly badge removed.",
    },
    {
      question: "Can I export my data?",
      answer:
        "Base44 lets you export frontend code, but the backend, database and auth stay on Base44's infrastructure. Assembly lets you export your client data whenever you want, and your apps live in your Assembly workspace alongside your CRM and billing.",
    },
    {
      question: "How do the credit systems compare?",
      answer:
        "Base44 uses two credit types, message and integration, that expire monthly and cannot be topped up without upgrading. Assembly's build credits are for building, live apps consume none, and the free plan never expires.",
      links: [{ label: "free plan", href: "/pricing" }],
    },
    {
      question: "Is Base44 ready for client apps?",
      answer:
        "It is a capable hosted platform, but the branded-login gap is a real limit for client-facing use, and live-app usage draws down integration credits. Assembly is built for exactly that case.",
    },
    {
      question: "Is Assembly or Base44 more secure?",
      answer:
        "Both take security seriously, and Base44 states on its security page that it is SOC 2 Type II and ISO 27001 certified. Assembly's difference is architectural: logins and permissions are maintained by Assembly rather than generated per app, each app gets its own dedicated database, and SOC 2 Type II plus a HIPAA BAA on the Advanced plan are available.",
      links: [{ label: "architectural", href: "/security" }],
    },
    {
      question: "Do I need to code?",
      answer:
        "No. Describe what you want, approve the plan, and Assembly builds. Iterate the same way, by chat.",
      links: [{ label: "Assembly builds", href: "/ai-app-builder" }],
    },
    {
      question: "What is Assembly not good for?",
      answer:
        "Public marketing sites, online stores and consumer apps. Assembly builds apps your team and your clients log into.",
    },
  ],
  cta: {
    heading: (
      <>
        Client-ready
        <br />
        from the first screen
      </>
    ),
  },
};

export default function AssemblyVsBase44Page() {
  return (
    <VsComparisonPage page={PAGE} heroVisual={<BrandedLoginHeroVisual />} />
  );
}
