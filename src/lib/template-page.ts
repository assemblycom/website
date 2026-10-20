import { BLOCKS, type Block, type Document, type Inline, type Text } from "@contentful/rich-text-types";

/**
 * The copy a template detail page is built from, with every fallback decided in
 * one place.
 *
 * Each field is optional in Contentful, so a template nobody has filled in yet
 * must still render whole. The rule for each is fixed here rather than at the
 * call site, so the page, its metadata and its structured data can never
 * disagree about what a template's title or keyword is.
 */

export interface Benefit {
  title: string;
  body: string;
}

export interface Benefits {
  heading: string;
  cards: Benefit[];
}

const MIN_CARDS = 2;
const MAX_CARDS = 4;

/** Plain text of a node, marks dropped — the page renders none of them. */
function plain(node: Block | Inline | Text): string {
  if (node.nodeType === "text") return (node as Text).value;
  return (node as Block | Inline).content.map(plain).join("");
}

/**
 * The benefits section, read out of the Marketing App Overview by an agreed
 * layout: one Heading 2 for the section title, then 2–4 cards, each a Heading 3
 * followed by one paragraph.
 *
 * Anything before the first Heading 2 is ignored (the definition has its own
 * field now), and so is anything after the cards, so the old About / Perfect
 * for copy left in an entry can't leak onto the page. Anything that doesn't fit
 * the layout returns null and the page falls back to rendering the field whole.
 */
export function parseBenefits(doc: Document | undefined): Benefits | null {
  if (!doc) return null;
  const nodes = doc.content.filter(
    // An empty trailing paragraph is what the editor leaves behind after the
    // last line, and it is not a layout mistake.
    (n) => !(n.nodeType === BLOCKS.PARAGRAPH && !plain(n).trim()),
  );
  const start = nodes.findIndex((n) => n.nodeType === BLOCKS.HEADING_2);
  if (start === -1) return null;

  const heading = plain(nodes[start]).trim();
  if (!heading) return null;

  const cards: Benefit[] = [];
  let i = start + 1;
  while (i < nodes.length && nodes[i].nodeType === BLOCKS.HEADING_3) {
    const title = plain(nodes[i]).trim();
    const next = nodes[i + 1];
    if (!title || next?.nodeType !== BLOCKS.PARAGRAPH) return null;
    cards.push({ title, body: plain(next).trim() });
    i += 2;
  }

  if (cards.length < MIN_CARDS || cards.length > MAX_CARDS) return null;
  return { heading, cards };
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// Short function words stay lowercase inside a title-cased phrase.
const SMALL_WORDS = new Set(["a", "an", "and", "for", "in", "of", "on", "or", "the", "to", "with"]);

function titleCase(s: string): string {
  return s
    .split(" ")
    .map((word, i) => (i > 0 && SMALL_WORDS.has(word.toLowerCase()) ? word.toLowerCase() : capitalize(word)))
    .join(" ");
}

/** "a" or "an", by the keyword's first letter. */
function article(word: string): string {
  return /^[aeiou]/i.test(word) ? "an" : "a";
}

export interface TemplateCopyInput {
  name: string;
  /** The committed long-form description, the last stop for the meta description. */
  longDescription?: string;
  marketingHeadline?: string;
  heroDescription?: string;
  seoKeyword?: string;
  definitionBody?: string;
  ctaHeading?: string;
  seoTitle?: string;
  seoMetaDescription?: string;
}

export interface TemplateCopy {
  headline: string;
  /** Undefined when there's no hero description: the subtitle is the card line. */
  lead?: string;
  /** Null when there's no definition body: the whole section is hidden. */
  definition: { heading: string; body: string } | null;
  faqHeading: string;
  ctaHeading: string;
  /** The bare title; pageMetadata() adds " | Assembly". */
  seoTitle: string;
  /** Undefined when nothing suitable exists: better no description than the card line. */
  seoDescription?: string;
}

export function templateCopy(input: TemplateCopyInput): TemplateCopy {
  const noun = input.name.toLowerCase();
  const keyword = input.seoKeyword ?? noun;
  return {
    headline: input.marketingHeadline ?? input.name,
    lead: input.heroDescription,
    // The question names the thing (the template's own name) so it matches the
    // answer under it. The keyword is phrased for search ("project tracker
    // template") and reads wrong as "What is a project tracker template?".
    definition: input.definitionBody
      ? { heading: `What is ${article(noun)} ${noun}?`, body: input.definitionBody }
      : null,
    faqHeading: `Questions about this ${keyword}`,
    ctaHeading: input.ctaHeading ?? `Start with the ${input.name} template`,
    seoTitle:
      input.seoTitle ??
      (/template$/i.test(input.name) ? titleCase(input.name) : `${titleCase(input.name)} Template`),
    // Never the Subtitle: that's the gallery card's one-liner, not a search snippet.
    seoDescription:
      input.seoMetaDescription ?? input.heroDescription ?? input.longDescription ?? input.definitionBody,
  };
}
