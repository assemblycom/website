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

/**
 * The firm's mark.
 *
 * IconBrandMark, not a lettered tile. It was a "B" on a square, which is the
 * fallback a workspace gets before anyone uploads a logo — on the one screen
 * where the mark is the only identification there is, that said the firm had
 * not finished setting itself up. The glyph is the one every other mock in
 * this family draws for Brandmages (the portal sidebar, the invoice head, the
 * workspace rail), so this screen now shows the same firm as the rest of the
 * page rather than a placeholder for it.
 */
function Brandmark() {
  return (
    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[color:var(--mock-ink)] text-[color:var(--mock-window)]">
      <IconBrandMark className="size-[15px]" />
    </span>
  );
}

/**
 * Card 1 — the client sign-in screen. Two ways in and no password field,
 * which is the whole claim, so the absence has to be legible: the two buttons
 * sit where a password field would be, and there is nothing under them.
 *
 * A footnote used to spell it out ("No password to remember"). It went
 * because the card's own caption, two lines below the picture, already says
 * the same thing in better words — and a screen that labels what it is
 * missing is captioning itself. The empty space under the second button is
 * the point: that is where the password field would be.
 *
 * DRAWN AS THE WHOLE PAGE, not as a dialog floating in the card.
 *
 * It used to be a 260px panel centred in a 4:3 box with a drop shadow, which
 * at the card's real width left well over half the picture empty and made the
 * one screen on the page a reader is meant to recognise the smallest object on
 * it. The type inside it was 9.5–12px to fit, so the claim — "no password to
 * remember" — was set smaller than any caption around it.
 *
 * So it fills its box and splits, which is the shape a sign-in page actually
 * has: the form on one side, the firm's own imagery on the other. That also
 * pays for itself twice — the panel gives the empty half something to be, and
 * the photograph is the firm's, which is the same claim the branding section
 * makes about every other screen.
 *
 * The image drops below sm. At a phone's card width the split leaves a form
 * column too narrow for "Continue with Google" to set on one line, and a
 * sign-in that wraps its own button label reads as broken rather than as
 * responsive.
 */
export function SignInMock() {
  return (
    <div aria-hidden className="pointer-events-none h-full select-none">
      {/* The scene carries its own window: this card sets its picture straight
          on the card ground with no panel of its own (see portal-frictionless),
          so the frame has to come from here or there is no screen edge at all. */}
      {/* The frame closes on the two edges that are still on the card, and
          opens on the two that are not: the scene bleeds off the right and is
          masked out at the foot (see portal-frictionless), so a border or a
          radius there would be an edge drawn across a picture that is supposed
          to be carrying on. Same shape the customization cards' windows use. */}
      <div
        className={`flex h-full overflow-hidden rounded-tl-xl border-l border-t bg-[var(--mock-window)] ${LINE}`}
      >
        {/* ONE ALIGNMENT DOWN THE COLUMN, and it is centred — the way this
            site's other sign-in draws it and the way most sign-ins do. It was
            left-ranged with the footnote centred under it, which put two
            alignments in a block four elements tall.

            THE MARK STANDS ALONE. It carried the firm's name beside it, which
            is a workspace header's lockup rather than a sign-in's: on the
            screen a client actually lands on, the logo is the identification
            and the sentence under it says where they are. Two of them is the
            name twice, and it is the heading that should be read.

            Everything is a step up in size too. The scene is drawn at the
            card's full width, not at rail scale, and at 9.5–12px the claim
            this card exists to make ("no password to remember") was set
            smaller than the caption underneath the picture. */}
        <div className="flex min-w-0 flex-1 flex-col items-center justify-center px-7 py-6 text-center sm:px-8">
          <Brandmark />

          <p className="mt-5 text-[18px] leading-snug text-[color:var(--mock-ink)]">
            Sign in to your portal
          </p>

          {/* The outlined option first, the filled one second: Google is the
              one a client recognises, and the email link is the fallback it
              falls back to. */}
          <div
            className={`mt-5 flex w-full items-center justify-center gap-2 rounded-lg border bg-[var(--mock-well-soft)] px-3 py-3 ${LINE}`}
          >
            <GoogleGlyph />
            <span className="whitespace-nowrap text-[14px] leading-none text-[color:var(--mock-ink)]">
              Continue with Google
            </span>
          </div>

          <div className="mt-3 flex w-full items-center justify-center rounded-lg bg-[color:var(--mock-ink)] px-3 py-3">
            <span className="whitespace-nowrap text-[14px] leading-none text-[color:var(--mock-window)]">
              Email me a sign-in link
            </span>
          </div>
        </div>

        {/* The firm's own imagery, the way a sign-in page carries it: a panel
            down one side rather than a picture inside the form. Its width is a
            fraction rather than a fixed value, so the form column keeps the
            same proportion of whatever the card gives it.

            A WASH, NOT A PICTURE — and not a file either. It showed the
            portrait the approvals screen reviews a few sections up, which put
            the loudest thing a picture can hold beside a form whose subject is
            two buttons: the reader looked at her. Replacing it with an
            exported abstract fixed that and introduced the theme problem, one
            artwork on two grounds — a near-black slab sitting on a white
            screen in light.

            --signin-brand-wash is the same wash drawn in CSS with a value per
            theme, so each ground gets the version that belongs on it. See
            globals.css. It also carries the site's periwinkle, which is the
            colour the branding card's sign-in button wears, so the two cards
            show one firm.

            INSET AT THE TOP AND ROUNDED INTO THE FORM. The panel ran the full
            height flush to the frame's top edge, which made it a second
            surface butted against the screen rather than something sitting on
            it. A gap above and a radius on the corner that faces the form is
            what reads as placed. The other three corners are left alone —
            right and bottom are off the card (the scene bleeds right and its
            foot is masked), so a radius there would be a corner drawn on a
            picture that is supposed to be carrying on. */}
        <div className="hidden w-[42%] shrink-0 flex-col pl-5 pt-6 sm:flex">
          <div className="min-h-0 flex-1 overflow-hidden rounded-tl-2xl [background:var(--signin-brand-wash)]" />
        </div>
      </div>
    </div>
  );
}

/** Google's mark, drawn rather than imported — four paths, no asset. */
function GoogleGlyph() {
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
 * Card 2 — a thread where the client's turn came in from their inbox.
 *
 * The badge is the point. Without it this is any message thread; with it the
 * middle bubble is a reply that never required the portal, which is what the
 * card claims. So the client's bubble is the only one that carries it, and it
 * sits under the bubble rather than inside it — inside, at this size, it
 * competed with the message itself.
 *
 * WORDS ONLY. It led with an envelope glyph, which was the badge saying
 * "email" twice: the three words next to it already say it, and at 11px the
 * glyph was a grey tick that had to be squinted at to be identified as an
 * envelope at all. A mark that needs its own label is not earning its place.
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
      // BIGGER, AND IT HAD TO BE. Three 10.5px bubbles centred in a box the
      // card's full width were a thread drawn at a third of the size of the
      // copy beneath it — the scene read as a thumbnail of a picture rather
      // than as the picture. At 14px the bubbles are close to the product's
      // own, which is what a close-up of a thread should be.
      //
      // The gutter is asymmetric now: the scene bleeds off the card's right
      // edge (see portal-frictionless), so the padding that would have sat
      // there is gone and the client's own bubble is the thing running off.
      // That is the right bubble to crop — it is the one the badge belongs to,
      // and the badge stays on the card.
      className="pointer-events-none flex h-full select-none flex-col justify-center gap-4 py-6 pl-6 pr-10 sm:pl-8"
    >
      {THREAD.map((m, i) => (
        <div
          key={i}
          className={`flex flex-col ${m.from === "client" ? "items-end" : "items-start"}`}
        >
          <div
            className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-[14px] leading-snug ${
              m.from === "client"
                ? "bg-[color:var(--mock-ink)] text-[color:var(--mock-window)]"
                : `border bg-[var(--mock-window)] text-[color:var(--mock-ink)] ${LINE}`
            }`}
          >
            {m.text}
          </div>
          {m.byEmail ? (
            <span className="mt-2 text-[11.5px] leading-none text-[color:var(--mock-ink-soft)]">
              Replied by email
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}
