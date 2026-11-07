"use client";

import {
  IconTemplatePayments,
  IconTemplateProjects,
  IconTemplateProposals,
} from "@/components/templates/template-icons";
import type { ReactNode } from "react";
import { ProductionGap, type RegionId } from "@/components/home/production-gap";
import { PhoneShell } from "@/components/home/phone-shell";
import { IconMenu } from "@/components/home/mock-icons";
import { TeamCrmVisual } from "@/components/home/team-crm-visual";
import {
  SECURITY_STANDARDS,
  Seal,
} from "@/components/security/security-compliance";
import { DescribeCard } from "@/components/client-portal/portal-build-cards";
import {
  MOCK_PRIMARY_STACKED,
  MOCK_TITLE,
  MOCK_BODY,
} from "@/components/ui/mock-type";

// ─────────────────────────────────────────────────────────────────────────
// UNIFIED PLATFORM (V2) — one product screen per tab, on the site's surface
// gray. The photographs that sat behind them were dropped: every tab's subject
// is the screen, and a picture under it was a second thing to read.
// ─────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────
// ONE SCREEN PER TAB.
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
 * One of the ready-made apps arriving: Project tracker, installed. It is one
 * of the apps the tab's copy names, and installing then remixing is the claim
 * itself. The tile carries the template's own icon.
 *
 * FRAMED LIKE THE COMPOSER on the App builder tab (see DescribeCard's `plain`
 * frame): a 14px hairline ring, a 3px band of ground, then a 10px window with
 * its own border. The two tabs show the same kind of object on the same
 * ground, so they share one outline and one radius.
 */
const READY_APPS: {
  name: string;
  body: string;
  icon: ReactNode;
}[] = [
  {
    name: "Project tracker",
    body: "Every project, its stage, what’s due next.",
    // Shifted so the dark document is centred rather than the whole mark: the
    // pale pencil pulls the mark's box up and left.
    icon: (
      <IconTemplateProjects className="h-[34px] w-auto -translate-x-[3px] -translate-y-[2px] sm:h-[40px]" />
    ),
  },
  {
    name: "Proposals",
    body: "Send proposals and get them signed.",
    icon: <IconTemplateProposals className="h-[34px] w-auto sm:h-[40px]" />,
  },
  {
    name: "Payments",
    body: "Invoice clients and get paid online.",
    icon: <IconTemplatePayments className="h-[30px] w-auto sm:h-[34px]" />,
  },
];

/**
 * Three of the ready-made apps as template cards, stacked: the name and what
 * it does. Each wears the composer's frame (14px hairline ring, 3px band of
 * ground, 10px window). A phone shows only the first.
 */
function AppNotification() {
  return (
    // On a phone, drawn at 1.05: the step the other mobile mocks land on.
    // Capped at 264 there, so the card sits on the photograph with room either
    // side instead of running nearly edge to edge.
    <div className="flex w-[332px] max-w-full origin-center flex-col gap-3 max-sm:max-w-[264px] max-sm:scale-[1.05]">
      {READY_APPS.map((app, i) => (
        <div
          key={app.name}
          className={`rounded-[14px] bg-[var(--mock-line)] p-px ${i > 0 ? "max-sm:hidden" : ""}`}
        >
          <div className="rounded-[13px] bg-[var(--surface)] p-[3px]">
            <div className="flex items-center gap-3 rounded-[10px] border border-[var(--mock-line)] bg-[var(--mock-window)] p-2 pr-3.5 sm:gap-4">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-[8px] bg-[#ECECEC] sm:size-16">
                {app.icon}
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className={`${MOCK_TITLE} truncate text-[color:var(--mock-ink)]`}
                >
                  {app.name}
                </p>
                <p
                  className={`mt-1 line-clamp-2 ${MOCK_PRIMARY_STACKED} text-[color:var(--mock-ink-soft)]`}
                >
                  {app.body}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
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
    // ON A WHITE DISC (the window tone, so dark mode follows), with no shadow:
    // on the panel's flat gray the seals read as white objects, not outlines.
    // Their hairlines a step darker than the page's --border, which on the
    // panel's gray left the seals blending into it. Redefined here only, as
    // a foreground tint so dark mode follows.
    <div className="flex flex-wrap items-center justify-center gap-3 [--border:color-mix(in_oklab,var(--foreground)_14%,transparent)] sm:gap-5">
      {SECURITY_STANDARDS.map((s) => (
        <span key={s.title} className="rounded-full bg-[var(--mock-window)]">
          <Seal label={s.seal} size="size-18 sm:size-20" />
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
  sidebar: { node: <AppNotification /> },
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
      // FROM sm, ZOOMED IN: a 440x390 design box in a 540 frame, so the
      // composer draws at about 1.23 (15px type) and runs shorter than the
      // 620-at-1 it was, which left a long thin field across the panel.
      // ON A PHONE the scene's design box is 300x220, not the shared 360x300,
      // so the fit scales it UP into the ~340px panel and the prompt reads at
      // about 13px on one line instead of 12, and its side padding drops so the field
      // runs nearly the panel's width. Scoped here: the shared box is right
      // for the product pages' narrower phone cards.
      <div className="relative h-full w-[620px] max-w-full sm:h-[480px] sm:w-[540px] sm:max-w-none sm:shrink-0 sm:[&_.template-mock-fit]:[--template-mock-w:440px]! sm:[&_.template-mock-fit]:[--template-mock-h:390px]! sm:[&_.template-mock-fit>div]:h-[390px]! sm:[&_.template-mock-fit>div]:w-[440px]! [&_.template-mock-fit>div>div]:my-auto! max-sm:[&_.template-mock-fit]:[--template-mock-w:300px]! max-sm:[&_.template-mock-fit]:[--template-mock-h:220px]! max-sm:[&_.template-mock-fit>div]:h-[220px]! max-sm:[&_.template-mock-fit>div]:w-[300px]! max-sm:[&_.template-mock-fit>div]:px-2!">
        {/* The short prompt on a phone, where the long one wrapped; the
            full sentence from sm. `contents`, so the scene still measures
            against this frame. */}
        <div className="contents sm:hidden">
          <DescribeCard
            plain
            // NO RING. The composer has this whole panel to itself over a bright
            // photograph, and the lime-to-blue band around it was the first
            // thing read in a step whose subject is the field. Its own hairline
            // is what holds it against the picture.
            ring={false}
            prompt="Add a project tracker for each client."
          />
        </div>
        <div className="hidden sm:contents">
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
      {/* No dark wash on any tab: the photographs stay at full strength. */}
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
          <div className="absolute inset-x-0 -bottom-12 top-0 flex items-end justify-center px-8 md:hidden">
            {/* THE DEVICE IS CROPPED BY THE PANEL, NOT FADED OUT. PhoneShell
                melts its lower half into the page by default, which is right
                on the page's own ground and wrong here: the mask takes the
                screen's background with it, so the photograph came through
                the tracker and the phone read as broken. Solid, anchored 48px
                under the panel's floor so it always runs past it, it is the same
                move the desktop window makes: a screen the frame cuts off,
                which says there is more of it. */}
            <div className="w-full max-w-[260px]">
              <PhoneShell
                melt={false}
                sideButtons={false}
                squareFoot
                screenBg="bg-[var(--mock-window)]"
              >
                {/* The hero's phone bar: a bordered menu button and the
                    app's name, so the table reads as an app, not a crop. */}
                <div className="flex h-full flex-col">
                  <div className="flex shrink-0 items-center gap-2.5 border-b border-[var(--mock-line)] bg-[var(--mock-window)] px-4 py-2">
                    <span className="flex size-[22px] shrink-0 items-center justify-center rounded-[4px] border border-[var(--mock-line)] text-[color:var(--mock-ink)]">
                      <IconMenu className="size-[11px]" />
                    </span>
                    <span
                      className={`${MOCK_BODY} text-[color:var(--mock-ink)]`}
                    >
                      CRM
                    </span>
                  </div>
                  <div className="relative min-h-0 flex-1">
                    {screen.node}
                    {/* The table runs past the screen's right edge; soften it
                        there (a light blur under a fade to the window tone)
                        rather than cutting the last column hard. */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[var(--mock-window)] to-transparent backdrop-blur-[2px] [mask-image:linear-gradient(to_left,#000_30%,transparent)]"
                    />
                  </div>
                </div>
              </PhoneShell>
            </div>
          </div>

          {/* Anchored, not inset: top and left only, with no right or bottom,
              so the box below keeps its own size and the panel crops it. The
              inset is deep enough that the photograph still reads as the
              ground the screen is sitting on rather than a hairline around
              it. */}
          <div className="absolute left-4 top-5 hidden md:block md:left-20 md:top-10">
            <div
              className={`relative overflow-hidden rounded-tl-xl border-l border-t border-[var(--mock-line)] bg-[var(--mock-window)] ${UI_BOX}`}
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
            className="pointer-events-none absolute inset-y-0 right-0 hidden w-24 bg-[linear-gradient(to_left,rgba(16,24,40,0.06)_0%,rgba(16,24,40,0.02)_45%,transparent_100%)] md:block"
          />
        </>
      ) : (
        <div
          className={`absolute inset-0 flex p-4 sm:p-6 md:p-10 ${
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
      <div aria-hidden className="absolute inset-0 bg-[var(--surface)]" />
      <Screen active={active} />
      {/* The card's hairline, redrawn over the visual: the frame's inset ring
          sits under this gray and was lost on its outer sides. Not on the side
          that meets the step list, which draws its own divider there. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-t-xl border border-b-0 border-border md:rounded-none md:rounded-r-xl md:border-b md:border-l-0 [[data-theme=dark]_&]:border-white/15"
      />
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
