import { Reveal } from "@/components/ui/reveal";
import {
  EmailReplyMock,
  SignInButtonMock,
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
/**
 * The cards' ground in dark: the site's own ramp, Haze at the head down to
 * lime at the foot — the same run the builder hero's cards take, and for the
 * same reason. A flat card of one value is a swatch; a ramp is a surface.
 *
 * AND THE LADDER THAT MAKES IT SURVIVABLE. Flipping a card to a light ground
 * in dark leaves everything inside still resolving page tokens tuned for
 * near-black: the title reads --foreground and the caption --muted-foreground,
 * both near-white, and both sit at the FOOT of the card, which is the lime end
 * of the run. So the two tokens the card's own copy reads are re-pointed to
 * light-ground values, declared only in the dark branch — light resolves
 * exactly what it always did.
 *
 * --muted-foreground is the desaturated navy the hero uses rather than light's
 * own grey, for the reason it does there: a grey tuned against white lands
 * near 3.4:1 on a mid ground and the caption reads as half-erased.
 *
 * The --mock-* tokens are deliberately untouched, so both scenes stay
 * dark-themed — the sign-in keeps its near-black screen and the thread keeps
 * its dark bubbles, which is what makes them read as product on a surface
 * rather than as part of the card.
 */
const CARD_GROUND =
  "bg-[var(--surface)] " +
  // THE RAMP RUNS IN BOTH THEMES. It was dark-only, on the reasoning that
  // light's card is already a near-white panel on a white page and wants no
  // help. True of the ground; false of the picture — the thread's bubbles sit
  // straight on this card with no frame, and on a flat grey they were two
  // greys on a third. The ramp is brand colour either way, and in light the
  // page's own ink is already dark-on-light, so nothing below it has to move.
  "bg-[linear-gradient(180deg,#7DA4FF_0%,#AFC2D9_52%,#D9ED92_100%)] " +
  "[[data-theme=dark]_&]:[--surface:#7DA4FF] " +
  "[[data-theme=dark]_&]:[--foreground:#101114] " +
  "[[data-theme=dark]_&]:[--muted-foreground:#223049]";

const CARDS: {
  title: string;
  body: string;
  visual: React.ReactNode;
  /**
   * The picture's ground: a photo, or the brand ramp when there is none.
   * The copy sits under the picture, so the ground runs to every edge.
   */
  background?: string;
  /**
   * Until lg, size the picture to its scene instead of the 4:3 box. The
   * cards stack there, so they need not match, and a short scene in a tall
   * box was mostly empty ramp.
   */
  fitOnPhone?: boolean;
}[] = [
  {
    title: "Sign in without a password",
    body: "Add a client and send invoices, forms, and contracts. They open them with Google sign-in or a one-click email link.",
    visual: <SignInButtonMock />,
    background: "url(/images/mocks/sign-in-bg.jpg) center 40% / cover",
  },
  {
    title: "Reply by email",
    body: "Message clients from your dashboard and they get an email they can reply to directly. No portal visit required.",
    visual: <EmailReplyMock />,
    fitOnPhone: true,
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
        <div className="mt-12 grid gap-10 md:mt-14 lg:grid-cols-2 lg:gap-5">
          {cards.map((card) => (
            <div key={card.title} className="flex min-w-0 flex-col">
              {/* COPY OUTSIDE THE BOX, the shape the comparison pages' cards
                  use, so the photo or ramp can fill the picture to its edges
                  instead of sitting inset on a grey card. */}
              <div
                className={`overflow-hidden rounded-3xl lg:aspect-[10/9] ${
                  card.fitOnPhone
                    ? "py-14 lg:py-0"
                    : "aspect-[4/3]"
                } ${card.background ? "" : CARD_GROUND}`}
                style={
                  card.background ? { background: card.background } : undefined
                }
              >
                {card.visual}
              </div>
              <div className="mt-4 px-1">
                <p className="text-base leading-snug text-foreground">
                  {card.title}
                </p>
                <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
                  {card.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
