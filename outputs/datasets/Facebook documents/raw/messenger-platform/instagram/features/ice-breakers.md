---
url: https://developers.facebook.com/docs/messenger-platform/instagram/features/ice-breakers
title: Ice Breakers - Instagram Messaging
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fmessenger-platform%2Finstagram%2Ffeatures%2Fice-breakers%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Ice Breakers](https://developers.facebook.com/docs/messenger-platform/instagram/features/ice-breakers#ice-breakers)

[Setting Ice Breakers](https://developers.facebook.com/docs/messenger-platform/instagram/features/ice-breakers#setting-ice-breakers)

[Getting Ice Breakers](https://developers.facebook.com/docs/messenger-platform/instagram/features/ice-breakers#getting-ice-breakers)

[Deleting Icebreakers](https://developers.facebook.com/docs/messenger-platform/instagram/features/ice-breakers#deleting-icebreakers)

[Webhook Event](https://developers.facebook.com/docs/messenger-platform/instagram/features/ice-breakers#webhook-event)

[Developer Support](https://developers.facebook.com/docs/messenger-platform/instagram/features/ice-breakers#developer-support)

# Ice Breakers

Ice Breakers provide a way for users to start a conversation with a business with a list of frequently asked questions. A maximum of 4 questions can be set via the Ice Breaker API.

![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/118818823_700834857168298_1003772079812652258_n.png?_nc_cat=110&ccb=1-7&_nc_sid=e280be&_nc_ohc=UVrowVPcty4Q7kNvwF22ODq&_nc_oc=AdodvPiXBUqSLtcIJmThfCevW9OKRab-BGHHIw83uLsOYi5NM3BHji5X3o5Mkw5V5xo&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=K9qLNrCBbsZ4vli95GJ_sg&_nc_ss=7b289&oh=00_Af6s8tXjiieAtJrpipB-zfe45_Hb2HvakaVwIBETpz8M8g&oe=6A2573DE)

### Limitations

This feature is currently not available on desktop.

## Setting Ice Breakers

```sh
curl -X POST -H "Content-Type: application/json" -d '{
     "platform": "instagram",
     "ice_breakers":[\
       {\
          "call_to_actions":[\
             {\
                "question":"<QUESTION>",\
                "payload":"<PAYLOAD>"\
             },\
             {\
                "question":"<QUESTION>",\
                "payload":"<PAYLOAD>"\
             }\
          ],\
          "locale":"default" // default locale is REQUIRED\
       },\
       {\
          "call_to_actions":[\
             {\
                "question":"<QUESTION>",\
                "payload":"<PAYLOAD>"\
             },\
             {\
                "question":"<QUESTION>",\
                "payload":"<PAYLOAD>"\
             }\
          ],\
          "locale":"en_GB"\
       }\
    ]
}' "https://graph.facebook.com/v11.0/me/messenger_profile?platform=instagram&access_token=<PAGE_ACCESS_TOKEN>"
```

## Getting Ice Breakers

```sh
curl -X GET "https://graph.facebook.com/v11.0/me/messenger_profile?fields=ice_breakers&platform=instagram&access_token=<PAGE_ACCESS_TOKEN>"
```

```sh
{
   "data": [\
        {\
          "call_to_actions" : [\
               {\
                "question": "<QUESTION>",\
                "payload": "<PAYLOAD>",\
\
               },\
               {\
                "question": "<QUESTION>",\
                "payload": "<PAYLOAD>",\
\
               },\
          ],\
          "locale": "<LOCALE>",\
      },\
      {\
          "call_to_actions" : [\
               {\
                "question": "<QUESTION>",\
                "payload": "<PAYLOAD>",\
\
               },\
               {\
                "question": "<QUESTION>",\
                "payload": "<PAYLOAD>",\
\
               },\
          ],\
          "locale": "<LOCALE>",\
      }\
   ]
}
```

## Deleting Icebreakers

```sh
curl -X DELETE -H "Content-Type: application/json" -d '{
  "fields": [\
    "ice_breakers",\
  ]
}' "https://graph.facebook.com/v11.0/me/messenger_profile?platform=instagram&access_token=%lt;PAGE_ACCESS_TOKEN>"
```

## Webhook Event

In order to receive postback webhooks from Icebreakers, the app needs to be subscribed to `messaging_postbacks` webhook under Instagram topic on the app settings.

The webhook will receive a json payload similar to the example below.

```code
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
          "postback": {\
            "title": "<SELECTED_ICEBREAKER_QUESTION>",\
            "payload": "<USER_DEFINED_PAYLOAD>",\
          }\
        }\
      ]\
    }\
  ]
}


```

### Developer Support

- Use the [Meta Status tool](https://l.facebook.com/l.php?u=https%3A%2F%2Fmetastatus.com%2F&h=AUDeCo0NycbP7OHpjNT_gEcS8irFEAr7aay5hoawY8uLrP58S6USOqBrst2H0QiecZdPvFmcdubXc05lt8XjurPv1Zpg3CFOsosvckcx63RnQCemnjiijoyaG8v-vQjR6_gDH0g0tdwrVgk7C6wqWMneqVo) to check for the status and outages of Meta business products.
- Use the [Meta Developer Support tool](https://developers.facebook.com/support) to report bugs and view reported bugs, get help with Ads or Business Manager, and more.

On This Page

[Ice Breakers](https://developers.facebook.com/docs/messenger-platform/instagram/features/ice-breakers#ice-breakers)

[Setting Ice Breakers](https://developers.facebook.com/docs/messenger-platform/instagram/features/ice-breakers#setting-ice-breakers)

[Getting Ice Breakers](https://developers.facebook.com/docs/messenger-platform/instagram/features/ice-breakers#getting-ice-breakers)

[Deleting Icebreakers](https://developers.facebook.com/docs/messenger-platform/instagram/features/ice-breakers#deleting-icebreakers)

[Webhook Event](https://developers.facebook.com/docs/messenger-platform/instagram/features/ice-breakers#webhook-event)

[Developer Support](https://developers.facebook.com/docs/messenger-platform/instagram/features/ice-breakers#developer-support)