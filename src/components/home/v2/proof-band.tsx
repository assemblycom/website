import Link from "next/link";
import { CustomerLogo } from "@/components/customers/customer-logos";

// ─────────────────────────────────────────────────────────────────────────
// PROOF BAND — the logo strip under the hero.
//
// THE FOUR FIGURES HAVE GONE. This band used to carry the reel and the
// "businesses powered / apps created / clients managed / payments processed"
// ticker together. With the G2 rating now above the headline as well, the top
// of the page was making the same argument three times in three different
// shapes before a visitor had read a word about the product — a rating, then
// eight logos, then four numbers. The reel is the one of the three that works
// hardest per inch: a name you recognise lands faster than a figure you have
// to parse, and it needs no placeholder data to be true.
//
// The ticker itself is untouched and still runs on V1 (see trust-ticker.tsx);
// it is simply not in this band any more.
//
// The logos are the customers with published case studies, so every mark here
// has a page behind it. Ordered to put the largest name first and then to
// alternate industries, so the row reads as a spread of businesses rather than
// a list of accounting firms.
// ─────────────────────────────────────────────────────────────────────────

const REEL = [
  "capital-one-luxury-travel",
  "collective-cpa",
  "advertai-marketing",
  "metta-health",
  "heritage-law-partners",
  "ditto-by-dbc",
  "orca-accounting",
  // ValueNode, not Durrick Designs. Durrick's mark is square (aspect 1/1), and
  // every slot here is 120x28 with the logo contained inside it — so a square
  // mark can only ever use 28 of the 120px and came out a third the size of
  // the wordmarks either side of it, which read as a broken image rather than
  // as a small logo. ValueNode is 543/143, in the same band as Heritage (2.9:1)
  // and Collective (5.1:1), so it fills the slot the way its neighbours do.
  "valuenode-accounting",
];

export function ProofBand() {
  return (
    // ASYMMETRIC BY DESIGN. The top inset is almost nothing, so the marks ride
    // up under the hero tile and read as the foot of the hero; the bottom is
    // deep, so the industries row below starts a clear beat later rather than
    // feeling clipped to the logos. At the old pb-16 the two were close enough
    // that the reel read as that section's header.
    <section className="mx-auto max-w-[1200px] px-6 pb-28 pt-2 md:px-10 md:pb-40 md:pt-4">
      {/* NO LABEL OVER THE ROW. "Trusted by teams who bill for their time"
          was telling the reader what eight wordmarks already say, and it put a
          line of mono caps between the hero and the logos that held them down
          the page. The marks carry it on their own. */}
      <ul className="grid grid-cols-2 items-center gap-x-8 gap-y-8 sm:grid-cols-4 lg:grid-cols-8">
        {REEL.map((slug) => (
          <li key={slug} className="flex items-center justify-center">
            <Link
              href={`/customers/${slug}`}
              // Muted at rest and full strength on hover: a reel at full
              // contrast competes with the hero's own headline a few hundred
              // pixels above it, and these are proof, not navigation.
              className="flex h-7 w-full max-w-[120px] items-center justify-center text-foreground/40 transition-colors hover:text-foreground/80"
            >
              {/* The wrapper has to carry a width as well as a height: a
                  `fit` logo ignores its own aspect ratio and takes its box from
                  the parent, so an auto-width flex row collapsed every masked
                  wordmark to nothing while the two inline SVGs — which have a
                  viewBox to size from — rendered fine. */}
              <span aria-hidden className="flex h-full w-full items-center justify-center">
                <CustomerLogo slug={slug} fit surface="var(--background)" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
