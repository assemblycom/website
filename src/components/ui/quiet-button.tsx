// ─────────────────────────────────────────────────────────────────────────
// QUIET BUTTON — the outlined secondary action that closes a section.
//
// "Browse templates", "See full pricing", "Read the security overview": the
// same control, written out by hand in six places, which is why they had all
// drifted into the same mobile bug at once.
//
// A className rather than a component, because the call sites are a mix of
// next/link and plain <a>, and several add their own margin or order. Wrapping
// them in a component would mean a prop for every one of those; a shared class
// string leaves the element alone and still gives the shape one home.
//
// THE MOBILE SHAPE is the point of extracting it. Every copy was
// `inline-block … py-1.5`, so on a phone it came out as a small pill sized to
// its own text, sitting under a full-width paragraph — which reads as a
// leftover rather than as the section's next step — and at roughly 30px tall
// it was under the 44px minimum for something you tap.
//
// Full width with a real tap target on phones, back to its own size from sm.
// That is not a new idea: it is exactly what the hero's button pair already
// does (see the comment on /client-portal's hero), so this brings six
// stragglers onto a pattern the site had already settled.
// ─────────────────────────────────────────────────────────────────────────

// THE OUTLINE is --foreground at 20%, not --border.
//
// --border is #e8e9ec, the hairline that DIVIDES things — right for a rule a
// reader should not notice, and much too faint for a control. It left these
// buttons visibly paler than "Book a demo" and "Get started" sitting in the nav
// directly above them, which draw at foreground/20 (about #cfcfd0 in light).
// Two outlined buttons on one screen that disagree about their own edge read
// as one of them being disabled.
//
// Dark takes white/25, the same pair the hero's secondary button already runs —
// --foreground resolves light there, so the same token would have inverted the
// relationship rather than preserved it.
//
// THE INK matches too: --foreground, not --muted-foreground. The same two
// buttons in the nav set their label at full strength, and a control whose own
// text is dimmed reads as unavailable rather than as secondary — the rank is
// carried by having no fill, which is already enough. Hover fills faintly
// instead of changing the ink, which is again what the nav pair does.
export const QUIET_BUTTON =
  "block w-full rounded-lg border border-foreground/20 px-4 py-3 text-center text-sm text-foreground transition-colors hover:bg-foreground/[0.06] sm:inline-block sm:w-auto sm:py-1.5 sm:text-left [[data-theme=dark]_&]:border-white/25 [[data-theme=dark]_&]:hover:bg-white/[0.06]";
