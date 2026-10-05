import { Reveal } from "@/components/ui/reveal";
import { CardRail, RailCard } from "@/components/ui/card-rail";
import {
  BuildCard,
  DescribeCard,
  IterateCard,
  PlanCard,
} from "@/components/client-portal/portal-build-cards";

// Copy follows the handoff's section 5, trimmed so every caption sets to two
// lines at the card's width — a rail whose captions run one, three, three and
// two lines deep has a ragged foot, and the cards stop reading as a set.
const STEPS = [
  {
    name: "Describe",
    body: "Say what you want in plain English, or start from a working template.",
    visual: <DescribeCard />,
  },
  {
    name: "Plan",
    body: "The builder asks a few questions, then shows a plan you approve or edit.",
    visual: <PlanCard />,
  },
  {
    name: "Build",
    body: "A real app lands in your clients’ portal, branded as yours, when you publish.",
    visual: <BuildCard />,
  },
  {
    name: "Iterate",
    body: "Keep chatting to change anything, before launch or six months later.",
    visual: <IterateCard />,
  },
];

/**
 * Where the page earns its headline: the mechanism, and the trust moment.
 *
 * It sits after the ready-made apps deliberately. Leading with the builder
 * would read as a developer tool to the operator this page is for; leading with
 * what is already there makes them safe enough to read this.
 *
 * Drawn as a rail rather than one composed shot: the four steps are a sequence,
 * and a sequence reads better as four pictures you move through than as one
 * picture with the steps listed underneath it.
 */
export function PortalBuild() {
  return (
    <section
      id="build"
      className="mx-auto max-w-[1200px] px-6 py-16 md:px-10 md:py-24"
    >
      <Reveal>
        <div className="text-center">
          <h2 className="type-h2 mx-auto max-w-3xl text-balance">
            Build the features unique to your firm
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-muted-foreground">
            Tell us what you want in plain English. The builder shows a plan to
            approve or edit, then builds a real app into your portal with
            logins, permissions and branding handled.
          </p>
        </div>

        <div className="mt-12">
          <CardRail
            label="How building works"
          >
            {STEPS.map((step, i) => (
              <RailCard
                key={step.name}
                index={`Step ${i + 1}`}
                name={step.name}
                caption={step.body}
              >
                {step.visual}
              </RailCard>
            ))}
          </CardRail>
        </div>
      </Reveal>
    </section>
  );
}
