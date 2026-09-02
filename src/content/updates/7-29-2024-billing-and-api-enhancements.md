---
title: "Reusable products and prices for invoicing"
excerpt: "In the Billing App, you can now create products and prices, and then easily use them in invoices and invoice templates."
date: 2024-07-29T17:52:56.000-04:00
updated: 2025-09-29T03:16:17.000-04:00
---

## Reusable products and prices for invoicing

In the Billing App, you can now create products and prices, and then easily use them in invoices and invoice templates. This streamlines your invoicing process by eliminating repetitive data entry, ensuring consistency, and saving you time. You can create and manage products by clicking on *Products* on your sidebar under *Billing.* Note that products/prices can currently only be used in one-off invoices and support for subscriptions is coming soon.

![](/images/updates/2024/07/first.webp)

## Invoice details &amp; payment retries

If you click on an invoice you’re now taken to the new invoice details page. Here you can see invoice information directly without having to download a PDF. The right sidebar also shows a history of events including payments attempts. For any open invoice you can now manually make charge attempts with the payment method of your choice. No longer do you need to contact your client to retry payments. Note that manually retrying payments also works for invoices created by a subscription.

![](/images/updates/2024/07/second.webp)

## Business addresses for invoices

You can now search for and add your business address on the Settings &gt; General page. Once you add an address, it will automatically populate on any future invoices under your business name.

## A better sidebar for your team

On your sidebar if you have more than 8 apps, you’ll now see an expandable “More” section that shows all additional apps. This new paradigm makes for a lighter clutter-free experience.

## API &amp; Automation enhancements

See our&nbsp;[API documentation](https://assembly.com/docs/api-reference/introduction), [Zapier profile](https://zapier.com/apps/assembly/integrations?ref=copilot-updates.ghost.io), and [Make profile](https://www.make.com/en/integrations/assembly?ref=copilot-updates.ghost.io) to explore the new capabilities.

- Added a `List Invoices` and `Get invoice` endpoint. Also added an `invoice.paid` webhook.
- Added an `App Installs` resource. This endpoint can be used to understand what apps have been installed in a workspace. This is especially useful if you’re building a Custom App or Marketplace App and you benefit from knowing what other apps have been installed.
- Added an `App Connections` resource with `Get` and `Post` endpoints. An App Connection is used in Manual Apps for connecting embeds/links to client/s or companies. For example, if you add a “Project Status” Manual App you can now use the `Post App Connection` endpoint to add Airtable embeds (or any other embeds) for clients automatically as they are created.
- Added `fallbackColor` and `avatarImageUrl` properties to the `internalUser` resource. These can be used to render internal user avatars.
- Added a `portalUrl` property to the `Workspaces` endpoint. This will return the URL of the client portal. It will return the custom domain if one is set up.

## Improvements &amp; Updates

- Added the ability to separately control if you want to absorb payment processing fees for ACH and credit cards payments. Previously you could only set this globally for all payment methods.
- Improved payment errors. The new errors provide specific decline reasons like “Insufficient funds” or “CVC code incorrect”.
- Improved invoice email previews which now show a more accurate preview of the email clients will get.
- Improved typography and spacing for messages in the Messages App.
- Improved how email notifications are sent for Custom Apps. If a custom email domain is connected to a workspace it is now used to send Custom App email notifications.
- Improved CSV exports for several table views.
- Improved the search experience in the Files App. Searching for files/folders/links now uses a fuzzy search algorithm that makes it more likely that you’ll find the item you are looking for.
- Polished the audit trail page that is automatically generated for signed contracts in the Contracts App.
- Fixed a bug where reordered apps would revert to their previous state.
- Fixed a bug where apps weren’t rendering when the client did not have a custom field.
- Fixed a bug that prevented the Messages app from loading for new clients in existing portals.
- Fixed a bug where a contract sender’s profile picture was not appearing.
- Fixed a bug that caused formatting issues in invoice page exports.
- Fixed a bug that sometimes resulted in an incorrect number of browser notifications to show before refresh.
- Fixed a bug that caused tag custom fields to not sort correctly on the CRM page.
- Fixed a bug in the Contracts App that caused the app to crash after contract submission if there were a very large number of fields.
- Fixed a bug where custom visibility app settings got deleted after an app is disabled.
- Fixed a bug that caused article reordering in the Helpdesk App to not work if any filters are applied.
