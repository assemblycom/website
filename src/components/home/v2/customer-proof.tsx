"use client";

import { BuilderCustomerQuotes } from "@/components/ai-app-builder/builder-customer-quotes";

// ─────────────────────────────────────────────────────────────────────────
// CUSTOMER PROOF — the product pages' quote row, run on the homepage.
//
// NOT A NEW COMPONENT. BuilderCustomerQuotes is the four-across card row that
// /ai-app-builder, /client-portal and the accounting solution page already
// share: equal-width cards that expand under the pointer to reveal the quote,
// an accordion of the same four below `md`, and a portrait thumbnail that
// never changes size. All this file supplies is the homepage's own heading and
// its four firms.
//
// It answers the brief directly. The homepage closed its proof on ONE quote,
// from one agency, about the app builder — the narrowest claim the product
// makes. Four cards carry four different value props, and because the row was
// built for three or four, four is its natural width rather than a stretch.
//
// THE FIRMS ARE ONE PER INDUSTRY as well as one per claim, so the row doubles
// as evidence that this is not an accounting tool or an agency tool:
// accounting, marketing, legal, professional services.
//
// EVERY QUOTE IS VERBATIM from src/lib/case-studies.ts, cut only at a full
// stop where the card cannot hold the whole thing — the same rule the builder
// page's own row documents. Nothing here is re-worded to fit.
// ─────────────────────────────────────────────────────────────────────────

export function CustomerProof() {
  return (
    <BuilderCustomerQuotes
      heading="Firms running on Assembly"
      body="Four firms, four kinds of work, one platform underneath all of it."
      quotes={[
        {
          // Accounting — throughput. An outcome with a season behind it, so
          // the row does not open on a statement of how the product feels.
          quote:
            "We had more tax returns in the door, ready to start being prepped, earlier than ever this year than in our entire history.",
          name: "Kyle Pearson",
          // "Collective CPA", not the registered "Collective CPA & Advisors":
          // the full name is the one that wraps to two lines in a closed card,
          // and the case study a click away carries it in full. Same cut the
          // builder page's own row makes.
          firm: "Collective CPA",
          image: "/images/customers/collective-cpa.jpg",
          href: "/customers/collective-cpa",
        },
        {
          // Marketing — the app builder. The first sentence of a two-sentence
          // quote, cut at the full stop; the second ("It's allowed me to
          // create automations…") extends the claim rather than completing it.
          quote:
            "We’ve been able to build out apps in just a few weeks that I don’t know if we could have done within five to ten years before Assembly.",
          name: "Garrett Leonard",
          firm: "Advertai Marketing",
          image: "/images/customers/advertai-marketing.jpg",
          href: "/customers/advertai-marketing",
        },
        {
          // Legal — the client experience, which is the half of the product
          // the app-builder quote never touched. Cut after the second
          // sentence; the third restates it.
          quote:
            "Our portal really improves our client satisfaction with our firm and definitely saves time. Having everything in one spot is huge.",
          name: "Eliana Emery",
          // "Heritage Law", not "Heritage Law Partners" — the same two-line
          // wrap, and the same cut /client-portal already makes to it.
          firm: "Heritage Law",
          image: "/images/customers/heritage-law-partners.jpg",
          href: "/customers/heritage-law-partners",
        },
        {
          // Professional services — build versus buy, which is the question a
          // reader who has just watched the app builder is actually asking.
          quote:
            "Assembly saves us from building custom portals from scratch. We can go fast and create lasting value for the businesses we serve.",
          name: "Robert Prochnow",
          firm: "Zen Aegis",
          image: "/images/customers/zen-aegis-hero2.jpg",
          href: "/customers/zen-aegis",
        },
      ]}
    />
  );
}
