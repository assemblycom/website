"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { StudioNav } from "@/components/home/studio-nav";
import { useTheme } from "@/components/theme/theme-provider";
import { APP_URL, DEMO_URL, SIGNUP_URL } from "@/lib/constants";
import { COPY_VARIANTS, FALLBACK_COPY } from "@/lib/hero-variants";
import { PRIMARY_CTA } from "@/components/home/hero-big";
import { SECONDARY_CTA } from "@/components/home/cta";
import { STATS } from "@/components/home/trust-ticker";

// ─────────────────────────────────────────────────────────────────────────
// HERO (V3, PHOTO) — V2's message on a full-bleed photograph, after the
// biograph.com reference: the claim set low on the left, the figures across
// the foot on the right, and the picture doing the work the tile did.
//
// The copy, buttons and figures are the ones the site already ships —
// COPY_VARIANTS, PRIMARY_CTA/SECONDARY_CTA and the trust ticker's STATS — so
// V2 and V3 differ in arrangement only.
//
// THE HERO IS A DARK ISLAND (`data-theme="dark"`) whatever the site theme, so
// the shared buttons and tokens resolve to their dark forms over the photo
// instead of this file restating them in white.
//
// ZOOM OUT ON SCROLL (md up), after analogueagency.com: the photo starts
// full-bleed and, over the first SHRINK_VH of scroll, pulls in to a rounded
// card with page ground around it while the picture inside eases back. The
// hero is pinned (sticky) until the move finishes, so the page does not run
// away underneath it. One CSS variable, --p (0 → 1), drives every property;
// the scroll handler only writes that number. Phones and reduced-motion keep
// the plain full-bleed hero.
// ─────────────────────────────────────────────────────────────────────────

// The product pages' hero rail, as in V2.
const RAIL = "mx-auto max-w-[1400px] px-6 md:px-10";

/** PLACEHOLDER — the site's own photography, standing in for a real shot. */
const PHOTO = {
  src: "/images/mocks/describe-laptop.webp",
  alt: "Someone working at a laptop in warm afternoon light",
};

// Three figures, as the reference has: clients managed is the one dropped,
// since businesses, apps and payments each speak to a different part of the
// product and clients overlaps with businesses.
const HERO_STATS = STATS.filter((s) => s.label !== "Clients managed");

/** Scroll, as a fraction of the viewport height, over which the photo shrinks. */
const SHRINK_VH = 0.6;

// The pinned runway, in viewport heights — keep in step with md:h-[170svh].
const RUNWAY_VH = 1.7;

// The card's final margins: top clears the nav strip, the sides and foot
// match the hero rail's own md gutter.
const FRAME =
  "md:[inset:calc(var(--p)*72px)_calc(var(--p)*40px)_calc(var(--p)*40px)] md:[border-radius:calc(var(--p)*24px)]";

export function HeroPhoto() {
  const { theme } = useTheme();
  const message = COPY_VARIANTS[FALLBACK_COPY];
  const lines = message.big?.lines ?? [message.h1];
  const wrapRef = useRef<HTMLDivElement>(null);
  // Where the hero's pin ends, handed to the nav: clear on the first frame,
  // frosted glass while the card shrinks under it (half photo, half page, so
  // white type alone would vanish), solid once the page scrolls. Unset on
  // phones and with reduced motion, where the hero is not pinned.
  const [glassUntil, setGlassUntil] = useState<number>();

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const md = window.matchMedia("(min-width: 768px)");
    const measure = () => {
      const vh = window.innerHeight;
      setGlassUntil(md.matches ? (RUNWAY_VH - 1) * vh : undefined);
    };
    measure();
    let frame = 0;
    const update = () => {
      frame = 0;
      const p = Math.min(
        1,
        Math.max(0, window.scrollY / (window.innerHeight * SHRINK_VH)),
      );
      wrap.style.setProperty("--p", p.toFixed(4));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      onScroll();
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <>
      <StudioNav
        darkTop={theme === "dark"}
        lightAtRest
        glassUntil={glassUntil}
        maxWidthClass="max-w-[1600px]"
        restPaddingClass="px-6 md:px-10"
      />

      {/* The runway: taller than the screen from md so the pinned hero has
          SHRINK_VH of scroll to shrink over, plus a short hold at the end. */}
      <div
        ref={wrapRef}
        style={{ "--p": 0 } as CSSProperties}
        className="relative -mt-14 md:-mt-16 md:h-[170svh]"
      >
        <div className="md:sticky md:top-0 md:h-[100svh] md:min-h-[640px]">
          <section
            data-theme="dark"
            className={`relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-neutral-950 pt-28 md:absolute md:min-h-0 md:pt-0 ${FRAME}`}
          >
            <Image
              src={PHOTO.src}
              alt={PHOTO.alt}
              fill
              priority
              sizes="100vw"
              // The subject sits right of centre, which leaves the lower left
              // clear for the claim.
              className="object-cover object-[70%_40%] md:[transform:scale(calc(1.12-var(--p)*0.12))]"
            />
            {/* Darkened top for the nav and heavily at the foot for the type; the
            photo stays readable in the middle band where nothing sits on it. */}
            <div
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.2)_22%,rgba(0,0,0,0.25)_50%,rgba(0,0,0,0.85)_100%)]"
            />

            <div className={`relative w-full ${RAIL} pb-12 md:pb-16`}>
              {/* Wide enough to hold the two-line lockup at display-xl's top
              size; the figures sit on the buttons' row below, as in the
              reference, rather than beside the headline where they squeeze
              each line into two. */}
              <h1 className="type-display-xl max-w-[60rem] text-balance text-foreground">
                {lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h1>
              <p className="type-lead mt-5 max-w-[34rem] text-pretty text-white/70">
                {message.body}
              </p>

              <div className="mt-8 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
                <div className="flex w-full max-w-sm flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:items-center">
                  <a href={SIGNUP_URL} className={`unauth-only ${PRIMARY_CTA}`}>
                    Get started
                  </a>
                  <a href={APP_URL} className={`auth-only ${PRIMARY_CTA}`}>
                    Open Assembly
                  </a>
                  <Link href={DEMO_URL} className={SECONDARY_CTA}>
                    Book a demo
                  </Link>
                </div>

                {/* The figures, value over label, divided by hairlines as in the
                reference. One row at every width; on a phone the labels may
                wrap rather than the row breaking. */}
                <dl className="grid shrink-0 grid-cols-3">
                  {HERO_STATS.map((stat) => (
                    <div
                      key={stat.label}
                      className="flex flex-col-reverse gap-1 border-l border-white/15 px-3 text-center first:border-l-0 first:pl-0 last:pr-0 sm:px-5"
                    >
                      <dt className="text-sm text-white/60 sm:whitespace-nowrap">
                        {stat.label}
                      </dt>
                      <dd className="text-base text-white">
                        {stat.format(stat.to)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
