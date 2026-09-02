---
title: "General improvements"
excerpt: ""
date: 2025-11-05T08:44:00.000-05:00
updated: 2025-11-05T13:51:12.000-05:00
---

## General improvements

- Improved email deliverability for all workspaces.
- Significantly improved the performance of loading the left sidebar in the Assembly Dashboard when there are large numbers of clients.
- Workspace owners now have more control over client email notifications. On the Settings &gt; Client Notifications page, we added a toggle for client email notifications. When turned off, clients will not receive any emails — useful if you’re setting up a new workspace or using our API for custom email notifications.
- If an internal user or client loses internet connectivity, we now show a “Browser offline” dialog explaining why certain workflows may be failing.
- Across the app, we ensured that the correct sidebar item remains selected, even after deep navigation into an app (e.g. showing the Files App as selected when previewing a file).
- When custom domains have issues, we now automatically fall back to a `myassembly.com` domain so the client experience remains uninterrupted.
- Improved portal sign-up and login pages — both now include a title that makes it clear which one you’re on.
- Improved image loading speeds across the platform.
- Improved the Recently Visited section on the home page, which is now more accurate.
- Improved deep-linking for email notifications — certain notifications that previously linked to the root Assembly Dashboard or portal now point directly to their destination.
- Improved the experience for clients navigating to restricted URLs (for example, an app where app visibility rules prevent access). Instead of a blank page, we now show an informative error page.
- Improved mobile UI in Automations, the Contracts App, and the Billing App.
- Improved various error states to make them clearer, including in authentication, invoicing, and subscriptions.
- Improved our cancellation flow — canceling your Assembly plan now also cancels any recurring subscription you have set up.
- Updated our color palette for various success and error pages.
- Improved fallback logic for workspace icons. If we can’t automatically find an icon and none is uploaded, we now show a stylized letter as the company icon.
- Cleaned up the UI of various settings pages.

## CRM

- You can now add clients directly from the company details page.
- The client/company details pages now show a dynamic number of app tabs. Depending on space, we show as many as possible, with the rest in a dropdown.
- The right sidebar on client and company details pages is now resizable. When resized, your width preference is saved moving forward.
- Improved the performance of the address finder.
- Updated the color and styling of tags.
- You can now cancel requests while the AI Assistant is processing (“thinking”).
- Improved the performance of updating custom field values.
- Added ellipses for long values that were previously cut off.
- Fixed a bug where the client details page showed a company section even if companies were disabled.

## Notification Center

- Redesigned the sidebar to better make use of space.
- You can now complete and comment on tasks from the Notifications center instead of clicking into Task App.

## Authentication &amp; Admin

- Internal users and clients who have connected Google accounts can now disconnect Google and set a password on their own.
- Images on login and signup pages now load dramatically faster.
- Fixed a bug that sometimes prevented new internal user account configuration when MFA was enforced across all accounts.
- Fixed a bug that prevented staff internal users from updating the profile pictures of other staff users.
- Fixed a bug that allowed creation of companies with contacts who had a name but no email, leading to bad data.
- Fixed a bug that caused an infinite load on the client direct sign-up page when direct sign-up was disabled. We now redirect users to the login page in this case.

## Billing App

- Invoice memos now support line breaks.
- Clients who connected a bank using the ACH Debit option previously received an email mentioning Assembly. This email is now white-labeled and only mentions your business name.
- Voided invoices and canceled subscriptions are now hidden in the client experience.
- Fixed a bug where the recipient was hidden when opening a draft invoice.
- Fixed a bug that sometimes prevented updating the number of cycles for a time-bound subscription.
- Removed unnecessary scrollbars from invoices, subscriptions, and payment link pages.
- Improved the UI for adding new one-off line items and reusable prices/products.

## Files App

- Added an upload progress indicator that now works for more file types.
- Fixed a bug related to uploading empty folders.

## Contracts App

- Improved the performance of loading the Contracts App when there are many requests or submissions.
- Fixed a bug that prevented one-off eSignature requests for some PDFs that used address custom fields.

## Messages App

- Fixed a rare bug that prevented message channels from being created for new clients.
- Fixed a very rare bug (five workspaces impacted) that resulted in multiple individual message channels being created for the same client.

## Helpdesk App

- Internal users can now upload ZIP files inside articles.
