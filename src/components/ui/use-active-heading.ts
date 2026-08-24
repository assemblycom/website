"use client";

import { useEffect, useState } from "react";
import type { TocHeading } from "@/components/ui/toc-mobile";

/**
 * Where a heading has to reach before it counts as the one being read.
 *
 * Both contents lists land on 112px, by two routes that happen to agree. On a
 * phone it is the settled nav (48) plus the contents bar under it (48) plus the
 * 16px a jumped-to heading sits below them. On a desktop there is no bar, and it
 * is the `scroll-margin-top: 7rem` the stylesheet gives `.post-body` headings —
 * so a heading jumped to from the rail is exactly at the line the moment it
 * lands, rather than a pixel short of counting.
 */
export const HEADING_PASSED_AT = 112;

/**
 * Which of a page's headings is currently being read: the last one to have
 * passed under the header.
 *
 * Deliberately not an IntersectionObserver. That only reports while a heading
 * sits inside its band, so the answer goes stale through any section taller than
 * the screen — and these posts have several. Measuring the whole set on scroll
 * is a dozen rect reads, which is cheap, and unlike a frame-scheduled read it
 * does not go stale wherever frames stop: a backgrounded tab, an embedded
 * preview.
 *
 * `setActive` is returned so a click can claim its section immediately, instead
 * of waiting for the jump to land and scroll to catch up.
 */
export function useActiveHeading(headings: TocHeading[]) {
  const [activeId, setActiveId] = useState(headings[0]?.id);

  useEffect(() => {
    const update = () => {
      const passed = headings.filter((heading) => {
        const element = document.getElementById(heading.id);
        return element
          ? // Floored: a heading jumped to lands on a fractional pixel
            // (112.1875 where the line is 112), and comparing the raw value
            // leaves it one thousandth short of counting.
            Math.floor(element.getBoundingClientRect().top) <=
              HEADING_PASSED_AT
          : false;
      });
      setActiveId(passed.at(-1)?.id ?? headings[0]?.id);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [headings]);

  return [activeId, setActiveId] as const;
}
