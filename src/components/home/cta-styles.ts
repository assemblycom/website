// Plain module, not "use client": server pages (the /lp landing pages) read
// these too, and a server importer of a client module's export gets a proxy
// rather than the string.

// The hero's own button pair (see hero-big.tsx), minus its experiment
// tracking — so the page's close is the same control its top opens with.
export const PRIMARY_CTA =
  "inline-flex w-full shrink-0 items-center justify-center whitespace-nowrap rounded-lg bg-foreground px-4 py-3 text-center text-sm text-background transition-opacity hover:opacity-90 sm:w-auto sm:py-2 md:px-5 md:py-2.5 [[data-theme=dark]_&]:bg-white [[data-theme=dark]_&]:text-neutral-900";

export const SECONDARY_CTA =
  "inline-flex w-full shrink-0 items-center justify-center whitespace-nowrap rounded-lg border border-foreground/20 bg-transparent px-4 py-3 text-center text-sm text-foreground transition-colors hover:bg-foreground/5 sm:w-auto sm:py-2 md:px-5 md:py-2.5 [[data-theme=dark]_&]:border-white/25 [[data-theme=dark]_&]:text-white";

// The two plan facts set under a composer or a pair of buttons, as mono chips.
export const PLAN_CHIPS = ["Free forever", "No credit card required"] as const;

export const PLAN_CHIP =
  "rounded-md bg-muted px-2 py-1 font-mono text-[11px] uppercase leading-none tracking-wide text-muted-foreground [[data-theme=dark]_&]:bg-white/[0.06]";
