import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { TemplateRail } from "@/components/templates/template-rail";

/**
 * The six templates that mirror the work every firm shares: onboarding,
 * document collection, project tracking, messaging, payments, and a resource
 * library — the brief's set, in its order.
 *
 * Deliberately a different set from the rail on /ai-app-builder, which is
 * vertical-tagged to prove range. Here they are framed as foundations, because
 * this section's job is to answer "I'm not a builder" before the page asks
 * anyone to build.
 *
 * Titles and descriptions are the brief's rather than the template data's: this
 * page names each app for the job it does in a portal ("Payments", not the
 * template's own longer title). Same arrangement as the rail on
 * /ai-app-builder.
 *
 * No `getTemplateBySlug` guard here, unlike that rail. It checks the committed
 * TEMPLATES array, and two of the brief's six — Messages and Payments — are
 * served from Contentful instead, so the guard silently dropped them and the
 * section rendered four rows where the brief asks for six. Every href below is
 * verified to resolve; the trade is that a retired template would 404 rather
 * than quietly lose its row.
 */
const PICKS: {
  slug: string;
  title: string;
  description: string;
  foundation: string;
}[] = [
  {
    slug: "client-onboarding-wizard",
    title: "Client onboarding wizard",
    description: "Multi-step flow with saved progress.",
    foundation: "Onboarding",
  },
  {
    slug: "document-collection",
    title: "Document collector",
    description: "Requested docs with upload checklist.",
    foundation: "Documents",
  },
  {
    slug: "client-project-tracker",
    title: "Project tracker",
    description: "Milestones per engagement.",
    foundation: "Projects",
  },
  {
    slug: "messaging-app",
    title: "Messages",
    description: "Secure client messaging.",
    foundation: "Messaging",
  },
  {
    slug: "billing-app",
    title: "Payments",
    description: "Branded invoices clients can pay.",
    foundation: "Payments",
  },
  {
    slug: "client-resource-library",
    title: "Client resource library",
    description: "Branded guides for clients.",
    foundation: "Resources",
  },
];

export function PortalReadyMade() {
  const cards = PICKS.map((pick) => ({
    ...pick,
    href: `/templates/${pick.slug}`,
  }));

  return (
    <section className="mx-auto max-w-[1200px] px-6 py-16 md:px-10 md:py-24">
      <Reveal>
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="type-h2 text-balance">
              Start with what every firm needs.
            </h2>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              Choose from 30+ pre-made app templates, all added to a branded
              portal ready for your clients to use. Every one is a working app:
              install it, use it, or tell the builder what to change.
            </p>
          </div>
          <Link
            href="/templates"
            className="hidden shrink-0 rounded-lg border border-border px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground md:inline-block"
          >
            Browse templates
          </Link>
        </div>

        {/* Compact rows rather than cover cards: the covers here are empty
            frames (no template shots yet), so a big 5:3 panel above each title
            was mostly grey. A small square beside the text carries the same
            slot at a fraction of the height, and twelve rows fit where six
            cards did. Shared with /ai-app-builder's rail. */}
        <TemplateRail cards={cards} />
      </Reveal>
    </section>
  );
}
