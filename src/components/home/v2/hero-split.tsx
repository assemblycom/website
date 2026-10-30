"use client";

import Link from "next/link";
import { useState } from "react";
import { StudioNav } from "@/components/home/studio-nav";
import { useTheme } from "@/components/theme/theme-provider";
import { APP_URL, DEMO_URL, SIGNUP_URL } from "@/lib/constants";
import { COPY_VARIANTS, FALLBACK_COPY } from "@/lib/hero-variants";
import { PRIMARY_CTA } from "@/components/home/hero-big";
import { SECONDARY_CTA } from "@/components/home/cta";
import { SegmentedTabs } from "@/components/ui/segmented-tabs";
import { HeroCredibility } from "@/components/home/v2/hero-credibility";

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
// THE TABS SIT INSIDE THE VISUAL, in its top-right corner — not on the page
// above the panel, where they were first drawn. On the page the control was
// another object stacked over the tile and the two read as separate things;
// laid on the shot it reads as the shot's own control, which is what it is.
//
// That corner is what `round="pill"` exists for, and the prop says so: a soft
// rectangle reads as another panel among the panels, a pill reads as a control
// laid on top of one. /client-portal's Theirs/Ours switch is the other case.
//
// NO ICONS ON THE TABS — the reference sets a small coloured sphere beside
// each one and this deliberately does not: asked for without them.
//
// THE PANEL IS A GREY PLACEHOLDER, as asked. It is labelled with the active
// tab so switching is visible while there is nothing real behind it. When the
// shots land, replace PlaceholderPanel and nothing else here moves.

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

interface Tab {
  id: string;
  label: string;
  /** The label on a phone, where the full one cannot fit three across. */
  short: string;
}

// Three, as the reference has — and named from NAV_ENTRIES' own Features
// column rather than invented, so a tab and the nav item it corresponds to
// are the same words.
const TABS: Tab[] = [
  {
    id: "portal",
    label: "Client portal",
    short: "Portal",
  },
  // The builder second, the ready-made apps third. The portal is what the
  // headline just promised, the builder is the thing that is ours, and the
  // ready-made apps are the detail of how you get there — so the middle slot
  // goes to the claim rather than to the catalogue.
  {
    id: "builder",
    label: "AI app builder",
    short: "Builder",
  },
  {
    id: "apps",
    label: "Ready-made apps",
    short: "Apps",
  },
];

/**
 * The space the product shot will occupy.
 *
 * Empty — no fill of its own (the tile around it is already `--surface`) and
 * no label. It carried the active tab's name so the panel visibly answered the
 * tabs while there was nothing in it; the tab control says which tab is on,
 * and a word floating in the middle of an empty panel read as a caption for a
 * picture that is not there yet.
 *
 * The height is the product pages' hero-tray height. See the comment on it.
 */
function PlaceholderPanel() {
  return (
    <div className="h-[280px] w-full overflow-hidden rounded-xl md:h-[391px]" />
  );
}

export function HeroSplit() {
  const { theme } = useTheme();
  const message = COPY_VARIANTS[FALLBACK_COPY];
  // The hand-set lockup where the message carries one, the plain headline as
  // a single line where it does not — `big.lines` is optional on the record.
  const lines = message.big?.lines ?? [message.h1];
  const [active, setActive] = useState(TABS[0].id);

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
          {/* CENTRED ON A PHONE, ranged left from md. The split only exists
              from lg, and a single stacked column of left-ranged type on a
              375px screen reads as the desktop layout with the second column
              missing. /client-portal ranges left at every width; this is the
              one place V2 departs from it, deliberately. */}
          <div className="grid gap-8 text-center md:text-left lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-x-16">
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
            {/* max-w-[34rem] and lg:pt-2, both /client-portal's. */}
            <p className="type-lead mx-auto max-w-[34rem] text-pretty text-muted-foreground md:mx-0 lg:pt-2">
              {message.body}
            </p>
          </div>

          {/* The pair, on the headline's own left line. */}
          {/* Stacked and full width on a phone, inline from sm — the shape
              PRIMARY_CTA and SECONDARY_CTA are written for (see hero-big). */}
          <div className="mx-auto mt-9 flex w-full max-w-sm flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:items-center md:mx-0">
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
          <div className="mt-12 md:mt-16">
            {/* The panel. rounded-3xl, the radius the site's large panels use. */}
            <div className="rounded-3xl bg-[var(--surface)] p-3 md:p-5">
              {/* The control sits BELOW the panel on a phone, full width, and
                  moves into the panel's top-right corner from md up — one
                  instance either way, so the tab/panel ids stay unique. */}
              <div className="relative">
                <PlaceholderPanel />
                <div className="mt-3 md:absolute md:right-4 md:top-4 md:mt-0">
                  <SegmentedTabs
                    // Pill track and thumb — the variant for a control laid on
                    // a picture. `bg-background` so the track is legible over
                    // whatever the shot behind it turns out to be.
                    round="pill"
                    className="w-full bg-background md:w-auto"
                    label="What Assembly does"
                    idBase="hero-tile"
                    value={active}
                    onChange={setActive}
                    options={TABS.map((t) => ({
                      value: t.id,
                      label: (
                        <>
                          <span className="md:hidden">{t.short}</span>
                          <span className="hidden md:inline">{t.label}</span>
                        </>
                      ),
                    }))}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
