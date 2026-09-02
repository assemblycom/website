---
title: "Smarter duplicate file handling in the Files App"
excerpt: "Previously, uploading or moving a file with the same name as an existing file could silently overwrite it."
date: 2026-03-02T15:48:22.000-05:00
updated: 2026-03-03T09:15:01.000-05:00
---

## Smarter duplicate file handling in the Files App

Previously, uploading or moving a file with the same name as an existing file could silently overwrite it. Now, whenever a duplicate file name is detected, you can either replace the existing file or keep both. Renaming a folder to a name that already exists now also shows the same replace/keep-both prompt instead of a generic error. The duplicate handling also extends to links and nested file structures.

## Manual Apps with Custom App Visibility

Manual Apps let you set up embeds and links for clients one by one. Previously, you couldn't combine this with [app visibility rules](https://assembly.com/guide/custom-visibility-for-apps?ref=copilot-updates.ghost.io), which let you show or hide an app globally or based on custom field requirements. Now you can use app visibility rules with Manual Apps. This means you can configure embeds and links for each client, keep everything hidden during setup, and then switch it all on in one step. For example, you could create an "Analytics" app and add a unique analytics embed for each client — all while keeping the app hidden. Once every client's embed is in place, just flip the app visibility to 'on' and everyone sees their dashboard at the same time.”

## Improvements

- In the CRM, you can now copy text from list views (clients, companies, invoices) without being redirected to the detail page.
- In the CRM, a confirmation warning now appears when removing a client from a company, explaining that the client will lose access to company data.
- In the Tasks App, subtask names now show more text before truncating.
- In the Tasks App, avatars now render consistently — fixed casing, sizing, and initials display.
- In the Tasks App, spacing between the status and client dropdowns on mobile has been fixed.
- In the Tasks App, the "Create from template" dropdown is now wider for better readability.
- In the Payments App, your business name now consistently appears in bank statements during micro deposit verification, making it easier for clients to identify the transaction.
- In the Payments App, pending and failed payment notifications now display improved in-product messaging so you can take action faster.
- In the Messages App, the mass message flow now displays all companies instead of only recent ones, so you can reach any company channel.
- In the Files App, pressing Escape while renaming a folder now saves the name instead of discarding it.
- In the Files App, file channel loading speed on client detail pages has been improved.
- In the Contracts App, text field inputs now support up to 4,000 characters and display full content while editing.
- In the QuickBooks App, the error message when a re-sync fails now correctly reflects the actual failure reason.
- In the QuickBooks App, a product's class reference is now carried through on line items, preserving accounting classifications set in QBO.
- Clients can no longer update their own company information. This gives you and your team full control over company data integrity.
- Improved title truncation across channel-based apps so long names are no longer cut off too aggressively.

## Platform &amp; API

- Updated the branding from Copilot to Assembly for our open source projects.
- Added pagination support to the List Form Responses endpoint.

## Fixes

- In the CRM, fixed a bug where the "View details" action opened to the wrong tab.
- In the CRM, fixed a bug where removing a client from a company did not update in real time.
- In the CRM, fixed a bug where the Company Detail page had no scrollbar, preventing access to content below the fold.
- In the CRM, fixed a bug where some users could not remove a company from the sidebar for activated clients.
- In the CRM, fixed a bug where client import occasionally returned a "Something went wrong" error.
- In the CRM, fixed a bug where the scroll position in the company switcher reset to the top after switching companies.
- In the CRM, fixed inconsistent client ordering in the channel selection drop-down on company detail pages.
- In the Payments App, fixed a bug where some payment links did not work for unauthenticated users.
- In the Payments App, fixed a bug where the search and create buttons were missing from the Payment Links header in some workspaces.
- In the Payments App, fixed a bug where copying a payment link returned a standard URL instead of a magic link.
- In the Payments App, fixed a bug where the last invoice in a fixed-cycle subscription was incorrectly prorated.
- In the Payments App, fixed a bug where ACH payment methods could not be added from the client or company details page, and newly added payment methods did not appear without a page refresh.
- In the Payments App, fixed a bug that prevented invoices from displaying on client and company detail pages for some users.
- In the Payments App, fixed a bug where invoice-ready email notifications were not received by some clients.
- In the Messages App, fixed a bug where the chat list occasionally showed only one client until the user logged out and back in.
- In the Files App, fixed a bug where searching with special characters like `(` caused an error page.
- In the Files App, fixed a bug where some users received email notifications for files they had uploaded themselves.
- In the Files App, fixed a bug where file actions triggered from the command bar returned a 404 error.
- In the Files App, fixed a bug where some users were unable to delete folders.
- In the Files App, fixed a bug where uploading folders with many files or nested structures could time out or fail.
- In the Files App, fixed a bug where downloading folders as zip files failed in some cases.
- In the Files App, fixed a bug where file previews did not include client-submitted input fields, and highlighting in previews occasionally obscured text.
- In the Files App, fixed a bug where TXT files appeared unformatted in the file preview.
- In the Files App, fixed a bug where some file downloads from the preview pane returned errors.
- In the Files App, fixed a display issue where breadcrumb paths were prematurely truncated, cutting off folder names.
- In the Contracts App, fixed a bug where signed contract input fields had an opaque white background, obscuring the document beneath them.
- In the Contracts App, fixed a bug where the secondary button text overflowed on contract request pages.
- In the Contracts App, fixed a bug where the scrollbar was missing on the contracts page.
- In the Tasks App, fixed a bug where the search and display icons were misaligned on mobile.
- In the Tasks App, fixed a bug where the wrong notification count was showing on the sidebar item.
- In the Tasks App, fixed a bug where client users did not receive email notifications for tasks assigned to them when created via an automation.
- In the Tasks App, fixed a bug where the app was periodically unable to connect to its database, causing intermittent errors.
- In the Automations, fixed a bug where the edit workflow page did not display Save and Cancel buttons in the header.
- In Automations, fixed a race condition that caused some batch runs to not update their status after completing execution.
- In Automations, fixed a bug where the autoresponder stopped working for some workspaces.
- In Automations, fixed a bug where autoresponses failed when a client's address custom field contained certain formatting.
- In Automations, fixed a bug where the autoresponder occasionally failed due to an internal ID being incorrectly processed as a client ID.
- In the Forms App, fixed a bug where some form responses did not load in the UI or via the customer API.
- In the Forms App, fixed a bug where clients needed to refresh the page to see a newly shared form after switching companies.
- In the QuickBooks App, fixed a bug where some payments were not syncing to QuickBooks Online.
- In the QuickBooks App, fixed a bug where invoices were syncing with incorrect price data to QuickBooks Online.
- In the QuickBooks App, fixed a bug where some invoices were not syncing to QuickBooks Online.
- In the Client Home App, fixed a bug where a video embed could not be resized.
- In Notes, fixed a rendering issue where text occasionally appeared in an incorrect font.
- Fixed a bug where Windows users couldn't copy text with Ctrl+C — the shortcut was incorrectly opening the Create menu.
- Fixed a bug where the Store page sometimes loaded with a blank sidebar or blank listings for unauthenticated users in some cases.
- Fixed a bug where editing a product could overwrite customized store descriptions.
- Fixed a bug where invite links older than one year could not be used, even after resending the invite.
- Fixed a bug where sidebar notification badges rendered "0" instead of being hidden when there were no unread items.
- Fixed a bug where the "Dashboard" sidebar item appeared selected regardless of the current page.
- Fixed a bug where some users encountered an authentication error on logout.
- Fixed a bug where special characters in email sender display names caused delivery failures.
