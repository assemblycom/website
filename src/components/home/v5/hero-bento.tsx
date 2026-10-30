"use client";

import Link from "next/link";
import { StudioNav } from "@/components/home/studio-nav";
import { useTheme } from "@/components/theme/theme-provider";
import { APP_URL, DEMO_URL, SIGNUP_URL } from "@/lib/constants";
import { PRIMARY_CTA } from "@/components/home/hero-big";
import { SECONDARY_CTA } from "@/components/home/cta";
import { HeroCredibility } from "@/components/home/v2/hero-credibility";

// ─────────────────────────────────────────────────────────────────────────
// HERO (V5, BENTO) — after x.ai: the G2 rating over a centred headline, the
// lead and the buttons, and a row of cards under them, each with its name and a
// way in at the foot.
// ─────────────────────────────────────────────────────────────────────────

const RAIL = "mx-auto max-w-[1400px] px-6 md:px-10";

// The shared lead (COPY_VARIANTS) trimmed to hold two lines under a centred
// headline, where its full length ran to a third.
const BODY =
  "Let clients onboard, sign, and pay in one branded experience, with a CRM behind it for your team. Start with 30+ apps, then use AI to build what's missing.";

// Name and a way in only; the card's ground carries the rest.
const CARDS = [
  {
    name: "Client portal",
    href: "/client-portal",
  },
  {
    name: "App builder",
    href: "/ai-app-builder",
    dark: true,
  },
  {
    name: "Templates",
    href: "/templates",
  },
];

function Card({
  name,
  href,
  dark = false,
}: {
  name: string;
  href: string;
  dark?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group relative flex h-[300px] flex-col justify-end overflow-hidden rounded-3xl text-left md:h-[360px] ${
        dark
          ? "bg-neutral-950 text-white"
          : "bg-[var(--surface)] text-foreground"
      }`}
    >
      <div className="flex items-center justify-between px-6 pb-5 pt-3">
        <span>{name}</span>
        <span className="flex items-center gap-1.5">
          Explore
          <span className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}

export function HeroBento() {
  const { theme } = useTheme();

  return (
    <>
      <StudioNav
        darkTop={theme === "dark"}
        maxWidthClass="max-w-[1600px]"
        restPaddingClass="px-6 md:px-10"
      />

      <section className="relative -mt-14 pb-20 pt-32 text-center md:-mt-16 md:pb-32 md:pt-40">
        <div className="px-6 md:px-10">
          <HeroCredibility />

          <h1 className="type-display-xl mx-auto mt-3 text-balance text-foreground">
            <span className="block">Deliver remarkable</span>
            <span className="block">client experiences.</span>
          </h1>
          <p className="type-lead mx-auto mt-6 max-w-[40rem] text-pretty text-muted-foreground">
            {BODY}
          </p>
          <div className="mx-auto mt-10 flex w-full max-w-sm flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:items-center sm:justify-center">
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

        <div className={`${RAIL} mt-16 grid gap-4 md:mt-24 md:grid-cols-3`}>
          {CARDS.map((card) => (
            <Card key={card.name} {...card} />
          ))}
        </div>
      </section>
    </>
  );
}
