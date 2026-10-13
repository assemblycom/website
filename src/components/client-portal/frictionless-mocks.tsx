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

const LINE = "border-[var(--mock-line)]";

/** The firm's mark, as a lettered tile rather than a logo file. */
function Brandmark() {
  return (
    <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-[color:var(--mock-ink)] text-[11px] leading-none text-[color:var(--mock-window)]">
      B
    </span>
  );
}

/**
 * Card 1 — the client sign-in screen. Two ways in and no password field,
 * which is the whole claim, so the absence has to be legible: the two buttons
 * sit where a password field would be, and the footnote names what is missing
 * rather than leaving the reader to notice.
 */
export function SignInMock() {
  return (
    <div
      aria-hidden
      className="pointer-events-none flex h-full select-none items-center justify-center p-5"
    >
      <div
        className={`w-full max-w-[260px] rounded-xl border bg-[var(--mock-window)] p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_12px_28px_-20px_rgba(16,24,40,0.25)] ${LINE} [[data-theme=dark]_&]:shadow-[0_12px_28px_-20px_rgba(0,0,0,0.6)]`}
      >
        <div className="flex items-center gap-2">
          <Brandmark />
          <span className="text-[11px] leading-none text-[color:var(--mock-ink)]">
            Brandmages
          </span>
        </div>

        <p className="mt-4 text-[12px] leading-snug text-[color:var(--mock-ink)]">
          Sign in to your portal
        </p>

        {/* The outlined option first, the filled one second: Google is the
            one a client recognises, and the email link is the fallback it
            falls back to. */}
        <div
          className={`mt-3 flex items-center justify-center gap-2 rounded-lg border bg-[var(--mock-well-soft)] px-3 py-2 ${LINE}`}
        >
          <GoogleGlyph />
          <span className="text-[10.5px] leading-none text-[color:var(--mock-ink)]">
            Continue with Google
          </span>
        </div>

        <div className="mt-2 flex items-center justify-center rounded-lg bg-[color:var(--mock-ink)] px-3 py-2">
          <span className="text-[10.5px] leading-none text-[color:var(--mock-window)]">
            Email me a sign-in link
          </span>
        </div>

        <p className="mt-3 text-center text-[9.5px] leading-none text-[color:var(--mock-ink-soft)]">
          No password to remember
        </p>
      </div>
    </div>
  );
}

/** Google's mark, drawn rather than imported — four paths, no asset. */
function GoogleGlyph() {
  return (
    <svg viewBox="0 0 18 18" className="size-[11px] shrink-0">
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
 * Card 2 — a thread where the client's turn came in from their inbox.
 *
 * The badge is the point. Without it this is any message thread; with it the
 * middle bubble is a reply that never required the portal, which is what the
 * card claims. So the client's bubble is the only one that carries it, and it
 * sits under the bubble rather than inside it — inside, at this size, it
 * competed with the message itself.
 */
const THREAD: { from: "firm" | "client"; text: string; byEmail?: boolean }[] = [
  { from: "firm", text: "Your Q3 report is ready for review." },
  { from: "client", text: "Got it — looks good, approved.", byEmail: true },
  { from: "firm", text: "Thanks. I'll send the invoice over." },
];

export function EmailReplyMock() {
  return (
    <div
      aria-hidden
      className="pointer-events-none flex h-full select-none flex-col justify-center gap-2.5 p-5"
    >
      {THREAD.map((m, i) => (
        <div
          key={i}
          className={`flex flex-col ${m.from === "client" ? "items-end" : "items-start"}`}
        >
          <div
            className={`max-w-[80%] rounded-xl px-3 py-2 text-[10.5px] leading-snug ${
              m.from === "client"
                ? "bg-[color:var(--mock-ink)] text-[color:var(--mock-window)]"
                : `border bg-[var(--mock-window)] text-[color:var(--mock-ink)] ${LINE}`
            }`}
          >
            {m.text}
          </div>
          {m.byEmail ? (
            <span className="mt-1.5 flex items-center gap-1 text-[9px] leading-none text-[color:var(--mock-ink-soft)]">
              <EnvelopeGlyph />
              Replied by email
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function EnvelopeGlyph() {
  return (
    <svg viewBox="0 0 12 12" className="size-[9px] shrink-0">
      <rect
        x="1"
        y="2.5"
        width="10"
        height="7"
        rx="1.25"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path
        d="M1.5 3.5 6 6.5l4.5-3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
