"use client";

import { useState } from "react";
import Image from "next/image";
import {
  BrandedPortalVisual,
  type PortalApp,
} from "@/components/ai-app-builder/branded-portal-visual";
import {
  IconBloomhouseMark,
  IconClock,
  IconMegaphone,
} from "@/components/home/mock-icons";
import { FootBlur } from "@/components/ui/foot-blur";
import {
  MOCK_BODY,
  MOCK_MICRO,
  MOCK_PRIMARY,
  MOCK_SECONDARY,
} from "@/components/ui/mock-type";
import { ViewToggle } from "@/components/ui/view-toggle";

// ─────────────────────────────────────────────────────────────────────────
// "Every client gets their own branded view" — the marketing-agency page's
// tailor picture, built on the accounting page's (accounting-views-visual):
// the same paper tray, the same corner toggle, one portal shown two ways.
//
// The two ways are the ones the copy names: "your top tier books strategy
// sessions, everyone gets the monthly report". So the toggle is the tier, the
// top tier's nav carries Strategy sessions on top of the Monthly report, and
// each opens on the app that tier is there for. It is the agency's own
// Bloomhouse portal, the one the hero shows, so the page has one firm.
// ─────────────────────────────────────────────────────────────────────────

const LINE = "border-[var(--mock-line)]";

const REPORT: PortalApp = { icon: <IconMegaphone />, label: "Monthly report" };
const SESSIONS: PortalApp = { icon: <IconClock />, label: "Strategy sessions" };

const TIERS = [
  { name: "Top-tier client", apps: [REPORT, SESSIONS], open: "sessions" },
  { name: "Standard client", apps: [REPORT], open: "report" },
] as const;

/**
 * What the top tier opens on: booking time with its account lead, laid out the
 * way a scheduling page is — who and how long on the left, the month with its
 * open days in the middle, the chosen day's times on the right — and centred
 * in the pane as one card, rather than a column of controls along its left
 * edge. On a phone the details step aside and the calendar has the window.
 */
const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];
/** October 2026 opens on a Thursday: three blanks in a Monday-first week. */
const LEAD = 3;
const OPEN_DAYS = new Set([
  13, 14, 15, 16, 19, 20, 21, 22, 23, 26, 27, 28, 29, 30,
]);
const PICKED = 14;
const TIMES = ["9:00", "10:00", "11:30", "13:00", "14:00", "15:30", "16:30"];

function SessionsPane() {
  return (
    <div
      // On a phone the window IS the card: a bordered card inside a 260px
      // window left the calendar a 200px column whose days touched. So below
      // md the frame, padding and side column go, and the times drop under the
      // month as a two-up grid, the way a scheduling page reflows.
      className={`mx-auto flex w-full max-w-[720px] rounded-[6px] border bg-[var(--mock-window)] max-md:flex-col max-md:border-0 max-md:bg-transparent md:flex-1 ${LINE}`}
    >
      {/* Who, what, how long — set as one block rather than a stack of
          evenly gapped lines: the name sits just over the session it runs,
          and the length rides close under it. */}
      <div
        className={`flex w-[180px] shrink-0 flex-col border-r p-5 max-md:hidden ${LINE}`}
      >
        <span className="relative size-[32px] overflow-hidden rounded-full bg-[var(--mock-well-2)]">
          <Image
            src="/images/mocks/avatar-dana.webp"
            alt=""
            fill
            sizes="64px"
            className="object-cover object-[50%_30%]"
          />
        </span>
        <span
          className={`mt-3 text-[color:var(--mock-ink-soft)] ${MOCK_SECONDARY}`}
        >
          Dana Whitfield
        </span>
        <span className={`mt-1.5 text-[color:var(--mock-ink)] ${MOCK_BODY}`}>
          Strategy session
        </span>
        <span
          className={`mt-2 flex items-center gap-1.5 text-[color:var(--mock-ink-soft)] ${MOCK_SECONDARY}`}
        >
          <IconClock className="size-[11px]" />
          60 min
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-5 max-md:p-0">
        <span className={`text-[color:var(--mock-ink)] ${MOCK_BODY}`}>
          Select a date and time
        </span>
        <span
          className={`mt-3 text-[color:var(--mock-ink-soft)] ${MOCK_PRIMARY}`}
        >
          October 2026
        </span>
        <div className="mt-3 grid grid-cols-7 gap-y-1 text-center md:mt-4 md:gap-y-2.5">
          {WEEKDAYS.map((d, i) => (
            <span
              key={i}
              className={`pb-1 text-[color:var(--mock-ink-soft)] ${MOCK_SECONDARY}`}
            >
              {d}
            </span>
          ))}
          {Array.from({ length: LEAD }, (_, i) => (
            <span key={`lead-${i}`} />
          ))}
          {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
            <span key={day} className="flex justify-center">
              <span
                className={`flex size-[24px] items-center justify-center rounded-full md:size-[32px] ${MOCK_SECONDARY} ${
                  day === PICKED
                    ? "bg-[var(--mock-ink)] text-[color:var(--mock-window)]"
                    : OPEN_DAYS.has(day)
                      ? "cursor-pointer bg-[var(--mock-well-2)] text-[color:var(--mock-ink)] transition-colors hover:bg-[var(--mock-well-3)]"
                      : "text-[color:var(--mock-ink-soft)]"
                }`}
              >
                {day}
              </span>
            </span>
          ))}
        </div>
      </div>

      <div
        className={`flex w-[160px] shrink-0 flex-col gap-2.5 border-l p-5 max-md:mt-4 max-md:grid max-md:w-full max-md:grid-cols-2 max-md:gap-2 max-md:border-l-0 max-md:border-t max-md:p-0 max-md:pt-4 ${LINE}`}
      >
        <span
          className={`text-[color:var(--mock-ink)] max-md:col-span-2 ${MOCK_PRIMARY}`}
        >
          Wed, Oct 14
        </span>
        {TIMES.map((t) => (
          <span
            key={t}
            className={`cursor-pointer rounded-[4px] border py-2 text-center transition-colors hover:border-[var(--mock-ink)] text-[color:var(--mock-ink)] ${MOCK_PRIMARY} ${LINE}`}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * What everyone gets: the month's numbers, as the report an agency actually
 * sends — headline figures with their move against last month, the leads
 * curve across the month, and where the leads came from. It was three bare
 * boxes, a row of grey bars and a button, which read as a placeholder rather
 * than as the thing a client opens every month.
 */
const STATS = [
  { label: "Reach", value: "1.2M", delta: "18%", up: true },
  { label: "Leads", value: "842", delta: "12%", up: true },
  { label: "Cost per lead", value: "$18", delta: "6%", up: false },
  { label: "Conversion", value: "4.1%", delta: "0.6 pt", up: true },
];

/** Leads per day-group across September, for the curve. */
const CURVE = [22, 28, 25, 34, 31, 40, 37, 46, 44, 52, 49, 58, 63, 60, 68];
const WEEKS_AXIS = ["Sep 1", "Sep 8", "Sep 15", "Sep 22", "Sep 29"];

/**
 * One hue, four steps of ink. The four Gantt colours beside a teal curve made
 * the report a palette; a ramp of the ink reads as one breakdown and flips
 * with the theme on its own, since every step is mixed from --mock-ink.
 */
const CHANNELS = [
  {
    name: "Paid social",
    share: 46,
    tone: "color-mix(in srgb, var(--mock-ink) 85%, transparent)",
  },
  {
    name: "Search",
    share: 28,
    tone: "color-mix(in srgb, var(--mock-ink) 55%, transparent)",
  },
  {
    name: "Email",
    share: 16,
    tone: "color-mix(in srgb, var(--mock-ink) 32%, transparent)",
  },
  {
    name: "Organic",
    share: 10,
    tone: "color-mix(in srgb, var(--mock-ink) 16%, transparent)",
  },
];

const CAMPAIGNS = [
  { name: "Spring Campaign Launch", leads: 312, cpl: "$14", status: "Live" },
  { name: "Q3 Paid Social", leads: 268, cpl: "$19", status: "Live" },
  { name: "Product Launch Film", leads: 151, cpl: "$22", status: "Wrapping" },
  { name: "SEO Content Sprint", leads: 111, cpl: "$9", status: "Live" },
];

function curvePath(points: number[], close: boolean) {
  const max = Math.max(...points) * 1.15;
  const step = 100 / (points.length - 1);
  const line = points
    .map(
      (p, i) =>
        `${i ? "L" : "M"}${(i * step).toFixed(2)},${(100 - (p / max) * 100).toFixed(2)}`,
    )
    .join(" ");
  return close ? `${line} L100,100 L0,100 Z` : line;
}

/**
 * The leads curve, answering the cursor: a guide line, a dot on the curve and
 * the value at the nearest point, the way the real report's chart reads out.
 */
function LeadsChart() {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(...CURVE) * 1.15;
  const step = 100 / (CURVE.length - 1);
  const at = hover ?? null;
  return (
    <div
      className="relative mt-3 h-[92px] w-full cursor-crosshair"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        const i = Math.round(
          ((e.clientX - r.left) / r.width) * (CURVE.length - 1),
        );
        setHover(Math.max(0, Math.min(CURVE.length - 1, i)));
      }}
      onMouseLeave={() => setHover(null)}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full overflow-visible"
      >
        <defs>
          <linearGradient id="agency-report-fill" x1="0" x2="0" y1="0" y2="1">
            <stop
              offset="0"
              stopColor="var(--mock-gantt-1)"
              stopOpacity="0.28"
            />
            <stop offset="1" stopColor="var(--mock-gantt-1)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[25, 50, 75].map((y) => (
          <line
            key={y}
            x1="0"
            x2="100"
            y1={y}
            y2={y}
            stroke="var(--mock-line)"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        <path d={curvePath(CURVE, true)} fill="url(#agency-report-fill)" />
        <path
          d={curvePath(CURVE, false)}
          fill="none"
          stroke="var(--mock-gantt-1)"
          strokeWidth="1.5"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        {at !== null && (
          <line
            x1={at * step}
            x2={at * step}
            y1="0"
            y2="100"
            stroke="var(--mock-ink-soft)"
            strokeDasharray="2 2"
            vectorEffect="non-scaling-stroke"
          />
        )}
      </svg>
      {/* The dot and the read-out are HTML over the SVG, because the SVG is
          stretched non-uniformly and would squash a circle into an ellipse. */}
      {at !== null && (
        <>
          <span
            className="pointer-events-none absolute size-[8px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--mock-window)] bg-[var(--mock-gantt-1)]"
            style={{
              left: `${at * step}%`,
              top: `${100 - (CURVE[at] / max) * 100}%`,
            }}
          />
          <span
            className={`pointer-events-none absolute -translate-x-1/2 -translate-y-[calc(100%+10px)] whitespace-nowrap rounded-[4px] bg-[var(--mock-ink)] px-1.5 py-[3px] text-[color:var(--mock-window)] ${MOCK_MICRO}`}
            style={{
              left: `${Math.min(92, Math.max(8, at * step))}%`,
              top: `${100 - (CURVE[at] / max) * 100}%`,
            }}
          >
            {CURVE[at]} leads
          </span>
        </>
      )}
    </div>
  );
}

function ReportPane() {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
        {STATS.map(({ label, value, delta, up }) => (
          <span
            key={label}
            className={`flex min-w-0 flex-col gap-2 rounded-[6px] border px-3 py-2.5 transition-colors hover:bg-[var(--mock-well)] ${LINE}`}
          >
            <span
              className={`truncate text-[color:var(--mock-ink-soft)] ${MOCK_SECONDARY}`}
            >
              {label}
            </span>
            <span className="flex items-center justify-between gap-2">
              <span className={`text-[color:var(--mock-ink)] ${MOCK_BODY}`}>
                {value}
              </span>
              {/* Cost per lead going DOWN is the good news, so the chip's
                  colour follows whether the move is good, not its direction. */}
              <span
                className={`whitespace-nowrap rounded-[4px] bg-[var(--mock-positive-bg)] px-1.5 py-[3px] text-[color:var(--mock-positive-fg)] max-md:hidden ${MOCK_MICRO}`}
              >
                {up ? "↑" : "↓"} {delta}
              </span>
            </span>
          </span>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-[1.7fr_1fr]">
        <div className={`flex flex-col rounded-[6px] border p-3 ${LINE}`}>
          <span className="flex items-baseline justify-between gap-2">
            <span className={`text-[color:var(--mock-ink)] ${MOCK_PRIMARY}`}>
              Leads by week
            </span>
            <span
              className={`text-[color:var(--mock-ink-soft)] ${MOCK_SECONDARY}`}
            >
              vs August
            </span>
          </span>
          <LeadsChart />
          <span
            className={`mt-2 flex justify-between text-[color:var(--mock-ink-soft)] ${MOCK_MICRO}`}
          >
            {WEEKS_AXIS.map((w) => (
              <span key={w}>{w}</span>
            ))}
          </span>
        </div>

        {/* The split as ONE bar with a legend under it, rather than four
            stacked bars: a share is a part of a whole, and four separate
            tracks each read as its own scale. */}
        <div
          className={`flex flex-col rounded-[6px] border p-3 max-md:hidden ${LINE}`}
        >
          <span className={`text-[color:var(--mock-ink)] ${MOCK_PRIMARY}`}>
            By channel
          </span>
          <span className="mt-3.5 flex h-[8px] gap-[2px] overflow-hidden rounded-full">
            {CHANNELS.map(({ name, share, tone }) => (
              <span
                key={name}
                className="h-full"
                style={{ width: `${share}%`, backgroundColor: tone }}
              />
            ))}
          </span>
          <span className="mt-4 flex flex-col gap-3">
            {CHANNELS.map(({ name, share, tone }) => (
              <span
                key={name}
                className={`-mx-1.5 flex items-center gap-2 rounded-[4px] px-1.5 py-1 transition-colors hover:bg-[var(--mock-well)] ${MOCK_SECONDARY}`}
              >
                <span
                  className="size-[8px] shrink-0 rounded-[2px]"
                  style={{ backgroundColor: tone }}
                />
                <span className="flex-1 text-[color:var(--mock-ink-soft)]">
                  {name}
                </span>
                <span className="tabular-nums text-[color:var(--mock-ink)]">
                  {share}%
                </span>
              </span>
            ))}
          </span>
        </div>
      </div>

      {/* The campaigns behind the numbers. It also gives the report its
          length: it runs on past the window's foot, as a real report does. */}
      <div className={`rounded-[6px] border ${LINE}`}>
        <span
          className={`grid grid-cols-[1fr_56px_56px] gap-3 border-b px-3 py-2 text-[color:var(--mock-ink-soft)] md:grid-cols-[1fr_80px_80px_80px] ${MOCK_SECONDARY} ${LINE}`}
        >
          <span>Top campaigns</span>
          <span className="text-right">Leads</span>
          <span className="text-right">CPL</span>
          <span className="text-right max-md:hidden">Status</span>
        </span>
        {CAMPAIGNS.map(({ name, leads, cpl, status }) => (
          <span
            key={name}
            className={`grid grid-cols-[1fr_56px_56px] items-center gap-3 border-b px-3 py-2.5 transition-colors last:border-b-0 hover:bg-[var(--mock-well)] md:grid-cols-[1fr_80px_80px_80px] ${MOCK_SECONDARY} ${LINE}`}
          >
            <span className="truncate text-[color:var(--mock-ink)]">
              {name}
            </span>
            <span className="text-right tabular-nums text-[color:var(--mock-ink)]">
              {leads}
            </span>
            <span className="text-right tabular-nums text-[color:var(--mock-ink)]">
              {cpl}
            </span>
            <span className="flex justify-end max-md:hidden">
              <span
                className={`rounded-[4px] px-1.5 py-[3px] ${MOCK_MICRO} ${
                  status === "Live"
                    ? "bg-[var(--mock-positive-bg)] text-[color:var(--mock-positive-fg)]"
                    : "bg-[var(--mock-well-2)] text-[color:var(--mock-ink-soft)]"
                }`}
              >
                {status}
              </span>
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function AgencyViewsVisual() {
  const [selected, setSelected] = useState(0);
  const tier = TIERS[selected];
  const names = TIERS.map((t) => t.name);

  return (
    <div>
      {/* On a phone the toggle sits above the tray, on the page's own ground —
          the accounting page's placement. Both copies drive the same state. */}
      <div className="mb-4 flex justify-center md:hidden">
        <ViewToggle
          options={names}
          view={selected}
          onSelect={setSelected}
          label="Which client's portal to show"
        />
      </div>
      {/* The accounting page's tray, class for class, including its dark
          branch: paper in dark, with the five page tokens its subtree reads
          re-pointed so the toggle is not white on white. */}
      <div className="relative h-[420px] overflow-hidden rounded-2xl bg-[var(--surface)] px-4 pb-0 pt-6 md:h-[470px] md:rounded-3xl md:px-6 md:pb-0 md:pt-4 [[data-theme=dark]_&]:bg-[#F5F5F0] [[data-theme=dark]_&]:[--surface:#F5F5F0] [[data-theme=dark]_&]:[--foreground:#101114] [[data-theme=dark]_&]:[--muted-foreground:#6b7079] [[data-theme=dark]_&]:[--border:#e8e9ec] [[data-theme=dark]_&]:[--background:#ffffff]">
        <div className="hidden justify-end md:mb-3 md:flex">
          <ViewToggle
            onPaper
            options={names}
            view={selected}
            onSelect={setSelected}
            label="Which client's portal to show"
          />
        </div>
        {/* A phone-width window on a phone, as the accounting page draws it:
            centred, 260px, the nav stepped aside so the open app has it. */}
        <div className="h-full max-md:mx-auto max-md:w-[260px] [&>div]:max-md:rounded-t-[22px]">
          <BrandedPortalVisual
            brand="Bloomhouse"
            brandMark={<IconBloomhouseMark className="size-[12px]" />}
            apps={[...tier.apps]}
            // A step under the shared title size, as the hero's tracker sets
            // it: 13.5px read as a page heading over a card this busy.
            title={
              <span className={MOCK_BODY}>
                {tier.open === "sessions"
                  ? "Strategy sessions"
                  : "September report"}
              </span>
            }
            headerAction={
              tier.open === "report" ? (
                <span
                  className={`cursor-pointer whitespace-nowrap rounded-[4px] border px-2.5 py-[6px] text-[color:var(--mock-ink)] transition-colors hover:bg-[var(--mock-well-2)] max-md:hidden ${MOCK_SECONDARY} ${LINE}`}
                >
                  Download PDF
                </span>
              ) : null
            }
            navOnPhone={false}
            appsBreak={false}
          >
            {/* Both panes size themselves: the booking card caps and centres
                in the pane's full height, and the report's grid fills its
                width. */}
            <div
              className={
                tier.open === "sessions"
                  ? // A light ground under the booking card, out to the pane's
                    // edges, so the white card sits ON something instead of
                    // white on white. Desktop only: on a phone the card drops
                    // its frame and the window is the card.
                    "flex w-full min-h-0 flex-1 flex-col md:-mx-5 md:-my-4 md:w-auto md:bg-[var(--mock-well-2)] md:px-5 md:py-4"
                  : "w-full"
              }
            >
              {tier.open === "sessions" ? <SessionsPane /> : <ReportPane />}
            </div>
          </BrandedPortalVisual>
        </div>
        <FootBlur className="md:hidden" />
      </div>
    </div>
  );
}
