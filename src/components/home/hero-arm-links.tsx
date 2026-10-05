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
 * Done in an effect, and on the href rather than on click. An effect runs after
 * hydration, so rewriting an href here can't disagree with the server's markup
 * the way building it during render would. The href rather than a click handler
 * because a click handler misses the middle-click, the ⌘-click and the "copy
 * link address" — all of which read the href straight off the DOM.
 *
 * A single pass at mount is not enough. The nav builds its mobile menu — and
 * the "Get started" inside it — only when the visitor opens it, so on a phone
 * that link does not exist yet when this first runs and would never be stamped:
 * every signup from the mobile menu would arrive unattributed, which is most of
 * them on a phone. An observer catches those, and anything else added later.
 */

const SIGNUP_BASE = SIGNUP_URL.split("?")[0];

export function HeroArmLinks({ arm }: { arm: Arm }) {
  useEffect(() => {
    const stamp = (root: ParentNode) => {
      for (const link of root.querySelectorAll<HTMLAnchorElement>(
        'a[href*="/signup"]',
      )) {
        const href = link.getAttribute("href");
        // Only the real signup destination, and only when it isn't already
        // carrying an arm — the hero's own CTA is built with one.
        if (!href?.startsWith(SIGNUP_BASE)) continue;
        if (href.includes(`${HERO_ARM_PARAM}=`)) continue;
        link.setAttribute("href", withHeroArm(href, arm));
      }
    };

    stamp(document);

    // Subtree only: an href this effect rewrites is itself an attribute change,
    // so watching attributes would re-enter on every stamp. Added nodes are the
    // case that matters, and a link already carrying an arm is skipped anyway.
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (node.nodeType !== Node.ELEMENT_NODE) continue;
          const el = node as Element;
          // The added node can be the link itself or a menu containing one.
          if (el.matches('a[href*="/signup"]')) {
            const href = el.getAttribute("href");
            if (
              href?.startsWith(SIGNUP_BASE) &&
              !href.includes(`${HERO_ARM_PARAM}=`)
            ) {
              el.setAttribute("href", withHeroArm(href, arm));
            }
          }
          stamp(el);
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [arm]);

  return null;
}
