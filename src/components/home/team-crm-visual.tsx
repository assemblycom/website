// ─────────────────────────────────────────────────────────────────────────
// TEAM-CRM VISUAL — the internal team view from the Product file (node
// 65270:189033), cut to what the card can actually show: the CRM's Contacts
// table, with a company on every row. The workspace sidebar, the toolbar, the
// status pills and the tier chips all came off — the card crops this screen
// about a column and a half in, and everything past that was paying layout
// width (Name is the flex-1 column, so every fixed column pushes it) for
// something no reader ever sees. Decorative only.
// ─────────────────────────────────────────────────────────────────────────

import { IconBrandMark } from "@/components/home/mock-icons";

type Contact = {
  name: string;
  email: string;
  company: string;
};

/**
 * Two letters, the way the product draws an avatar with no photo on it: first
 * initial and last. One letter is what a generic placeholder does, and on a
 * list where three of six share a company it is also the least distinguishing
 * thing the circle could hold.
 *
 * Taken off the name rather than stored, so a name and its circle cannot
 * disagree. The parenthetical the product appends to test clients would turn
 * into a "(" if it were ever added here, so the parts are filtered to the ones
 * that start with a letter.
 */
/**
 * A company's default avatar: the workspace mark on a dark tile, which is what
 * the product falls back to when a company has no logo of its own. 14px, so it
 * reads as a mark beside a 10.5px name without competing with the 20px circle
 * in the column to its left.
 */
/**
 * The product's avatar tints, in its own order.
 *
 * A row of identical grey circles is a placeholder; the product gives each
 * person a tint from a fixed set, which is what makes a list of six read as
 * six people. They are assigned by position here rather than hashed off the
 * name — six rows, one pass through the set, and a hash would only make the
 * picture harder to reason about for no gain a reader can see.
 *
 * BOTH THEMES, per swatch. These are hardcoded hexes inside a surface that
 * flips, which is exactly the case the design guidelines warn about: a pale
 * mint circle on a #191919 row is a lamp. So every swatch carries its dark
 * value beside its light one — the hue held at low alpha for the fill and
 * lightened for the ink — and neither theme can be changed by touching the
 * other.
 */
const AVATAR_TINTS = [
  "bg-[#f1f2f4] text-[#3a3d42] [[data-theme=dark]_&]:bg-[#ffffff14] [[data-theme=dark]_&]:text-[#c9ccd1]",
  "bg-[#dfece6] text-[#2f7d6c] [[data-theme=dark]_&]:bg-[#2f7d6c3d] [[data-theme=dark]_&]:text-[#8ed2c1]",
  "bg-[#e7e3f7] text-[#6253bd] [[data-theme=dark]_&]:bg-[#6253bd3d] [[data-theme=dark]_&]:text-[#b4aaee]",
  "bg-[#f3e2e2] text-[#a85252] [[data-theme=dark]_&]:bg-[#a852523d] [[data-theme=dark]_&]:text-[#e3a4a4]",
  "bg-[#f3e7cf] text-[#9d7325] [[data-theme=dark]_&]:bg-[#9d73253d] [[data-theme=dark]_&]:text-[#dec08a]",
  "bg-[#dde9f2] text-[#5b8bab] [[data-theme=dark]_&]:bg-[#5b8bab3d] [[data-theme=dark]_&]:text-[#a8c9de]",
  "bg-[#e5e8dc] text-[#76805f] [[data-theme=dark]_&]:bg-[#76805f3d] [[data-theme=dark]_&]:text-[#c3cbad]",
  "bg-[#f3e3f2] text-[#7d3f8c] [[data-theme=dark]_&]:bg-[#7d3f8c3d] [[data-theme=dark]_&]:text-[#d1a4da]",
];

function CompanyMark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`flex size-[14px] shrink-0 items-center justify-center rounded-[3px] bg-foreground text-background ${className}`}
    >
      <IconBrandMark className="size-[8px]" />
    </span>
  );
}

function initials(name: string) {
  const parts = name.split(" ").filter((w) => /^[A-Za-z]/.test(w));
  const first = parts[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1] : "";
  return (first[0] ?? "") + (last[0] ?? "");
}

/**
 * The firm and the addresses are SHORT on purpose. The card crops this table a
 * little past its Company column, which leaves the Name column ~156px — enough
 * for a name and an address, and not enough for "chuckd@servicesymphony.com".
 * A truncated address in a picture of a contact list reads as the list being
 * broken rather than as the card being narrow, so the sample data is written
 * to the measure the card actually gives it.
 */
const CONTACTS: Contact[] = [
  {
    name: "Mary Sung",
    email: "mary@symphony.co",
    company: "Symphony",
  },
  {
    name: "Chuck Wilford",
    email: "chuckd@symphony.co",
    company: "Symphony",
  },
  {
    name: "Timothy Leclerc",
    email: "timmy@wave.co",
    company: "Wave Marketing",
  },
  {
    name: "Jasmin Khan",
    email: "jasmin@symphony.co",
    company: "2 companies",
  },
  {
    name: "Kenny Tse",
    email: "ktse2@godo.com",
    company: "Godo",
  },
  {
    name: "Andy Alvarez",
    email: "andy@wave.co",
    company: "Wave Marketing",
  },
];


export function TeamCrmVisual() {
  return (
    <div
      aria-hidden
      // Fills the frame it is given and runs off its foot. It used to carry
      // its own rounded corners, a ring and a 16/9.6 aspect — a free-standing
      // picture of a screen — which inside the pillar card left the screen
      // 7px short of the card's bottom with its own rounded corners showing
      // the card's grey through them, and a second hairline inside the frame's
      // own. The frame draws the edge now (see `visualBare`), so this is just
      // the screen.
      className="pointer-events-none flex h-full select-none flex-col overflow-hidden bg-background"
    >
      <div className="flex min-h-0 flex-1">
        {/* NO SIDEBAR, and no header bar over the table. This card's claim is
            the CRM itself — contacts, companies, custom fields — and the two
            of them spent the left third and the top of the shot on navigation
            and tools, which is furniture around the subject rather than the
            subject. The nav lives on the Add App shot in the same row, where
            the lit row is doing work; here it was a column of places you could
            go instead of looking at this. */}
        {/* Main column — CRM contacts table. */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Tabs — now the first thing on the screen, so the row carries its
              own top inset. It had none: the 34px header bar above it was what
              held it off the screen's edge, and with that gone the switcher
              sat flush against the top with its underline a few pixels from
              the frame. pt-3.5 against the tabs' own pb-1.5 is not symmetry
              for its own sake — a tab's underline IS its bottom edge, so the
              gap under it reads shorter than the number says. */}
          <div className="flex shrink-0 gap-4 border-b border-border px-3 pt-3.5">
            {["Companies", "Contacts"].map((tab, i) => (
              <span
                key={tab}
                className={`-mb-px border-b pb-1.5 text-[11px] leading-none ${
                  i === 1
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground"
                }`}
              >
                {tab}
              </span>
            ))}
          </div>

          {/* Contacts table */}
          <div className="min-h-0 flex-1 overflow-hidden">
            {/* pl-5 against pr-3. The left inset is the one you see — the
                right half of this table is past the card's crop — and at the
                px-3 both sides shared, the avatars sat almost against the
                screen's own edge. */}
            {/* Name is FIXED, not flex-1, and the row ends on a spacer.
                Flexible Name meant the table's total width and its column
                positions were the same number: widen the mock so it reaches
                the card's right edge, and every pixel went into Name and
                pushed Company back out past the crop. Fixed columns plus a
                spacer separate the two — the columns stay where the crop can
                see them, and the spacer takes whatever width is left, so the
                table can be wider than the card without moving anything.

                pl-5 and no right padding: the row runs off the right edge, so
                a right inset is a gap that nobody would ever see the far side
                of. */}
            {/* py-2.5, not py-1.5. The column heads are the shortest type on
                the screen and were in the tightest row — 22px against the
                contact rows' 33 — so the bar read as squeezed between the tabs
                above it and the first contact below. */}
            <div className="flex items-center gap-2 border-b border-border py-2.5 pl-5 text-[10px] leading-none text-muted-foreground">
              <span className="w-[148px]">Name</span>
              <span className="hidden w-[104px] sm:block">Company</span>
              <span className="flex-1" />
            </div>
            {CONTACTS.map((contact, i) => (
              <div
                key={contact.name}
                className="flex items-center gap-2 border-b border-border py-[6px] pl-5 last:border-b-0"
              >
                <span className="flex w-[148px] min-w-0 items-center gap-1.5">
                  {/* 20px, not 18: two letters at 9px need the extra two
                      pixels of circle or they sit against its sides. */}
                  <span
                    className={`flex size-[20px] shrink-0 items-center justify-center rounded-full text-[9px] leading-none ${
                      AVATAR_TINTS[i % AVATAR_TINTS.length]
                    }`}
                  >
                    {initials(contact.name)}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[10.5px] leading-[1.3] text-foreground">
                      {contact.name}
                    </span>
                    <span className="block truncate text-[9.5px] leading-[1.3] text-muted-foreground">
                      {contact.email}
                    </span>
                  </span>
                </span>
                {/* A mark on every company, the way the product draws one.
                    The rows already carry a circle for the person; a bare
                    string in the column beside it read as a note about the
                    contact rather than as a record of its own.

                    `2 companies` gets two marks, offset — the product's own
                    way of saying a contact belongs to more than one, and the
                    only row here where the column is a count rather than a
                    name. The second tile carries a ring in the row's own
                    background so the pair reads as two tiles and not one
                    bitten shape. */}
                <span className="hidden w-[104px] items-center gap-1.5 sm:flex">
                  <span className="relative flex shrink-0 items-center">
                    <CompanyMark />
                    {contact.company === "2 companies" ? (
                      <CompanyMark className="-ml-[7px] ring-[1.5px] ring-background" />
                    ) : null}
                  </span>
                  <span className="min-w-0 truncate text-[10.5px] leading-none text-muted-foreground">
                    {contact.company}
                  </span>
                </span>
                <span className="flex-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
