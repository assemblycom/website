import { Reveal } from "@/components/ui/reveal";
import { CardRail, RailCard } from "@/components/ui/card-rail";
import {
  BuildCard,
  DescribeCard,
  PlanCard,
} from "@/components/client-portal/portal-build-cards";

/**
 * How it works, as three cards rather than one empty frame over a rail.
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
const STEPS: {
  name: string;
  body: string;
  visual: React.ReactNode;
  picture?: "fit" | "center" | "below";
}[] = [
  {
    name: "Describe",
    body: "Say what you want, or start from a template.",
    visual: <DescribeCard />,
    // The shortest scene in the set — a composer and nothing else. Centred in
    // the space under the copy it read as sitting on the card's floor, and it
    // is small enough to clear the caption from the card's own centre line.
    picture: "center" as const,
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
    // The one scene drawn larger than the card — a 560x372 portal shot that
    // bleeds off the right. Centred it reaches up over this caption, so it
    // starts under the copy and crops at the foot instead.
    picture: "below" as const,
  },
];

export function BuilderHowItWorks() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 py-14 md:px-10 md:py-20">
      <Reveal>
        {/* Three, matching /client-portal's rail: Describe, Plan, Build is
            the arc. Iterate was a fourth beat that pushed the set past what
            fits across, so the rail had to be stepped through to be seen at
            all — and "keep chatting to change anything" is the one of the four
            a reader will assume anyway. */}
        <CardRail label="How building works">
          {STEPS.map((step, i) => (
            <RailCard
              key={step.name}
              index={`Step ${i + 1}`}
              name={step.name}
              caption={step.body}
              picture={step.picture}
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
