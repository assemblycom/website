import Image from "next/image";
import Link from "next/link";
import { formatPostDate, readingTime, type GhostPost } from "@/lib/ghost";
import { isOptimizedHost } from "@/lib/image-hosts";
import { unbreakable } from "@/components/ui/unbreakable";

/**
 * The opening block of a guide post (the SEO articles with a contents rail):
 * breadcrumbs, title, standfirst, and a byline with the date and read time, set
 * in one grey box so the start of the article is easy to find.
 *
 * On a wide screen the box spans the whole layout — contents edge to card edge —
 * on the same three tracks as the grid below, so the text lines up with the
 * article column. Between lg and wide the text starts at the box's left edge;
 * on a phone the grey runs full-bleed under the nav.
 */
export function PostHero({ post }: { post: GhostPost }) {
  const avatar = post.authorImage;
  return (
    <header
      data-post-hero
      className="-mx-6 bg-[var(--surface)] px-6 pb-7 pt-6 md:mx-auto md:max-w-[43rem] md:rounded-3xl md:px-8 md:pb-9 md:pt-8 lg:max-w-none lg:px-10 wide:grid wide:grid-cols-[16rem_43rem_16rem] wide:justify-between wide:gap-x-[4.5rem] wide:px-8"
    >
      <div className="wide:col-start-2">
        {/* Breadcrumbs, the same "Blog / …" trail the author pages use, with a
            small Haze mark in front. */}
        <nav aria-label="Breadcrumb" className="text-sm leading-normal text-muted-foreground">
          <span
            aria-hidden
            className="mr-2.5 inline-block size-2 rounded-[2px] bg-[var(--guide-haze)]"
          />
          <Link href="/blog" className="transition-colors hover:text-foreground">
            Blog
          </Link>
          {post.category && (
            <>
              <span aria-hidden className="px-2 text-foreground/30">
                /
              </span>
              {post.categorySlug ? (
                <Link
                  href={`/blog/tag/${post.categorySlug}`}
                  className="transition-colors hover:text-foreground"
                >
                  {post.category}
                </Link>
              ) : (
                post.category
              )}
            </>
          )}
        </nav>

        <h1 className="type-display mt-4 max-w-[44rem] text-balance font-medium leading-[1.14] tracking-[-0.02em] text-foreground">
          {unbreakable(post.title)}
        </h1>

        <p className="mt-5 max-w-[44rem] text-pretty text-lg leading-[1.55] text-[color-mix(in_srgb,var(--foreground)_78%,var(--background))] md:text-xl md:leading-normal">
          {post.excerpt}
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3.5">
          <div className="flex items-center gap-3">
            {avatar &&
              (isOptimizedHost(avatar) ? (
                <Image
                  src={avatar}
                  alt=""
                  width={44}
                  height={44}
                  className="size-11 shrink-0 rounded-full object-cover"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatar} alt="" className="size-11 shrink-0 rounded-full object-cover" />
              ))}
            <p className="text-[0.9375rem] leading-[1.4] text-foreground">
              {post.authorSlug ? (
                <Link
                  href={`/blog/author/${post.authorSlug}`}
                  className="transition-colors hover:text-muted-foreground"
                >
                  {post.author}
                </Link>
              ) : (
                post.author
              )}
            </p>
          </div>
          <p className="flex flex-col text-[0.9375rem] leading-[1.4] text-muted-foreground md:border-l md:border-foreground/15 md:pl-6">
            <span>Published {formatPostDate(post.date)}</span>
            <span className="text-sm">{readingTime(post)} min read</span>
          </p>
        </div>
      </div>
    </header>
  );
}
