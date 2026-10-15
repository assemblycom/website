import {
  IconCard,
  IconDocuments,
  IconApp,
  IconFolder,
} from "@/components/home/mock-icons";

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
// A STACK OF SIGN-IN PROMPTS over the tray's photograph, one per tool, each
// naming the tool and its host. See SignInPrompt.
// ─────────────────────────────────────────────────────────────────────────

/**
 * The four tools the body copy names, in its order, as Ledgerline's clients
 * meet them.
 *
 * Contracts, files, invoices — the sentence over the picture — plus the tax
 * organizer every accounting client fills in once a year. Each one is the
 * same firm on a different vendor's address: Ledgerline's name in four
 * places, none of them Ledgerline's own front door. That is the seam the body
 * copy says clients feel.
 */
const TOOLS = [
  {
    name: "Contracts",
    host: "ledgerline.contractly.com",
    icon: <IconDocuments className="size-[16px]" />,
  },
  {
    name: "Files",
    host: "ledgerline.filevault.io",
    icon: <IconFolder className="size-[16px]" />,
  },
  {
    name: "Invoices",
    host: "pay.ledgerline-billing.com",
    icon: <IconCard className="size-[16px]" />,
  },
  {
    name: "Tax organizer",
    host: "ledgerline.taxdesk.net",
    icon: <IconApp className="size-[16px]" />,
  },
];

/**
 * One tool's sign-in prompt: the tool, where it lives, and the button that
 * asks for a password again.
 *
 * The tiles this replaces were grey slabs with a lock in the middle — over a
 * photograph they read as blank panels rather than as anything a client
 * would meet. A prompt is the thing itself: four of them stacked is four
 * front doors, which is the heading's complaint.
 */
function SignInPrompt({ name, host, icon }: (typeof TOOLS)[number]) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-[var(--mock-window)] p-2 pr-3 shadow-[0_1px_2px_rgba(16,24,40,0.06),0_12px_28px_-14px_rgba(16,24,40,0.35)]">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[var(--mock-well-2)] text-[color:var(--mock-ink)] md:size-10">
        {icon}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className="truncate text-[13px] leading-none text-[color:var(--mock-ink)]">
          Sign in to {name}
        </span>
        <span className="truncate text-[12px] leading-none text-[color:var(--mock-ink-soft)]">
          {host}
        </span>
      </span>
      <span
        className={`shrink-0 rounded-[4px] border border-[var(--mock-line)] px-2.5 py-1.5 text-[11.5px] leading-none text-[color:var(--mock-ink)]`}
      >
        Sign in
      </span>
    </div>
  );
}

export function AccountingLoginsVisual() {
  return (
    <div
      aria-hidden
      // Centred on the tray's photograph, which carries the scene; the stack
      // is the one thing laid over it.
      className="flex h-full select-none flex-col justify-center gap-2.5 px-2 md:px-8"
    >
      {TOOLS.map((tool) => (
        <SignInPrompt key={tool.name} {...tool} />
      ))}
    </div>
  );
}
