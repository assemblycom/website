import { GRID_LINE } from "@/components/ui/grid-lines";
import { Reveal } from "@/components/ui/reveal";
import { VisualSlot } from "@/components/ui/visual-slot";

interface Step {
  name: string;
  body: string;
  /** Spotlit steps get an illustrated card below; the rest are named only. */
  spotlight?: boolean;
}

// Four cards side by side, so they are read as a set rather than in turn: the
// copy is cut to one length, roughly 60 to 70 characters, which holds at three
// lines from 1024 up. What a step needs beyond that is carried by the
// spotlights below it, the pillars above, or the FAQ.
const STEPS: Step[] = [
  {
    name: "Describe",
    body: "Say what you want in plain English, or start from a template.",
  },
  {
    name: "Plan",
    spotlight: true,
    body: "Assembly asks a few questions, then shows a plan you approve.",
  },
  {
    name: "Build",
    body: "The app lands in your workspace, hidden from clients until you publish.",
  },
  {
    name: "Iterate",
    spotlight: true,
    body: "Keep chatting to change it, before launch or six months later.",
  },
];

/**
 * How it works, weighted rather than even.
 *
 * All four steps are named in a rail across the top so the sequence is legible,
 * but only Plan and Iterate are illustrated. Describe and Build are the beats
 * the hero already shows, and drawing them again a scroll later reads as the
 * same demo twice. Plan carries the page's strongest trust moment, and Iterate
 * appears nowhere else.
 */
export function BuilderHowItWorks() {
  const spotlights = STEPS.filter((s) => s.spotlight);
  return (
    <section className="mx-auto max-w-[1200px] px-6 py-16 md:px-10 md:py-24">
      <Reveal>
        <h2 className="type-h2 text-balance">How it works</h2>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Nothing is built until you have seen the plan, and nothing reaches a
          client until you make it visible.
        </p>

        <ol className={`mt-10 grid divide-y rounded-xl border md:grid-cols-4 md:divide-x md:divide-y-0 ${GRID_LINE} divide-border [[data-theme=dark]_&]:divide-[#383838]`}>
          {STEPS.map((step, i) => (
            <li key={step.name} className="p-5">
              <span className="type-eyebrow text-muted-foreground">
                Step {i + 1}
              </span>
              <p className="mt-2 text-sm">{step.name}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.body}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {spotlights.map((step) => (
            <VisualSlot
              key={step.name}
              ratio="4 / 3"
              label={
                step.name === "Plan"
                  ? "Spotlight, plan and approve"
                  : "Spotlight, iterate"
              }
              description={
                step.name === "Plan"
                  ? "A real Plan summary card, large enough to read the actual copy on it: what it will build, what data it will use, who will see it, with a visible Approve and Edit pair. Caption: You approve before anything builds."
                  : "A chat bubble with a plain-language edit request and the app visibly updating beside it, as a before and after or a subtle diff highlight. Caption: Keep changing it, before launch or six months after."
              }
            />
          ))}
        </div>
      </Reveal>
    </section>
  );
}
