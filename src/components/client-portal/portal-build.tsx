import { Reveal } from "@/components/ui/reveal";
import { StepRail, type RailStep } from "@/components/ui/step-rail";
import { VisualSlot } from "@/components/ui/visual-slot";

// Cut to two lines each. Left to their natural lengths they ran from two lines
// to six, and a row read across does not survive one column being twice the
// depth of its neighbours.
const STEPS: RailStep[] = [
  {
    name: "Describe",
    body: "Say what you want in plain English, or start from a template.",
  },
  {
    name: "Plan",
    body: "The builder asks a few questions, then shows a plan you approve.",
  },
  {
    name: "Build",
    body: "A real app lands in your workspace, hidden until you publish.",
  },
  {
    name: "Iterate",
    body: "Keep chatting to change it, before launch or long after.",
  },
];

/**
 * Where the page earns its headline: the mechanism, and the trust moment.
 *
 * It sits after the ready-made apps deliberately. Leading with the builder
 * would read as a developer tool to the operator this page is for; leading with
 * what is already there makes them safe enough to read this.
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
            Tell us what you want. Assembly shows you a plan to approve, then
            ships the app into your portal with logins, branding, and payments
            already handled.
          </p>
        </div>

        <VisualSlot
          className="mb-12 mt-10"
          ratio="16 / 9"
          label="Build visual"
          description="Two panels, prompt on the left and portal on the right. Left: a chat thread where the operator asks for a project tracker each client sees for their own project, and the builder replies with a readable Plan card listing the fields, who sees it, and the team view, with Approve and Edit. Right: the Brandmages portal with a new Project Tracker item appearing in the sidebar and a Hidden from clients toggle on the new app, switched off."
        />

        <StepRail steps={STEPS} />
      </Reveal>
    </section>
  );
}
