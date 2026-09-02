---
title: "File search"
excerpt: "Two weeks ago we announced search for messages and now we're following up with search in the Files App. File search is available for both you and your clients."
date: 2024-03-06T13:36:28.000-05:00
updated: 2024-03-06T14:40:09.000-05:00
---

## File search

Two weeks ago we announced search for messages and now we're following up with search in the Files App. File search is available for both you and your clients.

![](/images/updates/2024/02/Group-1-1.webp)

## Improvements &amp; Updates

- Clients can now search messages. Previously message search was only available for internal users.
- On the *Settings &gt; General* page, you can now configure if uninvited clients should receive email notifications. You will want to turn this on if you want the client journey to start with a new invoice, contract request, or other email notification that is not "Accept your invite".
- Dropdowns with clients and/or companies are now sorted by creation date.
- Dropdowns can now be navigated with up/down arrows.
- Fixed a bug that previously let you create unanswerable forms with just title sections.
- Fixed a bug in the Messages App where entering "/" cleared the input.
- Fixed a UI bug that blocked navigation to the client details page if you previously opened and closed a tags custom field.
- \[API\] For `Files`, `Forms`, and `FormResponses` we previously nested some properties inside of a `fields` object. These properties are now present at the root level of the resource. The `fields` object is still present for backwards compatibility but will be deprecated in the future.
- \[API\] Fixed a bug where previously `Update Client` didn't let you unset custom fields.
- \[API\] Fixed a bug with phone number custom fields where incorrect phone number formats were saved. Now you'll receive a descriptive error if the input is malformed.
