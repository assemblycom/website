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
// A PHONE GETS A SMALLER WINDOW. The panel is ~342x320 there, so a 900x480
// box showed about a third of the screen's width and ran 200px past the
// foot — the crop landed mid-row with the photograph's own dark half
// underneath it, which is the hard black band along the bottom edge. At
// 520x300 the window reaches the panel's foot with nothing showing under it
// and the table still reads.
const UI_BOX = "h-[300px] w-[520px] md:h-[480px] md:w-[900px]";

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
 *
 * SOLID, NOT GLASS. Frosted white over a photograph takes whatever is behind
 * it: on a busy shot each pill came out a different tone from the one above
 * it, the ink sat on a moving ground and the set read as four smudges rather
 * than as four apps. A full fill gives the type its own paper.
 *
 * `--mock-well`, not the window white: four white plates on a photograph read
 * as holes punched in it. A rung down is still a surface the type sits on and
 * still clearly lighter than anything in the picture.
 *
 * 200 WIDE, not 260. The labels are one word each, so the extra width was
 * empty plate running past the end of every name.
 */
function AppPills() {
  return (
    <div className="flex w-[200px] flex-col gap-2.5">
      {APP_PILLS.map((app) => (
        <span
          key={app.label}
          className="flex items-center gap-3 rounded-xl bg-[var(--mock-well)] px-4 py-3 text-[15px] text-[color:var(--mock-ink)] shadow-[0_10px_30px_-12px_rgba(16,24,40,0.45)]"
        >
          <span className="text-[color:var(--mock-ink-soft)]">{app.icon}</span>
          {app.label}
        </span>
      ))}
      {/* THE SAME FILL AS THE THREE ABOVE IT, not a dashed outline. The
          dashes said "placeholder" — the convention for a slot with nothing
          in it yet — about the one row whose point is that there are 27 more
          apps that do exist. It is the quietest of the four by its ink, not
          by its edge. */}
      <span className="flex items-center gap-3 rounded-xl bg-[var(--mock-well)] px-4 py-3 text-[15px] text-[color:var(--mock-ink-soft)] shadow-[0_10px_30px_-12px_rgba(16,24,40,0.45)]">
        <IconPlus className="size-4" />
        27 more
      </span>
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
    // ON A WHITE DISC. The seal's own artwork is a hairline circle in the
    // page's grey ink, which is drawn to sit on the page's ground — over a
    // photograph it is barely there. The disc is the ground it expects,
    // the same white plate the square tiles carried, cut to the seal's
    // own shape.
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
      {SECURITY_STANDARDS.map((s) => (
        <span
          key={s.title}
          className="rounded-full bg-white shadow-[0_10px_30px_-12px_rgba(16,24,40,0.45)]"
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
  // A few of the apps, named. See AppPills.
  sidebar: { node: <AppPills /> },
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
      {/* THE CRM TAB ALONE IS BLURRED. That step lays a whole product screen
          over its photograph — a table of names and numbers against a window
          frame and a person at a desk — and the picture's own detail competed
          with the screen's. The other three put a handful of objects on the
          shot (four pills, one field, four seals), where the photograph is
          still the picture and softening it would only make the panel look
          out of focus. A backdrop filter rather than a blur on the image
          itself, so there is no soft edge where the picture meets the panel. */}
      <div
        aria-hidden
        className={`absolute inset-0 bg-[linear-gradient(to_bottom,rgba(16,24,40,0.34),rgba(16,24,40,0.46))] ${
          active === "url" ? "backdrop-blur-[6px]" : ""
        }`}
      />
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
        </>
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
