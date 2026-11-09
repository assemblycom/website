"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { APP_URL } from "@/lib/constants";
import {
  getFeaturedTemplates,
  VISIBLE_TEMPLATES,
  type Template,
} from "@/lib/templates";
import { IconArrow } from "./icons";
import { V66Composer } from "./hero-v66";
import {
  APP_BOX,
  APP_ICON,
  APP_LINE,
  AppSearch,
  DesktopMock,
  DesktopMockWhole,
  GlassCover,
} from "./app-window";
import {
  CardConditionalForms,
  CardEvents,
  CardInternalComms,
  CardMarkup,
  CardTeamGuides,
} from "./covers/group-a";
import {
  CardCalendar,
  CardFiles,
  CardForms,
  CardHome,
  CardMessages,
} from "./covers/group-b";
import {
  CardAutoresponder,
  CardExport,
  CardProfileManager,
  CardQuickBooks,
  CardXero,
} from "./covers/group-c";

import { TemplateMock } from "./template-preview";
import { IconBrandMark } from "./mock-icons";

// ─────────────────────────────────────────────────────────────────────────
// HERO V69 — V64's composition (left headline, tall composer, poster template
// row) on a vertical blue→green→white gradient, with a ToDesktop-style nav:
// wide and transparent at the top, collapsing into a compact centered frosted
// pill on scroll. Text + UI stay dark so they read over the light gradient.
// ─────────────────────────────────────────────────────────────────────────

const MONO =
  '"ABC Diatype Mono", ui-monospace, SFMono-Regular, Menlo, monospace';
const NAV_LINKS = ["Solutions", "Resources", "Pricing", "Products"];

// Type scale — modeled on Linear / Devin Desktop / Bird: large display at
// MEDIUM weight (never bold), tight negative tracking that grows with size,
// tight leading on the display, and muted supporting text. Tailwind classes:
//   display  text-[34px] md:text-[50px]  font-normal  tracking-[-0.03em]  leading-[1.03]
//   lead     text-[18px]                 font-normal  tracking-[-0.01em]  leading-[1.5]  (muted)
//   label    text-[15px]                 font-normal  tracking-[-0.01em]                 (nav / CTA)
//   title    text-[15px]                 font-normal  tracking-[-0.01em]  leading-[1.25] (card title)
//   meta     text-[13px]                 font-normal  tracking-[-0.005em]                (muted)
//   eyebrow  text-[12px]                 font-normal  tracking-[0.01em]   (mono, normal case)
const T = {
  display:
    "text-[34px] font-normal leading-[1.03] tracking-[-0.03em] md:text-[50px]",
  label: "text-[15px] tracking-[-0.01em]",
  title: "text-[13px] font-normal leading-[1.3] tracking-[-0.01em]",
  meta: "text-[11px] tracking-[-0.005em]",
  eyebrow: "text-[12px] tracking-[0.01em]",
};

// ─────────────────────────────────────────────────────────────────────────
// MOCK TYPE SCALE — the ladder every Card* mock below is set on. These are the
// pictures of apps that fill the template covers (and the hero rail), drawn at
// design size and scaled into whatever square they land in, so the sizes here
// are design px, not screen px.
//
// One ladder, no in-between values. The mocks had drifted to nineteen different
// sizes, including 10.5 and 12.5, which meant two cards side by side set the
// same kind of label a pixel apart from each other. Every size below is one of
// these steps; if a new mock wants something else, move it to the nearest step
// rather than adding one.
//
//   CHROME AND COPY
//   nano    8px   the compact thumbnail's chrome, and glyphs inside a ≤18px dot
//   micro   9px   unit labels, axis ticks, dense captions
//   meta   11px   secondary text: names, timestamps, muted supporting lines
//   body   13px   the default — rows, values, sentences
//   title  15px   a mock's own heading, and the value a card is built around
//
//   FIGURES — the one big number a mock is composed around. A ramp rather than
//   a set of roles: which step a mock takes is a function of how much of the
//   square the number is meant to fill.
//   19px · 26px · 34px · 42px · 52px · 60px
// ─────────────────────────────────────────────────────────────────────────

function IconChevron({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}
// Polished, animated mocks for the first two card templates. Animations are
// triggered by the card's group-hover (cards stay mounted in the row), so the
// form fills in / the chart builds each time you hover.
// Some mocks drive their motion from React state on mouseenter (count-ups, bar
// grows) rather than from a CSS `group-hover:` class, so the rail's `is-inview`
// observer can't reach them and they stayed frozen on touch devices. This gives
// them the same trigger from scroll position instead.
//
// The trigger is the rail's own `is-inview` class, watched on the card these
// mocks are mounted in, so a state-driven animation plays under exactly the same
// rule as the CSS ones: the card in the selector frame, and only that card. It
// used to run an IntersectionObserver of its own at 60% visible, which fired for
// a card the strip had merely half-revealed — so a mock animated while the frame
// was still on its neighbour, and kept running after the frame moved on. Each
// time the class returns the callback fires again, which is what replays the
// animation on a card you swipe back to.
function useInViewReplay(onPlay: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  // Held in a ref so an inline callback doesn't rebuild the observer each render.
  const cb = useRef(onPlay);
  useEffect(() => {
    cb.current = onPlay;
  }, [onPlay]);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // The templates gallery renders these mocks as static art — never animate there.
    if (el.closest(".template-mock")) return;
    if (!window.matchMedia("(hover: none), (max-width: 767px)").matches) return;
    // The same element the `group-[.is-inview]:` hooks resolve against.
    const card =
      el.closest<HTMLElement>("[data-card]") ?? el.closest<HTMLElement>(".group");
    if (!card) return;
    let on = card.classList.contains("is-inview");
    if (on) cb.current();
    const mo = new MutationObserver(() => {
      const now = card.classList.contains("is-inview");
      if (now === on) return;
      on = now;
      if (now) cb.current();
    });
    mo.observe(card, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);
  return ref;
}

// New client intake — the Onboarding Wizard's dashboard as the team sees it on
// desktop: four status counts, the filters, and the client list with each
// client's status and how far through the steps they are. The assignees are
// made-up names, so no colleague's name ships on the public site.
const INTAKE_STATS = [
  { label: "Not started", value: 6 },
  { label: "In progress", value: 0 },
  { label: "Stalled", value: 11 },
  { label: "Completed", value: 6 },
];
const INTAKE_STEPS = 5;
const INTAKE_STATUS = {
  stalled: { label: "Stalled", cls: "bg-[#FDF3D7] text-[#8A5A00]" },
  completed: { label: "Completed", cls: "bg-[#E3F6E9] text-[#1E7A44]" },
  notStarted: { label: "Not started", cls: "bg-[#F1F2F4] text-[#374151]" },
} as const;
const INTAKE_ROWS: {
  initials: string;
  name: string;
  sub: string;
  status: keyof typeof INTAKE_STATUS;
  done: number;
  activity: string;
  assignee: string;
  tint: string;
}[] = [
  { initials: "MC", name: "Marcus Chen", sub: "Northwind Logistics", status: "stalled", done: 1, activity: "1 month ago", assignee: "Unassigned", tint: "bg-[#FBEDEC] text-[#A8453D]" },
  { initials: "CM", name: "Charles Musail", sub: "BrandMages", status: "completed", done: 5, activity: "2 months ago", assignee: "Unassigned", tint: "bg-[#F3ECF8] text-[#7A3E9D]" },
  { initials: "MW", name: "Marcus Webb", sub: "Okonkwo Consulting", status: "completed", done: 5, activity: "14 days ago", assignee: "Unassigned", tint: "bg-[#F3ECF8] text-[#7A3E9D]" },
  { initials: "EG", name: "Edward Gonzalez", sub: "Edward Gonzalez", status: "notStarted", done: 0, activity: "2 months ago", assignee: "Unassigned", tint: "bg-[#E8F4F0] text-[#2F7A64]" },
  { initials: "CC", name: "Cascade Outdoor Co.", sub: "Company", status: "stalled", done: 4, activity: "1 month ago", assignee: "Unassigned", tint: "bg-[#FBEDF6] text-[#A33D7A]" },
  { initials: "MC", name: "Magna Company", sub: "Company", status: "completed", done: 5, activity: "3 months ago", assignee: "Priya Raman", tint: "bg-[#E6F1F8] text-[#2C6E99]" },
  { initials: "LD", name: "Larkspur Design", sub: "Company", status: "stalled", done: 4, activity: "3 months ago", assignee: "Neil Foster", tint: "bg-[#E8F4F0] text-[#2F7A64]" },
  { initials: "BF", name: "Brightwell Financial", sub: "Company", status: "stalled", done: 2, activity: "3 months ago", assignee: "Unassigned", tint: "bg-[#FBEDEC] text-[#A8453D]" },
];
const INTAKE_COLS =
  "grid grid-cols-[1.7fr_1.1fr_0.9fr_1.4fr_1fr_1fr_32px] items-center gap-4";

function SortMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-3.5 text-[#9CA3AF]" {...APP_ICON} aria-hidden>
      <path d="M8 5v14M5 8l3-3 3 3M16 19V5M13 16l3 3 3-3" />
    </svg>
  );
}

function CardIntake() {
  return (
    // Dark gradient in light mode, light in dark mode: every app-screen cover
    // sits on a dark ground on the light page and a light one on the dark page.
    <GlassCover
      photo="bg-[url(/images/mocks/intake-ambient.webp)] [[data-theme=dark]_&]:bg-[url(/images/mocks/intake-ambient-light.webp)]"
      focus="bg-center"
      dim=""
      inset=""
      panel={false}
    >
      <DesktopMock>
        <div className="flex h-16 items-center gap-2 border-b border-[#E5E7EB] px-6">
          <span className="text-[16px] leading-none">Onboarding Wizard</span>
          <svg viewBox="0 0 24 24" className="size-4 text-[#6B7280]" {...APP_ICON} aria-hidden>
            <path d="m6 9 6 6 6-6" />
          </svg>
          <span className="ml-auto flex h-9 items-center gap-1.5 rounded-lg bg-[#1F2329] px-3.5 text-[14px] leading-none text-[#FFFFFF]">
            <svg viewBox="0 0 24 24" className="size-4" {...APP_ICON} aria-hidden>
              <path d="M12 5v14M5 12h14" />
            </svg>
            Start onboarding
          </span>
          <span className={`${APP_BOX} size-9 text-[16px] leading-none`}>···</span>
        </div>
        <div className="px-6 pt-6">
          <div className="grid grid-cols-4 gap-3">
            {INTAKE_STATS.map((stat) => (
              <div key={stat.label} className={`rounded-xl border ${APP_LINE} px-5 py-5`}>
                <div className="text-[14px] leading-none text-[#6B7280]">{stat.label}</div>
                <div className="mt-3.5 text-[32px] font-medium leading-none tracking-tight">
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <span className={`flex h-10 w-[200px] items-center justify-between rounded-lg border ${APP_LINE} px-3.5 text-[14px] leading-none`}>
              All scopes
              <svg viewBox="0 0 24 24" className="size-4 text-[#6B7280]" {...APP_ICON} aria-hidden>
                <path d="m6 9 6 6 6-6" />
              </svg>
            </span>
            <span className={`flex h-10 w-[320px] items-center justify-between rounded-lg border ${APP_LINE} px-3.5 text-[14px] leading-none text-[#9CA3AF]`}>
              Filter by contacts or companies…
              <svg viewBox="0 0 24 24" className="size-4 text-[#6B7280]" {...APP_ICON} aria-hidden>
                <path d="m6 9 6 6 6-6" />
              </svg>
            </span>
            <span className="ml-2 flex items-center gap-2.5 text-[14px] leading-none">
              <span className="relative h-5 w-9 rounded-full bg-[#E5E7EB]">
                <span className="absolute left-0.5 top-0.5 size-4 rounded-full bg-[#FFFFFF]" />
              </span>
              Show archived
            </span>
          </div>
          <div className={`mt-4 overflow-hidden rounded-xl border ${APP_LINE}`}>
            <div className={`${INTAKE_COLS} h-12 px-4 text-[14px] leading-none`}>
              {["Contact", "Form", "Status", "Progress", "Last activity", "Assignee"].map((h) => (
                <span key={h} className="flex items-center gap-1.5">
                  {h}
                  <SortMark />
                </span>
              ))}
              <span />
            </div>
            {INTAKE_ROWS.map((row) => {
              const status = INTAKE_STATUS[row.status];
              return (
                <div
                  key={row.name}
                  className={`${INTAKE_COLS} h-16 border-t border-[#E5E7EB] px-4 text-[14px] leading-none`}
                >
                  <span className="flex min-w-0 items-center gap-2.5">
                    <span
                      className={`flex size-8 shrink-0 items-center justify-center rounded-full text-[12px] leading-none ${row.tint}`}
                    >
                      {row.initials}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate">{row.name}</span>
                      <span className="mt-1.5 block truncate text-[13px] text-[#6B7280]">
                        {row.sub}
                      </span>
                    </span>
                  </span>
                  <span className="truncate">Onboarding Form</span>
                  <span>
                    <span className={`rounded-md px-2 py-1.5 text-[13px] leading-none ${status.cls}`}>
                      {status.label}
                    </span>
                  </span>
                  <span className="flex items-center gap-3 text-[13px] text-[#6B7280]">
                    <span className="relative h-1 w-[110px] rounded-full bg-[#EEF0F2]">
                      <span
                        className="absolute inset-y-0 left-0 rounded-full bg-[#1F2329]"
                        style={{ width: `${(row.done / INTAKE_STEPS) * 100}%` }}
                      />
                    </span>
                    {row.done} of {INTAKE_STEPS} steps
                  </span>
                  <span className="text-[#6B7280]">{row.activity}</span>
                  <span className={row.assignee === "Unassigned" ? "text-[#6B7280]" : ""}>
                    {row.assignee}
                  </span>
                  <span className="text-center text-[#6B7280]">⋮</span>
                </div>
              );
            })}
          </div>
        </div>
      </DesktopMock>
    </GlassCover>
  );
}

// ─── Neutral fill ladder ────────────────────────────────────────────────
// Every gray FILL in the mocks comes off this five-step scale, mixed from the
// skin's ink so both themes track automatically. Text keeps the neutral-400 →
// 900 type scale; fills use these. INK_SOLID caps selected/solid surfaces
// below full black so no element on the rail screams.
const ink = (pct: number) =>
  `color-mix(in srgb, var(--v69-ink) ${pct}%, transparent)`;
const INK_FAINT = ink(14); // lightest data fill
// The same value, OPAQUE — mixed toward the card's face instead of toward
// transparent. For data that sits on one of the plotted grounds: at 14% of ink
// the translucent version let the grid read straight through the shape, so a
// gauge track looked like a hole in the ring rather than the unfilled part of it.
const INK_FAINT_SOLID = `color-mix(in srgb, var(--v69-ink) 14%, var(--v69-card))`;
const INK_MID = ink(30); // mid data fill
const INK_STRONG = ink(50); // strongest data fill — lightened so graphs read softer, not near-black
const INK_SOLID = ink(70); // solid surfaces: checks, bubbles, CTAs, selected radio

// The mono face, used for figures and unit tags on the metric cards.
const MOCK_MONO = {
  fontFamily: "var(--font-diatype-mono), ui-monospace, monospace",
} as const;
// The unit tag beside a metric — the chip idiom the gallery's category tags use.
// Layout (where it sits in its header) stays with the caller. The shared cool
// grey all but disappeared on light mode's warm off-white face, so light takes a
// warm step off that face instead.
// Dark takes a white wash and a brighter label instead of the shared --v69-inner
// step: at #2e2e2e on a #262626 face the chip was two values off its own ground,
// and both the pill and the word inside it all but disappeared.
// Both dark values are literal, not palette tokens. The dark mock skin remaps the
// neutral scale — --color-neutral-300 resolves to #6b6f77 inside a mock — so
// text-neutral-300 came out DARKER than the muted-foreground it was replacing.
// Padding: 8px across and 4px down. At 6/3 the pill was drawn tight to its own
// label on both axes — too narrow to read as a chip beside a big figure, and short
// enough that it looked clipped rather than set.
// Light's fill is a step lighter than the shared warm chip tone: at #E7E7DE the
// pill was the heaviest mark on a near-white face, so the tag pulled ahead of the
// figure it belongs to.
const MOCK_UNIT_TAG =
  "shrink-0 whitespace-nowrap rounded-md bg-[var(--v69-inner)] px-2 py-1 text-[11px] uppercase leading-none tracking-wide text-muted-foreground [[data-theme=light]_&]:bg-[var(--v69-inner)] [[data-theme=light]_&]:text-[#4A4A4A] [[data-theme=light]_.template-mock_&]:bg-[#e2e2e2] [[data-theme=light]_.template-mock_&]:text-[#4d4d4d] [[data-theme=dark]_&]:bg-[rgba(255,255,255,0.11)] [[data-theme=dark]_&]:text-[#C9C9C9]";

// ─── Cover type ramp ────────────────────────────────────────────────────
// Four steps for every piece of UI text on a cover, in the mocks' own design px.
// The covers were drawn one at a time and had accumulated twenty-one sizes
// between them — 9, 10, 10.5, 11, 11.5, 12, 12.5, 13 — differences too small to
// be decisions and big enough that two cards side by side didn't match.
//
//   text-[10px]  meta     second lines, captions, axis and foot labels
//   text-[11px]  label    mono unit tags (MOCK_UNIT_TAG), small keys
//   text-[13px]  body     row titles, control labels, questions — the default
//   text-[15px]  lead     the single headline line on a cover that has one
//
// Figures are their own thing and stay off this ramp: they're sized against the
// card they fill (26 / 28 / 30 / 34), with any decimal tail sized off its figure.
//
// Four covers carry no large focal element, so where they're framed at size they
// are drawn at 240px and scaled up into a 288px frame (see MOCK_DESIGN_SIZE). The
// transform magnifies their type with everything else, which put their labels a
// fifth above the same step on every other cover — a title on one of them came
// out larger than any title in the rail. These step the type down by one rung
// wherever that up-scale applies, landing it back on the rail's own sizes. The
// home hero sizes these mocks itself, so it keeps the base step.
const MOCK_UPSCALED_BODY = "[.template-mock_&]:text-[11px]";
const MOCK_UPSCALED_META = "[.template-mock_&]:text-[9px]";

// The brand wash — the periwinkle/lime pair as a two-hue ramp. Both ends are
// held for roughly a third of the run and the blend is interpolated in oklab, so
// each hue reads at full strength and the middle passes through a clean teal
// rather than the grey-green sRGB mixes them into. Angle is the caller's, so two
// cards can share the ramp without sharing a direction.
const brandWash = (deg: number) =>
  `linear-gradient(${deg}deg in oklab, #7DA4FF 0%, #7DA4FF 30%, #D9ED92 84%, #D9ED92 100%)`;

// The site's accent — periwinkle blue, the same value in both themes. A
// widget spends it on the single element that carries its meaning (progress
// filled, document collected, form submitted) and stays neutral everywhere
// else, so the rail reads as one set rather than a paintbox.

// Client onboarding wizard — the form editor as the team sees it on desktop:
// the wizard's steps down the side, the first one open, and the welcome text
// the client sees on it.
const WIZARD_STEPS = [
  { name: "Welcome", fields: 1 },
  { name: "Your business", fields: 4 },
  { name: "Goals", fields: 4 },
  { name: "Communication preferences", fields: 4 },
  { name: "Documents", fields: 1 },
];
const WIZARD_FORMAT = ["B", "I", "U", "H1", "H2", "H3"];

function CardOnboarding() {
  return (
    // Dark gradient in light mode, light in dark mode: every app-screen cover
    // sits on a dark ground on the light page and a light one on the dark page.
    <GlassCover
      photo="bg-[url(/images/mocks/onboarding-ambient-dark.webp)] [[data-theme=dark]_&]:bg-[url(/images/mocks/onboarding-ambient.webp)]"
      focus="bg-center"
      dim=""
      inset=""
      panel={false}
    >
      <DesktopMock>
        <div className="flex h-14 items-center gap-3 border-b border-[#E5E7EB] px-6 text-[14px] leading-none">
          <svg viewBox="0 0 24 24" className="size-5 text-[#4B5563]" {...APP_ICON} aria-hidden>
            <rect x="3.5" y="5" width="17" height="14" rx="2" />
            <path d="M10 5v14" />
          </svg>
          <span className="text-[#6B7280]">Onboarding Wizard</span>
          <svg viewBox="0 0 24 24" className="size-3.5 text-[#9CA3AF]" {...APP_ICON} aria-hidden>
            <path d="m9 6 6 6-6 6" />
          </svg>
          <span>Edit onboarding form</span>
          <span className="ml-auto px-3 text-[#4B5563]">Cancel</span>
          <span className="flex h-9 items-center gap-1.5 rounded-lg bg-[#1F2329] px-3.5 text-[#FFFFFF]">
            <svg viewBox="0 0 24 24" className="size-4" {...APP_ICON} aria-hidden>
              <path d="m5 12 5 5 9-10" />
            </svg>
            Save form
          </span>
        </div>
        <div className="flex gap-10 px-6 pt-5">
          <div className="w-[270px] shrink-0">
            <div className={`flex h-12 items-center gap-2.5 rounded-xl border ${APP_LINE} px-3 text-[14px] leading-none`}>
              <span className={`${APP_BOX} size-7`}>
                <svg viewBox="0 0 24 24" className="size-4" {...APP_ICON} aria-hidden>
                  <path d="m12 4 8 4-8 4-8-4 8-4ZM4 12l8 4 8-4M4 16l8 4 8-4" />
                </svg>
              </span>
              Onboarding Form
              <span className="rounded-md bg-[#EEF3FE] px-2 py-1 text-[12px] text-[#2F5BB7]">Default</span>
            </div>
            <div className="mt-6 flex justify-between px-1 text-[13px] leading-none text-[#6B7280]">
              Steps
              <span>{WIZARD_STEPS.length}</span>
            </div>
            <div className="mt-3 space-y-2">
              {WIZARD_STEPS.map((step, i) => (
                <div
                  key={step.name}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 ${
                    i === 0 ? "border-2 border-[#1F2937]" : `border ${APP_LINE}`
                  }`}
                >
                  <span
                    className={`flex size-6 shrink-0 items-center justify-center rounded-md text-[12px] leading-none ${
                      i === 0 ? "bg-[#1F2937] text-[#FFFFFF]" : "bg-[#F1F2F4] text-[#374151]"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[14px] leading-none">{step.name}</span>
                    <span className="mt-1.5 block text-[12px] leading-none text-[#6B7280]">
                      {step.fields} {step.fields === 1 ? "field" : "fields"}
                    </span>
                  </span>
                </div>
              ))}
              <div className="flex h-12 items-center justify-center rounded-xl border border-dashed border-[#D1D5DB] text-[14px] leading-none text-[#4B5563]">
                + Add step
              </div>
            </div>
          </div>
          <div className="w-[560px] pt-1">
            <div className="text-[14px] leading-none">Name</div>
            <div className={`mt-2.5 flex h-10 items-center rounded-lg border ${APP_LINE} px-3 text-[14px] leading-none`}>
              Welcome
            </div>
            <div className="mt-5 text-[14px] leading-none">
              Description <span className="text-[#9CA3AF]">(optional)</span>
            </div>
            <div className={`mt-2.5 h-[64px] rounded-lg border ${APP_LINE} px-3 pt-3 text-[14px] leading-none`}>
              A short intro so the client knows what to expect.
            </div>
            <div className="mt-5 text-[14px] leading-none">Fields</div>
            <div className="mt-2 text-[13px] leading-none text-[#6B7280]">
              Questions and content shown to the contact on this step.
            </div>
            <div className={`mt-4 rounded-xl border ${APP_LINE} p-3`}>
              <span className={`${APP_BOX} inline-flex h-8 gap-1.5 px-2.5 text-[13px] leading-none text-[#1F2937]`}>
                T Text
              </span>
              <div className={`mt-3 flex h-10 items-center rounded-lg border ${APP_LINE} px-3 text-[14px] leading-none`}>
                Welcome aboard
              </div>
              <div className={`mt-3 rounded-lg border ${APP_LINE}`}>
                <div className="flex gap-4 border-b border-[#E5E7EB] px-3 py-2.5 text-[13px] leading-none text-[#4B5563]">
                  {WIZARD_FORMAT.map((f) => (
                    <span key={f}>{f}</span>
                  ))}
                </div>
                <div className="px-3 py-3 text-[14px] leading-snug">
                  We&apos;re glad you&apos;re here. This short form collects everything we need to get your account set up. It takes about 10 minutes, and your progress saves as you go.
                </div>
              </div>
            </div>
          </div>
        </div>
      </DesktopMock>
    </GlassCover>
  );
}

// Diagonal hatch for the "in progress" engagement column. Dark mode paints the
// stripe in white instead of ink, at a slightly higher alpha since the dark bar
// surface needs more separation to register.
const HATCH =
  "bg-[repeating-linear-gradient(45deg,rgba(16,24,40,0.035)_0,rgba(16,24,40,0.035)_1.5px,transparent_1.5px,transparent_9px)]";
const HATCH_DARK =
  "[[data-theme=dark]_&]:bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.055)_0,rgba(255,255,255,0.055)_1.5px,transparent_1.5px,transparent_9px)]";

// A single engagement column — an elevated light-grey tile that rests at its
// final height/score, then re-grows (height + count-up together) when the card
// is hovered. Label at the top, score at the floor, both stay crisp.
function EngagementBar({
  label,
  value,
  maxHeightPct,
  delayMs,
  play,
  pattern = false,
  compact = false,
}: {
  label: string;
  value: number;
  maxHeightPct: number;
  delayMs: number;
  play: number;
  // A faint diagonal hatch on the fill — reads as an "in progress / projected"
  // period next to the plain, settled bar.
  pattern?: boolean;
  // Thumbnail scale, for the how-it-works Describe card: the gallery's 26px
  // read-out needs a taller column than a 128px thumb gives, and at three bars
  // the label and number collide. Smaller type, tighter insets, quieter.
  compact?: boolean;
}) {
  const MIN_H = 16;
  const [shown, setShown] = useState(value);
  const [hPct, setHPct] = useState(maxHeightPct);
  const [op, setOp] = useState(1);
  const rafRef = useRef<number>(0);
  const toRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    if (play === 0) {
      // Rest / pointer left: snap to the final state (the previous run's rAF is
      // cancelled by this effect's cleanup) so nothing keeps animating.
      setShown(value);
      setHPct(maxHeightPct);
      setOp(1);
      return;
    }
    clearTimeout(toRef.current);
    cancelAnimationFrame(rafRef.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(value);
      setHPct(maxHeightPct);
      setOp(1);
      return;
    }
    setShown(0);
    setHPct(MIN_H);
    setOp(0);
    let startedAt: number | null = null;
    const DURATION = 1300;
    const run = (t: number) => {
      if (startedAt === null) startedAt = t;
      const p = Math.min(1, (t - startedAt) / DURATION);
      // easeInOutCubic — eases in and out so the count glides instead of
      // snapping up fast at the start the way easeOut did.
      const eased = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      setShown(Math.round(eased * value));
      setHPct(MIN_H + eased * (maxHeightPct - MIN_H));
      // Text fades in only as the column gets tall enough to hold it, so the
      // collapsed state never shows text crammed into a sliver.
      setOp(Math.max(0, (eased - 0.35) / 0.65));
      if (p < 1) rafRef.current = requestAnimationFrame(run);
    };
    toRef.current = setTimeout(() => {
      startedAt = null;
      rafRef.current = requestAnimationFrame(run);
    }, delayMs);
    return () => {
      clearTimeout(toRef.current);
      cancelAnimationFrame(rafRef.current);
    };
  }, [play, value, maxHeightPct, delayMs]);

  return (
    <div
      // Compact borrows the mock's own border token: at 5% black the outline
      // vanished against the near-white well the thumbnail sits on, and unlike
      // a fixed black alpha it inverts with the theme.
      // The data-slot is the handle a host card uses to opt its bars out of the
      // outline (see CardDataRoom), rather than every caller re-declaring it.
      data-slot="engagement-bar"
      className={`relative flex-1 overflow-hidden border bg-[var(--v69-inner)] [.template-mock_&]:border-black/15 [.template-mock_&]:bg-[var(--v69-card)] [[data-theme=dark]_.template-mock_&]:border-[rgba(255,255,255,0.20)] ${
        compact
          ? "rounded-[6px] border-[0.5px] border-[var(--mk-border)]"
          : "rounded-2xl border-black/[0.05]"
      }`}
      style={{ height: `${hPct}%` }}
    >
      {pattern && (
        // The hatch stripe has to flip with the theme: it was a hard-coded near
        // -black ink at 3.5%, which is invisible on the dark bar, so the AUG
        // column lost its pattern entirely in dark mode. `dark:` is the OS media
        // query on this site, so the override is keyed off data-theme instead.
        <div
          aria-hidden
          // Second data-slot handle, same idea as the bar's: a host card that
          // runs a light face in both themes (CardDataRoom) needs to put the ink
          // hatch back in dark, where the shared white one would be invisible.
          data-slot="engagement-hatch"
          className={`pointer-events-none absolute inset-0 ${HATCH} ${HATCH_DARK}`}
        />
      )}
      <span
        className={`absolute font-mono font-normal uppercase tracking-wide text-muted-foreground ${
          compact ? "left-1.5 top-1.5 text-[8px]" : "left-3 top-2.5 text-[11px]"
        }`}
        style={{ opacity: op }}
      >
        {label}
      </span>
      <span
        className={`absolute flex items-end gap-0.5 leading-none ${
          compact ? "bottom-1.5 left-1.5" : "bottom-4 left-3"
        }`}
        style={{ opacity: op }}
      >
        <span
          className={`font-normal tracking-tight tabular-nums text-[var(--v69-ink)] ${
            compact ? "text-[13px]" : "text-[26px]"
          }`}
        >
          {shown}
        </span>
        <span
          className={`font-normal leading-none text-muted-foreground ${
            compact ? "text-[8px]" : "mb-0.5 text-[15px]"
          }`}
        >
          %
        </span>
      </span>
    </div>
  );
}

// Client engagement dashboard — two elevated columns that rest at their final
// height, then re-grow (last, then this) with their scores counting up when the
// card is hovered. Monochrome, on the rail's own greys.
// `compact` is the how-it-works Describe thumbnail: three slimmer columns at a
// smaller scale, where the gallery's two big ones need more height than a 128px
// thumb has. A third month also makes the rise read as a trend rather than a
// single before/after jump.
export function CardDashboard({
  compact = false,
  still = false,
}: {
  compact?: boolean;
  // Never replay the grow/count-up. The in-view arming below is keyed off
  // `(hover: none), (max-width: 767px)`, and this card also appears in the
  // how-it-works mock, whose desktop screen shows from 640px — so between 640
  // and 767, and on any touch device, it animated where it should be still art.
  still?: boolean;
}) {
  const [play, setPlay] = useState(0);
  const inViewRef = useInViewReplay(() => {
    if (!still) setPlay((p) => p + 1);
  });
  const bars = compact
    ? [
        { label: "JUL", value: 64, maxHeightPct: 54, pattern: false },
        { label: "AUG", value: 71, maxHeightPct: 74, pattern: false },
        { label: "SEP", value: 88, maxHeightPct: 100, pattern: true },
      ]
    : [
        { label: "JUL", value: 71, maxHeightPct: 62, pattern: false },
        { label: "AUG", value: 88, maxHeightPct: 100, pattern: true },
      ];
  return (
    <div
      ref={inViewRef}
      onMouseEnter={(e) => {
        // Templates gallery is static — don't replay the grow/count-up there.
        if (still || e.currentTarget.closest(".template-mock")) return;
        setPlay((p) => p + 1);
      }}
      onMouseLeave={() => {
        if (!still) setPlay(0);
      }}
      className={`flex h-full flex-col bg-[var(--v69-card)] [[data-theme=dark]_.template-mock_&]:bg-[var(--v69-well)] ${
        compact ? "p-2" : "p-3.5"
      }`}
    >
      {/* No header — the bars fill the full card height and grow from the floor. */}
      <div
        className={`flex flex-1 items-end ${compact ? "gap-1.5" : "gap-2.5"}`}
      >
        {bars.map((b, i) => (
          <EngagementBar
            key={b.label}
            label={b.label}
            value={b.value}
            maxHeightPct={b.maxHeightPct}
            delayMs={i * 550}
            play={play}
            pattern={b.pattern}
            compact={compact}
          />
        ))}
      </div>
    </div>
  );
}
/** Angle at a fraction along the arc, swept left to right over the top. */
/** Distance along the arc, as a fraction of it, for a point on the band scale. */
/**
 * An arc segment of the given thickness, as a sector inset by the corner radius
 * (see GAUGE_CORNER). The track and the bands both come through here, so the
 * corner is one number for all of them — the track used a round cap before, and
 * a round cap is always half the thickness, so the wider track's ends carried a
 * 6.5 radius beside the bands' 2 and the two never agreed.
 */
/** The wedge the score has swept, used to clip the coloured bands. */
// Engagement dashboard — the engagement view as the team sees it on desktop:
// the four engagement levels, then each company with its level, a pulse line
// of recent activity, and its risk.
const ENGAGEMENT_LEVELS = [
  { value: 0, label: "Engaged", note: "Active & stable", dot: "bg-[#30A46C]" },
  { value: 19, label: "Cooling", note: "Declining, still active", dot: "bg-[#F2A33A]" },
  { value: 21, label: "Quiet", note: "Inactive for 30+ days", dot: "bg-[#E5484D]" },
  { value: 10, label: "Never active", note: "No person events yet", dot: "bg-[#C4C8CF]" },
];
const ENGAGEMENT_ROWS = [
  { initial: "O", name: "Okafor Consulting", active: "56d ago", follow: "27d overdue", pulse: "M0 14 L8 14 L11 2 L14 14 L30 14", tint: "bg-[#F3ECF8] text-[#7A3E9D]" },
  { initial: "V", name: "Vistula Trading", active: "49d ago", follow: "22d overdue", pulse: "M0 14 L6 14 L9 3 L13 14 L30 14", tint: "bg-[#ECEEF9] text-[#4B55A8]" },
  { initial: "K", name: "Kestrel Holdings", active: "42d ago", follow: "", pulse: "M0 14 L12 14 L15 2 L18 14 L30 14", tint: "bg-[#FBF3E4] text-[#9A6B1F]" },
  { initial: "T", name: "Thomas Ramirez", active: "42d ago", follow: "", pulse: "M0 14 L5 14 L8 4 L13 12 L30 14", tint: "bg-[#E8F4F0] text-[#2F7A64]" },
  { initial: "L", name: "Lumen Analytics", active: "42d ago", follow: "", pulse: "M0 14 L6 14 L9 3 L14 13 L30 14", tint: "bg-[#F3ECF8] text-[#7A3E9D]" },
  { initial: "T", name: "Triyama Software", active: "41d ago", follow: "", pulse: "M0 14 L10 14 L13 2 L17 14 L30 14", tint: "bg-[#ECEEF9] text-[#4B55A8]" },
  { initial: "M", name: "Magna Company", active: "41d ago", follow: "", pulse: "M0 14 L12 14 L15 3 L19 14 L30 14", tint: "bg-[#E6F1F8] text-[#2C6E99]" },
];
const ENGAGEMENT_COLS =
  "grid grid-cols-[1.6fr_0.8fr_1.2fr_0.9fr_1fr_0.7fr] items-center gap-4";

function CardEngagement() {
  return (
    // Dark gradient in light mode, light in dark mode: every app-screen cover
    // sits on a dark ground on the light page and a light one on the dark page.
    <GlassCover
      photo="bg-[url(/images/mocks/engagement-ambient-dark.webp)] [[data-theme=dark]_&]:bg-[url(/images/mocks/engagement-ambient.webp)]"
      focus="bg-center"
      dim=""
      inset=""
      panel={false}
    >
      <DesktopMock>
        <div className="flex h-14 items-center gap-3 border-b border-[#E5E7EB] px-6 text-[15px] leading-none">
          <svg viewBox="0 0 24 24" className="size-5 text-[#4B5563]" {...APP_ICON} aria-hidden>
            <rect x="3.5" y="5" width="17" height="14" rx="2" />
            <path d="M10 5v14" />
          </svg>
          <span>Client Engagement Dashboard</span>
          <svg viewBox="0 0 24 24" className="size-4 text-[#6B7280]" {...APP_ICON} aria-hidden>
            <path d="m6 9 6 6 6-6" />
          </svg>
          <span className={`${APP_BOX} ml-auto h-9 px-3.5 text-[14px] leading-none text-[#1F2937]`}>
            Engagement rules
          </span>
          <span className="flex h-9 items-center rounded-lg bg-[#1F2329] px-3.5 text-[14px] leading-none text-[#FFFFFF]">
            Refresh data
          </span>
        </div>
        <div className="px-6 pt-5">
          <div className="w-[300px]">
            <AppSearch placeholder="Search companies…" />
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {ENGAGEMENT_LEVELS.map((l) => (
              <div key={l.label} className={`rounded-xl border ${APP_LINE} px-4 py-4`}>
                <div className="text-[24px] leading-none">{l.value}</div>
                <div className="mt-2.5 flex items-center gap-1.5 text-[13px] leading-none">
                  <span className={`size-1.5 rounded-full ${l.dot}`} />
                  {l.label}
                </div>
                <div className="mt-2 text-[13px] leading-none text-[#6B7280]">{l.note}</div>
              </div>
            ))}
          </div>
          <div className="mt-5">
            <div className={`${ENGAGEMENT_COLS} h-11 border-b border-[#E5E7EB] px-2 text-[14px] leading-none`}>
              <span>Company</span>
              <span>Level</span>
              <span>Engagement pulse</span>
              <span>Last active</span>
              <span>Next follow-up</span>
              <span>Risk</span>
            </div>
            {ENGAGEMENT_ROWS.map((r) => (
              <div
                key={r.name}
                className={`${ENGAGEMENT_COLS} h-11 border-b border-[#E5E7EB] px-2 text-[14px] leading-none`}
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  <span className={`flex size-6 shrink-0 items-center justify-center rounded-md text-[12px] leading-none ${r.tint}`}>
                    {r.initial}
                  </span>
                  <span className="truncate">{r.name}</span>
                </span>
                <span>
                  <span className="rounded-full bg-[#FDECEC] px-2.5 py-1 text-[12px] leading-none text-[#B42318]">Quiet</span>
                </span>
                <span className="flex items-center gap-2 text-[12px] text-[#B42318]">
                  <svg viewBox="0 0 30 16" className="h-4 w-[60px]" fill="none" stroke="#B42318" strokeWidth="1.3" aria-hidden>
                    <path d={r.pulse} />
                  </svg>
                  -100%
                </span>
                <span className="text-[#6B7280]">{r.active}</span>
                <span className={r.follow ? "text-[#B42318]" : "text-[#9CA3AF]"}>{r.follow || "–"}</span>
                <span className="flex items-center gap-1.5 text-[#B42318]">
                  <span className="size-1.5 rounded-full bg-[#B42318]" />
                  High
                </span>
              </div>
            ))}
          </div>
        </div>
      </DesktopMock>
    </GlassCover>
  );
}

function CardDataViz() {
  // Distinct from the engagement dashboard's dense histogram: a few thick
  // capsule bars, each a full-height track with a filled lower portion — reads
  // as an analytics readout. A headline metric anchors it as a revenue chart.
  const bars = [40, 26, 54, 36, 60, 100, 48, 68, 34];
  return (
    <div className="flex h-full flex-col gap-2 bg-[var(--v69-card)] px-3.5 pt-3.5">
      <div>
        <div className="text-[10px] text-muted-foreground">Monthly revenue</div>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-[26px] font-normal leading-none tracking-tight text-[var(--v69-ink)]">
            $48.2K
          </span>
        </div>
      </div>
      <div className="flex min-h-0 flex-1 items-end gap-1.5 pb-3.5 pt-1.5">
        {bars.map((h, i) => (
          <div
            key={i}
            className="relative flex h-full w-full items-end overflow-hidden rounded-full bg-[var(--v69-well)]"
          >
            <div
              className="w-full origin-bottom rounded-full bg-[color-mix(in_srgb,var(--v69-ink)_50%,transparent)] [.template-mock_&]:bg-[var(--v69-ink)] group-hover:[animation:v69GrowY_0.6s_ease-out_both] group-[.is-inview]:[animation:v69GrowY_0.6s_ease-out_both]"
              style={{ height: `${h}%`, animationDelay: `${i * 0.05}s` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// Time tracker — entries as the team sees them on desktop: views and
// categories down the side, the week's totals, and each entry with its
// category, hours and whether it is billable. Team names are made up.
const TIME_CATEGORIES = [
  { name: "Consulting", count: 8, dot: "bg-[#2F6FEB]" },
  { name: "Development", count: 10, dot: "bg-[#8B5CF6]" },
  { name: "Design", count: 5, dot: "bg-[#E5458A]" },
  { name: "Meeting", count: 6, dot: "bg-[#F2B53A]" },
  { name: "Research", count: 4, dot: "bg-[#14A38B]" },
  { name: "Onboarding", count: 4, dot: "bg-[#30A46C]" },
];
const TIME_ENTRIES = [
  { initials: "KH", who: "Kestrel Holdings", cat: "Development", dot: "bg-[#8B5CF6]", hours: "6.00", billable: true, by: "Leo Hart" },
  { initials: "WG", who: "Wexford Group", cat: "Consulting", dot: "bg-[#2F6FEB]", hours: "3.00", billable: true, by: "Maya Lin" },
  { initials: "LD", who: "Larkspur Design", cat: "Onboarding", dot: "bg-[#30A46C]", hours: "2.25", billable: true, by: "Sam Ortega" },
  { initials: "BF", who: "Brightwell Financial", cat: "Design", dot: "bg-[#E5458A]", hours: "4.50", billable: true, by: "Tara Quinn" },
  { initials: "RV", who: "Redwood Ventures", cat: "Administrative", dot: "bg-[#9CA3AF]", hours: "1.50", billable: false, by: "Ari Cole" },
  { initials: "NL", who: "Northwind Logistics", cat: "Development", dot: "bg-[#8B5CF6]", hours: "5.50", billable: true, by: "Leo Hart" },
  { initials: "MC", who: "Magna Company", cat: "Meeting", dot: "bg-[#F2B53A]", hours: "1.00", billable: false, by: "Maya Lin" },
];
const TIME_COLS = "grid grid-cols-[1.5fr_1.1fr_0.6fr_0.9fr_1fr] items-center gap-4";

function CardTimeTracker() {
  return (
    // Dark gradient in light mode, light in dark mode: every app-screen cover
    // sits on a dark ground on the light page and a light one on the dark page.
    <GlassCover
      photo="bg-[url(/images/mocks/time-ambient-dark.webp)] [[data-theme=dark]_&]:bg-[url(/images/mocks/time-ambient.webp)]"
      focus="bg-center"
      dim=""
      inset=""
      panel={false}
    >
      <DesktopMock>
        <div className="flex h-14 items-center gap-3 border-b border-[#E5E7EB] px-6 text-[15px] leading-none">
          <svg viewBox="0 0 24 24" className="size-5 text-[#4B5563]" {...APP_ICON} aria-hidden>
            <rect x="3.5" y="5" width="17" height="14" rx="2" />
            <path d="M10 5v14" />
          </svg>
          <span>Time Tracker</span>
          <svg viewBox="0 0 24 24" className="size-4 text-[#6B7280]" {...APP_ICON} aria-hidden>
            <path d="m6 9 6 6 6-6" />
          </svg>
          <span className="ml-auto px-3 text-[14px] text-[#374151]">Start timer</span>
          <span className="flex h-9 items-center gap-1.5 rounded-lg bg-[#1F2329] px-3.5 text-[14px] leading-none text-[#FFFFFF]">
            <svg viewBox="0 0 24 24" className="size-4" {...APP_ICON} aria-hidden>
              <path d="M12 5v14M5 12h14" />
            </svg>
            New time entry
          </span>
        </div>
        <div className="flex gap-6 px-6 pt-5">
          <div className="w-[190px] shrink-0">
            <span className="inline-flex rounded-lg bg-[#F1F2F4] p-1 text-[14px] leading-none">
              <span className="rounded-md bg-[#FFFFFF] px-3 py-2">Entries</span>
              <span className="px-3 py-2 text-[#6B7280]">Reports</span>
            </span>
            <div className="mt-6 px-1 text-[13px] leading-none text-[#6B7280]">Views</div>
            <div className="mt-2.5 flex items-center justify-between rounded-md bg-[#F1F2F4] px-2 py-2.5 text-[14px] leading-none">
              All entries <span className="text-[#6B7280]">43</span>
            </div>
            <div className="mt-6 px-1 text-[13px] leading-none text-[#6B7280]">Categories</div>
            <div className="mt-2.5 space-y-0.5">
              {TIME_CATEGORIES.map((c) => (
                <div key={c.name} className="flex items-center gap-2.5 px-2 py-2.5 text-[14px] leading-none text-[#374151]">
                  <span className={`size-2.5 rounded-full ${c.dot}`} />
                  {c.name}
                  <span className="ml-auto text-[13px] text-[#6B7280]">{c.count}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Total hours", value: "113.75", note: "43 entries" },
                { label: "Billable", value: "104.25", note: "9.50 non-billable" },
                { label: "This week", value: "33.00", note: "+6.50 vs last week" },
              ].map((c) => (
                <div key={c.label} className={`rounded-xl border ${APP_LINE} px-4 py-4`}>
                  <div className="text-[13px] leading-none text-[#6B7280]">{c.label}</div>
                  <div className="mt-3 text-[24px] leading-none tracking-tight">{c.value}</div>
                  <div className="mt-2.5 text-[12px] leading-none text-[#6B7280]">{c.note}</div>
                </div>
              ))}
            </div>
            <div className={`mt-4 overflow-hidden rounded-xl border ${APP_LINE}`}>
              <div className={`${TIME_COLS} h-11 px-4 text-[13px] leading-none text-[#4B5563]`}>
                <span>Contact / company</span>
                <span>Category</span>
                <span>Hours</span>
                <span>Billable</span>
                <span>Logged by</span>
              </div>
              {TIME_ENTRIES.map((e) => (
                <div key={e.who} className={`${TIME_COLS} h-11 border-t border-[#E5E7EB] px-4 text-[14px] leading-none`}>
                  <span className="flex min-w-0 items-center gap-2.5">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-[#E8F4F0] text-[9px] leading-none text-[#2F7A64]">
                      {e.initials}
                    </span>
                    <span className="truncate">{e.who}</span>
                  </span>
                  <span className="flex items-center gap-2 text-[13px]">
                    <span className={`size-1.5 rounded-full ${e.dot}`} />
                    {e.cat}
                  </span>
                  <span className="tabular-nums">{e.hours}</span>
                  <span>
                    <span className={`rounded px-2 py-1 text-[12px] leading-none ${e.billable ? "bg-[#E3F6E9] text-[#1E7A44]" : "border border-[#E5E7EB] text-[#4B5563]"}`}>
                      {e.billable ? "Billable" : "Non-billable"}
                    </span>
                  </span>
                  <span className="truncate text-[13px] text-[#4B5563]">{e.by}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DesktopMock>
    </GlassCover>
  );
}

/**
 * One odometer digit for a card total: a 0–9 strip printed twice, resting on the
 * target digit in the second cycle. The animation starts it one full cycle
 * earlier, so a single roll upward spins through all ten digits and lands back
 * on the target — the same effect the pricing page's billing toggle uses, minus
 * its dependence on the value actually changing.
 */
/** Money figure whose digits roll into place; separators stay put. */
// Proposal builder — the proposal templates as the team sees them on desktop:
// each one a card with the firm's mark, its cover photo and its page count.
// The photos are the real covers from the template's own screenshot.
const PROPOSAL_TEMPLATES = [
  { name: "Business Proposal", pages: 10, src: "/images/mocks/proposal-cover-1.webp" },
  { name: "Project Proposal", pages: 4, src: "/images/mocks/proposal-cover-2.webp" },
  { name: "Creative Brief", pages: 9, src: "/images/mocks/proposal-cover-3.webp" },
  { name: "Marketing Retainer", pages: 9, src: "/images/mocks/proposal-cover-4.webp" },
  { name: "Partnership Proposal", pages: 9, src: "/images/mocks/proposal-cover-5.webp" },
];

function CardProposal() {
  return (
    // Dark gradient in light mode, light in dark mode: every app-screen cover
    // sits on a dark ground on the light page and a light one on the dark page.
    <GlassCover
      photo="bg-[url(/images/mocks/proposal-ambient-dark.webp)] [[data-theme=dark]_&]:bg-[url(/images/mocks/proposal-ambient.webp)]"
      focus="bg-center"
      dim=""
      inset=""
      panel={false}
    >
      <DesktopMock>
        <div className="flex h-14 items-center gap-3 border-b border-[#E5E7EB] px-6 text-[15px] leading-none">
          <svg viewBox="0 0 24 24" className="size-5 text-[#4B5563]" {...APP_ICON} aria-hidden>
            <rect x="3.5" y="5" width="17" height="14" rx="2" />
            <path d="M10 5v14" />
          </svg>
          <span className="text-[#6B7280]">Proposals</span>
          <svg viewBox="0 0 24 24" className="size-3.5 text-[#9CA3AF]" {...APP_ICON} aria-hidden>
            <path d="m9 6 6 6-6 6" />
          </svg>
          <span>Templates</span>
          <span className="ml-auto flex h-9 items-center gap-1.5 rounded-lg bg-[#1F2329] px-3.5 text-[14px] leading-none text-[#FFFFFF]">
            <svg viewBox="0 0 24 24" className="size-4" {...APP_ICON} aria-hidden>
              <path d="M12 5v14M5 12h14" />
            </svg>
            Create template
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4 px-5 pt-5">
          {PROPOSAL_TEMPLATES.map((t) => (
            <div key={t.name} className={`rounded-xl border ${APP_LINE} px-4 pb-4 pt-5`}>
              <div className="flex items-center gap-2.5">
                <span className="flex size-5 items-center justify-center rounded bg-[#7DA4FF]">
                  <span className="h-2.5 w-3 skew-x-[-20deg] rounded-[1px] bg-[#FFFFFF]" />
                </span>
                <span className="h-4 w-px bg-[#E5E7EB]" />
                <span className="text-[11px] leading-none">Your firm</span>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element -- a fixed thumbnail inside a scaled mock */}
              <img src={t.src} alt="" className="mt-4 block aspect-[614/244] w-full object-cover" />
              <div className="mt-4 flex items-center justify-between text-[14px] leading-none">
                {t.name}
                <span className="text-[#6B7280]">···</span>
              </div>
              <div className="mt-2 text-[13px] leading-none text-[#6B7280]">{t.pages} pages</div>
            </div>
          ))}
        </div>
      </DesktopMock>
    </GlassCover>
  );
}

// Client AI assistant — the assistant as the client sees it on desktop: the
// welcome, three starter questions, and the question field. A spark mark
// stands in for the app's emoji, which the site keeps out of its UI.
const ASSISTANT_STARTERS = [
  "What forms or contracts do I have open?",
  "Where can I find my latest files?",
  "How do I get in touch with my team?",
];

function CardChat() {
  return (
    // Dark gradient in light mode, light in dark mode: every app-screen cover
    // sits on a dark ground on the light page and a light one on the dark page.
    <GlassCover
      photo="bg-[url(/images/mocks/assistant-ambient-dark.webp)] [[data-theme=dark]_&]:bg-[url(/images/mocks/assistant-ambient.webp)]"
      focus="bg-center"
      dim=""
      inset=""
      panel={false}
    >
      <DesktopMock>
        <div className="flex h-14 items-center gap-3 border-b border-[#E5E7EB] px-6 text-[15px] leading-none">
          <svg viewBox="0 0 24 24" className="size-5 text-[#4B5563]" {...APP_ICON} aria-hidden>
            <rect x="3.5" y="5" width="17" height="14" rx="2" />
            <path d="M10 5v14" />
          </svg>
          <span>AI Assistant</span>
        </div>
        <div className="flex h-12 items-center justify-between border-b border-[#E5E7EB] px-6 text-[15px] leading-none">
          Assistant
          <svg viewBox="0 0 24 24" className="size-5 text-[#6B7280]" {...APP_ICON} aria-hidden>
            <circle cx="12" cy="12" r="8" />
            <path d="M12 8v4l3 2" />
          </svg>
        </div>
        {/* The column sits where the crop leaves it in view, not at the
            centre of a screen wider than the card shows. */}
        <div className="flex w-[640px] flex-col items-center pb-16 pt-14 text-center">
          <span className="flex size-11 items-center justify-center rounded-full bg-[#EEF3FE] text-[#2F5BB7]">
            <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden>
              <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
            </svg>
          </span>
          <div className="mt-5 text-[22px] leading-none">How can we help?</div>
          <div className="mt-3 w-[340px] text-[14px] leading-snug text-[#6B7280]">
            Ask about your account, projects, or anything your team has documented here.
          </div>
          <div className="mt-6 w-[420px] space-y-2.5 text-left">
            {ASSISTANT_STARTERS.map((q) => (
              <div key={q} className={`rounded-xl border ${APP_LINE} px-4 py-3.5 text-[14px] leading-none`}>
                {q}
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-[#E5E7EB] px-4 py-4">
          <div className={`flex h-12 items-center justify-between rounded-xl border ${APP_LINE} px-4 text-[14px] leading-none text-[#9CA3AF]`}>
            Ask a question…
            <svg viewBox="0 0 24 24" className="size-5 text-[#4B5563]" {...APP_ICON} aria-hidden>
              <path d="M4 12 20 4l-5 16-3-7-8-1Z" />
            </svg>
          </div>
        </div>
      </DesktopMock>
    </GlassCover>
  );
}
// Document collector — the request list as the team sees it on desktop: each
// requested document with the contact it is from, its owner, priority and due
// date. Owners are made-up names, so no colleague's name ships on the public
// site.
const DOC_PRIORITY = {
  high: { label: "High", dot: "bg-[#E5484D]" },
  medium: { label: "Medium", dot: "bg-[#F2A33A]" },
  low: { label: "Low", dot: "bg-[#A0A6B1]" },
} as const;
const DOC_REQUESTS: {
  doc: string;
  initials: string;
  contact: string;
  owner: string;
  priority: keyof typeof DOC_PRIORITY;
  due: string;
  status: string;
  tint: string;
}[] = [
  { doc: "Signed engagement letter, FY2026 audit", initials: "TA", contact: "Tunde Adeyemi", owner: "", priority: "high", due: "Jun 19, 2026", status: "bg-[#30A46C]", tint: "bg-[#FBEDEC] text-[#A8453D]" },
  { doc: "Prior-year audit management letter response", initials: "BP", contact: "Beaumont Partners", owner: "", priority: "medium", due: "Jun 23, 2026", status: "bg-[#30A46C]", tint: "bg-[#F3ECF8] text-[#7A3E9D]" },
  { doc: "Annual compliance attestation", initials: "PR", contact: "Priya Raman", owner: "Maya Lin", priority: "low", due: "Jun 28, 2026", status: "bg-[#30A46C]", tint: "bg-[#FBEDEC] text-[#A8453D]" },
  { doc: "W-9 for new vendor onboarding", initials: "SM", contact: "Sofia Marchetti", owner: "Sam Ortega", priority: "low", due: "Jun 29, 2026", status: "bg-[#30A46C]", tint: "bg-[#F3ECF8] text-[#7A3E9D]" },
  { doc: "Inventory count worksheets", initials: "CO", contact: "Cascade Outdoor Co.", owner: "Neil Foster", priority: "medium", due: "Jul 6, 2026", status: "bg-[#30A46C]", tint: "bg-[#FBEDF6] text-[#A33D7A]" },
  { doc: "ADV Part 2B brochure supplement", initials: "PR", contact: "Priya Raman", owner: "Sam Ortega", priority: "high", due: "Jul 28, 2026", status: "bg-[#E5484D]", tint: "bg-[#FBEDEC] text-[#A8453D]" },
  { doc: "Certificate of insurance", initials: "DO", contact: "David Okonkwo", owner: "Leo Hart", priority: "high", due: "Jul 30, 2026", status: "bg-[#E5484D]", tint: "bg-[#FBEDEC] text-[#A8453D]" },
  { doc: "Depreciation schedule for fixed assets", initials: "EV", contact: "Elena Vasquez", owner: "Maya Lin", priority: "medium", due: "Aug 9, 2026", status: "bg-[#F2A33A]", tint: "bg-[#ECEEF9] text-[#4B55A8]" },
  { doc: "Payroll register, June 2026", initials: "AB", contact: "Amelia Brooks", owner: "Tara Quinn", priority: "medium", due: "Aug 10, 2026", status: "bg-[#F2A33A]", tint: "bg-[#F3ECF8] text-[#7A3E9D]" },
  { doc: "Commercial lease agreement", initials: "NL", contact: "Northwind Logistics", owner: "Leo Hart", priority: "medium", due: "Aug 12, 2026", status: "bg-[#F2A33A]", tint: "bg-[#E8F4F0] text-[#2F7A64]" },
];
// Drawn at a desktop width and shown whole, so the table needs only as many
// rows as end inside the window rather than running off its foot.
const DOC_APP_W = 1000;
const DOC_ROWS_SHOWN = 6;
const DOC_COLS =
  "grid grid-cols-[2.6fr_1.5fr_1.1fr_0.9fr_1fr_0.5fr] items-center gap-4";

function CardDocuments() {
  return (
    // A flat black face in light mode, as Project tracker has; off-white in
    // dark mode, so no card is ever a dark square on the dark page.
    <GlassCover
      photo="bg-[#101010] [[data-theme=dark]_&]:bg-[#F7F7F4]"
      focus="bg-center"
      dim=""
      inset=""
      panel={false}
    >
      <DesktopMockWhole appWidth={DOC_APP_W}>
        <div className="flex h-16 items-center gap-2 border-b border-[#E5E7EB] px-6">
          <span className="text-[16px] leading-none">Document collection</span>
          <svg viewBox="0 0 24 24" className="size-4 text-[#6B7280]" {...APP_ICON} aria-hidden>
            <path d="m6 9 6 6 6-6" />
          </svg>
          <span className="ml-auto flex h-9 items-center gap-1.5 rounded-lg bg-[#1F2329] px-3.5 text-[14px] leading-none text-[#FFFFFF]">
            <svg viewBox="0 0 24 24" className="size-4" {...APP_ICON} aria-hidden>
              <path d="M12 5v14M5 12h14" />
            </svg>
            New request
          </span>
        </div>
        <div className="px-6 pt-6">
          <AppSearch placeholder="Search requests…" />
          <div className="mt-3 flex items-center gap-2 text-[14px] leading-none">
            <span className={`${APP_BOX} h-10 gap-2 px-3.5`}>
              <svg viewBox="0 0 24 24" className="size-4" {...APP_ICON} aria-hidden>
                <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
                <circle cx="16" cy="7" r="2" />
                <circle cx="10" cy="17" r="2" />
              </svg>
              Filters
            </span>
            <span className={`${APP_BOX} ml-auto h-10 gap-2 px-3.5`}>
              <svg viewBox="0 0 24 24" className="size-4" {...APP_ICON} aria-hidden>
                <rect x="3.5" y="4.5" width="17" height="4" rx="1" />
                <path d="M5 8.5v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-9M10 12.5h4" />
              </svg>
              Archived
            </span>
            <span className={`flex h-10 overflow-hidden rounded-lg border ${APP_LINE} text-[#6B7280]`}>
              <span className="flex items-center gap-2 bg-[#F1F2F4] px-3.5 text-[#1F2937]">
                <svg viewBox="0 0 24 24" className="size-4" {...APP_ICON} aria-hidden>
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                  <path d="M4 10h16M10 10v10" />
                </svg>
                Table
              </span>
              <span className="flex items-center gap-2 px-3.5">
                <svg viewBox="0 0 24 24" className="size-4" {...APP_ICON} aria-hidden>
                  <rect x="4" y="5" width="5" height="5" rx="1" />
                  <rect x="4" y="14" width="5" height="5" rx="1" />
                  <path d="M13 6.5h7M13 9h5M13 15.5h7M13 18h5" />
                </svg>
                Groups
              </span>
            </span>
          </div>
          <div className={`mt-4 overflow-hidden rounded-xl border ${APP_LINE}`}>
            <div className={`${DOC_COLS} h-12 bg-[#F7F8FA] px-5 text-[14px] leading-none`}>
              <span>Document</span>
              <span>Contact</span>
              <span>Owner</span>
              <span>Priority</span>
              <span>Due date</span>
              <span>Status</span>
            </div>
            {DOC_REQUESTS.slice(0, DOC_ROWS_SHOWN).map((r) => (
              <div
                key={r.doc}
                className={`${DOC_COLS} h-12 border-t border-[#E5E7EB] px-5 text-[14px] leading-none`}
              >
                <span className="truncate">{r.doc}</span>
                <span className="flex min-w-0 items-center gap-2.5">
                  <span
                    className={`flex size-7 shrink-0 items-center justify-center rounded-full text-[11px] leading-none ${r.tint}`}
                  >
                    {r.initials}
                  </span>
                  <span className="truncate">{r.contact}</span>
                </span>
                <span className="truncate text-[#4B5563]">{r.owner || "–"}</span>
                <span>
                  <span className={`inline-flex items-center gap-1.5 rounded-full border ${APP_LINE} px-2.5 py-1.5 text-[13px] leading-none`}>
                    <span className={`size-1.5 rounded-full ${DOC_PRIORITY[r.priority].dot}`} />
                    {DOC_PRIORITY[r.priority].label}
                  </span>
                </span>
                <span className="text-[#4B5563]">{r.due}</span>
                <span>
                  <span className={`block size-2 rounded-full ${r.status}`} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </DesktopMockWhole>
    </GlassCover>
  );
}

// The PDF file mark she supplied: a filled document with the PDF letterforms cut
// out of its foot. Filled rather than stroked, which is what gives the tile the
// weight of an app icon.
const PDF_GLYPH_PATH =
  "M6.875 1.875H2.5C2.15625 1.875 1.875 2.15625 1.875 2.5V17.5C1.875 17.8438 2.15625 18.125 2.5 18.125H5.625V20H2.5C1.12109 20 0 18.8789 0 17.5V2.5C0 1.12109 1.12109 0 2.5 0H7.71484C8.37891 0 9.01562 0.261719 9.48437 0.730469L14.2695 5.51953C14.7383 5.98828 15 6.625 15 7.28906V13.1289H13.125V8.12891H9.6875C8.13281 8.12891 6.875 6.87109 6.875 5.31641V1.87891V1.875ZM12.3477 6.25L8.75 2.65234V5.3125C8.75 5.83203 9.16797 6.25 9.6875 6.25H12.3477ZM8.125 14.8438H9.375C10.668 14.8438 11.7188 15.8945 11.7188 17.1875C11.7188 18.4805 10.668 19.5312 9.375 19.5312H8.90625V20.625C8.90625 21.0547 8.55469 21.4062 8.125 21.4062C7.69531 21.4062 7.34375 21.0547 7.34375 20.625V15.625C7.34375 15.1953 7.69531 14.8438 8.125 14.8438ZM9.375 17.9688C9.80469 17.9688 10.1562 17.6172 10.1562 17.1875C10.1562 16.7578 9.80469 16.4062 9.375 16.4062H8.90625V17.9688H9.375ZM13.125 14.8438H14.375C15.4961 14.8438 16.4062 15.7539 16.4062 16.875V19.375C16.4062 20.4961 15.4961 21.4062 14.375 21.4062H13.125C12.6953 21.4062 12.3438 21.0547 12.3438 20.625V15.625C12.3438 15.1953 12.6953 14.8438 13.125 14.8438ZM14.375 19.8438C14.6328 19.8438 14.8438 19.6328 14.8438 19.375V16.875C14.8438 16.6172 14.6328 16.4062 14.375 16.4062H13.9062V19.8438H14.375ZM17.3438 15.625C17.3438 15.1953 17.6953 14.8438 18.125 14.8438H20C20.4297 14.8438 20.7812 15.1953 20.7812 15.625C20.7812 16.0547 20.4297 16.4062 20 16.4062H18.9062V17.3438H20C20.4297 17.3438 20.7812 17.6953 20.7812 18.125C20.7812 18.5547 20.4297 18.9062 20 18.9062H18.9062V20.625C18.9062 21.0547 18.5547 21.4062 18.125 21.4062C17.6953 21.4062 17.3438 21.0547 17.3438 20.625V15.625Z";

// The square the glyph sits in — a flat tile, one value step off the card face.
// It used to be a milled well in light and the AI assistant's extruded disc in
// dark (perimeter carve, key light, sheen, and a catch-light down the card's own
// walls). All of that spent the cover on a material study of an empty square.
// The step in fill carries it now, with the shared hairline so the edge still
// registers in dark where the two neutrals sit close together.
const PDF_TILE =
  "relative flex size-[108px] shrink-0 items-center justify-center rounded-[28px] bg-[var(--v69-inner)] ring-1 ring-[rgba(16,24,40,0.06)] [.template-mock_&]:ring-[rgba(16,24,40,0.10)] [[data-theme=dark]_&]:bg-[#323232] [[data-theme=dark]_&]:ring-[rgba(255,255,255,0.12)] [[data-theme=dark]_.template-mock_&]:ring-[rgba(255,255,255,0.20)]";

// The mark's one value per skin — a clear step off the tile it sits on, and
// nothing else. Both skins take a warm grey rather than a cool one, and dark's sits
// around 70% brightness: at #B8B8B8 the mark was the brightest thing on a very
// quiet card and read as lit from within rather than as part of the tile.
// Light runs lighter than it did (#8A8B80): on a near-white card the mark was
// carrying more weight than anything else in the rail's quietest cover.
const PDF_GLYPH_TOKENS =
  "[--pdf-ink:#A3A497] [[data-theme=dark]_&]:[--pdf-ink:#B2AEA6]";

// PDF to digital intake — the source document as a single mark on a plain tile.
// Both the mark and the tile are flat: the cover's whole job is that the shape
// reads, and every layer of relief it carried was contrast spent on edge slivers.
function CardPdf() {
  return (
    <div className="flex h-full items-center justify-center bg-[var(--v69-card)] p-5">
      <span className={PDF_TILE}>
        <svg
          viewBox="0 0 21 22"
          // Grown with the square rather than left at its old size, so the mark
          // keeps the same optical ratio to the frame around it.
          className={`relative size-11 ${PDF_GLYPH_TOKENS}`}
          aria-hidden
        >
          <path d={PDF_GLYPH_PATH} fill="var(--pdf-ink)" />
        </svg>
      </span>
    </div>
  );
}

// Client performance dashboard — a radial goal gauge. The ring is the whole
// card, so it runs large: the 80% progress is split into two rounded segments
// (the month's two contributing streams) separated by a gap, which is what makes
// it read as a chart rather than a loading spinner. Both segments sweep in on
// hover. pathLength=100 so every arc length below is a literal percentage.
// The ring used to be extruded — a lit top edge, a shaded lower one, a drop
// under it and an inset shadow in the cutout, drawn as two unrotated discs over
// the arcs. At the weight it was drawn at that read as a plastic dial. It is a
// flat chart now: a thinner stroke on a plain track, and nothing under it.
// Stroke as a share of the 84-unit viewBox: ~8% of the ring's outer diameter,
// the proportion a data ring holds before it starts reading as a gauge bezel.
const GAUGE_STROKE = 6;
const GAUGE_MAIN = 62;
const GAUGE_SECOND = 15;
const GAUGE_GAP = 4;

function CardMetrics() {
  return (
    // The drafting ground the other single-object covers stand on. Dotted rules
    // rather than the ruled grid or the diagonal hatch: continuous lines behind a
    // ring cut across its arcs at every angle, and the hatch runs parallel to the
    // curve in two places and fights it. The dot field has no direction to clash.
    <div className="v69-plot-grid flex h-full flex-col items-center justify-center bg-[var(--v69-card)] p-5">
      {/* The gauge is sized from the frame rather than pinned at a design width:
          the cover is square on desktop and 16/10 on phones, so a fixed circle
          either overflowed the short axis or left the square half empty. Height
          drives it, the aspect keeps it round, and the cap holds it off the
          edges on the widest frames. */}
      <div className="relative flex aspect-square h-full max-h-[212px] w-auto max-w-full items-center justify-center [container-type:inline-size]">
        <svg viewBox="0 0 84 84" className="size-full -rotate-90">
          {/* Opaque track: this ring stands on the plotted ground, and at the
              translucent value the grid ran straight through the unfilled part of
              the gauge. */}
          <circle
            cx="42"
            cy="42"
            r="34"
            fill="none"
            strokeWidth={GAUGE_STROKE}
            stroke={INK_FAINT_SOLID}
          />
          {/* Second stream first, so the longer arc laps over it rather than
              under it where they meet. */}
          <circle
            cx="42"
            cy="42"
            r="34"
            fill="none"
            stroke="#C4DE7A"
            strokeWidth={GAUGE_STROKE}
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray={`${GAUGE_SECOND} ${100 - GAUGE_SECOND}`}
            style={{ strokeDashoffset: -(GAUGE_MAIN + GAUGE_GAP) }}
            className="group-hover:[animation:v69RingSecond_1s_ease-out_0.15s_both] group-[.is-inview]:[animation:v69RingSecond_1s_ease-out_0.15s_both]"
          />
          <circle
            cx="42"
            cy="42"
            r="34"
            fill="none"
            stroke="#7DA4FF"
            strokeWidth={GAUGE_STROKE}
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray={`${GAUGE_MAIN} ${100 - GAUGE_MAIN}`}
            className="group-hover:[animation:v69RingMain_1s_ease-out_both] group-[.is-inview]:[animation:v69RingMain_1s_ease-out_both]"
          />
        </svg>
        {/* The figure alone. The target under it ("/ 3,000") was a second,
            smaller number inside a ring whose filled arc already says how far
            along the goal is.
            Sized off the gauge rather than in fixed px, so it holds its ratio to
            the ring as the frame changes. */}
        <div className="absolute flex flex-col items-center leading-none">
          <span className="text-[16cqw] font-normal tracking-tight text-[var(--v69-ink)]">
            2.4k
          </span>
        </div>
      </div>
    </div>
  );
}

// A field of dots, one per unit of whatever the cover counts, laid out in bands
// from most to least resolved. Kept as its own component so a cover states its
// bands and nothing else; the layout is the same whatever is being counted.
function DotField({
  bands,
  cols,
}: {
  bands: { count: number; fill: string }[];
  cols: number;
}) {
  return (
    // The column count comes in as --dot-cols-base rather than a plain inline
    // grid-template-columns: the wide gallery cover has to re-lay the field into
    // fewer rows, and a stylesheet can't outrank an inline style. It overrides
    // --dot-cols instead, which wins the fallback chain in .dot-field.
    <div
      className="dot-field grid gap-2"
      style={{ "--dot-cols-base": cols } as React.CSSProperties}
    >
      {bands.flatMap((band, b) =>
        Array.from({ length: band.count }, (_, i) => (
          <span
            key={`${b}-${i}`}
            className="aspect-square rounded-full"
            style={{ background: band.fill }}
          />
        )),
      )}
    </div>
  );
}

// Retainer usage overview — one bar per client, against the allowance they share.
// It has been through two wrong shapes: twenty thin bars at unrelated heights (an
// audio equaliser), then four week-groups of three (a real chart, but twelve bars
// still land ~14px wide at cover size, and a grouped series is more structure than
// a thumbnail can carry).
//
// Six bars is the version that fits. They come out well over twice as wide, which
// is the only way a bar reads as a measured quantity rather than as a tick, and the
// card matches what its own caption says — hours used against each client's
// retainer, one bar each, sorted heaviest first.
//
// Monthly client report — a branded, read-only report: a "Published" badge pops
// in, a sparkline draws, and the summary lines rise in on hover.
function CardReport() {
  const stats: [string, string][] = [
    ["Revenue", "$42.0k"],
    ["Hours", "33.5"],
  ];
  const line =
    "M2,44 C22,40 34,26 54,28 C74,30 84,12 104,16 C124,20 136,30 156,22 C176,15 188,9 198,7";
  return (
    <div className="flex h-full flex-col justify-center gap-2 bg-[var(--v69-card)] p-4">
      <div className="flex gap-1.5">
        {stats.map(([l, v]) => (
          <div
            key={l}
            className="flex-1 rounded-md bg-[var(--v69-well)] px-2 py-1 shadow-[inset_0_0_0_1px_rgba(16,24,40,0.04)]"
          >
            <div className="text-[10px] text-muted-foreground">{l}</div>
            <div className="text-[13px] font-normal leading-tight text-[var(--v69-ink)]">
              {v}
            </div>
          </div>
        ))}
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground">
            Revenue trend
          </span>
          <span className="text-[10px] font-normal text-muted-foreground">
            +12%
          </span>
        </div>
        <div className="relative min-h-0 flex-1">
          <svg
            viewBox="0 0 200 52"
            preserveAspectRatio="none"
            className="h-full w-full text-muted-foreground"
          >
            <defs>
              <linearGradient id="v69report" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.22" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={`${line} L200,52 L0,52 Z`} fill="url(#v69report)" />
            <path
              d={line}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              pathLength={1}
              style={{ strokeDasharray: 1 }}
              className="group-hover:[animation:v69Draw_1s_ease-out_both] group-[.is-inview]:[animation:v69Draw_1s_ease-out_both]"
            />
          </svg>
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>Wk 1</span>
          <span>Wk 2</span>
          <span>Wk 3</span>
          <span>Wk 4</span>
        </div>
      </div>
    </div>
  );
}

// Tail card — matches the sibling poster structure (a 188px preview tile + a
// title/meta caption beneath) so it reads as one of the row rather than a
// heavier standalone box. The preview is a small stack of template thumbnails
// that fans out on hover.
function CardInfo() {
  // Fan offsets are kept small (≤24px shift, ≤7° rotate) relative to the
  // 146×116 thumbnails so the whole stack stays inside the 236×188 tile at rest
  // and on hover — nothing clips at the edges. Each thumbnail is a real card mock
  // rendered at its native 236×188 and scaled down (0.618) so it reads as a true
  // mini-screenshot rather than an overflowing, clipped fragment.
  const stack = [
    {
      slug: "content-approval-flow",
      z: "z-[1]",
      rest: "[transform:translate(-50%,-50%)_translateY(8px)_scale(0.9)]",
      hover:
        "group-hover:[transform:translate(-50%,-50%)_translateX(-24px)_translateY(-2px)_rotate(-7deg)]",
    },
    {
      slug: "client-project-tracker",
      z: "z-[2]",
      rest: "[transform:translate(-50%,-50%)_translateY(4px)_scale(0.95)]",
      hover: "group-hover:[transform:translate(-50%,-50%)_translateY(-8px)]",
    },
    {
      slug: "client-engagement-dashboard",
      z: "z-[3]",
      rest: "[transform:translate(-50%,-50%)]",
      hover:
        "group-hover:[transform:translate(-50%,-50%)_translateX(24px)_translateY(-2px)_rotate(7deg)]",
    },
  ];
  return (
    <a
      href={APP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="See all templates"
      className="group flex w-[236px] shrink-0 flex-col"
    >
      <div className="relative h-[188px] overflow-hidden rounded-xl border border-dashed border-black/15 bg-[var(--v69-well)] transition-transform duration-300 group-hover:-translate-y-1">
        {stack.map((t) => (
          <div
            key={t.slug}
            className={`absolute left-1/2 top-1/2 h-[116px] w-[146px] origin-center overflow-hidden rounded-md border border-black/[0.06] bg-[var(--v69-card)] shadow-[0_6px_16px_-8px_rgba(16,24,40,0.35)] transition-transform duration-300 ease-out ${t.z} ${t.rest} ${t.hover}`}
          >
            <div className="h-[188px] w-[236px] origin-top-left scale-[0.6186]">
              <V69CardMock slug={t.slug} />
            </div>
          </div>
        ))}
      </div>
      <p
        className={`mt-3 inline-flex items-center gap-1.5 text-[#181d24] ${T.title}`}
      >
        See all templates
        <IconArrow className="size-4 text-[var(--v69-ink)]/50 transition-transform group-hover:translate-x-0.5" />
      </p>
      <p className={`mt-1 text-[var(--v69-ink)]/55 ${T.meta}`}>
        {VISIBLE_TEMPLATES.length - CAROUSEL.length} more
      </p>
    </a>
  );
}
// Client project tracker — the Progress Tracker app as an internal user sees it
// on desktop: views and stages down the side, the three summary cards, and the
// client list with each client's stage and progress.
const TRACKER_STATS = [
  { label: "Total tracked", value: "242", note: "Active records being monitored" },
  { label: "In progress", value: "242", note: "Actively moving through stages" },
  { label: "Complete", value: "0", note: "Reached final stage" },
];
const TRACKER_VIEWS = [
  { label: "All records", count: 242 },
  { label: "Archived", count: 0 },
];
const TRACKER_STAGES = [
  { label: "Onboarding", count: 242, dot: "bg-[#E5736B]" },
  { label: "In progress", count: 0, dot: "bg-[#5B8DEF]" },
  { label: "Review", count: 0, dot: "bg-[#F2B53A]" },
  { label: "Complete", count: 0, dot: "bg-[#4CC27A]" },
];
// Initials tints, each a pale fill with its own darker ink, as the app draws them.
const TRACKER_ROWS = [
  { initials: "AD", name: "Aaron Davis", tint: "bg-[#FBF3E4] text-[#9A6B1F]" },
  { initials: "AW", name: "Aaron Wright", tint: "bg-[#E8F4F0] text-[#2F7A64]" },
  { initials: "AC", name: "Adam Castellano", tint: "bg-[#F3ECF8] text-[#7A3E9D]" },
  { initials: "AD", name: "Adam Duarte", tint: "bg-[#ECEEF9] text-[#4B55A8]" },
  { initials: "AM", name: "Alex Moreau", tint: "bg-[#E8F4F0] text-[#2F7A64]" },
  { initials: "AC", name: "Alexander Cox", tint: "bg-[#FBEDEC] text-[#A8453D]" },
  { initials: "AM", name: "Amanda Morgan", tint: "bg-[#E8F4F0] text-[#2F7A64]" },
  { initials: "AO", name: "Amara Okafor", tint: "bg-[#F3ECF8] text-[#7A3E9D]" },
  { initials: "AB", name: "Amelia Brooks", tint: "bg-[#F3ECF8] text-[#7A3E9D]" },
];
const TRACKER_PROGRESS = 25;
const TRACKER_UPDATED = "Sep 1, 2026";
const TRACKER_MESSAGE = "Welcome! We are getting your workspace ready";
const TRACKER_COLS = "grid grid-cols-[1.6fr_1fr_0.8fr_0.8fr_1.5fr_40px] items-center gap-4";

// A ring with a quarter lit, drawn on a 100-unit path so the dash is the percentage.
function TrackerRing({ pct }: { pct: number }) {
  return (
    <svg viewBox="0 0 24 24" className="size-5 -rotate-90" aria-hidden>
      <circle cx="12" cy="12" r="9" fill="none" stroke="#E5E7EB" strokeWidth="2.5" />
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="none"
        stroke="#E5736B"
        strokeWidth="2.5"
        strokeLinecap="round"
        pathLength={100}
        strokeDasharray={`${pct} 100`}
      />
    </svg>
  );
}

function CardTracker() {
  return (
    // The brand artwork in light mode, its rounded bands framing the window
    // from the left, which keeps this card's dark square in the gallery's
    // checkerboard; the generator's off-white in dark mode, so no card is ever
    // a dark square on the dark page.
    <GlassCover
      photo="bg-[url(/images/mocks/tracker-bands.webp)] [[data-theme=dark]_&]:bg-none [[data-theme=dark]_&]:bg-[#F7F7F4]"
      focus="bg-[position:0%_50%]"
      dim=""
      inset=""
      panel={false}
    >
      <DesktopMock>
        <div className="flex h-14 items-center gap-3 border-b border-[#E5E7EB] px-6">
          <svg viewBox="0 0 24 24" className="size-5 text-[#4B5563]" {...APP_ICON} aria-hidden>
            <rect x="3.5" y="5" width="17" height="14" rx="2" />
            <path d="M10 5v14" />
          </svg>
          <span className="text-[15px] leading-none">Progress Tracker</span>
          <svg viewBox="0 0 24 24" className="size-4 text-[#6B7280]" {...APP_ICON} aria-hidden>
            <path d="m6 9 6 6 6-6" />
          </svg>
          <span className={`${APP_BOX} ml-auto h-9 px-3.5 text-[14px] leading-none text-[#1F2937]`}>
            Settings
          </span>
        </div>
        <div className="flex">
          <aside className="w-[220px] shrink-0 border-r border-[#E5E7EB] bg-[#FAFAFB] px-3 pb-[400px] pt-6">
            <div className="px-2 text-[13px] leading-none text-[#6B7280]">Views</div>
            <div className="mt-3 space-y-1">
              {TRACKER_VIEWS.map((v, i) => (
                <div
                  key={v.label}
                  className={`flex items-center justify-between rounded-md px-2 py-2.5 text-[14px] leading-none ${
                    i === 0 ? `border ${APP_LINE} bg-[#FFFFFF]` : "text-[#4B5563]"
                  }`}
                >
                  {v.label}
                  <span className="text-[13px] text-[#6B7280]">{v.count}</span>
                </div>
              ))}
            </div>
            <div className="mx-2 my-5 border-t border-[#E5E7EB]" />
            <div className="px-2 text-[13px] leading-none text-[#6B7280]">Stages</div>
            <div className="mt-3 space-y-1">
              {TRACKER_STAGES.map((st) => (
                <div
                  key={st.label}
                  className="flex items-center gap-2.5 px-2 py-2.5 text-[14px] leading-none text-[#4B5563]"
                >
                  <span className={`size-2 rounded-full ${st.dot}`} />
                  {st.label}
                  <span className="ml-auto text-[13px] text-[#6B7280]">{st.count}</span>
                </div>
              ))}
            </div>
          </aside>
          <div className="min-w-0 flex-1 px-6 pt-10">
            <div className="grid grid-cols-3 gap-4">
              {TRACKER_STATS.map((stat) => (
                <div key={stat.label} className={`rounded-xl border ${APP_LINE} px-5 py-6`}>
                  <div className="text-[13px] leading-none text-[#6B7280]">{stat.label}</div>
                  <div className="mt-3.5 text-[36px] font-medium leading-none tracking-tight">
                    {stat.value}
                  </div>
                  <div className="mt-3.5 text-[14px] leading-none text-[#6B7280]">
                    {stat.note}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 w-[320px]">
              <AppSearch placeholder="Filter by contact…" />
            </div>
            <div className={`mt-5 overflow-hidden rounded-xl border ${APP_LINE}`}>
              <div className={`${TRACKER_COLS} h-12 bg-[#F7F8FA] px-4 text-[13px] leading-none text-[#6B7280]`}>
                <span className="text-[#1F2937]">Name</span>
                <span>Stage</span>
                <span>Progress</span>
                <span>Last updated</span>
                <span>Current message</span>
                <span />
              </div>
              {TRACKER_ROWS.map((row, i) => (
                <div
                  key={`${row.name}-${i}`}
                  className={`${TRACKER_COLS} h-12 border-t border-[#E5E7EB] px-4 text-[14px] leading-none`}
                >
                  <span className="flex min-w-0 items-center gap-2.5">
                    <span
                      className={`flex size-7 shrink-0 items-center justify-center rounded-full text-[11px] leading-none ${row.tint}`}
                    >
                      {row.initials}
                    </span>
                    <span className="truncate">{row.name}</span>
                  </span>
                  <span>
                    <span className="rounded-md border border-[#F5C2C0] bg-[#FDECEC] px-2 py-1.5 text-[12px] leading-none text-[#9B2C2C]">
                      Onboarding
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5 text-[13px] text-[#6B7280]">
                    <TrackerRing pct={TRACKER_PROGRESS} />
                    {TRACKER_PROGRESS}%
                  </span>
                  <span className="text-[13px] text-[#6B7280]">{TRACKER_UPDATED}</span>
                  <span className="truncate text-[13px]">{TRACKER_MESSAGE}</span>
                  <span className="text-center text-[#6B7280]">···</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DesktopMock>
    </GlassCover>
  );
}

// Client help desk — the support inbox as the client sees it on desktop: their
// open requests down the side, one open, and the thread with the team. The
// staff name is made up, so no colleague's name ships on the public site.
const HELPDESK_STATUS = {
  new: "bg-[#E6EEFC] text-[#2F5BB7]",
  progress: "bg-[#FDF3D7] text-[#8A5A00]",
} as const;
const HELPDESK_REQUESTS: {
  title: string;
  meta: string;
  status: keyof typeof HELPDESK_STATUS;
  dot: string;
  open?: boolean;
}[] = [
  { title: "Transfer ownership of a shared workspace", meta: "Account · opened Aug 8", status: "new", dot: "bg-[#2F6FEB]" },
  { title: "Uploads over 50MB time out before completing", meta: "Technical · opened Jul 31", status: "progress", dot: "bg-[#E5458A]", open: true },
  { title: "Point of contact for contract renewal", meta: "General · opened Jul 31", status: "new", dot: "bg-[#9CA3AF]" },
  { title: "Version history would help on shared files", meta: "Feedback · opened Jul 23", status: "progress", dot: "bg-[#30A46C]" },
  { title: "Add a shared mailbox as a notification recipient", meta: "Account · opened Jul 19", status: "new", dot: "bg-[#2F6FEB]" },
];

function CardSupport() {
  return (
    // Dark gradient in light mode, light in dark mode: every app-screen cover
    // sits on a dark ground on the light page and a light one on the dark page.
    <GlassCover
      photo="bg-[url(/images/mocks/helpdesk-ambient-dark.webp)] [[data-theme=dark]_&]:bg-[url(/images/mocks/helpdesk-ambient.webp)]"
      focus="bg-center"
      dim=""
      inset=""
      panel={false}
    >
      <DesktopMock>
        <div className="flex h-14 items-center gap-3 border-b border-[#E5E7EB] px-6 text-[15px] leading-none">
          <svg viewBox="0 0 24 24" className="size-5 text-[#4B5563]" {...APP_ICON} aria-hidden>
            <rect x="3.5" y="5" width="17" height="14" rx="2" />
            <path d="M10 5v14" />
          </svg>
          <span className="text-[#6B7280]">Client Support Requests</span>
          <svg viewBox="0 0 24 24" className="size-3.5 text-[#9CA3AF]" {...APP_ICON} aria-hidden>
            <path d="m9 6 6 6-6 6" />
          </svg>
          <span>Uploads over 50MB time out before completing</span>
        </div>
        <div className="flex gap-5 px-6 pt-5">
          <div className="w-[400px] shrink-0">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-lg bg-[#E8F4F0] text-[13px] leading-none text-[#2F7A64]">LD</span>
              <span>
                <span className="block text-[15px] leading-none">Support</span>
                <span className="mt-1.5 block text-[13px] leading-none text-[#6B7280]">Signed in as Larkspur Design</span>
              </span>
            </div>
            <div className="mt-6 flex gap-6 border-b border-[#E5E7EB] text-[14px] leading-none">
              <span className="border-b-2 border-[#1F2937] pb-3">Open 5</span>
              <span className="pb-3 text-[#6B7280]">Resolved 1</span>
              <span className="pb-3 text-[#6B7280]">All 6</span>
            </div>
            <div className={`mt-4 overflow-hidden rounded-xl border ${APP_LINE}`}>
              {HELPDESK_REQUESTS.map((r, i) => (
                <div
                  key={r.title}
                  className={`px-4 py-3.5 ${i > 0 ? "border-t border-[#E5E7EB]" : ""} ${r.open ? "bg-[#F7F8FA]" : ""}`}
                >
                  <div className="flex items-center gap-2.5 text-[14px] leading-none">
                    <span className={`size-2 shrink-0 rounded-full ${r.dot}`} />
                    <span className="min-w-0 flex-1 truncate">{r.title}</span>
                    <span className={`shrink-0 rounded-md px-2 py-1 text-[12px] ${HELPDESK_STATUS[r.status]}`}>
                      {r.status === "new" ? "New" : "In progress"}
                    </span>
                  </div>
                  <div className="mt-2 pl-[18px] text-[13px] leading-none text-[#6B7280]">{r.meta}</div>
                </div>
              ))}
            </div>
          </div>
          <div className={`min-w-0 flex-1 rounded-xl border ${APP_LINE}`}>
            <div className="border-b border-[#E5E7EB] px-5 py-4">
              <div className="text-[15px] leading-none">Uploads over 50MB time out before completing</div>
              <div className="mt-2.5 flex items-center gap-2 text-[13px] leading-none text-[#6B7280]">
                <span className={`rounded-md px-2 py-1 ${HELPDESK_STATUS.progress}`}>In progress</span>
                <span className="size-2 rounded-full bg-[#E5458A]" /> Technical · opened Jul 31
              </div>
            </div>
            <div className="space-y-5 px-5 py-5 text-[14px] leading-snug">
              <div className="ml-16">
                <div className="mb-2 text-right text-[12px] leading-none text-[#6B7280]">Leo Hart · Staff · Jul 31</div>
                <div className="rounded-xl bg-[#EEF3FE] px-4 py-3">
                  Thanks, could you tell me roughly how long it runs before failing, and whether the tab stays active the whole time?
                </div>
              </div>
              <div className="mr-16">
                <div className="mb-2 text-[12px] leading-none text-[#6B7280]">Mila Petrov · Aug 1</div>
                <div className="rounded-xl bg-[#F1F2F4] px-4 py-3">
                  Around four minutes, and yes, the tab stays open the whole time.
                </div>
              </div>
            </div>
          </div>
        </div>
      </DesktopMock>
    </GlassCover>
  );
}

// Hairline outline shared by the widget-style mocks — matches the homepage
// principle of framing tiles with a border (no drop shadow) and stays visible
// in both themes.
const MOCK_OUTLINE =
  "border border-black/[0.08] [[data-theme=dark]_&]:border-[rgba(255,255,255,0.12)] [.template-mock_&]:border-black/15 [[data-theme=dark]_.template-mock_&]:border-[rgba(255,255,255,0.20)]";
// Text that sits on an ink-filled surface: near-white in light mode, dark in
// dark mode (the ink token inverts, so the label must invert with it).
const ON_INK = "text-[var(--v69-well)]";

// Content approval flow — the approvals list as the team sees it on desktop:
// counts by status across the top, then each item with its client, owner, due
// date and status. Owners are made-up names, so no colleague's name ships on
// the public site.
const CONTENT_COUNTS = [
  { label: "All", value: 41 },
  { label: "Draft", value: 5 },
  { label: "Awaiting review", value: 13 },
  { label: "Changes requested", value: 8 },
  { label: "Approved", value: 10 },
  { label: "Rejected", value: 5 },
];
const CONTENT_STATUS = {
  awaiting: { label: "Awaiting review", cls: "bg-[#FDF3D7] text-[#8A5A00]" },
  draft: { label: "Draft", cls: "bg-[#F1F2F4] text-[#374151]" },
  changes: { label: "Changes requested", cls: "bg-[#E6EEFC] text-[#2F5BB7]" },
} as const;
const CONTENT_ROWS: {
  title: string;
  tag: string;
  initial: string;
  client: string;
  company?: string;
  owner: string;
  due: string;
  status: keyof typeof CONTENT_STATUS;
  created: string;
  tint: string;
}[] = [
  { title: "Studio capabilities deck redesign", tag: "Brand & Creative", initial: "M", client: "Mila Petrov", company: "Larkspur Design", owner: "Maya Lin", due: "Nov 26, 2026", status: "draft", created: "Oct 27, 2026", tint: "bg-[#E8F4F0] text-[#2F7A64]" },
  { title: "Annual shareholder letter design", tag: "Financial Reporting", initial: "T", client: "Tunde Adeyemi", company: "Kestrel Holdings", owner: "Sam Ortega", due: "Nov 16, 2026", status: "awaiting", created: "Oct 26, 2026", tint: "bg-[#FBEDEC] text-[#A8453D]" },
  { title: "Driver recruitment video storyboard", tag: "Campaign Assets", initial: "N", client: "Northwind Logistics", owner: "Leo Hart", due: "Nov 18, 2026", status: "draft", created: "Oct 25, 2026", tint: "bg-[#E8F4F0] text-[#2F7A64]" },
  { title: "API documentation landing page", tag: "Web & Content", initial: "T", client: "Triyama Software", owner: "Ari Cole", due: "Nov 14, 2026", status: "awaiting", created: "Oct 21, 2026", tint: "bg-[#ECEEF9] text-[#4B55A8]" },
  { title: "Lab safety compliance video script", tag: "Contracts & Legal", initial: "M", client: "Meridian Labs", owner: "Tara Quinn", due: "Nov 12, 2026", status: "awaiting", created: "Oct 20, 2026", tint: "bg-[#E8F4F0] text-[#2F7A64]" },
  { title: "Portfolio impact report, 2026 edition", tag: "Financial Reporting", initial: "R", client: "Redwood Ventures", owner: "Leo Hart", due: "Nov 7, 2026", status: "changes", created: "Oct 17, 2026", tint: "bg-[#E8F4F0] text-[#2F7A64]" },
];
const CONTENT_COLS =
  "grid grid-cols-[1.6fr_1.4fr_0.9fr_0.9fr_1.1fr_0.9fr] items-center gap-4";

function CardContentApproval() {
  return (
    // Dark gradient in light mode, light in dark mode: every app-screen cover
    // sits on a dark ground on the light page and a light one on the dark page.
    <GlassCover
      photo="bg-[url(/images/mocks/content-approval-ambient-dark.webp)] [[data-theme=dark]_&]:bg-[url(/images/mocks/content-approval-ambient.webp)]"
      focus="bg-center"
      dim=""
      inset=""
      panel={false}
    >
      <DesktopMock>
        <div className="flex h-14 items-center gap-3 border-b border-[#E5E7EB] px-6">
          <svg viewBox="0 0 24 24" className="size-5 text-[#4B5563]" {...APP_ICON} aria-hidden>
            <rect x="3.5" y="5" width="17" height="14" rx="2" />
            <path d="M10 5v14" />
          </svg>
          <span className="text-[15px] leading-none">Content Approval</span>
          <svg viewBox="0 0 24 24" className="size-4 text-[#6B7280]" {...APP_ICON} aria-hidden>
            <path d="m6 9 6 6 6-6" />
          </svg>
          <span className="ml-auto flex h-9 items-center gap-1.5 rounded-lg bg-[#1F2329] px-3.5 text-[14px] leading-none text-[#FFFFFF]">
            <svg viewBox="0 0 24 24" className="size-4" {...APP_ICON} aria-hidden>
              <path d="M12 5v14M5 12h14" />
            </svg>
            New approval item
          </span>
        </div>
        <div className="px-6 pb-5 pt-6">
          <div className="text-[26px] leading-none tracking-tight">Content approval</div>
          <div className="mt-2.5 text-[14px] leading-none text-[#6B7280]">
            All clients and companies
          </div>
        </div>
        <div className="grid grid-cols-6 border-y border-[#E5E7EB]">
          {CONTENT_COUNTS.map((c, i) => (
            <div
              key={c.label}
              className={`flex flex-col items-center gap-2 py-4 ${i === 0 ? "bg-[#F1F2F4]" : "border-l border-[#E5E7EB]"}`}
            >
              <span className="text-[20px] leading-none">{c.value}</span>
              <span className="text-[13px] leading-none text-[#6B7280]">{c.label}</span>
            </div>
          ))}
        </div>
        <div className="px-6 pt-5">
          <div className="flex items-center gap-5 text-[14px] leading-none text-[#4B5563]">
            <div className="w-[200px]">
              <AppSearch placeholder="Search…" />
            </div>
            <span>Client / company</span>
            <span>Owner</span>
            <span>Due date</span>
          </div>
          <div className={`mt-5 overflow-hidden rounded-xl border ${APP_LINE}`}>
            <div className={`${CONTENT_COLS} h-11 px-4 text-[14px] leading-none`}>
              <span>Title</span>
              <span>Client / company</span>
              <span>Owner</span>
              <span>Due</span>
              <span>Status</span>
              <span>Created</span>
            </div>
            {CONTENT_ROWS.map((r) => (
              <div
                key={r.title}
                className={`${CONTENT_COLS} h-[68px] border-t border-[#E5E7EB] px-4 text-[14px] leading-none`}
              >
                <span className="min-w-0">
                  <span className="block truncate">{r.title}</span>
                  <span className={`mt-2 inline-block rounded-full border ${APP_LINE} px-2 py-1 text-[12px] leading-none`}>
                    {r.tag}
                  </span>
                </span>
                <span className="flex min-w-0 items-center gap-2.5">
                  <span
                    className={`flex size-7 shrink-0 items-center justify-center rounded-full text-[12px] leading-none ${r.tint}`}
                  >
                    {r.initial}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate">{r.client}</span>
                    {r.company && (
                      <span className="mt-1.5 block truncate text-[13px] text-[#6B7280]">
                        {r.company}
                      </span>
                    )}
                  </span>
                </span>
                <span className="truncate">{r.owner}</span>
                <span>{r.due}</span>
                <span>
                  <span className={`rounded-md px-2 py-1.5 text-[13px] leading-none ${CONTENT_STATUS[r.status].cls}`}>
                    {CONTENT_STATUS[r.status].label}
                  </span>
                </span>
                <span className="text-[#6B7280]">{r.created}</span>
              </div>
            ))}
          </div>
        </div>
      </DesktopMock>
    </GlassCover>
  );
}

// Meeting request — a composer, not a confirmation: the empty field the client
// types their request into, with the attach control, the length they're asking
// for, and the send button on the footer row. The contact-card version showed a
// booking that had already happened, which is the end of the flow rather than
// the thing the app is for.
function CardBooking() {
  const meeting = { when: "16:00 – 18:00", title: "Launch party" };
  return (
    // The booking as the thing it produces: one event sitting on a plotted
    // ground, rather than the composer that made it. v69-cover-column is the
    // phone treatment — the row is held to the width it was drawn at and centred
    // instead of stretching across the wider frame.
    <div className="v69-cover-column v69-plot-grid v69-plot-grid--lines flex h-full items-center bg-[var(--v69-card)] p-4 [[data-theme=light]_.template-mock_&]:bg-[#f2f2f2]">
      {/* Opaque, not the glass pane the record covers use: over a dotted ground a
          translucent fill lets the field show through and the card reads as
          printed on the paper rather than lying on it. */}
      <div className="flex w-full items-stretch gap-3 overflow-hidden rounded-lg border border-black/[0.08] bg-[#FFFFFF] py-2.5 pl-2.5 pr-3 [[data-theme=dark]_&]:border-[rgba(255,255,255,0.09)] [[data-theme=dark]_&]:bg-[#303030]">
        {/* The calendar spine. Deeper than the pale brand lime in light — a
            hairline mark on a white fill has no room to be a wash — and the
            periwinkle in dark, the same pair every accent on these covers runs. */}
        <span className="w-[3px] shrink-0 rounded-full bg-[#A8C64A] [[data-theme=dark]_&]:bg-[#7DA4FF]" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] leading-none text-[var(--v69-ink)]">
            {meeting.when}
          </span>
          <span className="mt-1.5 block truncate text-[10px] leading-none text-muted-foreground">
            {meeting.title}
          </span>
        </span>
      </div>
    </div>
  );
}

// Case status page — the case board as the team sees it on desktop: a column
// per stage, and a card per case with its client, the latest note and when
// it last moved. Em dashes from the source notes are rewritten as commas.
const CASE_STAGES: {
  name: string;
  cases: { title: string; initials: string; client: string; owner: string; note: string; updated: string }[];
}[] = [
  { name: "Discovery", cases: [
    { title: "Independent contractor agreement", initials: "TA", client: "Tunde Adeyemi", owner: "JW", note: "Waiting on the scope of work and payment schedule from the client before drafting.", updated: "Updated 17d ago" },
    { title: "Employment agreement review for new hire", initials: "UC", client: "Unknown client", owner: "KF", note: "Requested the offer letter and equity grant details so the terms line up.", updated: "Updated 17d ago" },
    { title: "SEC filing review for new advisory product", initials: "BF", client: "Brightwell Financial", owner: "AR", note: "Still waiting on the updated fee schedule and risk disclosure draft.", updated: "Updated 18d ago" },
  ] },
  { name: "In Progress", cases: [
    { title: "Vendor contract redline", initials: "PR", client: "Priya Raman", owner: "UO", note: "Redlining the payment terms and SLA penalty clauses, revised draft to you soon.", updated: "Updated 19d ago" },
    { title: "DOT compliance audit ahead of Q3 fleet expansion", initials: "NL", client: "Northwind Logistics", owner: "KF", note: "Reviewed the last 12 months of driver logs, two vehicles need updated records.", updated: "Updated 19d ago" },
    { title: "Lease agreement review for new office space", initials: "CA", client: "Clara Ashford", owner: "AR", note: "Flagged three concerns in the landlord's draft lease.", updated: "Updated 21d ago" },
  ] },
  { name: "Client Review", cases: [
    { title: "SaaS terms of service redraft", initials: "TS", client: "Triyama Software", owner: "AU", note: "Sent over the redrafted terms with updated data processing sections.", updated: "Updated 17d ago" },
    { title: "Employee handbook customization", initials: "NO", client: "Nadia Osei", owner: "AU", note: "Customized handbook draft is ready, including remote work and PTO updates.", updated: "Updated 17d ago" },
    { title: "M&A due diligence for portfolio acquisition", initials: "WG", client: "Wexford Group", owner: "JW", note: "Diligence memo is over to you, two items flagged for a closer look.", updated: "Updated 17d ago" },
  ] },
  { name: "Final Approval", cases: [
    { title: "Non-disclosure agreement drafting", initials: "DO", client: "David Okonkwo", owner: "AR", note: "Mutual NDA is finalized with a 3-year confidentiality term, just needs your sign-off.", updated: "Updated 17d ago" },
    { title: "Trademark renewal for Cascade Outdoor branding", initials: "CC", client: "Cascade Outdoor Co.", owner: "JW", note: "USPTO renewal filing is drafted and ready for your sign-off.", updated: "Updated 21d ago" },
  ] },
];

function CardCaseStatus() {
  return (
    // Dark gradient in light mode, light in dark mode: every app-screen cover
    // sits on a dark ground on the light page and a light one on the dark page.
    <GlassCover
      photo="bg-[url(/images/mocks/case-status-ambient-dark.webp)] [[data-theme=dark]_&]:bg-[url(/images/mocks/case-status-ambient.webp)]"
      focus="bg-center"
      dim=""
      inset=""
      panel={false}
    >
      <DesktopMock>
        <div className="flex h-14 items-center gap-3 border-b border-[#E5E7EB] px-6 text-[15px] leading-none">
          <svg viewBox="0 0 24 24" className="size-5 text-[#4B5563]" {...APP_ICON} aria-hidden>
            <rect x="3.5" y="5" width="17" height="14" rx="2" />
            <path d="M10 5v14" />
          </svg>
          <span>Case Status</span>
          <svg viewBox="0 0 24 24" className="size-4 text-[#6B7280]" {...APP_ICON} aria-hidden>
            <path d="m6 9 6 6 6-6" />
          </svg>
          <span className="ml-auto flex h-9 items-center gap-1.5 rounded-lg bg-[#1F2329] px-3.5 text-[14px] leading-none text-[#FFFFFF]">
            <svg viewBox="0 0 24 24" className="size-4" {...APP_ICON} aria-hidden>
              <path d="M12 5v14M5 12h14" />
            </svg>
            Create case
          </span>
        </div>
        <div className="flex items-center gap-2 px-6 py-4">
          <div className="w-[200px]"><AppSearch placeholder="Search" /></div>
          {["Contact or company", "Owner"].map((f) => (
            <span key={f} className={`${APP_BOX} h-9 gap-1.5 px-3 text-[14px] leading-none text-[#374151]`}>
              {f}
              <svg viewBox="0 0 24 24" className="size-3.5" {...APP_ICON} aria-hidden><path d="m6 9 6 6 6-6" /></svg>
            </span>
          ))}
        </div>
        <div className="flex gap-3 px-6">
          {CASE_STAGES.map((st) => (
            <div key={st.name} className={`w-[290px] shrink-0 rounded-xl border ${APP_LINE} p-2`}>
              <div className="flex items-center gap-2 px-2 py-2.5 text-[14px] leading-none">
                {st.name}
                <span className="rounded bg-[#F1F2F4] px-1.5 py-0.5 text-[12px] text-[#4B5563]">{st.cases.length}</span>
              </div>
              <div className="space-y-2">
                {st.cases.map((c) => (
                  <div key={c.title} className={`rounded-lg border ${APP_LINE} bg-[#FFFFFF] px-3 py-3`}>
                    <div className="flex items-start justify-between gap-2 text-[14px] leading-snug">
                      {c.title}
                      <span className="text-[#9CA3AF]">⋮</span>
                    </div>
                    <div className="mt-2.5 flex items-center gap-2 text-[13px] leading-none text-[#4B5563]">
                      <span className="rounded bg-[#FBEDEC] px-1 py-0.5 text-[10px] text-[#A8453D]">{c.initials}</span>
                      {c.client}
                      <span className="ml-auto flex size-6 items-center justify-center rounded-full bg-[#F3ECF8] text-[10px] text-[#7A3E9D]">{c.owner}</span>
                    </div>
                    <p className="mt-2.5 line-clamp-2 text-[12px] leading-snug text-[#6B7280]">{c.note}</p>
                    <div className="mt-2.5 text-[12px] leading-none text-[#6B7280]">{c.updated}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DesktopMock>
    </GlassCover>
  );
}

// Client discussion forum — the exchange itself: a question and the answer
// coming back. A forum is two people talking, and the thread summary this used
// to draw described a conversation instead of showing one.
function CardDiscussion() {
  return (
    // v69-cover-column is the phone treatment — the pair holds the width it was
    // drawn at and centres, rather than stretching across the wider frame.
    <div className="v69-cover-column flex h-full items-center bg-[var(--v69-card)] p-4">
      {/* One child, so the phone treatment caps and centres the exchange as a
          block while the bubbles inside still hug their own text. */}
      <div className="flex w-full flex-col gap-2">
      {/* Incoming: the neutral fill, tail on the left. */}
      <div className="relative w-fit max-w-[86%] self-start">
        <div className="relative rounded-[16px] bg-[var(--v69-inner)] px-3.5 py-2.5 [[data-theme=light]_.template-mock_&]:bg-[#e6e6e6] [[data-theme=dark]_&]:bg-[#343434]">
          <span className={`block text-[13px] font-normal leading-snug text-[var(--v69-ink)] ${MOCK_UPSCALED_BODY}`}>
            Quick question on the timeline
          </span>
          <svg
            viewBox="0 0 14 14"
            className="absolute -bottom-px left-2 size-3.5 -translate-x-1/2 scale-x-[-1] text-[var(--v69-inner)] [[data-theme=light]_.template-mock_&]:text-[#e6e6e6] [[data-theme=dark]_&]:text-[#343434]"
            fill="currentColor"
            aria-hidden
          >
            <path d="M0 0h6c0 6 3 10.5 8 12.5C7.5 14.5 2 11 0 5Z" />
          </svg>
        </div>
      </div>
      {/* Outgoing: the accent, tail on the right — the same lime-in-light,
          periwinkle-in-dark pair every coloured cover in the set runs, with the
          text on the ink since both fills are light. */}
      <div className="relative w-fit max-w-[86%] self-end">
        <div className="relative rounded-[16px] px-3.5 py-2.5 [[data-theme=light]_&]:bg-[#D9ED92] [[data-theme=dark]_&]:bg-[#7DA4FF]">
          <span className={`block text-[13px] font-normal leading-snug text-[#1B1B1B] ${MOCK_UPSCALED_BODY}`}>
            Sure, ask away
          </span>
          <svg
            viewBox="0 0 14 14"
            className="absolute -bottom-px right-2 size-3.5 translate-x-1/2 [[data-theme=light]_&]:text-[#D9ED92] [[data-theme=dark]_&]:text-[#7DA4FF]"
            fill="currentColor"
            aria-hidden
          >
            <path d="M0 0h6c0 6 3 10.5 8 12.5C7.5 14.5 2 11 0 5Z" />
          </svg>
        </div>
      </div>
      <span className={`self-end pr-1 text-[11px] font-normal leading-none text-muted-foreground ${MOCK_UPSCALED_META}`}>
        Delivered
      </span>
      </div>
    </div>
  );
}

// Client resource library — the library as the team sees it on desktop: search
// and pinned items down the side, the categories with their counts, and the
// resource cards. Owners are made-up names, so no colleague's name ships on the
// public site.
const LIBRARY_PINNED = [
  "Onboarding docs for Jordan",
  "Incident response playbook",
  "Client onboarding checklist",
  "Q3 2026 pricing sheet",
  "Brand guidelines and logo pack",
];
const LIBRARY_CATEGORIES = [
  { label: "All resources", count: 22 },
  { label: "Onboarding", count: 4 },
  { label: "Templates", count: 3 },
  { label: "Brand assets", count: 2 },
  { label: "Sales", count: 3 },
  { label: "Engineering", count: 2 },
  { label: "Policies", count: 3 },
];
const LIBRARY_RESOURCES = [
  { tag: "Onboarding", title: "Onboarding docs for Jordan", desc: "Onboarding docs for Jordan", owner: "Priya Raman", initials: "PR", pinned: true },
  { tag: "Policies", title: "Incident response playbook", desc: "Approved playbook for security and uptime incidents", owner: "Neil Foster", initials: "NF", pinned: true },
  { tag: "Onboarding", title: "Client onboarding checklist", desc: "Step-by-step checklist for bringing a new client on", owner: "Maya Lin", initials: "ML", pinned: true },
  { tag: "Sales", title: "Q3 2026 pricing sheet", desc: "Current list pricing across all three tiers", owner: "Sam Ortega", initials: "SO", pinned: true },
  { tag: "Brand assets", title: "Brand guidelines and logo pack", desc: "Full logo set in SVG, PNG and EPS with usage notes", owner: "Tara Quinn", initials: "TQ", pinned: true },
  { tag: "Engineering", title: "Deployment runbook", desc: "Pre-flight checks, migration ordering and rollback", owner: "Leo Hart", initials: "LH", pinned: false },
  { tag: "Onboarding", title: "Northwind Logistics handover", desc: "Context for anyone picking up the account", owner: "Priya Raman", initials: "PR", pinned: false },
  { tag: "Templates", title: "Statement of work template", desc: "Standard SOW with scope, deliverables and terms", owner: "Ari Cole", initials: "AC", pinned: false },
  { tag: "Sales", title: "Case study: Cascade Outdoor Co.", desc: "Write-up of the Cascade Outdoor Co. rollout", owner: "Maya Lin", initials: "ML", pinned: false },
];

function PinMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M8 3h8v2l-1.5 1.5V11l3 3v1.5H13V21l-1 1-1-1v-5.5H5.5V14l3-3V6.5L7 5V3h1Z" />
    </svg>
  );
}

function CardResourceLibrary() {
  return (
    // Dark gradient in light mode, light in dark mode: every app-screen cover
    // sits on a dark ground on the light page and a light one on the dark page.
    <GlassCover
      photo="bg-[url(/images/mocks/library-ambient-dark.webp)] [[data-theme=dark]_&]:bg-[url(/images/mocks/library-ambient.webp)]"
      focus="bg-center"
      dim=""
      inset=""
      panel={false}
    >
      <DesktopMock>
        <div className="flex h-16 items-center gap-2 border-b border-[#E5E7EB] px-6">
          <span className="text-[16px] leading-none">Client resource library</span>
          <svg viewBox="0 0 24 24" className="size-4 text-[#6B7280]" {...APP_ICON} aria-hidden>
            <path d="m6 9 6 6 6-6" />
          </svg>
          <span className="ml-auto flex h-9 items-center rounded-lg bg-[#1F2329] px-3.5 text-[14px] leading-none text-[#FFFFFF]">
            Add resource
          </span>
        </div>
        <div className="border-b border-[#E5E7EB] px-6 py-3">
          <span className="inline-flex rounded-lg bg-[#F1F2F4] p-1 text-[14px] leading-none">
            <span className="rounded-md bg-[#FFFFFF] px-3 py-2">Library</span>
            <span className="px-3 py-2 text-[#6B7280]">Manage</span>
          </span>
        </div>
        <div className="flex">
          <aside className="w-[220px] shrink-0 border-r border-[#E5E7EB] px-3 pb-[400px] pt-5">
            <AppSearch placeholder="Search…" />
            <div className="mt-6 px-2 text-[13px] leading-none text-[#6B7280]">Pinned</div>
            <div className="mt-2">
              {LIBRARY_PINNED.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 px-2 py-2.5 text-[14px] leading-none text-[#4B5563]"
                >
                  <PinMark className="size-3.5 shrink-0 text-[#9CA3AF]" />
                  <span className="truncate">{item}</span>
                </div>
              ))}
            </div>
            <div className="mx-2 my-4 border-t border-[#E5E7EB]" />
            <div className="px-2 text-[13px] leading-none text-[#6B7280]">Browse</div>
            <div className="mt-2 space-y-0.5">
              {LIBRARY_CATEGORIES.map((c, i) => (
                <div
                  key={c.label}
                  className={`flex items-center justify-between rounded-md px-2 py-2.5 text-[14px] leading-none ${
                    i === 0 ? "bg-[#F1F2F4] text-[#1F2937]" : "text-[#4B5563]"
                  }`}
                >
                  {c.label}
                  <span className="text-[13px] text-[#9CA3AF]">{c.count}</span>
                </div>
              ))}
            </div>
          </aside>
          <div className="min-w-0 flex-1 px-6 pt-5">
            <span className={`flex h-11 w-[280px] items-center justify-between rounded-lg border ${APP_LINE} px-3.5 text-[14px] leading-none text-[#9CA3AF]`}>
              Filter by owner…
              <svg viewBox="0 0 24 24" className="size-4 text-[#6B7280]" {...APP_ICON} aria-hidden>
                <path d="m6 9 6 6 6-6" />
              </svg>
            </span>
            <div className="mt-6 text-[14px] leading-none text-[#4B5563]">
              All resources <span className="text-[#9CA3AF]">(22)</span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
              {LIBRARY_RESOURCES.map((r) => (
                <div key={r.title} className={`rounded-xl border ${APP_LINE} px-5 py-5`}>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full border border-[#E5E7EB] bg-[#F7F8FA] px-2.5 py-1.5 text-[12px] leading-none text-[#374151]">
                      {r.tag}
                    </span>
                    {r.pinned && <PinMark className="size-4 text-[#4B5563]" />}
                  </div>
                  <div className="mt-3.5 truncate text-[15px] leading-tight">{r.title}</div>
                  <div className="mt-2 truncate text-[13px] leading-tight text-[#6B7280]">
                    {r.desc}
                  </div>
                  <div className="mt-6 flex items-center gap-2 text-[13px] leading-none text-[#4B5563]">
                    <span className="flex size-6 items-center justify-center rounded-full bg-[#ECEEF9] text-[10px] leading-none text-[#4B55A8]">
                      {r.initials}
                    </span>
                    {r.owner}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DesktopMock>
    </GlassCover>
  );
}

// Client to-do list — the day's agenda as a titled list, built on the design
// approvals folder: a header band naming the list, then a row per task with the
// time it runs. The two are the same shape of thing — a named set with a line
// per item and one fact about each — so they're set identically rather than each
// inventing its own list. It had thumbnails in gapped rows before; at cover size
// the placeholder squares were the heaviest thing on the card and said nothing.
function CardTodo() {
  // Three rows: with the list running the whole card rather than a panel inset
  // into it, two left most of the square empty.
  const tasks = [
    { title: "Design review", time: "3:00 – 3:30 pm" },
    { title: "Client call", time: "4:00 – 6:00 pm" },
    { title: "Send recap", time: "6:15 – 6:45 pm" },
  ];
  return (
    <div className="flex h-full flex-col bg-[var(--v69-card)]">
      {/* The band, its glyph and its hairline are the approvals card's, to the
          value — see CardDesignApprovals for why neither theme inverts it. */}
      <div className="flex items-center gap-2 bg-[var(--v69-ink)] px-5 py-4 [[data-theme=light]_&]:bg-[#ebebeb] [[data-theme=light]_&]:shadow-[inset_0_-1px_0_rgba(16,24,40,0.07)] [[data-theme=dark]_&]:bg-[#343434] [[data-theme=dark]_&]:shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]">
        {/* No glyph: the word "To do" already says list, and the ticked box next
            to it was a second thing to read in a two-word band. */}
        <span
          className={`text-[13px] font-normal ${ON_INK} [[data-theme=light]_&]:text-[var(--v69-ink)] [[data-theme=dark]_&]:text-[#EDEDED]`}
        >
          To do
        </span>
      </div>
      {/* Rails on the rows rather than the wrapper, last row included — same
          reasoning as the approvals list. */}
      <div className="pt-2">
        {tasks.map((t) => (
          <div
            key={t.title}
            className="border-b px-5 py-3.5 [[data-theme=light]_&]:border-black/[0.07] [[data-theme=dark]_&]:border-[rgba(255,255,255,0.14)]"
          >
            <div className="truncate text-[13px] font-normal text-[var(--v69-ink)]">
              {t.title}
            </div>
            <div className="mt-0.5 truncate text-[11px] font-normal text-muted-foreground">
              {t.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Community Q&A — a top question with a full-width action to answer it,
// mirroring the inspiration's big-text-over-button layout. The action takes the
// brand blue in light, with the glyph and label on the card's own ink (the same
// pairing the calendar tile uses on that blue); dark keeps its ink pill, where
// the near-white ink token is already the highest-contrast surface available.
function CardCommunityQA() {
  return (
    <div className="flex h-full flex-col bg-[var(--v69-card)] p-4">
      <p className="text-[15px] font-normal leading-snug text-[var(--v69-ink)]">
        How do I reset a client&rsquo;s portal password?
      </p>
      <span className="mt-2 text-[11px] font-normal text-muted-foreground">
        3 answers · 24 upvotes
      </span>
      <div className="mt-auto flex h-10 w-full items-center justify-center gap-1.5 rounded-full bg-[#262626] text-[13px] font-normal text-white [.template-mock_&]:bg-[var(--v69-ink)] [[data-theme=light]_&]:bg-[#7DA4FF] [[data-theme=light]_&]:text-[#262626] [[data-theme=light]_.template-mock_&]:bg-[#7DA4FF]">
        <svg
          viewBox="0 0 16 16"
          className="size-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden
        >
          <path
            d="M10.5 2.5l3 3L6 13l-3 .5.5-3z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Write a response
      </div>
    </div>
  );
}

// Jargon quest — the glossary as the game it is: one term up top, the round it
// belongs to under it, and the answer the client picks as the card's one
// action. Built on the community Q&A card's composition (a statement over a
// full-width pill) because the two are the same shape of thing — a prompt and
// the one thing to do about it — but the words are this template's own: it was
// showing a support question, which is a different app.
function CardJargonQuest() {
  return (
    <div className="flex h-full flex-col bg-[var(--v69-card)] p-3">
      {/* A flat panel, the same one the proposal and composer covers use. It was
          milled into the card — the shared inset well, with its inner shadows,
          lit rim and lifted centre — which made the question read as pressed into
          the surface rather than set on it. */}
      {/* In the light gallery the panel sits a step above the shared --v69-inner
          step: the pill below it is near-black and fills a third of the cover,
          so the darker recess made the whole card read heavy for that skin. */}
      <div className="flex h-full flex-col rounded-[14px] bg-[var(--v69-inner)] p-3.5 [[data-theme=light]_.template-mock_&]:bg-[#efefef] ring-1 ring-[rgba(16,24,40,0.06)] [.template-mock_&]:ring-[rgba(16,24,40,0.10)] [[data-theme=dark]_&]:bg-[#2E2E2E] [[data-theme=dark]_&]:ring-[rgba(255,255,255,0.12)] [[data-theme=dark]_.template-mock_&]:ring-[rgba(255,255,255,0.20)]">
        {/* The round as the rail's own unit tag — same chip, mono face and caps as
            TICKETS / OPEN / DRAFT — so the one piece of metadata on this card is
            set the way metadata is set everywhere else on the rail. It leads the
            question the way an eyebrow does: the round is the frame you read the
            term inside, not a footnote to it. */}
        <span className={`self-start ${MOCK_UNIT_TAG}`} style={MOCK_MONO}>
          Round 2 of 5
        </span>
        <p className="mt-2 text-[15px] font-normal leading-snug text-[var(--v69-ink)]">
          What does &ldquo;retainer&rdquo; mean?
        </p>
        {/* On the gallery's dark face the full ink token read as a lit bar across
            the card, so the pill takes the held-back INK_SOLID step (70% ink) the
            rail's other solid CTAs use. Light runs it monochrome on the card's own
            ink, the way the site's primary button does in that skin — the brand
            periwinkle was the only hue on an otherwise neutral card and pulled
            harder than the question above it. */}
        <div className="mt-auto flex h-10 w-full items-center justify-center rounded-full bg-[#262626] text-[13px] font-normal text-white [.template-mock_&]:bg-[color-mix(in_srgb,var(--v69-ink)_70%,transparent)] [[data-theme=light]_&]:bg-[#262626] [[data-theme=light]_&]:text-[rgba(255,255,255,0.95)] [[data-theme=light]_.template-mock_&]:bg-[#3c3c3c] [[data-theme=dark]_&]:bg-[#D9ED92] [[data-theme=dark]_&]:text-[#1B1B1B] [[data-theme=dark]_.template-mock_&]:bg-[#D9ED92] [[data-theme=dark]_.template-mock_&]:text-[#1B1B1B]">
          Submit answer
        </div>
      </div>
    </div>
  );
}

// Voice AI integration — a voice-recorder widget framed as a floating glass
// panel: a top clock, a waveform, a mono timecode, and a single pill control.
// Monochrome — the inspiration's colored ambient glow and orange button become
// ink neutrals separated by brightness; the glass reads through a soft well-2
// bloom rather than hue. Nothing marks the play position but the waveform's
// own filled/unfilled split.
//
// Light frames the panel in a ramp of the card's brand blue (matching the other
// two-tone cards on this rail) with an F5F5F0 inner face; dark keeps its
// original dark ground untouched.
// Waveform geometry, in the mock's own px: bar width, gap, and the row height.
// One pitch for every bar, so spacing can't drift along the wave.
const WAVE_BAR = 2;
const WAVE_GAP = 3;
const WAVE_H = 68;
const WAVE_N = 56;
const WAVE_W = WAVE_N * (WAVE_BAR + WAVE_GAP) - WAVE_GAP;

function CardVoiceAI() {
  const N = WAVE_N;
  const playhead = 34;
  // A single low-frequency wave instead of the crossed sin*cos product — the
  // old formula swung from 26% to 98% bar-to-bar, which read as jagged,
  // choppy audio-editor detail rather than a calm playback readout. This
  // ranges a gentle 46–84%, close enough in height that no single bar jumps
  // out, so the whole thing reads as one smooth contour — tall enough now to
  // be the card's primary element rather than a strip in the middle of it.
  const bars = Array.from({ length: N }, (_, i) =>
    i >= playhead ? 14 : Math.round(46 + (Math.sin(i * 0.35) + 1) * 19),
  );
  return (
    // The card's own face in both skins. Light used to frame the panel in the
    // site's lime-to-blue brand ramp, which made this the one card in the gallery
    // wearing a full-bleed gradient — it read as a different set from the covers
    // either side of it.
    <div className="relative flex h-full bg-[var(--v69-card)] p-3 [[data-theme=light]_.template-mock_&]:bg-[#f2f2f2]">
      <div
        // A plain opaque face, carried by its fill alone. It was a pane of glass
        // on both skins — translucent over the ramp with a lit top lip, an inward
        // shadow and an outer falloff in light; a specular band, a vertical
        // light-to-shade fall and refracted lips down the edges in dark.
        // Light steps up to #fafafa now that the ramp is gone: at #F7F7F3 on the
        // gallery's #F5F5F0 face the panel had nothing left to separate it, and
        // the edge is a value step here rather than an outline.
        // Radius matched to the gallery frame's own (14px) rather than the 20 it
        // had: sitting inside the card's inset, a rounder corner than the frame's
        // read as a second, softer card laid on the first.
        className={`relative flex flex-1 flex-col overflow-hidden rounded-[14px] bg-[var(--v69-well)] px-4 pb-4 pt-3 [[data-theme=light]_&]:bg-[#fafafa] [[data-theme=dark]_&]:bg-[#2E2E2E]`}
      >
        {/* Bars fade out at the trailing edge only (mask, not a gradient
            overlay, so it works regardless of what's behind) — reads as a
            continuous waveform trailing off, the way playback UIs do it. The
            left edge stays fully opaque: the start of a recording isn't
            trailing off, and any ramp there just dimmed the first bars. */}
        <div
          // Cancels the panel's px-4 exactly, so the first bar starts flush with
          // the recessed face's edge. Any inset here read as a gutter, since the
          // trailing edge has no padding of its own to balance it.
          className="relative -ml-4 mt-8 flex h-[68px] items-center gap-[3px]"
          style={{
            WebkitMaskImage:
              "linear-gradient(90deg, #000 0%, #000 92%, transparent 100%)",
            maskImage:
              "linear-gradient(90deg, #000 0%, #000 92%, transparent 100%)",
          }}
        >
          {/* Nothing sits behind the bars: the trough that used to recess them
              read as a soft halo at this size and competed with the waveform,
              which is the card's primary element. */}
          {/* One SVG rather than 56 divs: the mocks render at a fixed size and
              are scaled by a fractional factor, and Chrome pixel-snaps element
              boxes, so some bars rounded to 2px and others to 1px. SVG geometry
              antialiases instead, so every bar keeps the same width and pitch
              and only height and fill vary. */}
          <svg
            width={WAVE_W}
            height={WAVE_H}
            viewBox={`0 0 ${WAVE_W} ${WAVE_H}`}
            aria-hidden
            className="block shrink-0"
          >
            {bars.map((h, i) => {
              // The bar sitting on the panel's edge is dropped, so the wave starts
              // a pitch in. Flush, it read as a rule down the side of the panel
              // rather than as the first sample of the recording. The rest keep
              // their own x, so nothing shifts to fill the space.
              if (i === 0) return null;
              const barH = (WAVE_H * h) / 100;
              return (
                <rect
                  key={i}
                  x={i * (WAVE_BAR + WAVE_GAP)}
                  y={(WAVE_H - barH) / 2}
                  width={WAVE_BAR}
                  height={barH}
                  rx={WAVE_BAR / 2}
                  fill={i < playhead ? INK_MID : ink(10)}
                />
              );
            })}
          </svg>
        </div>

        {/* No playhead marker at all — the bars' own filled/unfilled split is
            what marks the play position, so a knob on top of it was duplicate
            chrome sitting in the middle of an otherwise calm waveform. */}

        <div className="relative mt-auto flex items-center justify-center">
          {/* Light holds the timecode and the glyph back off full ink. At #262626
              on a near-white panel they were the two darkest marks on the card and
              took the eye before the waveform, which is what the cover is of. */}
          <span className="text-[19px] leading-none tabular-nums text-[var(--v69-ink)] [[data-theme=light]_&]:text-[#4E4F46]">
            00:17:56
          </span>
        </div>

        <div className="relative mt-4 flex justify-center max-sm:[.template-mock-gallery_&]:mt-2">
          {/* Dark takes the brand lime, so the card's one control is the one
              thing that carries colour against the neutral face. The glyph
              flips to the dark ground there — near-white bars on lime had no
              contrast left. Flat fill, no ramp or lip: the moulded treatment
              read as a 3D button against an otherwise matte panel. */}
          {/* Light is a flat white pill behind the shared hairline — it carried a
              lit top edge and a blur behind it, which is the same glass treatment
              the panel has dropped. On the panel's near-white face the fill alone
              isn't a step, so the edge does the work here. */}
          {/* Steps down on the phone frame: the control is fixed px on a panel
              that shrinks with the frame, so at full size it filled the foot of
              the card and sat on its bottom edge. */}
          <div className="flex h-9 w-28 items-center justify-center rounded-full bg-[var(--v69-card)] max-sm:[.template-mock-gallery_&]:h-7 max-sm:[.template-mock-gallery_&]:w-20 [[data-theme=light]_&]:bg-[#FFFFFF] [[data-theme=light]_&]:ring-1 [[data-theme=light]_&]:ring-[rgba(16,24,40,0.08)] [[data-theme=dark]_&]:bg-[#D9ED92]">
            {/* One SVG rather than two divs: the gallery scales these mocks by a
                fractional factor, and Chrome pixel-snaps element boxes, so the
                two bars rounded to different widths. SVG geometry antialiases
                instead of snapping, so both bars keep the same weight. */}
            <svg
              width="12"
              height="14"
              viewBox="0 0 12 14"
              fill="currentColor"
              aria-hidden
              className="text-[var(--v69-ink)] [[data-theme=light]_&]:text-[#4E4F46] [[data-theme=dark]_&]:text-[#1B1B1B]"
            >
              <rect x="0" y="0" width="3" height="14" rx="1.5" />
              <rect x="9" y="0" width="3" height="14" rx="1.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

// Deliverable progress — a goals stat: a header, an inner panel with an add
// control, a big count, and a delta pill. Monochrome — the inspiration's green
// tint and accent blob become neutral grays.
//
// The resource library runs the same widget with its own copy: it is the same
// shape of thing (a collection you add to, counted over a period), so it reads
// as a sibling rather than a second invention.
function CardDeliverable({
  heading = "Deliverables",
  label = "Completed this week",
  value = "12/16",
  delta = "+3",
}: {
  heading?: string;
  // null on both drops the stat block, leaving the panel as plain artwork.
  label?: string | null;
  value?: string | null;
  // null drops the pill entirely — the resource library counts guides read, which
  // has no week-on-week delta worth showing.
  delta?: string | null;
} = {}) {
  return (
    <div className="flex h-full flex-col bg-[var(--v69-card)] p-3">
      <div className="flex items-center gap-2 px-1 pb-2.5 pt-1">
        <span className="text-[13px] font-normal text-[var(--v69-ink)]">
          {heading}
        </span>
      </div>
      {/* The panel runs the shared brand wash — the same lime-into-periwinkle ramp
          the client-calendar tile is built on — in both themes, so the two covers
          read as the same material. The tokens the panel's contents draw from are
          pinned: the caption in both themes, since the shared muted grey is a
          mid-tone and so is the periwinkle it sits on, and ink, card and well in
          dark, where near-white type has nothing left to hold on a colour. The
          neutral bloom that used to sit in the bottom corner is gone with the flat
          fill it was there to lift; over a ramp it read as a smudge. */}
      <div
        className="relative flex flex-1 flex-col justify-end overflow-hidden rounded-2xl p-3.5 [--muted-foreground:#3F444C] [[data-theme=dark]_&]:[--v69-card:#f5f5f5] [[data-theme=dark]_&]:[--v69-ink:#262626] [[data-theme=dark]_&]:[--v69-well:#f5f5f5]"
        // Sprayed, like the case-status cover, but on its own artwork: the panel
        // is one long blend rather than stacked bands, so it takes the coarse
        // two-hue spatter (spray-panel.svg) instead of the cover's fine dust.
        // The spray has no ground, so the wash under it still supplies the
        // lime-to-periwinkle direction and shows through between the specks.
        style={{
          background: `url("/images/spray-panel.svg") center / cover no-repeat, ${brandWash(0)}`,
        }}
      >
        <span className="absolute right-3 top-3 flex size-7 items-center justify-center rounded-full bg-[var(--v69-ink)] text-[var(--v69-well)]">
          <svg
            viewBox="0 0 16 16"
            className="size-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden
          >
            <path d="M8 3v10M3 8h10" strokeLinecap="round" />
          </svg>
        </span>
        {label ? (
          <span className="relative text-[11px] font-normal text-muted-foreground">
            {label}
          </span>
        ) : null}
        {value ? (
          <div className="relative mt-1 flex items-end gap-2">
            <span className="text-[34px] font-normal leading-none tracking-tight tabular-nums text-[var(--v69-ink)]">
              {value}
            </span>
            {delta ? (
              <span className="mb-1 rounded-full bg-[var(--v69-card)] px-2 py-0.5 text-[11px] font-normal text-[var(--v69-ink)]">
                {delta}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

// Helpdesk — an article being written, not a list of them. The app's own screen
// is an editor, and the empty body under a filled title is what it looks like.
function CardHelpdesk() {
  return (
    <div className="flex h-full items-stretch bg-[var(--v69-card)] p-4 [[data-theme=light]_.template-mock_&]:bg-[#f2f2f2]">
      <span className="flex w-full flex-col overflow-hidden rounded-xl border border-black/[0.08] bg-[#FFFFFF] [[data-theme=dark]_&]:border-[rgba(255,255,255,0.09)] [[data-theme=dark]_&]:bg-[#303030]">
        <span className="flex items-center px-3 py-2.5">
          <span className="min-w-0 flex-1 truncate text-[13px] leading-none text-[var(--v69-ink)] max-sm:[.template-mock-gallery_&]:text-[12px]">
            Welcome to the portal
          </span>
        </span>
        <span className="flex flex-1 items-start border-t border-black/[0.07] px-3 pt-2.5 [[data-theme=dark]_&]:border-[rgba(255,255,255,0.16)]">
          <span className="mr-px block h-3.5 w-px shrink-0 bg-[var(--v69-ink)]" aria-hidden />
          <span className="text-[12px] leading-none text-muted-foreground max-sm:[.template-mock-gallery_&]:text-[11px]">
            Add more information
          </span>
        </span>
      </span>
    </div>
  );
}

// Tasks — the task list as the team sees it on desktop: tasks grouped by
// status, with due dates and who owns each. Initials stand in for the
// people's photos.
const TASK_GROUPS: {
  name: string;
  tint: string;
  rows: { title: string; due?: string; who: string; sub?: boolean; state: "todo" | "progress" | "done" }[];
}[] = [
  {
    name: "Todo",
    tint: "bg-[#F7F8FA]",
    rows: [
      { title: "Organize onboarding checklist", due: "Apr 15", who: "ML", state: "todo" },
      { title: "Share design files", due: "Apr 22", who: "SO", state: "todo" },
      { title: "Attach the payment details to the project", who: "SO", sub: true, state: "todo" },
      { title: "Distribute the findings from the market analysis", who: "SO", sub: true, state: "done" },
      { title: "Create client intake form", due: "Apr 5", who: "TQ", state: "todo" },
      { title: "Upload past case studies", due: "Apr 12", who: "LH", state: "todo" },
    ],
  },
  {
    name: "In progress",
    tint: "bg-[#FBF6F1]",
    rows: [
      { title: "Set up design system folder", due: "Apr 4", who: "ML", state: "progress" },
      { title: "Share market research", due: "Apr 4", who: "AC", state: "progress" },
    ],
  },
];

function TaskMark({ state }: { state: "todo" | "progress" | "done" }) {
  if (state === "done")
    return (
      <span className="flex size-[18px] shrink-0 items-center justify-center rounded-full bg-[#1E7A44] text-[#FFFFFF]">
        <svg viewBox="0 0 24 24" className="size-3" {...APP_ICON} strokeWidth={3} aria-hidden>
          <path d="m5 12 5 5 9-10" />
        </svg>
      </span>
    );
  if (state === "progress")
    return (
      <svg viewBox="0 0 20 20" className="size-[18px] shrink-0" aria-hidden>
        <circle cx="10" cy="10" r="8.25" fill="none" stroke="#9B2C2C" strokeWidth="1.5" />
        <path d="M10 4.5a5.5 5.5 0 0 0 0 11z" fill="#9B2C2C" />
      </svg>
    );
  return <span className="size-[18px] shrink-0 rounded-full border-[1.5px] border-[#9CA3AF]" />;
}

function CardTasks() {
  return (
    // Dark gradient in light mode, light in dark mode: every app-screen cover
    // sits on a dark ground on the light page and a light one on the dark page.
    <GlassCover
      photo="bg-[url(/images/mocks/tasks-ambient-dark.webp)] [[data-theme=dark]_&]:bg-[url(/images/mocks/tasks-ambient.webp)]"
      focus="bg-center"
      dim=""
      inset=""
      panel={false}
    >
      <DesktopMock>
        <div className="flex h-14 items-center gap-3 border-b border-[#E5E7EB] px-6 text-[15px] leading-none">
          <span>Tasks</span>
          <span className={`${APP_BOX} ml-auto size-9 text-[16px] leading-none`}>···</span>
          <span className="flex h-9 items-center gap-1.5 rounded-lg bg-[#1F2329] px-3.5 text-[14px] leading-none text-[#FFFFFF]">
            <svg viewBox="0 0 24 24" className="size-4" {...APP_ICON} aria-hidden>
              <path d="M12 5v14M5 12h14" />
            </svg>
            Create task
          </span>
        </div>
        <div className="flex gap-6 border-b border-[#E5E7EB] px-6 text-[14px] leading-none">
          {["My tasks", "Team tasks", "All tasks"].map((t) => (
            <span
              key={t}
              className={`py-4 ${t === "All tasks" ? "border-b-2 border-[#1F2937]" : "text-[#6B7280]"}`}
            >
              {t}
            </span>
          ))}
        </div>
        <div className="px-6 py-3">
          <span className={`${APP_BOX} w-fit h-9 gap-1.5 px-3 text-[14px] leading-none text-[#374151]`}>
              <svg viewBox="0 0 24 24" className="size-3.5" {...APP_ICON} aria-hidden><path d="M4 7h16M7 12h10M10 17h4" /></svg>
              Filters
            </span>
        </div>
        {TASK_GROUPS.map((g) => (
          <div key={g.name}>
            <div className={`flex h-10 items-center gap-2 px-6 text-[14px] leading-none ${g.tint}`}>
              {g.name}
              <span className="text-[#6B7280]">{g.rows.length}</span>
            </div>
            {g.rows.map((r) => (
              <div key={r.title} className={`flex h-12 items-center gap-3 pr-6 text-[14px] leading-none ${r.sub ? "pl-14" : "pl-6"}`}>
                <TaskMark state={r.state} />
                <span className="min-w-0 flex-1 truncate">{r.title}</span>
                {r.due && <span className="text-[13px] text-[#6B7280]">{r.due}</span>}
                <span className="flex size-7 items-center justify-center rounded-full bg-[#ECEEF9] text-[10px] leading-none text-[#4B55A8]">
                  {r.who}
                </span>
              </div>
            ))}
          </div>
        ))}
      </DesktopMock>
    </GlassCover>
  );
}

// Payments — billing as the team sees it on desktop: what is paid and unpaid,
// the balance, and the ways to collect from a contact.
const PAYMENT_TABS = ["Overview", "Invoices", "Subscriptions", "Store", "Payment links", "Services"];

function CardPayments() {
  return (
    // Dark gradient in light mode, light in dark mode: every app-screen cover
    // sits on a dark ground on the light page and a light one on the dark page.
    <GlassCover
      photo="bg-[url(/images/mocks/payments-ambient-dark.webp)] [[data-theme=dark]_&]:bg-[url(/images/mocks/payments-ambient.webp)]"
      focus="bg-center"
      dim=""
      inset=""
      panel={false}
    >
      <DesktopMock>
        <div className="flex h-14 items-center gap-2 border-b border-[#E5E7EB] px-6 text-[15px] leading-none">
          Billing
          <svg viewBox="0 0 24 24" className="size-4 text-[#6B7280]" {...APP_ICON} aria-hidden>
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
        <div className="flex gap-7 border-b border-[#E5E7EB] px-6 text-[14px] leading-none">
          {PAYMENT_TABS.map((t, i) => (
            <span
              key={t}
              className={`py-4 ${i === 0 ? "border-b-2 border-[#1F2937]" : "text-[#6B7280]"}`}
            >
              {t}
            </span>
          ))}
        </div>
        <div className="w-[760px] px-6 pt-5">
          <span className={`${APP_BOX} w-fit h-9 gap-2 px-3 text-[14px] leading-none text-[#1F2937]`}>
            <svg viewBox="0 0 24 24" className="size-4" {...APP_ICON} aria-hidden>
              <rect x="4" y="5" width="16" height="15" rx="2" />
              <path d="M4 10h16M9 3v4M15 3v4" />
            </svg>
            Last 30 days
          </span>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {[
              { label: "Not paid", value: "$3,250.00", tag: "1 open invoice", cls: "bg-[#E6EEFC] text-[#2F5BB7]" },
              { label: "Paid", value: "$5,750.00", tag: "1 paid invoice", cls: "bg-[#E3F6E9] text-[#1E7A44]" },
            ].map((c) => (
              <div key={c.label} className={`rounded-xl border ${APP_LINE} px-5 py-5`}>
                <div className="text-[14px] leading-none">{c.label}</div>
                <div className="mt-3 text-[24px] leading-none tracking-tight">{c.value}</div>
                <span className={`mt-4 inline-block rounded-full px-3 py-1.5 text-[13px] leading-none ${c.cls}`}>
                  {c.tag}
                </span>
              </div>
            ))}
          </div>
          <div className={`mt-3 rounded-xl border ${APP_LINE} px-5 py-5`}>
            <div className="text-[14px] leading-none">Total balance</div>
            <div className="mt-3 text-[24px] leading-none tracking-tight">$0.00</div>
            <div className="mt-4 text-[14px] leading-none text-[#2F5BB7]">Open Stripe Dashboard ↗</div>
          </div>
          <div className={`mt-3 rounded-xl border ${APP_LINE} px-5 py-5`}>
            <div className="text-[15px] leading-none">Collect payments from specific contacts</div>
            <div className="mt-2.5 text-[13px] leading-none text-[#6B7280]">
              Bill a contact or company via invoice or recurring subscriptions.
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                { t: "Send invoices for one-off services", a: "Create invoice →" },
                { t: "Set up recurring payments", a: "Create subscription →" },
              ].map((c) => (
                <div key={c.t} className={`flex items-center gap-3 rounded-xl border ${APP_LINE} px-3 py-3`}>
                  <span className={`${APP_BOX} size-10 text-[#374151]`}>
                    <svg viewBox="0 0 24 24" className="size-[18px]" {...APP_ICON} aria-hidden>
                      <path d="M7 3h7l4 4v14H7z" />
                      <path d="M14 3v4h4M12 11v6M10 13h3.5a1.5 1.5 0 0 1 0 3H10" />
                    </svg>
                  </span>
                  <span className="text-[13px] leading-none">
                    <span className="block">{c.t}</span>
                    <span className="mt-2 block text-[#2F5BB7]">{c.a}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DesktopMock>
    </GlassCover>
  );
}

// Contracts — the signed agreement as the client sees it on desktop: the
// document itself on a page, with the firm's header and the opening clauses.
// The firm and client are made-up names.
const CONTRACT_CLAUSES = [
  { title: "1. Services", body: "Company shall provide Client with accounting, bookkeeping, and advisory services as described in the scope of work attached hereto or otherwise agreed in writing by the Parties." },
  { title: "2. Term", body: "This Agreement shall commence on the Effective Date and shall continue for a period of one year, unless terminated earlier in accordance with Section 5." },
  { title: "3. Fees and Payment", body: "Client shall pay Company a fee of $400 for the Services, payable net 30. Invoices are due within thirty days of receipt." },
];

function CardContract() {
  return (
    // Dark gradient in light mode, light in dark mode: every app-screen cover
    // sits on a dark ground on the light page and a light one on the dark page.
    <GlassCover
      photo="bg-[url(/images/mocks/contracts-ambient-dark.webp)] [[data-theme=dark]_&]:bg-[url(/images/mocks/contracts-ambient.webp)]"
      focus="bg-center"
      dim=""
      inset=""
      panel={false}
    >
      <DesktopMock>
        <div className="flex h-14 items-center gap-3 border-b border-[#E5E7EB] px-6 text-[15px] leading-none">
          <svg viewBox="0 0 24 24" className="size-5 text-[#4B5563]" {...APP_ICON} aria-hidden>
            <rect x="3.5" y="5" width="17" height="14" rx="2" />
            <path d="M10 5v14" />
          </svg>
          <span className="text-[#6B7280]">Contracts</span>
          <svg viewBox="0 0 24 24" className="size-3.5 text-[#9CA3AF]" {...APP_ICON} aria-hidden>
            <path d="m9 6 6 6-6 6" />
          </svg>
          <span>Service Agreement</span>
          <span className={`${APP_BOX} ml-auto h-9 gap-2 px-3.5 text-[14px] leading-none text-[#1F2937]`}>
            <svg viewBox="0 0 24 24" className="size-4" {...APP_ICON} aria-hidden>
              <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
            </svg>
            Download
          </span>
        </div>
        <div className="bg-[#F7F8FA] px-10 pt-8">
          <div className="w-[620px] rounded-t-md bg-[#FFFFFF] px-14 pb-10 pt-12 shadow-[0_1px_3px_rgba(16,24,40,0.08)]">
            <div className="bg-[#EFEBE5] py-2 text-center text-[20px] font-medium leading-none tracking-tight">
              The Walsh Group
            </div>
            <div className="mt-2 text-center text-[10px] leading-none text-[#6B7280]">
              Accounting &amp; advisory services
            </div>
            <div className="mt-3 border-t border-[#1F2937]" />
            <div className="mt-6 text-center text-[15px] font-medium leading-none">
              Professional services agreement
            </div>
            <p className="mt-5 text-[12px] leading-[1.6] text-[#374151]">
              This Professional Services Agreement is entered into as of{" "}
              <span className="border-b border-[#1F2937] px-1">07/14/2026</span> by and between{" "}
              <span className="font-medium">The Walsh Group</span> and{" "}
              <span className="border-b border-[#1F2937] px-1">Adrian Chen</span>, together the
              Parties.
            </p>
            {CONTRACT_CLAUSES.map((c) => (
              <div key={c.title} className="mt-5">
                <div className="text-[13px] font-medium leading-none">{c.title}</div>
                <p className="mt-2 text-[12px] leading-[1.6] text-[#374151]">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </DesktopMock>
    </GlassCover>
  );
}
// Data room — the shares list as the team sees it on desktop: the two counts,
// the filters, and the shares grouped by folder with each one's status.
const DATA_ROOM_STATUS = {
  active: "bg-[#E3F6E9] text-[#1E7A44]",
  revoked: "bg-[#FDECEC] text-[#B42318]",
  archived: "bg-[#FDF3D7] text-[#8A5A00]",
} as const;
const DATA_ROOM_GROUPS: {
  name: string;
  rows: {
    initials: string;
    name: string;
    file: string;
    status: keyof typeof DATA_ROOM_STATUS;
    by: string;
    date: string;
    tint: string;
  }[];
}[] = [
  {
    name: "Financials",
    rows: [
      { initials: "TA", name: "Tunde Adeyemi", file: "FY26 budget model", status: "revoked", by: "Sarah Cadet", date: "Aug 11, 2026", tint: "bg-[#FBEDEC] text-[#A8453D]" },
      { initials: "MC", name: "Marcus Chen", file: "Q2 2026 financial statements", status: "active", by: "Sarah Cadet", date: "Aug 9, 2026", tint: "bg-[#FBEDEC] text-[#A8453D]" },
      { initials: "SL", name: "Sarah Lindqvist", file: "Q3 financial statements", status: "active", by: "Sarah Cadet", date: "Aug 9, 2026", tint: "bg-[#F3ECF8] text-[#7A3E9D]" },
      { initials: "NL", name: "Northwind Logistics", file: "Q2 2026 financial statements", status: "active", by: "Sarah Cadet", date: "Aug 9, 2026", tint: "bg-[#E8F4F0] text-[#2F7A64]" },
      { initials: "DO", name: "David Okonkwo", file: "October invoice", status: "active", by: "Sarah Cadet", date: "Aug 8, 2026", tint: "bg-[#FBEDEC] text-[#A8453D]" },
      { initials: "WG", name: "Wexford Group", file: "Q3 financial statements", status: "revoked", by: "Sarah Cadet", date: "Aug 2, 2026", tint: "bg-[#E8F4F0] text-[#2F7A64]" },
    ],
  },
  {
    name: "Legal",
    rows: [
      { initials: "TS", name: "Triyama Software", file: "SOC 2 Type II report", status: "active", by: "Sean Walsh", date: "Aug 10, 2026", tint: "bg-[#ECEEF9] text-[#4B55A8]" },
      { initials: "RR", name: "Rocket Rides", file: "Mutual NDA", status: "active", by: "Vivienne Chen", date: "Jul 29, 2026", tint: "bg-[#FBEDEC] text-[#A8453D]" },
    ],
  },
];
const DATA_ROOM_COLS =
  "grid grid-cols-[18px_1.5fr_1.7fr_0.8fr_1fr_0.9fr] items-center gap-4";

function CardDataRoom() {
  return (
    // Dark gradient in light mode, light in dark mode: every app-screen cover
    // sits on a dark ground on the light page and a light one on the dark page.
    <GlassCover
      photo="bg-[url(/images/mocks/data-room-ambient-dark.webp)] [[data-theme=dark]_&]:bg-[url(/images/mocks/data-room-ambient.webp)]"
      focus="bg-center"
      dim=""
      inset=""
      panel={false}
    >
      <DesktopMock>
        <div className="flex h-16 items-center gap-2 border-b border-[#E5E7EB] px-6">
          <span className="text-[16px] leading-none">Data Room</span>
          <svg viewBox="0 0 24 24" className="size-4 text-[#6B7280]" {...APP_ICON} aria-hidden>
            <path d="m6 9 6 6 6-6" />
          </svg>
          <span className="ml-auto flex h-9 items-center gap-1.5 rounded-lg bg-[#1F2329] px-3.5 text-[14px] leading-none text-[#FFFFFF]">
            <svg viewBox="0 0 24 24" className="size-4" {...APP_ICON} aria-hidden>
              <path d="M12 5v14M5 12h14" />
            </svg>
            Share files
          </span>
          <span className={`${APP_BOX} size-9 text-[16px] leading-none`}>···</span>
        </div>
        <div className="px-6 pt-5">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Active shares", value: 12 },
              { label: "Revoked shares", value: 11 },
            ].map((stat) => (
              <div key={stat.label} className={`rounded-xl border ${APP_LINE} px-5 py-4`}>
                <div className="text-[14px] leading-none text-[#6B7280]">{stat.label}</div>
                <div className="mt-3 text-[30px] font-medium leading-none tracking-tight">
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2.5 text-[14px] leading-none">
            <span className={`flex h-10 w-[250px] items-center justify-between gap-2 rounded-lg border ${APP_LINE} px-3.5 text-[#9CA3AF]`}>
              <span className="truncate">Filter by contact or company…</span>
              <svg viewBox="0 0 24 24" className="size-4 text-[#6B7280]" {...APP_ICON} aria-hidden>
                <path d="m6 9 6 6 6-6" />
              </svg>
            </span>
            <span className={`flex h-10 w-[140px] items-center justify-between rounded-lg border ${APP_LINE} px-3.5`}>
              All statuses
              <svg viewBox="0 0 24 24" className="size-4 text-[#6B7280]" {...APP_ICON} aria-hidden>
                <path d="m6 9 6 6 6-6" />
              </svg>
            </span>
            <span className={`flex h-10 flex-1 items-center rounded-lg border ${APP_LINE} px-3.5 text-[#9CA3AF]`}>
              Search file titles…
            </span>
            <span className={`${APP_BOX} h-10 gap-2 px-3.5 text-[#1F2937]`}>
              <svg viewBox="0 0 24 24" className="size-4" {...APP_ICON} aria-hidden>
                <rect x="4" y="5" width="16" height="15" rx="2" />
                <path d="M4 10h16M9 3v4M15 3v4" />
              </svg>
              Shared date
            </span>
          </div>
          <span className="mt-4 inline-flex rounded-lg bg-[#F1F2F4] p-1 text-[14px] leading-none">
            <span className="rounded-md bg-[#FFFFFF] px-3 py-2">Shares</span>
            <span className="px-3 py-2 text-[#6B7280]">Recent activity</span>
          </span>
          <div className={`mt-4 overflow-hidden rounded-xl border ${APP_LINE}`}>
            <div className={`${DATA_ROOM_COLS} h-11 px-4 text-[14px] leading-none`}>
              <span className={`size-[18px] rounded border ${APP_LINE}`} />
              <span>Recipient</span>
              <span>File</span>
              <span>Status</span>
              <span>Shared by</span>
              <span>Shared</span>
            </div>
            {DATA_ROOM_GROUPS.map((group) => (
              <div key={group.name}>
                <div className="flex h-10 items-center gap-2 border-t border-[#E5E7EB] bg-[#F7F8FA] px-4 text-[13px] leading-none text-[#6B7280]">
                  {group.name}
                  <span>{group.rows.length}</span>
                </div>
                {group.rows.map((row) => (
                  <div
                    key={`${row.name}-${row.file}`}
                    className={`${DATA_ROOM_COLS} h-12 border-t border-[#E5E7EB] px-4 text-[14px] leading-none`}
                  >
                    <span className={`size-[18px] rounded border ${APP_LINE}`} />
                    <span className="flex min-w-0 items-center gap-2.5">
                      <span
                        className={`flex size-7 shrink-0 items-center justify-center rounded-full text-[11px] leading-none ${row.tint}`}
                      >
                        {row.initials}
                      </span>
                      <span className="truncate">{row.name}</span>
                    </span>
                    <span className="truncate">{row.file}</span>
                    <span>
                      <span
                        className={`rounded-full px-2.5 py-1.5 text-[12px] capitalize leading-none ${DATA_ROOM_STATUS[row.status]}`}
                      >
                        {row.status}
                      </span>
                    </span>
                    <span className="truncate text-[#6B7280]">{row.by}</span>
                    <span className="text-[#6B7280]">{row.date}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </DesktopMock>
    </GlassCover>
  );
}

// The percentage columns the data room used to carry, now against the thing they
// actually measure: hours burned on each client's retainer. Two clients, not the
// six the plotted chart showed — at cover size a figure you can read beats a
// chart you can only squint at.
const RETAINER_COLUMNS = [
  { label: "NC", value: 71, maxHeightPct: 62, pattern: false },
  { label: "RH", value: 88, maxHeightPct: 100, pattern: true },
];

function CardRetainerColumns() {
  const [play, setPlay] = useState(0);
  const inViewRef = useInViewReplay(() => setPlay((p) => p + 1));
  const bars = RETAINER_COLUMNS;
  return (
    <div
      ref={inViewRef}
      onMouseEnter={(e) => {
        if (e.currentTarget.closest(".template-mock")) return;
        setPlay((p) => p + 1);
      }}
      onMouseLeave={() => setPlay(0)}
      // The brand lime face in BOTH themes, with the columns the same pale wash
      // the help-desk rows use on it (white at 60% over the lime) — mixed rather
      // than hand-picked so the two cards can't drift apart. Both --v69-inner
      // and --v69-card are re-pointed because EngagementBar fills from
      // --v69-inner on the hero rail but from --v69-card inside .template-mock;
      // the face itself is set explicitly, so re-pointing the token only reaches
      // the columns. No hairline on the columns: the pale wash is already a clear
      // step off the lime.
      // Dark drops the saturated face entirely. Running the light treatment there
      // — a periwinkle field with pale columns and the text tokens pinned back to
      // their light values — made this the one card in the gallery that stayed a
      // block of colour on a near-black page. It now takes the neutral card face
      // every other cover uses, with the columns a step up from it behind the
      // shared hairline and nothing cast under them — a drop shadow on a column
      // that stands ON the baseline reads as the bar floating off the chart.
      // Ink and the muted grey are still pinned in dark, now to their LIGHT-on-
      // dark values: the templates detail page renders these mocks without the
      // .v72-mock-dark skin, so --v69-ink there is still the light-mode near-black
      // and the labels would sit dark-on-dark.
      className="flex h-full flex-col bg-[#D9ED92] p-3.5 [--v69-card:color-mix(in_srgb,#ffffff_60%,#D9ED92)] [--v69-inner:color-mix(in_srgb,#ffffff_60%,#D9ED92)] [&_[data-slot=engagement-bar]]:border-0 [[data-theme=dark]_&]:bg-[#262626] [[data-theme=dark]_&]:[--muted-foreground:#8F8F8F] [[data-theme=dark]_&]:[--v69-ink:#F2F2F2] [[data-theme=dark]_&_[data-slot=engagement-bar]]:border [[data-theme=dark]_&_[data-slot=engagement-bar]]:border-[rgba(255,255,255,0.12)] [[data-theme=dark]_.template-mock_&_[data-slot=engagement-bar]]:border-[rgba(255,255,255,0.20)] [[data-theme=dark]_&_[data-slot=engagement-bar]]:bg-[#323232]"
    >
      <div className="flex flex-1 items-end gap-2.5">
        {bars.map((b, i) => (
          <EngagementBar
            key={b.label}
            label={b.label}
            value={b.value}
            maxHeightPct={b.maxHeightPct}
            delayMs={i * 550}
            play={play}
            pattern={b.pattern}
            compact={false}
          />
        ))}
      </div>
    </div>
  );
}

// Progress tracker — a timeline ruler with the marker at today. A ring said "7
// of 12" and nothing about WHEN; a dated axis is what a tracker is actually for,
// and the marker gives it the one fact a client checks.
const TRACK_MONTHS = ["May", "Jun", "Jul", "Aug"];
const TRACK_TICKS = 44;
// The marker stands in the place of a tick rather than beside one. At this pitch
// the ticks are ~5px apart on the cover, so any free position left the marker a
// couple of pixels off a rule and the two read as a printing error — worst at 57%,
// which landed right beside one of the full-height ticks. It now takes a tick's
// own slot and that tick is dropped, so the axis stays evenly ruled and the
// marker is the only thing in its column.
// Just past the middle, so it has run of the axis on both sides rather than
// splitting it in half. A half-height slot, not a full one: the taller rules are
// the axis's own counting marks and shouldn't go missing.
const TRACK_MARK_INDEX = 25;
const TRACK_MARK_PCT = (TRACK_MARK_INDEX / (TRACK_TICKS - 1)) * 100;

function CardProgressTracker() {
  return (
    // v69-cover-column is the phone treatment: the ruler holds the width it was
    // drawn at and centres, and the frame scales up around it.
    <div className="v69-cover-column flex h-full items-center bg-[var(--v69-card)] p-4 [[data-theme=light]_.template-mock_&]:bg-[#f2f2f2]">
      <div className="relative w-full">
        {/* The axis. Every fourth tick runs full height, the rest half — the
            same rhythm a ruler uses to make a span countable at a glance. */}
        <div className="flex h-6 items-end justify-between">
          {Array.from({ length: TRACK_TICKS }, (_, i) => (
            <span
              key={i}
              className={`w-px rounded-full ${
                i === TRACK_MARK_INDEX
                  ? "bg-transparent"
                  : "bg-[var(--v69-ink)]/25"
              } ${i % 4 === 0 ? "h-6" : "h-3"}`}
            />
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[10px] leading-none text-muted-foreground">
          {TRACK_MONTHS.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
        {/* The marker: a handle at the head of a full-height line, so it reads as
            something set on the axis rather than drawn into it. Periwinkle in
            light and lime in dark — whichever of the brand pair holds against
            the face.
            Both halves take the SAME left and centre themselves on it. The handle
            used to subtract half its own width instead, which centred it on the
            line's left edge rather than its middle — half a design pixel, but the
            covers scale up, so it read as a handle sitting off its stem. */}
        <span
          aria-hidden
          className="absolute -top-2 bottom-[-14px] w-px -translate-x-1/2 bg-[#7DA4FF] [[data-theme=dark]_&]:bg-[#D9ED92]"
          style={{ left: `${TRACK_MARK_PCT}%` }}
        />
        <span
          aria-hidden
          className="absolute -top-3 size-2.5 -translate-x-1/2 rounded-[3px] bg-[#7DA4FF] [[data-theme=dark]_&]:bg-[#D9ED92]"
          style={{ left: `${TRACK_MARK_PCT}%` }}
        />
      </div>
    </div>
  );
}

// Mass messenger — the send control, and nothing else. It used to borrow the
// ticketing donut, which told the wrong story: a status breakdown says nothing
// about writing one message and sending it to everyone. The action is the whole
// card, so it gets the whole card.
// The face is the ink token rather than a fixed dark, so the pill inverts with
// the theme and never sinks into the card behind it; the lime badge is the one
// fixed colour, and it carries enough contrast for a dark glyph in both skins.
// Light keeps the brand lime; dark runs the same ramp shape in the brand blue,
// which holds its own against the near-white pill there the way lime does on the
// light one. Class-based rather than an inline style so the theme can switch it.
// Flat fill, not the lit-to-shaded ramp it carried: a gradient running light at
// the top-left into dark at the bottom-right is a sphere, and the badge is a
// face on the pill.
const SEND_BADGE = `bg-[#D9ED92] [[data-theme=dark]_&]:bg-[#7DA4FF]`;

function CardMassMessenger() {
  return (
    // Both skins run the card's own face now. Light used to invert it — a near-
    // black slab carrying a pale pill — which made this the one dark tile in a
    // gallery of off-white ones, louder than any card around it.
    <div className="flex h-full items-center justify-center bg-[var(--v69-card)] p-5 [[data-theme=light]_.template-mock_&]:bg-[#f2f2f2]">
      {/* A badge-and-label pill rather than a plain block: the lime disc gives
          the action a face, and the send glyph lives in it instead of trailing
          the text. Asymmetric padding — tight on the badge side, open on the
          label side — is what keeps it from reading as a centred button.
          A surface a step off the face in both skins, behind the shared hairline —
          the same way every other raised element in the set is drawn. In the
          light gallery the hairline runs lighter than the shared alpha: the
          cover is scaled up there, so a 1px ring lands as a hard two-pixel line
          around a white pill that already separates from the face on fill. */}
      <div
        className={`flex h-13 w-full items-center gap-3 rounded-full bg-[#FFFFFF] pl-1.5 pr-5 text-[15px] font-normal text-[var(--v69-ink)] ring-1 ring-[rgba(16,24,40,0.06)] [.template-mock_&]:ring-[rgba(16,24,40,0.10)] [[data-theme=light]_.template-mock_&]:ring-[rgba(16,24,40,0.05)] [[data-theme=dark]_&]:bg-[#323232] [[data-theme=dark]_&]:text-[#F2F2F2] [[data-theme=dark]_&]:ring-[rgba(255,255,255,0.12)] [[data-theme=dark]_.template-mock_&]:ring-[rgba(255,255,255,0.20)]`}
      >
        {/* Flat, with no lit rim — the badge is a face on the pill, not a raised
            button on it. */}
        <span
          className={`flex size-10 shrink-0 items-center justify-center rounded-full text-[#262626] ${SEND_BADGE}`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            className="size-[17px]"
          >
            <path d="M4 12h13M11 6l6 6-6 6" />
          </svg>
        </span>
        Send to all
      </div>
    </div>
  );
}

// Deals pipeline — the board as the team sees it on desktop: a column per
// stage with its count and value, and a card per deal.
const DEAL_STAGES: {
  name: string;
  count: number;
  value: string;
  dot: string;
  deals: { title: string; company: string; initials: string; value: string; owner: string }[];
}[] = [
  { name: "Lead", count: 8, value: "$243,000", dot: "bg-[#5BA4E5]", deals: [
    { title: "Website redesign discovery", company: "Nimbus Works", initials: "NW", value: "$24,000", owner: "AE" },
    { title: "Portfolio reporting dashboard", company: "Kestrel Holdings", initials: "KH", value: "$46,000", owner: "KF" },
    { title: "Content strategy retainer", company: "Brookline Media", initials: "BM", value: "$18,000", owner: "VC" },
    { title: "Brand identity refresh", company: "Aspen Ridge", initials: "AR", value: "$32,000", owner: "JW" },
  ] },
  { name: "Qualified", count: 7, value: "$471,000", dot: "bg-[#2BB5A0]", deals: [
    { title: "Lab data platform integration", company: "Meridian Labs", initials: "ML", value: "$88,000", owner: "KF" },
    { title: "Fund reporting portal", company: "Redwood Ventures", initials: "RV", value: "$64,000", owner: "AE" },
    { title: "E-commerce replatform", company: "Cascade Outdoor Co.", initials: "CC", value: "$115,000", owner: "JW" },
    { title: "Client portal rollout", company: "Rao Advisory", initials: "RA", value: "$42,000", owner: "VC" },
  ] },
  { name: "Proposal", count: 6, value: "$574,500", dot: "bg-[#9B7BE5]", deals: [
    { title: "Fleet analytics platform", company: "Northwind Logistics", initials: "NL", value: "$178,000", owner: "KF" },
    { title: "Platform security review", company: "Triyama Software", initials: "TS", value: "$72,000", owner: "DB" },
    { title: "Advisory retainer, FY27", company: "Whitfield Partners", initials: "WP", value: "$120,000", owner: "JW" },
    { title: "Investor reporting redesign", company: "Fairhaven Group", initials: "FG", value: "$54,000", owner: "AE" },
  ] },
  { name: "Negotiation", count: 5, value: "$871,000", dot: "bg-[#F2A33A]", deals: [
    { title: "Enterprise data migration", company: "Bridgepoint Advisory", initials: "BA", value: "$245,000", owner: "KF" },
    { title: "Multi-year managed services", company: "Wexford Group", initials: "WG", value: "$310,000", owner: "JW" },
    { title: "Grid reporting suite", company: "Redwood Energy Partners", initials: "RP", value: "$142,000", owner: "TS" },
    { title: "M&A diligence workspace", company: "Beaumont Partners", initials: "BP", value: "$98,000", owner: "AE" },
  ] },
];

function CardDealsPipeline() {
  return (
    // Dark gradient in light mode, light in dark mode: every app-screen cover
    // sits on a dark ground on the light page and a light one on the dark page.
    <GlassCover
      photo="bg-[url(/images/mocks/pipeline-ambient-dark.webp)] [[data-theme=dark]_&]:bg-[url(/images/mocks/pipeline-ambient.webp)]"
      focus="bg-center"
      dim=""
      inset=""
      panel={false}
    >
      <DesktopMock>
        <div className="flex h-14 items-center gap-3 border-b border-[#E5E7EB] px-6 text-[15px] leading-none">
          <svg viewBox="0 0 24 24" className="size-5 text-[#4B5563]" {...APP_ICON} aria-hidden>
            <rect x="3.5" y="5" width="17" height="14" rx="2" />
            <path d="M10 5v14" />
          </svg>
          <span>Deals Pipeline</span>
          <svg viewBox="0 0 24 24" className="size-4 text-[#6B7280]" {...APP_ICON} aria-hidden>
            <path d="m6 9 6 6 6-6" />
          </svg>
          <span className="ml-auto flex h-9 items-center gap-1.5 rounded-lg bg-[#1F2329] px-3.5 text-[14px] leading-none text-[#FFFFFF]">
            <svg viewBox="0 0 24 24" className="size-4" {...APP_ICON} aria-hidden>
              <path d="M12 5v14M5 12h14" />
            </svg>
            Create deal
          </span>
        </div>
        <div className="flex gap-6 px-6 pt-4 text-[14px] leading-none">
          <span className="border-b-2 border-[#1F2937] pb-3">Pipeline</span>
          <span className="pb-3 text-[#6B7280]">Table</span>
          <span className="pb-3 text-[#6B7280]">Chart</span>
        </div>
        <div className="flex items-center gap-2 border-t border-[#E5E7EB] px-6 py-3">
          <div className="w-[200px]"><AppSearch placeholder="Search" /></div>
          {["Owner", "Company", "Stage", "Value"].map((f) => (
            <span key={f} className={`${APP_BOX} h-9 gap-1.5 px-3 text-[14px] leading-none text-[#374151]`}>
              {f}
              <svg viewBox="0 0 24 24" className="size-3.5" {...APP_ICON} aria-hidden><path d="m6 9 6 6 6-6" /></svg>
            </span>
          ))}
        </div>
        <div className="flex gap-3 px-6 pt-2">
          {DEAL_STAGES.map((st) => (
            <div key={st.name} className={`w-[270px] shrink-0 rounded-xl border ${APP_LINE} bg-[#F7F8FA] p-2`}>
              <div className="flex items-center gap-2 px-2 py-2.5 text-[13px] leading-none">
                <span className={`size-2 rounded-full ${st.dot}`} />
                {st.name}
                <span className="rounded bg-[#E5E7EB] px-1.5 py-0.5 text-[12px] text-[#4B5563]">{st.count}</span>
                <span className="ml-auto text-[#6B7280]">{st.value}</span>
              </div>
              <div className="space-y-2">
                {st.deals.map((d) => (
                  <div key={d.title} className={`rounded-lg border ${APP_LINE} bg-[#FFFFFF] px-3 py-3`}>
                    <div className="truncate text-[14px] leading-none">{d.title}</div>
                    <div className="mt-2.5 flex items-center gap-1.5 text-[12px] leading-none text-[#6B7280]">
                      <span className="rounded bg-[#ECEEF9] px-1 py-0.5 text-[9px] text-[#4B55A8]">{d.initials}</span>
                      {d.company}
                    </div>
                    <div className="mt-3 flex items-center justify-between text-[14px] leading-none">
                      {d.value}
                      <span className="flex size-5 items-center justify-center rounded-full bg-[#E8F4F0] text-[8px] text-[#2F7A64]">{d.owner}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DesktopMock>
    </GlassCover>
  );
}

// Internal ticketing — the week as a field of tickets, one dot each, in the three
// states the queue actually has: resolved in ink, in progress mid, still open
// faint. It was a segmented ring reading the same split as arc lengths, which
// made a queue of 37 things look like a percentage.
const TICKETS_RESOLVED = 24;
const TICKETS_IN_PROGRESS = 8;
const TICKETS_OPEN = 5;
const TICKET_COLS = 8;

function CardTicketing() {
  return (
    <div className="flex h-full flex-col justify-between bg-[var(--v69-card)] p-5 max-sm:[.template-mock-gallery_&]:p-4">
      <DotField
        cols={TICKET_COLS}
        bands={[
          // Resolved carries the accent, the way the progress ring spends it on
          // the part that is done; what is still moving or untouched stays
          // neutral, so the week's outcome is the first thing you read.
          { count: TICKETS_RESOLVED, fill: "#7DA4FF" },
          { count: TICKETS_IN_PROGRESS, fill: INK_MID },
          { count: TICKETS_OPEN, fill: INK_FAINT },
        ]}
      />

      {/* The unit sits beside the figure, baseline-aligned to its foot rather than
          pinned to the card's corner, so the two read as one measurement. */}
      <div className="flex items-end gap-2">
        <span className="text-[52px] font-normal leading-[0.78] tracking-tight tabular-nums text-[var(--v69-ink)] max-sm:[.template-mock-gallery_&]:text-[34px]">
          {TICKETS_RESOLVED + TICKETS_IN_PROGRESS + TICKETS_OPEN}
        </span>
        <span className={`mb-1 ${MOCK_UNIT_TAG}`} style={MOCK_MONO}>
          Tickets
        </span>
      </div>
    </div>
  );
}

// Listening waveform bar heights, in the mock's own px. Slightly asymmetric so it
// reads as a voice rather than as a symmetrical graphic.
const ASSISTANT_WAVE = [12, 26, 42, 54, 36, 22, 13];

// Internal AI assistant — one object, not a screen: a large disc with the
// listening waveform sunk into it. It used to be a pill, a greeting, a small
// waveform and a prompt line stacked in a rounded rectangle, which read as a
// miniature chat UI; the disc is the composition now and the waveform is the only
// thing with weight in it.
function CardAIAssistant() {
  return (
    // Ruled squares under the disc — the graph-paper ground, where the goal gauge
    // takes the dot field. Both are a single object centred on an empty cover, and
    // giving them different grounds is what keeps them from reading as one card
    // drawn twice.
    <div
      className={`v69-plot-grid v69-plot-grid--lines flex h-full items-center justify-center bg-[var(--v69-card)] p-4 ${PDF_GLYPH_TOKENS}`}
    >
      {/* The PDF tile's material, on a circle: a flat fill a step off the face
          behind the shared hairline. It was machined hardware before — a
          perimeter carve, a key light, a glass sheen, a dished well under the
          waveform, a halo behind it and a cast shadow off the bars. */}
      <div className="relative flex aspect-square h-full max-h-[220px] items-center justify-center rounded-full bg-[var(--v69-inner)] ring-1 ring-[rgba(16,24,40,0.06)] [.template-mock_&]:ring-[rgba(16,24,40,0.10)] [[data-theme=dark]_&]:bg-[#323232] [[data-theme=dark]_&]:ring-[rgba(255,255,255,0.12)] [[data-theme=dark]_.template-mock_&]:ring-[rgba(255,255,255,0.20)]">
        {/* The one mark on the cover, at the PDF tile's value in both skins:
            these two are the set's only single-mark covers, and they should
            carry the same weight side by side. */}
        <span className="flex h-[54px] items-center gap-[5px]">
          {ASSISTANT_WAVE.map((h, i) => (
            <span
              key={i}
              className="w-[4px] rounded-full bg-[var(--pdf-ink)]"
              style={{ height: `${h}px` }}
            />
          ))}
        </span>
      </div>
    </div>
  );
}
// Course player — a "now playing" lesson row (thumbnail, title, course, play)
// like a music player, adapted with a completion bar since a course tracks
// progress through lessons. Monochrome.
function CardCourse() {
  return (
    <div className="flex h-full flex-col gap-3 bg-[var(--v69-card)] p-4">
      {/* Lesson cover fills the card, with the play control anchored on it. */}
      <div
        className={`relative flex flex-1 items-center justify-center overflow-hidden rounded-2xl bg-[var(--v69-well-2)] ${MOCK_OUTLINE}`}
      >
        <span
          className={`absolute bottom-2.5 right-2.5 flex size-9 items-center justify-center rounded-full bg-[var(--v69-ink)] ${ON_INK}`}
        >
          <svg
            viewBox="0 0 24 24"
            className="size-4 translate-x-px"
            fill="currentColor"
            aria-hidden
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </div>

      <div>
        <div className="truncate text-[13px] font-normal text-[var(--v69-ink)]">
          Onboarding basics
        </div>
        <div className="truncate text-[11px] font-normal text-muted-foreground">
          Client Success 101
        </div>
      </div>
    </div>
  );
}

// Block builder game — a block-puzzle board mid-game, after the mobile puzzle
// games it's modelled on: a tray of upcoming pieces and the score above a
// recessed board, a goal line and progress below. The one deliberately colourful
// mock in the set — a game reads as a game because of the coloured pieces, so
// the monochrome rule the other widgets follow would defeat the point. The
// pieces keep one palette across both themes (they are lit objects, not
// surfaces); only the board and its empty cells re-tone per theme.
// The five piece colours come from the site's own palette — limes, blues and one
// warm neutral — rather than the arbitrary arcade hues they started as, which
// shared nothing with the rest of the page.
// One set per theme, since the board they sit on flips from near-white to dark
// grey: the pale lime and the warm neutral that read well on the dark board
// nearly vanished on the light one, so light takes deeper members of the same
// families. Passed as two custom properties per cell, because an inline
// background can't switch on the theme.
// Two piece colours: the brand lime and the brand periwinkle, at full strength,
// with no tints or steps between them. The five codes below stay so the board
// layout doesn't have to be re-laid, but they resolve to only those two values —
// and to the same value in both themes, since a lighter or darker step per theme
// is exactly the sub-shade this palette rules out. Neighbouring pieces of the
// same colour separate on the cell gap and the lit top edge instead.
const BLOCK_LIME = "#D9ED92";
const BLOCK_BLUE = "#7DA4FF";
const BLOCK_HUES: Record<string, string> = {
  Y: BLOCK_LIME,
  G: BLOCK_LIME,
  O: BLOCK_LIME,
  T: BLOCK_BLUE,
  P: BLOCK_BLUE,
};
const BLOCK_HUES_DARK = BLOCK_HUES;
const BLOCK_HUES_LIGHT = BLOCK_HUES;
const BLOCK_FILL =
  "bg-[var(--blk-light)] [[data-theme=dark]_&]:bg-[var(--blk-dark)]";
const blockVars = (code: string) =>
  ({
    "--blk-light": BLOCK_HUES_LIGHT[code],
    "--blk-dark": BLOCK_HUES_DARK[code],
  }) as React.CSSProperties;
// Rows of the board; "." is an empty cell, letters index BLOCK_HUES. Hand-laid
// rather than generated so the shapes read as real placed pieces.
// Eight columns wide so the board can span the tray's full width with square
// cells; seven rows is what still fits in the height that leaves, which is
// nearly all of it — the board is the widget.
const BLOCK_BOARD = [
  // Eight rows for eight columns: the board is the whole card now, so it has to
  // be square or it leaves a band of card above and below it.
  "........",
  "....YYYY",
  "......Y.",
  ".YY.GG..",
  "YYY.GG..",
  "TT..G...",
  ".TTTOPPP",
  ".OO..GGG",
];
// Top-lit face: a highlight along the top edge, a shaded lower edge. Held to
// about half the values it was drawn at — at full strength every cell read as a
// moulded plastic tile and the board as a toy, rather than as a grid of placed
// pieces. Enough is left that the pieces still sit on the board rather than
// being painted onto it.
const BLOCK_FACE =
  "shadow-[inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(0,0,0,0.07)] [[data-theme=light]_&]:shadow-[inset_0_1px_0_rgba(255,255,255,0.14),inset_0_-1px_0_rgba(0,0,0,0.025)]";
// Empty cell — a hole in the board, carried by its fill alone now that the grid
// sits straight on the card face. Both skins state the fill outright rather than
// laying an alpha over whatever is behind:
//  · dark ran 8% white on the near-black face, a step small enough that the empty
//    cells barely drew the board at all.
//  · light ran 6% black, which is a NEUTRAL grey mixed into a warm face — the one
//    cool patch in a palette that is warm everywhere else. It takes the same warm
//    step the unit tags use on this skin instead.
const BLOCK_HOLE =
  "bg-[#e6e6e6] [[data-theme=light]_.template-mock_&]:bg-[#e2e2e2] [[data-theme=dark]_&]:bg-[#3A3A3A]";

function BlockCell({ code, radius }: { code: string; radius: string }) {
  return BLOCK_HUES_LIGHT[code] ? (
    <span
      className={`aspect-square ${radius} ${BLOCK_FACE} ${BLOCK_FILL}`}
      style={blockVars(code)}
    />
  ) : (
    <span className={`aspect-square ${radius} ${BLOCK_HOLE}`} />
  );
}

function CardBlockGame() {
  return (
    // Board only — the piece tray that used to sit above it is gone, so the grid
    // takes the whole card. An 8x8 of square cells fills the square exactly, and
    // the cells carry the aspect ratio, so the height still follows the column
    // width and it stays a true grid.
    <div className="flex h-full items-center justify-center bg-[var(--v69-card)] p-4">
      {/* The board is 8x8 of square cells, so its height always equals its width.
          On the phone frame that would run off the top and bottom, so there it
          fills the card in both directions instead (v69-block-board) — the cells
          give up their square rather than the board giving up the width. */}
      {/* The grid sits straight on the card face. It used to have a surface of its
          own — a lighter fill behind a hairline — which put a card inside the
          card; the empty cells already draw the board, so the panel under them
          was describing something the grid says on its own. */}
      <div className="v69-block-board grid w-full grid-cols-8 gap-[3px]">
        {BLOCK_BOARD.flatMap((row, y) =>
          [...row].map((code, x) => (
            <BlockCell key={`${x}-${y}`} code={code} radius="rounded-[4px]" />
          )),
        )}
      </div>
    </div>
  );
}

// Service request intake — the queue as the control you'd flip between, after
// the system segmented control: the two states side by side with the count on
// the one that needs attention.
const INTAKE_SEGMENTS = [
  { label: "New", count: 2 },
  { label: "Answered", count: null },
] as const;

function CardServiceRequest() {
  return (
    // One object centred on an empty ground. It used to be the request written out
    // as a sentence across an ink-filled card — the only inverted face in the set,
    // and a paragraph where every sibling cover is a single object.
    <div className="v69-intake-cover flex h-full items-center justify-center bg-[var(--v69-card)] p-5 [[data-theme=light]_.template-mock_&]:bg-[#f2f2f2]">
      {/* The track: a recess the segments sit in, one step off the card face. */}
      <div className="flex items-center gap-1 rounded-full bg-[var(--v69-inner)] p-1 [[data-theme=dark]_&]:bg-[#2E2E2E]">
        {INTAKE_SEGMENTS.map((segment, i) => {
          const selected = i === 0;
          return (
            <span
              key={segment.label}
              // The selected segment is a raised chip; the other is bare track,
              // so the pair reads as one control with one side active rather than
              // as two buttons.
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] leading-none ${
                selected
                  ? "bg-[#FFFFFF] text-[var(--v69-ink)] [[data-theme=dark]_&]:bg-[#3F3F3F]"
                  : "text-muted-foreground"
              }`}
            >
              {segment.label}
              {segment.count !== null && (
                // The count takes the brand accent — the one coloured mark on the
                // cover, the way the send button carries it on the composer.
                <span className="flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#D9ED92] px-1 text-[10px] leading-none tabular-nums text-[#262626] [[data-theme=dark]_&]:bg-[#7DA4FF]">
                  {segment.count}
                </span>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}

// Design approvals — one round as the client reviews it on desktop: the two
// designs shared this round, the one already picked outlined and ticked, and
// the round's note above them.
const DESIGN_OPTIONS = [
  { label: "Pricing page, campaign styling", src: "/images/mocks/design-approval-pricing.webp", picked: true },
  { label: "Customers page, campaign styling", src: "/images/mocks/design-approval-customers.webp", picked: false },
];

function CardDesignApprovals() {
  return (
    // Dark gradient in light mode, light in dark mode: every app-screen cover
    // sits on a dark ground on the light page and a light one on the dark page.
    <GlassCover
      photo="bg-[url(/images/mocks/design-approvals-ambient-dark.webp)] [[data-theme=dark]_&]:bg-[url(/images/mocks/design-approvals-ambient.webp)]"
      focus="bg-center"
      dim=""
      inset=""
      panel={false}
    >
      <DesktopMock>
        <div className="flex h-14 items-center gap-3 border-b border-[#E5E7EB] px-6 text-[15px] leading-none">
          <svg viewBox="0 0 24 24" className="size-5 text-[#4B5563]" {...APP_ICON} aria-hidden>
            <rect x="3.5" y="5" width="17" height="14" rx="2" />
            <path d="M10 5v14" />
          </svg>
          <span className="text-[#6B7280]">Approvals</span>
          <svg viewBox="0 0 24 24" className="size-3.5 text-[#9CA3AF]" {...APP_ICON} aria-hidden>
            <path d="m9 6 6 6-6 6" />
          </svg>
          <span>Product launch campaign: landing pages</span>
          <span className="ml-auto flex h-9 items-center gap-1.5 rounded-lg bg-[#7DA4FF] px-3.5 text-[14px] leading-none text-[#FFFFFF]">
            <svg viewBox="0 0 24 24" className="size-4" {...APP_ICON} aria-hidden>
              <path d="m5 12 5 5 9-10" />
            </svg>
            Approve design
          </span>
        </div>
        <div className="px-6 pt-6">
          <div className="flex items-center gap-2 text-[14px] leading-none text-[#4B5563]">
            <svg viewBox="0 0 24 24" className="size-4" {...APP_ICON} aria-hidden>
              <path d="M19 12H5M11 6l-6 6 6 6" />
            </svg>
            All approvals
          </div>
          <div className="mt-5 flex items-center gap-3">
            <span className="text-[22px] leading-none tracking-tight">
              Product launch campaign: landing pages
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-[#EEF3FE] px-3 py-1.5 text-[13px] leading-none text-[#2F5BB7]">
              <span className="size-1.5 rounded-full bg-[#2F5BB7]" />
              New designs, your decision needed
            </span>
          </div>
        </div>
        <div className="mt-6 flex gap-6 border-b border-[#E5E7EB] px-6 text-[14px] leading-none">
          <span className="border-b-2 border-[#1F2937] pb-3">Current round</span>
          <span className="pb-3 text-[#6B7280]">
            Previous rounds <span className="ml-1 rounded bg-[#F1F2F4] px-1.5 py-0.5">1</span>
          </span>
        </div>
        <div className="px-6 pt-5">
          <div className={`overflow-hidden rounded-xl border ${APP_LINE}`}>
            <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4 text-[14px] leading-none">
              Round 2
              <span className="text-[#6B7280]">Shared Aug 23, 2026</span>
            </div>
            <div className="px-5 pb-6 pt-5">
              <div className="text-[14px] leading-snug text-[#4B5563]">
                Supporting pages for the campaign: pricing and customers, updated to match the launch hero.
              </div>
              <div className="mt-5 flex gap-4">
                {/* The real designs from the template's own screenshot, with
                    their selection marks: the pricing page picked, the
                    customers page not. */}
                {DESIGN_OPTIONS.map((opt) => (
                  <div
                    key={opt.label}
                    className={`w-[320px] overflow-hidden rounded-xl ${
                      opt.picked ? "border-2 border-[#1F2937]" : `border ${APP_LINE}`
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- a fixed thumbnail inside a scaled mock; next/image would re-size it for the scaled box */}
                    <img
                      src={opt.src}
                      alt=""
                      className="block aspect-[630/350] w-full object-cover"
                    />
                    <div className="border-t border-[#E5E7EB] px-4 py-3 text-[14px] leading-none">
                      {opt.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DesktopMock>
    </GlassCover>
  );
}

export function V69CardMock({ slug }: { slug: string }) {
  // The booking cover was keyed to "booking-meeting-request", a slug no template
  // in the gallery carries, so the one template that wants it fell through to the
  // generic mock while the real booking widget went unreachable.
  if (slug === "booking-app") return <CardBooking />;
  if (slug === "client-calendar") return <CardCalendar />;
  if (slug === "case-status-page") return <CardCaseStatus />;
  if (slug === "client-discussion-forum") return <CardDiscussion />;
  // No annotation cover exists yet, so this borrows the comment thread — the
  // nearest true thing the set has for "comments". Not CardContentApproval, which would
  // be the closer metaphor but is already the content-approval cover and sits in
  // the same Approvals tab, where two identical covers would read as a bug.
  if (slug === "markup-comments") return <CardMarkup />;
  if (slug === "client-resource-library") return <CardResourceLibrary />;
  if (slug === "client-todo-list") return <CardTodo />;
  if (slug === "community-qa") return <CardCommunityQA />;
  if (slug === "voice-ai-integration") return <CardVoiceAI />;
  if (slug === "deliverable-progress") return <CardDeliverable />;
  if (slug === "data-room") return <CardDataRoom />;
  if (slug === "new-client-intake") return <CardIntake />;
  if (slug === "client-engagement-dashboard") return <CardEngagement />;
  if (slug === "data-visualization") return <CardDataViz />;
  if (slug === "time-tracker") return <CardTimeTracker />;
  if (slug === "goal-tracker") return <CardMetrics />;
  if (slug === "client-support-requests") return <CardSupport />;
  if (slug === "internal-ticketing") return <CardTicketing />;
  if (slug === "internal-communications-app") return <CardInternalComms />;
  if (slug === "internal-ai-assistant") return <CardAIAssistant />;
  if (slug === "conditional-forms") return <CardConditionalForms />;
  if (slug === "course-player") return <CardCourse />;
  if (slug === "service-request-intake") return <CardServiceRequest />;
  if (slug === "client-project-tracker") return <CardTracker />;
  if (slug === "progress-tracker") return <CardProgressTracker />;
  if (slug === "deals-pipeline") return <CardDealsPipeline />;
  if (slug === "content-approval-flow") return <CardContentApproval />;
  if (slug === "proposal-builder") return <CardProposal />;
  if (slug === "client-ai-assistant") return <CardChat />;
  if (slug === "client-onboarding-wizard") return <CardOnboarding />;
  if (slug === "document-collection") return <CardDocuments />;
  if (slug === "pdf-to-digital-intake") return <CardPdf />;
  if (slug === "client-performance-dashboard") return <CardMetrics />;
  if (slug === "retainer-usage-overview") return <CardRetainerColumns />;
  if (slug === "monthly-client-report") return <CardReport />;
  if (slug === "events-rsvps") return <CardEvents />;
  if (slug === "design-approvals") return <CardDesignApprovals />;
  if (slug === "mass-messenger") return <CardMassMessenger />;
  if (slug === "jargon-quest") return <CardJargonQuest />;
  if (slug === "internal-resource-library") return <CardTeamGuides />;
  if (slug === "message-autoresponder") return <CardAutoresponder />;
  if (slug === "contracts-app") return <CardContract />;
  if (slug === "exporter") return <CardExport />;
  if (slug === "files-app") return <CardFiles />;
  if (slug === "forms-app") return <CardForms />;
  if (slug === "helpdesk-app") return <CardHelpdesk />;
  if (slug === "client-home") return <CardHome />;
  if (slug === "tasks") return <CardTasks />;
  if (slug === "profile-manager") return <CardProfileManager />;
  if (slug === "messaging-app") return <CardMessages />;
  if (slug === "billing-app") return <CardPayments />;
  if (slug === "xero") return <CardXero />;
  if (slug === "quickbooks") return <CardQuickBooks />;
  if (slug === "block-builder-game") return <CardBlockGame />;
  return <TemplateMock slug={slug} />;
}

const FEATURED = getFeaturedTemplates(6);
const CAROUSEL: Template[] = [
  ...FEATURED,
  ...VISIBLE_TEMPLATES.filter((t) => !FEATURED.some((f) => f.slug === t.slug)),
].slice(0, 12);

// V70 nav — a slightly squarish frosted pill that shortens into a compact
// centered pill on scroll, so it stops spanning awkwardly across the blue hero
// gradient once you move down the page.
function V71Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock background scroll while the full-screen menu is open.
  useEffect(() => {
    if (!menuOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [menuOpen]);

  return (
    <div className="fixed inset-x-0 top-0 z-50">
      {/* Full-width off-white announcement bar. */}
      <div className="flex h-9 w-full items-center justify-center gap-2 bg-[var(--v69-well)] px-4 text-[13px] text-muted-foreground">
        <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-[10px] font-normal text-white">
          New
        </span>
        <span className="truncate">
          Assembly builds client-facing apps in minutes.
        </span>
      </div>
      <div className="flex justify-center px-4 pt-4">
        <nav
          className={`relative flex w-full items-center justify-between gap-6 rounded-[20px] border transition-all duration-300 ease-out backdrop-blur-xl ${
            scrolled
              ? "max-w-3xl border-black/[0.06] bg-[#f4f4ec]/78 py-1.5 pl-4 pr-1.5 shadow-[0_12px_34px_-14px_rgba(40,50,90,0.22)]"
              : "max-w-[1600px] border-black/[0.05] bg-[#f4f4ec]/62 py-2 pl-4 pr-2 shadow-[0_8px_24px_-16px_rgba(40,50,90,0.16)]"
          }`}
        >
          <Link
            href="/"
            aria-label="Assembly"
            className="flex shrink-0 items-center transition-opacity hover:opacity-80"
          >
            <Image
              src="/images/logo-mark.svg"
              alt="Assembly"
              width={24}
              height={24}
              priority
            />
          </Link>

          {/* Links — absolutely centered in the bar, independent of side widths. */}
          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 md:flex">
            {NAV_LINKS.map((l) => (
              <a
                key={l}
                href={APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`whitespace-nowrap text-[var(--v69-ink)]/65 transition-colors hover:text-[var(--v69-ink)] ${T.label}`}
              >
                {l}
              </a>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <a
              href={APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden rounded-full px-3 py-2 text-[var(--v69-ink)]/70 transition-colors hover:text-[var(--v69-ink)] sm:inline ${T.label}`}
            >
              Log in
            </a>
            <a
              href={APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`rounded-full bg-neutral-900 px-4 py-1.5 font-normal text-white transition-[opacity,transform] hover:opacity-90 active:scale-[0.98] ${T.label}`}
            >
              Start trial
            </a>
            {/* Mobile menu button — v62's 3×3 grid-dots glyph. */}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="flex size-9 items-center justify-center rounded-full text-[var(--v69-ink)]/70 transition-colors hover:bg-black/[0.05] hover:text-[var(--v69-ink)] md:hidden"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
              >
                <circle cx="5" cy="5" r="1.6" />
                <circle cx="12" cy="5" r="1.6" />
                <circle cx="19" cy="5" r="1.6" />
                <circle cx="5" cy="12" r="1.6" />
                <circle cx="12" cy="12" r="1.6" />
                <circle cx="19" cy="12" r="1.6" />
                <circle cx="5" cy="19" r="1.6" />
                <circle cx="12" cy="19" r="1.6" />
                <circle cx="19" cy="19" r="1.6" />
              </svg>
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile full-screen menu — full-bleed frosted panel in the same tone as
          the nav, with the links, Log in, and a Start trial CTA. */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-[#f4f4ec]/95 backdrop-blur-2xl md:hidden">
          <div className="flex items-center justify-between px-5 pt-6">
            <Link
              href="/"
              aria-label="Assembly"
              onClick={() => setMenuOpen(false)}
              className="flex items-center"
            >
              <Image
                src="/images/logo-mark.svg"
                alt="Assembly"
                width={24}
                height={24}
              />
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="flex size-9 items-center justify-center rounded-full text-[var(--v69-ink)]/70 transition-colors hover:bg-black/[0.05] hover:text-[var(--v69-ink)]"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                aria-hidden
              >
                <path d="M6 6l12 12M6 18L18 6" />
              </svg>
            </button>
          </div>

          <div className="flex flex-1 flex-col gap-1 px-5 pt-10">
            {NAV_LINKS.map((l) => (
              <a
                key={l}
                href={APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="rounded-2xl px-2 py-3 text-[28px] font-normal tracking-[-0.02em] text-[var(--v69-ink)] transition-colors hover:bg-black/[0.03]"
              >
                {l}
              </a>
            ))}
            <a
              href={APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="rounded-2xl px-2 py-3 text-[28px] font-normal tracking-[-0.02em] text-[var(--v69-ink)]/60 transition-colors hover:bg-black/[0.03]"
            >
              Log in
            </a>
          </div>

          <div className="px-5 pb-8">
            <a
              href={APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="flex h-12 items-center justify-center rounded-2xl bg-neutral-900 text-[15px] font-normal text-white transition-opacity active:opacity-90"
            >
              Start trial
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export function HeroV71() {
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);
  const rowRef = useRef<HTMLDivElement>(null);

  const updateArrows = () => {
    const el = rowRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };
  useEffect(() => {
    updateArrows();
    window.addEventListener("resize", updateArrows);
    return () => window.removeEventListener("resize", updateArrows);
  }, []);
  const scrollRow = (dir: 1 | -1) =>
    rowRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });

  return (
    <>
      <V71Nav />
      <section className="overflow-x-clip pb-24">
        <div className="relative px-6 pb-28 pt-40 md:px-10 md:pt-48">
          <div className="relative mx-auto max-w-[1600px]">
            {/* V71 — full-bleed brand-blue gradient with NO shape restriction:
                spans the full viewport width and runs from behind the nav down
                into the template row, fading out (unlike V70's rounded panel). */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-[-11rem] z-0 h-[900px] w-screen -translate-x-1/2 md:top-[-12rem]"
              style={{
                background:
                  "linear-gradient(180deg, #8ea2f4 0%, #a9bbf3 28%, #cfd9f6 54%, rgba(207,217,246,0) 90%)",
              }}
            />
            <h1
              className={`relative z-10 mx-auto max-w-3xl text-center text-[#181d24] ${T.display}`}
            >
              The AI app builder
              {/* Mobile breaks after "builder" (so "for" starts line 2); desktop
                  keeps the break after "for". */}
              <br className="md:hidden" /> for
              <br className="hidden md:block" /> client-facing experiences
            </h1>

            {/* Composer — sits on the blue panel; its light surface reads against it. */}
            <div className="relative z-10 mx-auto mt-8 max-w-xl">
              <V66Composer
                glow={false}
                typewriter
                mutedControls
                submitLabel="Get started"
                submitDark
                surfaceClassName="v69-composer bg-[var(--v69-box)] ring-1 ring-black/[0.10]"
                minHeightClass="min-h-[148px]"
              />
            </div>

            {/* Template row — poster-style cards. Extra top margin gives the
                composer room to breathe before the templates begin. */}
            <div className="relative z-10 mt-10">
              <div className="flex items-center justify-end">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => scrollRow(-1)}
                    disabled={!canLeft}
                    aria-label="Previous templates"
                    className="flex size-7 items-center justify-center rounded-full text-[var(--v69-ink)]/40 transition-colors hover:bg-black/[0.06] hover:text-[var(--v69-ink)] disabled:pointer-events-none disabled:opacity-25"
                  >
                    <IconChevron className="size-4 rotate-180" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollRow(1)}
                    disabled={!canRight}
                    aria-label="More templates"
                    className="flex size-7 items-center justify-center rounded-full text-[var(--v69-ink)]/40 transition-colors hover:bg-black/[0.06] hover:text-[var(--v69-ink)] disabled:pointer-events-none disabled:opacity-25"
                  >
                    <IconChevron className="size-4" />
                  </button>
                </div>
              </div>

              {/* Full-bleed: the row breaks out of the content column to span the
                  whole viewport, so cards peek off both edges instead of being
                  hard-cut mid-page. Inset padding keeps the first card aligned. */}
              <div className="relative left-1/2 mt-1 w-screen -translate-x-1/2">
                <div
                  ref={rowRef}
                  onScroll={updateArrows}
                  className="flex gap-4 overflow-x-auto pb-2 pl-6 pr-6 pt-3 md:pl-10 md:pr-10 lg:pl-[max(2.5rem,calc((100vw-1600px)/2))] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&:has(a:hover)>a:not(:hover)]:opacity-45"
                >
                  {CAROUSEL.map((t) => (
                    <a
                      key={t.slug}
                      href={APP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex w-[236px] shrink-0 origin-center flex-col transition-[transform,opacity] duration-300 ease-out"
                    >
                      <div className="relative h-[188px] overflow-hidden rounded-xl border border-black/[0.06] bg-[var(--v69-card)] shadow-[0_6px_20px_-14px_rgba(40,50,90,0.16)] transition-[transform,border-color,box-shadow] duration-300 group-hover:[will-change:transform] group-hover:-translate-y-1 group-hover:border-black/[0.12] group-hover:shadow-[0_14px_32px_-18px_rgba(40,50,90,0.26)]">
                        <div className="h-full w-full">
                          <V69CardMock slug={t.slug} />
                        </div>
                      </div>
                      <p
                        className={`mt-3 line-clamp-2 text-[#181d24] ${T.title}`}
                      >
                        {t.title}
                      </p>
                      <p className={`mt-1 text-[var(--v69-ink)]/55 ${T.meta}`}>
                        {t.category}
                      </p>
                    </a>
                  ))}

                  {/* Tail — info card: stacked previews that fan out on hover. */}
                  <CardInfo />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Logos carousel — on the white base below the gradient. */}
        <div className="mx-auto mt-20 max-w-7xl px-6 md:mt-24">
          <p
            className={`mb-8 text-center text-muted-foreground ${T.eyebrow}`}
            style={{ fontFamily: MONO }}
          >
            Trusted by teams at
          </p>
          <div className="mx-auto max-w-2xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
            <div className="flex w-max animate-marquee items-center gap-12">
              {[
                "Capital One",
                "Collective",
                "Ditto",
                "Heritage Law",
                "Waymaker",
                "Aura",
                "CoverPanda",
                "Northwind",
              ]
                .concat([
                  "Capital One",
                  "Collective",
                  "Ditto",
                  "Heritage Law",
                  "Waymaker",
                  "Aura",
                  "CoverPanda",
                  "Northwind",
                ])
                .map((name, i) => (
                  <span
                    key={i}
                    className="shrink-0 text-base font-normal text-muted-foreground"
                  >
                    {name}
                  </span>
                ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
