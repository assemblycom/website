import type { Metadata } from "next";
import { VsComparisonPage, type VsPage } from "@/components/comparison/vs-page";
import {
  ClientAppsCardVisual,
  CrmCardVisual,
  LoginsCardVisual,
  PlatformLayerVisual,
} from "@/components/comparison/story-visuals";
import { TeamClientsHeroVisual } from "@/components/comparison/team-clients-hero-visual";
import {
  ClientAppsPillarVisual,
  CrmPillarVisual,
  FullExperienceVisual,
  LoginsPillarVisual,
  PlanVisual,
} from "@/components/comparison/product-visuals";
import { PAGE_SEO, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(PAGE_SEO.vsLovable);

/**
 * Not staged as a bake-off. Nobody shops Assembly against a code-generation
 * tool in a formal feature contest: those tools turn up in sales calls as past
 * failures. So the page converts the visitor who already got a prototype out of
 * one and stalled at the client login, and it gives Lovable real credit where
 * Lovable is genuinely better.
 *
 * No competitor security incident appears anywhere on this page. The security
 * contrast stays architectural.
 */
const PAGE: VsPage = {
  competitor: "Lovable",
  hero: {
    h1: "The client-facing alternative to Lovable",
    sub: "Ship your apps inside a branded client experience with logins, permissions, and a CRM already handled.",
    visual: {
      label: "Hero shot",
      description:
        "Split frame, light product chrome. Left: Assembly's chat build panel with a short real conversation about a client onboarding wizard, one clarifying question, resolving into a Plan card with Approve and Edit. Right, overlapping: the resulting app shown twice, once in the team dashboard and once inside a client's branded client experience with a placeholder client logo and realistic contact names. A thin publish arrow connects them. Labels: Your team, Your clients.",
    },
  },
  glance: {
    heading: "Same prompt. Very different destination.",
    sub: "Lovable ends with a prototype you finish. Assembly ends with an app your clients can sign into.",
    // Drawn from the rows below, as yes-or-no. "Best for" and "Time to a
    // working app" are not yes-or-no and stay in the matrix's data only.
    checklist: [
      {
        label: "Ready for clients on day one",
        assembly: true,
        competitor: false,
      },
      {
        label: "Managed logins and permissions",
        assembly: true,
        competitor: false,
      },
      { label: "Shared client CRM", assembly: true, competitor: false },
      { label: "Branded client experience", assembly: true, competitor: false },
      {
        label: "White-label branding",
        assembly: true,
        competitor: { yes: true, note: "Enterprise" },
      },
      { label: "Full code export", assembly: true, competitor: true },
      { label: "Live apps without credits", assembly: true, competitor: false },
      {
        label: "HIPAA options",
        assembly: { yes: true, note: "Advanced" },
        competitor: false,
      },
    ],
    rows: [
      {
        label: "Best for",
        assembly: "Firms whose clients log in",
        competitor: "Developers and technical founders",
      },
      {
        label: "Time to a working app",
        assembly: "Minutes",
        competitor: "Minutes — to a prototype",
      },
      {
        label: "Ready on day one?",
        assembly: "Yes, in your portal",
        competitor: "After you secure and host it",
      },
      {
        label: "Logins and permissions",
        assembly: "Built in, maintained by us",
        competitor: "Supabase Auth, per app",
      },
      {
        label: "Client data",
        assembly: "One shared CRM",
        competitor: "Empty database you design",
      },
      {
        label: "Branding",
        assembly: "Every plan; domain on Professional",
        competitor: "Enterprise tier only",
      },
      {
        label: "Client experience",
        assembly: "Included",
        competitor: "You build it",
      },
      {
        // No `detail` line. It read "A real Lovable strength", which was the
        // only cell in the table set over two lines, and the competitor cell
        // beside it already says what the strength is.
        label: "Code export",
        assembly: "Yours, no code export",
        competitor: "Full code, GitHub sync",
      },
      {
        label: "Live app pricing",
        assembly: "No credits for live apps",
        competitor: "Credits fund hosting and AI",
      },
      {
        label: "HIPAA options",
        assembly: "Advanced and up",
        competitor: false,
      },
    ],
  },
  pillarsHeading: "Why teams choose Assembly over Lovable",
  pillarsStyle: "cards",
  pillars: [
    {
      heading: "Apps your clients can use",
      tabLabel: "Client apps",
      card: <ClientAppsCardVisual />,
      body: "Lovable ships a prototype at its own address. Assembly builds it into your branded portal.",
      visual: {
        label: "Pillar 1 visual",
        art: <ClientAppsPillarVisual />,
        wide: true,
        description:
          "The team dashboard view and the branded client view of the same app, side by side, visibly originating from one chat panel. Left in neutral Assembly chrome, right in a distinct accent colour with a client logo placeholder. Labels: Your team, Your clients.",
      },
    },
    {
      heading: "Logins and permissions built in",
      tabLabel: "Logins",
      card: <LoginsCardVisual />,
      body: "Lovable generates access rules per app. Assembly maintains them for you.",
      visual: {
        label: "Pillar 2 visual",
        art: <LoginsPillarVisual />,
        description:
          "A client sign-in screen next to a Who can see this role control listing team roles and a client, each carrying a small Part of Assembly mark so the security layer reads as separate from the app content it protects. No MFA jargon in the art: the point is that someone already built this for you.",
      },
    },
    {
      heading: "One CRM behind every app",
      tabLabel: "One CRM",
      card: <CrmCardVisual />,
      body: "Contacts, companies, and custom fields that every app connects to automatically.",
      visual: {
        label: "Pillar 3 visual",
        art: <CrmPillarVisual />,
        wide: true,
        description:
          "Assembly's CRM front and centre: a contact list with companies and a custom field visible. Then that same list feeding two different client experiences side by side, Company A seeing its own data and Company B seeing something else.",
      },
    },
  ],
  deepDivesHeading: "What you don't have to build",
  deepDives: [
    {
      heading: "Describe it. Approve it. Clients use it",
      body: "Assembly shows you a plan and waits for your approval before anything builds.",
      visual: {
        art: <PlanVisual />,
        label: "Deep dive, the plan",
        description:
          "The Plan card UI, large enough to read the actual copy on it, with a visible Approve and Edit pair. Caption: You approve before anything builds.",
      },
    },
    {
      heading: "A full client experience, not just a builder",
      body: "Lovable gives a blank canvas. Assembly gives the CRM, portal and apps.",
      visual: {
        art: <FullExperienceVisual />,
        label: "Deep dive, the platform",
        description:
          "The Assembly workspace sidebar showing built apps alongside the native ones (CRM, Messaging, Billing, Files, Contracts, Forms, Tasks), with one branded client experience wrapping them.",
      },
    },
    {
      heading: "Stop carrying the maintenance yourself",
      body: "The hard parts are engineered once and inherited by every app.",
      // EDITORIAL, not rendered: "Use the phrase engineered once and inherited
      // by every app. Do not write that security fixes ship platform-wide, which
      // is not documented in those words."
      visual: {
        art: <PlatformLayerVisual />,
        label: "Deep dive, the platform layer",
        description:
          "A centre platform layer bar (auth, permissions, hosting, data scoping) with several app cards branching off it, each visibly sandboxed and carrying its own small database icon, to show isolation plus a shared foundation.",
      },
    },
  ],
  betterFit: {
    heading: "When Lovable is the better fit",
    sub: "We would rather tell you than waste your time.",
    style: "list",
    items: [
      {
        title: "GitHub and a dev hand-off",
        body: "Lovable syncs the full code to GitHub, so a developer can take it over and keep building in their own tools. Assembly runs your apps for you and does not export the code.",
      },
      {
        title: "A public site or consumer app",
        body: "Assembly builds apps that sit behind a client login, inside your portal. For a marketing site or an app anyone can open without signing in, Lovable is the better tool.",
      },
      {
        title: "A prototype you will maintain",
        body: "If the app is a one-off that will not grow, a code-first tool is the shorter path. Assembly pays off when your apps share clients, logins, and data over time.",
      },
    ],
  },
  pricing: {
    heading: "Predictable pricing by design",
    body: "Lovable's credits also fund hosting and live AI. Assembly's are spent only on building, and a live app is $5 a month.",
  },
  faqs: [
    {
      question: "Is Assembly a Lovable alternative?",
      answer:
        "Yes. Assembly is an AI app builder built for service businesses that need apps their clients log into. Where Lovable generates a prototype you still secure, host, and connect to client data, Assembly publishes a working app into a branded client experience with logins, permissions, and a built-in CRM already included.",
    },
    {
      question: "Can Lovable build apps with logins?",
      answer:
        "It can, but you configure and secure the auth yourself on Supabase, and access rules are generated per app. Assembly's logins and permissions are platform infrastructure built and maintained by Assembly, with a hard boundary between team and client views.",
    },
    {
      question: "Is Lovable production-ready?",
      answer:
        "Lovable is excellent at getting to a first version fast. Making that app production-ready, meaning securing it, hosting it, and connecting client data, is additional work, which is why teams often reach for a deployment layer afterward. Assembly apps publish live into your client experience.",
    },
    {
      question: "How does the pricing compare?",
      answer:
        "Assembly build credits are used only for building and editing apps, and running your live apps consumes none. Lovable's unified credits also fund hosting and live-app AI. Assembly's free plan never expires.",
      links: [{ label: "free plan", href: "/pricing" }],
    },
    {
      question: "Is Assembly more secure than Lovable?",
      answer:
        "Security on Assembly is platform infrastructure, not generated per app. Logins and permissions are maintained centrally, and each app runs in its own dedicated database and sandbox.",
      links: [{ label: "platform infrastructure", href: "/security" }],
    },
    {
      question: "Do I need to know how to code?",
      answer:
        "No. Describe what you want, approve the plan, and Assembly builds. Changes happen the same way, by conversation.",
      links: [{ label: "Assembly builds", href: "/ai-app-builder" }],
    },
    {
      question: "What is Assembly not good for?",
      answer:
        "Public marketing sites and consumer apps. Assembly builds apps people log into, meaning your team and your clients.",
    },
  ],
  cta: {
    heading: (
      <>
        Your next client app,
        <br />
        live this afternoon
      </>
    ),
  },
};

export default function AssemblyVsLovablePage() {
  return (
    <VsComparisonPage page={PAGE} heroVisual={<TeamClientsHeroVisual />} />
  );
}
