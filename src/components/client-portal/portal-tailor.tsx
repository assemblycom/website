import Link from "next/link";
import { IconBolt, IconGlobe, IconSync } from "@/components/home/mock-icons";
import { Reveal } from "@/components/ui/reveal";
import { API_REFERENCE_URL, GUIDE_URL } from "@/lib/constants";
import {
  ApprovalsMock,
  DocumentsStatsMock,
  OnboardingMock,
  ProgressMock,
} from "@/components/client-portal/segment-mock";

/** Shared by every card in the set. */
const CARD = "rounded-3xl bg-muted [[data-theme=dark]_&]:bg-white/[0.04]";
const PAD = "p-6 md:p-10";
const TITLE = "text-base leading-snug";
const BODY = "mt-2 text-sm leading-relaxed text-muted-foreground";

/**
 * The three ways Assembly meets a stack a firm already runs, as the last card
 * in this set rather than a section of its own.
 *
 * Each row goes somewhere instead of opening a drawer, so the card hands the
 * reader on. No rules and an icon in a filled square: a short list of
 * destinations reads as a set, where hairlines would make it a table with three
 * entries in it.
 *
 * NOTE: the handoff leaves this link target undecided ("docs embeds page or
 * /templates", pending Vivienne). These are the nearest real routes the site
 * has and they resolve, but they stand in for that decision.
 */
const WAYS: {
  label: string;
  href: string;
  icon: (props: { className?: string }) => React.ReactElement;
}[] = [
  { label: "Embeds", href: GUIDE_URL, icon: IconGlobe },
  { label: "Integrations", href: API_REFERENCE_URL, icon: IconSync },
  { label: "Automations", href: GUIDE_URL, icon: IconBolt },
];

/**
 * The payoff: one portal, a different experience per client and per segment.
 *
 * This is also where the white-label keywords live. Branding is the number 3
 * value prop in the sales data, and per-client visibility is the reassurance
 * user interviews say buyers need most, so both are stated plainly rather than
 * left to the visual.
 */
export function PortalTailor() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 py-16 md:px-10 md:py-24">
      <Reveal>
        <div className="text-center">
          <h2 className="type-h2 mx-auto max-w-3xl text-balance">
            One portal. A different experience for every client
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-muted-foreground">
            Control which apps each client and company sees, brand it on your
            own domain, and give each segment the workflow it actually needs.
          </p>
        </div>

        {/* Four cards of four different shapes. Same-size cards each holding
            the same screenshot argue the opposite of what the heading says, so
            the set varies by width, by how much chrome each picture carries,
            and by where the copy sits. Not links: there is nothing to go to
            from here, and a hover state on a picture of an app invites a click
            the card cannot answer. */}
        <div className="mt-12 grid gap-4 md:mt-14 md:gap-5 lg:grid-cols-3">
          {/* Wide. The only card with the sidebar, because this is where the
              set establishes that all four are one portal. Cropped right and
              bottom so it reads as a window onto a running app. */}
          <div
            className={`flex flex-col overflow-hidden lg:col-span-2 ${CARD} ${PAD} pb-0 md:pb-0`}
          >
            <p className={TITLE}>A campaign approval flow</p>
            <p className={`${BODY} max-w-sm`}>
              Clients review and sign off on deliverables round by round.
            </p>
            <div
              className={`-mr-6 mt-8 min-h-[276px] flex-1 overflow-hidden rounded-tl-xl border-l border-t border-border shadow-[0_1px_2px_rgba(16,24,40,0.04),0_18px_40px_-28px_rgba(16,24,40,0.28)] md:-mr-10 md:mt-10 [[data-theme=dark]_&]:border-[#383838] [[data-theme=dark]_&]:shadow-[0_18px_44px_-28px_rgba(0,0,0,0.6)]`}
            >
              <ApprovalsMock />
            </div>
          </div>

          {/* The one card that is artwork rather than a window: progress is a
              shape, not a screen, so the diagram is drawn straight onto the
              card with no frame around it. */}
          <div className={`flex flex-col ${CARD} ${PAD}`}>
            <p className={TITLE}>A client progress dashboard</p>
            <p className={BODY}>Milestones and outcomes per engagement.</p>
            <div className="mt-6 min-h-[264px] flex-1">
              <ProgressMock />
            </div>
          </div>

          {/* Not a third row-and-chip screen: beside the onboarding board on
              its right that read as the same card twice. A headline figure
              over a column chart is a different kind of picture, which is
              what this set is built on. */}
          <div className={`flex flex-col ${CARD} ${PAD}`}>
            <p className={TITLE}>A year-end document collection app</p>
            <p className={BODY}>A per-client checklist with upload tracking.</p>
            <div className="mt-6 min-h-[232px] flex-1">
              <DocumentsStatsMock />
            </div>
          </div>

          {/* Wide, and a board of panels rather than one screen: the app is
              several things at once, and the bottom row runs off the card so
              the board reads as continuing past it. */}
          <div
            className={`flex flex-col overflow-hidden lg:col-span-2 ${CARD} ${PAD} pb-0 md:pb-0`}
          >
            <p className={TITLE}>A per-client onboarding wizard</p>
            <p className={`${BODY} max-w-md`}>
              Saves progress across steps, next to a secure data room.
            </p>
            <div
              className={`-mr-6 mt-8 min-h-[248px] flex-1 overflow-hidden rounded-tl-xl border-l border-t border-border md:-mr-10 md:mt-10 [[data-theme=dark]_&]:border-[#383838]`}
            >
              <OnboardingMock />
            </div>
          </div>

          {/* Closes the set: the four cards above are what one portal can look
              like per client, and this one says the tools they already run come
              with it. Full width, because it is a claim about all of them
              rather than a fifth example. */}
          <div
            className={`flex flex-col gap-6 lg:col-span-3 lg:flex-row lg:items-center lg:justify-between lg:gap-16 ${CARD} ${PAD}`}
          >
            <div className="max-w-md">
              <p className={TITLE}>Keep the tools you already use</p>
              <p className={BODY}>
                Embed what your clients already use, connect what you run, and
                automate the busywork. Every app connects to the same client
                records.
              </p>
            </div>

            <ul className="flex shrink-0 flex-col">
              {WAYS.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <Link
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    // -mx-3 px-3 so the hover fill extends past the type
                    // without the labels being indented out of the column.
                    className="group -mx-3 flex items-center gap-2.5 rounded-lg px-3 py-2 transition-colors hover:bg-foreground/[0.04] [[data-theme=dark]_&]:hover:bg-white/[0.04]"
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-background text-muted-foreground transition-colors group-hover:text-foreground [&>svg]:size-[18px] [[data-theme=dark]_&]:bg-white/[0.06]">
                      <Icon />
                    </span>
                    <span className="text-[15px] text-foreground">{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
