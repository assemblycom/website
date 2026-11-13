import { G2Logo } from "@/components/customers/review-marks";
import { G2_URL, SIGNUP_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { PostCta as PostCtaContent } from "@/lib/ghost";

/**
 * The G2 score quoted under the guide card. Same figures as the /customers
 * review strip (4.7) plus the review count Masse took off the G2 listing on
 * 2026-11-11 — update both together when G2 moves.
 */
const G2_SCORE = "4.7";
const G2_REVIEWS = 352;

/**
 * The call to action a post's writer authored in Ghost, drawn as a card rather
 * than as a run of body text. It sits in the rail beside the article on a wide
 * screen and at the end of the post where there is no rail.
 *
 * `guide` is the SEO guides' version: an image slot on top, a slightly
 * larger title, tighter padding, and the G2 score under the button as proof.
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
        <div aria-hidden className="mb-4 aspect-[16/10] rounded-xl bg-border" />
      )}
      {cta.title && (
        <p
          className={cn(
            "text-foreground",
            guide
              ? "text-lg font-medium leading-[1.3] tracking-[-0.01em]"
              : "text-[1.0625rem] leading-[1.35] tracking-[-0.006em]",
          )}
        >
          {cta.title}
        </p>
      )}
      {cta.description && (
        <p
          className={cn(
            "mt-2 text-sm leading-6 text-muted-foreground",
            // The writer's text runs to any length, and under the demo a long one
            // pushes the button out of a sticky card's reach; three lines is the
            // pitch, the post itself is the detail.
            guide && "line-clamp-3",
          )}
        >
          {cta.description}
        </p>
      )}

      <a
        href={SIGNUP_URL}
        // The site's primary button, as the pricing and customers pages draw it.
        className="mt-5 block rounded-lg bg-foreground px-5 py-2 text-center text-sm text-background transition-opacity hover:opacity-90"
      >
        Try for free
      </a>

      {guide && (
        <a
          href={G2_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Assembly on G2: ${G2_SCORE} out of 5 from ${G2_REVIEWS} reviews`}
          className="mt-3 flex items-center justify-center gap-1.5 whitespace-nowrap text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <G2Logo className="size-3.5 shrink-0" />
          {G2_SCORE} out of 5 · {G2_REVIEWS} reviews
        </a>
      )}
    </aside>
  );
}
