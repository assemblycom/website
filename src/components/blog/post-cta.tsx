import { G2Logo } from "@/components/customers/review-marks";
import { G2_URL, SIGNUP_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { PostCta as PostCtaContent } from "@/lib/ghost";

/**
 * The G2 score quoted under the guide card, the same figure as the /customers
 * review strip; update both together when G2 moves.
 */
const G2_SCORE = "4.7";

/**
 * The call to action a post's writer authored in Ghost, drawn as a card rather
 * than as a run of body text. It sits in the rail beside the article on a wide
 * screen and at the end of the post where there is no rail.
 *
 * `guide` is the SEO guides' version: a bordered card with the image flush to
 * its edges, the button in a strip of its own and the G2 score beneath, sized
 * to sit in the side column.
 */
export function PostCta({
  cta,
  guide = false,
  className,
}: {
  cta: PostCtaContent;
  guide?: boolean;
  className?: string;
}) {
  const button = (
    <a
      href={SIGNUP_URL}
      // The site's primary button, as the pricing and customers pages draw it.
      className="block rounded-lg bg-foreground px-5 py-2 text-center text-sm text-background transition-opacity hover:opacity-90"
    >
      Try for free
    </a>
  );

  if (!guide) {
    return (
      <aside
        className={cn("flex flex-col rounded-xl bg-muted p-5", className)}
      >
        {cta.title && (
          <p className="text-[1.0625rem] leading-[1.35] tracking-[-0.006em] text-foreground">
            {cta.title}
          </p>
        )}
        {cta.description && (
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {cta.description}
          </p>
        )}
        <div className="mt-5">{button}</div>
      </aside>
    );
  }

  // The guides' card is built like a product shot with a button under it: the
  // image runs to the card's edges and the action follows the pitch on its inset, so the
  // card reads as "this is the product" before it reads as an ad. The G2 score
  // sits right under the button as proof for the click it asks for.
  return (
    <aside
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border border-border bg-background [[data-theme=dark]_&]:border-[#262626]",
        className,
      )}
    >
      {/* Holds the place of the product image the card will carry; a moving
          demo here pulled the eye off the article it sits beside. */}
      <div aria-hidden className="aspect-[4/3] bg-[var(--surface)]" />
      {(cta.title || cta.description) && (
        <div className="px-4 pb-4 pt-3.5">
          {cta.title && (
            <p className="text-base leading-[1.35] tracking-[-0.006em] text-foreground">
              {cta.title}
            </p>
          )}
          {cta.description && (
            // Shown whole, never clipped: the pitch is written to run about
            // two lines (roughly 60 characters) in Ghost.
            <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
              {cta.description}
            </p>
          )}
        </div>
      )}
      <div className="px-4 pb-4">
        {button}
        <a
          href={G2_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Assembly on G2: rated ${G2_SCORE} out of 5`}
          className="mt-2.5 flex items-center justify-center gap-1.5 whitespace-nowrap text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <G2Logo className="size-3.5 shrink-0" />
          {G2_SCORE} out of 5
        </a>
      </div>
    </aside>
  );
}
