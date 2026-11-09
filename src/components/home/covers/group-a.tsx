// Template-gallery covers, group A: each draws the template's own app screen in
// a cropped desktop window on its gradient, the same way the hero cards do.
import { APP_BOX, APP_ICON, APP_LINE, AppSearch, DesktopMock, GlassCover } from "../app-window";

const BAR = "flex h-14 items-center gap-3 border-b border-[#E5E7EB] px-6 text-[15px] leading-none";
const PRIMARY_BTN = "flex h-9 items-center gap-1.5 rounded-lg bg-[#1F2329] px-3.5 text-[14px] leading-none text-[#FFFFFF]";

// The sidebar-panel glyph every app's top bar starts with.
function PanelIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 text-[#4B5563]" {...APP_ICON} aria-hidden>
      <rect x="3.5" y="5" width="17" height="14" rx="2" />
      <path d="M10 5v14" />
    </svg>
  );
}

function Chevron({ dir = "right" }: { dir?: "right" | "down" }) {
  return (
    <svg viewBox="0 0 24 24" className="size-3.5 text-[#9CA3AF]" {...APP_ICON} aria-hidden>
      <path d={dir === "right" ? "m9 6 6 6-6 6" : "m6 9 6 6 6-6"} />
    </svg>
  );
}

function Avatar({ initials, tint = "bg-[#ECEEF9] text-[#4B55A8]", size = "size-7" }: { initials: string; tint?: string; size?: string }) {
  return (
    <span className={`flex ${size} shrink-0 items-center justify-center rounded-full text-[10px] leading-none ${tint}`}>
      {initials}
    </span>
  );
}

// Conditional forms: the form builder's Design tab, settings on the left and the
// live preview of the payroll form on the right.
const FORM_FIELDS = [
  { label: "Pay frequency", required: true },
  { label: "Number of employees to set up", required: true },
  { label: "Current payroll provider, if any", required: false },
  { label: "Do you need help registering for state unemployment insurance?", required: false },
];

function CardConditionalForms() {
  return (
    <GlassCover
      photo="bg-[url(/images/mocks/conditional-forms-ambient-dark.webp)] [[data-theme=dark]_&]:bg-[url(/images/mocks/conditional-forms-ambient.webp)]"
      focus="bg-center"
      dim=""
      inset=""
      panel={false}
    >
      <DesktopMock>
        <div className={BAR}>
          <PanelIcon />
          <span className="text-[#6B7280]">Conditional form</span>
          <Chevron />
          <span className="text-[#6B7280]">Templates</span>
          <Chevron />
          <span>Payroll setup checklist</span>
          <span className={`ml-auto ${PRIMARY_BTN}`}>
            <svg viewBox="0 0 24 24" className="size-4" {...APP_ICON} aria-hidden>
              <path d="m5 12 5 5 9-10" />
            </svg>
            Save
          </span>
        </div>
        <div className="px-6 pt-5">
          <span className="inline-flex rounded-lg bg-[#F1F2F4] p-1 text-[14px] leading-none">
            <span className="px-3 py-2 text-[#6B7280]">Questions</span>
            <span className="rounded-md bg-[#FFFFFF] px-3 py-2">Design</span>
          </span>
        </div>
        <div className="flex gap-6 px-6 pt-5">
          <div className={`w-[290px] shrink-0 rounded-xl border ${APP_LINE}`}>
            <div className="px-4 py-4">
              <div className="text-[13px] leading-none text-[#6B7280]">Colors</div>
              <div className="mt-4 text-[14px] leading-none">Accent color</div>
              <div className="mt-3 flex gap-2">
                <span className="size-10 shrink-0 rounded-lg border border-[#E5E7EB] bg-[#D97706]" />
                <span className={`flex h-10 flex-1 items-center rounded-lg border ${APP_LINE} px-3 text-[13px] leading-none text-[#4B5563]`}>#D97706</span>
              </div>
              <div className="mt-4 text-[14px] leading-none">Background</div>
              <div className="mt-3 flex gap-2">
                <span className="size-10 shrink-0 rounded-lg border border-[#E5E7EB] bg-[#F8FAFC]" />
                <span className={`flex h-10 flex-1 items-center rounded-lg border ${APP_LINE} px-3 text-[13px] leading-none text-[#4B5563]`}>#F8FAFC</span>
              </div>
            </div>
            <div className="border-t border-[#E5E7EB] px-4 py-4">
              <div className="text-[13px] leading-none text-[#6B7280]">Banner</div>
              <div className="mt-3 h-[72px] w-[130px] rounded-md bg-[linear-gradient(135deg,#E9E6E1,#CFCBC4)]" />
              <div className="mt-3 text-[13px] leading-none text-[#6B7280]">Remove</div>
              <div className="mt-4 text-[14px] leading-none">Height</div>
              <div className="mt-3 flex gap-2 text-[13px] leading-none">
                {["Small", "Medium", "Large"].map((s) => (
                  <span
                    key={s}
                    className={`rounded-md border px-3 py-2 ${s === "Medium" ? "border-[#1F2329] bg-[#1F2329] text-[#FFFFFF]" : "border-[#E5E7EB] text-[#4B5563]"}`}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="border-t border-[#E5E7EB] px-4 py-4">
              <div className="text-[13px] leading-none text-[#6B7280]">Spacing</div>
              <div className="mt-4 flex items-center justify-between text-[14px] leading-none">
                Content padding <span className="text-[13px] text-[#6B7280]">36px</span>
              </div>
              <div className="relative mt-4 h-1 rounded-full bg-[#E5E7EB]">
                <span className="absolute inset-y-0 left-0 w-[40%] rounded-full bg-[#1F2329]" />
                <span className="absolute left-[40%] top-1/2 size-3.5 -translate-y-1/2 rounded-full border-2 border-[#4B55A8] bg-[#FFFFFF]" />
              </div>
            </div>
          </div>
          <div className={`min-w-0 flex-1 rounded-xl border ${APP_LINE}`}>
            <div className="flex h-11 items-center border-b border-[#E5E7EB] px-4 text-[13px] leading-none">
              <span className="text-[#6B7280]">Live preview</span>
              <span className="ml-auto flex items-center gap-1.5 rounded-md border border-[#E5E7EB] px-2.5 py-2 text-[12px]">
                <svg viewBox="0 0 24 24" className="size-3.5" {...APP_ICON} aria-hidden>
                  <rect x="3" y="4" width="18" height="12" rx="2" />
                  <path d="M9 20h6M12 16v4" />
                </svg>
                Desktop
              </span>
              <span className="ml-3 flex items-center gap-1.5 text-[12px] text-[#6B7280]">
                <svg viewBox="0 0 24 24" className="size-3.5" {...APP_ICON} aria-hidden>
                  <rect x="7" y="3" width="10" height="18" rx="2" />
                </svg>
                Mobile
              </span>
            </div>
            <div className="bg-[#F8FAFC] p-4">
              <div className="h-12 rounded-t-md bg-[linear-gradient(135deg,#E9E6E1,#CFCBC4)]" />
              <div className="-mt-2 rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] px-6 py-5">
                <div className="text-[16px] leading-none">Payroll setup checklist</div>
                <div className="mt-3 border-b border-[#E5E7EB] pb-4 text-[12px] leading-none text-[#6B7280]">
                  A few quick details so we can get payroll running for your team.
                </div>
                {FORM_FIELDS.map((f) => (
                  <div key={f.label} className="mt-5">
                    <div className="text-[14px] leading-none">
                      {f.label}
                      {f.required && <span className="text-[#D92D20]"> *</span>}
                    </div>
                    <div className="mt-2.5 h-10 rounded-md border border-[#E5E7EB]" />
                  </div>
                ))}
                <div className="mt-5 text-[14px] leading-none">Voided check for direct deposit setup</div>
                <div className="mt-2.5 flex h-12 items-center justify-center rounded-md border border-dashed border-[#D1D5DB] text-[13px] leading-none text-[#6B7280]">
                  Upload file
                </div>
              </div>
            </div>
          </div>
        </div>
      </DesktopMock>
    </GlassCover>
  );
}

// Events and RSVPs: the upcoming-events list, each event a card with its date,
// type, details and a going / maybe / can't go reply row.
const EVENT_TAGS = {
  Webinar: "bg-[#E8F0FE] text-[#2F5BB7]",
  Meetup: "bg-[#ECEBFA] text-[#5B4BB5]",
  Training: "bg-[#FCE8EC] text-[#B4325A]",
};

const EVENTS: {
  month: string;
  day: string;
  title: string;
  tag: keyof typeof EVENT_TAGS;
  when: string;
  where: string;
  place: "virtual" | "venue";
  going: string;
  blurb: string;
}[] = [
  {
    month: "Sep",
    day: "2",
    title: "Q3 platform roadmap webinar",
    tag: "Webinar",
    when: "Wed, Sep 2, 11:00 AM - 12:00 PM EDT",
    where: "Virtual",
    place: "virtual",
    going: "10 going · 190 spots left",
    blurb: "What shipped in Q2, what is landing in Q3, and what moved. Thirty minutes of walkthrough and thirty of questions.",
  },
  {
    month: "Sep",
    day: "15",
    title: "Autumn customer meetup, Austin",
    tag: "Meetup",
    when: "Tue, Sep 15, 6:00 PM - 8:30 PM CDT",
    where: "Fair Market, 1100 E 5th St, Austin",
    place: "venue",
    going: "5 going · 75 spots left",
    blurb: "Second meetup of the year. Two short customer talks, then food and open discussion.",
  },
  {
    month: "Sep",
    day: "22",
    title: "Partner enablement briefing",
    tag: "Training",
    when: "Tue, Sep 22, 11:00 AM - 12:30 PM EDT",
    where: "Virtual",
    place: "virtual",
    going: "5 going · 45 spots left",
    blurb: "Enablement session for referral partners: the partner portal, deal registration, and how co-selling engagements are staffed.",
  },
  {
    month: "Sep",
    day: "29",
    title: "Year-end tax planning briefing",
    tag: "Webinar",
    when: "Tue, Sep 29, 12:00 PM - 1:00 PM EDT",
    where: "Virtual",
    place: "virtual",
    going: "4 going · 116 spots left",
    blurb: "Timing, documentation and the deadlines that catch people out. Slides circulated in advance.",
  },
];

function CardEvents() {
  return (
    <GlassCover photo="bg-[url(/images/mocks/events-rsvps-ambient-dark.webp)] [[data-theme=dark]_&]:bg-[url(/images/mocks/events-rsvps-ambient.webp)]" focus="bg-center" dim="" inset="" panel={false}>
      <DesktopMock>
        <div className={BAR}>
          <PanelIcon />
          <span>Events & RSVPs</span>
        </div>
        <div className="mx-auto w-[840px] pt-6">
          <div className="flex items-center justify-between">
            <span className="inline-flex rounded-lg bg-[#F1F2F4] p-1 text-[14px] leading-none">
              <span className="rounded-md bg-[#FFFFFF] px-3 py-2">Upcoming</span>
              <span className="px-3 py-2 text-[#6B7280]">Past</span>
            </span>
            <span className="inline-flex rounded-lg bg-[#F1F2F4] p-1">
              <span className="rounded-md bg-[#FFFFFF] p-1.5">
                <svg viewBox="0 0 24 24" className="size-4" {...APP_ICON} aria-hidden>
                  <rect x="4" y="4" width="6" height="6" rx="1" />
                  <rect x="4" y="14" width="6" height="6" rx="1" />
                  <path d="M14 7h6M14 17h6" />
                </svg>
              </span>
              <span className="p-1.5 text-[#6B7280]">
                <svg viewBox="0 0 24 24" className="size-4" {...APP_ICON} aria-hidden>
                  <rect x="4" y="5" width="16" height="15" rx="2" />
                  <path d="M4 10h16M9 3v4M15 3v4" />
                </svg>
              </span>
            </span>
          </div>
          {EVENTS.map((e) => (
            <div key={e.title} className={`mt-4 overflow-hidden rounded-xl border ${APP_LINE}`}>
              <div className="flex gap-4 px-5 py-4">
                <span className="flex size-[52px] shrink-0 flex-col items-center justify-center gap-1 rounded-lg border border-[#E5E7EB] leading-none">
                  <span className="text-[10px] text-[#6B7280]">{e.month}</span>
                  <span className="text-[15px]">{e.day}</span>
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[15px] leading-none">{e.title}</div>
                  <div className="mt-2.5 flex items-center gap-3 text-[13px] leading-none text-[#4B5563]">
                    <span className={`rounded-full px-2.5 py-1.5 text-[12px] ${EVENT_TAGS[e.tag]}`}>{e.tag}</span>
                    <span className="whitespace-nowrap">{e.when}</span>
                    <span className="flex items-center gap-1.5 whitespace-nowrap">
                      <svg viewBox="0 0 24 24" className="size-4 text-[#6B7280]" {...APP_ICON} aria-hidden>
                        {e.place === "virtual" ? (
                          <>
                            <rect x="3" y="6" width="12" height="12" rx="2" />
                            <path d="m15 11 6-3v8l-6-3" />
                          </>
                        ) : (
                          <>
                            <path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11z" />
                            <circle cx="12" cy="10" r="2.5" />
                          </>
                        )}
                      </svg>
                      {e.where}
                    </span>
                  </div>
                  <div className="mt-2.5 flex items-center gap-1.5 text-[13px] leading-none text-[#4B5563]">
                    <svg viewBox="0 0 24 24" className="size-4 text-[#6B7280]" {...APP_ICON} aria-hidden>
                      <circle cx="9" cy="8" r="3.5" />
                      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 5a3.5 3.5 0 0 1 0 7M21 20c0-2.6-1.7-4.8-4-5.6" />
                    </svg>
                    {e.going}
                  </div>
                  <div className="mt-2.5 text-[13px] leading-snug text-[#6B7280]">{e.blurb}</div>
                </div>
              </div>
              <div className="flex h-14 items-center justify-between border-t border-[#E5E7EB] bg-[#F9FAFB] px-5 text-[14px] leading-none">
                <span className="flex items-center gap-2.5">
                  <svg viewBox="0 0 24 24" className="size-[18px] text-[#4B5563]" {...APP_ICON} aria-hidden>
                    <rect x="4" y="5" width="16" height="15" rx="2" />
                    <path d="M4 10h16M9 3v4M15 3v4" />
                  </svg>
                  Will you be there?
                </span>
                <span className="flex overflow-hidden rounded-md border border-[#E5E7EB] bg-[#FFFFFF] text-[13px]">
                  {["Going", "Maybe", "Can't go"].map((r, i) => (
                    <span key={r} className={`px-3 py-2 ${i > 0 ? "border-l border-[#E5E7EB]" : ""}`}>
                      {r}
                    </span>
                  ))}
                </span>
              </div>
            </div>
          ))}
        </div>
      </DesktopMock>
    </GlassCover>
  );
}

// Markup and comments: a client reviewing a contract draft, with page
// thumbnails, the document itself and the comment box alongside.
const MARKUP_PAGE_LINES = [92, 100, 88, 100, 96, 70, 100, 90, 100, 84, 60];

function CardMarkup() {
  return (
    <GlassCover
      photo="bg-[url(/images/mocks/markup-comments-ambient-dark.webp)] [[data-theme=dark]_&]:bg-[url(/images/mocks/markup-comments-ambient.webp)]"
      focus="bg-center"
      dim=""
      inset=""
      panel={false}
    >
      <DesktopMock>
        <div className={BAR}>
          <PanelIcon />
          <span className="text-[#6B7280]">Markup & comments</span>
          <Chevron />
          <span>Website</span>
        </div>
        <div className="flex items-center gap-4 px-5 pt-4 text-[14px] leading-none">
          <span className={`flex h-9 items-center gap-2 rounded-lg border ${APP_LINE} px-3`}>
            Version 2
            <Chevron dir="down" />
          </span>
          <span className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[#F59E0B]" />
            Changes requested
          </span>
          <span className="ml-auto text-[#6B7280]">
            <svg viewBox="0 0 24 24" className="size-[18px]" {...APP_ICON} aria-hidden>
              <path d="M7 3h7l4 4v14H7z" />
              <path d="M14 3v4h4M10 12h5M10 16h5" />
            </svg>
          </span>
        </div>
        <div className="mx-5 mt-4 border-l-2 border-[#E5E7EB] pl-3">
          <div className="text-[13px] leading-none text-[#6B7280]">Instructions from the team</div>
          <div className="mt-2.5 text-[14px] leading-none text-[#6B7280]">Hey! Please review today. Thank you.</div>
        </div>
        <div className="mx-5 mt-4 rounded-lg bg-[#F1F2F4] px-4 py-3.5 text-[14px] leading-none text-[#6B7280]">
          You have requested changes. The team is working on a new version. You can still add comments and reply here.
        </div>
        <div className="flex gap-4 px-5 pt-5">
          <div className="w-[56px] shrink-0 space-y-3">
            {[1, 2].map((n) => (
              <div key={n} className={`rounded-md border ${APP_LINE} p-1.5`}>
                <div className="space-y-1 pb-1.5">
                  <div className="mx-auto h-1 w-8 rounded-full bg-[#9CA3AF]" />
                  {MARKUP_PAGE_LINES.slice(0, 6).map((w, i) => (
                    <div key={i} className="h-0.5 rounded-full bg-[#D1D5DB]" style={{ width: `${w}%` }} />
                  ))}
                </div>
                <div className="text-right text-[9px] leading-none text-[#6B7280]">{n}</div>
              </div>
            ))}
          </div>
          <div className={`min-w-0 flex-1 rounded-lg border ${APP_LINE} bg-[#F9FAFB] px-6 pt-6`}>
            <div className="h-[420px] bg-[#FFFFFF] px-16 pt-12 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
              <div className="text-center text-[22px] leading-none">Website Development Agreement</div>
              <p className="mt-8 text-[13px] leading-6">
                This Agreement (&quot;Agreement&quot;) is entered into as of the Effective Date set forth below, by and between Pixel Forge Web Studio (&quot;Service Provider&quot;)
                and Harborview Dental Partners (&quot;Client&quot;), collectively referred to as the &quot;Parties.&quot;
              </p>
              <div className="mt-6 flex gap-10 px-8 text-[12px] leading-none text-[#4B5563]">
                <span>Effective Date: [EFFECTIVE DATE]</span>
                <span>Agreement No.: [AGREEMENT NUMBER]</span>
              </div>
              <div className="mt-8 text-[16px] leading-none">1. Scope of Work</div>
              <p className="mt-3 text-[13px] leading-6">
                Service Provider shall design, develop, and deliver a responsive website for Client consisting of up to eight (8) pages, a content management system, and
                mobile optimization, as detailed in the Statement of Work (Exhibit A).
              </p>
            </div>
          </div>
          <div className="w-[270px] shrink-0">
            <div className="text-[14px] leading-none">Comments</div>
            <div className={`mt-4 flex h-[88px] flex-col justify-between rounded-lg border ${APP_LINE} p-3`}>
              <span className="text-[13px] leading-snug">Thanks for getting these done so quickly!</span>
              <span className="flex size-7 items-center justify-center self-end rounded-md bg-[#1F2329] text-[#FFFFFF]">
                <svg viewBox="0 0 24 24" className="size-4" {...APP_ICON} aria-hidden>
                  <path d="M12 19V5M6 11l6-6 6 6" />
                </svg>
              </span>
            </div>
            <div className="mt-3 text-[12px] leading-snug text-[#6B7280]">Or click anywhere on the file to comment on a specific spot.</div>
          </div>
        </div>
      </DesktopMock>
    </GlassCover>
  );
}

// Internal communications: the team chat on its general channel, with the
// channel list beside the message thread and composer.
const CHAT_CHANNELS: { name: string; unread?: number; active?: boolean }[] = [
  { name: "announcements" },
  { name: "audit-riverside" },
  { name: "bookkeeping" },
  { name: "client-onboarding", unread: 1 },
  { name: "general", active: true },
  { name: "irs-notices", unread: 3 },
  { name: "payroll" },
  { name: "random", unread: 1 },
  { name: "tax-season", unread: 6 },
  { name: "wins" },
];

const CHAT_MESSAGES: { initials: string; tint: string; who: string; time: string; body: React.ReactNode; reactions: number[] }[] = [
  {
    initials: "ML",
    tint: "bg-[#ECEEF9] text-[#4B55A8]",
    who: "Maya Lin",
    time: "7:36 AM",
    body: (
      <>
        All-hands moved to <span>Thursday 3pm</span> so it doesn&apos;t collide with the 9/15 review block. Short agenda: extension season status, the Q4 advisory push, and one
        staffing announcement.
      </>
    ),
    reactions: [4, 1],
  },
  {
    initials: "SO",
    tint: "bg-[#FBF1DC] text-[#9A6B12]",
    who: "Sam Ortega",
    time: "11:31 AM",
    body: "Portal maintenance window is Saturday 6am-8am Pacific. Client uploads will be unavailable during that time, so if you're expecting documents this weekend, tell the client to send them Friday.",
    reactions: [1, 1],
  },
  {
    initials: "TQ",
    tint: "bg-[#E8F4F0] text-[#2F7A64]",
    who: "Tara Quinn",
    time: "12:25 PM",
    body: "Someone restocked the good coffee. I don't know who but I owe them.",
    reactions: [1, 3],
  },
];

function CardInternalComms() {
  return (
    <GlassCover photo="bg-[url(/images/mocks/internal-communications-app-ambient-dark.webp)] [[data-theme=dark]_&]:bg-[url(/images/mocks/internal-communications-app-ambient.webp)]" focus="bg-center" dim="" inset="" panel={false}>
      <DesktopMock>
        <div className={BAR}>
          <PanelIcon />
          <span>Team Talk</span>
          <Chevron dir="down" />
          <span className={`${APP_BOX} ml-auto size-9 text-[16px] leading-none`}>···</span>
        </div>
        <div className="flex">
          <div className="w-[240px] shrink-0 border-r border-[#E5E7EB] px-3.5 pt-4">
            <AppSearch placeholder="Find a conversation..." />
            <div className="mt-5 space-y-1 text-[14px] leading-none text-[#374151]">
              {["Threads", "Mentions", "Saved"].map((t) => (
                <div key={t} className="flex h-9 items-center gap-2.5 px-2">
                  <svg viewBox="0 0 24 24" className="size-[18px] text-[#6B7280]" {...APP_ICON} aria-hidden>
                    <rect x="4" y="5" width="16" height="12" rx="2" />
                    <path d="M9 21l3-4" />
                  </svg>
                  {t}
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between px-2 text-[13px] leading-none text-[#6B7280]">
              Channels
              <svg viewBox="0 0 24 24" className="size-4" {...APP_ICON} aria-hidden>
                <path d="M12 5v14M5 12h14" />
              </svg>
            </div>
            <div className="mt-2.5 space-y-0.5">
              {CHAT_CHANNELS.map((c) => (
                <div
                  key={c.name}
                  className={`flex h-9 items-center gap-2 rounded-md px-2 text-[14px] leading-none ${c.active ? "bg-[#EEF2FB]" : ""} ${c.unread ? "text-[#1F2937]" : "text-[#6B7280]"}`}
                >
                  <span className="text-[#6B7280]">#</span>
                  {c.name}
                  {c.unread && (
                    <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FCE8E6] px-1.5 text-[11px] text-[#B3382C]">{c.unread}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex h-12 items-center gap-2 border-b border-[#E5E7EB] px-5 text-[14px] leading-none">
              <span className="text-[#6B7280]">#</span>
              general
              <span className="text-[13px] text-[#6B7280]">Firm-wide chatter. Deadlines, coverage, and coffee.</span>
              <span className="ml-auto text-[13px] text-[#2F4BB5]">Edit</span>
              <span className="rounded-full border border-[#E5E7EB] px-2.5 py-1.5 text-[12px] text-[#4B5563]">21</span>
            </div>
            <div className="px-5 pt-4">
              <div className={`flex h-10 items-center rounded-lg border ${APP_LINE} px-3 text-[13px] leading-none text-[#9CA3AF]`}>Filter messages...</div>
              <div className="mt-4 flex items-center gap-4 text-[12px] leading-none text-[#6B7280]">
                <span className="h-px flex-1 bg-[#E5E7EB]" />
                <span className="rounded-full border border-[#E5E7EB] px-3 py-1.5">Today</span>
                <span className="h-px flex-1 bg-[#E5E7EB]" />
              </div>
              {CHAT_MESSAGES.map((m) => (
                <div key={m.who} className="mt-4 flex gap-3">
                  <Avatar initials={m.initials} tint={m.tint} size="size-10" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2 text-[14px] leading-none">
                      {m.who}
                      <span className="text-[12px] text-[#6B7280]">{m.time}</span>
                    </div>
                    <div className="mt-2 text-[14px] leading-snug text-[#374151]">{m.body}</div>
                    <div className="mt-2.5 flex gap-1.5">
                      {m.reactions.map((n, i) => (
                        <span key={i} className="flex items-center gap-1.5 rounded-full border border-[#E5E7EB] px-2.5 py-1 text-[12px] leading-none text-[#4B5563]">
                          <span className="size-2 rounded-full bg-[#F2B53A]" />
                          {n}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              <div className={`mt-5 overflow-hidden rounded-lg border ${APP_LINE}`}>
                <div className="flex h-10 items-center gap-4 border-b border-[#E5E7EB] px-3.5 text-[13px] leading-none text-[#4B5563]">
                  <span>B</span>
                  <span>I</span>
                  <span>{"</>"}</span>
                </div>
                <div className="h-16 px-3.5 pt-3 text-[13px] leading-none text-[#9CA3AF]">Message...</div>
              </div>
            </div>
          </div>
        </div>
      </DesktopMock>
    </GlassCover>
  );
}

// Team guides: the internal resource library as a card grid, with pinned items
// and category counts in the sidebar.
const GUIDE_PINNED = ["Onboarding docs for Jordan", "Incident response playbook", "Client onboarding checklist", "Q3 2026 pricing sheet", "Brand guidelines and logo pack"];

const GUIDE_BROWSE: [string, number][] = [
  ["All resources", 22],
  ["Onboarding", 4],
  ["Templates", 3],
  ["Brand assets", 2],
  ["Sales", 3],
  ["Engineering", 2],
  ["Policies", 3],
];

const GUIDE_CARDS: { tag: string; title: string; blurb: string; owner: string; initials: string; pinned?: boolean }[] = [
  { tag: "Onboarding", title: "Onboarding docs for Jordan", blurb: "Everything a new hire needs in week one", owner: "Maya Lin", initials: "ML", pinned: true },
  { tag: "Policies", title: "Incident response playbook", blurb: "Approved playbook for security and...", owner: "Sam Ortega", initials: "SO", pinned: true },
  { tag: "Onboarding", title: "Client onboarding checklist", blurb: "Step-by-step checklist for bringing a...", owner: "Leo Hart", initials: "LH", pinned: true },
  { tag: "Brand assets", title: "Brand guidelines and logo pack", blurb: "Full logo set in SVG, PNG and EPS with...", owner: "Tara Quinn", initials: "TQ", pinned: true },
  { tag: "Engineering", title: "Deployment runbook", blurb: "Pre-flight checks, migration ordering,...", owner: "Priya Raman", initials: "PR" },
  { tag: "Sales", title: "Case study, Cascade Outdoor Co.", blurb: "Write-up of the Cascade Outdoor Co....", owner: "Ari Cole", initials: "AC" },
  { tag: "Templates", title: "Statement of work template", blurb: "Standard SOW with scope, deliverable...", owner: "Maya Lin", initials: "ML" },
  { tag: "Sales", title: "Discovery call script", blurb: "Question framework for first calls...", owner: "Leo Hart", initials: "LH" },
  { tag: "Legal", title: "Mutual NDA, current template", blurb: "The mutual NDA reviewed by outside...", owner: "Sam Ortega", initials: "SO" },
  { tag: "Policies", title: "Remote work and equipment policy", blurb: "Eligibility, core collaboration hours, the...", owner: "Priya Raman", initials: "PR" },
  { tag: "Brand assets", title: "Brand voice and tone guide", blurb: "How we sound in proposals, support...", owner: "Tara Quinn", initials: "TQ" },
  { tag: "Onboarding", title: "New client kickoff agenda", blurb: "A 60-minute kickoff structure:...", owner: "Ari Cole", initials: "AC" },
];

function CardTeamGuides() {
  return (
    <GlassCover
      photo="bg-[url(/images/mocks/internal-resource-library-ambient-dark.webp)] [[data-theme=dark]_&]:bg-[url(/images/mocks/internal-resource-library-ambient.webp)]"
      focus="bg-center"
      dim=""
      inset=""
      panel={false}
    >
      <DesktopMock>
        <div className={BAR}>
          <PanelIcon />
          <span>Internal resource library</span>
          <Chevron dir="down" />
          <span className={`ml-auto ${PRIMARY_BTN}`}>Add resource</span>
        </div>
        <div className="border-b border-[#E5E7EB] px-6 py-3">
          <span className="inline-flex rounded-lg bg-[#F1F2F4] p-1 text-[14px] leading-none">
            <span className="rounded-md bg-[#FFFFFF] px-3 py-2">Library</span>
            <span className="px-3 py-2 text-[#6B7280]">Manage</span>
          </span>
        </div>
        <div className="flex gap-5 px-6 pt-5">
          <div className="w-[190px] shrink-0">
            <AppSearch placeholder="Search..." />
            <div className="mt-5 px-1 text-[13px] leading-none text-[#6B7280]">Pinned</div>
            <div className="mt-2.5 space-y-0.5">
              {GUIDE_PINNED.map((p) => (
                <div key={p} className="flex items-center gap-2 px-1 py-2 text-[13px] leading-none text-[#6B7280]">
                  <svg viewBox="0 0 24 24" className="size-3.5 shrink-0" {...APP_ICON} aria-hidden>
                    <path d="M9 4h6l-1 6 3 3H7l3-3zM12 13v7" />
                  </svg>
                  <span className="truncate">{p}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 px-1 text-[13px] leading-none text-[#6B7280]">Browse</div>
            <div className="mt-2.5 space-y-0.5">
              {GUIDE_BROWSE.map(([name, count], i) => (
                <div
                  key={name}
                  className={`flex items-center justify-between rounded-md px-2 py-2.5 text-[13px] leading-none ${i === 0 ? "bg-[#F1F2F4]" : "text-[#4B5563]"}`}
                >
                  {name}
                  <span className="text-[#6B7280]">{count}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center">
              <span className={`flex h-9 w-[190px] items-center justify-between rounded-lg border ${APP_LINE} px-3 text-[13px] leading-none text-[#6B7280]`}>
                Filter by owner...
                <Chevron dir="down" />
              </span>
            </div>
            <div className="mt-4 text-[13px] leading-none text-[#4B5563]">
              All resources <span className="text-[#6B7280]">(22)</span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {GUIDE_CARDS.map((c) => (
                <div key={c.title} className={`rounded-xl border ${APP_LINE} px-4 py-3.5`}>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-[#F1F2F4] px-2.5 py-1.5 text-[11px] leading-none text-[#4B5563]">{c.tag}</span>
                    {c.pinned && (
                      <svg viewBox="0 0 24 24" className="size-3.5 text-[#6B7280]" {...APP_ICON} aria-hidden>
                        <path d="M9 4h6l-1 6 3 3H7l3-3zM12 13v7" />
                      </svg>
                    )}
                  </div>
                  <div className="mt-3 truncate text-[14px] leading-none">{c.title}</div>
                  <div className="mt-2.5 truncate text-[13px] leading-none text-[#6B7280]">{c.blurb}</div>
                  <div className="mt-4 flex items-center gap-2 text-[12px] leading-none text-[#4B5563]">
                    <Avatar initials={c.initials} size="size-5" />
                    {c.owner}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DesktopMock>
    </GlassCover>
  );
}

export { CardConditionalForms, CardEvents, CardMarkup, CardInternalComms, CardTeamGuides };
