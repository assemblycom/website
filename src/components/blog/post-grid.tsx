import Link from "next/link";
import { formatPostDate, type PostCard } from "@/lib/ghost";
import { cn } from "@/lib/utils";
import { PostByline } from "./post-byline";

/**
 * The blog's card grid: one outlined block with every post a cell in it, ruled
 * between, title, excerpt and byline.
 *
 * The rules are the cells' own right and bottom borders, and the outside edge
 * is the container's inset ring. A border on the container would be cut off
 * at the corners by the radius, since the clip that rounds the cells also
 * crops the lines they draw. No cover art: at three across the covers repeated
 * the same few stock photographs and said nothing the titles didn't.
 */
export function PostGrid({
  posts,
  className,
}: {
  posts: PostCard[];
  /** The column count. */
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid overflow-hidden rounded-xl ring-1 ring-inset ring-border [[data-theme=dark]_&]:ring-[#383838]",
        className,
      )}
    >
      {posts.map((post) => (
        <Link
          key={post.slug}
          href={`/blog/${post.slug}`}
          className="group flex flex-col border-b border-r border-border p-6 transition-colors hover:bg-muted/50 lg:p-8 [[data-theme=dark]_&]:border-[#383838]"
        >
          <h3 className="type-h4 line-clamp-2 text-balance text-foreground">
            {post.title}
          </h3>
          <p className="type-body mt-3 line-clamp-3 text-pretty text-muted-foreground">
            {post.excerpt}
          </p>
          <div className="mt-8 pt-2 md:mt-auto md:pt-10">
            <PostByline
              author={post.author}
              image={post.authorImage}
              date={formatPostDate(post.date)}
            />
          </div>
        </Link>
      ))}
    </div>
  );
}
