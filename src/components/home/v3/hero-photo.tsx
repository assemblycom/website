"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { StudioNav } from "@/components/home/studio-nav";
import { useTheme } from "@/components/theme/theme-provider";
import { APP_URL, DEMO_URL, SIGNUP_URL } from "@/lib/constants";
import { COPY_VARIANTS, FALLBACK_COPY } from "@/lib/hero-variants";
import { PRIMARY_CTA } from "@/components/home/hero-big";
import { SECONDARY_CTA } from "@/components/home/cta";
import { STATS } from "@/components/home/trust-ticker";
import { PROTO_HERO_BODY } from "@/components/proto/hero-copy";

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
// IT STILL ZOOMS OUT, BUT IT NEVER HOLDS THE PAGE. The photograph starts
// full-bleed and pulls in to a rounded card as you scroll, after
// analogueagency.com — one CSS variable, --p (0 to 1), drives every property
// and the scroll handler only writes that number.
//
// What has gone is the PIN. The first pass parked the hero in a 170svh
// sticky runway so the move could play out while the page stood still, and
// that is the part that was wrong: taking the scroll over means the first
// thing a visitor does on the page does not do what they asked it to, and
// they pay for the effect with the better part of a screen of scrolling
// before any of the product appears. Unpinned, the same animation plays
// while the hero leaves — the page never stops, and the section below it
// arrives on schedule.
//
// IT RUNS ON PHONES TOO. It used to be an md-and-up effect — the inset and
// the radius were written at `md:` only, so a phone got a static full-bleed
// picture and the one version of the homepage whose whole idea is a move had
// nothing to show on the device most visitors arrive on. The phone's card
// closes on smaller margins (the hero rail's own px-6 at the sides, and
// enough at the top to clear the shorter nav), because 40px of gutter on a
// 390px screen is a tenth of the width on each side.
//
// Reduced-motion still keeps the plain full-bleed hero: the handler returns
// before it writes --p, so the card stays at p=0, which IS the full-bleed
// state.
//
// IT TAKES THE WHOLE FIRST SCREEN. It was capped at 820px so a tall display
// would not leave a band of empty picture between the nav and the type, and
// that cap put the logo reel below it in view on an ordinary laptop — the
// page opened on two things at once and the hero never had a moment of its
// own. The screen is the hero's; the reel is what you find when you scroll.
//
// The cost is the thing the cap was for: on a very tall display there is
// more photograph above the lockup than the composition wants. The
// photograph is the one element here that can carry that space.
//
// EXCEPT ON A WIDE DISPLAY, WHERE IT IS A CARD AT REST. From `wide` the hero
// stops being full-bleed at all: it sits inside the site's 1400px rail with
// the nav above it on the page's own ground, which is the width the rest of
// the page is set to and the width the photograph can actually fill. The
// scroll move has nothing left to do there, so it does not run — the card is
// already at the size it would have pulled in to.
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

/**
 * The phone's labels for those figures.
 *
 * The row is sized to its own content on a phone, so each column is only as
 * wide as the figure above it — about 90px — and every label that is two
 * words broke across two lines, leaving the row on a ragged baseline. The
 * noun on its own is the part that does the work, and `whitespace-nowrap`
 * is what guarantees it: a label that cannot wrap cannot stagger the row.
 * The full labels return from sm, where there is room for them.
 */
const SHORT_LABELS: Record<string, string> = {
  "Businesses powered": "Businesses",
  "Apps created": "Apps",
  "Payments processed": "Payments",
};

/**
 * Scroll, as a fraction of the viewport height, over which the photo shrinks.
 *
 * Shorter than the pinned version's 0.6: with no runway holding the hero in
 * place, the move has only the hero's own exit to play out in, so it has to
 * be most of the way done by the time the card leaves the top of the screen.
 */
const SHRINK_VH = 0.45;

/**
 * The card's final margins: the top clears the nav strip, the sides and foot
 * take the hero rail's own md gutter. Written against --p so one number
 * drives the inset and the radius together.
 */
const FRAME =
  "[inset:calc(var(--p)*56px)_calc(var(--p)*24px)_calc(var(--p)*24px)] [border-radius:calc(var(--p)*20px)] md:[inset:calc(var(--p)*72px)_calc(var(--p)*40px)_calc(var(--p)*40px)] md:[border-radius:calc(var(--p)*24px)] wide:[inset:96px_max(40px,calc((100%_-_1400px)*0.5))_40px] wide:[border-radius:24px]";

/**
 * The width at which the hero stops being full-bleed and becomes a card.
 *
 * A wide display was the one place the full-bleed photograph worked against
 * itself: the picture is 1333px wide, so past that it is stretched, and the
 * extra width lands on the two sides of the frame where nothing sits — a
 * metre of wall on the left and a plant on the right, with the lockup and the
 * figures marooned in the middle. Held to the site's own 1400px rail it is a
 * rectangle on the page like every other block, cropped to the part of the
 * shot that has the subject in it. Below this width the hero is unchanged,
 * full-bleed at rest and pulling in as you scroll.
 *
 * `wide` (90rem) and not a `min-[1440px]:` variant: Tailwind sorts arbitrary
 * breakpoints ahead of the named ones, so `md:`'s own inset came after this
 * one and won at every width above it — the card silently did nothing.
 */
const CARD_FROM = "(min-width: 90rem)"; // `wide`, the site's own breakpoint

export function HeroPhoto() {
  const { theme } = useTheme();
  const message = COPY_VARIANTS[FALLBACK_COPY];
  const lines = message.big?.lines ?? [message.h1];
  const wrapRef = useRef<HTMLDivElement>(null);
  // The nav is light-on-photo while the hero is full-bleed, and the card
  // leaves it sitting on the page's own background instead, where white type
  // would be invisible. False first so the server and the first client paint
  // agree; the layout effect corrects it before anything is drawn.
  const [carded, setCarded] = useState(false);

  useLayoutEffect(() => {
    const mq = window.matchMedia(CARD_FROM);
    const sync = () => setCarded(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
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
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <>
      <StudioNav
        darkTop={theme === "dark"}
        lightAtRest={!carded}
        maxWidthClass="max-w-[1600px]"
        restPaddingClass="px-6 md:px-10"
      />

      {/* The box the card shrinks INSIDE. It keeps the hero's full height, so
          the page below never moves as the photograph pulls in — only the
          card's own edges do. */}
      <div
        ref={wrapRef}
        style={{ "--p": 0 } as CSSProperties}
        // min-h-[780px] is the phone's floor, not a design number: the card
        // is absolute now, so it cannot grow with its own copy the way the
        // in-flow section did, and on a 667px-tall phone the headline, lead,
        // pair and figures come to more than the screen — the figures were
        // cropped by the card's own foot. The hero runs a little past the
        // fold there instead, which is what it did before.
        // A CEILING FROM `wide`. A full screen is the right size for the hero
        // on a laptop; on a large display it is 1200px of photograph with the
        // lockup in the bottom fifth of it and the figures a long way off to
        // the side — the copy stops holding its own against the frame, and
        // the page below never hints at itself. Capped, the photograph is a
        // deep band rather than a whole screen, the lockup sits nearer its
        // middle, and what follows comes into view. It is a max, so a short
        // wide window still takes 100svh and nothing is cropped.
        className="relative -mt-14 h-[100svh] min-h-[780px] md:-mt-16 md:min-h-[600px] wide:max-h-[820px]"
      >
        <section
          data-theme="dark"
          // Absolute inside the wrapper at every width, so the card can pull
          // its own edges in without the page below it moving. It was in flow
          // below md, which is what kept the phone's hero static: an element
          // in flow has no inset to animate.
          className={`absolute flex flex-col justify-end overflow-hidden bg-neutral-950 ${FRAME}`}
        >
          <Image
            src={PHOTO.src}
            alt={PHOTO.alt}
            fill
            priority
            sizes="100vw"
            // The subject sits right of centre, which leaves the lower left
            // clear for the claim.
            className="object-cover object-[70%_40%]"
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
            {/* A STEP DOWN FROM THE SHARED DISPLAY SIZE. `type-display-xl`
              runs to 84px, which is right on V1 where the lockup is the
              whole composition and has a screen to itself. Here it shares a
              card with a lead, a pair of buttons and three figures, and at
              84px against a 16px lead it was five times the size of
              everything under it — the headline read as the only thing in
              the hero. The same clamp with a 64px ceiling keeps the curve
              the rest of the site is set on and only lowers where it stops,
              so nothing changes below about 1290px. */}
            {/* WHITE, NOT `text-foreground`. The dark theme's foreground is
              #d9d9d9 — an off-white picked for reading long text on a dark
              UI ground, where pure white glares. Over a photograph it is not
              type on a surface, it is type on a picture, and the same grey
              reads as washed out rather than as soft. The lead under it is
              already white at 70%; this is the same ink at full strength. */}
            <h1 className="type-display-xl max-w-[60rem] text-balance text-white [font-size:clamp(2.5rem,calc(1.36rem_+_4.86vw),4rem)]">
              {lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>
            <p className="type-lead mt-5 max-w-[34rem] text-pretty text-white/70">
              {PROTO_HERO_BODY}
            </p>

            <div className="mt-8 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
              {/* THE PAIR IS THE SITE'S OWN MOBILE PAIR. PRIMARY_CTA and
                  SECONDARY_CTA carry `w-full sm:w-auto` themselves — full
                  width stacked on a phone, sized to their labels from sm —
                  and every other hero on the site closes that way. This row
                  briefly overrode it to sit the buttons on the copy's left
                  line, which made this the one hero whose buttons were a
                  different shape from the rest of the site's. The override is
                  gone: the row stacks and goes inline at `sm`, which is the
                  breakpoint the controls are written for. */}
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
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
              {/* SIZED TO ITSELF AND RANGED LEFT until the row splits at lg.
                  Stacked under the buttons the figures were a flex child at
                  full width, so three equal columns spread across the whole
                  measure and the row sat under a left-ranged pair with its
                  own thirds landing nowhere near them. `self-start` shrinks
                  it to its content, which puts the first figure on the
                  copy's left line. */}
              {/* ACROSS THE MEASURE ON A PHONE, ranged left once the hero is
                  wide enough to range anything. Sized to its own content the
                  row came to about half the screen and sat in the middle of
                  it, under two buttons that each span the whole measure — a
                  third object with a third width, where the hero only has
                  two. At full width the three figures are equal thirds that
                  end on the same lines the buttons do, so the foot of the
                  hero is one block. It takes the copy's left line back at sm,
                  where the buttons shrink to their labels and that line
                  exists again. */}
              <dl className="grid w-full shrink-0 grid-cols-3 sm:w-auto sm:self-start lg:self-auto">
                {HERO_STATS.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex flex-col-reverse gap-1 border-l border-white/15 px-3 text-center first:border-l-0 first:pl-0 last:pr-0 sm:px-5"
                  >
                    <dt className="whitespace-nowrap text-sm text-white/60">
                      <span className="sm:hidden">
                        {SHORT_LABELS[stat.label] ?? stat.label}
                      </span>
                      <span className="hidden sm:inline">{stat.label}</span>
                    </dt>
                    <dd className="type-h4 text-white">
                      {stat.format(stat.to)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
