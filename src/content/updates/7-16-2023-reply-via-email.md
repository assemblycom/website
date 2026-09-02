---
title: "Reply via email"
excerpt: "Reply via email lets internal users and client users reply via email to messaging email notifications."
date: 2023-07-18T02:00:00.000-04:00
updated: 2023-07-18T09:36:42.000-04:00
---

## Reply via email

Reply via email lets internal users and client users reply via email to messaging email notifications. This feature reduces friction for you and your clients, and makes it easy to quickly respond to messages when you’re on the go. Since this feature is available for your clients too, remember to let you know clients know that they can reply via email as well and don't need to navigate to your portal to send messages.

![](/images/updates/2023/07/newreply.webp)

## Signing secrets for webhook events

Webhook events now include a signing secret. You can view a webhook’s signing secret on the Settings &gt; API page by clicking on the webhook’s ⋮ button and then ‘Reveal Signing Secret’.

![](/images/updates/2023/07/Settings---API---Reveal-Signing-Secret.webp)

## Performance enhancements

We’ve optimized the Clients page in the dashboard by caching client users. With caching, once data for client users is loaded in your browser, it's stored locally, reducing the need to continuously fetch the same data. These updates resulted in a ~15% page load speed improvement on average, with significantly larger improvements when there are many client users.

![](/images/updates/2023/07/Performance-improvement-chart-1.webp)

## Improvements &amp; Updates

- Messaging email notifications now intelligently group messages by sender. For example, if the same person sends 3 messages, the sender is only listed once.
- Messaging email notifications now show text formatting. For example, new lines, italics, and bullets format as you'd expect. If you utilize the new reply via email feature and include formatting, the formatting is also displayed correctly in the Messaging App.
