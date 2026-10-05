import { FAQ, type FAQEntry } from "@/components/home/faq";
import { TRUST_CENTER_URL } from "@/lib/constants";
import type { BuiltOnFirm } from "@/lib/built-on-firms";

/**
 * Written for the visitor this page actually gets: someone who just used a
 * firm's app without knowing what it ran on. The homepage set answers a reader
 * already shopping for a builder, so these start further back and lead with the
 * firm they came from.
 */
function builtOnFaqs(firm?: BuiltOnFirm): FAQEntry[] {
  // Named when we know the business, so the answers are about the thing the
  // visitor just used rather than about us. Assembly is named outright rather
  // than as "it": this reader may be meeting the brand for the first time.
  const business = firm?.name ?? "This business";
  const businessInSentence = firm?.name ?? "this business";

  return [
    {
      question: "What is Assembly?",
      answer:
        "Assembly is an AI app builder and client experience platform for service businesses: accounting firms, agencies, consultancies, law firms and more. With Assembly, your clients get one branded place to engage with your business. You customize the experience to include what you need to manage your clients, from onboarding to contracts, file sharing, and payments. Install ready-to-use apps or use AI to build your own.",
    },
    {
      question: "Why did I see “Powered by Assembly”?",
      shortQuestion: "Why “Powered by Assembly”?",
      answer: `${business} uses Assembly to run their client experience. The “Powered by Assembly” badge explains more about the platform. Assembly is free to use. You can choose to white-label Assembly on our Professional paid plan.`,
    },
    {
      question: `Could I build what ${businessInSentence} has?`,
      answer:
        "Yes. The branded sign-in, the client portal and the apps inside the portal all run on Assembly. Describe what your clients need, and Assembly builds the app. Most businesses have a first app live on Assembly the same day.",
    },
    {
      question: "Do I need to know how to code to use Assembly?",
      shortQuestion: "Do I need to know how to code?",
      answer:
        "No. Describe what you want, and Assembly asks a few questions, shows you a plan and builds the app once you approve. Later changes work the same way: just ask Assembly.",
    },
    {
      question: "What can I build with Assembly?",
      answer:
        "Anything your clients or your team need to get work done together: onboarding and intake, document collection, approvals, project trackers, client dashboards, billing and payments. Every Assembly app has two sides. Your team works in your dashboard, and each client gets their own view inside your branded portal.",
    },
    {
      question: "Can I use Assembly without building anything?",
      shortQuestion: "Can I use Assembly without building?",
      answer:
        "Yes. Assembly comes with 30+ ready-made templates for service businesses, covering client onboarding, document collection, proposals and contracts, invoicing, project tracking and more. Install a template in one click and your client portal is ready to use. To change how a template works, ask Assembly.",
    },
    {
      question: "Will my clients see my brand or Assembly’s?",
      shortQuestion: "My brand or Assembly’s?",
      answer:
        "Your brand. Assembly uses your logo, colors and domain, so clients see your business, not Assembly. Free and Starter plans show a small “Powered by Assembly” badge like the one that brought you here. The Professional plan and above remove the badge.",
    },
    {
      question: "Is client data secure on Assembly?",
      answer:
        "Yes. Security is built into the Assembly platform; the AI doesn't generate it. Clients sign in with magic links or Google, Assembly enforces roles and permissions, and your team's view is kept separate from what clients see. Details are in the Assembly trust center.",
      links: [{ label: "trust center", href: TRUST_CENTER_URL }],
    },
    {
      question: "Do I have to replace the tools I already use?",
      shortQuestion: "Do I have to replace my tools?",
      answer:
        "No. Assembly connects to the tools your business already uses, so Assembly apps can read from and write to those tools instead of replacing them.",
    },
    {
      question: "How much does Assembly cost?",
      answer:
        "Start free, and the free plan doesn't expire. You can build and publish real apps on the free plan. Paid plans add more apps and more monthly build credits as your business grows.",
    },
  ];
}

export function BuiltOnFaq({ firm }: { firm?: BuiltOnFirm }) {
  // The site's standard FAQ treatment, identical to the homepage's: soft
  // rounded rows in two columns under a centred heading. The divided list this
  // used before is the /security variant, not the house style.
  return <FAQ items={builtOnFaqs(firm)} twoColumn />;
}
