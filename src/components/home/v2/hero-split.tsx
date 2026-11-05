"use client";

import Link from "next/link";
import { StudioNav } from "@/components/home/studio-nav";
import { useTheme } from "@/components/theme/theme-provider";
import { APP_URL, DEMO_URL, SIGNUP_URL } from "@/lib/constants";
import { COPY_VARIANTS, FALLBACK_COPY } from "@/lib/hero-variants";
import { PRIMARY_CTA } from "@/components/home/hero-big";
import { SECONDARY_CTA } from "@/components/home/cta";
import { HeroCredibility } from "@/components/home/v2/hero-credibility";
import { PROTO_HERO_BODY } from "@/components/proto/hero-copy";
import { OnboardingTrackerMock } from "@/components/client-portal/segment-mock";

// ─────────────────────────────────────────────────────────────────────────
// HERO (V2, SPLIT) — the layout from the elevenlabs.io reference: headline
// ranged left with the body beside it, the action pair under the headline,
// and a single tabbed tile carrying the product shot.
//
// What this changes against the shipped hero is the LAYOUT, not the message.
// The headline and body are read from the same COPY_VARIANTS record the live
// hero uses, so the two versions are making identical claims and a difference
// between them is a difference in how the page is arranged.
//
// Three things the reference does that are the whole shape of it:
//
//   1. THE HEADLINE IS NOT CENTRED. It ranges left on the page's own left
//      line, and the body sits in the opposite column rather than underneath.
//      That is what gives the hero a horizon instead of a stack.
//   2. ONE TILE, NOT A STRIP. The reference puts everything below the fold
//      into a single rounded panel with its own tab bar, rather than a row of
//      cards running off the edge. The tile is the product; the tabs are the
//      ways in.
//   3. THE TILE CARRIES ITS OWN FOOTER. A row of secondary capabilities and a
//      repeat of the primary action, inside the panel, so the tile is a
//      self-contained pitch rather than a screenshot.
//
// NO TABS ON THE TILE. The panel used to carry a Portal / Builder / Apps
// switch in its top-right corner, and it is gone: a hero asks a visitor to
// read one claim, and a control up there asks them to choose between three
// before they have read any of it. A hero should not have a decision in it.
//
// It also hid the strongest thing we can show. Round 1-3 found the client
// experience on its own outsold every framing that put the builder beside it,
// and the headline makes that same promise — so the tile shows a client's
// portal, one screen, standing still. Side by side would be fine; a control
// the visitor has to operate would not.

// THE PRODUCT PAGES' HERO RAIL — 1400 with px-6 md:px-10, which is what
// /client-portal and /ai-app-builder both set on their own hero blocks. Taken
// from them rather than picked: a hero on this site is 1400, and the homepage
// should not be the one page that is something else.
//
// It has been 1200 (the content measure, too narrow against a 1600 nav) and
// 1600 (the nav's own, which made the hero the widest thing on the site). 1400
// is the number the pages that already shipped this layout use.
const RAIL = "mx-auto max-w-[1400px] px-6 md:px-10";

// NO BUTTON CLASSES OF ITS OWN. PRIMARY_CTA is the hero's primary action as
// hero-big.tsx already defines it, and SECONDARY_CTA the outline that partners
// it in cta.tsx — both imported rather than restated, so this layout and the
// shipped hero are running one control and not two that merely look alike.
//
// The first draft of this file wrote its own `rounded-full` pair to follow the
// reference's pill shape. That was inventing a button: the site's hero pair is
// `rounded-lg`, every other page closes on it, and a hero with a different
// button shape from the rest of the site reads as a different site.

/**
 * The product shot: a client's own portal, with the firm's nav down the side
 * and an onboarding tracker open in it.
 *
 * STILL, and drawn once. It is the same window /client-portal's hero carries,
 * minus the carousel around it — the screens there are picked by the reader,
 * which is the right control on a page about the portal and the wrong one on
 * a homepage, where this is the first picture anyone sees.
 *
 * It fills the tile rather than being scaled into it. The mock is fluid —
 * `h-full` and `flex-1` throughout — so a wider window means the rows lay out
 * with more room at the same type size, which is a screen someone could
 * actually be looking at. Scaling a fixed drawing up instead would magnify
 * the type along with it and read as a screenshot zoomed in.
 *
 * The mock brings its own portal nav, so there is no sidebar to add here.
 *
 * The height is the product pages' hero-tray height.
 */
function ClientExperiencePanel() {
  return (
    <div
      // Its own ground and hairline, so the window reads as a window sitting
      // in the tile rather than as rows printed straight onto it.
      //
      // CAPPED AND CENTRED AT 1080. The mock is fluid and its type is fixed,
      // so a window the full width of a 1400 tile lays the same rows out
      // across half a metre at 9px and reads as an app stretched rather than
      // as an app. The product pages draw their screen at about 780 and crop
      // it; 1080 is the widest this one holds that density at. The tile keeps
      // its own width and the slack falls either side as mat.
      //
      // OPEN AT THE FOOT. No bottom border and no bottom radius: the screen
      // runs off the tile's bottom edge the way the product pages' does off
      // their card's, so the last row is cropped by the frame rather than
      // stopping short of it with a band of tile underneath — which read as
      // the table having run out rather than as a window onto more.
      className="mx-auto h-[280px] w-full max-w-[1080px] overflow-hidden rounded-t-xl border border-b-0 border-[var(--mock-line)] bg-background md:h-[391px]"
    >
      <OnboardingTrackerMock />
    </div>
  );
}

export function HeroSplit() {
  const { theme } = useTheme();
  const message = COPY_VARIANTS[FALLBACK_COPY];
  // The hand-set lockup where the message carries one, the plain headline as
  // a single line where it does not — `big.lines` is optional on the record.
  const lines = message.big?.lines ?? [message.h1];

  return (
    <>
      {/* THE SITE'S NAV RAIL, NOT THIS PAGE'S. 1600 with px-6 md:px-10 is
          what root-shell passes on every content page and what hero-v76 passes
          on the live homepage — root-shell's own comment says why: the two have
          to match exactly or the logo and links shift horizontally as you
          navigate between home and the rest of the site.

          This was `max-w-[1200px]` with no padding override, which broke it
          twice over. The bar narrowed to the content measure, so it no longer
          lined up with the nav on any other page; and dropping
          `restPaddingClass` fell back to a flat `px-6`, which put the logo 16px
          inside the hero's own left line below md's 40px — close enough to read
          as a mistake rather than as a difference. */}
      <StudioNav
        darkTop={theme === "dark"}
        maxWidthClass="max-w-[1600px]"
        restPaddingClass="px-6 md:px-10"
      />

      <section className="relative -mt-14 bg-background pb-16 md:-mt-16 md:pb-20">
        {/* pt-28 md:pt-32 — hero-big's own top inset and /security's, rather
            than a number picked for this layout. The -mt-14/-mt-16 above pulls
            the section under the fixed bar, so this is what actually sets the
            distance from the nav to the first line. */}
        <div className={`${RAIL} pt-28 md:pt-32`}>
          {/* Headline left, body right. They share a row from lg up and stack
              below it — at md the body column is too narrow to hold the lead
              at a readable measure beside a headline this size. */}
          {/* /client-portal's hero grid exactly: the same 1.15/0.85 split, the
              same gaps. Its hero is this same arrangement — headline ranged
              left, lead in the opposite column — so the two should measure the
              same, not merely look alike. */}
          {/* CENTRED UNTIL THE SPLIT, ranged left once there is one. The two
              columns only exist from lg, so between md and there the hero was
              a single stacked column of left-ranged type with the right half
              of the measure empty beside it — which reads as the desktop
              layout with its second column missing rather than as a narrower
              hero. The alignment now changes at the same breakpoint the
              layout does. /client-portal ranges left at every width; this is
              the one place V2 departs from it, deliberately. */}
          <div className="grid gap-8 text-center lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-x-16 lg:text-left">
            {/* CAPPED BELOW type-display-xl's OWN TOP END. That clamp runs to
                84px, which is sized for a headline that owns the full measure
                — in a column a little over half of it, "Deliver remarkable"
                broke inside itself and the two-line lockup came out as four.
                56px is what holds the lockup at this column width; the
                ladder's line-height and tracking are kept by leaving
                type-display-xl on and overriding only the size. */}
            <div>
              {/* The rating, above the claim it vouches for. Inside the
                  headline's column so it starts on the same left line. */}
              <HeroCredibility />
              <h1 className="type-display-xl text-balance text-foreground [font-size:clamp(2.5rem,1.1rem+3.3vw,3.5rem)]">
                {lines.map((line) => (
                  // Each line a block, so the lockup's breaks hold at every
                  // width rather than being re-balanced by the browser.
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h1>
            </div>
            {/* 34rem is /client-portal's measure, and it is right once the
                lead has a column of its own from lg. Stacked under the
                headline it is not: at the full width the first sentence very
                nearly fills one line on its own, so the pair set as one long
                line and one short one with the break landing on the full
                stop. A tighter measure breaks the first sentence itself,
                which is what gives the block two lines of similar length
                under a centred headline. lg:pt-2 is /client-portal's. */}
            <p className="type-lead mx-auto max-w-[26rem] text-pretty text-muted-foreground lg:mx-0 lg:max-w-[34rem] lg:pt-2">
              {PROTO_HERO_BODY}
            </p>
          </div>

          {/* The pair, on the headline's own left line. */}
          {/* Stacked and full width on a phone, inline from sm — the shape
              PRIMARY_CTA and SECONDARY_CTA are written for (see hero-big). */}
          {/* CENTRED WHILE THE COPY IS. The row is a block, so `w-auto` from
              sm made it full width and `mx-auto` had nothing to centre — the
              pair sat on the left under a headline and a lead that are both
              still centred until md. Between 640 and 768 that read as the
              buttons having slipped their column. `justify-center` is what
              actually centres flex children; it hands back to the left at md,
              where the copy does too. */}
          <div className="mx-auto mt-9 flex w-full max-w-sm flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:items-center sm:justify-center lg:mx-0 lg:justify-start">
            <a href={SIGNUP_URL} className={`unauth-only ${PRIMARY_CTA}`}>
              Get started
            </a>
            {/* Both ship and `data-authed` picks one before paint, the same way
                hero-big does it — "Get started" is the wrong sentence to hand
                someone who already has an account. */}
            <a href={APP_URL} className={`auth-only ${PRIMARY_CTA}`}>
              Open Assembly
            </a>
            <Link href={DEMO_URL} className={SECONDARY_CTA}>
              Book a demo
            </Link>
          </div>

          {/* ── The tile ───────────────────────────────────────────────── */}
          {/* THE TILE KEEPS THE HERO RAIL. It was briefly capped at 1080 to
              settle the screen inside it, and that moved the wrong box: the
              tile is the hero's own closing element and measures 1400 with
              everything above it. The cap is on the WINDOW now, inside a tile
              that is still full width — see ClientExperiencePanel. */}
          <div className="mt-12 md:mt-16">
            {/* The panel. rounded-3xl, the radius the site's large panels use.
                Clipped, and open at the foot, so the screen inside ends on the
                tile's own edge — see ClientExperiencePanel. */}
            {/* One inset at every width (20px), rather than 12 on a phone and
                20 from md: at 12 the screen sat almost on the tile's edge and
                the frame read as a hairline around it rather than as a mat the
                screen is set in. The foot stays open — see below. */}
            <div className="overflow-hidden rounded-3xl bg-[var(--surface)] p-5 pb-0">
              <ClientExperiencePanel />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
