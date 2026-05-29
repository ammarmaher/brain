---
url: https://developers.facebook.com/docs/messenger-platform/instagram/features/attachment-upload
title: Attachment Upload API - Instagram Messaging
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fmessenger-platform%2Finstagram%2Ffeatures%2Fattachment-upload%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Upload Media for Instagram Messaging](https://developers.facebook.com/docs/messenger-platform/instagram/features/attachment-upload#upload-media-for-instagram-messaging)

[Before you start](https://developers.facebook.com/docs/messenger-platform/instagram/features/attachment-upload#before-you-start)

[Limitations](https://developers.facebook.com/docs/messenger-platform/instagram/features/attachment-upload#limitations)

[Upload media](https://developers.facebook.com/docs/messenger-platform/instagram/features/attachment-upload#upload-media)

[From a URL](https://developers.facebook.com/docs/messenger-platform/instagram/features/attachment-upload#from-a-url)

[From a server](https://developers.facebook.com/docs/messenger-platform/instagram/features/attachment-upload#from-a-server)

[Sample response](https://developers.facebook.com/docs/messenger-platform/instagram/features/attachment-upload#sample-response)

[Send the media](https://developers.facebook.com/docs/messenger-platform/instagram/features/attachment-upload#send-the-media)

[Upload and Send](https://developers.facebook.com/docs/messenger-platform/instagram/features/attachment-upload#upload-and-send)

[From a URL](https://developers.facebook.com/docs/messenger-platform/instagram/features/attachment-upload#from-a-url-2)

[From a Server](https://developers.facebook.com/docs/messenger-platform/instagram/features/attachment-upload#from-a-server-2)

[Sample API response](https://developers.facebook.com/docs/messenger-platform/instagram/features/attachment-upload#api-response)

# Upload Media for Instagram Messaging

This document shows you how to upload media to the Meta servers using the Attachment Upload API. This media can then be used in Instagram messages.

**Note:** You can upload and send an attachment in a single API call.

## Before you start

You need the following:

- The **Page ID** for the Facebook Page linked to the Instagram for the business who owns the media to be uploaded
- A **Page access token** requested by a person who can perform the `MESSAGING` task on the Page
- Your app will need approval from the person uploading the media via Business Login for Instagram or Facebook Login for the following permissions:

  - `instagram_basic`
  - `instagram_manage_comments`
  - `instagram_manage_messages`
  - `pages_messaging`
- Your app will need **Advanced Access** for the required permissions to upload media for Pages you do not own or administer
- Either the **URL** for the media, if uploading from a URL, or the **file path** to the media, if uploading from your server


  - Media types can be `image` (which include GIFs), `video`, `audio`, or `file`
  - Media formats can be:

| Media Type | Supported Format | Supported Size Maximum |
| --- | --- | --- |
| Audio | acc, m4a, wav, mp4 | 25MB |
| Image | png, jpeg, gif | 8MB |
| Video | mp4, ogg, avi, mov, webm | 25MB |
| File | pdf | 25MB |

### Limitations

- If your app only has Standard Access to any of the required permissions, your app will only be able to upload media for Pages you own or administer.
- The permissions listed above when granted to your app allows your app to upload media but does not allow your app to send a message.
- Media file name containing non-ASCII characters (such as Chinese characters) are not supported for attachment uploads.

## Upload media

You can upload media from a URL or from a server.

### From a URL

To upload media from a URL, you can send a `POST` request to the `/<PAGE_ID>/message_attachments` endpoint with the platform set as Instagram and the message attachment type set to the type of media you are uploading, `audio`, `image`, `video` or `file`. Add the URL and `is_reusable` in the payload. Set `is_reusable` to true so that the media can be used in multiple messages.

**Note:** All keys within the `message` object, such as `attachment`, `type`, and `payload` are strings.

#### Sample request

_Formatted for readability._

```html
curl "https://graph.facebook.com/<LATEST-API-VERSION>/<PAGE_ID>/message_attachments"
    -H "Content-Type: application/json"
    -H "Authorization: Bearer <PAGE_ACCESS_TOKEN>"
    -d '{
          "platform":"instagram",
          "message":
            {
              "attachment":
                {
                  "type": "<MEDIA_TYPE>",
                  "payload":
                    {
                      "url": "<MEDIA_URL>",
                      "is_reusable": "true",
                    },
                }
            }
       }'
```

### From a server

To upload media from a server, you can send a `POST` request to the `/<PAGE_ID>/message_attachments` endpoint with the message attachment payload containing the URL and the platform set to `instagram`. If you want to use the media in multiple messages, include the `is_reusable` set to true in the payload.

#### Sample request

_Formatted for readability._

```html
curl "https://graph.facebook.com/<LATEST-API-VERSION>/<PAGE_ID>/message_attachments"
    -H "Content-Type: application/json"
    -H "Authorization: Bearer <PAGE_ACCESS_TOKEN>"
    -d '{
          "platform":"instagram",
          "filedata":"<FILE_PATH>;type=<PATH_TYPE>",
          "message":
            {
              "attachment":
                {
                  "type": "<MEDIA_TYPE>",
                  "is_reusable": "true",
                }
            }
       }'
```

### Sample response

Upon success, your app will receive an ID for the attachment. You can now include this ID in your messages.

```json
{
    "attachment_id": "<ATTACHMENT_ID>"
}
```

## Send the media

Now that you have uploaded media, you can send it in a message.

To send a message that contains the media you uploaded, send a `POST` request to the `/<PAGE_ID>/messages` endpoint with the `recipient` parameter containing the Instagram-scoped ID (IGSID) and the `message` parameter containing an `attachment` object with the `type` set to `MEDIA_SHARE` and `payload.id` set to the attachment ID.

Your business must own the media to be used in the message.

#### Sample Request

_Formatted for readability._

```html
curl "https://graph.facebook.com/<LATEST-API-VERSION>/<PAGE_ID>/messages"
    -H "Content-Type: application/json"
    -H "Authorization: Bearer <PAGE_ACCESS_TOKEN>"
    -d '{
          "recipient":
            {
              "id":"<IGSID>"
            },
          "message":
            {
              "attachment":
                {
                  "type": "MEDIA_SHARE",
                  "payload":
                    {
                      "attachment_id":"<ATTACHMENT_ID>"
                    }
                }
            }
       }'
```

#### Sample API Response

Upon success, your app receives a JSON response with the recipient's ID and the message's ID.

```json
{
  "recipient_id": "<IGSID>",
  "message_id": "<MESSAGE_ID>"
}
```

## Upload and Send

You can also upload media and send it in a single API request.

### From a URL

To upload and send media in one request, send a `POST` request to the `/<PAGE_ID>/messages` endpoint with the `recipient` parameter containing the Instagram-scoped ID (IGSID) and the `message` parameter containing an `attachment` object with the `type` set to `audio`, `image`, `video` or `file` and `payload` containing the URL and `is_reusable` set to true.

#### Sample Request

_Formatted for readability._

```html
curl "https://graph.facebook.com/<LATEST-API-VERSION>/<PAGE_ID>/messages"
    -H "Content-Type: application/json"
    -H "Authorization: Bearer <PAGE_ACCESS_TOKEN>"
    -d '{
          "recipient":
            {
              "id":"<IGSID>"
            },
          "message":
            {
              "attachment":
                {
                  "type":"<MEDIA_TYPE>",
                  "payload":
                    {
                      "url":"<URL_TO_MEDIA>"
                    },
                  "is_reusable": "true",
                }
            }
       }'
```

### From a Server

To upload and send an image, audio, file or video from your server, send a `POST` request to the `/<PAGE_ID>/messages` endpoint with the `recipient` parameter containing the Instagram-scoped ID (IGSID) and the `message` parameter containing an `attachment` object with the `type` set to `AUDIO`, `IMAGE`, `VIDEO` or `FILE` and `filedata` parameter the file's location and type. The format for `filedata` values looks like **@/path\_on\_my\_server/video.mp4;type=video/mp4**.

#### Sample Request

_Formatted for readability._

```html
curl "https://graph.facebook.com/<LATEST-API-VERSION>/<PAGE_ID>/messages"
    -H "Content-Type: application/json"
    -H "Authorization: Bearer <PAGE_ACCESS_TOKEN>"
    -d '{
          "recipient":
            {
              "id":"<IGSID>"
            },
          "filedata":"<FILE_PATH>;type=<PATH_TYPE>"
          "message":{
            "attachment":
              {
                "type":"<MEDIA_TYPE>",
                "is_reusable": "true",
              }
          }
       }'
```

### Sample API response

Upon success, your app receives a JSON response with the recipient ID, message ID, and attachment ID.

```json
{
  "recipient_id": "<IGSID>",
  "message_id": "<MESSAGE_ID>",
  "attachment_id": "<ATTACHMENT_ID>"
}
```

On This Page

[Upload Media for Instagram Messaging](https://developers.facebook.com/docs/messenger-platform/instagram/features/attachment-upload#upload-media-for-instagram-messaging)

[Before you start](https://developers.facebook.com/docs/messenger-platform/instagram/features/attachment-upload#before-you-start)

[Limitations](https://developers.facebook.com/docs/messenger-platform/instagram/features/attachment-upload#limitations)

[Upload media](https://developers.facebook.com/docs/messenger-platform/instagram/features/attachment-upload#upload-media)

[From a URL](https://developers.facebook.com/docs/messenger-platform/instagram/features/attachment-upload#from-a-url)

[From a server](https://developers.facebook.com/docs/messenger-platform/instagram/features/attachment-upload#from-a-server)

[Sample response](https://developers.facebook.com/docs/messenger-platform/instagram/features/attachment-upload#sample-response)

[Send the media](https://developers.facebook.com/docs/messenger-platform/instagram/features/attachment-upload#send-the-media)

[Upload and Send](https://developers.facebook.com/docs/messenger-platform/instagram/features/attachment-upload#upload-and-send)

[From a URL](https://developers.facebook.com/docs/messenger-platform/instagram/features/attachment-upload#from-a-url-2)

[From a Server](https://developers.facebook.com/docs/messenger-platform/instagram/features/attachment-upload#from-a-server-2)

[Sample API response](https://developers.facebook.com/docs/messenger-platform/instagram/features/attachment-upload#api-response)