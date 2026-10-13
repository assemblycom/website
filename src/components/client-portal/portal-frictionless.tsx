import { Reveal } from "@/components/ui/reveal";

/**
 * Section 6 of handoff v2: the objection that the portal gets bought and then
 * never logged into.
 *
 * TWO CARDS, NOT THREE. The brief's October 9 edit removed a third ("One home
 * for every client") and the handoff lists it as out of scope, so the pair is
 * deliberate rather than a gap waiting to be filled.
 *
 * Split with the picture on the LEFT and the copy on the right, per V6's
 * layout — the opposite hand from the stack and trust sections further down,
 * which put their copy first. That alternation is the handoff's, and it keeps
 * four consecutive split sections from reading as one long column of text with
 * pictures stuck to the same edge.
 *
 * The banned-words list in the handoff's conventions applies to the copy here
 * in particular: no "magic link", no "SSO", no "auth". The live page's own
 * labels used two of the three, which is why this section's wording does not
 * carry over from it.
 */
const CARDS: { title: string; body: string }[] = [
  {
    title: "Sign in without a password",
    body: "Add a client and send invoices, forms, and contracts. They open them with Google sign-in or a one-click email link.",
  },
  {
    title: "Reply by email",
    body: "Message clients from your dashboard and they get an email they can reply to directly. No portal visit required.",
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
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Picture first in the source as well as on screen, so the reading
              order a screen reader takes matches the visual one. It is
              decorative and carries its art direction on the element, like
              every other pending slot on this page. */}
          <div
            aria-hidden
            title="V6 — a phone showing an email notification from Brandmages with the reply composed in the client's own mail app, behind it the portal thread carrying a 'Replied by email' badge; beside them the Brandmages sign-in screen on a laptop with 'Continue with Google' and 'Email me a sign-in link' and no password field. Art direction pending."
            className="h-[260px] rounded-3xl bg-[var(--surface)] sm:h-[340px] lg:h-[420px]"
          />

          <div>
            <h2 className="type-h2 text-balance">{heading}</h2>
            <p className="mt-4 text-muted-foreground">{body}</p>

            {/* Ruled rather than boxed. Two cards side by side in a column
                this narrow are two thin boxes; as a divided pair they read as
                the two halves of one answer, which is the same treatment the
                stack section's list uses. */}
            <ul className="mt-10 flex flex-col">
              {cards.map((card) => (
                <li
                  key={card.title}
                  className="border-t border-border py-6 last:pb-0 [[data-theme=dark]_&]:border-[#383838]"
                >
                  <p className="text-base leading-snug text-foreground">
                    {card.title}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {card.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
