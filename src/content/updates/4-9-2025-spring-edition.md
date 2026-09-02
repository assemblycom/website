---
title: "Magic Links"
excerpt: "Magic links let your clients log in with a single click from a secure link sent to their email or shared with them directly — no passwords, no extra steps."
date: 2025-04-09T12:03:20.000-04:00
updated: 2025-09-29T03:16:14.000-04:00
---

## Magic Links

Magic links let your clients log in with a single click from a secure link sent to their email or shared with them directly — no passwords, no extra steps.

This is what the new experience is like when a client gets a notification about a new invoice. This client has never received an email notification before and has never set a password. Notice that it just works — they’re immediately taken to the checkout page to pay.

<figure class="kg-card kg-video-card kg-width-regular" data-kg-thumbnail="https://copilot-blog.ghost.io/content/media/2025/04/vid1_thumb.jpg" data-kg-custom-thumbnail="">
            <div class="kg-video-container">
                <video controls src="/images/updates/2025/04/vid1.mp4" poster="/images/updates/external/img.spacergif.org-spacer.png" width="1920" height="1080" playsinline="" preload="metadata" style="background: transparent url('https://copilot-blog.ghost.io/content/media/2025/04/vid1_thumb.jpg') 50% 50% / cover no-repeat;"></video>
                </figure>

When magic links are enabled, all email notifications to clients have magic links in them. In addition, there are ways to manually share magic links. On the CRM you can send magic links from the CRM table or the client/company details pages. On the Billing App, you can send magic links for open invoices. And on the Contracts App, you can send magic links for open contract requests.

![](/images/updates/2025/04/one.webp)

For security reasons, magic links are one-time only and expire after 3 days. If they have already been opened or have expired, the client will see a page that lets them request a new magic link that is sent via email.

We recommend that you enable magic links. Password-less authentication (Google OAuth &amp; magic links) is quickly becoming the new standard that is more convenient for clients and more secure. Note that magic links are not enabled by default for existing workspaces. To enable, you can turn them on in Settings &gt; Client Authentication. Clients that have already set passwords or Google Auth can continue to log in using those methods.

## Payment Links

You can now create a payment link connected to a product, and anyone (existing client or not) can pay for that product. Here’s how it works:

<figure class="kg-card kg-video-card kg-width-regular" data-kg-thumbnail="https://copilot-blog.ghost.io/content/media/2025/04/vid2_thumb.jpg" data-kg-custom-thumbnail="">
            <div class="kg-video-container">
                <video controls src="/images/updates/2025/04/vid2.mp4" poster="/images/updates/external/img.spacergif.org-spacer.png" width="1920" height="1080" playsinline="" preload="metadata" style="background: transparent url('https://copilot-blog.ghost.io/content/media/2025/04/vid2_thumb.jpg') 50% 50% / cover no-repeat;"></video>
                </figure>

If a payment link is opened by someone who isn’t authenticated, we ask for an email. If checkout occurs and the email is new, then that client is taken through a self-serve sign up experience. This means that the client journey can now start with a payment.

One use case we’re especially excited about is powering pricing pages. If you have your pricing on your marketing website — for example with 3 subscription tiers — you can now add buttons to those tiers that point to payment links. We know many use Stripe Payment Links for this use case but we think our offering is more compelling. With our implementation, after payment and sign up, the client is taken directly to your portal where they can be greeted with a welcome message and other customizations.

![](/images/updates/2025/04/three.webp)

For a highly custom onboarding experience that starts with a payment you can set up an automation that’s specific to clients that start with a payment link purchase. For example, after payment you can prompt clients to fill out an intake form or schedule a call with your team.

![](/images/updates/2025/04/four.webp)

## Billing API

With this release, we’re adding [several new endpoints and webhooks](https://assembly.com/docs/api-reference/introduction), along with [Zapier](https://zapier.com/apps/assembly/integrations?ref=copilot-updates.ghost.io) and [Make](https://www.make.com/en/integrations/assembly?ref=copilot-updates.ghost.io) support, to help you completely automate your billing and revenue operations.

You can now automate the creation of invoices and subscriptions with our new **Create Invoice** and **Create Subscription** endpoints. To provide you with full control, we've also added new resources for invoice templates (allowing you to create invoices from templates), products and prices (enabling reusable products and pricing when creating invoices and subscriptions), and payments (providing visibility into whether payment attempts succeed or fail).

## New Community

While our Slack has served us well, we’ve outgrown it. With limited post history, hard-to-find info, and disorganized threads, it was time for a better home. We’ve now officially moved over to Discourse — an open community platform where anything can read and your existing Assembly account lets you post.

The new community is best place to ask questions, share product feedback, and meet others building on the Assembly platform. You can find our new community [here](https://community.assembly.com/?ref=copilot-updates.ghost.io).

## Improvements

- In the Messages App, you can now filter to view all message channels or only unread message channels.
- In the Messages App, we've added support for drafts. You can now start writing a message, navigate away, and return later to finish and send your message.
- In the CRM, we simplified the status property for clients. Status can now either be *active* or *inactive*. If a client was invited, there's a new hidden-by-default property called "Invited By" that captures this information.
- In the CRM, internal users can now reset MFA for clients.
- In the CRM, we've improved the robustness of the client import feature, enhancing handling of different separators.
- In the notification center, you can now right-click to delete notifications.
- Improved settings organization by creating a dedicated section for client experience settings.
- Improved scalability of the Files App, resulting in faster performance overall, especially in workspaces with more than 5,000 clients.
- Improved email deliverability for Microsoft email accounts. Emails will no longer go into quarantine through Microsoft Defender.

## Final Reminder: Our website domain is changing

Starting April 11, our marketing website will be accessible exclusively via assembly.com (previously assembly.com), and the dashboard will move to dashboard.assembly.com. Additionally, all our email addresses have been updated to the @assembly.com domain. Please take note of these changes for accessing the site and contacting us. The client experience will remain unaffected.
