"use client";

import { IconPlus } from "@/components/home/mock-icons";
import { IconCheckCircleOutline } from "@/components/ai-app-builder/builder-hero-visual";
import { TRACKER_PLAN_DOC } from "@/components/client-portal/portal-build-cards";
import { MOCK_BODY, MOCK_PRIMARY, MOCK_TITLE } from "@/components/ui/mock-type";

const LINE = "border-[var(--mock-line)]";
const INK = "text-[color:var(--mock-ink)]";
const SOFT = "text-[color:var(--mock-ink-soft)]";
/** The thread's measure, centred in the window as the product centres it. */
const COLUMN = "mx-auto w-full max-w-[520px]";

/**
 * The Plan step on a wide screen: the builder's own plan view, filling the
 * panel. The thread (your request, the builder's reply, the requirements
 * card) runs down a centred column and the composer sits at its foot with the
 * Requirements bar and Approve on top, as the product draws it.
 *
 * NO SIDEBAR. Where the app lives is the Publish step's subject; this step is
 * only what the plan says and whether you accept it.
 *
 * The request is the Describe step's sentence verbatim, so the steps read as
 * one session rather than separate screenshots.
 */
export function PlanScreen() {
  const doc = TRACKER_PLAN_DOC;
  return (
    <div
      className={`flex size-full flex-col overflow-hidden rounded-t-[14px] border border-b-0 ${LINE} bg-[var(--mock-window)] px-8 pb-5 pt-5 ${INK}`}
    >
      {/* The thread. The plan card has no foot: it runs down behind the
          composer and its text fades out just above the tray, as the product
          scrolls it. */}
      <div className={`${COLUMN} flex min-h-0 flex-1 flex-col gap-3.5`}>
        <p
          className={`ml-auto w-fit max-w-[75%] shrink-0 rounded-[4px] bg-[var(--mock-well-2)] px-3.5 py-2.5 ${MOCK_BODY}`}
        >
          Add a project tracker each client sees for their own projects.
        </p>
        <p className={`max-w-[90%] shrink-0 ${MOCK_BODY}`}>
          Got it. Here is the plan to review.
        </p>
        <div
          className={`relative min-h-0 flex-1 overflow-hidden rounded-t-[6px] border border-b-0 ${LINE} px-4 pt-3.5 [mask-image:linear-gradient(to_bottom,#000_calc(100%-72px),transparent)]`}
        >
          <p className={MOCK_TITLE}>Overview</p>
          <p className={`mt-1 ${SOFT} ${MOCK_BODY}`}>{doc.overview}</p>
          <p className={`mt-4 ${MOCK_TITLE}`}>Core flows</p>
          <ul className={`mt-1 space-y-2 ${SOFT} ${MOCK_BODY}`}>
            {doc.flows.map((flow) => (
              <li key={flow} className="flex gap-2.5">
                <span aria-hidden>•</span>
                <span>{flow}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* The composer as the product draws it: a gray tray with rounded top
          corners holding the Requirements row, and the white text box as its
          own bordered box tucked into the tray's foot. 6px on the tray and box, 4px on the buttons. */}
      <div
        className={`${COLUMN} shrink-0 rounded-[6px] bg-[var(--mock-well-2)]`}
      >
        <div className="flex items-center justify-between py-1.5 pl-4 pr-1.5">
          <span className={`flex items-center gap-2 ${MOCK_BODY}`}>
            <IconCheckCircleOutline className="size-3.5" />
            Requirements
          </span>
          <span
            className={`flex cursor-pointer items-center rounded-[4px] border ${LINE} bg-[var(--mock-window)] px-2.5 py-1 transition-colors hover:bg-[var(--mock-well)] ${MOCK_BODY}`}
          >
            Approve
          </span>
        </div>
        <div
          className={`rounded-[6px] border ${LINE} bg-[var(--mock-window)] pb-2 pl-4 pr-2 pt-3`}
        >
          <p className={`${SOFT} ${MOCK_BODY}`}>Type to revise plan</p>
          <div className="mt-4 flex items-center justify-between">
            <IconPlus className={`-ml-0.5 size-[14px] ${SOFT}`} />
            <span className="flex items-center gap-3">
              <span className={`${SOFT} ${MOCK_PRIMARY}`}>Auto</span>
              {/* The arrow is the type's own glyph (PP Mori), not an icon. */}
              <span className="flex size-6 items-center justify-center rounded-[4px] bg-[var(--mock-ink)] text-[13px] leading-none text-[color:var(--mock-window)]">
                ↑
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * The Iterate step on a wide screen: the same builder window as the Plan
 * step, now carrying the change request and the builder's answer, with the
 * empty composer at its foot. Phones keep the chat bubbles on the photograph.
 */
export function IterateScreen() {
  return (
    <div
      className={`flex size-full flex-col overflow-hidden rounded-t-[14px] border border-b-0 ${LINE} bg-[var(--mock-window)] px-8 pb-5 pt-5 ${INK}`}
    >
      {/* The thread from the top of the window, opening on the previous turn
          (the publish), so the window has no empty band above it. */}
      <div
        className={`${COLUMN} flex min-h-0 flex-1 flex-col justify-start gap-3.5 overflow-hidden pb-4 pt-3`}
      >
        <p className={`max-w-[90%] shrink-0 ${MOCK_BODY}`}>
          Published. Your project tracker is live in the client experience.
        </p>
        <p
          className={`ml-auto w-fit max-w-[75%] shrink-0 rounded-[4px] bg-[var(--mock-well-2)] px-3.5 py-2.5 ${MOCK_BODY}`}
        >
          Add a due date to every project, and sort the list so the ones due
          soonest are at the top.
        </p>
        <p className={`max-w-[90%] shrink-0 ${MOCK_BODY}`}>
          Got it. Adding due dates and sorting by the soonest.
        </p>
        <p className={`flex shrink-0 items-center gap-2 ${SOFT} ${MOCK_BODY}`}>
          <span
            aria-hidden
            className="size-[13px] shrink-0 rounded-full border-2 border-[var(--mock-line)] border-t-[color:var(--mock-ink-soft)] motion-safe:animate-spin"
          />
          Applying your change now.
        </p>
      </div>
      <div
        className={`${COLUMN} shrink-0 rounded-[6px] border ${LINE} bg-[var(--mock-window)] px-3 pb-2 pt-2.5`}
      >
        {/* The caret sits at the field's start, before the placeholder, as
            in a focused empty input. Hard on/off blink, the site's own. */}
        <p className={`flex items-center ${SOFT} ${MOCK_BODY}`}>
          <span
            aria-hidden
            className="-ml-px mr-px inline-block h-[1.1em] w-px bg-[var(--mock-ink)] motion-safe:[animation:caret_1.06s_step-end_infinite]"
          />
          Ask for a change
        </p>
        <div className="mt-3 flex items-center justify-between">
          <IconPlus className={`size-[14px] ${SOFT}`} />
          <span className="flex items-center gap-2.5">
            <span className={`${SOFT} ${MOCK_PRIMARY}`}>Auto</span>
            <span className="flex size-6 items-center justify-center rounded-[4px] bg-[var(--mock-ink)] text-[13px] leading-none text-[color:var(--mock-window)]">
              ↑
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
