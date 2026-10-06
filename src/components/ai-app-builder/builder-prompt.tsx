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
      <div className="v63-gradient-border v63-ring-solid v63-spin-on-hover relative rounded-[18px] [--composer-submit:var(--color-neutral-900)] md:rounded-[22px] [[data-theme=dark]_&]:[--composer-submit:#FFFFFF]">
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
          plusAsAttach
          submitLabel="Get started"
          // Signed in, "Get started" is the wrong sentence to hand someone who
          // already has an account.
          authedSubmitLabel="Open Assembly"
          // Light mode uses a solid black submit button; dark keeps the accent.
          submitDark={!dark}
          value={prompt}
          onValueChange={setPrompt}
          accent={dark ? "#7DA4FF" : "#D9ED92"}
          surfaceRadiusClass="rounded-[18px] md:rounded-[22px]"
          // Light needs an explicit faint fill: this hero is pure bg-background,
          // which would leave a white field on white with no inner/outer
          // separation. #f7f8fa is the same mid stop the CTA's box uses.
          surfaceClassName="bg-[#f7f8fa] shadow-[0_1px_2px_rgba(16,24,40,0.04)] [[data-theme=dark]_&]:bg-transparent [[data-theme=dark]_&]:shadow-[0_24px_60px_-28px_rgba(0,0,0,0.8)]"
        />
      </div>
    </div>
  );
}
