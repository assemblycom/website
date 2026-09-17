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
  return [
    {
      // Named when we know the firm, so the first question is about the thing
      // the visitor just used rather than about us.
      question: `Could I build what ${firm?.name ?? "this firm"} has?`,
      answer:
        "Yes. Everything you just used, from the branded sign-in to the portal and the apps inside it, runs on Assembly. Describe what your clients need in plain English and Assembly builds it. Most firms have a first app live the same day.",
    },
    {
      question: "Do I need to know how to code?",
      answer:
        "No. You describe what you want, Assembly asks a few questions and shows you a plan, you approve or edit it, and it builds. Changes later work the same way, by conversation.",
    },
    {
      question: "What can I build?",
      answer:
        "Anything your clients or your team need to get work done together. Onboarding and intake, document collection, approvals, project trackers, client dashboards, billing and payments. Every app has two sides: your team works in your dashboard, each client gets their own view inside your branded experience.",
    },
    {
      question: "I don't want to build anything. Can I just use it?",
      shortQuestion: "Can I just use it as it comes?",
      answer:
        "Yes. Assembly comes with 30+ templates built for professional services firms: client onboarding, document collection, proposals and contracts, invoicing, project tracking, and more. Install one with a click and you have a working client experience, no building required. If you ever want it to work differently, ask, and Assembly adjusts it.",
    },
    {
      question: "Will it carry my brand or yours?",
      answer:
        "Yours. Your logo, colors, and domain. Clients see your firm, not Assembly. Free and Starter plans include a small “Built on Assembly” badge like the one that brought you here. Paid plans remove it.",
    },
    {
      question: "Is my clients' data secure?",
      answer:
        "Yes. Security is platform infrastructure, not something the AI generates. Clients sign in with magic links or Google, roles and permissions are enforced by the platform, and a structural boundary separates what your team sees from what your clients see. Details in our trust center.",
      links: [{ label: "trust center", href: TRUST_CENTER_URL }],
    },
    {
      question: "Do I have to replace the tools I already use?",
      shortQuestion: "Do I have to replace my tools?",
      answer:
        "No. Assembly connects to the tools your firm already runs on, so your apps can pull from and push to them rather than replace them.",
    },
    {
      question: "What does it cost?",
      answer:
        "Start free, and the free plan doesn't expire. You can build and publish real apps on it. Paid plans add more apps and more monthly build credits as your firm grows.",
    },
  ];
}

export function BuiltOnFaq({ firm }: { firm?: BuiltOnFirm }) {
  // The site's standard FAQ treatment, identical to the homepage's: soft
  // rounded rows in two columns under a centred heading. The divided list this
  // used before is the /security variant, not the house style.
  return <FAQ items={builtOnFaqs(firm)} twoColumn />;
}
