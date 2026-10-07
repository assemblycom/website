import { Reveal } from "@/components/ui/reveal";
import {
  ApprovalsMock,
  DocumentsStatsMock,
  OnboardingMock,
} from "@/components/client-portal/segment-mock";
import { ProgressMock } from "@/components/client-portal/progress-donut";

/** Shared by every card in the set. The page's one panel grey — these were on
 *  --muted, which is a different grey from the tray and the template rows a
 *  section away, close enough to read as a mistake rather than a choice. */
const CARD = "rounded-3xl bg-[var(--surface)]";
const PAD = "p-6 md:p-10";
const TITLE = "text-base leading-snug";
const BODY = "mt-2 text-sm leading-relaxed text-muted-foreground";

/**
 * The payoff: one portal, a different experience per client and per segment.
 *
 * This is also where the white-label keywords live. Branding is the number 3
 * value prop in the sales data, and per-client visibility is the reassurance
 * user interviews say buyers need most, so both are stated plainly rather than
 * left to the visual.
 */
/** Heading and lead are props; the four cards are the same picture either way. */
export function PortalTailor({
  heading = "One portal. A different experience for every client",
  body = "Control which apps each client and company sees, brand it on your own domain, and give each segment the workflow it actually needs.",
  visual,
}: {
  heading?: string;
  body?: string;
  /**
   * One picture in place of the four cards. The grid is /client-portal's
   * argument — four apps of four different shapes, to prove they do not look
   * alike. A page whose handoff asks for a single picture here passes it, and
   * the four cards (which name that page's own firm) do not come with it.
   */
  visual?: React.ReactNode;
} = {}) {
  return (
    <section className="mx-auto max-w-[1200px] px-6 py-16 md:px-10 md:py-24">
      <Reveal>
        <div className="text-center">
          <h2 className="type-h2 mx-auto max-w-3xl text-balance">{heading}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-muted-foreground">
            {body}
          </p>
        </div>

        {visual ?? (
          <>
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
                  // .mock-edge, the same lit border the onboarding board's
                  // frame and the AI app builder's hero screen wear, on the
                  // identical shape — rounded-tl-xl with a left and top border
                  // and nothing on the other two sides, because the screen runs
                  // off the card there.
                  //
                  // This is the one card in the section that shows the whole
                  // portal, chrome and all, so it is the one most obviously
                  // pretending to be a window; a flat grey hairline around a
                  // near-black window reads as a line that has been dimmed
                  // rather than as a window catching the light.
                  //
                  // Its drop shadows are untouched and still do their own job:
                  // the ramp paints the BORDER, the shadows sit under the card.
                  // Dark only, which is where the class is defined.
                  //
                  // Default 540x400 ellipse, no -w/-h override: at 583x311 this
                  // frame is the same size as the onboarding one, which the
                  // default already suits.
                  className={`mock-edge -mr-6 mt-8 min-h-[276px] flex-1 overflow-hidden rounded-tl-xl border-l border-t border-[var(--mock-line)] bg-[var(--mock-window)] shadow-[0_1px_2px_rgba(16,24,40,0.04),0_18px_40px_-28px_rgba(16,24,40,0.28)] md:-mr-10 md:mt-10 [[data-theme=dark]_&]:shadow-[0_18px_44px_-28px_rgba(0,0,0,0.6)]`}
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
                <p className={BODY}>
                  A per-client checklist with upload tracking.
                </p>
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
                {/* Shorter on a phone, and the right edge gives out.
            
                This screen runs off the card's right side on purpose — it is a
                board that continues past the frame — but on a phone the cut
                landed as a hard vertical line down a column of panels, the same
                guillotine the card rail and the logo row both needed softening.
                A mask on the right only, at the same eased curve, so the board
                dissolves into the card instead of stopping on it. Below md
                only: from md the card is wide enough that the crop falls in
                empty space rather than through a panel.

                And 180px rather than 248: four stacked panels at full height
                made this the tallest thing on a phone by a long way, and the
                point of the picture is recognising a board, which the first two
                panels already do. The rest crops, which is what the card was
                always doing on its right. */}
                <div
                  // .mock-edge — the lit border the AI app builder's hero
                  // screen wears, on the identical shape: rounded-tl-xl with a
                  // left and top border and nothing on the other two sides,
                  // because the board runs off the card there.
                  //
                  // Dark only, which is where the class is defined. In light a
                  // flat --mock-line hairline is already a border against a
                  // bright card; in dark a single flat grey around a near-black
                  // panel reads as a line that has been dimmed rather than as
                  // an edge catching light, which is the whole reason the hero
                  // has this.
                  //
                  // The default 540x400 ellipse is kept — this box is ~583x301,
                  // close enough to the hero screen's own size that the ramp
                  // crosses it the same way, so no --mock-edge-w/-h override.
                  className={`mock-edge -mr-6 mt-8 min-h-[180px] flex-1 overflow-hidden rounded-tl-xl border-l border-t border-[var(--mock-line)] bg-[var(--mock-window)] max-md:[mask-image:linear-gradient(to_right,#000_0_78%,rgba(0,0,0,0.55)_90%,transparent_100%)] md:-mr-10 md:mt-10 md:min-h-[248px]`}
                >
                  <OnboardingMock />
                </div>
              </div>
            </div>
          </>
        )}
      </Reveal>
    </section>
  );
}
