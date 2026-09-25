import type { Metadata } from "next";
import { VsComparisonPage, type VsPage } from "@/components/comparison/vs-page";
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
    sub: "Base44 ships a fast hosted app. Assembly ships apps into a client experience that is fully branded as yours, ready to use with team and clients.",
    visual: {
      label: "Hero shot",
      description:
        "Split frame. The wedge beat is a branded login screen. Left: a generic hosted-app login carrying a small neutral platform-logo placeholder in the splash position — a placeholder, never Base44's actual mark. Right: the Assembly client sign-in fully carrying the customer's logo, accent colour and custom domain in the address bar, with no Assembly badge. Caption cue between them: First screen your client sees.",
    },
  },
  glance: {
    heading: "Two ways to ship an app. One is meant for clients",
    sub: "Base44 is fast and all-in-one. Here is what changes when clients are involved.",
    rows: [
      {
        label: "Best for",
        assembly: "Service businesses building apps their clients log into",
        competitor: "Non-technical founders shipping a hosted MVP fast",
      },
      {
        label: "Branding on login",
        assembly:
          "Your logo and colors from the first screen. Your own domain with no Assembly badge on Professional and up",
        competitor:
          "Base44 logo on the login splash, even on custom domains",
      },
      {
        label: "Client experience",
        assembly: "A branded client experience included out of the box",
        competitor:
          "Client-facing apps are possible, but you assemble the experience yourself",
      },
      {
        label: "Client data",
        assembly: "Built-in CRM. Import your clients, every app uses it",
        competitor: "An empty database you design per app",
      },
      {
        label: "Team and client separation",
        assembly: "A structural boundary maintained by the platform",
        competitor: "You configure roles",
      },
      {
        label: "Pricing model",
        assembly: "Build credits for building. Live apps consume none",
        competitor:
          "Two credit types, message plus integration. No rollover, no top-up without upgrading",
      },
      {
        label: "Your data",
        assembly:
          "Export your client data anytime. Assembly never trains AI on your data",
        competitor:
          "Frontend code export only. Backend and database stay on Base44",
      },
      {
        label: "Beyond the app",
        assembly: "CRM, billing, messaging, files and contracts, all included",
        competitor: "Added separately",
      },
      {
        label: "Compliance",
        assembly:
          "SOC 2 Type II. HIPAA BAA on Advanced. Each app gets its own dedicated database",
        competitor:
          "SOC 2 Type II and ISO 27001 per base44.com/security. No public HIPAA BAA",
      },
    ],
  },
  pillarsHeading: "Why teams choose Assembly over Base44",
  pillars: [
    {
      heading: "Your brand, from the very first screen",
      sub: "Assembly offers full white-labeling on the Professional plan.",
      body: "Customization and white-labeling is one of the top three reasons customers choose Assembly, raised in 27% of 2,926 sales calls.",
      note: "The Base44 login-splash claim is current as of September 2026 and sourced to Base44's own feedback board. Base44 shipped platform-wide custom login pages in June 2026 and could close the gap, so re-verify before every refresh of this page.",
      visual: {
        label: "Pillar 1 visual",
        description:
          "Split composition. Left: a login screen with a neutral platform-logo placeholder in the splash position. Right: the Assembly client sign-in carrying the customer's logo and colours, on a custom domain, no badge. Beneath, the 27% of sales calls figure as a pull stat.",
      },
    },
    {
      heading: "A real client experience, included",
      sub: "Every app has a team side and a per-client side.",
      body: "Base44 can build a client-facing app, but you assemble the client experience yourself. Assembly comes with a branded one out of the box. Apps ship straight into it, and each client sees only their own view.",
      visual: {
        label: "Pillar 2 visual",
        description:
          "The branded client experience with a left sidebar listing the native apps (Messaging, Files, Contracts, Billing) alongside two custom-built ones, all under the customer's brand. A smaller second frame shows the same workspace from the team side. Labels: Your clients, Your team.",
      },
    },
    {
      heading: "One credit meter, not two",
      sub: "Using your live apps in Assembly does not require credits.",
      body: "Base44 meters building and live usage separately, and neither rolls over. On Assembly, once an app is live you pay $5 a month hosting and your clients use it as much as they want. Credits roll over for one month, and you can change your plan whenever you want.",
      note: "Confirm the exact figures against the live pricing page before publish: paid plans include 200 build credits a month and Free includes 50, unused credits roll over one additional month, extra credits are $0.60 each, extra apps are $5 a month. The rollover policy changed recently.",
      visual: {
        label: "Pillar 3 visual",
        description:
          "Two credit meters on the left labelled message credits and integration credits, both draining. One meter on the right labelled build credits, with a stable, full live apps bar beside it. Simple and diagrammatic.",
      },
    },
  ],
  deepDives: [
    {
      heading: "Built for clients, not just builders",
      body: "Tools for your team land in your dashboard. Client-facing apps land in your branded client experience with logins already handled. Assembly shows you a plan before it builds, and new apps stay hidden from clients until you make them visible.",
      visual: {
        label: "Deep dive, the plan",
        description:
          "The chat build panel with a readable Plan card covering what it builds, what data it uses and who sees it, with Approve and Edit. Then the same app shown on the team side and inside the branded client experience.",
      },
    },
    {
      heading: "The stack Base44 makes you build is already assembled",
      body: "Assembly comes with a built-in CRM, a client login experience, and ready-to-use apps for billing, project management and onboarding. Connect the tools you already run through native integrations, embeds, or by asking the builder to integrate them for you.",
      visual: {
        label: "Deep dive, the platform",
        description:
          "The Assembly workspace sidebar showing built apps alongside the native ones, with one branded client experience wrapping them. A thin strip beneath shows integration logos flowing into the workspace, generic placeholders unless brand use is cleared.",
      },
    },
    {
      heading: "Security you don't generate",
      body: "Each app in Assembly is scoped to your workspace with its own dedicated database and deployment, and a maintained boundary between team and client data. Logins and permissions are platform infrastructure maintained by Assembly, not generated per app.",
      note: "Confirm Base44's current certifications at its Trust Center before any comparative security claim ships.",
      visual: {
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
        title: "You want the fastest possible hosted MVP",
        body: "No clients and no brand requirements yet, just an idea to validate.",
      },
      {
        title: "You want built-in post-launch growth tooling",
        body: "SEO and GEO dashboards, AI social content and analytics for a public product. Assembly's apps live behind a client login, so those tools do not apply.",
      },
      {
        title: "You are building a public web app or an online store",
        body: "Not something your clients log into.",
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
  return <VsComparisonPage page={PAGE} />;
}
