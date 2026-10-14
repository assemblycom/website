import {
  IconBell,
  IconBook,
  IconBookBlank,
  IconBrandMark,
  IconCard,
  IconChat,
  IconFolder,
  IconForm,
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
export type WorkspaceNavRow =
  "CRM" | "Team" | "Notifications" | "Home" | "Messages" | "Add App";

function NavItem({
  icon,
  label,
  active,
  badge,
  quiet = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  /** A count riding at the row's right edge — unread notifications, so far. */
  badge?: string;
  /**
   * Draws the row a rung under the resting ones.
   *
   * For `Add App` on the one card whose subject is the sidebar itself. There
   * the list is long enough to read as a list, and the action that extends it
   * should sit below the places it extends — otherwise the last row of the
   * nav is as loud as the apps above it and reads as a sixth destination.
   *
   * Opt-in, because this was once the default for `Add App` and was removed
   * on purpose: on the shorter navs, where the claim is about the pane and
   * not the rail, a quieted action was a distinction nobody was reading.
   */
  quiet?: boolean;
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
      // THE INACTIVE ROWS ANSWER THE POINTER. A nav drawn in a mock is still a
      // nav, and the one thing a still picture cannot say is that these are
      // things you can go to — so the rows say it when the pointer arrives.
      //
      // The hover is the SAME pair the open row already wears, at half
      // strength: the fill steps to bg-border/40 against the open row's /70,
      // and the ink comes up to full. So a hovered row reads as on its way to
      // being the open one rather than as a third state with a look of its
      // own, and the open row stays the strongest thing in the rail.
      //
      // Only the inactive rows: hovering the row you are already on should do
      // nothing, and giving it a hover fill would make it flicker between two
      // nearly identical greys.
      // --mock-nav-rest, not --muted-foreground. The resting rows went one
      // rung quieter still: muted-foreground is the site's ordinary secondary
      // ink, and five rows of it down a 132px rail still read as a list to be
      // read rather than as the furniture around the open row. The token is
      // defined per theme (see globals.css), so this is the same decision in
      // light and dark rather than a number that happens to suit the dark
      // screenshot. Hover and the open row are untouched — they still come up
      // to full ink, so the rail's range is wider now, not dimmer overall.
      className={`flex h-[22px] items-center gap-2 rounded px-1.5 transition-colors duration-150 ${
        active
          ? "bg-border/70 text-foreground"
          : quiet
            ? "text-[color:var(--mock-nav-rest)] opacity-60 hover:bg-border/40 hover:text-foreground hover:opacity-100"
            : "text-[color:var(--mock-nav-rest)] hover:bg-border/40 hover:text-foreground"
      }`}
    >
      {/* NO COLOUR ON THE GLYPHS. They carried the mock family's three tints
          for a while, which worked on a rail of three app rows and did not on
          this one: at six it is a different hue every row, and a nav where no
          two neighbours agree reads as a palette rather than as a list. The
          colour on this card lives in the two COUNTS instead — see the
          Notifications badge below and the round counter in ApprovalsMock —
          where one mark carries it and the rest of the rail stays furniture. */}
      <span className="[&>svg]:size-[13px] flex shrink-0 items-center justify-center">
        {icon}
      </span>
      <span className={`min-w-0 flex-1 truncate ${MOCK_PRIMARY}`}>{label}</span>
      {badge ? (
        // THE COUNT IS WHERE THE RAIL'S COLOUR GOES.
        //
        // It was the row's own resting ink over a --muted pill, on the
        // reasoning that an unread count is chrome and a coloured badge in a
        // mock about the list of apps would be the first thing read on the
        // card. The first half still holds and the second one is now the
        // point: this rail is grey on purpose, and ONE blue mark in it is
        // exactly what gives the card somewhere to look. A badge is also the
        // one element in a nav that is supposed to be noticed — that is what a
        // count is for.
        //
        // --mock-info-*, the status family's blue pair, so this is the same
        // blue the support card's New badge wears rather than a value invented
        // here. Not red: this is a count of things waiting, not an alarm.
        <span
          className={`shrink-0 rounded bg-[var(--mock-info-bg)] px-1 py-[2px] text-[8.5px] leading-none text-[color:var(--mock-info-fg)] ${MOCK_MICRO}`}
        >
          {badge}
        </span>
      ) : null}
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
  showcase = false,
}: {
  active: WorkspaceNavRow;
  className?: string;
  /**
   * Draws the rail as the SUBJECT rather than as the furniture beside one.
   *
   * Everything above is tuned for a card whose claim is about the pane: the
   * stock rows are cut to two, the apps to one, and nothing in the column is
   * allowed to pull rank on the screen it introduces. /client-portal has one
   * card where that is exactly backwards — "Fill the sidebar with the apps
   * your firm needs" — and there a two-row nav under a one-app group is a
   * picture of a sidebar with nothing in it.
   *
   * So this adds what the real rail has and the short one drops: the
   * Notifications row with its count, a filled-out Apps group, and `Add App`
   * set a rung under the rows it extends. The short list stays the default,
   * so the four cards that were tuned against it do not move.
   */
  showcase?: boolean;
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
      {showcase ? (
        <NavItem
          icon={<IconBell />}
          label="Notifications"
          active={active === "Notifications"}
          // EIGHT, not "99+". A capped counter is what a rail shows when it
          // has given up counting, which on a marketing shot reads as a
          // workspace drowning rather than as one in use — and it is the only
          // number on the card, so it is the one claim the picture makes about
          // volume. A plain 8 is a firm with eight things waiting.
          badge="8"
        />
      ) : null}

      <SectionLabel>Apps</SectionLabel>
      <NavItem
        icon={<IconGlobe />}
        label="Home"
        active={active === "Home"}
      />
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
      <NavItem
        icon={<IconBookBlank />}
        label="Year-end docs"
      />
      {/* The rest of what a filled sidebar holds, on the one card that is
          about the sidebar being filled. Stock-sounding names rather than
          more invented apps: the claim beside this is "install or tailor apps
          in one click, or build a completely custom app with AI", so the
          group should read as a mix of what came with the workspace and what
          the firm added, not as five bespoke builds. */}
      {showcase ? (
        <>
          <NavItem icon={<IconCard />} label="Billing" />
          <NavItem icon={<IconFolder />} label="Files" />
          <NavItem icon={<IconForm />} label="Intake forms" />
        </>
      ) : null}
      <NavItem
        icon={<IconPlus />}
        label="Add App"
        active={active === "Add App"}
        quiet={showcase && active !== "Add App"}
      />
    </div>
  );
}
