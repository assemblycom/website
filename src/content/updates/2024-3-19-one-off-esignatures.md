---
title: "One-off eSignature requests"
excerpt: "The Contracts App we released two months ago came with support for reusable contract templates, but not one-off eSignature requests."
date: 2024-03-19T17:04:42.000-04:00
updated: 2024-03-19T17:04:42.000-04:00
---

## One-off eSignature requests

The Contracts App we released two months ago came with support for reusable contract templates, but not one-off eSignature requests. You can now create one-off requests that don't clutter up the templates you have by switching off the template toggle when creating a contract.

![](/images/updates/2024/03/one-off.webp)

## Improvements &amp; Updates

- Embeds and Custom Apps now refresh when you click on them in the sidebar. This makes it easier to navigate back to the root URL.
- If you have companies enabled and you create a client, we improved how we match companies based on email domain.
- In the Contracts App, you can now add longer multi-line variable inputs.
- Improved the loading behavior on invoices and subscriptions pages.
- Improved the default sorting order for the Contracts App submissions and requests page.
- Various UI improvements on the *Settings &gt; API* page.
- Fixed a bug that prevented Helpdesk articles from updating in some rare scenarios.
- Fixed a bug where for one-off eSignature requests PDFs were not being included in email notifications.
- Fixed a client import bug where blank custom fields weren't handled correctly.
- \[API\] Improved our API rate limiting infrastructure to protect against bad actors.
- \[API\] Fixed a bug that prevented the creation of individual file channels.
- \[API\] You can now send an uninvited client an email invite with the `Update client` endpoint.
