---
url: https://developers.facebook.com/docs/instagram-messaging/generic-template
title: Generic Template - Instagram Messaging
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Finstagram-messaging%2Fgeneric-template%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Generic Template](https://developers.facebook.com/docs/instagram-messaging/generic-template#generic-template)

[Request URI](https://developers.facebook.com/docs/instagram-messaging/generic-template#request_uri)

[Example Request](https://developers.facebook.com/docs/instagram-messaging/generic-template#example_request)

[Example Response](https://developers.facebook.com/docs/instagram-messaging/generic-template#example_response)

[Properties](https://developers.facebook.com/docs/instagram-messaging/generic-template#properties)

[recipient](https://developers.facebook.com/docs/instagram-messaging/generic-template#recipient)

[message](https://developers.facebook.com/docs/instagram-messaging/generic-template#message)

[message.attachment](https://developers.facebook.com/docs/instagram-messaging/generic-template#attachment)

[message.attachment.payload](https://developers.facebook.com/docs/instagram-messaging/generic-template#payload)

[message.attachment.payload.elements](https://developers.facebook.com/docs/instagram-messaging/generic-template#elements)

[Learn more](https://developers.facebook.com/docs/instagram-messaging/generic-template#learn-more)

# Generic Template

![](https://scontent-lax7-1.xx.fbcdn.net/v/t39.2365-6/197000352_210164414260511_1056569475973147004_n.png?_nc_cat=101&ccb=1-7&_nc_sid=e280be&_nc_ohc=IP-imEFXSCcQ7kNvwEai4Nk&_nc_oc=AdoriTWhIPJEwWAPH86KNKpFrmeS27an6Xv2t5gtBTJh4flC8BNOWix6OWyNwQHOpV8&_nc_zt=14&_nc_ht=scontent-lax7-1.xx&_nc_gid=7JGvJ_k-Zd2AI9jDjQ7hsA&_nc_ss=7b289&oh=00_Af7MTqT40v3C6dze-YTfZqw_UHHv1NMcIpHy1TnYxy6arw&oe=6A2560EA)

The generic template allows you to send a structured message that includes an image, text and buttons. A generic template with multiple templates described in the [`elements`](https://developers.facebook.com/docs/instagram-messaging/generic-template#elements) array will send a horizontally scrollable carousel of items, each composed of an image, text and buttons.

### Limitations

This feature is currently not available in the web version.

## Request URI

```code
https://graph.facebook.com/v25.0/me/messages?access_token=<PAGE_ACCESS_TOKEN>
```

## Example Request

```sh
curl -X POST -H "Content-Type: application/json" -d '{
  "recipient":{
    "id":"<IGSID>"
  },
  "message":{
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements":[\
           {\
            "title":"Welcome!",\
            "image_url":"https://github.com/fbsamples/original-coast-clothing/blob/main/public/looks/male-work.jpg",\
            "subtitle":"We have the right hat for everyone.",\
            "default_action": {\
              "type": "web_url",\
              "url": "https://www.originalcoastclothing.com",\
            },\
            "buttons":[\
              {\
                "type":"web_url",\
                "url":"https://www.originalcoastclothing.com",\
                "title":"View Website"\
              },{\
                "type":"postback",\
                "title":"Start Chatting",\
                "payload":"DEVELOPER_DEFINED_PAYLOAD"\
              }\
            ]\
          }\
        ]
      }
    }
  }
}' "https://graph.facebook.com/v10.0/me/messages?access_token=<PAGE_ACCESS_TOKEN>"
```

## Example Response

```js
{
  "recipient_id": "1254477777772919",
  "message_id": "AG5Hz2Uq7tuwNEhXfYYKj8mJEM_QPpz5jdCK48PnKAjSdjfipqxqMvK8ma6AC8fplwlqLP_5cgXIbu7I3rBN0P"
}
```

## Properties

### `recipient`

Description of the message recipient. All requests must include one of the following properties to identify the recipient.

| Property | Type | Description |
| --- | --- | --- |
| `recipient.id` | String | IG Scoped User ID (IGSID) of the message recipient. |

### `message`

Description of the message to be sent.



| Property | Type | Description |
| --- | --- | --- |
| `message.attachment` | Object | An object describing attachments to the message. |

### `message.attachment`

| Property | Type | Description |
| --- | --- | --- |
| `type` | String | Value must be `template` |
| `payload` | Object | [`payload`](https://developers.facebook.com/docs/instagram-messaging/generic-template#payload) of the template. |

### `message.attachment.payload`

| Property | Type | Description |
| --- | --- | --- |
| `template_type` | String | Value must be `generic` |
| `elements` | Array< [`element`](https://developers.facebook.com/docs/instagram-messaging/generic-template#elements) > | An array of [`element`](https://developers.facebook.com/docs/instagram-messaging/generic-template#elements) objects that describe instances of the generic template to be sent. Specifying multiple elements will send a horizontally scrollable carousel of templates. A maximum of 10 elements is supported. |

### `message.attachment.payload.elements`

The generic template supports a maximum of 10 elements per message. At least one property must be set in addition to `title`.

| Property Name | Type | Description |
| --- | --- | --- |
| `title` | String | The title to display in the template. 80 character limit. |
| `subtitle` | String | **_Optional._** The subtitle to display in the template. 80 character limit. |
| `image_url` | String | **_Optional._** The URL of the image to display in the template. |
| `default_action` | Object | **_Optional._** The default action executed when the template is tapped. Accepts the same properties as [URL button](https://developers.facebook.com/docs/messenger-platform/send-api-reference/url-button), except `title`. |
| `buttons` | Array< [`button`](https://developers.facebook.com/docs/messenger-platform/reference/buttons) > | **_Optional._** An array of [buttons](https://developers.facebook.com/docs/messenger-platform/send-api-reference/buttons) to append to the template. A maximum of 3 buttons per element is supported. Only `postback` and `web_url` buttons are supported. |

## Learn more

Visit the [`message.attachment.data`](https://developers.facebook.com/docs/graph-api/reference/message) for GIFs and Stickers.

On This Page

[Generic Template](https://developers.facebook.com/docs/instagram-messaging/generic-template#generic-template)

[Request URI](https://developers.facebook.com/docs/instagram-messaging/generic-template#request_uri)

[Example Request](https://developers.facebook.com/docs/instagram-messaging/generic-template#example_request)

[Example Response](https://developers.facebook.com/docs/instagram-messaging/generic-template#example_response)

[Properties](https://developers.facebook.com/docs/instagram-messaging/generic-template#properties)

[recipient](https://developers.facebook.com/docs/instagram-messaging/generic-template#recipient)

[message](https://developers.facebook.com/docs/instagram-messaging/generic-template#message)

[message.attachment](https://developers.facebook.com/docs/instagram-messaging/generic-template#attachment)

[message.attachment.payload](https://developers.facebook.com/docs/instagram-messaging/generic-template#payload)

[message.attachment.payload.elements](https://developers.facebook.com/docs/instagram-messaging/generic-template#elements)

[Learn more](https://developers.facebook.com/docs/instagram-messaging/generic-template#learn-more)