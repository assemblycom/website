---
title: "Copilot Automations"
excerpt: "We're excited to launch Copilot Automations, a set of pre-built workflows available on Zapier and our API that help you save time, reduce human error, and run a more streamlined business."
date: 2023-06-14T00:00:00.000-04:00
updated: 2025-09-28T23:58:11.000-04:00
---

## Copilot Automations

We're excited to launch [Copilot Automations](https://www.copilot.app/automations?ref=copilot-updates.ghost.io), a set of pre-built workflows available on Zapier and our API that help you save time, reduce human error, and run a more streamlined business. You can browse a directory of the most popular automations and setup instructions [here](https://www.copilot.app/automations/directory?ref=copilot-updates.ghost.io).

![](/images/updates/2023/06/auto.gif)

## <br>Improvements &amp; Updates

- Simplified the Settings page for internal users. App-specific settings now live on the app's configuration page that you can access by clicking on *App setup* on the sidebar. Specifically, we moved the settings for the Messaging App (customizing the welcome message), Files App (control over what permissions clients have), and the Billing App (control over accepted payment methods).
- Improved many small design details in the Forms App – improved padding, empty states, fonts, and more.
- Improved the default order of columns shown on responses tab in the Forms App – the submission date is now always visible.
- Improved the URL for the form submission page that clients can access when submitting a form. The new URL is the same for submissions and for viewing a completed form, leading to better real-time behavior and ensuring that links in email notifications always point to the most relevant page.
- Improved real-time behavior in the Forms App so that client users don't have to refresh to see new form request and so that internal users don't need to refresh to see new form submission notifications.
- Improved the performance of the Files App for businesses with thousands of clients by implementing paginated loading of channels.
- Fixed a bug where notifications from new form submissions from deleted clients could not be cleared.
- Fixed a bug that caused the sample form created for new portals to not be editable.
- Fixed a bug where the invoice creation flow could not be opened for users who had their browser language set to Spanish.
- Fixed a bug where in some scenarios internal users couldn't see messaging channels they should have access to if they were removed as the lead but were still set as assignees.
- \[API\] Fixed an issue where GET Form Responses failed if the number of form responses was very large.
- \[API\] Webhooks now use createdAt instead of created for consistency.
