/**
 * Takes the changelog out of Ghost: pulls the archive down as Markdown into
 * src/content/updates, and its imagery into public/images/updates.
 *
 *   npx tsx --env-file=.env.local scripts/freeze-updates.mts
 *
 * A one-time importer, kept for reference the way scripts/freeze-cms.mts is.
 * From here on the committed Markdown is the changelog: a new entry is a new
 * file, and publishing in Ghost does nothing. Re-running this overwrites hand
 * edits with whatever the old instance still holds, so don't, unless you are
 * deliberately re-taking the archive.
 *
 * Two things it does beyond serialising:
 *
 *   • Imagery is fetched through Ghost's image API at 1600px webp and rewritten
 *     to a local path, so the CDN is out of the loop too. Entries render inside
 *     a 720px measure, which 1600 covers at 2x.
 *   • The fixups the site used to apply to Ghost's markup on every render are
 *     baked in here instead — the dead-host figures, the relinked docs, the
 *     video cards' unusable player chrome. Frozen content is corrected content.
 */
import { mkdir, readdir, rename, rm, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { CONTENT_DIR, IMAGE_ROUTE, serialiseEntry } from "../src/lib/updates-content.ts";

const ROOT = process.cwd();
const IMAGE_DIR = join(ROOT, "public", IMAGE_ROUTE);

const GHOST_URL = process.env.GHOST_UPDATES_API_URL ?? "https://copilot-updates.ghost.io";
const GHOST_KEY = process.env.GHOST_UPDATES_CONTENT_API_KEY;

/** Ghost's own maximum is 100; 30 is what the site read it in. */
const API_PAGE_SIZE = 30;

/**
 * The width every imported image is stored at, and the format.
 *
 * An entry's measure is 720px, so 1600 is a 2x screen's worth and no more —
 * Ghost holds 2000-2400px originals, which would put pixels nobody renders into
 * the repo. webp roughly halves what the jpg weighed at the same width.
 */
const IMAGE_WIDTH = 1600;
const IMAGE_TRANSFORM = `size/w${IMAGE_WIDTH}/format/webp/`;

/** What the screen recordings are re-encoded to. See shrinkVideo. */
const VIDEO_WIDTH = 1280;
const VIDEO_CRF = 30;

interface GhostApiPost {
  slug: string;
  title: string;
  html: string | null;
  custom_excerpt: string | null;
  excerpt: string | null;
  published_at: string | null;
  updated_at: string | null;
}

async function fetchArchive(): Promise<GhostApiPost[]> {
  if (!GHOST_KEY) {
    throw new Error("GHOST_UPDATES_CONTENT_API_KEY is not set — see ENV.example.md");
  }
  const posts: GhostApiPost[] = [];
  for (let page = 1; ; page++) {
    const url = new URL("/ghost/api/content/posts/", GHOST_URL);
    url.search = new URLSearchParams({
      key: GHOST_KEY,
      limit: String(API_PAGE_SIZE),
      page: String(page),
      formats: "html",
      order: "published_at desc",
    }).toString();

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Ghost ${response.status} on page ${page}`);
    const batch: GhostApiPost[] = (await response.json()).posts ?? [];
    posts.push(...batch);
    if (batch.length < API_PAGE_SIZE) return posts;
  }
}

// ---------------------------------------------------------------------------
// The fixups Ghost's markup needed
//
// These ran on every render while /updates read Ghost. They are corrections to
// the content itself — a heading level, a dead link, an image that 404s — so
// they belong to the import rather than to the page, and they apply once here.
// ---------------------------------------------------------------------------

/**
 * Most changelog entries head their sections with <h3> and never use an <h2>:
 * the level is the writer's habit rather than a hierarchy, and left alone those
 * heads render a pixel larger than the body text beside them while the entries
 * that do use <h2> get a proper one. So the entry's first heading sets its top
 * level: where that is an <h3>, every heading shifts up a step.
 *
 * Testing whether an <h2> appears anywhere instead would leave the one entry
 * that opens with <h3> feature sections and then closes with an <h2>
 * "Improvements" ranked upside down, the features a size below the fixes list.
 */
function normalizeEntryHeadings(html: string): string {
  if (/<h([1-6])[^>]*>/i.exec(html)?.[1] !== "3") return html;
  return html
    .replace(/<(\/?)h3([\s>])/gi, "<$1h2$2")
    .replace(/<(\/?)h4([\s>])/gi, "<$1h3$2");
}

// A handful of changelog screenshots were exported with their own 1px frame
// baked into the canvas. The page draws its own outline around every screenshot
// (see .post-body img), so those land a second contour a pixel inside the
// first — the same double edge the review-screenshot rule dodges, except here
// the frame is in the pixels rather than in the CSS. Removing our outline is not
// the fix: the baked frame is a different grey at a different radius.
//
// So the file is re-served cropped past its own frame. Ghost's copy can't be
// edited, so the crop lives in public/ and the entry's <img> is pointed at it —
// which also means dropping the Ghost srcset, since those are the uncropped
// renditions of the same picture.
const CROPPED_SCREENSHOTS: Record<string, { src: string; width: number; height: number }> = {
  // "Messages API", September 14 2023.
  "2023/09/marma.jpg": {
    src: "/images/updates/messages-api.jpg",
    width: 1984,
    height: 1234,
  },
};

function withCroppedScreenshots(html: string): string {
  return html.replace(/<img\b[^>]*>/gi, (tag) => {
    const key = Object.keys(CROPPED_SCREENSHOTS).find((path) =>
      tag.includes(path),
    );
    if (!key) return tag;
    const { src, width, height } = CROPPED_SCREENSHOTS[key];
    return tag
      .replace(/\ssrcset\s*=\s*("[^"]*"|'[^']*')/i, "")
      .replace(/\ssizes\s*=\s*("[^"]*"|'[^']*')/i, "")
      .replace(/\ssrc\s*=\s*("[^"]*"|'[^']*')/i, ` src="${src}"`)
      .replace(/\swidth\s*=\s*("[^"]*"|'[^']*')/i, ` width="${width}"`)
      .replace(/\sheight\s*=\s*("[^"]*"|'[^']*')/i, ` height="${height}"`);
  });
}

// Every docs link written before the docs moved is dead. ReadMe served them at
// docs.assembly.com/reference/* (and docs.joinportal.com/* before the rename);
// the docs now live under assembly.com/docs, where the reference is split a page
// per endpoint. Nothing redirects, so an entry from 2024 sends readers to a 404.
//
// Keyed by legacy path because the two dead hosts used the same paths. A path
// without an entry falls back to the section root rather than being guessed at.
const DEAD_DOC_HOSTS = ["docs.assembly.com", "docs.joinportal.com"];
const DOCS_ROOT = "https://assembly.com/docs";
const DOC_PATHS: Record<string, string> = {
  // The welcome page rather than "", which would point at /docs and take the
  // redirect the deep links here exist to avoid.
  "/": "/getting-started/welcome",
  "/reference/introduction": "/api-reference/introduction",
  "/reference/getting-started-introduction": "/api-reference/introduction",
  "/reference/pagination": "/api-reference/pagination",
  "/reference/audit-log": "/api-reference/events/list-audit-events",
  "/reference/custom-fields": "/api-reference/resources/custom-fields",
  "/reference/tasks": "/api-reference/resources/tasks",
  "/reference/notifications": "/api-reference/resources/notifications",
  "/reference/messages": "/api-reference/resources/messages",
  "/reference/message-channels": "/api-reference/resources/message-channels",
  "/reference/files": "/api-reference/resources/files",
  "/reference/create-a-file": "/api-reference/files/create-a-file",
  "/reference/webhooks-events": "/api-reference/webhooks/events",
  "/docs/custom-apps-overview": "/building-new-apps/introduction",
  "/docs/marketplace-apps-overview": "/building-new-apps/introduction",
  "/page/authenticated-extensions": "/embeds-and-links/url-parameters",
};
// An unmapped /reference/* page was still an API page, so it lands on the API
// reference rather than the top of the docs.
const REFERENCE_FALLBACK = "/api-reference/introduction";

function relinkDeadDocs(html: string): string {
  return html.replace(/href="([^"]*)"/gi, (whole, href: string) => {
    let url: URL;
    try {
      url = new URL(href, DOCS_ROOT);
    } catch {
      return whole;
    }
    if (!DEAD_DOC_HOSTS.includes(url.hostname)) return whole;
    const path = url.pathname.replace(/\/$/, "") || "/";
    const target =
      DOC_PATHS[path] ??
      (path.startsWith("/reference/")
        ? REFERENCE_FALLBACK
        : DOC_PATHS["/"]);
    // Ghost's own ?ref= tracking param goes with the dead URL it was on.
    return `href="${DOCS_ROOT}${target}"`;
  });
}

// The 2020–21 changelog was imported from the pre-Ghost changelog, whose
// screenshots were served through that site's own image proxy. The host is gone
// and the bucket behind it no longer serves public reads, so every one of those
// figures renders as a broken box with its alt text sitting above the identical
// caption. None of them are recoverable, so they come out of the entry rather
// than being drawn as a hole in it.
const DEAD_IMAGE_HOST = "updates.joinportal.com";

function dropUnservableFigures(html: string): string {
  return html
    .replace(/<figure\b[^>]*>[\s\S]*?<\/figure>/gi, (figure) =>
      figure.includes(DEAD_IMAGE_HOST) ? "" : figure,
    )
    .replace(/<img\b[^>]*>/gi, (img) =>
      img.includes(DEAD_IMAGE_HOST) ? "" : img,
    );
}

// ---------------------------------------------------------------------------
// Assets
// ---------------------------------------------------------------------------

/**
 * Ghost's video card ships a player — a row of buttons and two range inputs —
 * that only works with Ghost's own stylesheet and script. The site stripped it
 * on every render; here it comes off once. The video keeps the browser's own
 * controls, which is the one player that works.
 */
function nativeVideoControls(html: string): string {
  return html
    .replace(/<div class="kg-video-overlay"[\s\S]*?<\/figure>/g, "</figure>")
    .replace(/<video(?![^>]*\bautoplay\b)(?![^>]*\bcontrols\b)/g, "<video controls");
}

/** A Ghost image or media URL, split into the path it will keep locally. */
function ghostAssetPath(url: string): { remote: string; local: string } | null {
  const match = url.match(/^https?:\/\/[^/]+\/(?:c\/[^/]+\/[^/]+\/[^/]+\/)?content\/(images|media)\/(?:size\/w\d+\/)?(?:format\/\w+\/)?(.+)$/);
  if (!match) return null;
  const [, kind, path] = match;
  // Media (mp4) has no image API to go through, so it comes down as it is.
  if (kind === "media") return { remote: url, local: path };
  const origin = url.slice(0, url.indexOf("/content/"));
  return {
    remote: `${origin}/content/images/${IMAGE_TRANSFORM}${path}`,
    local: path.replace(/\.[a-z0-9]+$/i, ".webp"),
  };
}

/** Anything not on a Ghost instance — a poster spacer, a gif behind a proxy. */
function foreignAssetPath(url: string): { remote: string; local: string } {
  const { hostname, pathname } = new URL(url);
  const name = pathname.split("/").filter(Boolean).pop() ?? "asset";
  return { remote: url, local: `external/${hostname.replace(/^www\./, "")}-${name}` };
}

const EXTENSIONS: Record<string, string> = {
  "image/webp": ".webp",
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/gif": ".gif",
  "video/mp4": ".mp4",
};

/** Downloaded once per URL however many entries carry it. */
const assets = new Map<string, Promise<string | null>>();

function download(url: string): Promise<string | null> {
  let pending = assets.get(url);
  if (!pending) {
    pending = fetchAsset(url);
    assets.set(url, pending);
  }
  return pending;
}

async function fetchAsset(url: string): Promise<string | null> {
  const asset = ghostAssetPath(url) ?? foreignAssetPath(url);
  const response = await fetch(asset.remote);
  if (!response.ok) {
    console.warn(`  ! ${response.status} ${asset.remote}`);
    return null;
  }

  // A proxy can answer in a format the URL never named, so the file is named
  // for what actually came back rather than for what was asked for.
  const type = response.headers.get("content-type")?.split(";")[0] ?? "";
  const extension = EXTENSIONS[type];
  let local = asset.local;
  if (extension && !local.toLowerCase().endsWith(extension)) {
    local = `${local.replace(/\.[a-z0-9]+$/i, "")}${extension}`;
  }

  const file = join(IMAGE_DIR, local);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, Buffer.from(await response.arrayBuffer()));
  if (file.endsWith(".mp4")) await shrinkVideo(file);
  return `/${IMAGE_ROUTE}/${local}`;
}

/**
 * A screen recording, re-encoded to something a repo can hold.
 *
 * Ghost has no transform for video, so these come down as they were uploaded —
 * one of the three is a minute of 1080p at 6.5 Mbps, 49 MB on its own. At the
 * width an entry renders them (720px) that is 40 MB of detail nobody sees.
 * Skipped, with a warning, where ffmpeg is not installed: an oversized video
 * still plays, and a failed import does not.
 */
async function shrinkVideo(file: string): Promise<void> {
  const shrunk = `${file}.shrunk.mp4`;
  const ffmpeg = spawnSync("ffmpeg", [
    "-loglevel", "error", "-y", "-i", file,
    // Even dimensions, which h264 requires, at no more than 1280 wide.
    "-vf", `scale='min(${VIDEO_WIDTH},iw)':-2`,
    "-c:v", "libx264", "-crf", String(VIDEO_CRF), "-preset", "slow",
    "-c:a", "aac", "-b:a", "96k",
    // Metadata first, so the browser can start playing before it has the file.
    "-movflags", "+faststart",
    shrunk,
  ]);

  if (ffmpeg.error || ffmpeg.status !== 0) {
    console.warn(`  ! ffmpeg could not re-encode ${file}, keeping the original`);
    await rm(shrunk, { force: true });
    return;
  }
  await rename(shrunk, file);
}

/**
 * Every remote asset in one entry, brought local.
 *
 * Four places carry one, and the video card uses three of them for the same
 * poster frame: src, poster, its data-kg-thumbnail attributes, and a
 * `background: url(…)` in an inline style. Missing any one leaves the entry
 * fetching from Ghost's CDN, which is the dependency this whole import exists
 * to remove.
 *
 * srcset and sizes are dropped rather than rewritten: those named Ghost's own
 * responsive variants, and there is one file per image now.
 */
const REMOTE_ASSET = /(?:(?:src|poster|data-kg-thumbnail|data-kg-custom-thumbnail)=\\?"|url\('?)(https?:\/\/[^"')\\]+)/g;

async function localiseAssets(html: string): Promise<string> {
  const remote = new Set<string>();
  for (const [, url] of html.matchAll(REMOTE_ASSET)) {
    // An embed is a destination, not an asset: a YouTube iframe has nothing to
    // bring down.
    if (!/youtube\.com|youtu\.be|vimeo\.com|loom\.com/.test(url)) remote.add(url);
  }

  const localFor = new Map<string, string>();
  for (const url of remote) {
    const local = await download(url);
    if (local) localFor.set(url, local);
  }

  let out = html.replace(/\s(?:srcset|sizes)="[^"]*"/g, "");
  for (const [url, local] of localFor) {
    out = out.split(url).join(local);
  }
  return out;
}

// ---------------------------------------------------------------------------
// HTML to Markdown
// ---------------------------------------------------------------------------

/**
 * Characters that would be read as markup in the Markdown that replaces this
 * HTML. Ghost's entities (&amp;, &nbsp;) are left encoded: Markdown passes them
 * through untouched, so keeping them is what makes the round trip exact.
 */
function escapeText(text: string): string {
  return text.replace(/([\\`*_[\]])/g, "\\$1");
}

/** Markdown's link and image titles are quoted, so a quote inside one escapes. */
function escapeQuoted(text: string): string {
  return text.replace(/(["\\])/g, "\\$1");
}

const INLINE_OPEN = /<(strong|b|em|i|code|a|u|span|br)\b([^>]*)>/i;

/** One inline element's contents, and where the element ends. */
function takeElement(html: string, from: number, tag: string): { inner: string; end: number } {
  const boundary = new RegExp(`<(/?)${tag}\\b[^>]*>`, "gi");
  boundary.lastIndex = from;
  let depth = 1;
  for (let match = boundary.exec(html); match; match = boundary.exec(html)) {
    depth += match[1] ? -1 : 1;
    if (depth === 0) {
      return { inner: html.slice(from, match.index), end: boundary.lastIndex };
    }
  }
  // An element Ghost never closed: everything after it is its content.
  return { inner: html.slice(from), end: html.length };
}

/**
 * An inline element around its own words, with any space it was holding left
 * outside it.
 *
 * Two reasons. Markdown reads `** bold **` as literal asterisks, and Ghost's
 * editor readily bolds or links the gap between two words on its own — an
 * emphasis with nothing but space in it is not emphasis, and an underline drawn
 * under a trailing space reads as a stray tick after the word.
 */
function around(content: string, wrap: (core: string) => string): string {
  const [, lead, core, trail] = /^(\s*)([\s\S]*?)(\s*)$/.exec(content)!;
  return core ? `${lead}${wrap(core)}${trail}` : content;
}

/**
 * The inline run inside a block, as Markdown.
 *
 * Nesting is shallow here — a link inside a bold, emphasis inside a link — but
 * it is nesting, so each element is taken whole and its contents converted in
 * turn. Anything outside the small set the archive uses keeps the HTML it
 * already has, which Markdown allows inline.
 */
function inlineMarkdown(html: string): string {
  let out = "";
  let at = 0;

  while (at < html.length) {
    const match = INLINE_OPEN.exec(html.slice(at));
    if (!match) {
      out += escapeText(html.slice(at));
      break;
    }

    out += escapeText(html.slice(at, at + match.index));
    const tag = match[1].toLowerCase();
    const attrs = match[2];
    at += match.index + match[0].length;

    if (tag === "br") {
      out += "<br>";
      continue;
    }

    const { inner, end } = takeElement(html, at, tag);
    const content = inlineMarkdown(inner);
    at = end;

    switch (tag) {
      case "strong":
      case "b":
        out += around(content, (core) => `**${core}**`);
        break;
      case "em":
      case "i":
        out += around(content, (core) => `*${core}*`);
        break;
      // A code span is literal: escaping inside one would print the
      // backslashes. Its markers grow if the code itself holds a backtick.
      case "code": {
        const code = oneLine(inner.replace(/<[^>]+>/g, ""));
        if (!code) break;
        const fence = "`".repeat((code.match(/`+/g)?.[0].length ?? 0) + 1);
        out += `${fence}${code}${fence}`;
        break;
      }
      case "a": {
        const href = attrs.match(/href="([^"]*)"/)?.[1] ?? "";
        out += around(content, (core) => `[${core}](${href})`);
        break;
      }
      // Markdown has no underline, so <u> keeps itself. A styled span is the
      // editor leaking into the copy; the words inside it are the content.
      case "u":
        out += `<u>${content}</u>`;
        break;
      default:
        out += content;
    }
  }

  return out;
}

/** Inline whitespace, as HTML would have collapsed it anyway. */
function oneLine(markdown: string): string {
  return markdown.replace(/\s+/g, " ").trim();
}

/**
 * A paragraph that opens a Markdown line has to not look like other markup. The
 * archive is full of hand-numbered steps — "1) Connect your payout method" —
 * which Markdown would otherwise read as an ordered list.
 */
function escapeLineStart(text: string): string {
  // The backslash goes before the character that carries the meaning — "1\)",
  // not "\1)" — because Markdown only escapes punctuation.
  return text
    .replace(/^(#{1,6}|[-+>])(\s)/, "\\$1$2")
    .replace(/^(\d+)([.)]\s)/, "$1\\$2");
}

/** A paragraph holding nothing but a break, which is where a writer pressed return. */
const BLANK_PARAGRAPH = /^(?:\s|&nbsp;|<br>)*$/;

const IMAGE_FIGURE = /^<figure\b[^>]*>\s*<img\b([^>]*)>\s*(?:<figcaption>([\s\S]*?)<\/figcaption>\s*)?<\/figure>$/i;

/** An image figure as Markdown, or null when it is anything more than that. */
function imageMarkdown(figure: string): string | null {
  const match = figure.match(IMAGE_FIGURE);
  if (!match) return null;
  const [, attrs, caption] = match;
  const src = attrs.match(/\ssrc="([^"]*)"/)?.[1];
  if (!src) return null;
  const alt = attrs.match(/\salt="([^"]*)"/)?.[1] ?? "";
  const title = caption ? ` "${escapeQuoted(oneLine(inlineMarkdown(caption)))}"` : "";
  return `![${escapeQuoted(alt)}](${src}${title})`;
}

const OPEN_BLOCK = /<(h[1-6]|p|ul|ol|figure|div|blockquote|pre|table)\b[^>]*>/i;
const OPEN_ITEM = /<li\b[^>]*>/i;
const OPEN_LIST = /<(ul|ol)\b[^>]*>/i;

/**
 * One list item's own text, with the lists nested inside it taken out.
 *
 * A nested list is a block, not part of the sentence above it, and it has to be
 * found by walking rather than by matching: `<ul>` up to the first `</ul>`
 * closes on the inner list, and everything after it — the rest of the outer
 * list — would be swallowed with it.
 */
function splitNestedLists(item: string): { text: string; nested: string[] } {
  let text = "";
  const nested: string[] = [];
  let at = 0;

  while (at < item.length) {
    const match = OPEN_LIST.exec(item.slice(at));
    if (!match) {
      text += item.slice(at);
      break;
    }
    text += item.slice(at, at + match.index);
    const tag = match[1].toLowerCase();
    const from = at + match.index + match[0].length;
    const { inner, end } = takeElement(item, from, tag);
    nested.push(`${tag}:${inner}`);
    at = end;
  }

  return { text, nested };
}

/** A list, as Markdown: one line per item, two spaces per level of nesting. */
function listMarkdown(inner: string, ordered: boolean, depth: number): string {
  const lines: string[] = [];
  let at = 0;
  let index = 0;

  while (at < inner.length) {
    const match = OPEN_ITEM.exec(inner.slice(at));
    if (!match) break;
    at += match.index + match[0].length;
    const item = takeElement(inner, at, "li");
    at = item.end;

    const { text, nested } = splitNestedLists(item.inner);
    const marker = ordered ? `${++index}.` : "-";
    lines.push(`${" ".repeat(depth * 2)}${marker} ${oneLine(inlineMarkdown(text))}`);
    for (const list of nested) {
      const [tag, contents] = [list.slice(0, list.indexOf(":")), list.slice(list.indexOf(":") + 1)];
      lines.push(listMarkdown(contents, tag === "ol", depth + 1));
    }
  }

  return lines.join("\n");
}

/**
 * One entry's body, as Markdown.
 *
 * The archive is a flat sequence of headings, paragraphs, lists and figures, so
 * the conversion walks the blocks rather than parsing a document. What it does
 * not recognise — a video card, a YouTube embed, a table someone pasted — is
 * emitted as the HTML it already is, which is a Markdown block in its own right
 * and renders identically.
 */
function toMarkdown(html: string): string {
  const blocks: string[] = [];
  let at = 0;

  while (at < html.length) {
    const match = OPEN_BLOCK.exec(html.slice(at));
    if (!match) break;

    // Walked rather than matched, for the same reason the nested lists are: a
    // list holding a list closes on the inner one's </ul>.
    const tag = match[1].toLowerCase();
    const opens = at + match.index;
    const element = takeElement(html, opens + match[0].length, tag);
    const block = html.slice(opens, element.end);
    const inner = element.inner;
    at = element.end;

    if (/^h[1-6]$/.test(tag)) {
      blocks.push(`${"#".repeat(Number(tag[1]))} ${oneLine(inlineMarkdown(inner))}`);
      continue;
    }
    if (tag === "p") {
      const text = oneLine(inlineMarkdown(inner));
      if (!BLANK_PARAGRAPH.test(text)) blocks.push(escapeLineStart(text));
      continue;
    }
    if (tag === "ul" || tag === "ol") {
      blocks.push(listMarkdown(inner, tag === "ol", 0));
      continue;
    }
    if (tag === "figure") {
      blocks.push(imageMarkdown(block.trim()) ?? block.trim());
      continue;
    }
    blocks.push(block.trim());
  }

  return `${blocks.join("\n\n")}\n`;
}

// ---------------------------------------------------------------------------

/**
 * Entities, resolved to the characters they stand for.
 *
 * The body keeps its entities — Markdown passes `&amp;` through untouched, which
 * is what keeps the archive rendering as it did. The title and the excerpt are
 * plain text by the time anything uses them, printed by React and put in a meta
 * tag, so an `&amp;` left in either comes out on the page as "&amp;".
 */
function decodeEntities(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

/** Ghost's titles here are labels, not headlines: "Changelog - MCP". */
const ENTRY_LABEL = /^\s*changelog\s*[-–—:]\s*|\s*[-–—:]\s*changelog\s*$/gi;

const LEADING_HEADING = /^\s*<h[23][^>]*>([\s\S]*?)<\/h[23]>/i;

/**
 * The sentence that stands in for an entry — its meta description, and the line
 * a search result shows under the headline.
 *
 * Ghost generated one by cutting the body at 500 characters, headline, line
 * breaks and half a sentence included, which is what these pages have been
 * carrying as their description. The writer's own excerpt where there is one,
 * and otherwise the entry's opening, cut on a sentence.
 */
const MIN_EXCERPT = 90;
const MAX_EXCERPT = 200;

function description(post: GhostApiPost, html: string): string {
  const written = post.custom_excerpt?.trim();
  if (written) return decodeEntities(oneLine(written));

  // Openings are often a single short line, so paragraphs are taken in order
  // until there is enough of one to read as a description.
  let text = "";
  for (const [, inner] of html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)) {
    const paragraph = decodeEntities(oneLine(inner.replace(/<[^>]+>/g, "")));
    if (!paragraph) continue;
    text = text ? `${text} ${paragraph}` : paragraph;
    if (text.length >= MIN_EXCERPT) break;
  }
  if (text.length <= MAX_EXCERPT) return text;

  const window = text.slice(0, MAX_EXCERPT);
  const sentence = window.lastIndexOf(". ");
  if (sentence > MIN_EXCERPT) return window.slice(0, sentence + 1);
  return `${window.slice(0, window.lastIndexOf(" "))}…`;
}

/**
 * What to call one entry.
 *
 * Nearly every body opens on the heading readers should see, and the Ghost title
 * beside it is an internal label. The label, stripped of its boilerplate, is the
 * fallback for the few entries that open on a paragraph.
 */
function headline(post: GhostApiPost, html: string): string {
  const heading = LEADING_HEADING.exec(html)?.[1];
  const text = heading ? decodeEntities(heading.replace(/<[^>]+>/g, "")).trim() : "";
  return (
    text || decodeEntities(post.title.replace(ENTRY_LABEL, "")).trim() || post.title
  );
}

async function main() {
  const posts = await fetchArchive();
  console.log(`${posts.length} entries from ${GHOST_URL}`);

  await rm(join(ROOT, CONTENT_DIR), { recursive: true, force: true });
  await mkdir(join(ROOT, CONTENT_DIR), { recursive: true });

  for (const post of posts) {
    // The same fixups the site used to run on Ghost's markup every render.
    const corrected = dropUnservableFigures(
      relinkDeadDocs(
        withCroppedScreenshots(
          normalizeEntryHeadings(
            nativeVideoControls((post.html ?? "").replace(/<\/?(?:html|head|body)>/g, "")),
          ),
        ),
      ),
    );

    const html = await localiseAssets(corrected);
    const body = toMarkdown(html);

    await writeFile(
      join(ROOT, CONTENT_DIR, `${post.slug}.md`),
      serialiseEntry({
        slug: post.slug,
        title: headline(post, corrected),
        excerpt: description(post, corrected),
        date: post.published_at ?? new Date(0).toISOString(),
        updatedAt: post.updated_at ?? post.published_at ?? new Date(0).toISOString(),
        body,
      }),
    );
    console.log(`  ${post.slug}`);
  }

  const files = await readdir(join(ROOT, CONTENT_DIR));
  console.log(`\nwrote ${files.length} entries and ${assets.size} assets`);
}

await main();
