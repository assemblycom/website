import { reviewCardHtml, type Review } from "@/components/blog/review-card";

/**
 * Reviews transcribed from the screenshots the writers pasted into Ghost, keyed
 * by the id in the screenshot's filename. A post whose capture is listed here
 * renders the review as a card; any other capture stays an image, so posts move
 * over one review at a time. Text is as the reviewer wrote it, typos included.
 */
const REVIEWS: Record<string, Review> = {
  // ai-customer-service-software, 9. Tidio
  "6a272ecb-b71b-405f-a250-a204b388d1dd": {
    name: "Roger A.",
    meta: ["Owner", "Marketing and Advertising"],
    title: "Useful chat tool for customer support",
    rating: 5,
    date: "January 18, 2026",
    summary:
      "Overall my experience is good. It offers good value for money and works well for customer support and chat automation.",
    pros: "I like how it combines message and email in one platform. The features are useful for customer communication and security feels solid.",
    cons: "There is a learning curve and some advanced features are only available in paid plans. It tooks quite a long time to understand it!",
    source: "Capterra",
  },
  "ee6480a0-9188-436e-964b-ae5194285e7c": {
    name: "Aaron G.",
    meta: [
      "Membership and Development Director",
      "Non-Profit Organization Management",
    ],
    title: "Great product.",
    rating: 5,
    date: "March 20, 2026",
    pros: "They have continued to make the Ai suggestions better every update. They have also brought in more site integration options.",
    cons: "I would still say lack of free Ai chat bots. We used our free chats very quickly and that does not reset yearly.",
    source: "Capterra",
  },
};

const REVIEW_FIGURE =
  /<figure[^>]*>\s*<img\b[^>]*\bsrc="[^"]*?([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\.[a-z]+"[^>]*>\s*(?:<figcaption>[\s\S]*?<\/figcaption>\s*)?<\/figure>/g;

export function reviewsAsCards(html: string): string {
  return html.replace(REVIEW_FIGURE, (match, id: string) => {
    const review = REVIEWS[id];
    return review ? reviewCardHtml(review) : match;
  });
}
