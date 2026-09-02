/**
 * The changelog, out of the repo.
 *
 * /updates used to read a Ghost instance of its own at request time. It no
 * longer does: the archive is committed as Markdown under src/content/updates
 * and its imagery under public/images/updates, so **a new entry is a new file**
 * and publishing in Ghost changes nothing. scripts/freeze-updates.mts is what
 * brought the archive across.
 *
 * The entries are read off disk rather than imported, which is what makes the
 * "add a file" part true — nothing here lists them, and no index needs editing.
 * next.config.ts names this directory in outputFileTracingIncludes so the files
 * travel with the routes that read them.
 */
import { readFile, readdir } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { cache } from "react";
import { imageSize } from "image-size";
import { Marked } from "marked";
import {
  markLeadInParagraphs,
  markSpecLines,
  stripEmoji,
  unboldPunctuation,
} from "./ghost";

/** Where the entries live, relative to the repo root. */
export const CONTENT_DIR = "src/content/updates";

/** Where their imagery lives, under public/ and as a URL. */
export const IMAGE_ROUTE = "images/updates";

export interface UpdateEntry {
  slug: string;
  /** The headline, which is also the first heading of the body. */
  title: string;
  /** A sentence for the search result and the page description. */
  excerpt: string;
  /** ISO date the entry was published. */
  date: string;
  /**
   * ISO date it was last edited, which is what a sitemap's lastmod wants: a typo
   * fixed on a 2024 entry is a reason to recrawl it, its publish date is not.
   */
  updatedAt: string;
  /** The entry itself, as Markdown. */
  body: string;
}

// ---------------------------------------------------------------------------
// The file format
// ---------------------------------------------------------------------------

const FRONTMATTER = /^---\n([\s\S]*?)\n---\n?/;

/**
 * Frontmatter, as little of it as the changelog needs: four known keys, one per
 * line, strings JSON-quoted so a colon or a newline in a headline can't end the
 * value early. Deliberately not YAML — a parser for a format with four fields in
 * it is smaller than the dependency that would read the general case.
 */
export function serialiseEntry(entry: UpdateEntry): string {
  const fields = [
    `title: ${JSON.stringify(entry.title)}`,
    `excerpt: ${JSON.stringify(entry.excerpt)}`,
    `date: ${entry.date}`,
    `updated: ${entry.updatedAt}`,
  ];
  return `---\n${fields.join("\n")}\n---\n\n${entry.body}`;
}

function parseEntry(slug: string, file: string): UpdateEntry {
  const matter = FRONTMATTER.exec(file);
  if (!matter) throw new Error(`${slug}.md has no frontmatter`);

  const fields = new Map<string, string>();
  for (const line of matter[1].split("\n")) {
    const at = line.indexOf(":");
    if (at === -1) continue;
    const value = line.slice(at + 1).trim();
    fields.set(
      line.slice(0, at).trim(),
      value.startsWith('"') ? (JSON.parse(value) as string) : value,
    );
  }

  const date = fields.get("date");
  if (!date) throw new Error(`${slug}.md has no date`);

  return {
    slug,
    title: fields.get("title") ?? slug,
    excerpt: fields.get("excerpt") ?? "",
    date,
    updatedAt: fields.get("updated") ?? date,
    body: file.slice(matter[0].length),
  };
}

// ---------------------------------------------------------------------------
// Reading them
// ---------------------------------------------------------------------------

async function readEntries(): Promise<UpdateEntry[]> {
  const dir = join(process.cwd(), CONTENT_DIR);
  const files = (await readdir(dir)).filter((name) => name.endsWith(".md"));

  const entries = await Promise.all(
    files.map(async (name) =>
      parseEntry(name.slice(0, -3), await readFile(join(dir, name), "utf8")),
    ),
  );

  // Newest first, which is the order the changelog is read in. The filename is
  // the slug and says nothing about when the entry shipped, so the date in the
  // frontmatter is what orders them.
  return entries.sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * The changelog's entries, newest first.
 *
 * Read once per render pass however many pages ask for it, and not held past
 * one: a module-level cache would mean a new entry needs the dev server
 * restarted before it shows up.
 */
export const getUpdates = cache(readEntries);

export async function getUpdate(slug: string): Promise<UpdateEntry | undefined> {
  return (await getUpdates()).find((entry) => entry.slug === slug);
}

// ---------------------------------------------------------------------------
// Rendering them
// ---------------------------------------------------------------------------

/**
 * Ghost's heading anchors, which the archive's links and its own tables of
 * contents point at, so they are regenerated rather than dropped.
 */
function headingId(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z]+;|&#\d+;/gi, " ")
    .toLowerCase()
    // Ghost's rule, which is not the usual slugify: punctuation is *dropped*
    // rather than turned into a separator, so "Assembly 2.0" anchors at
    // "assembly-20" and only the spaces between words become hyphens. Letters
    // outside ASCII are kept and escaped, curly quotes included.
    .replace(/[!-,.-/:-@[-`{-~]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/[^\x20-\x7e]/g, (char) => encodeURIComponent(char));
}

/**
 * An imported image's real dimensions, read off the file.
 *
 * They go on the tag as width and height so the browser knows the aspect ratio
 * before the bytes arrive — .post-body sets height:auto, so without them every
 * screenshot in the entry is a zero-height box that shoves the copy down as it
 * loads. Read from disk rather than written into the Markdown: an author adding
 * a screenshot should not have to measure it.
 */
const dimensions = new Map<string, { width: number; height: number } | null>();

function imageDimensions(src: string): { width: number; height: number } | null {
  if (!dimensions.has(src)) {
    let size: { width: number; height: number } | null = null;
    if (src.startsWith("/")) {
      try {
        const { width, height } = imageSize(readFileSync(join(process.cwd(), "public", src)));
        size = { width, height };
      } catch {
        // A missing or unreadable file is not worth failing a render over; the
        // tag goes out without the hint and the page shifts a little.
        size = null;
      }
    }
    dimensions.set(src, size);
  }
  return dimensions.get(src) ?? null;
}

function attribute(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Markdown to the markup the changelog's stylesheet already knows.
 *
 * Entries came out of Ghost, and `.post-body` in globals.css styles what Ghost
 * emitted — a figure with its kg- classes around every image, ids on the
 * headings. So the renderer emits that shape rather than Markdown's bare <img>,
 * and the archive reads exactly as it did before it was frozen.
 */
const renderer = new Marked({
  tokenizer: {
    // A bare address in the copy stays copy. GFM would turn every
    // support@assembly.com and stray URL into a link, which Ghost did not do
    // and which the archive is full of; a link an author meant is written as
    // one.
    url: () => undefined,
  },
  renderer: {
    heading({ tokens, depth }) {
      const text = this.parser.parseInline(tokens);
      return `<h${depth} id="${headingId(text)}">${text}</h${depth}>`;
    },
    image({ href, title, text }) {
      const size = imageDimensions(href);
      const caption = title
        ? `<figcaption>${title}</figcaption>`
        : "";
      return [
        `<figure class="kg-card kg-image-card${title ? " kg-card-hascaption" : ""}">`,
        `<img src="${attribute(href)}" class="kg-image" alt="${attribute(text)}" loading="lazy"`,
        size ? ` width="${size.width}" height="${size.height}"` : "",
        `>${caption}</figure>`,
      ].join("");
    },
    // A figure is not a phrase, so an image on a line of its own comes out as
    // the block it is rather than wrapped in a paragraph.
    paragraph({ tokens }) {
      const html = this.parser.parseInline(tokens);
      return html.startsWith("<figure") ? html : `<p>${html}</p>`;
    },
  },
});

/**
 * A paragraph that is nothing but one link — "Read the docs" on a line of its
 * own — marked so .updates-entry can draw it as the destination it is. A second
 * <a> inside means it is a line of links, not a single one.
 */
function markStandaloneLinks(html: string): string {
  return html.replace(
    /<p>(\s*<a\b[^>]*>(?:(?!<\/p>)[\s\S])*?<\/a>\s*)<\/p>/gi,
    (whole, inner: string) =>
      (inner.match(/<a\b/gi) ?? []).length === 1
        ? `<p class="entry-link">${inner}</p>`
        : whole,
  );
}

/** One entry's body as HTML. Markdown is trusted here: it is committed content. */
export function renderEntry(markdown: string): string {
  // These four passes are the blog's as well — a bold label over a list reads
  // the same in either place, and neither surface prints emoji — so they live
  // with it rather than being copied. Same order it applies them in.
  return markStandaloneLinks(
    stripEmoji(
      markSpecLines(
        markLeadInParagraphs(
          unboldPunctuation(renderer.parse(markdown, { async: false })),
        ),
      ),
    ),
  );
}

/** The leading `## Headline` every entry opens on. */
const LEADING_HEADING = /^\s*##\s+.*(?:\n|$)/;

/**
 * The body without its headline, for the page that has already printed it as
 * the page's own <h1>. Leaving it in would put the same line on the page twice,
 * once at each of two levels.
 */
export function entryBodyMarkdown(entry: UpdateEntry): string {
  return entry.body.replace(LEADING_HEADING, "");
}
