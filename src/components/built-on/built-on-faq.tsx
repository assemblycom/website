import { FAQ, type FAQEntry } from "@/components/home/faq";

/**
 * Written for the visitor this page actually gets: a client of some firm who
 * used one of its apps and has never heard of us. The homepage set answers a
 * different reader (someone already shopping for a builder), so these are
 * shorter and start further back.
 */
const BUILT_ON_FAQS: FAQEntry[] = [
  {
    question: "What is Assembly?",
    answer:
      "The platform the firm you just dealt with uses to run their client work. They build the apps their clients need, and Assembly handles the accounts, sign-in, permissions, payments and branding around them.",
  },
  {
    question: "Do I need to know how to code?",
    answer:
      "No. Describe what you want in plain English. The builder asks a few questions, shows you a plan you can approve or edit, then builds it. Later changes happen the same way, by conversation.",
  },
  {
    question: "What can I build with it?",
    answer:
      "Apps your clients use and tools your team uses. Onboarding flows, document collection, project trackers, approval workflows, client dashboards. Every app has two sides, so your team works in your dashboard while each client gets their own view inside your branded client experience.",
  },
  {
    question: "What does it cost?",
    answer:
      "Start free, and the free plan does not expire. You can build and publish real apps on it. Paid plans add more apps and more monthly build credits as your firm grows.",
  },
  {
    question: "Is my clients' data secure?",
    answer:
      "Yes, and the security is platform infrastructure rather than something the AI generates. Clients sign in with secure magic links or Google, roles and permissions are maintained by the platform, and a structural boundary separates what your team sees from what your clients see.",
  },
];

export function BuiltOnFaq() {
  // The site's standard FAQ treatment, identical to the homepage's: soft
  // rounded rows in two columns under a centred heading. The divided list this
  // used before is the /security variant, not the house style.
  return <FAQ items={BUILT_ON_FAQS} twoColumn />;
}
