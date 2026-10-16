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
// in a third. Each is Brandmages on somebody else's address, none of them its
// own front door.
//
// Same component as the accounting page rather than a lookalike: the slot
// used to be a titled empty div, so the section rendered as heading, body,
// quote and a blank paper rectangle.
// ─────────────────────────────────────────────────────────────────────────

const TOOLS: LoginTool[] = [
  {
    name: "Feedback",
    host: "brandmages.proofly.io",
    icon: <IconChecks className="size-[16px]" />,
  },
  {
    name: "Files",
    host: "brandmages.filevault.io",
    icon: <IconFolder className="size-[16px]" />,
  },
  {
    name: "Reports",
    host: "reports.adtrackr.com",
    icon: <IconAreaChart className="size-[16px]" />,
  },
];

export function AgencyLoginsVisual() {
  return <LoginsVisual tools={TOOLS} />;
}
