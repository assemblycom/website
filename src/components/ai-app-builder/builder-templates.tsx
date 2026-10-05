import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { TemplateRail } from "@/components/templates/template-rail";
import { getTemplateBySlug } from "@/lib/templates";

/**
 * The six cards the brief names, with its own names, descriptions and verticals
 * rather than the shorter ones /templates runs: this page sets each template in
 * the context of the business that would install it. The slug is still what the
 * card links to, so the destination cannot drift.
 */
const PICKS: {
  slug: string;
  title: string;
  description: string;
  vertical: string;
  /** The brief gives the team-only template a second, neutral chip. */
  internal?: boolean;
}[] = [
  {
    slug: "document-collection",
    title: "Year-end tax document collector",
    description: "Clients upload each document as it's ready.",
    vertical: "Accounting",
  },
  {
    slug: "design-approvals",
    title: "Campaign approval flow",
    description: "Rounds of creative, reviewed and signed off.",
    vertical: "Marketing agency",
  },
  {
    slug: "client-onboarding-wizard",
    title: "Client onboarding wizard",
    description: "Your steps, with saved progress.",
    vertical: "Professional services",
  },
  {
    slug: "client-project-tracker",
    title: "Client project tracker",
    description: "Milestones each client sees for themselves.",
    vertical: "Consulting",
  },
  {
    slug: "proposal-builder",
    title: "Proposal builder",
    description: "Tiered packages clients accept and pay for.",
    vertical: "Professional services",
  },
  {
    slug: "time-tracker",
    title: "Time tracker",
    description: "Billable hours, exported invoice-ready.",
    vertical: "Professional services",
    internal: true,
  },
];

export function BuilderTemplates() {
  const cards = PICKS.filter((pick) => getTemplateBySlug(pick.slug)).map(
    (pick) => ({
      ...pick,
      href: `/templates/${pick.slug}`,
      chips: [
        { label: pick.vertical },
        // The brief wants at least one team-only tool visible in the rail, so
        // the internal template says so on the row.
        ...(pick.internal ? [{ label: "Internal", outlined: true }] : []),
      ],
    }),
  );

  return (
    <section className="mx-auto max-w-[1200px] px-6 py-14 md:px-10 md:py-20">
      <Reveal>
        <div className="flex items-end justify-between gap-6">
          <div>
            <h3 className="type-h3 text-balance">Not a builder? Start here</h3>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              20+ templates made for businesses like yours. Install one, then
              remix it with the builder.
            </p>
          </div>
          <Link
            href="/templates"
            className="hidden shrink-0 rounded-lg border border-border px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground md:inline-block"
          >
            Browse all templates
          </Link>
        </div>

        {/* The same rows /client-portal runs — this was a grid of cover
            cards whose covers are empty frames, which is the one element
            drawn twice that this site's rules exist to stop. */}
        <TemplateRail cards={cards} />
      </Reveal>
    </section>
  );
}
