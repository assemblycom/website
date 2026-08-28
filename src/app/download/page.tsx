import type { Metadata } from "next";
import Image from "next/image";
import { DownloadPicker } from "@/components/download/download-picker";
import { PAGE_SEO, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(PAGE_SEO.download);

export default function DownloadPage() {
  return (
    <section className="px-6 pb-20 pt-16 text-center md:pb-36 md:pt-32">
      <div className="mx-auto max-w-3xl">
        {/* The macOS app icon, as it looks in the Dock: a dark tile with the
            mark in it, not the bare mark. Built here rather than shipped as a
            file because the repo has no app-icon asset — only the marks. The
            radius is macOS's own ratio (~22.4% of the tile), which is what
            makes it read as an app icon rather than a rounded square. It does
            not follow the site theme: an app icon is the same object on both. */}
        <span
          aria-hidden
          className="relative mx-auto mb-7 flex size-20 items-center justify-center overflow-hidden rounded-[22.4%] bg-[linear-gradient(160deg,#2e2e2e_0%,#0b0b0b_75%)] shadow-[0_6px_18px_-12px_rgba(0,0,0,0.35)] ring-1 ring-inset ring-white/10 [[data-theme=dark]_&]:bg-[linear-gradient(160deg,#3d3d3d_0%,#171717_75%)] [[data-theme=dark]_&]:shadow-none [[data-theme=dark]_&]:ring-white/[0.07]"
        >
          {/* The vector mark, not the 128px PNG: at 68% of a 112px tile the
              raster was being upscaled on a retina screen, which is what read
              as blur. Its paths are filled black, so it inverts to white the
              same way the nav's does. */}
          <Image
            src="/images/logo-mark.svg"
            alt=""
            width={139}
            height={139}
            priority
            className="w-[68%] invert"
          />
          {/* The glass: light gathers along the top edge and falls away by the
              middle, drawn over the mark the way it would be on real glass. No
              hairline along the top — a straight 1px line ends mid-curve on a
              squircle, and the inset ring already carries the edge. */}
          <span className="pointer-events-none absolute inset-0 rounded-[22.4%] bg-[linear-gradient(180deg,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0.06)_28%,transparent_55%)]" />
        </span>

        <h1 className="type-display text-balance">Download Assembly</h1>
        <p className="type-lead mx-auto mt-5 max-w-xl text-pretty text-muted-foreground">
          Messages and notifications, without a browser tab.
        </p>

        <DownloadPicker />
      </div>
    </section>
  );
}
