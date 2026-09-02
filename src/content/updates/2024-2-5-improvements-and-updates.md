---
title: "API enhancements"
excerpt: "See our API docs for details about the new endpoints and updates."
date: 2024-02-04T22:07:00.000-05:00
updated: 2025-09-29T03:16:20.000-04:00
---

## API enhancements

See our [API docs](https://assembly.com/docs/api-reference/introduction) for details about the new endpoints and updates.

- Added a *Get Workspaces* endpoint. This endpoint is most useful for building dynamic Custom Apps as the endpoint returns properties including *brandName*, *squareIconUrl*, *colorSidebarBackground*, *colorSidebarText*, *colorAccent*, and *font*.
- Added a *Update Company* endpoint.
- Improved the *Get Internal Users* endpoint which now includes a *isClientAccessLimited* and *companyAccessList* property, making it clear what client access internal users have.
- Improved the *Get Files* endpoint which is now paginated.
- Removed *lastActiveDate* property on client resources. Updates to this property previously caused the *client.updated* webhook to fire too frequently. We're going to bring back activity data in the future with a dedicated activities endpoint.

## Improvements and Updates

- Improved email deliverability by adhering to Google's new email guidelines.
- Drop downs across the products now clearly disambiguate clients and companies with dedicated headers and different styling (clients are represented by circles and companies are represented by squares).
- When you delete a notification the next one below is now shown immediately after.
- Improved the search experience in the notification center. You can now search by client and company names.
- Improved rendering of the notification center on small screens.
- Improved how PDFs load in the notification center for invoices and contracts. They now load faster and have a minimum size so that they're still clearly visible on small screens.
- Fixed a bug where internal users and clients who create their accounts with Google did not get their profile picture set automatically.
- Fixed an issue caused by a Stripe API change that prevented some scheduled subscriptions from starting in early February. If you were impacted we've reached out to you to fix any issues resulting from this.
- Fixed the *Latest submission* column from being cut off on the contracts page.
- Fixed a bug that prevented the contracts page from loading fast if you had a very large number of contract submissions.
- Fixed a bug that blocked contract creation for incorrectly named pdf files.
- Fixed a bug where file uploads in the Files App would occasionally fail if you've had a very long active session in your browser.
- Fixed a bug that caused the *Latest submission* date on form responses to be set incorrectly.
- Fixed a bug that caused scrolling issues on mobile for the notification center, Files App, and Messages App.
- Fixed a bug that caused Safari users to not see any file channels.
