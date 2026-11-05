"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { ProductionGap, type RegionId } from "@/components/home/production-gap";
import { OnboardingTrackerMock } from "@/components/client-portal/segment-mock";
import {
  Seal,
  SECURITY_STANDARDS,
} from "@/components/security/security-compliance";
import {
  IconApp,
  IconBook,
  IconClock,
  IconPlus,
} from "@/components/home/mock-icons";
import { DescribeCard } from "@/components/client-portal/portal-build-cards";

// ─────────────────────────────────────────────────────────────────────────
// UNIFIED PLATFORM (V2) — a photograph per tab, filling the panel.
//
// The hand-built mocks that used to live here were removed. These are the
// site's own lifestyle photography from `public/images/mocks`, the set the
// product pages already use — people at work rather than pictures of the
// product, which is what the panel was asked for.
//
// THEY FILL THE PANEL, edge to edge (`flushVisual`), so the photograph IS the
// background and no blue shows. The blue is still painted underneath, so it
// covers the moment between the panel laying out and the image decoding.
//
// A STAND-IN, chosen for what each one is OF rather than art-directed for this
// section: the CRM shot for the foundation tab, two people working for the
// ready-made apps, hands at a laptop for the builder, and the sign-in field
// for security. No photograph is used twice on the page.
// ─────────────────────────────────────────────────────────────────────────

/** One photograph per tab, keyed by the region ids in production-gap.tsx. */
const SHOTS: Record<RegionId, { src: string; alt: string }> = {
  url: {
    src: "/images/mocks/crm-bg.webp",
    alt: "Someone working at a laptop in a sunlit booth",
  },
  sidebar: {
    src: "/images/mocks/support-desk.webp",
    alt: "Two people working together at a desk",
  },
  builder: {
    src: "/images/mocks/hosted-mvp-bg.jpg",
    alt: "Someone working at a laptop, mid-gesture",
  },
  avatar: {
    src: "/images/mocks/sign-in-bg.jpg",
    alt: "Hands drawing on a canvas in afternoon light",
  },
};

// ─────────────────────────────────────────────────────────────────────────
// ONE SCREEN PER TAB, over the photograph.
//
// The photographs say who each step is for; they cannot say what the step
// IS. A picture of someone at a laptop is the same picture whichever of the
// four claims it sits under, so the panel was changing image without
// changing subject. Each tab now carries the product screen its sentence is
// about, laid over the shot the way the four-steps section does it.
//
// NOT EVERY TAB WANTS A WINDOW. The foundation claim is about a product you
// log into, so it gets the screen, bled off the right and the foot so it
// reads as continuing past the frame rather than as a card floating on a
// photograph. The other three are claims about a handful of things — some
// apps, a sentence you type, four certifications — and wrapping any of them
// in a chrome-heavy window was drawing a big sheet of white to hold an
// object the size of a button. Those sit straight on the picture.
/**
 * The window the one windowed tab is drawn in.
 *
 * Deliberately larger than the space it is given — the panel is ~452 tall and
 * this starts 64px down — so the bottom and the right run off the frame and
 * are cropped by it.
 */
const UI_BOX = "h-[480px] w-[900px]";

/** The portal apps named on the pills, with the icon each one carries. */
const APP_PILLS = [
  { label: "Onboarding", icon: <IconApp className="size-4" /> },
  { label: "Invoices", icon: <IconClock className="size-4" /> },
  { label: "Documents", icon: <IconBook className="size-4" /> },
];

/**
 * Three apps as squarish pills, and the row that says there are more.
 *
 * The claim is "30+ ready-made apps", and the honest picture of that is a few
 * of them named — not one of them opened, which is a picture of a helpdesk.
 * Glassy rather than solid so the photograph stays visible through them and
 * they read as laid on it.
 */
function AppPills() {
  return (
    <div className="flex w-[260px] flex-col gap-2.5">
      {APP_PILLS.map((app) => (
        <span
          key={app.label}
          className="flex items-center gap-3 rounded-xl border border-white/25 bg-white/15 px-4 py-3 text-[15px] text-white backdrop-blur-md"
        >
          <span className="text-white/80">{app.icon}</span>
          {app.label}
        </span>
      ))}
      <span className="flex items-center gap-3 rounded-xl border border-dashed border-white/25 px-4 py-3 text-[15px] text-white/70">
        <IconPlus className="size-4" />
        27 more
      </span>
    </div>
  );
}

/**
 * The four certifications, as the marks alone.
 *
 * The same seals the band at the foot of the page draws; here they have no
 * band, no dividers and no card — the photograph is the ground. White at a
 * low alpha rather than the band's grey, because these sit on a picture.
 */
function SecuritySeals() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
      {SECURITY_STANDARDS.map((s) => (
        <span key={s.title} className="flex flex-col items-center gap-3">
          <span className="text-white [&_span]:border-white/40 [&_span]:bg-transparent [&_span]:text-white/90">
            <Seal label={s.seal} />
          </span>
          <span className="text-[13px] text-white">{s.title}</span>
        </span>
      ))}
    </div>
  );
}

interface TabScreen {
  node: ReactNode;
  /** Draws it in the cropped product window. Off = straight on the photo. */
  windowed?: boolean;
}

const SCREENS: Record<RegionId, TabScreen> = {
  // A client's portal: the firm's nav down the side, their own people and
  // companies in it. The CRM and the client experience in one picture, and
  // the one claim here that is genuinely about a screen.
  url: { node: <OnboardingTrackerMock />, windowed: true },
  // A few of the apps, named. See AppPills.
  sidebar: { node: <AppPills /> },
  // The composer, and nothing holding it. It is one field: a window around
  // it was a sheet of white with a text box in the middle of it.
  builder: {
    node: (
      <div className="w-[560px] max-w-full [&_.template-mock-fit>div>div]:my-auto!">
        <DescribeCard
          plain
          prompt="Add a project tracker each client sees for their own projects."
        />
      </div>
    ),
  },
  // The certifications, on the picture. See SecuritySeals.
  avatar: { node: <SecuritySeals /> },
};

function Screen({ active }: { active: RegionId }) {
  const screen = SCREENS[active];
  return (
    <>
      {/* The photographs are bright and everything laid over them is light,
          so they need a ground to sit against — the same scrim the four-steps
          panel puts under its own screens. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(16,24,40,0.34),rgba(16,24,40,0.46))]"
      />
      {screen.windowed ? (
        // Anchored, not inset: top and left only, with no right or bottom, so
        // the box below keeps its own size and the panel crops it. The inset
        // is deep enough that the photograph still reads as the ground the
        // screen is sitting on rather than a hairline around it.
        <div className="absolute left-8 top-8 md:left-20 md:top-16">
          <div
            className={`relative overflow-hidden rounded-tl-xl border-l border-t border-[var(--mock-line)] bg-[var(--mock-window)] shadow-[0_24px_60px_-20px_rgba(16,24,40,0.45)] ${UI_BOX}`}
          >
            {screen.node}
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center p-6 md:p-10">
          {screen.node}
        </div>
      )}
    </>
  );
}

function Shot({ active }: { active: RegionId }) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      {Object.entries(SHOTS).map(([id, shot]) => (
        <Image
          key={id}
          src={shot.src}
          alt={id === active ? shot.alt : ""}
          aria-hidden={id !== active}
          fill
          // `cover`, centred. These are photographs with their subject in the
          // middle of the frame — the top-left anchor the UI screenshots
          // wanted would crop the person out of two of the four.
          className={`object-cover object-center transition-opacity duration-500 ease-out motion-reduce:transition-none ${
            id === active ? "opacity-100" : "opacity-0"
          }`}
          sizes="(max-width: 768px) 100vw, 60vw"
          priority={false}
        />
      ))}
      <Screen active={active} />
    </div>
  );
}

export function UnifiedPlatform() {
  return (
    <ProductionGap
      bleedBottom
      framed
      flushVisual
      // The step list here is a narrow framed column beside a full-bleed
      // photograph, where the shipped copy ran five lines deep on the open
      // step and pushed the three closed steps down the card. Same claims,
      // fewer words — see `shortBody` in production-gap.tsx.
      concise
      renderVisual={(active) => <Shot active={active} />}
    />
  );
}
