"use client";

import { PortalFrictionless } from "@/components/client-portal/portal-frictionless";
import {
  BODY as PLATFORM_BODY,
  HEADING as PLATFORM_HEADING,
  REGIONS,
  type RegionId,
} from "@/components/home/production-gap";
import { SHOTS } from "@/components/home/v2/platform-visuals";

// ─────────────────────────────────────────────────────────────────────────
// UNIFIED PLATFORM (V4) — the four tabs laid out as cards instead of a tour.
//
// The product pages' card section (client portal's PortalFrictionless): split
// header, photo on top, copy under it. Same titles and photographs as V2's
// tabbed version, with the copy cut to a line. Four across from xl,
// since a tour hides three of the four claims at any moment and a row of
// cards shows them all at once.
// ─────────────────────────────────────────────────────────────────────────

// One line each, shorter than the tour's paragraphs: under a tall photo the
// card is read at a glance, and the tour's copy ran to five lines a card.
const SHORT_BODY: Record<RegionId, string> = {
  url: "Your contacts in one CRM, and a branded portal for every client.",
  sidebar: "Intake, onboarding, payments and more, ready to use or remix.",
  builder: "Describe what you need and AI builds it into your workspace.",
  avatar: "SOC 2 Type II, with every app in its own sandbox.",
};

// Titles hold one line at the card's width; only the first ran to two.
const SHORT_TITLE: Partial<Record<RegionId, string>> = {
  url: "Built-in CRM and portal",
};

const CARDS = REGIONS.map((region) => ({
  title: SHORT_TITLE[region.id] ?? region.header,
  body: SHORT_BODY[region.id],
  visual: null,
  background: `url(${SHOTS[region.id].src}) center / cover`,
}));

export function PlatformCards() {
  return (
    <PortalFrictionless
      heading={PLATFORM_HEADING}
      body={PLATFORM_BODY}
      cards={CARDS}
      gridClassName="md:grid-cols-2 md:gap-x-5 xl:grid-cols-4"
      aspectClassName="md:aspect-[4/5]"
    />
  );
}
