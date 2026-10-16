import {
  IconAreaChart,
  IconChecks,
  IconFolder,
} from "@/components/home/mock-icons";
import {
  LoginsVisual,
  type LoginTool,
} from "@/components/solutions/accounting-logins-visual";

// ─────────────────────────────────────────────────────────────────────────
// "Stop scattering your deliverables across tools" — the marketing-agency
// page's problem picture. The accounting page's sign-in stack, with the three
// places its body copy names: feedback in one app, files in another, reports
// in a third. Each is a real tool an agency runs — the ones Advertai retired
// (see case-studies.ts) — on its own address, none of them the firm's front
// door. Named rather than invented: "Feedback" on a made-up host left the
// reader to guess what the picture was of. Our own glyphs, not their logos.
//
// Same component as the accounting page rather than a lookalike: the slot
// used to be a titled empty div, so the section rendered as heading, body,
// quote and a blank paper rectangle.
// ─────────────────────────────────────────────────────────────────────────

const TOOLS: LoginTool[] = [
  {
    name: "Markup.io",
    host: "app.markup.io",
    icon: <IconChecks className="size-[16px]" />,
  },
  {
    name: "Google Drive",
    host: "drive.google.com",
    icon: <IconFolder className="size-[16px]" />,
  },
  {
    name: "Keyword.com",
    host: "app.keyword.com",
    icon: <IconAreaChart className="size-[16px]" />,
  },
];

export function AgencyLoginsVisual() {
  return <LoginsVisual tools={TOOLS} />;
}
