import {
  IconBook,
  IconBookBlank,
  IconBrandMark,
  IconChat,
  IconGlobe,
  IconPlus,
  IconUsers,
} from "@/components/home/mock-icons";
import { MOCK_MICRO, MOCK_PRIMARY } from "@/components/ui/mock-type";

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
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <div
      // ONLY THE OPEN ROW IS IN FULL INK; every other row is muted.
      //
      // It used to be the other way round — every destination at full ink and
      // only Add App quieted, on the reasoning that an action is not a place.
      // That read as a nav where six things were equally the subject, and the
      // lit row had to carry the whole of "you are here" on a 70%-opacity
      // fill. A rail is a list of places you are NOT, which is why every real
      // one sets the current row apart in ink as well as in fill.
      //
      // It also stops the nav competing with the pane. This shot's subject is
      // the composer in the middle of the screen, and six full-ink labels down
      // the left were the highest-contrast type on the card.
      //
      // The `muted` prop is gone with it: it existed to make this one
      // distinction and the rule now covers it.
      className={`flex h-[22px] items-center gap-2 rounded px-1.5 ${
        active ? "text-foreground" : "text-muted-foreground"
      } ${active ? "bg-border/70" : ""}`}
    >
      <span className="[&>svg]:size-[13px] flex shrink-0 items-center justify-center">
        {icon}
      </span>
      <span className={`min-w-0 flex-1 truncate ${MOCK_PRIMARY}`}>{label}</span>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className={`px-1.5 pb-1 pt-2.5 text-muted-foreground ${MOCK_MICRO}`}>
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
      // THE DIVIDER READS --mock-line, not --border. The two are the same
      // value in light (#e8e9ec), so nothing moves there; in dark --border is
      // #383838 against a #1c1c1c rail and a #212121 pane, a +28 step that
      // read as a lit edge down the middle of the shot rather than as the
      // seam between two panels. --mock-line is #2e2e2e, which is the line
      // every other surface in these mocks is drawn with — so this is the
      // mock family's own token finally being used here, not a new value.
      className={`shrink-0 flex-col overflow-hidden border-r border-[var(--mock-line)] bg-muted px-1.5 py-2 ${className}`}
    >
      <div className="flex items-center gap-1.5 px-1.5 pb-2.5 pt-0.5">
        <span className="flex size-[15px] items-center justify-center rounded bg-foreground text-background">
          <IconBrandMark className="size-[9px]" />
        </span>
        <span className={`text-foreground ${MOCK_PRIMARY}`}>BrandMages</span>
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
      {/* ONE app the firm has built, and back to one on purpose. It was three
          — Year-end docs, Design approvals, Calendar — on the reasoning that a
          list of one cannot show a range. It cannot, but the range is not this
          shot's job: the claim over it is that every app starts in the box in
          the middle of the screen, and three named apps down the left were
          three more things to read before reaching it.

          One also puts this nav in step with the Branding card further down
          the same page, whose portal lists the stock rows and exactly one
          added app, also Year-end docs. Two shots of the same workspace in one
          section should not disagree about how many apps it has. */}
      <NavItem icon={<IconBookBlank />} label="Year-end docs" />
      <NavItem icon={<IconPlus />} label="Add App" active={active === "Add App"} />
    </div>
  );
}
