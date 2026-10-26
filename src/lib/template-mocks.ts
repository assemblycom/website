/**
 * The words inside the template pages' "Add your template, customize it,
 * and publish" mocks, per template, so each page's three cards name its own app:
 * the change typed into the composer (step two), and the one setup row of the
 * install checklist that says what the template holds (step one). The app's
 * name itself comes from the template's title, unless `appName` gives the
 * shorter name the app goes by once installed: a title that leads with a
 * describing word ("Billable time tracker") reads oddly as a sidebar entry.
 *
 * A change is a small edit to the installed app — a field, a step, a view, a
 * reminder — never a request for a new app: the step is "Describe your
 * changes". Each fits two lines in the composer. A template not listed gets
 * the fallback, which is true of any template.
 */
type MockCopy = { prompt: string; setup: string; appName?: string };

const BY_SLUG: Record<string, MockCopy> = {
  "client-project-tracker": {
    prompt: "Add a timeline view so clients can see each milestone by date.",
    setup: "Milestones, dates, status set up",
  },
  "progress-tracker": {
    prompt: "Add a timeline view so clients can see each milestone by date.",
    setup: "Milestones, dates, status set up",
  },
  "document-collection": {
    prompt: "Send clients a reminder two days before a document is due.",
    setup: "Requests, due dates, status set up",
  },
  "client-onboarding-wizard": {
    prompt: "Add a step that collects each client's billing details.",
    setup: "Steps and saved progress set up",
  },
  "new-client-intake": {
    prompt: "Ask for the client's tax ID only when they're a business.",
    setup: "Questions and answers set up",
  },
  "conditional-forms": {
    prompt: "Show the budget question only when the client picks Retainer.",
    setup: "Questions and conditions set up",
  },
  "time-tracker": {
    appName: "Time tracker",
    prompt: "Add a weekly summary of hours for each client.",
    setup: "Entries, rates, roll-ups set up",
  },
  "proposal-builder": {
    prompt: "Add optional add-ons clients can tick before they sign.",
    setup: "Sections, pricing, e-sign set up",
  },
  "contracts-app": {
    prompt: "Require a second signer on contracts over $10,000.",
    setup: "Templates and signers set up",
  },
  "billing-app": {
    prompt: "Remind clients when an invoice is seven days overdue.",
    setup: "Invoices and payments set up",
  },
  "case-status-page": {
    prompt: "Add a Waiting on client stage and notify them when it starts.",
    setup: "Cases, stages, updates set up",
  },
  "design-approvals": {
    prompt: "Let clients leave a comment when they request changes.",
    setup: "Reviews and approvals set up",
  },
  "content-approval-flow": {
    prompt: "Let clients leave a comment when they request changes.",
    setup: "Reviews and approvals set up",
  },
  "client-resource-library": {
    prompt: "Group resources by service and pin the onboarding guide.",
    setup: "Folders and resources set up",
  },
  "client-support-requests": {
    prompt: "Add a priority field and flag urgent requests to the team.",
    setup: "Requests and statuses set up",
  },
  "client-calendar": {
    appName: "Client calendar",
    prompt: "Let clients book a 30-minute call from the calendar.",
    setup: "Events and availability set up",
  },
  "events-rsvps": {
    prompt: "Add a waitlist once an event is full.",
    setup: "Events and RSVPs set up",
  },
};

const FALLBACK: MockCopy = {
  prompt: "Add a due date to each item and remind clients before it's due.",
  setup: "Fields and statuses set up",
};

export function templateMockCopy(slug: string): MockCopy {
  return BY_SLUG[slug] ?? FALLBACK;
}
