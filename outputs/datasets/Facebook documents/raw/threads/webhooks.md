---
url: https://developers.facebook.com/docs/threads/webhooks
title: Webhooks - Threads API
status: 200
---

![](https://googleads.g.doubleclick.net/pagead/viewthroughconversion/963623955/?guid=ON&script=0)

![](https://dc.ads.linkedin.com/collect/?pid=276116&fmt=gif)

![](https://analytics.twitter.com/i/adsct?txn_id=nz7m3&p_id=Twitter&tw_sale_amount=0&tw_order_quantity=0)

![](https://t.co/i/adsct?txn_id=nz7m3&p_id=Twitter&tw_sale_amount=0&tw_order_quantity=0)

![](https://facebook.com/security/hsts-pixel.gif)

[Meta logo](https://developers.facebook.com/?no_redirect=true)

MoreMoreMore

DocsDocsDocs

ToolsToolsTools

SupportSupportSupport

Search input

​

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fthreads%2Fwebhooks%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Threads API](https://developers.facebook.com/docs/threads)

- [Overview](https://developers.facebook.com/docs/threads/overview)
- [Get Started](https://developers.facebook.com/docs/threads/get-started)
- [Create Posts](https://developers.facebook.com/docs/threads/create-posts)
- [Retrieve and Discover Posts](https://developers.facebook.com/docs/threads/retrieve-and-discover-posts)
- [Retrieve and Manage Replies](https://developers.facebook.com/docs/threads/retrieve-and-manage-replies)
- [Delete Posts](https://developers.facebook.com/docs/threads/posts/delete-posts)
- [Profiles](https://developers.facebook.com/docs/threads/threads-profiles)
- [Insights](https://developers.facebook.com/docs/threads/insights)
- [Webhooks](https://developers.facebook.com/docs/threads/webhooks)
- [oEmbed](https://developers.facebook.com/docs/threads/tools-and-resources/embed-a-threads-post)
- [Web Intents](https://developers.facebook.com/docs/threads/threads-web-intents)
- [Troubleshooting](https://developers.facebook.com/docs/threads/troubleshooting)
- [Reference](https://developers.facebook.com/docs/threads/reference)
- [Tools and Resources](https://developers.facebook.com/docs/threads/tools-and-resources)
- [Changelog](https://developers.facebook.com/docs/threads/changelog)

On This Page

[Webhooks for Threads](https://developers.facebook.com/docs/threads/webhooks#webhooks-for-threads)

[Receive Live Webhook Notifications](https://developers.facebook.com/docs/threads/webhooks#receive-live-webhook-notifications)

[Limitations](https://developers.facebook.com/docs/threads/webhooks#limitations)

[Step 0: \[Optional\] Use the sample app to test your integration](https://developers.facebook.com/docs/threads/webhooks#step-0---optional--use-the-sample-app-to-test-your-integration)

[Step 1: Add the webhooks sub-use case to the main Threads API use case](https://developers.facebook.com/docs/threads/webhooks#step-1--add-the-webhooks-sub-use-case-to-the-main-threads-api-use-case)

[Step 2: Create an endpoint and configure Threads webhooks](https://developers.facebook.com/docs/threads/webhooks#step-2--create-an-endpoint-and-configure-threads-webhooks)

[Notification Formats](https://developers.facebook.com/docs/threads/webhooks#notification-formats)

[Fields](https://developers.facebook.com/docs/threads/webhooks#fields)

[Real-time reply notifications](https://developers.facebook.com/docs/threads/webhooks#real-time-reply-notifications)

[Real-time mention notifications](https://developers.facebook.com/docs/threads/webhooks#real-time-mention-notifications)

[Real-time delete notifications](https://developers.facebook.com/docs/threads/webhooks#real-time-delete-notifications)

[Real-time publish notifications](https://developers.facebook.com/docs/threads/webhooks#real-time-publish-notifications)

# Webhooks for Threads

Webhooks for Threads allow you to receive real-time notifications for the subscribed topics and fields.

## Receive Live Webhook Notifications

To receive live webhook notifications, the following conditions must be satisfied:

- Your app must have Threads webhooks added as a sub-use case and appropriate fields subscribed to in the App Dashboard.

- For non-tech providers, the apps must be in [Live Mode](https://developers.facebook.com/docs/development/build-and-test/app-modes).

- For tech providers, the apps must have permissions with an [Advanced Access level](https://developers.facebook.com/docs/graph-api/overview/access-levels). You can request Advanced Access for permissions as shown here:






![](https://lookaside.fbsbx.com/elementpath/media/?media_id=1741127813088276&version=1776866370)



If the app permissions don't have an access level of Advanced Access, the app won't receive webhook notifications.


- The app user must have granted your app appropriate permissions (i.e., `threads_basic`, `threads_read_replies` for reply webhooks).

- The business connected to the app must be verified.

- To receive real-time [reply](https://developers.facebook.com/docs/threads/webhooks#real-time-reply-notifications) and [mention](https://developers.facebook.com/docs/threads/webhooks#real-time-mention-notifications) notifications, the owner of the media object upon which the webhook event occurs must not have set their account to private.

- To receive real-time [delete](https://developers.facebook.com/docs/threads/webhooks#real-time-delete-notifications) and [publish](https://developers.facebook.com/docs/threads/webhooks#real-time-publish-notifications) notifications, the owner of the media object upon which the webhook event occurs must be a public account or private account that authenticated to the app.


### Limitations

- Apps don't receive webhook notifications if the media where the reply or mention appears was created by a private account.
- Your app must have successfully completed App Review ( [Advanced Access](https://developers.facebook.com/docs/graph-api/overview/access-levels)) to receive webhooks notifications for all of the fields.

### Step 0: \[Optional\] Use the sample app to test your integration

Download the [webhooks sample app](https://l.facebook.com/l.php?u=https%3A%2F%2Fgithub.com%2Ffbsamples%2Fgraph-api-webhooks-samples%2F&h=AUBmnSDsdGd4nUURZunjmJunQX6hIFzXaVV2KWbtgzjqulwkWBjbzarSg6hKVm_WI8WO7lQrX_1h4VCxdzxl8z_qr8nICVmN3bKqJKgnp1x1jwDOTpAJuMMJGxrxVgygWp6R9srOOM8vVw) to test your integration.

### Step 1: Add the webhooks sub-use case to the main Threads API use case

Under **Use Cases** \> **Customize** \> **Settings**, add the **Get real-time notifications with Threads Webhooks** sub-use case.

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=537570765271468&version=1776866370)

### Step 2: Create an endpoint and configure Threads webhooks

[Create an endpoint](https://developers.facebook.com/docs/graph-api/webhooks/getting-started) that accepts and processes webhooks. To add the configuration:

1. Select the desired topic, and click **Subscribe to this object**.
2. Set the callback URL and token.

The token here is passed to your server defined in the callback URL to allow verification that the call originates from Meta servers.

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=1033258184862601&version=1776866370)

#### Webhook Topics

##### Moderate topic fields

| Name | Description |
| --- | --- |
| `replies` | [Replies](https://developers.facebook.com/docs/threads/retrieve-and-manage-replies/replies-and-conversations#a-thread-s-replies) on a [Threads Media](https://developers.facebook.com/docs/threads/threads-media) owned by the Threads install user.<br>**Required permission(s):** [`threads_basic`](https://developers.facebook.com/docs/permissions#threads_basic), [`threads_read_replies`](https://developers.facebook.com/docs/permissions#threads_read_replies) |
| `delete` | Threads posts that were [deleted](https://developers.facebook.com/docs/threads/posts/delete-posts) by the authenticated user.<br>**Required permissions:** [`threads_basic`](https://developers.facebook.com/docs/permissions#threads_basic), [`threads_delete`](https://developers.facebook.com/docs/permissions#threads_delete) |

##### Interaction topic fields

| Name | Description |
| --- | --- |
| `mentions` | [Mentions](https://developers.facebook.com/docs/threads/threads-mentions) on a public [Threads Media](https://developers.facebook.com/docs/threads/threads-media) tagging the Threads install user.<br>**Required permission(s):** [`threads_basic`](https://developers.facebook.com/docs/permissions#threads_basic), [`threads_manage_mentions`](https://developers.facebook.com/docs/permissions#threads_manage_mentions)<br>**Optional permission(s):** [`threads_read_replies`](https://developers.facebook.com/docs/permissions#threads_read_replies) — required for the `has_replies`, `is_reply`, `replied_to`, and `root_post` fields. Without this permission, these fields will be removed from the webhook response. |
| `publish` | Threads posts that were [published](https://developers.facebook.com/docs/threads/posts) by the authenticated user (including replies to user's or other's posts).<br>**Required permissions:**`threads_basic` |

## Notification Formats

### Fields

| Name | Description |
| --- | --- |
| `app_id` | The Threads App ID displayed in **App Dashboard** \> **App settings** \> **Basic** \> **Threads App ID**. |
| `topic` | Name of the Webhook topic.<br>We support moderate and interaction topics. |
| `target_id` | The media’s ID for a `reply` or `delete` webhook, or the mentioned Threads user app-scoped user ID for a `mentions` webhook. |
| `time` | Time when the real-time notification is sent. |
| `subscription_id` | The subscription ID for the user in the webhook. |
| `id` | The media's ID. |
| `deleted_at` | Time when the post was deleted in ISO 8601 format. |
| `timestamp` | Time when the post was published in ISO 8601 format. |

### Real-time reply notifications

If you subscribe to the `replies` field, we send your endpoint a webhook notification containing the reply object.

#### Sample replies payload

```json
{
    "app_id": "123456",
    "topic": "moderate",
    "target_id": "78901",
    "time": 1723226877,
    "subscription_id": "234567",
    "has_uid_field": false,
    "values": {
        "value": {
            "id": "8901234",
            "username": "test_username",
            "text": "Reply",
            "media_type": "TEXT_POST",
            "permalink": "https:\/\/www.threads.net\/@test_username\/post\/Pp",
            "replied_to": {
                "id": "567890"
            },
           "root_post": {
               "id": "123456",
               "owner_id": "123456",
               "username": "test_username_2"
           },
            "shortcode": "Pp",
            "timestamp": "2024-08-07T10:33:16+0000"
        },
        "field": "replies"
    }
}
```

**Note:** Additional fields not listed in this sample response that are returned when applicable include `is_verified` and `profile_picture_url`.

### Real-time mention notifications

If you subscribe to the `mentions` field, we send your endpoint a webhook notification containing the media object in which the user is mentioned.

#### Sample mentions payload

```json
{
    "app_id": "123456",
    "topic": "interaction",
    "target_id": "78901",
    "time": 1723226877,
    "subscription_id": "234567",
    "has_uid_field": false,
    "values": {
        "value": {
            "id": "8901234",
            "alt_text": "test alt text",
            "gif_url": "https://media2.giphy.com/media/v1.Y2lkPTA1NzQyMTNjd2R0MXcybjZ6bDNyam9qaXJsN3RicnVncnFsanJ2dGk3eDJiejRmbyZlcD12MV9naWZzX2dpZklkJmN0PWc/3o85xEFRBYvAnamJnG/200.gif",
            "has_replies": true,
            "is_quote_post": false,
            "is_reply": false,
            "media_product_type": "THREADS",
            "media_type": "TEXT_POST",
            "permalink": "https:\/\/www.threads.net\/@test_username\/post\/Pp",
            "shortcode": "Pp",
            "text": "Reply",
            "timestamp": "2024-08-07T10:33:16+0000"
            "username": "test_username",
        },
        "field": "mentions"
    }
}
```

**Note:** Additional fields not listed in this sample response that are returned when applicable include `media_url`, `poll_attachment`, `quoted_post`, `replied_to`, `reposted_post`, `root_post`, `is_verified`, `profile_picture_url`, and `thumbnail_url`.

### Real-time delete notifications

If you subscribe to the `delete` field, we send your endpoint a webhook notification containing the media object when it's deleted.

#### Sample delete payload

```json
{
    "app_id": "123456",
    "topic": "moderate",
    "target_id": "78901",
    "time": 1723226877,
    "subscription_id": "234567",
    "has_uid_field": false,
    "values": {
        "value": {
            "id": "8901234",
            "owner": {
               "owner_id": "78901",
            },
            "deleted_at": "2024-08-07T10:33:16+0000"
            "timestamp": "2024-08-07T10:33:16+0000"
            "username": "test_username",
        },
        "field": "delete"
    }
}
```

### Real-time publish notifications

If you subscribe to the `publish` field, we send your endpoint a webhook notification containing the media object when it's published (including replies to user's or other's posts).

#### Sample publish payload

```json
{
    "app_id": "123456",
    "topic": "interaction",
    "target_id": "78901",
    "time": 1723226877,
    "subscription_id": "234567",
    "has_uid_field": false,
    "values": {
        "value": {
            "id": "8901234",
            "media_type": "TEXT_POST"
            "permalink": "https:\/\/www.threads.net\/@test_username\/post\/Pp",
            "timestamp": "2024-08-07T10:33:16+0000"
            "username": "test_username",
        },
        "field": "publish"
    }
}
```

On This Page

[Webhooks for Threads](https://developers.facebook.com/docs/threads/webhooks#webhooks-for-threads)

[Receive Live Webhook Notifications](https://developers.facebook.com/docs/threads/webhooks#receive-live-webhook-notifications)

[Limitations](https://developers.facebook.com/docs/threads/webhooks#limitations)

[Step 0: \[Optional\] Use the sample app to test your integration](https://developers.facebook.com/docs/threads/webhooks#step-0---optional--use-the-sample-app-to-test-your-integration)

[Step 1: Add the webhooks sub-use case to the main Threads API use case](https://developers.facebook.com/docs/threads/webhooks#step-1--add-the-webhooks-sub-use-case-to-the-main-threads-api-use-case)

[Step 2: Create an endpoint and configure Threads webhooks](https://developers.facebook.com/docs/threads/webhooks#step-2--create-an-endpoint-and-configure-threads-webhooks)

[Notification Formats](https://developers.facebook.com/docs/threads/webhooks#notification-formats)

[Fields](https://developers.facebook.com/docs/threads/webhooks#fields)

[Real-time reply notifications](https://developers.facebook.com/docs/threads/webhooks#real-time-reply-notifications)

[Real-time mention notifications](https://developers.facebook.com/docs/threads/webhooks#real-time-mention-notifications)

[Real-time delete notifications](https://developers.facebook.com/docs/threads/webhooks#real-time-delete-notifications)

[Real-time publish notifications](https://developers.facebook.com/docs/threads/webhooks#real-time-publish-notifications)