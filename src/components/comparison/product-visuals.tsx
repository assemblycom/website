import { FootBlur } from "@/components/ui/foot-blur";
import { GRAIN } from "@/components/comparison/brand-panel";
import { BrandedLoginScreen } from "@/components/comparison/branded-login-hero-visual";
import { ORBIT, OrbitMark } from "@/components/comparison/orbit-brand";
import { BrandedPortalVisual } from "@/components/ai-app-builder/branded-portal-visual";
import {
  CalendarPane,
  PlanCard,
} from "@/components/client-portal/portal-build-cards";
import { TeamCrmVisual } from "@/components/home/team-crm-visual";
import { IntakeAppMock } from "@/components/client-portal/segment-mock";
import { WorkspaceSidebar } from "@/components/home/workspace-sidebar";
import {
  IconClock,
  IconFile,
  IconForm,
  IconList,
} from "@/components/home/mock-icons";
import {
  MOCK_MICRO,
  MOCK_PRIMARY,
  MOCK_SECONDARY,
} from "@/components/ui/mock-type";

/**
 * The mock family's window, open at the foot so the screen runs off the
 * panel's bottom edge — the frame BrandedLoginScreen draws for itself, so the
 * three pillars' screens all sit on the panel the same way.
 */
const WINDOW =
  "mock-edge min-h-0 flex-1 overflow-hidden rounded-t-xl border border-b-0 border-[var(--mock-line)] bg-[var(--mock-window)]";

/** The split hero's card height, so the pillar shows the same screens at the
 *  same proportions and lets the panel crop them. */
const SCREEN = "h-[500px]";

/** Pillar 1: one app, built by the team on the left and used by a client on
 *  the right. A phone has room for one screen, so it keeps the client's.
 *
 *  Both screens keep the hero card's height and run off the panel's foot:
 *  squeezed into the shorter panel, the chat pinned its composer over the
 *  plan card and cut the card mid-line. */
const EVENTS = [
  {
    month: "Oct",
    day: "21",
    title: "Q4 market outlook webinar",
    tag: "Webinar",
    when: "Wed, 12:00 PM · Virtual",
    rsvp: "Going",
  },
  {
    month: "Oct",
    day: "28",
    title: "Client office hours",
    tag: "Office hours",
    when: "Wed, 10:00 AM · Virtual",
  },
  {
    month: "Nov",
    day: "5",
    title: "Autumn client mixer",
    tag: "Meetup",
    when: "Thu, 5:00 PM · New York",
  },
];
const RSVP_OPTIONS = ["Going", "Maybe", "Can't go"];
const MOCK_LINE = "border-[var(--mock-line)]";

/** The app the client has open: upcoming events, each with its RSVP. */
function EventsPane() {
  return (
    // On the window's own ground, not a grey box of its own: the pane already
    // pads its content, so a second ground read as a panel set inside the
    // screen. Centred at a list's measure, so on the full-bleed window the
    // cards neither stretch nor hug one side.
    <div className="mx-auto flex w-full max-w-[520px] flex-col gap-2.5">
      <span
        className={`flex self-start overflow-hidden rounded-[5px] border ${MOCK_LINE} ${MOCK_SECONDARY}`}
      >
        <span className="bg-[var(--mock-window)] px-2.5 py-1.5">Upcoming</span>
        <span
          className={`border-l px-2.5 py-1.5 text-[color:var(--mock-ink-soft)] ${MOCK_LINE}`}
        >
          Past
        </span>
      </span>
      {EVENTS.map((e) => (
        <div
          key={e.title}
          className={`overflow-hidden rounded-[6px] border bg-[var(--mock-window)] ${MOCK_LINE}`}
        >
          <div className="flex gap-2.5 p-2.5">
            <span
              className={`flex w-[34px] shrink-0 flex-col items-center justify-center rounded-[5px] border py-1 ${MOCK_LINE}`}
            >
              <span
                className={`text-[color:var(--mock-ink-soft)] ${MOCK_MICRO}`}
              >
                {e.month}
              </span>
              <span className={`mt-1 ${MOCK_PRIMARY}`}>{e.day}</span>
            </span>
            <span className="min-w-0">
              <span className={`block truncate ${MOCK_PRIMARY}`}>
                {e.title}
              </span>
              <span className="mt-1.5 flex items-center gap-1.5">
                <span
                  className={`rounded-full bg-[var(--mock-well-2)] px-1.5 py-[3px] text-[color:var(--mock-ink-soft)] ${MOCK_MICRO}`}
                >
                  {e.tag}
                </span>
                <span
                  className={`truncate text-[color:var(--mock-ink-soft)] ${MOCK_MICRO}`}
                >
                  {e.when}
                </span>
              </span>
            </span>
          </div>
          <div
            className={`flex items-center justify-end gap-2 border-t bg-[var(--mock-well)] px-2.5 py-1.5 sm:justify-between ${MOCK_LINE}`}
          >
            <span
              className={`min-w-0 truncate text-[color:var(--mock-ink-soft)] max-sm:hidden ${MOCK_MICRO}`}
            >
              Will you be there?
            </span>
            <span
              className={`flex shrink-0 overflow-hidden rounded-[4px] border bg-[var(--mock-window)] ${MOCK_LINE} ${MOCK_MICRO}`}
            >
              {RSVP_OPTIONS.map((option, i) => (
                <span
                  key={option}
                  className={`px-1.5 py-1 ${i ? `border-l ${MOCK_LINE}` : ""} ${
                    option === e.rsvp
                      ? "bg-[var(--mock-ink)] text-[color:var(--mock-window)]"
                      : ""
                  }`}
                >
                  {option}
                </span>
              ))}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ClientAppsPillarVisual() {
  return (
    // The client's side alone: the firm's portal, their branded nav with the
    // new app open in it, so "your clients" reads as a place a client signs
    // into. A phone has no room for the nav, so there it slides off the left
    // and the app takes the screen.
    // From sm it runs off the card's right edge (the negative margin undoes
    // the slot's inset), so the portal reads as a screen that carries on.
    <div className="-mr-6 h-full overflow-hidden rounded-tl-xl sm:ml-[12%] md:-mr-10 [&>div>div]:rounded-tr-none [&>div>div]:border-r-0">
      <div
        className={`${SCREEN} max-sm:-ml-[161px] max-sm:w-[calc(100%+161px)]`}
      >
        <BrandedPortalVisual
          apps={[{ icon: <IconClock />, label: "Events" }]}
          title="Events & RSVPs"
        >
          <EventsPane />
        </BrandedPortalVisual>
      </div>
    </div>
  );
}

/** Pillar 2: the client's sign-in, and the access rule behind it that the
 *  team never had to write. A phone keeps the sign-in. */
export function LoginsPillarVisual() {
  return (
    // The client's sign-in on its own, drawn the way Base44's brand pillar
    // draws it: one window, the form centred, cut by the panel's foot.
    // Narrower than the slot: a lone sign-in at 620px read as a wide empty
    // window with a form in the middle of it.
    <div className={`${WINDOW} mx-auto flex h-full w-full max-w-[440px]`}>
      {/* The sign-in draws a window of its own; here it sits inside this one,
          so its frame comes off rather than drawing a frame in a frame. */}
      <div className="flex min-w-0 flex-1 flex-col [&>div]:rounded-none [&>div]:border-0">
        <BrandedLoginScreen quietFoot={false} centered />
      </div>
    </div>
  );
}

/** Pillar 3: the CRM every app reads from. */
export function CrmPillarVisual() {
  return (
    <div className="flex h-full flex-col">
      <div className={WINDOW}>
        {/* Cropped rather than squeezed on a phone: under 640 the columns
            truncated every email. */}
        <div className="h-full min-w-[640px]">
          <TeamCrmVisual moreRows />
        </div>
      </div>
    </div>
  );
}

/** The apps a firm starts with, as they sit in the team's own nav. */
// Short names, the way a firm would label its own nav: the template titles
// truncated in a 172px rail.
// Two apps, not four: a short list keeps the open app near the top.
const WORKSPACE_APPS = [
  { icon: <IconFile />, label: "Documents" },
  { icon: <IconForm />, label: "Intake" },
];
const OPEN_APP = "Intake";

/** Deep dive 2: the team's workspace, already holding a set of apps, with
 *  one of them open. A phone drops the nav and keeps the form. */
export function FullExperienceVisual({
  /** Draws the workspace for the Base44 page's firm instead of Brandmages. */
  orbit = false,
}: { orbit?: boolean } = {}) {
  return (
    // Bleeds off the card's right edge (the negative margin undoes the deep
    // dive's inset there), so the screen reads as a window onto a dashboard
    // that carries on, the way /ai-app-builder crops its shots. Drawn 80px
    // wider than the card so the crop takes the form's far side at every
    // width; a fixed 640 hid the form entirely on a narrow card. Never under
    // 480 once the nav shows (sm), or the form squeezed beside it and cut its
    // own labels instead of being cut by the card.
    <div className="relative -mr-5 flex h-full flex-col sm:-mr-6 md:-mr-8">
      <div className={`${WINDOW} rounded-tr-none border-r-0`}>
        <div className="h-full w-[calc(100%+80px)] sm:w-[max(calc(100%+80px),480px)]">
          <IntakeAppMock
            title={OPEN_APP}
            accent={orbit ? ORBIT.color : undefined}
            nav={
              <WorkspaceSidebar
                active={OPEN_APP}
                apps={WORKSPACE_APPS}
                {...(orbit
                  ? {
                      brand: ORBIT.name,
                      brandMark: <OrbitMark className="size-[10px]" />,
                    }
                  : {})}
                className="flex w-[172px]"
              />
            }
          />
        </div>
      </div>
      {/* Phone only, where the form is cut mid-row by the card's edge. */}
      <FootBlur edge="right" className="sm:hidden" />
    </div>
  );
}

// Orbit's slate (the logo file's #6D8FAA and the nav's deeper ORBIT.color),
// pushed toward blue for colour, laid out the way PANEL_BG lays out the
// site's own two hues, grain and all.
const ORBIT_PANEL_BG = [
  GRAIN,
  `radial-gradient(70% 60% at 80% 15%, #5B8FD6 0%, transparent 70%)`,
  `radial-gradient(80% 70% at 15% 95%, ${ORBIT.color} 0%, transparent 70%)`,
  `linear-gradient(160deg in oklab, color-mix(in oklab, #6D8FAA 75%, #8FB4E8), color-mix(in oklab, ${ORBIT.color} 85%, #7BA7C9))`,
].join(", ");

/** Base44 pillar 1: the first screen a client meets is the firm's own
 *  sign-in, split the way branded sign-ins are: the form on the left, the
 *  firm's own colour inset on the right. One window, cut by the panel's
 *  foot with no fade. A phone drops the colour panel and keeps the form at its full width. */
export function BrandPillarVisual() {
  return (
    // The blur sits beside the window, not in it: inside a rounded,
    // overflow-clipped box Chrome drops the blur's mask and draws it at full
    // strength from a hard edge.
    <div className="relative flex h-full">
      <div className={`${WINDOW} flex`}>
        {/* The sign-in draws a window of its own; here it sits inside this one,
          so its frame comes off rather than drawing a frame in a frame. */}
        <div className="flex min-w-0 flex-1 flex-col [&>div]:rounded-none [&>div]:border-0">
          <BrandedLoginScreen quietFoot={false} centered orbit />
        </div>
        {/* The firm's picture as a card inset from the window's top and right
          edges, running off the foot with the form. A gradient in the
          firm's own slate, the way the site's panels use its blue and lime. */}
        <div className="hidden w-[46%] shrink-0 pr-3 pt-3 sm:block">
          <div
            className="h-full rounded-t-lg"
            style={{ background: ORBIT_PANEL_BG }}
          />
        </div>
      </div>
      {/* Phone only, where the form runs the full width into the cut. */}
      <FootBlur className="sm:hidden" />
    </div>
  );
}

/** Base44 pillar 2: the client's portal in the firm's colour, the stock apps
 *  and the firm's own built ones in one nav, a calendar open. The week view
 *  is /client-portal's build-step calendar, reused. */
export function ClientExperiencePillarVisual() {
  return (
    // On a phone the portal runs off the card's right edge, past the slot's
    // inset, so the nav and the calendar keep their width instead of both
    // squeezing; the right corner and hairline go with the edge it lost.
    <div className="h-full max-md:-mr-6 max-md:[&>div]:rounded-tr-none max-md:[&>div]:border-r-0">
      <BrandedPortalVisual
        brand={ORBIT.name}
        brandMark={<OrbitMark className="size-[11px]" />}
        brandColor={ORBIT.color}
        apps={[
          { icon: <IconList />, label: "Project tracker" },
          { icon: <IconClock />, label: "Calendar" },
        ]}
        title="Calendar"
      >
        <CalendarPane vivid />
      </BrandedPortalVisual>
    </div>
  );
}

/**
 * /ai-app-builder's plan step, sat on the card's foot. The scene fits itself
 * to its box and centres, so in a slot taller than its 620x400 (360x300 on a
 * phone) it floated with a band of card under it. A box of the scene's own
 * shape, pinned to the bottom, puts the plan's open foot on the card's edge.
 */
export function PlanVisual() {
  return (
    // Sized by whichever runs out first, the slot's width or its height
    // (cqh: the slot is a size container), so the scene never scales past
    // its window and blows its type up on a wide phone. On a phone it is sized
    // by height alone and runs past the card's inset to its edges: fitted to
    // the inset it came out at 80% and its type was too small to read.
    // The extra 20px is the scene's own top padding, pushed past the slot's
    // top edge so the plan sits as close under its copy as its siblings do.
    <div className="absolute bottom-0 left-1/2 aspect-[6/5] w-[calc((100cqh+20px)*1.2)] -translate-x-1/2 sm:aspect-[31/20] sm:w-[min(100%,620px,100cqh*1.55)]">
      <PlanCard plain />
    </div>
  );
}
