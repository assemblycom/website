---
title: "API enhancements"
excerpt: "See our API docs for details about the new endpoints and updates."
date: 2024-02-27T12:01:10.000-05:00
updated: 2025-09-29T03:16:19.000-04:00
---

## API enhancements

See our&nbsp;[API docs](https://assembly.com/docs/api-reference/introduction)&nbsp;for details about the new endpoints and updates.

- Added `file.updated` and `file.deleted` webhooks.
- Added a `contract.requested` webhook.
- Added a `creationMethod` property to the client resource. This property is especially useful if you want to set up different workflows depending on how a client was created. `creationMethod` method can be&nbsp;`internalUser`,&nbsp;`client`, &amp;&nbsp;`directSignUp`:
  - `internalUser`&nbsp;indicates that the client was created individually in Assembly by an internal user, created via import by an internal user, or created via API, Zapier, or Make connected with an internal user's API key.
  - `client`&nbsp;indicated that the client was invited by another client. This is only possible if the ability for clients to invite other clients is enabled in&nbsp;*Settings &gt; General.*
  - `directSignUp`&nbsp;indicates that the client signed up directly via the direct sign-up link. This is only available if client direct sign-up is enabled in&nbsp;*Settings &gt; General.*
- Query params in API calls are now case-insensitive. This improvement was made for all List endpoints.
- Implemented e164 validation for phone number custom fields. This makes phone number inputs much more flexible than before.
- We previously used a `createdBy` property on many resources. We've replaced it with `creatorId` which represents the unique identifier of the creator of the resource.
- Removed `portalName` for the /me endpoint.

## Improvements &amp; Updates

- In the Contracts App settings, you can now disable PDF attachments in email notifications. By default attachments are enabled (they are a nice convenience for clients), but in some industries it is a best practice to disable attachments for improved security.
- After a form is shared with a client, you can now share that same form with the client again if the client has submitted a response to the first form request.
- When previewing a pending contract as an internal user, you can now see all the blocks that have been added. Previously we showed the original pdf file.
- File upload notifications in the notification center also now show a timeline of when files were uploaded.
- You can now click Escape to exit search experiences.
- Partner Apps are now called Embeds. On the sidebar, "Partner and Custom Apps" was renamed to 'More' which now holds all embeds and Custom Apps. In the future the 'More' section will be more flexible and you can move any app into or out of this section.
- The settings pages now saves changes more seamlessly without needing full refreshes.
- Improved column spacing on various pages so that the most useful information is visible by default.
- Added a more useful error when trying to initiate a contract request with a PDF that is too long or too large.
- Fixed a bug where pdf documents of a specific format could not be signed by clients.
- Fixed a bug that caused issues when scrolling down in the Messages App and Files App on mobile.
- Fixed a bug where in the Files App the page occasionally refreshed when files were added or updated.
- Fixed a bug that caused internal user avatars to not be shown on some surfaces like the Files App.
