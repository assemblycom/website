"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { ProductionGap, type RegionId } from "@/components/home/production-gap";
import { PhoneShell } from "@/components/home/phone-shell";
import { TeamCrmVisual } from "@/components/home/team-crm-visual";
import {
  SECURITY_STANDARDS,
  Seal,
} from "@/components/security/security-compliance";
import { DescribeCard } from "@/components/client-portal/portal-build-cards";
import {
  MOCK_PRIMARY_STACKED,
  MOCK_SECONDARY,
  MOCK_TITLE,
} from "@/components/ui/mock-type";

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
// section: the CRM shot for the foundation tab, someone on a tablet for the
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
    src: "/images/mocks/ready-apps-tablet.webp",
    alt: "Someone sketching on a tablet against a red wall",
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
// A PHONE GETS A SMALLER WINDOW. The panel is ~342x320 there, so a 900x480
// box showed about a third of the screen's width and ran 200px past the
// foot — the crop landed mid-row with the photograph's own dark half
// underneath it, which is the hard black band along the bottom edge. At
// 520x300 the window reaches the panel's foot with nothing showing under it
// and the table still reads.
const UI_BOX = "h-[300px] w-[520px] md:h-[480px] md:w-[900px]";

/**
 * One of the ready-made apps at work: a Messages notification, laid on the
 * photograph the way it would land on a client's screen. The tile is the
 * product's own grey chat icon (the template set in public/), and the card
 * stays light in both themes because it sits on the picture, not the page.
 */
function AppNotification() {
  return (
    <div className="flex w-[320px] max-w-full items-center gap-4 rounded-2xl bg-[#fcfcfd] p-2.5 pr-5 shadow-[0_18px_40px_-18px_rgba(16,24,40,0.45)]">
      <Image
        src="/images/template-icons/chat.svg"
        alt=""
        width={76}
        height={76}
        className="size-[76px] shrink-0"
      />
      <div className="min-w-0 flex-1">
        <p className={`${MOCK_TITLE} text-[#101114]`}>
          New message from Patrick Peterson
        </p>
        <p
          className={`mt-1.5 line-clamp-2 ${MOCK_PRIMARY_STACKED} text-[#6b7079]`}
        >
          Hey Jen, thanks for sending over the recent invoice...
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-center gap-1.5 self-center">
        <span className="size-2 rounded-full bg-[#7DA4FF]" />
        <span className={`${MOCK_SECONDARY} text-[#101114]`}>5h</span>
      </div>
    </div>
  );
}

/**
 * The four certifications, as solid square badges.
 *
 * NOT THE BAND'S SEALS. Those are outlined circles drawn for a white card,
 * and over a photograph the outline is the first thing the picture eats:
 * four rings of white at 40% over a sunlit room, with the mark inside them
 * reading as a watermark rather than as a certification. A filled tile has
 * its own ground, so the type sits on paper instead of on the photograph,
 * and it holds whatever is behind it.
 *
 * Square, and the title is INSIDE. The circles carried a caption underneath,
 * which on a phone made each one two objects tall and the set of four a
 * block four rows deep. One tile per standard says the same thing in one.
 */
function SecuritySeals() {
  return (
    // THE BAND'S OWN SEALS, smaller. These were four white rounded squares
    // with the standard's name set in mono inside them — a shape the site
    // draws nowhere else, and big enough that the four of them covered most
    // of the photograph. The security page already has an engraved seal for
    // each standard, and `Seal` is exported for exactly this; using it means
    // the homepage and the security page show one object rather than two
    // drawings of the same claim.
    //
    // ON A DISC OF THE PANEL'S OWN PLATE TONE. The seal's artwork is a
    // hairline circle in the page's ink, drawn to sit on the page's ground —
    // over a photograph it is barely there, so it is given the ground it
    // expects, cut to its own shape.
    //
    // `--mock-well`, NOT WHITE. A hardcoded white disc is right in light and
    // wrong in dark: four white circles over a photograph on a near-black
    // page were the brightest objects in the section, and the seal inside
    // each one — which themes with the page — came out as dark artwork on a
    // light plate while everything around it was the other way up.
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
      {SECURITY_STANDARDS.map((s) => (
        <span
          key={s.title}
          className="rounded-full bg-[var(--mock-well)] shadow-[0_10px_30px_-12px_rgba(16,24,40,0.45)]"
        >
          <Seal label={s.seal} size="size-16 sm:size-20" />
        </span>
      ))}
    </div>
  );
}

interface TabScreen {
  node: ReactNode;
  /** Draws it in the cropped product window. Off = straight on the photo. */
  windowed?: boolean;
  /** Where an unwindowed screen sits on the photo. Defaults to centred. */
  placement?: string;
}

const SCREENS: Record<RegionId, TabScreen> = {
  // THE CRM ITSELF — contacts and companies in a table, which is what the
  // step's own sentence promises. It used to be the onboarding tracker, on
  // the reasoning that a client's portal shows the CRM and the client
  // experience in one picture; in practice a reader looking for "contacts and
  // companies in one CRM" was shown a different app with its own name across
  // the top, and had to take the connection on trust. This is the same screen
  // /ai-app-builder draws for its CRM claim.
  url: { node: <TeamCrmVisual moreRows />, windowed: true },
  // One of the apps at work. See AppNotification.
  // On the dark wall to the left, clear of his face.
  sidebar: {
    node: <AppNotification />,
    placement: "items-center justify-center sm:justify-start sm:pl-[8%]",
  },
  // The composer, and nothing holding it. It is one field: a window around
  // it was a sheet of white with a text box in the middle of it.
  builder: {
    node: (
      // 620x400 — THE SCENE'S OWN DESIGN BOX, so MockFit's scale is exactly
      // 1 and the composer's type is drawn at the size it was set at. At 520
      // the scale was 0.84 and the mock's 13.5px body came out near 11,
      // which is smaller than anything else on the page and the reason this
      // panel read as a screenshot shrunk to fit. It is still well short of
      // the panel's full width, so the photograph shows either side.
      // `relative h-full`, not a bare width. The card's scene is
      // `absolute inset-0`, so a zero-height wrapper let it resolve against
      // the PANEL and the width here did nothing at all — which is why the
      // earlier numbers below never narrowed anything. A positioned frame of
      // its own is what the fit actually measures.
      <div className="relative h-full w-[620px] max-w-full sm:h-[480px] sm:w-[620px] sm:max-w-none sm:shrink-0 [&_.template-mock-fit>div>div]:my-auto!">
        <DescribeCard
          plain
          // NO RING. The composer has this whole panel to itself over a bright
          // photograph, and the lime-to-blue band around it was the first
          // thing read in a step whose subject is the field. Its own hairline
          // is what holds it against the picture.
          ring={false}
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
      {/* No dark wash on any tab: the photographs stay at full strength. The
          CRM tab keeps its blur, since a whole table sits over that picture. */}
      {active === "url" && (
        <div aria-hidden className="absolute inset-0 backdrop-blur-[6px]" />
      )}
      {screen.windowed ? (
        <>
          {/* A PHONE ON A PHONE. The window below is 520px wide and anchored
              to the panel's top-left, so on a 390px screen it was a desktop
              app with most of it off the edge — the one picture on the page
              that still said "this is software for a desk". The mock already
              lays itself out for a narrow box (it drops its sidebar and its
              last columns on its own), so all it needed was the right frame
              around it: `PhoneShell`, the device the rest of the landing
              page's phone mocks are drawn in. */}
          <div className="absolute inset-0 flex items-end justify-center px-8 pt-10 md:hidden">
            {/* THE DEVICE IS CROPPED BY THE PANEL, NOT FADED OUT. PhoneShell
                melts its lower half into the page by default, which is right
                on the page's own ground and wrong here: the mask takes the
                screen's background with it, so the photograph came through
                the tracker and the phone read as broken. Solid, standing on
                the panel's bottom edge, it is the same move the desktop
                window makes — a screen the frame cuts off, which says there
                is more of it. */}
            <div className="w-full max-w-[260px]">
              <PhoneShell melt={false}>{screen.node}</PhoneShell>
            </div>
          </div>

          {/* Anchored, not inset: top and left only, with no right or bottom,
              so the box below keeps its own size and the panel crops it. The
              inset is deep enough that the photograph still reads as the
              ground the screen is sitting on rather than a hairline around
              it. */}
          <div className="absolute left-4 top-5 hidden md:block md:left-20 md:top-16">
            <div
              className={`relative overflow-hidden rounded-tl-xl border-l border-t border-[var(--mock-line)] bg-[var(--mock-window)] shadow-[0_24px_60px_-20px_rgba(16,24,40,0.45)] ${UI_BOX}`}
            >
              {screen.node}
            </div>
          </div>

          {/* THE PANEL'S OWN RIGHT EDGE, SHADED. The window is wider than the
              panel and is cropped by it, and what it is cropped against is the
              page — white paper beside a white table, with nothing between
              them, so the screen did not end so much as dissolve. A short ramp
              inside the edge darkens the last of the table into it, which is
              how a thing passing under a frame reads. Drawn over the window
              rather than outside it: a drop shadow on the page would be a
              shadow cast by the panel, and the panel is not the object going
              off the edge. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 hidden w-24 bg-[linear-gradient(to_left,rgba(16,24,40,0.14)_0%,rgba(16,24,40,0.05)_45%,transparent_100%)] md:block"
          />
        </>
      ) : (
        <div
          className={`absolute inset-0 flex p-6 md:p-10 ${
            screen.placement ?? "items-center justify-center"
          }`}
        >
          {screen.node}
        </div>
      )}
    </>
  );
}

function Shot({ active }: { active: RegionId }) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* The incoming shot fades in ON TOP of the outgoing one, which holds at
          full strength until the fade is done. Fading both at once left each
          half see-through mid-way, so the panel's ground showed through and
          every click flashed dark. `isolate` keeps the shots' z-index from
          lifting them over the screen drawn after them. */}
      <div className="absolute inset-0 isolate">
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
            className={`object-cover object-center transition-opacity ease-out motion-reduce:transition-none ${
              id === active
                ? "z-[1] opacity-100 duration-500"
                : "z-0 opacity-0 duration-0 delay-500"
            }`}
            sizes="(max-width: 768px) 100vw, 60vw"
            priority={false}
          />
        ))}
      </div>
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
