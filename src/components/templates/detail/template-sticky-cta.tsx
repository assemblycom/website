"use client";

import { useEffect, useState } from "react";

/**
 * The phone's bottom bar: once the hero's own CTA has scrolled up out of view,
 * the primary action pins to the bottom of the screen. Hidden from md, where
 * the hero CTA is never far away.
 *
 * It watches the hero CTA by id rather than taking a ref, so the hero itself
 * stays a server component. Only "scrolled past" counts: a CTA still below the
 * fold, on first paint of a short screen, leaves the bar down.
 */
export function TemplateStickyCta({
  watchId,
  children,
}: {
  watchId: string;
  children: React.ReactNode;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const target = document.getElementById(watchId);
    if (!target) return;
    const io = new IntersectionObserver(([entry]) => {
      setShow(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    io.observe(target);
    return () => io.disconnect();
  }, [watchId]);

  return (
    <div
      aria-hidden={!show}
      inert={!show}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background px-6 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] transition-transform duration-300 md:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      {children}
    </div>
  );
}
