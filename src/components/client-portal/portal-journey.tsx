import Link from "next/link";
import { QUIET_BUTTON } from "@/components/ui/quiet-button";
import { Reveal } from "@/components/ui/reveal";

/**
 * Section 4 of handoff v2, and the page's new centre of gravity: one client's
 * whole year in one portal frame, five stages deep.
 *
 * WHY THIS IS NOT A TAB STRIP. The live page made this argument with four tabs,
 * and the handoff is explicit that it ships as a sequence instead — a tab strip
 * asks the reader to choose which stage to look at, when the claim is that
 * there is no choosing, the whole journey is in one place. Read top to bottom,
 * the five stages are the argument; clicked one at a time they are five
 * features.
 *
 * THE FRAME IS STICKY, THE CARDS SCROLL. V4 in the handoff is one portal frame
 * whose main panel changes as each stage comes up. The art for it is marked
 * "Needs design", so what ships here is the layout that art will drop into: the
 * frame holds its place in the left column while the five cards pass it on the
 * right. When the shot exists it becomes the frame's contents and the five
 * beats key off the cards already in place.
 *
 * NOTE FOR WHOEVER WIRES THE BEATS UP. Driving the frame from scroll position
 * means IntersectionObserver, which per the repo's CLAUDE.md never fires in the
 * preview pane — the pane runs with `document.visibilityState === "hidden"`, so
 * the frame will look stuck there and be fine in a real browser. Check it on a
 * preview URL, not in the pane. The handoff's own fallback for reduced motion
 * is a static filmstrip of the five beats, which is also what this layout
 * degrades to on a phone, where the frame is not sticky and the cards simply
 * stack.
 */
const STAGES: { name: string; body: string }[] = [
  {
    name: "Onboard",
    body: "Walk new clients through intake, document collection, and a clear first-steps checklist, with progress saved along the way.",
  },
  {
    name: "Collaborate",
    body: "Clients review work, leave feedback, and sign off round by round, with shared files in the same place.",
  },
  {
    name: "Track",
    body: "Every client sees the status, milestones, and key dates on their own engagement without asking.",
  },
  {
    name: "Transact",
    body: "Proposals clients can accept, contracts they can sign, and invoices they can pay, all in your brand.",
  },
  {
    name: "Support",
    body: "Clients get help from a request queue, a resource library, and an assistant that answers from your own docs.",
  },
];

export function PortalJourney({
  id,
  heading = "Give your clients a unified experience",
  body = "Onboarding, collaboration, and ongoing support: nothing in the whole client journey falls through the cracks.",
  stages = STAGES,
  supportLine = "Running through every stage: secure messaging clients can answer from their inbox, and a personalized Home screen that shows each client only what is theirs.",
  templatesLine = "30+ ready-made app templates. Every one is a working app: install it, use it as is, or tell the builder what to change.",
  link = { label: "Browse templates", href: "/templates" },
}: {
  /** An anchor, for a section above that jumps here. */
  id?: string;
  heading?: string;
  body?: string;
  stages?: typeof STAGES;
  supportLine?: string;
  templatesLine?: string;
  link?: { label: string; href: string };
} = {}) {
  return (
    <section
      id={id}
      className="mx-auto max-w-[1200px] px-6 py-16 md:px-10 md:py-24"
    >
      <Reveal>
        <div className="max-w-2xl">
          <h2 className="type-h2 text-balance">{heading}</h2>
          <p className="mt-4 text-muted-foreground">{body}</p>
        </div>

        <div className="mt-12 grid gap-10 md:mt-16 lg:grid-cols-2 lg:gap-16">
          {/* THE FRAME. Sticky only from lg, where there is a second column
              for the cards to pass it in. Below that it is a plain picture at
              the top of the stack, because a frame that sticks on a phone
              covers the copy it is supposed to illustrate.

              `top-24` clears the site header; the height is V4's 16:9 at this
              column's measure, so the slot holds the proportion the art is
              being drawn to rather than collapsing to nothing before it
              lands. */}
          <div
            aria-hidden
            title="V4 — one client's year in one Brandmages portal frame: a journey path of five nodes across the top, the messages drawer open throughout, and the main panel changing through onboard, collaborate, track, transact and support. Art direction pending."
            className="h-[260px] rounded-3xl bg-[var(--surface)] sm:h-[340px] lg:sticky lg:top-24 lg:h-[420px]"
          />

          {/* The five stages, numbered. The number is the sequence made
              visible — it is the one thing distinguishing this from a feature
              list, and it is why they are an ordered list rather than a grid
              of cards. Dotted rules are this page's list treatment, used by
              the FAQ and the stack section; a sixth idea about dividers would
              only be a sixth idea. */}
          <ol className="flex flex-col">
            {stages.map((stage, i) => (
              <li
                key={stage.name}
                className="flex gap-5 border-t border-border py-6 first:border-t-0 first:pt-0 [[data-theme=dark]_&]:border-[#383838]"
              >
                <span className="type-caption shrink-0 pt-0.5 font-mono tabular-nums text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <p className="text-base leading-snug text-foreground">
                    {stage.name}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {stage.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* The two support lines close the section. The first is what runs
            through every stage above; the second is the way in. They are two
            paragraphs rather than one because they answer different
            questions — "what is always there" and "what do I start from" —
            and the link belongs to the second. */}
        <div className="mt-12 max-w-2xl md:mt-14">
          {supportLine ? (
            <p className="text-sm text-muted-foreground">{supportLine}</p>
          ) : null}
          {templatesLine ? (
            <p className="mt-4 text-sm text-muted-foreground">
              {templatesLine}
            </p>
          ) : null}
          {link ? (
            <Link href={link.href} className={`mt-6 ${QUIET_BUTTON}`}>
              {link.label}
            </Link>
          ) : null}
        </div>
      </Reveal>
    </section>
  );
}
