/**
 * Titles for the feature lists in template overviews written before the
 * benefits layout. Those lists are one sentence per item with no title, so
 * the page titles them here, keyed by the exact sentence: an item edited in
 * Contentful loses its title rather than showing the wrong one, and the row
 * reads as the sentence alone until this is updated. An item that already
 * leads with a short label ("Detail view: …") is split on it instead (see
 * legacyFeature in template-page.ts). Moving a template to the benefits
 * layout in Contentful makes its entry here unused.
 */
export const LEGACY_FEATURE_TITLES: Record<string, Record<string, string>> = {
  "internal-communications-app": {
    "Slack-style team chat with channels, DMs, and presence, built from your existing internal users":
      "Team chat and channels",
    "Threaded replies in a slide-in drawer, with emoji reactions and unread counts":
      "Threaded replies",
    "Mentions and reactions activity view, plus archive-not-delete channel management":
      "Mentions and archiving",
  },
  "contracts-app": {
    "Prepare, send, and manage all your eSignature contracts from one place.":
      "Every contract in one place",
    "Build reusable templates with client inputs, your own inputs, autofill, and variable fields.":
      "Reusable templates",
    "Autofill contracts with client data like names, addresses, and custom fields.":
      "Autofilled client data",
    "Track every request and submission by status, with clients notified by email and in-portal.":
      "Status tracking",
  },
  "client-resource-library": {
    "Documentation-style library clients browse by topic, with search across the catalog":
      "Browse by topic",
    "Publish documents, guides, and recordings; drafts stay hidden until you're ready":
      "Publish when ready",
    "Manage everything from a slide-in drawer: upload or link, set type and topic, publish, archive":
      "Manage from one drawer",
  },
  "case-status-page": {
    "Define one workspace-wide stage process and move every case forward on a kanban board":
      "One stage process",
    "Clients get a plain-language status page: current stage, progress, latest update, and what happens next":
      "A status page per case",
    "Per-update notify toggle that sends both in-product and email updates":
      "Notify on each update",
  },
  "client-ai-assistant": {
    "Every client gets an assistant that answers from three scoped sources: global knowledge, materials uploaded just for them, and their own existing Assembly data":
      "Answers from scoped sources",
    "Admins upload and manage both the global knowledge base and per-client materials, with labeling and archiving":
      "Knowledge you manage",
    'Internal team reviews every client conversation, with source indicators, timestamps, and "unable to answer" responses surfaced for follow-up':
      "Every conversation reviewed",
  },
  "deals-pipeline": {
    "Pipeline board with drag-and-drop stage changes, plus a dense table view with saved views, inline editing, and bulk actions":
      "Board and table views",
    "Deals link to real Assembly CRM companies, contacts, and custom fields — the CRM stays the source of truth rather than a duplicate database":
      "Linked to your CRM",
    "Optional client-facing deal page with simplified statuses, shared proposals, estimates, and documents, while internal stages, win probability, and comments stay hidden":
      "Optional client deal page",
  },
  "design-approvals": {
    "Send clients a set of visual options to compare side by side":
      "Options side by side",
    "Clients comment and pick a direction": "Clients pick a direction",
    "Multiple rounds of revisions, plus a global view of what's awaiting a decision":
      "Rounds of revisions",
  },
  "client-support-requests": {
    "Shared internal inbox with a folder rail — Open, New, Assigned to me, Resolved — and live counts":
      "A shared inbox",
    "Toggle between a client-facing reply and an internal note the client never sees":
      "Replies and internal notes",
    "Clients submit and track their own requests, with email and in-product notifications both directions":
      "Clients track their requests",
  },
  "data-room": {
    "Upload or attach files and grant specific clients read-only access, so each client sees only what's shared with them":
      "Per-client access",
    "Revoke access instantly — the file disappears from the client's portal while the prior audit history stays intact":
      "Revoke access instantly",
    "Full audit trail of every view and download, timestamped with client name, file name, action, and access status":
      "A full audit trail",
  },
  "time-tracker": {
    "Log billable and non-billable hours against a client with categories and notes":
      "Log hours per client",
    "Admin roll-up of hours by client over any date range, with category breakdowns":
      "Roll-ups by client",
    "CSV export built for invoicing: client, date, user, category, hours, billable status, notes":
      "Invoice-ready export",
  },
  "files-app": {
    "Securely share files, links, and folders with clients, or let them upload to you.":
      "Share files both ways",
    "Control whether clients can add, delete, or reorganize files, and lock individual folders.":
      "Control client permissions",
    "Mass-share files to many clients or companies at once, keeping recipients private.":
      "Share with many at once",
    "Collaborate internally with the Contextbar for notes and private team chat.":
      "Collaborate internally",
  },
  "internal-resource-library": {
    "Resource directory with categories: Policies, Templates, Training, Sales, Operations, HR, Client Delivery":
      "Organized by category",
    "Search and filters by category, owner, file type, and last updated":
      "Search and filters",
    'Pinned and recently-updated sections, plus a "Request a resource" form':
      "Pinned and recent",
  },
  "conditional-forms": {
    "Drag-and-drop builder with text, dropdowns, dates, checkboxes, file uploads, and signatures":
      "Drag-and-drop builder",
    "Send forms by shareable link or email; both clients and external companies complete them securely":
      "Send by link or email",
    "Track submissions in real time — submitted, pending, incomplete — and export completed responses as formatted PDFs":
      "Track every submission",
  },
  "client-engagement-dashboard": {
    "Engagement dashboard with churn risk scoring and 12-week activity trends":
      "Churn risk at a glance",
    "Configurable thresholds with presets and a live preview of what would change":
      "Thresholds you set",
    "In-product alerts when an account goes quiet, drops sharply, or a follow-up is due":
      "Alerts before they churn",
  },
  "events-rsvps": {
    "Publish upcoming events — webinars, office hours, meetups — with date, location, and description":
      "Publish events",
    "Clients see what's coming up and RSVP from their portal, with an instant confirmation":
      "RSVPs from the portal",
    "Internal team sees the full RSVP list for every event":
      "The full guest list",
  },
  "client-calendar": {
    "Month, week, and day views with drag-and-drop scheduling":
      "Month, week, and day views",
    "Recurring events, reminders, attendees, locations, and color-coded categories":
      "Recurring events and reminders",
    "Dashboard with upcoming events, today's schedule, and an agenda view":
      "Today and what's next",
  },
  "markup-comments": {
    "Clients pin comments directly onto a design or PDF page, with threaded replies internal users can resolve":
      "Comments on the page",
    "Upload revised versions with full version history; earlier versions and their comments stay viewable read-only":
      "Full version history",
    "Status pipeline from Awaiting review through Changes requested, Revised, and Approved — shown to clients in plain language, not internal pipeline names":
      "Clear approval status",
  },
  tasks: {
    "Assign tasks and subtasks to internal team members, clients, or companies.":
      "Assign to anyone",
    "Guide clients through onboarding with clear, sequenced action items.":
      "Guided onboarding",
    "Selectively share internally assigned tasks with clients so they can follow along.":
      "Share internal tasks",
    "Create task templates for common recurring tasks to save time.":
      "Task templates",
  },
  "forms-app": {
    "Build forms with question types including short and long answer, single and multi select, file upload, date, email, and phone.":
      "Every question type",
    "Allow multiple submissions for recurring or ticketing use cases.":
      "Multiple submissions",
    "Send forms to specific clients or make visible to all clients":
      "Choose who sees it",
    "Email and in-product notifications": "Notifications",
    "Desktop and mobile compatible": "Desktop and mobile",
  },
  "message-autoresponder": {
    "Send auto-replies outside your set working hours, or respond to every incoming message with Always On.":
      "Replies after hours",
    "Reassure clients that their message was received, even when no one is available to reply.":
      "Messages acknowledged",
    "Choose which internal team member the auto-response is sent from.":
      "Choose the sender",
  },
  quickbooks: {
    "Automatically sync Assembly Payments App invoices and customers to QuickBooks Online.":
      "Automatic sync",
    "Match invoices to existing QuickBooks customers, or create them when needed.":
      "Customer matching",
    "Keep invoice changes and payments updated in QuickBooks.":
      "Changes stay in sync",
    "Map Assembly services to QuickBooks items for accurate line items.":
      "Item mapping",
  },
  xero: {
    "Automatically sync Assembly invoices and customers to Xero.":
      "Automatic sync",
    "Match invoices to existing Xero customers, or create them when needed.":
      "Customer matching",
    "Keep invoice changes and payments updated in Xero.":
      "Changes stay in sync",
    "Map your services to Xero items for accurate line items.": "Item mapping",
  },
  "profile-manager": {
    "Let clients self-serve updates to address, phone, and other custom fields.":
      "Self-serve updates",
    "Choose exactly which fields are client-viewable or client-editable.":
      "Choose editable fields",
    "See a feed of client-initiated updates, with who changed what and when.":
      "A feed of changes",
    "Skip sending forms for routine profile changes.": "No more update forms",
  },
  "client-home": {
    "Personalize the homepage with autofill fields and client-specific content.":
      "Personalized content",
    "Surface outstanding Actions — invoices, contracts, tasks, and forms — with direct links to complete them.":
      "Outstanding actions",
    "Build up to five segmented versions so different client groups see tailored content.":
      "Versions per segment",
    "Brand the page with a custom banner and background colors.":
      "Your branding",
  },
  "messaging-app": {
    "Secure, centralized messaging that keeps every client conversation organized in one place inside your portal.":
      "Every conversation in one place",
    "Clients and teammates can reply straight from email notifications, and replies sync automatically into the app.":
      "Reply from email",
    "Send one message to all clients or companies at once, BCC-style, without exposing recipients to each other.":
      "Message everyone at once",
    "Built-in team collaboration for internal notes, private team chat, and @mentions to pull teammates into a conversation.":
      "Team collaboration",
  },
  exporter: {
    "Export complete message histories in CSV or PDF format.":
      "Full message history",
    "Filter by channel, sender type (internal, client, or both), date range, and sort order.":
      "Filter what you export",
    "Keep your own copy of portal data for backup, legal, or migration purposes.":
      "Your own copy",
  },
  "helpdesk-app": {
    "Create a knowledge base with rich text, images, videos, embeds, and attachments.":
      "Rich articles",
    "Organize articles with tags that generate a filterable table of contents.":
      "Tags and contents",
    "Use custom visibility rules to show the right articles to the right clients or companies.":
      "Visibility rules",
    "Share a direct link to any article with a client.": "Direct links",
  },
  "client-discussion-forum": {
    "Shared community where clients and your team discuss in the same space":
      "A shared community",
    "Threaded conversations organized by topic, with search":
      "Threads by topic",
    "Internal moderation: pin threads, mark the official answer, move or hide content":
      "Moderation tools",
  },
  "content-approval-flow": {
    "Submit drafts, deliverables, and campaign materials to a client or company for review":
      "Submit for review",
    "Clients approve, reject with comments, or request changes":
      "Approve or request changes",
    "Permanent status history on every item: who, when, old status, new status, comment":
      "Full status history",
  },
  "progress-tracker": {
    "Define your own ordered, color-coded stages, each with a rich-text client message":
      "Your own stages",
    "Move any company or client through stages inline from a single dashboard table":
      "Move clients inline",
    "Clients see a progress bar, a stage stepper, and the message for their current stage":
      "Clients see their progress",
  },
  "approvals-and-campaign-results": {
    "Submit drafts, deliverables, and campaign materials to a client or company for review":
      "Submit for review",
    "Clients approve, reject with comments, or request changes":
      "Approve or request changes",
    "Permanent status history on every item: who, when, old status, new status, comment":
      "Full status history",
  },
  "zoom-scheduler": {
    "Clients book appointments with you directly inside the portal.":
      "Booking in the portal",
    "Scheduling connects to your Zoom account for automatic meeting links.":
      "Zoom links included",
    "Show it to all clients automatically, or limit it to specific clients.":
      "Choose who sees it",
  },
  "youtube-app": {
    "Embed YouTube videos directly in your portal.": "Videos in your portal",
    "Add welcome videos, tutorials, or other content to guide and engage clients.":
      "Welcome and how-to videos",
    "Show a video to everyone automatically, or embed a different one per client.":
      "One video or one per client",
  },
  "typeform-app": {
    "Clients complete your Typeform right inside the portal.":
      "Forms in the portal",
    "Collect responses through a clean, conversational form experience.":
      "Conversational forms",
    "Show the form to all clients automatically, or limit it to specific clients.":
      "Choose who sees it",
  },
  trello: {
    "Let clients view a Trello board right inside your portal.":
      "Boards in your portal",
    "Share project status and to-dos visually.": "Status at a glance",
    "Show one board to everyone automatically, or embed a different one per client.":
      "One board or one per client",
  },
  "power-bi-app": {
    "Give clients interactive Power BI dashboards right inside your portal.":
      "Dashboards in your portal",
    "Keep reporting in one place alongside the rest of the client experience.":
      "Reporting in one place",
    "Embed different dashboards per client, group, or company, or show one to everyone automatically.":
      "Per client or for everyone",
  },
  onedrive: {
    "Let clients view OneDrive files and folders right inside your portal.":
      "Files in your portal",
    "Keep shared documents part of the client experience, with no separate logins.":
      "No separate logins",
    "Show one file to everyone automatically, or embed a different one per client.":
      "One file or one per client",
  },
  notion: {
    "Build a styled home page or knowledge space with Notion.":
      "A styled home page",
    "Surface Notion content in your portal so clients stay in one place.":
      "Content in one place",
    "Show one page to everyone automatically, or embed a different one per client.":
      "One page or one per client",
  },
  monday: {
    "Let clients view a Monday board right inside your portal.":
      "Boards in your portal",
    "Keep project status visible alongside the rest of the client experience.":
      "Status alongside your work",
    "Show one board to everyone automatically, or embed a different one per client.":
      "One board or one per client",
  },
  miro: {
    "Let clients view your Miro board right inside the portal.":
      "Boards in your portal",
    "Share brainstorms, diagrams, and plans visually.": "Share ideas visually",
    "Show one board to everyone automatically, or embed a different one per client.":
      "One board or one per client",
  },
  "loom-app": {
    "Embed Loom videos directly in your portal.": "Videos in your portal",
    "Add welcome videos, tutorials, or walkthroughs to guide clients.":
      "Welcome and walkthrough videos",
    "Show a video to everyone automatically, or embed a different one per client.":
      "One video or one per client",
  },
  "google-data-studio-app": {
    "Give clients customizable dashboards and reports right inside your portal.":
      "Reports in your portal",
    "Turn raw data into easy-to-read, shareable visualizations.":
      "Data made readable",
    "Embed different dashboards per client, group, or company, or show one to everyone automatically.":
      "Per client or for everyone",
  },
  "jotform-app": {
    "Clients complete your Jotform right inside the portal.":
      "Forms in the portal",
    "Use Jotform's drag-and-drop builder to design exactly the form you need.":
      "Drag-and-drop builder",
    "Pre-fill forms with client and company data using URL parameters.":
      "Prefilled with client data",
    "Show the form to all clients automatically, or limit it to specific clients.":
      "Choose who sees it",
  },
  "hubspot-meetings": {
    "Clients book meetings with you directly inside the portal.":
      "Booking in the portal",
    "Scheduling ties into your HubSpot CRM.": "Tied to your CRM",
    "Show it to all clients automatically, or limit it to specific clients.":
      "Choose who sees it",
  },
  "hubspot-forms": {
    "Clients submit your HubSpot form right inside the portal.":
      "Forms in the portal",
    "Capture leads and responses straight into your HubSpot CRM.":
      "Straight into your CRM",
    "Show the form to all clients automatically, or limit it to specific clients.":
      "Choose who sees it",
  },
  "google-slides": {
    "Present Google Slides to clients right inside your portal.":
      "Slides in your portal",
    "Keep clients in the portal instead of sending them to an external link.":
      "No external links",
    "Show one presentation to everyone automatically, or embed a different one per client.":
      "One deck or one per client",
  },
  "google-sheets-app": {
    "Embed a Google Sheet so clients see your data without leaving the portal.":
      "Sheets in your portal",
    "Choose view-only to display data, or editable to collaborate together.":
      "View or edit together",
    "Show the same sheet to everyone automatically, or embed a different one per client.":
      "One sheet or one per client",
  },
  "google-forms": {
    "Clients complete your Google Form without leaving the portal.":
      "Forms in the portal",
    "Collect responses and analyze results in Google in real time.":
      "Results in real time",
    "Show the form to all clients automatically, or limit it to specific clients.":
      "Choose who sees it",
  },
  "google-drive": {
    "Let clients view Google Drive files right inside your portal.":
      "Files in your portal",
    "Embed individual files, or entire folders with an embed code generator.":
      "Files or whole folders",
    "Show a file to everyone automatically, or embed a different one per client.":
      "One file or one per client",
  },
  "google-docs-app": {
    "Embed a Google Doc so clients read it without leaving your portal.":
      "Docs in your portal",
    "Choose view-only to display content, or editable to collaborate together.":
      "View or edit together",
    "Show the same doc to everyone automatically, or embed a different one per client.":
      "One doc or one per client",
  },
  "google-calendar": {
    "Let clients view your shared Google Calendar right inside your portal.":
      "Your calendar in the portal",
    "Control what's visible using Google's calendar permissions before embedding.":
      "You control visibility",
    "Show it to all clients automatically, or limit it to specific clients.":
      "Choose who sees it",
  },
  figma: {
    "Show Figma designs in your portal so clients view them without leaving Assembly.":
      "Designs in your portal",
    "Embed a different design per client, group, or company, or show one to everyone automatically.":
      "Per client or for everyone",
    "Share view-only designs so your work stays protected.":
      "View-only sharing",
  },
  "databox-app": {
    "Give clients a real-time performance dashboard right inside your portal.":
      "Live dashboards",
    "Embed any Databoard so reporting lives alongside the rest of your client experience.":
      "Reporting in one place",
    "Embed different dashboards per client, group, or company, or show one to everyone automatically.":
      "Per client or for everyone",
  },
  "clickup-app": {
    "Surface ClickUp Spaces and Documents in your portal so clients stay in one place.":
      "Spaces and docs in your portal",
    "Share task lists, plans, reports, and strategies as rich-text views.":
      "Plans and reports",
    "Embed different content per client, group, or company, or show one view to everyone automatically.":
      "Per client or for everyone",
  },
  canva: {
    "Showcase Canva designs in your portal so clients view them without leaving Assembly.":
      "Designs in your portal",
    "Embed any design type, from presentations to social posts to branded one-pagers.":
      "Any design type",
    "Show it to all clients automatically, or limit it to specific clients.":
      "Choose who sees it",
  },
  "calendly-app": {
    "Clients schedule meetings without leaving your portal.":
      "Booking in the portal",
    "Embed your scheduling page or a single event type, whichever fits.":
      "Page or single event",
    "Show it to all clients automatically, or limit it to specific clients.":
      "Choose who sees it",
  },
  "cal-com": {
    "Clients schedule meetings without leaving your portal.":
      "Booking in the portal",
    "Embed your Cal.com scheduling page for a seamless booking experience.":
      "Your scheduling page",
    "Show it to all clients automatically, or limit it to specific clients.":
      "Choose who sees it",
  },
  "airtable-app": {
    "Surface Airtable tables and views in your portal so clients access them without leaving Assembly.":
      "Tables in your portal",
    "Choose the right view for the job — grid, kanban, gallery, and others.":
      "Any view type",
    "Embed different data per client, group, or company, or show one view to everyone automatically.":
      "Per client or for everyone",
    "Pre-fill Airtable forms with client and company data using URL parameters.":
      "Prefilled forms",
  },
  "acuity-scheduling": {
    "Clients book appointments directly in your portal, with no need to navigate to an external site.":
      "Booking in the portal",
    "Embed your Acuity scheduling page so booking stays part of the client experience.":
      "Part of the experience",
    "Make it available to every client automatically, or show it only to specific clients.":
      "Choose who sees it",
  },
};
