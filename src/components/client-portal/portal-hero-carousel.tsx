"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ApprovalsMock,
  DocumentsMock,
  HelpdeskMock,
  OnboardingMock,
  PortalSidebar,
} from "@/components/client-portal/segment-mock";
import { ProgressMock } from "@/components/client-portal/progress-chart";
import { IconArrowUp } from "@/components/home/build-step-visual";
import { IconPlus } from "@/components/home/mock-icons";
import { CORE_APP_SUBTITLE, getTemplateBySlug } from "@/lib/templates";

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

/**
 * The lead panel: the one app in the set that has no template, because it is
 * the one you describe. Both the line under the title and the sentence in the
 * box are per-set — see AGENCY_ITEMS for why that matters.
 */
function promptItem(description: string, prompt: string): Item {
  // Copy review: the label, its line and the prompt are mine, not the brief's.
  return {
    key: "your-own",
    title: "Your own app",
    description,
    frame: "bare",
    mock: <PromptMock prompt={prompt} />,
  };
}

/**
 * Puts the client's nav down the left of a mock that does not carry one.
 * ApprovalsMock builds its own; these two were drawn as bare screens, so in a
 * set meant to read as four views of ONE portal they looked like three
 * different products. Composed here rather than added inside the mocks, because
 * the cards further down the page deliberately vary — only one of those carries
 * a sidebar, and that is the card making the point.
 */
function WithSidebar({
  app,
  children,
}: {
  app: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full bg-background">
      <PortalSidebar app={app} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

const ITEMS: Item[] = [
  promptItem(
    "Described in a sentence, built by AI",
    // Deliberately the plainest app in the set: /client-portal and the
    // accounting page both run this one, so the sentence has to be a job any
    // firm recognises. It used to be an agency's retainer tracker — agency
    // vocabulary, on a page about an accounting practice.
    "Build a project tracker each client can check their own project in.",
  ),
  // THE HELPDESK, where the approvals round used to be.
  //
  // That screen is a marketing agency's work going out for sign-off —
  // photographed catalogue covers — on the hero of a page selling to
  // accountants, and it is the first app the reader is shown. The helpdesk is
  // something a practice actually runs: the answers clients ask for every
  // January, written once. See HelpdeskMock.
  //
  // NOT templateItem. The helpdesk is one of the product's CORE apps rather
  // than a committed template, so getTemplateBySlug has nothing for it and the
  // slot would silently vanish on a build without Contentful. Its line is the
  // one already committed for that app in CORE_APP_SUBTITLE, so this is still
  // the repo's own copy rather than a sentence written here.
  {
    key: "helpdesk-app",
    title: "Helpdesk",
    description: CORE_APP_SUBTITLE["helpdesk-app"],
    frame: "fill" as const,
    mock: <HelpdeskMock />,
  },
  templateItem(
    "client-onboarding-wizard",
    "fill",
    <WithSidebar app="Onboarding">
      <OnboardingMock />
    </WithSidebar>,
  ),
  // Builds its own sidebar now, like the approvals screen, so no wrapper.
  templateItem("document-collection", "fill", <DocumentsMock />),
  // Four, not five. A fifth name pushed the row past the panel and the last one
  // was clipped at the edge; the set is illustrating that the portal comes with
  // ready-made apps, which four do as well as five. The project tracker goes
  // rather than one of the others because the three kept are the ones the page
  // argues for further down. ProgressMock is untouched in segment-mock.tsx and
  // drops back in here if the row ever has room.
].filter((item): item is Item => item !== null);

/**
 * The agency cut, for /solutions/marketing-agency-client-portal.
 *
 * Same four slots, chosen to name what that page's lead actually promises —
 * "a branded client portal for reports, approvals, invoices, and files. Use AI
 * to build what sets your agency apart, from analytics dashboards to design
 * review apps." A hero shot whose apps are not the apps the sentence above it
 * lists is a picture of a different product.
 *
 * So: the AI build leads (what sets your agency apart), design approvals is
 * the design review app, the engagement dashboard is the analytics one, and
 * document collection is files. The portal is already Brandmages — a
 * marketing agency — which is why this set reads straight here and why the
 * accounting page notes the default set as the wrong vertical for it.
 */
const AGENCY_ITEMS: Item[] = [
  // Its OWN lead panel, not the default one. This is the panel the page opens
  // on — the first thing anyone sees of the product here — and sharing it made
  // the agency hero open on the identical picture and the identical sentence
  // as the accounting page, which is what "the same page twice" looks like
  // however much the three behind it differ. The three that follow are named
  // by this page's own lead; the one in front of them should be too.
  promptItem(
    "The app that sets your agency apart, in a sentence",
    "Build a retainer tracker my clients can check their hours in.",
  ),
  templateItem("design-approvals", "fill", <ApprovalsMock />),
  templateItem(
    "client-engagement-dashboard",
    "fill",
    <WithSidebar app="Dashboard">
      <div className="h-full px-4 py-3.5">
        <ProgressMock />
      </div>
    </WithSidebar>,
  ),
  templateItem("document-collection", "fill", <DocumentsMock />),
].filter((item): item is Item => item !== null);

// ── How big the window is drawn ──────────────────────────────────────────
//
// One fluid rule rather than a set of breakpoints. The mock inside is fluid
// (h-full / flex-1), so the window's width is a LAYOUT width: a bigger window
// means the mock reflows with more room at the same type size, not the same
// picture magnified. That makes stepped sizes actively wrong — each step popped
// the shot by over a hundred pixels mid-drag — while a fluid width simply
// tracks the panel.
//
// It also fixes what phones had before: a fixed 360px design width scaled to
// fit a 342px panel, which drew every label at 84% of its designed size. The
// mock was not smaller, it was fine print. Drawn at the width it will actually
// occupy, it reflows at full size and `scale` stays 1 everywhere except the
// narrowest phones.

/** Floor: below this the mock's own layout (sidebar beside content) crowds, so
 *  the last few pixels come out of scale instead of width. Only the narrowest
 *  phones reach it. */
const MIN_W = 320;
/** Ceiling: the shot is framed BY the panel, so past this it stops growing and
 *  the grey around it opens up instead. Without a cap a 1320px panel held a
 *  near-edge-to-edge window and there was no panel left to sit in. */
const MAX_W = 880;

/** Taller on a phone, where the mock stacks into rows and a letterbox leaves
 *  them nothing; wider as it grows, where it lays out side by side.
 *
 *  The phone end is close to square on purpose. At 3:4 the shot came out ~230px
 *  tall, and once the control sat on its foot there was very little screen left
 *  to look at. Only phones actually reach this value — from mid widths up the
 *  viewport cap below is the binding constraint, so raising it does not make
 *  the tall panels tall again. */
const MIN_RATIO = 0.95;
const MAX_RATIO = 0.55;

/**
 * Side gutter between window and panel edge, widening faster than the panel.
 * A flat 6% kept the window at ~88% of the panel at every size, so a 900px
 * panel held a 792px shot — nearly edge to edge, and tall to match — while a
 * 1320px one held the same proportion. Opening the gutter as the panel grows
 * is what keeps the shot a shot rather than the whole panel.
 *
 * Measured from MIN_W rather than from zero so phones are untouched: there the
 * term is near nothing and the gutter stays at its 16px floor.
 */
function padXFor(panelW: number): number {
  return Math.round(Math.min(140, Math.max(16, (panelW - MIN_W) * 0.18)));
}

/**
 * The shot's height is also capped against the VIEWPORT, not just its own
 * shape. Chrome is most of this block — the shot sat inside 144px of padding
 * under an 84px header and above a 62px row of names — so at its full shape it
 * ran to 92% of a 900px-tall window and the hero could not be seen whole. Tall
 * screens still get the full shape; short ones get a shorter shot rather than a
 * page that scrolls to show one picture.
 */
const VIEWPORT_BUDGET = 0.42;
/** …but never flatter than this, whatever the window height. */
const MIN_SHAPE = 0.42;

/**
 * Where the four names lay out whole on one row. Below this they are replaced
 * by the position, between the same two arrows.
 *
 * Measured rather than borrowed from a Tailwind breakpoint: the row of four is
 * 674px plus its gutters, so it fits from about 754. `lg` would hold the
 * stepper on panels with room to spare, and `md` would clip the last name.
 *
 * The shot bleeds off the foot at EVERY width — see FOOT_PX and the dissolve,
 * which are sized so the control always lands on solid ground however short the
 * shot is.
 */
const WIDE_FROM_PX = 760;

/**
 * The band the control occupies at the foot of the panel: a 36px button on 24px
 * of padding, plus a little air. The dissolve must be fully opaque by here or
 * the app's rows read through the arrows, which is exactly what went wrong when
 * the fade was sized to itself rather than to the thing sitting on it.
 */
const FOOT_PX = 64;

/**
 * The dissolve that takes the foot of the shot into the panel ground. Its
 * height tracks the shot so a short one is not half swallowed, and its stop is
 * worked back from FOOT_PX so the opaque part always starts above the control —
 * on a phone that means a shorter, firmer fade, on desktop a long soft one.
 */
function dissolveFor(h: number): { height: number; stop: number } {
  const height = Math.round(Math.min(160, Math.max(96, h * 0.3)));
  return { height, stop: Math.round(((height - FOOT_PX) / height) * 100) };
}

type Fit = {
  w: number;
  h: number;
  scale: number;
  padY: number;
  /** The panel's own width, which the side arrows need to find their gutter. */
  panelW: number;
  /**
   * Wide enough for the names row, and so for the shot to bleed off the foot.
   */
  wide: boolean;
};

function fitFor(panelW: number, viewportH: number): Fit {
  const avail = Math.max(1, panelW - 2 * padXFor(panelW));
  const w = Math.min(MAX_W, Math.max(MIN_W, avail));
  // How far along the phone→desktop range this width sits. Drives the shape and
  // the vertical padding together, so both ease instead of stepping.
  const t = Math.min(1, Math.max(0, (w - MIN_W) / (MAX_W - MIN_W)));
  const shaped = w * (MIN_RATIO + (MAX_RATIO - MIN_RATIO) * t);
  const h = Math.round(
    Math.max(w * MIN_SHAPE, Math.min(shaped, viewportH * VIEWPORT_BUDGET)),
  );
  return {
    w,
    h,
    panelW,
    scale: Math.min(1, avail / w),
    // Tied to the shot rather than fixed, so a shot the viewport shortened does
    // not keep a desktop-sized band of grey above and below it.
    padY: Math.round(Math.min(56, Math.max(20, h * 0.11))),
    wide: panelW >= WIDE_FROM_PX,
  };
}

export function PortalHeroCarousel({
  /**
   * Which set of apps the panel shows. "default" is the general portal set
   * /client-portal and the accounting page run; "agency" is the set named by
   * the marketing-agency page's own lead. See AGENCY_ITEMS.
   */
  set = "default",
  footDissolve = true,
}: {
  set?: "default" | "agency";
  /**
   * The ramp that takes the foot of the shot into the panel's ground.
   *
   * On by default, and the accounting page turns it off: on a page whose every
   * other screen ends on a straight crop against its card's edge, the hero was
   * the one picture that went soft on the way out, which read as the shot
   * losing focus rather than as the frame ending. A hard edge says "this
   * continues" — which is the same thing the ramp was saying, more quietly.
   *
   * IT STILL DRAWS BEHIND THE PHONE'S STEPPER, whatever this is set to. That
   * control sits INSIDE the panel, on the shot, and the ramp is what gives it
   * ground to sit on — without it the arrows and the counter land on the app's
   * own rows and read through them. So this switches off the ramp where it is
   * decoration and keeps it where it is load-bearing.
   */
  footDissolve?: boolean;
} = {}) {
  const items = set === "agency" ? AGENCY_ITEMS : ITEMS;
  const [active, setActive] = useState(0);
  // Which template the "Select a template" pill returns you to. The panel
  // opens on "Your own app", so this is only ever read after something has
  // moved off it; 1 is the first template either way.
  const [lastTemplate, setLastTemplate] = useState(1);
  // The mock behind the header already crossfades; the title and its line
  // swapped on the same click with no transition at all, which is the jump.
  // Held one step behind the selection and swapped at the midpoint, so the
  // text fades out, changes, and fades back in.
  //
  // Driven from the click rather than from an effect watching `active`: a
  // setState in an effect body is a cascading render, and the selection is
  // already an event we own.
  const [shownTitle, setShownTitle] = useState(0);
  const [titleOut, setTitleOut] = useState(false);
  const titleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (titleTimer.current) clearTimeout(titleTimer.current);
    },
    [],
  );
  const selectTab = (i: number) => {
    setActive(i);
    if (i > 0) setLastTemplate(i);
    if (i === shownTitle) return;
    if (titleTimer.current) clearTimeout(titleTimer.current);
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setShownTitle(i);
      return;
    }
    setTitleOut(true);
    titleTimer.current = setTimeout(() => {
      setShownTitle(i);
      setTitleOut(false);
    }, 160);
  };

  const shown = items[shownTitle] ?? items[0];

  const [fit, setFit] = useState<Fit | null>(null);
  const [headerH, setHeaderH] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const apply = () => {
      setFit(fitFor(el.clientWidth, window.innerHeight));
      // Measured, not assumed: the description wraps to a second line on a
      // phone, so this is taller there than on desktop.
      setHeaderH(headerRef.current?.offsetHeight ?? 0);
    };
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(el);
    if (headerRef.current) observer.observe(headerRef.current);
    // The panel's own box does not change when only the window's HEIGHT does,
    // so the ResizeObserver never fires for it — and height is now an input.
    window.addEventListener("resize", apply);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", apply);
    };
  }, []);

  // Server render and first paint, before the panel has been measured. The
  // panel is hidden until `fit` lands, so these only set the shape of an
  // invisible box.
  const F = fit ?? fitFor(1320, 900);
  const current = items[active];
  // The grey either side of the shot. The shot caps at MAX_W while the panel
  // keeps growing, so this opens up rather than closing: ~79px at
  // WIDE_FROM_PX, 220px on a 1320 panel. The arrows live in it.
  const gutter = (F.panelW - F.w * F.scale) / 2;

  /**
   * What the bare composer keeps clear at the foot of the shot.
   *
   * It is `headerH + padY` because the shot is NOT the frame the composer
   * reads against — the panel is, and the panel carries the title block above
   * the shot. Centred in the shot alone it came out that much below the middle
   * of the panel, which is what reads as "sitting low". This is the exact
   * offset that puts it on the panel's centre line; the floor keeps it clear of
   * the control if the header is ever tiny.
   */
  const bareFoot = Math.max(FOOT_PX, headerH + F.padY);

  return (
    <div className="mt-12 md:mt-16">
      <div
        ref={panelRef}
        // Flat ground, deliberately: the gradient belongs to the product shot
        // sitting on it, and two graded surfaces one inside the other cancel each
        // other out — the shot stops reading as a separate thing.
        //
        // Held as a token because the dissolve at the foot of the stage has to
        // END on exactly this colour; as two separate declarations they drift the
        // moment one is touched and the fade stops at a visible edge. Same two
        // values as before — dark is what white/6 over the page ground composited
        // to — each in its own theme block.
        // --portal-ground is the shared --surface now. It held its own #f5f5f5 /
        // #191919 pair, which happened to match in light and drifted in dark; the
        // dissolve gradient below still reads the name, so it is re-pointed
        // rather than removed.
        className="relative overflow-hidden rounded-[28px] bg-[var(--surface)] [--portal-ground:var(--surface)]"
        style={{ opacity: fit ? 1 : 0 }}
      >
        <div
          ref={headerRef}
          className="px-6 pt-6 md:px-10 md:pt-8"
          aria-live="polite"
        >
          <div
            className={`transition-opacity duration-150 ease-out motion-reduce:transition-none ${
              titleOut ? "opacity-0" : "opacity-100"
            }`}
          >
            <p className="text-base text-foreground">{shown.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {shown.description}
            </p>
          </div>
        </div>

        <div
          role="tabpanel"
          id="portal-hero-panel"
          aria-label={current.title}
          // Padded at the top only. The shot runs OFF the bottom of the panel
          // rather than floating clear of it with a band of grey underneath: it
          // reads as a window onto an app that carries on past the frame, which
          // is what the cards further down the page already do.
          className="relative"
          style={{ height: F.h * F.scale + F.padY }}
        >
          {items.map((item, i) => (
            <div
              key={item.key}
              aria-hidden={i !== active}
              className={`absolute bottom-0 left-1/2 transition-opacity duration-500 motion-reduce:transition-none ${
                i === active ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
              style={{
                width: F.w,
                height: F.h,
                marginLeft: -F.w / 2,
                bottom: 0,
                // Scaled from the bottom edge, so a scaled-down shot stays welded
                // to the foot of the panel instead of lifting off it.
                transformOrigin: "bottom center",
                scale: String(F.scale),
              }}
            >
              <Window item={item} foot={bareFoot} />
            </div>
          ))}

          {/* Dissolves the foot of the shot into the panel so it ends by fading
            rather than on a hard edge, and gives the control something to sit
            on. Ends on the ground colour exactly — see the token on the panel —
            and reaches it above the control, or the app's rows read through the
            arrows.

            A caller can turn it off (see `footDissolve`), EXCEPT where the
            phone's stepper is showing: that control is inside the panel and
            this is the ground it stands on. */}
          {footDissolve || (!F.wide && active !== 0) ? (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0"
              style={{
                height: dissolveFor(F.h * F.scale).height,
                backgroundImage: `linear-gradient(to bottom, transparent 0%, var(--portal-ground) ${dissolveFor(F.h * F.scale).stop}%)`,
              }}
            />
          ) : null}

          {/* Moving between templates, in the grey either side of the shot.

            Not ON the shot: there is a dissolve at its foot precisely so the
            control at the bottom has solid ground to sit on, and there is no
            equivalent at the sides — an arrow there would sit on the app's own
            screen. The gutter is never tighter than ~79px (see `gutter`), so a
            32px button always has room with air around it.

            Hidden on "Your own app", which is not one of a set to step
            through. Cycling stays inside the templates: stepping back from the
            first goes to the last, not out to the composer. */}
          {F.wide && active > 0 ? (
            <>
              <TemplateArrow
                direction="prev"
                gutter={gutter}
                centerY={F.padY + (F.h * F.scale) / 2}
                onClick={() =>
                  selectTab(active - 1 < 1 ? items.length - 1 : active - 1)
                }
              />
              <TemplateArrow
                direction="next"
                gutter={gutter}
                centerY={F.padY + (F.h * F.scale) / 2}
                onClick={() =>
                  selectTab(active + 1 >= items.length ? 1 : active + 1)
                }
              />
            </>
          ) : null}
        </div>

        {/* Two pills, and only ever two.

          The fork they name — build your own, or start from one that already
          exists — is the argument this panel is making. The row used to
          dissolve that fork into four app names the moment you engaged with
          it, so the choice disappeared exactly when it had been taken. The
          control now stays on the fork permanently, and moving between
          templates is the arrows' job instead (see TemplateArrow).

          It also takes the length problem out at the root: the track used to
          grow with the names inside it, so a longer template title made the
          whole control wider. Two fixed labels cannot.

          This is not a reversal of the note it replaces, which argued against
          arrows sitting BESIDE the names as a second control for a job the
          names already did. There are no names here for them to duplicate.

          Top right rather than at the foot: on the panel's own padding
          (px-10 pt-8, the header's), so the title block on the left and the
          control on the right read as one row — what this is, and which one
          you are looking at. At the foot it was the last thing in the frame
          and the shot had to leave a band of ground for it; up here the shot
          gets its whole foot back. The phone keeps its own copy below the
          panel, because at 375px this corner belongs to the header. */}
        {F.wide ? (
          <div className="absolute right-10 top-8 z-10">
            <ForkToggle
              items={items}
              active={active}
              lastTemplate={lastTemplate}
              selectTab={selectTab}
            />
          </div>
        ) : null}

        {/* The phone control. Steps rather than tabs: the app's name is already
          the line above the shot, so the control's job is only to move, and two
          chevrons either side of the position do that in a row that cannot be
          cut off however long the names get. The square chevron button is the
          shape the changelog's pager already collapses to on a phone, for the
          same reason — a label that will not fit becomes an arrow. */}
        {/* The phone's STEPPER, inside the panel on the dissolve. The fork
          toggle that goes with it is below the panel entirely — see the end of
          this component — so only this sits on the shot.

          Shows up once you are on a template: "Your own app" is not one of a
          numbered set to step through. */}
        {F.wide || active === 0 ? null : (
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-4 px-6 pb-6">
            <StepButton
              direction="prev"
              onClick={() =>
                selectTab(active - 1 < 1 ? items.length - 1 : active - 1)
              }
            />
            {/* Counts the TEMPLATES, not the panels: "Your own app" is not one of
            a numbered set, and including it made the first template read as 2
            of 4. Tabular figures so the row does not shift width as the number
            changes under the thumb. */}
            <p
              className="text-sm tabular-nums text-muted-foreground"
              aria-hidden
            >
              {active} / {items.length - 1}
            </p>
            <StepButton
              direction="next"
              onClick={() =>
                selectTab(active + 1 >= items.length ? 1 : active + 1)
              }
            />
          </div>
        )}
      </div>

      {/* THE PHONE'S FORK TOGGLE: under the panel, on the page's own ground.

          Not inside it. On a 375px screen the panel is the full measure, so a
          control sitting on the shot takes a row out of the picture it
          switches and starts reading as part of the app in it — the same
          reason PortalProblem renders its phone toggle under the tray rather
          than in its corner. Outside, it is plainly a control FOR the thing
          above it, and the shot gets the whole panel back.

          The stepper stays inside, on the dissolve: it is a position within
          the picture, so it belongs to the picture. */}
      {F.wide ? null : (
        <div className="mt-4 flex justify-center">
          <ForkToggle
            items={items}
            active={active}
            lastTemplate={lastTemplate}
            selectTab={selectTab}
          />
        </div>
      )}
    </div>
  );
}

/**
 * The fork the panel is arguing: build your own, or start from one that
 * exists. Two pills and only ever two — see the note at its call site in the
 * wide layout for why the template names no longer live in here.
 *
 * Shared by both layouts rather than written twice. The phone used to get a
 * bare position stepper instead, so the choice this panel is making was
 * invisible on the screen where most people meet the page.
 */
function ForkToggle({
  items,
  active,
  lastTemplate,
  selectTab,
}: {
  items: Item[];
  active: number;
  lastTemplate: number;
  selectTab: (i: number) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Apps in the portal"
      className="flex items-center gap-0.5 rounded-full border border-border p-1 [[data-theme=dark]_&]:border-white/15"
    >
      {[
        { key: "your-own", title: items[0].title, templates: false },
        {
          key: "select-template",
          title: "Select a template",
          templates: true,
        },
      ].map(({ key, title, templates }) => {
        // "Select a template" holds the selected state for ANY template,
        // not for one of them — which is the whole point of collapsing
        // the names away.
        const selected = templates ? active > 0 : active === 0;
        return (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls="portal-hero-panel"
            tabIndex={selected ? 0 : -1}
            // Returning to the templates returns to the one you were
            // last on, rather than snapping back to the first.
            onClick={() => selectTab(templates ? lastTemplate : 0)}
            onKeyDown={(e) => {
              if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
              const toTemplates = !templates;
              selectTab(toTemplates ? lastTemplate : 0);
              e.currentTarget.parentElement
                ?.querySelector<HTMLElement>(
                  `[data-pill="${toTemplates ? "select-template" : "your-own"}"]`,
                )
                ?.focus();
            }}
            data-pill={key}
            className={`rounded-full border px-3.5 py-1 text-sm whitespace-nowrap transition-[color,background-color,border-color,box-shadow] duration-200 ease-out motion-reduce:transition-none ${
              selected
                ? "border-border bg-background text-foreground shadow-[0_1px_2px_rgba(16,24,40,0.06)] [[data-theme=dark]_&]:border-white/15 [[data-theme=dark]_&]:bg-white/[0.06]"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {title}
          </button>
        );
      })}
    </div>
  );
}

/**
 * A step button parked in one of the panel's side gutters, vertically centred
 * on the shot.
 *
 * `centerY` is measured from the top of the tab panel, which carries `padY` of
 * ground above the shot — so it is that padding plus half the shot, not half
 * the panel. The button is nudged to the middle of the gutter rather than
 * pinned to the panel edge, with an 8px floor so a tight gutter still leaves it
 * clear of the rim.
 */
function TemplateArrow({
  direction,
  gutter,
  centerY,
  onClick,
}: {
  direction: "prev" | "next";
  gutter: number;
  centerY: number;
  onClick: () => void;
}) {
  const inset = Math.max(8, (gutter - 32) / 2);
  return (
    <div
      className="absolute z-10"
      style={{
        top: centerY,
        transform: "translateY(-50%)",
        left: direction === "prev" ? inset : undefined,
        right: direction === "next" ? inset : undefined,
      }}
    >
      <StepButton direction={direction} onClick={onClick} />
    </div>
  );
}

/**
 * One step of the control, on both layouts. A 32px square holding a 14px
 * chevron: the changelog pager's glyph, a size down from its 36px box. The
 * arrows sit ON the shot here rather than under an archive, so they want to be
 * the quietest thing in the frame — at 44px the box dwarfed its own chevron and
 * the pair read as the heaviest thing on the panel.
 */
function StepButton({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-controls="portal-hero-panel"
      aria-label={direction === "prev" ? "Previous app" : "Next app"}
      className="flex size-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:text-foreground [[data-theme=dark]_&]:border-white/15 [[data-theme=dark]_&]:bg-white/[0.06]"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d={direction === "prev" ? "m14.5 5-7 7 7 7" : "m9.5 5 7 7-7 7"} />
      </svg>
    </button>
  );
}

/**
 * `foot` is FOOT_PX: the band the control sits in. A `fill` or `inset` mock is a
 * screen carrying on past the frame, so it runs under the control quite happily.
 * A `bare` one is not a screen at all — it is a composer floating on the panel —
 * so it keeps clear and centres in what is actually visible. Without it the
 * composer centred on the whole window, part of which is behind the control,
 * and sat low against it.
 */
function Window({ item, foot }: { item: Item; foot: number }) {
  if (item.frame === "bare") {
    return (
      <div className="h-full" style={{ paddingBottom: foot }}>
        {item.mock}
      </div>
    );
  }
  return (
    <div
      // The screen's own surface is graded rather than flat: a top-down fall
      // across 500px of white is what makes it read as a lit screen instead of
      // a white rectangle. Light and dark carry their own ramps — nothing is
      // shared.
      //
      // Shallow on purpose. It used to land on #f3f6f9, within a few levels of
      // the panel ground behind the shot, so a screen whose own fill is cleared
      // below (the `fill` branch) had no white left in its lower half and sank
      // into the page — worst on the onboarding screen, which is mostly ground.
      // Blending into the panel is the DISSOLVE's job at the very foot; up here
      // the screen should still read as white. Dark had the same fault and the
      // same fix: its ramp ended on #191919, the exact ground colour, so the
      // screen had no edge at all down there.
      //
      // `fill` mocks paint their own ground edge to edge, so the gradient would
      // sit under an opaque layer; clearing the mock's root fill here (and only
      // here) lets it through. Scoped to this component, so the same mocks keep
      // their solid ground on the cards further down the page.
      className={`h-full w-full overflow-hidden rounded-t-2xl bg-[linear-gradient(180deg,#ffffff_0%,#fdfefe_55%,#fafbfd_100%)] shadow-[0_1px_2px_rgba(16,24,40,0.04),0_18px_40px_-28px_rgba(16,24,40,0.28)] [[data-theme=dark]_&]:bg-[linear-gradient(180deg,#242424_0%,#222222_55%,#1f1f1f_100%)] [[data-theme=dark]_&]:shadow-[0_24px_60px_-24px_rgba(0,0,0,0.6)] ${
        item.frame === "inset" ? "p-6" : "[&>*]:bg-transparent"
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
function PromptMock({ prompt }: { prompt: string }) {
  return (
    <div aria-hidden className="flex h-full select-none items-center">
      {/* Capped and centred rather than full width. The window grew to 880px,
          and a composer stretched across all of it stopped reading as a box you
          type a sentence into — one line of text left most of it empty. This is
          about the measure the real composer sits at. */}
      {/* Shorter on a phone: the empty run under the sentence is there to say
          "there is room to type more", and at phone width it was most of the
          shot rather than a hint. */}
      <div className="mx-auto w-full max-w-[560px] rounded-2xl bg-background p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)] sm:p-5 [[data-theme=dark]_&]:bg-white/[0.06]">
        <p className="min-h-[44px] text-[15px] leading-[1.6] text-foreground sm:min-h-[72px]">
          {prompt}
        </p>
        {/* The composer's own controls, split across the foot as the product
            draws them: attach on the left edge, the model it will build with
            and the submit gathered at the right. The model carries no chevron
            here — this is a still of a composer, not a menu waiting to be
            opened, and the caret invited a click the mock cannot answer. */}
        <div className="mt-4 flex items-center justify-between gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg text-muted-foreground [&>svg]:size-4">
            <IconPlus />
          </span>
          <span className="flex items-center gap-2.5">
            <span className="text-[13px] leading-none text-muted-foreground">
              Sonnet 5.5
            </span>
            <span className="flex size-8 items-center justify-center rounded-lg bg-foreground text-background">
              <IconArrowUp className="size-4" />
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
