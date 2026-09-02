---
title: "Internal Notes"
excerpt: "You can now add notes to clients and companies. Internal notes are visible only to you and other internal users with access and can be edited after creation."
date: 2025-03-18T09:50:49.000-04:00
updated: 2025-09-29T11:36:49.000-04:00
---

## Internal Notes

You can now add notes to clients and companies. Internal notes are visible only to you and other internal users with access and can be edited after creation. Notes are located on the sidebar of client and company detail pages. Use the slash (/) command to add rich text formatting, including headings and more. Notes also come with full API, Zapier, and Make support.

![](/images/updates/2025/03/CRM---Client---Details---Contracts.webp)

## Tasks App Improvements

A big element of task and project management is discussion — clarifying details, answering questions, and so on. Task comments now support replies. Replies work as expected, with some extra touches like collapsing long discussion threads by default. In comments we also added support for images and attachments so that users can provide all the details needed when discussing a task.

![](/images/updates/2025/03/Client-view---list.webp)

## API

- Added a `notes` resource with endpoints to Create, List, and Edit.
- Added `note.created`, `note.updated`, and `note.deleted` webhooks.

## Improvements

- Added the ability to right-click on notifications or message channels to mark as unread.
- Void invoices are now hidden in the client experience.
- Improved embed robustness, supporting more products and rendering them more cleanly than before.

## Reminder: Our website domain is changing

If you haven’t noticed, our marketing site now lives at [assembly.com](https://assembly.com/?ref=copilot-updates.ghost.io) (instead of [assembly.com](https://assembly.com/?ref=copilot-updates.ghost.io)) and the dashboard is on [dashboard.assembly.com](https://dashboard.assembly.com/?ref=copilot-updates.ghost.io). Starting early April, the old .com URLs and our team’s .com emails will stop working, so please make sure you’ve updated any references. Client-facing experiences won’t change. You can read more about this change [here](https://assembly.com/guide/new-assembly-url?ref=copilot-updates.ghost.io).
