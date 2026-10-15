"use client";

import { useState } from "react";
import { NavRow } from "@/components/client-portal/segment-mock";
import {
  IconBrandMark,
  IconCard,
  IconChat,
  IconDocuments,
  IconFile,
  IconGlobe,
  IconLock,
} from "@/components/home/mock-icons";
import { ViewToggle } from "@/components/ui/view-toggle";
import {
  MOCK_MICRO,
  MOCK_PRIMARY,
  MOCK_SECONDARY,
} from "@/components/ui/mock-type";

// ─────────────────────────────────────────────────────────────────────────
// V5 — "One firm, a different view for every client", the accounting page's
// own picture.
//
// The section used to fall through to PortalTailor's four cards, which are
// /client-portal's: a campaign approval round, a Gantt of agency engagements,
// Brandmages down the nav. Four pictures of a marketing agency under a heading
// about an accounting firm, and — worse for the argument — four DIFFERENT apps,
// which proves a portal can hold four things rather than that one portal looks
// different to two clients.
//
// THE TRAY AND THE TOGGLE ARE THE PROBLEM SECTION'S, two screens up this same
// page. One portal, switched between two clients, rather than two windows set
// side by side: side by side each one got half of half a rail, which is 260px
// for a nav and a screen, and every label in both of them truncated — the nav
// read "Estimated pa…" and the file rows read "Bank sta…". A picture whose
// subject is what the client SEES cannot be drawn at a size where the client
// cannot read it.
//
// It also states the claim better. Two frames side by side are two portals
// until the reader works out they are not; one frame with the client's name on
// a switch above it is the same portal by construction, which is the sentence
// the heading makes.
//
// The three things the handoff asks for are what differs between the two:
//
//  - TWO CLIENT VIEWS. A business with payroll and year-end work, and a person
//    with quarterly estimates. Neither nav is a subset of the other, because
//    "fewer apps for the smaller client" is a permissions story and this is a
//    fit story. They are named by KIND rather than by name — see `names`.
//  - THE CLIENT'S NAME, on the switch above the tray rather than inside the
//    nav. The handoff asks for an entity switcher in the sidebar and THE
//    PRODUCT HAS NO SUCH CONTROL — it was drawn here as a pill under the firm's
//    mark, which is a picture of UI that does not exist. The switch above the
//    tray does the same job honestly: it names whose portal this is and it
//    really does change it.
//  - THE LOCKED FOLDER, in the individual's nav. It stays IN the list rather
//    than being dropped from it: a row that is absent says nothing, and a row
//    that is present and shut is the only way a picture can show that the firm
//    decides what each client reaches.
// ─────────────────────────────────────────────────────────────────────────

const LINE = "border-[var(--mock-line)]";

/** The rows both clients get, so what sits under them reads as a choice. */
const STOCK = [
  { icon: <IconGlobe className="size-[13px]" />, label: "Home" },
  { icon: <IconChat className="size-[13px]" />, label: "Messages" },
  { icon: <IconFile className="size-[13px]" />, label: "Files" },
  { icon: <IconCard className="size-[13px]" />, label: "Billing" },
];

type PaneRow = { name: string; meta: string };

type ClientView = {
  /** What this client IS, on the switch above the tray. */
  entity: string;
  /** The firm's apps this client gets, under the stock rows. Last is open. */
  apps: { icon: React.ReactNode; label: string; locked?: boolean }[];
  pane: { title: string; rows: PaneRow[] };
};

const CLIENTS: ClientView[] = [
  {
    entity: "A business client",
    apps: [
      { icon: <IconFile className="size-[13px]" />, label: "Payroll" },
      { icon: <IconDocuments className="size-[13px]" />, label: "Year-end docs" },
    ],
    pane: {
      title: "Year-end docs",
      // TWELVE ROWS, more than the frame holds. The list runs off the foot
      // of the window the way the window runs off the foot of the tray —
      // a checklist that ended inside the frame would be a short list rather
      // than a screen you are looking at part of.
      rows: [
        { name: "Q3 payroll reports", meta: "Uploaded Sep 2" },
        { name: "Bank statements", meta: "Uploaded Sep 2" },
        { name: "Fixed asset log", meta: "Needs upload" },
        { name: "2026 engagement letter", meta: "Signed Jan 14" },
        { name: "Prior-year return", meta: "Shared by Ledgerline" },
        { name: "Depreciation schedule", meta: "Needs upload" },
        { name: "Merchant statements", meta: "Uploaded Aug 28" },
        { name: "Loan amortisation", meta: "Uploaded Aug 28" },
        { name: "Owner draws summary", meta: "Needs upload" },
        { name: "Equipment invoices", meta: "Uploaded Jul 9" },
        { name: "Insurance schedule", meta: "Uploaded Jul 9" },
        { name: "Year-end questionnaire", meta: "Needs upload" },
      ],
    },
  },
  {
    entity: "An individual client",
    apps: [
      { icon: <IconDocuments className="size-[13px]" />, label: "Estimated payments" },
      { icon: <IconLock className="size-[13px]" />, label: "Workpapers", locked: true },
    ],
    pane: {
      title: "Estimated payments",
      // Twelve quarters, for the reason the list beside it has twelve rows.
      // Three years of estimates is also simply what the app holds.
      rows: [
        { name: "Q3 2026 federal", meta: "$4,200 · scheduled Sep 15" },
        { name: "Q3 2026 state", meta: "$960 · scheduled Sep 15" },
        { name: "Q2 2026 federal", meta: "$4,200 · paid Jun 14" },
        { name: "Q2 2026 state", meta: "$960 · paid Jun 14" },
        { name: "Q1 2026 federal", meta: "$4,200 · paid Mar 15" },
        { name: "Q1 2026 state", meta: "$960 · paid Mar 15" },
        { name: "Q4 2025 federal", meta: "$3,850 · paid Jan 15" },
        { name: "Q4 2025 state", meta: "$880 · paid Jan 15" },
        { name: "Q3 2025 federal", meta: "$3,850 · paid Sep 15" },
        { name: "Q3 2025 state", meta: "$880 · paid Sep 15" },
        { name: "Q2 2025 federal", meta: "$3,850 · paid Jun 16" },
        { name: "Q2 2025 state", meta: "$880 · paid Jun 16" },
      ],
    },
  },
];

/**
 * The client's nav, under the firm's mark.
 *
 * The firm's name and nothing else above the rows: it is the firm's portal, and
 * the client it is being shown to is named on the switch above the tray.
 */
function ClientNav({ client }: { client: ClientView }) {
  return (
    <div // 152px, not the 136 the portal nav takes elsewhere. The longest row
      // here is "Estimated payments", which truncated at 136 — and a nav
      // whose open row is cut short is the one thing this picture cannot
      // show, since what each client SEES is the whole argument.
      className="relative flex w-[152px] shrink-0 flex-col gap-[2px] bg-[var(--mock-brand)] px-2 py-2.5">
      <span className="flex items-center gap-1.5 px-1.5 pb-2">
        <span className="flex size-[15px] items-center justify-center rounded-[3px] bg-white text-black">
          <IconBrandMark className="size-[8px]" />
        </span>
        <span className={`truncate text-white ${MOCK_SECONDARY}`}>
          Ledgerline
        </span>
      </span>

      <div className="mt-1 flex flex-col gap-[2px]">
        {STOCK.map(({ icon, label }) => (
          <NavRow key={label} icon={icon} label={label} branded />
        ))}
        {/* The firm's own apps, clear of the stock rows. The break says they
            are not stock without spending a row of type on saying so. */}
        <div className="mt-2 flex flex-col gap-[2px]">
          {client.apps.map(({ icon, label, locked }, i) => (
            <NavRow
              key={label}
              icon={icon}
              label={label}
              branded
              muted={locked}
              active={!locked && i === client.apps.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * The open app, beside the nav.
 *
 * Two lines a row and no thumbnail tile. The tile is the shape the file rows
 * take elsewhere in this set and it is not worth its measure here: what the
 * row has to carry is a name and where it has got to, and six of those reach
 * the foot of the frame, which is what makes this a window onto a screen that
 * carries on rather than a list that ran out.
 */
function AppPane({ title, rows }: { title: string; rows: PaneRow[] }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <div className={`border-b px-4 py-3 ${LINE}`}>
        <span className={`text-[color:var(--mock-ink)] ${MOCK_PRIMARY}`}>
          {title}
        </span>
      </div>
      <div className="flex min-h-0 flex-1 flex-col">
        {/* NAME LEFT, STATE RIGHT — one line, not two. Stacked rows were for
            a pane 150px wide, where a name and its state could not share a
            line. Across the full measure the stack leaves a column of empty
            pane to the right of every row, and a file list that sets its state
            in a right-hand column is what the product actually draws. */}
        {rows.map(({ name, meta }) => (
          <span
            key={name}
            className={`flex items-center gap-4 border-b px-4 py-[11px] ${LINE}`}
          >
            <span
              className={`min-w-0 flex-1 truncate text-[color:var(--mock-ink)] ${MOCK_SECONDARY}`}
            >
              {name}
            </span>
            <span
              className={`shrink-0 text-[color:var(--mock-ink-soft)] ${MOCK_MICRO}`}
            >
              {meta}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function AccountingViewsVisual() {
  const [selected, setSelected] = useState(0);
  const client = CLIENTS[selected];
  // WHAT EACH CLIENT IS, not who. The switch read "Harbor Dental PLLC" and
  // "Delgado Household", which made the control look like a customer list and
  // asked the reader to work out what a dental practice and a household have
  // to do with the heading. The point is the KIND of client — a business with
  // payroll and year-end work, a person with quarterly estimates — so the
  // switch says that and the screens carry the detail.
  const names = CLIENTS.map((c) => c.entity);

  return (
    <div>
      {/* THE PROBLEM SECTION'S TRAY, class for class — including its dark
          branch, where the tray turns paper and re-points the five page tokens
          its subtree reads so the toggle is not white on white. The --mock-*
          tokens are deliberately untouched, so the screen standing on it stays
          dark-themed. See portal-problem.tsx for the reasoning; this is a
          second caller of that treatment, not a second version of it. */}
      <div
        // A HEIGHT, not the handoff's 4:3. The ratio was written for a picture
        // in half a rail; across the whole measure 4:3 is 840px of tray, which
        // is a section and a half of scrolling for one screen. The window keeps
        // its own proportions and crops at the foot, which is what it does in
        // every other section on this page.
        className="relative h-[420px] overflow-hidden rounded-2xl bg-[var(--surface)] px-4 pb-0 pt-3 md:h-[470px] md:rounded-3xl md:px-6 md:pb-0 md:pt-4 [[data-theme=dark]_&]:bg-[#F5F5F0] [[data-theme=dark]_&]:[--surface:#F5F5F0] [[data-theme=dark]_&]:[--foreground:#101114] [[data-theme=dark]_&]:[--muted-foreground:#6b7079] [[data-theme=dark]_&]:[--border:#e8e9ec] [[data-theme=dark]_&]:[--background:#ffffff]">
        {/* Top right, from md: a control on a picture rather than a heading for
            one. At the left it sits under the section's own copy and reads as
            the next line of it. The gap over the screen is this row, not a
            margin — see the same note in portal-problem. */}
        <div className="hidden justify-end md:mb-3 md:flex">
          <ViewToggle
            onPaper
            options={names}
            view={selected}
            onSelect={setSelected}
            label="Which client's portal to show"
          />
        </div>

        {/* The screen runs off the tray's foot. It is a window onto a portal
            that carries on, which is what every screen in this family does, and
            it is what lets the pane hold a dozen rows at a readable size. */}
        <div
          aria-hidden
          // .mock-edge on the set's own shape: a lit hairline in dark, where a
          // flat --mock-line the whole way round reads as an outline drawn on
          // the picture rather than as a window catching light. Open at the
          // foot, so `border-b-0` — and .mock-edge paints into the border box,
          // so an edge that is not there is simply not painted.
          className={`mock-edge flex h-full select-none overflow-hidden rounded-t-xl border border-b-0 bg-[var(--mock-window)] text-[color:var(--mock-ink)] ${LINE}`}
        >
          <ClientNav client={client} />
          <AppPane title={client.pane.title} rows={client.pane.rows} />
        </div>
      </div>

      {/* THE PHONE'S COPY, under the tray on the page's own ground. In the
          corner the control works on a wide screen; on a 375px phone the tray
          is the full measure and the switch sat on top of the picture it
          switches, reading as part of the app in it. Rendered twice rather than
          moved, because it has to leave the tray's overflow box to sit on the
          page at all; both drive the same state. */}
      <div className="mt-4 flex justify-center md:hidden">
        <ViewToggle
          options={names}
          view={selected}
          onSelect={setSelected}
          label="Which client's portal to show"
        />
      </div>
    </div>
  );
}
