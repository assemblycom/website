import type { Metadata } from "next";
import { GridDivider, GridRails } from "@/components/ui/grid-lines";
import {
  BrandAsset,
  type BrandAssetProps,
} from "@/components/brand/brand-asset";
import {
  BrandColorCard,
  type BrandColor,
} from "@/components/brand/brand-color";
import { PAGE_SEO, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(PAGE_SEO.brand);

const ASSETS_ZIP = "/images/brand/Assembly_Brand_Assets.zip";

const ASSETS: BrandAssetProps[] = [
  {
    title: "Wordmark",
    description:
      "The primary way we represent Assembly.\nUse the light or dark version to suit the background, and give it clear space.",
    files: [
      {
        ground: "light",
        src: "/images/brand/assembly-logo-light.png",
        width: 624,
        height: 128,
        displayWidth: 200,
      },
      {
        ground: "dark",
        src: "/images/brand/assembly-logo-dark.png",
        width: 624,
        height: 128,
        displayWidth: 200,
      },
    ],
  },
  {
    title: "Logo",
    description:
      "The Assembly logo can be used on its own when the wordmark isn’t practical, such as in avatars, icons, and other compact spaces.",
    files: [
      {
        ground: "light",
        src: "/images/brand/assembly-logo-small-light.png",
        width: 128,
        height: 128,
        displayWidth: 64,
      },
      {
        ground: "dark",
        src: "/images/brand/assembly-logo-small-dark.png",
        width: 128,
        height: 128,
        displayWidth: 64,
      },
    ],
  },
];

// The palette the site actually renders: Zest and Haze carry every accent
// moment (hero composer ring, aurora, data marks), so they are the pair
// documented here rather than the blue the main site was built on.
const COLORS: BrandColor[] = [
  {
    name: "Off-black",
    rgb: "RGB 16, 16, 16",
    hex: "#101010",
    ink: "#ffffff",
    outlinedOnDark: true,
  },
  {
    name: "Zest",
    rgb: "RGB 217, 237, 146",
    hex: "#D9ED92",
    ink: "#262626",
    outlined: true,
  },
  {
    name: "Haze",
    rgb: "RGB 125, 164, 255",
    hex: "#7DA4FF",
    ink: "#101010",
  },
];

export default function BrandPage() {
  return (
    <>
      {/* Hero — the centered lede the Templates and Security pages use. */}
      <section className="px-6 pb-16 pt-24 text-center md:pb-24 md:pt-32">
        <div className="mx-auto max-w-3xl">
          <h1 className="type-display text-balance">Brand guidelines</h1>
          <p className="type-lead mx-auto mt-6 max-w-2xl text-pretty text-muted-foreground">
            Assets and guidance for using the Assembly brand.
          </p>
          <div className="mt-8">
            <a
              href={ASSETS_ZIP}
              download
              className="inline-block rounded-lg bg-foreground px-5 py-2.5 text-sm text-background transition-opacity hover:opacity-90"
            >
              Download brand assets
            </a>
          </div>
        </div>
      </section>

      <div className="relative">
        <GridRails />
        <div className="border-t border-border [[data-theme=dark]_&]:border-[#383838]" />

        {/* Logo assets — one row per mark, each with its light and dark file. */}
        <section className="mx-auto max-w-[1200px] px-6 pb-20 pt-16 md:px-10 md:pb-28 md:pt-24">
          <div className="space-y-16 md:space-y-24">
            {ASSETS.map((asset) => (
              <BrandAsset key={asset.title} {...asset} />
            ))}
          </div>
        </section>

        <GridDivider />

        <section className="mx-auto max-w-[1200px] px-6 pb-20 pt-16 md:px-10 md:pb-28 md:pt-24">
          <div className="grid gap-10 md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] md:gap-16">
            <div className="md:self-start">
              <h2 className="type-h3">Colors</h2>
              <p className="type-body mt-4 text-muted-foreground">
                Off-black is the foundation of our palette. Zest and Haze add
                color and emphasis as accents, not as large backgrounds.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {COLORS.map((color) => (
                <BrandColorCard key={color.hex} color={color} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
