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
 * `guide` is the SEO guides' version: a short image slot on top, a compact
 * title and pitch, tighter padding, and the G2 score under the button as proof,
 * sized to sit in the side column above the contents.
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
  return (
    <aside
      className={cn(
        "rounded-2xl bg-muted",
        guide ? "p-3.5" : "p-5",
        // The description is the writer's, so its length varies; the card holds
        // its shape by letting the text set the height and keeping the action
        // pinned to the full width beneath it.
        "flex flex-col",
        className,
      )}
    >
      {guide && (
        // Holds the place of the product image the card will carry; a moving
        // demo here pulled the eye off the article it sits beside.
        <div aria-hidden className="mb-3.5 aspect-[2/1] rounded-xl bg-border" />
      )}
      {cta.title && (
        <p
          className={cn(
            "text-foreground",
            guide
              ? "text-base leading-[1.35] tracking-[-0.006em]"
              : "text-[1.0625rem] leading-[1.35] tracking-[-0.006em]",
          )}
        >
          {cta.title}
        </p>
      )}
      {cta.description && (
        // Shown whole, never clipped: the pitch is written to run about two
        // lines (roughly 60 characters) in Ghost, rather than cut to fit here.
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {cta.description}
        </p>
      )}

      <a
        href={SIGNUP_URL}
        // The site's primary button, as the pricing and customers pages draw it.
        className={cn(
          "block rounded-lg bg-foreground px-5 py-2 text-center text-sm text-background transition-opacity hover:opacity-90",
          guide ? "mt-4" : "mt-5",
        )}
      >
        Try for free
      </a>

      {guide && (
        <a
          href={G2_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Assembly on G2: rated ${G2_SCORE} out of 5`}
          className="mt-3 flex items-center justify-center gap-1.5 whitespace-nowrap text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <G2Logo className="size-3.5 shrink-0" />
          {G2_SCORE} out of 5
        </a>
      )}
    </aside>
  );
}
