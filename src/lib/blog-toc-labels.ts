import type { PostHeading } from "@/lib/ghost";

/**
 * Hand-written contents rail names for the guide headings the rail would
 * otherwise cut off, keyed by post slug and heading id. The rail holds about
 * four words; shortening by rule kept producing fragments ("Build your next
 * client tool without starting"), so the long ones are named here instead. A
 * heading that is renamed in Ghost gets a new id and falls back to the rule.
 */
const TOC_LABELS: Record<string, Record<string, string>> = {
  "ai-contract-management-software": {
    "10-best-ai-contract-management-software-tools-quick-comparison":
      "The 10 best tools",
    "which-ai-contract-management-software-tool-should-you-choose":
      "How to choose",
  },
  "ai-contract-review-software": {
    "10-best-ai-contract-review-software-tools-quick-comparison":
      "The 10 best tools",
    "what-ai-contract-review-software-does": "What it does",
    "ai-contract-review-vs-general-ai-like-chatgpt-and-claude":
      "Versus ChatGPT and Claude",
    "how-to-choose-the-right-ai-contract-review-software": "How to choose",
    "you-ve-reviewed-the-contract-now-what-happens-to-it": "After the review",
  },
  "ai-customer-service-software": {
    "10-best-ai-customer-service-software-quick-comparison":
      "The 10 best tools",
  },
  "ai-workflow-automation-tools": {
    "11-best-ai-workflow-automation-tools-quick-comparison":
      "The 11 best tools",
  },
  "appsheet-alternatives": {
    "build-your-next-client-tool-without-starting-from-zero": "Try Assembly",
  },
  "best-ai-app-builder": {
    "most-ai-app-builders-build-for-your-team-assembly-builds-for-your-clients":
      "Built for your clients",
  },
  "best-knowledge-base-software": {
    "7-best-ai-knowledge-base-software-quick-comparison": "The 7 best tools",
    "want-an-ai-knowledge-base-clients-actually-use-try-assembly":
      "Try Assembly",
  },
  "build-internal-business-apps-with-ai": {
    "10-best-tools-to-build-internal-business-apps-with-ai-quick-comparison":
      "The 10 best tools",
  },
  "canopy-pricing": {
    "canopy-vs-assembly-per-seat-vs-per-workspace": "Canopy vs Assembly",
  },
  "custom-apps-for-business": {
    "9-best-tools-for-building-custom-apps-for-business-quick-comparison":
      "The 9 best tools",
  },
  "custom-dashboard-software": {
    "9-best-custom-dashboard-software-at-a-glance": "The 9 best tools",
  },
  "document-process-automation": {
    "document-process-automation-vs-idp-rpa-and-document-management":
      "Versus IDP and RPA",
    "how-document-process-automation-works-6-steps": "How it works",
    "what-documents-and-workflows-can-you-automate": "What you can automate",
    "the-benefits-of-document-process-automation": "Benefits",
    "which-kind-of-document-process-automation-tool-do-you-need":
      "Choosing a tool",
    "how-to-get-started-with-document-process-automation": "Getting started",
    "the-limitations-of-document-process-automation": "Limitations",
    "automate-the-paperwork-clients-see-with-assembly": "Try Assembly",
  },
  "document-workflow-automation": {
    "how-document-workflow-automation-works": "How it works",
    "benefits-of-automating-document-workflows": "Benefits",
    "client-facing-vs-internal-document-workflows": "Client-facing vs internal",
    "examples-of-automated-document-workflows": "Examples",
    "why-document-workflow-automations-stall-and-how-to-measure-whether-it-s-working":
      "Why automations stall",
    "automate-client-document-workflows-with-assembly": "Try Assembly",
  },
  "docusign-alternatives": {
    "19-best-docusign-alternatives-in-2026-at-a-glance":
      "The 19 best alternatives",
  },
  "help-scout-alternatives": {
    "how-to-evaluate-help-scout-alternatives": "How to evaluate",
  },
  "intercom-pricing": {
    "fin-ai-pricing-the-0-99-per-outcome-model": "Fin AI pricing",
    "intercom-add-ons-and-hidden-costs": "Add-ons and hidden costs",
    "intercom-s-early-stage-discount-for-startups": "Early Stage discount",
    "looking-for-a-simpler-client-facing-option-try-assembly": "Try Assembly",
  },
  "lovable-alternatives": {
    "10-best-no-code-lovable-alternatives-at-a-glance":
      "The 10 best alternatives",
    "get-to-the-client-facing-experience-without-building-it-from-scratch":
      "Try Assembly",
  },
  "proposal-automation": {
    "what-proposal-automation-can-automate": "What it automates",
    "the-benefits-of-proposal-automation": "Benefits",
    "where-proposal-automation-falls-short": "Where it falls short",
    "5-proposal-automation-tools-compared": "5 tools compared",
    "build-proposal-automation-your-clients-log-into": "Try Assembly",
  },
  "replit-alternatives": {
    "build-your-next-client-tool-without-starting-from-zero": "Try Assembly",
  },
  "retool-alternatives": {
    "skip-stitching-together-client-access-yourself": "Try Assembly",
  },
  "tooljet-alternatives": {
    "when-the-tool-you-re-building-is-for-your-clients-not-your-team":
      "Built for your clients",
  },
  "zendesk-pricing": {
    "zendesk-customer-service-suite-pricing-breakdown":
      "Customer Service Suite",
    "zendesk-employee-service-suite-pricing-breakdown":
      "Employee Service Suite",
    "zendesk-add-ons-and-what-they-cost": "Add-ons and costs",
    "how-zendesk-s-ai-pricing-works-per-automated-resolution": "AI pricing",
  },
  "zendesk-reviews": {
    "why-zendesk-s-trustpilot-rating-is-so-low": "Low Trustpilot rating",
    "is-zendesk-for-customer-service-right-for-you": "Is it right for you",
  },
  "zendesk-vs-freshdesk": {
    "meet-zendesk-features-and-highlights": "Meet Zendesk",
    "meet-freshdesk-features-and-highlights": "Meet Freshdesk",
  },
  "zendesk-vs-intercom": {
    "meet-zendesk-features-and-highlights": "Meet Zendesk",
    "meet-intercom-features-and-highlights": "Meet Intercom",
    "what-the-salesforce-and-intercom-deal-means-for-buyers":
      "The Salesforce deal",
    "support-that-knows-your-clients-as-well-as-you-do": "Try Assembly",
  },
};

/** The rail's entries with any hand-written names for this post swapped in. */
export function withTocLabels(
  entries: PostHeading[],
  slug: string,
): PostHeading[] {
  const labels = TOC_LABELS[slug];
  if (!labels) return entries;
  return entries.map((entry) => ({
    ...entry,
    text: labels[entry.id] ?? entry.text,
    children: entry.children && withTocLabels(entry.children, slug),
  }));
}
