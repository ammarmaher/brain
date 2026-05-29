---
url: https://developers.facebook.com/docs/instagram-messaging/button-template
title: Button Template - Instagram Messaging
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Finstagram-messaging%2Fbutton-template%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Button Template](https://developers.facebook.com/docs/instagram-messaging/button-template#button-template)

[Template Payload](https://developers.facebook.com/docs/instagram-messaging/button-template#payload)

[Available Buttons](https://developers.facebook.com/docs/instagram-messaging/button-template#buttons)

[URL Button](https://developers.facebook.com/docs/instagram-messaging/button-template#url)

[Postback Button](https://developers.facebook.com/docs/instagram-messaging/button-template#postback)

[Example Request](https://developers.facebook.com/docs/instagram-messaging/button-template#example_request)

[Example Response](https://developers.facebook.com/docs/instagram-messaging/button-template#example_response)

[Properties](https://developers.facebook.com/docs/instagram-messaging/button-template#properties)

[recipient](https://developers.facebook.com/docs/instagram-messaging/button-template#recipient)

[message](https://developers.facebook.com/docs/instagram-messaging/button-template#message)

[message.attachment](https://developers.facebook.com/docs/instagram-messaging/button-template#message-attachment)

[message.attachment.payload](https://developers.facebook.com/docs/instagram-messaging/button-template#message-attachment-payload)

# Button Template

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=1399365880644108&version=1723024306)

The button template sends a text message with up to three attached buttons. This template is useful for offering the message recipient options to choose from, such as predetermined responses to a question, or actions to take.

### Limitations

This feature is currently not available in the web version.

## Template Payload

For a complete list of template properties, refer to the Properties section below.

```regex
"payload": {
  "template_type":"button",
  "text":"<MESSAGE_TEXT>",
  "buttons":[\
    <BUTTON_OBJECT>,\
    <BUTTON_OBJECT>,\
    ...\
  ]
}
```

## Available Buttons

### URL Button

The URL Button opens a web page in the in-app browser. This allows you to enrich the conversation with a web-based experience, where you have the full development flexibility of the web. For example, you might display a product summary in-conversation, then use the URL button to open the full product page on your website.

#### Button Format

```regex
{
  "type": "web_url",
  "url": "<URL_TO_OPEN_IN_WEBVIEW>",
  "title": "<BUTTON_TEXT>",
}
```

### Postback Button

The postback button sends a [`messaging_postbacks`](https://developers.facebook.com/docs/messenger-platform/reference/webhook-events/messaging_postbacks) event to your webhook with the string set in the `payload` property. This allows you to take arbitrary actions when the button is tapped. For example, you might display a list of products, then send the product ID in the postback to your webhook, where it can be used to query your database and return the product details as a structured message.

#### Button Format

For a complete list of button properties, see the [postback button reference](https://developers.facebook.com/docs/messenger-platform/reference/buttons/postback).

```regex
{
  "type": "postback",
  "title": "<BUTTON_TEXT>",
  "payload": "<STRING_SENT_TO_WEBHOOK>"
}
```

## Example Request

For complete request details and properties, refer to the Properties section below.

```sh
curl -X POST -H "Content-Type: application/json" -d '{
  "recipient":{
    "id":"<IGID>"
  },
  "message":{
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"button",
        "text":"What do you want to do next?",
        "buttons":[\
          {\
            "type":"web_url",\
            "url":"https://www.messenger.com",\
            "title":"Visit Messenger"\
          },\
          {\
            ...\
          },\
          {...}\
        ]
      }
    }
  }
}' "https://graph.facebook.com/v13.0/me/messages?access_token=<PAGE_ACCESS_TOKEN>"
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
| `type` | String | Value must be `template`. |
| `payload` | Object | `payload` of the template. |

### `message.attachment.payload`

| Property | Type | Description |
| --- | --- | --- |
| `template_type` | String | Value must be `button`. |
| `text` | String | UTF-8-encoded text of up to 640 characters. Text will appear above the buttons. |
| `buttons` | Array<button> | Set of 1-3 buttons that appear as call-to-actions. |

On This Page

[Button Template](https://developers.facebook.com/docs/instagram-messaging/button-template#button-template)

[Template Payload](https://developers.facebook.com/docs/instagram-messaging/button-template#payload)

[Available Buttons](https://developers.facebook.com/docs/instagram-messaging/button-template#buttons)

[URL Button](https://developers.facebook.com/docs/instagram-messaging/button-template#url)

[Postback Button](https://developers.facebook.com/docs/instagram-messaging/button-template#postback)

[Example Request](https://developers.facebook.com/docs/instagram-messaging/button-template#example_request)

[Example Response](https://developers.facebook.com/docs/instagram-messaging/button-template#example_response)

[Properties](https://developers.facebook.com/docs/instagram-messaging/button-template#properties)

[recipient](https://developers.facebook.com/docs/instagram-messaging/button-template#recipient)

[message](https://developers.facebook.com/docs/instagram-messaging/button-template#message)

[message.attachment](https://developers.facebook.com/docs/instagram-messaging/button-template#message-attachment)

[message.attachment.payload](https://developers.facebook.com/docs/instagram-messaging/button-template#message-attachment-payload)