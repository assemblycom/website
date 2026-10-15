import {
  IconCard,
  IconDocuments,
  IconEnvelope,
  IconFolder,
} from "@/components/home/mock-icons";
import { MOCK_MICRO, MOCK_SECONDARY } from "@/components/ui/mock-type";

// ─────────────────────────────────────────────────────────────────────────
// V2 — "Every tool you add is one more login", the accounting page's own
// picture, in the problem section's tray.
//
// The slot was held open with a titled empty div while the handoff's visuals
// were unbuilt, so the section rendered as a heading, a sentence, a quote and
// a grey rectangle where its argument should be.
//
// WHAT THE HANDOFF ASKS FOR AND WHAT IS DRAWN. The note on the slot describes
// four angled sign-in windows on the LEFT and one full-colour Ledgerline portal
// on the RIGHT. This page runs that section `split` — the picture takes half
// the rail and the Sargent quote takes the other half — so the two halves of
// that description would land at about 230px each, which is a thumbnail of a
// portal beside four thumbnails of sign-ins. The sign-ins are the half that
// matches the copy over it ("every tool you add is ONE MORE LOGIN"; "contracts
// in one place, files in another, invoices in a third"), and the portal that
// answers it is the next section's whole subject. So the picture is the pile,
// and the answer stays where the page already makes it.
//
// FOUR WINDOWS, ANGLED AND OVERLAPPING. Square to the grid they are four cards
// in a 2x2, which reads as a product matrix — four things on offer. Tipped a
// degree or two each and allowed to overlap, they are a pile of tabs someone
// is working through, which is the feeling the section is naming. The angles
// are small and all different: at five degrees it is a scrapbook, and at one
// shared angle it is a deck that has been rotated rather than a heap.
//
// They are all the SAME SIGN-IN, four times, and that is the argument. Four
// different screens would say the tools do different things, which nobody
// disputes. The same email field and the same password field under four
// different names is what "one more login" looks like.
// ─────────────────────────────────────────────────────────────────────────

const LINE = "border-[var(--mock-line)]";

/**
 * The four tools the body copy names, in its order.
 *
 * Contracts, files, invoices — the sentence over the picture — plus the mail
 * thread that ties them together, because that is where this actually happens.
 * The handoff's labels were Proposal / Drive / Invoice / Email; these are the
 * same four things named the way the paragraph above them names them, so a
 * reader is not matching two vocabularies across one section.
 */
const TOOLS = [
  {
    name: "Contracts",
    host: "app.contractly.com",
    icon: <IconDocuments className="size-[11px]" />,
    // Tipped, overlapped and dropped by different amounts each. The numbers
    // are not a pattern — a pile does not have one.
    //
    // FROM md ONLY. On a 375px phone the tray is the full measure and the
    // cards are about 150px wide, so a couple of degrees plus a few pixels of
    // translate pushed the outer two past the tray's padding and the first
    // card's "Sign in" was clipped by its edge. A phone gets a straight 2x2,
    // which at that size reads as a pile anyway because the cards are touching.
    tilt: "md:-rotate-[2.5deg]",
    nudge: "md:translate-y-[6px]",
  },
  {
    name: "Drive",
    host: "drive.google.com",
    icon: <IconFolder className="size-[11px]" />,
    tilt: "md:rotate-[1.75deg]",
    nudge: "md:-translate-y-[4px] md:-translate-x-[6px]",
  },
  {
    name: "Invoices",
    host: "billing.ledgerline.com",
    icon: <IconCard className="size-[11px]" />,
    tilt: "md:rotate-[2.25deg]",
    nudge: "md:-translate-y-[2px]",
  },
  {
    name: "Email",
    host: "mail.harbordental.com",
    icon: <IconEnvelope className="size-[11px]" />,
    tilt: "md:-rotate-[1.5deg]",
    nudge: "md:translate-y-[4px] md:-translate-x-[4px]",
  },
];

/** One tool's sign-in, drawn as the window it opens in. */
function SignIn({
  name,
  host,
  icon,
  tilt,
  nudge,
}: (typeof TOOLS)[number]) {
  return (
    <div
      className={`${tilt} ${nudge} flex flex-col overflow-hidden rounded-lg border bg-[var(--mock-window)] shadow-[0_1px_2px_rgba(16,24,40,0.04),0_14px_30px_-22px_rgba(16,24,40,0.3)] ${LINE} [[data-theme=dark]_&]:shadow-[0_14px_34px_-22px_rgba(0,0,0,0.6)]`}
    >
      {/* The window's own bar, with the host on it. The host is doing the
          work here: four names over four different domains is the sentence
          "contracts in one place, files in another" drawn rather than said. */}
      <div className={`flex items-center gap-1.5 border-b px-2.5 py-2 ${LINE}`}>
        <span className="flex shrink-0 items-center text-[color:var(--mock-ink-soft)]">
          {icon}
        </span>
        <span
          className={`shrink-0 text-[color:var(--mock-ink)] ${MOCK_MICRO}`}
        >
          {name}
        </span>
        <span
          className={`min-w-0 flex-1 truncate text-right text-[color:var(--mock-ink-soft)] ${MOCK_MICRO}`}
        >
          {host}
        </span>
      </div>

      {/* flex-1, so the card fills its row rather than sitting short in it —
          the grid stretches the frames either way, and a form floating at the
          top of a tall empty window read as a card that had not finished
          loading. The last line is pushed to the foot, which is where a sign-in
          puts it anyway. */}
      <div className="flex flex-1 flex-col gap-2 px-2.5 py-3">
        <span
          className={`text-[color:var(--mock-ink)] ${MOCK_SECONDARY}`}
        >
          Sign in
        </span>
        {/* Two empty fields and a button. No placeholder text in them: a field
            with an address already typed is a form someone is part way
            through, and the point is that this one is waiting, again. */}
        <span className={`h-[18px] rounded-[4px] border ${LINE}`} />
        <span className={`h-[18px] rounded-[4px] border ${LINE}`} />
        <span
          className={`mt-0.5 rounded-[4px] bg-[var(--mock-well-2)] py-[6px] text-center text-[color:var(--mock-ink-soft)] ${MOCK_MICRO}`}
        >
          Continue
        </span>
        <span
          className={`mt-auto pt-2 text-[color:var(--mock-ink-soft)] ${MOCK_MICRO}`}
        >
          Forgot password?
        </span>
      </div>
    </div>
  );
}

export function AccountingLoginsVisual() {
  return (
    <div
      aria-hidden
      title="Four small sign-in windows, tipped and overlapping: Contracts, Drive, Invoices and Email, each on its own host and each asking for an email and a password."
      // h-full inside the tray, which sets the height. The bottom row runs off
      // the tray's foot the way every screen in this family does — a pile that
      // ended tidily inside the frame would be four windows rather than the
      // "every tool you add" the heading is complaining about.
      className="grid h-full select-none grid-cols-2 gap-x-4 gap-y-5 pt-1"
    >
      {TOOLS.map((tool) => (
        <SignIn key={tool.name} {...tool} />
      ))}
    </div>
  );
}
