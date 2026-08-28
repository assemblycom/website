"use client";

import { useSyncExternalStore } from "react";
import { APP_URL, DESKTOP_DOWNLOADS } from "@/lib/constants";

/**
 * Linear's download-page shape: one primary button for the platform you are on,
 * and everything else as a quiet row underneath. Three equal-weight cards made
 * the reader choose between builds before knowing which one was theirs.
 *
 * Mac leads by default and Windows takes over when we can tell — a wrong guess
 * costs a glance at the rows below, so this leans on the common case rather
 * than waiting for certainty.
 */

function subscribe() {
  return () => {};
}

function isWindows() {
  const platform =
    (navigator as Navigator & { userAgentData?: { platform?: string } })
      .userAgentData?.platform ?? navigator.userAgent;
  return /win/i.test(platform);
}

const MAC_ARM = DESKTOP_DOWNLOADS[0];
const MAC_INTEL = DESKTOP_DOWNLOADS[1];
const WINDOWS = DESKTOP_DOWNLOADS[2];

export function DownloadPicker() {
  // Read through useSyncExternalStore rather than an effect: the server has no
  // navigator, so it needs its own snapshot, and this is the hook that lets
  // hydration render the server's answer and then correct it in one pass.
  // Nothing to subscribe to — the platform does not change under us.
  const onWindows = useSyncExternalStore(subscribe, isWindows, () => false);

  // Apple silicon is the primary Mac build: every Mac sold since 2020 is one,
  // and the browser cannot tell us which this is — Chrome reports Intel on both.
  // Intel sits in the rows below rather than behind a guess.
  const primary = onWindows ? WINDOWS : MAC_ARM;
  const others = onWindows ? [MAC_ARM, MAC_INTEL] : [MAC_INTEL, WINDOWS];

  return (
    <>
      <div className="mt-10 flex justify-center">
        <a
          href={primary.href}
          className="inline-flex items-center rounded-lg bg-foreground px-5 py-2.5 text-sm text-background transition-opacity hover:opacity-90"
        >
          {primary.label}
        </a>
      </div>

      {/* The remaining builds, plus the browser — a row is a line of text and an
          action, not a card, so nothing here competes with the button above. */}
      {/* Full bleed on a phone: the rules run to both edges while the row's
          own padding keeps its text on the page's 24px inset. Inside a card
          width they would stop short of the edge and read as a stray table. */}
      <ul className="-mx-6 mt-12 text-left sm:mx-auto sm:max-w-sm">
        {others.map((build) => (
          <Row key={build.href} label={build.platform} href={build.href}>
            Download
          </Row>
        ))}
        <Row label="Web app" href={APP_URL} external>
          Open
        </Row>
      </ul>
    </>
  );
}

function Row({
  label,
  href,
  external = false,
  children,
}: {
  label: string;
  href: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  return (
    <li className="border-t border-border last:border-b [[data-theme=dark]_&]:border-[#383838]">
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="group flex items-center justify-between gap-6 px-6 py-4 transition-colors sm:px-0"
      >
        <span className="type-body text-muted-foreground transition-colors group-hover:text-foreground">
          {label}
        </span>
        <span className="type-caption shrink-0 text-foreground underline underline-offset-4 decoration-foreground/25 transition-colors group-hover:decoration-foreground">
          {children}
        </span>
      </a>
    </li>
  );
}
