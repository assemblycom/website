---
title: "Files API"
excerpt: "We've made substantial improvements to our Files API. In addition to being able to create folders in the Files App, you can now upload files via API as well."
date: 2023-04-24T22:17:00.000-04:00
updated: 2025-09-29T03:16:27.000-04:00
---

## Files API

![](/images/updates/2023/05/Files-API.webp)

We've made substantial improvements to our Files API. In addition to being able to create folders in the Files App, you can now upload files via API as well. In addition we added webhooks for file.created, link.created, and folder.created events. You can learn more about the updated Files endpoint [here](https://assembly.com/docs/api-reference/resources/files) and about our webhooks [here](https://assembly.com/docs/api-reference/webhooks/events). Future updates will bring these capabilities to Zapier as well.

## Improved Client Details page

![](/images/updates/2023/05/Client-Details.webp)

We reworked the client details page and improved performance and design. The new page is more snappy overall and makes better use of space.

## Improvements &amp; Updates

- \[API\] Fixed an issue where the client object showed status=active instead of status=invited when a client user is in invited status.
- \[API\] Added linkUrl property to the File object. This property is relevant when a file is added that links to an external URL.
- \[API\] Updated the name property on the File object to refer to the folder name. Relevant only when object=folder.
- \[API\] Fixed a bug on the get /clients/all endpoint which previously returned one page of clients instead of all clients. This mainly caused issues in Zapier workflows where the search step often didn’t find the expected clients.
