"use client";

import { useState } from "react";
import { V66Composer } from "@/components/home/hero-v66";
import { useTheme } from "@/components/theme/theme-provider";

// ─────────────────────────────────────────────────────────────────────────
// BUILDER PROMPT — the composer under /ai-app-builder's headline.
//
// The page's hero used to be a headline and lead on the left with a picture
// of the product beside it. This puts the thing you type into directly under
// the claim instead, centred, which is how every builder's own front door is
// laid out: the first interactive element IS the pitch.
//
// It is the site's own composer — V66Composer, the same control the home hero
// and the bottom CTA wear — rather than a second box built from the same
// parts. It was the latter for a while, and drifted: a hairline inside the
// ring instead of the inset field, an icon-only arrow instead of the labelled
// pill, and a model name in the footer that the other two don't carry. Three
// boxes that are meant to read as one object have to BE one component.
//
// Two deliberate differences from the CTA's copy of it, both because of where
// this one sits:
//
// - **No Ideas menu.** The page opens on this box and the prompts it would
//   list are the page's own next section; offering them before the reader has
//   seen anything is a menu of answers to a question they haven't asked.
// - **No model pill.** "Auto" was a fact with a shelf life on a marketing
//   page, and in the split footer it sat beside the submit as though it were
//   a control you had to set before you could start.
//
// Typed text now travels: the composer's own submit stamps the value onto the
// signup, which the hand-rolled box could not do.
// ─────────────────────────────────────────────────────────────────────────

export function BuilderPrompt({
  placeholder = "Describe the app your firm needs…",
}: {
  placeholder?: string;
} = {}) {
  const [prompt, setPrompt] = useState("");
  const { theme } = useTheme();
  const dark = theme === "dark";

  return (
    // The outer ring, and the submit pill's two fills, exactly as the CTA and
    // the home hero set them — these boxes sit on the same site and a value
    // changed in one and not the others is visible by scrolling.
    <div className="mx-auto mt-14 w-full max-w-[640px] text-left md:mt-16">
      {/*
        Four tokens overridden here and nowhere else on the site. All four
        default to the shipped values inside the composer, so every other box
        is untouched; this is the one composer whose frame is transparent in
        dark, which is what makes each of them wrong here specifically.

        - --composer-field. The page's own #0A0A0A, not the composer's default
          #1b1b1b and not a lifted grey.

          The frame here is transparent glass and the arc lights it, so the
          composer has two materials in it: a lit pane, and the field inside
          that pane. The field's job is to be the second one, and the cleanest
          way to read as a well cut into a lit surface is to be the dark the
          surface was cut out of. At #0A0A0A the box is exactly that — black
          well, lit glass, nothing else.

          Two values were tried and are worse, both because they add a THIRD
          tone that belongs to neither material. #1b1b1b is eight points off
          the page, close enough to look like the page showing through by
          accident rather than by intent. A lifted #262626 is further off and
          reads as a grey slab laid on the glass — the muddiest of the three
          on screen, and the one a side-by-side at 1:1 settles immediately. A
          cool part-transparent fill letting the arc tint the field was tried
          too: the blue cast read as colour applied to the input rather than
          as light falling on it.

          Being the page colour also helps the one measurement that matters
          here — the placeholder gains contrast against a darker field rather
          than losing it.
        - --composer-placeholder. It is the only label the box carries, and
          white/40 on the raised field is 3.6:1. /55 clears 4.5:1.
        - --composer-ring-opacity. The ring is a solid blue→lime loop at full
          strength. On an unlit page it is the only colour in the frame and it
          reads as the box being live; over the arc it is a second coloured
          edge competing with the one behind it, and the two together read as
          decoration. At 0.55 it still moves and still says live.
        - --composer-submit. Pure #FFFFFF is the brightest thing on the page
          at a point where the arc is already near its peak, so the pill
          out-shouted the headline. #EDEDED is a neutral step down — enough to
          sit under the type without reading as disabled.

        Dark only. Light mode sets none of the four and is byte-for-byte what
        it was — its field is bg-white over a white-washed frame, which has
        the separation this one lost.
      */}
      {/* rounded-lg — 8px, the radius every button on this site already
          carries, the nav's "Book a demo" and "Get started" included. It was
          18/22, which put the page's largest soft corner directly above a row
          of 8px buttons and around a submit that is itself one of them; two
          radii that far apart on one object read as two objects.
          The composer's own surface takes the same number below, so the
          gradient border and the pane inside it stay on one curve.
          THE BUILDER HERO ONLY. The home hero and the bottom CTA run the same
          component at 18/22 and keep it. */}
      <div className="composer-outer-ring v63-gradient-border v63-ring-solid v63-spin-on-hover v63-still-on-focus relative rounded-lg [--composer-submit:var(--color-neutral-900)] [[data-theme=dark]_&]:[--composer-placeholder:#FFFFFF8C] [[data-theme=dark]_&]:[--composer-ring-opacity:0.55] [[data-theme=dark]_&]:[--composer-submit:#EDEDED]">
        <V66Composer
          // The headline above already names what to type, so this box leads
          // with its own static placeholder rather than the cycling "Build …"
          // the home hero runs.
          placeholder={placeholder}
          // Always accented — the pill routes to onboarding even over an empty
          // box, so it never reads as disabled.
          submitDisabled={false}
          glow={false}
          tone={theme}
          // Both skins in CSS, so the field isn't a white slab on the first
          // paint for a dark-mode visitor (see the composer's themeAuto).
          themeAuto
          compact
          minimalControls
          splitFooter
          hideHowTo
          // No "+". It opened a popover explaining that attachments, branding
          // and integrations come with an account — a feature list delivered
          // as a disabled control, on the one box whose whole job is to get a
          // sentence typed into it. The page makes those arguments in its own
          // sections, at length, further down; the hero does not need a menu
          // that interrupts the typing to repeat them.
          //
          // This also empties the footer's left group, which is why the submit
          // keeps its side of a justify-between with nothing opposite it.
          hidePlus
          // ONE pane: no inner field box. The frame here is a real material
          // (glass over the arc), so it can be the surface you type into
          // rather than a tray holding a second surface that is.
          unifiedSurface
          // Shorter than the shared 188px default. That height was drawn for
          // the two-box composer, where the inner field needed enough of its
          // own body to read as a field inside a frame. As one pane there is
          // no inner box to give height to — what is left is an empty glass
          // slab between the first line and the footer.
          minHeightClass="min-h-[144px]"
          submitLabel="Get started"
          // Signed in, "Get started" is the wrong sentence to hand someone who
          // already has an account.
          authedSubmitLabel="Open Assembly"
          // Light mode uses a solid black submit button; dark keeps the accent.
          submitDark={!dark}
          value={prompt}
          onValueChange={setPrompt}
          accent={dark ? "#7DA4FF" : "#D9ED92"}
          surfaceRadiusClass="rounded-lg"
          // Glass in BOTH themes, so the horizon behind the hero runs through
          // the composer's frame instead of stopping at it. The inner field is
          // opaque in both (bg-white / #1b1b1b, set by the composer itself), so
          // what the arc shows through is the frame and the footer row around
          // it — the box still reads as a solid thing you type into, sitting on
          // a lit ground, rather than a translucent sheet.
          //
          // This used to be a flat #f7f8fa in light, on the reasoning that the
          // hero was pure bg-background and a white field on white would have
          // no inner/outer separation. That stopped being true when the glow
          // landed: the separation now comes from the arc behind it.
          //
          // Both themes frost what is behind them — that is what makes it glass
          // rather than a hole cut in the box. The arc still runs through, but
          // as a soft wash, so the frame reads as a pane with light behind it
          // instead of a window onto a sharp edge passing under the controls.
          //
          // BOTH themes carry a veil now — light a white wash, dark a black
          // one. Dark used to carry none, on the grounds that near-black
          // furniture holds up over a lit ground on its own. That was true
          // while the inner field was #1b1b1b. It stopped being true when the
          // field went to the page's #0A0A0A: an unveiled frame is the raw arc
          // at full strength, so the box became a pure-black panel sitting in
          // a bright tray, with the brightest thing in it an EMPTY strip of
          // footer. Two materials that far apart read as two stacked objects
          // rather than as one control.
          //
          // 45% closes that gap without closing the window. The arc still
          // comes through the frame — that is the whole reason the frame is
          // glass — but as light behind smoked glass rather than as a lit band
          // in its own right, so the eye goes to the field and the submit
          // instead of to the gap between them. Tried at 20% (the band is
          // still visibly lighter than the field) and 35% (close); 45% is
          // where the box reads as one object.
          surfaceClassName="bg-white/55 shadow-[0_1px_2px_rgba(16,24,40,0.04)] backdrop-blur-2xl [[data-theme=dark]_&]:bg-black/45 [[data-theme=dark]_&]:shadow-[0_24px_60px_-28px_rgba(0,0,0,0.8)]"
        />
      </div>
    </div>
  );
}
