import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { getTemplateBySlug } from "@/lib/templates";

/**
 * The six templates that mirror the work every firm shares: onboarding,
 * document collection, project tracking, messaging, payments, and a resource
 * library.
 *
 * Deliberately a different set from the rail on /ai-app-builder, which is
 * vertical-tagged to prove range. Here they are framed as foundations, because
 * this section's job is to answer "I'm not a builder" before the page asks
 * anyone to build. Titles and descriptions come from the site's own template
 * data so they cannot drift from /templates.
 */
const PICKS: { slug: string; foundation: string }[] = [
  { slug: "client-onboarding-wizard", foundation: "Onboarding" },
  { slug: "document-collection", foundation: "Documents" },
  { slug: "client-project-tracker", foundation: "Projects" },
  // The brief named a messaging and a billing template. Neither exists: both
  // are native apps rather than things you install, so the two nearest real
  // templates stand in and the section keeps six cards.
  { slug: "client-support-requests", foundation: "Requests" },
  { slug: "proposal-builder", foundation: "Payments" },
  { slug: "client-resource-library", foundation: "Resources" },
];

export function PortalReadyMade() {
  const cards = PICKS.map((pick) => {
    const template = getTemplateBySlug(pick.slug);
    return template
      ? {
          href: `/templates/${template.slug}`,
          title: template.title,
          description: template.description,
          foundation: pick.foundation,
        }
      : null;
  }).filter((card) => card !== null);

  return (
    <section className="mx-auto max-w-[1200px] px-6 py-16 md:px-10 md:py-24">
      <Reveal>
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="type-h2 text-balance">
              Start with what every firm needs
            </h2>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              Choose from built-in pre-made app templates, all added to a
              branded portal ready for your clients to use. Every one is a
              working app: install it, use it, or tell the builder what to
              change.
            </p>
          </div>
          <Link
            href="/templates"
            className="hidden shrink-0 rounded-lg border border-border px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground md:inline-block"
          >
            Browse templates
          </Link>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group overflow-hidden rounded-xl border border-border transition-colors hover:border-foreground/20"
            >
              <div className="aspect-[5/3] overflow-hidden bg-muted" />
              <div className="p-4">
                <h3 className="text-sm font-medium">{card.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {card.description}
                </p>
                <span className="mt-3 inline-block rounded-md bg-muted px-2.5 py-1 font-mono text-xs uppercase tracking-wide text-muted-foreground">
                  {card.foundation}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
