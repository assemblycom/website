import {
  BrandedPortalVisual,
  type PortalApp,
} from "@/components/ai-app-builder/branded-portal-visual";
import { IconAreaChart, IconChecks } from "@/components/home/mock-icons";

// ─────────────────────────────────────────────────────────────────────────
// THE AGENCY HERO SHOT — one screen, not a picker.
//
// /solutions/marketing-agency-client-portal used to open on the portal
// carousel: a grey panel with four app names along its foot and a "Your own
// app / Select a template" control, which is the hero /client-portal and the
// accounting page both run. Same component, same panel, same control, with
// three of its four slots swapped — so the page opened on a picture a visitor
// had already seen if they had been anywhere else on the site.
//
// This is the agency's portal instead, open on the one app its lead actually
// promises: a client signing off creative, in the agency's own colour, with
// the rest of the agency's apps in the nav beside it. Nothing to pick through
// — the claim is that the client already has this, so the hero shows it.
// ─────────────────────────────────────────────────────────────────────────

const LINE = "border-[var(--mock-line)]";

/** What a marketing agency has built, in the order its lead names them. */
const AGENCY_APPS: PortalApp[] = [
  { icon: <IconAreaChart />, label: "Campaign dashboard" },
  { icon: <IconChecks />, label: "Design approvals" },
];

/** A round of creative waiting on the client. */
const ASSETS = [
  { name: "Launch film, cut 03", when: "Uploaded 2 days ago" },
  { name: "Key art, variants A–C", when: "Uploaded yesterday" },
  { name: "Social cutdowns", when: "Uploaded yesterday" },
];

/**
 * What the round has been like so far, under the decision it is waiting on.
 *
 * It is here because the screen BLEEDS off the foot of its frame: with the
 * assets and two buttons and nothing else, the shot was a third of a screen
 * and two thirds of empty white, which is not a window onto anything. The
 * thread runs past the crop, which is what says the app continues.
 */
const THREAD = [
  {
    who: "Dana Whitfield",
    when: "2 days ago",
    says: "Cut 03 is close. Can we hold the end card a beat longer?",
  },
  {
    who: "Priya Raman",
    when: "Yesterday",
    says: "Reuploaded with the longer end card and the new strapline.",
  },
  {
    who: "Dana Whitfield",
    when: "Yesterday",
    says: "Key art variant B for the hero placements, please.",
  },
];

export function AgencyHeroVisual() {
  return (
    <BrandedPortalVisual
      brand="Brandmages"
      apps={AGENCY_APPS}
      title="Spring campaign"
    >
      <div className="min-h-0">
        {ASSETS.map(({ name, when }) => (
          <div
            key={name}
            className={`flex items-center gap-3 border-b py-2.5 last:border-b-0 ${LINE}`}
          >
            {/* The asset itself, as the product draws it: a thumbnail, not an
                icon. What is being approved is a picture. */}
            <span className="size-[30px] shrink-0 rounded-[5px] bg-[var(--mock-well-2)]" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[12.5px] leading-none text-[color:var(--mock-ink)]">
                {name}
              </span>
              <span className="mt-1 block truncate text-[11px] leading-none text-[color:var(--mock-ink-soft)]">
                {when}
              </span>
            </span>
          </div>
        ))}
        {/* The decision the round is waiting on. No status chips on the rows
            above: these two buttons already carry where it has got to. */}
        <div className="mt-4 flex items-center gap-2">
          <span className="rounded-[5px] bg-[var(--mock-ink)] px-3 py-[7px] text-[11.5px] leading-none text-[color:var(--mock-window)]">
            Approve
          </span>
          <span
            className={`rounded-[5px] border px-3 py-[7px] text-[11.5px] leading-none text-[color:var(--mock-ink-soft)] ${LINE}`}
          >
            Request changes
          </span>
        </div>

        <p className="mb-3 mt-7 text-[11px] uppercase tracking-wide text-[color:var(--mock-ink-soft)]">
          Activity
        </p>
        <div className="flex flex-col gap-4">
          {THREAD.map(({ who, when, says }) => (
            <div key={says} className="flex gap-2.5">
              <span className="mt-[1px] flex size-[22px] shrink-0 items-center justify-center rounded-full bg-[var(--mock-well-2)] text-[10px] leading-none text-[color:var(--mock-ink-soft)]">
                {who.charAt(0)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline gap-2">
                  <span className="truncate text-[12px] leading-none text-[color:var(--mock-ink)]">
                    {who}
                  </span>
                  <span className="shrink-0 text-[11px] leading-none text-[color:var(--mock-ink-soft)]">
                    {when}
                  </span>
                </span>
                <span className="mt-1.5 block text-[12.5px] leading-[1.45] text-[color:var(--mock-ink-soft)]">
                  {says}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </BrandedPortalVisual>
  );
}
