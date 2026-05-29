---
url: https://developers.facebook.com/docs/messenger-platform/instagram/features/ig-me-links
title: ig.me links - Instagram Messaging
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fmessenger-platform%2Finstagram%2Ffeatures%2Fig-me-links%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Using ig.me Links](https://developers.facebook.com/docs/messenger-platform/instagram/features/ig-me-links#using-ig-me-links)

[Link Format](https://developers.facebook.com/docs/messenger-platform/instagram/features/ig-me-links#format)

[Referral Parameters](https://developers.facebook.com/docs/messenger-platform/instagram/features/ig-me-links#refparams)

[Requirements](https://developers.facebook.com/docs/messenger-platform/instagram/features/ig-me-links#ref_requirements)

[Reading the passed parameter](https://developers.facebook.com/docs/messenger-platform/instagram/features/ig-me-links#reading-the-passed-parameter)

[Examples](https://developers.facebook.com/docs/messenger-platform/instagram/features/ig-me-links#examples)

[User Experience](https://developers.facebook.com/docs/messenger-platform/instagram/features/ig-me-links#userexperience)

[Limitations](https://developers.facebook.com/docs/messenger-platform/instagram/features/ig-me-links#limitations)

# Using ig.me Links

`ig.me` is a shortened URL service operated by Meta that redirects users to a conversation in Instagram. You can use them on your website, email newsletters and more.

When a user leverages an ig.me link to start or continue a conversation with your Instagram account, the user is redirected to a new or existing thread, based on whether the user had previously messaged your Instagram account.

### Contents

- [Link Format](https://developers.facebook.com/docs/messenger-platform/instagram/features/ig-me-links#format)
- [Referral Parameters](https://developers.facebook.com/docs/messenger-platform/instagram/features/ig-me-links#refparams)
- [Examples](https://developers.facebook.com/docs/messenger-platform/instagram/features/ig-me-links#examples)
- [User Experience](https://developers.facebook.com/docs/messenger-platform/instagram/features/ig-me-links#userexperience)
- [Limitations](https://developers.facebook.com/docs/messenger-platform/instagram/features/ig-me-links#limitations)

## Link Format

The format of the link is as follows:

```regex
https://ig.me/m/<USERNAME>
```

`USERNAME` is the Instagram handle of the Instagram account.

## Referral Parameters

You can pass a referral parameter using these links.

Referral parameters can serve the following purposes:

- Track different links in different channels
- Tie an Instagram user to a session or account in an external app
- Direct the user to specific content or features available within your Instagram account

This is a ig.me link with an added parameter:

```regex
https://ig.me/m/<USERNAME>?ref=<REF_PARAM>
```

`REF_PARAM` is passed to the server via a webhook.

### Requirements

To properly use ig.me links, you must meet the following requirements:

- Your Instagram experience must have [Icebreakers](https://developers.facebook.com/docs/messenger-platform/instagram/features/ice-breakers) set to receive the referral parameter for new conversations
- The referral parameter must be a string up to 2,083 characters in length
- The Instagram account that the app is connected to must be published to receive the referral parameter for all users, except those that have the developer, tester, or admin role for your bot
- You are using iOS and Android versions 235 and above

### Reading the passed parameter

The referral portion always follows this format:

```regex
"referral": {
     "ref": "ref_data_in_ig_dot_me_param"
     "source": "SHORTLINKS"
     "type":  "OPEN_THREAD"
}
```

| Field Value | Description |
| --- | --- |
| `ref` | The arbitrary data that was originally passed in the `ref` param added to the ig.me link. Only alphanumeric characters, and -, \_, = are supported |
| `source` | The source of this referral. For ig.me links, the value of source is `“SHORTLINK”` |
| `type` | The identifier for the referral. For a referral from ig.me links, it is always `"OPEN_THREAD"` |

When an ig.me link with a `ref` parameter opens the Instagram app, there are three possible scenarios:

#### 1\. New Thread + Icebreaker

If you have configured Icebreakers for your Instagram Account and the user taps on an Icebreaker, your app receives the `messaging_postback` webhook event which includes the passed referral parameter.

The `messaging_postback` webhook event follows this format:

```regex
{
  "object": "instagram",
  "entry": [\
    {\
      "id": "<IGSID>",\
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
            "mid":"<MESSAGE_ID>",\
            "title": "<SELECTED_ICEBREAKER_QUESTION>",\
            "payload": "<USER_DEFINED_PAYLOAD>,\
            "referral": {\
                   "ref": "ref_data_in_ig_dot_me_param"\
                   "source": "SHORTLINKS"\
                   "type":  "OPEN_THREAD"\
             }\
          }\
        }\
      ]\
    }\
  ]
}
```

`USER_DEFINED_PAYLOAD` refers to the payload you previously configured to be sent in the postback.

#### 2\. New Thread + Message Send

If you have configured Icebreakers for your Instagram Account and the user doesn't tap on an Icebreaker, and chooses to send a message via the composer, your app receives the `messages` webhook event which includes the passed referral parameter.

The `messages` webhook event follows this format:

```regex
{
  "object": "instagram",
  "entry": [\
    {\
      "id": "<IGSID>",\
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
              "mid":"<MESSAGE_ID>",\
              "referral": {\
                   "ref": "ref_data_in_ig_dot_me_param"\
                   "source": "SHORTLINKS"\
                   "type":  "OPEN_THREAD"\
              }\
           }\
        }\
      ]\
    }\
  ]
}
```

#### 3\. Existing Thread

If the user has an existing thread with your Instagram Business, when the user follows your ig.me link, Instagram just opens that respective thread. To be notified of the referral, your webhook must be subscribed to the `messaging_referral` event.

This action resets the [24-hour window for standard messaging](https://developers.facebook.com/docs/messenger-platform/policy/policy-overview/#standard_messaging), allowing the app to reply after getting the webhook event with the `ref` parameter.

The `messaging_referral` webhook event follows this format:

```regex
{
  "object": "instagram",
  "entry": [\
    {\
      "id": "<IGSID>",\
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
          "referral": {\
                 "ref": "ref_data_in_ig_dot_me_param"\
                 "source": "SHORTLINKS"\
                 "type":  "OPEN_THREAD"\
          }\
        }\
      ]\
    }\
  ]
}
```

## Examples

Here are some ways you can use ig.me links:

1. Use ig.me links + QR code on product packaging to allow people to reach out to you for support or get a coupon towards the next purchase.
2. Use ig.me + QR code on out of home advertising such as billboards, TV ads, physical stores to sign up for loyalty/membership accounts.
3. Use ig.me links on the Contact Us page on a website to allow people to contact you via messaging instead of relying on calling.
4. Provide callers an option to message you on Instagram by sending a ig.me link with [referral param](https://developers.facebook.com/docs/messenger-platform/instagram/features/ig-me-links#refparams) via SMS.

## User Experience

| New Threads | Existing Threads |
| --- | --- |
| We disclose the following text to the user:<br>You opened this conversation from a link. `<Ig Business Handle>` will see that you used their link once you send a message.<br>![](https://lookaside.fbsbx.com/elementpath/media/?media_id=419841633320050&version=1773624776) | We disclose the following text to the user:<br>You opened this conversation from a link. `<Ig Business Handle>` can see that you used their link. If you wish to stop receiving messages from them, you can turn off messages.<br>![](https://lookaside.fbsbx.com/elementpath/media/?media_id=1172335656891384&version=1773624776) |

## Limitations

ig.me links are currently not supported on Instagram Web.

On This Page

[Using ig.me Links](https://developers.facebook.com/docs/messenger-platform/instagram/features/ig-me-links#using-ig-me-links)

[Link Format](https://developers.facebook.com/docs/messenger-platform/instagram/features/ig-me-links#format)

[Referral Parameters](https://developers.facebook.com/docs/messenger-platform/instagram/features/ig-me-links#refparams)

[Requirements](https://developers.facebook.com/docs/messenger-platform/instagram/features/ig-me-links#ref_requirements)

[Reading the passed parameter](https://developers.facebook.com/docs/messenger-platform/instagram/features/ig-me-links#reading-the-passed-parameter)

[Examples](https://developers.facebook.com/docs/messenger-platform/instagram/features/ig-me-links#examples)

[User Experience](https://developers.facebook.com/docs/messenger-platform/instagram/features/ig-me-links#userexperience)

[Limitations](https://developers.facebook.com/docs/messenger-platform/instagram/features/ig-me-links#limitations)