---
url: https://developers.facebook.com/docs/instagram-platform/self-messaging
title: Self Messaging - Instagram Platform
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Finstagram-platform%2Fself-messaging%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Instagram Platform](https://developers.facebook.com/docs/instagram-platform)

- [Overview](https://developers.facebook.com/docs/instagram-platform/overview)
- [Webhooks](https://developers.facebook.com/docs/instagram-platform/webhooks)
- [Create an App](https://developers.facebook.com/docs/instagram-platform/create-an-instagram-app)
- [Instagram API with Instagram Login](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login)
- [Instagram API with Facebook Login](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login)
- [Publish Content](https://developers.facebook.com/docs/instagram-platform/content-publishing)
- [Comment Moderation](https://developers.facebook.com/docs/instagram-platform/comment-moderation)
- [Private Replies](https://developers.facebook.com/docs/instagram-platform/private-replies)
- [Insights](https://developers.facebook.com/docs/instagram-platform/insights)
- [Sharing to Feed](https://developers.facebook.com/docs/instagram-platform/sharing-to-feed)
- [Sharing to Stories](https://developers.facebook.com/docs/instagram-platform/sharing-to-stories)
- [oEmbed](https://developers.facebook.com/docs/instagram-platform/oembed)
- [Embed Button](https://developers.facebook.com/docs/instagram-platform/embed-button)
- [Self Messaging](https://developers.facebook.com/docs/instagram-platform/self-messaging)
- [API Reference](https://developers.facebook.com/docs/instagram-platform/reference)
- [App Review](https://developers.facebook.com/docs/instagram-platform/app-review)
- [Support](https://developers.facebook.com/docs/instagram-platform/support)
- [Changelog](https://developers.facebook.com/docs/instagram-platform/changelog)

On This Page

[Self Messaging](https://developers.facebook.com/docs/instagram-platform/self-messaging#self-messaging)

[Requirements](https://developers.facebook.com/docs/instagram-platform/self-messaging#requirements)

[Availability and Limitations](https://developers.facebook.com/docs/instagram-platform/self-messaging#availability-and-limitations)

[Step 1: Onboard the IG Professional Account](https://developers.facebook.com/docs/instagram-platform/self-messaging#step-1--onboard-the-ig-professional-account)

[Step 2: Set Up Webhooks](https://developers.facebook.com/docs/instagram-platform/self-messaging#step-2--set-up-webhooks)

[Example Echo Webhook](https://developers.facebook.com/docs/instagram-platform/self-messaging#example-echo-webhook)

[Step 3: Send a Self Message Using the Business Messaging API](https://developers.facebook.com/docs/instagram-platform/self-messaging#step-3--send-a-self-message-using-the-business-messaging-api)

[Example Request](https://developers.facebook.com/docs/instagram-platform/self-messaging#example-request)

[Postback and Comment Webhooks](https://developers.facebook.com/docs/instagram-platform/self-messaging#postback-and-comment-webhooks)

[Example Postback Webhook](https://developers.facebook.com/docs/instagram-platform/self-messaging#example-postback-webhook)

[Example Comment Webhook](https://developers.facebook.com/docs/instagram-platform/self-messaging#example-comment-webhook)

# Self Messaging

This enables a single Instagram Professional account to act as both a **business** and an **Instagram user**, eliminating the need for two separate accounts when testing message previews or automation. This helps showcase messaging automation previews to your newly onboarded business users.

Since the business is messaging itself, the **24-hour response window** does **not apply**.

## Requirements

You will need the following:

- An **Instagram Professional account** connected to your app

- **Business Messaging API** access

- **Webhooks** configured for message events


### Availability and Limitations

The feature is available for IG business users onboarded through either of these flows: Instagram API with Instagram Login and Instagram API with Facebook Login. **Quick Replies** are not currently supported for self messaging.

## Step 1: Onboard the IG Professional Account

This guide assumes you have read the [Instagram Platform Overview](https://developers.facebook.com/docs/instagram-platform/overview) and implemented the needed components for using this API, such as a Meta login flow and a webhooks server to receive notifications.

|  | Instagram API with Instagram Login | Instagram API with Facebook Login |
| --- | --- | --- |
| **Access Levels** | - Advanced Access<br>- Standard Access | - Advanced Access<br>- Standard Access |
| **Access Tokens** | - Instagram User access token | - Facebook Page access token |
| **Host URL** | `graph.instagram.com` | `graph.facebook.com` |
| **Login Type** | Business Login for Instagram | Facebook Login for Business |
| [**Permissions**](https://developers.facebook.com/docs/permissions/reference#i) | **Self messaging webhook**<br>- `instagram_business_basic`<br>- `instagram_business_manage_messages`<br>**Self comment webhook**<br>- `instagram_business_basic`<br>- `instagram_business_manage_comments` | **Self messaging webhook**<br>- `instagram_business_basic`<br>- `instagram_business_manage_messages`<br>**Self comment webhook**<br>- `instagram_basic`<br>- `instagram_manage_comments`<br>- `pages_read_engagement`<br>If the app user was granted a role on the [Page](https://developers.facebook.com/docs/instagram-api/overview#pages) connected to your app user's Instagram professional account via the Business Manager, your app will also need:<br>- `ads_management`<br>- `ads_read` |
| **Webhooks** | **Self messaging webhook**<br>- `messages`<br>**Self comment webhook**<br>- `comments`<br>- `live_comments` | **Self messaging webhook**<br>- `messages`<br>**Self comment webhook**<br>- `comments`<br>- `live_comments` |

## Step 2: Set Up Webhooks

Set up the webhook to listen for **message** and **postback** events.

When the Instagram Professional account sends a message to itself in the Instagram app, an **echo webhook** is triggered, including the **Instagram-scoped ID** of the account. `is_self` with a value of `true` indicates it is a self message.

### Example Echo Webhook

```json
{
  "object": "instagram",
  "entry": [\
    {\
      "id": "<YOUR_APP_USERS_IG_USER_ID>",\
      "time": 1569262486134,\
      "messaging": [\
        {\
          "sender": { "id": "<YOUR_APP_USERS_IG_USER_ID>" },\
          "recipient": { "id": "<INSTAGRAM_SCOPED_ID>" },\
          "timestamp": 1569262485349,\
          "message": {\
            "mid": "<MESSAGE_ID>",\
            "text": "<MESSAGE_TEXT>",\
            "is_echo": true,\
            "is_self": true\
          }\
        }\
      ]\
    }\
  ]
}
```

## Step 3: Send a Self Message Using the Business Messaging API

Use the `recipient ID` received from the webhook to send a message to self on the API.

### Example Request

```curl
      curl -X POST "https://graph.facebook.com/v25.0/<INSTAGRAM_SCOPED_ID>/messages" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer <ACCESS_TOKEN>" \
        -d '{
              "message": {
                "text": "Hello from your IG Pro account!"
              }
            }'

```

On success, your app receives a confirmation with the message ID.

```json
{
  "id": "<MESSAGE_ID>"
}
```

## Postback and Comment Webhooks

When the Instagram Professional user clicks a CTA button or interacts with a message, a **postback webhook** is generated with `"is_self": true`.

### Example Postback Webhook

```json
{
  "object": "instagram",
  "entry": [\
    {\
      "id": "45202218377435",\
      "time": 1743480368963,\
      "messaging": [\
        {\
          "sender": { "id": "<YOUR_APP_USERS_IG_USER_ID>" },\
          "recipient": { "id": "<INSTAGRAM_SCOPED_ID>" },\
          "timestamp": 1743480368714,\
          "is_self": true,\
          "postback": {\
            "title": "Start Chatting",\
            "payload": "DEVELOPER_DEFINED_PAYLOAD",\
            "mid": "<MESSAGE_ID>"\
          }\
        }\
      ]\
    }\
  ]
}
```

### Example Comment Webhook

When the Instagram Professional user comments on their own post, a **comments webhook** is generated with `self_ig_scoped_id` as the `IGSID` of their professional account.

```json
{
  "object": "instagram",
  "entry": [\
    {\
      "id": "<YOUR_APP_USERS_INSTAGRAM_ACCOUNT_ID>",\
      "time": "<TIME_META_SENT_THIS_NOTIFICATION>",\
      "changes": [\
        {\
          "field": "comments",\
          "value": {\
            "from": {\
              "id": "<YOUR_APP_USERS_INSTAGRAM_ACCOUNT_ID>",\
              "username": "<INSTAGRAM_USER_USERNAME>",\
              "self_ig_scoped_id": "<YOUR_APP_USERS_INSTAGRAM_SCOPED_ID>"\
            },\
            "id": "<COMMENT_ID>",\
            "text": "<COMMENT_TEXT>",\
            "media": {\
              "id": "<MEDIA_ID>",\
              "media_product_type": "<MEDIA_PRODUCT_TYPE>"\
            }\
          }\
        }\
      ]\
    }\
  ]
}
```

On This Page

[Self Messaging](https://developers.facebook.com/docs/instagram-platform/self-messaging#self-messaging)

[Requirements](https://developers.facebook.com/docs/instagram-platform/self-messaging#requirements)

[Availability and Limitations](https://developers.facebook.com/docs/instagram-platform/self-messaging#availability-and-limitations)

[Step 1: Onboard the IG Professional Account](https://developers.facebook.com/docs/instagram-platform/self-messaging#step-1--onboard-the-ig-professional-account)

[Step 2: Set Up Webhooks](https://developers.facebook.com/docs/instagram-platform/self-messaging#step-2--set-up-webhooks)

[Example Echo Webhook](https://developers.facebook.com/docs/instagram-platform/self-messaging#example-echo-webhook)

[Step 3: Send a Self Message Using the Business Messaging API](https://developers.facebook.com/docs/instagram-platform/self-messaging#step-3--send-a-self-message-using-the-business-messaging-api)

[Example Request](https://developers.facebook.com/docs/instagram-platform/self-messaging#example-request)

[Postback and Comment Webhooks](https://developers.facebook.com/docs/instagram-platform/self-messaging#postback-and-comment-webhooks)

[Example Postback Webhook](https://developers.facebook.com/docs/instagram-platform/self-messaging#example-postback-webhook)

[Example Comment Webhook](https://developers.facebook.com/docs/instagram-platform/self-messaging#example-comment-webhook)