import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogBrowser } from "@/components/blog/blog-browser";
import { pageCount, pageFromParam, pagedSeo, tagPath } from "@/lib/blog";
import { getCategories, getPostsByCategory, toCard } from "@/lib/ghost";
import { pageMetadata } from "@/lib/seo";

/**
 * One tag's shelf of the archive.
 *
 * The filter strip on /blog used to hold its selection in component state, so
 * every shelf was the same URL and none of them could be shared, linked to, or
 * crawled. A tag is a page now, and the strip is a row of links to these.
 */

async function findCategory(slug: string) {
  return (await getCategories()).find((category) => category.slug === slug);
}

export async function generateStaticParams() {
  return (await getCategories()).map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}): Promise<Metadata> {
  const [{ slug }, { page: requested }] = await Promise.all([
    params,
    searchParams,
  ]);
  const category = await findCategory(slug);
  if (!category) return {};
  const page = pageFromParam(
    requested,
    pageCount((await getPostsByCategory(slug)).length),
  );
  return pageMetadata(
    pagedSeo(
      {
        title: category.name,
        description: `Assembly blog posts tagged ${category.name}: product announcements, notes from the team, and guides for professional service firms.`,
        path: tagPath(category.slug),
      },
      page,
    ),
  );
}

export default async function BlogTagPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const [{ slug }, { page: requested }] = await Promise.all([
    params,
    searchParams,
  ]);
  const [category, categories, posts] = await Promise.all([
    findCategory(slug),
    getCategories(),
    getPostsByCategory(slug),
  ]);
  if (!category) notFound();

  const page = pageFromParam(requested, pageCount(posts.length));

  return (
    // The blog's own rail, not the author page's narrower one: this holds the
    // same three-across grid /blog does.
    <div className="mx-auto max-w-[1600px] px-6 pb-20 pt-12 md:px-10 md:pb-24 md:pt-16">
      {/* The author page's breadcrumb, for the same reason: this is a shelf of
          the blog rather than a section of the site, and the title above the
          grid should say which shelf. */}
      <p className="type-caption text-muted-foreground">
        <Link href="/blog" className="transition-colors hover:text-foreground">
          Blog
        </Link>
        <span className="px-2 text-foreground/30">/</span>
        Tag
      </p>

      <h1 className="type-display mt-8 text-foreground">{category.name}</h1>

      <div className="mt-14 md:mt-20">
        <BlogBrowser
          posts={posts.map(toCard)}
          categories={categories}
          activeSlug={category.slug}
          basePath={tagPath(category.slug)}
          page={page}
        />
      </div>
    </div>
  );
}
