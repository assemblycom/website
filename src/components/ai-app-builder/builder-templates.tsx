import { BUILDER_RAIL_HALO } from "./builder-grid-rails";
import Link from "next/link";
import { QUIET_BUTTON } from "@/components/ui/quiet-button";
import { Reveal } from "@/components/ui/reveal";
import { TemplateRail } from "@/components/templates/template-rail";
import {
  IconTemplateApprovals,
  IconTemplateDocuments,
  IconTemplateOnboarding,
  IconTemplateProjects,
  IconTemplateProposals,
  IconTemplateTimeTracker,
} from "@/components/templates/template-icons";
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
  /**
   * The template's drawn mark, where one exists.
   *
   * Three of these came across from /client-portal's rail, where the same SLUG
   * already carried a mark — so the icon is carried by the template rather than
   * by either page's copy of it, and the same app cannot end up with two
   * different marks. Time tracker and Campaign approval flow are this page's
   * own, drawn for templates the portal rail does not list.
   *
   * Proposal builder is the one row still on the plain recess: nothing is drawn
   * for it, and the rail handles a slot with no art.
   *
   * Sizes are per-icon rather than shared: the artwork is drawn to different
   * boxes, and matching the rendered width would make them disagree.
   */
  icon?: React.ReactNode;
}[] = [
  {
    slug: "document-collection",
    title: "Year-end tax document collector",
    description: "Clients upload docs as they're ready.",
    vertical: "Accounting",
    icon: <IconTemplateDocuments className="w-[32px]" />,
  },
  {
    slug: "design-approvals",
    title: "Campaign approval flow",
    description: "Creative rounds, reviewed and signed.",
    vertical: "Marketing agency",
    icon: <IconTemplateApprovals className="w-[30px]" />,
  },
  {
    slug: "client-onboarding-wizard",
    title: "Client onboarding wizard",
    description: "Your steps, with saved progress.",
    vertical: "Professional services",
    icon: <IconTemplateOnboarding className="w-[26px]" />,
  },
  {
    slug: "client-project-tracker",
    title: "Client project tracker",
    description: "Milestones clients see for themselves.",
    vertical: "Consulting",
    icon: <IconTemplateProjects className="w-[22px]" />,
  },
  {
    slug: "proposal-builder",
    title: "Proposal builder",
    description: "Tiered packages clients accept and pay.",
    vertical: "Professional services",
    icon: <IconTemplateProposals className="w-[26px]" />,
  },
  {
    slug: "time-tracker",
    title: "Time tracker",
    description: "Billable hours, exported invoice-ready.",
    vertical: "Professional services",
    internal: true,
    icon: <IconTemplateTimeTracker className="w-[26px]" />,
  },
];

export function BuilderTemplates() {
  const cards = PICKS.filter((pick) => getTemplateBySlug(pick.slug)).map(
    (pick) => ({
      ...pick,
      href: `/templates/${pick.slug}`,
    }),
  );

  return (
    <section className="mx-auto max-w-[1200px] px-6 py-14 md:px-10 md:py-20">
      <Reveal>
        {/* The link sits under the copy rather than off to the right of
            it. Floated right it was level with the second line of the
            paragraph and a rail's width away from it, so it read as a
            control belonging to the section's edge rather than as the
            sentence's own next step. */}
        <div className="max-w-2xl">
          <h3 className="type-h3 text-balance">Not a builder? Start here</h3>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            20+ templates made for businesses like yours. Install one, then
            remix it with the builder.
          </p>
          <Link href="/templates" className={`mt-6 ${QUIET_BUTTON}`}>
            Browse all templates
          </Link>
        </div>

        {/* The same rows /client-portal runs — this was a grid of cover
            cards whose covers are empty frames, which is the one element
            drawn twice that this site's rules exist to stop. */}
        <TemplateRail cards={cards} cardClassName={BUILDER_RAIL_HALO} />
      </Reveal>
    </section>
  );
}
