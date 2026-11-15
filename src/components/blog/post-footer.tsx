import type { GhostPost } from "@/lib/ghost";
import { PostGrid } from "@/components/blog/post-grid";

/**
 * How a guide post closes: a few more posts from the same shelf, on the same
 * cards as the blog index, so a reader who finished the piece has somewhere to
 * go next before the site's closing CTA. It takes the page's full content
 * width, rails included, the way the index lays its grid out: squeezed into
 * the article's column the cards were too narrow and the label too far off.
 */
export function PostFooter({ related }: { related: GhostPost[] }) {
  if (!related.length) return null;
  return (
    // A rule rather than a heading marks where the post ends and the next
    // reads begin; the heading stays for screen readers.
    <section aria-labelledby="related-posts" className="mt-24 md:mt-32">
      {/* Ruled to the window's edges, like the page's other section breaks. */}
      <div
        aria-hidden
        className="mx-[calc(50%-50vw)] mb-12 border-t border-border md:mb-16 [[data-theme=dark]_&]:border-[#262626]"
      />
      <h2 id="related-posts" className="sr-only">
        Related posts
      </h2>
      <PostGrid posts={related} className="sm:grid-cols-2 xl:grid-cols-4" />
    </section>
  );
}
