import {
  IconBook,
  IconBookBlank,
  IconBrandMark,
  IconChat,
  IconGlobe,
  IconPlus,
  IconUsers,
} from "@/components/home/mock-icons";

// ─────────────────────────────────────────────────────────────────────────
// WORKSPACE SIDEBAR — the firm's own nav, shared by the product mocks.
//
// It was drawn inline inside team-crm-visual and then wanted again by the Add
// App shot on /ai-app-builder. Two copies of a nav is the one thing this site's
// rules exist to stop: the two would drift a row or a glyph apart and a reader
// scrolling between the cards would meet two different products.
//
// The rows are the product's current team nav, and the list is deliberately
// short. It used to run fourteen — Dashboard, CRM, Notifications, Automations
// over an Apps group of eight, closing on Preferences. On a card whose claim is
// about the apps a firm BUILDS, a column of eight stock rows is the part of the
// picture that reads as the apps, which makes the built one invisible.
//
// So: the two team surfaces, then the apps — the stock pair every workspace
// has, the app this firm built, and the action that adds the next one. `Add
// App` is what makes the group legible as a list that GROWS.
//
// The glyphs are the approved product set, in the pairing the hero mocks use:
// IconBook is the CRM contact card (its name predates the glyph) and IconUsers
// is the group under a roof, which is Team. IconGlobe is the product's house
// and IconBookBlank the blank book an app row carries.
// ─────────────────────────────────────────────────────────────────────────

/** Which row is lit. `Add App` lights the action at the foot of the list. */
export type WorkspaceNavRow = "CRM" | "Team" | "Home" | "Messages" | "Add App";

function NavItem({
  icon,
  label,
  active,
  /** An action rather than a destination — quieter, unless it is the one open. */
  muted,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  muted?: boolean;
}) {
  return (
    <div
      className={`flex h-[22px] items-center gap-2 rounded px-1.5 ${
        muted && !active ? "text-muted-foreground" : "text-foreground"
      } ${active ? "bg-border/70" : ""}`}
    >
      <span className="[&>svg]:size-[13px] flex shrink-0 items-center justify-center">
        {icon}
      </span>
      <span className="min-w-0 flex-1 truncate text-[10.5px] leading-none">
        {label}
      </span>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-1.5 pb-1 pt-2.5 text-[9.5px] leading-none text-muted-foreground">
      {children}
    </p>
  );
}

export function WorkspaceSidebar({
  active,
  /**
   * The column's width. The CRM card gives it the full 148/164 it was drawn
   * at; a shot whose subject is the PANE beside it can ask for less, since
   * every pixel here is a pixel the subject does not get.
   */
  className = "hidden w-[148px] sm:flex md:w-[164px]",
}: {
  active: WorkspaceNavRow;
  className?: string;
}) {
  return (
    <div
      className={`shrink-0 flex-col overflow-hidden border-r border-border bg-muted px-1.5 py-2 ${className}`}
    >
      <div className="flex items-center gap-1.5 px-1.5 pb-2.5 pt-0.5">
        <span className="flex size-[15px] items-center justify-center rounded bg-foreground text-background">
          <IconBrandMark className="size-[9px]" />
        </span>
        <span className="text-[11px] leading-none text-foreground">
          BrandMages
        </span>
      </div>

      <NavItem icon={<IconBook />} label="CRM" active={active === "CRM"} />
      <NavItem icon={<IconUsers />} label="Team" active={active === "Team"} />

      <SectionLabel>Apps</SectionLabel>
      <NavItem icon={<IconGlobe />} label="Home" active={active === "Home"} />
      <NavItem
        icon={<IconChat />}
        label="Messages"
        active={active === "Messages"}
      />
      <NavItem icon={<IconBookBlank />} label="Year-end docs" />
      <NavItem
        icon={<IconPlus />}
        label="Add App"
        muted
        active={active === "Add App"}
      />
    </div>
  );
}
