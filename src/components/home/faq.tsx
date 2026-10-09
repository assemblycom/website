"use client";

import { useState, type ReactNode } from "react";
import { Section } from "@/components/ui/section";
import {
  DOTTED_RULE_AFTER,
  DOTTED_RULE_BEFORE,
} from "@/components/ui/dotted-rule";

export interface FAQLink {
  label: string;
  href: string;
}

export interface FAQEntry {
  question: string;
  // Shown in place of `question` below sm, and at every width on a page that
  // asks for it. A question that wraps to a second line turns a tidy stack of
  // rows into a ragged one. Optional: only the questions that actually wrap
  // carry one, and the short form has to mean the same thing.
  shortQuestion?: string;
  answer: string;
  /**
   * Rendered in place of `answer` when the copy comes from the CMS rather than
   * the array above — a blog post's FAQ carries its own bold and links.
   */
  answerHtml?: string;
  // Substrings of the answer to turn into links (first match of each label).
  // Answers stay plain strings; links live as data alongside them.
  links?: FAQLink[];
}

// Split a paragraph into text + anchors by matching each link's label once.
function renderAnswer(text: string, links?: FAQLink[]): ReactNode {
  if (!links?.length) return text;
  let nodes: ReactNode[] = [text];
  links.forEach((link, li) => {
    // <ReactNode> spelled out rather than inferred. The two returns below are a
    // ReactNode[] and a (string | Element)[], and left to itself TypeScript
    // picks the type parameter from the returns on a full check and from the
    // assignment target here on an incremental one — so the same source type
    // checks cold and fails when Vercel restores a warm .tsbuildinfo.
    nodes = nodes.flatMap<ReactNode>((node, ni) => {
      if (typeof node !== "string") return [node];
      const at = node.indexOf(link.label);
      if (at === -1) return [node];
      const external = link.href.startsWith("http");
      return [
        node.slice(0, at),
        <a
          key={`${li}-${ni}`}
          href={link.href}
          {...(external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
          // decoration-1 rather than the font's `auto` thickness, which at
          // body size drew a rule heavy enough to read as a highlight. 1px
          // matches the prose links in `.post-body`, the same kind of inline
          // link in running text.
          className="underline decoration-1 underline-offset-2 [text-decoration-skip-ink:none] transition-colors hover:text-foreground"
        >
          {link.label}
        </a>,
        node.slice(at + link.label.length),
      ];
    });
  });
  return nodes;
}

const FAQS: FAQEntry[] = [
  {
    question: "What can I actually build?",
    answer:
      "Two kinds of apps: client-facing apps and internal tools. Think onboarding wizards, document collection, project trackers, approval workflows, client dashboards. Apps can use AI too — like an assistant that answers client questions from your firm's own docs.\n\nClient-facing apps are where Assembly is strongest — every app has two sides, so your team works in your dashboard while each client gets their own view inside your branded client experience.",
  },
  {
    question: "Are there templates I can start from?",
    answer:
      "Yes — 30+ app templates covering common workflows and specific industries, from accounting document collection to agency approval flows. Start from one and it's yours: reshape it by chat until it fits exactly how your firm works.\n\nTemplates are a great fit if you'd rather start from something proven than describe an app from scratch.",
  },
  {
    question: "How is Assembly different?",
    answer:
      "Most firms run on a mix of a practice management tool, a client portal, and a handful of point solutions. Assembly replaces that with one platform: a CRM for your team, a branded experience for your clients, 30+ ready-made apps, and an AI app builder for anything else. Because it's all one system, every app you add or build shows up where your team and clients already work, with hosting, sign-in, permissions, and payments handled for you.",
  },
  {
    question: "Do I need to know how to code?",
    answer:
      "No. Describe what you want. The app builder asks a few product questions, shows you a plan you approve or edit, then builds. Changes happen the same way — by conversation.",
  },
  {
    question: "Can my apps connect to the tools I already use?",
    answer:
      "Yes — apps can connect to any third-party service. When you build an app that needs one, the app builder prompts you to authenticate the tool or provide an API key, and it's wired in from there.",
  },
  {
    question: "Can I keep changing an app after it's live?",
    answer:
      "Yes. Apps aren't frozen at publish — keep chatting with the app builder to refine anything, whenever your workflow changes.",
  },
  {
    question: "What does it cost?",
    answer:
      "Start free, stay free — the free plan never expires, and you can build and publish real apps on it. Every plan includes a set number of apps and monthly build credits for creating and editing them. Upgrade as your firm grows for more apps, more credits, and more capability. Full details on our pricing page.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes — and security on Assembly is platform infrastructure, not something the AI generates. Clients sign in with secure magic links or Google. Roles and permissions are maintained by the platform, and a structural boundary separates what your team sees from what your clients see — no prompt can cross it. Every app is born inside these protections. Full details on our security page.",
  },
  {
    question: "What is Assembly not good for?",
    answer:
      "Public-facing sites. Assembly builds apps for authenticated experiences — your team and your logged-in clients. Marketing websites, public directories, and consumer apps are better built elsewhere.",
  },
  {
    question: "Who owns what I build?",
    answer:
      "You do. Every app you build is yours — your data, your logic, your workflows. We never use your apps, your data, or your clients' data to train AI models, and we don't share them with anyone.",
  },
];

// "divided" = a flat single-column list separated by hairlines, under a sticky
// heading in its own column. It is the default and what every page on the site
// renders.
//
// "cards" = soft muted-fill rounded rows. NO PAGE RENDERS THIS any more; it is
// kept because it is the only other shape this component knows how to be, and
// deleting it would mean the next page that wants something other than the
// house treatment invents its own instead of asking for this one. Nothing
// should pass it without a reason that survives being written down here.
type FAQVariant = "cards" | "divided";

function FAQItem({
  question,
  shortQuestion,
  answer,
  answerHtml,
  links,
  open,
  onToggle,
  variant = "cards",
  compactQuestions = false,
  dottedRules = false,
}: FAQEntry & {
  open: boolean;
  onToggle: () => void;
  variant?: FAQVariant;
  compactQuestions?: boolean;
  dottedRules?: boolean;
}) {
  // Controlled by the parent so only one answer is open at a time (opening one
  // closes the others). Toggles on click only — hover-to-open made rows pop open
  // as the cursor passed over them while scrolling.

  // Smooth reveal via grid-rows 0fr → 1fr — animates without measuring.
  const body = (
    <div
      className={`grid transition-[grid-template-rows] duration-300 ease-out ${
        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
      }`}
    >
      {/* Closed, this has to be overflow-hidden: that is what suppresses a grid
          item's automatic minimum size, and without it the 0fr row can't collapse
          — every answer stands open. Open, it switches to a clip with a margin so
          a link's focus outline isn't cropped at the edges. min-h-0 keeps the row
          collapsible through the transition, when open is already true. */}
      <div
        className={`min-h-0 ${open ? "overflow-clip [overflow-clip-margin:6px]" : "overflow-hidden"}`}
      >
        <div
          className={
            // pt-2 is headroom for a focus ring, not spacing: the reveal
            // wrapper clips its overflow, so a link on the answer's first line
            // had its outline cropped along the top.
            variant === "divided"
              ? // pl-3 matches the question's own inset (see the button's
                // px-3) so the answer starts on the same vertical as the
                // question above it. The right inset is the question's 12px
                // plus the 40px of measure the prose already kept.
                "space-y-4 pb-6 pl-3 pr-[52px] pt-2"
              : "space-y-4 px-5 pb-4 pt-2"
          }
        >
          {answerHtml ? (
            // Ghost's markup, on the post body's own styles. The source is our
            // CMS, not user input.
            <div
              className="post-body"
              dangerouslySetInnerHTML={{ __html: answerHtml }}
            />
          ) : (
            answer.split("\n\n").map((para, i) => (
              <p
                key={i}
                className="type-body whitespace-pre-line text-muted-foreground"
              >
                {renderAnswer(para, links)}
              </p>
            ))
          )}
        </div>
      </div>
    </div>
  );

  if (variant === "divided") {
    return (
      <div
        className={
          dottedRules
            ? `relative after:absolute after:inset-x-0 after:bottom-0 after:h-px after:content-[''] ${DOTTED_RULE_AFTER} last:after:hidden`
            : "border-b border-border last:border-b-0"
        }
      >
        {/* The hover is a PLATE behind the row, not a change to the question's
            own ink: the question is already --foreground, so there is nowhere
            for the text to go on hover that isn't dimmer, and a row that fades
            when you point at it reads as disabled.

            SQUARE, and exactly the row's own box — inset-0, no radius. It was
            a rounded plate bled 12px past the text on each side, which was
            wrong on both counts: the rounding drew a second, softer box inside
            the row's hard dotted rules, so a hovered row read as two boxes
            rather than one; and the bleed ran the tint out past the ends of
            those rules, so the thing highlighting the row was wider than the
            row. The rules are the row's edges, so the plate stops at them.

            `isolate` on the button is load-bearing. The plate is -z-10 so it
            sits under the question and the chevron, and without a stacking
            context of its own that puts it behind the PAGE — the tint simply
            never appears.

            Hover only, and still click to open. Hover-to-open was tried and
            reverted (rows popped open as the cursor crossed them while
            scrolling); this gives the row the affordance that change was
            after without the behaviour that made it unusable. The same plate
            answers focus-visible, so a keyboard gets the row as well as the
            ring.

            ONE value for both themes, --foreground at 6%, rather than a light
            tint plus a dark override. The ink token already flips — near-black
            on the light page, near-white on the dark one — so six percent of it
            is a plate a shade off the ground either way, and there is no second
            number that can be tuned on one theme and left behind on the other.
            `bg-muted/60` was tried first and is wrong twice over: it resolved
            to nothing at all under [data-theme=dark], and --muted is a SURFACE
            step, so even working it would have been a fixed grey rather than
            something that answers the ground it is drawn on. */}
        <button
          onClick={onToggle}
          aria-expanded={open}
          // THE HOVER IS LIGHTER IN LIGHT MODE.
          //
          // One value, --foreground at 6%, served both themes. In dark that is
          // a near-white at 6% over near-black — a faint lift. In light it is
          // #101114 at 6% over white, which lands around #f0f1f1: a 14-point
          // step, and against a question set in plain type on an open page it
          // read as a filled band rather than as a row waking up.
          // 3.5% in light is about 8 points, which still separates the row
          // under the pointer without the list looking like it has a selected
          // item. Dark keeps the 6% it was tuned at.
          // px-3 — THE PLATE NEEDS AIR, and it is paid for by the list rather
          // than by the text. The row had no horizontal padding at all, so on
          // hover the tint began exactly at the question's first letter and
          // ended exactly at the chevron: a plate the size of its contents,
          // which reads as a band clamped onto the words rather than as the
          // row lighting up.
          //
          // The 12px is given back by a -mx-3 on the list (see Accordion), so
          // the question still starts on the column's own left edge — level
          // with the heading beside it on a desktop and directly under it on a
          // phone. What moves is the chrome: the dotted rules and the hover
          // plate now run 12px past the type on each side.
          //
          // That is the opposite trade from the one this plate was given when
          // it was first drawn — it used to bleed 12px past a row whose rules
          // stopped at the text, so the highlight was wider than the row it
          // highlighted. Here the rules move with it, so the plate is still
          // exactly the row's own box. It is the box that grew.
          className="group relative isolate flex w-full cursor-pointer items-center justify-between gap-6 px-3 py-5 text-left outline-none before:absolute before:inset-0 before:-z-10 before:bg-transparent before:transition-colors hover:before:bg-foreground/[0.035] focus-visible:before:bg-foreground/[0.035] [[data-theme=dark]_&]:hover:before:bg-foreground/[0.06] [[data-theme=dark]_&]:focus-visible:before:bg-foreground/[0.06]"
        >
          <span className="type-body text-foreground">
            {compactQuestions ? (
              (shortQuestion ?? question)
            ) : (
              <>
                <span className="sm:hidden">{shortQuestion ?? question}</span>
                <span className="hidden sm:inline">{question}</span>
              </>
            )}
          </span>
          {/* The chevron turns 90°, not 180 — half the travel of a full flip,
              and timed to the drawer (300ms) so the two move as one gesture.
              Right at rest, down when open: the arrow points the way the answer
              arrives from. Pointing down at a closed row promised the answer was
              already below it. The drawn path points down, so the resting state
              is the rotated one. Same at every width — this used to invert above
              md, which left every open row on a desktop pointing sideways. */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden
            className={`shrink-0 text-muted-foreground transition-[transform,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-foreground motion-reduce:transition-none ${
              open ? "rotate-0" : "-rotate-90"
            }`}
          >
            <path
              d="M5 8l5 5 5-5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        {body}
      </div>
    );
  }

  // Each question is its own card: a subtle gray fill in both themes, no
  // outline. The fill alone separates the row from the page, and 8px sits
  // between the 4px control radius (too square at this size) and the 12px it
  // used to carry (too rounded on a short row).
  return (
    <div className="overflow-hidden rounded-[8px] bg-muted">
      <button
        onClick={onToggle}
        aria-expanded={open}
        // Inset ring: the card clips its overflow to keep the answer's reveal
        // inside its rounded corners, so an outline drawn outside the button was
        // cropped on all four sides — the row had no visible focus state at all.
        className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-[8px] px-5 py-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-foreground/40"
      >
        <span className="type-body text-foreground">
          {compactQuestions ? (
            (shortQuestion ?? question)
          ) : (
            <>
              <span className="sm:hidden">{shortQuestion ?? question}</span>
              <span className="hidden sm:inline">{question}</span>
            </>
          )}
        </span>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden
          // Same right-at-rest, down-on-open turn as the divided variant.
          className={`shrink-0 text-muted-foreground transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
            open ? "rotate-0" : "-rotate-90"
          }`}
        >
          <path
            d="M5 8l5 5 5-5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {body}
    </div>
  );
}

// Renders the FAQ items as a single-open accordion — opening one row closes any
// other. Handles both the two-column and single-column layouts. The open row is
// tracked here (by question text) so only one answer shows at a time.
export function Accordion({
  items,
  twoColumn,
  variant = "cards",
  compactQuestions = false,
  dottedRules = false,
  flushTop = true,
}: {
  items: FAQEntry[];
  twoColumn: boolean;
  variant?: FAQVariant;
  /** Run `shortQuestion` at every width, not only below sm. */
  compactQuestions?: boolean;
  /**
   * Draw the divided list's rules as the dotted hairline rather than a solid
   * border, and open the list with one. Divided only.
   */
  dottedRules?: boolean;
  /**
   * The divided list is normally ruled top by the layout above it, so the first
   * row drops its top padding to sit against that line. A list with no rule
   * above it keeps the padding, or the first question crowds whatever precedes.
   */
  flushTop?: boolean;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const renderItem = (faq: FAQEntry) => (
    <FAQItem
      key={faq.question}
      {...faq}
      variant={variant}
      compactQuestions={compactQuestions}
      dottedRules={dottedRules}
      open={openId === faq.question}
      onToggle={() =>
        setOpenId((cur) => (cur === faq.question ? null : faq.question))
      }
    />
  );

  // Vercel-style: one flat column ruled top by a hairline. Laid out in the right
  // column by the parent, so no top margin here.
  if (variant === "divided") {
    if (twoColumn) {
      const mid = Math.ceil(items.length / 2);
      return (
        <div className="mt-10 grid gap-x-8 md:mt-12 md:grid-cols-2">
          <div>{items.slice(0, mid).map(renderItem)}</div>
          <div>{items.slice(mid).map(renderItem)}</div>
        </div>
      );
    }
    return (
      <div
        className={[
          // -mx-3 pays for the 12px of horizontal padding each row carries
          // (see the button in FAQItem). The rows' rules and hover plates run
          // 12px wider than the column on each side; the type inside them is
          // pushed back to the column's own edge, so the first letter of every
          // question still lines up with the heading. Without this the whole
          // list would sit indented from everything around it.
          "-mx-3",
          flushTop ? "[&>div:first-child>button]:pt-0" : "",
          // Opening rule, so the list reads as bounded rather than as a stack
          // that happens to start. Only with the dotted treatment: a solid one
          // here doubled up with whatever section rule sits above.
          dottedRules
            ? `relative before:absolute before:inset-x-0 before:top-0 before:h-px before:content-[''] ${DOTTED_RULE_BEFORE}`
            : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {items.map(renderItem)}
      </div>
    );
  }

  if (twoColumn) {
    const mid = Math.ceil(items.length / 2);
    const columns = [items.slice(0, mid), items.slice(mid)];
    return (
      <div className="mt-10 grid items-start gap-6 md:mt-12 md:grid-cols-2">
        {columns.map((column, i) => (
          <div key={i} className="space-y-4">
            {column.map(renderItem)}
          </div>
        ))}
      </div>
    );
  }

  return <div className="mt-12 space-y-3">{items.map(renderItem)}</div>;
}

/**
 * THE SITE'S ONE FAQ TREATMENT, and it is the default rather than something a
 * page opts into: a sticky heading in a left column, the questions as a flat
 * ruled list down the right, dotted hairlines between them.
 *
 * It used to default to `cards` + `twoColumn`, and every page passed
 * `twoColumn` to get it — eight call sites all repeating the same two props to
 * arrive at the same place. One page (/ai-app-builder) then passed
 * `variant="divided" dottedRules` instead, which is how the site ended up
 * answering the same question in two different shapes. The defaults are now
 * the shape we want, so a page that wants the house FAQ passes nothing but its
 * own items, and there is no prop to forget.
 */
export function FAQ({
  heading = "Frequently asked questions",
  items = FAQS,
  twoColumn = false,
  variant = "divided",
  compactQuestions = false,
  dottedRules = true,
}: {
  heading?: string;
  items?: FAQEntry[];
  twoColumn?: boolean;
  variant?: FAQVariant;
  /** Dotted hairlines instead of solid borders. Divided only. */
  dottedRules?: boolean;
  /**
   * Run the short form of every question that has one, at every width. For a
   * page whose questions are written long for search: the row stays one line
   * while the full wording is still what the answer is filed under.
   */
  compactQuestions?: boolean;
} = {}) {
  // Vercel-style: heading sits in a left column, the divided question list runs
  // down the right. The heading sticks so it stays with the list on long scrolls.
  if (variant === "divided") {
    // Two-column layout: heading on top, questions split across two columns.
    if (twoColumn) {
      return (
        <Section id="faq" className="px-0 py-16 md:py-24">
          <div className="mx-auto max-w-[1200px] px-6 md:px-10">
            <h2 className="type-h2 text-center">{heading}</h2>
            <Accordion
              items={items}
              twoColumn
              variant={variant}
              compactQuestions={compactQuestions}
            />
          </div>
        </Section>
      );
    }
    return (
      <Section id="faq" className="px-0 py-16 md:py-24">
        <div className="mx-auto grid max-w-[1200px] gap-x-16 gap-y-10 px-6 md:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)] md:px-10">
          <div className="md:sticky md:top-28 md:self-start">
            <h2 className="type-h2">{heading}</h2>
          </div>
          {/* flushTop off under a dotted rule: the first row keeps its top
              padding like every other, so it sits off the opening rule rather
              than against it. */}
          <Accordion
            items={items}
            twoColumn={false}
            variant={variant}
            compactQuestions={compactQuestions}
            dottedRules={dottedRules}
            flushTop={!dottedRules}
          />
        </div>
      </Section>
    );
  }

  const widthClass = !twoColumn ? "max-w-2xl" : "max-w-4xl";
  return (
    <Section id="faq" className="py-16 md:py-24">
      <div className={`mx-auto ${widthClass}`}>
        {/* Capped below sm so the heading always breaks into two lines on a
            phone. Unconstrained it just fits on one at 430px and ran the full
            width of the screen, hard against both gutters. */}
        <h2 className="type-h2 mx-auto max-w-80 text-center sm:max-w-none">
          {heading}
        </h2>
        <Accordion
          items={items}
          twoColumn={twoColumn}
          variant={variant}
          compactQuestions={compactQuestions}
        />
      </div>
    </Section>
  );
}

// Homepage FAQ — the house treatment, like every other page: heading on the
// left, the ruled question list on the right. The home page's own content
// wrapper supplies the vertical guide rails, so this just renders inside them.
export function HomeFAQ() {
  return <FAQ items={FAQS} />;
}
