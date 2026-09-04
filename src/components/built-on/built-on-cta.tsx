"use client";

import {
  BUILT_ON_EVENTS,
  trackBuiltOn,
  type BuiltOnEventProps,
} from "./built-on-events";

const PRIMARY_BUTTON =
  "rounded-lg bg-foreground px-5 py-2.5 text-center text-sm text-background transition-opacity hover:opacity-90";

/**
 * The signup link. Every instance on the page is this one component, so the
 * click is reported the same way wherever it was pressed.
 */
export function BuiltOnCta({
  href,
  event,
  className = "",
}: {
  href: string;
  event: BuiltOnEventProps;
  className?: string;
}) {
  return (
    <a
      href={href}
      onClick={() => trackBuiltOn(BUILT_ON_EVENTS.ctaClicked, event)}
      className={`${PRIMARY_BUTTON} mx-auto block w-full max-w-xs sm:inline-block sm:w-auto ${className}`}
    >
      Get started
    </a>
  );
}
