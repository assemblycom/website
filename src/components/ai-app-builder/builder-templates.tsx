import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
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
    description:
      "Clients upload each document as it's ready. Your team sees status as files come in.",
    vertical: "Accounting",
  },
  {
    slug: "design-approvals",
    title: "Campaign approval flow",
    description:
      "Clients review creative round by round and sign off before it ships.",
    vertical: "Marketing agency",
  },
  {
    slug: "client-onboarding-wizard",
    title: "Client onboarding wizard",
    description:
      "Set your onboarding steps. Clients pick up where they left off.",
    vertical: "Professional services",
  },
  {
    slug: "client-project-tracker",
    title: "Client project tracker",
    description:
      "Each client sees their own milestones. Your team updates status once.",
    vertical: "Consulting",
  },
  {
    slug: "proposal-builder",
    title: "Proposal builder",
    description:
      "A branded proposal with tiered packages and add-ons clients can accept and pay for.",
    vertical: "Professional services",
  },
  {
    slug: "time-tracker",
    title: "Time tracker",
    description:
      "Log billable hours against clients and export invoice-ready reports.",
    vertical: "Professional services",
    internal: true,
  },
];

export function BuilderTemplates() {
  const cards = PICKS.filter((pick) => getTemplateBySlug(pick.slug)).map(
    (pick) => ({ ...pick, href: `/templates/${pick.slug}` }),
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

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group flex h-full flex-col overflow-hidden rounded-xl border border-border transition-colors hover:border-foreground/20"
            >
              {/* The template rail on /templates shows a real preview here; on
                  this page the shots are not made yet, so the frame stays empty
                  rather than filling with art that is not the product. */}
              <div className="aspect-[5/3] shrink-0 overflow-hidden bg-muted" />
              {/* flex-1 so every card fills its grid row, and the chips take
                  mt-auto to sit on the floor: a one-line description used to
                  pull its chips up level with the next card's second line. */}
              <div className="flex flex-1 flex-col p-4">
                <h3 className="text-sm font-medium">{card.title}</h3>
                {/* Two lines, hard. The descriptions are written to fit, and
                    the clamp is the guard rather than the mechanism. */}
                <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                  {card.description}
                </p>
                <span className="mt-auto flex flex-wrap gap-1.5 pt-3">
                  {/* A transparent border, so this chip boxes the same height
                      as the outlined Internal one beside it. Without it the one
                      row holding both was 2px taller than the other. */}
                  <span className="inline-block rounded-md border border-transparent bg-muted px-2.5 py-1 font-mono text-xs uppercase tracking-wide text-muted-foreground">
                    {card.vertical}
                  </span>
                  {/* The brief wants at least one team-only tool visible in the
                      rail, so the internal template says so on the card. */}
                  {card.internal ? (
                    <span className="inline-block rounded-md border border-border px-2.5 py-1 font-mono text-xs uppercase tracking-wide text-muted-foreground">
                      Internal
                    </span>
                  ) : null}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
