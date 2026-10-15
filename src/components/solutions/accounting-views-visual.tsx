"use client";

import { useState } from "react";
import { NavRow } from "@/components/client-portal/segment-mock";
import {
  IconLedgerline,
  IconCard,
  IconChat,
  IconDocuments,
  IconFile,
  IconGlobe,
  IconLock,
  IconChevronDown,
  IconSearch,
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
  /** Draws the open app as the client's document collection instead of rows. */
  requests?: boolean;
  /** Draws the open app as the individual's tax return instead of rows. */
  taxReturn?: boolean;
};

const CLIENTS: ClientView[] = [
  {
    entity: "A business client",
    apps: [
      { icon: <IconFile className="size-[13px]" />, label: "Payroll" },
      {
        icon: <IconDocuments className="size-[13px]" />,
        label: "Document collection",
      },
    ],
    // The product's client-side document collection: what the firm has asked
    // for, grouped by where each request has got to. See RequestsPane.
    pane: { title: "Document collection", rows: [] },
    requests: true,
  },
  {
    entity: "An individual client",
    apps: [
      {
        icon: <IconDocuments className="size-[13px]" />,
        label: "2025 tax return",
      },
      {
        icon: <IconLock className="size-[13px]" />,
        label: "Workpapers",
        locked: true,
      },
    ],
    // The return itself, which is what an individual comes to an accounting
    // portal for: where it has got to, the one thing they have to do, and
    // what is still missing. It replaces a ledger of estimated payments —
    // twelve near-identical rows of amounts, which read as a bank statement
    // rather than as an app the firm built for this client.
    pane: { title: "2025 tax return", rows: [] },
    taxReturn: true,
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
      className="relative flex w-[152px] shrink-0 flex-col gap-[2px] bg-[var(--ledgerline-clay)] px-2 py-2.5"
    >
      <span className="flex items-center gap-1.5 px-1.5 pb-2">
        <span className="flex size-[15px] items-center justify-center rounded-[3px] bg-[var(--ledgerline-sage)] text-[color:var(--ledgerline-ink)]">
          <IconLedgerline className="size-[10px]" />
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

// Two glyphs the shared set does not carry, drawn to its light-stroke
// convention.
const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function IconEye({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} {...STROKE}>
      <path d="M1.75 8S4 3.75 8 3.75 14.25 8 14.25 8 12 12.25 8 12.25 1.75 8 1.75 8Z" />
      <circle cx="8" cy="8" r="1.9" />
    </svg>
  );
}

function IconDownload({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} {...STROKE}>
      <path d="M8 2.75v7M5 7l3 3 3-3M3 11.5v1.25c0 .4.35.75.75.75h8.5c.4 0 .75-.35.75-.75V11.5" />
    </svg>
  );
}

/** A group's heading: its state, how many, and the fold. */
function RequestGroup({
  label,
  count,
  overdue = false,
}: {
  label: string;
  count: number;
  overdue?: boolean;
}) {
  return (
    <span
      className={`flex shrink-0 items-center gap-1.5 pb-2 pt-3.5 ${MOCK_SECONDARY}`}
    >
      <span
        className={
          overdue
            ? "text-[color:var(--mock-negative-fg)]"
            : "text-[color:var(--mock-ink)]"
        }
      >
        {label}
      </span>
      <span className="text-[color:var(--mock-ink-soft)]">({count})</span>
      <IconChevronDown className="ml-auto size-[8px] text-[color:var(--mock-ink-soft)]" />
    </span>
  );
}

/** One request: its name and state on top, what to do about it underneath. */
function RequestCard({
  title,
  status,
  children,
}: {
  title: string;
  status: "Overdue" | "Accepted" | "Requested";
  children?: React.ReactNode;
}) {
  const dot =
    status === "Overdue"
      ? "bg-[var(--mock-traffic-red)]"
      : status === "Accepted"
        ? "bg-[var(--mock-traffic-green)]"
        : "bg-[var(--mock-ink-soft)]";
  return (
    <div
      className={`flex shrink-0 flex-col overflow-hidden rounded-[6px] border ${LINE}`}
    >
      <span
        className={`flex items-center justify-between gap-3 border-b px-3.5 py-2.5 ${LINE}`}
      >
        <span
          className={`min-w-0 truncate text-[color:var(--mock-ink)] ${MOCK_SECONDARY}`}
        >
          {title}
        </span>
        <span
          className={`flex shrink-0 items-center gap-1 rounded-full border px-2 py-[4px] text-[color:var(--mock-ink)] ${MOCK_MICRO} ${LINE}`}
        >
          <span className={`size-[5px] rounded-full ${dot}`} />
          {status}
        </span>
      </span>
      {children ? (
        <div className="flex flex-col gap-2.5 px-3.5 py-3">{children}</div>
      ) : null}
    </div>
  );
}

/**
 * The client's document collection — the product's own screen, from the
 * client's side: what the firm has asked for, grouped by where each request
 * has got to. Overdue first and in red, then what was accepted with the file
 * that settled it. It runs off the foot of the window into the next group.
 */
function RequestsPane({ title }: { title: string }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <div className={`border-b px-4 py-3 ${LINE}`}>
        <span className={`text-[color:var(--mock-ink)] ${MOCK_PRIMARY}`}>
          {title}
        </span>
      </div>
      <div className="flex min-h-0 flex-1 flex-col px-4 pt-3">
        <span
          className={`flex shrink-0 items-center gap-1.5 rounded-[4px] border px-2.5 py-[7px] text-[color:var(--mock-ink-soft)] ${MOCK_SECONDARY} ${LINE}`}
        >
          <IconSearch className="size-[11px] shrink-0" />
          Search documents...
        </span>

        <RequestGroup label="Overdue" count={1} overdue />
        <RequestCard
          title="Sales tax exemption certificates — multistate"
          status="Overdue"
        >
          <span
            className={`truncate text-[color:var(--mock-ink-soft)] ${MOCK_MICRO}`}
          >
            Valid resale or exemption certificates for each state where you hold
            nexus ·{" "}
            <span className="text-[color:var(--mock-negative-fg)]">
              Due Aug 15, 2026
            </span>
          </span>
          <span
            className={`w-fit rounded-[4px] border px-2.5 py-[6px] text-[color:var(--mock-ink)] ${MOCK_MICRO} ${LINE}`}
          >
            Upload file
          </span>
        </RequestCard>

        <RequestGroup label="Accepted" count={1} />
        <RequestCard
          title="Inventory count worksheets — mid-year"
          status="Accepted"
        >
          <span
            className={`truncate text-[color:var(--mock-ink-soft)] ${MOCK_MICRO}`}
          >
            Your submission was accepted. No further action needed.
          </span>
          <span
            className={`uppercase tracking-[0.04em] text-[color:var(--mock-ink-soft)] ${MOCK_MICRO}`}
          >
            Submitted file
          </span>
          <span className="flex items-center gap-2.5 rounded-[4px] bg-[var(--mock-well)] px-2.5 py-2">
            <span
              className={`flex size-[22px] shrink-0 items-center justify-center rounded-[4px] border bg-[var(--mock-window)] text-[color:var(--mock-ink-soft)] ${LINE}`}
            >
              <IconFile className="size-[12px]" />
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-1">
              <span
                className={`truncate text-[color:var(--mock-ink)] ${MOCK_SECONDARY}`}
              >
                midyear-inventory-count-signed.pdf
              </span>
              <span
                className={`truncate text-[color:var(--mock-ink-soft)] ${MOCK_MICRO}`}
              >
                Submitted July 3, 2026 at 9:00 AM
              </span>
            </span>
            <IconEye className="size-[12px] shrink-0 text-[color:var(--mock-ink-soft)]" />
            <IconDownload className="size-[12px] shrink-0 text-[color:var(--mock-ink-soft)]" />
          </span>
        </RequestCard>

        <RequestGroup label="Requested" count={4} />
        <RequestCard title="Q3 payroll reports" status="Requested" />
      </div>
    </div>
  );
}

const RETURN_STEPS = ["Organizer", "Preparing", "Review", "Sign", "Filed"];
/** Index of the step the return is on. */
const RETURN_AT = 3;

const RETURN_DOCS: { name: string; from: string; state: "in" | "needed" }[] = [
  { name: "W-2", from: "Northwind Logistics", state: "in" },
  { name: "1099-INT", from: "First Harbor Bank", state: "in" },
  { name: "1098 mortgage interest", from: "Cedar Home Loans", state: "in" },
  { name: "Charitable receipts", from: "Any over $250", state: "needed" },
  { name: "1099-B brokerage", from: "Brightline Invest", state: "needed" },
  { name: "Childcare expenses", from: "Provider and amount", state: "in" },
];

/**
 * The individual's tax return: a stepper for where it has got to, the one
 * action that is theirs right now, and the documents behind it.
 */
function TaxReturnPane({ title }: { title: string }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <div className={`border-b px-4 py-3 ${LINE}`}>
        <span className={`text-[color:var(--mock-ink)] ${MOCK_PRIMARY}`}>
          {title}
        </span>
      </div>
      <div className="flex min-h-0 flex-1 flex-col px-4 pt-4">
        {/* Where the return is. Segments rather than dots, so the track
            reads as distance covered. */}
        <div className="grid shrink-0 grid-cols-5 gap-1.5">
          {RETURN_STEPS.map((step, i) => (
            <span key={step} className="flex min-w-0 flex-col gap-1.5">
              <span
                className={`h-[3px] rounded-full ${
                  i < RETURN_AT
                    ? "bg-[var(--mock-ink)]"
                    : i === RETURN_AT
                      ? "bg-[var(--mock-ink-soft)]"
                      : "bg-[var(--mock-well-3)]"
                }`}
              />
              <span
                className={`truncate ${MOCK_MICRO} ${
                  i <= RETURN_AT
                    ? "text-[color:var(--mock-ink)]"
                    : "text-[color:var(--mock-ink-soft)]"
                }`}
              >
                {step}
              </span>
            </span>
          ))}
        </div>

        {/* The one thing that is the client's to do. */}
        <div
          className={`mt-4 flex shrink-0 items-center gap-3 rounded-[6px] border px-3.5 py-3 ${LINE}`}
        >
          <span className="flex min-w-0 flex-1 flex-col gap-1.5">
            <span
              className={`truncate text-[color:var(--mock-ink)] ${MOCK_SECONDARY}`}
            >
              Sign your e-file authorization (Form 8879)
            </span>
            <span
              className={`truncate text-[color:var(--mock-ink-soft)] ${MOCK_MICRO}`}
            >
              Your return is ready. Refund of $2,318 once filed.
            </span>
          </span>
          <span
            className={`shrink-0 rounded-[4px] bg-[var(--mock-ink)] px-2.5 py-[6px] text-[color:var(--mock-window)] ${MOCK_MICRO}`}
          >
            Review and sign
          </span>
        </div>

        <span
          className={`mt-4 shrink-0 pb-2 uppercase tracking-[0.04em] text-[color:var(--mock-ink-soft)] ${MOCK_MICRO}`}
        >
          Your documents
        </span>
        <div
          className={`flex min-h-0 flex-col overflow-hidden rounded-t-[6px] border border-b-0 ${LINE}`}
        >
          {RETURN_DOCS.map(({ name, from, state }) => (
            <span
              key={name}
              className={`flex shrink-0 items-center gap-3 border-b px-3.5 py-[9px] ${LINE}`}
            >
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span
                  className={`truncate text-[color:var(--mock-ink)] ${MOCK_SECONDARY}`}
                >
                  {name}
                </span>
                <span
                  className={`truncate text-[color:var(--mock-ink-soft)] ${MOCK_MICRO}`}
                >
                  {from}
                </span>
              </span>
              {state === "in" ? (
                <span
                  className={`shrink-0 rounded px-1.5 py-[3px] bg-[var(--mock-positive-bg)] text-[color:var(--mock-positive-fg)] ${MOCK_MICRO}`}
                >
                  Received
                </span>
              ) : (
                <span
                  className={`shrink-0 rounded-[4px] border px-2.5 py-[5px] text-[color:var(--mock-ink)] ${MOCK_MICRO} ${LINE}`}
                >
                  Upload
                </span>
              )}
            </span>
          ))}
        </div>
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
        className="relative h-[420px] overflow-hidden rounded-2xl bg-[var(--surface)] px-4 pb-0 pt-3 md:h-[470px] md:rounded-3xl md:px-6 md:pb-0 md:pt-4 [[data-theme=dark]_&]:bg-[#F5F5F0] [[data-theme=dark]_&]:[--surface:#F5F5F0] [[data-theme=dark]_&]:[--foreground:#101114] [[data-theme=dark]_&]:[--muted-foreground:#6b7079] [[data-theme=dark]_&]:[--border:#e8e9ec] [[data-theme=dark]_&]:[--background:#ffffff]"
      >
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
          {client.requests ? (
            <RequestsPane title={client.pane.title} />
          ) : client.taxReturn ? (
            <TaxReturnPane title={client.pane.title} />
          ) : (
            <AppPane title={client.pane.title} rows={client.pane.rows} />
          )}
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
