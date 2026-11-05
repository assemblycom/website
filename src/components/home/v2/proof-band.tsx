import { BuilderGridRails } from "@/components/ai-app-builder/builder-grid-rails";
import { getCaseStudyBySlug } from "@/lib/case-studies";
import { ProofReel, type ReelItem } from "@/components/home/v2/proof-reel";

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
// has a page behind it — and the reel now says so: hovering a mark dims its
// neighbours and prints that customer's headline figure under the row. See
// proof-reel.tsx, which is the client half of this. Ordered to put the largest name first and then to
// alternate industries, so the row reads as a spread of businesses rather than
// a list of accounting firms.
// ─────────────────────────────────────────────────────────────────────────

const REEL = [
  "capital-one-luxury-travel",
  "collective-cpa",
  "advertai-marketing",
  "metta-health",
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

export function ProofBand({ rails = false }: { rails?: boolean } = {}) {
  // Resolved here rather than in the reel itself: case-studies.ts carries the
  // full editorial body of every story, and importing it from a client
  // component would ship all of it to the browser to read two fields.
  const items: ReelItem[] = REEL.flatMap((slug) => {
    const study = getCaseStudyBySlug(slug);
    const stat = study?.stats[0];
    // A mark with no story or no figure behind it has nothing to say on
    // hover, so it does not belong in a reel whose whole point is that it
    // does. Skipped rather than shown mute, which would read as a broken cell.
    if (!study || !stat) return [];
    return [
      { slug, company: study.company, result: `${stat.value} ${stat.label}` },
    ];
  });

  return (
    // ASYMMETRIC BY DESIGN. The top inset is almost nothing, so the marks ride
    // up under the hero tile and read as the foot of the hero; the bottom is
    // deep, so the industries row below starts a clear beat later rather than
    // feeling clipped to the logos. At the old pb-16 the two were close enough
    // that the reel read as that section's header.
    // AND IT COMES BACK IN ON A WIDE DISPLAY. 160px below the marks is a beat
    // on a laptop; at 1920 the same inset plus the industries row's own top
    // padding is 240px of white between the logos and the first heading,
    // which reads as the page having ended rather than as a pause in it.
    <section className="relative mx-auto isolate max-w-[1200px] bg-background px-6 pb-28 pt-2 md:px-10 md:pb-40 md:pt-4 wide:pb-16">
      {/* The middle bed, so the grid runs unbroken from the hero into the
          content region. Neither end fades: both of its neighbours carry the
          rails on.
          
          Only for a hero that draws them itself. Under a hero that does not,
          a bed here would switch the grid on at the logo band and off again
          before the first section, which is a band of rails on its own rather
          than a page laid out on a grid. */}
      {rails ? <BuilderGridRails fadeTop={false} fadeBottom={false} /> : null}
      {/* NO LABEL OVER THE ROW. "Trusted by teams who bill for their time"
          was telling the reader what eight wordmarks already say, and it put a
          line of mono caps between the hero and the logos that held them down
          the page. The marks carry it on their own. */}
      <ProofReel items={items} />
    </section>
  );
}
