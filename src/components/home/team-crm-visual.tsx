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
import {
  MOCK_MICRO,
  MOCK_PRIMARY,
  MOCK_PRIMARY_STACKED,
  MOCK_SECONDARY,
  MOCK_SECONDARY_STACKED,
} from "@/components/ui/mock-type";

type Contact = {
  name: string;
  email: string;
  company: string;
  phone: string;
  /** A custom field. Blank for the rows that have not been given one. */
  tag?: string;
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

/**
 * EACH COMPANY ITS OWN MARK, rather than Assembly's placeholder six times.
 *
 * The column used to draw `IconBrandMark` — the workspace mark the product
 * falls back to when a company has no logo of its own — on every row. That is
 * what the product does for a company that has not uploaded one, but six of
 * them down a column reads as the rows all belonging to the same place, which
 * is the opposite of what a CRM screenshot is for. Three companies, three
 * marks.
 *
 * They are PATHS, not a webfont. Two of them are single letters at 9px inside a
 * 14px tile; shipping three display faces (and three @font-face rules, and the
 * swap) to set two glyphs that never change is a lot of bytes for a decoration,
 * and an outline cannot FOUT. Lettermarks are drawn as outlines in real
 * identity work for the same reason.
 *
 * Drawn to a 0 0 100 100 box so the three sit at one scale and `size-*` is the
 * only thing that sets them.
 */

/** Symphony — the four-petal mark, the one company here with real artwork. */
function MarkSymphony({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 162 163" fill="currentColor" className={className}>
      <path d="M161.974 80.9972C161.974 92.9841 159.84 104.475 155.944 115.121C152.669 124.056 141.751 127.332 133.885 121.946C120.858 112.987 112.322 97.9972 112.322 81.022C112.322 64.0468 120.858 49.057 133.885 40.0979C141.726 34.7125 152.669 37.9636 155.944 46.9227C159.84 57.5695 161.974 69.0352 161.974 81.0468V80.9972Z" />
      <path d="M49.6515 80.9911C49.6515 97.9911 41.1157 112.981 28.0887 121.94C20.2477 127.325 9.30501 124.05 6.02965 115.115C2.13395 104.468 0 92.978 0 80.9911C0 69.0042 2.13395 57.5137 6.02965 46.867C9.30501 37.9327 20.2229 34.6568 28.0887 40.0422C41.1157 49.0013 49.6515 63.9911 49.6515 80.9911Z" />
      <path d="M121.884 133.925C127.287 141.786 124.035 152.714 115.085 155.987C104.44 159.884 92.9513 162.018 80.9665 162.018C68.9816 162.018 57.493 159.884 46.8481 155.987C37.9153 152.711 34.6399 141.767 40.0244 133.925C48.982 120.92 63.9693 112.358 80.9417 112.358C97.9051 112.358 112.91 120.886 121.845 133.904Z" />
      <path d="M115.123 6.03066C124.056 9.30658 127.331 20.2263 121.947 28.0934C113.014 41.1227 98.0018 49.6599 81.0047 49.6599C64.0075 49.6599 49.0203 41.1227 40.0875 28.0934C34.703 20.2511 37.9535 9.30658 46.9111 6.03066C57.5313 2.13431 69.0198 0 81.0047 0C92.9895 0 104.478 2.13431 115.123 6.03066Z" />
    </svg>
  );
}

/**
 * Wave — a W from GTL001, outlined. The face is a heavy geometric
 * sans whose joints are cut rather than curved, so the letter survives being
 * 9px tall: it is all stem and no detail, which is the only thing that reads at
 * this size.
 */
function MarkWave({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
      <path d="M31.3 96.7 30 95.3 0 8.7V6L2.7 3.3H29.3L30.7 4.7V28.7L32 30H33.3L34.7 28.7V4.7L36 3.3H64L65.3 4.7V28.7L66.7 30H68L69.3 28.7V4.7L70.7 3.3H97.3L100 6V8.7L70 95.3L68.7 96.7H66L64.7 95.3L51.3 56.8L50 56.1L48.7 56.8L35.3 95.3L34 96.7Z" />
    </svg>
  );
}

/**
 * Godo — a G from GTL001, outlined.
 *
 * It was Calyx's G, for a second face in the column. Calyx builds its letters
 * out of circles and stadiums with hairline seams drawn through them, and at
 * 8px none of that survives: the G arrived as a round blob with a dot in it,
 * legible as a shape and not as a letter. Array, the third face, is a
 * dot-matrix — its dots merge into a smear well before this size. So both
 * letters are GTL001, which is the one of the three that is still a letter at
 * 8px, and the variety in this column comes from Symphony's real artwork
 * sitting beside two letterforms rather than from three faces.
 *
 * The G and the W are also different enough in GTL001 to do the job: the W is
 * all diagonal and open at the top, the G is a near-closed circle with one
 * horizontal bar cut into it.
 */
function MarkGodo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
      <path d="M51 100Q40.1 100 30.8 96Q21.6 92.1 14.7 85.1Q7.8 78.1 4.1 69.1Q0.3 60.1 0.3 50.1Q0.3 40 4.1 30.9Q7.8 21.8 14.5 14.9Q21.2 7.9 29.9 4Q38.5 0 48.3 0Q59.8 0 67.4 2.8Q74.9 5.7 79.7 10.1Q84.4 14.6 87.2 19.4V22.2L85.8 25L47.7 46.9L47 48.3L48.4 50H96.9L99.7 52.8V95.8L96.9 98.6H94.1L91.3 95.8L85.8 87.6L84.4 86.9L83 87.6Q79.8 90.4 75.3 93.3Q70.8 96.1 64.8 98.1Q58.8 100 51 100Z" />
    </svg>
  );
}

/**
 * The tile the mark sits on, and the lookup from a company name to its mark.
 *
 * EACH COMPANY ITS OWN COLOUR, white mark knocked out of it — a brand tile,
 * which is what a CRM shows beside a company and what these three marks were
 * drawn to sit on.
 *
 * It went through two other states first. A near-black slab for all three put
 * Symphony's mark in the wrong polarity: it is four petals around a gap, so
 * knocked out of black the gaps were what you saw. A pale neutral tile fixed
 * that and made three companies look like one filing system. The colour is
 * what makes them read as three businesses.
 *
 * DARK MARKS ON THE COLOURED TILES, not white ones. White knockout is the
 * reflex for a brand tile and it was wrong for these three, because all three
 * are LIGHT mid-tones — measured against white the contrast is 2.4:1 on the
 * blue, 2.0:1 on the teal and 3.2:1 on the orange, so at 8px the W was a pale
 * shape dissolving into its own tile. Against #111 the same three are 7.8,
 * 9.3 and 6.0:1. Black wins on every one of them, which is why this is one
 * rule rather than an exception for the teal.
 *
 * Symphony is the exception that proves it: its tile is not a mid-tone, it is
 * black (and near-white in dark), so its mark is the one that stays knocked
 * out.
 *
 * HARDCODED, AND THE TWO COLOURED ONES DO NOT FLIP. This is the case the
 * design guidelines' rule about theme-scoped colour does not cover: these are
 * fictional firms' brand colours, the same argument as Google's G further down
 * the login mock, and a brand that changed between light and dark would not be
 * a brand. Wave's and Godo's are mid-tone on purpose, so they hold against the
 * white row in light and the near-black one in dark with one value each.
 *
 * SYMPHONY IS THE EXCEPTION, and has to be. Its tile is black, and this
 * screen's ground in dark is rgb(10,10,10) — a black tile on it is not a quiet
 * tile, it is no tile at all, and the mark knocked out of it would be four
 * white petals floating in the row. So the monochrome brand inverts: black
 * slab with a white mark in light, white slab with a black mark in dark. That
 * is what a one-colour logo does on a dark ground everywhere, and it is the
 * only one of the three that needs it — the other two are mid-tone and a
 * mid-tone has somewhere to sit in both themes.
 *
 * Class strings rather than hexes, so the override can live in the same place
 * as the value it overrides.
 */
const COMPANY_TILES: Record<string, string> = {
  Symphony:
    "bg-[#111111] text-white [[data-theme=dark]_&]:bg-[#f2f2f2] [[data-theme=dark]_&]:text-[#111111]",
  Wave: "bg-[#63C7B2] text-[#111111]",
  Godo: "bg-[#F06449] text-[#111111]",
};
/**
 * Which mark each company gets, and how big it sits in its 14px tile.
 *
 * SIZED PER MARK, not one number for all three. These are artwork and two
 * letters drawn to three different boxes, so a shared size sets them at three
 * different optical weights — the rule a logo lockup follows, where the glyph
 * and the wordmark are never scaled by the same factor.
 *
 * A company with no entry falls back to Assembly's placeholder mark, which is
 * what the product does.
 */
const COMPANY_MARKS: Record<
  string,
  { Mark: (p: { className?: string }) => React.ReactElement; size: string }
> = {
  // 7.5px: the petals reach the edge of their own box on all four sides, so
  // this one is already the widest-set of the three at any given number.
  Symphony: { Mark: MarkSymphony, size: "size-[7.5px]" },
  // 8px, and it used to be 9. The W is a wide, flat-bottomed letter that fills
  // its box corner to corner; at 9 it touched the tile's rounding and read as
  // a letter jammed into a square rather than as a mark sitting in one.
  Wave: { Mark: MarkWave, size: "size-[8px]" },
  // 7.5px against the W's 8. A near-circle reads larger than a letter made of
  // diagonals at the same measured size, so the G is held half a pixel under
  // it — an optical correction, not an arithmetic one.
  Godo: { Mark: MarkGodo, size: "size-[7.5px]" },
};

function CompanyMark({
  company,
  className = "",
}: {
  company: string;
  className?: string;
}) {
  const entry = COMPANY_MARKS[company];
  const tile = COMPANY_TILES[company];
  return (
    <span
      // A company with no colour of its own falls back to the neutral swatch
      // the first avatar circle wears — reused rather than re-picked, so there
      // is one neutral in this picture and not two that nearly match.
      className={`flex size-[14px] shrink-0 items-center justify-center rounded-[3px] ${
        tile ?? AVATAR_TINTS[0]
      } ${className}`}
    >
      {entry ? (
        <entry.Mark className={entry.size} />
      ) : (
        <IconBrandMark className="size-[8px]" />
      )}
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
/**
 * FICTIONAL NUMBERS ONLY, and the 555-01xx block specifically — it is the
 * range reserved for fiction, so nothing here can ever ring a real person.
 *
 * This list is sample data in a marketing screenshot. Nothing in it may be
 * copied from a real CRM, a support ticket, or a screenshot someone shared to
 * describe a layout: a number that looks plausible IS someone's number. The
 * names, addresses and firms here are invented for the same reason.
 */
const CONTACTS: Contact[] = [
  {
    name: "Mary Sung",
    email: "mary@symphony.co",
    company: "Symphony",
    phone: "(555) 010-4471",
    tag: "Retainer",
  },
  {
    name: "Chuck Wilford",
    email: "chuckd@symphony.co",
    company: "Symphony",
    phone: "(555) 010-2286",
  },
  {
    name: "Timothy Leclerc",
    email: "timmy@wave.co",
    company: "Wave",
    phone: "(555) 010-7715",
    tag: "Project",
  },
  {
    name: "Jasmin Khan",
    email: "jasmin@symphony.co",
    company: "2 companies",
    phone: "(555) 010-3390",
  },
  {
    name: "Kenny Tse",
    email: "ktse2@godo.com",
    company: "Godo",
    phone: "(555) 010-6128",
    tag: "Retainer",
  },
  {
    name: "Andy Alvarez",
    email: "andy@wave.co",
    company: "Wave",
    phone: "(555) 010-8834",
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
      //
      // THE --mock-* FAMILY, NOT THE PAGE TOKENS. This screen was the one shot
      // in the pillar row still built on `bg-background` / `border-border` /
      // `text-foreground`, which are the PAGE's values. In light the two sets
      // nearly agree, so nothing showed; in dark the page ground is
      // rgb(10,10,10) and the card under it is #191919, so the screen came out
      // DARKER than the card it is lying on — a hole cut in the card rather
      // than a panel sitting on it, with its hairlines at --border too faint
      // to state a table. --mock-window is #212121, a step UP from the card,
      // which is the whole reason that token exists; --mock-line and the two
      // inks come with it so the rules and the type sit on the same ladder as
      // the Add App and Branding screens beside it.
      // NO pointer-events-none any more: the rows answer the cursor (below),
      // and a shot that cannot be pointed at cannot have a hover state.
      // `select-none` stays — this is a picture of a table, not a table, and a
      // drag across it should not leave half a contact highlighted.
      className="flex h-full select-none flex-col overflow-hidden bg-[var(--mock-window)]"
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
          <div className="flex shrink-0 gap-4 border-b border-[var(--mock-line)] px-3 pt-3.5">
            {["Companies", "Contacts"].map((tab, i) => (
              <span
                key={tab}
                className={`-mb-px border-b pb-1.5 ${MOCK_PRIMARY} ${
                  i === 1
                    ? "border-[var(--mock-ink)] text-[color:var(--mock-ink)]"
                    : "border-transparent text-[color:var(--mock-ink-soft)]"
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
            <div
              // gap-5 UNDER `sm`, gap-2 above — and the row below takes the
              // same pair, or the heads stop sitting over their columns.
              //
              // On a phone only two columns are drawn, and they were set at
              // the seven-column gap: the Name cell's address truncates at its
              // full width, so the ellipsis ended 8px from the company mark
              // and the two columns read as one run of text. There is room for
              // it — two columns and the shot's own inset come to 264 of the
              // 287 the contained shot has — so the gap takes 12 of the 23 that
              // were spare. From `sm` four columns are drawn and 8px is what
              // fits them.
              className={`flex items-center gap-5 border-b border-[var(--mock-line)] py-2.5 pl-5 text-[color:var(--mock-ink-soft)] sm:gap-2 ${MOCK_SECONDARY}`}
            >
              {/* NO `sm:` GATE ON COMPANY, and the Name column steps instead.
                  The column used to be `hidden sm:block`, which is a VIEWPORT
                  query on a mock that is laid out at a fixed 360px whatever
                  the viewport is — so on a phone the card showed a contact
                  list with no company in it under a heading about companies,
                  and the right half of every row was empty ground. The width
                  was always there; only the breakpoint was hiding it.

                  124 under `sm`, 148 above. The card is 327 wide on a phone
                  against the shot's 360, and the budget is fixed: the shot's
                  left inset (20px) + its own pl-5 + Name + the 8px gap +
                  Company has to land inside the 288px of card the right-edge
                  ramp leaves solid. The 24px comes off the one column that can
                  spare it — the address truncates a character or two earlier,
                  which is a smaller loss than the company column sitting under
                  the gradient. */}
              <span className="w-[124px] shrink-0 sm:w-[148px]">Name</span>
              <span className="w-[112px] shrink-0">Company</span>
              {/* TWO MORE COLUMNS, SHOWN FROM `sm` ONLY.
                  
                  Below `sm` the shot is contained inside the card (see
                  `containOnPhone`) and is ~287px wide — Name and Company
                  already fill it, and with four columns asking for 540 the
                  flex row shrank all of them to fit, so a phone got four
                  squeezed columns with "Mary …" in the first. Two columns at
                  their drawn width beat four at any width.

                  From `lg` they are drawn but unreachable: the shot goes back
                  to its fixed 360 and they sit past the frame's own crop,
                  which is the same "table that carries on" the right-edge ramp
                  is already claiming. Every column is `shrink-0` so that stays
                  true — without it the row would squeeze all four into 360
                  rather than letting two of them run off the edge.

                  Between those two breakpoints the bento has not split into
                  columns yet, so this card is the full width of the page and
                  the shot runs to its right edge (see `containOnPhone`'s
                  `sm:right-0`). Two columns were what that width was missing:
                  it was ~690px of card holding a 360px table, so two thirds of
                  the card was empty ground with a gradient over it.

                  Phone and Tags rather than two more of the same: Tags is a
                  CUSTOM FIELD, which is the third thing this card's copy
                  promises ("Contacts, companies, and custom fields") and the
                  only one of the three the shot was not showing. */}
              <span className="hidden w-[130px] shrink-0 sm:block">Phone</span>
              <span className="hidden w-[130px] shrink-0 sm:block">Tags</span>
              <span className="flex-1" />
            </div>
            {CONTACTS.map((contact, i) => (
              <div
                key={contact.name}
                // py-[9px], up from 6, and min-h 39 from 33 — the floor moves
                // with the padding so the empty last row keeps the same height
                // as the ones above it. The rows were set by their contents:
                // a 11.5/1.3 name over a 10.5/1.35 address is ~29px of type,
                // and 6px of air either side left the gap between two people
                // smaller than the gap between a person's name and their own
                // address. The pair has to read as one record before the rows
                // read as a list, so the space BETWEEN records has to beat the
                // space inside one.
                // THE ROW ANSWERS THE CURSOR. --mock-well is the recess the
                // table head already wears, so a hovered row is lit by the
                // same step the screen uses everywhere else rather than by a
                // tint invented for this one state — and because it is a
                // token, it is right in both themes without a second value.
                //
                // Not on the empty last row: there is no record under the
                // cursor there, and a blank strip that lights up is the mock
                // claiming something is there.
                className={`flex min-h-[39px] items-center gap-5 border-b border-[var(--mock-line)] py-[9px] pl-5 transition-colors duration-150 last:border-b-0 sm:gap-2 ${
                  i === CONTACTS.length - 1
                    ? ""
                    : "hover:bg-[var(--mock-well)]"
                }`}
              >
                {/* THE LAST ROW IS EMPTY, and keeps everything else: its
                    height, its hairlines, its ground running off the card's
                    right edge.

                    It carried a sixth contact, which the card's bottom crop
                    cut through — so the table ended on a half-drawn person,
                    which reads as the shot being broken rather than as a list
                    that carries on. An empty row of the same height is the
                    next record not yet in view: the rule under it is still
                    there, the ground still reaches the edge, and nothing is
                    sliced. min-h-[39px] because the avatar was what set the
                    row's height, and the empty row has no avatar. */}
                {i === CONTACTS.length - 1 ? null : (
                  <>
                    <span className="flex w-[124px] min-w-0 shrink-0 items-center gap-1.5 sm:w-[148px]">
                      {/* 20px, not 18: two letters at 9px need the extra two
                      pixels of circle or they sit against its sides. */}
                      <span
                        className={`flex size-[20px] shrink-0 items-center justify-center rounded-full ${MOCK_MICRO} ${
                          AVATAR_TINTS[i % AVATAR_TINTS.length]
                        }`}
                      >
                        {initials(contact.name)}
                      </span>
                      <span className="min-w-0">
                        <span
                          className={`block truncate text-[color:var(--mock-ink)] ${MOCK_PRIMARY_STACKED}`}
                        >
                          {contact.name}
                        </span>
                        <span
                          className={`block truncate text-[color:var(--mock-ink-soft)] ${MOCK_SECONDARY_STACKED}`}
                        >
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
                    {/* 112, and it stays there now the longest name is
                    "2 companies" rather than "Wave Marketing". It was 104, and
                    went up when the company name moved to the shared
                    MOCK_PRIMARY (11.5px) with every other row label on the
                    site — at 104 "Wave Marketing" came three pixels short and
                    truncated. The firm is just "Wave" today, so nothing in the
                    column needs the extra width; it is kept because the column
                    is followed by a flex-1 spacer, so the width costs empty
                    space rather than anything on the Name column, and a column
                    cut to its current contents is one that truncates the next
                    time a name is added. */}
                    <span className="flex w-[112px] shrink-0 items-center gap-1.5">
                      <span className="relative flex shrink-0 items-center">
                        <CompanyMark
                          company={
                            contact.company === "2 companies"
                              ? "Symphony"
                              : contact.company
                          }
                        />
                        {contact.company === "2 companies" ? (
                          // The SECOND company is a different one, not Symphony
                          // twice. The row says this contact belongs to more than
                          // one place, and two of the same mark says the opposite
                          // — which was the bug in miniature that this whole pass
                          // is about. Jasmin's address is @symphony.co, so
                          // Symphony is the one in front and Wave is the other.
                          <CompanyMark
                            company="Wave"
                            className="-ml-[7px] ring-[1.5px] ring-[var(--mock-window)]"
                          />
                        ) : null}
                      </span>
                      <span
                        className={`min-w-0 truncate text-[color:var(--mock-ink-soft)] ${MOCK_PRIMARY}`}
                      >
                        {contact.company}
                      </span>
                    </span>
                    <span
                      className={`hidden w-[130px] shrink-0 truncate text-[color:var(--mock-ink-soft)] sm:block ${MOCK_PRIMARY}`}
                    >
                      {contact.phone}
                    </span>
                    {/* The custom field, drawn the way the product draws a tag
                        — a bordered pill on the window, not a filled chip. The
                        site's own tag pattern (mono, uppercase, bg-muted) is
                        for the SITE's chrome; inside a product shot the
                        product's own styling is what makes it read as a
                        screenshot. Rows without one are blank, as they are in
                        the product: a tag is something somebody added. */}
                    <span className="hidden w-[130px] shrink-0 sm:block">
                      {contact.tag ? (
                        <span
                          className={`inline-flex items-center rounded-[4px] border border-[var(--mock-line)] px-1.5 py-[3px] text-[color:var(--mock-ink-soft)] ${MOCK_SECONDARY}`}
                        >
                          {contact.tag}
                        </span>
                      ) : null}
                    </span>
                  </>
                )}
                {/* The spacer stays on every row, the empty one included — it
                    is what lets the table be wider than the card without
                    moving the columns, so the blank row has to keep the same
                    width as the ones above it or its hairline would stop
                    short of the edge. */}
                <span className="flex-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
