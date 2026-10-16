/**
 * The two scenes for the frictionless section's cards.
 *
 * Drawn rather than left as pending slots: V6 is one picture in the handoff
 * and is marked "Needs design", but the two claims it covers — a sign-in with
 * no password, and a client replying from their inbox — are small enough to
 * draw honestly from what the product actually does, and two empty panels in
 * the middle of the page were costing more than the art is worth.
 *
 * BUILT ON THE --mock-* TOKENS, like every other mock in this family. Nothing
 * here is a raw hex or a Tailwind grey: the scenes sit inside a card whose
 * ground flips with the theme, so anything hardcoded would be right in one
 * theme and wrong in the other. See segment-mock.tsx for the same vocabulary.
 *
 * The banned-words list in the handoff's conventions applies to the labels in
 * here as much as to the copy: no "magic link", no "SSO". The sign-in screen
 * says what the buttons say in the product.
 */

import { IconBrandMark } from "@/components/home/mock-icons";

const LINE = "border-[var(--mock-line)]";

const SIGNIN_BUTTON =
  "flex w-full items-center justify-center rounded-lg " +
  "bg-[var(--mock-window)] px-3 py-3.5 shadow-sm";

/**
 * The Google button alone, set on the card's photo. The full screen covered
 * most of the picture, and the one control is enough to say "no password".
 * On the window's own ground rather than the well, so it stands off the photo.
 */
export function SignInButtonMock() {
  return (
    <div
      aria-hidden
      className="pointer-events-none flex h-full select-none items-center justify-center px-8"
    >
      <div className={`${SIGNIN_BUTTON} max-w-[300px] gap-2`}>
        <GoogleGlyph />
        <span className="whitespace-nowrap text-[15px] leading-none text-[color:var(--mock-ink)]">
          Continue with Google
        </span>
      </div>
    </div>
  );
}

/** Google's mark, drawn rather than imported — four paths, no asset. */
export function GoogleGlyph() {
  return (
    <svg viewBox="0 0 18 18" className="size-[13px] shrink-0">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.93v2.33A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.93a9 9 0 0 0 0 8.1l3.04-2.33Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.9 11.43 0 9 0A9 9 0 0 0 .93 4.95l3.04 2.33C4.68 5.16 6.66 3.58 9 3.58Z"
      />
    </svg>
  );
}

/**
 * Card 2 — the portal message as it lands in the client's inbox.
 *
 * It was a chat thread with a "Replied by email" tag, which read as texting:
 * the one card about email showed no email. Drawn as a mail client's reading
 * view instead (subject, sender row, and a letter), so the
 * picture says "email" before the caption does.
 *
 * Closed and centred rather than running off the card's foot: the message is
 * short, and a window stretched past it was mostly empty panel.
 */
const MUTED = "text-[color:var(--mock-ink-soft)]";

export function EmailReplyMock() {
  return (
    <div
      aria-hidden
      className="pointer-events-none flex h-full select-none flex-col justify-center px-4 sm:px-10"
    >
      <div
        className={`flex min-w-0 flex-col overflow-hidden rounded-xl border bg-[var(--mock-window)] p-4 text-[color:var(--mock-ink)] sm:p-6 [font-family:var(--font-inter),system-ui,sans-serif] ${LINE}`}
      >
        <div className="flex min-w-0 items-center gap-2">
          <p className="truncate text-[15px] leading-snug sm:text-[17px]">
            Spring catalogue covers
          </p>
          <span
            className={`shrink-0 rounded border bg-[var(--mock-well-2)] px-1.5 py-1 text-[11px] leading-none text-[color:var(--mock-ink)] ${LINE}`}
          >
            Inbox
          </span>
        </div>

        {/* Avatar and the two text lines are the same 36px, so they share
            edges; the time sits on the name's line, as in Gmail. */}
        <div className="mt-3 flex min-w-0 items-start gap-2.5 sm:mt-4">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--mock-ink)] text-[color:var(--mock-window)]">
            <IconBrandMark className="size-[15px]" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] leading-[18px]">
              Brandmages{" "}
              <span className={`hidden sm:inline ${MUTED}`}>
                &lt;portal@brandmages.com&gt;
              </span>
            </p>
            <p className={`truncate text-[12px] leading-[18px] ${MUTED}`}>
              to me
            </p>
          </div>
          <span
            className={`flex h-[18px] shrink-0 items-center text-[12px] ${MUTED}`}
          >
            9:41 AM
          </span>
        </div>

        {/* Paragraph gaps a blank line wide, as a real letter sets them. With
            two tight lines the window read as a notification, not an email. */}
        <div className="mt-4 space-y-3.5 text-[13px] leading-relaxed sm:ml-[46px] sm:mt-5 sm:space-y-4">
          <p>Hi Margot,</p>
          <p>
            Round 2 of the spring catalogue covers is ready. We used the warmer
            palette from your notes and added two new layout options.
          </p>
          <p>
            Reply with feedback, and we&rsquo;ll get the final files over by
            Friday.
          </p>
          <p>
            Best,
            <br />
            Sofia
          </p>
        </div>
      </div>
    </div>
  );
}
