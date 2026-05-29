---
url: https://developers.facebook.com/docs/instagram-messaging/webhooks
title: Instagram Messaging Webhooks
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Finstagram-messaging%2Fwebhooks%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Instagram Messaging](https://developers.facebook.com/docs/instagram-messaging)

- [Overview](https://developers.facebook.com/docs/instagram-messaging/overview)
- [Get Started](https://developers.facebook.com/docs/instagram-messaging/get-started)
- [Instagram Messaging Webhooks](https://developers.facebook.com/docs/instagram-messaging/webhooks)


  - [Webhook debugger](https://developers.facebook.com/docs/instagram-messaging/webhooks/debugging)

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

[Webhooks for Instagram Messaging](https://developers.facebook.com/docs/instagram-messaging/webhooks/#webhooks-for-instagram-messaging)

[Webhook Events](https://developers.facebook.com/docs/instagram-messaging/webhooks/#webhook-events)

[Example Notifications](https://developers.facebook.com/docs/instagram-messaging/webhooks/#example-notifications)

[Messages](https://developers.facebook.com/docs/instagram-messaging/webhooks/#messages)

[Message Reactions](https://developers.facebook.com/docs/instagram-messaging/webhooks/#message-reactions)

[Messaging Postbacks](https://developers.facebook.com/docs/instagram-messaging/webhooks/#messaging-postbacks)

[Messaging Referral](https://developers.facebook.com/docs/instagram-messaging/webhooks/#igme)

[Messaging Seen](https://developers.facebook.com/docs/instagram-messaging/webhooks/#messaging-seen)

[Disappearing Media](https://developers.facebook.com/docs/instagram-messaging/webhooks/#disappearing-media)

[See Also](https://developers.facebook.com/docs/instagram-messaging/webhooks/#see-also)

[Developer Support](https://developers.facebook.com/docs/instagram-messaging/webhooks/#developer-support)

# Webhooks for Instagram Messaging

Webhooks allows you to receive real-time HTTP notifications of changes to specific objects in the Meta social graph. For example, we could send you a notification when a customer sends your Instagram Professional account a message. Webhooks notifications allow you to track messaging changes and avoid rate limits that would occur if you were querying the Messenger Platform endpoints to track changes.

### Requirements

You will need to implement the following requirements to receive Webhooks notifications for Instagram Messaging.

- The `instagram_basic`, `instagram_manage_messages`, and `pages_manage_metadata` permissions
- To get webhooks notification that include data owned or managed by people who do not have a role on your app, your app must have been approved in App Review. Your app user must have granted your app the prerequisite permissions.

  - If your app has not been approve, pending or review is not needed, Webhooks will only be sent if the person using your app has a role on the app. You can only access data you own or administer.
- Your app must be published, regardless of app review status, to receive webhooks.

**Note:** You will need to subscribe all messaging apps for your business to the messaging webhooks.

Learn more about
[access levels](https://developers.facebook.com/docs/graph-api/overview/access-levels),
[app modes](https://developers.facebook.com/docs/development/build-and-test/app-modes)
and
[app roles.](https://developers.facebook.com/docs/development/build-and-test/app-roles)

### Limitations

- When a customer reacts to or forwards an image from a carousel in an Instagram Post, the notification will include the first image in the carousel which may not be the image the customer reacted to or forwarded.


- Only the URL for the shared media or post is included in the notification when a customer sends a message with a share.


- Messages with gifs and stickers are not supported. If a person sends a message with a gif or sticker a webhook will not be triggered and a webhook notification will not be sent.


- [Disappearing media](https://l.facebook.com/l.php?u=https%3A%2F%2Fhelp.instagram.com%2F1310346208996329%2F%3Fcms_platform%3Diphone-app&h=AUBIxyQAvcyfmX0mbauLQn5Uj6qSHeKqLrlt2ZMHAoNv7icanwMlYfhu92VJ0Qc1W8xk-L2b5CbU5Z-lqfL8p2uCT0xkAytIGKw_26s8V7uWERvj4eMI1wj0Cn0TPQbC22PSPlxkicm1Iw) (view once, allow replay) is not supported on Instagram media webhooks.



## Webhook Events

| Webhook Field | Description |
| --- | --- |
| `message_reactions` | A notification is sent when a customer reacts or unreacts to a message<br>Graph API v12.0 and later supports `angry`, `sad`, `wow`, `love`, `like`, `laugh`, and `other` reactions. |
| `messages` | A notification is sent when a customer sends your business:<br>- a message with text or media (image/video/file/audio)<br>- a share (media/post shares)<br>- a story reply or mention. Only story mentions will trigger a webhook. Tagging on regular posts will not trigger a webhook. Story Replies webhook currently doesn't support GIF or sticker.<br>- an inline message reply or sticker<br>- a quick reply or Icebreaker option or Generic Template button is selected <br>- a customer deletes a message<br>- a message from a customer is unsupported<br>- a customer sends a message from an Instagram Shops product detail page<br>- a customer clicks an ad that goes to an Instagram Messaging conversation [(Click To Direct, CTD)](https://www.facebook.com/business/help/198088077975174)<br>A notification is also sent when your business sends a message to a customer. A notification will not be sent when your business reacts or unreacts to a customer message.<br>This callback will occur when a message has been sent by your Instagram account. `is_echo` flag will be present to indicate that the message is sent from the Instagram account itself. `message_reactions` event will not have an echo webhook delivered |
| `messaging_postbacks` | A notification is sent when a customer clicked an Icebreaker option or Generic Template button<br>Requires v8.0 or later. Requires v11.0 or later for inclusion of the `mid` field. |
| `messaging_seen` | A notification is sent when a message has been read by the recipient |
| `messaging_referral` | A notification is sent when an `ig.me` link with a referral parameter is clicked by a customer in an existing conversation |
| `standby` | When the messaging flow has multiple apps, a notification is sent when a customer sends your business a message but the app is not in control of the conversation at the time the message was sent. |

## Example Notifications

The following are examples for the types of webhooks notifications you can receive.

### Messages

```json
{
  "object": "instagram",
  "entry": [\
    {\
      "id": "IGID",  // ID of your Instagram Professional account\
      "time": 1569262486134,\
      "messaging": [\
        {\
          "sender": { "id": "IGSID" },    // Instagram-scoped ID for the customer who sent the message\
          "recipient": { "id": "IGID" },  // ID of your Instagram Professional account\
          "timestamp": 1569262485349,\
          "message": {\
            "mid": "MESSAGE-ID",   // ID of the message sent to your business\
\
            "text": "MESSAGE-TEXT"     // Included when a customer sends a message containing text\
\
            "attachments": [           // Included when a customer sends multiple media attachments or a URL for a story mention or share\
              {\
                "type":"image",             // Can be audio, file, image (image or sticker), share, story_mention, video, ig_reel or reel\
                "payload":{ "url":"LINK" }\
              },\
              {\
                "type":"video",\
                "payload":{ "url":"LINK" }\
              }\
            ]\
\
            "is_deleted": true         // Included when a customer deletes a message\
\
            "is_echo": true            // Included when your business sends a message to the customer\
\
            "is_unsupported": true,    // Included when a customer sends a message with unsupported media\
\
            "quick_reply": {           // Included when a customer clicks a quick reply\
              "payload": "CUSTOMER-RESPONSE-PAYLOAD"   // The payload with the option selected by the customer\
            },\
\
            "referral": {              // Included when a customer clicks an Instagram Shop product\
              "product": {\
                "id": "PRODUCT-ID"\
            }\
\
            "referral": {                   // Included when a customer clicks an CTD ad\
              "ref": "REF-DATA-IN-AD-IF-SPECIFIED"\
              "ad_id": AD-ID,\
              "source": "ADS",\
              "type": "OPEN_THREAD",\
              "ads_context_data": {\
                "ad_title": TITLE-FOR-THE-AD,\
                "photo_url": IMAGE-URL-THAT-WAS-CLICKED,\
                "video_url": THUMBNAIL-URL-FOR-THE-AD-VIDEO,\
              }\
            }\
\
            "reply_to":{               // Included when a customer sends an inline reply\
              "mid":"MESSAGE-ID"\
            }\
\
            "reply_to": {               // Included when a customer replies to a story\
              "story": {\
                "url":"CDN-URL",\
                "id":"STORY-ID"\
              }\
            }\
          }\
        }\
      ]\
    }\
  ]
}
```

### Message Reactions

```json
{
  "object": "instagram",
  "entry": [\
    {\
      "id": "IGID",  // ID for your Instagram Professional account\
      "time": 1569262486134,\
      "messaging": [\
        {\
          "sender": {\
            "id": "IGSID"  // Instagram-scoped ID for the customer who sent the message\
          },\
          "recipient": {\
            "id": "IGID"  // ID for your Instagram Professional account\
          },\
          "timestamp": 1569262485349,\
          "reaction" :{\
            "mid" : "MESSAGE-ID",\
            "action": "react",    // or unreact\
            "reaction": "love", // optional, to unreact if there is no reaction field\
            "emoji": "\u{2764}\u{FE0F}" // optional, to unreact if there is no emoji field\
          }\
        }\
      ]\
    }\
  ]
}
```

### Messaging Postbacks

```json
{
  "object": "instagram",
  "entry": [\
    {\
      "id": "IGSID",  // ID of your Instagram Professional account\
      "time": 1502905976963,\
      "messaging": [\
        {\
          "sender": { "id": "IGSID" },    // Instagram-scoped ID for the customer who sent the message\
          "recipient": { "id": "IGID" },  // ID of your Instagram Professional account\
          "timestamp": 1502905976377,\
          "postback": {\
            "mid":"MESSAGE-ID",           // ID for the message sent to your business\
            "title": "SELECTED-ICEBREAKER-REPLY-OR-CTA-BUTTON",\
            "payload": "CUSTOMER-RESPONSE-PAYLOAD",  // The payload with the option selected by the customer\
          }\
        }\
      ]\
    }\
  ]
}
```

### Messaging Referral

```json
{
  "object": "instagram",
  "entry": [\
    {\
      "id": "IGSID",  // ID of your Instagram Professional account\
      "time": 1502905976963,\
      "messaging": [\
        {\
          "sender": {\
            "id": "IGSID"  // Instagram-scoped ID for the customer who sent the message\
          },\
          "recipient": {\
            "id": "IGID"  // ID of your Instagram Professional account\
          },\
          "timestamp": 1502905976377,\
          "referral": {\
                 "ref": "INFORMATION-INCLUDED-IN-REF-PARAMETER-OF-IGME-LINK"\
                 "source": "IGME-SOURCE-LINK"\
                 "type":  "OPEN_THREAD"  // Only supported for existing conversations\
          }\
        }\
      ]\
    }\
  ]
}

```

### Messaging Seen

```json
{
   "object":"instagram",
   "entry":[\
      {\
         "id":"IGID",  // ID for your Instagram Professional account\
         "time":1569262486134,\
         "messaging":[\
            {\
               "sender":{\
                  "id":"IGSID"  // Instagram-scoped ID for the customer who sent the message\
               },\
               "recipient":{\
                  "id":"IGID"  // ID for your Instagram Professional account\
               },\
               "timestamp":1569262485349,\
               "read":{\
                  "mid":"MESSAGE-ID"\
               }\
            }\
         ]\
      }\
   ]
}
```

### Disappearing Media

```json
{
  "object": "instagram",
  "entry": [\
    {\
      "id": "IGID",  // ID of your Instagram Professional account\
      "time": 1569262486134,\
      "messaging": [\
        {\
          "sender": { "id": "IGSID" },    // Instagram-scoped ID for the customer who sent the message\
          "recipient": { "id": "IGID" },  // ID of your Instagram Professional account\
          "timestamp": 1569262485349,\
          "message": {\
            "mid": "MESSAGE-ID",   // ID of the message sent to your business\
            "attachments": [\
              {\
                "type":"ephemeral" // no URL is included for ephemeral media\
              }\
            ]\
          }\
        }\
      ]\
    }\
  ]
}
```

## See Also

- [Messenger Handover Protocol\\
![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwFjFZSN&_nc_oc=AdpRx5u5dgJj3QHoNv6r8wnGqFsNTTqBAoUtJY9FscFMlp2S3vCYUesayToT68pLjHA&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=7J5A_7Ypbay4v2edDG9LVQ&_nc_ss=7b289&oh=00_Af4a6fsEctd2Qpsxa4o-tJ56mo6Cep2VeptTtN_4WjebWw&oe=6A2479A2)](https://developers.facebook.com/docs/messenger-platform/handover-protocol/) – If you have more than one app handling messages, for example, one app handles automated responses and one app handles escalations to a human agent, then you will need to implement the Handover Protocol to pass the conversation from one app to another.

- [Click To Direct, CTD](https://www.facebook.com/business/help/198088077975174) – Visit the Business Helpcenter to learn more about creating ads that click to Instagram Direct.




### Developer Support

- Use the [Meta Status tool](https://l.facebook.com/l.php?u=https%3A%2F%2Fmetastatus.com%2F&h=AUBFOsnq0Qsr1m2saYmYVxfj1NGXqajKV0UStiklaQD16Cf2z5nZmA0yLoleCE2MpuQ9LGLOeVm11U3p7BlkOyIJNiQbvV-XT-bClJSlzm6W8Zwt92o9i6TKDuFCSc-zTDhNHlziP5hgiw) to check for the status and outages of Meta business products.
- Use the [Meta Developer Support tool](https://developers.facebook.com/support) to report bugs and view reported bugs, get help with Ads or Business Manager, and more.

On This Page

[Webhooks for Instagram Messaging](https://developers.facebook.com/docs/instagram-messaging/webhooks/#webhooks-for-instagram-messaging)

[Webhook Events](https://developers.facebook.com/docs/instagram-messaging/webhooks/#webhook-events)

[Example Notifications](https://developers.facebook.com/docs/instagram-messaging/webhooks/#example-notifications)

[Messages](https://developers.facebook.com/docs/instagram-messaging/webhooks/#messages)

[Message Reactions](https://developers.facebook.com/docs/instagram-messaging/webhooks/#message-reactions)

[Messaging Postbacks](https://developers.facebook.com/docs/instagram-messaging/webhooks/#messaging-postbacks)

[Messaging Referral](https://developers.facebook.com/docs/instagram-messaging/webhooks/#igme)

[Messaging Seen](https://developers.facebook.com/docs/instagram-messaging/webhooks/#messaging-seen)

[Disappearing Media](https://developers.facebook.com/docs/instagram-messaging/webhooks/#disappearing-media)

[See Also](https://developers.facebook.com/docs/instagram-messaging/webhooks/#see-also)

[Developer Support](https://developers.facebook.com/docs/instagram-messaging/webhooks/#developer-support)