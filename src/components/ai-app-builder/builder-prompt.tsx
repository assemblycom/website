"use client";

import { useEffect, useRef, useState } from "react";
import { IconPlus } from "@/components/home/mock-icons";
import { IconArrowUp } from "@/components/home/build-step-visual";
import { LOGIN_URL, SIGNUP_URL } from "@/lib/constants";

// ─────────────────────────────────────────────────────────────────────────
// BUILDER PROMPT — the composer under /ai-app-builder's headline.
//
// The page's hero used to be a headline and lead on the left with a picture
// of the product beside it. This puts the thing you type into directly under
// the claim instead, centred, which is how every builder's own front door is
// laid out: the first interactive element IS the pitch.
//
// It is a REAL field. It was briefly a link — the whole box one target to the
// signup — and that is the one thing a composer must not be: it looks like
// somewhere to put a sentence, so clicking it and being thrown to a signup
// form reads as a bait. You can type here. The arrow, and Enter, are what
// leave the page.
//
// What it does NOT do is carry the typed text across. The signup URL has no
// parameter this site knows the app reads, and inventing one would be a
// promise the other end does not keep — someone would type a paragraph, land
// in an empty composer, and have to write it again. One line to add here the
// moment the app accepts it.
//
// Drawn from the same parts as the composer mocks elsewhere on the site (the
// attach glyph on the left, the model and the send gathered right), so the
// reader meets the same object here that they will meet inside.
//
// The edge is the site's own composer ring — .v63-gradient-border, the same
// one the home hero and the CTA box wear — over a second, plain hairline on
// the box itself, with a few pixels between them. Two edges rather than one is
// the point: the coloured ring says "live", and the hairline inside it is
// still an ordinary input. The ring holds its sweep at rest and turns while
// the pointer is on the box; see .v63-spin-on-hover in globals.css.
// ─────────────────────────────────────────────────────────────────────────

export function BuilderPrompt({
  placeholder = "Describe the app your firm needs…",
  model = "Opus 5",
}: {
  placeholder?: string;
  model?: string;
} = {}) {
  const [value, setValue] = useState("");
  // The attach control's popover. Attaching a file is a signed-in action, so
  // the glyph answers with what it would do and the way to get there rather
  // than opening a file picker that cannot lead anywhere.
  const [attachOpen, setAttachOpen] = useState(false);
  const attach = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!attachOpen) return;
    const onDown = (e: PointerEvent) => {
      if (!attach.current?.contains(e.target as Node)) setAttachOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAttachOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [attachOpen]);

  const go = () => {
    window.location.href = SIGNUP_URL;
  };

  return (
    // The outer ring. p-[5px] is the gap between the two edges — without it the
    // gradient and the hairline sit on the same line and read as one slightly
    // dirty border rather than as a ring around a box.
    //
    // focus-within is already handled by .v63-gradient-border, which calms the
    // ring while someone is typing rather than leaving it sweeping under their
    // cursor.
    <form
      onSubmit={(e) => {
        e.preventDefault();
        go();
      }}
      className="v63-gradient-border v63-ring-solid v63-spin-on-hover relative mx-auto mt-10 w-full max-w-[640px] rounded-[20px] bg-background p-[5px] [[data-theme=dark]_&]:bg-[var(--surface)]"
    >
      <div className="group rounded-[15px] border border-border bg-background p-4 sm:p-5 [[data-theme=dark]_&]:border-[#383838] [[data-theme=dark]_&]:bg-[var(--mock-window)]">
        {/* The empty run under the first line is the point: it says there is
            room to say more than one sentence. Three rows rather than a grown
            field, so the box never changes height under the headline. */}
        <textarea
          rows={3}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            // Enter sends, Shift+Enter is a new line — the composer's own
            // convention, and the one inside the product.
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              go();
            }
          }}
          placeholder={placeholder}
          aria-label="Describe the app you want to build"
          className="block w-full resize-none bg-transparent text-[15px] leading-[1.6] text-foreground outline-none placeholder:text-muted-foreground"
        />
        <div className="mt-4 flex items-center justify-between gap-2.5">
          <div ref={attach} className="relative">
            <button
              type="button"
              onClick={() => setAttachOpen((open) => !open)}
              aria-expanded={attachOpen}
              aria-label="More features"
              className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground [&>svg]:size-4 [[data-theme=dark]_&]:hover:bg-white/[0.08]"
            >
              <IconPlus />
            </button>
            {attachOpen ? (
              // Above the glyph, not below it: the composer sits low in a hero
              // that fills the viewport, and a panel hanging off its bottom
              // edge opened below the fold.
              <div
                role="dialog"
                aria-label="More features"
                className="absolute bottom-[calc(100%+8px)] left-0 z-20 w-[272px] rounded-2xl border border-border bg-background p-4 text-left shadow-[0_1px_2px_rgba(16,24,40,0.04),0_18px_40px_-20px_rgba(16,24,40,0.28)] [[data-theme=dark]_&]:border-[#383838] [[data-theme=dark]_&]:bg-[var(--surface-2)] [[data-theme=dark]_&]:shadow-[0_18px_44px_-20px_rgba(0,0,0,0.7)]"
              >
                <p className="text-[15px] leading-snug text-foreground">
                  Unlock more features
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  Attach files and images, apply themes, connect integrations,
                  and more by logging in.
                </p>
                <div className="mt-4 flex justify-end">
                  <a
                    href={LOGIN_URL}
                    className="rounded-lg bg-foreground px-4 py-2 text-sm text-background transition-opacity hover:opacity-90"
                  >
                    Log in
                  </a>
                </div>
              </div>
            ) : null}
          </div>
          <div className="flex items-center gap-2.5">
            {/* No chevron: this is not a menu waiting to be opened, and a caret
                invites a click that goes somewhere else entirely. */}
            <span className="text-[13px] leading-none text-muted-foreground">
              {model}
            </span>
            <button
              type="submit"
              aria-label="Start building"
              className="flex size-8 items-center justify-center rounded-lg bg-foreground text-background transition-opacity hover:opacity-90"
            >
              <IconArrowUp className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
