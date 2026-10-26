"use client";

import { useState } from "react";

/**
 * A ruled list row that, below lg, shows its label alone with a caret and
 * opens its sentence on tap — the list runs one column there, and a column of
 * open sentences was a wall of text. From lg the sentence is always shown and
 * the caret goes. The caret and the 0fr → 1fr reveal are the FAQ's.
 *
 * From lg the label is plain text and the button is display:none, not just
 * unclickable: a button left in place there stayed in the tab order and
 * announced "collapsed" over a description that was on screen.
 */
export function CollapsibleRow({
  label,
  body,
  className,
}: {
  label: string;
  body: string;
  /** The row's rule and padding, from the list. */
  className: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <li className={className}>
      <span className="min-w-0 flex-1">
        <span className="hidden text-[15px] text-foreground lg:block">{label}</span>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex w-full items-center justify-between gap-4 text-left lg:hidden"
        >
          <span className="block text-[15px] text-foreground">{label}</span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden
            className={`shrink-0 text-muted-foreground transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
              open ? "rotate-0" : "-rotate-90"
            }`}
          >
            <path
              d="M5 8l5 5 5-5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <span
          className={`grid transition-[grid-template-rows] duration-300 ease-out lg:grid-rows-[1fr] ${
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <span className="min-h-0 overflow-hidden">
            <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{body}</span>
          </span>
        </span>
      </span>
    </li>
  );
}
