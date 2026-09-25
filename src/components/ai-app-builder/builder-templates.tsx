import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { getTemplateBySlug } from "@/lib/templates";

/**
 * The six templates the brief names, pulled from the site's own template data
 * so the titles and descriptions cannot drift from /templates. The brief gives
 * a couple of them a vertical-specific name for this page's context; where it
 * does, that name is used and the real template is still what it links to.
 */
const PICKS: { slug: string; vertical: string; renamedTo?: string }[] = [
  {
    slug: "document-collection",
    vertical: "Accounting",
    renamedTo: "Year-end tax document collector",
  },
  {
    slug: "design-approvals",
    vertical: "Marketing agency",
    renamedTo: "Campaign approval flow",
  },
  { slug: "client-onboarding-wizard", vertical: "Professional services" },
  { slug: "client-project-tracker", vertical: "Consulting" },
  { slug: "proposal-builder", vertical: "Professional services" },
  { slug: "time-tracker", vertical: "Internal" },
];

export function BuilderTemplates() {
  const cards = PICKS.map((pick) => {
    const template = getTemplateBySlug(pick.slug);
    return template
      ? {
          href: `/templates/${template.slug}`,
          title: pick.renamedTo ?? template.title,
          description: template.description,
          vertical: pick.vertical,
        }
      : null;
  }).filter((card) => card !== null);

  return (
    <section className="mx-auto max-w-[1200px] px-6 py-16 md:px-10 md:py-24">
      <Reveal>
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="type-h2 text-balance">
              Not a builder? Start from a template and remix it.
            </h2>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              20+ templates made for businesses like yours. Install one, then
              remix it with the builder.
            </p>
          </div>
          <Link
            href="/templates"
            className="hidden shrink-0 rounded-lg border border-border px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground md:inline-block"
          >
            See all
          </Link>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group overflow-hidden rounded-xl border border-border transition-colors hover:border-foreground/20"
            >
              {/* The template rail on /templates shows a real preview here; on
                  this page the shots are not made yet, so the frame stays empty
                  rather than filling with art that is not the product. */}
              <div className="aspect-[5/3] overflow-hidden bg-muted" />
              <div className="p-4">
                <h3 className="text-sm font-medium">{card.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {card.description}
                </p>
                <span className="mt-3 inline-block rounded-md bg-muted px-2.5 py-1 font-mono text-xs uppercase tracking-wide text-muted-foreground">
                  {card.vertical}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
