---
title: "Freeform Automations"
excerpt: "Go to Automations in the sidebar and pick Start From Scratch. You can now build custom workflows by selecting from a range of triggers and actions."
date: 2025-01-29T20:45:17.000-05:00
updated: 2025-09-29T11:36:50.000-04:00
---

## Freeform Automations

Go to **Automations** in the sidebar and pick **Start From Scratch**. You can now build custom workflows by selecting from a range of triggers and actions. We added four new actions and two new triggers, for more flexible automations.

![](/images/updates/2025/01/4.webp)

## Three Example Workflows

1. **Track onboarding progress**<br>Define a custom field "Onboarding" with tags "Onboarding form submitted", "Contract signed", and "1st invoice paid". Then set up an automation so each client action adds the respective tag to the client.
2. **Unlock capabilities when leads become clients**<br>Define a custom field "Client status" with tags for "Lead" and "Paying". Set up&nbsp;[App Visibility](https://assembly.com/guide/custom-visibility-for-apps?ref=assembly-updates.ghost.io) so that only paying clients see certain apps (like a Calendly scheduling embed). Then create an automation so that when the first invoice is paid, "Client status" updates to "Paying".&nbsp;
3. **Trigger an onboarding flow based on purchased product**<br>Configure the "Invoice paid" trigger to only fire for a specific product. This lets you launch targeted onboarding flows depending on which product a client buys.&nbsp;

![](/images/updates/2025/01/Invoice-paid--_-Assign-form.webp)

## Company and Client Tabs in the CRM

Most Assembly businesses serve other companies with multiple clients/contacts. Our redesigned CRM makes it easier to keep track of it all. We added separate views for companies and clients, so you can focus on whichever is more relevant at the moment.

![](/images/updates/2025/01/firsdt.webp)

## Company Details Page

Clicking on a company takes you to a details page that shows all messages, files, etc. tied to that company. If there’s no company-specific data, you’ll see relevant data from associated clients (with a dropdown to pick which one).

## Tasks App Improvements

Launched in October 2024, the Tasks App has been evolving weekly. We now make better use of screen space and improved the mobile experience. Tasks now support rich text, images, and file attachments.

![](/images/updates/2025/01/Task-Details--Release-.webp)

## Task Templates

If you find yourself creating similar tasks repeatedly (like onboarding checklists), you can now create task templates and reuse them as much as you need.

## Other Task App Enhancements

1. Internal users can reassign tasks to other internal users, clients, or companies.
2. The activity feed logs task creation, reassignment, status changes, due dates, title updates, and archiving/unarchiving.
3. On client/company detail pages, internal users can create tasks and leave comments.
4. Archive tasks to keep them hidden by default for both internal users and clients, reducing clutter in the UI. Use the new "Display" drawer to toggle the visibility of archived tasks as needed.

## New Checkout + Apple Pay + Android Pay

The new design brings a more familiar Stripe-inspired look to the checkout experience, and works great on mobile. We also added Apple Pay and Android Pay, which render dynamically when supported.

![](/images/updates/2025/01/Marketing-materials---Invoice-Checkout-experience.webp)

## Embeds with URL parameters

You can already embed apps like Airtable, JotForm, and Typeform. The challenge? Embedded apps couldn’t identify the client viewing them, making it impossible to pre-fill details like name, email, or company. That changes today — now, you can configure URL parameters for embeds, passing native properties and custom fields to personalize each client’s experience.

![](/images/updates/2025/01/URL-Params.webp)

## New and Improved Question Types in the Forms App

We added dedicated "Phone number", "Email", and "Date" types to the Forms App. Use them instead of the generic "Short answer" type for improved data validation. We also added an “Other” option for "Single Select" and "Multi select" questions to let clients fill in their own response.

![](/images/updates/2025/01/View-form.webp)

## File Previews

You can now preview PDFs, images, videos, audio, and more without leaving Assembly. Just double click, view, and download if needed.

![](/images/updates/2025/01/File-Preview.webp)

## Mass File Share and Improved Mass Messaging

You can now mass share files with clients or companies — handy for sending monthly reports or documents. We also updated mass messaging to use the same improved UI which supports search.

![](/images/updates/2025/01/Mass-file-share.webp)

## Improved payout reconciliation

On **Settings &gt; Payouts**, you’ll see a link to the Stripe Express dashboard. There, each payment description now includes the client’s name and invoice number, making it easier to match incoming payments with bank payouts.

## MFA Authentication Enforcement

On **Settings &gt; General**, internal admin users can now enforce multi-factor authentication for all clients and/or all internal users. When enabled, users have to provide a verification code upon log in.

## API

- Added a new webhook event — invoice.paid — that triggers whenever an invoice is paid. Use it to kick off any payment-related workflow.
- Added a File Delete endpoint to delete files and folders.

## Improvements

- On client/company detail pages, if there are too many apps to fit, a “More” dropdown appears. This replaces the slow-loading “More” page by letting you select individual apps and embeds.
- A new address custom field makes it easier to record clean data for addresses and uses the Google Maps API for autocomplete.
- In the Billing App, internal users can now create new products and prices during invoice/subscription creation by using the “Add as product” checkbox.
- In the Billing App, internal users can now set up subscriptions with a new "Every 2 years" interval option.
- In the Files App, internal users can now select a file or folder and move it to another channel.
