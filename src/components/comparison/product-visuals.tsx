import Image from "next/image";
import { BrandedLoginScreen } from "@/components/comparison/branded-login-hero-visual";
import { ORBIT, OrbitMark } from "@/components/comparison/orbit-brand";
import { BrandedPortalVisual } from "@/components/ai-app-builder/branded-portal-visual";
import {
  BuildChat,
  ClientApp,
} from "@/components/comparison/team-clients-hero-visual";
import {
  AccessPanel,
  CalendarPane,
  PlanCard,
} from "@/components/client-portal/portal-build-cards";
import { TeamCrmVisual } from "@/components/home/team-crm-visual";
import { IntakeAppMock } from "@/components/client-portal/segment-mock";
import { WorkspaceSidebar } from "@/components/home/workspace-sidebar";
import {
  IconClock,
  IconFile,
  IconFolder,
  IconForm,
  IconList,
} from "@/components/home/mock-icons";

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

function Labelled({
  label,
  className = "",
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex min-h-0 flex-col ${className}`}>
      <p className="mb-2.5 text-xs text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

/** Pillar 1: one app, built by the team on the left and used by a client on
 *  the right. A phone has room for one screen, so it keeps the client's.
 *
 *  Both screens keep the hero card's height and run off the panel's foot:
 *  squeezed into the shorter panel, the chat pinned its composer over the
 *  plan card and cut the card mid-line. */
export function ClientAppsPillarVisual() {
  return (
    <div className="grid h-full gap-4 sm:grid-cols-2">
      <Labelled label="Your team" className="hidden sm:flex">
        <div className={WINDOW}>
          <div className={SCREEN}>
            <BuildChat />
          </div>
        </div>
      </Labelled>
      <Labelled label="Your clients">
        <div className={WINDOW}>
          <div className={SCREEN}>
            <ClientApp />
          </div>
        </div>
      </Labelled>
    </div>
  );
}

/** Pillar 2: the client's sign-in, and the access rule behind it that the
 *  team never had to write. A phone keeps the sign-in. */
export function LoginsPillarVisual() {
  return (
    <div className="grid h-full gap-4 sm:grid-cols-2">
      {/* The foot fade is the one /ai-app-builder's sign-in card uses. This
          screen blanks its last button's label on the assumption that the
          card's edge runs through it, so the label above is what puts the
          button there. */}
      <Labelled label="Client sign-in" className="mock-foot-fade">
        <BrandedLoginScreen />
      </Labelled>
      <Labelled label="Permissions" className="hidden sm:flex">
        <AccessPanel />
      </Labelled>
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
          <TeamCrmVisual />
        </div>
      </div>
    </div>
  );
}

/** The apps a firm starts with, as they sit in the team's own nav. */
// Short names, the way a firm would label its own nav: the template titles
// truncated in a 172px rail.
const WORKSPACE_APPS = [
  { icon: <IconList />, label: "Projects" },
  { icon: <IconFile />, label: "Documents" },
  { icon: <IconForm />, label: "Intake" },
  { icon: <IconFolder />, label: "Helpdesk" },
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
    <div className="-mr-5 flex h-full flex-col sm:-mr-6 md:-mr-8">
      <div className={`${WINDOW} rounded-tr-none border-r-0`}>
        <div className="h-full w-[calc(100%+80px)] sm:w-[max(calc(100%+80px),480px)]">
          <IntakeAppMock
            title={OPEN_APP}
            action={false}
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
    </div>
  );
}

/** Base44 pillar 1: the first screen a client meets is the firm's own
 *  sign-in, split the way branded sign-ins are: the form on the left, the
 *  firm's own picture inset on the right. One window, cut by the panel's
 *  foot with no fade. A phone drops the picture and keeps the form at its full width. */
export function BrandPillarVisual() {
  return (
    <div className={`${WINDOW} flex h-full`}>
      {/* The sign-in draws a window of its own; here it sits inside this one,
          so its frame comes off rather than drawing a frame in a frame. */}
      <div className="flex min-w-0 flex-1 flex-col [&>div]:rounded-none [&>div]:border-0">
        <BrandedLoginScreen quietFoot={false} centered orbit />
      </div>
      {/* The firm's picture as a card inset from the window's top and right
          edges, running off the foot with the form. One of /client-portal's
          approval covers, cropped the way that mock crops it: face in the
          upper half, so the focus sits at 28%. */}
      <div className="hidden w-[46%] shrink-0 pr-3 pt-3 sm:block">
        <div className="relative h-full overflow-hidden rounded-t-lg bg-[var(--mock-well-2)]">
          <Image
            src="/images/mocks/covers/cover-2.jpg"
            alt=""
            fill
            sizes="420px"
            quality={90}
            className="object-cover object-[50%_28%]"
          />
        </div>
      </div>
    </div>
  );
}

/** Base44 pillar 2: the client's portal in the firm's colour, the stock apps
 *  and the firm's own built ones in one nav, a calendar open. The week view
 *  is /client-portal's build-step calendar, reused. */
export function ClientExperiencePillarVisual() {
  return (
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
      <CalendarPane />
    </BrandedPortalVisual>
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
    // its window and blows its type up on a wide phone.
    <div className="absolute bottom-0 left-1/2 aspect-[6/5] w-[min(100%,100cqh*1.2)] -translate-x-1/2 sm:aspect-[31/20] sm:w-[min(100%,620px,100cqh*1.55)]">
      <PlanCard plain />
    </div>
  );
}
