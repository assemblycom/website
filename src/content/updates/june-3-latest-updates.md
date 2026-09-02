---
title: "Subtasks in the Tasks App"
excerpt: "The Tasks App now supports sub-tasks, making it easier to break down complex work and projects into manageable pieces."
date: 2025-06-03T09:38:59.000-04:00
updated: 2025-09-29T03:16:14.000-04:00
---

## Subtasks in the Tasks App

The Tasks App now supports sub-tasks, making it easier to break down complex work and projects into manageable pieces.

![](/images/updates/2025/06/Tasks-App-Subtask-Onboarding.webp)

## Tasks API, Zapier, and Make support

Tasks are a critical part of most automation workflows. You can now leverage task webhooks and endpoints via our API, Zapier, and Make. Specifically, we’ve added:

- Task resource with endpoints for Retrieve, List, Create, Update, and Delete
- Task Templates resource with endpoints for Retrieve and List.
- Webhooks: `task.created` , `task.updated` , `task.completed` , `task.deleted` , `task.archived`

For full reference, [check out our API docs](https://assembly.com/docs/api-reference/resources/tasks).

## Improvements &amp; Updates

- In the Messages App, the selected channel filter now behaves more intuitively on mobile.
- Improved navigation from email notifications in the Files App — clicking “See file” now takes users directly to the Files App.
- Improved the resolution of Progressive Web App (PWA) icons.
- Improved performance of the “Find a Company” action in Zapier.
- Improved the portal preview on the Customization page — previously it wasn’t visible on small screen sizes.
- If the Billing App is disabled, we now hide all billing-related actions. Specifically, “Add a payment method” is removed from the command bar, and active subscriptions are hidden from the client/company details sidebar.
- Refreshed the design of many core atoms and components in the Assembly Dashboard and portal. This includes updated colors, chips, toasts, tooltips, and callouts. You can see some of them below.
- Fixed a bug that caused form completion notifications to not appear in the Notification Center.
- Fixed a bug where users were incorrectly prompted to connect a bank account after already doing so.
- Fixed a bug that prevented users from selecting all clients when sharing a form.
- Fixed a bug that caused issues copying links in Safari.
- Fixed a bug that prevented some active subscriptions from being edited.
- Fixed a bug where “Mark all messages as read” only affected message channels currently visible in the UI.
- Fixed a bug that caused all embeds to disconnect when clients were added to and then removed from a company.
- In Form descriptions, prevented a few instances where links would be created from text that wasn’t actually a link.

## API

- Standardized `createdAt` property on all resources. Previously some used `createdDate`.
