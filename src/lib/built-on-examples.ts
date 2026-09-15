import { getAppTemplate } from "@/lib/contentful";
import { getBuiltOnExamples, type BuiltOnFirm } from "@/lib/built-on-firms";
import type { Template } from "@/lib/templates";
import { getCatalogueTemplates } from "@/lib/visible-templates";

/**
 * The apps /built-on and /built-by show, resolved on the server.
 *
 * The set and its order are SHOWN in built-on-firms, not the catalogue's rank:
 * reordering these in Contentful changes nothing here. The catalogue is still
 * read for each app's current copy, and its own Contentful entry for the
 * screenshots /templates/[slug] uses.
 *
 * Enriched after the set is chosen rather than across the whole catalogue:
 * only these need their artwork.
 */
export async function resolveBuiltOnExamples(
  firm?: BuiltOnFirm,
): Promise<Template[]> {
  const chosen = getBuiltOnExamples(firm, await getCatalogueTemplates());

  return Promise.all(
    chosen.map(async (template) => {
      const entry = await getAppTemplate(template.slug);
      if (!entry?.images.length) return template;

      const images = entry.images.map((image) => image.url);
      return {
        ...template,
        image: images[0],
        images,
        previewCount: images.length,
      };
    }),
  );
}
