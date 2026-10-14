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
   * Whether the scene runs off the card's right edge.
   *
   * On for a scene that is a crop of something larger — the thread, which is
   * a window onto a conversation that carries on past the frame. Off for one
   * that is composed whole: the sign-in is a single centred screen, and a
   * centred thing cannot be centred in a box that hangs 24px off the card.
   */
  bleed?: boolean;
  /**
   * The card's ground: the brand ramp, or the page's flat --surface.
   *
   * Ramp by default. See the sign-in entry for the one that opts out.
   */
  ground?: "ramp" | "flat";
}[] = [
  {
    title: "Sign in without a password",
    body: "Add a client and send invoices, forms, and contracts. They open them with Google sign-in or a one-click email link.",
    visual: <SignInMock />,
    bleed: false,
    // FLAT, where the thread card ramps. The sign-in scene is a framed screen
    // that fills most of its card, so the ground shows only as a margin around
    // it — and a gradient read as a halo in the gap rather than as a surface
    // the screen stands on. The thread has no frame and its bubbles sit
    // straight on the card, which is where a ramp has something to be.
    ground: "flat",
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
              className={`flex min-w-0 flex-col overflow-hidden rounded-3xl p-6 md:p-8 ${
                card.ground === "flat" ? "bg-[var(--surface)]" : CARD_GROUND
              }`}
            >
              {/* NO GROUND OF ITS OWN. The scene sits straight on the card.
                  It used to be inset on a lighter panel, which put a second
                  rounded box inside a rounded box for no reason — the scenes
                  already carry their own frames where they need one (the
                  sign-in card) or none at all (the thread), so the panel was
                  a third edge between them and the card.

                  The aspect ratio stays: it is what gives both cards the same
                  picture height whatever their scene does.

                  IT BLEEDS RIGHT AND DISSOLVES AT THE FOOT — the bleed per
                  card now, see `bleed` in the data. Held whole and
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

                  THE RAMP RUNS AT EVERY WIDTH, including a phone.

                  It used to start at sm, and that was not tidying: 4:3 of a
                  phone's card width is about 245px tall, the sign-in's form
                  was nearly 200 of them, and the ramp starts at 72% — so it
                  fell across the primary button and dissolved half of it. A
                  button faded through its middle does not read as a screen
                  carrying on past the frame; it reads as a button that failed
                  to paint.

                  That scene has since been rebuilt (the brand wash is gone and
                  the form is centred with its own space beneath), so at 72%
                  the ramp now lands on empty panel rather than on a control.
                  With it gated to sm the phone was the one width where the
                  frame stopped on a hard line a few pixels above its caption —
                  the picture ending rather than giving out. Written inline
                  against the same token rather than through .mock-foot-fade,
                  because that is a plain class and a variant cannot be
                  prefixed onto it. */}
              <div
                className={`aspect-[4/3] overflow-hidden [-webkit-mask-image:var(--mock-foot-fade)] [mask-image:var(--mock-foot-fade)] ${
                  card.bleed === false ? "" : "-mr-6 md:-mr-8"
                }`}
              >
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
