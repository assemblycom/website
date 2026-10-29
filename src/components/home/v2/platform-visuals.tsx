"use client";

import Image from "next/image";
import {
  ProductionGap,
  type RegionId,
} from "@/components/home/production-gap";

// ─────────────────────────────────────────────────────────────────────────
// UNIFIED PLATFORM (V2) — a photograph per tab, filling the panel.
//
// The hand-built mocks that used to live here were removed. These are the
// site's own lifestyle photography from `public/images/mocks`, the set the
// product pages already use — people at work rather than pictures of the
// product, which is what the panel was asked for.
//
// THEY FILL THE PANEL, edge to edge (`flushVisual`), so the photograph IS the
// background and no blue shows. The blue is still painted underneath, so it
// covers the moment between the panel laying out and the image decoding.
//
// A STAND-IN, chosen for what each one is OF rather than art-directed for this
// section: the CRM shot for the foundation tab, two people working for the
// ready-made apps, hands at a laptop for the builder, and the sign-in field
// for security. No photograph is used twice on the page.
// ─────────────────────────────────────────────────────────────────────────

/** One photograph per tab, keyed by the region ids in production-gap.tsx. */
const SHOTS: Record<RegionId, { src: string; alt: string }> = {
  url: {
    src: "/images/mocks/crm-bg.webp",
    alt: "Someone working at a laptop in a sunlit booth",
  },
  sidebar: {
    src: "/images/mocks/support-desk.webp",
    alt: "Two people working together at a desk",
  },
  builder: {
    src: "/images/mocks/hosted-mvp-bg.jpg",
    alt: "Someone working at a laptop, mid-gesture",
  },
  avatar: {
    src: "/images/mocks/sign-in-bg.jpg",
    alt: "Hands drawing on a canvas in afternoon light",
  },
};

function Shot({ active }: { active: RegionId }) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      {Object.entries(SHOTS).map(([id, shot]) => (
        <Image
          key={id}
          src={shot.src}
          alt={id === active ? shot.alt : ""}
          aria-hidden={id !== active}
          fill
          // `cover`, centred. These are photographs with their subject in the
          // middle of the frame — the top-left anchor the UI screenshots
          // wanted would crop the person out of two of the four.
          className={`object-cover object-center transition-opacity duration-500 ease-out motion-reduce:transition-none ${
            id === active ? "opacity-100" : "opacity-0"
          }`}
          sizes="(max-width: 768px) 100vw, 60vw"
          priority={false}
        />
      ))}
    </div>
  );
}

export function UnifiedPlatform() {
  return (
    <ProductionGap
      bleedBottom
      framed
      flushVisual
      renderVisual={(active) => <Shot active={active} />}
    />
  );
}
