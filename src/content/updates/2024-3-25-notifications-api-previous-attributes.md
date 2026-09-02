---
title: "Notifications API"
excerpt: "We added a Notifications resource and a notification.created webhook to our API. See our API docs for details about how the notification resource works."
date: 2024-03-25T18:14:24.000-04:00
updated: 2025-09-29T03:16:18.000-04:00
---

## Notifications API

We added a `Notifications` resource and a `notification.created` webhook to our API. See our [API docs](https://assembly.com/docs/api-reference/resources/notifications) for details about how the notification resource works. The new resource has the following endpoints: List Notifications, Create Notification, Delete Notification, Mark Notification Read/Unread

Note that the `notification.created` webhook and the `List Notifications` endpoint can be used in any workspace. At this time the other endpoints can only be used by Custom Apps.

## Previous Attributes

Some webhooks will now include a `previousAttributes` map that allows you to see what has changed about a resource. With this release, the `client.updated` webhook now includes `previousAttributes`.

## Improvements &amp; Updates

- \[API\] Fixed several webhook naming inconsistencies.
