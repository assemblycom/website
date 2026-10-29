import Link from "next/link";

// ─────────────────────────────────────────────────────────────────────────
// INDUSTRIES — the row directly under the hero, so a visitor sees their own
// line of work named before they have scrolled anything.
//
// Round 2 found the shipped message does not win with accounting, finance,
// insurance or legal firms: its extra signups were agencies, consultants and
// coaches. The hero cannot say "accountants" and "agencies" at once without
// going vague, so the specialization claim is made here instead, by naming
// the industries outright and sending each one to the page written for it.
//
// Links, not cards: these are nine destinations the site already has, and a
// grid of illustrated tiles would read as nine features rather than as a way
// through to the page about you.
// ─────────────────────────────────────────────────────────────────────────

interface Industry {
  label: string;
  slug: string;
}

// Ordered by how much of the business each one represents, not alphabetically:
// the first four are the segments the solution pages were written for, and a
// visitor scanning left to right should meet the most likely match first.
const INDUSTRIES: Industry[] = [
  { label: "Accounting", slug: "accounting-client-portal" },
  { label: "Marketing agencies", slug: "marketing-agency-client-portal" },
  { label: "Consulting", slug: "consulting-client-portal" },
  {
    label: "Law firms",
    slug: "law-firm-client-portal-practice-management",
  },
  {
    label: "Real estate",
    slug: "real-estate-property-management-rental-management-client-portal",
  },
  { label: "Design studios", slug: "designer-client-portal" },
  { label: "Startups", slug: "startups-client-portal" },
  { label: "Freelancers", slug: "freelancer-client-portal" },
  { label: "Small business", slug: "small-business-smb-client-portal" },
];

export function Industries() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 py-14 md:px-10 md:py-20">
      {/* Heading and links share a row from lg up: the claim is short, and set
          above a nine-item wrap it left a band of empty page between the two
          halves of one sentence. */}
      <div className="grid gap-y-6 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:items-start lg:gap-x-16">
        <div>
          <p className="type-eyebrow text-muted-foreground">Built for your work</p>
          <h2 className="type-h3 mt-3 text-balance text-foreground">
            Set up for how your industry runs
          </h2>
        </div>
        <ul className="flex flex-wrap gap-2">
          {INDUSTRIES.map((industry) => (
            <li key={industry.slug}>
              <Link
                href={`/solutions/${industry.slug}`}
                // The filter-chip shape the site already uses for a row of
                // sibling destinations (see the blog and templates filters),
                // so this row is recognisably the same control rather than a
                // tenth kind of button.
                className="inline-flex items-center gap-2 rounded-lg border border-border px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:border-foreground/20 hover:bg-foreground/[0.03] hover:text-foreground [[data-theme=dark]_&]:border-white/15 [[data-theme=dark]_&]:hover:border-white/30"
              >
                {industry.label}
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                  className="size-3 opacity-50"
                >
                  <path d="M6 3.5 10.5 8 6 12.5" />
                </svg>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
