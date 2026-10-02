"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ApprovalsMock,
  DocumentsMock,
  OnboardingMock,
  ProgressMock,
} from "@/components/client-portal/segment-mock";
import { IconArrowUp } from "@/components/home/build-step-visual";
import { getTemplateBySlug } from "@/lib/templates";

// ─────────────────────────────────────────────────────────────────────────
// The hero's product shot: one grey panel holding the app the reader picked,
// named top left, shown as a single window in the middle, with the row of
// apps to pick from along the bottom. Nothing moves on its own.
// ─────────────────────────────────────────────────────────────────────────

type Item = {
  key: string;
  title: string;
  description: string;
  /**
   * "fill" mocks bring their own ground, "inset" ones sit padded in the
   * window, and "bare" ones skip the window and sit on the panel itself.
   */
  frame: "fill" | "inset" | "bare";
  mock: ReactNode;
};

// Titles and descriptions come from the template data, so they cannot drift
// from /templates. The AI builder leads, since building your own is what
// sets this portal apart; it has no template.
function templateItem(
  slug: string,
  frame: Item["frame"],
  mock: ReactNode,
): Item | null {
  const t = getTemplateBySlug(slug);
  return t
    ? { key: slug, title: t.title, description: t.description, frame, mock }
    : null;
}

const ITEMS: Item[] = [
  {
    key: "your-own",
    // Copy review: the label, its line and the prompt in PromptMock are mine,
    // not the brief's.
    title: "Your own app",
    description: "Described in a sentence, built by AI",
    frame: "bare" as const,
    mock: <PromptMock />,
  },
  templateItem("content-approval-flow", "fill", <ApprovalsMock />),
  templateItem("client-onboarding-wizard", "fill", <OnboardingMock />),
  templateItem("document-collection", "inset", <DocumentsMock />),
  templateItem("client-project-tracker", "inset", <ProgressMock />),
].filter((item): item is Item => item !== null);

// Design size of the window. Below the breakpoint it is drawn narrower before
// it is scaled, so the mock reflows instead of shrinking to fine print.
const WINDOW_W = 560;
const WINDOW_H = 340;
const COMPACT_WINDOW_W = 360;
const COMPACT_WINDOW_H = 270;
const COMPACT_BELOW_PX = 640;
const STAGE_PAD_Y = 72;
const COMPACT_STAGE_PAD_Y = 24;
const STAGE_PAD_X = 20;

type Fit = { w: number; h: number; scale: number; padY: number };

function fitFor(panelW: number): Fit {
  const compact = panelW < COMPACT_BELOW_PX;
  const w = compact ? COMPACT_WINDOW_W : WINDOW_W;
  const h = compact ? COMPACT_WINDOW_H : WINDOW_H;
  return {
    w,
    h,
    scale: Math.min(1, (panelW - 2 * STAGE_PAD_X) / w),
    padY: compact ? COMPACT_STAGE_PAD_Y : STAGE_PAD_Y,
  };
}

export function PortalHeroCarousel() {
  const [active, setActive] = useState(0);
  const [fit, setFit] = useState<Fit | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const apply = () => setFit(fitFor(el.clientWidth));
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const F = fit ?? fitFor(1320);
  const current = ITEMS[active];

  return (
    <div
      ref={panelRef}
      className="mt-12 overflow-hidden rounded-[28px] bg-neutral-100 md:mt-16 [[data-theme=dark]_&]:bg-white/[0.06]"
      style={{ opacity: fit ? 1 : 0 }}
    >
      <div className="px-6 pt-6 md:px-10 md:pt-8" aria-live="polite">
        <p className="text-base text-foreground">{current.title}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {current.description}
        </p>
      </div>

      <div
        role="tabpanel"
        id="portal-hero-panel"
        aria-label={current.title}
        className="relative"
        style={{ height: F.h * F.scale + 2 * F.padY }}
      >
        {ITEMS.map((item, i) => (
          <div
            key={item.key}
            aria-hidden={i !== active}
            className={`absolute left-1/2 top-1/2 transition-opacity duration-500 motion-reduce:transition-none ${
              i === active ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            style={{
              width: F.w,
              height: F.h,
              marginLeft: -F.w / 2,
              marginTop: -F.h / 2,
              scale: String(F.scale),
            }}
          >
            <Window item={item} />
          </div>
        ))}
      </div>

      {/* Centred on wide screens; on a phone the row scrolls sideways rather
          than wrapping to a second line. */}
      <div
        role="tablist"
        aria-label="Apps in the portal"
        className="flex gap-1 overflow-x-auto px-6 pb-6 [scrollbar-width:none] md:justify-center md:px-10 md:pb-8 [&::-webkit-scrollbar]:hidden"
      >
        {ITEMS.map((item, i) => (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-controls="portal-hero-panel"
            onClick={() => setActive(i)}
            onKeyDown={(e) => {
              const dir =
                e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
              if (!dir) return;
              const next = (i + dir + ITEMS.length) % ITEMS.length;
              setActive(next);
              const tabs = e.currentTarget.parentElement?.children;
              (tabs?.[next] as HTMLElement | undefined)?.focus();
            }}
            tabIndex={i === active ? 0 : -1}
            className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-colors duration-300 ${
              i === active
                ? "border-border bg-background text-foreground shadow-[0_1px_2px_rgba(16,24,40,0.06)] [[data-theme=dark]_&]:border-white/15 [[data-theme=dark]_&]:bg-white/[0.06]"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {item.title}
          </button>
        ))}
      </div>
    </div>
  );
}

function Window({ item }: { item: Item }) {
  if (item.frame === "bare") return <>{item.mock}</>;
  return (
    <div
      className={`h-full w-full overflow-hidden rounded-2xl bg-background shadow-[0_1px_2px_rgba(16,24,40,0.04),0_18px_40px_-28px_rgba(16,24,40,0.28)] [[data-theme=dark]_&]:shadow-[0_24px_60px_-24px_rgba(0,0,0,0.6)] ${
        item.frame === "inset" ? "p-6" : ""
      }`}
    >
      {item.mock}
    </div>
  );
}

/**
 * The builder's composer with a request for an app no template covers, set
 * straight on the panel: the point is that building starts from a sentence.
 */
function PromptMock() {
  return (
    <div aria-hidden className="flex h-full select-none items-center">
      <div className="w-full rounded-2xl bg-background p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] [[data-theme=dark]_&]:bg-white/[0.06]">
        <p className="min-h-[72px] text-[15px] leading-[1.6] text-foreground">
          Build a retainer tracker my clients can check their hours in.
        </p>
        <div className="mt-4 flex justify-end">
          <span className="flex size-8 items-center justify-center rounded-lg bg-foreground text-background">
            <IconArrowUp className="size-4" />
          </span>
        </div>
      </div>
    </div>
  );
}
