---
title: "January 19: Contracts App, Notification Center & Client Access"
excerpt: "The Winter 2024 Release is out and you can read a detailed blog post here and watch a full product walkthrough here."
date: 2024-01-19T06:59:13.000-05:00
updated: 2025-09-29T11:36:57.000-04:00
---

The Winter 2024 Release is out and you can read a detailed blog post [here](https://assembly.com/blog/assembly-2024-winter-release?ref=copilot-updates.ghost.io) and watch a full product walkthrough [here](https://www.youtube.com/watch?v=bFkF2uY6h0s&ref=copilot-updates.ghost.io).

## Contracts App

With our new Contracts App you can create reusable contract templates, assign them to clients, and track submissions and requests in a consolidated view.

- Ability to create *reusable* contract templates. You can create a template once and reuse it for clients as needed.
- Consolidated view of submissions and outstanding requests. This makes it easy to quickly know who you’re still waiting for.
- Comprehensive API coverage for contracts. Specifically you can `Retrieve`, `Send`, and `List` Contract Templates and you can utilize a `contract.completed` webhook. You’ll be able to set up automations with our API, Zapier, or Make.
- Autofill fields. These are fields that automatically get set when a contract is shared with a client. For example, if you have an “address” custom field set to “123 Main Street” for John Doe, if you use the {{client.address}} autofill block, when you share the contract with John Doe, the {{client.address}} will resolve to “123 Main Street”.
- Variable fields. After you create a contract template you can assign it to clients. Variable fields are set at the time of contract sharing, not at the time of contract template creation. This is helpful, for example, if you have a standard sales agreement with a “Total cost” field where you want to set a different value every time you share the contract.
- Dozens of improvements to design and performance, including better block sizes and resize behavior, crisper PDF generation, and more streamlined mobile signing.
- With this update, we’re deprecating our old eSignature request feature that was part of the Files App. Client users now have a dedicated Contracts tab in the sidebar where they can see all of their requests. If you’d still like signed contracts to show in a Files Channel, you can move them there manually or set up an automation on Zapier or Make.

![](/images/updates/2024/01/contracts.webp)

## Notification Center

The Notification Center is the new home for internal user notifications.

- New consolidated notification experience that you can access by clicking on *Notifications* on your sidebar. The notification center now houses notifications about new file uploads, contract submissions, form submissions, and invoice payments. All notifications except for Messaging App notifications are now in the notification center.
- Notification details. Depending on the type of notification you view, we now surface relevant information and actions that we think will be most helpful. For example, if you view a ‘files uploaded’ notification we show you exactly where the client uploaded files.
- Mark read and delete actions. You can mark notifications as read by clicking on them, or you can go a step further and delete them permanently.

![](/images/updates/2024/01/Notification-.webp)

## Client Access

- We’re deprecating “Leads and assignees” with a new client access paradigm called Client Access.
- Now, if you’re an admin you can give a team member “Limited access” on the Settings &gt; Team page and then specify the clients or companies they should have access to. If a team member doesn’t have access to a particular client, they won’t see the client or their data across any of the apps you have enabled.

![](/images/updates/2024/01/Client-access.webp)

## Performance

- 30% faster loading speeds in workspaces with 10 internal users and 1,000 clients
- Support for large Assembly deployments (up to 10,000 clients and 50 internal users).

![](/images/updates/2024/01/lala.webp)
