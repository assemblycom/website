import type { PostCta } from "@/lib/ghost";

/**
 * The guide card's pitch, cut to two lines at the rail's narrowest width,
 * keyed by post slug. The writers' version in Ghost runs to five or six lines in a card that
 * should hold two; this wins over it until the Ghost copy is shortened too.
 */
const CTA_DESCRIPTIONS: Record<string, string> = {
  "intercom-pricing": "Start, run, and grow your client business.",
  "proposal-automation": "A proposal app with e-signature and payment.",
  "ai-customer-service-software": "A branded client help desk, without code.",
  "zendesk-alternatives": "A branded help desk inside your portal.",
  "freshdesk-vs-zoho-desk": "A help desk next to contracts and invoices.",
  "canopy-pricing": "Describe an app and Assembly builds it.",
  "docusign-alternatives": "Signing connected to billing and files.",
  "document-process-automation": "Turn intake into a collector or form.",
  "document-workflow-automation": "Document collectors, wizards, and more.",
  "freshdesk-alternatives": "A branded client help desk, without code.",
  "help-scout-alternatives": "A help desk tied to files and invoices.",
  "ai-contract-management-software":
    "Signed contracts next to invoices and updates.",
  "zendesk-reviews": "Onboarding, document requests, and updates.",
  "zendesk-pricing": "Support next to contracts and invoices.",
  "front-alternatives": "Describe a form or tracker. Assembly builds it.",
  "zendesk-vs-intercom": "Support forms, an AI assistant, or a library.",
  "zendesk-vs-freshdesk": "Support forms and an AI assistant for clients.",
  "ai-contract-review-software": "One place for contracts and everything else.",
  "appsheet-alternatives": "Client apps, branded, with permissions set.",
  "lovable-alternatives": "Dashboards, onboarding flows, and trackers.",
  "base44-alternatives": "CRM, messaging, and automations built in.",
  "ai-tools-for-consulting-firms":
    "Dashboards and tools your clients use directly.",
  "build-internal-business-apps-with-ai":
    "Client dashboards and trackers, branded.",
  "ai-tools-for-accounting-firms":
    "Dashboards and forms built for your clients.",
  "retool-alternatives": "Client dashboards, onboarding, and more.",
  "custom-apps-for-business": "Turn a prompt into a tool clients log into.",
  "best-dashboard-software-for-small-business":
    "Trackers, onboarding flows, and help desks.",
  "replit-alternatives": "Client dashboards and onboarding, no code.",
  "bolt-ai-alternatives": "Apps connected to files, messages, and billing.",
  "tooljet-alternatives": "Turn a prompt into an app clients log into.",
  "ai-workflow-automation-tools": "A branded home for your automations.",
  "best-knowledge-base-software":
    "A resource library or AI assistant for clients.",
  "best-client-portal-software": "Portal, invoicing, messaging, and files.",
  "caspio-alternatives": "A ready-built portal, billing included.",
  "client-database-software": "Records, files, and billing in one portal.",
  "client-reporting-tools": "Embed your reporting tools in one portal.",
  "coordinatehq-alternatives": "A branded portal with CRM and billing.",
  "client-relationship-management-software-for-small-business":
    "CRM, contracts, and billing in one portal.",
  "custom-dashboard-software": "Custom dashboards in your clients' portal.",
  "dubsado-alternatives": "Manage every client in one place.",
  "honeybook-alternatives": "Start, run, and grow your client business.",
  "agency-management-software": "Start, run, and grow your client business.",
  "client-dashboard-software": "Start, run, and grow your client business.",
  "best-client-management-software":
    "Start, run, and grow your client business.",
  "quickbooks-online-customer-portal":
    "Start, run, and grow your client business.",
  "honeybook-pricing": "Clients, billing, and contracts together.",
  "dubsado-vs-honeybook": "Clients, billing, and contracts together.",
  "insurance-agency-software": "Policies, renewals, and invoices together.",
  "invoicing-software-for-freelancers":
    "Invoicing, contracts, and a client portal.",
  "notion-client-portal": "Create and run your own client portal.",
  "webflow-client-portal": "Create and run your own client portal.",
  "seo-agency-software": "Clients, SEO reports, and billing together.",
  "seo-reporting-dashboard": "Your SEO dashboards in a client portal.",
};

/** The post's card with its two-line pitch, when one is written here. */
export function withShortCta(
  cta: PostCta | undefined,
  slug: string,
): PostCta | undefined {
  const description = CTA_DESCRIPTIONS[slug];
  return cta && description ? { ...cta, description } : cta;
}

/** The app the card's animation types: its name alone, so it fits one line. */
export interface CtaVisual {
  prompt: string;
}

const HELP_DESK: CtaVisual = {
  prompt: "Client help desk",
};
const CONTRACTS: CtaVisual = {
  prompt: "Contract hub",
};
const DOCUMENTS: CtaVisual = {
  prompt: "File collector",
};
const DASHBOARD: CtaVisual = {
  prompt: "Client dashboard",
};
// The app builder posts and anything not listed.
const PROJECT_TRACKER: CtaVisual = {
  prompt: "Project tracker",
};

// Each guide's animation names the kind of app its post is about.
const CTA_VISUALS: Record<string, CtaVisual> = {
  "ai-customer-service-software": HELP_DESK,
  "zendesk-alternatives": HELP_DESK,
  "freshdesk-vs-zoho-desk": HELP_DESK,
  "freshdesk-alternatives": HELP_DESK,
  "help-scout-alternatives": HELP_DESK,
  "zendesk-reviews": HELP_DESK,
  "zendesk-pricing": HELP_DESK,
  "zendesk-vs-intercom": HELP_DESK,
  "zendesk-vs-freshdesk": HELP_DESK,
  "intercom-pricing": HELP_DESK,
  "proposal-automation": {
    prompt: "Proposal builder",
  },
  "docusign-alternatives": CONTRACTS,
  "ai-contract-management-software": CONTRACTS,
  "ai-contract-review-software": CONTRACTS,
  "document-process-automation": DOCUMENTS,
  "document-workflow-automation": DOCUMENTS,
  "custom-dashboard-software": DASHBOARD,
  "best-dashboard-software-for-small-business": DASHBOARD,
  "build-internal-business-apps-with-ai": DASHBOARD,
  "custom-apps-for-business": DASHBOARD,
  "ai-tools-for-accounting-firms": DASHBOARD,
  "ai-tools-for-consulting-firms": DASHBOARD,
  "best-knowledge-base-software": {
    prompt: "Resource library",
  },
};

export function ctaVisual(slug: string): CtaVisual {
  return CTA_VISUALS[slug] ?? PROJECT_TRACKER;
}
