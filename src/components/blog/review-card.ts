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

export type ReviewSource = "Capterra" | "G2";

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
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .replace(/[^A-Za-z]/g, "")
    .slice(0, 2)
    .toUpperCase();
}

function stars(rating: number): string {
  const filled = Math.round(rating);
  return Array.from(
    { length: MAX_RATING },
    (_, i) =>
      `<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" data-on="${i < filled}"><path d="M8 1.2l2.1 4.3 4.7.7-3.4 3.3.8 4.7L8 12l-4.2 2.2.8-4.7L1.2 6.2l4.7-.7z"/></svg>`,
  ).join("");
}

function section(label: string, text?: string): string {
  if (!text) return "";
  return `<div class="review-card-section"><p class="review-card-label">${label}</p><p>${escapeHtml(text)}</p></div>`;
}

export function reviewCardHtml(review: Review): string {
  const rating = review.rating.toFixed(1);
  return [
    `<figure class="review-card">`,
    `<div class="review-card-head">`,
    `<span class="review-card-avatar" aria-hidden="true">${escapeHtml(initials(review.name))}</span>`,
    `<div class="review-card-who"><p class="review-card-name">${escapeHtml(review.name)}</p>`,
    `<p class="review-card-meta">${review.meta.map(escapeHtml).join(" · ")}</p></div>`,
    `<p class="review-card-rating" aria-label="${rating} out of ${MAX_RATING}">${stars(review.rating)}<span>${rating}</span></p>`,
    `</div>`,
    `<p class="review-card-title">${escapeHtml(review.title)}</p>`,
    review.summary
      ? `<p class="review-card-summary">${escapeHtml(review.summary)}</p>`
      : "",
    section("Pros", review.pros),
    section("Cons", review.cons),
    `<figcaption class="review-card-foot">${review.source} review · ${escapeHtml(review.date)}</figcaption>`,
    `</figure>`,
  ].join("");
}
