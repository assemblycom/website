"use client";

import { useState } from "react";
import {
  BrandedPortalVisual,
  type PortalApp,
} from "@/components/ai-app-builder/branded-portal-visual";
import { IconAreaChart, IconClock } from "@/components/home/mock-icons";
import { FootBlur } from "@/components/ui/foot-blur";
import {
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
// Brandmages portal, the one the hero shows, so the page has one firm.
// ─────────────────────────────────────────────────────────────────────────

const LINE = "border-[var(--mock-line)]";

const REPORT: PortalApp = { icon: <IconAreaChart />, label: "Monthly report" };
const SESSIONS: PortalApp = { icon: <IconClock />, label: "Strategy sessions" };

const TIERS = [
  { name: "Top-tier client", apps: [REPORT, SESSIONS], open: "sessions" },
  { name: "Standard client", apps: [REPORT], open: "report" },
] as const;

/** What the top tier opens on: booking time with its account lead. */
function SessionsPane() {
  const days = ["Tue 14", "Wed 15", "Thu 16"];
  const times = ["10:00", "11:30", "14:00", "15:30"];
  return (
    <div className="flex flex-col">
      <span className={`text-[color:var(--mock-ink)] ${MOCK_PRIMARY}`}>
        Book with your account lead
      </span>
      <span
        className={`mt-1.5 text-[color:var(--mock-ink-soft)] ${MOCK_SECONDARY}`}
      >
        60 minutes · Video call
      </span>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {days.map((d, i) => (
          <span
            key={d}
            className={`whitespace-nowrap rounded-[5px] border py-2 text-center ${MOCK_SECONDARY} ${LINE} ${
              i === 1
                ? "bg-[var(--mock-ink)] text-[color:var(--mock-window)]"
                : "bg-[var(--mock-well-2)] text-[color:var(--mock-ink)]"
            }`}
          >
            {d}
          </span>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {times.map((t) => (
          <span
            key={t}
            className={`rounded-[5px] border py-2 text-center text-[color:var(--mock-ink)] ${MOCK_SECONDARY} ${LINE}`}
          >
            {t}
          </span>
        ))}
      </div>
      <span
        className={`mt-6 text-[color:var(--mock-ink-soft)] ${MOCK_SECONDARY}`}
      >
        Upcoming
      </span>
      <div
        className={`mt-2 flex items-center justify-between gap-3 rounded-[6px] border px-3 py-2.5 ${LINE}`}
      >
        <span className="flex min-w-0 flex-col gap-1.5">
          <span className={`truncate text-[color:var(--mock-ink)] ${MOCK_PRIMARY}`}>
            Q4 planning
          </span>
          <span
            className={`truncate text-[color:var(--mock-ink-soft)] ${MOCK_SECONDARY}`}
          >
            Oct 2 · 11:30
          </span>
        </span>
        <span
          className={`shrink-0 whitespace-nowrap rounded-full border bg-[var(--mock-well-2)] px-2 py-[4px] text-[color:var(--mock-ink)] ${MOCK_MICRO} ${LINE}`}
        >
          Booked
        </span>
      </div>
    </div>
  );
}

/** What everyone gets: the month's numbers, in the agency's report. */
function ReportPane() {
  const stats = [
    ["Reach", "1.2M"],
    ["Leads", "842"],
    ["Cost per lead", "$18"],
  ];
  const bars = [38, 52, 46, 61, 58, 72, 80, 76];
  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-3 gap-2">
        {stats.map(([label, value]) => (
          <span
            key={label}
            className={`flex min-w-0 flex-col gap-2 rounded-[6px] border px-2.5 py-2.5 ${LINE}`}
          >
            <span
              className={`truncate text-[color:var(--mock-ink-soft)] ${MOCK_SECONDARY}`}
            >
              {label}
            </span>
            <span className={`text-[color:var(--mock-ink)] ${MOCK_PRIMARY}`}>
              {value}
            </span>
          </span>
        ))}
      </div>
      <span
        className={`mt-5 text-[color:var(--mock-ink-soft)] ${MOCK_SECONDARY}`}
      >
        Leads by week
      </span>
      <div
        className={`mt-2 flex h-[96px] items-end gap-2 rounded-[6px] border px-3 pb-3 pt-4 ${LINE}`}
      >
        {bars.map((h, i) => (
          <span
            key={i}
            className={`flex-1 rounded-[2px] ${
              i === bars.length - 2
                ? "bg-[var(--mock-ink)]"
                : "bg-[var(--mock-well-3)]"
            }`}
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <span
        className={`mt-4 w-fit whitespace-nowrap rounded-[5px] border px-3 py-[7px] text-[color:var(--mock-ink)] ${MOCK_PRIMARY} ${LINE}`}
      >
        Download PDF
      </span>
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
            brand="Brandmages"
            apps={[...tier.apps]}
            title={tier.open === "sessions" ? "Strategy sessions" : "September report"}
            navOnPhone={false}
          >
            {/* Capped: on a desktop window the pane is ~1000px wide, and the
                booking slots stretched across it read as empty bars. */}
            <div className="max-w-[440px]">
              {tier.open === "sessions" ? <SessionsPane /> : <ReportPane />}
            </div>
          </BrandedPortalVisual>
        </div>
        <FootBlur className="md:hidden" />
      </div>
    </div>
  );
}
