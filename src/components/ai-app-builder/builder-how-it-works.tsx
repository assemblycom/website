import { Reveal } from "@/components/ui/reveal";
import { StepRail, type RailStep } from "@/components/ui/step-rail";
import { VisualSlot } from "@/components/ui/visual-slot";

// Four steps side by side, so they are read as a set rather than in turn: the
// copy is cut to one length, roughly 60 to 70 characters, which holds at three
// lines from 1024 up. What a step needs beyond that is carried by the pillars
// above or the FAQ.
const STEPS: RailStep[] = [
  {
    name: "Describe",
    body: "Say what you want in plain English, or start from a template.",
  },
  {
    name: "Plan",
    body: "Assembly asks a few questions, then shows a plan you approve.",
  },
  {
    name: "Build",
    body: "The app lands in your workspace, hidden from clients until you publish.",
  },
  {
    name: "Iterate",
    body: "Keep chatting to change it, before launch or six months later.",
  },
];

/**
 * How it works: one frame of the build, then the four steps as a single rail
 * beneath it.
 */
export function BuilderHowItWorks() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 py-14 md:px-10 md:py-20">
      <Reveal>
        <VisualSlot
          className="mb-12"
          ratio="16 / 9"
          label="How it works"
          description="The build in one frame: a prompt and its clarifying question on the left, the Plan card mid-approval in the centre, and the finished app open in the workspace on the right. Real product chrome, no robot or circuit imagery."
        />
        <StepRail steps={STEPS} />
      </Reveal>
    </section>
  );
}
