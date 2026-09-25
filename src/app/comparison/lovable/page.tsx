import type { Metadata } from "next";
import { VsComparisonPage, type VsPage } from "@/components/comparison/vs-page";
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
    heading: "Same prompt. Very different destination",
    sub: "Lovable ends with a prototype you finish. Assembly ends with an app your clients can sign into.",
    rows: [
      {
        label: "Best for",
        assembly: "Service businesses building apps their clients log into",
        competitor: "Developers and technical founders building any web app",
      },
      {
        label: "Time to a working app",
        assembly: "Minutes to a working app",
        competitor: "Minutes to a prototype",
      },
      {
        label: "Ready for clients on day one",
        assembly: "Yes, live in your branded client experience",
        competitor: "You secure, host, and connect it first",
      },
      {
        label: "Logins and permissions",
        assembly: "Built and maintained by Assembly, not AI-generated",
        competitor: "Supabase Auth. Access rules generated per app",
      },
      {
        label: "Client data",
        assembly: "Built-in CRM. Import your clients, every app uses it",
        competitor: "Start from an empty database you design",
      },
      {
        label: "Branding",
        assembly:
          "Your logo and colors on every plan. Your own domain on Professional and up",
        competitor: "On-brand at enterprise tier",
      },
      {
        label: "Client-facing experience",
        assembly: "Included: a branded client experience out of the box",
        competitor: "You build the login and portal yourself",
      },
      {
        label: "Code ownership and export",
        detail: "A real Lovable strength",
        assembly:
          "You own your apps and data. Apps live in your Assembly workspace, with no source-code export",
        competitor: "Full code, GitHub sync, no lock-in",
      },
      {
        label: "Pricing after you publish",
        assembly: "Using live apps consumes no build credits",
        competitor: "Credits also fund hosting and live-app AI",
      },
      {
        label: "HIPAA compliant options",
        assembly: "Advanced plan and above",
        competitor: false,
      },
    ],
  },
  pillarsHeading: "Why teams choose Assembly over Lovable",
  pillars: [
    {
      heading: "Apps your clients can use securely",
      sub: "Lovable ships a prototype at its own address. Assembly builds into a branded client experience ready for your clients to use.",
      body: "Every Assembly app has two sides: your team works in the dashboard, and each client sees only their own view inside your client experience. There is no second app to secure or connect.",
      visual: {
        label: "Pillar 1 visual",
        description:
          "The team dashboard view and the branded client view of the same app, side by side, visibly originating from one chat panel. Left in neutral Assembly chrome, right in a distinct accent colour with a client logo placeholder. Labels: Your team, Your clients.",
      },
    },
    {
      heading: "Secure logins and permissions come built in",
      sub: "Assembly lets you customize access rules and handles authentication, so you do not have to worry about it.",
      body: "On Lovable, access rules are generated per app. On Assembly we maintain the platform infrastructure, so the logins, permissions, and the boundary between what your team sees and what each client sees stay secure.",
      visual: {
        label: "Pillar 2 visual",
        description:
          "A client sign-in screen next to a Who can see this role control listing team roles and a client, each carrying a small Part of Assembly mark so the security layer reads as separate from the app content it protects. No MFA jargon in the art: the point is that someone already built this for you.",
      },
    },
    {
      heading: "One CRM. Every app connects to it",
      body: "Assembly includes a full CRM: contacts, companies, and custom fields. Every app you build connects to it automatically, and each client only sees what they're allowed to see.",
      visual: {
        label: "Pillar 3 visual",
        description:
          "Assembly's CRM front and centre: a contact list with companies and a custom field visible. Then that same list feeding two different client experiences side by side, Company A seeing its own data and Company B seeing something else.",
      },
    },
  ],
  deepDives: [
    {
      heading: "Describe it. Approve it. Clients use it",
      body: "Assembly asks a few questions, shows a plan covering what it builds, what data it uses and who sees it, then waits for your approval. Only then does it publish into your client experience. New apps stay hidden from clients until you make them visible, and you can keep chatting to change anything, before launch or six months later.",
      visual: {
        label: "Deep dive, the plan",
        description:
          "The Plan card UI, large enough to read the actual copy on it, with a visible Approve and Edit pair. Caption: You approve before anything builds.",
      },
    },
    {
      heading: "A full client experience, not just a builder",
      body: "Lovable gives you a blank canvas. Assembly gives you a client portal out of the box, so you build the part that is distinctly yours. The built-in CRM, the client experience, and ready-made apps for billing, messaging and onboarding are already there.",
      visual: {
        label: "Deep dive, the platform",
        description:
          "The Assembly workspace sidebar showing built apps alongside the native ones (CRM, Messaging, Billing, Files, Contracts, Forms, Tasks), with one branded client experience wrapping them.",
      },
    },
    {
      heading: "Stop carrying the maintenance yourself",
      body: "With tools like Lovable, every app is a codebase you own and maintain, and every AI edit can break what worked. On Assembly the most important parts of your clients' experience are engineered once and inherited by every app, on a platform thousands of professional businesses already run on.",
      note: "Use the phrase engineered once and inherited by every app. Do not write that security fixes ship platform-wide, which is not documented in those words.",
      visual: {
        label: "Deep dive, the platform layer",
        description:
          "A centre platform layer bar (auth, permissions, hosting, data scoping) with several app cards branching off it, each visibly sandboxed and carrying its own small database icon, to show isolation plus a shared foundation.",
      },
    },
  ],
  betterFit: {
    heading: "When Lovable is the better fit",
    sub: "We would rather tell you than waste your time.",
    items: [
      {
        title: "You want to sync to GitHub and hand off to developers",
        body: "Lovable supports that better than Assembly at the moment.",
      },
      {
        title: "You are building a public site or a consumer app",
        body: "Assembly builds apps people log into, not anonymous web traffic.",
      },
      {
        title: "You want a fast prototype you are willing to maintain",
        body: "If the app is not expected to grow, a code-first tool is the shorter path.",
      },
    ],
  },
  pricing: {
    heading: "Predictable pricing by design",
    sub: "Lovable's credits also fund hosting and your live app's AI usage, so an active app keeps spending.",
    body: "On Assembly, build credits are used only when the app builder creates or edits an app. Using your live apps consumes none, so a busy client-facing app does not compete with your own building. Hosting is included at no more than $5 a month, and clients can use your apps as much as they want.",
    visual: {
      label: "Pricing visual",
      description:
        "A two-meter comparison. Left: one credit pool draining from several taps, labelled build, hosting and live-app AI. Right: an Assembly build-credit meter beside a separate, stable running apps bar. Diagrammatic and honest, not a fear graphic.",
    },
  },
  proof: {
    heading: "Built on Assembly, ready for clients in weeks",
    sub: "An 11-person agency shipped apps to 200+ clients in five weeks.",
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
  return <VsComparisonPage page={PAGE} />;
}
