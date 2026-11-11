"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FOOTER_COLUMNS,
  X_URL,
  type FooterGroup,
  type NavLink,
} from "@/lib/constants";
import { GRID_LINE } from "@/components/ui/grid-lines";
import { AmbientBackground } from "@/components/layout/ambient-background";
import type { ThemePreference } from "@/components/theme/theme-provider";

// V71's brand aurora (from hero-iterations) — green + blue on a near-black
// base, rising into blue → mint → lime and fading to transparent. Lives at the
// bottom of the reveal footer itself (one sheet, not a separate layer).
export const BRAND_AURORA = [
  { offset: 0, color: "#0a0e1c" },
  { offset: 0.16, color: "#243c9e" },
  { offset: 0.33, color: "#4f6bf9" },
  { offset: 0.48, color: "#8ea2f4" },
  { offset: 0.62, color: "#9fd6c4" },
  { offset: 0.76, color: "#c6e84f" },
  { offset: 0.88, color: "#d9ed92" },
  { offset: 1, color: "#d9ed9200" },
];

// The bars peak at 80% of their box, not near its top: the blur spreads about
// 15% above a bar, and a box with less headroom than that clipped the crest
// flat. The boxes are taller and pulled up by the same amount, so the crest
// lands where it did and the footer keeps its height.
//
// Always-visible brand aurora at the bottom of the footer — a mobile band (fills
// more of its container) and a desktop band, each rising on mount. Exported so
// the proposal page can end in the same aurora without inheriting the footer's
// link columns (that page carries no navigation).
export function FooterAurora() {
  // Brand ambient background, drawn live so it sits on the theme's own ground.
  // The band's height follows the page width (the drawing's own 18:7 shape),
  // so resizing scales the bars smoothly instead of re-cropping them; phones
  // get a floor and very wide screens a cap. On desktop it is pulled up under
  // the links by a share of its own height. Below lg the link shelves stack
  // into narrow columns, and bars crossing them looked messy, so there it
  // starts just under the theme switch and has the bottom of the footer to
  // itself.
  const fade = "linear-gradient(to bottom, transparent 0%, #000 var(--ambient-fade))";
  return (
    <div
      aria-hidden
      className="pointer-events-none relative h-[var(--ambient-h)] [--ambient-h:clamp(30rem,38.9vw,44rem)] mt-[calc(var(--ambient-h)*-0.22)] [--ambient-fade:30%] lg:mt-[calc(var(--ambient-h)*-0.35)] lg:[--ambient-fade:22%]"
      style={{ maskImage: fade, WebkitMaskImage: fade }}
    >
      <AmbientBackground />
    </div>
  );
}

// The footer's link set: the nav's own shelves (Product, Resources, Legal, from
// FOOTER_GROUPS) plus the socials. Kept in constants.ts so the nav and the
// footer cannot drift apart the way the old hand-maintained pair did.

// Social links point off-site, so they keep opening in a new tab (newTab).
const CONNECT: NavLink[] = [
  { label: "YouTube", href: "https://www.youtube.com/@assembly", external: true, newTab: true },
  { label: "X", href: X_URL, external: true, newTab: true },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/assemblycom",
    external: true,
    newTab: true,
  },
  { label: "Instagram", href: "https://instagram.com/assembly", external: true, newTab: true },
];

// Linked from every page so these posts get site-wide internal links for SEO.
// Kept to three so the column stays about as tall as its neighbours.
const FEATURED_POSTS: NavLink[] = [
  { label: "Best AI app builders", href: "/blog/best-ai-app-builder" },
  { label: "Custom dashboard software", href: "/blog/custom-dashboard-software" },
  { label: "Base44 alternatives", href: "/blog/base44-alternatives" },
];

// The socials and featured posts share the last column. They live here rather
// than in constants because nothing but the footer shows them.
const COLUMNS: FooterGroup[][] = [
  ...FOOTER_COLUMNS,
  [
    { label: "Connect", links: CONNECT },
    { label: "Featured blog posts", links: FEATURED_POSTS },
  ],
];

function FooterLink({
  link,
  className,
}: {
  link: NavLink;
  className: string;
}) {
  return link.external ? (
    <a
      href={link.href}
      target={link.newTab ? "_blank" : undefined}
      rel={link.newTab ? "noopener noreferrer" : undefined}
      className={className}
    >
      {link.label}
    </a>
  ) : (
    <Link href={link.href} className={className}>
      {link.label}
    </Link>
  );
}

// Theme control (moved out of the nav into the footer). A three-way segmented
// switch — system / light / dark, like Cursor — reflecting the stored
// preference rather than just the resolved theme.
type ThemeToggle = {
  preference: ThemePreference;
  onSelect: (preference: ThemePreference) => void;
};

const THEME_OPTIONS: {
  value: ThemePreference;
  label: string;
  icon: ReactNode;
}[] = [
  {
    value: "system",
    label: "System theme",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
  {
    value: "light",
    label: "Light theme",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </svg>
    ),
  },
  {
    value: "dark",
    label: "Dark theme",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    ),
  },
];

function ThemeSwitch({
  toggle,
  onDark,
  frosted = false,
}: {
  toggle: ThemeToggle;
  onDark: boolean;
  // Frosted surface for when the switch sits over the footer aurora — a
  // translucent, blurred chip so it stays legible on the gradient.
  frosted?: boolean;
}) {
  // A pill on a flat tinted bed, with one thumb that slides to the selected
  // option rather than each segment filling in on its own. No border or
  // shadow: the tint alone separates it from the ground. The thumb's travel is
  // the segment width, so the two must change together.
  const activeIndex = Math.max(
    0,
    THEME_OPTIONS.findIndex((opt) => opt.value === toggle.preference),
  );
  const seg = (active: boolean) =>
    `relative flex h-[26px] w-9 items-center justify-center rounded-full transition-colors ${
      active
        ? onDark
          ? "text-white"
          : "text-foreground"
        : onDark
          ? "text-white/55 hover:text-white"
          : "text-foreground/55 hover:text-foreground"
    }`;
  return (
    <div
      role="group"
      aria-label="Appearance"
      className={`relative inline-flex items-center rounded-full p-0.5 ${
        onDark ? "bg-white/10" : "bg-foreground/[0.06]"
      } ${frosted ? "backdrop-blur-md" : ""}`}
    >
      <span
        aria-hidden
        className={`absolute left-0.5 top-0.5 h-[26px] w-9 rounded-full transition-transform duration-150 ease-[cubic-bezier(0.25,1,0.5,1)] ${
          onDark ? "bg-white/15" : "bg-foreground/[0.08]"
        }`}
        style={{ transform: `translateX(${activeIndex * 100}%)` }}
      />
      {THEME_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => toggle.onSelect(opt.value)}
          aria-pressed={toggle.preference === opt.value}
          aria-label={opt.label}
          title={opt.label}
          className={seg(toggle.preference === opt.value)}
        >
          {opt.icon}
        </button>
      ))}
    </div>
  );
}

export function Footer({
  reveal = false,
  light = false,
  themeToggle,
}: {
  reveal?: boolean;
  // Light-toned reveal footer for content pages in light mode — the dark aurora
  // sheet stays reserved for the landing page (and dark mode). Composition is
  // identical, just re-toned.
  light?: boolean;
  themeToggle?: ThemeToggle;
}) {
  // The reveal variant (landing + content pages) is a dark sheet that ends in
  // the brand aurora. Composition (koto): the logo mark anchors the left; the
  // labelled link rows stack on the right, split by hairlines, over a slim
  // bottom bar carrying the copyright + theme switch.
  if (reveal) {
    // inline-block + vertical padding keeps each row a comfortable tap target
    // on touch screens — the bare 15px text line was easy to miss-tap.
    const linkCls = light
      ? "inline-block py-1 text-[15px] text-foreground transition-colors hover:text-muted-foreground"
      : "inline-block py-1 text-[15px] text-white transition-colors hover:text-white/70";
    // The dark face runs on the page's own ground rather than its own #101010,
    // which sat a clear step lighter than the #0a0a0a everything above it uses.
    // Only ever taken in dark mode (light={!dark} at the call site), so
    // bg-background is the dark ground here, never white.
    return (
      <footer
        className={`footer-reveal relative overflow-hidden ${
          light ? "bg-background text-foreground" : "bg-background text-white"
        }`}
      >
        {/* Container matches the nav rail (max-w-[1600px] px-6 md:px-10) so the
            first column's left edge lines up with the nav logo. */}
        {/* Container matches the nav rail (max-w-[1600px] px-6 md:px-10) so the
            first column's left edge lines up with the nav logo. */}
        {/* Full-bleed hairline divider at the footer's top edge — spans the
            full page width, and the home content rails connect into it with no
            gap. */}
        {/* GRID_LINE, not --border. This rule is a section JOIN — the seam
            between the page and the footer — which is the same job every
            GridDivider does, and the grid carries its own pair of values for
            exactly that reason: --border is sized to separate two objects that
            touch, and reads a step too dark used as a layout line.
            BOTH BRANCHES, because `light` here is exactly `!dark` (see
            revealFooterLight in root-shell) — the dark sheet is only ever
            drawn in dark mode, on the same #0a0a0a ground the dark grid is
            tuned against. So the aurora branch takes the grid's dark value
            too, and #383838 goes: it was --border by another name and sat the
            same step too bright over that ground. */}
        <div
          className={`border-t ${
            light ? GRID_LINE : "border-[#262626]"
          }`}
        />

        <div className="mx-auto max-w-[1600px] px-6 pb-12 md:px-10 md:pb-16">
          <div className="relative z-10 mt-10 md:mt-12">
            {/* Six tracks, kept from when a video card held the last two. The
                switch starts on the first column's edge: the links stop short
                of the right side, so a right-hand switch lined up with nothing. */}
            <div className="flex flex-col gap-10 lg:grid lg:grid-cols-6 lg:items-start lg:gap-x-10">
              {/* MULTICOL BELOW lg, not a two-column grid, and the Connect
                  shelf is why. In a grid every cell in a row is as tall as the
                  tallest, so Company — five links — got the height of the
                  Compare+Legal cell beside it, which is two labelled groups.
                  Connect then started after that whole row, separated from the
                  shelf above it by a void the size of the slack it inherited
                  rather than by the row gap. Columns pack instead of aligning,
                  so each shelf sits directly under the one before it and the
                  only gap left is the one declared here. `break-inside-avoid`
                  keeps a shelf whole; `column-count` does not apply to a grid
                  container, so `lg:grid` turns this off on its own. */}
              {/* Capped so five short columns don't spread across a wide
                  screen. */}
              <div className="columns-2 gap-x-8 lg:col-span-6 lg:grid lg:max-w-[1200px] lg:grid-cols-5 lg:gap-x-6">
                {COLUMNS.map((column) => (
                  // A column can hold more than one group; the second sits under
                  // the first with its own label, the way a long shelf is split
                  // rather than left to run twice its neighbours' height.
                  <div
                    key={column[0].label}
                    // mb-10 is the old grid's gap-y-10, carried by the items
                    // now that the container no longer declares a row gap.
                    className="mb-10 flex break-inside-avoid flex-col gap-10 sm:min-w-32 lg:mb-0"
                  >
                    {column.map((group) => (
                      <div key={group.label}>
                        {/* A step smaller than the links and greyed back, so the
                            label reads as a category marker above its items. */}
                        <p className={`text-[13px] ${light ? "text-muted-foreground" : "text-white/45"}`}>
                          {group.label}
                        </p>
                        <ul className="mt-3 flex flex-col gap-0.5">
                          {group.links.map((link) => (
                            <li key={link.label}>
                              <FooterLink link={link} className={linkCls} />
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              {themeToggle && (
                <div className="flex shrink-0 items-center gap-4 lg:col-span-6 lg:justify-self-start">
                  <ThemeSwitch toggle={themeToggle} onDark={!light} frosted />
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Brand aurora, always visible — carries the lower half of the footer
            now that the wordmark is gone (the footer keeps its generous height). */}
        <FooterAurora />
      </footer>
    );
  }

  // Plain variant (demo, error screens): compact neutral footer.
  return (
    <footer className="bg-background">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-6">
          <div className="col-span-2 md:col-span-1">
            <Image
              src="/images/logo-mark.svg"
              alt="Assembly"
              width={28}
              height={28}
            />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              The platform firms run on and build on.
            </p>
            {themeToggle && (
              <div className="mt-5">
                <ThemeSwitch toggle={themeToggle} onDark={!light} />
              </div>
            )}
          </div>
          {COLUMNS.map((column) => (
            <div key={column[0].label} className="flex flex-col gap-6">
              {column.map((section) => (
                <div key={section.label}>
                  <p className="text-sm font-normal">{section.label}</p>
                  <ul className="mt-3 flex flex-col gap-2">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <FooterLink
                          link={link}
                          className="inline-block py-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
