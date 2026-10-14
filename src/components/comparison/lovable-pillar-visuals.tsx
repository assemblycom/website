import { BrandedLoginScreen } from "@/components/comparison/branded-login-hero-visual";
import {
  BuildChat,
  ClientApp,
} from "@/components/comparison/team-clients-hero-visual";
import { AccessPanel } from "@/components/client-portal/portal-build-cards";
import { TeamCrmVisual } from "@/components/home/team-crm-visual";
import { IntakeAppMock } from "@/components/client-portal/segment-mock";
import { WorkspaceSidebar } from "@/components/home/workspace-sidebar";
import {
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
        <TeamCrmVisual />
      </div>
    </div>
  );
}

/** The apps a firm starts with, as they sit in the team's own nav. */
const WORKSPACE_APPS = [
  { icon: <IconList />, label: "Client project tracker" },
  { icon: <IconFile />, label: "Document collector" },
  { icon: <IconForm />, label: "New client intake" },
  { icon: <IconFolder />, label: "Helpdesk" },
];
const OPEN_APP = "New client intake";

/** Deep dive 2: the team's workspace, already holding a set of apps, with
 *  one of them open. A phone drops the nav and keeps the form. */
export function FullExperienceVisual() {
  return (
    <div className="flex h-full flex-col">
      <div className={WINDOW}>
        <IntakeAppMock
          title={OPEN_APP}
          action={false}
          nav={
            <WorkspaceSidebar
              active={OPEN_APP}
              apps={WORKSPACE_APPS}
              className="flex w-[172px]"
            />
          }
        />
      </div>
    </div>
  );
}
