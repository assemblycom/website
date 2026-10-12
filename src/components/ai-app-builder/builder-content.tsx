import type { FAQEntry } from "@/components/home/faq";
import type { Pillar } from "@/components/ai-app-builder/builder-pillars";
import { AddAppMock } from "@/components/ai-app-builder/add-app-mock";
import { BrandedLoginScreen } from "@/components/comparison/branded-login-hero-visual";
import { TeamCrmVisual } from "@/components/home/team-crm-visual";
import {
  BrandedPortalVisual,
  PORTAL_STOCK_CORE,
} from "@/components/ai-app-builder/branded-portal-visual";
import { IconClock, IconList } from "@/components/home/mock-icons";

// The AI app builder's pillars and FAQ, shared by /ai-app-builder and its paid
// landing page at /lp/ai-app-builder, so the two cannot drift apart.

/**
 * The four claims a visitor with no Assembly workspace can believe, in the
 * brief's order: client-facing first because that is where Assembly is uniquely
 * good, CRM second, the hard parts third, brand last (table stakes on its own,
 * differentiated only by the fact that it propagates to every new app).
 */
export const PILLARS: Pillar[] = [
  {
    eyebrow: "Apps",
    // "Build … in one place" → "Client apps and internal tools, one place".
    // The verb goes because the whole page is about building and the section
    // above this one says so twice; "one place" is the claim and it stays.
    heading: "Client apps and internal tools, one place",
    // 15 words to 13, same two beats: you describe it once, and WHICH of the
    // two places it lands in is decided for you. "your client experience" →
    // "clients" is the same destination said shorter — the apps reach the
    // client — and keeps the pairing with "your dashboard" it is contrasted
    // against.
    body: "Describe it once. Client apps go to clients, team tools to your dashboard.",
    // The Add App screen — the ONE PLACE the heading names. It was the built
    // app sitting in a client's sidebar, which shows where an app lands; that
    // is true, and it is also what the two cards further down this row already
    // show. The claim here is about where every app starts, and the product's
    // answer is a single box that takes a sentence and decides from the
    // sentence whether what comes back is a client app or a team tool.
    visual: <AddAppMock />,
    // Flat against the card: no cast, no rounded corner. This screen's ground
    // is the product's own page white and its subject sits in the middle of
    // it, so a lift and a corner were drawing a frame around mostly-empty
    // page — the frame read louder than the box it was framing. The other
    // three keep theirs; their screens have furniture on every edge.
    visualBare: true,
    // The hairline is spent by two thirds of the way down the frame, rather
    // than running its ramp to the frame's own foot. This shot is drawn taller
    // than the card shows, so the default ramp was still carrying a visible
    // line where the card crops it — the frame's edge stopped dead beside a
    // shot that is busy dissolving into the card at the same height. At 66%
    // the line is gone before the crop and the two agree.
    litFade: "66%",
    // Dissolved into the card at its foot. The shot ends mid-way through a row
    // of app cards, and a hard cut there reads as half-drawn cards rather than
    // as a window onto a page that carries on. 84%, so the ramp covers about
    // the last row and nothing above it.
    fadeBottom: 84,
    // AND AT ITS RIGHT EDGE, which it had no ramp for at all.
    //
    // This shot is laid out `right-0`: its right edge IS the card's right
    // edge, so the screen was cut dead on the line the card draws its own ring
    // on. Two edges on one pixel column — the card's lit ring and the shot's
    // ground ending — read as a doubled border, which is what it looked like.
    // The other two cropped shots already dissolve before they get there; this
    // one was the odd case because it is the only one whose shot is pinned to
    // the card edge rather than overhanging it.
    //
    // 90 in light, 74 in dark: the card ground went to the page's own
    // near-black in dark, so the shot has three times as far to travel before
    // it is gone. Both ramps land on the empty template placeholders at the
    // shot's right, not on the composer, which is the part worth reading.
    fadeRight: true,
    fadeFrom: 90,
    fadeFromDark: 74,
  },
  {
    eyebrow: "CRM",
    // Two sentences to one phrase. "One CRM. Every app connects to it" said
    // the same thing twice — one CRM, and everything joins it — so the second
    // half is folded in as "behind every app".
    heading: "One CRM behind every app",
    // 12 words to 10. The dash clause becomes its own short sentence and the
    // list drops its "and"; "each client sees only what you allow" loses
    // "each", which the plural already carries. The claim is unchanged: three
    // kinds of record, and per-client visibility you control.
    body: "Contacts, companies, custom fields. Clients see only what you allow.",
    // The home page's CRM shot: contacts, companies and a custom field.
    visual: <TeamCrmVisual />,
    // 490, not the tall card's default 860. The table's Name column is flex-1
    // against four fixed ones, so every pixel of layout width lands on Name —
    // at 860 it took 526 of them and pushed Company clean past the card's
    // crop, which left a shot of a contact list with no company in it under a
    // heading about companies.
    //
    // The number is set by the NARROWEST card this row draws, not the widest:
    // 360 is set from BOTH ends now, and it can be because the table's
    // columns are fixed with a spacer at the end (see TeamCrmVisual) rather
    // than Name being flex-1. While Name was flexible these two were the same
    // number and could not both be satisfied:
    //
    //   - it has to be WIDER than the widest card this row draws (~331px of
    //     mock visible at the 1200 container) or the screen stops short of the
    //     card's right edge and leaves a strip of card showing;
    //   - and the Company column has to land inside the NARROWEST (271px at a
    //     1024 viewport), or the shot is a contact list with no company in it
    //     under a heading about companies.
    //
    // The spacer takes the difference. The type does not scale with this.
    visualWidth: 360,
    // Dissolved on the right rather than cut off by the card. A hard crop
    // through a table's rows reads as the picture being clipped; a ramp reads
    // as the table carrying on past what the card can show, which is what is
    // actually true. It starts at 88% and not the default 62 because this
    // shot's subject runs ACROSS the measure — at 62 the company column would
    // be read through the middle of the gradient.
    //
    // Outlined, not cast — the same call as the Apps card beside it. These two
    // sit in one row and a shadow under one with a drawn edge on the other is
    // the row telling you they are different kinds of thing.
    visualBare: true,
    fadeRight: true,
    // Contained and centred on a phone. At 327px the card is barely narrower
    // than the 360px shot, so the crop had nothing to show for itself — a few
    // pixels of overhang and a ramp running through the Company column — where
    // on a desktop the same crop is a real window onto a wider table.
    containOnPhone: true,
    // 52, against the shared default's 76. Contained on a phone, this shot is
    // five 48px contact rows in a 268px box, so the card cuts it mid-table —
    // and what the ramp has to dissolve down there is a row of avatars, names
    // and email addresses, not empty ground. Over the last quarter that is a
    // soft cut through readable type: you can still read the half-row it ends
    // on, which is what makes it look broken rather than continued. From 52
    // the last row is already giving out before the edge arrives, so the table
    // reads as carrying on past the card.
    fadeBottomPhone: 52,
    // 74, not 88. At 88 the ramp had 12% of the card to get from solid to
    // nothing — short enough that it read as a soft cut rather than as the
    // table carrying on past the edge. 74 spends a quarter of the width on
    // the dissolve, which is what makes the shot meet the card's ground
    // instead of stopping against it. The Company column still clears it:
    // the ramp is barely on at 74 and does not bite until past the logos.
    fadeFrom: 74,
    // A FOOT RAMP TOO, which this shot never had.
    //
    // It is laid out to the card's full height, so the table's ground and its
    // own lit ring both stopped dead on the card's bottom edge — the exact row
    // the card draws its own ring on. Two edges on one pixel row: the card's
    // hairline crossed a hard step from the shot's --mock-window to the card's
    // --surface, and read as the border changing colour half way along.
    //
    // 80, so the ramp is the last fifth. The shot is gone before the card's
    // ring gets there, which leaves that ring running over one flat ground.
    // The phone keeps its own, much longer ramp — see `fadeBottomPhone`.
    fadeBottom: 80,
    // Dark starts the ramp 34 points earlier. The card's ground went to the
    // page's own near-black, so the shot has three times as far to dissolve
    // — and the card clips this shot at about 92% of its width, where a ramp
    // from 74 is still a third opaque. Cut there, the step landed on the
    // card's ring and read as a second outline beside it. From 40 the shot
    // is spent before the edge reaches it.
    fadeFromDark: 40,
  },
  {
    eyebrow: "Security",
    // The "and" goes; the list reads as a list without it. "Secure" stays —
    // it is the word doing the work, and the three nouns alone would be a
    // feature list rather than a claim about them.
    heading: "Secure logins, permissions, billing built in",
    // Same words on a phone, with "billing built in" bound by no-break spaces
    // so the line turns after "permissions," instead of orphaning "built in".
    // See `headingPhone` for why neither balance nor greedy gets there alone.
    headingPhone: "Secure logins, permissions, billing built in",
    // 11 words to 10, and the second sentence turns round to lead on the
    // client: "Nothing reaches clients until…" → "Clients see nothing
    // until…". Same gate, same hand on it.
    body: "Maintained by Assembly. Clients see nothing until you make it visible.",
    // The firm's own sign-in: their mark, their domain, no platform badge.
    // The claim leads on secure LOGINS, and this is the first thing a client
    // meets. It was the onboarding screen, which carried an "Access: client
    // only" control a few hundred pixels in — a picture of permissions, with
    // nothing in it about signing in at all.
    visual: <BrandedLoginScreen />,
    // Whole, not cropped. A sign-in is one object with a middle — the mark,
    // the title, the field, the button — and cropping it on the card's edges
    // cut off the half of it the claim is about.
    visualContained: true,
    // NO BRAND WASH. This card carried the page's periwinkle-to-lime ramp
    // behind the sign-in, on the grounds that it is the one shot here that
    // floats whole in its card rather than being cropped by it, so it is the
    // one with a ground to put something on.
    //
    // In dark that ground never came off. Laid over a near-black surface the
    // ramp has to run at about half its light-mode alpha or the body copy on
    // top of it stops being readable, and at that strength periwinkle and lime
    // both resolve towards the same olive-grey — a card tinted rather than
    // coloured. Brightening it is a straight trade against the copy sitting in
    // the top quarter (measured: the band under the body text goes from 3.0:1
    // to 2.0:1), so the wash cannot be both legible and worth having here.
    //
    // The card takes --surface like the other three instead. The sign-in holds
    // its own against a neutral ground via `fadeFoot` below, which is what
    // keeps its foot from cutting off flat.
    //
    // `.pillar-brand-wash` and the `brandWash` prop are left in place — this
    // is the only caller, so turning it back on is one word.
    brandWash: false,
    // A BOTTOM FADE IN DARK, and only in dark.
    //
    // The objection to one was that the screen's last visible object is the
    // Magic link button, a solid near-black slab in light, and a ramp across a
    // slab reads as the button being blurred rather than as the screen giving
    // out. That still holds in light, and light does not need the ramp anyway:
    // --surface and the screen's --mock-window are a point apart there, so the
    // foot already gives out on its own.
    //
    // Dark is the other case on both counts. The card is #191919 and the
    // screen #212121, so the hard cut at the card's edge is a visible step
    // running flat across the full width; and the Magic link button is no
    // longer a slab here — it took the Continue-with-Google surface in dark, so
    // there is something low-contrast for the ramp to give out into, which is
    // exactly what it was missing. See `fadeFoot` and --mock-foot-fade.
    fadeFoot: true,
  },
  {
    eyebrow: "Branding",
    // "in your clients' branded home" → "already branded". Where it lands is
    // the picture's job — the shot under this heading IS the client's home —
    // so the words keep the part the picture cannot say: that it arrives
    // carrying your brand rather than being dressed afterwards.
    heading: "New apps land already branded",
    // 13 words to 11. The second sentence becomes a clause on the first, and
    // "picks them up automatically" drops the adverb, which the present tense
    // already implies.
    body: "Your logo and colors, not ours — every app picks them up.",
    // The CLIENT's nav, in the firm's colour, with the apps the firm has added
    // listed under the stock rows. It was the home page's branded-portal shot,
    // which is the team's dashboard — CRM, Team, Customize, and a table of six
    // clients' time entries — so a card about where the client's apps land was
    // showing a screen no client ever opens.
    // PORTAL_STOCK_CORE: Home, Messages, Files — no Billing. This card's nav
    // only has to establish "a portal with the usual rows in it" before the
    // added app, and a fourth stock row is one more thing between the top of
    // the nav and the row the claim is about. /solutions' agency hero keeps
    // the full set.
    visual: (
      <BrandedPortalVisual
        quietPane
        appHeader={false}
        stock={PORTAL_STOCK_CORE}
        // Two more land under Year-end docs while the card is hovered. The
        // heading says apps arrive already branded; one row shows that it
        // happened, and these two show it keeps happening. Both are apps a
        // firm on this page would plausibly build next — they are named in
        // the templates section further down.
        landOnHover={[
          { icon: <IconList />, label: "Client onboarding" },
          { icon: <IconClock />, label: "Time tracker" },
        ]}
      />
    ),
    // The firm's branded nav IS this claim; the app pane beside it only shows
    // the nav is attached to a real screen. So the pane dissolves into the card
    // on the right instead of being cut off by it, and the slab is what the eye
    // lands on.
    fadeRight: true,
    // NO `visualBare` HERE, and that is deliberate — see the note below.
    //
    // It was set, to give this shot the .mock-lit-edge ring the other two
    // cropped shots wear. That was wrong: unlike them, BrandedPortalVisual
    // draws its OWN frame (`rounded-t-xl border border-b-0`), so the ring
    // landed on top of a border that was already there — two 1px edges on the
    // same frame, which is the doubled border this row has been bitten by
    // before (see the Apps pillar's note on its right edge).
    //
    // The complaint the ring was answering was real — that edge was one flat
    // value in dark — but it belonged to the visual's own border, not to a
    // second one. It is now lit by .mock-edge inside the component, which
    // falls off toward the foot the way the rest of the set does.
  },
];

/**
 * The brief's eight questions, in its order and its wording: this section
 * carries the page's search and AI-answer load, so `question` keeps the brief's
 * full wording — that is what the FAQ schema below publishes and what the answer
 * is written against.
 *
 * The two that would wrap to a second line carry a `shortQuestion` for the row
 * label only. Both still name Assembly's AI app builder rather than "it", and
 * both still ask the same thing; only the trailing generalisation is dropped,
 * which the answer itself restates.
 */
export const BUILDER_FAQS: FAQEntry[] = [
  {
    question: "Do I need to know how to code to use Assembly's AI app builder?",
    answer:
      "No. Describe what you want, or start from a template. Assembly asks a few clarifying questions and shows a plan you approve or edit, and then it builds. Changes after launch happen the same way, by continuing the conversation, with no coding at any step.",
  },
  {
    question: "How much does Assembly's AI app builder cost?",
    answer:
      "Assembly has a free plan that never expires, and you can build and publish working apps on it. Paid plans add more apps and your own domain for the client experience. Full details are on Assembly's pricing page.",
    links: [{ label: "pricing page", href: "/pricing" }],
  },
  {
    question:
      "Is Assembly's AI app builder secure enough to handle client data?",
    answer:
      "Yes. Logins and permissions on Assembly are built and maintained by Assembly's team, not generated by the AI for each app. Clients sign in with Google or a secure one-click email link, and multi-factor authentication is available on every plan, with enforced MFA on Advanced plans. Each client sees only their own data. Full details are on Assembly's security page.",
    links: [{ label: "security page", href: "/security" }],
  },
  {
    question:
      "How is Assembly's AI app builder different from Lovable, Replit, and other AI app builders?",
    shortQuestion:
      "How is Assembly's AI app builder different from Lovable and Replit?",
    answer:
      "Most AI app builders generate a working prototype and stop there, leaving logins, hosting, and client data for the person building it to figure out. Assembly's AI app builder comes with that layer built in: logins for your team and your clients, permissions, a CRM, your branding, and a built-in billing option. What gets built is an app your business can use right away, for your clients or your team, rather than a prototype that still needs to be finished. See Assembly's comparison pages against Lovable and Base44 for a feature-by-feature breakdown.",
    links: [{ label: "comparison pages", href: "/comparison" }],
  },
  {
    question:
      "What happens if Assembly's AI app builder builds something wrong that my clients could see?",
    shortQuestion: "What if Assembly's AI app builder builds something wrong?",
    answer:
      "Nothing reaches your clients until you've approved the plan and made the app visible to them. New apps stay hidden from clients by default while you test. If something needs fixing after launch, keep chatting with the app builder to change it.",
  },
  {
    question: "What is Assembly's AI app builder not good for building?",
    answer:
      "Public marketing websites. Assembly's AI app builder is built for apps people log into, meaning your team and your clients, not anonymous visitors on the open web. A public website is better built with a different tool and linked from inside your client experience.",
  },
  {
    question: "What is the best AI app builder for service businesses?",
    answer:
      "For a service business, the best AI app builder does more than generate a prototype: it comes with the pieces that make an app usable by a team or a paying client, meaning logins, permissions, branding, and a place for client data. Assembly is built for agencies, accounting and bookkeeping practices, law offices, and consultancies. Describe the app, or start from one of its templates, and Assembly builds a working app for your team or your clients with that layer already included.",
  },
  {
    question: "What's the best tool to vibe code an app for my clients?",
    answer:
      "General-purpose vibe coding tools like Lovable or Replit generate a working prototype at a separate URL that still has to be secured, hosted, and connected to client data before a customer can use it. Assembly's AI app builder is built for client-facing apps: describe the app, approve the plan, and it publishes into a branded client experience that comes with Assembly, with client logins and permissions already handled.",
  },
];
