// Template-gallery covers for the client-portal apps: each recreates the app's
// real screen at desktop size inside the shared cropped window, so the gallery
// shows the product itself rather than a drawing of it.
import { APP_BOX, APP_ICON, APP_LINE, DesktopMock, GlassCover } from "../app-window";

const PLUS_ICON = (
  <svg viewBox="0 0 24 24" className="size-4" {...APP_ICON} aria-hidden>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const SIDEBAR_ICON = (
  <svg viewBox="0 0 24 24" className="size-5 text-[#4B5563]" {...APP_ICON} aria-hidden>
    <rect x="3.5" y="5" width="17" height="14" rx="2" />
    <path d="M10 5v14" />
  </svg>
);

const CHEVRON_DOWN = (
  <svg viewBox="0 0 24 24" className="size-4 text-[#6B7280]" {...APP_ICON} aria-hidden>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const DOTS_BUTTON = (
  <span className={`${APP_BOX} size-9 text-[16px] leading-none`}>···</span>
);

/* ------------------------------------------------------------------ */
/* Calendar                                                            */
/* ------------------------------------------------------------------ */

const CAL_HOUR_H = 44;
const CAL_FIRST_HOUR = 3;
const CAL_HOURS = ["3 AM", "4 AM", "5 AM", "6 AM", "7 AM", "8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM"];
const CAL_DAYS = [
  { name: "Sun", date: 23 },
  { name: "Mon", date: 24 },
  { name: "Tue", date: 25 },
  { name: "Wed", date: 26 },
  { name: "Thu", date: 27 },
  { name: "Fri", date: 28 },
  { name: "Sat", date: 29 },
];
const CAL_TONES = {
  orange: "bg-[#D97706]",
  indigo: "bg-[#4F46E5]",
  gray: "bg-[#6B7280]",
};
const CAL_EVENTS: {
  day: number;
  start: number;
  end: number;
  title: string;
  time?: string;
  tone: keyof typeof CAL_TONES;
}[] = [
  { day: 1, start: 5.5, end: 5.9, title: "Weekly planning", tone: "gray" },
  { day: 1, start: 6, end: 7, title: "Team retro", time: "6:00 - 7:00 AM", tone: "gray" },
  { day: 1, start: 9, end: 11, title: "Client workshop, Acme Corp", time: "9:00 - 11:00 AM", tone: "orange" },
  { day: 1, start: 11.5, end: 13, title: "Budget review: Q4 projections", time: "11:30 - 1:00 PM", tone: "indigo" },
  { day: 2, start: 6, end: 7.5, title: "Resource planning session", time: "6:00 - 7:30 AM", tone: "indigo" },
  { day: 2, start: 10, end: 10.75, title: "Weekly status call, VentureLabs", time: "10:00 - 10:45 AM", tone: "gray" },
  { day: 3, start: 7, end: 8, title: "Code review, VentureLabs API", time: "7:00 - 8:00 AM", tone: "orange" },
  { day: 3, start: 10, end: 12, title: "Project kickoff: Summit Holdings", time: "10:00 - 12:00 PM", tone: "orange" },
  { day: 4, start: 10, end: 11.5, title: "Team retrospective", time: "10:00 - 11:30 AM", tone: "gray" },
  { day: 5, start: 6, end: 7, title: "Client feedback session, Bright Horizons", time: "6:00 - 7:00 AM", tone: "orange" },
  { day: 6, start: 9, end: 11, title: "Professional development, cloud architecture", time: "9:00 - 11:00 AM", tone: "indigo" },
];
const CAL_GRID = "grid grid-cols-[64px_repeat(7,1fr)]";

// Calendar: the week view as the team sees it, with events coloured by type.
export function CardCalendar() {
  return (
    <GlassCover
      photo="bg-[url(/images/mocks/client-calendar-ambient-dark.webp)] [[data-theme=dark]_&]:bg-[url(/images/mocks/client-calendar-ambient.webp)]"
      focus="bg-center"
      dim=""
      inset=""
      panel={false}
    >
      <DesktopMock>
        <div className="flex h-14 items-center gap-3 border-b border-[#E5E7EB] px-6 text-[15px] leading-none">
          {SIDEBAR_ICON}
          <span>Calendar</span>
          {CHEVRON_DOWN}
          <span className="ml-auto" />
          {DOTS_BUTTON}
          <span className="flex h-9 items-center gap-1.5 rounded-lg bg-[#1F2329] px-3.5 text-[14px] leading-none text-[#FFFFFF]">
            {PLUS_ICON}
            New event
          </span>
        </div>
        <div className="flex h-14 items-center gap-3 px-6 text-[14px] leading-none">
          <span className="text-[#6B7280]">‹</span>
          <span className="text-[#6B7280]">›</span>
          <span>Aug 23 to 29, 2026</span>
          <span className={`${APP_BOX} h-9 px-3 text-[13px] text-[#374151]`}>Today</span>
          <span className={`${APP_BOX} ml-auto h-9 gap-1.5 px-3 text-[13px] text-[#374151]`}>
            <svg viewBox="0 0 24 24" className="size-3.5" {...APP_ICON} aria-hidden>
              <path d="M4 7h16M7 12h10M10 17h4" />
            </svg>
            Filters
          </span>
          <span className="inline-flex rounded-lg bg-[#F1F2F4] p-1 text-[13px] leading-none">
            <span className="px-3 py-2 text-[#6B7280]">Month</span>
            <span className="rounded-md bg-[#FFFFFF] px-3 py-2">Week</span>
            <span className="px-3 py-2 text-[#6B7280]">Day</span>
          </span>
        </div>
        <div className={`mx-6 overflow-hidden rounded-t-xl border ${APP_LINE}`}>
          <div className={`${CAL_GRID} h-14 border-b border-[#E5E7EB] text-center text-[12px] leading-none text-[#6B7280]`}>
            <span />
            {CAL_DAYS.map((d) => (
              <span key={d.name} className="flex flex-col items-center justify-center gap-2 border-l border-[#E5E7EB]">
                {d.name}
                <span className="text-[14px]">{d.date}</span>
              </span>
            ))}
          </div>
          <div className={`${CAL_GRID} relative`}>
            <div>
              {CAL_HOURS.map((h) => (
                <div
                  key={h}
                  className="pr-3 pt-2 text-right text-[12px] leading-none text-[#6B7280]"
                  style={{ height: CAL_HOUR_H }}
                >
                  {h}
                </div>
              ))}
            </div>
            {CAL_DAYS.map((d, di) => (
              <div key={d.name} className="relative border-l border-[#E5E7EB]">
                {CAL_HOURS.map((h) => (
                  <div key={h} className="border-t border-[#F1F2F4]" style={{ height: CAL_HOUR_H }} />
                ))}
                {CAL_EVENTS.filter((e) => e.day === di).map((e) => (
                  <div
                    key={e.title}
                    className={`absolute inset-x-1 overflow-hidden rounded-[3px] px-2 py-1.5 text-[12px] leading-snug text-[#FFFFFF] ${CAL_TONES[e.tone]}`}
                    style={{
                      top: (e.start - CAL_FIRST_HOUR) * CAL_HOUR_H,
                      height: (e.end - e.start) * CAL_HOUR_H - 2,
                    }}
                  >
                    <div className="truncate font-medium">{e.title}</div>
                    {e.time && <div className="truncate text-[11px] opacity-90">{e.time}</div>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </DesktopMock>
    </GlassCover>
  );
}

/* ------------------------------------------------------------------ */
/* Client home                                                         */
/* ------------------------------------------------------------------ */

const HOME_NAV: { label: string; badge?: number; icon: string }[] = [
  { label: "Home", icon: "M3.5 11 12 4l8.5 7M6 10v9h12v-9" },
  { label: "Messages", badge: 1, icon: "M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H10l-4 3.5V16h0A2.5 2.5 0 0 1 4 13.5z" },
  { label: "Files", badge: 1, icon: "M7 3.5h6.5L18 8v12.5H7zM13 3.5V8h5" },
  { label: "Services", icon: "M4 6h16v5H4zM4 13h16v5H4z" },
  { label: "Payments", icon: "M3.5 6.5h17v11h-17zM3.5 10.5h17" },
  { label: "Tasks", icon: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" },
  { label: "Forms", icon: "M7 4.5h10v15H7zM10 4.5V3h4v1.5" },
  { label: "Contracts", icon: "M5 17c3-6 5 2 7-4s4 0 7-3M5 20h14" },
  { label: "Additional resources", icon: "M3.5 7.5h6l2 2h9v9h-17z" },
  { label: "Approvals", icon: "m5 12 5 5 9-10" },
];
const HOME_GUIDE = [
  { title: "Messages", body: "Chat with the BrandMages team or ask questions. Make sure to check the Helpdesk first for some FAQs.", icon: "M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H10l-4 3.5V16h0A2.5 2.5 0 0 1 4 13.5z" },
  { title: "Files", body: "Use this tab to share files with the BrandMages team. You can upload any required documents and assets here, and we will store files for future reference.", icon: "M7 3.5h6.5L18 8v12.5H7zM13 3.5V8h5" },
  { title: "Contracts", body: "View and sign contracts shared by our team.", icon: "M5 17c3-6 5 2 7-4s4 0 7-3M5 20h14" },
  { title: "Forms", body: "We have already shared our onboarding form with you. Please fill it out with all relevant information.", icon: "M7 4.5h10v15H7zM10 4.5V3h4v1.5" },
];

// Client home: the portal a client lands on, with the agency's branded
// sidebar and a welcome page. The dark gradient alternates with the light
// covers around it so no card is a dark square on the dark page.
export function CardHome() {
  return (
    <GlassCover
      photo="bg-[url(/images/mocks/client-home-ambient-dark.webp)] [[data-theme=dark]_&]:bg-[url(/images/mocks/client-home-ambient.webp)]"
      focus="bg-center"
      dim=""
      inset=""
      panel={false}
    >
      <DesktopMock>
        <div className="flex">
          <div className="h-[724px] w-[240px] shrink-0 bg-[#4A7A6B] px-2 pt-5 text-[14px] leading-none text-[#FFFFFF]">
            <div className="flex items-center gap-2.5 px-2 pb-5">
              <span className="flex size-8 items-center justify-center rounded-lg bg-[#FFFFFF] text-[13px] text-[#2F5E50]">b.</span>
              <span className="text-[15px]">BrandMages</span>
              <svg viewBox="0 0 24 24" className="size-4" {...APP_ICON} aria-hidden>
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
            {HOME_NAV.map((n) => (
              <div
                key={n.label}
                className={`flex h-10 items-center gap-3 rounded-lg px-2.5 ${n.label === "Home" ? "bg-[#5F8B7D]" : ""}`}
              >
                <svg viewBox="0 0 24 24" className="size-[18px]" {...APP_ICON} aria-hidden>
                  <path d={n.icon} />
                </svg>
                {n.label}
                {n.badge && (
                  <span className="ml-auto flex size-5 items-center justify-center rounded-md bg-[#FFFFFF] text-[11px] text-[#2F5E50]">
                    {n.badge}
                  </span>
                )}
              </div>
            ))}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex h-14 items-center border-b border-[#E5E7EB] px-8 text-[15px] leading-none">Home</div>
            <div className="px-8 pt-9">
              <div className="text-[24px] leading-none">Welcome, Betsy</div>
              <div className="mt-3 text-[14px] leading-none text-[#6B7280]">Here is what needs your attention today</div>
              <div className="relative mt-6 h-[170px] overflow-hidden rounded-xl bg-[#274F43]">
                <span className="absolute -left-6 top-6 h-32 w-44 rounded-full bg-[#3E7A62]" />
                <span className="absolute left-28 -top-10 h-36 w-52 rounded-full bg-[#2F6B58]" />
                <span className="absolute left-60 top-12 h-40 w-56 rounded-full bg-[#5B9A7C]" />
                <span className="absolute left-[420px] -top-8 h-40 w-48 rounded-full bg-[#33705A]" />
                <span className="absolute left-[560px] top-16 h-36 w-52 rounded-full bg-[#4A8A6E]" />
                <span className="absolute left-[700px] -top-10 h-40 w-48 rounded-full bg-[#2C6150]" />
                <span className="absolute -bottom-8 left-8 h-24 w-40 rounded-full bg-[#6FA98C]" />
              </div>
              <div className="mt-6 text-[20px] leading-none">Welcome, Betsy</div>
              <p className="mt-3 text-[14px] leading-6 text-[#374151]">
                Welcome to BrandMages, a full-service marketing agency that helps businesses increase their brand awareness, attract new customers, and grow their bottom line.
              </p>
              <div className="mt-8 text-[20px] leading-none">How to use our portal</div>
              <div className="mt-4 space-y-4">
                {HOME_GUIDE.map((g) => (
                  <div key={g.title}>
                    <div className="flex items-center gap-2 text-[14px] leading-none">
                      <svg viewBox="0 0 24 24" className="size-4 text-[#4A7A6B]" {...APP_ICON} aria-hidden>
                        <path d={g.icon} />
                      </svg>
                      {g.title}
                    </div>
                    <p className="mt-2 text-[14px] leading-6 text-[#374151]">{g.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DesktopMock>
    </GlassCover>
  );
}

/* ------------------------------------------------------------------ */
/* Messages                                                            */
/* ------------------------------------------------------------------ */

const MSG_STAFF = "bg-[#E8F4F0] text-[#2F7A64]";
const MSG_CLIENT = "bg-[#ECEEF9] text-[#4B55A8]";
const MSG_THREAD: { date: string; items: { initials: string; who: string; time: string; client: boolean; text: string }[] }[] = [
  {
    date: "September 18, 2025",
    items: [
      { initials: "LS", who: "Lauren Simpson", time: "1:34 PM", client: true, text: "Hi Sam, I have been hearing a lot about how important SEO is for businesses like mine, but I am not entirely sure how it works. Can you explain how BrandMages could help me improve my SEO and whether it is worth investing in?" },
      { initials: "SO", who: "Sam Ortega", time: "1:36 PM", client: false, text: "Absolutely, Lauren! SEO is all about improving your website's visibility on search engines like Google. For your business, we would focus on making sure potential customers can find you when they search for services you offer. This includes optimizing your website content, targeting the right keywords, improving your site's speed and mobile experience, and even building links to boost your credibility." },
    ],
  },
  {
    date: "September 20, 2025",
    items: [
      { initials: "LS", who: "Lauren Simpson", time: "1:34 PM", client: true, text: "That sounds interesting, but I am wondering what would make your approach different from any other SEO service out there?" },
      { initials: "SO", who: "Sam Ortega", time: "1:36 PM", client: false, text: "Great question! At BrandMages, we tailor everything to your specific business goals. We do not just implement generic strategies. For instance, we would start by understanding your target audience and what makes your business unique. Then, we would conduct an in-depth SEO audit to identify areas for improvement." },
    ],
  },
];
const MSG_RAIL_ICONS = [
  "M12 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM5 20c0-3.5 3-5.5 7-5.5s7 2 7 5.5",
  "M6 4h12v16H6zM9 9h6M9 13h4",
  "M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H10l-4 3.5V16h0A2.5 2.5 0 0 1 4 13.5z",
];

// Messages: a client conversation with the team, with the composer pinned to
// the foot of the thread and the record shortcuts down the right edge.
export function CardMessages() {
  return (
    <GlassCover
      photo="bg-[url(/images/mocks/messaging-app-ambient-dark.webp)] [[data-theme=dark]_&]:bg-[url(/images/mocks/messaging-app-ambient.webp)]"
      focus="bg-center"
      dim=""
      inset=""
      panel={false}
    >
      <DesktopMock>
        <div className="relative flex h-[724px]">
          <div className="min-w-0 flex-1">
            <div className="flex h-14 items-center border-b border-[#E5E7EB] px-6 text-[15px] leading-none">Messages</div>
            <div className="mx-auto max-w-[820px] px-2 pt-6">
              {MSG_THREAD.map((g) => (
                <div key={g.date}>
                  <div className="flex justify-center">
                    <span className={`rounded-md border ${APP_LINE} px-3 py-1.5 text-[12px] leading-none text-[#4B5563]`}>{g.date}</span>
                  </div>
                  <div className="mt-5 space-y-5 pb-6">
                    {g.items.map((m, i) => (
                      <div key={`${g.date}-${i}`} className="flex gap-3">
                        <span className={`flex size-9 shrink-0 items-center justify-center rounded-full text-[12px] leading-none ${m.client ? MSG_CLIENT : MSG_STAFF}`}>
                          {m.initials}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-baseline gap-2 text-[14px] leading-none">
                            {m.who}
                            <span className="text-[13px] text-[#6B7280]">{m.time}</span>
                          </div>
                          <p className="mt-2 text-[14px] leading-6 text-[#374151]">{m.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className={`absolute bottom-6 left-[190px] right-[190px] h-[84px] rounded-xl border ${APP_LINE} bg-[#FFFFFF] px-3.5 pt-3.5 text-[14px] leading-none text-[#9CA3AF]`}>
              Message your client
              <svg viewBox="0 0 24 24" className="absolute bottom-3.5 left-3.5 size-[18px]" {...APP_ICON} aria-hidden>
                <path d="m20 11-8 8a5 5 0 0 1-7-7l8.5-8.5a3.5 3.5 0 0 1 5 5L10 17a2 2 0 0 1-3-3l7-7" />
              </svg>
              <span className="absolute bottom-3 right-3 flex size-8 items-center justify-center rounded-md bg-[#F1F2F4] text-[#9CA3AF]">
                <svg viewBox="0 0 24 24" className="size-4" {...APP_ICON} aria-hidden>
                  <path d="M12 19V5M6 11l6-6 6 6" />
                </svg>
              </span>
            </div>
          </div>
          <div className="flex w-[52px] shrink-0 flex-col items-center gap-5 border-l border-[#E5E7EB] bg-[#F9FAFB] pt-4 text-[#6B7280]">
            <span className={`flex size-8 items-center justify-center rounded-full text-[11px] leading-none ${MSG_CLIENT}`}>LS</span>
            {MSG_RAIL_ICONS.map((d) => (
              <svg key={d} viewBox="0 0 24 24" className="size-[18px]" {...APP_ICON} aria-hidden>
                <path d={d} />
              </svg>
            ))}
          </div>
        </div>
      </DesktopMock>
    </GlassCover>
  );
}

/* ------------------------------------------------------------------ */
/* Files                                                               */
/* ------------------------------------------------------------------ */

const FILE_CHANNELS = [
  { initials: "NW", name: "Nora Webb, Dev Patel, Ivy Chen", note: "Nora uploaded 3 files", age: "Now", tint: "bg-[#E8F4F0] text-[#2F7A64]" },
  { initials: "DP", name: "Dev Patel", note: "Dev created a folder", age: "2d", tint: "bg-[#FBEAE0] text-[#B45A2A]" },
  { initials: "SH", name: "Samantha Hale", note: "Samantha added a file", age: "3d", tint: "bg-[#E4F1F6] text-[#2B7893]" },
  { initials: "RL", name: "Rory Lane, Doug Pierce", note: "Rory created a folder", age: "3d", tint: "bg-[#ECEEF9] text-[#4B55A8]" },
  { initials: "EC", name: "Emily Cho, Sarah Dunn", note: "Emily added a file", age: "3d", tint: "bg-[#F6E9F2] text-[#9A3F7C]" },
  { initials: "SN", name: "Steve Norris", note: "You created a folder", age: "2d", tint: "bg-[#F1F2F4] text-[#4B5563]" },
  { initials: "RP", name: "Raj Patel, Lisa Wong", note: "Raj reviewed presentation", age: "3d", tint: "bg-[#E8F4F0] text-[#2F7A64]" },
  { initials: "ML", name: "Mia Lowe, Anna Smith", note: "Mia scheduled a meeting", age: "2d", tint: "bg-[#FBEAE0] text-[#B45A2A]" },
  { initials: "SS", name: "Service Symphony", note: "You added a file", age: "1d", tint: "bg-[#E4F1F6] text-[#2B7893]" },
  { initials: "CG", name: "Chris Green, Olivia Taylor", note: "Chris added a file", age: "3d", tint: "bg-[#ECEEF9] text-[#4B55A8]" },
];
const FILE_ROWS = [
  { name: "Business_Registration_Certificate.pdf", ext: "PDF", on: "Mar 15, 2026 at 10:03" },
  { name: "Payroll_Report_Q1_2024.csv", ext: "CSV", on: "Mar 22, 2026 at 09:26" },
  { name: "Bank_Statements_Jan-Mar_2025.zip", ext: "ZIP", on: "Mar 11, 2026 at 08:02" },
  { name: "Sales_Receipts_Feb_2024.pdf", ext: "PDF", on: "Mar 10, 2026 at 12:39" },
  { name: "Office_Supply_Invoice_Staples_021524.pdf", ext: "PDF", on: "Mar 10, 2026 at 12:37" },
  { name: "Quarterly_Estimated_Tax_Payments_2025.csv", ext: "CSV", on: "Mar 29, 2026 at 15:49" },
  { name: "IRS_Notice_CP2000_Response.doc", ext: "DOC", on: "Mar 25, 2026 at 19:22" },
  { name: "Independent_Contractor_Agreement.doc", ext: "DOC", on: "Mar 20, 2026 at 14:39" },
  { name: "QuickBooks_Backup_2024.zip", ext: "ZIP", on: "Mar 13, 2026 at 17:34" },
  { name: "Loan_Agreement_SBA.pdf", ext: "PDF", on: "Mar 18, 2026 at 11:43" },
];
const FILE_COLS = "grid grid-cols-[1fr_230px_190px_40px] items-center gap-4";

// Files: a shared-files workspace with one channel per client on the left and
// that channel's files on the right. Initials stand in for the avatars.
export function CardFiles() {
  return (
    <GlassCover
      photo="bg-[url(/images/mocks/files-app-ambient-dark.webp)] [[data-theme=dark]_&]:bg-[url(/images/mocks/files-app-ambient.webp)]"
      focus="bg-center"
      dim=""
      inset=""
      panel={false}
    >
      <DesktopMock>
        <div className="flex h-14 items-center border-b border-[#E5E7EB] px-6 text-[15px] leading-none">Files</div>
        <div className="flex">
          <div className="w-[230px] shrink-0 border-r border-[#E5E7EB]">
            <div className="flex h-12 items-center gap-2 border-b border-[#E5E7EB] px-4 text-[14px] leading-none">
              Channels
              <span className="text-[#6B7280]">···</span>
              <svg viewBox="0 0 24 24" className="ml-auto size-[18px] text-[#4B5563]" {...APP_ICON} aria-hidden>
                <circle cx="11" cy="11" r="6.5" />
                <path d="m20 20-4.2-4.2" />
              </svg>
            </div>
            {FILE_CHANNELS.map((c, i) => (
              <div
                key={c.name}
                className={`flex h-[62px] items-center gap-3 border-b border-[#F1F2F4] px-4 ${i === 0 ? "bg-[#F7F8FA]" : ""}`}
              >
                <span className={`flex size-9 shrink-0 items-center justify-center rounded-full text-[11px] leading-none ${c.tint}`}>
                  {c.initials}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] leading-none">{c.name}</span>
                  <span className="mt-2 flex items-center gap-2 text-[12px] leading-none text-[#6B7280]">
                    <span className="truncate">{c.note}</span>
                    <span className="ml-auto shrink-0">{c.age}</span>
                  </span>
                </span>
              </div>
            ))}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex h-12 items-center gap-2 border-b border-[#E5E7EB] px-5 text-[14px] leading-none">
              Nora Webb, Dev Patel, Ivy Chen
              <span className={`${APP_BOX} ml-auto h-8 gap-1.5 px-3 text-[13px]`}>Search</span>
              <span className={`${APP_BOX} size-8 text-[14px] leading-none`}>···</span>
            </div>
            <div className={`${FILE_COLS} h-12 px-5 text-[13px] leading-none text-[#6B7280]`}>
              <span>Name</span>
              <span>Creator</span>
              <span>Shared on</span>
              <span />
            </div>
            {FILE_ROWS.map((f) => (
              <div key={f.name} className={`${FILE_COLS} h-[52px] border-t border-[#F1F2F4] px-5 text-[14px] leading-none`}>
                <span className="flex min-w-0 items-center gap-3">
                  <span className="relative flex h-6 w-5 shrink-0 items-center justify-center rounded-[3px] border border-[#374151]">
                    <span className="mt-2 text-[6px] leading-none text-[#374151]">{f.ext}</span>
                  </span>
                  <span className="truncate">{f.name}</span>
                </span>
                <span className="flex items-center gap-2.5">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#E8F4F0] text-[11px] leading-none text-[#2F7A64]">
                    NW
                  </span>
                  <span>
                    <span className="block text-[13px] leading-none">Nora Webb</span>
                    <span className="mt-1.5 block text-[12px] leading-none text-[#6B7280]">nora@brandmages.com</span>
                  </span>
                </span>
                <span className="text-[13px] text-[#4B5563]">{f.on}</span>
                <span className="text-[#6B7280]">···</span>
              </div>
            ))}
          </div>
        </div>
      </DesktopMock>
    </GlassCover>
  );
}

/* ------------------------------------------------------------------ */
/* Forms                                                               */
/* ------------------------------------------------------------------ */

const FORM_QUESTIONS: {
  title: string;
  kind: "radio" | "check";
  options: { label: string; on: boolean }[];
}[] = [
  {
    title: "When would you like to begin the project?",
    kind: "radio",
    options: [
      { label: "This month", on: true },
      { label: "Next month", on: false },
      { label: "Later this year", on: false },
    ],
  },
  {
    title: "What is your objective?",
    kind: "check",
    options: [
      { label: "Increase sales", on: true },
      { label: "Reduce costs", on: true },
      { label: "Improve NPS", on: false },
    ],
  },
];
const FORM_CARD = `rounded-xl border ${APP_LINE} bg-[#FFFFFF] px-5 py-5`;

// Forms: a client filling in an onboarding form, one question per card with
// the page chrome of the agency's branded form around it.
export function CardForms() {
  return (
    <GlassCover
      photo="bg-[url(/images/mocks/forms-app-ambient-dark.webp)] [[data-theme=dark]_&]:bg-[url(/images/mocks/forms-app-ambient.webp)]"
      focus="bg-center"
      dim=""
      inset=""
      panel={false}
    >
      <DesktopMock>
        <div className="h-[724px] bg-[#F9FAFB]">
          <div className="flex h-16 items-center gap-3 bg-[#FFFFFF] px-6 text-[15px] leading-none">
            <svg viewBox="0 0 24 24" className="size-5 text-[#374151]" {...APP_ICON} aria-hidden>
              <path d="m14 6-6 6 6 6" />
            </svg>
            <span className="flex size-8 items-center justify-center rounded-lg bg-[#E8F4F0] text-[12px] text-[#2F5E50]">b.</span>
            BrandMages
            <span className="ml-auto" />
            <span className={`${APP_BOX} h-9 px-4 text-[14px] text-[#1F2937]`}>Cancel</span>
            <span className="flex h-9 items-center rounded-lg bg-[#1F2329] px-4 text-[14px] leading-none text-[#FFFFFF]">Submit</span>
          </div>
          <div className="mx-auto mt-3 w-[560px] space-y-4">
            {FORM_QUESTIONS.map((q) => (
              <div key={q.title} className={FORM_CARD}>
                <div className="flex items-center justify-between text-[15px] leading-none">
                  {q.title}
                  <span className="text-[#B91C1C]">*</span>
                </div>
                <div className="mt-4 space-y-2.5">
                  {q.options.map((o) => (
                    <div key={o.label} className={`flex h-11 items-center gap-3 rounded-lg border ${APP_LINE} px-3 text-[14px] leading-none`}>
                      {q.kind === "radio" ? (
                        <span className="flex size-5 items-center justify-center rounded-full border border-[#9CA3AF]">
                          {o.on && <span className="size-3 rounded-full bg-[#1F2329]" />}
                        </span>
                      ) : (
                        <span className="flex size-5 items-center justify-center rounded-[4px] border border-[#9CA3AF]">
                          {o.on && <span className="size-3 rounded-[2px] bg-[#1F2329]" />}
                        </span>
                      )}
                      {o.label}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className={FORM_CARD}>
              <div className="text-[15px] leading-none">Would you like to share any additional information?</div>
              <div className={`mt-4 h-16 rounded-lg border ${APP_LINE} px-3 pt-3 text-[14px] leading-none`}>
                Looking forward to working together!
              </div>
            </div>
          </div>
        </div>
      </DesktopMock>
    </GlassCover>
  );
}
