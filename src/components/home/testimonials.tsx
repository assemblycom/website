"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/ui/section";

// ─────────────────────────────────────────────────────────────────────────
// CUSTOMER STORIES — the expanding quote row from the earlier homepage, back
// in place of the single featured story: with the logo reel gone, one firm was
// the only social proof on the page. Recognisable names (Capital One) sit next
// to firms like the reader's, and every card links to its full story.
// ─────────────────────────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    quote:
      "We’ve built out apps within weeks that I doubt we could have done within five to ten years before.",
    author: "Garrett Leonard",
    company: "Advertai Marketing",
    slug: "advertai-marketing",
  },
  {
    quote:
      "Assembly flows directly into our internal quality control processes. Instead of duplicating work across systems, everything is connected, saving our team time and ensuring we always have the most accurate, up-to-date information.",
    author: "Phillip LaRue",
    company: "Capital One",
    slug: "capital-one-luxury-travel",
  },
  {
    quote:
      "Assembly was the only solution that let us flexibly build our own version of a client portal, uniting elements of their technology with existing external core applications that we wanted to keep using.",
    author: "Kyle Pearson",
    company: "Collective CPA",
    slug: "collective-cpa",
  },
  {
    quote:
      "We've definitely reduced inquiries by owners by at least 50%. It probably saved the cost of a whole extra administrator from my company.",
    author: "Rachel Hugenschmidt",
    company: "Jungle Luxe",
    slug: "jungle-luxe",
  },
];

export function Testimonials() {
  const [active, setActive] = useState(0);

  return (
    // px-0 on the Section so the measure below owns the horizontal inset and
    // the row lines up with the sections around it.
    <Section id="testimonials" className="px-0 py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 className="type-h2 text-foreground">What our customers say</h2>
          <Link
            href="/customers"
            className="type-body group inline-flex items-center gap-1.5 text-foreground"
          >
            <span>See all customer stories</span>
            <span className="transition-transform duration-200 group-hover:translate-x-0.5">
              &rarr;
            </span>
          </Link>
        </div>

        {/* Expanding panels. The active panel widens to reveal the full quote;
            the others collapse to columns showing the company name. Desktop
            expands on hover, mobile stacks them as an accordion. */}
        <div className="mt-12 flex flex-col gap-3 lg:h-[460px] lg:flex-row">
          {TESTIMONIALS.map((t, i) => {
            const isActive = i === active;
            return (
              <div
                key={t.company}
                role="button"
                tabIndex={0}
                onClick={() => setActive(i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActive(i);
                  }
                }}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                aria-expanded={isActive}
                className={`group relative flex cursor-pointer overflow-hidden rounded-2xl border border-border bg-muted text-left transition-[flex-grow,background-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isActive
                    ? "lg:flex-[6]"
                    : "lg:min-w-[170px] lg:flex-[1] lg:hover:bg-muted/70"
                }`}
              >
                {/* Collapsed label (desktop): photo above the company name. */}
                <span
                  className={`pointer-events-none absolute inset-x-0 bottom-0 hidden flex-col gap-3 p-6 transition-opacity duration-300 lg:flex ${
                    isActive ? "opacity-0" : "opacity-100"
                  }`}
                >
                  <Image
                    src={`/images/customers/${t.slug}.jpg`}
                    alt={t.company}
                    width={56}
                    height={56}
                    className="size-14 rounded-xl object-cover"
                  />
                  <span className="whitespace-nowrap text-base font-normal text-muted-foreground">
                    {t.company}
                  </span>
                </span>

                {/* Expanded content. A fixed width on desktop keeps the quote
                    from reflowing while the panel grows, so the expand reads
                    as a slide. The width is what the open panel gets once the
                    three collapsed ones and the gaps are taken out. */}
                <div
                  className={`flex min-w-0 flex-col transition-opacity duration-300 lg:w-[min(574px,calc(100vw-626px))] lg:shrink-0 lg:flex-row ${
                    isActive ? "opacity-100 lg:delay-100" : "opacity-100 lg:opacity-0"
                  }`}
                >
                  {/* Portrait from xl up; below that the open panel is too
                      narrow to hold it beside the quote. */}
                  <div className="hidden shrink-0 p-3 xl:block">
                    <Image
                      src={`/images/customers/${t.slug}.jpg`}
                      alt={t.author}
                      width={320}
                      height={440}
                      className="h-full w-48 rounded-xl object-cover"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col p-5 lg:justify-between lg:p-8">
                    {/* Mobile header row — the always-visible tap target. */}
                    <div className="flex items-center gap-3 lg:hidden">
                      <Image
                        src={`/images/customers/${t.slug}.jpg`}
                        alt={t.author}
                        width={80}
                        height={80}
                        className="size-12 shrink-0 rounded-lg object-cover"
                      />
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="text-[15px] font-medium">{t.author}</span>
                        <span className="text-sm text-muted-foreground">
                          {t.company}
                        </span>
                      </span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        aria-hidden
                        className={`shrink-0 text-muted-foreground transition-transform duration-300 ${
                          isActive ? "rotate-180" : ""
                        }`}
                      >
                        <path
                          d="M4 6l4 4 4-4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    {/* Quote and story link — collapsible on mobile, always
                        open on desktop. */}
                    <div
                      className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:block ${
                        isActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="min-h-0 overflow-hidden">
                        <p
                          className={`pt-4 text-base leading-relaxed transition-opacity duration-300 md:text-lg lg:pt-0 lg:opacity-100 ${
                            isActive ? "opacity-100 delay-100" : "opacity-0"
                          }`}
                        >
                          &ldquo;{t.quote}&rdquo;
                        </p>
                        <Link
                          href={`/customers/${t.slug}`}
                          onClick={(e) => e.stopPropagation()}
                          className="type-body group/link mt-4 inline-flex items-center gap-1.5 text-foreground lg:hidden"
                        >
                          <span>Read the story</span>
                          <span className="transition-transform duration-200 group-hover/link:translate-x-0.5">
                            &rarr;
                          </span>
                        </Link>
                      </div>
                    </div>
                    {/* Desktop attribution and story link, anchored at the
                        foot; on mobile the header row carries the name. */}
                    <div className="mt-6 hidden items-end justify-between gap-4 lg:flex">
                      <span className="flex flex-col">
                        <span className="text-base font-medium">{t.author}</span>
                        <span className="text-sm text-muted-foreground">
                          {t.company}
                        </span>
                      </span>
                      <Link
                        href={`/customers/${t.slug}`}
                        tabIndex={isActive ? 0 : -1}
                        className="type-body group/link inline-flex shrink-0 items-center gap-1.5 text-foreground"
                      >
                        <span>Read the story</span>
                        <span className="transition-transform duration-200 group-hover/link:translate-x-0.5">
                          &rarr;
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
