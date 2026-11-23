"use client";

import { useEffect, useRef, useState } from "react";

const COPIED_MS = 2000;

/**
 * A pinned "Copy link" button in the window's bottom-right corner, so a reader
 * passing the post on doesn't have to reach for the address bar. The link is
 * the post's own address, without whatever section the reader scrolled to.
 * Desktop only: on a phone the floating sign-up button holds the bottom of the
 * screen, and the browser's own share sheet is a tap away.
 */
export function PostCopyLink() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    const url = `${window.location.origin}${window.location.pathname}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      return;
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), COPIED_MS);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="fixed bottom-4 right-4 z-40 hidden h-8 items-center gap-2 rounded-full border border-transparent bg-foreground px-3.5 text-[13px] text-background shadow-[0_12px_34px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.05)] transition-opacity hover:opacity-90 lg:flex"
    >
      <svg
        aria-hidden
        width="12"
        height="12"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        {copied ? (
          <path
            d="M3 8.5l3 3 7-7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <>
            <rect x="5" y="5" width="9" height="9" rx="1.5" />
            <path d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2h-6A1.5 1.5 0 0 0 2 3.5v6A1.5 1.5 0 0 0 3.5 11H5" />
          </>
        )}
      </svg>
      <span aria-live="polite">{copied ? "Copied" : "Copy link"}</span>
    </button>
  );
}
