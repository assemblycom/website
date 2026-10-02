"use client";

import { useEffect } from "react";
import { SIGNUP_URL } from "@/lib/constants";
import { HERO_ARM_PARAM, withHeroArm, type Arm } from "@/lib/hero-variants";

/**
 * Adds the arm to every other signup link on the homepage.
 *
 * The hero's own CTA is built with the arm already on it, and the composer adds
 * it when it hands off. But the header and the footer each carry a signup link
 * of their own, and those are shared components rendered on every page — so
 * without this, anyone who reads the hero, scrolls, and signs up from the
 * footer arrives at signup unattributed.
 *
 * That would not merely lose volume, it would bias the result: the two layouts
 * put a different amount of weight on the hero's own CTA (the big-type arm has
 * no prompt box at all), so the share of signups that bypass it differs by arm,
 * and the arms would be measured on inconsistent denominators.
 *
 * Done in an effect, and on mount rather than on click. An effect runs after
 * hydration, so rewriting an href here can't disagree with the server's markup
 * the way building it during render would. Mount rather than click because a
 * click handler misses the middle-click, the ⌘-click and the "copy link
 * address" — all of which read the href straight off the DOM.
 */

const SIGNUP_BASE = SIGNUP_URL.split("?")[0];

export function HeroArmLinks({ arm }: { arm: Arm }) {
  useEffect(() => {
    const links = document.querySelectorAll<HTMLAnchorElement>(
      'a[href*="/signup"]',
    );
    for (const link of links) {
      const href = link.getAttribute("href");
      // Only the real signup destination, and only when it isn't already
      // carrying an arm — the hero's own CTA is built with one.
      if (!href?.startsWith(SIGNUP_BASE)) continue;
      if (href.includes(`${HERO_ARM_PARAM}=`)) continue;
      link.setAttribute("href", withHeroArm(href, arm));
    }
  }, [arm]);

  return null;
}
