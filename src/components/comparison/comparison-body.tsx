import Link from "next/link";
import { FAQ } from "@/components/home/faq";
import { CompetitorMark } from "@/components/comparison/competitor-mark";
import { unbreakable } from "@/components/ui/unbreakable";
import { GRID_LINE } from "@/components/ui/grid-lines";
import type {
  ComparisonCriterion,
  ComparisonCta,
  ComparisonFeature,
  ComparisonPage,
  ComparisonRow,
} from "@/lib/comparisons";

// The site's canonical button pair, same strings the CMS pages use.
const PRIMARY_BUTTON =
  "rounded-lg bg-foreground px-5 py-2.5 text-center text-sm text-background transition-opacity hover:opacity-90";
const SECONDARY_BUTTON =
  "rounded-lg border border-foreground/20 bg-transparent px-5 py-2.5 text-center text-sm text-foreground transition-colors hover:bg-foreground/5";

/**
 * One centred reading column, the way a post is set — not the 1200px rail the
 * feature and solutions pages frame with grid lines.
 *
 * These pages are read rather than scanned: an argument, its evidence, then the
 * next argument. At rail width every section was a short heading over a very
 * wide table with ruled lines between, which read as a spec sheet. Narrowed and
 * centred, with space rather than rules doing the separating, it reads as an
 * article — and the tables sit inside the same column as everything else.
 */
const COLUMN = "mx-auto max-w-3xl";

function Band({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`px-6 py-14 md:py-16 ${className}`}>
      <div className={COLUMN}>{children}</div>
    </section>
  );
}

function CtaRow({
  ctas,
  className = "",
}: {
  ctas?: ComparisonCta[];
  className?: string;
}) {
  if (!ctas?.length) return null;
  return (
    <div
      className={`flex w-full max-w-xs flex-col items-stretch gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:items-center ${className}`}
    >
      {ctas.map((cta, i) => {
        const external = cta.href.startsWith("http");
        return (
          <a
            key={cta.href}
            href={cta.href}
            {...(external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className={i === 0 ? PRIMARY_BUTTON : SECONDARY_BUTTON}
          >
            {cta.label}
          </a>
        );
      })}
    </div>
  );
}

/**
 * The tick and cross in a matrix cell, each set in a disc so a row scans as a
 * verdict rather than as two hairlines of type. Both stay neutral — a green
 * tick against a red cross is louder than this site's palette goes anywhere
 * else — so the contrast is weight, not hue: a solid disc for what a product
 * does, a faint one for what it doesn't.
 */
function Mark({ value }: { value: boolean }) {
  const label = value ? "Included" : "Not included";
  return (
    <span
      role="img"
      aria-label={label}
      className={`flex h-5 w-5 items-center justify-center rounded-full ${
        value
          ? "bg-foreground text-background"
          : "bg-foreground/10 text-muted-foreground"
      }`}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        {value ? (
          <path d="M20 6 9 17l-5-5" />
        ) : (
          <>
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </>
        )}
      </svg>
    </span>
  );
}

/**
 * A mark sits centred in its column, the way a tick in a table always has. Prose
 * does not: centred, the free-text cells gave every column two ragged edges and
 * no line started where the one above it did, which was the hardest thing in the
 * table to read. So the glyphs centre and the sentences range left.
 */
function Cell({ value }: { value: ComparisonRow["assembly"] }) {
  if (typeof value === "boolean") {
    return (
      <div className="flex justify-center">
        <Mark value={value} />
      </div>
    );
  }
  return <p className="type-caption text-muted-foreground">{value}</p>;
}

// The Assembly column carries a wash the length of the table so the page's own
// side reads as the answer and the competitor's as the reference. `--muted` is
// the site's existing surface step rather than a tint invented for this table,
// so it flips with the theme like every other surface.
const OWN_COLUMN = "bg-muted";

/**
 * A feature matrix: the capability, then what each side offers.
 *
 * A real <table>, so the row/column relationship survives a screen reader and
 * the header stays associated with its cells. Its own horizontal scroll
 * container, because the free-text cells ("Hundreds of triggers and actions")
 * make some of these wider than a phone.
 */
function FeatureMatrix({
  rows,
  competitor,
  caption,
}: {
  rows: ComparisonRow[];
  competitor: string;
  caption: string;
}) {
  return (
    <>
      {/* Below md the same rows as a stack, one capability at a time.
          Three columns will not fit a phone: at 375px the label column alone
          took 240 of the 327 available, which left the Assembly column clipped
          in half and the competitor's off-screen entirely, behind a horizontal
          scroll with nothing to say it was there. Stacked, both sides of every
          row are on screen and nothing scrolls sideways. */}
      <ul className="mt-10 space-y-7 md:hidden">
        {rows.map((row) => (
          <li key={row.label}>
            <p className="type-body text-foreground">{row.label}</p>
            {row.detail && (
              <p className="type-caption mt-1 text-muted-foreground">
                {row.detail}
              </p>
            )}
            {/* The two sides in one outlined card, split by a hairline. The wash
                alone did not hold them together: only the Assembly row carried
                it, so it read as a loose grey bar floating over an unstyled row
                rather than as our side of a pair — and at --muted on white the
                bar was faint enough to look like a rendering artefact. The
                outline is what says "these two belong to the label above". */}
            <div
              className={`mt-3 divide-y overflow-hidden rounded-lg border ${GRID_LINE} divide-border [[data-theme=dark]_&]:divide-[#383838]`}
            >
              <StackedValue name="Assembly" value={row.assembly} own />
              <StackedValue name={competitor} value={row.competitor} />
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-10 hidden overflow-x-auto md:block">
        {/* table-fixed with declared columns, so the two product columns are the
            same width in every section. Auto layout sized each table to its own
            content, and scrolling the page stepped through five tables whose
            columns never lined up with each other. */}
        <table className="w-full table-fixed border-collapse text-left">
          <caption className="sr-only">{caption}</caption>
          <colgroup>
            <col className="w-[44%]" />
            <col className="w-[28%]" />
            <col className="w-[28%]" />
          </colgroup>
          <thead>
            <tr className={`border-b ${GRID_LINE}`}>
              <th scope="col" className="pb-3 pr-4">
                <span className="sr-only">Capability</span>
              </th>
              <th
                scope="col"
                className={`type-eyebrow rounded-t-lg px-4 pb-3 pt-3 text-center text-foreground ${OWN_COLUMN}`}
              >
                Assembly
              </th>
              <th
                scope="col"
                className="type-eyebrow px-4 pb-3 pt-3 text-center text-muted-foreground"
              >
                {competitor}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              // No rule under the last row: it would cut across the rounded foot
              // of the wash, and the section divider already closes the block.
              <tr
                key={row.label}
                className={i === rows.length - 1 ? "" : `border-b ${GRID_LINE}`}
              >
                <th scope="row" className="py-4 pr-4 font-normal align-top">
                  <span className="type-body block text-foreground">
                    {row.label}
                  </span>
                  {row.detail && (
                    <span className="type-caption mt-1 block text-muted-foreground">
                      {row.detail}
                    </span>
                  )}
                </th>
                {/* The wash closes on the last row, so the column reads as one
                  panel rather than as a fill that runs off the bottom. */}
                <td
                  className={`px-4 py-4 align-middle ${OWN_COLUMN} ${
                    i === rows.length - 1 ? "rounded-b-lg" : ""
                  }`}
                >
                  <Cell value={row.assembly} />
                </td>
                <td className="px-4 py-4 align-middle">
                  <Cell value={row.competitor} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

/**
 * One side of one capability, on a phone: who it is, then what they offer.
 *
 * The Assembly side keeps the wash it has in the table, so the highlight
 * survives the change of shape rather than being a desktop-only flourish.
 */
function StackedValue({
  name,
  value,
  own = false,
}: {
  name: string;
  value: ComparisonRow["assembly"];
  own?: boolean;
}) {
  return (
    <div
      className={`flex items-baseline gap-3 px-3 py-2.5 ${own ? OWN_COLUMN : ""}`}
    >
      <span
        className={`type-eyebrow w-24 shrink-0 ${
          own ? "text-foreground" : "text-muted-foreground"
        }`}
      >
        {name}
      </span>
      {typeof value === "boolean" ? (
        <Mark value={value} />
      ) : (
        <p className="type-caption min-w-0 flex-1 text-muted-foreground">
          {value}
        </p>
      )}
    </div>
  );
}

/**
 * One themed section: the claim, then the matrix that backs it.
 *
 * Stacked, not side by side. Beside each other the copy was squeezed into a
 * ~450px column and eight lines deep, which read as more text rather than less,
 * and it took the matrix's free-text cells down to ~130px — five and six line
 * wraps in every cell. Full width, the heading holds two or three lines and the
 * table gets the room those cells need.
 */
function FeatureSection({
  section,
  competitor,
}: {
  section: ComparisonFeature;
  competitor: string;
}) {
  return (
    <Band>
      {/* Heading then prose, the way a section of a post is set. No mono eyebrow
          over it: the section titles ("Platform flexibility") only restate the
          heading beneath them in fewer words, and a kicker on every one of five
          sections is a label the reader has to skip. The title still names the
          matrix for a screen reader, in its caption below. */}
      <div>
        {section.heading && (
          <h2 className="type-h3 text-balance leading-[1.15] tracking-[-0.02em] text-foreground">
            {unbreakable(section.heading)}
          </h2>
        )}
        {/* The same `post-body` reading text the hero's lead takes, so a section
            of one of these pages and a section of a post are the same type. */}
        {section.description && (
          <div className="post-body mt-4">
            <p>{section.description}</p>
          </div>
        )}
      </div>
      {section.rows.length > 0 && (
        <FeatureMatrix
          rows={section.rows}
          competitor={competitor}
          caption={`${section.title}: Assembly compared with ${competitor}`}
        />
      )}
    </Band>
  );
}

/**
 * One G2 criterion as a pair of labelled bars. Scores here are out of 10, unlike
 * the headline pair the CMS keeps out of 5, so the two are never drawn on the
 * same scale.
 *
 * Each bar carries its own side name. The scores above are laid out in labelled
 * columns, but these bars stack, so those column headers do not reach them —
 * without a name per row there is nothing saying which bar is whose.
 */
function CriterionBar({
  criterion,
  competitor,
}: {
  criterion: ComparisonCriterion;
  competitor: string;
}) {
  const sides = [
    { name: "Assembly", value: criterion.assembly, strong: true },
    { name: competitor, value: criterion.competitor, strong: false },
  ];
  return (
    <div>
      <p className="type-body text-foreground">{criterion.label}</p>
      <div className="mt-3 space-y-2">
        {sides.map((side) => (
          <div key={side.name} className="flex items-center gap-3">
            <span
              className={`type-caption w-20 shrink-0 truncate ${
                side.strong ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {side.name}
            </span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full ${
                  side.strong ? "bg-foreground" : "bg-foreground/25"
                }`}
                style={{ width: `${Math.min(side.value, 10) * 10}%` }}
              />
            </div>
            <span
              className={`type-caption w-8 shrink-0 text-right font-mono ${
                side.strong ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {side.value.toFixed(1)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function G2Section({ page }: { page: ComparisonPage }) {
  const { g2 } = page;
  return (
    <Band>
      {/* Stacked, not two halves: in a 768px column each side came to ~330px,
          which left the score bars shorter than their own labels. */}
      <div className="flex flex-col gap-10">
        <div>
          {/* The same rank the feature sections take — every section heading on
              the page is one level, as it is in a post. */}
          {g2.title && (
            <h2 className="type-h3 text-balance leading-[1.15] tracking-[-0.02em] text-foreground">
              {g2.title}
            </h2>
          )}
          {g2.description && (
            <div className="post-body mt-4">
              <p>{g2.description}</p>
            </div>
          )}
          {/* The site's secondary button, matching the way back at the foot of
              the page. An underlined line of grey under a paragraph read as part
              of the paragraph rather than as the way off to the source. */}
          {g2.link && (
            <a
              href={g2.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-6 inline-block ${SECONDARY_BUTTON}`}
            >
              See the full comparison on G2
            </a>
          )}
        </div>

        {/* The scores in a bordered panel: they are quoted figures from someone
            else's site, not our own prose, and an outline says where the
            evidence starts and stops. Loose on the page the pair of numbers and
            the run of bars read as more page furniture. */}
        <div className={`rounded-xl border p-6 md:p-8 ${GRID_LINE}`}>
          {/* The headline pair, out of 5. Two entries carry no scores at all, so
              the whole block is conditional rather than printing an empty gauge.

              Name on the left, figure on the right — the same shape the
              criterion bars below take, so the panel reads as one thing. It was
              two eyebrow-and-number stacks in a half-and-half grid with the
              caption stranded underneath, which put three ranks of label around
              two numbers and left the competitor's score floating at the middle
              of the panel for no reason. The caption leads now, because it says
              what both numbers are. */}
          {g2.assembly && g2.competitor && (
            <div className={`border-b pb-6 ${GRID_LINE}`}>
              {g2.label && (
                <p className="type-caption text-muted-foreground">{g2.label}</p>
              )}
              {/* Name then figure, side by side and close. Spread to the two edges
                  of the panel with justify-between, an eight-character name sat most
                  of a 768px column away from the number it belongs to and the pairing
                  was gone. A fixed name column keeps the two together AND keeps the
                  two figures stacked in one column, which is the comparison. */}
              <dl className="mt-3 space-y-1">
                {[
                  { name: "Assembly", value: g2.assembly, strong: true },
                  {
                    name: page.competitor,
                    value: g2.competitor,
                    strong: false,
                  },
                ].map((side) => (
                  <div key={side.name} className="flex items-baseline gap-5">
                    <dt
                      className={`type-body w-28 shrink-0 ${
                        side.strong
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {side.name}
                    </dt>
                    <dd
                      className={`font-mono text-[1.75rem] leading-tight tracking-tight ${
                        side.strong
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {side.value}
                      <span className="ml-1 text-sm text-muted-foreground">
                        /5
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {g2.criteria.length > 0 && (
            <div className="mt-8 space-y-6 first:mt-0">
              {g2.criteria.map((criterion) => (
                <CriterionBar
                  key={criterion.label}
                  criterion={criterion}
                  competitor={page.competitor}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Band>
  );
}

/**
 * The page's opening: what this compares, the claim, and the claims list.
 *
 * The CMS art-directed a hero image for every entry — a collage of blurred app
 * marks — and it is not drawn. Four of the nine pointed at the HoneyBook
 * collage whatever the competitor was, and none of them said anything the
 * headline doesn't. What fills that half instead is the page's own claims, so
 * the space carries the argument rather than decoration.
 *
 * Two columns because one was a wall: heading, then a paragraph, then five
 * stacked claims, then a button, all down the same measure. Split, the left is
 * the statement and the right is what backs it, and neither is longer than a
 * screen.
 */
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * The freshness stamp as a dateline: "Updated December, 2025".
 *
 * The CMS wrote these two ways — eight as "updated 12/2025" and one already
 * worded as "Updated February 2026" — so a numeric month is spelled out and an
 * already-spelled one just gains the comma. Anything else is passed through
 * rather than mangled: the string is copy, and a format we did not anticipate
 * should still print.
 */
function formatUpdated(raw: string): string {
  const numeric = raw.match(/(\d{1,2})\/(\d{4})/);
  if (numeric) {
    const month = MONTHS[Number(numeric[1]) - 1];
    if (month) return `Updated ${month}, ${numeric[2]}`;
  }
  const worded = raw.match(/^updated\s+([A-Za-z]+)\s+(\d{4})$/i);
  if (worded) return `Updated ${worded[1]}, ${worded[2]}`;
  return raw;
}

/**
 * The page's opening, set as an article masthead: the mark, the title, the
 * dateline and the action, all centred — then the argument below it, ranged left
 * at the blog's own reading size.
 *
 * The centred block is the same shape a post without a contents rail takes, and
 * it does the job the CMS hero image used to: it gives the top of the page
 * something to look at that is not a paragraph. The body stays left, because
 * centred prose is unreadable past a line or two.
 */
function Hero({ page }: { page: ComparisonPage }) {
  return (
    <section className="px-6 pb-14 pt-20 md:pb-16 md:pt-28">
      <div className={COLUMN}>
        <header className="text-center">
          <div className="flex justify-center">
            <CompetitorMark page={page} size="lg" />
          </div>
          {/* Leading and tracking set here rather than on type-display, which
              nine other pages share — the same step the post titles take, so a
              comparison and a post look like one publication. */}
          <h1 className="type-display mt-5 text-balance leading-[1.02] tracking-[-0.03em]">
            {unbreakable(page.name)}
          </h1>
          {page.updated && (
            <p className="type-body mt-4 text-muted-foreground">
              {formatUpdated(page.updated)}
            </p>
          )}
          <CtaRow ctas={page.ctas} className="mx-auto mt-7 sm:justify-center" />
        </header>

        {/* The lead and the claims in `post-body`, so they are literally the
            blog's reading text and the blog's own list — 17px on a 1.65 leading,
            bulleted with its 5px dot — rather than a second set of numbers and a
            second marker that both have to be kept in step with it.

            The CMS writes the claims as "- " lines, and they were drawn with the
            site's hairline marker to match. In a page that now reads as a post,
            the post's bullet is the one that belongs. */}
        {(page.description || page.points.length > 0) && (
          <div className="post-body mt-12">
            {page.description && <p>{page.description}</p>}
            {page.points.length > 0 && (
              <ul>
                {page.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * The closing CTA. Exported because the index page ends on the same block, built
 * from the same `sectionCta` shape — one copy so a change to it lands on both.
 */
export function ComparisonClosing({
  closing,
}: {
  closing: NonNullable<ComparisonPage["closing"]>;
}) {
  return (
    <>
      {/* The page's one rule, full bleed: it marks the end of the reading and the
          start of the ask. Everything above it is separated by space alone. */}
      <div className={`border-t ${GRID_LINE}`} />
      <section className="px-6 py-16 text-center md:py-24">
        <h2 className="type-display mx-auto max-w-md text-balance text-foreground md:max-w-2xl">
          {closing.title}
        </h2>
        {closing.description && (
          <p className="type-lead mx-auto mt-5 max-w-sm text-balance text-muted-foreground sm:max-w-xl">
            {closing.description}
          </p>
        )}
        <CtaRow
          ctas={closing.ctas}
          className="mx-auto mt-8 sm:justify-center"
        />
      </section>
    </>
  );
}

/** One Contentful `pageComparision` entry, rendered. */
export function ComparisonBody({ page }: { page: ComparisonPage }) {
  const { g2 } = page;
  // Two entries carry a G2 heading but neither scores nor criteria; the section
  // would be a title over nothing.
  const hasG2 = Boolean(
    (g2.assembly && g2.competitor) || g2.criteria.length || g2.description,
  );

  const sections: React.ReactNode[] = [];
  if (hasG2) sections.push(<G2Section key="g2" page={page} />);
  for (const section of page.features) {
    sections.push(
      <FeatureSection
        key={section.title}
        section={section}
        competitor={page.competitor}
      />,
    );
  }
  if (page.faqs.length) {
    sections.push(
      <FAQ
        key="faq"
        heading="Frequently asked questions"
        items={page.faqs}
        twoColumn
      />,
    );
  }

  return (
    <>
      <Hero page={page} />

      {/* No rails and no rules between sections. The space above each heading is
          what separates them, as it is in a post — a rule every 600px through a
          page of eight sections was the loudest thing on it. */}
      {sections.map((section, i) => (
        <div key={i}>{section}</div>
      ))}

      {/* Back to the full set, so a page reached from search isn't a dead end.
          The site's secondary button rather than an underlined link: it is the
          only thing in its own band, and at link weight it read as a stray line
          of copy in an empty strip rather than as somewhere to go. */}
      <Band className="!pb-16 !pt-0">
        <div className="text-center">
          <Link
            href="/comparison"
            className={`inline-block ${SECONDARY_BUTTON}`}
          >
            See all comparisons
          </Link>
        </div>
      </Band>

      {page.closing && <ComparisonClosing closing={page.closing} />}
    </>
  );
}
