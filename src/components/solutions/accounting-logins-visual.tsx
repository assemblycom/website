import {
  IconCard,
  IconDocuments,
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
 * The three tools the body copy names, in its order, as Ledgerline's clients
 * meet them: contracts, files, invoices — the sentence over the picture. Each
 * one is the same firm on a different vendor's address, none of them
 * Ledgerline's own front door. That is the seam the body copy says clients
 * feel. (A fourth, the tax organizer, made the stack fill the photograph.)
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
];

/**
 * One tool's sign-in prompt: the tool, where it lives, and the button that
 * asks for a password again.
 *
 * The tiles this replaces were grey slabs with a lock in the middle — over a
 * photograph they read as blank panels rather than as anything a client
 * would meet. A prompt is the thing itself: three of them stacked is three
 * front doors, which is the heading's complaint.
 */
/** One tool a client has to sign in to: its name, its address, its mark. */
export type LoginTool = { name: string; host: string; icon: React.ReactNode };

function SignInPrompt({
  name,
  host,
  icon,
  className = "",
}: LoginTool & { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 md:gap-3 rounded-[10px] bg-[var(--mock-window)] p-2 pr-3 ${className}`}>
      <span className="flex size-9 shrink-0 items-center justify-center rounded-[6px] bg-[var(--mock-well-2)] text-[color:var(--mock-ink)] md:size-10">
        {icon}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className="truncate text-[12.5px] leading-none md:text-[13.5px] text-[color:var(--mock-ink)]">
          Sign in to {name}
        </span>
        <span className="truncate text-[11.5px] leading-none text-[color:var(--mock-ink-soft)] md:text-[12.5px]">
          {host}
        </span>
      </span>
      <span
        className={`shrink-0 rounded-[4px] border border-[var(--mock-line)] bg-[var(--mock-well-2)] px-2.5 py-1.5 text-[11.5px] leading-none text-[color:var(--mock-ink)]`}
      >
        Sign in
      </span>
    </div>
  );
}

export function AccountingLoginsVisual() {
  return <LoginsVisual tools={TOOLS} />;
}

/**
 * The stack itself, for any page's set of tools — the marketing-agency page
 * runs the same picture with its own three (see agency-logins-visual.tsx).
 * One component so the two pages cannot drift into two versions of it.
 */
export function LoginsVisual({ tools }: { tools: LoginTool[] }) {
  return (
    <div
      aria-hidden
      // Centred on the tray's photograph, which carries the scene; the stack
      // is the one thing laid over it.
      //
      // Inset further on a phone (px-3, and a tighter gap inside each pill so
      // the longest host still sets whole). At px-2 the pills ran edge to edge,
      // so they read as bars across the photograph rather than prompts laid
      // on it; the wider inset keeps the scene showing either side.
      //
      // Capped and centred, because once the tray stacks full width on a
      // tablet the pills otherwise stretch into bars across the whole row.
      className="mx-auto flex h-full w-full max-w-[440px] select-none flex-col justify-center gap-2.5 px-3 md:px-8"
    >
      {/* THREE ON DESKTOP, TWO ON A PHONE. At phone width three prompts fill the whole
          photograph and it stops reading as a pile laid over a scene. Two
          still say "one more login", and the photograph gets room again. */}
      {tools.map((tool, i) => (
        <SignInPrompt
          key={tool.name}
          {...tool}
          className={i >= 2 ? "max-md:hidden" : ""}
        />
      ))}
    </div>
  );
}
