import { CardRail, RailCard } from "@/components/ui/card-rail";
import { Reveal } from "@/components/ui/reveal";
import {
  BuildCard,
  DescribeCard,
  IterateCard,
  PlanCard,
  SecuredCard,
} from "@/components/client-portal/portal-build-cards";

/**
 * Section 4 of handoff v2, and the page's new centre of gravity: a client's
 * whole journey, from onboarding to ongoing support, in one portal.
 *
 * A RAIL, NOT A STICKY FRAME. The handoff draws V4 as one portal frame whose
 * main panel changes across five scroll-driven beats, and the first pass here
 * built that layout with the frame as a pending slot. It shipped as one large
 * empty rectangle beside a numbered list, because the art for it does not
 * exist — the section carrying the page's weight was the only one on the page
 * with nothing in it.
 *
 * THE COPY IS THE HANDOFF'S, THE SCENES ARE THE BUILD RAIL'S. All five
 * build-card scenes already exist and were drawn for a rail of exactly this
 * shape; V4's own art does not. So the five stages carry their handoff
 * captions over the five scenes rather than over empty slots.
 *
 * The scenes therefore illustrate the builder rather than the client journey —
 * Describe's composer sits under "Onboard", Secured's permissions under
 * "Support". That is a deliberate stand-in, not a mapping: when V4 is drawn,
 * replace the five `visual`s here and nothing else moves.
 *
 * This is also why the page no longer runs PortalBuild: the same five scenes
 * cannot appear twice. The build section's own copy lives on /ai-app-builder,
 * which handoff v2 is explicit about.
 *
 * CardRail is the site's own stepped row: arrows at the foot, snap points,
 * drag to scroll, and all three stand down at a width where every card
 * already fits. It is what the build rail ran, and the arrows are what lets
 * this one carry five cards — the build rail was cut to three precisely
 * because a fourth and fifth "had to be stepped through to be seen at all".
 * It also sidesteps what the sticky frame could not have here: per the repo's
 * CLAUDE.md, IntersectionObserver never fires in the preview pane, so a
 * scroll-driven sequence cannot be checked there, where a reader-driven rail
 * has nothing the pane cannot show.
 */
const STAGES: {
  name: string;
  body: string;
  visual: React.ReactNode;
}[] = [
  {
    name: "Onboard",
    body: "Walk new clients through intake, document collection, and a clear first-steps checklist, with progress saved along the way.",
    visual: <DescribeCard />,
  },
  {
    name: "Collaborate",
    body: "Clients review work, leave feedback, and sign off round by round, with shared files in the same place.",
    visual: <PlanCard />,
  },
  {
    name: "Track",
    body: "Every client sees the status, milestones, and key dates on their own engagement without asking.",
    visual: <BuildCard />,
  },
  {
    name: "Transact",
    body: "Proposals clients can accept, contracts they can sign, and invoices they can pay, all in your brand.",
    visual: <IterateCard />,
  },
  {
    name: "Support",
    body: "Clients get help from a request queue, a resource library, and an assistant that answers from your own docs.",
    visual: <SecuredCard />,
  },
];

export function PortalJourney({
  id,
  heading = "Give your clients a unified experience",
  body = "Onboarding, collaboration, and ongoing support: nothing in the whole client journey falls through the cracks.",
  stages = STAGES,
  railLabel = "The client journey",
}: {
  /** An anchor, for a section above that jumps here. */
  id?: string;
  heading?: string;
  body?: string;
  stages?: typeof STAGES;
  railLabel?: string;
} = {}) {
  return (
    <section
      id={id}
      className="mx-auto max-w-[1200px] px-6 py-16 md:px-10 md:py-24"
    >
      <Reveal>
        {/* SPLIT HEADER: heading left, lead beside it rather than under it.
            The same two-column head the hero on this page runs, at the same
            proportions, so the page opens and turns its corner the same way.

            It stacks below lg, where there is no second column for the lead
            to stand in — and stacked it is the plain heading-then-lead this
            was before. */}
        <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-x-16">
          <h2 className="type-h2 text-balance">{heading}</h2>
          <p className="text-pretty text-muted-foreground lg:pt-2">{body}</p>
        </div>

        {/* Numbered, because the five are a sequence rather than a feature
            set rather than a feature set, which is what the numbered kicker
            on each card says and the reason this is an ordered read. */}
        <div className="mt-12 md:mt-14">
          <CardRail label={railLabel}>
            {stages.map((stage, i) => (
              <RailCard
                key={stage.name}
                index={`Stage ${i + 1}`}
                name={stage.name}
                caption={stage.body}
              >
                {stage.visual}
              </RailCard>
            ))}
          </CardRail>
        </div>

        {/* The section ends on the rail. The handoff closes it with two
            support lines — one on messaging and the Home screen, one on
            templates with a Browse link. The templates pair is its own
            section now, and the messaging line went with it: under a rail of
            five cards a lone grey paragraph read as a caption to the last
            card rather than as a claim about all of them. */}
      </Reveal>
    </section>
  );
}
