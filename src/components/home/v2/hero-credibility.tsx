import Link from "next/link";

// ─────────────────────────────────────────────────────────────────────────
// HERO RATING — the one line of proof that sits ABOVE the headline.
//
// It used to be a row under the tile carrying the G2 rating AND the SOC 2 /
// HIPAA chips, with the logo reel and the four figures in a band below that.
// Three separate proof devices inside one screen is more than the top of a
// page can spend: the compliance marks have gone (the security section further
// down makes that case properly, with the full seal band), the figures have
// gone with them, and what is left here is the rating alone.
//
// ABOVE THE HEADLINE, not under it. A rating read before the claim frames the
// claim — someone else already vouched for this — where the same line read
// after it is a footnote to something you have already decided about.
// ─────────────────────────────────────────────────────────────────────────

/** PLACEHOLDER — swap for the real G2 figures before this goes anywhere live. */
const G2 = {
  rating: 4.8,
  reviews: 420,
  href: "https://www.g2.com/products/assembly/reviews",
};

function Stars({ rating }: { rating: number }) {
  return (
    <span aria-hidden className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => {
        // Partial last star, clipped to the fractional part, so 4.8 reads as
        // 4.8 rather than rounding itself up to a perfect score.
        const fill = Math.max(0, Math.min(1, rating - i));
        return (
          <span key={i} className="relative block size-3.5">
            <Star className="absolute inset-0 text-foreground/15" />
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fill * 100}%` }}
            >
              <Star className="size-3.5 text-foreground/70" />
            </span>
          </span>
        );
      })}
    </span>
  );
}

function Star({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden>
      <path d="M10 1.6l2.47 5.26 5.53.79-4 4.05.94 5.7L10 14.7l-4.94 2.7.94-5.7-4-4.05 5.53-.79z" />
    </svg>
  );
}

export function HeroCredibility() {
  return (
    // Ranged left on the headline's own line, not centred: the hero is a split
    // layout now and this is the first thing in its left column.
    <Link
      href={G2.href}
      target="_blank"
      rel="noopener noreferrer"
      className="mb-5 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      <Stars rating={G2.rating} />
      <span className="text-foreground">{G2.rating}</span>
      <span>on G2 · {G2.reviews}+ reviews</span>
    </Link>
  );
}
