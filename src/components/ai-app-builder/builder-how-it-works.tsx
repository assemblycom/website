import { Reveal } from "@/components/ui/reveal";
import { CardRail, RailCard } from "@/components/ui/card-rail";
import {
  BuildCard,
  DescribeCard,
  IterateCard,
  PlanCard,
} from "@/components/client-portal/portal-build-cards";

/**
 * How it works, as four cards rather than one empty frame over a rail.
 *
 * It was a 16:9 slot waiting on a picture that does not exist, with the four
 * steps as captions beneath it — so the section's whole middle was a dashed
 * rectangle, and the steps were text under a hole.
 *
 * The cards are the rail /client-portal's build section already runs, in its
 * copy-inside arrangement: the step names the beat, the line says what happens,
 * and the picture under it runs off the card's bottom edge. No action on a
 * card — the chapter's own CTA is the way out of this part of the page, and a
 * button on every step would ask four times.
 */
const STEPS = [
  {
    name: "Describe",
    body: "Say what you want, or start from a template.",
    visual: <DescribeCard />,
  },
  {
    name: "Plan",
    body: "Approve or edit the plan before anything is built.",
    visual: <PlanCard />,
  },
  {
    name: "Build",
    body: "Client apps land in your client experience, team tools in your dashboard.",
    visual: <BuildCard />,
  },
  {
    name: "Iterate",
    body: "Keep chatting to change anything, before launch or six months later.",
    visual: <IterateCard />,
  },
];

export function BuilderHowItWorks() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 py-14 md:px-10 md:py-20">
      <Reveal>
        <CardRail label="How building works">
          {STEPS.map((step, i) => (
            <RailCard
              key={step.name}
              index={`Step ${i + 1}`}
              name={step.name}
              caption={step.body}
              copyInside
            >
              {step.visual}
            </RailCard>
          ))}
        </CardRail>
      </Reveal>
    </section>
  );
}
