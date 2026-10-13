import Link from "next/link";
import { QUIET_BUTTON } from "@/components/ui/quiet-button";
import { Reveal } from "@/components/ui/reveal";
import { SIGNUP_URL } from "@/lib/constants";

/**
 * Section 5 of handoff v2: the portal becomes yours three ways — your brand,
 * the apps in the sidebar, and your own domain.
 *
 * This is also the target of the problem section's jump link, which is why it
 * takes an `id`.
 *
 * EACH CARD OPENS ON ITS OWN CLAIM. The handoff writes the three as a short
 * sentence followed by its detail ("Make it look like your firm. Your logo,
 * images, colors…"), so the first sentence is the card's title and the rest is
 * its body. Splitting them in the data rather than rendering one blob keeps the
 * three titles scannable down the row, which is the whole reason the section is
 * three cards and not a paragraph.
 *
 * Visuals are V5's three 4:3 cards and are marked "Needs design"; each card
 * carries the slot at that proportion with its art direction on the element,
 * the same way the agency page stubs its trust shot.
 */
const CARDS: { title: string; body: string; visual: string }[] = [
  {
    title: "Make it look like your firm",
    body: "Your logo, images, colors, and typography on every screen, down to the sign-in page clients see first.",
    visual:
      "V5 Card 1 — the theme panel open with logo upload, image slot, color swatches and typography picker, beside a live preview of the client sign-in screen in Brandmages colors. Art direction pending.",
  },
  {
    title: "Fill the sidebar with the apps your firm needs",
    body: "Install or tailor apps in one click, or build a completely custom app with AI.",
    visual:
      "V5 Card 2 — the sidebar in edit mode with drag handles and a per-client visibility toggle, beside a build panel showing a plan and an Approve button, with a new Project Tracker item appearing in the sidebar. Art direction pending.",
  },
  {
    title: "Fully white-label",
    body: "Bring in your own custom domain, send email notifications from your company address, and remove any mention of Assembly.",
    visual:
      "V5 Card 3 — a browser frame at portal.brandmages.com showing the Brandmages sign-in screen with no Assembly badge, and a notification email preview sent from a brandmages.com address. Art direction pending.",
  },
];

/** The Sargent CPAs quote, which is this section's claim in a customer's words. */
const QUOTE = {
  text: "When clients log into the portal, they see our branded colors and our logos. They feel like it’s a safe, trusted place, with custom features in the side menu that are exactly what we need for our clients.",
  attribution: "Anthony Drozd, Operations Manager, Sargent CPAs",
  href: "/customers/sargent-cpa",
};

export function PortalCustomizations({
  id,
  heading = "Customize everything, from your brand to your apps",
  body = "Your logo, colors, and domain on every screen.",
  cards = CARDS,
  supportLine = "New apps land with your brand, logins, and permissions already in place. Choose which apps each client sees. Custom domain and badge removal are on Professional and up.",
  quote = QUOTE,
  cta = { label: "Describe your first app", href: SIGNUP_URL },
}: {
  id?: string;
  heading?: string;
  body?: string;
  cards?: typeof CARDS;
  supportLine?: string;
  quote?: { text: string; attribution: string; href: string };
  cta?: { label: string; href: string };
} = {}) {
  return (
    <section
      id={id}
      className="mx-auto max-w-[1200px] px-6 py-16 md:px-10 md:py-24"
    >
      <Reveal>
        <div className="max-w-2xl">
          <h2 className="type-h2 text-balance">{heading}</h2>
          <p className="mt-4 text-muted-foreground">{body}</p>
        </div>

        {/* Three equal cards. The tinted pad is the same object the tailor
            grid below uses — same radius, same ground — so the two card rows
            on this page read as one family rather than two. */}
        <div className="mt-12 grid gap-4 md:mt-14 md:gap-5 lg:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.title}
              className="flex flex-col rounded-3xl bg-[var(--surface)] p-6 md:p-8"
            >
              {/* 4:3, per V5. aspect-[4/3] rather than a pixel height so the
                  slot keeps the proportion at every column width instead of
                  going letterbox on a tablet. */}
              <div
                aria-hidden
                title={card.visual}
                className="aspect-[4/3] w-full rounded-2xl bg-background/60 [[data-theme=dark]_&]:bg-white/[0.04]"
              />
              <p className="mt-6 text-base leading-snug text-foreground">
                {card.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {card.body}
              </p>
            </div>
          ))}
        </div>

        {/* Support line, then the proof, then the way in. The plan boundary
            lives in this line rather than in the Domain card above: the
            handoff moved it here to keep that card under length, and it is
            the one sentence on the page that qualifies all three cards. */}
        {supportLine ? (
          <p className="mt-10 max-w-3xl text-sm text-muted-foreground">
            {supportLine}
          </p>
        ) : null}

        {quote ? (
          <figure className="mt-10 max-w-2xl">
            <blockquote className="text-pretty text-foreground">
              &ldquo;{quote.text}&rdquo;
            </blockquote>
            <figcaption className="type-caption mt-3 text-muted-foreground">
              <Link
                href={quote.href}
                className="transition-colors hover:text-foreground"
              >
                {quote.attribution}
              </Link>
            </figcaption>
          </figure>
        ) : null}

        {cta ? (
          <a href={cta.href} className={`mt-8 ${QUIET_BUTTON}`}>
            {cta.label}
          </a>
        ) : null}
      </Reveal>
    </section>
  );
}
