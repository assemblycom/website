import type { Metadata } from "next";
import { HomeContent } from "@/components/home/home-content";
import { HomeVersion } from "@/components/home/home-version";
import { armFromQuery, parseArm } from "@/lib/hero-variants";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/**
 * `/` as it renders when middleware does not enrol the visitor: logged in,
 * the test switched off, or a preview deployment. They get today's homepage.
 *
 * On a preview, `?v=1|2|3` (or `?copy=&layout=`) shows a test version for
 * review, since middleware only runs the test in production.
 */
export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = new URLSearchParams(
    Object.entries(await searchParams).filter(
      (entry): entry is [string, string] => typeof entry[1] === "string",
    ),
  );
  const parsed = parseArm(armFromQuery(params));
  if (parsed) return <HomeVersion layout={parsed.layout} />;
  return <HomeContent />;
}
