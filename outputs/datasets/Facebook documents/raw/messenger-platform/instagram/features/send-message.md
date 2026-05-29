---
url: https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message
title: Send a Message - Instagram Messaging
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fmessenger-platform%2Finstagram%2Ffeatures%2Fsend-message%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Instagram Messaging](https://developers.facebook.com/docs/instagram-messaging)

- [Overview](https://developers.facebook.com/docs/instagram-messaging/overview)
- [Get Started](https://developers.facebook.com/docs/instagram-messaging/get-started)
- [Instagram Messaging Webhooks](https://developers.facebook.com/docs/instagram-messaging/webhooks)
- [Generic Template](https://developers.facebook.com/docs/instagram-messaging/generic-template)
- [Button Template](https://developers.facebook.com/docs/instagram-messaging/button-template)
- [Conversation Routing](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing)
- [Human Agent Escalation](https://developers.facebook.com/docs/messenger-platform/instagram/features/human-agent-escalation)
- [Ice Breakers](https://developers.facebook.com/docs/messenger-platform/instagram/features/ice-breakers)
- [ig.me links](https://developers.facebook.com/docs/messenger-platform/instagram/features/ig-me-links)
- [Send a Message](https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message)
- [Sender Actions](https://developers.facebook.com/docs/messenger-platform/instagram/features/sender-actions)
- [Persistent Menu](https://developers.facebook.com/docs/messenger-platform/instagram/features/persistent-menu)
- [Private Replies](https://developers.facebook.com/docs/messenger-platform/instagram/features/private-replies)
- [Product Template](https://developers.facebook.com/docs/messenger-platform/instagram/features/product-template)
- [Quick Replies](https://developers.facebook.com/docs/messenger-platform/instagram/features/quick-replies)
- [Story Mention](https://developers.facebook.com/docs/messenger-platform/instagram/features/story-mention)
- [Attachment Upload API](https://developers.facebook.com/docs/messenger-platform/instagram/features/attachment-upload)
- [User Profile API](https://developers.facebook.com/docs/messenger-platform/instagram/features/user-profile)
- [Moderate Conversations API](https://developers.facebook.com/docs/messenger-platform/instagram/features/moderate-conversations)
- [Sample Experience](https://developers.facebook.com/docs/messenger-platform/instagram/sample-experience)
- [App Review](https://developers.facebook.com/docs/messenger-platform/instagram/app-review)

On This Page

[Send a Message](https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message#send-a-message)

[Before you start](https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message#before-you-start)

[Requirements](https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message#requirements)

[Limitations](https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message#limitations)

[Send a basic message](https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message#send-a-basic-message)

[Sample request](https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message#sample-request)

[Send an image](https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message#send-an-image)

[Sample request: Sending One Image](https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message#sample-request--sending-one-image)

[Sample request: Sending Multiple Images with Image URL](https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message#sample-request--sending-multiple-images-with-image-url)

[Sample request: Sending Multiple Images With Attachment ID](https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message#sample-request--sending-multiple-images-with-attachment-id)

[Send a published post](https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message#send-a-published-post)

[Sample request](https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message#sample-request-2)

[Send a sticker](https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message#send-a-sticker)

[Sample request](https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message#sample-request-3)

[React to a message](https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message#react-to-a-message)

[Sample request](https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message#sample-request-4)

[Unreact to a message](https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message#unreact-to-a-message)

[Send a reply](https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message#send-a-reply)

[Sample request](https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message#sample-request-5)

[Next Steps](https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message#next-steps)

[See Also](https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message#see-also)

[Developer Support](https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message#developer-support)

# Send a Message

This document contains the requirements for sending freeform messages from your Instagram Professional account to your customers or people interested in your account using the Messenger Platform from Meta.

**Note:** If your app users don't have a Facebook Page linked to their Instagram professional account, learn more about building an app with [the Instagram API with Instagram Login](https://developers.facebook.com/docs/instagram/platform/instagram-api).

You can send a freeform message that contains:

- one or more images, a video, or an audio file
- a reaction or sticker
- text, including a link

## Before you start

This guide assumes you have read the [Messenger Platform Overview](https://developers.facebook.com/docs/messenger-platform/overview) and implemented the needed components such as a Facebook Page linked your Instagram Professional account (or test Page), registered as a Meta developer, and created a Business App ID with the Messenger > Instagram Messaging product in the App Dashboard.

You may also want to check the [status of the Meta Developer Platform](https://l.facebook.com/l.php?u=https%3A%2F%2Fmetastatus.com%2F%23developerplatform&h=AUCTbKzc0l2bX1Ox4B541FuD9vp28IXdLlztVSXdBOXe93xFzCtuS9smqS6XwCStOlntHIJtBENfXsGVLonwKpXpmr5TOT8Qgxvh3V9wMXAmqIKmgtFsF_KzLIrcVRpuhtQC2ifszYxd-g) to ensure there are no issues.

### Requirements

- The ID for the Facebook Page linked to your Instagram Professional account
- The Instagram-scoped ID for customer who sent your business a message
- A Page access token requested from a person who can perform the `MESSAGE` task on the Facebook Page linked to your Instagram Professional account
- The `instagram_manage_messages` permission

### Limitations

- Apps with Standard Access can only send messages to people that have a role on the app
- Text message must be less than 1000 characters
- Media attachments can be:

| Media Type | Supported Format | Supported Size Maximum |
| --- | --- | --- |
| Audio | aac, m4a, wav, mp4 | 25MB |
| Image | png, jpeg | 8MB |
| Video | mp4, ogg, avi, mov, webm | 25MB |
| File | pdf | 25MB |

For more information about media attachments, see [Upload Media for Instagram Messaging](https://developers.facebook.com/docs/messenger-platform/instagram/features/attachment-upload).

## Send a basic message

To send a message that contains text or a link, send a `POST` request to the `/PAGE-ID/messages` endpoint with the `recipient` parameter containing the Instagram-scoped ID (IGSID) and the `message` parameter containing the text or link.

Message text must be UTF-8 and be a 1000 bytes or less. Links must be valid formatted URLs.

### Sample request

_Formatted for readability._

```curl
curl -i -X POST \
  "https://graph.facebook.com/<API_VERSION>/me/messages?access_token=<PAGE_ACCESS_TOKEN>" \
  --data 'recipient={"id":"IGSID"}&message={"text":"TEXT-OR-LINK"}'

```

**Sample API response**

Upon success, your app receives the following JSON response:

```json
{
  "recipient_id": "IGSID",
  "message_id": "MESSAGE-ID"
}
```

## Send an image

To send an image, send a `POST` request to the `/me/messages` endpoint with the `recipient` parameter containing the Instagram-scoped ID (`<IGSID>`) and the `message` parameter containing up to ten `attachment` objects with `type` set to `image` and `payload` containing `url` set to the URL for the image.

### Sample request: Sending One Image

```curl
curl -X POST "https://graph.facebook.com/<API_VERSION>/me/messages?access_token=<PAGE_ACCESS_TOKEN>
     -H "Content-Type: application/json"
     -d '{
           "recipient":{
               "id":"<IGSID>"
           },
           "message":{
              "attachment": {
                 "type":"image",
                 "payload":{
                   "url":"<IMAGE_URL>"
                 }
              }
           }
         }'
```

### Sample request: Sending Multiple Images with Image URL

```curl
curl -X POST "https://graph.facebook.com/<API_VERSION>/me/messages?access_token=<PAGE_ACCESS_TOKEN>
     -H "Content-Type: application/json"
     -d '{
           "recipient":{
               "id":"<IGSID>"
           },
           "message":{
              "attachments":[\
                 {\
                   "type":"image",\
                   "payload":{\
                     "url":"<IMAGE_URL>"\
                   }\
                 },\
                 {\
                   "type":"image",\
                   "payload":{\
                     "url":"<IMAGE_URL>"\
                   }\
                 },\
                 {\
                    ...\
                 }\
              ]
           }
         }'
```

### Sample request: Sending Multiple Images With Attachment ID

The same images can be uploaded using the [Attachment Upload API](https://developers.facebook.com/docs/messenger-platform/instagram/features/attachment-upload) and sent to many different users to avoid the delays and timeouts of uploading multiple high-resolution images. You can also mix both `url` and `attachment_id` parameters in the `payload`.

```curl
curl -X POST "https://graph.facebook.com/<API_VERSION>/me/messages?access_token=<PAGE_ACCESS_TOKEN>
     -H "Content-Type: application/json"
     -d '{
           "recipient":{
               "id":"<IGSID>"
           },
           "message":{
              "attachments":[\
                 {\
                   "type":"image",\
                   "payload":{\
                     "attachment_id":"<attachment_ID>"\
                   }\
                 },\
                 {\
                   "type":"image",\
                   "payload":{\
                     "attachment_id":"<attachment_ID>"\
                   }\
                 },\
                 {\
                    ...\
                 }\
              ]
           }
         }'
```

**Sample API responses**

Upon success, your app receives the following JSON response:

```json
{
  "recipient_id": "IGSID",
  "message_id": "MESSAGE-ID"
}
```

## Send a published post

To send a message that contains a post you published to Instagram, send a `POST` request to the `/PAGE-ID/messages` endpoint with the `recipient` parameter containing the Instagram-scoped ID (IGSID) and the `message` parameter containing an `attachment` object with the `type` set to `MEDIA_SHARE` and `payload` containing the Meta ID for the post.

Your business must own the media to be used in the message.

### Sample request

```curl
curl -i -X POST \
  "https://graph.facebook.com/&lt;API_VERSION>/me/messages?access_token=&lt;PAGE_ACCESS_TOKEN>" \
  --data 'recipient={"id":"IGSID"}&message={
      "attachment":
        {
          "type":"MEDIA_SHARE",
          "payload":{"id":"POST-ID"}
        }
}’
```

**Sample API response**

Upon success, your app receives the following JSON response:

```json
{
  "recipient_id": "IGSID",
  "message_id": "MESSAGE-ID"
}
```

## Send a sticker

To send a heart sticker, send a `POST` request to the `/PAGE-ID/messages` endpoint with the `recipient` parameter containing the Instagram-scoped ID (IGSID) and the `message` parameter containing an `attachment` object with the `type` set to `like_heart`.

### Sample request

_Formatted for readability._

```curl
curl -i -X POST \
  "https://graph.facebook.com/&lt;API_VERSION>/me/messages?access_token=&lt;PAGE_ACCESS_TOKEN>" \
  --data 'recipient={"id":"IGSID"}&message={
      "attachment":
        {
          "type":"like_heart"
        }
}’
```

**Sample API response**

Upon success, your app receives the following JSON response:

```json
{
  "recipient_id": "IGSID",
  "message_id": "MESSAGE-ID"
}
```

## React to a message

To send a reaction, send a `POST` request to the `/PAGE-ID/messages` endpoint with the `recipient` parameter containing the Instagram-scoped ID (IGSID) and the `sender_action` parameter to `react` with the `payload` containing the `message_id` set to the ID for the message to apply the reaction to and `reaction` to `love`.

### Sample request

_Formatted for readability._

```curl
curl -i -X POST \
  "https://graph.facebook.com/&lt;API_VERSION>/me/messages?access_token=&lt;PAGE_ACCESS_TOKEN>" \
  --data 'recipient={"id":"IGSID"}&sender_action=react&payload={
      "message_id":"MESSAGE-ID",
      "reaction":"love",
}'
```

### Unreact to a message

To remove a reaction from a message, send a `POST` request to the `/PAGE-ID/messages` endpoint with the `recipient` parameter containing the Instagram-scoped ID (IGSID) and the `sender_action` parameter to `unreact` with the `payload` containing the `message_id` set to the ID for the message from which to remove the reaction.

### Sample request

```curl
curl -i -X POST \
  "https://graph.facebook.com/&lt;API_VERSION>/me/messages?access_token=&lt;PAGE_ACCESS_TOKEN>" \
  --data 'recipient={"id”:”IGSID”}&sender_action="unreact"&payload={
      “message_id":"MESSAGE-ID",
}'
```

**Sample API response**

Upon success, your app receives the following JSON response for react and unreact requests:

```json
{
  "recipient_id": "IGSID"
}
```

## Send a reply

To send a reply to a specific past message within the chat, send a `POST` request to the `/PAGE-ID/messages` endpoint with the `recipient` parameter containing the Instagram-scoped ID (IGSID), your message details in the `message` parameter object, and the `reply_to` object with `mid` set to the message id of the specific message in the chat you want to reply to. The message can either be the message your business sent, or the user had sent.

You can send a text message, media message, template message as a reply to a message by using the `reply_to` object

### Sample request

_Formatted for readability._

```curl
curl -X POST "https://graph.facebook.com/<API_VERSION>/me/messages?access_token=<PAGE_ACCESS_TOKEN>
     -H "Content-Type: application/json"
     -d '{
           "recipient":{
               "id":"<IGSID>"
           },
           "message":{
              "text": "TEXT"
           },
           "reply_to": {
              "mid": "<MESSAGE_ID>"
           }
         }'
```

**Sample API response**

Upon success, your app receives the following JSON response with the recipient's ID and the message ID:

```json
{
  "recipient_id": "IGSID"
  "message_id": "MESSAGE-ID"
}
```

## Next Steps

- [Upload media such as audio, or image](https://developers.facebook.com/docs/messenger-platform/instagram/features/attachment-upload) to Meta servers to be used in multiple messages.

- Send a structured message such as a [generic template](https://developers.facebook.com/docs/messenger-platform/instagram/features/generic-template), a [product template](https://developers.facebook.com/docs/messenger-platform/instagram/features/product-template), or a [persistent menu](https://developers.facebook.com/docs/messenger-platform/instagram/features/persistent-menu).


## See Also

- [Error Codes](https://developers.facebook.com/docs/messenger-platform/error-codes)
- [Rate Limits for Instagram Messaging](https://developers.facebook.com/docs/messenger-platform/instagram/rate-limit)
- [Get the Media ID for your Media Assets](https://developers.facebook.com/docs/instagram-api/reference/ig-media)

### Developer Support

- Use the [Meta Status tool](https://l.facebook.com/l.php?u=https%3A%2F%2Fmetastatus.com%2F&h=AUDUed6aW7jfr-OztNyzX3a0OzQjvi13GpGvNzjlxNStH7jwiMhxxAqj8csJrbZR59fjO1RgAKf7xmWBNac-xog2S2c0uO72HXMYmWYr6KkyzPfEN69td_Yolm0Exw12k2QEkvRG4Vc90g) to check for the status and outages of Meta business products.
- Use the [Meta Developer Support tool](https://developers.facebook.com/support) to report bugs and view reported bugs, get help with Ads or Business Manager, and more.

On This Page

[Send a Message](https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message#send-a-message)

[Before you start](https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message#before-you-start)

[Requirements](https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message#requirements)

[Limitations](https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message#limitations)

[Send a basic message](https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message#send-a-basic-message)

[Sample request](https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message#sample-request)

[Send an image](https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message#send-an-image)

[Sample request: Sending One Image](https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message#sample-request--sending-one-image)

[Sample request: Sending Multiple Images with Image URL](https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message#sample-request--sending-multiple-images-with-image-url)

[Sample request: Sending Multiple Images With Attachment ID](https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message#sample-request--sending-multiple-images-with-attachment-id)

[Send a published post](https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message#send-a-published-post)

[Sample request](https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message#sample-request-2)

[Send a sticker](https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message#send-a-sticker)

[Sample request](https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message#sample-request-3)

[React to a message](https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message#react-to-a-message)

[Sample request](https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message#sample-request-4)

[Unreact to a message](https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message#unreact-to-a-message)

[Send a reply](https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message#send-a-reply)

[Sample request](https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message#sample-request-5)

[Next Steps](https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message#next-steps)

[See Also](https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message#see-also)

[Developer Support](https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message#developer-support)