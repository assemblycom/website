/**
 * A customer review drawn as the site's own card instead of a screenshot of the
 * review site. A capture carries the other site's type, colours and chrome
 * (share buttons, "Show More", its own shadow) into the article; the card sets
 * the same review in the page's type and inverts with the theme.
 *
 * Rendered to an HTML string rather than as a React component because it lands
 * inside the post body, which is Ghost's HTML set through innerHTML: a component
 * would have to split that body, and the block-spacing rules that hang off
 * `.post-body > *` would stop reaching the pieces.
 */

export type ReviewSource = "Capterra" | "G2" | "Gartner";

export interface Review {
  name: string;
  /** Job title and industry or company size, as the review site lists them. */
  meta: string[];
  title: string;
  /** Out of 5. */
  rating: number;
  /** As the review site dates it, already formatted. */
  date: string;
  summary?: string;
  pros?: string;
  cons?: string;
  /**
   * Phrases in the summary, pros or cons that carry the review's point. Each is
   * matched as written and underlined, so a reader skimming the card still
   * picks up what the reviewer liked and what they didn't.
   */
  highlights?: string[];
  source: ReviewSource;
}

const MAX_RATING = 5;

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function initials(name: string): string {
  // Lowercase words are skipped so an anonymous reviewer named by role
  // ("Director of Marketing") gets DM rather than DO.
  return name
    .split(/\s+/)
    .filter((part) => /^[A-Z]/.test(part))
    .map((part) => part[0])
    .join("")
    .replace(/[^A-Za-z]/g, "")
    .slice(0, 2)
    .toUpperCase();
}

function stars(rating: number): string {
  // A half point (4.5) shows as the lower whole star; the number beside the
  // stars carries the exact rating.
  const filled = Math.floor(rating);
  return Array.from(
    { length: MAX_RATING },
    (_, i) =>
      `<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" data-on="${i < filled}"><path d="M8 1.2l2.1 4.3 4.7.7-3.4 3.3.8 4.7L8 12l-4.2 2.2.8-4.7L1.2 6.2l4.7-.7z"/></svg>`,
  ).join("");
}

function withHighlights(text: string, highlights: string[] = []): string {
  return highlights.reduce((html, phrase) => {
    const escaped = escapeHtml(phrase);
    return html.replace(escaped, `<span class="review-card-mark">${escaped}</span>`);
  }, escapeHtml(text));
}

/** One `<p>` per paragraph the reviewer wrote, separated by line breaks. */
function paragraphs(text: string, highlights?: string[], className?: string): string {
  const attr = className ? ` class="${className}"` : "";
  return text
    .split("\n")
    .map((part) => `<p${attr}>${withHighlights(part, highlights)}</p>`)
    .join("");
}

function section(label: string, text?: string, highlights?: string[]): string {
  if (!text) return "";
  return `<div class="review-card-section"><p class="review-card-label">${label}</p>${paragraphs(text, highlights)}</div>`;
}

export function reviewCardHtml(review: Review): string {
  const rating = review.rating.toFixed(1);
  return [
    `<figure class="review-card">`,
    `<div class="review-card-head">`,
    `<span class="review-card-avatar" aria-hidden="true">${escapeHtml(initials(review.name))}</span>`,
    `<div class="review-card-who"><p class="review-card-name">${escapeHtml(review.name)}</p>`,
    review.meta.length
      ? `<p class="review-card-meta">${review.meta.map(escapeHtml).join(" · ")}</p>`
      : "",
    `</div>`,
    `<p class="review-card-rating" aria-label="${rating} out of ${MAX_RATING}">${stars(review.rating)}<span>${rating}</span></p>`,
    `</div>`,
    `<p class="review-card-title">${escapeHtml(review.title)}</p>`,
    review.summary
      ? paragraphs(review.summary, review.highlights, "review-card-summary")
      : "",
    section("Pros", review.pros, review.highlights),
    section("Cons", review.cons, review.highlights),
    `<figcaption class="review-card-foot">${review.source} review · ${escapeHtml(review.date)}</figcaption>`,
    `</figure>`,
  ].join("");
}
