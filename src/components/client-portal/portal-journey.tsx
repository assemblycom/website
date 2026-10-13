import Link from "next/link";
import { QUIET_BUTTON } from "@/components/ui/quiet-button";
import { CardRail, RailCard } from "@/components/ui/card-rail";
import { Reveal } from "@/components/ui/reveal";
import {
  ApprovalsMock,
  OnboardingMock,
} from "@/components/client-portal/segment-mock";
import { ProgressMock } from "@/components/client-portal/progress-chart";

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
 * Three of the five stages already had artwork drawn for them in the segment
 * grid (which handoff v2 retires), so the rail reuses those rather than
 * waiting on V4: the onboarding wizard is Onboard, the approvals flow is
 * Collaborate, and the progress dashboard is Track. Transact and Support are
 * the two that had no picture and still carry a pending slot each — two card
 * sized gaps rather than one section-sized one.
 *
 * CardRail is the site's own stepped row: arrows at the foot, snap points,
 * drag to scroll, and all three stand down at a width where every card
 * already fits. It is what /client-portal's build rail runs, so the two rails
 * on this page are one object. It also replaces what the sticky frame needed
 * and could not have here — per the repo's CLAUDE.md, IntersectionObserver
 * never fires in the preview pane, so a scroll-driven sequence cannot be
 * checked there; a rail is driven by the reader instead and has nothing to
 * verify in a real browser that the pane cannot show.
 */
const STAGES: {
  name: string;
  body: string;
  visual: React.ReactNode;
}[] = [
  {
    name: "Onboard",
    body: "Walk new clients through intake, document collection, and a clear first-steps checklist, with progress saved along the way.",
    visual: <Window><OnboardingMock /></Window>,
  },
  {
    name: "Collaborate",
    body: "Clients review work, leave feedback, and sign off round by round, with shared files in the same place.",
    visual: <Window><ApprovalsMock /></Window>,
  },
  {
    name: "Track",
    body: "Every client sees the status, milestones, and key dates on their own engagement without asking.",
    // No frame: progress is a shape rather than a screen, so the diagram is
    // drawn straight onto the card. Same call the segment grid made for it.
    visual: (
      <div className="h-full overflow-hidden">
        <ProgressMock />
      </div>
    ),
  },
  {
    name: "Transact",
    body: "Proposals clients can accept, contracts they can sign, and invoices they can pay, all in your brand.",
    visual: (
      <PendingSlot title="V4 Transact — a proposal accepted, a contract signed and an invoice marked Paid, stacked in one view in the client's brand. Art direction pending." />
    ),
  },
  {
    name: "Support",
    body: "Clients get help from a request queue, a resource library, and an assistant that answers from your own docs.",
    visual: (
      <PendingSlot title="V4 Support — a help request answered beside the resource library open to a guide, with the messages drawer carrying a 'Replied by email' badge. Art direction pending." />
    ),
  },
];

/**
 * The window the two screen-type mocks sit in: `.mock-edge` on a top-left
 * corner with no right or bottom border, so the screen runs off the card the
 * way the same mocks did in the segment grid. Lifted verbatim from there
 * rather than redrawn, so the two treatments cannot drift.
 */
function Window({ children }: { children: React.ReactNode }) {
  return (
    <div className="mock-edge h-full overflow-hidden rounded-tl-xl border-l border-t border-[var(--mock-line)] bg-[var(--mock-window)] shadow-[0_1px_2px_rgba(16,24,40,0.04),0_18px_40px_-28px_rgba(16,24,40,0.28)] [[data-theme=dark]_&]:shadow-[0_18px_44px_-28px_rgba(0,0,0,0.6)]">
      {children}
    </div>
  );
}

/** A card whose picture is not drawn yet, at the shape the art will take. */
function PendingSlot({ title }: { title: string }) {
  return (
    <div
      aria-hidden
      title={title}
      className="h-full rounded-tl-xl bg-[var(--surface)] [[data-theme=dark]_&]:bg-white/[0.04]"
    />
  );
}

export function PortalJourney({
  id,
  heading = "Give your clients a unified experience",
  body = "Onboarding, collaboration, and ongoing support: nothing in the whole client journey falls through the cracks.",
  stages = STAGES,
  supportLine = "Running through every stage: secure messaging clients can answer from their inbox, and a personalized Home screen that shows each client only what is theirs.",
  templatesLine = "30+ ready-made app templates. Every one is a working app: install it, use it as is, or tell the builder what to change.",
  link = { label: "Browse templates", href: "/templates" },
  railLabel = "The client journey",
}: {
  /** An anchor, for a section above that jumps here. */
  id?: string;
  heading?: string;
  body?: string;
  stages?: typeof STAGES;
  supportLine?: string;
  templatesLine?: string;
  link?: { label: string; href: string };
  railLabel?: string;
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

        {/* Numbered, because the five are a sequence rather than a feature
            set — it is the one thing distinguishing this rail from the build
            rail further down, which numbers its cards for the same reason. */}
        <div className="mt-12 md:mt-14">
          <CardRail label={railLabel}>
            {stages.map((stage, i) => (
              <RailCard
                key={stage.name}
                index={`Stage ${i + 1}`}
                name={stage.name}
                caption={stage.body}
                // The scenes are drawn larger than the card and are windows
                // onto something that continues, so they start under the
                // caption and crop at the foot rather than being shrunk to
                // fit. Same choice the segment grid made for these two.
                picture="below"
              >
                {stage.visual}
              </RailCard>
            ))}
          </CardRail>
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
