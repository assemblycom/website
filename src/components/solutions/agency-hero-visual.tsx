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
      </div>
    </BrandedPortalVisual>
  );
}
