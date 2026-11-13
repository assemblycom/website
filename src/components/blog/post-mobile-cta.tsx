"use client";

import { useEffect, useState } from "react";
import { SIGNUP_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * The guides' call to action below lg, where the sidebar card isn't drawn. It
 * slides up once the hero is scrolled past and away again when the page's own
 * closing CTA comes into view, so the two never sit on screen together.
 *
 * Measured on scroll rather than with an observer, like the contents bar: rect
 * reads are cheap and don't go stale where frames stop.
 */
export function PostMobileCta({
  heroSelector,
  endSelector,
}: {
  heroSelector: string;
  endSelector: string;
}) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const update = () => {
      const hero = document.querySelector(heroSelector);
      if (!hero) return;
      const end = document.querySelector(endSelector);
      const pastHero = hero.getBoundingClientRect().bottom < 0;
      const endInView = end
        ? end.getBoundingClientRect().top < window.innerHeight
        : false;
      setShown(pastHero && !endInView);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [heroSelector, endSelector]);

  return (
    <a
      href={SIGNUP_URL}
      aria-hidden={!shown}
      tabIndex={shown ? undefined : -1}
      className={cn(
        // The site's primary button, floated.
        "fixed bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] left-1/2 z-40 whitespace-nowrap rounded-lg bg-foreground px-[1.125rem] py-2 text-sm text-background shadow-[0_8px_20px_-8px_rgba(16,17,20,0.4)] transition-[opacity,transform] duration-250 ease-out motion-reduce:transition-none lg:hidden",
        shown
          ? "-translate-x-1/2 translate-y-0 opacity-100"
          : "pointer-events-none -translate-x-1/2 translate-y-4 opacity-0",
      )}
    >
      Try Assembly for free
    </a>
  );
}
