"use client";

import Image from "next/image";
import Link from "next/link";
import { StudioNav } from "@/components/home/studio-nav";
import { IconArrowUp } from "@/components/home/build-step-visual";
import { useTheme } from "@/components/theme/theme-provider";
import { APP_URL, DEMO_URL, SIGNUP_URL } from "@/lib/constants";
import { COPY_VARIANTS, FALLBACK_COPY } from "@/lib/hero-variants";
import { PRIMARY_CTA } from "@/components/home/hero-big";
import { SECONDARY_CTA } from "@/components/home/cta";

// ─────────────────────────────────────────────────────────────────────────
// HERO (V4, CANVAS) — after flim.ai: the headline large on the left, the lead
// and its buttons in a narrow column on the right, and under them a gridded
// canvas of photographs at mixed sizes, some running off its edges, with the
// prompt box across the middle where the reference puts its search.
//
// The photographs are the site's own (public/images/mocks). The prompt box is
// a way into sign-up rather than a working input, set with the starter
// prompt the product's own Add App screen shows.
// ─────────────────────────────────────────────────────────────────────────

const RAIL = "mx-auto max-w-[1600px] px-6 md:px-10";

// Placed by hand, as the reference is: sizes vary, the outer ones crop on the
// canvas's top and sides, the two at the foot hang below it, and none sits
// where the prompt box runs.
const SHOTS = [
  {
    src: "/images/mocks/support-desk.webp",
    cls: "left-[2%] top-[18%] w-[15%] aspect-[3/2]",
  },
  {
    src: "/images/mocks/hosted-mvp-bg.jpg",
    cls: "left-[22%] -top-[2%] w-[10%] aspect-[9/8]",
  },
  {
    src: "/images/mocks/describe-phone.webp",
    cls: "left-[34%] top-[30%] w-[7%] aspect-[3/2]",
  },
  {
    src: "/images/mocks/describe-laptop.webp",
    cls: "left-[47%] -top-[2%] w-[19%] aspect-[5/4]",
  },
  {
    src: "/images/mocks/sign-in-bg.jpg",
    cls: "left-[72%] top-[28%] w-[7%] aspect-[5/3]",
  },
  {
    src: "/images/mocks/crm-bg.webp",
    cls: "-right-[1%] top-[18%] w-[17%] aspect-[4/5]",
  },
  {
    src: "/images/mocks/public-store-bg.jpg",
    cls: "left-[7%] top-[84%] w-[20%] aspect-[3/2]",
  },
  {
    src: "/images/mocks/describe-sneakers.webp",
    cls: "left-[71%] top-[86%] w-[12%] aspect-[1/1]",
  },
];

// The canvas's ruled ground: hairlines every 44px both ways.
const GRID =
  "linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px)";

export function HeroCanvas() {
  const { theme } = useTheme();
  const message = COPY_VARIANTS[FALLBACK_COPY];
  const lines = message.big?.lines ?? [message.h1];

  return (
    <>
      <StudioNav
        darkTop={theme === "dark"}
        maxWidthClass="max-w-[1600px]"
        restPaddingClass="px-6 md:px-10"
      />

      <section className="relative -mt-14 mb-20 md:-mt-16 md:mb-48">
        <div
          className={`${RAIL} grid gap-10 pb-14 pt-28 md:pb-20 md:pt-36 lg:grid-cols-[1fr_auto] lg:items-start`}
        >
          {/* The headline on the left at the site's display size, where the
              reference sets its name; the lead and buttons in the right
              column. */}
          <h1 className="type-display-xl max-w-[44rem] text-balance text-foreground">
            {lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <div className="lg:max-w-[26rem] lg:pt-3">
            <p className="type-lead text-pretty text-muted-foreground">
              {message.body}
            </p>
            <div className="mt-8 flex w-full max-w-sm flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:items-center">
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
          </div>
        </div>

        <div
          className="relative h-[520px] bg-[var(--surface)] [clip-path:inset(0_0_-240px_0)] md:h-[720px]"
          style={{ backgroundImage: GRID, backgroundSize: "44px 44px" }}
        >
          {SHOTS.map((shot) => (
            <div
              key={shot.src}
              className={`absolute overflow-hidden rounded-2xl max-md:hidden ${shot.cls}`}
            >
              <Image
                src={shot.src}
                alt=""
                fill
                sizes="20vw"
                className="object-cover"
              />
            </div>
          ))}
          {/* Phones keep three, larger, so the canvas is not a scatter of
              thumbnails. */}
          <div className="absolute left-[-6%] top-[6%] aspect-[3/2] w-[48%] overflow-hidden rounded-2xl md:hidden">
            <Image
              src="/images/mocks/support-desk.webp"
              alt=""
              fill
              sizes="50vw"
              className="object-cover"
            />
          </div>
          <div className="absolute right-[-8%] top-[14%] aspect-[4/5] w-[40%] overflow-hidden rounded-2xl md:hidden">
            <Image
              src="/images/mocks/crm-bg.webp"
              alt=""
              fill
              sizes="40vw"
              className="object-cover"
            />
          </div>
          <div className="absolute bottom-[-4%] left-[18%] aspect-[3/2] w-[52%] overflow-hidden rounded-2xl md:hidden">
            <Image
              src="/images/mocks/describe-laptop.webp"
              alt=""
              fill
              sizes="50vw"
              className="object-cover"
            />
          </div>

          {/* The prompt box, where the reference has its search. */}
          <Link
            href={SIGNUP_URL}
            className="absolute left-1/2 top-[58%] flex w-[min(92%,760px)] -translate-x-1/2 -translate-y-1/2 items-center gap-3 rounded-full bg-[color-mix(in_srgb,var(--foreground)_8%,var(--background))] p-2 pl-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] backdrop-blur-md transition-colors hover:bg-[color-mix(in_srgb,var(--foreground)_11%,var(--background))]"
          >
            <span className="min-w-0 flex-1 truncate text-muted-foreground">
              Build an onboarding wizard for my clients
            </span>
            <span className="flex shrink-0 items-center gap-2 rounded-full bg-background px-5 py-3 text-sm text-foreground">
              Start building
              <IconArrowUp className="size-3.5" />
            </span>
          </Link>
        </div>
      </section>
    </>
  );
}
