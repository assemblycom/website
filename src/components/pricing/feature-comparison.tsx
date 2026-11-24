"use client";

import { Fragment, useState } from "react";
import { useAuthState } from "@/lib/use-auth";
import { SIGNUP_URL, DEMO_URL, DEMO_CTA_LABEL } from "@/lib/constants";
import { InfoIcon, PLAN_TABLE_BLEED, TOOLTIP } from "@/components/pricing/pricing-plans";

const PLAN_NAMES = [
  "Free",
  "Starter",
  "Professional",
  "Advanced",
  "Enterprise",
] as const;

// A cell is either:
//   true  -> included (check)
//   false -> not included (dash)
//   string -> included with a specific value (check + text), or, when the row
//             is `plain`, a bare value with no check (used for fees / costs
//             where a checkmark would read as "included" rather than a rate).
type Cell = boolean | string;

interface FeatureRow {
  label: string;
  tooltip?: string;
  // Render string values without a leading check — for rates and costs.
  plain?: boolean;
  values: [Cell, Cell, Cell, Cell, Cell];
}

interface FeatureGroup {
  label: string;
  rows: FeatureRow[];
}

const GROUPS: FeatureGroup[] = [
  {
    label: "Internal users and contacts",
    rows: [
      {
        label: "Active contacts",
        tooltip: "The client records in your CRM — the people who can sign into your client experience.",
        values: ["5", "50", "500", "Unlimited", "Unlimited"],
      },
      {
        label: "Internal users included",
        tooltip: "Teammates with access to your workspace.",
        values: ["1", "1", "3", "5", "Unlimited"],
      },
      {
        label: "Cost per additional internal user",
        plain: true,
        values: [false, false, "+$39 yr / $49 mo", "+$59 yr / $79 mo", false],
      },
    ],
  },
  {
    label: "App Builder",
    rows: [
      {
        label: "Build credits / month",
        tooltip: "Credits used when the builder creates or edits an app. Using your live apps never consumes credits.",
        values: ["50", "200", "500", "500", "Unlimited"],
      },
      {
        label: "Unlimited build credits on yearly",
        tooltip: "Advanced billed yearly builds without a monthly credit limit, subject to fair use.",
        values: [false, false, false, true, true],
      },
      {
        label: "Apps included",
        values: ["3", "5", "10", "Unlimited", "Unlimited"],
      },
      {
        label: "Extra apps",
        plain: true,
        values: [false, "$8/mo each", "$8/mo each", "Unlimited", "Unlimited"],
      },
      {
        label: "Build credit packs",
        values: [false, true, true, true, true],
      },
    ],
  },
  {
    label: "Core Features",
    rows: [
      { label: "CRM", values: [true, true, true, true, true] },
      { label: "Client portal", values: [true, true, true, true, true] },
      {
        label: "Install apps from app library",
        values: [true, true, true, true, true],
      },
      { label: "Embeds and links", values: [true, true, true, true, true] },
      {
        label: "Messaging and team inbox",
        values: [true, true, true, true, true],
      },
      {
        label: "Billing and payments",
        values: [true, true, true, true, true],
      },
      {
        label: "Contracts and e-signature",
        values: [true, true, true, true, true],
      },
      {
        label: "File-sharing, intake forms, and tasks",
        values: [true, true, true, true, true],
      },
      {
        label: "API, MCP, Zapier & Make",
        values: [false, true, true, true, true],
      },
      {
        label: "ChatGPT and Claude apps",
        values: [false, true, true, true, true],
      },
      {
        label: "Custom domain for client experience",
        tooltip: "Serve the client experience from your own domain.",
        values: [false, false, true, true, true],
      },
      {
        label: "Custom email domain for notifications",
        values: [false, false, true, true, true],
      },
      {
        label: "Full white-labeling (remove Assembly badge)",
        values: [false, false, false, true, true],
      },
      {
        label: "App visibility settings",
        values: [false, false, true, true, true],
      },
      {
        label: "Automation builder",
        values: [false, false, true, true, true],
      },
      {
        label: "Multi-company contacts",
        values: [false, false, true, true, true],
      },
      { label: "Audit log", values: [false, false, false, true, true] },
      {
        label: "Client access permissions",
        values: [false, false, false, true, true],
      },
      { label: "Enforce MFA", values: [false, false, false, true, true] },
      {
        label: "Advanced security controls",
        values: [false, false, false, false, true],
      },
      {
        label: "HIPAA compliance with BAA",
        tooltip: "BAA available for handling protected health information.",
        values: [false, false, false, true, true],
      },
      { label: "Custom SSO", values: [false, false, false, false, true] },
      {
        label: "Sandbox workspace",
        values: [false, false, false, false, true],
      },
    ],
  },
  {
    label: "Payment Processing Fees",
    rows: [
      {
        label: "Credit card fee",
        plain: true,
        values: [
          "2.9% + $0.30",
          "2.9% + $0.30",
          "2.9% + $0.30",
          "2.9% + $0.30",
          "2.9% + $0.30",
        ],
      },
      {
        label: "ACH direct debit fee",
        plain: true,
        values: ["1%", "1%", "1% ($10 max)", "1% ($10 max)", "1% ($10 max)"],
      },
      {
        label: "Store fees",
        plain: true,
        values: ["2.0%", "1.5%", "1%", "0.7%", "0.7%"],
      },
      {
        label: "Invoices",
        plain: true,
        values: ["+0.7%", "+0.5%", "+0.4%", "+0.3%", "+0.3%"],
      },
      {
        label: "Recurring subscriptions",
        plain: true,
        values: ["+1.1%", "+0.9%", "+0.7%", "+0.5%", "+0.5%"],
      },
    ],
  },
  {
    label: "Support",
    rows: [
      {
        label: "Community support",
        values: [true, true, true, true, true],
      },
      { label: "Email support", values: [false, true, true, true, true] },
      {
        label: "Priority email support",
        values: [false, false, true, true, true],
      },
      {
        label: "Priority call support",
        values: [false, false, false, true, true],
      },
      {
        label: "Onboarding",
        tooltip: "Included on yearly billing.",
        values: [false, false, "Personalized", "White-glove", "Implementation service"],
      },
      {
        label: "Shared Slack channel",
        values: [false, false, false, false, true],
      },
      {
        label: "Dedicated success manager",
        values: [false, false, false, false, true],
      },
      {
        label: "Technical advisor",
        values: [false, false, false, false, true],
      },
    ],
  },
];

// Each column's call to action, as on the plan cards above, so a reader who
// decides partway down the table can act without scrolling back up.
const PLAN_CTAS: { label: string; href: string }[] = [
  { label: "Get started", href: SIGNUP_URL },
  { label: "Get started", href: SIGNUP_URL },
  { label: "Get started", href: SIGNUP_URL },
  { label: "Get started", href: SIGNUP_URL },
  { label: DEMO_CTA_LABEL, href: DEMO_URL },
];
// The recommended plan takes the filled button, matching its Popular tag.
const RECOMMENDED_INDEX = 2;

function PlanCta({ i, className = "" }: { i: number; className?: string }) {
  const cta = PLAN_CTAS[i];
  return (
    <a
      href={cta.href}
      className={`block rounded-lg border px-3 py-2 text-center text-sm transition-colors ${
        i === RECOMMENDED_INDEX
          ? "border-transparent bg-foreground text-background hover:opacity-90"
          : "border-foreground/20 text-foreground hover:bg-foreground/5"
      } ${className}`}
    >
      {cta.label}
    </a>
  );
}

// Column index of the Free plan — hidden for signed-in visitors, mirroring the
// pricing cards.
const FREE_INDEX = 0;

// Static grid classes (Tailwind can't see runtime-built arbitrary values, so
// both column counts must appear literally). Five plan columns by default; four
// when the Free column is hidden for signed-in visitors.
// gap-x: without it the columns share an edge, and a long rate ("+$29 yr /
// $39 mo") ran straight into the value beside it with no space between them.
// minmax(0,…) on every track: a bare `1fr` is `minmax(auto, 1fr)`, so one wide
// cell grew that row's columns — and because each row is its own grid, the row
// then no longer lined up with the header or its neighbours.
// Every column ships and the Free one is hidden by CSS for signed-in visitors,
// so the track count has to change with it — hence the data-authed variant
// rather than a runtime-picked class. Both literals appear here because
// Tailwind can't see a class name built at runtime.
const GRID =
  "grid grid-cols-[minmax(0,1.6fr)_repeat(5,minmax(0,1fr))] gap-x-4 [[data-authed='1']_&]:grid-cols-[minmax(0,1.6fr)_repeat(4,minmax(0,1fr))]";

function CheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 20 20"
      fill="none"
      className="shrink-0 text-foreground"
      aria-hidden
    >
      <circle cx="10" cy="10" r="9" className="fill-border" />
      <path
        d="M6 10l2.5 2.5L14 7.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Feature name with an optional tap/hover tooltip — shared by both layouts.
function RowLabel({ label, tooltip }: { label: string; tooltip?: string }) {
  return (
    // The icon sits in the text flow, not as a flex sibling: as a sibling, a
    // label that wrapped to two lines took the full column width and shoved the
    // icon out to the far right, away from the words it belongs to.
    // text-balance evens the wrapped lines so a trailing info icon joins the
    // last words instead of stranding itself on a line of its own.
    <div className="group relative text-balance pr-4 text-sm text-muted-foreground">
      <span>
        {label}
        {tooltip && (
          <button
            type="button"
            tabIndex={0}
            aria-label={`About ${label}`}
            className="ml-1.5 inline-flex translate-y-[2px] cursor-pointer text-muted-foreground/60 transition-colors hover:text-foreground"
          >
            <InfoIcon />
          </button>
        )}
      </span>
      {tooltip && (
        <span
          role="tooltip"
          className={`${TOOLTIP} w-max max-w-60`}
        >
          {tooltip}
        </span>
      )}
    </div>
  );
}

function CellContent({ value, plain }: { value: Cell; plain?: boolean }) {
  if (value === false) {
    return <span className="text-muted-foreground/40">—</span>;
  }
  // Rates and costs render as bare values so a check doesn't read as "included".
  // "Unlimited" and "Custom" are inclusions, not rates, so they keep their check
  // even in a plain row (matching the "Apps included → Unlimited" cell above).
  if (
    plain &&
    typeof value === "string" &&
    value !== "Unlimited" &&
    value !== "Custom"
  ) {
    return (
      <span className="text-balance text-sm text-muted-foreground">{value}</span>
    );
  }
  return (
    <span className="flex items-center gap-2 text-sm">
      <CheckIcon />
      {typeof value === "string" && (
        <span className="text-muted-foreground">{value}</span>
      )}
    </span>
  );
}

export function FeatureComparison() {
  // Mobile can't fit five columns, so it shows one plan at a time (Shopify-style
  // tabs); desktop keeps the full side-by-side table.
  const [plan, setPlan] = useState(0);
  // Collapsed by default so the long table doesn't overwhelm — a toggle reveals
  // the full comparison (best-in-class progressive disclosure).
  const [expanded, setExpanded] = useState(false);
  const toggle = () => setExpanded((e) => !e);
  // Every column is rendered; the Free one carries `unauth-only` so CSS drops
  // it for signed-in visitors before first paint (matches the pricing cards).
  const columns = PLAN_NAMES.map((name, i) => ({
    name,
    i,
    // A class, not a filter — see globals.css.
    cls: i === FREE_INDEX ? "unauth-only" : undefined,
  }));
  // Behaviour, not markup, so this one genuinely needs the hook: a signed-in
  // visitor must not be left on the Free tab once its column is hidden. `ready`
  // gates it so the tab doesn't jump before the state is known.
  const { authed, ready } = useAuthState();
  const freeHidden = ready && authed;
  const activePlan = freeHidden && plan === FREE_INDEX ? FREE_INDEX + 1 : plan;

  return (
    // cursor-default so hovering the comparison text shows an arrow, not the
    // text/I-beam cursor (this table is read-only, not editable).
    <div className="cursor-default">
      {/* The toggle stays put: it's the control the reader opened the table with,
          so it's the one that closes it. It used to move to the foot of the table
          when open, which meant closing happened thousands of pixels from where
          opening did — and the page then had to scroll itself back to the top to
          avoid stranding the reader in the space the table left behind. */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={toggle}
          aria-expanded={expanded}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm text-foreground transition-colors hover:bg-muted sm:w-auto [[data-theme=dark]_&]:border-[#383838]"
        >
          {expanded ? "Hide comparison" : "Compare all features"}
          {/* The site's chevron rule (see the FAQ rows): 90° of travel, not a
              full flip, at the drawer's own 300ms. Right at rest, down when open,
              so the arrow points the way the content arrives from. */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden
            className={`transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
              expanded ? "rotate-0" : "-rotate-90"
            }`}
          >
            <path
              d="M5 8l5 5 5-5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {expanded && (
        <>
          <h2 className={`type-h3 mt-14 ${PLAN_TABLE_BLEED}`}>Compare plans</h2>
          {/* Filled in dark, like the plan cards above it: on the page's own
              near-black the table was a field of hairlines with nothing behind
              them, and the rows were hard to hold onto while reading across.
              Every opaque bar inside it (the sticky header, its mask, the mobile
              tabs) has to take the same fill or it bands against the card. */}
          {/* pb-2, not pb-8: every row carries its own 14px, so a large pad under
              the last one left a band of empty card below "Technical advisor"
              nearly twice the gap between any two rows. */}
          <div className={`mt-8 ${PLAN_TABLE_BLEED} overflow-clip rounded-2xl border border-border px-6 pb-2 md:px-8 lg:pb-0 [[data-theme=dark]_&]:border-[#383838] [[data-theme=dark]_&]:bg-card`}>
      {/* Mobile: plan tabs + a single-column feature list for the chosen plan. */}
      <div className="lg:hidden">
        {/* Scrollable plan tabs, pinned under the nav so they stay reachable as
            you read down the list. */}
        {/* overflow-y-hidden: overflow-x-auto alone also makes this a vertical
            scroll container, and the -mb-px underline trick let it scroll up
            by a pixel-high strip. */}
        <div className="-mx-6 flex gap-6 overflow-x-auto overflow-y-hidden border-b border-border bg-background px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [[data-theme=dark]_&]:bg-card">
          {columns.map(({ name, i, cls }) => (
            <button
              key={name}
              type="button"
              aria-pressed={activePlan === i}
              onClick={() => setPlan(i)}
              className={`-mb-px shrink-0 border-b pb-3 pt-6 text-base font-medium transition-colors ${
                cls ?? ""
              } ${
                activePlan === i
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground"
              }`}
            >
              {name}
            </button>
          ))}
        </div>

        {GROUPS.map((group) => (
          <div key={group.label}>
            <div className="pb-2 pt-8 text-sm font-medium text-foreground">
              {group.label}
            </div>
            {group.rows.map((row) => (
              <div
                key={row.label}
                className="-mx-6 flex items-center justify-between gap-4 border-t border-border px-6 py-3.5"
              >
                <RowLabel label={row.label} tooltip={row.tooltip} />
                <div className="w-36 shrink-0 text-left">
                  <CellContent value={row.values[activePlan]} plain={row.plain} />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Desktop: full side-by-side table. */}
      <div className="hidden lg:block">
        {/* -mb-px with the card's lg:pb-0: the pinned header stops at the
            bottom of this box, so when it comes to rest at the end of the
            table its rule lands on the card's own border (and is clipped
            there) instead of doubling it 8px above. */}
        <div className="-mb-px min-w-0">
          {/* Sticky plan header, inside the bordered card. Sticks just below the
              floating nav; an opaque bg masks rows scrolling behind it. Negative
              margins cancel the card's padding so the bottom divider runs
              full-bleed to the card's side borders, while px re-insets the grid
              content so the columns stay aligned with the rows below. */}
          {/* Sticky header, compact. An opaque bar pinned directly above it
              (bottom-full, connected — no gap) masks rows behind the
              semi-transparent nav once stuck; overflow-clip on the card hides
              that bar at rest. */}
          <div
            className={`${GRID} sticky top-16 z-10 -mx-6 items-end border-b border-border bg-background px-6 pb-4 pt-6 md:-mx-8 md:px-8 [[data-theme=dark]_&]:border-[#383838] [[data-theme=dark]_&]:bg-card`}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-full h-20 bg-background [[data-theme=dark]_&]:bg-card"
            />
            {/* A quiet column label, a step below the plan names so it
                doesn't compete with them. */}
            <div className="pb-2 text-sm text-muted-foreground">Features</div>
            {columns.map(({ name, i, cls }) => (
              <div key={name} className={cls}>
                <div className="text-lg font-normal">{name}</div>
                <PlanCta i={i} className="mt-3" />
              </div>
            ))}
          </div>

          {/* Groups */}
          {GROUPS.map((group) => (
            <Fragment key={group.label}>
              <div className="px-0 pb-2 pt-10 text-sm font-medium text-foreground">
                {group.label}
              </div>
              {group.rows.map((row) => (
                <div
                  key={row.label}
                  className={`${GRID} items-center border-t border-border py-3.5`}
                >
                  <RowLabel label={row.label} tooltip={row.tooltip} />
                  {columns.map(({ i, cls }) => (
                    <div key={i} className={cls}>
                      <CellContent value={row.values[i]} plain={row.plain} />
                    </div>
                  ))}
                </div>
              ))}
            </Fragment>
          ))}
        </div>
      </div>
          </div>
        </>
      )}
    </div>
  );
}
