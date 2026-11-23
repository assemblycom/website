"use client";

import { useId } from "react";
import type React from "react";
import Link from "next/link";
import type { Template } from "@/lib/templates";
import {
  CardApprovalList,
  CardApproveSheet,
  CardCaseTags,
  CardAssistantAsk,
  CardAutoReply,
  CardCommentThread,
  CardConditionFlow,
  CardCalendarAgenda,
  CardResourceArticle,
  CardTaskList,
  CardDocumentAdd,
  CardEngagementRing,
  CardExportProgress,
  CardFormFields,
  CardFileChip,
  CardHomeWaiting,
  CardMarkupPopover,
  CardMessageBubble,
  CardMonthGrid,
  CardProfileList,
  CardProposalPanel,
  CardResourceGuide,
  CardHelpdeskStat,
  CardOnboardingSteps,
  CardIntakeSentence,
  CardTrackerBar,
  V69CardMock,
} from "@/components/home/hero-v71";
import { MockFit, MOCK_DESIGN_SIZE } from "@/components/templates/mock-fit";
import { useTheme } from "@/components/theme/theme-provider";
import { cn } from "@/lib/utils";

// Tile shape per widget, so the grid mixes circles, wide strips and squares
// rather than repeating one box: round readouts go in a circle, single-row
// widgets in a wide strip, everything else in a square.
type TileShape = "square" | "circle" | "wide";
const TILE_SHAPE: Record<string, TileShape> = {
  "time-tracker": "circle",
  "client-engagement-dashboard": "circle",
  "data-room": "wide",
  "service-request-intake": "wide",
  "internal-resource-library": "wide",
  "contracts-app": "wide",
  xero: "wide",
};
// Brand ambient backgrounds (the "Gradients / Ambient Backgrounds" page of the
// identity): the symbol's bars lit from inside by an edge colour and a softer
// inner glow. Same colour pairs as the ambient-background tool; first colour
// is the edge.
// Light page: dark ground. Dark page: the light ground, so the cards still
// stand off the page. Each skin has its own colour pairs, as in the tool.
const AMBIENT = {
  dark: {
    bg: "#101010",
    pairs: [
      ["#C6B6FF", "#7DA4FF"], // lavender, blue
      ["#BCE7F4", "#7DA4FF"], // ice, blue
      ["#7DA4FF", "#5CE5C3"], // blue, mint
      ["#FFDCF8", "#C6B6FF"], // pink, lavender
    ],
    edgeBlur: 26,
    innerBlur: 90,
  },
  light: {
    bg: "#F7F7F4",
    pairs: [
      ["#C6B6FF", "#7DA4FF"], // lavender, blue
      ["#5CE5C3", "#BCE7F4"], // mint, ice
      ["#7DA4FF", "#5CE5C3"], // blue, mint
      ["#FF8C8C", "#FFDCF8"], // coral, pink
    ],
    // On the light ground the colour runs wide from the edge and fades to
    // the ground in the middle, so the edge glow is the broad one.
    edgeBlur: 60,
    innerBlur: 110,
  },
} as const;
type AmbientSkin = keyof typeof AMBIENT;
// Quarter turns and a mirror, so neighbouring cards don't repeat a layout.
const AMBIENT_TURNS = [
  "",
  "scale(-1 1) translate(-400 0)",
  "rotate(90 200 200)",
  "rotate(180 200 200)",
];

// Stable per-template pick, so a card keeps its colours across renders.
function ambientIndex(slug: string, length: number) {
  let hash = 0;
  for (const ch of slug) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return hash % length;
}

function AmbientBars() {
  return (
    <>
      <path d="M-120 520 L170 230 Q220 180 290 180 H560 V560 Z" fill="#000" />
      <path d="M40 600 L290 350 Q340 300 410 300 H600 V600 Z" fill="#000" />
    </>
  );
}

/** Two stepped bars from the symbol, each with a 45 degree edge and one
 *  rounded corner, cropped by the frame and glowing from their edges in. */
// Cards whose ground takes the identity's progressive blur and grain. The rest
// keep crisp bars.
const SOFT_GROUNDS = new Set(["time-tracker"]);
// Cards whose bars take wider inner shadows, so the colour glows deep into
// each bar instead of hugging its edge.
const WIDE_GLOW: Record<string, number> = { "document-collection": 2.2 };
// Cards that keep crisp bars but take the identity's grain over them.
const GRAIN_GROUNDS = new Set(["client-project-tracker"]);

function AmbientBackdrop({
  slug,
  skin,
  className,
}: {
  slug: string;
  skin: AmbientSkin;
  className: string;
}) {
  const soft = SOFT_GROUNDS.has(slug);
  const grain = GRAIN_GROUNDS.has(slug);
  const id = useId().replace(/:/g, "");
  const glow = WIDE_GLOW[slug] ?? 1;
  const { bg, pairs } = AMBIENT[skin];
  const edgeBlur = AMBIENT[skin].edgeBlur * glow;
  const innerBlur = AMBIENT[skin].innerBlur * glow;
  const [edge, inner] = pairs[ambientIndex(slug, pairs.length)];
  const turn =
    AMBIENT_TURNS[ambientIndex(`${slug}-turn`, AMBIENT_TURNS.length)];
  const inset = (blur: number, color: string, key: string) => `
    <feGaussianBlur in="SourceAlpha" stdDeviation="${blur}" result="g${key}"/>
    <feComposite in="SourceAlpha" in2="g${key}" operator="out" result="m${key}"/>
    <feFlood flood-color="${color}"/>
    <feComposite in2="m${key}" operator="in" result="s${key}"/>`;
  return (
    <svg
      aria-hidden
      viewBox="0 0 400 400"
      preserveAspectRatio="xMidYMid slice"
      className={`absolute inset-0 size-full ${className}`}
    >
      <defs
        dangerouslySetInnerHTML={{
          __html: `<filter id="${id}" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB">
            <feFlood flood-color="${bg}"/><feComposite in2="SourceAlpha" operator="in" result="fill"/>
            ${inset(innerBlur, inner, "i")}
            ${inset(edgeBlur, edge, "e")}
            <feMerge><feMergeNode in="fill"/><feMergeNode in="si"/><feMergeNode in="se"/></feMerge>
          </filter>
          <filter id="${id}-soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="14"/>
          </filter>
          <linearGradient id="${id}-ramp" gradientUnits="userSpaceOnUse" x1="380" y1="170" x2="40" y2="520">
            <stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/>
          </linearGradient>
          <mask id="${id}-sharp" maskUnits="userSpaceOnUse" x="-200" y="-200" width="800" height="800">
            <rect x="-200" y="-200" width="800" height="800" fill="url(#${id}-ramp)"/>
          </mask>
          <filter id="${id}-grain" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
            <feColorMatrix type="saturate" values="0"/>
          </filter>`,
        }}
      />
      <rect width="400" height="400" fill={bg} />
      {soft ? (
        <>
          {/* Progressive blur, as in the identity: the bars are drawn twice, a
              softened copy underneath and the sharp copy faded out along them,
              so they start crisp at the rounded corner and dissolve toward the
              far end. */}
          <g transform={turn || undefined}>
            <g filter={`url(#${id}-soft)`}>
              <g filter={`url(#${id})`}>
                <AmbientBars />
              </g>
            </g>
            <g mask={`url(#${id}-sharp)`}>
              <g filter={`url(#${id})`}>
                <AmbientBars />
              </g>
            </g>
          </g>
          {/* Mono grain over the whole ground, the identity's finishing
              texture. */}
          <rect
            width="400"
            height="400"
            filter={`url(#${id}-grain)`}
            opacity={skin === "dark" ? 0.07 : 0.05}
            style={{ mixBlendMode: skin === "dark" ? "screen" : "multiply" }}
          />
        </>
      ) : (
        <>
          <g filter={`url(#${id})`} transform={turn || undefined}>
            <AmbientBars />
          </g>
          {grain && (
            <rect
              width="400"
              height="400"
              filter={`url(#${id}-grain)`}
              opacity={skin === "dark" ? 0.07 : 0.05}
              style={{ mixBlendMode: skin === "dark" ? "screen" : "multiply" }}
            />
          )}
        </>
      )}
    </svg>
  );
}

// Cards that show only their ambient ground for now, with no widget on it.
const GROUND_ONLY = new Set<string>([]);

// Widgets whose rows sit straight on their ground with no panel of their own:
// the whole tile becomes their glass panel so the text has something to sit on.
const PANEL_TILES = new Set([
  "client-project-tracker",
  "design-approvals",
  "client-engagement-dashboard",
  "deals-pipeline",
  "client-calendar",
  "document-collection",
  "client-resource-library",
  "client-ai-assistant",
  "new-client-intake",
  "tasks",
  "files-app",
  "messaging-app",
  "client-onboarding-wizard",
  "content-approval-flow",
  "client-support-requests",
  "markup-comments",
  "internal-communications-app",
  "internal-resource-library",
  "events-rsvps",
  "proposal-builder",
  "conditional-forms",
  "case-status-page",
  "forms-app",
  "message-autoresponder",
  "profile-manager",
  "exporter",
  "client-home",
]);

// Widgets that are a single object (the clock face) read small at the shared
// tile size, so they take a larger share of the cover.
const TILE_SIZE: Record<string, string> = {
  // A whole widget panel, a little larger than the shared tile.
  "client-project-tracker": "!w-[66%] !rounded-[11%]",
  // The wallet sits 16px in from its tile, so its tile is larger by that
  // inset to land the wallet on the tracker panel's 66%.
  "billing-app": "!w-[74.25%]",
  "time-tracker": "!w-[66%]",
  // Same panel as the wallet beside it: 66% of the cover, the wallet's corner.
  "deals-pipeline": "!w-[66%] !rounded-[7%]",
  "document-collection": "!w-[66%] !rounded-[11%]",
  "client-resource-library": "!w-[66%] !rounded-[11%]",
  "client-ai-assistant": "!w-[66%] !rounded-[11%]",
  "new-client-intake": "!w-[66%] !rounded-[11%]",
  tasks: "!w-[66%] !rounded-[11%]",
  "client-calendar": "!w-[66%] !rounded-[11%]",
  "events-rsvps": "!w-[66%] !rounded-[11%]",
  "files-app": "!w-[66%] !rounded-[11%]",
  "proposal-builder": "!w-[66%] !rounded-[11%]",
  "messaging-app": "!w-[66%] !rounded-[11%]",
  "conditional-forms": "!w-[66%] !rounded-[11%]",
  "case-status-page": "!w-[66%] !rounded-[11%]",
  "forms-app": "!w-[66%] !rounded-[11%]",
  "message-autoresponder": "!w-[66%] !rounded-[11%]",
  "profile-manager": "!w-[66%] !rounded-[11%]",
  "exporter": "!w-[66%] !rounded-[11%]",
  "client-home": "!w-[66%] !rounded-[11%]",
  "client-onboarding-wizard": "!w-[66%] !rounded-[11%]",
  "design-approvals": "!w-[66%] !rounded-[11%]",
  "content-approval-flow": "!w-[66%] !rounded-[11%]",
  "client-support-requests": "!w-[66%] !rounded-[11%]",
  "markup-comments": "!w-[66%] !rounded-[11%]",
  "internal-communications-app": "!w-[66%] !rounded-[11%]",
};

// The time tracker's round tile reads as a watch face: a minute track round
// the rim, with the hours drawn longer and stronger.
const DIAL_TICKS = 60;
const DIAL_HOUR_EVERY = 5;

function ClockDial({ skin }: { skin: AmbientSkin }) {
  const ink = skin === "dark" ? "255,255,255" : "16,24,40";
  return (
    <svg viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
      {Array.from({ length: DIAL_TICKS }, (_, i) => {
        const hour = i % DIAL_HOUR_EVERY === 0;
        return (
          <line
            key={i}
            x1="50"
            y1={hour ? 4.5 : 5}
            x2="50"
            y2={hour ? 10 : 7.5}
            stroke={`rgba(${ink},${hour ? 0.55 : 0.22})`}
            strokeWidth={hour ? 0.9 : 0.5}
            strokeLinecap="round"
            transform={`rotate(${(i * 360) / DIAL_TICKS} 50 50)`}
          />
        );
      })}
    </svg>
  );
}

const TILE_CLASS: Record<TileShape, string> = {
  square: "aspect-square w-[60%] rounded-[18px]",
  circle: "aspect-square w-[60%] rounded-full",
  wide: "aspect-[16/10] w-[84%] rounded-[18px]",
};
// A wide tile draws its cover in the 16:10 box the phone gallery already uses.
const WIDE_DESIGN_SIZE = {
  "--template-mock-w": "336px",
  "--template-mock-h": "210px",
} as React.CSSProperties;

/**
 * One template card: the widget cover, the name, and the line under it. The
 * /templates gallery and a detail page's Works with row both render this, so
 * the two can't drift into two drawings of the same card.
 *
 * `chip` is the site's standard tag chip under the text, for a row that needs
 * to say something about a card (the Works with row marks internal-only apps).
 */
export function TemplateCard({
  template,
  chip,
  className,
}: {
  template: Template;
  chip?: string;
  className?: string;
}) {
  const shape = TILE_SHAPE[template.slug] ?? "square";
  // The widget takes the opposite skin to the page: dark on the light page's
  // dark card, light on the dark page's light card.
  const { theme } = useTheme();
  const skin = theme === "dark" ? "light" : "dark";
  return (
    <article className={cn("w-full", className)}>
      <Link
        href={`/templates/${template.slug}`}
        className="group/card block outline-none"
      >
        {/* The cover: a brand ambient background with the widget centred on
            it. The tile is a share of the cover, so it grows and shrinks with
            the column while the cover keeps its square. */}
        <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[20px] transition-transform group-focus-visible/card:ring-2 group-focus-visible/card:ring-foreground/40 group-focus-visible/card:ring-offset-4 group-focus-visible/card:ring-offset-background">
          {/* Both skins are drawn and the page theme picks one, so the right
              one is there on first paint. */}
          <AmbientBackdrop
            slug={template.slug}
            skin="dark"
            className="[[data-theme=dark]_&]:hidden"
          />
          <AmbientBackdrop
            slug={template.slug}
            skin="light"
            className="hidden [[data-theme=dark]_&]:block"
          />
          {!GROUND_ONLY.has(template.slug) && (
            <div
              className={`relative ${TILE_CLASS[shape]} ${TILE_SIZE[template.slug] ?? ""}`}
            >
              {/* The island resets the page theme for the widget, so its
                skin follows the card rather than the page. */}
              <div
                data-theme={skin}
                className={`mock-island ${skin}-island absolute inset-0 overflow-hidden rounded-[inherit] ${
                  PANEL_TILES.has(template.slug) ? "mock-panel" : ""
                }`}
              >
                <MockFit
                  style={shape === "wide" ? WIDE_DESIGN_SIZE : undefined}
                  className={`relative h-full w-full overflow-hidden ${
                    shape === "wide"
                      ? ""
                      : `template-mock-tile ${MOCK_DESIGN_SIZE[template.slug] ?? ""}`
                  }`}
                >
                  <div
                    className={`template-mock template-mock-gallery font-sans ${
                      skin === "dark" ? "v72-mock-dark" : ""
                    }`}
                  >
                    {template.slug === "client-project-tracker" ? (
                      <CardTrackerBar />
                    ) : template.slug === "client-engagement-dashboard" ? (
                      <CardEngagementRing />
                    ) : template.slug === "tasks" ? (
                      <CardTaskList />
                    ) : template.slug === "new-client-intake" ? (
                      <CardIntakeSentence />
                    ) : template.slug === "client-ai-assistant" ? (
                      <CardAssistantAsk />
                    ) : template.slug === "client-resource-library" ? (
                      <CardResourceArticle />
                    ) : template.slug === "document-collection" ? (
                      <CardDocumentAdd />
                    ) : template.slug === "forms-app" ? (
                      <CardFormFields />
                    ) : template.slug === "message-autoresponder" ? (
                      <CardAutoReply />
                    ) : template.slug === "profile-manager" ? (
                      <CardProfileList />
                    ) : template.slug === "exporter" ? (
                      <CardExportProgress />
                    ) : template.slug === "case-status-page" ? (
                      <CardCaseTags />
                    ) : template.slug === "conditional-forms" ? (
                      <CardConditionFlow />
                    ) : template.slug === "messaging-app" ? (
                      <CardMessageBubble />
                    ) : template.slug === "proposal-builder" ? (
                      <CardProposalPanel />
                    ) : template.slug === "client-home" ? (
                      <CardHomeWaiting />
                    ) : template.slug === "files-app" ? (
                      <CardFileChip />
                    ) : template.slug === "client-calendar" ? (
                      <CardMonthGrid />
                    ) : template.slug === "events-rsvps" ? (
                      <CardCalendarAgenda />
                    ) : template.slug === "internal-resource-library" ? (
                      <CardResourceGuide />
                    ) : template.slug === "markup-comments" ? (
                      <CardMarkupPopover />
                    ) : template.slug === "internal-communications-app" ? (
                      <CardCommentThread />
                    ) : template.slug === "client-support-requests" ? (
                      <CardHelpdeskStat />
                    ) : template.slug === "content-approval-flow" ? (
                      <CardApproveSheet />
                    ) : template.slug === "design-approvals" ? (
                      <CardApprovalList />
                    ) : template.slug === "client-onboarding-wizard" ? (
                      <CardOnboardingSteps />
                    ) : (
                      <V69CardMock slug={template.slug} />
                    )}
                  </div>
                </MockFit>
                {template.slug === "time-tracker" && <ClockDial skin={skin} />}
              </div>
            </div>
          )}
        </div>
        {/* Name and line under the cover, on the site's body and caption
            steps, both at 400. */}
        <h3 className="type-body mt-4 text-foreground">{template.title}</h3>
        <p className="type-caption mt-1 text-muted-foreground">
          {template.description}
        </p>
        {chip && (
          <span className="mt-3 inline-flex rounded-md bg-muted px-2.5 py-1 font-mono text-xs uppercase tracking-wide text-muted-foreground [[data-theme=dark]_&]:bg-white/[0.08]">
            {chip}
          </span>
        )}
      </Link>
    </article>
  );
}
