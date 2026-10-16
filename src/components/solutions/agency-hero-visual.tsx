import {
  BrandedPortalVisual,
  type PortalApp,
} from "@/components/ai-app-builder/branded-portal-visual";
import {
  IconBloomhouseMark,
  IconCalendarDays,
  IconChevronDown,
  IconFilter,
  IconMegaphone,
  IconPenNib,
  IconSearch,
  IconTrackerBoard,
  IconTrackerGantt,
  IconTrackerList,
  IconTrackerPlus,
  IconTrackerSliders,
  IconTrackerTable,
} from "@/components/home/mock-icons";
import {
  MOCK_BODY,
  MOCK_MICRO,
  MOCK_SECONDARY,
} from "@/components/ui/mock-type";

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
// This is the agency's portal instead, open on its project tracker: every
// client engagement on one timeline, in the agency's own colour, with the rest
// of the agency's apps in the nav beside it. Nothing to pick through
// — the claim is that the client already has this, so the hero shows it.
//
// Every size is a step on the shared mock scale (ui/mock-type.ts), the same
// one the accounting page's screens use, and nothing is set in capitals. On a
// phone the nav steps aside and the tracker has the window.
// ─────────────────────────────────────────────────────────────────────────

const LINE = "border-[var(--mock-line)]";

/**
 * What a marketing agency has built, in the order its lead names them: the
 * brief that starts the work, the sign-off on it, and the tracker that is
 * open. Short names, because the nav truncates past ~16 characters.
 */
const AGENCY_APPS: PortalApp[] = [
  { icon: <IconPenNib />, label: "Creative briefs" },
  { icon: <IconMegaphone />, label: "Creative approvals" },
  { icon: <IconCalendarDays />, label: "Project tracker" },
];

// ─────────────────────────────────────────────────────────────────────────
// THE OPEN APP — the Client Project Tracker template, in its timeline view,
// drawn from the product screen rather than from the client-portal pages'
// Gantt snippet (ProgressMock). That one is a detail lifted out of a card; the
// hero is the whole window, so it carries the template's own chrome: the
// title with its switcher chevron and "Create project", the search / filters /
// view-switcher toolbar, and a dated month-and-week scale
// with a rule at every week.
//
// Same shape as the template's board, with an agency's book of work on it.
// The bars use the --mock-gantt-* tokens, which carry the template's palette
// with a value per theme.
// ─────────────────────────────────────────────────────────────────────────

/** One week column, in px. The scale is fixed and clips at the window's edge. */
const WEEK = 46;
/** Weeks the phone shot is scrolled on — see the timeline's own note. */
const PHONE_SCROLL = 8;

const MONTHS = [
  {
    label: "May 2026",
    weeks: ["May 1", "May 8", "May 15", "May 22", "May 29"],
  },
  { label: "June 2026", weeks: ["Jun 5", "Jun 12", "Jun 19", "Jun 26"] },
  {
    label: "July 2026",
    weeks: ["Jul 3", "Jul 10", "Jul 17", "Jul 24", "Jul 31"],
  },
  { label: "August 2026", weeks: ["Aug 7", "Aug 14", "Aug 21", "Aug 28"] },
  { label: "September 2026", weeks: ["Sep 4", "Sep 11", "Sep 18", "Sep 25"] },
];
const WEEKS = MONTHS.flatMap((m) => m.weeks);

const TONE = [
  "bg-[var(--mock-gantt-1)]",
  "bg-[var(--mock-gantt-2)]",
  "bg-[var(--mock-gantt-3)]",
  "bg-[var(--mock-gantt-4)]",
];

/** Start and length in weeks from May 1; tone indexes TONE. */
const PROJECTS = [
  {
    name: "Spring Campaign Launch",
    owner: "DW",
    from: 4.4,
    weeks: 13.5,
    tone: 0,
  },
  { name: "Northwind Rebrand", owner: "PR", from: 6.3, weeks: 12.6, tone: 1 },
  { name: "Q3 Paid Social", owner: "JM", from: 8.1, weeks: 9.6, tone: 2 },
  { name: "Website Relaunch", owner: "AK", from: 8.8, weeks: 9.6, tone: 0 },
  { name: "Product Launch Film", owner: "SL", from: 9.1, weeks: 10.8, tone: 2 },
  { name: "Holiday Campaign", owner: "CC", from: 9.4, weeks: 8.2, tone: 2 },
  { name: "SEO Content Sprint", owner: "TS", from: 9.7, weeks: 9.5, tone: 3 },
  { name: "Influencer Program", owner: "EV", from: 10.1, weeks: 6.3, tone: 3 },
  { name: "Trade Show Booth", owner: "MB", from: 10.8, weeks: 5.3, tone: 0 },
  {
    name: "Brand Guidelines Refresh",
    owner: "NL",
    from: 11.2,
    weeks: 8.3,
    tone: 1,
  },
  {
    name: "Media Buying Strategy",
    owner: "AB",
    from: 12.1,
    weeks: 5.2,
    tone: 2,
  },
];

/** A bordered control in the toolbar: Search, Filters, the view group. */
const CONTROL = `flex h-[26px] items-center rounded-[4px] border bg-[var(--mock-window)] ${LINE}`;

function TrackerScreen() {
  return (
    <>
      {/* Toolbar. On a phone the view switcher steps aside rather than
          squeezing Search to nothing. */}
      <div className="flex items-center gap-2">
        <span
          className={`${CONTROL} w-[180px] min-w-0 gap-1.5 px-2 max-sm:w-auto max-sm:flex-1 text-[color:var(--mock-ink-soft)] ${MOCK_SECONDARY}`}
        >
          <IconSearch className="size-[12px] shrink-0" />
          Search
        </span>
        <span
          // Icon-only on a phone, as the product collapses it, so Search
          // can take the row.
          className={`${CONTROL} shrink-0 gap-1.5 px-2 text-[color:var(--mock-ink)] max-sm:w-[26px] max-sm:justify-center max-sm:px-0 ${MOCK_SECONDARY}`}
        >
          <IconFilter className="size-[12px]" />
          <span className="max-sm:hidden">Filters</span>
        </span>
        <span className="ml-auto flex items-center gap-2 max-sm:hidden">
          <span
            className={`${CONTROL} overflow-hidden text-[color:var(--mock-ink-soft)]`}
          >
            {[
              IconTrackerList,
              IconTrackerBoard,
              IconTrackerGantt,
              IconTrackerTable,
            ].map((Icon, i) => (
              <span
                key={i}
                className={`flex h-full w-[26px] items-center justify-center ${
                  i > 0 ? `border-l ${LINE}` : ""
                } ${i === 2 ? "bg-[var(--mock-well-2)] text-[color:var(--mock-ink)]" : ""}`}
              >
                <Icon className="size-[11px]" />
              </span>
            ))}
          </span>
          <span
            className={`${CONTROL} w-[26px] justify-center text-[color:var(--mock-ink-soft)]`}
          >
            <IconTrackerSliders className="size-[11px]" />
          </span>
        </span>
      </div>

      {/* The timeline, as a closed table. The bars and the week scale run on
          past its right edge and clip there, the way a horizontally scrolling
          table does, so the box says there is more of it rather than the shot
          running out. */}
      <div
        className={`relative min-h-0 flex-1 overflow-hidden rounded-[6px] border ${LINE}`}
      >
        {/* The scroll edge: a slight blur just inside the right border, the
            cue that the table carries on. A blur rather than a fade to the
            ground, so the bars keep their colour and only soften; masked so it
            eases in rather than starting at a hard line. */}
        <span className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 backdrop-blur-[2px] [mask-image:linear-gradient(to_right,transparent,black)] max-sm:hidden" />
        {/* On a phone the table is ~240px, five weeks. Scrolled to start at
            the end of June (eight weeks on), every bar's start falls inside
            it — the early ones run in from the left, the late ones begin in
            view — so the stack reads as a schedule down the whole shot rather
            than three bars and then empty rows. */}
        <div
          className="absolute left-0 top-0 max-sm:-translate-x-[var(--phone-scroll)]"
          style={
            {
              width: WEEKS.length * WEEK,
              "--phone-scroll": `${PHONE_SCROLL * WEEK}px`,
            } as React.CSSProperties
          }
        >
          <div className={`flex border-b bg-[var(--mock-well)] ${LINE}`}>
            {MONTHS.map(({ label, weeks }, i) => (
              <span
                key={label}
                className={`shrink-0 px-2 py-2 text-[color:var(--mock-ink)] ${MOCK_SECONDARY} ${
                  i > 0 ? `border-l ${LINE}` : ""
                }`}
                style={{ width: weeks.length * WEEK }}
              >
                {label}
              </span>
            ))}
          </div>
          <div className={`flex border-b ${LINE}`}>
            {WEEKS.map((w) => (
              <span
                key={w}
                className={`shrink-0 whitespace-nowrap py-2 text-center text-[color:var(--mock-ink-soft)] ${MOCK_MICRO}`}
                style={{ width: WEEK }}
              >
                {w}
              </span>
            ))}
          </div>

          <div className="relative pb-6">
            {/* A rule at every week, behind the bars. */}
            <div className="pointer-events-none absolute inset-0 flex">
              {WEEKS.map((w, i) => (
                <span
                  key={w}
                  className={`h-full shrink-0 ${i > 0 ? `border-l ${LINE}` : ""}`}
                  style={{ width: WEEK }}
                />
              ))}
            </div>

            <div className="relative pt-4 flex flex-col gap-[7px]">
              {PROJECTS.map(({ name, owner, from, weeks, tone }) => (
                // On a phone the scale is scrolled PHONE_SCROLL weeks on, so a
                // bar that began earlier would carry its name off the left
                // edge. --clip pads it back into view, the way a Gantt keeps
                // a scrolled bar's label pinned to the visible start.
                <span
                  key={name}
                  className={`flex h-[22px] items-center gap-1.5 rounded-[4px] pl-1 pr-2 max-sm:pl-[var(--clip)] ${TONE[tone]}`}
                  style={
                    {
                      marginLeft: from * WEEK,
                      width: weeks * WEEK,
                      "--clip": `${Math.max(0, (PHONE_SCROLL - from) * WEEK) + 4}px`,
                    } as React.CSSProperties
                  }
                >
                  {/* Optically centred, as in ProgressMock: two capitals sit
                      high in a box-centred disc. */}
                  <span className="flex size-[20px] shrink-0 items-center justify-center rounded-full bg-white text-[9.5px] font-medium leading-none text-[color:#101114]">
                    <span className="block translate-y-[0.1em]">{owner}</span>
                  </span>
                  <span
                    className={`truncate font-medium text-white ${MOCK_SECONDARY}`}
                  >
                    {name}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function AgencyHeroVisual() {
  return (
    <BrandedPortalVisual
      brand="Bloomhouse"
      brandMark={<IconBloomhouseMark className="size-[12px]" />}
      apps={AGENCY_APPS}
      title={
        // The nav row's name, so the two agree, and a step under the shared
        // title size: beside a toolbar and a dated scale, 13.5px read as a
        // page heading rather than an app's title bar.
        <span
          className={`flex items-center gap-1.5 whitespace-nowrap ${MOCK_BODY}`}
        >
          Project tracker
          <IconChevronDown className="size-[9px] text-[color:var(--mock-ink-soft)]" />
        </span>
      }
      headerAction={
        <span
          className={`flex items-center gap-1 whitespace-nowrap rounded-[4px] bg-[var(--mock-ink)] px-2.5 py-[6px] text-[color:var(--mock-window)] ${MOCK_SECONDARY}`}
        >
          <IconTrackerPlus className="size-[9px]" />
          <span className="max-sm:hidden">Create project</span>
          <span className="sm:hidden">Create</span>
        </span>
      }
      navOnPhone={false}
      appsBreak={false}
    >
      <TrackerScreen />
    </BrandedPortalVisual>
  );
}
