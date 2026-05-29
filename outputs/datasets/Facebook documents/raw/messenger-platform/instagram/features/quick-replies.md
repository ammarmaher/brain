---
url: https://developers.facebook.com/docs/messenger-platform/instagram/features/quick-replies
title: Quick Replies - Instagram Messaging
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fmessenger-platform%2Finstagram%2Ffeatures%2Fquick-replies%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Quick Replies](https://developers.facebook.com/docs/messenger-platform/instagram/features/quick-replies#quick-replies)

[Sending Quick Replies](https://developers.facebook.com/docs/messenger-platform/instagram/features/quick-replies#sending-quick-replies)

[Webhook Event](https://developers.facebook.com/docs/messenger-platform/instagram/features/quick-replies#webhook-event)

[User Phone Number Quick Reply](https://developers.facebook.com/docs/messenger-platform/instagram/features/quick-replies#phone)

[Syntax](https://developers.facebook.com/docs/messenger-platform/instagram/features/quick-replies#syntax)

[Webhook Event](https://developers.facebook.com/docs/messenger-platform/instagram/features/quick-replies#webhook-event-2)

# Quick Replies

Quick replies provide a way to present a set of buttons in-conversation for users to reply with. A maximum of 13 quick replies are supported and each quick reply allows up to 20 characters before being truncated. Quick replies only support plain text.

![](https://scontent-lax7-1.xx.fbcdn.net/v/t39.2365-6/118773999_346285803169041_8806208626533285146_n.png?_nc_cat=105&ccb=1-7&_nc_sid=e280be&_nc_ohc=o9EJT-8h-sAQ7kNvwEC7in5&_nc_oc=Adqh6Z7gcGqvNl0-nSmmcAr1jZ5waf_pGBdgPO_5lfaXcA2zdX43WAwjrK_ViwEXGUw&_nc_zt=14&_nc_ht=scontent-lax7-1.xx&_nc_gid=KLOwjkrl9X0OmFXckmZXCw&_nc_ss=7b289&oh=00_Af40-poeADGLi3TOBEunP_C2OfSqU7L-l-2i7udtiRzsTA&oe=6A256D46)

When a quick reply is tapped, the buttons are dismissed, and the title of the tapped button is posted to the conversation as a message. A messages event will be sent to your webhook that contains the button title and an optional payload.

This feature is currently not available on desktop.

## Sending Quick Replies

```sh
curl -X POST -H "Content-Type: application/json" -d '{
  "recipient":{
    "id":"<IGSID>"
  },
  "messaging_type": "RESPONSE",
  "message":{
    "text": "<SOME_TEXT>",
    "quick_replies":[\
      {\
        "content_type":"text",\
        "title":"<TITLE_1>",\
        "payload":"<POSTBACK_PAYLOAD_1>"\
      },\
      {\
        "content_type":"text",\
        "title":"<TITLE_2>",\
        "payload":"<POSTBACK_PAYLOAD_2>"\
      }\
    ]
  }
}' "https://graph.facebook.com/<API_VERSON>/me/messages?access_token=<PAGE_ACCESS_TOKEN>"
```

## Webhook Event

When a quick reply is tapped, a text message will be sent to your message webhook.

The text property of the event will correspond to the title of the Quick Reply. The message object will also contain a field named quick\_reply containing the payload data on the Quick Reply.

```sh
{
  "object": "instagram",
  "entry": [\
    {\
      "id": "<IGID>",\
      "time": 1502905976963,\
      "messaging": [\
        {\
          "sender": {\
            "id": "<IGSID>"\
          },\
          "recipient": {\
            "id": "<IGID>"\
          },\
          "timestamp": 1502905976377,\
          "message": {\
            "quick_reply": {\
              "payload": "<PAYLOAD>"\
            },\
            "mid": "<MID>",\
            "text": "<SOME_TEXT>"\
          }\
        }\
      ]\
    }\
  ]
}
```

## User Phone Number Quick Reply

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=1032021221587875&version=1746074753)

The user phone number quick reply allows you to ask a user for their phone number. When the phone number quick reply is sent, the Instagram Direct Platform will automatically pre-fill the displayed quick reply with the phone number from the user's profile information.

If the user's profile does not have a phone number, the quick reply will not be shown.

The bot will not receive the phone number until the user clicks the quick reply.

Choosing the quick reply transmits the information once and does not constitute permission to access the information in the future.

### Syntax

```code
{
  "content_type":"user_phone_number"
}
```

### Webhook Event

When the user taps the quick reply, the email address will be passed in the `payload` attribute of the `messages` webhook event.

```regex
{
  "object": "page",
  "entry": [\
    {\
      "id": "<PAGE_ID>",\
      "time": 1502905976963,\
      "messaging": [\
        {\
          "sender": {\
            "id": "<IGSID>"\
          },\
          "recipient": {\
            "id": "<IGID>"\
          },\
          "timestamp": 1502905976377,\
          "message": {\
            "quick_reply": {\
              "payload": "<PHONE_NUMBER>"\
            },\
            "mid": "<MESSAGE_ID>",\
            "text": "<PHONE_NUMBER>"\
          }\
        }\
      ]\
    }\
  ]
}
```

### Developer Support

- Use the [Meta Status tool](https://l.facebook.com/l.php?u=https%3A%2F%2Fmetastatus.com%2F&h=AUAEJeXTcSy5-EBwNH38vGx4t_AH0Zy-iR6r6sdu5uQ27u5s2NcHfWBq8bmSIZOXhH-81E4FEOB-YabNtC7vA_mbtCL-u8Qw5p1VF971oDXUf8OivnPvmCbJ035ZhO8SKgiDpcrzROpMVw) to check for the status and outages of Meta business products.
- Use the [Meta Developer Support tool](https://developers.facebook.com/support) to report bugs and view reported bugs, get help with Ads or Business Manager, and more.

On This Page

[Quick Replies](https://developers.facebook.com/docs/messenger-platform/instagram/features/quick-replies#quick-replies)

[Sending Quick Replies](https://developers.facebook.com/docs/messenger-platform/instagram/features/quick-replies#sending-quick-replies)

[Webhook Event](https://developers.facebook.com/docs/messenger-platform/instagram/features/quick-replies#webhook-event)

[User Phone Number Quick Reply](https://developers.facebook.com/docs/messenger-platform/instagram/features/quick-replies#phone)

[Syntax](https://developers.facebook.com/docs/messenger-platform/instagram/features/quick-replies#syntax)

[Webhook Event](https://developers.facebook.com/docs/messenger-platform/instagram/features/quick-replies#webhook-event-2)