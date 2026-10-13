import { Reveal } from "@/components/ui/reveal";
import {
  EmailReplyMock,
  SignInMock,
} from "@/components/client-portal/frictionless-mocks";

/**
 * Section 6 of handoff v2: the objection that the portal gets bought and then
 * never logged into.
 *
 * TWO CARDS, NOT THREE. The brief's October 9 edit removed a third ("One home
 * for every client") and the handoff lists it as out of scope, so the pair is
 * deliberate rather than a gap waiting to be filled.
 *
 * A split header over two cards, rather than V6's picture-left split. The
 * handoff draws one scene for the whole section; as a single pending panel it
 * was the largest empty rectangle on the page, and the two claims it covers
 * are a pair that reads better as a pair.
 *
 * The banned-words list in the handoff's conventions applies to the copy here
 * in particular: no "magic link", no "SSO", no "auth". The live page's own
 * labels used two of the three, which is why this section's wording does not
 * carry over from it.
 */
const CARDS: { title: string; body: string; visual: React.ReactNode }[] = [
  {
    title: "Sign in without a password",
    body: "Add a client and send invoices, forms, and contracts. They open them with Google sign-in or a one-click email link.",
    visual: <SignInMock />,
  },
  {
    title: "Reply by email",
    body: "Message clients from your dashboard and they get an email they can reply to directly. No portal visit required.",
    visual: <EmailReplyMock />,
  },
];

export function PortalFrictionless({
  heading = "Finally, a frictionless client experience",
  body = "Don’t force clients to remember another password or fumble with links.",
  cards = CARDS,
}: {
  heading?: string;
  body?: string;
  cards?: typeof CARDS;
} = {}) {
  return (
    <section className="mx-auto max-w-[1200px] px-6 py-16 md:px-10 md:py-24">
      <Reveal>
        {/* SPLIT HEADER, then two cards — the shape the journey section
            above uses and the one the reference lands on. It replaces a
            split of picture-left / copy-right, where the picture was a
            single pending panel the height of the whole section: one large
            empty rectangle, where two card-sized ones read as slots waiting
            for art. */}
        <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-x-16">
          {/* Two lines from lg, where the column is wide enough to set this
              on one and it ran the full measure as a single long line. A
              `ch` cap rather than a hard <br>: the break still follows the
              text, so it holds if the wording changes and it does not strand
              a fragment at a narrower width. `text-balance` then evens the
              two lines. */}
          <h2 className="type-h2 text-balance lg:max-w-[22ch]">{heading}</h2>
          <p className="text-pretty text-muted-foreground lg:pt-2">{body}</p>
        </div>

        {/* Picture above, copy at the foot — the opposite hand from the
            customizations cards, and deliberately so: those crop a running
            app off the card's edge, where these two hold a composed scene
            whole. A scene that is not cropped wants the card to close under
            it, which puts the copy last. */}
        <div className="mt-12 grid gap-4 md:mt-14 md:gap-5 lg:grid-cols-2">
          {cards.map((card) => (
            <div
              key={card.title}
              // overflow-hidden is new, and it is what makes the bleed below
              // safe: without it a scene that runs past the card's right edge
              // also runs past its rounded corner, so the card reads as having
              // a square corner on one side.
              className="flex min-w-0 flex-col overflow-hidden rounded-3xl bg-[var(--surface)] p-6 md:p-8"
            >
              {/* NO GROUND OF ITS OWN. The scene sits straight on the card.
                  It used to be inset on a lighter panel, which put a second
                  rounded box inside a rounded box for no reason — the scenes
                  already carry their own frames where they need one (the
                  sign-in card) or none at all (the thread), so the panel was
                  a third edge between them and the card.

                  The aspect ratio stays: it is what gives both cards the same
                  picture height whatever their scene does.

                  IT BLEEDS RIGHT AND DISSOLVES AT THE FOOT. Held whole and
                  inset on all four sides, both scenes were objects floating in
                  a card with a margin of empty ground around them — which is
                  why they read as small however large the card got. Running
                  one edge off the card is what gives a scene a scale: there is
                  no longer a frame around it saying how little of the card it
                  occupies.

                  The foot is the opposite problem. Bleeding it too would run
                  the scene straight into the caption, so instead it is masked
                  out — .mock-foot-fade, the ramp the rest of this family uses
                  to dissolve a contained shot into its card. The scene gives
                  out into --surface before the copy starts rather than ending
                  on a hard line a few pixels above it.

                  w-full is gone with the bleed: an explicit 100% width would
                  hold the box at the content measure and let the negative
                  margin only overlap what follows, where a block box at auto
                  width actually grows by it.

                  THE RAMP IS FROM sm UP, and that is not tidying. 4:3 of a
                  phone's card width is about 245px tall, and the sign-in's
                  form is nearly 200 of them — so the ramp, which starts at
                  72%, fell across the primary button and dissolved half of
                  it. A button faded through its middle does not read as a
                  screen carrying on past the frame; it reads as a button that
                  failed to paint. Written inline against the same token
                  rather than through .mock-foot-fade, because that is a plain
                  class and a variant cannot be prefixed onto it. */}
              <div className="-mr-6 aspect-[4/3] overflow-hidden sm:[-webkit-mask-image:var(--mock-foot-fade)] sm:[mask-image:var(--mock-foot-fade)] md:-mr-8">
                {card.visual}
              </div>
              <p className="mt-6 text-base leading-snug text-foreground">
                {card.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {card.body}
              </p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
