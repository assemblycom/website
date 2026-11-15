import Image from "next/image";
import Link from "next/link";
import { formatPostDate, readingTime, type GhostPost } from "@/lib/ghost";
import { isOptimizedHost } from "@/lib/image-hosts";
import { unbreakable } from "@/components/ui/unbreakable";

/**
 * The columns a guide post is laid out on from lg: the contents rail, the
 * article, and the card's rail. Below xl the rails narrow and the article takes
 * what is left, so the card keeps its place on the right on a laptop. The hero
 * and the body share them so the title and the article text start on the same
 * edge, and the breadcrumb sits over the contents list.
 */
export const GUIDE_COLUMNS =
  "md:mx-auto md:max-w-[43rem] lg:mx-0 lg:max-w-none lg:grid lg:grid-cols-[12rem_minmax(0,43rem)_13rem] lg:justify-between lg:gap-x-8 xl:grid-cols-[13rem_minmax(0,43rem)_14rem] xl:justify-between xl:gap-x-10 wide:grid-cols-[16rem_43rem_16rem] wide:gap-x-[4.5rem]";

/**
 * The opening block of a guide post (the SEO articles with a contents rail),
 * set the way Cursor opens its posts: the breadcrumb alone in the margin
 * column, and in the article's column the date, the title, the standfirst in
 * full ink, the byline under it, and the post's cover below that. No box and
 * no rules, so the start of the article is marked by the type and the image.
 */
export function PostHero({
  post,
  imageSizes,
}: {
  post: GhostPost;
  /** What the article column gives an image, so the cover picks its file. */
  imageSizes: string;
}) {
  const avatar = post.authorImage;
  return (
    <header data-post-hero className="pt-14 md:pt-16 lg:pt-12">
      <div className={GUIDE_COLUMNS}>
        {/* Breadcrumbs, the way back to the blog. On a desktop the sans "Blog
            / …" trail hangs in the contents rail's column, so the title column
            opens on the date. On a phone there is no margin, so it sits over
            the title, with the category in ink as the place the post lives. */}
        <nav
          aria-label="Breadcrumb"
          className="mb-4 text-sm leading-6 text-muted-foreground lg:col-start-1 lg:row-start-1 lg:mb-0"
        >
          <Link
            href="/blog"
            className="transition-colors hover:text-foreground"
          >
            Blog
          </Link>
          {post.category && (
            <>
              <span aria-hidden className="px-2 text-foreground/30">
                <span className="lg:hidden">›</span>
                <span className="hidden lg:inline">/</span>
              </span>
              {post.categorySlug ? (
                <Link
                  href={`/blog/tag/${post.categorySlug}`}
                  className="text-foreground transition-colors hover:text-muted-foreground lg:text-muted-foreground lg:hover:text-foreground"
                >
                  {post.category}
                </Link>
              ) : (
                <span className="text-foreground lg:text-muted-foreground">
                  {post.category}
                </span>
              )}
            </>
          )}
        </nav>

        <div className="lg:col-start-2 lg:row-start-1">
          {/* The date leads the title column on a desktop; a phone opens on
              the breadcrumb and the title instead, to keep the hero short. */}
          <p className="hidden text-[0.9375rem] leading-6 text-muted-foreground lg:block">
            <time dateTime={post.date}>{formatPostDate(post.date)}</time>
          </p>

          <h1 className="max-w-[44rem] lg:mt-2 text-balance text-[2rem] font-medium leading-[1.15] tracking-[-0.02em] text-foreground md:text-[2.25rem]">
            {unbreakable(post.title)}
          </h1>

          <p className="mt-4 max-w-[44rem] text-pretty text-[1.0625rem] leading-[1.55] text-foreground md:text-[1.1875rem]">
            {post.excerpt}
          </p>

          <div className="mt-6 flex items-center gap-2.5">
            {avatar &&
              (isOptimizedHost(avatar) ? (
                <Image
                  src={avatar}
                  alt=""
                  width={28}
                  height={28}
                  className="size-7 shrink-0 rounded-full object-cover"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatar}
                  alt=""
                  className="size-7 shrink-0 rounded-full object-cover"
                />
              ))}
            <p className="text-[0.9375rem] leading-[1.4] text-muted-foreground">
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
            {/* The read time on the byline's own line, after a dot, the way
                Cursor sets it. */}
            <span aria-hidden className="-mx-1 text-muted-foreground">
              ·
            </span>
            <p className="text-[0.9375rem] leading-[1.4] text-muted-foreground">
              {readingTime(post)} min read
            </p>
          </div>

          {post.image && (
            // The writer's cover at the article's width, framed like the
            // site's other image cards. Its share of the screen is capped so
            // the first lines of the post still clear the fold on a laptop.
            <div className="relative mt-10 aspect-[16/9] max-h-[40vh] w-full overflow-hidden rounded-lg border border-border bg-muted [[data-theme=dark]_&]:border-[#262626]">
              {isOptimizedHost(post.image) ? (
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

          {/* On a phone the hero and the article share one column with no
              rails to frame them, so a dashed rule marks where the post
              itself begins. */}
          <div
            aria-hidden
            className="mt-10 border-t border-dashed border-border lg:hidden [[data-theme=dark]_&]:border-[#262626]"
          />
        </div>
      </div>
    </header>
  );
}
