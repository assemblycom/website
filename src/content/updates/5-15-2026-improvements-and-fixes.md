---
title: "Auto-archive & customizable statuses in the Tasks App"
excerpt: "In the Tasks App you can now configure auto-archive for tasks marked done so completed work doesn't pile up indefinitely."
date: 2026-05-15T13:21:13.000-04:00
updated: 2026-05-15T13:47:13.000-04:00
---

## Auto-archive &amp; customizable statuses in the Tasks App

In the Tasks App you can now configure auto-archive for tasks marked done so completed work doesn't pile up indefinitely. Subtasks follow their parent's auto-archive behavior, and the Tasks API surfaces an archived state so external automations can filter on it. Archived items remain searchable and restorable. To set up auto-archiving and the time window for it, navigate to the ‘Configure Tasks App’ page from the kebab menu.

![](/images/updates/2026/05/tasks_hq.webp)

## Dynamic date fields in Tasks App templates

Task templates now support dynamic date placeholders — `{{currentWeek}}`, `{{currentMonth}}`, `{{currentQuarter}}`, and `{{year}}` — that resolve to live values when the template is applied. This makes recurring templates like "Q1 close" or "Week of March 24 deliverables" stay accurate without manual editing. Dynamic fields work in both the template title and description, and you can insert them from a sidebar panel or by typing `{` for an autocomplete picker. Fields render with a distinct visual treatment so they're easy to spot in template previews.

![](/images/updates/2026/05/task-2-hq.webp)

## Addresses for invoices

If a company or contact has an address custom field with a value, you are now prompted to add it when creating an invoice or subscription. For contacts that themselves have an address in addition to the associated company, you can select which address you want to use.

## Improved mentions in the Messages App

Previously, messages sent by internal users always notified other internal users. We’ve removed this behavior and instead improved how mentioning works. Now typing `@` opens a picker scoped to the channel's participants, and you can select an internal user to mention. Mentioned users receive a dedicated notification that surfaces the mention separately from regular channel activity, so it's easier to triage where you've been explicitly called out.

## Improvements

- In the CRM, you can now mute email notifications for an individual client, so a specific person stops receiving Assembly emails without changing workspace-wide notification settings.
- In the CRM, you can now bulk reset passwords for a company. This resets the passwords of all associated clients.
- In Tasks, hyperlinks now auto-detect URLs that don't start with `https://`, show clearer affordance that text is linked, and let you edit an existing link's address without recreating it.
- In Tasks, subtasks now inherit status, assignee, and client association from their parent on creation, and inherit Done status from the parent when the parent is completed.
- In Tasks, task and subtask navigation now uses title-based breadcrumbs on desktop instead of IDs.
- In Tasks, the assignee icon now swaps instantly when you change assignee, rather than waiting for the underlying save.
- In Tasks, archived subtasks no longer appear on the parent task's details page when archived items are hidden.
- In Tasks, the default sort for subtasks is now creation order, which matches how most teams enter them.
- In Tasks, the drag-and-drop has been improved, making list reordering noticeably more responsive.
- In Tasks, the company details view now shows tasks assigned to any client in that company, not only tasks assigned to the company itself.
- In Tasks, "My Tasks" now includes subtasks you're assigned to, not only parent tasks.
- In Tasks, the empty state when no templates exist now explains how to create one.
- In Tasks, clicking a task notification from the notification center loads the task page faster and without the previous flicker.
- In Tasks, rapid edits to a task title (or task template title) could be dropped before saving; fixed.
- In Contracts, the date format is now customizable per workspace, and "client inputs" and "my inputs" share a consistent format.
- In Contracts, PDF upload errors now describe what went wrong instead of failing silently.
- In Payments, service pricing now supports amounts below $0.50, with invoice-level validation that prevents accidental zero-total invoices.
- In Payments, the billing summary clarifies upcoming payouts, renaming "Upcoming payouts (Estimated)" to "On the way to your bank" and reordering pending, available, and on-the-way balances.
- In Payments, the "Not paid" summary copy is clearer and the invoices table has a matching "Not paid" filter.
- In Client Home, hyperlinks have clearer visual treatment and a `/link` slash-command, the user-company selector dropdown is wider for long company names, and copy-paste between cells now pastes values only without dragging header color formatting along.
- In Client Home, the "Your Actions" CTA section and individual app cards are now hidden when they have zero notifications, so the home view doesn't show empty placeholders.
- In Client Home, action items now reference the workspace's customized app names instead of default ones.
- On the settings page, a new Connected Apps section under Profile shows active MCP connections and lets you revoke access per app.
- Companies now appear alongside clients in cmd+K workspace search.
- App visibility supports a per-user-per-company selector, so a single client can have different app access in different companies they belong to.
- The icon picker now has a "Suggest icon" action that uses an LLM to propose a relevant icon based on the app or item name.

## Platform &amp; API

- The Tasks public API now returns `attachments` on the task object, and the Zapier integration has been updated to expose them.
- The Form Response platform API supports pagination via `limit` and `nextToken`, with `status` filter exposed in docs.
- Invoice IDs are now stored in Stripe invoice metadata for both directly created invoices and subscription-generated invoices, making it easier to reconcile between Assembly and Stripe.
- In Xero and QuickBooks Sync, "Products" has been renamed to "Services" in the integration UIs to match the broader Assembly billing rename.
- Xero now shows a callout that the integration currently supports US-based Xero accounts only.

## Fixes

- In Notification Center, files could fail to render on Safari.
- In Messages, search did not return some expected matches and could show extra newlines between bulleted lists.
- In Messages, mass message channel search returned only the first 30 matches; the cap has been removed.
- In Context Bar, the selected tab did not persist across navigations, and the toggle is no longer shown on the client side or on manual-embed apps' empty state.
- On mobile, Message, File, and Notification detail pages could fail to open from notifications.
- In Contracts, in-progress contracts could refresh mid-session for client users and lose their progress.
- In Contracts, the empty state could fail to load, PDF/A files could not be uploaded as templates, and templates could throw "Date Invalid" or render the date component incorrectly.
- In Contracts, long input values could overflow the field, uploads did not reset between submissions, and the unsaved-changes dialog could appear when nothing had changed.
- In Contracts, the "Waiting for submission" count now updates in real time after a request is canceled.
- In Forms, forms with PDF attachments could be overwritten if there are name conflicts for the same PDF.
- In Payments, canceling a subscription edit could leave it in an unsubmittable state. There is now a clear error message and the subscription stays editable.
- In Payments, payment links priced at exactly $0.50 could throw an error, the store preview could show $0 products, the Billing Period dropdown didn't always render, and deleted products could keep their "in use" flag.
- In Payments, the "Add a price" popup no longer closes when the "Price already exists" snackbar appears.
- In Files, dragging a folder could trigger deletion, small-file uploads could fail, the sidebar's selected state could desync, and file channel updates could fail silently.
- In Files, removing a client from a company no longer deletes all of that client's files.
- At the platform level, `companyId` could return a deleted company after a client was reassigned to a new one, breaking legacy automations. The field now reflects the current assignment.
- Magic links now deliver correctly for email addresses containing a `+` character, and workspace onboarding no longer hangs on those addresses.
- MFA enforcement on the Starter plan could prevent first-login QR code setup; fixed.
- In Forms, date fields are no longer converted to timestamps on the client, which was causing date drift in non-UTC time zones.
- In Forms, dragging to reorder options no longer makes the option disappear, choice reorder icons render correctly on mobile, the upload form resets correctly between submissions, and broken Forms/Helpdesk pages now load.
- In Editor, Shift+Enter now produces paragraph breaks consistently across long-form fields.
- In Profile, names with multiple words no longer truncate after a profile picture upload, and colored tags in profile manager are readable for client users.
- Manual embed apps no longer show identical content across instances when configured separately.
- Icon picker now falls back gracefully when an icon reference is missing.
- On the Desktop app, Google SSO works correctly, the "Visibility to clients" setting saves as expected, and a download link is available from Account Settings.
- In QuickBooks Sync, missing service items in QBO no longer throw an error, the "No company info found" error is surfaced clearly, and duplicate records with wrong invoice amounts have been fixed.
