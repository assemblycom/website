import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articleSchema } from "@/lib/blog-schema";
import { serializeJsonLd } from "@/lib/json-ld";
import {
  formatPostDate,
  postContents,
  getPost,
  getPosts,
  quotesAboveFigures,
  splitFaq,
  withHeadingIds,
  withImageSizes,
} from "@/lib/ghost";
import { isOptimizedHost } from "@/lib/image-hosts";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { CustomersCta } from "@/components/customers/customers-cta";
import { AuthorAvatar } from "@/components/blog/post-byline";
import { PostCta } from "@/components/blog/post-cta";
import { PostHero } from "@/components/blog/post-hero";
import { PostMobileCta } from "@/components/blog/post-mobile-cta";
import { PostLightbox } from "@/components/blog/post-lightbox";
import { TocMobile } from "@/components/ui/toc-mobile";
import { PostToc } from "@/components/blog/post-toc";
import { unbreakable } from "@/components/ui/unbreakable";

// Ghost holds one cover per post. An announcement whose artwork comes in a
// second colourway for the dark theme lists it here, so each theme gets the
// version that stands apart from the page instead of melting into it.
const DARK_THEME_COVERS: Record<string, string> = {
  "fall-2026-updates": "/images/blog/fall-2026-updates-cover-dark-theme.jpg",
};
const COVER_SIZES = "(min-width: 1088px) 1024px, calc(100vw - 3rem)";

export async function generateStaticParams() {
  return (await getPosts()).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return pageMetadata({
    // The SEO title Ghost carries, not the editorial one: it is the title-cased
    // version written for the search result. The <h1> keeps `title`, which is
    // what that field is for — the two are allowed to differ.
    title: post.seoTitle ?? post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
  });
}


export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  // Quotes lifted before the ids are assigned, so heading order is read off the
  // markup the page actually renders.
  const { html, headings } = withHeadingIds(quotesAboveFigures(post.html));
  // Both rails list the same sections under the same labels.
  const contents = postContents(headings, post.title);
  // The trailing FAQ is rendered as the site's accordion rather than as a run
  // of headings; the contents list still points at the heading the page draws.
  const { body, faqs, headingId } = splitFaq(html);
  // Ghost sets a no-TOC template on posts whose author didn't want a contents
  // rail — the announcements, in practice; short posts have nothing to list
  // either way.
  const showToc = post.showToc && contents.length > 1;
  // With neither a contents list nor a card, the rail holds only the way back,
  // which doesn't earn a column of its own — so the announcements read as a
  // centred page instead of an article pushed off to one side.
  const showRail = showToc || Boolean(post.cta);
  // What the page actually gives an image, so the browser picks the right file
  // off Ghost's srcset: the reading measure beside a rail, or the announcements'
  // 40.5rem column (only their cover runs wider).
  const darkThemeCover = DARK_THEME_COVERS[post.slug];
  const imageSizes = showRail
    ? "(min-width: 1440px) 688px, (min-width: 1024px) 648px, calc(100vw - 3rem)"
    : "(min-width: 696px) 648px, calc(100vw - 3rem)";

  return (
    // Two tracks on desktop: a rail holding the way back and the contents, and
    // the article itself on a fixed reading measure. The rail is dropped below
    // lg — a contents list is a desktop affordance, and stacked above a post on
    // a phone it is just a second thing to scroll past.
    <article
      className={cn(
        "mx-auto max-w-[1600px] px-6 pb-24 md:px-10 md:pb-32",
        // The guides open on a grey hero box, which wants to sit close under
        // the nav; the announcements open on their headline and keep the air.
        showRail ? "pt-4 md:pt-6" : "pt-12 md:pt-16",
      )}
    >
      {/* Article schema. Next exposes no metadata field for JSON-LD, so it is a
          script in the body, which Google reads as readily as one in the head.
          Serialized through serializeJsonLd, not JSON.stringify: these values
          are Ghost's, and a title containing "</script>" would otherwise close
          this element and have the rest of itself parsed as markup. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleSchema(post)) }}
      />
      {/* The guides (SEO posts with a rail) open on their own hero box, spanning
          the full layout above the rails so the contents list and the card
          start level with the article. The breadcrumb in it is the way back. */}
      {showRail && <PostHero post={post} />}

      <div
        className={
          showRail
            ? // Two rails once there is room for them: the contents on the left, the
              // card on the right, in the margin the article was leaving
              // empty. Sharing one rail meant a long post's list had to scroll
              // inside whatever the card left over. The `wide` breakpoint is
              // where the third column fits without taking a pixel off the
              // reading measure; below it the two stack in the
              // left rail as before. The middle column is 43rem rather than the
              // 40.5rem it takes on a narrow desktop: the widest comparison
              // table runs to 662px, and at 40.5rem it was clipped and carrying
              // a scroll shadow. Spread rather than centred: it puts the
              // contents on the container's own left edge, in line with the
              // wordmark above them, and leaves the spare width in the gaps.
              // Below lg the column takes the same 43rem measure the hero box
              // does on a tablet, centred, instead of running the full width.
              "mt-8 md:mx-auto md:max-w-[43rem] lg:mx-0 lg:mt-10 lg:max-w-none lg:grid lg:grid-cols-[16rem_minmax(0,40.5rem)] lg:gap-x-[10.5rem] wide:grid-cols-[16rem_43rem_16rem] wide:justify-between wide:gap-x-[4.5rem]"
            : "mx-auto max-w-[40.5rem]"
        }
      >
        {/* The left rail. The column is the grid's, so it stands as tall as the
            article — which is the distance the contents list sticks over. */}
        <div className={showRail ? "hidden lg:block" : "hidden"}>
          {/* Between lg and wide the card and the contents share this rail. The
              card (with its demo) is too tall to pin alongside a long list, so
              it sits at the top and scrolls away, and only the contents stay
              pinned while reading. Past wide the card has its own column. */}
          <div className="flex h-full flex-col gap-10">
            {/* The card the post's own writer authored in Ghost. It says
                something about THIS post, which the site's closing CTA can't.
                Only while the two share this rail: past `wide` it has a column
                of its own on the other side and this copy stands down. Never
                compressed and never clipped, so its button is always whole. */}
            {post.cta && (
              <PostCta cta={post.cta} guide className="shrink-0 wide:hidden" />
            )}

            {showToc && (
              <PostToc
                headings={contents}
                className="sticky top-28 max-h-[calc(100vh-9rem)] overflow-y-auto"
              />
            )}
          </div>
        </div>

        <div className="wide:col-start-2 wide:row-start-1">
          {/* Without a rail the page has no left edge to hang off, so the
              announcements set their opening block on the column's centre line
              instead. The body below stays ranged left — centred paragraphs are
              hard to read at any length. */}
          {!showRail && (
          <header className="text-center">
            {/* The date, then the section as one of the site's mono tags — the
                same chip the proposal pages draw. No
                breadcrumb: the way back to the blog is in the nav and at the
                foot of the page, and there is no per-section archive to link a
                name to. */}
            <div
              className={cn(
                "flex flex-wrap items-center gap-3",
                !showRail && "justify-center",
              )}
            >
              {post.category && (
                <span className="rounded-sm bg-muted px-2.5 py-1 text-xs uppercase leading-none tracking-[0.06em] text-muted-foreground [font-family:var(--font-diatype-mono),ui-monospace,monospace] [[data-theme=dark]_&]:bg-white/[0.06]">
                  {post.category}
                </span>
              )}
              <p className="type-body text-muted-foreground">
                Published {formatPostDate(post.date)}
              </p>
            </div>
            {/* Leading and tracking set here rather than on type-display, which
                nine other pages share: at 48px the token's 1.08 leaves a
                two-line headline looking loose, where every reference blog sets
                its post title at about 1.0. */}
            <h1 className="type-display mt-3 text-balance leading-[1.02] tracking-[-0.03em] text-foreground">
              {unbreakable(post.title)}
            </h1>
            {/* The centred announcements go straight from the headline to the
                byline: their titles already carry the news, and a centred deck
                under a centred title read as a second, competing headline. The
                excerpt still does its work in the listing and the meta
                description. */}
            {showRail && (
              <p className="type-lead mt-4 text-pretty text-muted-foreground">
                {post.excerpt}
              </p>
            )}
            <div
              className={cn(
                "flex items-center gap-2.5",
                showRail ? "mt-5" : "mt-6 justify-center",
              )}
            >
              {post.authorImage && <AuthorAvatar image={post.authorImage} />}
              <p className="type-body text-muted-foreground">
                {/* Only the Content API knows an author's slug, so on the RSS
                    fallback the byline is plain text rather than a dead link. */}
                By{" "}
                {post.authorSlug ? (
                  <Link
                    href={`/blog/author/${post.authorSlug}`}
                    className="transition-colors hover:text-foreground"
                  >
                    {post.author}
                  </Link>
                ) : (
                  post.author
                )}
              </p>
            </div>
          </header>
          )}

          {post.image && (
            <div
              className={cn(
                "relative w-full overflow-hidden rounded-2xl border border-border bg-muted [[data-theme=dark]_&]:border-[#383838]",
                showRail ? "aspect-[16/9]" : "mt-8",
                // Capped against the WINDOW, not given a shorter ratio of its
                // own: 16:9 at the reading measure is 365px, which put the first
                // line of the article below the fold on a laptop — you landed on
                // a headline and a photograph and had to scroll to reach a word
                // of the piece. A vh cap keeps the cover to a fixed share of
                // whatever screen it opens on, so the body clears the fold on a
                // short screen and the artwork still gets its full height on a
                // tall one, instead of one hard-coded crop guessing at both.
                showRail && "max-h-[30vh]",
                // On the announcements the cover leads the same visuals the body
                // runs wide, so it breaks out of the reading column with them —
                // and keeps its full height. Those covers are artwork carrying
                // the product wordmark rather than stock photography above a
                // listicle, and they are the page, not an ornament on it.
                !showRail &&
                  "ml-[50%] w-[min(100vw-3rem,64rem)] max-w-none -translate-x-1/2",
              )}
            >
              {/* An announcement cover is artwork with the wordmark near its
                  edges, so it takes its own shape instead of being cropped
                  into a fixed frame. */}
              {!showRail && isOptimizedHost(post.image) ? (
                <>
                  {/* Ghost doesn't report the file's dimensions; these only
                      seed the layout, and h-auto lets the image's own ratio
                      win. */}
                  <Image
                    src={post.image}
                    alt=""
                    width={2000}
                    height={1125}
                    // The theme is only known in the browser, so with two
                    // covers neither is preloaded: lazy loading skips the
                    // hidden one and fetches the visible one as it lays out.
                    priority={!darkThemeCover}
                    sizes={COVER_SIZES}
                    className={cn(
                      "block h-auto w-full",
                      darkThemeCover && "[[data-theme=dark]_&]:hidden",
                    )}
                  />
                  {darkThemeCover && (
                    <Image
                      src={darkThemeCover}
                      alt=""
                      width={2400}
                      height={1200}
                      sizes={COVER_SIZES}
                      className="hidden h-auto w-full [[data-theme=dark]_&]:block"
                    />
                  )}
                </>
              ) : !showRail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.image} alt="" className="block h-auto w-full" />
              ) : isOptimizedHost(post.image) ? (
                <Image
                  src={post.image}
                  alt=""
                  fill
                  priority
                  sizes={imageSizes}
                  className="object-cover"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.image}
                  alt=""
                  className="absolute inset-0 size-full object-cover"
                />
              )}
            </div>
          )}

          {/* Ghost's own markup, restyled by .post-body in globals.css. The
              source is our CMS, not user input. */}
          <div
            className={cn(
              "post-body",
              post.image || !showRail ? "mt-10" : "mt-0",
              showRail ? "post-body-guide" : "post-body-wide",
            )}
            dangerouslySetInnerHTML={{
              __html: withImageSizes(body, imageSizes),
            }}
          />

          {faqs.length > 0 && (
            <section className="mt-14">
              <h2
                id={headingId}
                className="scroll-mt-28 text-[1.625rem] leading-[1.35] tracking-[-0.015em] text-foreground"
              >
                Frequently asked questions
              </h2>
              {/* Read, not browsed: three or four short answers at the foot of
                  a long article are quicker to read than to open, so they sit
                  out in the open with no rows to click and no rules between
                  them — the same shape as the sections above. */}
              <div className="post-body">
                {faqs.map((faq) => (
                  <div key={faq.question} className="mt-8">
                    <h3 className="text-foreground">{faq.question}</h3>
                    <div
                      className="mt-2"
                      dangerouslySetInnerHTML={{ __html: faq.answerHtml }}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>

        {/* The writer's card in the margin the article was leaving empty, pinned
            on its own so the contents list no longer has to share height with
            it. Last in the markup and placed by the grid, so the reading order
            is contents, then post, then the offer. */}
        {post.cta && (
          <div className="hidden wide:col-start-3 wide:row-start-1 wide:block">
            <PostCta cta={post.cta} guide className="sticky top-28" />
          </div>
        )}
      </div>

      {/* Every post closes on the site's own CTA, the same block behind the same
          divider that every other page ends on — including the posts carrying a
          writer's card in the rail, since the two sit in different places rather
          than one under the other. The rail is gone below lg, so on a phone this
          is the only call to action either kind of post has. */}
      {/* Out of the page's gutters, so the rule runs edge to edge — and out of
          its bottom padding too, which would otherwise sit under the CTA's own
          and leave the button stranded in half a screen of white. */}
      <div
        data-post-end
        className="-mx-6 -mb-24 mt-20 md:-mx-10 md:-mb-32 md:mt-28"
      >
        <div className="border-t border-border [[data-theme=dark]_&]:border-[#383838]" />
        <CustomersCta />
      </div>

      {showToc && (
        <TocMobile headings={contents} bodySelector=".post-body" id="post-toc-mobile" />
      )}
      {showRail && (
        <PostMobileCta heroSelector="[data-post-hero]" endSelector="[data-post-end]" />
      )}
      <PostLightbox />
    </article>
  );
}
